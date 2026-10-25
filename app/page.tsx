"use client";
import { MazeEditor } from "../components/editor/MazeEditor";

import React, { useState, useEffect } from "react";

type TemplateType = "QUIZ" | "SORT" | "LOGIC" | "MAZE";
type FormatType = "Pilihan Ganda" | "Essai" | "Isian Singkat";

export default function GameCraftEditor() {
  const [isStudentMode, setIsStudentMode] = useState(false);
  const [studentNis, setStudentNis] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentAbsen, setStudentAbsen] = useState("");
  const [isStarted, setIsStarted] = useState(false);

  // Waktu & Durasi Bersih
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedDuration, setElapsedDuration] = useState<number>(0);

  // 1. Template Driver
  const [template, setTemplate] = useState<TemplateType>("QUIZ");

  // 2. Identitas Pembelajaran & Instansi
  const [schoolName, setSchoolName] = useState("SMA Negeri 1 Makassar");
  const [teacherName, setTeacherName] = useState("Ismail, S.Pd.");
  const [activityTitle, setActivityTitle] = useState("Asesmen Formatif Harian");
  const [kelas, setKelas] = useState("Kelas 11 SMA/SMK (Fase F)");
  const [topic, setTopic] = useState("Penerapan ilmu sosial di masyarakat");

  // 3. Stimulus Gambar Cerita Tunggal
  const [stimulusImage, setStimulusImage] = useState<string | null>(null);
  const [stimulusNarrative, setStimulusNarrative] = useState(
    "Perhatikan ilustrasi dinamika sosial masyarakat di bawah ini sebelum menyelesaikan aktivitas pembelajaran.",
  );

  // 4. Parameter Pedagogi & Waktu
  const [tingkat, setTingkat] = useState(
    "Sulit (HOTS - Menganalisis & Mengevaluasi)",
  );
  const [jumlahSoal, setJumlahSoal] = useState<number>(3);
  const [formatSoal, setFormatSoal] = useState<FormatType>("Pilihan Ganda");
  const [menit, setMenit] = useState(5);
  const [detik, setDetik] = useState(0);

  // State Pengerjaan Siswa
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [textAnswers, setTextAnswers] = useState<Record<number, string>>({});
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Template Khusus
  const [sortItems, setSortItems] = useState<string[]>([
    "Identifikasi akar konflik sosial di lapangan",
    "Musyawarah mufakat bersama tokoh masyarakat",
    "Perumusan rencana aksi gotong royong",
    "Evaluasi hasil program secara berkala",
  ]);

  const [logicPairs, setLogicPairs] = useState([
    {
      id: 1,
      premis: "Partisipasi warga menurun drastis",
      solusi: "Transparansi anggaran & musyawarah berkala",
      matched: false,
    },
    {
      id: 2,
      premis: "Sengketa batas pekarangan antar warga",
      solusi: "Mediasi berlandaskan bukti dokumen sah",
      matched: false,
    },
    {
      id: 3,
      premis: "Tumpukan sampah menyumbat drainase",
      solusi: "Kerja bakti mingguan dan sanksi lingkungan",
      matched: false,
    },
  ]);

  const [mazePos, setMazePos] = useState({ x: 0, y: 0 });
  const mazeGrid = [
    ["START", "JALAN", "BUNTU"],
    ["RINTANGAN", "JALAN", "JALAN"],
    ["BUNTU", "RINTANGAN", "FINISH"],
  ];

  const sampleOptions: Record<number, string[]> = {
    1: [
      "Mengadakan musyawarah warga untuk menentukan solusi bersama",
      "Mengabaikan aspirasi warga dan mengambil keputusan sepihak",
      "Menyusun laporan tanpa survei lapangan secara langsung",
      "Membatasi interaksi antar kelompok masyarakat",
    ],
    2: [
      "Menganalisis dampak interaksi terhadap gotong royong",
      "Menghilangkan norma adat yang berlaku turun-temurun",
      "Menghentikan seluruh kegiatan kerja bakti lingkungan",
      "Menolak pertukaran informasi antar generasi",
    ],
    3: [
      "Menyediakan ruang dialog terbuka untuk mencari jalan tengah",
      "Memaksakan kehendak satu golongan ke golongan lain",
      "Menutup akses komunikasi antar perwakilan warga",
      "Menghindari evaluasi bersama terhadap program",
    ],
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("play") === "true") {
        setIsStudentMode(true);
      }
      const t = params.get("template") as TemplateType;
      if (t && ["QUIZ", "SORT", "LOGIC", "MAZE"].includes(t)) {
        setTemplate(t);
      }
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStimulusImage(URL.createObjectURL(file));
    }
  };

  const moveSort = (index: number, dir: "up" | "down") => {
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= sortItems.length) return;
    const copy = [...sortItems];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setSortItems(copy);
  };

  const handleCopyLink = () => {
    const studentUrl = `${window.location.origin}/?play=true&template=${template}`;
    navigator.clipboard.writeText(studentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Validasi Minimal 50%
  const totalQuestions = jumlahSoal;
  const answeredCount =
    formatSoal === "Pilihan Ganda"
      ? Object.keys(selectedAnswers).length
      : Object.values(textAnswers).filter((ans) => ans.trim().length > 0)
          .length;

  const minRequired = Math.ceil(totalQuestions * 0.5);
  const isSubmissionAllowed = answeredCount >= minRequired;

  const handleStartExam = () => {
    if (!studentNis.trim() || !studentName.trim()) {
      alert("Silakan lengkapi NIS dan Nama Siswa terlebih dahulu.");
      return;
    }
    setStartTime(Date.now());
    setIsStarted(true);
  };

  const handleOpenConfirm = () => {
    if (startTime) {
      const seconds = Math.floor((Date.now() - startTime) / 1000);
      setElapsedDuration(seconds);
    }
    setShowConfirmModal(true);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  // ==========================================
  // TAMPILAN KHUSUS SISWA (LEMBAR DARING RESMI)
  // ==========================================
  if (isStudentMode) {
    return (
      <div className="min-h-screen bg-[#070b19] text-slate-100 flex flex-col items-center justify-start p-3 sm:p-6 font-sans">
        <div className="w-full max-w-lg bg-[#0B132B] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header Kop Lembar Ujian Daring */}
          <div className="bg-[#070b19] border-b border-slate-800 px-5 py-3.5 flex items-center justify-between sticky top-0 z-20">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold text-cyan-400 tracking-wide uppercase block">
                {schoolName || "SEKOLAHKITA ACADEMIC"}
              </span>
              <h2 className="text-sm font-extrabold text-slate-100">
                Guru:{" "}
                <span className="text-[#FF7A00]">
                  {teacherName || "Pengampu Mapel"}
                </span>
              </h2>
              <span className="text-[10px] text-slate-400 block">
                {kelas.split("(")[0]} · {tingkat.split(" ")[0]}
              </span>
            </div>
            <span className="text-xs font-mono bg-slate-800 text-amber-300 px-2.5 py-1 rounded-md border border-slate-700 shrink-0">
              ⏱️ {menit}m {detik}s
            </span>
          </div>

          {!isStarted ? (
            <div className="p-6 space-y-4">
              <div className="text-center space-y-1">
                <span className="text-3xl">📋</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FF7A00]/20 text-[#FF7A00] font-bold border border-[#FF7A00]/40 inline-block mb-1">
                  [{template}] {activityTitle}
                </span>
                <h2 className="text-base font-bold text-slate-100">{topic}</h2>
                <p className="text-xs text-slate-400">
                  Silakan isi identitas resmi untuk perekaman buku leger.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Nomor Induk Siswa (NIS / NISN) *
                  </label>
                  <input
                    type="text"
                    value={studentNis}
                    onChange={(e) => setStudentNis(e.target.value)}
                    placeholder="Contoh: 21894"
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-[#FF7A00]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Nama Lengkap Siswa *
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Ketik nama lengkap Anda..."
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-[#FF7A00]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Kelas / No. Absen
                  </label>
                  <input
                    type="text"
                    value={studentAbsen}
                    onChange={(e) => setStudentAbsen(e.target.value)}
                    placeholder="Contoh: XI-MIPA 1 / 18"
                    className="w-full bg-[#070b19] border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-[#FF7A00]"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartExam}
                className="w-full py-3 mt-2 bg-[#FF7A00] text-slate-950 font-bold text-xs rounded-xl shadow-lg hover:opacity-95 transition"
              >
                Mulai Mengerjakan 🚀
              </button>
            </div>
          ) : (
            <div className="p-4 sm:p-5 space-y-4">
              {/* Kop Soal yang Sedang Dikerjakan Siswa */}
              <div className="bg-[#070b19] p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-[#FF7A00] uppercase">
                    [{template}] {activityTitle}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    NIS: {studentNis}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 truncate">
                    {studentName} ({studentAbsen})
                  </span>
                  <span className="text-[11px] text-cyan-300 font-semibold truncate ml-2">
                    {topic}
                  </span>
                </div>
              </div>

              {stimulusImage && (
                <div className="p-3 bg-[#070b19] border border-slate-800 rounded-xl space-y-2">
                  <span className="text-[10px] font-bold text-cyan-400 block">
                    Stimulus Kasus Visual:
                  </span>
                  <img
                    src={stimulusImage}
                    alt="Stimulus"
                    className="w-full max-h-48 object-contain rounded-lg"
                  />
                  <p className="text-[11px] text-slate-300 italic">
                    {stimulusNarrative}
                  </p>
                </div>
              )}

              {/* Template QUIZ (Pilihan Ganda Kunci Tunggal) */}
              {template === "QUIZ" && (
                <div className="space-y-4">
                  {Array.from({ length: jumlahSoal }, (_, i) => i + 1).map(
                    (num) => {
                      const isAnswered =
                        formatSoal === "Pilihan Ganda"
                          ? Boolean(selectedAnswers[num])
                          : Boolean(textAnswers[num]?.trim());

                      return (
                        <div
                          key={num}
                          className={`p-3.5 rounded-xl border transition space-y-2.5 ${
                            isAnswered
                              ? "border-cyan-800/60 bg-[#070b19]"
                              : "border-slate-800 bg-[#070b19]"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-[#FF7A00] flex items-center gap-1.5">
                              <span>Soal #{num}</span>
                              {isAnswered && (
                                <span className="text-[10px] text-emerald-400 font-normal">
                                  ✓ Terisi
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-300">
                              {formatSoal}
                            </span>
                          </div>
                          <p className="text-xs text-slate-200">
                            {stimulusImage
                              ? "Berdasarkan gambar di atas, bagaimana"
                              : "Bagaimana"}{" "}
                            implementasi konkret &quot;{topic}&quot; untuk{" "}
                            {kelas.split("(")[0]}?
                          </p>

                          {formatSoal === "Pilihan Ganda" ? (
                            <div className="space-y-2">
                              {(sampleOptions[num] || sampleOptions[1]).map(
                                (opt, idx) => {
                                  const letter = String.fromCharCode(65 + idx);
                                  const isSelected =
                                    selectedAnswers[num] === letter;
                                  return (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() => {
                                        // Pilihan Ganda Tunggal: Klik opsi baru otomatis melepaskan opsi lama
                                        setSelectedAnswers((prev) => ({
                                          ...prev,
                                          [num]: letter,
                                        }));
                                      }}
                                      className={`w-full text-left flex items-center gap-2.5 p-2.5 rounded-lg border text-xs transition ${
                                        isSelected
                                          ? "bg-[#FF7A00]/20 border-[#FF7A00] text-white"
                                          : "bg-[#0B132B] border-slate-800 text-slate-300 hover:border-slate-700"
                                      }`}
                                    >
                                      <span
                                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                                          isSelected
                                            ? "bg-[#FF7A00] text-slate-950 font-black"
                                            : "bg-slate-800 text-slate-400"
                                        }`}
                                      >
                                        {letter}
                                      </span>
                                      <span className="leading-snug">
                                        {opt}
                                      </span>
                                    </button>
                                  );
                                },
                              )}
                            </div>
                          ) : (
                            <textarea
                              rows={2}
                              value={textAnswers[num] || ""}
                              onChange={(e) =>
                                setTextAnswers((prev) => ({
                                  ...prev,
                                  [num]: e.target.value,
                                }))
                              }
                              placeholder="Ketik jawaban Anda di sini..."
                              className="w-full bg-[#0B132B] border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#FF7A00]"
                            />
                          )}
                        </div>
                      );
                    },
                  )}
                </div>
              )}

              {template === "SORT" && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-300">
                    Urutkan tahapan alur secara runut:
                  </p>
                  {sortItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-[#070b19] border border-slate-800"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#FF7A00]/20 border border-[#FF7A00]/40 text-[#FF7A00] flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span className="flex-1 text-xs text-slate-200">
                        {item}
                      </span>
                      <div className="flex gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveSort(idx, "up")}
                          disabled={idx === 0}
                          className="px-2 py-1 bg-slate-800 disabled:opacity-20 rounded text-[10px]"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSort(idx, "down")}
                          disabled={idx === sortItems.length - 1}
                          className="px-2 py-1 bg-slate-800 disabled:opacity-20 rounded text-[10px]"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {template === "LOGIC" && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-300">
                    Sentuh kartu masalah untuk mencocokkan tindakan solusi:
                  </p>
                  {logicPairs.map((pair) => (
                    <div
                      key={pair.id}
                      onClick={() =>
                        setLogicPairs(
                          logicPairs.map((it) =>
                            it.id === pair.id
                              ? { ...it, matched: !it.matched }
                              : it,
                          ),
                        )
                      }
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition space-y-1.5 ${pair.matched ? "bg-[#FF7A00]/20 border-[#FF7A00] text-white" : "bg-[#070b19] border-slate-800 text-slate-300"}`}
                    >
                      <div className="font-bold text-cyan-300">
                        ⚠️ Masalah: {pair.premis}
                      </div>
                      <div className="text-[11px] text-slate-300">
                        💡 Solusi: {pair.solusi}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {template === "MAZE" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 bg-[#070b19] p-3 rounded-xl border border-slate-800">
                    {mazeGrid.map((row, rIdx) =>
                      row.map((cell, cIdx) => {
                        const isCurrent =
                          mazePos.y === rIdx && mazePos.x === cIdx;
                        return (
                          <div
                            key={`${rIdx}-${cIdx}`}
                            className={`h-16 rounded-lg flex flex-col items-center justify-center text-xs font-bold border transition ${
                              isCurrent
                                ? "bg-[#FF7A00] border-[#FF7A00] text-slate-950 scale-105"
                                : cell === "FINISH"
                                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                                  : "bg-[#0B132B] border-slate-800 text-slate-400"
                            }`}
                          >
                            {isCurrent
                              ? "🚶 Siswa"
                              : cell === "FINISH"
                                ? "🏁 Finish"
                                : cell}
                          </div>
                        );
                      }),
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        mazePos.x < 2 &&
                        setMazePos((p) => ({ ...p, x: p.x + 1 }))
                      }
                      className="p-2.5 bg-slate-800 hover:bg-[#FF7A00] hover:text-slate-950 rounded-lg text-xs font-bold transition"
                    >
                      Maju Kanan ➡️
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        mazePos.y < 2 &&
                        setMazePos((p) => ({ ...p, y: p.y + 1 }))
                      }
                      className="p-2.5 bg-slate-800 hover:bg-[#FF7A00] hover:text-slate-950 rounded-lg text-xs font-bold transition"
                    >
                      Maju Bawah ⬇️
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-2 space-y-2">
                {template === "QUIZ" && (
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">
                      Terisi:{" "}
                      <strong className="text-cyan-300">{answeredCount}</strong>{" "}
                      dari {totalQuestions} Soal
                    </span>
                    {!isSubmissionAllowed ? (
                      <span className="text-amber-400 font-medium">
                        ⚠️ Minimal {minRequired} soal terisi
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-medium">
                        ✓ Memenuhi syarat kirim
                      </span>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  disabled={template === "QUIZ" && !isSubmissionAllowed}
                  onClick={handleOpenConfirm}
                  className={`w-full py-3 font-bold text-xs rounded-xl shadow-lg transition ${
                    template === "QUIZ" && !isSubmissionAllowed
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                      : "bg-[#FF7A00] text-slate-950 hover:opacity-90"
                  }`}
                >
                  {template === "QUIZ" && !isSubmissionAllowed
                    ? `Lengkapi minimal ${minRequired} soal untuk mengirim`
                    : "Kirim Jawaban Modul"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Konfirmasi Ringkasan & Catatan Durasi Bersih */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#0B132B] border border-slate-700 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
              <div className="text-center space-y-1">
                <span className="text-3xl">📤</span>
                <h3 className="font-bold text-sm text-slate-100">
                  Konfirmasi Kirim Jawaban
                </h3>
                <p className="text-xs text-slate-400">
                  Data ini akan direkam ke buku leger nilai guru.
                </p>
              </div>

              <div className="p-3.5 bg-[#070b19] border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">NIS / NISN:</span>
                  <span className="font-mono font-semibold text-cyan-300">
                    {studentNis}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Nama Siswa:</span>
                  <span className="font-semibold text-slate-200">
                    {studentName}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Soal Terjawab:</span>
                  <span className="font-bold text-emerald-400">
                    {answeredCount} dari {totalQuestions} Soal
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Durasi Pengerjaan:</span>
                  <span className="font-mono font-bold text-amber-300">
                    {formatSeconds(elapsedDuration)}
                  </span>
                </div>

                {answeredCount < totalQuestions && (
                  <div className="text-[11px] text-amber-300 pt-1.5 border-t border-slate-800">
                    ⚠️ Ada {totalQuestions - answeredCount} soal yang masih
                    dikosongkan.
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-300 transition"
                >
                  Periksa Lagi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowConfirmModal(false);
                    alert(
                      `Terkirim!\n\nNIS: ${studentNis}\nNama: ${studentName}\nDurasi: ${formatSeconds(elapsedDuration)}\nSoal: ${answeredCount}/${totalQuestions}\n\nNilai dan durasi waktu siap diurutkan ke leger!`,
                    );
                  }}
                  className="flex-1 py-2.5 bg-[#FF7A00] text-slate-950 font-bold text-xs rounded-xl hover:opacity-90 transition"
                >
                  Ya, Kirim Sekarang
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==============================================================
  // TAMPILAN GURU: SCROLLING KE BAWAH DI MOBILE, 3 KOLOM DI DESKTOP
  // ==============================================================
  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 flex flex-col font-sans">
      <header className="h-14 border-b border-slate-800 bg-[#0B132B] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo-jacs-enterprise.png"
            alt="JacS Enterprise"
            className="w-7 h-7 object-contain rounded-md"
          />
          <span className="font-extrabold text-base tracking-wide text-[#FF7A00]">
            GameCraft Studio
          </span>
          <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-amber-500/30">
            {kelas.split(" ")[0]} {kelas.split(" ")[1]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              window.open(`/?play=true&template=${template}`, "_blank")
            }
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
          >
            Pratinjau Siswa ↗
          </button>
          <button
            type="button"
            onClick={() => setShowPublishModal(true)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#FF7A00] text-slate-950 hover:opacity-95 transition"
          >
            Terbitkan
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-5 p-3 sm:p-5 max-w-7xl w-full mx-auto">
        {/* BAGIAN 1: PENGATURAN & IDENTITAS */}
        <section className="w-full lg:col-span-3 flex flex-col gap-4 bg-[#0B132B] border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div>
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              1. PILIHAN TEMPLATE
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {(["QUIZ", "SORT", "LOGIC", "MAZE"] as TemplateType[]).map(
                (t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTemplate(t)}
                    className={`py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                      template === t
                        ? "bg-[#FF7A00] border-[#FF7A00] text-slate-950 shadow-md shadow-[#FF7A00]/25"
                        : "bg-[#070b19] border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    {t === "QUIZ" && "🎯"} {t === "SORT" && "🗂️"}{" "}
                    {t === "LOGIC" && "🧩"} {t === "MAZE" && "🧭"} {t}
                  </button>
                ),
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              2. IDENTITAS PEMBELAJARAN
            </h4>
            <label className="text-[11px] text-slate-400 block mb-1">
              Nama Sekolah / Lembaga
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="Contoh: SMA Negeri 1 Makassar"
              className="w-full bg-[#070b19] border border-slate-700 rounded-lg p-2 text-xs text-slate-200 mb-2"
            />

            <label className="text-[11px] text-slate-400 block mb-1">
              Nama Guru Pengampu
            </label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="Contoh: Ismail, S.Pd."
              className="w-full bg-[#070b19] border border-slate-700 rounded-lg p-2 text-xs text-slate-200 mb-2"
            />

            <label className="text-[11px] text-slate-400 block mb-1">
              Judul Aktivitas / Kuis Daring
            </label>
            <input
              type="text"
              value={activityTitle}
              onChange={(e) => setActivityTitle(e.target.value)}
              placeholder="Contoh: Asesmen Formatif Harian"
              className="w-full bg-[#070b19] border border-slate-700 rounded-lg p-2 text-xs text-slate-200 mb-2"
            />

            <label className="text-[11px] text-slate-400 block mb-1">
              Jenjang / Tingkat Kelas
            </label>
            <select
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              className="w-full bg-[#070b19] border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 mb-2"
            >
              <optgroup label="Tingkat SMA / SMK (Fase E & F)">
                <option>Kelas 12 SMA/SMK (Fase F)</option>
                <option>Kelas 11 SMA/SMK (Fase F)</option>
                <option>Kelas 10 SMA/SMK (Fase E)</option>
              </optgroup>
              <optgroup label="Tingkat SMP / MTs (Fase D)">
                <option>Kelas 9 SMP (Fase D)</option>
                <option>Kelas 8 SMP (Fase D)</option>
                <option>Kelas 7 SMP (Fase D)</option>
              </optgroup>
              <optgroup label="Tingkat SD / MI (Fase A, B, C)">
                <option>Kelas 6 SD (Fase C)</option>
                <option>Kelas 5 SD (Fase C)</option>
                <option>Kelas 4 SD (Fase B)</option>
                <option>Kelas 3 SD (Fase B)</option>
                <option>Kelas 2 SD (Fase A)</option>
                <option>Kelas 1 SD (Fase A)</option>
              </optgroup>
              <optgroup label="Pendidikan Usia Dini">
                <option>PAUD / TK B (Fondasi)</option>
                <option>PAUD / TK A (Fondasi)</option>
              </optgroup>
            </select>

            <label className="text-[11px] text-slate-400 block mb-1">
              Materi / Topik Pembelajaran
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Topik / Materi Pokok"
              className="w-full bg-[#070b19] border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                3. GAMBAR CERITA / KASUS
              </h4>
              {stimulusImage && (
                <button
                  type="button"
                  onClick={() => setStimulusImage(null)}
                  className="text-[10px] text-red-400 hover:underline"
                >
                  Hapus
                </button>
              )}
            </div>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-[#FF7A00] rounded-xl p-3 cursor-pointer transition bg-[#070b19]">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {stimulusImage ? (
                <div className="text-center space-y-1.5">
                  <img
                    src={stimulusImage}
                    alt="Stimulus"
                    className="max-h-24 rounded mx-auto object-contain border border-slate-800"
                  />
                  <span className="text-[10px] text-emerald-400 font-semibold block">
                    ✓ Gambar terpasang
                  </span>
                </div>
              ) : (
                <div className="text-center space-y-1 py-1">
                  <span className="text-xl">🖼️</span>
                  <span className="text-xs font-bold text-slate-300 block">
                    Unggah Gambar Cerita
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Satu stimulus untuk semua soal
                  </span>
                </div>
              )}
            </label>
          </div>

          <div>
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              4. TINGKAT KESULITAN
            </h4>
            <select
              value={tingkat}
              onChange={(e) => setTingkat(e.target.value)}
              className="w-full bg-[#070b19] border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200"
            >
              <option>Mudah (LOTS - Mengingat & Memahami)</option>
              <option>Sedang (MOTS - Menerapkan & Menentukan)</option>
              <option>Sulit (HOTS - Menganalisis & Mengevaluasi)</option>
              <option>Kompetisi / Olimpiade (Kreasi & Eksplorasi)</option>
            </select>
          </div>

          <div>
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              5. KONFIGURASI MODUL
            </h4>
            <div className="space-y-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Jumlah Butir Soal
                </label>
                <select
                  value={jumlahSoal}
                  onChange={(e) => setJumlahSoal(Number(e.target.value))}
                  className="w-full bg-[#070b19] border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                >
                  <option value={3}>3 Butir / Rintangan</option>
                  <option value={5}>5 Butir / Rintangan</option>
                </select>
              </div>

              {template === "QUIZ" && (
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    Format Jawaban
                  </label>
                  <select
                    value={formatSoal}
                    onChange={(e) =>
                      setFormatSoal(e.target.value as FormatType)
                    }
                    className="w-full bg-[#070b19] border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  >
                    <option value="Pilihan Ganda">Pilihan Ganda (A-D)</option>
                    <option value="Isian Singkat">Isian Singkat</option>
                    <option value="Essai">Essai / Uraian</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              6. PARAMETER WAKTU
            </h4>
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

        {/* BAGIAN 2: EDITOR GURU */}
        <section className="w-full lg:col-span-5 flex flex-col bg-[#0B132B] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
          <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>Editor Soal:</span>
                <span className="px-2 py-0.5 rounded bg-[#FF7A00]/20 border border-[#FF7A00]/40 text-[#FF7A00]">
                  {template}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                {activityTitle} · {schoolName} (Guru: {teacherName})
              </p>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded bg-slate-800 text-amber-300 font-medium">
              Mode Guru
            </span>
          </div>

          {stimulusImage && (
            <div className="mb-4 p-3.5 bg-[#070b19] border border-cyan-800/40 rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-cyan-400 block">
                🖼️ Gambar Stimulus Utama Pembelajaran:
              </span>
              <img
                src={stimulusImage}
                alt="Stimulus"
                className="w-full max-h-48 object-cover rounded-lg border border-slate-700"
              />
              <textarea
                rows={2}
                value={stimulusNarrative}
                onChange={(e) => setStimulusNarrative(e.target.value)}
                className="w-full bg-[#0B132B] border border-slate-700 rounded-lg p-2 text-xs text-slate-300"
              />
            </div>
          )}

          <div className="space-y-4">
            {template === "MAZE" ? (
              <MazeEditor jumlahSoal={jumlahSoal} topic={topic} kelas={kelas} />
            ) : (
              Array.from({ length: jumlahSoal }).map((_, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#FF7A00]">Soal #{idx + 1}</span>
                    <span className="text-[11px] text-slate-400">Pilihan Ganda</span>
                  </div>
                  <p className="text-xs text-slate-300 mb-2">
                    Soal #{idx + 1}: Bagaimana implementasi konkret &quot;{topic}&quot; untuk {kelas}?
                  </p>
                  <textarea
                    placeholder="Simulasi ketik jawaban..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-[#3382F6] resize-none h-16"
                  />
                </div>
              ))
            )}
            </div>
        </section>

        {/* BAGIAN 3: PRATINJAU GAMEPLAY GURU */}
        <section className="w-full lg:col-span-4 flex flex-col bg-[#0B132B] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">
              SIMULASI GAMEPLAY
            </span>
            <span className="text-xs font-mono bg-slate-800 text-amber-300 px-2.5 py-1 rounded-md border border-slate-700">
              ⏱️ {menit}m {detik}s
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#070b19] border border-slate-800 mb-4">
            <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1">
              <span className="text-cyan-400 font-bold uppercase">
                {template} MODE
              </span>
              <span className="text-amber-400 font-semibold">SKOR: 100</span>
            </div>
            <h5 className="text-xs font-bold text-slate-100 truncate">
              {activityTitle}: {topic}
            </h5>
          </div>

          <div className="space-y-4">
            {Array.from({ length: jumlahSoal }, (_, i) => i + 1).map((num) => (
              <div
                key={num}
                className="p-3.5 rounded-xl border border-slate-800 bg-[#070b19]"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-[#FF7A00]">
                    Soal #{num}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-300">
                    {formatSoal}
                  </span>
                </div>
                <p className="text-xs text-slate-200 mb-3">
                  Soal #{num}: Bagaimana implementasi konkret &quot;{topic}
                  &quot; untuk {kelas.split("(")[0]}?
                </p>
                <textarea
                  rows={2}
                  placeholder="Simulasi ketik jawaban..."
                  className="w-full bg-[#0B132B] border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => alert("Selesai pratinjau.")}
            className="w-full mt-4 py-2.5 bg-[#FF7A00] text-slate-950 font-bold text-xs rounded-lg hover:opacity-90 transition"
          >
            Uji Selesai Modul {template}
          </button>
        </section>
      </main>

      {/* Modal Terbitkan */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0B132B] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">🚀</span>
                <h3 className="font-bold text-sm text-[#FF7A00]">
                  Tautan Siswa Siap Dibagikan!
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Tautan evaluasi daring <strong>{activityTitle}</strong> (
              {schoolName} - Guru: {teacherName}) siap dikerjakan siswa.
            </p>

            <div className="p-3 bg-[#070b19] border border-slate-800 rounded-lg flex items-center justify-between gap-2">
              <span className="truncate text-[11px] font-mono text-cyan-400">
                https://gamecraft-studio-eta.vercel.app/?play=true&template=
                {template}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-[#FF7A00] text-slate-950 font-bold rounded text-[11px] shrink-0 hover:opacity-90"
              >
                {copied ? "Tersalin! ✓" : "Salin Link"}
              </button>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  window.open(
                    `https://api.whatsapp.com/send?text=${encodeURIComponent(`Ayo kerjakan evaluasi: ${activityTitle} - ${topic} (${schoolName} / Guru: ${teacherName}): https://gamecraft-studio-eta.vercel.app/?play=true&template=${template}`)}`,
                    "_blank",
                  );
                }}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-200 transition"
              >
                Bagikan ke WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-xs font-semibold rounded-lg text-slate-200 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}