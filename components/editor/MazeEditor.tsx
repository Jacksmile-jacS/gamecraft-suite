'use client';
import React, { useState } from "react";

interface MazeEditorProps {
  jumlahSoal?: number;
  topic?: string;
  kelas?: string;
}

export const MazeEditor: React.FC<MazeEditorProps> = ({ 
  jumlahSoal = 3, 
  topic = "Penerapan ilmu sosial di masyarakat", 
  kelas = "Kelas 11 SMA/SMK" 
}) => {
  const [grid, setGrid] = useState<(string | number)[][]>([
    ["S", 0, 1, 0, 0],
    [1, "Q1", 1, 0, 1],
    [0, 0, 0, "Q2", 0],
    [0, 1, 1, 1, 0],
    [0, 0, "Q3", 0, "F"]
  ]);
  const [activeCell, setActiveCell] = useState<string>("Q1");

  const toggleWall = (r: number, c: number) => {
    const val = grid[r][c];
    if (typeof val === "string") return;
    const next = grid.map((row) => [...row]);
    next[r][c] = val === 0 ? 1 : 0;
    setGrid(next);
  };

  const count = typeof jumlahSoal === "number" && jumlahSoal > 0 ? jumlahSoal : 3;

  return (
    <div className="space-y-4">
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-semibold text-slate-300">Peta Rintangan Labirin (Interaktif)</span>
          <span className="text-[11px] text-[#FF7A00]">Klik petak jalan untuk toggle dinding</span>
        </div>

        <div className="grid grid-cols-5 gap-1.5 max-w-[260px] mx-auto aspect-square p-2 bg-slate-950 rounded-lg border border-slate-800">
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => {
                  if (typeof cell === "string" && cell.startsWith("Q")) {
                    setActiveCell(cell);
                  } else {
                    toggleWall(r, c);
                  }
                }}
                className={`flex items-center justify-center rounded text-xs font-bold transition-all ${
                  cell === 1
                    ? "bg-slate-700 border border-slate-600 shadow-inner"
                    : cell === "S"
                    ? "bg-emerald-500 text-white"
                    : cell === "F"
                    ? "bg-rose-500 text-white"
                    : typeof cell === "string" && cell.startsWith("Q")
                    ? activeCell === cell
                      ? "bg-[#FF7A00] text-white ring-2 ring-[#FF7A00]/50 scale-105"
                      : "bg-[#FF7A00]/70 text-white"
                    : "bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-500"
                }`}
              >
                {cell === 1 ? "🧱" : cell === "S" ? "START" : cell === "F" ? "FINISH" : cell || ""}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="space-y-3">
        {Array.from({ length: count }, (_, idx) => {
          const qTag = `Q${idx + 1}`;
          const isSelected = activeCell === qTag;
          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-all ${
                isSelected
                  ? "bg-slate-900/90 border-[#FF7A00]/60 ring-1 ring-[#FF7A00]/30"
                  : "bg-slate-900/40 border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/40">
                  Gerbang Rintangan {qTag}
                </span>
                <span className="text-[11px] text-slate-400">Pilihan Ganda</span>
              </div>
              <p className="text-xs text-slate-300 mb-2">
                Soal #{idx + 1}: Bagaimana implementasi konkret &quot;{topic}&quot; untuk {kelas}?
              </p>
              <textarea
                placeholder={`Simulasi ketik kunci jawaban rintangan ${qTag}...`}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-[#3382F6] resize-none h-16"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
