"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios"; // Pastikan import axios instance

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Kirim request login
      const res = await api.post('/login', { email, password });
      
      // === BAGIAN PENTING YANG TADI HILANG ===
      // 1. Simpan Token
      localStorage.setItem("token", res.data.access_token);
      
      // 2. Simpan Data User & Role (Agar Sidebar tahu Anda Super Admin)
      // Pastikan backend mengirim object 'user' berisi 'name' dan 'role'
      if (res.data.user) {
          localStorage.setItem("user_name", res.data.user.name);
          localStorage.setItem("user_role", res.data.user.role);
      } else if (res.data.role) {
          // Jaga-jaga jika struktur JSON backend berbeda (role ada di luar user)
          localStorage.setItem("user_role", res.data.role);
          localStorage.setItem("user_name", res.data.name || "Admin");
      }

      // 3. Kabari Navbar & Sidebar bahwa data login berubah
      window.dispatchEvent(new Event("auth-change"));
      
      // 4. Redirect sesuai role
      // Cek role dari response langsung agar lebih akurat
      const role = res.data.user?.role || res.data.role;

      if (role === 'super_admin' || role === 'admin') {
          router.push('/admin/dashboard');
      } else {
          router.push('/'); 
      }

    } catch (err: any) {
      setError(err.response?.data?.message || "Email atau password salah.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1619] flex md:grid md:grid-cols-2">
      
      {/* BAGIAN KIRI: Form Login */}
      <div className="w-full flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md space-y-8">
          
          <div className="space-y-2">
            <Link href="/" className="text-gray-400 hover:text-[#D4AF37] text-sm mb-4 inline-block transition">
              &larr; Kembali ke Beranda
            </Link>
            <h1 className="text-4xl font-serif text-[#D4AF37]">Welcome Back</h1>
            <p className="text-gray-400">Silakan masuk untuk melanjutkan booking.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded text-sm">
                {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs text-gray-400 uppercase tracking-widest font-bold">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full bg-[#1A2225] border border-gray-700 rounded p-3 text-white focus:border-[#D4AF37] focus:outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-400 uppercase tracking-widest font-bold">Password</label>
              <input 
                type="password" 
                required
                className="w-full bg-[#1A2225] border border-gray-700 rounded p-3 text-white focus:border-[#D4AF37] focus:outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
                <Link 
                    href="/forgot-password" 
                    className="text-sm text-gray-400 hover:text-[#D4AF37] transition"
                >
                    Lupa Kata Sandi?
                </Link>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#9F8034] hover:bg-[#8A6E2A] text-white py-4 rounded font-bold uppercase tracking-widest transition duration-300 disabled:opacity-50"
            >
              {isLoading ? "Memproses..." : "SIGN IN"}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm">
            Belum punya akun?{" "}
            <Link href="/register" className="text-[#D4AF37] hover:underline">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>

      {/* BAGIAN KANAN: Gambar Hiasan */}
      <div className="hidden md:block relative bg-gray-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F1619] to-transparent"></div>
        <div className="absolute bottom-10 left-10 p-10 max-w-lg">
          <h2 className="text-4xl font-serif text-white mb-4">"Experience Luxury."</h2>
          <p className="text-[#D4AF37] uppercase tracking-widest text-sm">— Singa Ambara Experience</p>
        </div>
      </div>

    </div>
  );
}