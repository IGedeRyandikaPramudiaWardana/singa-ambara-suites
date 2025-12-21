"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/"; // Cek mau diarahkan kemana setelah login

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

      // 1. Kirim Data ke Backend
      const res = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json" 
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Email atau password salah.");
      }

   // ... (kode sebelumnya)

      // 2. SIMPAN TOKEN
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user_name", data.user.name);
      
      // Simpan cookie opsional
      document.cookie = `token=${data.access_token}; path=/; max-age=86400;`;

      // --- TAMBAHKAN BARIS INI (Kirim Sinyal ke Navbar) ---
      window.dispatchEvent(new Event("auth-change"));
      // ----------------------------------------------------

      alert(`Selamat datang kembali, ${data.user.name}!`);
      router.push(returnUrl);

// ... (kode setelahnya)
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded text-sm text-center">
              {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#9F8034] hover:bg-[#8A6E2A] text-white py-4 rounded font-bold uppercase tracking-widest transition duration-300 disabled:opacity-50"
          >
            {isLoading ? "Memproses..." : "Sign In"}
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
  );
}

// --- PEMBUNGKUS UTAMA (Wajib untuk Next.js App Router) ---
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0F1619] flex md:grid md:grid-cols-2">
      {/* KONTEN KIRI (FORM) */}
      <Suspense fallback={<div className="text-white p-10">Loading...</div>}>
        <LoginForm />
      </Suspense>

      {/* KONTEN KANAN (GAMBAR) */}
      <div className="hidden md:block relative bg-gray-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F1619] to-transparent"></div>
        <div className="absolute bottom-10 left-10 p-10 max-w-lg">
          <h2 className="text-4xl font-serif text-white mb-4">"Unlock your exclusive stay."</h2>
          <p className="text-[#D4AF37] uppercase tracking-widest text-sm">— Singa Ambara Experience</p>
        </div>
      </div>
    </div>
  );
}