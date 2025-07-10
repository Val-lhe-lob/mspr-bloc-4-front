import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { logKpi } from "../api/LogKpi";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  const [newProduct, setNewProduct] = useState({
    nom: "",
    prix: 0,
    stock: 0,
    couleur: "",
    description: "",
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
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    const start = performance.now();
    try {
      const res = await axios.get("/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const end = performance.now();
      await logKpi({
        apiName: "fetch_products",
        apiUrl: "/api/products",
        httpCode: res.status,
        responseTime: Math.round(end - start),
      });
      setProducts(res.data);
    } catch (error) {
      const end = performance.now();
      await logKpi({
        apiName: "fetch_products",
        apiUrl: "/api/products",
        httpCode: error.response?.status || 500,
        responseTime: Math.round(end - start),
      });
      console.error("Erreur lors du chargement des produits :", error);
      handleTokenExpiration(error);
      setError("Erreur lors du chargement des produits.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (idProduit) => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError("");
    const start = performance.now();
    try {
      const res = await axios.delete(`/api/products/${idProduit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const end = performance.now();
      await logKpi({
        apiName: "delete_product",
        apiUrl: `/api/products/${idProduit}`,
        httpCode: res.status,
        responseTime: Math.round(end - start),
      });
      fetchProducts();
    } catch (error) {
      const end = performance.now();
      await logKpi({
        apiName: "delete_product",
        apiUrl: `/api/products/${idProduit}`,
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
      const res = await axios.post("/api/products", newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const end = performance.now();
      await logKpi({
        apiName: "create_product",
        apiUrl: "/api/products",
        httpCode: res.status,
        responseTime: Math.round(end - start),
      });
      setNewProduct({
        nom: "",
        prix: 0,
        stock: 0,
        couleur: "",
        description: "",
      });
      fetchProducts();
    } catch (error) {
      const end = performance.now();
      await logKpi({
        apiName: "create_product",
        apiUrl: "/api/products",
        httpCode: error.response?.status || 500,
        responseTime: Math.round(end - start),
      });
      console.error("Erreur lors de la création :", error);
      handleTokenExpiration(error);
      setError("Erreur lors de la création.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.idProduit);
    setEditProduct({ ...product });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditProduct(null);
  };

  const handleUpdate = async () => {
    if (!isAuthenticated || !editProduct) return;
    setLoading(true);
    setError("");
    const start = performance.now();
    try {
      const res = await axios.put(
        `/api/products/${editProduct.idProduit}`,
        editProduct,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const end = performance.now();
      await logKpi({
        apiName: "update_product",
        apiUrl: `/api/products/${editProduct.idProduit}`,
        httpCode: res.status,
        responseTime: Math.round(end - start),
      });
      setEditingId(null);
      setEditProduct(null);
      fetchProducts();
    } catch (error) {
      const end = performance.now();
      await logKpi({
        apiName: "update_product",
        apiUrl: `/api/products/${editProduct.idProduit}`,
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

  const filtered = products.filter((p) =>
    p.nom?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return (
      date.toLocaleDateString("fr-FR") + " " + date.toLocaleTimeString("fr-FR")
    );
  };

  return (
    <div className="p-4 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-yellow-500">Produits</h2>
        <button
          onClick={fetchProducts}
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
          placeholder="Rechercher produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 bg-gray-800 border border-yellow-500 rounded w-full md:w-1/2"
        />
      </div>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-2">
        {[
          { label: "Nom", key: "nom" },
          { label: "Prix (€)", key: "prix", type: "number" },
          { label: "Stock", key: "stock", type: "number" },
          { label: "Couleur", key: "couleur" },
          { label: "Description", key: "description" },
        ].map((field, idx) => (
          <div key={idx} className="flex flex-col">
            <label className="mb-1 text-yellow-400">{field.label}</label>
            <input
              type={field.type || "text"}
              value={newProduct[field.key]}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  [field.key]:
                    field.type === "number"
                      ? parseFloat(e.target.value)
                      : e.target.value,
                })
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
                <th className="p-2">Prix (€)</th>
                <th className="p-2">Stock</th>
                <th className="p-2">Couleur</th>
                <th className="p-2">Description</th>
                <th className="p-2">Créé le</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((prod) => (
                <React.Fragment key={prod.idProduit}>
                  <tr className="border-b border-gray-700">
                    <td className="p-2">{prod.idProduit}</td>
                    <td className="p-2">{prod.nom}</td>
                    <td className="p-2">{prod.prix}</td>
                    <td className="p-2">{prod.stock}</td>
                    <td className="p-2">{prod.couleur}</td>
                    <td className="p-2">{prod.description}</td>
                    <td className="p-2">{formatDate(prod.createdAt)}</td>
                    <td className="p-2 space-x-2">
                      <button
                        className={`px-2 py-1 rounded ${
                          isAuthenticated
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-gray-600 cursor-not-allowed"
                        }`}
                        disabled={!isAuthenticated}
                        onClick={() => handleEdit(prod)}
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
                        onClick={() => handleDelete(prod.idProduit)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                  {editingId === prod.idProduit && (
                    <tr className="border-b border-yellow-500 bg-neutral-800">
                      {["nom", "prix", "stock", "couleur", "description"].map(
                        (field, idx) => (
                          <td key={idx} className="p-2">
                            <input
                              type={
                                field === "prix" || field === "stock"
                                  ? "number"
                                  : "text"
                              }
                              value={editProduct[field]}
                              onChange={(e) =>
                                setEditProduct({
                                  ...editProduct,
                                  [field]:
                                    field === "prix" || field === "stock"
                                      ? parseFloat(e.target.value)
                                      : e.target.value,
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
                  <td colSpan="8" className="text-center p-4 text-gray-400">
                    Aucun produit trouvé.
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

export default ProductTable;
