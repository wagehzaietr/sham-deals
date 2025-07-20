import { supabase } from '../config/supabase';

// Add a new post
export const addPost = async (postData, imageFiles = []) => {
  try {
    let imageUrls = [];
    
    // Upload multiple images if provided
    if (imageFiles && imageFiles.length > 0) {
      for (const imageFile of imageFiles) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `posts/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('posts')
          .upload(filePath, imageFile);

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('posts')
          .getPublicUrl(filePath);
        
        imageUrls.push(publicUrl);
      }
    }

    // Get current user from Supabase Auth
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Prepare data with proper field names for Supabase
    const postToInsert = {
      title: postData.title,
      description: postData.description,
      title_ar: postData.titleAr || null,
      description_ar: postData.descriptionAr || null,
      category: postData.category,
      image_url: imageUrls[0] || null, // Primary image
      image_urls: imageUrls.length > 0 ? JSON.stringify(imageUrls) : null, // All images as JSON
      whatsapp: postData.whatsapp,
      phone: postData.phone,
      user_id: user.id, // Use Supabase Auth user ID
      user_email: user.email,
      user_name: user.user_metadata?.full_name || user.email.split('@')[0],
      user_avatar: user.user_metadata?.avatar_url || null,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('posts')
      .insert([postToInsert])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return { id: data.id, success: true };
  } catch (error) {
    console.error('Error adding post:', error);
    throw error;
  }
};

// Get all posts
export const getPosts = async (limitCount = 20) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(limitCount);

    if (error) throw error;

    // Transform data to match Firebase format
    return data.map(post => ({
      id: post.id,
      ...post,
      imageUrl: post.image_url,
      imageUrls: post.image_urls ? JSON.parse(post.image_urls) : (post.image_url ? [post.image_url] : []),
      createdAt: { toDate: () => new Date(post.created_at) }
    }));
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  }
};

// Search posts with multilingual support
export const searchPosts = async (searchTerm, category = null) => {
  try {
    let query = supabase
      .from('posts')
      .select('*')
      .eq('status', 'active');

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Client-side filtering for multilingual search
    const filteredPosts = data.filter(post => {
      const searchLower = searchTerm.toLowerCase();
      return (
        post.title?.toLowerCase().includes(searchLower) ||
        post.description?.toLowerCase().includes(searchLower) ||
        post.title_ar?.toLowerCase().includes(searchLower) ||
        post.description_ar?.toLowerCase().includes(searchLower) ||
        post.category?.toLowerCase().includes(searchLower)
      );
    });

    // Transform data to match Firebase format
    return filteredPosts.map(post => ({
      id: post.id,
      ...post,
      imageUrl: post.image_url,
      imageUrls: post.image_urls ? JSON.parse(post.image_urls) : (post.image_url ? [post.image_url] : []),
      titleAr: post.title_ar,
      descriptionAr: post.description_ar,
      createdAt: { toDate: () => new Date(post.created_at) }
    }));
  } catch (error) {
    console.error('Error searching posts:', error);
    throw error;
  }
};

// Get posts by category
export const getPostsByCategory = async (category) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('category', category)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform data to match Firebase format
    return data.map(post => ({
      id: post.id,
      ...post,
      imageUrl: post.image_url,
      imageUrls: post.image_urls ? JSON.parse(post.image_urls) : (post.image_url ? [post.image_url] : []),
      titleAr: post.title_ar,
      descriptionAr: post.description_ar,
      createdAt: { toDate: () => new Date(post.created_at) }
    }));
  } catch (error) {
    console.error('Error getting posts by category:', error);
    throw error;
  }
};

// Get single post by ID
export const getPostById = async (postId) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Post not found');
      }
      throw error;
    }

    // Transform data to match Firebase format
    return {
      id: data.id,
      ...data,
      imageUrl: data.image_url,
      imageUrls: data.image_urls ? JSON.parse(data.image_urls) : (data.image_url ? [data.image_url] : []),
      titleAr: data.title_ar,
      descriptionAr: data.description_ar,
      createdAt: { toDate: () => new Date(data.created_at) }
    };
  } catch (error) {
    console.error('Error getting post:', error);
    throw error;
  }
};

// Get posts by user
export const getPostsByUser = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform data to match Firebase format
    return data.map(post => ({
      id: post.id,
      ...post,
      imageUrl: post.image_url,
      imageUrls: post.image_urls ? JSON.parse(post.image_urls) : (post.image_url ? [post.image_url] : []),
      titleAr: post.title_ar,
      descriptionAr: post.description_ar,
      createdAt: { toDate: () => new Date(post.created_at) }
    }));
  } catch (error) {
    console.error('Error getting user posts:', error);
    throw error;
  }
};

// Update a post
export const updatePost = async (postId, postData, imageFile = null) => {
  try {
    let imageUrl = null;
    
    // Upload new image if provided
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('posts')
        .upload(filePath, imageFile);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('posts')
        .getPublicUrl(filePath);
      
      imageUrl = publicUrl;
    }

    // Get current user from Supabase Auth
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Prepare update data
    const updateData = {
      title: postData.title,
      description: postData.description,
      title_ar: postData.titleAr || null,
      description_ar: postData.descriptionAr || null,
      category: postData.category,
      whatsapp: postData.whatsapp,
      phone: postData.phone,
      updated_at: new Date().toISOString()
    };

    // Only update image if new one was uploaded
    if (imageUrl) {
      updateData.image_url = imageUrl;
    }

    const { data, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', postId)
      .eq('user_id', user.id) // Ensure user can only update their own posts
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return { id: data.id, success: true };
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// Delete a post
export const deletePost = async (postId) => {
  try {
    // Get current user from Supabase Auth
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // First get the post to check ownership and get image URL for cleanup
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('image_url, user_id')
      .eq('id', postId)
      .single();

    if (fetchError) throw fetchError;

    // Check if user owns the post
    if (post.user_id !== user.id) {
      throw new Error('Unauthorized: You can only delete your own posts');
    }

    // Delete the post
    const { error: deleteError } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', user.id); // Double check ownership

    if (deleteError) throw deleteError;

    // Optionally delete the image from storage
    if (post.image_url) {
      try {
        const imagePath = post.image_url.split('/').pop();
        await supabase.storage
          .from('posts')
          .remove([`posts/${imagePath}`]);
      } catch (storageError) {
        console.warn('Could not delete image from storage:', storageError);
        // Don't throw error for storage cleanup failure
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// Upload profile picture
export const uploadProfilePicture = async (imageFile) => {
  try {
    // Get current user from Supabase Auth
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Create unique filename
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${user.id}_${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('posts') // Using the same bucket as posts
      .upload(filePath, imageFile, {
        cacheControl: '3600',
        upsert: true // Replace if exists
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('posts')
      .getPublicUrl(filePath);

    // Update user metadata with new avatar URL
    const { data: updateData, error: updateError } = await supabase.auth.updateUser({
      data: {
        avatar_url: publicUrl,
        full_name: user.user_metadata?.full_name || null
      }
    });

    if (updateError) {
      throw updateError;
    }

    return { 
      success: true, 
      avatarUrl: publicUrl,
      user: updateData.user 
    };
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    // Get current user from Supabase Auth
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Prepare update data - only update metadata, not auth phone field
    const updateData = {
      full_name: profileData.fullName,
      avatar_url: user.user_metadata?.avatar_url || null
    };

    // Add phone number to metadata if provided
    if (profileData.phoneNumber) {
      updateData.phone_number = profileData.phoneNumber;
    }

    // Update user metadata only (don't update auth phone field)
    const { data, error } = await supabase.auth.updateUser({
      data: updateData
    });

    if (error) {
      throw error;
    }

    return { success: true, user: data.user };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};