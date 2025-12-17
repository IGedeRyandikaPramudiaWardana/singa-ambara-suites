import Link from "next/link";
import Image from "next/image";

export default function BulelengSuiteDetail() {
  return (
    <main className="min-h-screen bg-[#0F1619] text-gray-200 pb-20">
      
      {/* HEADER IMAGE */}
      <div className="relative h-[60vh] w-full">
        <Image 
          src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop"
          alt="Buleleng Suite Header" fill className="object-cover" priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1619] via-[#0F1619]/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full px-4 md:px-10 pb-10 max-w-7xl mx-auto">
          <span className="bg-[#9F8034] text-white px-4 py-1 rounded text-sm font-bold uppercase tracking-widest shadow-lg">
            Executive Suite
          </span>
          <h1 className="text-[#FFD700] text-5xl md:text-7xl font-serif mt-4 drop-shadow-lg">
            Buleleng Suite
          </h1>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* KOLOM KIRI */}
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="text-3xl font-serif text-white mb-4 border-b border-[#D4AF37]/30 pb-2 inline-block">
              Tentang Suite
            </h2>
            <p className="text-gray-400 leading-relaxed text-lg font-light">
              Definisi kemewahan tertinggi di Singa Ambara Suites. Dengan luas 56 m², Buleleng Suite dirancang 
              untuk tamu VIP yang menginginkan eksklusivitas. Dilengkapi dengan <strong>Ruang Tamu Terpisah</strong>, 
              <strong>Bathtub Mewah</strong>, dan minibar lengkap. Pilihan terbaik untuk bulan madu atau eksekutif yang membutuhkan ruang kerja luas.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif text-white mb-6 border-b border-[#D4AF37]/30 pb-2 inline-block">
              Fasilitas Eksklusif
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 bg-[#1A2225] p-4 rounded-lg border border-white/5">
                <span className="text-[#D4AF37] text-2xl">🛋️</span>
                <span className="font-medium text-gray-300">Living Room Area</span>
              </div>
              <div className="flex items-center gap-4 bg-[#1A2225] p-4 rounded-lg border border-white/5">
                <span className="text-[#D4AF37] text-2xl">🛁</span>
                <span className="font-medium text-gray-300">Luxury Bathtub</span>
              </div>
              <div className="flex items-center gap-4 bg-[#1A2225] p-4 rounded-lg border border-white/5">
                <span className="text-[#D4AF37] text-2xl">🛏️</span>
                <span className="font-medium text-gray-300">King Size Bed Premium</span>
              </div>
              <div className="flex items-center gap-4 bg-[#1A2225] p-4 rounded-lg border border-white/5">
                <span className="text-[#D4AF37] text-2xl">🍷</span>
                <span className="font-medium text-gray-300">Minibar & Snacks</span>
              </div>
              <div className="flex items-center gap-4 bg-[#1A2225] p-4 rounded-lg border border-white/5">
                <span className="text-[#D4AF37] text-2xl">📺</span>
                <span className="font-medium text-gray-300">2x Smart TV (Room & Living)</span>
              </div>
              <div className="flex items-center gap-4 bg-[#1A2225] p-4 rounded-lg border border-white/5">
                <span className="text-[#D4AF37] text-2xl">👘</span>
                <span className="font-medium text-gray-300">Bathrobes & Slippers</span>
              </div>
            </div>
          </section>
        </div>

        {/* KOLOM KANAN (HARGA) */}
        <div className="lg:col-span-1">
          <div className="bg-[#1A2225] p-8 rounded-xl border border-[#D4AF37]/20 sticky top-24 shadow-2xl">
            <div className="text-center mb-6 border-b border-gray-700 pb-6">
              <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Harga Mulai</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-[#D4AF37] text-4xl font-bold font-serif">Rp 1.250.000</span>
                <span className="text-gray-500 text-sm">/malam</span>
              </div>
            </div>
            <div className="space-y-4">
              
              {/* TOMBOL BOOKING (SUDAH DIUPDATE JADI LINK) */}
              <Link 
                href="/booking?room=buleleng"
                className="block w-full text-center bg-[#9F8034] hover:bg-[#8A6E2A] text-white py-4 rounded font-bold uppercase tracking-widest transition duration-300 shadow-lg"
              >
                Book Suite
              </Link>

              <Link href="/rooms" className="block w-full border border-gray-600 text-gray-400 hover:text-white hover:border-white py-4 rounded font-bold uppercase tracking-widest text-center transition duration-300">
                Kembali ke Daftar
              </Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}