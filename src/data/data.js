import image1 from '../assets/section1.jpg';
import image2 from '../assets/section2.jpg';
import image3 from '../assets/section3.jpg';
import image4 from '../assets/section4.jpg';
import image5 from '../assets/section5.jpg';
import image6 from '../assets/section6.jpg';
import image7 from '../assets/section7.jpg';
import image8 from '../assets/section8.jpg';
import image9 from '../assets/section9.jpg';

export const categories = [
  { key: "realEstate", image: image1 },
  { key: "vehicles", image: image2 },
  { key: "petServices", image: image3 },
  { key: "furniture", image: image4 },
  { key: "electronics", image: image5 },
  { key: "clothing", image: image6 },
  { key: "furnishings", image: image7 },
  { key: "appliances", image: image8 },
  { key: "services", image: image9 },
];

export const featuredProducts = [
  {
    id: 1,
    categoryKey: "realEstate",
    titleKey: "featuredProducts.1.title",
    descKey: "featuredProducts.1.description",
    price: "$120,000",
    whatsapp: "+1234567890",
    phone: "+0987654321",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ053AZLM4Q9B0xJ5CfxaMKSKt-OK9JWZXnlCGgDNxOjrutAlDfky5ykgPcK5NiP45lKykwBoagMlvNPp2yAKLPvHfobCfBZRSBpKhkyQ",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ053AZLM4Q9B0xJ5CfxaMKSKt-OK9JWZXnlCGgDNxOjrutAlDfky5ykgPcK5NiP45lKykwBoagMlvNPp2yAKLPvHfobCfBZRSBpKhkyQ",
      "/assets/house1-2.jpg",
      "/assets/house1-3.jpg"
    ]
  },
  {
    id: 2,
    categoryKey: "vehicles",
    titleKey: "featuredProducts.2.title",
    descKey: "featuredProducts.2.description",
    price: "$8,500",
    whatsapp: "+1234567890",
    phone: "+0987654321",
    image: "https://www.kia.com/content/dam/kwcms/kme/global/en/assets/vehicles/ev6/ev6-pe-my25/digital-discover/kia-ev6-pe-gtl-34front.png",
    images: [
      "/assets/car1-1.jpg",
      "/assets/car1-2.jpg"
    ]
  }
  // add more products as needed
];

