import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { logKpi } from "../api/LogKpi";

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);

  const [newCustomer, setNewCustomer] = useState({
    nom: "",
    prenom: "",
    ville: "",
    codePostal: "",
    entreprise: "",
  });

  const navigate = useNavigate();
  const token = Cookies.get("token");
  const isAuthenticated = Boolean(token);

  const handleTokenExpiration = (error) => {
    const header = error?.response?.headers?.["www-authenticate"] || "";
    if (
      error.response?.status === 401 &&
      header.includes("invalid_token") &&
      header.includes("expired")
    ) {
      console.warn("Token expiré détecté, redirection vers /login.");
      Cookies.remove("token");
      Cookies.remove("user");
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    setError("");
    const start = performance.now();
    try {
      const res = await axios.get("/api/clients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const end = performance.now();
      await logKpi({
        apiName: "fetch_customers",
        apiUrl: "/api/clients",
        httpCode: res.status,
        responseTime: Math.round(end - start),
      });
      setCustomers(res.data);
    } catch (error) {
      const end = performance.now();
      await logKpi({
        apiName: "fetch_customers",
        apiUrl: "/api/clients",
        httpCode: error.response?.status || 500,
        responseTime: Math.round(end - start),
      });
      console.error("Erreur lors du chargement des clients :", error);
      handleTokenExpiration(error);
      setError("Erreur lors du chargement des clients.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (idClient) => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError("");
    const start = performance.now();
    try {
      const res = await axios.delete(`/api/clients/${idClient}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const end = performance.now();
      await logKpi({
        apiName: "delete_customer",
        apiUrl: `/api/clients/${idClient}`,
        httpCode: res.status,
        responseTime: Math.round(end - start),
      });
      fetchCustomers();
    } catch (error) {
      const end = performance.now();
      await logKpi({
        apiName: "delete_customer",
        apiUrl: `/api/clients/${idClient}`,
        httpCode: error.response?.status || 500,
        responseTime: Math.round(end - start),
      });
      console.error("Erreur lors de la suppression :", error);
      handleTokenExpiration(error);
      setError("Erreur lors de la suppression.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError("");
    const start = performance.now();
    try {
      const res = await axios.post("/api/clients", newCustomer, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const end = performance.now();
      await logKpi({
        apiName: "create_customer",
        apiUrl: "/api/clients",
        httpCode: res.status,
        responseTime: Math.round(end - start),
      });
      setNewCustomer({
        nom: "",
        prenom: "",
        ville: "",
        codePostal: "",
        entreprise: "",
      });
      fetchCustomers();
    } catch (error) {
      const end = performance.now();
      await logKpi({
        apiName: "create_customer",
        apiUrl: "/api/clients",
        httpCode: error.response?.status || 500,
        responseTime: Math.round(end - start),
      });
      console.error("Erreur lors de la création :", error.response || error);
      handleTokenExpiration(error);
      setError("Erreur lors de la création.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer) => {
    setEditingId(customer.idClient);
    setEditCustomer({ ...customer });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditCustomer(null);
  };

  const handleUpdate = async () => {
    if (!isAuthenticated || !editCustomer) return;
    setLoading(true);
    setError("");
    const start = performance.now();
    try {
      const res = await axios.put(
        `/api/clients/${editCustomer.idClient}`,
        editCustomer,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const end = performance.now();
      await logKpi({
        apiName: "update_customer",
        apiUrl: `/api/clients/${editCustomer.idClient}`,
        httpCode: res.status,
        responseTime: Math.round(end - start),
      });
      setEditingId(null);
      setEditCustomer(null);
      fetchCustomers();
    } catch (error) {
      const end = performance.now();
      await logKpi({
        apiName: "update_customer",
        apiUrl: `/api/clients/${editCustomer.idClient}`,
        httpCode: error.response?.status || 500,
        responseTime: Math.round(end - start),
      });
      console.error("Erreur lors de la mise à jour :", error);
      handleTokenExpiration(error);
      setError("Erreur lors de la mise à jour.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter((c) =>
    `${c.prenom} ${c.nom}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-yellow-500">Clients</h2>
        <button
          onClick={fetchCustomers}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
        >
          Rafraîchir
        </button>
      </div>

      {error && (
        <div className="bg-red-800 text-red-200 p-2 rounded mb-4">{error}</div>
      )}

      <div className="mb-4 flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
        <input
          type="text"
          placeholder="Rechercher client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 bg-gray-800 border border-yellow-500 rounded w-full md:w-1/2"
        />
      </div>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-2">
        {[
          { label: "Nom", key: "nom" },
          { label: "Prénom", key: "prenom" },
          { label: "Ville", key: "ville" },
          { label: "Code Postal", key: "codePostal" },
          { label: "Entreprise", key: "entreprise" },
        ].map((field, idx) => (
          <div key={idx} className="flex flex-col">
            <label className="mb-1 text-yellow-400">{field.label}</label>
            <input
              type="text"
              value={newCustomer[field.key]}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, [field.key]: e.target.value })
              }
              className="p-2 bg-gray-800 border border-yellow-500 rounded w-full"
              disabled={!isAuthenticated}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleCreate}
        disabled={!isAuthenticated}
        className={`mb-4 px-4 py-2 rounded w-full md:w-auto ${
          isAuthenticated
            ? "bg-green-600 hover:bg-green-500"
            : "bg-gray-600 cursor-not-allowed"
        }`}
      >
        Créer
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
                <th className="p-2">ID</th>
                <th className="p-2">Nom</th>
                <th className="p-2">Prénom</th>
                <th className="p-2">Ville</th>
                <th className="p-2">Code Postal</th>
                <th className="p-2">Entreprise</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cust) => (
                <React.Fragment key={cust.idClient}>
                  <tr className="border-b border-gray-700">
                    <td className="p-2">{cust.idClient}</td>
                    <td className="p-2">{cust.nom}</td>
                    <td className="p-2">{cust.prenom}</td>
                    <td className="p-2">{cust.ville}</td>
                    <td className="p-2">{cust.codePostal}</td>
                    <td className="p-2">{cust.entreprise || "-"}</td>
                    <td className="p-2 space-x-2">
                      <button
                        className={`px-2 py-1 rounded ${
                          isAuthenticated
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-gray-600 cursor-not-allowed"
                        }`}
                        disabled={!isAuthenticated}
                        onClick={() => handleEdit(cust)}
                      >
                        Modifier
                      </button>
                      <button
                        className={`px-2 py-1 rounded ${
                          isAuthenticated
                            ? "bg-red-600 hover:bg-red-500"
                            : "bg-gray-600 cursor-not-allowed"
                        }`}
                        disabled={!isAuthenticated}
                        onClick={() => handleDelete(cust.idClient)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                  {editingId === cust.idClient && (
                    <tr className="border-b border-yellow-500 bg-neutral-800">
                      {["nom", "prenom", "ville", "codePostal", "entreprise"].map(
                        (field, idx) => (
                          <td key={idx} className="p-2">
                            <input
                              type="text"
                              value={editCustomer[field]}
                              onChange={(e) =>
                                setEditCustomer({
                                  ...editCustomer,
                                  [field]: e.target.value,
                                })
                              }
                              className="p-1 w-full bg-gray-700 border border-yellow-500 rounded"
                            />
                          </td>
                        )
                      )}
                      <td className="p-2 space-x-2">
                        <button
                          className="px-2 py-1 bg-green-600 hover:bg-green-500 rounded"
                          onClick={handleUpdate}
                        >
                          Valider
                        </button>
                        <button
                          className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded"
                          onClick={handleCancelEdit}
                        >
                          Annuler
                        </button>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-gray-400">
                    Aucun client trouvé.
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

export default CustomerTable;
