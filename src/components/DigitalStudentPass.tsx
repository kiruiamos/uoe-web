import React, { useState } from 'react';
import { StudentProfile } from '../types/campus';
import { QrCode, ShieldCheck, CheckCircle2, RotateCw, Sparkles, Building, PhoneCall, Award } from 'lucide-react';

interface Props {
  student: StudentProfile;
  onOpenQuickPay?: () => void;
}

export const DigitalStudentPass: React.FC<Props> = ({ student }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGateScanSuccess, setIsGateScanSuccess] = useState(false);
  const [showFullPassModal, setShowFullPassModal] = useState(false);

  const handleSimulateGateTap = () => {
    setIsGateScanSuccess(true);
    setTimeout(() => {
      setIsGateScanSuccess(false);
    }, 3000);
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#003A2F] via-[#0B5345] to-[#00210C] text-white p-5 sm:p-6 shadow-xl shadow-[#0B5345]/15 border border-[#86c5b3]/20 transition-all duration-300">
        {/* Background watermark badge */}
        <div className="absolute -right-10 -bottom-10 w-52 h-52 rounded-full border-8 border-white/5 pointer-events-none" />
        <div className="absolute right-12 top-6 opacity-10 pointer-events-none text-right">
          <p className="text-5xl font-black tracking-widest uppercase">UOE</p>
          <p className="text-xs font-semibold tracking-wider">CHEPKOILEL</p>
        </div>

        {/* Card Header */}
        <div className="flex items-start justify-between relative z-10 border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/15">
              <span className="font-bold text-base text-[#FEA51F] tracking-tighter">UoE</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[#93D3C1] font-semibold">University of Eldoret</p>
              <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                Chepkoilel Digital Student Pass
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/90 text-xs flex items-center gap-1"
              title="Flip Card View"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px] font-medium">Flip</span>
            </button>
            <div className="px-2.5 py-1 rounded-full bg-[#27AE60]/20 border border-[#27AE60]/40 flex items-center gap-1 text-[11px] font-semibold text-[#7EFBA4]">
              <ShieldCheck className="w-3 h-3 text-[#7EFBA4]" />
              <span>ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Card Body - Front View */}
        {!isFlipped ? (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center relative z-10">
            {/* Student Photo & Gold Seal */}
            <div className="sm:col-span-4 flex sm:flex-col items-center gap-3">
              <div className="relative group">
                <div className="w-24 h-28 sm:w-28 sm:h-34 rounded-xl overflow-hidden border-2 border-white/30 shadow-md bg-[#00210C] relative">
                  <img
                    src={student.photoUrl}
                    alt={student.name}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {/* Photo frame overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#F39C12] text-[#1E293B] text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow flex items-center gap-1 border border-white/40">
                  <Award className="w-2.5 h-2.5 text-[#1E293B]" />
                  <span>Year 3</span>
                </div>
              </div>

              <div className="text-left sm:text-center">
                <p className="text-xs text-[#93D3C1] font-mono tracking-tight">{student.regNo}</p>
                <p className="text-[11px] text-white/70">Bio-ID: {student.nationalId}</p>
              </div>
            </div>

            {/* Student Details & Credentials */}
            <div className="sm:col-span-8 flex flex-col justify-between space-y-3">
              <div>
                <p className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-0.5">{student.name}</p>
                <p className="text-xs font-medium text-[#AFEFDC]">{student.programme}</p>
                <p className="text-[11px] text-white/70">{student.school} · {student.campus}</p>
              </div>

              {/* Barcode & Clearance status */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] text-white/80">
                    <span className="font-semibold text-white">Status:</span>
                    <span className="text-[#7EFBA4] font-semibold">{student.clearanceStatus}</span>
                    <span className="text-white/40">·</span>
                    <span className="text-white/70">Valid: {student.validUntil}</span>
                  </div>
                  {/* Simulated High-Density Barcode */}
                  <div className="bg-white px-2 py-1.5 rounded flex flex-col items-center justify-center">
                    <div className="flex items-stretch gap-0.5 h-5 w-44">
                      {[3, 1, 2, 1, 4, 1, 2, 3, 1, 2, 4, 1, 3, 2, 1, 2, 3, 1, 4, 2, 1, 3, 1].map((w, i) => (
                        <div
                          key={i}
                          className="bg-[#111C2D]"
                          style={{ width: `${w * 2}px` }}
                        />
                      ))}
                    </div>
                    <span className="text-[9px] font-mono text-slate-800 tracking-widest">{student.barcode}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowFullPassModal(true)}
                  className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all flex flex-col items-center justify-center gap-1 shrink-0"
                  title="Enlarge QR Code"
                >
                  <QrCode className="w-5 h-5 text-[#FEA51F]" />
                  <span className="text-[9px] font-semibold">Enlarge</span>
                </button>
              </div>

              {/* NFC & Gate Tap Trigger */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleSimulateGateTap}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#27AE60] hover:bg-[#219653] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-sm"
                >
                  {isGateScanSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
                      <span>Chepkoilel Main Gate Cleared!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-white/90" />
                      <span>Simulate RFID Gate Tap</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Card Body - Back View */
          <div className="relative z-10 py-2 space-y-4">
            <div className="h-9 bg-[#111C2D] -mx-6 mb-3 flex items-center px-6">
              <div className="h-4 w-full bg-slate-700/60 rounded" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                <p className="text-white/60 text-[10px] uppercase font-semibold">Blood Group</p>
                <p className="text-sm font-bold text-white">{student.bloodGroup}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                <p className="text-white/60 text-[10px] uppercase font-semibold">National ID</p>
                <p className="text-sm font-bold text-white font-mono">{student.nationalId}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                <p className="text-white/60 text-[10px] uppercase font-semibold">Library Card ID</p>
                <p className="text-sm font-bold text-white font-mono">LIB-2023-0421</p>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                <p className="text-white/60 text-[10px] uppercase font-semibold">Campus Residence</p>
                <p className="text-sm font-bold text-white">Hall 1 (Kilimanjaro)</p>
              </div>
            </div>

            <div className="text-[11px] text-white/70 border-t border-white/10 pt-3">
              <p className="italic">
                "This card remains the property of the University of Eldoret. If found, please return to the Office of the Dean of Students, P.O. Box 1125-30100 Eldoret, Kenya."
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Full Digital Pass Modal */}
      {showFullPassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-[#111C2D] shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowFullPassModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              ✕
            </button>
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F8F0] text-[#0B5345] text-xs font-semibold">
                <Building className="w-3.5 h-3.5" />
                <span>Chepkoilel Turnstile Gate Pass</span>
              </div>
              <h3 className="text-lg font-bold text-[#0B5345]">{student.name}</h3>
              <p className="text-xs text-slate-500 font-mono">{student.regNo}</p>

              {/* QR Code Container */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center">
                <div className="w-48 h-48 bg-white p-2 rounded-lg border border-slate-300 flex items-center justify-center">
                  <QrCode className="w-40 h-40 text-[#003A2F]" />
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-mono">SCAN AT TURNSTILE OR LIBRARY COUNTER</p>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <p><span className="font-semibold">Term Status:</span> <span className="text-[#27AE60] font-bold">Fee Cleared (100%)</span></p>
                <p className="text-[11px] text-slate-400">Time-synced token expires in 4:58 mins</p>
              </div>

              <button
                onClick={() => setShowFullPassModal(false)}
                className="w-full py-2.5 rounded-xl bg-[#0B5345] text-white font-medium text-xs hover:bg-[#084237] transition-colors"
              >
                Close Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
