// src/components/admin/DashboardCommercial.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaStopwatch,
  FaServer,
  FaBug,
  FaProjectDiagram,
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
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchKpis = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/apimonitoring");
        setKpis(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error(error);
        setError("Erreur lors du chargement des métriques API Monitoring.");
      } finally {
        setLoading(false);
      }
    };

    fetchKpis();
  }, []);

  // Calcul des métriques globales
  const totalCalls = kpis.length;
  const totalErrors = kpis.filter(k => k.httpCode >= 400).length;
  const avgTime =
    totalCalls > 0
      ? (
          kpis.reduce((acc, k) => acc + (k.responseTime || 0), 0) / totalCalls
        ).toFixed(2)
      : 0;
  const minTime =
    totalCalls > 0 ? Math.min(...kpis.map(k => k.responseTime || 0)) : 0;
  const maxTime =
    totalCalls > 0 ? Math.max(...kpis.map(k => k.responseTime || 0)) : 0;
  const uniqueApis = [...new Set(kpis.map(k => k.apiName))].length;

  const cards = [
    { icon: <FaServer />, label: "Appels API", value: totalCalls },
    { icon: <FaStopwatch />, label: "Temps moyen (ms)", value: avgTime },
    { icon: <FaStopwatch />, label: "Temps max (ms)", value: maxTime },
    { icon: <FaStopwatch />, label: "Temps min (ms)", value: minTime },
    { icon: <FaBug />, label: "Erreurs (4xx/5xx)", value: totalErrors },
    { icon: <FaProjectDiagram />, label: "APIs Distinctes", value: uniqueApis },
  ];

  // Construit des données pour les graphiques
  const apiNames = [...new Set(kpis.map(k => k.apiName))];
  const responseTimes = apiNames.map(name =>
    kpis.filter(k => k.apiName === name)
       .reduce((acc, k) => acc + (k.responseTime || 0), 0) /
    kpis.filter(k => k.apiName === name).length || 0
  );

  const apiCallCounts = apiNames.map(name =>
    kpis.filter(k => k.apiName === name).length
  );

  const barData = {
    labels: apiNames,
    datasets: [
      {
        label: "Temps de réponse moyen (ms) par API",
        data: responseTimes.map(rt => rt.toFixed(2)),
        backgroundColor: "#facc15",
      },
    ],
  };

  const pieData = {
    labels: apiNames,
    datasets: [
      {
        label: "Nombre d'appels par API",
        data: apiCallCounts,
        backgroundColor: ["#facc15", "#fde047", "#fef08a", "#eab308", "#ca8a04", "#ff9f40"],
      },
    ],
  };

  return (
    <div className="p-6 bg-[#121212] text-white">
      <h2 className="text-2xl font-bold mb-6 text-yellow-500 flex items-center gap-2">
        <FaServer /> Dashboard API Monitoring
      </h2>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {/* Cartes synthétiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-neutral-800 p-6 rounded-lg shadow-md text-center"
          >
            <div className="text-yellow-500 text-3xl mb-2">{card.icon}</div>
            <div className="text-xl font-bold">{card.value}</div>
            <div className="text-sm text-gray-400">{card.label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <p className="text-yellow-400">Chargement...</p>
      ) : (
        <>
          {/* Tableau des 20 derniers appels */}
          <div className="overflow-auto mb-8">
            <h3 className="text-yellow-400 font-semibold mb-2">🗂️ 20 Derniers Appels API</h3>
            <table className="w-full text-sm text-left text-gray-200">
              <thead className="text-xs uppercase bg-neutral-800 text-yellow-500">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">API Name</th>
                  <th className="px-4 py-2">API URL</th>
                  <th className="px-4 py-2">HTTP Code</th>
                  <th className="px-4 py-2">Response Time (ms)</th>
                  <th className="px-4 py-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {kpis.slice(-20).reverse().map((kpi) => (
                  <tr key={kpi.id} className="border-b border-neutral-700 hover:bg-neutral-800 transition">
                    <td className="px-4 py-2">{kpi.id}</td>
                    <td className="px-4 py-2">{kpi.apiName}</td>
                    <td className="px-4 py-2 truncate max-w-[150px]">{kpi.apiUrl}</td>
                    <td className="px-4 py-2">{kpi.httpCode}</td>
                    <td className="px-4 py-2">{kpi.responseTime}</td>
                    <td className="px-4 py-2">{new Date(kpi.timestamp).toLocaleString("fr-FR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Graphiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-900 p-4 rounded-lg shadow-md">
              <h3 className="text-yellow-400 font-semibold mb-2">📊 Temps de réponse moyen par API</h3>
              {apiNames.length > 0 ? (
                <Bar data={barData} />
              ) : (
                <p className="text-gray-400">Aucune donnée disponible.</p>
              )}
            </div>

            <div className="bg-neutral-900 p-4 rounded-lg shadow-md">
              <h3 className="text-yellow-400 font-semibold mb-2">🥧 Répartition des appels par API</h3>
              {apiNames.length > 0 ? (
                <Pie data={pieData} />
              ) : (
                <p className="text-gray-400">Aucune donnée disponible.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardCommercial;
