"use client";

import React, { useState } from "react";

type TemplateType = "QUIZ" | "SORT" | "LOGIC" | "MAZE";
type FormatType = "Pilihan Ganda" | "Essai" | "Isian Singkat";

export default function GameCraftEditor() {
  const [fase, setFase] = useState("Fase E/F (SMA/SMK Kelas 10-12)");
  const [topic, setTopic] = useState("Penerapan ilmu sosial di masyarakat");
  const [template, setTemplate] = useState<TemplateType>("QUIZ");
  const [jumlahSoal, setJumlahSoal] = useState<number>(3);
  const [formatSoal, setFormatSoal] = useState<FormatType>("Pilihan Ganda");
  const [tingkat, setTingkat] = useState("Sedang (MOTS)");
  const [menit, setMenit] = useState(45);
  const [detik, setDetik] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [essayAnswers, setEssayAnswers] = useState<Record<number, string>>({});

  const sampleOptions: Record<number, string[]> = {
    1: [
      "Mengadakan musyawarah warga untuk menentukan solusi fasilitas bersama",
      "Mengabaikan partisipasi warga dan mengambil keputusan sepihak",
      "Menyusun laporan tanpa melakukan survei lapangan langsung",
      "Membatasi interaksi antar kelompok masyarakat yang berbeda"
    ],
    2: [
      "Menganalisis dampak interaksi sosial terhadap kebiasaan gotong royong",
      "Menghilangkan norma adat yang berlaku secara turun-temurun",
      "Menghentikan seluruh kegiatan kerja bakti lingkungan",
      "Menolak adanya pertukaran informasi antar generasi"
    ],
    3: [
      "Menyediakan ruang dialog terbuka untuk menyelesaikan dinamika sosial",
      "Memaksakan kehendak satu kelompok kepada kelompok lainnya",
      "Menutup akses komunikasi antar perwakilan warga",
      "Menghindari evaluasi bersama terhadap program masyarakat"
    ]
  };

  const getQuestionText = (num: number) => {
    return `Soal #${num}: Bagaimana implementasi konkret "${topic}" dalam memecahkan permasalahan pada tingkat ${fase.split(" ")[0]}?`;
  };

  const questions = Array.from({ length: jumlahSoal }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 flex flex-col font-sans">
      <header className="h-14 border-b border-slate-800 bg-[#0B132B]/90 px-6 flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-lg tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-[#FF7A00]">
            GameCraft Studio
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800/80 text-amber-300 border border-amber-500/30">
            {fase.split(" ")[0]} · {tingkat.split(" ")[0]}
          </span>
          <span className="text-xs text-slate-400 border-l border-slate-700 pl-3">
            SEKOLAHKITA by JACS Developer
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition">
            Pratinjau
          </button>
          <button className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#FF7A00] to-amber-500 text-white shadow-lg shadow-orange-500/20 hover:opacity-95 transition">
            Terbitkan
          </button>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 p-5 items-stretch">
        <section className="lg:col-span-3 flex flex-col gap-4 bg-[#0B132B]/80 border border-slate-800/80 rounded-2xl p-4 shadow-xl">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">1. Identitas Pembelajaran</h4>
            <select
              value={fase}
              onChange={(e) => setFase(e.target.value)}
              className="w-full bg-[#070b19] border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 mb-2 focus:border-amber-500 focus:outline-none"
            >
              <option>Fase E/F (SMA/SMK Kelas 10-12)</option>
              <option>Fase D (SMP Kelas 7-9)</option>
              <option>Fase B/C (SD Kelas 3-6)</option>
              <option>Fase A (SD Kelas 1-2)</option>
            </select>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Topik / Materi Pokok"
              className="w-full bg-[#070b19] border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">2. Pilihan Template</h4>
            <div className="grid grid-cols-2 gap-2">
              {(["QUIZ", "SORT", "LOGIC", "MAZE"] as TemplateType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTemplate(t)}
                  className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                    template === t
                      ? "bg-gradient-to-r from-[#FF7A00]/20 to-amber-500/20 border-amber-500 text-amber-300"
                      : "bg-[#070b19] border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  {t === "QUIZ" && "🎯"} {t === "SORT" && "🗂️"} {t === "LOGIC" && "🧩"} {t === "MAZE" && "🧭"} {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">3. Konfigurasi Modul</h4>
            <div className="space-y-2">
              <div>
                <label className="text-[11px] text-slate-400">Jumlah Soal</label>
                <select
                  value={jumlahSoal}
                  onChange={(e) => setJumlahSoal(Number(e.target.value))}
                  className="w-full bg-[#070b19] border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                >
                  <option value={3}>3 Soal</option>
                  <option value={5}>5 Soal</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-400">Format Soal</label>
                <select
                  value={formatSoal}
                  onChange={(e) => setFormatSoal(e.target.value as FormatType)}
                  className="w-full bg-[#070b19] border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                >
                  <option value="Pilihan Ganda">Pilihan Ganda</option>
                  <option value="Essai">Essai</option>
                  <option value="Isian Singkat">Isian Singkat</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">4. Parameter Gameplay</h4>
            <select
              value={tingkat}
              onChange={(e) => setTingkat(e.target.value)}
              className="w-full bg-[#070b19] border border-slate-700 rounded-lg p-2 text-xs text-slate-200 mb-2 focus:border-amber-500 focus:outline-none"
            >
              <option>Sedang (MOTS)</option>
              <option>Mudah (LOTS)</option>
              <option>HOTS (Analisis)</option>
            </select>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={menit}
                onChange={(e) => setMenit(Number(e.target.value))}
                className="w-16 bg-[#070b19] border border-slate-700 rounded p-1.5 text-center text-xs text-slate-200"
              />
              <span className="text-xs text-slate-400">mnt</span>
              <input
                type="number"
                value={detik}
                onChange={(e) => setDetik(Number(e.target.value))}
                className="w-16 bg-[#070b19] border border-slate-700 rounded p-1.5 text-center text-xs text-slate-200"
              />
              <span className="text-xs text-slate-400">dtk</span>
            </div>
          </div>
        </section>

        <section className="lg:col-span-5 flex flex-col bg-[#0B132B]/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
          <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>Editor Modul:</span>
                <span className="text-amber-400">{template}</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Menampilkan {jumlahSoal} butir soal ({formatSoal})
              </p>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded bg-slate-800 text-amber-300 font-medium">Mode Guru</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {questions.map((num) => (
              <div
                key={num}
                className="p-4 rounded-xl border border-slate-800 bg-[#070b19]/60 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-400">
                    Soal #{num} ({formatSoal === "Pilihan Ganda" ? "MCQ" : formatSoal})
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    {tingkat.split(" ")[0]}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-3">{getQuestionText(num)}</p>

                {formatSoal === "Pilihan Ganda" ? (
                  <div className="space-y-2">
                    {(sampleOptions[num] || sampleOptions[1]).map((opt, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-800 bg-[#0B132B]/50 text-xs text-slate-300"
                      >
                        <span className="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <textarea
                    rows={3}
                    placeholder={`Ketik pedoman jawaban untuk Soal #${num}...`}
                    className="w-full bg-[#070b19] border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-4 flex flex-col bg-[#0B132B]/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <span className="text-xs font-bold text-[#FF7A00] tracking-wider uppercase">
              Live Preview Siswa
            </span>
            <span className="text-xs font-mono bg-slate-800/90 text-amber-300 px-2.5 py-1 rounded-md border border-slate-700">
              ⏱️ {menit}m {detik}s
            </span>
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-r from-slate-900 to-[#070b19] border border-slate-800 mb-4">
            <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1">
              <span>{fase.split(" ")[0]}</span>
              <span className="text-amber-400 font-semibold">SKOR: 0</span>
            </div>
            <h5 className="text-xs font-bold text-slate-200 truncate">{topic}</h5>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {questions.map((num) => (
              <div
                key={num}
                className="p-3.5 rounded-xl border border-slate-800/90 bg-[#070b19]/80 shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-amber-300">Soal #{num}</span>
                  <span className="text-[10px] text-slate-400">{formatSoal}</span>
                </div>
                <p className="text-xs text-slate-200 mb-3">{getQuestionText(num)}</p>

                {formatSoal === "Pilihan Ganda" ? (
                  <div className="space-y-2">
                    {(sampleOptions[num] || sampleOptions[1]).map((opt, idx) => {
                      const letter = String.fromCharCode(65 + idx);
                      const isSelected = selectedAnswers[num] === letter;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            setSelectedAnswers((prev) => ({ ...prev, [num]: letter }))
                          }
                          className={`w-full text-left flex items-start gap-2.5 p-2.5 rounded-lg border text-xs transition cursor-pointer ${
                            isSelected
                              ? "bg-amber-500/20 border-amber-500 text-amber-200 shadow-sm shadow-amber-500/20"
                              : "bg-[#0B132B]/60 border-slate-800 text-slate-300 hover:border-slate-700"
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] shrink-0 ${
                              isSelected
                                ? "bg-amber-500 text-slate-950"
                                : "bg-slate-800 text-slate-300 border border-slate-700"
                            }`}
                          >
                            {letter}
                          </span>
                          <span className="leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={essayAnswers[num] || ""}
                      onChange={(e) =>
                        setEssayAnswers((prev) => ({ ...prev, [num]: e.target.value }))
                      }
                      placeholder="Ketik jawaban siswa di sini..."
                      className="w-full bg-[#0B132B]/70 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                    <button className="w-full py-2 bg-gradient-to-r from-[#FF7A00] to-amber-500 text-slate-950 font-bold text-xs rounded-lg hover:opacity-90 transition">
                      Kirim Jawaban
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 text-center">
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider">
              SEKOLAHKITA LIVE ENGINE
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
