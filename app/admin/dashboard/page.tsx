"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar"; // Import Sidebar Khusus Admin

// --- TIPE DATA ---
type Booking = {
  id: number;
  guest_name: string;
  phone_number: string;
  check_in: string;
  check_out: string;
  payment_method: string;
  status: string;
  total_price: number;
  room: { name: string };
};

export default function AdminDashboard() {
  const router = useRouter();
  
  // STATE DATA
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // STATE NAVIGASI (SIDEBAR CONTROL)
  const [activeTab, setActiveTab] = useState("dashboard"); // Default dashboard

  // STATE FILTER LOKAL (Search)
  const [searchTerm, setSearchTerm] = useState("");

  // 1. FETCH DATA
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${apiUrl}/admin/bookings`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      } else {
        router.push("/"); // Jika bukan admin, tendang ke home
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. LOGIKA UPDATE STATUS
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    if (!confirm(`Update status booking #${id}?`)) return;
    const token = localStorage.getItem("token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    
    await fetch(`${apiUrl}/admin/bookings/${id}`, {
      method: 'PUT',
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });
    fetchData(); // Refresh data
  };

  // 3. LOGIKA FILTER BERDASARKAN SIDEBAR
  const getFilteredBookings = () => {
    let filtered = bookings;

    // Filter by Sidebar Tab
    if (activeTab === 'checkin') {
        // Tampilkan hanya yang confirmed (Siap Check-in)
        filtered = bookings.filter(b => b.status === 'confirmed');
    } else if (activeTab === 'checkout') {
        // Tampilkan hanya yang sedang menginap (Siap Check-out)
        filtered = bookings.filter(b => b.status === 'checked_in');
    } else if (activeTab === 'payments') {
        // Tampilkan semua kecuali cancelled (Fokus uang masuk)
        filtered = bookings.filter(b => b.status !== 'cancelled');
    }

    // Filter by Search Bar
    if (searchTerm) {
        filtered = filtered.filter(b => 
            b.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.id.toString().includes(searchTerm)
        );
    }

    return filtered;
  };

  const displayedBookings = getFilteredBookings();

  if (isLoading) return <div className="pl-64 pt-20 text-center text-gray-500">Memuat Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans text-gray-800">
      
      {/* 1. SIDEBAR KIRI (FIXED) */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. KONTEN KANAN (SCROLLABLE) */}
      <div className="flex-1 ml-64 p-8">
        
        {/* Header Konten */}
        <div className="flex justify-between items-end mb-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-800 capitalize">
                    {activeTab === 'dashboard' ? 'Overview Dashboard' : 
                     activeTab === 'checkin' ? 'Jadwal Check-In Hari Ini' :
                     activeTab === 'checkout' ? 'Jadwal Check-Out & Kamar' :
                     activeTab === 'rooms' ? 'Status Kamar' : 'Laporan Keuangan'}
                </h2>
                <p className="text-gray-500 mt-1">
                    {activeTab === 'dashboard' ? 'Ringkasan performa hotel Anda.' : `Menampilkan data untuk menu ${activeTab}.`}
                </p>
            </div>
            
            {/* Search Bar Kecil (Muncul selain di dashboard/rooms) */}
            {activeTab !== 'dashboard' && activeTab !== 'rooms' && (
                <div className="relative">
                    <input 
                        type="text" placeholder="Cari tamu..." 
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-sm w-64"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
            )}
        </div>

        {/* --- KONTEN DINAMIS BERDASARKAN TAB --- */}

        {/* A. TAMPILAN DASHBOARD UTAMA */}
        {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                    <p className="text-gray-500 text-xs font-bold uppercase">Total Pendapatan</p>
                    <h3 className="text-2xl font-bold mt-1">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(bookings.filter(b=>b.status!=='cancelled').reduce((a,b)=>a+b.total_price,0))}
                    </h3>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-[#D4AF37]">
                    <p className="text-gray-500 text-xs font-bold uppercase">Tamu Check-In</p>
                    <h3 className="text-2xl font-bold mt-1">{bookings.filter(b=>b.status==='confirmed').length} <span className="text-sm font-normal text-gray-400">Orang</span></h3>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                    <p className="text-gray-500 text-xs font-bold uppercase">Sedang Menginap</p>
                    <h3 className="text-2xl font-bold mt-1">{bookings.filter(b=>b.status==='checked_in').length} <span className="text-sm font-normal text-gray-400">Kamar</span></h3>
                </div>
            </div>
        )}

        {/* B. TAMPILAN KELOLA KAMAR (Visual Dummy) */}
        {activeTab === 'rooms' ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="text-6xl mb-4">🛏️</div>
                <h3 className="text-xl font-bold text-gray-800">Manajemen Kamar</h3>
                <p className="text-gray-500 mb-6">Status ketersediaan kamar saat ini.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
                    {/* Visualisasi Data Kamar */}
                    {['Panji Room', 'Lovina Room', 'Buleleng Suite'].map(room => (
                        <div key={room} className="border p-4 rounded-lg flex justify-between items-center bg-gray-50">
                            <div>
                                <span className="font-bold block text-gray-800">{room}</span>
                                <span className="text-xs text-gray-500">Ready to use</span>
                            </div>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">Available</span>
                        </div>
                    ))}
                </div>
            </div>
        ) : (
            /* C. TAMPILAN TABEL DATA (Untuk Tab Checkin/Checkout/Payments) */
            activeTab !== 'dashboard' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                        <tr>
                            <th className="p-4">ID & Tamu</th>
                            <th className="p-4">Kamar</th>
                            <th className="p-4">Jadwal</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                        {displayedBookings.length > 0 ? displayedBookings.map((b) => (
                            <tr key={b.id} className="hover:bg-gray-50 transition">
                                <td className="p-4">
                                    <span className="font-bold block text-gray-900">{b.guest_name}</span>
                                    <span className="text-xs text-gray-500">#{b.id} • {b.phone_number}</span>
                                </td>
                                <td className="p-4">
                                    <span className="block font-medium">{b.room?.name}</span>
                                    {activeTab === 'payments' && (
                                        <div className="text-xs text-[#D4AF37] font-bold mt-1">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits:0 }).format(b.total_price)}
                                        </div>
                                    )}
                                </td>
                                <td className="p-4 whitespace-nowrap text-xs">
                                    <div className="flex gap-2"><span className="w-6 text-gray-400">IN</span> <b>{b.check_in}</b></div>
                                    <div className="flex gap-2"><span className="w-6 text-gray-400">OUT</span> <b>{b.check_out}</b></div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                                        b.status === 'confirmed' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                        b.status === 'checked_in' ? 'bg-green-50 text-green-700 border-green-200' :
                                        'bg-gray-100 text-gray-500 border-gray-200'
                                    }`}>
                                        {b.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    {/* LOGIKA TOMBOL CERDAS BERDASARKAN TAB */}
                                    {activeTab === 'checkin' && b.status === 'confirmed' && (
                                        <button onClick={() => handleUpdateStatus(b.id, 'checked_in')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-xs font-bold shadow w-full">✅ Proses Check-In</button>
                                    )}
                                    {activeTab === 'checkout' && b.status === 'checked_in' && (
                                        <button onClick={() => handleUpdateStatus(b.id, 'checked_out')} className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded text-xs font-bold shadow w-full">👋 Proses Check-Out</button>
                                    )}
                                    {(activeTab === 'payments') && (
                                        <span className="text-gray-400 text-xs italic">Lihat Detail</span>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-400">Data tidak ditemukan di menu ini.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            )
        )}

      </div>
    </div>
  );
}