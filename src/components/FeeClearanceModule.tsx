import React, { useState } from 'react';
import { FeeItem, StudentProfile } from '../types/campus';
import { CreditCard, CheckCircle2, AlertTriangle, FileText, Download, Smartphone, Printer, ShieldCheck } from 'lucide-react';

interface Props {
  fees: FeeItem[];
  student: StudentProfile;
  onClearFee: (amount: number) => void;
}

export const FeeClearanceModule: React.FC<Props> = ({ fees, student, onClearFee }) => {
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [payAmount, setPayAmount] = useState('5000');
  const [mpesaPhone, setMpesaPhone] = useState('0712 345 678');
  const [stkState, setStkState] = useState<'idle' | 'prompt' | 'pin' | 'success'>('idle');
  const [mpesaPin, setMpesaPin] = useState('');
  const [showExamCardModal, setShowExamCardModal] = useState(false);

  const totalBilled = fees.reduce((sum, f) => sum + f.amountKes, 0);
  const totalPaid = fees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.amountKes, 0);
  const outstandingBalance = totalBilled - totalPaid;
  const clearancePercentage = Math.round((totalPaid / totalBilled) * 100);
  const isExamCleared = clearancePercentage >= 80;

  const handleInitiateMpesa = () => {
    setStkState('prompt');
    setShowMpesaModal(true);
  };

  const handleSendPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    setStkState('pin');
  };

  const handleConfirmPin = (e: React.FormEvent) => {
    e.preventDefault();
    setStkState('success');
    const amt = parseInt(payAmount, 10);
    setTimeout(() => {
      onClearFee(amt);
      setShowMpesaModal(false);
      setStkState('idle');
      setMpesaPin('');
    }, 1800);
  };

  return (
    <div className="rounded-2xl bg-white border border-[#0B5345]/10 shadow-sm p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B5345] text-white flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-[#FEA51F]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#111C2D]">Fee Clearance & Exam Eligibility</h3>
            <p className="text-xs text-slate-500">Student Finance Department · Official Ledger Statement</p>
          </div>
        </div>

        {/* Exam clearance pill badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isExamCleared ? (
            <span className="px-3 py-1 rounded-full bg-[#E8F8F0] text-[#1E7E46] text-xs font-bold flex items-center gap-1.5 border border-[#27AE60]/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Exam Clearance Validated ({clearancePercentage}%)</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-[#FEF5E7] text-[#B7791F] text-xs font-bold flex items-center gap-1.5 border border-[#F39C12]/30">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Clearance Incomplete ({clearancePercentage}%)</span>
            </span>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-[#F8F9FA] border border-slate-200">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Billed</p>
          <p className="text-xl font-extrabold text-[#111C2D] font-mono tabular-nums mt-1">
            KES {totalBilled.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Year 3 Semester 1</p>
        </div>

        <div className="p-4 rounded-xl bg-[#E8F8F0]/40 border border-[#27AE60]/20">
          <p className="text-[11px] font-semibold text-[#1E7E46] uppercase tracking-wide">Amount Cleared</p>
          <p className="text-xl font-extrabold text-[#0B5345] font-mono tabular-nums mt-1">
            KES {totalPaid.toLocaleString()}
          </p>
          <p className="text-[11px] text-[#1E7E46] mt-0.5">{clearancePercentage}% settled</p>
        </div>

        <div className={`p-4 rounded-xl border ${outstandingBalance > 0 ? 'bg-[#FEF5E7]/40 border-[#F39C12]/30' : 'bg-[#E8F8F0]/40 border-[#27AE60]/20'}`}>
          <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">Current Balance</p>
          <p className="text-xl font-extrabold text-slate-900 font-mono tabular-nums mt-1">
            KES {outstandingBalance.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {outstandingBalance === 0 ? 'Zero Balance · Fully Settled' : 'Paybill: 522123'}
          </p>
        </div>
      </div>

      {/* Itemized Fee Breakdown */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 px-1">
          <span>Fee Ledger Line Items</span>
          <span>Status</span>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
          {fees.map(f => (
            <div key={f.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-semibold text-slate-900">{f.title}</p>
                <p className="text-[11px] font-mono text-slate-500">REF: {f.id.toUpperCase()}-2026</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  KES {f.amountKes.toLocaleString()}
                </span>
                {f.status === 'Paid' ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#E8F8F0] text-[#1E7E46]">
                    PAID
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#FEF5E7] text-[#B7791F]">
                    PENDING
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Strip: M-Pesa Paybill & Exam Clearance Card */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          {outstandingBalance > 0 ? (
            <button
              onClick={handleInitiateMpesa}
              className="py-2.5 px-4 rounded-xl bg-[#27AE60] hover:bg-[#219653] text-white text-xs font-bold transition-transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
            >
              <Smartphone className="w-4 h-4" />
              <span>Clear Balance via M-Pesa (KES {outstandingBalance.toLocaleString()})</span>
            </button>
          ) : (
            <span className="text-xs text-[#1E7E46] font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>All semester fees cleared!</span>
            </span>
          )}
        </div>

        <button
          onClick={() => setShowExamCardModal(true)}
          className="py-2.5 px-4 rounded-xl bg-[#0B5345] hover:bg-[#084237] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4 text-[#93D3C1]" />
          <span>View Official Exam Clearance Card</span>
        </button>
      </div>

      {/* M-Pesa STK Push Interactive Simulation Modal */}
      {showMpesaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-[#111C2D] shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowMpesaModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-sm"
            >
              ✕
            </button>

            {stkState === 'prompt' && (
              <form onSubmit={handleSendPrompt} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#27AE60] text-white flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">M-Pesa Express Paybill</h4>
                    <p className="text-xs text-slate-500">Paybill: 522123 · Acct: {student.regNo}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Amount to Pay (KES)
                  </label>
                  <input
                    type="number"
                    value={payAmount}
                    onChange={e => setPayAmount(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27AE60] font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Safaricom Phone Number
                  </label>
                  <input
                    type="tel"
                    value={mpesaPhone}
                    onChange={e => setMpesaPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27AE60] font-mono"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#27AE60] hover:bg-[#219653] text-white text-xs font-bold transition-all"
                >
                  Request STK Push to Phone
                </button>
              </form>
            )}

            {stkState === 'pin' && (
              <div className="space-y-4">
                {/* Simulated Green Safaricom STK prompt */}
                <div className="bg-[#003A2F] text-white p-4 rounded-xl border border-emerald-400 shadow-lg text-center space-y-3">
                  <p className="text-[11px] font-mono tracking-widest text-[#7EFBA4]">SAFARICOM M-PESA</p>
                  <p className="text-xs">
                    Do you want to pay <span className="font-bold font-mono">KES {payAmount}</span> to <span className="font-bold">UNIV OF ELDORET</span> for Account <span className="font-mono">{student.regNo}</span>?
                  </p>
                  <form onSubmit={handleConfirmPin} className="space-y-3">
                    <input
                      type="password"
                      maxLength={4}
                      value={mpesaPin}
                      onChange={e => setMpesaPin(e.target.value)}
                      placeholder="Enter M-Pesa PIN"
                      autoFocus
                      className="w-36 mx-auto px-3 py-1.5 text-center text-slate-900 bg-white font-mono text-base font-bold rounded focus:outline-none tracking-widest"
                      required
                    />
                    <div className="flex gap-2 justify-center">
                      <button
                        type="button"
                        onClick={() => setShowMpesaModal(false)}
                        className="px-3 py-1 rounded bg-white/20 text-xs hover:bg-white/30"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1 rounded bg-[#27AE60] text-white text-xs font-bold hover:bg-[#219653]"
                      >
                        OK / Send
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {stkState === 'success' && (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#E8F8F0] text-[#1E7E46] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Payment Confirmed!</h4>
                <p className="text-xs text-slate-600 font-mono">
                  REF: QXK{Math.floor(100000 + Math.random() * 900000)} Confirmed. KES {payAmount} credited to Student Finance.
                </p>
                <p className="text-[11px] text-[#27AE60] font-semibold">Clearance status updated instantly.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Official Exam Clearance Card Modal */}
      {showExamCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 text-[#111C2D] shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowExamCardModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-sm"
            >
              ✕
            </button>

            {/* University Official Exam Card Header */}
            <div className="text-center border-b-2 border-[#0B5345] pb-3 space-y-1">
              <p className="text-xs font-black uppercase tracking-widest text-[#0B5345]">University of Eldoret</p>
              <h3 className="text-base font-extrabold text-slate-900">OFFICIAL EXAMINATION CLEARANCE CARD</h3>
              <p className="text-[11px] text-slate-500 font-medium">ACADEMIC YEAR 2026/2027 · SEMESTER 1</p>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="w-16 h-20 rounded-lg overflow-hidden border border-slate-300 bg-slate-900 shrink-0">
                <img
                  src={student.photoUrl}
                  alt={student.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="text-xs space-y-0.5">
                <p><span className="font-semibold">Candidate:</span> <span className="font-bold text-slate-900">{student.name}</span></p>
                <p><span className="font-semibold">Reg No:</span> <span className="font-mono font-bold text-[#0B5345]">{student.regNo}</span></p>
                <p><span className="font-semibold">Programme:</span> {student.programme}</p>
                <p><span className="font-semibold">Campus:</span> {student.campus}</p>
              </div>
            </div>

            {/* Registered Examinable Units */}
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-800">Verified Examinable Units:</p>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg text-[11px]">
                <div className="p-2 flex justify-between font-mono bg-slate-50 text-slate-700 font-semibold">
                  <span>Unit Code & Title</span>
                  <span>Supervisor Sign</span>
                </div>
                {['COM 311: Distributed Systems', 'COM 315: Database Systems', 'STA 202: Probability Theory', 'MAT 301: Real Analysis I'].map(unit => (
                  <div key={unit} className="p-2 flex justify-between items-center text-slate-800">
                    <span>{unit}</span>
                    <span className="text-[10px] text-slate-400 font-mono">[ __________ ]</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clearance Verification Seal */}
            <div className="flex items-center justify-between p-3 bg-[#E8F8F0] border border-[#27AE60]/40 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#27AE60]" />
                <div>
                  <p className="font-bold text-[#0B5345]">FINANCE DEPT STAMP: CLEARED</p>
                  <p className="text-[10px] text-slate-600">Registrar (Academic) Verification No: UOE-EXAM-2026-8812</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Exam Card</span>
              </button>
              <button
                onClick={() => setShowExamCardModal(false)}
                className="flex-1 py-2 rounded-xl bg-[#0B5345] text-white text-xs font-semibold hover:bg-[#084237] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
