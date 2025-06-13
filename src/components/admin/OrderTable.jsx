import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    // Charger les commandes
    const fetchOrders = axios.get("https://615f5fb4f7254d0017068109.mockapi.io/api/v1/orders");
    // Charger les clients
    const fetchCustomers = axios.get("https://615f5fb4f7254d0017068109.mockapi.io/api/v1/customers");

    Promise.all([fetchOrders, fetchCustomers])
      .then(([ordersRes, customersRes]) => {
        setOrders(ordersRes.data);
        setCustomers(customersRes.data);
      })
      .catch((error) => console.error("Erreur de chargement :", error));
  }, []);

  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : "Inconnu";
  };

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl font-bold mb-4 text-yellow-500">Commandes</h2>
      <div className="overflow-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-neutral-800 text-yellow-400">
              <th className="p-2">ID</th>
              <th className="p-2">Client</th>
              <th className="p-2">Nb Produits</th>
              <th className="p-2">Détails Produits</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-700">
                <td className="p-2">{order.id}</td>
                <td className="p-2">{getCustomerName(order.customerId)}</td>
                <td className="p-2 text-center">{order.products?.length}</td>
                <td className="p-2 text-sm">
                  {order.products?.map((p, i) => (
                    <div key={i} className="text-gray-300">
                      • <strong>{p.name}</strong> × {p.quantity}
                    </div>
                  )) || "Aucun produit"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
