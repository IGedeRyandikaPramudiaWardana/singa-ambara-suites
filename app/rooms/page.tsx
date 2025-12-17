"use client"; // Wajib agar fitur ketik/klik berfungsi

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

// 1. DATA KAMAR
const roomsData = [
  {
    id: "panji",
    name: "Panji Room",
    category: "Superior",
    price: "Rp 450.000",
    desc: "Dirancang dengan sentuhan modern yang efisien, Panji Room menawarkan kenyamanan tanpa kompromi. Pilihan tepat bagi pelancong aktif.",
    facilities: ["24 m² Size", "Queen Bed", "Smart TV", "Rain Shower"],
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop",
    link: "/kamar/panji"
  },
  {
    id: "lovina",
    name: "Lovina Room",
    category: "Deluxe",
    price: "Rp 650.000",
    desc: "Menghadirkan ruang yang lebih lega dengan nuansa relaksasi. Dilengkapi balkon pribadi untuk menikmati udara segar dan pemandangan taman.",
    facilities: ["32 m² Size", "King Bed", "Private Balcony", "Work Desk"],
    image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=1974&auto=format&fit=crop",
    link: "/kamar/lovina"
  },
  {
    id: "buleleng",
    name: "Buleleng Suite",
    category: "Suite",
    price: "Rp 1.250.000",
    desc: "Definisi kemewahan tertinggi. Dilengkapi ruang tamu terpisah, bathtub, dan amenitas premium untuk pengalaman tak terlupakan.",
    facilities: ["56 m² Size", "Bathtub", "Living Room", "Minibar"],
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop",
    link: "/kamar/buleleng"
  }
];

export default function RoomsPage() {
  // 2. STATE
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // 3. LOGIKA FILTER
  const filteredRooms = roomsData.filter((room) => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || room.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    // Tambahkan pt-28 (padding-top) agar Search Bar tidak tertutup Navbar
    <main className="min-h-screen bg-[#0F1619] text-white pb-20 pt-28">
      
      {/* SEARCH & FILTER BAR (LANGSUNG DI ATAS) */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10 mb-16">
        <div className="bg-[#1A2225] p-6 rounded-xl shadow-2xl border border-white/10 flex flex-col md:flex-row gap-4 items-center">
          
          {/* Input Search */}
          <div className="relative w-full md:flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input 
              type="text" 
              placeholder="Cari nama kamar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0F1619] text-white pl-12 pr-4 py-3 rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none transition placeholder-gray-500"
            />
          </div>

          {/* Dropdown Filter */}
          <div className="w-full md:w-64">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#0F1619] text-white px-4 py-3 rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none cursor-pointer appearance-none"
              style={{ backgroundImage: 'none' }} 
            >
              <option value="All">Semua Kategori</option>
              <option value="Superior">Superior Class</option>
              <option value="Deluxe">Deluxe Class</option>
              <option value="Suite">Executive Suite</option>
            </select>
          </div>

        </div>
      </div>

      {/* LIST KAMAR */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 space-y-24">
        
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room, index) => (
            <div key={room.id} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 md:gap-16`}>
              
              {/* Gambar */}
              <div className="md:w-1/2 w-full h-[350px] md:h-[400px] relative rounded-lg overflow-hidden shadow-2xl border border-white/5 group">
                <Image 
                  src={room.image} 
                  alt={room.name} fill className="object-cover group-hover:scale-105 transition duration-700"
                />
              </div>

              {/* Teks Informasi */}
              <div className="md:w-1/2 text-left space-y-6">
                <div>
                  <div className="flex justify-between items-start">
                    <h2 className="text-[#FFD700] text-4xl font-serif mb-2">{room.name}</h2>
                    <span className="bg-[#1A2225] border border-[#D4AF37] text-[#D4AF37] text-xs px-2 py-1 rounded uppercase tracking-wider">
                      {room.category}
                    </span>
                  </div>
                  <p className="text-xl font-bold text-white">{room.price} <span className="text-sm font-normal text-gray-500">/malam</span></p>
                </div>
                
                <p className="text-gray-300 leading-relaxed font-light text-lg">
                  {room.desc}
                </p>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-400 font-mono pt-2">
                  {room.facilities.map((fac, i) => (
                    <span key={i}>• {fac}</span>
                  ))}
                </div>

                <div className="flex gap-4 pt-6">
                  <Link href={room.link} className="border border-[#D4AF37] text-[#D4AF37] px-8 py-3 rounded hover:bg-[#D4AF37] hover:text-white transition duration-300 font-bold uppercase text-sm">
                    Detail
                  </Link>
                  <Link 
                    href={`/booking?room=${room.id}`}
                    className="bg-[#9F8034] text-white px-8 py-3 rounded hover:bg-[#8A6E2A] transition duration-300 font-bold uppercase text-sm flex items-center justify-center"
                  >
                    Book Now
                  </Link>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">Maaf, kamar yang Anda cari tidak ditemukan.</p>
            <button 
              onClick={() => {setSearchTerm(""); setSelectedCategory("All");}}
              className="text-[#D4AF37] hover:underline mt-4"
            >
              Reset Pencarian
            </button>
          </div>
        )}

      </div>
    </main>
  );
}