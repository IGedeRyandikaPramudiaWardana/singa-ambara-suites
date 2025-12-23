"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios"; // Menggunakan instance axios yang benar

// Kita pisahkan form ke komponen sendiri agar bisa dibungkus Suspense
function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // State Form
    const [formData, setFormData] = useState({
        email: "",
        token: "",
        password: "",
        password_confirmation: ""
    });

    // State Status
    const [status, setStatus] = useState({ type: "", msg: "" });
    const [isLoading, setIsLoading] = useState(false);

    // Ambil Token & Email dari URL saat halaman dimuat
    useEffect(() => {
        const token = searchParams.get("token");
        const email = searchParams.get("email");
        
        if (token && email) {
            setFormData(prev => ({ ...prev, token, email }));
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ type: "", msg: "" });

        // Validasi Frontend
        if (formData.password !== formData.password_confirmation) {
            setStatus({ type: "error", msg: "Konfirmasi password tidak cocok." });
            setIsLoading(false);
            return;
        }

        try {
            // Kirim ke Backend Laravel via api instance
            // URL otomatis: http://127.0.0.1:8000/api/reset-password
            await api.post('/reset-password', formData);
            
            setStatus({ type: "success", msg: "Password berhasil diubah! Mengalihkan ke login..." });
            
            // Redirect ke login setelah 3 detik
            setTimeout(() => router.push('/login'), 3000);

        } catch (error: any) {
            const errorMsg = error.response?.data?.message || "Gagal mereset password. Token mungkin kadaluarsa.";
            setStatus({ type: "error", msg: errorMsg });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-[#1A2225] p-8 rounded border border-gray-700 shadow-lg">
            <h2 className="text-3xl font-serif text-[#D4AF37] mb-6 text-center">Buat Password Baru</h2>
            
            {status.msg && (
                <div className={`mb-6 p-4 rounded text-sm border ${
                    status.type === 'success' 
                    ? 'bg-green-500/10 text-green-400 border-green-500' 
                    : 'bg-red-500/10 text-red-400 border-red-500'
                }`}>
                    {status.msg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Hidden Inputs untuk Token & Email */}
                <input type="hidden" value={formData.email} />
                <input type="hidden" value={formData.token} />

                <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-widest font-bold">Password Baru</label>
                    <input 
                        type="password" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full bg-[#0F1619] border border-gray-700 rounded p-3 text-white focus:border-[#D4AF37] focus:outline-none transition"
                        placeholder="Minimal 8 karakter"
                        required minLength={8}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-widest font-bold">Ulangi Password</label>
                    <input 
                        type="password" 
                        value={formData.password_confirmation}
                        onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                        className="w-full bg-[#0F1619] border border-gray-700 rounded p-3 text-white focus:border-[#D4AF37] focus:outline-none transition"
                        placeholder="Konfirmasi password baru"
                        required 
                    />
                </div>

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#9F8034] hover:bg-[#8A6E2A] text-white py-3 rounded font-bold uppercase tracking-widest transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                    {isLoading ? "Menyimpan..." : "Simpan Password Baru"}
                </button>
            </form>
        </div>
    );
}

// Komponen Utama Halaman
export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-[#0F1619] flex items-center justify-center p-4">
            {/* Suspense wajib digunakan saat menggunakan useSearchParams di Next.js App Router */}
            <Suspense fallback={<div className="text-[#D4AF37]">Loading form...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}