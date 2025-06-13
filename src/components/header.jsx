import { FaFacebookF, FaInstagram, FaTiktok, FaSnapchatGhost } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const location = useLocation();
  const navigate = useNavigate();

  const goToHome = () => {
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToCatalogue = () => {
    if (location.pathname !== "/") {
      // Navigue d'abord vers / avec un état spécial
      navigate("/", { state: { scrollToCatalogue: true } });
    } else {
      const el = document.getElementById("catalogueSection");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="bg-[#0f0f0f] text-white shadow-md w-full z-50">
      <div className="container mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo + Réseaux sociaux */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <h1 className="text-3xl font-bold text-yellow-500">PayeTonKahwa</h1>
          <div className="flex gap-4 text-gray-300">
            <a href="#"><FaSnapchatGhost className="hover:text-yellow-500" size={22} /></a>
            <a href="#"><FaFacebookF className="hover:text-blue-500" size={22} /></a>
            <a href="#"><FaInstagram className="hover:text-pink-500" size={22} /></a>
            <a href="#"><FaTiktok className="hover:text-gray-500" size={22} /></a>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <button onClick={goToHome} className="text-lg hover:text-yellow-500 font-medium">Accueil</button>
          <button onClick={goToCatalogue} className="text-lg hover:text-yellow-500 font-medium">Catalogue</button>
          <span className="text-lg text-gray-500 font-medium cursor-not-allowed">À propos</span>
          <span className="text-lg text-gray-500 font-medium cursor-not-allowed">Contact</span>

          <Link to="/panier" className="relative">
            <FiShoppingCart className="text-white hover:text-yellow-500 cursor-pointer" size={26} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-black rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
