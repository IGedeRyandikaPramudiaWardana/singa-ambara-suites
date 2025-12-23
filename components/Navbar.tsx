"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import api from '@/lib/axios'; // Pastikan import axios instance

// --- TYPE DEFINITIONS ---
interface Booking {
  id: string; 
  originalId: number; 
  date: string;
  amount: string;
  status: string;
  statusColor: string;
  bgStatus: string;
  hotel: string;
  address: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  nights: number;
  guest: string;
  paymentMethod: string;
  phoneNumber: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // 1. LOGIKA HIDE: JANGAN TAMPIL DI HALAMAN ADMIN
  if (pathname?.startsWith('/admin')) {
    return null; 
  }
  
  // STATE NAVIGASI
  const [activeSection, setActiveSection] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<"booking" | "profile">("booking"); 

  // STATE USER & PROFILE
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null); // Tambah State Email
  const [userRole, setUserRole] = useState<string | null>(null);
  
  // STATE GANTI PASSWORD
  const [passData, setPassData] = useState({
      current_password: "",
      new_password: "",
      new_password_confirmation: ""
  });
  const [passMsg, setPassMsg] = useState({ type: "", text: "" });
  const [isSavingPass, setIsSavingPass] = useState(false);
  
  // STATE DATA BOOKING
  const [bookings, setBookings] = useState<Booking[]>([]); 
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  // STATE PEMBAYARAN (Simulasi Client-Side)
  const [paymentStep, setPaymentStep] = useState<'none' | 'select' | 'processing' | 'success'>('none');
  const [paymentMethod, setPaymentMethod] = useState("BCA Virtual Account");

  // ==========================================
  // 2. SINYAL LOGIN/LOGOUT & FETCH PROFIL
  // ==========================================
  
  // Fungsi ambil data user terbaru dari API
  const fetchUserProfile = async () => {
    try {
        const res = await api.get('/user');
        setUserName(res.data.name);
        setUserEmail(res.data.email);
        setUserRole(res.data.role);
    } catch (error) {
        console.error("Gagal load profile", error);
        // Jika token invalid, logout otomatis
        handleLogout();
    }
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const storedToken = localStorage.getItem("token");
      
      if (storedToken) {
        // Panggil API untuk dapat data terbaru
        fetchUserProfile();
      } else {
        setUserName(null);
        setUserEmail(null);
        setUserRole(null);
      }
    };

    checkLoginStatus();
    window.addEventListener("auth-change", checkLoginStatus);
    return () => {
      window.removeEventListener("auth-change", checkLoginStatus);
    };
  }, []);

  // ==========================================
  // 3. FETCH REAL DATA BOOKING
  // ==========================================
  useEffect(() => {
    if (isSidebarOpen && activeMenu === 'booking' && userName) {
      fetchRealBookings();
    }
  }, [isSidebarOpen, activeMenu, userName]);

  const fetchRealBookings = async () => {
    setIsLoadingData(true);
    try {
      const res = await api.get('/my-bookings');
      
      const mappedData: Booking[] = res.data.map((item: any) => {
           let statusColor = "text-green-600";
           let bgStatus = "bg-green-50";
           
           if (item.status === 'pending') {
              statusColor = "text-yellow-600";
              bgStatus = "bg-yellow-50";
           } else if (item.status === 'cancelled') {
              statusColor = "text-red-600";
              bgStatus = "bg-red-50";
           }

           return {
              id: `#${item.id}`,
              originalId: item.id,
              date: new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit'}),
              amount: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.total_price),
              status: item.status.charAt(0).toUpperCase() + item.status.slice(1), 
              statusColor: statusColor,
              bgStatus: bgStatus,
              hotel: "Singa Ambara Suites",
              address: "Jl. Udayana No.26, Buleleng, Bali",
              checkIn: item.check_in,
              checkOut: item.check_out,
              roomType: item.room ? item.room.name : "Unknown Room",
              nights: item.total_days || 1,
              guest: item.guest_name || userName || "Guest",
              paymentMethod: item.payment_method || 'Bayar di Hotel',
              phoneNumber: item.phone_number || '-'
           };
        });

        setBookings(mappedData);
    } catch (err) {
      console.error("Gagal ambil booking:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  // ==========================================
  // 4. FUNGSI GANTI PASSWORD
  // ==========================================
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg({ type: "", text: "" });
    setIsSavingPass(true);

    try {
        await api.post('/update-password', passData);
        setPassMsg({ type: "success", text: "Password berhasil diubah!" });
        setPassData({ current_password: "", new_password: "", new_password_confirmation: "" });
    } catch (error: any) {
        const errorMsg = error.response?.data?.message || "Gagal mengubah password.";
        setPassMsg({ type: "error", text: errorMsg });
    } finally {
        setIsSavingPass(false);
    }
  };

  // 5. SCROLL SPY LOGIC
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

  // 6. RESET STATE SAAT SIDEBAR DITUTUP
  useEffect(() => {
    if (!isSidebarOpen) {
      setTimeout(() => {
        setSelectedBooking(null);
        setPaymentStep('none');
        setPassMsg({ type: "", text: "" }); // Reset pesan error password
      }, 300);
    }
  }, [isSidebarOpen]);

  const getLinkClass = (target: string) => {
    if (target === '/rooms' && pathname === '/rooms') {
       return "text-white font-bold border-b-2 border-[#D4AF37] pb-1 text-sm uppercase tracking-widest cursor-pointer";
    }
    const isSectionActive = pathname === '/' && activeSection === target.replace('/#', '');
    return isSectionActive
      ? "text-white font-bold border-b-2 border-[#D4AF37] pb-1 text-sm uppercase tracking-widest cursor-pointer transition duration-300" 
      : "text-gray-400 hover:text-white font-medium text-sm uppercase tracking-widest cursor-pointer transition duration-300";
  };

  const handleLogout = () => {
    localStorage.clear(); 
    window.dispatchEvent(new Event("auth-change")); 
    setUserName(null);
    setUserEmail(null);
    setUserRole(null);
    setIsSidebarOpen(false);
    router.push("/");
  };

  const handleProcessPayment = () => {
    if (!selectedBooking) return;
    setPaymentStep('processing');
    
    setTimeout(() => {
      setPaymentStep('success');
      setSelectedBooking(prev => prev ? ({
        ...prev,
        status: "Paid",
        statusColor: "text-green-600",
        bgStatus: "bg-green-50"
      }) : null);
    }, 2000);
  };

  return (
    <>
      {/* ================= NAVBAR UTAMA ================= */}
      <nav className="bg-[#0B1215] border-b border-white/10 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="text-white hover:text-[#D4AF37] focus:outline-none transition p-1"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
              <Link href="/" className="text-2xl font-serif text-white tracking-wide hover:text-gray-200 transition">
                Singa Ambara Suites
              </Link>
            </div>
            
            <div className="hidden md:flex space-x-12">
              <Link href="/#home" className={getLinkClass('/#home')}>Home</Link>
              <Link href="/#about" className={getLinkClass('/#about')}>About</Link>
              <Link href="/#contact" className={getLinkClass('/#contact')}>Contact</Link>
              <Link href="/rooms" className={getLinkClass('/rooms')}>Rooms</Link>
            </div>

            <div className="flex-shrink-0">
              {userName ? (
                <div onClick={() => setIsSidebarOpen(true)} className="flex items-center gap-3 cursor-pointer group">
                  <div className="text-right hidden md:block">
                    <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider group-hover:text-white transition">Welcome</p>
                    <p className="text-white text-sm font-medium">{userName}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#1A2225] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#1A2225] transition">
                    <span className="font-bold text-lg">{userName.charAt(0)}</span>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="bg-[#9F8034] hover:bg-[#8A6E2A] text-white px-6 py-2.5 rounded-md font-bold text-sm flex items-center gap-2 transition duration-300 shadow-lg">
                  Register / Sign In <span className="text-lg">→</span>
                </Link>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* ================= SIDEBAR ================= */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-[60] backdrop-blur-sm transition-opacity duration-300" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`fixed top-0 left-0 h-full w-[500px] max-w-[85vw] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header Sidebar */}
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-[#0B1215] text-[#D4AF37] flex items-center justify-center font-bold">
                {userName ? userName.charAt(0) : "G"}
             </div>
             <div>
                <h2 className="text-lg font-bold text-gray-800 leading-tight">
                    {userName || "Guest User"}
                </h2>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {userRole === 'super_admin' ? 'Super Admin' : userRole === 'admin' ? 'Hotel Admin' : 'Member Area'}
                </p>
             </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-red-500 transition p-2 bg-white rounded-full shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Body Sidebar */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* MENU KIRI */}
          <div className="w-1/3 bg-gray-50 border-r border-gray-200 py-6 flex flex-col gap-1 h-full">
            <button 
              onClick={() => {setActiveMenu('booking'); setSelectedBooking(null); setPaymentStep('none');}}
              className={`text-left px-5 py-3 text-sm font-medium transition-all duration-200 border-l-4 ${activeMenu === 'booking' ? 'bg-white text-[#9F8034] border-[#9F8034] shadow-sm' : 'border-transparent text-gray-600 hover:bg-gray-200'}`}
            >
              📅 My Booking
            </button>
            <button 
              onClick={() => {setActiveMenu('profile'); setSelectedBooking(null);}}
              className={`text-left px-5 py-3 text-sm font-medium transition-all duration-200 border-l-4 ${activeMenu === 'profile' ? 'bg-white text-[#9F8034] border-[#9F8034] shadow-sm' : 'border-transparent text-gray-600 hover:bg-gray-200'}`}
            >
              👤 Edit Profile
            </button>

            {/* --- TOMBOL ADMIN PANEL DINAMIS --- */}
            {(userRole === "admin" || userRole === "super_admin") && (
                <Link 
                    href="/admin/dashboard" 
                    onClick={() => setIsSidebarOpen(false)}
                    className="text-left px-5 py-3 text-sm font-bold text-red-600 border-l-4 border-transparent hover:bg-red-50 transition flex items-center gap-2 mt-4"
                >
                    👮‍♂️ Admin Panel
                </Link>
            )}
            
            <div className="mt-auto px-5 pb-8">
                {userName ? (
                   <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition border border-red-200">
                     🚪 Logout
                   </button>
                ) : (
                   <Link href="/login" className="block w-full text-center px-4 py-2 text-sm font-bold text-white bg-[#0B1215] hover:bg-black rounded-md transition">
                     Login Now
                   </Link>
                )}
            </div>
          </div>

          {/* KONTEN KANAN */}
          <div className="w-2/3 p-6 overflow-y-auto bg-white pb-20 relative">
            
            {/* --- KONTEN: MY BOOKING --- */}
            {activeMenu === 'booking' && (
              <div className="transition-opacity duration-300 ease-in opacity-100">
                  {!userName ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <span className="text-4xl mb-2">🔒</span>
                        <p className="text-gray-500 text-sm">Silakan Login untuk melihat riwayat.</p>
                    </div>
                  ) : isLoadingData ? (
                    <div className="flex flex-col items-center justify-center h-64">
                       <div className="w-8 h-8 border-4 border-gray-200 border-t-[#9F8034] rounded-full animate-spin mb-2"></div>
                       <p className="text-xs text-gray-400">Mengambil data...</p>
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center mt-10">
                        <p className="text-gray-500 text-sm mb-2">Belum ada booking.</p>
                        <Link href="/rooms" onClick={() => setIsSidebarOpen(false)} className="text-[#9F8034] text-xs font-bold underline">Cari kamar sekarang</Link>
                    </div>
                  ) : !selectedBooking ? (
                  // LIST BOOKING
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2 flex justify-between items-center">
                        Riwayat Booking
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-500 font-normal">{bookings.length} Transaksi</span>
                    </h3>
                    
                    {bookings.map((booking, idx) => (
                      <div key={idx} className="group bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-sm hover:border-[#9F8034] hover:shadow-md transition cursor-pointer" onClick={() => setSelectedBooking(booking)}>
                        <div className="flex justify-between items-start mb-2">
                           <div className="font-bold text-gray-800 truncate pr-2">{booking.hotel}</div>
                           <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded whitespace-nowrap ${booking.bgStatus} ${booking.statusColor}`}>{booking.status}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3 truncate">{booking.roomType}</p>
                        
                        <div className="flex justify-between items-end border-t border-dashed border-gray-200 pt-3">
                            <div>
                                <p className="text-[10px] text-gray-400">Total Bayar</p>
                                <p className="font-bold text-gray-800">{booking.amount}</p>
                            </div>
                            <span className="text-[#9F8034] text-xs font-bold group-hover:translate-x-1 transition-transform">Detail &rarr;</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // DETAIL BOOKING (INVOICE)
                  <div className="transition-all duration-300">
                    <button onClick={() => setSelectedBooking(null)} className="text-xs font-bold text-gray-500 hover:text-[#9F8034] mb-4 flex items-center gap-1 transition">
                        &larr; Kembali ke List
                    </button>

                    {paymentStep === 'select' ? (
                      <div className="animate-pulse-once">
                          <h3 className="font-bold text-lg text-gray-900 mb-1">Pilih Pembayaran</h3>
                          <div className="space-y-3 mb-6">
                            {['BCA Virtual Account', 'Mandiri Virtual Account', 'GoPay', 'OVO'].map((method) => (
                              <label key={method} className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${paymentMethod === method ? 'border-[#9F8034] bg-yellow-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input type="radio" name="payment" className="accent-[#9F8034]" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                                <span className="ml-3 text-sm text-gray-700 font-medium">{method}</span>
                              </label>
                            ))}
                          </div>
                          <button onClick={handleProcessPayment} className="w-full bg-[#0B1215] text-white py-3 rounded-lg font-bold text-sm hover:bg-black transition shadow-lg">Bayar Sekarang</button>
                          <button onClick={() => setPaymentStep('none')} className="w-full text-gray-500 py-3 text-sm hover:text-red-600 mt-2 transition">Batal</button>
                      </div>
                    ) : paymentStep === 'processing' ? (
                      <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#9F8034] rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-800 font-bold text-sm">Memproses Pembayaran...</p>
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-xl shadow-lg relative overflow-hidden bg-white">
                        <div className={`h-2 w-full ${selectedBooking.status === 'Paid' || paymentStep === 'success' ? 'bg-green-500' : 'bg-[#9F8034]'}`}></div>
                        
                        <div className="p-5">
                            {paymentStep === 'success' && (
                               <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-xs font-bold text-center mb-5 border border-green-200">
                                  ✅ Pembayaran Berhasil!
                               </div>
                            )}

                            {/* Header Invoice */}
                            <div className="flex justify-between items-start mb-6">
                              <div>
                                <h3 className="font-bold text-xl text-gray-900 tracking-tight">INVOICE</h3>
                                <p className="text-xs text-gray-400 mt-1 font-mono">{selectedBooking.id}</p>
                              </div>
                              <div className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${selectedBooking.bgStatus} ${selectedBooking.statusColor}`}>
                                {selectedBooking.status}
                              </div>
                            </div>

                            <div className="space-y-5 text-sm text-gray-700">
                              {/* Info Hotel */}
                              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <p className="font-bold text-gray-900 mb-1">{selectedBooking.hotel}</p>
                                <p className="text-xs text-gray-500">{selectedBooking.address}</p>
                              </div>
                              
                              {/* Tanggal */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-2 border border-gray-100 rounded">
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Check-In</p>
                                    <p className="font-bold text-gray-800">{selectedBooking.checkIn}</p>
                                </div>
                                <div className="p-2 border border-gray-100 rounded">
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Check-Out</p>
                                    <p className="font-bold text-gray-800">{selectedBooking.checkOut}</p>
                                </div>
                              </div>
                              
                              {/* Info Pembayaran Tambahan */}
                              <div className="grid grid-cols-2 gap-4 border-t border-dashed border-gray-200 pt-3">
                                 <div>
                                     <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Metode Bayar</p>
                                     <p className="font-bold text-[#D4AF37]">{selectedBooking.paymentMethod}</p>
                                 </div>
                                 <div>
                                     <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Kontak Tamu</p>
                                     <p className="font-bold text-gray-800">{selectedBooking.phoneNumber}</p>
                                 </div>
                              </div>

                              {/* Total */}
                              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                <span className="font-bold text-gray-700">Total Tagihan</span>
                                <span className="font-bold text-xl text-[#9F8034]">{selectedBooking.amount}</span>
                              </div>
                            </div>

                            {/* Tombol Tutup */}
                            {paymentStep === 'success' && (
                              <button onClick={() => {setPaymentStep('none'); setSelectedBooking(null);}} className="w-full border border-gray-300 text-gray-600 py-3 rounded-lg mt-6 font-bold text-sm hover:bg-gray-50 transition">
                                Tutup Invoice
                              </button>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* --- KONTEN: PROFILE (SEKARANG DINAMIS & ADA GANTI PASSWORD) --- */}
            {activeMenu === 'profile' && (
              <div className="space-y-6 transition-opacity duration-300 ease-in opacity-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Pengaturan Akun</h3>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex flex-col items-center mb-6">
                      <div className="w-24 h-24 bg-gray-100 rounded-full mb-3 overflow-hidden border-4 border-white shadow-md relative">
                        <img src={`https://ui-avatars.com/api/?name=${userName || 'User'}&background=random&size=128`} alt="Profile" className="w-full h-full object-cover"/>
                      </div>
                  </div>
                  
                  {/* FORM DATA DIRI (READ ONLY) */}
                  <div className="space-y-4 mb-8">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Nama Lengkap</label>
                        <input type="text" value={userName || ""} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#9F8034]" readOnly />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Email</label>
                        <input type="email" value={userEmail || "Memuat email..."} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#9F8034]" readOnly />
                    </div>
                  </div>

                  {/* FORM GANTI PASSWORD (BARU) */}
                  <div className="border-t border-gray-100 pt-6">
                     <h4 className="text-sm font-bold text-gray-800 mb-4">Ubah Kata Sandi</h4>
                     
                     {passMsg.text && (
                        <div className={`p-2 mb-3 rounded text-xs ${passMsg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                           {passMsg.text}
                        </div>
                     )}

                     <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Password Lama</label>
                            <input 
                                type="password" required 
                                value={passData.current_password}
                                onChange={e => setPassData({...passData, current_password: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#9F8034] outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Password Baru</label>
                            <input 
                                type="password" required minLength={8}
                                value={passData.new_password}
                                onChange={e => setPassData({...passData, new_password: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#9F8034] outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Ulangi Password Baru</label>
                            <input 
                                type="password" required
                                value={passData.new_password_confirmation}
                                onChange={e => setPassData({...passData, new_password_confirmation: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#9F8034] outline-none"
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isSavingPass}
                            className="w-full bg-[#0B1215] text-white py-2 rounded-lg text-sm font-bold hover:bg-black transition disabled:opacity-50"
                        >
                            {isSavingPass ? "Menyimpan..." : "Simpan Password Baru"}
                        </button>
                     </form>
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