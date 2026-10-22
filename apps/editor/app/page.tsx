"use client";

import React, { useState } from "react";
import Image from "next/image";

type TemplateType = "QUIZ" | "SORT" | "LOGIC" | "MAZE";

interface QuestionItem {
  id: number;
  type: "MCQ" | "ESSAY" | "SHORT";
  text: string;
}

export default function GameCraftEditor() {
  const [fase, setFase] = useState("Fase E/F (SMA/SMK Kelas 10-12)");
  const [judulModul, setJudulModul] = useState("Penerapan ilmu sosial di masyarakat");
  const [template, setTemplate] = useState<TemplateType>("QUIZ");
  const [kesulitan, setKesulitan] = useState("Sedang (MOTS)");
  const [formatSoal, setFormatSoal] = useState("Essai");
  const [jumlahSoal, setJumlahSoal] = useState<number>(10);
  
  const [minutes, setMinutes] = useState<number>(45);
  const [seconds, setSeconds] = useState<number>(0);

  // Palet Instruksi untuk Template LOGIC
  const [logicBlocks, setLogicBlocks] = useState<string[]>(["MAJU ➡️", "PUTAR KANAN ⤵️"]);

  // Generate daftar soal dinamis sesuai dropdown jumlahSoal (3, 5, 10)
  const questions: QuestionItem[] = Array.from({ length: jumlahSoal }, (_, i) => ({
    id: i + 1,
    type: formatSoal === "Essai" ? "ESSAY" : formatSoal === "Pilihan Ganda" ? "MCQ" : "SHORT",
    text: `Soal #${i + 1}: Analisis implementasi "${judulModul}" dalam kehidupan bermasyarakat dan berikan contoh konkretnya.`
  }));

  const handleQuickTime = (totalSec: number) => {
    setMinutes(Math.floor(totalSec / 60));
    setSeconds(totalSec % 60);
  };

  const addLogicBlock = (block: string) => {
    if (logicBlocks.length < 6) {
      setLogicBlocks([...logicBlocks, block]);
    }
  };

  const removeLogicBlock = (idx: number) => {
    setLogicBlocks(logicBlocks.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#060b13] text-slate-100 font-sans">
      {/* HEADER NAV */}
      <header className="flex h-14 items-center justify-between border-b border-slate-800/80 bg-[#090f1d] px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-wider text-amber-500">GameCraft Studio</span>
            <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20">
              Fase E/F · Sedang
            </span>
          </div>
          <span className="text-xs text-slate-400 border-l border-slate-700 pl-3">
            SEKOLAHKITA by JACS Developer
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition">
            🌙 Dark
          </button>
          <button className="rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition">
            Pratinjau
          </button>
          <button 
            onClick={() => alert(`Modul Diterbitkan!\nLink Siswa: https://sekolahkita.id/play/JACS-${Math.floor(1000 + Math.random() * 9000)}\nPIN: ${Math.floor(100000 + Math.random() * 900000)}`)}
            className="rounded-lg bg-[#FF7A00] px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-amber-600/20 hover:bg-[#e06c00] transition"
          >
            Terbitkan
          </button>
        </div>
      </header>

      {/* 3-COLUMN WORKSPACE */}
      <main className="flex flex-1 overflow-hidden">
        {/* PANEL KIRI: PARAMETER */}
        <aside className="w-80 border-r border-slate-800/80 bg-[#070e1b] p-4 overflow-y-auto space-y-5">
          <div>
            <h5 className="text-[11px] font-bold tracking-wider text-cyan-400 mb-2">1. IDENTITAS PEMBELAJARAN</h5>
            <div className="space-y-2">
              <select 
                value={fase} 
                onChange={(e) => setFase(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#0b1426] px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option>Fase E/F (SMA/SMK Kelas 10-12)</option>
                <option>Fase A (SD Kelas 1-2)</option>
                <option>Fase B/C (SD Kelas 3-6)</option>
                <option>Fase D (SMP Kelas 7-9)</option>
              </select>

              <input 
                type="text" 
                value={judulModul}
                onChange={(e) => setJudulModul(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#0b1426] px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                placeholder="Judul Materi..."
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-[11px] font-bold tracking-wider text-cyan-400">2. PILIHAN TEMPLATE</h5>
              <span className="text-[10px] text-amber-400 font-mono font-bold">{template}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(["QUIZ", "SORT", "LOGIC", "MAZE"] as TemplateType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTemplate(t)}
                  className={`rounded-lg py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    template === t 
                      ? "bg-[#FF7A00] text-white shadow-md shadow-amber-600/30" 
                      : "border border-slate-700 bg-[#0b1426] text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {t === "QUIZ" ? "🎯 QUIZ" : t === "SORT" ? "🗂️ SORT" : t === "LOGIC" ? "🧩 LOGIC" : "🧭 MAZE"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-[11px] font-bold tracking-wider text-cyan-400 mb-2">3. KONFIGURASI MODUL</h5>
            {template === "QUIZ" ? (
              <div className="space-y-2">
                <label className="text-[10px] text-slate-400">Jumlah Soal</label>
                <select 
                  value={jumlahSoal} 
                  onChange={(e) => setJumlahSoal(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-700 bg-[#0b1426] px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                >
                  <option value={3}>3 Soal</option>
                  <option value={5}>5 Soal</option>
                  <option value={10}>10 Soal</option>
                </select>

                <label className="text-[10px] text-slate-400 mt-2 block">Format Soal</label>
                <select 
                  value={formatSoal} 
                  onChange={(e) => setFormatSoal(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-[#0b1426] px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Essai">Essai</option>
                  <option value="Pilihan Ganda">Pilihan Ganda</option>
                  <option value="Isian Singkat">Isian Singkat</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="text-[10px] text-slate-400">Maksimal Blok Instruksi</label>
                <select className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0b1426] px-3 py-2 text-xs text-slate-200">
                  <option>Maksimal 6 Blok</option>
                  <option>Maksimal 4 Blok</option>
                  <option>Maksimal 10 Blok</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <h5 className="text-[11px] font-bold tracking-wider text-cyan-400 mb-2">4. PARAMETER GAMEPLAY</h5>
            <select 
              value={kesulitan} 
              onChange={(e) => setKesulitan(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-[#0b1426] px-3 py-2 text-xs text-slate-200 mb-3"
            >
              <option>Sedang (MOTS)</option>
              <option>Mudah (LOTS)</option>
              <option>HOTS (Analisis)</option>
            </select>

            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span>Batas Waktu</span>
              <span className="text-amber-400 font-bold">{minutes}m {seconds}s</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="flex items-center rounded-lg border border-slate-700 bg-[#0b1426] px-2 py-1">
                <input 
                  type="number" 
                  min={0}
                  value={minutes} 
                  onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-transparent text-center text-xs font-bold text-white focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 ml-1">mnt</span>
              </div>
              <div className="flex items-center rounded-lg border border-slate-700 bg-[#0b1426] px-2 py-1">
                <input 
                  type="number" 
                  min={0}
                  max={59}
                  value={seconds} 
                  onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="w-full bg-transparent text-center text-xs font-bold text-white focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 ml-1">dtk</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1">
              <button onClick={() => handleQuickTime(30)} className="rounded bg-slate-800 py-1 text-[11px] text-slate-300 hover:bg-slate-700">30s</button>
              <button onClick={() => handleQuickTime(60)} className="rounded bg-slate-800 py-1 text-[11px] text-slate-300 hover:bg-slate-700">1m</button>
              <button onClick={() => handleQuickTime(1800)} className="rounded bg-slate-800 py-1 text-[11px] text-slate-300 hover:bg-slate-700">30m</button>
              <button onClick={() => handleQuickTime(2700)} className="rounded bg-slate-800 py-1 text-[11px] text-amber-400 border border-amber-500/30 hover:bg-amber-950/30">45m</button>
            </div>
          </div>
        </aside>

        {/* PANEL TENGAH: KANVAS UTAMA DENGAN SCROLL VERTICAL */}
        <section className="flex-1 flex flex-col p-6 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Editor Modul: {template}</h3>
              <p className="text-xs text-slate-400">Kanvas Perancangan & Skenario Interaktif Pembelajaran</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="mr-1">Rasio:</span>
              <button className="rounded border border-cyan-500/50 bg-cyan-950/40 px-2.5 py-1 text-cyan-300 font-bold">Mobile</button>
              <button className="rounded border border-slate-700 bg-slate-800/60 px-2.5 py-1 hover:bg-slate-700">Tablet</button>
              <button className="rounded border border-slate-700 bg-slate-800/60 px-2.5 py-1 hover:bg-slate-700">Desktop</button>
            </div>
          </div>

          {/* AREA BERGULIR (SCROLLABLE AREA) */}
          <div className="flex-1 overflow-y-auto pr-3 space-y-4 max-h-[calc(100vh-160px)]">
            {template === "QUIZ" ? (
              <>
                <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span>Menampilkan <strong>{questions.length}</strong> butir soal ({formatSoal})</span>
                  <span className="text-amber-400">Gulir ke bawah untuk melihat nomor berikutnya ↓</span>
                </div>
                {questions.map((q) => (
                  <div key={q.id} className="rounded-xl border border-slate-800 bg-[#0b1426]/90 p-4 shadow-lg backdrop-blur-sm">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-500">Soal #{q.id} ({q.type})</span>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400 border border-slate-700">
                        [Tingkat: {kesulitan.split(" ")[0]}]
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-200 mb-3">{q.text}</p>
                    <div className="rounded-lg border border-slate-700/60 bg-[#060b13] p-2.5">
                      <textarea
                        rows={2}
                        readOnly
                        placeholder={`Siswa akan menuliskan jawaban analitis untuk Soal #${q.id} di sini...`}
                        className="w-full bg-transparent text-xs text-slate-400 resize-none focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </>
            ) : template === "LOGIC" ? (
              <div className="space-y-5">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 mb-2">PALET BLOK INSTRUKSI</h4>
                  <div className="flex flex-wrap gap-2">
                    {["+ MAJU ➡️", "+ PUTAR KANAN ⤵️", "+ PUTAR KIRI ⤴️", "+ LOMPAT 🦘", "+ EKSEKUSI ⚙️"].map((b) => (
                      <button
                        key={b}
                        onClick={() => addLogicBlock(b.replace("+ ", ""))}
                        className="rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-300">URUTAN EKSEKUSI RUNTUNAN</h4>
                    <span className="text-xs font-bold text-cyan-400">{logicBlocks.length} / 6 Blok</span>
                  </div>
                  <div className="space-y-2">
                    {logicBlocks.map((b, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg border border-slate-800 bg-[#0b1426] px-3 py-2">
                        <span className="text-xs font-medium text-slate-200">{idx + 1}. {b}</span>
                        <button onClick={() => removeLogicBlock(idx)} className="text-xs text-red-400 hover:text-red-300 font-bold">✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl">
                Kanvas template {template} siap dikonfigurasi.
              </div>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/60 pt-2">
            <span>Modul Siap Uji Coba</span>
            <span>JACS ENGINE CORE</span>
          </div>
        </section>

        {/* PANEL KANAN: LIVE PREVIEW SISWA */}
        <aside className="w-88 border-l border-slate-800/80 bg-[#070e1b] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-xs font-bold text-cyan-400">LIVE PREVIEW SISWA</span>
              <div className="flex items-center gap-2">
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                  ⏱️ {minutes}m {seconds}s
                </span>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                  {template}
                </span>
              </div>
            </div>

            {/* SIMULATOR SCREEN */}
            <div className="rounded-xl border border-slate-800 bg-[#0b1426] p-4 shadow-xl">
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                <span className="font-bold text-cyan-400">{template} GAME</span>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] text-slate-300">Fase E/F</span>
              </div>
              <h4 className="text-xs font-bold text-white mb-1 line-clamp-1">{judulModul}</h4>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-4 pb-2 border-b border-slate-800">
                <span>SKOR: 0</span>
                <span>{template === "LOGIC" ? `${logicBlocks.length} Instruksi` : `${jumlahSoal} Soal`}</span>
              </div>

              {template === "LOGIC" ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <div className="text-4xl mb-2">🤖</div>
                  <span className="text-[11px] font-bold text-slate-300 mb-3">Rangkaian Algoritma</span>
                  <div className="flex flex-wrap gap-1 justify-center max-w-[200px] mb-4">
                    {logicBlocks.map((b, i) => (
                      <span key={i} className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] text-cyan-300 border border-slate-700">
                        {b}
                      </span>
                    ))}
                  </div>
                  <button className="w-full rounded-lg bg-[#FF7A00] py-2 text-xs font-bold text-white hover:bg-[#e06c00] transition">
                    ▶️ Jalankan Robot
                  </button>
                </div>
              ) : (
                <div className="space-y-3 py-2">
                  <div className="rounded-lg bg-[#060b13] p-2.5 border border-slate-800">
                    <span className="text-[10px] font-bold text-amber-500">Soal #1</span>
                    <p className="text-[11px] text-slate-200 mt-1 line-clamp-2">
                      Analisis implementasi "{judulModul}" di masyarakat?
                    </p>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Ketik jawaban siswa di sini..."
                    className="w-full rounded-lg border border-slate-700 bg-[#060b13] p-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                  />
                  <button className="w-full rounded-lg bg-[#FF7A00] py-2 text-xs font-bold text-white hover:bg-[#e06c00] transition">
                    Kirim Jawaban
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800 pt-2">
            <span>SEKOLAHKITA</span>
            <span>LIVE ENGINE</span>
          </div>
        </aside>
      </main>
    </div>
  );
}
