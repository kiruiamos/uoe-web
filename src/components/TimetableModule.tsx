import React, { useState } from 'react';
import { LectureItem } from '../types/campus';
import { Calendar, Clock, MapPin, CheckCircle, UserCheck, BookOpen, Download, AlertCircle } from 'lucide-react';

interface Props {
  lectures: LectureItem[];
  onMarkAttendance: (lectureId: string) => void;
}

export const TimetableModule: React.FC<Props> = ({ lectures, onMarkAttendance }) => {
  const [selectedDay, setSelectedDay] = useState<'All' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const days: ('All' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
    'All',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];

  const filteredLectures = selectedDay === 'All'
    ? lectures
    : lectures.filter(l => l.day === selectedDay);

  const totalLectures = lectures.length;
  const attendedCount = lectures.filter(l => l.attendanceConfirmed).length;
  const attendancePercentage = Math.round((attendedCount / totalLectures) * 100);

  const handleDownloadSyllabus = (code: string) => {
    setDownloadNotice(`Course syllabus & past papers for ${code} downloaded.`);
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  return (
    <div className="rounded-2xl bg-white border border-[#0B5345]/10 shadow-sm p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B5345] text-white flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-[#93D3C1]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#111C2D]">Academic Timetable & Lectures</h3>
            <p className="text-xs text-slate-500">2026/2027 Academic Year · Semester 1 Schedule</p>
          </div>
        </div>

        {/* Attendance KPI */}
        <div className="flex items-center gap-3 bg-[#F4F6F4] px-3.5 py-2 rounded-xl self-start sm:self-auto">
          <UserCheck className="w-4 h-4 text-[#27AE60]" />
          <div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-900">{attendancePercentage}% Biometric Attendance</span>
              <span className="text-slate-400">·</span>
              <span className="text-xs font-semibold text-[#1E7E46]">Eligible for Exams</span>
            </div>
          </div>
        </div>
      </div>

      {/* Download Alert Notice */}
      {downloadNotice && (
        <div className="p-3 bg-[#E8F8F0] border border-[#27AE60]/30 rounded-xl text-xs text-[#0B5345] font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-[#27AE60]" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Days Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {days.map(d => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedDay === d
                ? 'bg-[#0B5345] text-white shadow-xs'
                : 'bg-[#F4F6F4] text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Lecture Cards List */}
      <div className="space-y-3">
        {filteredLectures.map(lec => (
          <div
            key={lec.id}
            className={`p-4 rounded-xl border transition-all ${
              lec.status === 'In Progress'
                ? 'border-[#27AE60] bg-[#E8F8F0]/30'
                : 'border-slate-200/80 bg-white hover:border-[#0B5345]/30'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-extrabold text-[#0B5345] font-mono px-2 py-0.5 rounded bg-[#E8F8F0]">
                    {lec.courseCode}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{lec.courseTitle}</h4>
                  {lec.status === 'In Progress' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F8F0] text-[#1E7E46]">
                      LIVE NOW
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap pt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lec.day}, {lec.time}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0B5345]" />
                    <span className="font-semibold text-slate-800">{lec.room}</span>
                  </span>
                  <span>·</span>
                  <span className="text-slate-500">Instructor: {lec.lecturer}</span>
                </div>
              </div>

              {/* Attendance & Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => handleDownloadSyllabus(lec.courseCode)}
                  className="p-2 text-slate-500 hover:text-[#0B5345] hover:bg-slate-100 rounded-lg transition-colors"
                  title="Download Lecture Materials"
                >
                  <Download className="w-4 h-4" />
                </button>

                {lec.attendanceConfirmed ? (
                  <span className="px-3 py-1.5 rounded-lg bg-[#E8F8F0] text-[#1E7E46] text-xs font-semibold flex items-center gap-1.5 border border-[#27AE60]/30">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Attended</span>
                  </span>
                ) : (
                  <button
                    onClick={() => onMarkAttendance(lec.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0B5345] hover:bg-[#084237] text-white text-xs font-semibold transition-transform active:scale-[0.98] flex items-center gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-[#93D3C1]" />
                    <span>Check In</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredLectures.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-xs">
            No scheduled lectures for this day. Perfect time for library study or revision.
          </div>
        )}
      </div>
    </div>
  );
};
