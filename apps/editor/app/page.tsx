"use client";

import { useState, useMemo } from "react";

type TemplateType = "quiz" | "category" | "logic" | "maze";
type PhaseType = "Fase A" | "Fase B/C" | "Fase D" | "Fase E/F";
type DifficultyType = "Mudah" | "Sedang" | "HOTS";
type QuizFormatType = "mcq" | "short" | "essay";
type ThemeMode = "dark" | "light";
type ViewportMode = "mobile" | "tablet" | "desktop";

interface CategoryItem {
  id: string;
  name: string;
  targetCategory: string;
}

interface QuizQuestion {
  question: string;
  format: QuizFormatType;
  options?: string[];
  answerIndex?: number;
  expectedKeyword?: string;
  rubricHint?: string;
}

export default function GameCraftEditor() {
  const [selectedJumlah, setSelectedJumlah] = useState<number>(5);
  const [jumlahSoal, setJumlahSoal] = useState<number>(10);
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");
  const [selectedPhaseRaw, setSelectedPhaseRaw] = useState(
    "Fase E/F (SMA/SMK Kelas 10-12)",
  );
  const [subjectInput, setSubjectInput] = useState(
    "Penerapan ilmu sosial di masyarakat",
  );

  const [activeTemplate, setActiveTemplate] = useState<TemplateType>("logic");
  const [quizFormat, setQuizFormat] = useState<QuizFormatType>("mcq");
  const [questionCountSelect, setQuestionCountSelect] = useState<string>("5");
  const [customQuestionCount, setCustomQuestionCount] = useState<string>("");

  const [categoryCount, setCategoryCount] = useState<number>(2);
  const [itemCount, setItemCount] = useState<number>(4);

  const [maxBlocks, setMaxBlocks] = useState<number>(6);
  const [gridSize, setGridSize] = useState<number>(4);

  const [difficulty, setDifficulty] = useState<DifficultyType>("Sedang");
  const [isNoTimer, setIsNoTimer] = useState<boolean>(false);
  const [timerMinutes, setTimerMinutes] = useState<number>(1);
  const [timerSecondsOnly, setTimerSecondsOnly] = useState<number>(30);
  const [viewportMode, setViewportMode] = useState<ViewportMode>("mobile");

  const [studentInput, setStudentInput] = useState("");
  const [sortIndex, setSortIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [userCommands, setUserCommands] = useState<string[]>([
    "MAJU ➡️",
    "PUTAR KANAN ⤵️",
  ]);
  const [playerPos, setPlayerPos] = useState({ r: 0, c: 0 });
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const totalDurationSeconds = useMemo(() => {
    if (isNoTimer) return 0;
    return timerMinutes * 60 + timerSecondsOnly;
  }, [isNoTimer, timerMinutes, timerSecondsOnly]);

  const effectiveQuestionCount = useMemo(() => {
    if (questionCountSelect === "custom") {
      const parsed = parseInt(customQuestionCount, 10);
      return isNaN(parsed) || parsed < 1 ? 1 : Math.min(parsed, 30);
    }
    return parseInt(questionCountSelect, 10) || 5;
  }, [questionCountSelect, customQuestionCount]);

  const currentPhaseKey: PhaseType = useMemo(() => {
    if (selectedPhaseRaw.includes("Fase A")) return "Fase A";
    if (selectedPhaseRaw.includes("Fase B/C")) return "Fase B/C";
    if (selectedPhaseRaw.includes("Fase D")) return "Fase D";
    return "Fase E/F";
  }, [selectedPhaseRaw]);

  const quizList: QuizQuestion[] = useMemo(() => {
    const query = subjectInput.trim() || "Materi Pembelajaran";
    const list: QuizQuestion[] = [];
    for (let i = 0; i < effectiveQuestionCount; i++) {
      if (quizFormat === "mcq") {
        list.push({
          question: `[Tingkat: ${difficulty}] Soal #${i + 1}: Apa dampak paling signifikan dari "${query}"?`,
          format: "mcq",
          options: [
            `Menganalisis fenomena dan merumuskan solusi #${i + 1}`,
            "Menghafal istilah tanpa konteks nyata",
            "Mengambil kesimpulan tanpa pengujian data",
            "Mengabaikan keterkaitan variabel masalah",
          ],
          answerIndex: 0,
        });
      } else if (quizFormat === "short") {
        list.push({
          question: `[Tingkat: ${difficulty}] Soal Isian #${i + 1}: Istilah kunci metode penyelesaian pada topik "${query}"?`,
          format: "short",
          expectedKeyword: "mediasi",
          rubricHint: "Kata kunci rujukan: mediasi / konsolidasi",
        });
      } else {
        list.push({
          question: `[Tingkat: ${difficulty}] Soal Essai #${i + 1}: Analisis implementasi "${query}" di masyarakat?`,
          format: "essay",
          rubricHint: "Kriteria: Argumen (40%), data (30%), solusi (30%).",
        });
      }
    }
    return list;
  }, [subjectInput, effectiveQuestionCount, difficulty, quizFormat]);

  const categoryData = useMemo(() => {
    const query = subjectInput.trim() || "Materi";
    const categories =
      categoryCount === 2
        ? [`Konsep ${query}`, `Implementasi ${query}`]
        : [`Prinsip Dasar`, `Kasus Nyata`, `Evaluasi`];

    const items: CategoryItem[] = [
      {
        id: "1",
        name: `Prinsip Teori ${query}`,
        targetCategory: categories[0],
      },
      { id: "2", name: `Studi Lapangan Kasus`, targetCategory: categories[1] },
      { id: "3", name: `Kajian Literatur`, targetCategory: categories[0] },
      { id: "4", name: `Aplikasi Warga`, targetCategory: categories[1] },
    ].slice(0, itemCount);

    return { categories, items };
  }, [subjectInput, categoryCount, itemCount]);

  const currentQuiz = quizList[quizIndex % quizList.length];
  const currentItem = categoryData.items[sortIndex % categoryData.items.length];

  const isDark = themeMode === "dark";

  const ui = {
    bgApp: isDark
      ? "bg-[#090D16] text-slate-100"
      : "bg-slate-100 text-slate-800",
    header: isDark
      ? "bg-[#0B1120] border-b border-cyan-500/30 shadow-[0_4px_15px_rgba(6,182,212,0.12)]"
      : "bg-white border-b border-slate-300 shadow-xs",
    panel: isDark
      ? "bg-[#0D1527] border border-blue-500/30 shadow-[0_0_12px_rgba(51,130,246,0.12)]"
      : "bg-white border border-slate-300 shadow-xs",
    panelAccent: isDark
      ? "bg-[#111C35] border border-orange-500/40"
      : "bg-slate-50 border border-slate-200",
    input: isDark
      ? "bg-[#0B1222] border border-blue-500/30 text-white placeholder:text-slate-500 focus:border-cyan-400"
      : "bg-white border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-blue-600",
    card: isDark
      ? "bg-[#10192E] border border-slate-800"
      : "bg-slate-50 border border-slate-200 text-slate-800",
    textMuted: isDark ? "text-slate-400" : "text-slate-600",
    title: isDark ? "text-white" : "text-slate-800",
  };

  const viewportStyles = useMemo(() => {
    switch (viewportMode) {
      case "tablet":
        return "w-full max-w-[340px] aspect-[4/3]";
      case "desktop":
        return "w-full aspect-[16/9]";
      case "mobile":
      default:
        return "w-full max-w-[280px] aspect-[9/16]";
    }
  }, [viewportMode]);

  return (
    <div
      className={`flex h-screen w-screen flex-col font-sans overflow-hidden select-none ${ui.bgApp}`}
    >
      {/* HEADER UTAMA: SUBJUDUL HANYA SEKOLAHKITA BY JACS DEVELOPER */}
      <header
        className={`flex h-13 min-h-[52px] items-center justify-between px-5 z-20 ${ui.header}`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-[0_0_12px_rgba(255,122,0,0.5)] border border-orange-500/50 bg-[#090D16] p-0.5">
            <img
              src="/Logo-JacS-Enterprise.png"
              alt="JacS Enterprise Logo"
              className="h-full w-full object-contain filter drop-shadow-[0_0_6px_rgba(255,122,0,0.7)]"
            />
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-cyan-500 text-[7px] font-bold text-black">
              AI
            </span>
          </div>

          <div className="min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <h1
                className={`text-sm font-bold tracking-tight whitespace-nowrap ${ui.title}`}
              >
                GameCraft Studio
              </h1>
              <span className="rounded-full bg-orange-500/10 border border-orange-500/40 px-2 py-0.2 text-[9px] font-bold text-[#FF7A00] whitespace-nowrap">
                {currentPhaseKey} · {difficulty}
              </span>
            </div>
            {/* SUBJUDUL BERSIH TANPA MENGULANG TOPIK MAPEL */}
            <p className={`truncate text-[10px] font-medium ${ui.textMuted}`}>
              SEKOLAHKITA by JACS Developer
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setThemeMode(isDark ? "light" : "dark")}
            className={`flex items-center gap-1 rounded-xl border px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
              isDark
                ? "bg-[#10192E] border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/40"
                : "bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <span>{isDark ? "🌙 Dark" : "☀️ Light"}</span>
          </button>

          <button
            type="button"
            className={`rounded-xl border px-3 py-1 text-xs font-semibold transition cursor-pointer ${
              isDark
                ? "bg-[#10192E] border-blue-500/40 text-slate-200"
                : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            Pratinjau
          </button>

          <button
            type="button"
            className="rounded-xl bg-[#FF7A00] px-3.5 py-1 text-xs font-bold text-white shadow-xs hover:bg-orange-600 active:scale-95 transition cursor-pointer"
          >
            Terbitkan
          </button>
        </div>
      </header>

      {/* DASHBOARD AREA: BEBAS SCROLL VERTIKAL */}
      <div className="flex flex-1 overflow-hidden p-2.5 gap-2.5">
        {/* PANEL KIRI: KONFIGURASI MODUL */}
        <aside
          className={`w-[290px] shrink-0 rounded-xl p-3 flex flex-col justify-between overflow-y-auto ${ui.panel}`}
        >
          <div className="space-y-2.5">
            <div>
              <h2
                className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-cyan-400" : "text-slate-700"}`}
              >
                1. Identitas Pembelajaran
              </h2>
              <div className="mt-1 space-y-1.5">
                <select
                  value={selectedPhaseRaw}
                  onChange={(e) => setSelectedPhaseRaw(e.target.value)}
                  className={`w-full rounded-lg p-1.5 text-[11px] font-normal outline-none cursor-pointer ${ui.input}`}
                >
                  <option className={isDark ? "bg-[#090D16] text-white" : ""}>
                    Fase A (SD Kelas 1-2)
                  </option>
                  <option className={isDark ? "bg-[#090D16] text-white" : ""}>
                    Fase B/C (SD Kelas 3-6)
                  </option>
                  <option className={isDark ? "bg-[#090D16] text-white" : ""}>
                    Fase D (SMP Kelas 7-9)
                  </option>
                  <option className={isDark ? "bg-[#090D16] text-white" : ""}>
                    Fase E/F (SMA/SMK Kelas 10-12)
                  </option>
                </select>

                <input
                  type="text"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  placeholder="Mata Pelajaran..."
                  className={`w-full rounded-lg p-1.5 text-[11px] font-normal outline-none ${ui.input}`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h2
                  className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-cyan-400" : "text-slate-700"}`}
                >
                  2. Pilihan Template
                </h2>
                <span className="text-[9px] font-semibold text-[#FF7A00] bg-orange-500/10 border border-orange-500/40 px-1.5 py-0.2 rounded">
                  {activeTemplate.toUpperCase()}
                </span>
              </div>

              <div className="mt-1 grid grid-cols-2 gap-1.5">
                {(["quiz", "category", "logic", "maze"] as TemplateType[]).map(
                  (tmpl) => (
                    <button
                      key={tmpl}
                      type="button"
                      onClick={() => {
                        setActiveTemplate(tmpl);
                        setFeedback(null);
                      }}
                      className={`rounded-lg border p-1.5 text-center text-[11px] uppercase transition cursor-pointer font-medium ${
                        activeTemplate === tmpl
                          ? "border-[#FF7A00] bg-[#FF7A00] text-white shadow-xs"
                          : isDark
                            ? "border-slate-800 bg-[#0B1222] text-slate-300 hover:border-blue-500/50"
                            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {tmpl === "quiz"
                        ? "🎯 Quiz"
                        : tmpl === "category"
                          ? "🗂️ Sort"
                          : tmpl === "logic"
                            ? "🧩 Logic"
                            : "🧭 Maze"}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div>
              <h2
                className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-cyan-400" : "text-slate-700"}`}
              >
                3. Konfigurasi Modul
              </h2>

              {activeTemplate === "logic" && (
                <div className={`mt-1 rounded-lg p-2 ${ui.panelAccent}`}>
                  <label
                    className={`text-[10px] font-medium block ${ui.title}`}
                  >
                    Maksimal Blok Instruksi
                  </label>
                  <select
                    value={maxBlocks}
                    onChange={(e) => setMaxBlocks(Number(e.target.value))}
                    className={`mt-1 w-full rounded-md p-1.5 text-[11px] font-normal outline-none cursor-pointer ${ui.input}`}
                  >
                    <option
                      className={isDark ? "bg-[#090D16] text-white" : ""}
                      value={4}
                    >
                      Maksimal 4 Blok
                    </option>
                    <option
                      className={isDark ? "bg-[#090D16] text-white" : ""}
                      value={6}
                    >
                      Maksimal 6 Blok
                    </option>
                    <option
                      className={isDark ? "bg-[#090D16] text-white" : ""}
                      value={10}
                    >
                      Maksimal 10 Blok
                    </option>
                  </select>
                </div>
              )}

              {activeTemplate === "quiz" && (
                <div
                  className={`mt-1 rounded-lg p-2 space-y-1.5 ${ui.panelAccent}`}
                >
                  <div className="grid grid-cols-2 gap-1.5">
                    <div>
                      <label
                        className={`text-[10px] font-medium block ${ui.title}`}
                      >
                        Format
                      </label>
                      <select
                        value={quizFormat}
                        onChange={(e) =>
                          setQuizFormat(e.target.value as QuizFormatType)
                        }
                        className={`mt-0.5 w-full rounded-md p-1.5 text-[11px] font-normal outline-none cursor-pointer ${ui.input}`}
                      >
                        <option
                          className={isDark ? "bg-[#090D16] text-white" : ""}
                          value="mcq"
                        >
                          Pilgan
                        </option>
                        <option
                          className={isDark ? "bg-[#090D16] text-white" : ""}
                          value="short"
                        >
                          Isian
                        </option>
                        <option
                          className={isDark ? "bg-[#090D16] text-white" : ""}
                          value="essay"
                        >
                          Essai
                        </option>
                      </select>
                    </div>
                    <div>
                      <label
                        className={`text-[10px] font-medium block ${ui.title}`}
                      >
                        Jumlah
                      </label>
                      <select
                        value={questionCountSelect}
                        onChange={(e) => setQuestionCountSelect(e.target.value)}
                        className={`mt-0.5 w-full rounded-md p-1.5 text-[11px] font-normal outline-none cursor-pointer ${ui.input}`}
                      >
                        <option
                          className={isDark ? "bg-[#090D16] text-white" : ""}
                          value="3"
                        >
                          3 Soal
                        </option>
                        <option
                          className={isDark ? "bg-[#090D16] text-white" : ""}
                          value="5"
                        >
                          5 Soal
                        </option>
                        <option
                          className={isDark ? "bg-[#090D16] text-white" : ""}
                          value="10"
                        >
                          10 Soal
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTemplate === "category" && (
                <div
                  className={`mt-1 rounded-lg p-2 space-y-1.5 ${ui.panelAccent}`}
                >
                  <div className="grid grid-cols-2 gap-1.5">
                    <div>
                      <label
                        className={`text-[10px] font-medium block ${ui.title}`}
                      >
                        Wadah
                      </label>
                      <select
                        value={categoryCount}
                        onChange={(e) =>
                          setCategoryCount(Number(e.target.value))
                        }
                        className={`mt-0.5 w-full rounded-md p-1.5 text-[11px] font-normal outline-none cursor-pointer ${ui.input}`}
                      >
                        <option
                          className={isDark ? "bg-[#090D16] text-white" : ""}
                          value={2}
                        >
                          2 Wadah
                        </option>
                        <option
                          className={isDark ? "bg-[#090D16] text-white" : ""}
                          value={3}
                        >
                          3 Wadah
                        </option>
                      </select>
                    </div>
                    <div>
                      <label
                        className={`text-[10px] font-medium block ${ui.title}`}
                      >
                        Item
                      </label>
                      <select
                        value={itemCount}
                        onChange={(e) => setItemCount(Number(e.target.value))}
                        className={`mt-0.5 w-full rounded-md p-1.5 text-[11px] font-normal outline-none cursor-pointer ${ui.input}`}
                      >
                        <option
                          className={isDark ? "bg-[#090D16] text-white" : ""}
                          value={4}
                        >
                          4 Objek
                        </option>
                        <option
                          className={isDark ? "bg-[#090D16] text-white" : ""}
                          value={6}
                        >
                          6 Objek
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTemplate === "maze" && (
                <div className={`mt-1 rounded-lg p-2 ${ui.panelAccent}`}>
                  <label
                    className={`text-[10px] font-medium block ${ui.title}`}
                  >
                    Ukuran Labirin
                  </label>
                  <select
                    value={gridSize}
                    onChange={(e) => setGridSize(Number(e.target.value))}
                    className={`mt-1 w-full rounded-md p-1.5 text-[11px] font-normal outline-none cursor-pointer ${ui.input}`}
                  >
                    <option
                      className={isDark ? "bg-[#090D16] text-white" : ""}
                      value={3}
                    >
                      3 x 3 Grid
                    </option>
                    <option
                      className={isDark ? "bg-[#090D16] text-white" : ""}
                      value={4}
                    >
                      4 x 4 Grid
                    </option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <h2
                className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-cyan-400" : "text-slate-700"}`}
              >
                4. Parameter Gameplay
              </h2>
              <div className="mt-1 space-y-1.5">
                <select
                  value={difficulty}
                  onChange={(e) =>
                    setDifficulty(e.target.value as DifficultyType)
                  }
                  className={`w-full rounded-lg p-1.5 text-[11px] font-normal outline-none cursor-pointer ${ui.input}`}
                >
                  <option
                    className={isDark ? "bg-[#090D16] text-white" : ""}
                    value="Mudah"
                  >
                    Mudah (LOTS)
                  </option>
                  <option
                    className={isDark ? "bg-[#090D16] text-white" : ""}
                    value="Sedang"
                  >
                    Sedang (MOTS)
                  </option>
                  <option
                    className={isDark ? "bg-[#090D16] text-white" : ""}
                    value="HOTS"
                  >
                    HOTS (Analisis)
                  </option>
                </select>

                <div
                  className={`rounded-lg p-2 space-y-1.5 border ${isDark ? "bg-[#0B1222] border-blue-500/20" : "bg-slate-50 border-slate-300"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-medium ${ui.title}`}>
                      Batas Waktu
                    </span>
                    <span className="text-[9px] font-bold text-[#FF7A00]">
                      {isNoTimer
                        ? "Bebas"
                        : `${timerMinutes}m ${timerSecondsOnly}s`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <div
                      className={`flex items-center rounded-md px-1.5 py-1 ${ui.input}`}
                    >
                      <input
                        type="number"
                        min="0"
                        max="60"
                        value={timerMinutes}
                        onChange={(e) =>
                          setTimerMinutes(
                            Math.max(0, parseInt(e.target.value) || 0),
                          )
                        }
                        className="w-full text-[11px] font-normal outline-none text-center bg-transparent"
                      />
                      <span className="text-[9px] font-medium opacity-60">
                        mnt
                      </span>
                    </div>

                    <div
                      className={`flex items-center rounded-md px-1.5 py-1 ${ui.input}`}
                    >
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={timerSecondsOnly}
                        onChange={(e) =>
                          setTimerSecondsOnly(
                            Math.max(
                              0,
                              Math.min(59, parseInt(e.target.value) || 0),
                            ),
                          )
                        }
                        className="w-full text-[11px] font-normal outline-none text-center bg-transparent"
                      />
                      <span className="text-[9px] font-medium opacity-60">
                        dtk
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {[
                      { label: "30s", m: 0, s: 30 },
                      { label: "1m", m: 1, s: 0 },
                      { label: "2m", m: 2, s: 0 },
                      { label: "5m", m: 5, s: 0 },
                    ].map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => {
                          setTimerMinutes(p.m);
                          setTimerSecondsOnly(p.s);
                        }}
                        className={`flex-1 rounded py-0.5 text-[9px] font-medium border transition cursor-pointer ${
                          isDark
                            ? "border-slate-800 bg-[#10192E] text-slate-300"
                            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* PANEL TENGAH: EDITOR DENGAN PALET SEDERHANA, TANPA BOLD, WARNA RAMAH MATA */}
        <main
          className={`flex-1 rounded-xl p-4 flex flex-col justify-between overflow-hidden border ${isDark ? "border-cyan-500/30 bg-[#0B1120]" : "border-slate-300 bg-white shadow-xs"}`}
        >
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-blue-500/20">
            <div>
              <h2 className={`text-base font-bold tracking-tight ${ui.title}`}>
                Editor Modul: {activeTemplate.toUpperCase()}
              </h2>
              <p className={`text-[11px] font-normal mt-0.5 ${ui.textMuted}`}>
                Kanvas Perancangan & Skenario Interaktif Pembelajaran
              </p>
            </div>

            <div
              className={`flex items-center gap-1 p-0.5 rounded-lg border ${isDark ? "bg-[#090D16] border-blue-500/30" : "bg-slate-100 border-slate-300"}`}
            >
              <span
                className={`text-[9px] font-semibold px-1.5 ${ui.textMuted}`}
              >
                Rasio:
              </span>
              {(["mobile", "tablet", "desktop"] as ViewportMode[]).map(
                (mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewportMode(mode)}
                    className={`rounded px-2 py-0.5 text-[10px] font-semibold capitalize transition cursor-pointer ${
                      viewportMode === mode
                        ? isDark
                          ? "bg-cyan-500 text-black shadow-xs"
                          : "bg-blue-600 text-white shadow-xs"
                        : ui.textMuted
                    }`}
                  >
                    {mode}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* PALET BLOK: FONT SEDERHANA, TANPA BOLD, WARNA BERSIH & JELAS */}
          {activeTemplate === "logic" && (
            <div className="my-auto flex flex-col gap-3 py-1">
              <div
                className={`rounded-xl p-3 border ${isDark ? "bg-[#10192E] border-slate-800" : "bg-slate-50 border-slate-200"}`}
              >
                <h3
                  className={`text-xs font-semibold uppercase tracking-wider mb-2 ${ui.title}`}
                >
                  Palet Blok Instruksi
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "MAJU ➡️",
                    "PUTAR KANAN ⤵️",
                    "PUTAR KIRI ⤴️",
                    "LOMPAT 🦘",
                    "EKSEKUSI ⚙️",
                  ].map((cmd) => (
                    <button
                      key={cmd}
                      type="button"
                      onClick={() => {
                        if (userCommands.length < maxBlocks) {
                          setUserCommands([...userCommands, cmd]);
                        }
                      }}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-normal transition cursor-pointer shadow-xs active:scale-95 ${
                        isDark
                          ? "border-slate-700 bg-[#0E1626] text-slate-200 hover:border-cyan-500/50 hover:bg-[#142038]"
                          : "border-slate-300 bg-white text-slate-800 hover:bg-slate-100 hover:border-slate-400"
                      }`}
                    >
                      + {cmd}
                    </button>
                  ))}
                </div>
              </div>

              {/* URUTAN EKSEKUSI */}
              <div
                className={`rounded-xl p-3 border ${isDark ? "bg-[#10192E] border-slate-800" : "bg-slate-50 border-slate-200"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3
                    className={`text-xs font-semibold uppercase tracking-wider ${ui.title}`}
                  >
                    Urutan Eksekusi Runtunan
                  </h3>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${
                      isDark
                        ? "bg-[#090D16] border-slate-700 text-slate-300"
                        : "bg-white border-slate-300 text-slate-700"
                    }`}
                  >
                    {userCommands.length} / {maxBlocks} Blok
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {userCommands.map((cmd, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between rounded-lg p-2 border ${isDark ? "bg-[#090D16] border-slate-700" : "bg-white border-slate-300"}`}
                    >
                      <span className={`text-xs font-normal ${ui.title}`}>
                        {i + 1}. {cmd}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setUserCommands(
                            userCommands.filter((_, idx) => idx !== i),
                          )
                        }
                        className="text-xs text-rose-600 hover:text-rose-700 cursor-pointer pl-2 font-medium"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTemplate === "quiz" && (
            <div className="my-auto space-y-2 py-1">
              {quizList.slice(0, 3).map((q, idx) => (
                <div key={idx} className={`rounded-lg p-2.5 border ${ui.card}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-[#FF7A00]">
                      Soal #{idx + 1} ({q.format.toUpperCase()})
                    </span>
                  </div>
                  <p className={`text-xs font-normal mt-1 ${ui.title}`}>
                    {q.question}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTemplate === "category" && (
            <div className="my-auto space-y-2 py-1">
              <div className="flex gap-2">
                {categoryData.categories.map((cat, idx) => (
                  <div
                    key={cat}
                    className={`flex-1 rounded-lg p-2.5 text-center border ${isDark ? "bg-[#090D16] border-cyan-500/40" : "bg-white border-slate-300"}`}
                  >
                    <span className="text-[9px] font-medium text-blue-600 dark:text-cyan-400">
                      Wadah #{idx + 1}
                    </span>
                    <p className={`text-xs font-normal mt-0.5 ${ui.title}`}>
                      {cat}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTemplate === "maze" && (
            <div className="my-auto p-4 text-center">
              <span className="text-3xl">🧭</span>
              <p className={`text-xs font-normal mt-1 ${ui.title}`}>
                Labirin {gridSize}x{gridSize} Aktif
              </p>
            </div>
          )}

          <div className="pt-2 border-t border-slate-200 dark:border-blue-500/20 flex items-center justify-between text-[10px] font-normal opacity-70">
            <span>Modul Siap Uji Coba</span>
            <span>JACS ENGINE CORE</span>
          </div>
        </main>

        {/* PANEL KANAN: LIVE PREVIEW SISWA */}
        <aside
          className={`w-[310px] shrink-0 rounded-xl p-3 flex flex-col justify-between items-center ${ui.panel}`}
        >
          <div className="flex w-full items-center justify-between pb-2 border-b border-slate-200 dark:border-blue-500/20">
            <h2
              className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-cyan-400" : "text-slate-700"}`}
            >
              Live Preview Siswa
            </h2>
            <div className="flex items-center gap-1.5">
              {!isNoTimer && (
                <span className="rounded-full bg-rose-500/10 border border-rose-500/40 px-2 py-0.2 text-[9px] font-medium text-rose-600 dark:text-rose-400">
                  ⏱️ {timerMinutes > 0 ? `${timerMinutes}m ` : ""}
                  {timerSecondsOnly}s
                </span>
              )}
              <span className="rounded-full bg-orange-500/10 border border-orange-500/40 px-2 py-0.2 text-[9px] font-medium text-[#FF7A00]">
                {activeTemplate.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex w-full flex-1 items-center justify-center p-1">
            <div
              className={`flex flex-col justify-between rounded-2xl border-4 p-3 shadow-md transition-all duration-300 ${viewportStyles} ${
                isDark
                  ? "bg-[#070B14] border-cyan-500/50 text-slate-100"
                  : "bg-slate-900 border-slate-700 text-white"
              }`}
            >
              <div className="border-b border-cyan-500/30 pb-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-medium uppercase text-cyan-300">
                    {activeTemplate.toUpperCase()} GAME
                  </span>
                  <span className="rounded bg-orange-500/20 border border-orange-500/50 px-1 py-0.2 text-[8px] font-medium text-orange-300">
                    {currentPhaseKey}
                  </span>
                </div>

                <h3 className="text-[11px] font-semibold truncate text-white mt-0.5">
                  {subjectInput || "Modul Interaktif"}
                </h3>

                <div className="flex items-center justify-between text-[9px] font-normal opacity-80 mt-0.5">
                  <span className="text-[#FF7A00] font-medium">
                    SKOR: {score}
                  </span>
                  <span>{userCommands.length} Instruksi</span>
                </div>
              </div>

              <div className="my-auto space-y-2 py-1 text-center">
                {activeTemplate === "logic" && (
                  <div className="space-y-2">
                    <div className="text-3xl">🤖</div>
                    <p className="text-[11px] font-medium text-white">
                      Rangkaian Algoritma
                    </p>
                    <div className="flex flex-wrap justify-center gap-1 max-w-[200px] mx-auto">
                      {userCommands.map((c, i) => (
                        <span
                          key={i}
                          className="rounded bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 text-[8px] font-normal border border-emerald-500/40"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setScore((s) => s + 150);
                        setFeedback("Eksekusi Sukses! Robot Bergerak ✅");
                        setTimeout(() => setFeedback(null), 600);
                      }}
                      className="w-full rounded-lg bg-[#FF7A00] py-2 text-[11px] font-semibold text-white shadow-xs hover:bg-orange-600 active:scale-95 transition cursor-pointer"
                    >
                      ▶️ Jalankan Robot
                    </button>
                  </div>
                )}

                {feedback && (
                  <p className="text-[10px] font-medium text-emerald-400 animate-pulse">
                    {feedback}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-cyan-500/30 pt-1 text-[8px] opacity-70 font-normal">
                <span>SEKOLAHKITA</span>
                <span className="text-cyan-400">LIVE ENGINE</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
