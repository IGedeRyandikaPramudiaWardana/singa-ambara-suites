import Link from "next/link";
import Image from "next/image";

export default function PanjiRoomDetail() {
  return (
    <main className="min-h-screen bg-[#0F1619] text-gray-200 pb-20">
      
      {/* ================= HERO SECTION ================= */}
      <div className="relative h-[60vh] w-full">
        {/* Gambar Utama (Header) */}
        <Image 
          src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop"
          alt="Panji Room Header"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay Gelap */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1619] via-[#0F1619]/40 to-transparent"></div>
        
        {/* Judul di atas gambar */}
        <div className="absolute bottom-0 left-0 w-full px-4 md:px-10 pb-10 max-w-7xl mx-auto">
          <span className="bg-[#9F8034] text-white px-4 py-1 rounded text-sm font-bold uppercase tracking-widest shadow-lg">
            Superior Class
          </span>
          <h1 className="text-[#FFD700] text-5xl md:text-7xl font-serif mt-4 drop-shadow-lg">
            Panji Room
          </h1>
        </div>
      </div>


      {/* ================= CONTENT SECTION ================= */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* --- KOLOM KIRI (Deskripsi & Fasilitas) --- */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Deskripsi */}
          <section>
            <h2 className="text-3xl font-serif text-white mb-4 border-b border-[#D4AF37]/30 pb-2 inline-block">
              Tentang Kamar
            </h2>
            <p className="text-gray-400 leading-relaxed text-lg font-light">
              Dirancang dengan sentuhan modern yang efisien, Panji Room menawarkan kenyamanan esensial dengan estetika yang menenangkan. 
              Dengan luas 24 m², kamar ini adalah pilihan cerdas bagi pelancong bisnis atau pasangan yang menginginkan istirahat berkualitas 
              di jantung kota Singaraja. Nikmati tidur nyenyak di atas kasur Queen Size berkualitas tinggi setelah seharian beraktivitas.
            </p>
          </section>

          {/* Fasilitas (Grid Icon) */}
          <section>
            <h2 className="text-3xl font-serif text-white mb-6 border-b border-[#D4AF37]/30 pb-2 inline-block">
              Fasilitas Kamar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Item Fasilitas */}
              <div className="flex items-center gap-4 bg-[#1A2225] p-4 rounded-lg border border-white/5">
                <span className="text-[#D4AF37] text-2xl">🛏️</span>
                <span className="font-medium text-gray-300">Queen Size Bed</span>
              </div>
              <div className="flex items-center gap-4 bg-[#1A2225] p-4 rounded-lg border border-white/5">
                <span className="text-[#D4AF37] text-2xl">📺</span>
                <span className="font-medium text-gray-300">Smart TV 43"</span>
              </div>
              <div className="flex items-center gap-4 bg-[#1A2225] p-4 rounded-lg border border-white/5">
                <span className="text-[#D4AF37] text-2xl">🚿</span>
                <span className="font-medium text-gray-300">Hot & Cold Shower</span>
              </div>
              <div className="flex items-center gap-4 bg-[#1A2225] p-4 rounded-lg border border-white/5">
                <span className="text-[#D4AF37] text-2xl">📶</span>
                <span className="font-medium text-gray-300">High-Speed WiFi</span>
              </div>
              <div className="flex items-center gap-4 bg-[#1A2225] p-4 rounded-lg border border-white/5">
                <span className="text-[#D4AF37] text-2xl">❄️</span>
                <span className="font-medium text-gray-300">Air Conditioning</span>
              </div>
              <div className="flex items-center gap-4 bg-[#1A2225] p-4 rounded-lg border border-white/5">
                <span className="text-[#D4AF37] text-2xl">☕</span>
                <span className="font-medium text-gray-300">Coffee & Tea Maker</span>
              </div>
            </div>
          </section>

          {/* Galeri Mini (Opsional) */}
          <section>
            <h2 className="text-3xl font-serif text-white mb-6 border-b border-[#D4AF37]/30 pb-2 inline-block">
              Galeri
            </h2>
            <div className="grid grid-cols-2 gap-4 h-64">
              <div className="relative rounded-lg overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop" alt="Detail 1" fill className="object-cover hover:scale-110 transition duration-500"/>
              </div>
              <div className="relative rounded-lg overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1974&auto=format&fit=crop" alt="Detail 2" fill className="object-cover hover:scale-110 transition duration-500"/>
              </div>
            </div>
          </section>

        </div>


        {/* --- KOLOM KANAN (Booking Card Sticky) --- */}
        <div className="lg:col-span-1">
          <div className="bg-[#1A2225] p-8 rounded-xl border border-[#D4AF37]/20 sticky top-24 shadow-2xl">
            <div className="text-center mb-6 border-b border-gray-700 pb-6">
              <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Harga Mulai</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-[#D4AF37] text-4xl font-bold font-serif">Rp 450.000</span>
                <span className="text-gray-500 text-sm">/malam</span>
              </div>
            </div>

            <div className="space-y-4">
              
              {/* TOMBOL BOOKING (SUDAH DIUPDATE JADI LINK) */}
              <Link 
                href="/booking?room=panji"
                className="block w-full text-center bg-[#9F8034] hover:bg-[#8A6E2A] text-white py-4 rounded font-bold uppercase tracking-widest transition duration-300 shadow-lg"
              >
                Book Now
              </Link>
              
              <Link href="/rooms" className="block w-full border border-gray-600 text-gray-400 hover:text-white hover:border-white py-4 rounded font-bold uppercase tracking-widest text-center transition duration-300">
                Lihat Kamar Lain
              </Link>
            </div>

            <p className="text-center text-xs text-gray-500 mt-6 leading-relaxed">
              *Harga dapat berubah sewaktu-waktu tergantung musim liburan dan ketersediaan kamar.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}