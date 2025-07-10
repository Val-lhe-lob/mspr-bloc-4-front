import { FaFacebookF, FaInstagram, FaTiktok, FaSnapchatGhost } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function Header() {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const location = useLocation();
  const navigate = useNavigate();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    const userCookie = Cookies.get("user");

    if (token && userCookie) {
      try {
        const decoded = decodeURIComponent(userCookie);
        const parsedUser = JSON.parse(decoded);
        setUser(parsedUser);
      } catch (e) {
        console.error("Erreur parsing user cookie:", e);
      }
    }
  }, []);

  const goToHome = () => {
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToCatalogue = () => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollToCatalogue: true } });
    } else {
      const el = document.getElementById("catalogueSection");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  const goToRegister = () => {
    navigate("/register");
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    window.location.reload();
  };

  return (
    <header className="bg-[#0f0f0f] text-white shadow-md w-full z-50">
      <div className="container mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <h1
            className="text-3xl font-bold text-yellow-500 cursor-pointer"
            onClick={goToHome}
          >
            PayeTonKahwa
          </h1>
        </div>

        <nav className="flex flex-wrap items-center gap-4 md:gap-6">
          <span className="text-lg text-gray-500 font-medium cursor-not-allowed">À propos</span>
          <span className="text-lg text-gray-500 font-medium cursor-not-allowed">Contact</span>

          {!user ? (
            <>
              <button
                onClick={goToLogin}
                className="px-4 py-2 bg-yellow-500 text-black rounded-full font-semibold text-sm hover:bg-yellow-400 transition"
              >
                Se connecter
              </button>
              <button
                onClick={goToRegister}
                className="px-4 py-2 bg-yellow-500 text-black rounded-full font-semibold text-sm hover:bg-yellow-400 transition"
              >
                S'inscrire
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowProfileModal(true)}
                className="px-4 py-2 bg-yellow-500 text-black rounded-full font-semibold text-sm hover:bg-yellow-400 transition"
              >
                Profil
              </button>

              {showProfileModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                  <div className="bg-neutral-900 rounded-lg p-6 w-80 border border-yellow-500">
                    <h2 className="text-xl text-yellow-500 font-bold mb-4 text-center">Profil</h2>
                    <p className="text-white mb-2">
                      <span className="font-semibold text-yellow-400">Nom d'utilisateur :</span> {user.username}
                    </p>
                    <p className="text-white mb-2">
                      <span className="font-semibold text-yellow-400">Type de compte :</span> {user.accountType}
                    </p>
                    <p className="text-white mb-2">
                      <span className="font-semibold text-yellow-400">Dernière connexion :</span>{" "}
                      {new Date(user.lastLoginAt).toLocaleString("fr-FR")}
                    </p>
                    <p className="text-white mb-4">
                      <span className="font-semibold text-yellow-400">Créé le :</span>{" "}
                      {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                    <div className="flex justify-between">
                      <button
                        onClick={() => setShowProfileModal(false)}
                        className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-white"
                      >
                        Fermer
                      </button>
                      <button
                        onClick={handleLogout}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-white"
                      >
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
