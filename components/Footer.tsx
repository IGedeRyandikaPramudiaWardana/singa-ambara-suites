import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#05090a] text-gray-400 py-12 border-t border-white/5 text-sm">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="space-y-4">
          <h3 className="text-xl font-serif text-[#D4AF37]">Singa Ambara</h3>
          <p className="leading-relaxed">
            Kenyamanan mewah di jantung Singaraja. Pengalaman menginap tak terlupakan dengan sentuhan budaya Bali Utara.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest mb-4">Explore</h4>
          <ul className="space-y-2">
            <li><Link href="/#home" className="hover:text-[#D4AF37] transition">Home</Link></li>
            <li><Link href="/#about" className="hover:text-[#D4AF37] transition">About Us</Link></li>
            <li><Link href="/rooms" className="hover:text-[#D4AF37] transition">Rooms & Suites</Link></li>
            <li><Link href="/#contact" className="hover:text-[#D4AF37] transition">Contact</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest mb-4">Legal</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-[#D4AF37] transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#D4AF37] transition">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-[#D4AF37] transition">Refund Policy</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest mb-4">Newsletter</h4>
          <p className="mb-4">Dapatkan info promo terbaru.</p>
          <div className="flex">
            <input type="email" placeholder="Email Anda" className="bg-[#0F1619] border border-gray-700 text-white px-3 py-2 rounded-l w-full focus:outline-none focus:border-[#D4AF37]" />
            <button className="bg-[#9F8034] text-white px-4 py-2 rounded-r hover:bg-[#8A6E2A]">Go</button>
          </div>
        </div>

      </div>
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-white/5 text-center">
        <p>&copy; 2025 Singa Ambara Suites. All Rights Reserved.</p>
      </div>
    </footer>
  );
}