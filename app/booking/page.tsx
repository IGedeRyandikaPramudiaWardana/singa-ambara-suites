"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";

// Data Kamar (Sama seperti di halaman Rooms)
const roomsData = [
  { id: "panji", name: "Panji Room", price: 450000, img: "https://images.unsplash.com/photo-1611892440504-42a792e24d32" },
  { id: "lovina", name: "Lovina Room", price: 650000, img: "https://images.unsplash.com/photo-1591088398332-8a7791972843" },
  { id: "buleleng", name: "Buleleng Suite", price: 1250000, img: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461" },
];

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Ambil data kamar dari URL (misal: /booking?room=panji)
  const roomParam = searchParams.get("room");
  
  // State Form
  const [selectedRoomId, setSelectedRoomId] = useState(roomParam || "panji");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestName, setGuestName] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // Untuk Pop-up Sukses

  // Cari detail kamar yang dipilih
  const selectedRoom = roomsData.find(r => r.id === selectedRoomId) || roomsData[0];

  // Hitung Durasi Malam & Total Harga
  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays > 0 ? diffDays * selectedRoom.price : 0;
  };

  const totalDays = checkIn && checkOut ? Math.ceil(Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const totalPrice = calculateTotal();

  // Handle Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Tampilkan Pop-up Sukses
    setIsSuccess(true);
    // Redirect ke Home setelah 3 detik
    setTimeout(() => {
      router.push("/");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0F1619] text-white pt-10 pb-20 px-4">
      
      {/* Header Kecil */}
      <div className="max-w-6xl mx-auto mb-8">
        <Link href="/rooms" className="text-gray-400 hover:text-[#D4AF37] mb-4 inline-block">&larr; Kembali ke Daftar Kamar</Link>
        <h1 className="text-3xl md:text-4xl font-serif text-[#FFD700]">Konfirmasi Pemesanan</h1>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* KOLOM KIRI: FORM DATA */}
        <div className="lg:col-span-2">
          <div className="bg-[#1A2225] p-6 md:p-8 rounded-xl border border-white/10 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 border-b border-gray-700 pb-2">Informasi Tamu</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Nama Lengkap */}
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Nama Lengkap</label>
                <input 
                  required
                  type="text" 
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-[#0F1619] border border-gray-600 rounded p-3 text-white focus:border-[#D4AF37] focus:outline-none"
                  placeholder="Masukkan nama sesuai KTP"
                />
              </div>

              {/* Pilihan Kamar (Bisa diganti manual juga) */}
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Tipe Kamar</label>
                <select 
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="w-full bg-[#0F1619] border border-gray-600 rounded p-3 text-white focus:border-[#D4AF37] focus:outline-none"
                >
                  {roomsData.map(room => (
                    <option key={room.id} value={room.id}>{room.name}</option>
                  ))}
                </select>
              </div>

              {/* Tanggal Check-in & Check-out */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Check-In</label>
                  <input 
                    required
                    type="date" 
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-[#0F1619] border border-gray-600 rounded p-3 text-white focus:border-[#D4AF37] focus:outline-none [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Check-Out</label>
                  <input 
                    required
                    type="date" 
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-[#0F1619] border border-gray-600 rounded p-3 text-white focus:border-[#D4AF37] focus:outline-none [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Tombol Submit */}
              <button 
                type="submit"
                className="w-full bg-[#9F8034] hover:bg-[#8A6E2A] text-white font-bold py-4 rounded mt-4 transition duration-300 shadow-lg text-lg uppercase tracking-widest"
              >
                Konfirmasi Booking
              </button>

            </form>
          </div>
        </div>

        {/* KOLOM KANAN: RINGKASAN PESANAN (Sticky) */}
        <div className="lg:col-span-1">
          <div className="bg-[#1A2225] p-6 rounded-xl border border-[#D4AF37] sticky top-24 shadow-2xl">
            <h3 className="text-lg font-bold text-[#D4AF37] mb-4 text-center uppercase tracking-widest">Ringkasan Pesanan</h3>
            
            <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4">
              <Image src={selectedRoom.img} alt={selectedRoom.name} fill className="object-cover" />
            </div>

            <div className="space-y-3 text-sm border-b border-gray-700 pb-4 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Tipe Kamar</span>
                <span className="font-bold">{selectedRoom.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Harga/Malam</span>
                <span>Rp {selectedRoom.price.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Durasi</span>
                <span>{totalDays > 0 ? totalDays : 0} Malam</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total</span>
              <span className="text-[#D4AF37]">Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              *Pembayaran dilakukan saat check-in (Pay at Hotel)
            </p>
          </div>
        </div>

      </div>

      {/* MODAL / POPUP SUKSES */}
      {isSuccess && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] backdrop-blur-sm">
          <div className="bg-[#1A2225] p-8 rounded-2xl border border-[#D4AF37] text-center max-w-sm mx-4 shadow-2xl transform scale-100 animate-bounce-in">
            <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 className="text-2xl font-serif text-[#FFD700] mb-2">Booking Berhasil!</h2>
            <p className="text-gray-300 mb-6">Terima kasih, {guestName}.<br/>Pesanan Anda untuk <strong>{selectedRoom.name}</strong> telah kami terima.</p>
            <p className="text-sm text-gray-500">Mengalihkan ke Beranda...</p>
          </div>
        </div>
      )}

    </div>
  );
}

// Wrapper Suspense (Wajib di Next.js App Router)
export default function BookingPage() {
  return (
    <Suspense fallback={<div className="text-white text-center pt-20">Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}