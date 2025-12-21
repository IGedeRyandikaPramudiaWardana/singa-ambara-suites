"use client";

import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomSlug = searchParams.get("room");

  // --- STATE DATA KAMAR ---
  const [room, setRoom] = useState<any>(null);
  
  // --- STATE FORM INPUT ---
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestName, setGuestName] = useState(""); // Nama sesuai KTP
  const [phone, setPhone] = useState("");         // No HP
  const [paymentMethod, setPaymentMethod] = useState("QRIS"); // Default

  // --- STATE PERHITUNGAN ---
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);
  
  // --- STATE UI ---
  const [isLoading, setIsLoading] = useState(false); // Loading Bayar
  const [isPageLoading, setIsPageLoading] = useState(true); // Loading Data

  // 1. AMBIL DATA KAMAR & USER
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("user_name");

    if (!token) {
      router.push(`/login?returnUrl=/booking?room=${roomSlug}`);
      return;
    }

    // Auto-fill nama dari akun (biar user tidak ngetik dari nol)
    if (storedName) setGuestName(storedName);

    const fetchRoom = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        const res = await fetch(`${apiUrl}/rooms/${roomSlug}`);
        const data = await res.json();
        if (res.ok) setRoom({ ...data, price: Number(data.price) });
      } catch (error) {
        console.error("Error", error);
      } finally {
        setIsPageLoading(false);
      }
    };

    if (roomSlug) fetchRoom();
  }, [roomSlug, router]);

  // 2. HITUNG HARGA OTOMATIS
  useEffect(() => {
    if (checkIn && checkOut && room) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      if (diffDays > 0) {
        setNights(diffDays);
        setTotalPrice(diffDays * room.price);
      } else {
        setNights(0);
        setTotalPrice(0);
      }
    }
  }, [checkIn, checkOut, room]);

  // 3. LOGIKA PROSES BAYAR (SIMULASI)
  const handlePaymentAndBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // --- SIMULASI DELAY (EFEK LOADING BANK) ---
    // Kita tahan 2.5 detik biar terlihat "mikir"
    await new Promise(resolve => setTimeout(resolve, 2500));

    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

      const res = await fetch(`${apiUrl}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          room_id: room.id,
          check_in: checkIn,
          check_out: checkOut,
          total_price: totalPrice,
          // Kirim data baru
          guest_name: guestName,
          phone_number: phone,
          payment_method: paymentMethod
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gagal Booking");

      // Redirect ke Halaman Sukses / History
      alert("🎉 Pembayaran Berhasil! Pesanan Anda telah terkonfirmasi.");
      router.push("/my-bookings");

    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isPageLoading) return <div className="text-white text-center pt-20 animate-pulse">Memuat data booking...</div>;
  if (!room) return <div className="text-white text-center pt-20">Kamar tidak ditemukan.</div>;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
      
      {/* BAGIAN KIRI: FORM DATA (2/3 Lebar) */}
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-[#D4AF37] mb-2">Konfirmasi & Pembayaran</h1>
          <p className="text-gray-400">Lengkapi data diri untuk menyelesaikan reservasi.</p>
        </div>

        <form onSubmit={handlePaymentAndBooking} className="space-y-6">
          
          {/* 1. JADWAL MENGINAP */}
          <div className="bg-[#1A2225] p-6 rounded-xl border border-gray-800">
            <h3 className="text-white font-bold mb-4 border-b border-gray-700 pb-2">1. Jadwal Menginap</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-widest">Check-In</label>
                <input 
                  type="date" required
                  className="w-full bg-[#0F1619] border border-gray-700 rounded p-3 text-white focus:border-[#D4AF37] outline-none transition"
                  value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-widest">Check-Out</label>
                <input 
                  type="date" required
                  className="w-full bg-[#0F1619] border border-gray-700 rounded p-3 text-white focus:border-[#D4AF37] outline-none transition"
                  value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 2. DATA TAMU (SESUAI KTP) */}
          <div className="bg-[#1A2225] p-6 rounded-xl border border-gray-800">
            <h3 className="text-white font-bold mb-4 border-b border-gray-700 pb-2">2. Data Tamu (Sesuai KTP)</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-widest">Nama Lengkap</label>
                <input 
                  type="text" required placeholder="Sesuai Kartu Identitas"
                  className="w-full bg-[#0F1619] border border-gray-700 rounded p-3 text-white focus:border-[#D4AF37] outline-none placeholder-gray-600 transition"
                  value={guestName} onChange={(e) => setGuestName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-widest">Nomor WhatsApp / Telepon</label>
                <input 
                  type="tel" required placeholder="Contoh: 081234567890"
                  className="w-full bg-[#0F1619] border border-gray-700 rounded p-3 text-white focus:border-[#D4AF37] outline-none placeholder-gray-600 transition"
                  value={phone} onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 3. METODE PEMBAYARAN */}
          <div className="bg-[#1A2225] p-6 rounded-xl border border-gray-800">
            <h3 className="text-white font-bold mb-4 border-b border-gray-700 pb-2">3. Metode Pembayaran</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {['QRIS', 'BCA Virtual Acc', 'Mandiri', 'Kartu Kredit'].map((method) => (
                <div 
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`p-4 rounded border cursor-pointer flex flex-col items-center justify-center text-sm font-bold transition h-20 text-center ${
                    paymentMethod === method 
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]' 
                    : 'bg-[#0F1619] border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {method}
                </div>
              ))}
            </div>
            
            {/* Visualisasi QRIS jika dipilih */}
            {paymentMethod === 'QRIS' && (
                <div className="mt-6 p-6 bg-white rounded flex flex-col items-center justify-center animate-pulse border-4 border-[#D4AF37]">
                    <p className="text-black text-sm mb-3 font-bold">SCAN QRIS UNTUK MEMBAYAR</p>
                    {/* Placeholder QR Code */}
                    <div className="w-40 h-40 bg-gray-200 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-500">
                        <svg className="w-20 h-20 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                    </div>
                    <p className="text-gray-500 text-xs mt-2">Otomatis terverifikasi setelah scan</p>
                </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isLoading || nights <= 0}
            className="w-full bg-[#9F8034] hover:bg-[#8A6E2A] text-white py-5 rounded-lg font-bold text-lg uppercase tracking-widest transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
          >
            {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sedang Memproses...
                </span>
            ) : "Bayar Sekarang"}
          </button>
        </form>
      </div>

      {/* BAGIAN KANAN: RINGKASAN (Sticky) */}
      <div className="lg:col-span-1">
         <div className="bg-[#1A2225] p-6 rounded-xl border border-[#D4AF37]/20 sticky top-24 shadow-2xl">
            <h3 className="text-[#D4AF37] font-serif text-xl mb-4 border-b border-gray-700 pb-2">Ringkasan Pesanan</h3>
            
            <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4 border border-gray-700">
              <Image src={room.image} alt={room.name} fill className="object-cover" />
            </div>

            <h4 className="text-white text-lg font-bold">{room.name}</h4>
            <p className="text-gray-400 text-sm mb-4">{room.category}</p>

            <div className="space-y-3 text-sm text-gray-300 border-t border-gray-700 pt-4">
               <div className="flex justify-between">
                  <span>Harga/malam</span>
                  <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits:0 }).format(room.price)}</span>
               </div>
               <div className="flex justify-between">
                  <span>Durasi</span>
                  <span>{nights} Malam</span>
               </div>
               
               {/* Garis Total */}
               <div className="flex justify-between text-[#D4AF37] text-xl font-bold pt-4 border-t border-gray-700 mt-2">
                  <span>Total Bayar</span>
                  <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits:0 }).format(totalPrice)}</span>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}

// WRAPPER (Wajib)
export default function BookingPage() {
  return (
    <div className="min-h-screen bg-[#0F1619] pt-24 pb-20">
      <Suspense fallback={<div className="text-white text-center pt-20">Loading...</div>}>
        <BookingForm />
      </Suspense>
    </div>
  );
}