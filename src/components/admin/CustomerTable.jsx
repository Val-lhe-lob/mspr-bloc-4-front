import React, { useEffect, useState } from "react";
import axios from "axios";

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const res = await axios.get("https://615f5fb4f7254d0017068109.mockapi.io/api/v1/customers");
    setCustomers(res.data);
  };

  const filtered = customers.filter((c) =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl font-bold mb-4 text-yellow-500">Clients</h2>
      <input
        type="text"
        placeholder="Rechercher client..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 bg-gray-800 border border-yellow-500 rounded w-full md:w-1/2"
      />
      <div className="overflow-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-neutral-800 text-yellow-400">
              <th className="p-2">Prénom</th>
              <th className="p-2">Nom</th>
              <th className="p-2">Code postal</th>
              <th className="p-2">Ville</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cust) => (
              <tr key={cust.id} className="border-b border-gray-700">
                <td className="p-2">{cust.firstName}</td>
                <td className="p-2">{cust.lastName}</td>
                <td className="p-2">{cust.address?.postalCode}</td>
                <td className="p-2">{cust.address?.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTable;