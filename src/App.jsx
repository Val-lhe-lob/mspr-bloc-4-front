import React, { useRef } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartFloating from "./components/CartFloating";
import Home from "./pages/clients/Home";
import PanierPage from "./pages/clients/PanierPage";
import AdminPage from "./pages/admin/Admin";
import Inscription from "./components/inscription/inscription";
import Connexion from "./components/connexion/connexion";

const App = () => {
  const topRef = useRef(null);
  const catalogueRef = useRef(null);

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToCatalogue = () => {
    catalogueRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Référence pour scroll vers le haut */}
      <div ref={topRef}></div>

      <Header scrollToTop={scrollToTop} scrollToCatalogue={scrollToCatalogue} />

      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Connexion/>} />
          <Route path="/login" element={<Connexion/>} />
          <Route path="/register" element={<Inscription/>} />
          <Route path="/panier" element={<PanierPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>

      <Footer />
      <CartFloating />
    </>
  );
};

export default App;
