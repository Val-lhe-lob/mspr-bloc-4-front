import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroSection from "../../components/homeComponents/HeroSection";
import CatalogueSection from "../../components/homeComponents/CatalogueSection";
import AvisSection from "../../components/homeComponents/avisSection";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToCatalogue) {
      const el = document.getElementById("catalogueSection");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 300); // petit délai pour attendre le rendu
      }
    }
  }, [location]);

  return (
    <div className="bg-[#121212] text-white">
      <HeroSection />
      <AvisSection />
      <div id="catalogueSection">
        <CatalogueSection />
      </div>
    </div>
  );
};

export default Home;
