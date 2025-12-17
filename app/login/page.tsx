import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      
      {/* 1. Background Image (Dibuat agak gelap/blur sesuai desain) */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop')" }} 
      >
        {/* Overlay gelap agar teks lebih kontras */}
        <div className="absolute inset-0 bg-[#0F1619]/80 backdrop-blur-sm"></div>
      </div>

      {/* 2. Kartu Login */}
      <div className="relative z-10 bg-[#030e12] p-8 md:p-12 rounded-2xl shadow-2xl w-full max-w-md border border-white/5 mx-4">
        
        {/* Logo di Tengah Atas */}
        <div className="flex flex-col items-center mb-10">
          <Image 
            src="/logo-emas.png" 
            alt="Logo Singa Ambara"
            width={100}
            height={100}
            className="w-auto h-24 mb-4"
          />
          <h1 className="text-white text-xl font-serif tracking-widest uppercase text-center">
            Singa Ambara <br/> <span className="text-sm tracking-[0.4em] font-light">Suites</span>
          </h1>
        </div>

        {/* Form Input */}
        <form className="space-y-6">
          
          {/* Input Email */}
          <div className="space-y-2">
            <label className="text-gray-300 text-sm ml-1">E-mail</label>
            <input 
              type="email" 
              placeholder="Masukkan email Anda"
              className="w-full bg-transparent border border-[#D4AF37] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition placeholder-gray-600"
            />
          </div>

          {/* Input Password */}
          <div className="space-y-2">
            <label className="text-gray-300 text-sm ml-1">Password</label>
            <input 
              type="password" 
              placeholder="Masukkan password"
              className="w-full bg-transparent border border-[#D4AF37] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition placeholder-gray-600"
            />
          </div>

          {/* Tombol Login */}
          <button 
            type="button" // Ganti 'submit' jika sudah ada fungsi backend
            className="w-full bg-[#9F8034] hover:bg-[#8A6E2A] text-white font-bold py-3 rounded-lg uppercase tracking-wide transition duration-300 mt-8 shadow-lg"
          >
            Login
          </button>

          {/* Link Kembali (Opsional) */}
          <div className="text-center mt-6">
            <Link href="/" className="text-gray-500 text-sm hover:text-[#D4AF37] transition">
              &larr; Kembali ke Beranda
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}