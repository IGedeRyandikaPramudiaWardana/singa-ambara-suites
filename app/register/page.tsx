"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios"; // Pastikan Anda sudah membuat file lib/axios.ts

export default function RegisterPage() {
  const router = useRouter();
  
  // State untuk form input
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState(""); // <--- STATE BARU
  
  // State untuk loading & error handling
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // 1. Validasi di Frontend: Cek kecocokan password
    if (password !== passwordConfirmation) {
        setError("Konfirmasi password tidak cocok!");
        setIsLoading(false);
        return;
    }

    try {
      // 2. Kirim data ke Backend Laravel menggunakan AXIOS
      // Axios otomatis mengirim header JSON dan menangani URL dasar
      await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation // <--- WAJIB DIKIRIM
      });

      // 3. Jika sukses
      alert("Registrasi Berhasil! Silakan cek email Anda untuk kode OTP.");
      
      // Redirect ke halaman OTP dengan membawa email agar user tidak perlu ketik ulang
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);

    } catch (err: any) {
      // Menangani error dari Axios
      if (err.response && err.response.data) {
        // Pesan error dari Laravel (misal: "The email has already been taken.")
        setError(err.response.data.message || "Registrasi gagal.");
      } else {
        setError("Gagal menghubungi server. Pastikan backend menyala.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1619] flex md:grid md:grid-cols-2">
      
      {/* BAGIAN KIRI: Form Register */}
      <div className="w-full flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md space-y-8">
          
          <div className="space-y-2">
            <Link href="/" className="text-gray-400 hover:text-[#D4AF37] text-sm mb-4 inline-block transition">
              &larr; Kembali ke Beranda
            </Link>
            <h1 className="text-4xl font-serif text-[#D4AF37]">Buat Akun</h1>
            <p className="text-gray-400">Bergabunglah untuk pengalaman menginap terbaik.</p>
          </div>

          {/* Pesan Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded text-sm">
                {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400 uppercase tracking-widest">Nama Lengkap</label>
              <input 
                type="text" 
                required
                className="w-full bg-[#1A2225] border border-gray-700 rounded p-3 text-white focus:border-[#D4AF37] focus:outline-none transition"
                placeholder="Masukkan nama Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400 uppercase tracking-widest">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full bg-[#1A2225] border border-gray-700 rounded p-3 text-white focus:border-[#D4AF37] focus:outline-none transition"
                placeholder="email@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400 uppercase tracking-widest">Password</label>
              <input 
                type="password" 
                required
                className="w-full bg-[#1A2225] border border-gray-700 rounded p-3 text-white focus:border-[#D4AF37] focus:outline-none transition"
                placeholder="Min. 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* --- INPUT BARU: KONFIRMASI PASSWORD --- */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400 uppercase tracking-widest">Konfirmasi Password</label>
              <input 
                type="password" 
                required
                className="w-full bg-[#1A2225] border border-gray-700 rounded p-3 text-white focus:border-[#D4AF37] focus:outline-none transition"
                placeholder="Ulangi password Anda"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#9F8034] hover:bg-[#8A6E2A] text-white py-4 rounded font-bold uppercase tracking-widest transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Memproses..." : "Daftar Sekarang"}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-[#D4AF37] hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>

      {/* BAGIAN KANAN: Gambar Hiasan (Tetap Sama) */}
      <div className="hidden md:block relative bg-gray-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F1619] to-transparent"></div>
        <div className="absolute bottom-10 left-10 p-10 max-w-lg">
          <h2 className="text-4xl font-serif text-white mb-4">"Sanctuary for the senses."</h2>
          <p className="text-[#D4AF37] uppercase tracking-widest text-sm">— Singa Ambara Experience</p>
        </div>
      </div>

    </div>
  );
}