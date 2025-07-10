import React, { useState } from "react";
import CommandesTable from "./CommandesTable";
import ProduitCommandesTable from "./ProduitCommandesTable";

const GestionCommandes = () => {
  const [activeTab, setActiveTab] = useState("commandes");

  return (
    <div className="p-4 text-white">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("commandes")}
          className={`px-4 py-2 rounded ${
            activeTab === "commandes"
              ? "bg-yellow-500 text-black"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Commandes
        </button>
        <button
          onClick={() => setActiveTab("produitcommandes")}
          className={`px-4 py-2 rounded ${
            activeTab === "produitcommandes"
              ? "bg-yellow-500 text-black"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          ProduitCommandes
        </button>
      </div>

      {activeTab === "commandes" ? <CommandesTable /> : <ProduitCommandesTable />}
    </div>
  );
};

export default GestionCommandes;
