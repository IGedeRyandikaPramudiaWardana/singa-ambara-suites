"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function BookingBar() {
  // --- STATE POPUP ---
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuest, setShowGuest] = useState(false);

  // --- STATE DATA ---
  // Default: Hari ini & Besok
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [startDate, setStartDate] = useState<Date | null>(today);
  const [endDate, setEndDate] = useState<Date | null>(tomorrow);
  
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // --- STATE KALENDER (Navigasi Bulan) ---
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Bulan yang sedang dilihat user

  // Refs untuk Click Outside
  const dateRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
      if (guestRef.current && !guestRef.current.contains(event.target as Node)) {
        setShowGuest(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- LOGIKA KALENDER ---
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    // Logika Memilih Rentang Tanggal
    if (!startDate || (startDate && endDate)) {
      // Jika belum ada start, atau sudah lengkap (reset ulang)
      setStartDate(clickedDate);
      setEndDate(null);
    } else if (clickedDate < startDate) {
      // Jika klik tanggal sebelum start date, jadikan start date baru
      setStartDate(clickedDate);
    } else {
      // Set end date
      setEndDate(clickedDate);
      setShowCalendar(false); // Tutup kalender setelah pilih selesai
    }
  };

  // Helper untuk cek status tanggal (dipilih/range/disabled)
  const getDateStatus = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const now = new Date();
    now.setHours(0,0,0,0);

    if (date < now) return "disabled"; // Tanggal lewat
    
    if (startDate && date.getTime() === startDate.getTime()) return "start";
    if (endDate && date.getTime() === endDate.getTime()) return "end";
    
    if (startDate && endDate && date > startDate && date < endDate) return "range";
    
    return "normal";
  };

  // Format Tanggal untuk Tampilan Utama
  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };

  // Generate Array Hari untuk Grid
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const daysArray = [...Array(firstDay).fill(null), ...Array(daysInMonth).keys()];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 relative z-40 -mt-24 md:-mt-16">
      <div className="bg-[#1A2225] border border-[#D4AF37]/30 p-4 md:p-6 rounded-xl shadow-2xl flex flex-col md:flex-row gap-4 items-center">
        
        {/* --- 1. DATE PICKER (REAL CALENDAR) --- */}
        {/* Lebar diperbesar karena Promo Code hilang */}
        <div className="relative w-full md:w-[60%]" ref={dateRef}>
          <div 
            onClick={() => {setShowCalendar(!showCalendar); setShowGuest(false);}}
            className="flex items-center gap-4 bg-[#0F1619] border border-white/10 p-4 rounded-lg cursor-pointer hover:border-[#D4AF37] transition group"
          >
            <span className="text-[#D4AF37] text-2xl group-hover:scale-110 transition">📅</span>
            <div className="flex flex-col flex-1">
              <div className="flex justify-between text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                <span>Check-in</span>
                <span>Check-out</span>
              </div>
              <div className="flex justify-between text-white font-medium text-lg">
                <span>{formatDate(startDate)}</span>
                <span className="text-[#D4AF37]">➝</span>
                <span>{formatDate(endDate)}</span>
              </div>
            </div>
          </div>

          {/* POPUP KALENDER ASLI */}
          {showCalendar && (
            <div className="absolute top-full mt-3 left-0 bg-white text-black p-5 rounded-xl shadow-2xl w-full md:w-[400px] z-50 animate-fadeIn border border-gray-200">
              
              {/* Header Bulan & Navigasi */}
              <div className="flex justify-between items-center mb-6">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 font-bold">&lt;</button>
                <h4 className="font-bold text-lg text-gray-800">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h4>
                <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 font-bold">&gt;</button>
              </div>

              {/* Grid Hari */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                  <span key={d} className="text-gray-400 text-xs font-bold py-2">{d}</span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {daysArray.map((item, i) => {
                  if (item === null) return <div key={`empty-${i}`}></div>;
                  
                  const day = item + 1;
                  const status = getDateStatus(day);
                  
                  let btnClass = "w-10 h-10 text-sm rounded-full flex items-center justify-center transition ";
                  
                  if (status === "disabled") {
                    btnClass += "text-gray-300 cursor-not-allowed";
                  } else if (status === "start" || status === "end") {
                    btnClass += "bg-[#9F8034] text-white shadow-lg font-bold scale-110";
                  } else if (status === "range") {
                    btnClass += "bg-[#FFF8E1] text-[#9F8034] rounded-none";
                  } else {
                    btnClass += "text-gray-700 hover:bg-gray-100 font-medium";
                  }

                  return (
                    <button 
                      key={day}
                      disabled={status === "disabled"}
                      onClick={() => handleDateClick(day)}
                      className={btnClass}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {!startDate ? "Pilih tanggal Check-in" : !endDate ? "Pilih tanggal Check-out" : `${Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} Malam`}
                </span>
                {startDate && endDate && (
                   <button onClick={() => setShowCalendar(false)} className="text-[#9F8034] text-sm font-bold hover:underline">Tutup</button>
                )}
              </div>
            </div>
          )}
        </div>


        {/* --- 2. GUEST SELECTOR --- */}
        <div className="relative w-full md:w-[25%]" ref={guestRef}>
          <div 
            onClick={() => {setShowGuest(!showGuest); setShowCalendar(false);}}
            className="flex items-center gap-3 bg-[#0F1619] border border-white/10 p-4 rounded-lg cursor-pointer hover:border-[#D4AF37] transition h-[82px]"
          >
            <span className="text-[#D4AF37] text-2xl">👤</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Guests</span>
              <span className="text-white font-medium text-sm truncate">{adults} Adult, {children} Child</span>
            </div>
          </div>

          {/* POPUP GUEST COUNTER */}
          {showGuest && (
            <div className="absolute top-full mt-3 left-0 bg-white text-black p-5 rounded-xl shadow-2xl w-[280px] z-50 animate-fadeIn border border-gray-200">
              {/* Row Adult */}
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                <div>
                  <p className="font-bold text-gray-800">Adults</p>
                  <p className="text-xs text-gray-500">Ages 13 or above</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-[#9F8034] hover:text-white transition">-</button>
                  <span className="font-bold w-4 text-center">{adults}</span>
                  <button onClick={() => setAdults(adults + 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-[#9F8034] hover:text-white transition">+</button>
                </div>
              </div>
              {/* Row Children */}
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-bold text-gray-800">Children</p>
                  <p className="text-xs text-gray-500">Ages 0 - 12</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-[#9F8034] hover:text-white transition">-</button>
                  <span className="font-bold w-4 text-center">{children}</span>
                  <button onClick={() => setChildren(children + 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-[#9F8034] hover:text-white transition">+</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- 3. BUTTON CHECK --- */}
        <div className="w-full md:w-[15%] h-[82px]">
          <Link 
            href="/rooms" 
            className="w-full h-full bg-[#9F8034] hover:bg-[#8A6E2A] text-white font-bold rounded-lg flex flex-col items-center justify-center transition shadow-lg group"
          >
            <span className="uppercase tracking-widest text-sm mb-1">Check</span>
            <span className="text-xs font-light opacity-80 group-hover:translate-x-1 transition">Availability &rarr;</span>
          </Link>
        </div>

      </div>
    </div>
  );
}