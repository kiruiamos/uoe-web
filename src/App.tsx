import React, { useState } from 'react';
import { initialStudentProfile, campusLectures, messMenuItems, hostelHalls, shuttleBuses, feeBreakdown, campusPolls } from './data/mockData';
import { DigitalStudentPass } from './components/DigitalStudentPass';
import { MessCounterCard } from './components/MessCounterCard';
import { InterCampusShuttle } from './components/InterCampusShuttle';
import { TimetableModule } from './components/TimetableModule';
import { FeeClearanceModule } from './components/FeeClearanceModule';
import { HostelModule } from './components/HostelModule';
import { CampusLifeModule } from './components/CampusLifeModule';
import { Navigation, NavTab } from './components/Navigation';
import { MapPin, Sun, Bell, ShieldCheck, ChevronRight, BookOpen, Utensils, Bus, CreditCard, Building2, Smartphone, Monitor } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [student, setStudent] = useState(initialStudentProfile);
  const [lectures, setLectures] = useState(campusLectures);
  const [fees, setFees] = useState(feeBreakdown);
  const [polls, setPolls] = useState(campusPolls);
  const [selectedCampus, setSelectedCampus] = useState<'Main Campus (Chepkoilel)' | 'Town Campus (Musco Towers)'>('Main Campus (Chepkoilel)');
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Trigger floating notification
  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Handlers
  const handleUpdateWallet = (newBalance: number) => {
    setStudent(prev => ({ ...prev, mealWalletBalance: newBalance }));
    notify(`Meal wallet balance updated: KES ${newBalance.toLocaleString()}`);
  };

  const handleMarkAttendance = (lectureId: string) => {
    setLectures(prev =>
      prev.map(l => (l.id === lectureId ? { ...l, attendanceConfirmed: true } : l))
    );
    notify('Attendance confirmed for COM 311. Biometric record synced.');
  };

  const handleClearFee = (amountPaid: number) => {
    let remaining = amountPaid;
    setFees(prev =>
      prev.map(item => {
        if (item.status === 'Pending' && remaining >= item.amountKes) {
          remaining -= item.amountKes;
          return { ...item, status: 'Paid' };
        }
        return item;
      })
    );
    notify(`M-Pesa payment received! KES ${amountPaid.toLocaleString()} credited to your student ledger.`);
  };

  const handleVotePoll = (pollId: string, optionId: string) => {
    setPolls(prev =>
      prev.map(p => {
        if (p.id !== pollId) return p;
        if (p.userVotedOptionId === optionId) return p; // already voted this
        const prevVoted = p.userVotedOptionId;
        const newOptions = p.options.map(opt => {
          if (opt.id === optionId) return { ...opt, votes: opt.votes + 1 };
          if (opt.id === prevVoted) return { ...opt, votes: Math.max(0, opt.votes - 1) };
          return opt;
        });
        const totalVotes = prevVoted ? p.totalVotes : p.totalVotes + 1;
        return {
          ...p,
          options: newOptions,
          totalVotes,
          userVotedOptionId: optionId,
        };
      })
    );
    notify('Your ballot has been securely recorded on the UoESO electoral ledger.');
  };

  const contentRenderer = () => {
    switch (activeTab) {
      case 'timetable':
        return (
          <div className="space-y-6">
            <TimetableModule lectures={lectures} onMarkAttendance={handleMarkAttendance} />
          </div>
        );
      case 'mess':
        return (
          <div className="space-y-6">
            <MessCounterCard
              menuItems={messMenuItems}
              walletBalance={student.mealWalletBalance}
              onUpdateWallet={handleUpdateWallet}
            />
          </div>
        );
      case 'shuttle':
        return (
          <div className="space-y-6">
            <InterCampusShuttle shuttles={shuttleBuses} />
          </div>
        );
      case 'fees':
        return (
          <div className="space-y-6">
            <FeeClearanceModule fees={fees} student={student} onClearFee={handleClearFee} />
            <HostelModule halls={hostelHalls} student={student} />
          </div>
        );
      case 'life':
        return (
          <div className="space-y-6">
            <CampusLifeModule polls={polls} onVote={handleVotePoll} />
          </div>
        );
      case 'dashboard':
      default:
        return (
          <div className="space-y-6">
            {/* Digital Student Pass Hero Card */}
            <DigitalStudentPass student={student} />

            {/* Quick Domain Shortcuts Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => setActiveTab('timetable')}
                className="p-3.5 rounded-xl bg-white border border-[#0B5345]/10 hover:border-[#0B5345]/40 transition-all text-left flex items-center gap-3 shadow-2xs group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#E8F8F0] text-[#0B5345] flex items-center justify-center shrink-0 group-hover:bg-[#0B5345] group-hover:text-white transition-colors">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 group-hover:text-[#0B5345] transition-colors">Lectures</p>
                  <p className="text-[11px] text-slate-500 truncate">Next @ 11:00 AM</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('mess')}
                className="p-3.5 rounded-xl bg-white border border-[#0B5345]/10 hover:border-[#0B5345]/40 transition-all text-left flex items-center gap-3 shadow-2xs group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#FEF5E7] text-[#B7791F] flex items-center justify-center shrink-0 group-hover:bg-[#F39C12] group-hover:text-white transition-colors">
                  <Utensils className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 group-hover:text-[#0B5345] transition-colors">Central Mess</p>
                  <p className="text-[11px] text-slate-500 truncate">Lunch 68% Busy</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('shuttle')}
                className="p-3.5 rounded-xl bg-white border border-[#0B5345]/10 hover:border-[#0B5345]/40 transition-all text-left flex items-center gap-3 shadow-2xs group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#E7EEFF] text-[#006D37] flex items-center justify-center shrink-0 group-hover:bg-[#006D37] group-hover:text-white transition-colors">
                  <Bus className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 group-hover:text-[#0B5345] transition-colors">Musco Shuttle</p>
                  <p className="text-[11px] text-slate-500 truncate">Boarding 11:15 AM</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('fees')}
                className="p-3.5 rounded-xl bg-white border border-[#0B5345]/10 hover:border-[#0B5345]/40 transition-all text-left flex items-center gap-3 shadow-2xs group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#E8F8F0] text-[#1E7E46] flex items-center justify-center shrink-0 group-hover:bg-[#0B5345] group-hover:text-white transition-colors">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 group-hover:text-[#0B5345] transition-colors">Clearance</p>
                  <p className="text-[11px] text-[#1E7E46] font-semibold truncate">Exam Eligible</p>
                </div>
              </button>
            </div>

            {/* Split 2-Column Grid on Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Today's Lectures */}
              <div className="lg:col-span-6 space-y-6">
                <TimetableModule lectures={lectures} onMarkAttendance={handleMarkAttendance} />
              </div>

              {/* Right Column: Live Mess Counter Card */}
              <div className="lg:col-span-6 space-y-6">
                <MessCounterCard
                  menuItems={messMenuItems}
                  walletBalance={student.mealWalletBalance}
                  onUpdateWallet={handleUpdateWallet}
                />
              </div>
            </div>

            {/* Inter-Campus Shuttle Tracker featuring Musco Towers photo */}
            <InterCampusShuttle shuttles={shuttleBuses} />

            {/* Hostel Accommodation & Campus Life */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <HostelModule halls={hostelHalls} student={student} />
              </div>
              <div className="lg:col-span-5">
                <FeeClearanceModule fees={fees} student={student} onClearFee={handleClearFee} />
              </div>
            </div>

            {/* Student Parliament & Safety Hotlines */}
            <CampusLifeModule polls={polls} onVote={handleVotePoll} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F4] text-[#111C2D] flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-[#003A2F] text-white px-4 py-2.5 rounded-xl shadow-xl border border-[#86c5b3]/30 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <ShieldCheck className="w-4 h-4 text-[#7EFBA4]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Bar Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={tab => setActiveTab(tab)}
        onOpenPass={() => setActiveTab('dashboard')}
      />

      {/* Campus Context & Hero Status Bar */}
      <div className="bg-white border-b border-[#0B5345]/10 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Greeting & Location */}
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="font-bold text-slate-900">Habari, {student.name.split(' ')[0]}!</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-slate-500">
              <Sun className="w-3.5 h-3.5 text-[#F39C12]" />
              <span>Eldoret Highlands 21°C</span>
            </span>
            <span>·</span>
            <span className="hidden md:inline text-slate-500">Term 1 (2026/2027)</span>
          </div>

          {/* Campus Switcher & Device View Toggle */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Campus selector */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs">
              <button
                onClick={() => {
                  setSelectedCampus('Main Campus (Chepkoilel)');
                  notify('Switched view to Chepkoilel Main Campus');
                }}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  selectedCampus === 'Main Campus (Chepkoilel)'
                    ? 'bg-white text-[#0B5345] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Chepkoilel
              </button>
              <button
                onClick={() => {
                  setSelectedCampus('Town Campus (Musco Towers)');
                  notify('Switched view to Musco Towers Town Campus');
                }}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  selectedCampus === 'Town Campus (Musco Towers)'
                    ? 'bg-white text-[#0B5345] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Musco Towers
              </button>
            </div>

            {/* Device frame preview toggle */}
            <button
              onClick={() => setIsPhoneFrame(!isPhoneFrame)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-[#0B5345] bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              title="Toggle mobile device frame preview"
            >
              {isPhoneFrame ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
              <span>{isPhoneFrame ? 'Desktop Layout' : 'Mobile Frame'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 pb-20 lg:pb-12">
        {isPhoneFrame ? (
          /* Phone Frame Mode */
          <div className="py-6 px-4 flex justify-center">
            <div className="w-[390px] min-h-[820px] bg-[#F4F6F4] rounded-[44px] shadow-2xl border-8 border-slate-800 p-4 overflow-y-auto space-y-5 relative">
              {/* Dynamic Island / Speaker notch */}
              <div className="w-28 h-4 bg-slate-800 rounded-full mx-auto mb-2" />
              {contentRenderer()}
            </div>
          </div>
        ) : (
          /* Responsive Desktop & Tablet Canvas (Full 1440px wide baseline) */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {contentRenderer()}
          </div>
        )}
      </main>

      {/* Footer (No telemetry, clean quiet institutional footer) */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#0B5345]">University of Eldoret</span>
            <span>·</span>
            <span>Flame of Knowledge and Innovation</span>
          </div>
          <p className="text-[11px] text-slate-400">
            © 2026 University of Eldoret ICT & Academic Registry · Chepkoilel & Musco Towers
          </p>
        </div>
      </footer>
    </div>
  );
}
