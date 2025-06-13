import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("https://615f5fb4f7254d0017068109.mockapi.io/api/v1/products");
    setProducts(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://615f5fb4f7254d0017068109.mockapi.io/api/v1/products/${id}`);
    fetchProducts();
  };

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl font-bold mb-4 text-yellow-500">Produits</h2>
      <input
        type="text"
        placeholder="Rechercher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 bg-gray-800 border border-yellow-500 rounded w-full md:w-1/2"
      />
      <div className="overflow-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-neutral-800 text-yellow-400">
              <th className="p-2">Nom</th>
              <th className="p-2">Prix</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((prod) => (
              <tr key={prod.id} className="border-b border-gray-700">
                <td className="p-2">{prod.name}</td>
                <td className="p-2">{prod.details?.price} €</td>
                <td className="p-2">{prod.stock}</td>
                <td className="p-2 space-x-2">
                  <button className="px-2 py-1 bg-red-600 rounded hover:bg-red-500" onClick={() => handleDelete(prod.id)}>
                    Supprimer
                  </button>
                  <button className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">Modifier</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
