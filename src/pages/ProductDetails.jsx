import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { featuredProducts } from "../data/data";
import { FaWhatsapp, FaPhone } from "react-icons/fa";

// Import Swiper React components and styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ProductDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const product = featuredProducts.find((p) => p.id === Number(id));
  if (!product) return <p>{t("product.notFound", "Product not found")}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Swiper Image Gallery */}
      <Swiper
        modules={[Navigation, Pagination]}
        
        pagination={{ clickable: true }}
        spaceBetween={20}
        slidesPerView={1}
        className="mb-6 rounded-lg"
      >
        {product.images.map((img, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={img}
              alt={`${t(product.titleKey)} - ${idx + 1}`}
              className="w-full h-64 object-cover rounded-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <h1 className="text-3xl font-bold mb-4">{t(product.titleKey)}</h1>
      <p className="mb-4">{t(product.descKey)}</p>
      <p className="text-xl font-semibold mb-6">{product.price}</p>

      <div className="flex space-x-6">
        <a
          href={`https://wa.me/${product.whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-green-600 hover:underline"
        >
          <FaWhatsapp />
          <span>{t("contacts.whatsapp")}</span>
        </a>
        <a
          href={`tel:${product.phone}`}
          className="flex items-center space-x-2 text-blue-600 hover:underline"
        >
          <FaPhone />
          <span>{t("contacts.phone")}</span>
        </a>
      </div>
    </div>
  );
};

export default ProductDetails;
