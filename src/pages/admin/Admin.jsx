import React, { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import ProductTable from "../../components/admin/ProductTable";
import OrderTable from "../../components/admin/OrderTable";
import CustomerTable from "../../components/admin/CustomerTable";
import DashboardCommercial from "../../components/admin/DashboardCommercial"; // ✅ nouveau composant

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardCommercial />;
      case "products":
        return <ProductTable />;
      case "orders":
        return <OrderTable />;
      case "customers":
        return <CustomerTable />;
      default:
        return null;
    }
  };

  return (
    <div className="flex bg-[#121212] min-h-screen text-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
    </div>
  );
};

export default Admin;
