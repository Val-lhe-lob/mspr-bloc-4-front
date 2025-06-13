// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-gray-400 py-8 border-t border-gray-700">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm md:text-base">
          &copy; {new Date().getFullYear()} <span className="text-yellow-500 font-semibold">PayeTonKahwa</span> — Tous droits réservés.
        </p>
        <p className="text-xs mt-2 text-gray-500">Site vitrine fictif dans le cadre d’un projet MSPR</p>
      </div>
    </footer>
  );
}
