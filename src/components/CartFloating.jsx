// PANIER FLOTANT
// src/components/CartFloating.jsx
import { useCart } from "../context/CartContext";
import { useState, useEffect, useRef } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function CartFloating() {
  const { cartItems, addToCart, decreaseQty, removeFromCart } = useCart();
  const [open, setOpen] = useState(false);
  const cartRef = useRef();
  const buttonRef = useRef();

  const total = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        cartRef.current &&
        !cartRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getMenuPosition = () => {
    if (!buttonRef.current) return "bottom-16 right-0";
    const rect = buttonRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    const showAbove = rect.bottom > windowHeight - 200;
    const showLeft = rect.right > windowWidth - 300;

    return `${showAbove ? "bottom-16" : "top-14"} ${showLeft ? "right-0" : "left-0"}`;
  };

  return (
    <div className="fixed z-50 bottom-6 right-6">
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        className="bg-yellow-500 text-black p-3 rounded-full shadow-lg relative hover:bg-yellow-400"
      >
        <FiShoppingCart size={24} />
        {total > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {total}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={cartRef}
          className={`absolute ${getMenuPosition()} w-80 bg-neutral-900 border border-yellow-500 text-white p-4 rounded-lg shadow-xl z-50`}
        >
          <h3 className="text-lg font-bold mb-2">Mon panier</h3>
          {cartItems.length === 0 ? (
            <p className="text-gray-400">Aucun article</p>
          ) : (
            <ul className="space-y-3 mb-3 max-h-60 overflow-auto">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center text-sm gap-2">
                  <div className="flex-1">
                    <span className="block font-semibold text-yellow-400">{item.name}</span>
                    <span className="text-gray-300">Quantité : {item.quantity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => decreaseQty(item.id)} className="px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600">-</button>
                    <button onClick={() => addToCart(item)} className="px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600">+</button>
                    <button onClick={() => removeFromCart(item.id)} className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500">x</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Link
            to="/panier"
            className="block mt-2 text-center bg-yellow-500 text-black py-2 rounded font-semibold hover:bg-yellow-400"
          >
            Voir le panier
          </Link>
        </div>
      )}
    </div>
  );
}