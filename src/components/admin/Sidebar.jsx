import React from "react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: "dashboard", label: "Dashboard Commercial" }, // ✅ Ajouté
    { key: "products", label: "Gérer Produits" },
    { key: "orders", label: "Gérer Commandes" },
    { key: "customers", label: "Gérer Clients" },
  ];

  return (
    <aside className="w-full md:w-64 bg-[#1a1a1a] text-white h-full p-6 shadow-md">
      <h2 className="text-2xl font-bold text-yellow-500 mb-6">Admin</h2>
      <ul className="space-y-4">
        {tabs.map((tab) => (
          <li
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`cursor-pointer text-lg font-medium hover:text-yellow-400 transition ${
              activeTab === tab.key ? "text-yellow-500" : "text-white"
            }`}
          >
            {tab.label}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
