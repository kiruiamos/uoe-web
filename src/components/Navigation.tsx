import React from 'react';
import { Home, Calendar, Utensils, Bus, CreditCard, Users, QrCode } from 'lucide-react';

export type NavTab = 'dashboard' | 'timetable' | 'mess' | 'shuttle' | 'fees' | 'life';

interface Props {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenPass: () => void;
}

export const Navigation: React.FC<Props> = ({ activeTab, onTabChange, onOpenPass }) => {
  const desktopLinks: { id: NavTab; label: string }[] = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'timetable', label: 'Timetable' },
    { id: 'mess', label: 'Central Mess' },
    { id: 'shuttle', label: 'Musco Shuttle' },
    { id: 'fees', label: 'Fees & Clearance' },
    { id: 'life', label: 'Campus Life' },
  ];

  const mobileTabs: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Pass', icon: Home },
    { id: 'timetable', label: 'Classes', icon: Calendar },
    { id: 'mess', label: 'Mess', icon: Utensils },
    { id: 'shuttle', label: 'Shuttle', icon: Bus },
    { id: 'fees', label: 'Clearance', icon: CreditCard },
  ];

  return (
    <>
      {/* Desktop Top Bar Contract: [Brand title, one line] — [4–5 nav links, single-line] — [1 primary action] */}
      <header className="hidden lg:flex items-center justify-between gap-8 px-6 py-3.5 bg-white border-b border-[#0B5345]/15 sticky top-0 z-40 shadow-xs">
        {/* Zone 1: Brand title, single line */}
        <button
          onClick={() => onTabChange('dashboard')}
          className="text-left flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#0B5345] whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-[#0B5345] text-white flex items-center justify-center font-extrabold text-xs">
            UoE
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#111C2D]">Highland Campus</span>
        </button>

        {/* Zone 2: 4-5 nav links, 1-2 word labels, single-line */}
        <nav className="flex items-center gap-7 text-sm font-semibold text-slate-600">
          {desktopLinks.map(link => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onTabChange(link.id)}
                className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                  isActive
                    ? 'text-[#0B5345] border-[#0B5345] font-bold'
                    : 'text-slate-600 border-transparent hover:text-[#0B5345] hover:border-slate-300'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenPass}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0B5345] hover:bg-[#084237] rounded-xl transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap shrink-0 active:scale-[0.98]"
          >
            <QrCode className="w-4 h-4 text-[#FEA51F]" />
            <span>Digital ID Pass</span>
          </button>
        </div>
      </header>

      {/* Mobile Top Bar (Compact Header) */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#0B5345]/10 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#0B5345] text-white flex items-center justify-center font-extrabold text-[10px]">
            UoE
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-[#111C2D] leading-none">Highland Campus</h1>
            <p className="text-[10px] text-slate-500 mt-0.5">Chepkoilel & Musco Towers</p>
          </div>
        </div>

        <button
          onClick={onOpenPass}
          className="px-2.5 py-1.5 rounded-lg bg-[#0B5345] text-white text-[11px] font-bold flex items-center gap-1"
        >
          <QrCode className="w-3.5 h-3.5 text-[#FEA51F]" />
          <span>My Pass</span>
        </button>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar (<15% sticky cap) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1">
        <div className="grid grid-cols-5 items-center h-14">
          {mobileTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center py-1 transition-all ${
                  isActive ? 'text-[#0B5345]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-[#E8F8F0]' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-bold text-[#0B5345]' : 'font-medium'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
