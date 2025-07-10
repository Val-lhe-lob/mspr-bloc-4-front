import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { logKpi } from "../api/LogKpi";

const CommandesTable = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newCommande, setNewCommande] = useState({ idClient: "" });

  const token = Cookies.get("token");
  const isAuthenticated = Boolean(token);

  useEffect(() => {
    fetchCommandes();
  }, []);

  const fetchCommandes = async () => {
    setLoading(true);
    setError("");
    const start = performance.now();
    try {
      const res = await axios.get("/api/commandes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const end = performance.now();
      await logKpi({
        apiName: "fetch_commandes",
        apiUrl: "/api/commandes",
        httpCode: res.status,
        responseTime: Math.round(end - start),
      });
      setCommandes(res.data);
    } catch (error) {
      const end = performance.now();
      await logKpi({
        apiName: "fetch_commandes",
        apiUrl: "/api/commandes",
        httpCode: error.response?.status || 500,
        responseTime: Math.round(end - start),
      });
      console.error(error);
      setError("Erreur lors du chargement des commandes.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!isAuthenticated) return;
    if (!newCommande.idClient) {
      setError("Veuillez renseigner un ID Client.");
      return;
    }
    setLoading(true);
    const start = performance.now();
    try {
      const res = await axios.post("/api/commandes", newCommande, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const end = performance.now();
      await logKpi({
        apiName: "create_commande",
        apiUrl: "/api/commandes",
        httpCode: res.status,
        responseTime: Math.round(end - start),
      });
      setNewCommande({ idClient: "" });
      fetchCommandes();
    } catch (error) {
      const end = performance.now();
      await logKpi({
        apiName: "create_commande",
        apiUrl: "/api/commandes",
        httpCode: error.response?.status || 500,
        responseTime: Math.round(end - start),
      });
      console.error(error);
      setError("Erreur lors de la création.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (idCommande) => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      await axios.delete(`/api/commandes/${idCommande}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCommandes();
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
      <h2 className="text-xl font-bold text-yellow-500 mb-4">Commandes</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}

      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="ID Client"
          value={newCommande.idClient}
          onChange={(e) => setNewCommande({ ...newCommande, idClient: e.target.value })}
          className="p-2 bg-gray-800 border border-yellow-500 rounded text-white"
        />
        <button
          onClick={handleCreate}
          disabled={!isAuthenticated}
          className={`px-4 py-2 rounded ${
            isAuthenticated ? "bg-green-600 hover:bg-green-500" : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          Créer
        </button>
      </div>

      {loading ? (
        <p className="text-yellow-400">Chargement...</p>
      ) : (
        <table className="w-full text-white">
          <thead className="text-yellow-500">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Date de création</th>
              <th className="p-2">ID Client</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {commandes.map((cmd) => (
              <tr key={cmd.idCommande} className="text-center border-b border-gray-700">
                <td className="p-2">{cmd.idCommande}</td>
                <td className="p-2">{formatDate(cmd.createDate)}</td>
                <td className="p-2">{cmd.idClient}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(cmd.idCommande)}
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

export default CommandesTable;
