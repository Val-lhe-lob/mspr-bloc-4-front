import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import axios from "axios";
import { FaTrashAlt, FaClipboardList, FaShoppingCart } from "react-icons/fa";
import { AiOutlineLoading3Quarters, AiOutlineCheck } from "react-icons/ai";

const PanierPage = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = useCart();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    postalCode: "",
    city: "",
    companyName: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const totalTTC = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.details?.price?.replace(",", ".") || 0);
    return sum + price * item.quantity;
  }, 0);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // 1. Créer le customer
      const customerRes = await axios.post("https://615f5fb4f7254d0017068109.mockapi.io/api/v1/customers", {
        firstName: form.firstName,
        lastName: form.lastName,
        address: {
          postalCode: form.postalCode,
          city: form.city,
        },
        company: {
          companyName: form.companyName,
        },
      });

      const customerId = customerRes.data.id;

      // 2. Créer la commande à vide pour obtenir l’ID
      const emptyOrderRes = await axios.post("https://615f5fb4f7254d0017068109.mockapi.io/api/v1/orders", {
        customerId,
        products: [],
      });

      const orderId = emptyOrderRes.data.id;

      // 3. Ajouter les produits dans cette commande
      const productsWithOrderId = cartItems.map((item) => ({
        ...item,
        orderId,
      }));

      // 4. Update la commande avec les produits liés
      await axios.put(`https://615f5fb4f7254d0017068109.mockapi.io/api/v1/orders/${orderId}`, {
        customerId,
        products: productsWithOrderId,
      });

      setLastOrder({
        customer: form,
        items: [...cartItems],
        total: totalTTC.toFixed(2),
      });

      setSuccessMessage("Commande envoyée avec succès !");
      setForm({ firstName: "", lastName: "", postalCode: "", city: "", companyName: "" });
      clearCart();
    } catch (error) {
      console.error("Erreur lors de la commande:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#121212] min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <FaShoppingCart /> Mon Panier
      </h1>

      {successMessage && lastOrder ? (
        <div className="bg-green-900 border border-green-500 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-green-400 flex items-center gap-2">
            <AiOutlineCheck /> {successMessage}
          </h2>
          <p className="mt-2">Merci {lastOrder.customer.firstName} {lastOrder.customer.lastName} !</p>

          <div className="mt-4">
            <h3 className="text-yellow-400 font-semibold mb-2">🧾 Détail de la commande :</h3>
            <ul className="list-disc ml-5 text-sm space-y-1">
              {lastOrder.items.map((item) => (
                <li key={item.id}>
                  {item.name} × {item.quantity} – {item.details?.price} €
                </li>
              ))}
            </ul>
            <p className="mt-2 font-bold text-yellow-500">Total : {lastOrder.total} €</p>
          </div>

          <div className="mt-4">
            <h3 className="text-yellow-400 font-semibold">📍 Livraison :</h3>
            <p className="text-sm">{lastOrder.customer.city}, {lastOrder.customer.postalCode}</p>
            {lastOrder.customer.companyName && (
              <p className="text-sm">Entreprise : {lastOrder.customer.companyName}</p>
            )}
          </div>
        </div>
      ) : cartItems.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b border-gray-700 pb-4">
              <div>
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-gray-400">{item.details?.description}</p>
                <p className="text-yellow-400 font-semibold">{item.details?.price} €</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => decreaseQuantity(item.id)} className="bg-gray-700 px-3 py-1 rounded">-</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQuantity(item.id)} className="bg-gray-700 px-3 py-1 rounded">+</button>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 ml-4">
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}

          <div className="text-right text-xl font-bold text-yellow-500">
            Total TTC : {totalTTC.toFixed(2)} €
          </div>

          <div className="mt-10 max-w-lg">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FaClipboardList /> Informations client
            </h2>
            <div className="space-y-4">
              <input name="firstName" placeholder="Prénom" value={form.firstName} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded" />
              <input name="lastName" placeholder="Nom" value={form.lastName} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded" />
              <input name="postalCode" placeholder="Code postal" value={form.postalCode} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded" />
              <input name="city" placeholder="Ville" value={form.city} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded" />
              <input name="companyName" placeholder="Entreprise (optionnel)" value={form.companyName} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded" />

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin" /> Envoi en cours...
                  </>
                ) : (
                  <>
                    <AiOutlineCheck /> Valider la commande
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanierPage;
