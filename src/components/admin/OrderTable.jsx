import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { logKpi } from "../api/LogKpi";

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newOrder, setNewOrder] = useState({
    idClient: "",
    products: [
      { idProduit: "", nom: "", prix: 0, description: "", color: "", quantite: 1 }
    ],
  });

  const navigate = useNavigate();
  const token = Cookies.get("token");
  const isAuthenticated = Boolean(token);

  const handleTokenExpiration = (error) => {
    const header = error?.response?.headers?.['www-authenticate'] || "";
    if (error.response?.status === 401 && header.includes("invalid_token") && header.includes("expired")) {
      console.warn("Token expiré détecté, redirection vers /login.");
      Cookies.remove("token");
      Cookies.remove("user");
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    const start = performance.now();
    try {
      const res = await axios.get("/api/Commandes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const end = performance.now();
      await logKpi({
        apiName: "fetch_orders",
        apiUrl: "/api/Commandes",
        httpCode: res.status,
        responseTime: Math.round(end - start),
      });
      setOrders(res.data);
    } catch (error) {
      const end = performance.now();
      await logKpi({
        apiName: "fetch_orders",
        apiUrl: "/api/Commandes",
        httpCode: error.response?.status || 500,
        responseTime: Math.round(end - start),
      });
      handleTokenExpiration(error);
      setError("Erreur lors du chargement des commandes.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError("");
    const start = performance.now();

    try {
      // Créer commande
      const resCommande = await axios.post("/api/Commandes", { idClient: parseInt(newOrder.idClient) }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const idCommande = resCommande.data.idCommande;

      // Créer les produitCommandes
      for (const prod of newOrder.products) {
        await axios.post("/api/ProduitCommandes", {
          idCommande,
          idProduit: parseInt(prod.idProduit),
          nom: prod.nom,
          prix: parseFloat(prod.prix),
          description: prod.description,
          color: prod.color,
          quantite: parseInt(prod.quantite),
          createdAt: new Date().toISOString()
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      const end = performance.now();
      await logKpi({
        apiName: "create_order",
        apiUrl: "/api/Commandes + /api/ProduitCommandes",
        httpCode: resCommande.status,
        responseTime: Math.round(end - start),
      });

      setNewOrder({
        idClient: "",
        products: [{ idProduit: "", nom: "", prix: 0, description: "", color: "", quantite: 1 }]
      });
      fetchOrders();
    } catch (error) {
      const end = performance.now();
      await logKpi({
        apiName: "create_order",
        apiUrl: "/api/Commandes + /api/ProduitCommandes",
        httpCode: error.response?.status || 500,
        responseTime: Math.round(end - start),
      });
      handleTokenExpiration(error);
      setError("Erreur lors de la création de la commande.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = orders.filter((o) =>
    o.idCommande.toString().includes(search) || o.idClient.toString().includes(search)
  );

  return (
    <div className="p-4 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-yellow-500">Commandes</h2>
        <button onClick={fetchOrders} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500">
          Rafraîchir
        </button>
      </div>

      {error && (
        <div className="bg-red-800 text-red-200 p-2 rounded mb-4">{error}</div>
      )}

      <input
        type="text"
        placeholder="Rechercher par ID commande ou client..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 mb-4 bg-gray-800 border border-yellow-500 rounded w-full md:w-1/2"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
        <input
          type="number"
          placeholder="ID Client"
          value={newOrder.idClient}
          onChange={(e) => setNewOrder({ ...newOrder, idClient: e.target.value })}
          className="p-2 bg-gray-800 border border-yellow-500 rounded"
        />
        {newOrder.products.map((prod, idx) => (
          <div key={idx} className="flex flex-col space-y-1 bg-neutral-800 p-2 rounded">
            <input type="number" placeholder="ID Produit" value={prod.idProduit} onChange={(e) => {
              const updated = [...newOrder.products];
              updated[idx].idProduit = e.target.value;
              setNewOrder({ ...newOrder, products: updated });
            }} className="p-1 bg-gray-700 border border-yellow-500 rounded" />
            <input type="text" placeholder="Nom" value={prod.nom} onChange={(e) => {
              const updated = [...newOrder.products];
              updated[idx].nom = e.target.value;
              setNewOrder({ ...newOrder, products: updated });
            }} className="p-1 bg-gray-700 border border-yellow-500 rounded" />
            <input type="number" placeholder="Prix" value={prod.prix} onChange={(e) => {
              const updated = [...newOrder.products];
              updated[idx].prix = e.target.value;
              setNewOrder({ ...newOrder, products: updated });
            }} className="p-1 bg-gray-700 border border-yellow-500 rounded" />
            <input type="text" placeholder="Description" value={prod.description} onChange={(e) => {
              const updated = [...newOrder.products];
              updated[idx].description = e.target.value;
              setNewOrder({ ...newOrder, products: updated });
            }} className="p-1 bg-gray-700 border border-yellow-500 rounded" />
            <input type="text" placeholder="Couleur" value={prod.color} onChange={(e) => {
              const updated = [...newOrder.products];
              updated[idx].color = e.target.value;
              setNewOrder({ ...newOrder, products: updated });
            }} className="p-1 bg-gray-700 border border-yellow-500 rounded" />
            <input type="number" placeholder="Quantité" value={prod.quantite} onChange={(e) => {
              const updated = [...newOrder.products];
              updated[idx].quantite = e.target.value;
              setNewOrder({ ...newOrder, products: updated });
            }} className="p-1 bg-gray-700 border border-yellow-500 rounded" />
          </div>
        ))}
      </div>

      <button
        onClick={handleCreateOrder}
        disabled={!isAuthenticated}
        className={`mb-4 px-4 py-2 rounded w-full md:w-auto ${
          isAuthenticated ? "bg-green-600 hover:bg-green-500" : "bg-gray-600 cursor-not-allowed"
        }`}
      >
        Créer Commande
      </button>

      {loading ? (
        <div className="text-center py-8">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-yellow-500 h-12 w-12 mx-auto animate-spin"></div>
          <p className="text-yellow-400 mt-2">Chargement...</p>
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-neutral-800 text-yellow-400">
                <th className="p-2">ID Commande</th>
                <th className="p-2">Date de création</th>
                <th className="p-2">ID Client</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.idCommande} className="border-b border-gray-700">
                  <td className="p-2">{order.idCommande}</td>
                  <td className="p-2">{new Date(order.createdate).toLocaleString("fr-FR")}</td>
                  <td className="p-2">{order.idClient}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center p-4 text-gray-400">
                    Aucune commande trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
