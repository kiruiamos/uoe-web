import React, { useState } from 'react';
import { HostelRoom, StudentProfile } from '../types/campus';
import { Home, Bed, Shield, CheckCircle2, Wrench, Sparkles, Building, FileCheck } from 'lucide-react';

interface Props {
  halls: HostelRoom[];
  student: StudentProfile;
}

export const HostelModule: React.FC<Props> = ({ halls, student }) => {
  const [selectedGender, setSelectedGender] = useState<'All' | 'Male' | 'Female' | 'Co-ed'>('All');
  const [activeBookingHall, setActiveBookingHall] = useState<HostelRoom | null>(null);
  const [selectedBed, setSelectedBed] = useState<number | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [allocatedRoom, setAllocatedRoom] = useState<{ hall: string; room: string; bed: number } | null>({
    hall: 'Hall 1 (Kilimanjaro Hall)',
    room: 'K-204',
    bed: 2,
  });

  // Maintenance form state
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [maintenanceIssue, setMaintenanceIssue] = useState('Electrical / Socket Repair');
  const [maintenanceNotes, setMaintenanceNotes] = useState('');
  const [maintenanceSubmitted, setMaintenanceSubmitted] = useState(false);

  const filteredHalls = selectedGender === 'All'
    ? halls
    : halls.filter(h => h.gender === selectedGender || h.gender === 'Co-ed');

  const handleOpenBooking = (hall: HostelRoom) => {
    setActiveBookingHall(hall);
    setSelectedBed(hall.occupiedBeds + 1);
    setBookingConfirmed(false);
  };

  const handleConfirmBedBooking = () => {
    if (!activeBookingHall || !selectedBed) return;
    setAllocatedRoom({
      hall: activeBookingHall.hallName,
      room: activeBookingHall.roomNumber,
      bed: selectedBed,
    });
    setBookingConfirmed(true);
  };

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMaintenanceSubmitted(true);
    setTimeout(() => {
      setMaintenanceSubmitted(false);
      setShowMaintenanceModal(false);
      setMaintenanceNotes('');
    }, 1800);
  };

  return (
    <div className="rounded-2xl bg-white border border-[#0B5345]/10 shadow-sm p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B5345] text-white flex items-center justify-center shrink-0">
            <Home className="w-5 h-5 text-[#FEA51F]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#111C2D]">Hostel Allocation & Residence</h3>
            <p className="text-xs text-slate-500">Chepkoilel Halls of Residence & Town Campus Annex</p>
          </div>
        </div>

        {/* Current Allocation Pill */}
        {allocatedRoom && (
          <div className="flex items-center gap-2 bg-[#E8F8F0] px-3.5 py-1.5 rounded-xl border border-[#27AE60]/30 self-start sm:self-auto text-xs">
            <Bed className="w-3.5 h-3.5 text-[#1E7E46]" />
            <span className="font-semibold text-[#0B5345]">{allocatedRoom.hall}</span>
            <span className="text-slate-400">·</span>
            <span className="font-mono font-bold text-slate-800">{allocatedRoom.room} (Bed {allocatedRoom.bed})</span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8F9FA] p-3 rounded-xl border border-slate-200/60">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['All', 'Male', 'Female', 'Co-ed'] as const).map(g => (
            <button
              key={g}
              onClick={() => setSelectedGender(g)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedGender === g
                  ? 'bg-[#0B5345] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              {g === 'All' ? 'All Hostels' : `${g} Residences`}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowMaintenanceModal(true)}
          className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Wrench className="w-3.5 h-3.5 text-[#0B5345]" />
          <span>Report Room Repair</span>
        </button>
      </div>

      {/* Halls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHalls.map(hall => {
          const isCurrentlyAllocated = allocatedRoom?.hall === hall.hallName;
          const availableBeds = hall.totalBeds - hall.occupiedBeds;

          return (
            <div
              key={hall.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                isCurrentlyAllocated
                  ? 'bg-[#E8F8F0]/30 border-[#27AE60]'
                  : 'bg-white border-slate-200/90 hover:border-[#0B5345]/30'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{hall.hallName}</h4>
                    <p className="text-xs text-slate-500">{hall.floor} · Room {hall.roomNumber}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E7EEFF] text-[#0B5345]">
                    {hall.gender}
                  </span>
                </div>

                {/* Bed occupancy visualizer */}
                <div className="bg-[#F8F9FA] p-2.5 rounded-lg border border-slate-200/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <Bed className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-800">
                      {availableBeds > 0 ? `${availableBeds} beds vacant` : 'Fully Occupied'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: hall.totalBeds }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center text-[9px] font-mono font-bold ${
                          i < hall.occupiedBeds
                            ? 'bg-slate-300 text-slate-600'
                            : 'bg-[#27AE60] text-white'
                        }`}
                        title={i < hall.occupiedBeds ? `Bed ${i+1}: Occupied` : `Bed ${i+1}: Available`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {hall.amenities.map(am => (
                    <span key={am} className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {am}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <span className="text-sm font-bold text-[#0B5345] font-mono tabular-nums">
                    KES {hall.pricePerSemester.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500"> / semester</span>
                </div>

                {isCurrentlyAllocated ? (
                  <span className="px-3 py-1.5 rounded-lg bg-[#E8F8F0] text-[#1E7E46] text-xs font-semibold flex items-center gap-1 border border-[#27AE60]/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Your Allocated Room</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleOpenBooking(hall)}
                    disabled={availableBeds === 0}
                    className="px-3 py-1.5 rounded-lg bg-[#0B5345] hover:bg-[#084237] text-white text-xs font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Select Room Bed
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bed Booking Modal */}
      {activeBookingHall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-[#111C2D] shadow-2xl relative space-y-4">
            <button
              onClick={() => setActiveBookingHall(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-sm"
            >
              ✕
            </button>

            {!bookingConfirmed ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0B5345] text-white flex items-center justify-center">
                    <Bed className="w-5 h-5 text-[#FEA51F]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{activeBookingHall.hallName}</h4>
                    <p className="text-xs text-slate-500">Room {activeBookingHall.roomNumber} ({activeBookingHall.floor})</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">Choose Bed Slot:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: activeBookingHall.totalBeds }).map((_, i) => {
                      const bedNum = i + 1;
                      const isOccupied = bedNum <= activeBookingHall.occupiedBeds;
                      return (
                        <button
                          key={bedNum}
                          disabled={isOccupied}
                          onClick={() => setSelectedBed(bedNum)}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                            isOccupied
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                              : selectedBed === bedNum
                              ? 'bg-[#E8F8F0] border-[#0B5345] text-[#0B5345] font-bold ring-2 ring-[#0B5345]/20'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>Bed {bedNum}</span>
                            <span className="text-[10px]">{isOccupied ? 'Taken' : 'Open'}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Accommodation Fee:</span>
                    <span className="font-mono font-bold text-slate-900">
                      KES {activeBookingHall.pricePerSemester.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Billed to student fee account. Keys issued at Chepkoilel Housekeeper Office.
                  </p>
                </div>

                <button
                  onClick={handleConfirmBedBooking}
                  className="w-full py-2.5 rounded-xl bg-[#27AE60] hover:bg-[#219653] text-white text-xs font-bold transition-transform active:scale-[0.98]"
                >
                  Confirm Room Bed Allocation
                </button>
              </>
            ) : (
              <div className="text-center py-2 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#E8F8F0] text-[#1E7E46] mx-auto flex items-center justify-center">
                  <FileCheck className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Room Allocated Successfully!</h4>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <p className="font-bold text-[#0B5345]">{activeBookingHall.hallName}</p>
                  <p>Room: <span className="font-mono font-bold">{activeBookingHall.roomNumber}</span> · Bed #{selectedBed}</p>
                  <p className="text-[11px] text-slate-500">Bring digital student pass to collect physical key.</p>
                </div>
                <button
                  onClick={() => setActiveBookingHall(null)}
                  className="w-full py-2 rounded-xl bg-[#0B5345] text-white text-xs font-semibold"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Maintenance Request Modal */}
      {showMaintenanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-[#111C2D] shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowMaintenanceModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-sm"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B5345] text-white flex items-center justify-center">
                <Wrench className="w-5 h-5 text-[#FEA51F]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Hostel Repair Request</h4>
                <p className="text-xs text-slate-500">Estate & Maintenance Department</p>
              </div>
            </div>

            <form onSubmit={handleMaintenanceSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Category</label>
                <select
                  value={maintenanceIssue}
                  onChange={e => setMaintenanceIssue(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B5345]"
                >
                  <option>Electrical / Socket / Bulb Repair</option>
                  <option>Plumbing / Shower / Sink Leakage</option>
                  <option>Door Lock / Key Repair</option>
                  <option>Study Desk / Bed Frame Repair</option>
                  <option>Solar Hot Water System Issue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Notes</label>
                <textarea
                  rows={3}
                  value={maintenanceNotes}
                  onChange={e => setMaintenanceNotes(e.target.value)}
                  placeholder="Describe the issue (e.g. Socket sparking near bed 2)..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B5345]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={maintenanceSubmitted}
                className="w-full py-2.5 rounded-xl bg-[#0B5345] hover:bg-[#084237] text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                {maintenanceSubmitted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#7EFBA4]" />
                    <span>Ticket #EST-2026-44 Dispatched!</span>
                  </>
                ) : (
                  <span>Submit Maintenance Request</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
