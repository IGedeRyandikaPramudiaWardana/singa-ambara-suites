"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

// DATA AWAL (DUMMY)
const initialBookings = [
  {
    id: "#10856",
    date: "Dec 11, 2025 12:58",
    amount: "Rp 854.700",
    status: "Waiting Your Payment",
    statusColor: "text-blue-600",
    bgStatus: "bg-blue-50",
    hotel: "Singa Ambara Suites",
    address: "Jl. Udayana No.26, Buleleng, Bali 80228",
    checkIn: "20 Dec 2025",
    checkOut: "22 Dec 2025",
    roomType: "Panji Room (Superior)",
    nights: 2,
    guest: "Juli Widiasari"
  },
  {
    id: "#10855",
    date: "Dec 11, 2025 12:57",
    amount: "Rp 854.700",
    status: "Failed",
    statusColor: "text-red-600",
    bgStatus: "bg-red-50",
    hotel: "Singa Ambara Suites",
    address: "Jl. Udayana No.26, Buleleng, Bali 80228",
    checkIn: "15 Dec 2025",
    checkOut: "17 Dec 2025",
    roomType: "Lovina Room (Deluxe)",
    nights: 2,
    guest: "Juli Widiasari"
  }
];

export default function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('home');
  
  // STATE SIDEBAR
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("booking"); 
  
  // STATE DATA BOOKING
  const [bookings, setBookings] = useState(initialBookings);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // STATE PEMBAYARAN
  const [paymentStep, setPaymentStep] = useState<'none' | 'select' | 'processing' | 'success'>('none');
  const [paymentMethod, setPaymentMethod] = useState("BCA Virtual Account");

  // Scroll Spy Logic
  useEffect(() => {
    if (pathname !== '/') return;
    const handleScroll = () => {
      const sections = ['home', 'about', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top >= -300 && rect.top <= 400;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const getLinkClass = (target: string) => {
    if (target === '/rooms' && pathname === '/rooms') {
       return "text-white font-bold border-b-2 border-[#D4AF37] pb-1 text-sm uppercase tracking-widest cursor-pointer";
    }
    const isSectionActive = pathname === '/' && activeSection === target.replace('/#', '');
    return isSectionActive
      ? "text-white font-bold border-b-2 border-[#D4AF37] pb-1 text-sm uppercase tracking-widest cursor-pointer transition duration-300" 
      : "text-gray-400 hover:text-white font-medium text-sm uppercase tracking-widest cursor-pointer transition duration-300";
  };

  // Reset saat sidebar tutup
  useEffect(() => {
    if (!isSidebarOpen) {
      setSelectedBooking(null);
      setPaymentStep('none');
    }
  }, [isSidebarOpen]);

  // FUNGSI PROSES BAYAR
  const handleProcessPayment = () => {
    setPaymentStep('processing');
    
    // Simulasi loading 2 detik
    setTimeout(() => {
      setPaymentStep('success');
      
      // Update status di database lokal (state)
      const updatedBookings = bookings.map(b => {
        if (b.id === selectedBooking.id) {
          return { 
            ...b, 
            status: "Paid", 
            statusColor: "text-green-600", 
            bgStatus: "bg-green-50" 
          };
        }
        return b;
      });
      setBookings(updatedBookings);
      
      // Update yang sedang dilihat juga
      setSelectedBooking((prev: any) => ({
        ...prev,
        status: "Paid",
        statusColor: "text-green-600",
        bgStatus: "bg-green-50"
      }));

    }, 2000);
  };

  return (
    <>
      {/* ================= NAVBAR UTAMA ================= */}
      <nav className="bg-[#0B1215] border-b border-white/10 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            <div className="flex items-center gap-6">
              <button onClick={() => setIsSidebarOpen(true)} className="text-white hover:text-[#D4AF37] focus:outline-none transition">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
              <Link href="/" className="text-2xl font-serif text-white tracking-wide">Singa Ambara Suites</Link>
            </div>
            
            <div className="hidden md:flex space-x-12">
              <Link href="/#home" className={getLinkClass('/#home')}>Home</Link>
              <Link href="/#about" className={getLinkClass('/#about')}>About</Link>
              <Link href="/#contact" className={getLinkClass('/#contact')}>Contact</Link>
              <Link href="/rooms" className={getLinkClass('/rooms')}>Rooms</Link>
            </div>

            <div className="flex-shrink-0">
              <Link href="/login" className="bg-[#9F8034] hover:bg-[#8A6E2A] text-white px-6 py-2.5 rounded-md font-bold text-sm flex items-center gap-2 transition duration-300">
                Register / Sign In <span className="text-lg">→</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>


      {/* ================= SIDEBAR (MEMBER AREA) ================= */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/70 z-[60] backdrop-blur-sm transition-opacity" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      <div className={`fixed top-0 left-0 h-full w-[450px] max-w-[90vw] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header Sidebar */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-800">Member Area</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 hover:text-red-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="flex h-full">
          
          {/* MENU KIRI */}
          <div className="w-1/3 bg-gray-50 border-r border-gray-200 py-6 flex flex-col gap-2 h-full">
            <button 
              onClick={() => {setActiveMenu('booking'); setSelectedBooking(null); setPaymentStep('none');}}
              className={`text-left px-4 py-3 text-sm font-medium ${activeMenu === 'booking' ? 'bg-white text-[#D4AF37] border-l-4 border-[#D4AF37] shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              My Booking
            </button>
            <button 
              onClick={() => {setActiveMenu('profile'); setSelectedBooking(null);}}
              className={`text-left px-4 py-3 text-sm font-medium ${activeMenu === 'profile' ? 'bg-white text-[#D4AF37] border-l-4 border-[#D4AF37] shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              Change Profile
            </button>
            <button onClick={() => alert("Logout berhasil!")} className="text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 mt-auto mb-32">Logout</button>
          </div>

          {/* KONTEN KANAN */}
          <div className="w-2/3 p-6 overflow-y-auto bg-white pb-32">
            
            {/* --- KONTEN: MY BOOKING --- */}
            {activeMenu === 'booking' && (
              <>
                {/* 1. LIST BOOKING */}
                {!selectedBooking ? (
                  <div className="space-y-4 animate-fadeIn">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Riwayat Booking</h3>
                    {bookings.map((booking, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-sm hover:border-[#D4AF37] transition">
                        <div className="mb-2">
                          <p className="font-bold text-gray-900">{booking.hotel}</p>
                          <p className="text-xs text-gray-500 truncate">{booking.address}</p>
                        </div>
                        <div className="border-t border-gray-100 my-2 pt-2 space-y-1">
                          <div className="flex justify-between"><span className="text-gray-500 text-xs">No. Invoice</span><span className="font-medium text-gray-800">{booking.id}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500 text-xs">Amount</span><span className="font-bold text-gray-800">{booking.amount}</span></div>
                          <div className="flex justify-between items-center mt-3">
                            <span className={`font-bold text-[10px] uppercase px-2 py-1 rounded ${booking.bgStatus} ${booking.statusColor}`}>{booking.status}</span>
                            <button onClick={() => setSelectedBooking(booking)} className="bg-[#9F8034] text-white text-xs px-4 py-1.5 rounded hover:bg-[#8A6E2A] transition">Select &rarr;</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  
                  /* 2. DETAIL BOOKING (INVOICE) */
                  <div className="animate-slideIn">
                    {/* Tombol Back */}
                    {paymentStep === 'none' && (
                      <button onClick={() => setSelectedBooking(null)} className="text-sm text-gray-500 hover:text-[#D4AF37] mb-4 flex items-center gap-1">&larr; Kembali ke List</button>
                    )}

                    {/* TAMPILAN PEMBAYARAN */}
                    {paymentStep === 'select' ? (
                      <div className="animate-fadeIn">
                         <h3 className="font-bold text-lg text-gray-900 mb-4">Pilih Pembayaran</h3>
                         <div className="space-y-3 mb-6">
                            {['BCA Virtual Account', 'Mandiri Virtual Account', 'GoPay', 'OVO'].map((method) => (
                              <label key={method} className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${paymentMethod === method ? 'border-[#D4AF37] bg-yellow-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input type="radio" name="payment" className="accent-[#D4AF37]" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                                <span className="ml-3 text-sm text-gray-700 font-medium">{method}</span>
                              </label>
                            ))}
                         </div>
                         <button onClick={handleProcessPayment} className="w-full bg-[#0B1215] text-white py-3 rounded font-bold text-sm hover:bg-black transition">Bayar Sekarang</button>
                         <button onClick={() => setPaymentStep('none')} className="w-full text-gray-500 py-3 text-sm hover:text-gray-800 mt-2">Batal</button>
                      </div>
                    ) : paymentStep === 'processing' ? (
                      <div className="flex flex-col items-center justify-center py-10 animate-fadeIn">
                        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#D4AF37] rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600 text-sm">Memproses Pembayaran...</p>
                      </div>
                    ) : (
                      /* TAMPILAN INVOICE NORMAL / SUKSES */
                      <div className="border border-gray-200 rounded-xl p-5 shadow-lg relative overflow-hidden bg-white">
                        <div className={`absolute top-0 left-0 w-full h-2 ${paymentStep === 'success' || selectedBooking.status === 'Paid' ? 'bg-green-500' : 'bg-[#D4AF37]'}`}></div>
                        
                        {/* Pesan Sukses (Jika baru bayar) */}
                        {paymentStep === 'success' && (
                           <div className="bg-green-100 text-green-700 px-3 py-2 rounded text-xs font-bold text-center mb-4 border border-green-200">
                             ✅ Pembayaran Berhasil!
                           </div>
                        )}

                        <div className="flex justify-between items-start mb-4 mt-2">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">INVOICE</h3>
                            <p className="text-xs text-gray-500">{selectedBooking.id}</p>
                          </div>
                          <div className={`text-xs font-bold px-2 py-1 rounded ${selectedBooking.bgStatus} ${selectedBooking.statusColor}`}>
                            {selectedBooking.status}
                          </div>
                        </div>

                        <div className="space-y-4 text-sm text-gray-700">
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="font-bold text-gray-900">{selectedBooking.hotel}</p>
                            <p className="text-xs text-gray-500">{selectedBooking.address}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div><p className="text-xs text-gray-500">Check-In</p><p className="font-medium">{selectedBooking.checkIn}</p></div>
                            <div><p className="text-xs text-gray-500">Check-Out</p><p className="font-medium">{selectedBooking.checkOut}</p></div>
                          </div>
                          <div><p className="text-xs text-gray-500">Tipe Kamar</p><p className="font-medium">{selectedBooking.roomType}</p></div>
                          <div className="border-t border-dashed border-gray-300 pt-3 flex justify-between items-center">
                            <span className="font-bold text-gray-600">Total</span>
                            <span className="font-bold text-xl text-[#D4AF37]">{selectedBooking.amount}</span>
                          </div>
                        </div>
                        
                        {/* Tombol Bayar (Hanya muncul jika status Waiting & tidak sedang sukses) */}
                        {selectedBooking.status === "Waiting Your Payment" && paymentStep !== 'success' && (
                          <button onClick={() => setPaymentStep('select')} className="w-full bg-[#0B1215] text-white py-3 rounded mt-6 font-bold text-sm hover:bg-black transition">
                            Bayar Sekarang
                          </button>
                        )}

                        {/* Tombol Tutup setelah sukses */}
                        {paymentStep === 'success' && (
                          <button onClick={() => {setPaymentStep('none'); setSelectedBooking(null);}} className="w-full border border-gray-300 text-gray-600 py-3 rounded mt-6 font-bold text-sm hover:bg-gray-50 transition">
                            Tutup
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* --- KONTEN: PROFILE --- */}
            {activeMenu === 'profile' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Edit Profile</h3>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden border-2 border-[#D4AF37]">
                    <img src="https://ui-avatars.com/api/?name=Juli+Widiasari&background=random&size=128" alt="Profile" />
                  </div>
                  <div className="space-y-3">
                    <div><label className="text-xs text-gray-500">Nama Lengkap</label><input type="text" value="Juli Widiasari" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-800" readOnly /></div>
                    <div><label className="text-xs text-gray-500">Email</label><input type="email" value="juli@example.com" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-800" readOnly /></div>
                    <button className="w-full bg-[#9F8034] text-white py-2 rounded text-sm mt-4 font-bold hover:bg-[#8A6E2A]">Simpan Perubahan</button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}