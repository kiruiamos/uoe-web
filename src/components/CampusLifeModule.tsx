import React, { useState } from 'react';
import { PollQuestion } from '../types/campus';
import { emergencyContacts } from '../data/mockData';
import { Vote, Users, ShieldAlert, PhoneCall, CheckCircle2, Trophy, TreePine, Code, Heart, Sparkles } from 'lucide-react';

interface Props {
  polls: PollQuestion[];
  onVote: (pollId: string, optionId: string) => void;
}

export const CampusLifeModule: React.FC<Props> = ({ polls, onVote }) => {
  const [selectedClubs, setSelectedClubs] = useState<string[]>(['Tech & Coding Guild']);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const clubs = [
    {
      id: 'club-1',
      name: 'Chepkoilel Tech & Coding Guild',
      category: 'Innovation & AI',
      members: 420,
      icon: Code,
      meetTime: 'Wednesdays 4:00 PM @ ICT Lab 3',
    },
    {
      id: 'club-2',
      name: 'Highland Forestry & Climate Action',
      category: 'Environment & Agro',
      members: 310,
      icon: TreePine,
      meetTime: 'Saturdays 8:30 AM @ Arboretum',
    },
    {
      id: 'club-3',
      name: 'Eldoret Champions Athletics Club',
      category: 'Sports & Track',
      members: 580,
      icon: Trophy,
      meetTime: 'Mon - Fri 6:00 AM @ Campus Track',
    },
    {
      id: 'club-4',
      name: 'University Red Cross & Peer Counselors',
      category: 'Welfare & Health',
      members: 240,
      icon: Heart,
      meetTime: 'Thursdays 5:00 PM @ Student Centre',
    },
  ];

  const handleToggleClub = (name: string) => {
    setSelectedClubs(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard?.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Student Union Polling Station */}
      <div className="rounded-2xl bg-white border border-[#0B5345]/10 shadow-sm p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B5345] text-white flex items-center justify-center shrink-0">
              <Vote className="w-5 h-5 text-[#FEA51F]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#111C2D]">UoESO Student Parliament Ballots</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F8F0] text-[#1E7E46]">
                  OFFICIAL POLLS
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Direct student representation and voting for campus welfare
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {polls.map(poll => {
            const hasVoted = !!poll.userVotedOptionId;

            return (
              <div
                key={poll.id}
                className="p-4 rounded-xl border border-slate-200/90 bg-[#F8F9FA] space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#0B5345]">{poll.category}</span>
                    <span className="text-slate-400">{poll.deadline}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{poll.title}</h4>
                  <p className="text-xs text-slate-600">{poll.description}</p>
                </div>

                {/* Options / Ballots */}
                <div className="space-y-2 pt-2">
                  {poll.options.map(opt => {
                    const isSelected = poll.userVotedOptionId === opt.id;
                    const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;

                    return (
                      <button
                        key={opt.id}
                        onClick={() => onVote(poll.id, opt.id)}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all relative overflow-hidden flex items-center justify-between ${
                          isSelected
                            ? 'border-[#27AE60] bg-[#E8F8F0] font-semibold text-[#0B5345]'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        {/* Vote percentage bar */}
                        {hasVoted && (
                          <div
                            className="absolute top-0 bottom-0 left-0 bg-[#27AE60]/10 pointer-events-none"
                            style={{ width: `${pct}%` }}
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#27AE60]" />}
                          <span>{opt.label}</span>
                        </span>
                        {hasVoted && (
                          <span className="relative z-10 font-mono text-[11px] text-slate-600 font-bold tabular-nums">
                            {pct}% ({opt.votes})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-200/70 pt-2 mt-2">
                  <span>{poll.totalVotes.toLocaleString()} student ballots cast</span>
                  <span>{hasVoted ? 'Vote Recorded' : 'Tap option to vote'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clubs & Societies */}
      <div className="rounded-2xl bg-white border border-[#0B5345]/10 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-[#111C2D]">Student Clubs & Societies</h3>
            <p className="text-xs text-slate-500">Dean of Students registered campus organisations</p>
          </div>
          <span className="text-xs font-semibold text-[#0B5345]">
            {selectedClubs.length} Active Memberships
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {clubs.map(c => {
            const isMember = selectedClubs.includes(c.name);
            const Icon = c.icon;

            return (
              <div
                key={c.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-2 ${
                  isMember
                    ? 'border-[#0B5345] bg-[#E8F8F0]/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="w-9 h-9 rounded-lg bg-[#0B5345]/10 text-[#0B5345] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{c.name}</h4>
                  <p className="text-[11px] text-slate-500">{c.meetTime}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">{c.members} Members</span>
                  <button
                    onClick={() => handleToggleClub(c.name)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      isMember
                        ? 'bg-[#0B5345] text-white'
                        : 'bg-[#F4F6F4] text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isMember ? 'Joined' : 'Join Club'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Welfare & Emergency Contact Directory */}
      <div className="rounded-2xl bg-white border border-[#0B5345]/10 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-xl bg-[#D9381E]/10 text-[#D9381E] flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#111C2D]">Campus Safety & Emergency Hotlines</h3>
            <p className="text-xs text-slate-500">24/7 Welfare, Health Centre ambulance, and security dispatch</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {emergencyContacts.map((contact, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200/80 bg-[#F8F9FA] flex items-center justify-between gap-3"
            >
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">{contact.title}</p>
                <p className="text-[11px] text-slate-500">{contact.location} · {contact.hours}</p>
                <p className="text-xs font-mono font-bold text-[#0B5345]">{contact.phone}</p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleCopyPhone(contact.phone)}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  {copiedPhone === contact.phone ? 'Copied!' : 'Copy'}
                </button>
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                  className="p-2 rounded-lg bg-[#27AE60] hover:bg-[#219653] text-white transition-colors"
                  title="Call Hotline"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
