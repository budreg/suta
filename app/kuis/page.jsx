"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import Confetti from "@/components/Confetti";
import { useAuth } from "@/lib/AuthContext";
import { getSoalKuis, simpanHasilKuis } from "@/lib/db";

export default function KuisPage() {
  const { user } = useAuth();
  const [soalKuis, setSoalKuis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0); // 0 = intro, 1..N = soal, -1 = hasil
  const [jawabanUser, setJawabanUser] = useState([]);
  const [pilihanTerpilih, setPilihanTerpilih] = useState(null);
  const [showPenjelasan, setShowPenjelasan] = useState(false);
  const [persenHasil, setPersenHasil] = useState(0);

  useEffect(() => {
    getSoalKuis().then((data) => {
      setSoalKuis(data);
      setLoading(false);
    });
  }, []);

  const soalAktif = soalKuis[step - 1];
  const jawabanBenarSaatIni = pilihanTerpilih === soalAktif?.jawaban_benar;

  function mulai() {
    setStep(1);
    setJawabanUser([]);
  }

  function pilihJawaban(idx) {
    if (showPenjelasan) return;
    setPilihanTerpilih(idx);
    setShowPenjelasan(true);
  }

  async function lanjut() {
    const benar = pilihanTerpilih === soalAktif.jawaban_benar;
    const hasilBaru = [...jawabanUser, benar];
    setJawabanUser(hasilBaru);
    setShowPenjelasan(false);
    setPilihanTerpilih(null);

    if (step < soalKuis.length) {
      setStep(step + 1);
    } else {
      const jumlahBenar = hasilBaru.filter(Boolean).length;
      const persen = await simpanHasilKuis(user.id, {
        jumlahBenar,
        jumlahSoal: soalKuis.length,
      });
      setPersenHasil(persen);
      setStep(-1);
    }
  }

  function ulangi() {
    setStep(0);
    setJawabanUser([]);
    setPilihanTerpilih(null);
    setShowPenjelasan(false);
  }

  if (loading) return <p className="text-center text-slate-400 py-16">Memuat soal...</p>;

  if (step === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-xl mx-auto text-center space-y-6 py-8"
      >
        <motion.div
          className="text-5xl"
          animate={{ rotate: [0, -8, 8, -8, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1.5 }}
        >
          🧠
        </motion.div>
        <h1 className="text-2xl font-bold text-slate-900">Kuis Pengetahuan Diabetes</h1>
        <p className="text-slate-500">
          {soalKuis.length} pertanyaan seputar penyebab, pola makan, aktivitas fisik,
          dan manajemen stres. Setiap jawaban benar = +5 poin.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={mulai}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition"
        >
          Mulai Kuis
        </motion.button>
      </motion.div>
    );
  }

  if (step === -1) {
    const jumlahBenar = jawabanUser.filter(Boolean).length;
    return (
      <div className="max-w-xl mx-auto text-center space-y-6 py-8 relative">
        {persenHasil >= 70 && <Confetti />}
        <motion.div
          className="text-5xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          {persenHasil >= 70 ? "🎉" : "💪"}
        </motion.div>
        <h1 className="text-2xl font-bold text-slate-900">Kuis Selesai!</h1>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <motion.p
              className="text-4xl font-bold text-emerald-600"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 180, damping: 12, delay: 0.2 }}
            >
              {persenHasil}%
            </motion.p>
            <p className="text-slate-500 mt-1">
              {jumlahBenar} dari {soalKuis.length} jawaban benar
            </p>
            <p className="text-sm text-amber-600 font-medium mt-2">
              +{jumlahBenar * 5} poin didapat
            </p>
            {persenHasil === 100 && (
              <motion.p
                className="text-sm text-rose-600 font-medium mt-1"
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 10, delay: 0.4 }}
              >
                🏅 Badge baru: Quiz Master!
              </motion.p>
            )}
          </Card>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={ulangi}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition"
        >
          Ulangi Kuis
        </motion.button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div>
        <p className="text-xs text-slate-500 mb-1">
          Soal {step} dari {soalKuis.length}
        </p>
        <ProgressBar value={step - 1} max={soalKuis.length} color="bg-amber-500" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          <Card>
            <motion.h2
              animate={showPenjelasan && !jawabanBenarSaatIni ? { x: [0, -8, 8, -8, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="font-semibold text-slate-800 text-lg"
            >
              {soalAktif.pertanyaan}
            </motion.h2>
            <div className="mt-4 space-y-2">
              {soalAktif.pilihan.map((p, idx) => {
                let style = "border-slate-200 hover:border-emerald-300";
                if (showPenjelasan) {
                  if (idx === soalAktif.jawaban_benar) {
                    style = "border-emerald-500 bg-emerald-50";
                  } else if (idx === pilihanTerpilih) {
                    style = "border-rose-400 bg-rose-50";
                  } else {
                    style = "border-slate-200 opacity-60";
                  }
                }
                const isCorrectAnswer = showPenjelasan && idx === soalAktif.jawaban_benar;
                return (
                  <motion.button
                    key={idx}
                    onClick={() => pilihJawaban(idx)}
                    whileHover={!showPenjelasan ? { scale: 1.01 } : {}}
                    whileTap={!showPenjelasan ? { scale: 0.98 } : {}}
                    animate={isCorrectAnswer ? { scale: [1, 1.03, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition ${style}`}
                  >
                    {p}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {showPenjelasan && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-4 p-3 rounded-lg bg-slate-50 text-sm text-slate-600 overflow-hidden"
                >
                  💡 {soalAktif.penjelasan}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showPenjelasan && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={lanjut}
            className="w-full bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition"
          >
            {step < soalKuis.length ? "Soal Berikutnya →" : "Lihat Hasil"}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
