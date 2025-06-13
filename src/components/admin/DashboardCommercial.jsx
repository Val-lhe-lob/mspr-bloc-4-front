// src/components/admin/DashboardCommercial.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaShoppingCart,
  FaBox,
  FaUser,
  FaEuroSign,
  FaChartLine,
  FaChartPie,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const DashboardCommercial = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalClients: 0,
    totalRevenue: 0,
  });

  const revenueData = {
    labels: ["Jan", "Fév", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
    datasets: [
      {
        label: "Chiffre d'affaires (€)",
        data: [1200, 1500, 1000, 1800, 1700, 2000, 2200, 2100, 2300, 2500, 2400, 2700],
        backgroundColor: "#facc15",
      },
    ],
  };

  const productData = {
    labels: ["Café A", "Café B", "Café C", "Café D", "Café E"],
    datasets: [
      {
        label: "Ventes",
        data: [150, 120, 90, 60, 30],
        backgroundColor: ["#facc15", "#fde047", "#fef08a", "#eab308", "#ca8a04"],
      },
    ],
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes, clientsRes] = await Promise.all([
          axios.get("https://615f5fb4f7254d0017068109.mockapi.io/api/v1/products"),
          axios.get("https://615f5fb4f7254d0017068109.mockapi.io/api/v1/orders"),
          axios.get("https://615f5fb4f7254d0017068109.mockapi.io/api/v1/customers"),
        ]);

        const totalRevenue = ordersRes.data.reduce((sum, order) => {
          const orderTotal = order.products?.reduce((sub, p) => {
            const price = parseFloat(p.details?.price?.replace(",", ".") || 0);
            const qty = p.quantity || 1;
            return sub + price * qty;
          }, 0) || 0;
          return sum + orderTotal;
        }, 0);

        setStats({
          totalProducts: productsRes.data.length,
          totalOrders: ordersRes.data.length,
          totalClients: clientsRes.data.length,
          totalRevenue: totalRevenue.toFixed(2),
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des KPIs commerciaux :", error);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { icon: <FaShoppingCart />, label: "Commandes", value: stats.totalOrders },
    { icon: <FaBox />, label: "Produits", value: stats.totalProducts },
    { icon: <FaUser />, label: "Clients", value: stats.totalClients },
    { icon: <FaEuroSign />, label: "Chiffre d’affaires", value: `${stats.totalRevenue} €` },
  ];

  return (
    <div className="p-6 bg-[#121212] text-white">
      <h2 className="text-2xl font-bold mb-6 text-yellow-500">Dashboard Commercial</h2>

      {/* Résumé rapide */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-neutral-800 p-6 rounded-lg shadow-md text-center">
            <div className="text-yellow-500 text-3xl mb-2">{card.icon}</div>
            <div className="text-xl font-bold">{card.value}</div>
            <div className="text-sm text-gray-400">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1 */}
        <div className="bg-neutral-900 p-4 rounded-lg shadow-md">
          <h3 className="text-yellow-400 font-semibold mb-2">📊 Chiffre d'affaires (Bar)</h3>
          <Bar data={revenueData} />
        </div>

        {/* 2 */}
        <div className="bg-neutral-900 p-4 rounded-lg shadow-md">
          <h3 className="text-yellow-400 font-semibold mb-2">🥇 Top Produits (Camembert)</h3>
          <Pie data={productData} />
        </div>

        {/* 3 */}
        <div className="bg-neutral-900 p-4 rounded-lg shadow-md">
          <h3 className="text-yellow-400 font-semibold mb-2">📊 Ventes Mensuelles</h3>
          <Bar data={revenueData} />
        </div>

        {/* 4 */}
        <div className="bg-neutral-900 p-4 rounded-lg shadow-md">
          <h3 className="text-yellow-400 font-semibold mb-2">📊 Produits Populaires</h3>
          <Pie data={productData} />
        </div>

        {/* 5 */}
        <div className="bg-neutral-900 p-4 rounded-lg shadow-md">
          <h3 className="text-yellow-400 font-semibold mb-2">📈 Prévision du CA</h3>
          <Bar data={revenueData} />
        </div>

        {/* 6 */}
        <div className="bg-neutral-900 p-4 rounded-lg shadow-md">
          <h3 className="text-yellow-400 font-semibold mb-2">📊 Répartition des Ventes</h3>
          <Pie data={productData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCommercial;
