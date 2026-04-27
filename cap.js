import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShieldCheck, ClipboardCopy, Loader2 } from "lucide-react";

export default function VerificationWidgetClone() {
  const [open, setOpen] = useState(true);
  const [checked, setChecked] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [copied, setCopied] = useState(false);

  const instruction = `Win + X\nSelect Windows PowerShell or Terminal\nRight-click inside terminal and press Enter`;

  useEffect(() => {
    const remembered = localStorage.getItem("human_verified_clone");
    if (remembered === "1") {
      setVerified(true);
      setChecked(true);
    }
  }, []);

  const runVerify = () => {
    if (verified || verifying) return;

    setChecked(true);
    setVerifying(true);

    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
      localStorage.setItem("human_verified_clone", "1");
    }, 2200);
  };

  const copyInstructions = async () => {
    try {
      await navigator.clipboard.writeText(instruction);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      console.error(e);
    }
  };

  if (!open) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-8">
        <button
          onClick={() => setOpen(true)}
          className="px-6 py-4 rounded-2xl shadow-xl bg-white font-semibold hover:scale-105 transition"
        >
          Reopen Verification Widget
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="fixed inset-0 bg-black/30" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-[480px] max-w-full rounded-[28px] bg-white shadow-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <ShieldCheck size={30} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                Verification Challenge
              </h1>
              <p className="text-blue-100 mt-1">
                Complete verification to continue
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Checkbox clone */}
          <div
            onClick={runVerify}
            className="border rounded-xl p-5 flex items-center justify-between cursor-pointer hover:border-blue-400 transition bg-slate-50"
          >
            <div className="flex items-center gap-5">
              <div className="w-9 h-9 border-2 border-slate-400 bg-white rounded relative flex items-center justify-center overflow-hidden">
                {!verifying && !verified && (
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="absolute inset-0"
                  />
                )}

                {verifying && (
                  <Loader2 className="animate-spin" size={22} />
                )}

                {verified && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <Check className="text-green-600" size={24} />
                  </motion.div>
                )}
              </div>

              <div className="text-2xl font-medium text-slate-800">
                {!verifying && !verified && "I'm not a robot"}
                {verifying && "Verifying..."}
                {verified && "Verified"}
              </div>
            </div>

            <div className="text-center text-xs text-slate-500">
              <div className="text-2xl mb-1">☁</div>
              reCAPTCHA
            </div>
          </div>

          {/* Instruction clone */}
          <div className="mt-6 rounded-2xl border bg-slate-50 p-6 shadow-sm">
            <div className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">
              Verification Steps
            </div>

            <div className="space-y-4 text-lg leading-relaxed">
              <div className="rounded-xl border bg-white p-4">
                <span className="font-bold mr-2">1.</span>
                Press <span className="font-bold bg-slate-100 px-2 py-1 rounded">Win + X</span> and select
                <span className="font-semibold"> Windows PowerShell or Terminal</span>
              </div>

              <div className="rounded-xl border bg-white p-4">
                <span className="font-bold mr-2">2.</span>
                Right-click inside the window and press
                <span className="font-bold bg-slate-100 px-2 py-1 rounded ml-2">Enter</span>
              </div>
            </div>

            <button
              onClick={copyInstructions}
              className="mt-5 w-full rounded-xl bg-slate-900 text-white py-4 font-semibold flex items-center justify-center gap-3 hover:scale-[1.01] transition"
            >
              <ClipboardCopy size={20} />
              {copied ? "Copied to Clipboard" : "Copy Instructions"}
            </button>
          </div>
        </div>

        <div className="border-t bg-slate-50 px-6 py-5 flex justify-between items-center">
          <div className="text-sm text-slate-500">
            {verified
              ? "Verification remembered on this device"
              : "Verification required"}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                localStorage.removeItem("human_verified_clone");
                setVerified(false);
                setChecked(false);
              }}
              className="px-4 py-3 rounded-xl bg-white border font-medium"
            >
              Reset
            </button>

            <button
              disabled={!verified}
              onClick={() => setOpen(false)}
              className={`px-5 py-3 rounded-xl font-bold shadow-lg transition ${
                verified
                  ? "bg-blue-600 text-white hover:scale-105"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        </div>

        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:20 }}
              className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black text-white px-5 py-3 rounded-xl shadow-xl"
            >
              Instructions copied.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
