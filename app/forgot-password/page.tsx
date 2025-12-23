"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/axios"; // Menggunakan instance axios yang benar

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");
        setError("");

        try {
            // Mengirim request ke Backend Laravel
            // URL otomatis menjadi: http://127.0.0.1:8000/api/forgot-password
            const response = await api.post('/forgot-password', { email });
            
            // Jika sukses
            setMessage(response.data.message || "Cek email Anda sekarang! Link reset telah dikirim.");
        } catch (err: any) {
            // Menangani error
            if (err.response && err.response.data) {
                setError(err.response.data.message || "Gagal mengirim email.");
            } else {
                setError("Terjadi kesalahan koneksi atau server mati.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F1619] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#1A2225] p-8 rounded border border-gray-700 shadow-lg">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-serif text-[#D4AF37] mb-2">Lupa Password?</h2>
                    <p className="text-gray-400 text-sm">Masukkan email Anda untuk menerima instruksi reset password.</p>
                </div>
                
                {/* Notifikasi Sukses */}
                {message && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500 text-green-400 text-sm rounded">
                        {message}
                    </div>
                )}

                {/* Notifikasi Error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500 text-red-400 text-sm rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase tracking-widest font-bold">Email Terdaftar</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#0F1619] border border-gray-700 rounded p-3 text-white focus:border-[#D4AF37] focus:outline-none transition"
                            placeholder="nama@email.com"
                            required 
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#9F8034] hover:bg-[#8A6E2A] text-white py-3 rounded font-bold uppercase tracking-widest transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Mengirim..." : "Kirim Link Reset"}
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <Link href="/login" className="text-gray-400 hover:text-[#D4AF37] text-sm transition">
                        &larr; Kembali ke Login
                    </Link>
                </div>
            </div>
        </div>
    );
}