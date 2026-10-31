import React, { useState } from 'react';
import { MenuItem, MealVoucher } from '../types/campus';
import { Utensils, Users, Clock, Plus, Check, ShoppingBag, QrCode, Sparkles, CreditCard, ChevronRight } from 'lucide-react';

interface Props {
  menuItems: MenuItem[];
  walletBalance: number;
  onUpdateWallet: (newBalance: number) => void;
}

export const MessCounterCard: React.FC<Props> = ({ menuItems, walletBalance, onUpdateWallet }) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Breakfast' | 'Lunch' | 'Dinner' | 'Beverages'>('All');
  const [tray, setTray] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [activeVoucher, setActiveVoucher] = useState<MealVoucher | null>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('500');
  const [topUpSuccess, setTopUpSuccess] = useState(false);

  // Cafeteria live stats
  const occupancyPercent = 68; // Dynamic occupancy
  const currentMealPeriod = 'Lunch: 11:30 AM - 02:30 PM';
  const cafeteriaQueueTime = '4 min avg line';

  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const trayTotal = tray.reduce((sum, item) => sum + (item.item.priceKes * item.quantity), 0);

  const handleAddToTray = (item: MenuItem) => {
    setTray(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleRemoveFromTray = (itemId: string) => {
    setTray(prev => {
      const existing = prev.find(i => i.item.id === itemId);
      if (!existing) return prev;
      if (existing.quantity > 1) {
        return prev.map(i => i.item.id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.item.id !== itemId);
    });
  };

  const handleGenerateVoucher = () => {
    if (trayTotal > walletBalance) {
      alert(`Insufficient balance. Please top up KES ${(trayTotal - walletBalance).toLocaleString()} to proceed.`);
      return;
    }

    const newBalance = walletBalance - trayTotal;
    onUpdateWallet(newBalance);

    const voucher: MealVoucher = {
      voucherId: `UOE-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}`,
      items: tray.map(t => ({ name: t.item.name, quantity: t.quantity, price: t.item.priceKes * t.quantity })),
      totalKes: trayTotal,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expiryTime: 'Valid for 45 mins at Serving Hatch 2 & 4',
      qrCode: `TOKEN-${Date.now()}`,
      status: 'Active',
    };

    setActiveVoucher(voucher);
    setShowVoucherModal(true);
    setTray([]);
  };

  const handleTopUpConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(topUpAmount, 10);
    if (isNaN(amount) || amount <= 0) return;

    setTopUpSuccess(true);
    setTimeout(() => {
      onUpdateWallet(walletBalance + amount);
      setTopUpSuccess(false);
      setShowTopUpModal(false);
    }, 1200);
  };

  return (
    <div className="rounded-2xl bg-white border border-[#0B5345]/10 shadow-sm p-5 sm:p-6 space-y-5">
      {/* Module Header with Live Occupancy & Meal Window */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8F8F0] text-[#0B5345] flex items-center justify-center shrink-0">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#111C2D]">Chepkoilel Central Mess & Cafeteria</h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#E8F8F0] text-[#1E7E46]">
                OPEN NOW
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>{currentMealPeriod}</span>
              <span>·</span>
              <span>Serving Hatch 1 - 4</span>
            </div>
          </div>
        </div>

        {/* Live Occupancy Metric */}
        <div className="flex items-center gap-3 bg-[#F4F6F4] px-3.5 py-2 rounded-xl">
          <Users className="w-4 h-4 text-[#0B5345]" />
          <div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-[#111C2D]">{occupancyPercent}% Occupancy</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600 font-medium">{cafeteriaQueueTime}</span>
            </div>
            {/* Occupancy bar */}
            <div className="w-28 sm:w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-[#27AE60] rounded-full transition-all duration-500"
                style={{ width: `${occupancyPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Bar & Interactive Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#F8F9FA] p-3 rounded-xl border border-slate-200/60">
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <span className="text-xs text-slate-500">Student Meal Wallet:</span>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-[#0B5345] font-mono tabular-nums">
              KES {walletBalance.toLocaleString()}
            </span>
            <button
              onClick={() => setShowTopUpModal(true)}
              className="px-2.5 py-1 rounded-lg bg-[#0B5345] hover:bg-[#084237] text-white text-[11px] font-semibold transition-colors flex items-center gap-1"
            >
              <CreditCard className="w-3 h-3" />
              <span>Top Up</span>
            </button>
          </div>
        </div>

        {/* Category Filter Buttons (Functional Tabs) */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {(['All', 'Breakfast', 'Lunch', 'Dinner', 'Beverages'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#0B5345] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Item Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredItems.map(item => {
          const inTray = tray.find(t => t.item.id === item.id);
          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                inTray
                  ? 'bg-[#E8F8F0]/30 border-[#27AE60]/40'
                  : 'bg-white border-slate-200/80 hover:border-[#0B5345]/30'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-[#111C2D] leading-snug">{item.name}</h4>
                  {item.isPopular && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#FEF5E7] text-[#B7791F] shrink-0">
                      Chep Special
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span>{item.category}</span>
                  <span>·</span>
                  <span>{item.calories}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100">
                <span className="text-sm font-extrabold text-[#0B5345] font-mono tabular-nums">
                  KES {item.priceKes}
                </span>

                {inTray ? (
                  <div className="flex items-center gap-2 bg-[#E8F8F0] px-2 py-1 rounded-lg border border-[#27AE60]/30">
                    <button
                      onClick={() => handleRemoveFromTray(item.id)}
                      className="w-5 h-5 rounded flex items-center justify-center font-bold text-xs text-[#0B5345] hover:bg-[#27AE60]/20"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-[#0B5345] font-mono">{inTray.quantity}</span>
                    <button
                      onClick={() => handleAddToTray(item)}
                      className="w-5 h-5 rounded flex items-center justify-center font-bold text-xs text-[#0B5345] hover:bg-[#27AE60]/20"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddToTray(item)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#F4F6F4] hover:bg-[#0B5345] hover:text-white text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tray & Voucher Generation Strip */}
      {tray.length > 0 && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#003A2F] to-[#0B5345] text-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-md animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 text-[#FEA51F]" />
            </div>
            <div>
              <p className="text-xs text-[#93D3C1] font-semibold">
                Meal Tray: {tray.reduce((acc, curr) => acc + curr.quantity, 0)} item(s) selected
              </p>
              <p className="text-base font-extrabold text-white font-mono tabular-nums">
                Total: KES {trayTotal.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTray([])}
              className="px-3 py-2 text-xs font-medium text-white/70 hover:text-white"
            >
              Clear Tray
            </button>
            <button
              onClick={handleGenerateVoucher}
              className="py-2.5 px-4 rounded-xl bg-[#27AE60] hover:bg-[#219653] text-white text-xs font-bold transition-transform active:scale-[0.98] flex items-center gap-1.5 shadow-sm"
            >
              <QrCode className="w-4 h-4" />
              <span>Generate Meal Voucher</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Voucher Modal */}
      {showVoucherModal && activeVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-[#111C2D] shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <p className="text-xs uppercase font-semibold text-[#0B5345]">University of Eldoret Mess Voucher</p>
                <h4 className="text-base font-bold text-slate-900">{activeVoucher.voucherId}</h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E8F8F0] text-[#1E7E46] text-xs font-bold">
                READY TO SCAN
              </span>
            </div>

            {/* Simulated Voucher QR Code */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center">
              <div className="w-40 h-40 bg-white p-2 rounded-lg border border-slate-300 flex items-center justify-center shadow-xs">
                <QrCode className="w-36 h-36 text-[#003A2F]" />
              </div>
              <p className="text-xs text-slate-600 mt-2 font-mono font-semibold">
                HOLD AT HATCH SCANNER
              </p>
              <p className="text-[11px] text-slate-400">{activeVoucher.expiryTime}</p>
            </div>

            {/* Itemized summary */}
            <div className="space-y-1.5 text-xs border-t border-slate-100 pt-3">
              {activeVoucher.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-slate-600">
                  <span>{it.quantity}x {it.name}</span>
                  <span className="font-mono font-semibold text-slate-800">KES {it.price}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-100 text-sm">
                <span>Total Paid</span>
                <span className="font-mono text-[#0B5345]">KES {activeVoucher.totalKes}</span>
              </div>
            </div>

            <button
              onClick={() => setShowVoucherModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#0B5345] hover:bg-[#084237] text-white text-xs font-semibold transition-colors"
            >
              Done & Save Receipt
            </button>
          </div>
        </div>
      )}

      {/* Top Up Wallet Modal (Kenyan M-Pesa Integration) */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-[#111C2D] shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowTopUpModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-sm"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#27AE60]/10 text-[#27AE60] flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Top Up Meal Wallet</h4>
                <p className="text-xs text-slate-500">Instant M-Pesa Express Deposit</p>
              </div>
            </div>

            <form onSubmit={handleTopUpConfirm} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Amount to Deposit (KES)
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {['200', '500', '1000'].map(amt => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setTopUpAmount(amt)}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        topUpAmount === amt
                          ? 'border-[#0B5345] bg-[#E8F8F0] text-[#0B5345]'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      KES {amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={e => setTopUpAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27AE60]"
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  M-Pesa Mobile Number
                </label>
                <input
                  type="tel"
                  defaultValue="0712 345 678"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27AE60] font-mono"
                  placeholder="07XX XXX XXX"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  A prompt will appear on your phone requesting your M-Pesa PIN.
                </p>
              </div>

              <button
                type="submit"
                disabled={topUpSuccess}
                className="w-full py-2.5 rounded-xl bg-[#27AE60] hover:bg-[#219653] text-white text-xs font-bold transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {topUpSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white animate-spin" />
                    <span>Processing M-Pesa STK Push...</span>
                  </>
                ) : (
                  <span>Send M-Pesa STK Push (KES {topUpAmount})</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
