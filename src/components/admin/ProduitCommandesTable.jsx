import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { logKpi } from "../api/LogKpi";

const ProduitCommandesTable = () => {
  const [produitCommandes, setProduitCommandes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [newPC, setNewPC] = useState({
    idProduit: "",
    quantite: 1,
    idClient: "",
  });

  const token = Cookies.get("token");
  const isAuthenticated = Boolean(token);

  useEffect(() => {
    fetchProduitCommandes();
  }, []);

  const fetchProduitCommandes = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/produitcommandes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProduitCommandes(res.data);
    } catch (error) {
      console.error(error);
      setError("Erreur lors du chargement des ProduitCommandes.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!isAuthenticated) return;
    if (!newPC.idProduit || !newPC.idClient || !newPC.quantite) {
      setError("ID Produit, ID Client et Quantité requis.");
      return;
    }

    setLoading(true);
    setError("");
    const start = performance.now();

    try {
      // Vérifier si le produit existe
      const produitRes = await axios.get(`/api/products/${newPC.idProduit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const produitData = produitRes.data;

      // Vérifier si le client existe
      await axios.get(`/api/clients/${newPC.idClient}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Créer la commande
      const commandeRes = await axios.post(
        "/api/commandes",
        { idClient: parseInt(newPC.idClient) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const createdCommande = commandeRes.data;

      // Créer le produitcommande sous forme de LISTE
      const produitCommandePayload = [{
        idCommande: createdCommande.idCommande,
        idProduit: parseInt(newPC.idProduit),
        quantite: parseInt(newPC.quantite),
        nom: produitData.nom,
        prix: produitData.prix,
        description: produitData.description,
        color: produitData.couleur,
      }];

      const res = await axios.post("/api/produitcommandes", produitCommandePayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const end = performance.now();
      await logKpi({
        apiName: "create_produitcommande",
        apiUrl: "/api/produitcommandes",
        httpCode: res.status,
        responseTime: Math.round(end - start),
      });

      setNewPC({ idProduit: "", quantite: 1, idClient: "" });
      fetchProduitCommandes();
    } catch (error) {
      const end = performance.now();
      await logKpi({
        apiName: "create_produitcommande",
        apiUrl: "/api/produitcommandes",
        httpCode: error.response?.status || 500,
        responseTime: Math.round(end - start),
      });

      if (error.response?.status === 404) {
        setError("Produit ou client non trouvé, impossible de créer.");
      } else {
        console.error(error);
        setError("Erreur lors de la création.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (idProduitCommande) => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      await axios.delete(`/api/produitcommandes/${idProduitCommande}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProduitCommandes();
    } catch (error) {
      console.error(error);
      setError("Erreur lors de la suppression.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR") + " " + date.toLocaleTimeString("fr-FR");
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-yellow-500 mb-4">ProduitCommandes</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="ID Produit"
          value={newPC.idProduit}
          onChange={(e) => setNewPC({ ...newPC, idProduit: e.target.value })}
          className="p-2 bg-gray-800 border border-yellow-500 rounded text-white"
        />
        <input
          type="number"
          placeholder="Quantité"
          value={newPC.quantite}
          onChange={(e) => setNewPC({ ...newPC, quantite: e.target.value })}
          className="p-2 bg-gray-800 border border-yellow-500 rounded text-white"
        />
        <input
          type="text"
          placeholder="ID Client"
          value={newPC.idClient}
          onChange={(e) => setNewPC({ ...newPC, idClient: e.target.value })}
          className="p-2 bg-gray-800 border border-yellow-500 rounded text-white"
        />
        <button
          onClick={handleCreate}
          disabled={!isAuthenticated}
          className={`px-4 py-2 rounded ${
            isAuthenticated ? "bg-green-600 hover:bg-green-500" : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          Créer ProduitCommande (et Commande)
        </button>
      </div>

      {loading ? (
        <p className="text-yellow-400">Chargement...</p>
      ) : (
        <table className="w-full text-white text-sm">
          <thead className="text-yellow-500">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">ID Commande</th>
              <th className="p-2">ID Produit</th>
              <th className="p-2">Nom</th>
              <th className="p-2">Créé le</th>
              <th className="p-2">Prix</th>
              <th className="p-2">Description</th>
              <th className="p-2">Couleur</th>
              <th className="p-2">Quantité</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {produitCommandes.map((pc) => (
              <tr key={pc.idProduitCommande} className="text-center border-b border-gray-700">
                <td className="p-2">{pc.idProduitCommande}</td>
                <td className="p-2">{pc.idCommande}</td>
                <td className="p-2">{pc.idProduit}</td>
                <td className="p-2">{pc.nom || "-"}</td>
                <td className="p-2">{formatDate(pc.createdAt)}</td>
                <td className="p-2">{pc.prix || "-"}</td>
                <td className="p-2">{pc.description || "-"}</td>
                <td className="p-2">{pc.color || "-"}</td>
                <td className="p-2">{pc.quantite}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(pc.idProduitCommande)}
                    className="bg-red-600 hover:bg-red-500 px-2 py-1 rounded"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProduitCommandesTable;
