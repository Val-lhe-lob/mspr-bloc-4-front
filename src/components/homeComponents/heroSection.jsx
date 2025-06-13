// src/components/homeComponents/HeroSection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";
import logo from "../../assets/logo.png";
import homeCafeImage from "../../assets/homecafe.png";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleScrollToCatalogue = () => {
    navigate("/", { state: { scrollToCatalogue: true } });
  };

  return (
    <section className="flex flex-col lg:flex-row items-center justify-between gap-10 bg-gradient-to-br from-zinc-900 via-neutral-900 to-black pt-0 pb-4 px-4 sm:px-6 md:px-12 shadow-inner border-t border-neutral-800 overflow-hidden min-h-[90vh]">
      {/* LOGO */}
      <div className="w-full lg:w-auto flex justify-center lg:block">
        <img src={logo} alt="Logo PayeTonKahwa" className="w-48 sm:w-56 md:w-60 h-auto" />
      </div>

      {/* TEXTE */}
      <div className="flex-1 space-y-6 text-center lg:text-left w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-yellow-500 drop-shadow-lg">
          Bienvenue chez PayeTonKahwa
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-gray-300">
          Le goût du café de luxe, livré chez vous ou dans votre établissement. <br className="hidden md:inline" />
          Découvrez nos variétés haut de gamme venues du monde entier.
        </p>

        <div className="flex justify-center lg:justify-start">
          <button
            onClick={handleScrollToCatalogue}
            className="px-8 sm:px-10 py-3 sm:py-4 bg-yellow-500 text-black rounded-full font-bold text-lg sm:text-xl shadow-lg hover:bg-yellow-400 hover:shadow-yellow-300/40 transition duration-300 flex items-center space-x-3"
          >
            <FaShoppingBag size={22} />
            <span>Voir notre catalogue</span>
          </button>
        </div>

        <div className="text-sm text-gray-400 hidden md:block">
          Livraison haut de gamme | Production artisanale | Saveur 100% pure origine
        </div>
      </div>

      {/* IMAGE CAFÉ */}
      <div className="w-full lg:w-[50%]">
        <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
          <img
            src={homeCafeImage}
            alt="Illustration du café PayeTonKahwa"
            className="absolute top-0 left-0 w-full h-full object-cover shadow-lg"
          />
        </div>
        <div className="h-1 bg-yellow-500 w-full mt-4" />
      </div>
    </section>
  );
};

export default HeroSection;
