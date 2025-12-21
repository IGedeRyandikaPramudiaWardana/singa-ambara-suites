"use client";

import Link from "next/link";

type AdminSidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  
  const menuItems = [
    { id: "dashboard", label: "📊 Dashboard", desc: "Ringkasan & Statistik" },
    { id: "checkin", label: "🛎️ Kelola Check-In", desc: "Tamu akan datang" },
    { id: "checkout", label: "👋 Kelola Check-Out", desc: "Tamu sedang menginap" },
    { id: "payments", label: "💰 Detail Pembayaran", desc: "Riwayat Transaksi" },
    { id: "rooms", label: "🛏️ Kelola Kamar", desc: "List & Status Kamar" },
  ];

  return (
    <div className="w-64 bg-[#1A2225] h-screen fixed left-0 top-0 text-white flex flex-col shadow-2xl z-50">
      <div className="p-6 border-b border-gray-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-[#D4AF37] rounded flex items-center justify-center text-[#1A2225] font-bold text-lg">S</div>
        <div><h1 className="font-serif text-[#D4AF37] text-lg tracking-wide">Singa Ambara</h1><p className="text-[10px] text-gray-400 uppercase tracking-widest">Admin Panel</p></div>
      </div>

      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full text-left px-4 py-3 rounded-lg transition duration-200 group ${activeTab === item.id ? "bg-[#D4AF37] text-[#1A2225] shadow-lg font-bold" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
            <div className="text-sm">{item.label}</div>
            <div className={`text-[10px] mt-0.5 ${activeTab === item.id ? "text-[#1A2225]/80" : "text-gray-600 group-hover:text-gray-400"}`}>{item.desc}</div>
          </button>
        ))}
      </div>

      {/* TOMBOL KEMBALI KE WEBSITE CUSTOMER */}
      <div className="p-4 border-t border-gray-800 bg-[#151b1d]">
        <Link href="/" className="block w-full text-center py-2 mb-2 rounded border border-gray-600 text-gray-400 hover:text-white hover:border-white text-xs transition flex items-center justify-center gap-2">
          <span>🌍</span> Kembali ke Beranda
        </Link>
        <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} className="block w-full text-center py-2 rounded bg-red-900/30 text-red-400 hover:bg-red-900/50 hover:text-red-200 text-xs transition border border-red-900/50">
          🚪 Logout
        </button>
      </div>
    </div>
  );
}