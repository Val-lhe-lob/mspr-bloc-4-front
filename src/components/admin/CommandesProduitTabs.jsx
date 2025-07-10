import ProduitCommandesTable from './ProduitCommandesTable'
import React, { useState } from "react";
import CommandesTable from './CommandeTable';

const CommandesProduitTabs = () => {
  const [activeSubTab, setActiveSubTab] = useState("commandes");

  return (
    <div className="p-4 text-white">
      <div className="flex space-x-2 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            activeSubTab === "commandes"
              ? "bg-yellow-500 text-black"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
          onClick={() => setActiveSubTab("commandes")}
        >
          Commandes
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeSubTab === "produitCommandes"
              ? "bg-yellow-500 text-black"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
          onClick={() => setActiveSubTab("produitCommandes")}
        >
          ProduitCommandes
        </button>
      </div>
      {activeSubTab === "commandes" ? (
        <CommandesTable />
      ) : (
        <ProduitCommandesTable />
      )}
    </div>
  );
};

export default CommandesProduitTabs;
