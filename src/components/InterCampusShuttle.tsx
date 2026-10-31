import React, { useState } from 'react';
import { ShuttleSchedule } from '../types/campus';
import { Bus, MapPin, Clock, Users, ArrowRight, CheckCircle2, Ticket, ShieldAlert } from 'lucide-react';

interface Props {
  shuttles: ShuttleSchedule[];
}

export const InterCampusShuttle: React.FC<Props> = ({ shuttles }) => {
  const [selectedShuttle, setSelectedShuttle] = useState<ShuttleSchedule | null>(null);
  const [bookedSeatNumber, setBookedSeatNumber] = useState<number | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleOpenBooking = (shuttle: ShuttleSchedule) => {
    setSelectedShuttle(shuttle);
    setBookedSeatNumber(Math.floor(1 + Math.random() * 40));
    setShowBookingModal(true);
    setBookingSuccess(false);
  };

  const handleConfirmReservation = () => {
    setBookingSuccess(true);
  };

  return (
    <div className="rounded-2xl bg-white border border-[#0B5345]/10 shadow-sm p-5 sm:p-6 space-y-5">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B5345] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Bus className="w-5 h-5 text-[#FEA51F]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#111C2D]">Inter-Campus Shuttle Service</h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#E8F8F0] text-[#1E7E46]">
                LIVE TRANSIT
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Chepkoilel Main Campus ⇄ Musco Towers Town Campus (Direct Shuttle)
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-600 bg-[#F4F6F4] px-3.5 py-1.5 rounded-xl flex items-center gap-2 self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-[#0B5345]" />
          <span className="font-semibold text-slate-800">Every 45 Minutes</span>
          <span className="text-slate-400">·</span>
          <span>Free with Student Pass</span>
        </div>
      </div>

      {/* Featured Musco Towers & Campus Bus Visual Card */}
      <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-xs group">
        <div className="h-48 sm:h-56 w-full relative overflow-hidden bg-slate-900">
          <img
            src="/assets/aistudio/University_of_Eldoret_9589ec90.jpeg"
            alt="University of Eldoret Town Campus - Musco Towers and Shuttle Coach"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          {/* Measured Gradient Scrim for WCAG contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

          {/* Floating badge over image */}
          <div className="absolute top-3 left-3 bg-[#003A2F]/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-[#FEA51F]" />
            <span>Musco Towers Town Campus Terminal</span>
          </div>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <p className="text-xs text-[#93D3C1] font-semibold uppercase tracking-wider">Highland Transport Fleet</p>
            <h4 className="text-lg sm:text-xl font-extrabold tracking-tight">University of Eldoret Town Campus Terminal</h4>
            <p className="text-xs text-white/80 mt-0.5 line-clamp-1">
              Dedicated student transit connecting Chepkoilel academic pavilions and Musco Towers CBD halls.
            </p>
          </div>
        </div>
      </div>

      {/* Live Shuttle Trips List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 px-1">
          <span>Active & Next Departures</span>
          <span className="text-slate-400">Terminal: Musco Towers / Main Gate</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {shuttles.map(bus => (
            <div
              key={bus.id}
              className="p-4 rounded-xl border border-slate-200/90 hover:border-[#0B5345]/40 transition-all bg-[#F8F9FA] space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">{bus.busNumber}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        bus.status === 'Boarding'
                          ? 'bg-[#E8F8F0] text-[#1E7E46] animate-pulse'
                          : bus.status === 'On Time'
                          ? 'bg-[#E7EEFF] text-[#006D37]'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {bus.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Driver: {bus.driverName}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#0B5345] block">{bus.departureTime}</span>
                  <span className="text-[10px] text-slate-500">ETA {bus.estimatedArrival}</span>
                </div>
              </div>

              {/* Route */}
              <div className="flex items-center gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/60">
                <MapPin className="w-3.5 h-3.5 text-[#0B5345] shrink-0" />
                <span className="truncate max-w-[130px] font-medium">{bus.departurePoint}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate max-w-[130px] font-semibold text-slate-900">{bus.destination}</span>
              </div>

              {/* Seat Availability & Action */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 text-xs">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-semibold text-slate-800 font-mono tabular-nums">
                    {bus.availableSeats} of {bus.totalSeats} seats open
                  </span>
                </div>

                <button
                  onClick={() => handleOpenBooking(bus)}
                  className="px-3 py-1.5 rounded-lg bg-[#0B5345] hover:bg-[#084237] text-white text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Reserve Seat</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seat Reservation Modal */}
      {showBookingModal && selectedShuttle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-[#111C2D] shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-sm"
            >
              ✕
            </button>

            {!bookingSuccess ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0B5345] text-white flex items-center justify-center">
                    <Bus className="w-5 h-5 text-[#FEA51F]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Seat Reservation</h4>
                    <p className="text-xs text-slate-500">{selectedShuttle.busNumber}</p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">From:</span>
                    <span className="font-semibold text-slate-800">{selectedShuttle.departurePoint}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">To:</span>
                    <span className="font-semibold text-slate-800">{selectedShuttle.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Departure Time:</span>
                    <span className="font-bold text-[#0B5345] font-mono">{selectedShuttle.departureTime}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2">
                    <span className="text-slate-500">Assigned Seat:</span>
                    <span className="font-extrabold text-[#27AE60] text-sm">Seat #{bookedSeatNumber}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  Please arrive at the boarding platform 10 minutes prior to departure. Show digital pass at the bus door.
                </p>

                <button
                  onClick={handleConfirmReservation}
                  className="w-full py-2.5 rounded-xl bg-[#27AE60] hover:bg-[#219653] text-white text-xs font-bold transition-transform active:scale-[0.98]"
                >
                  Confirm Free Seat Booking
                </button>
              </>
            ) : (
              <div className="text-center py-2 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#E8F8F0] text-[#1E7E46] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Boarding Pass Confirmed!</h4>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-700">
                  <p className="font-semibold text-slate-900">{selectedShuttle.busNumber}</p>
                  <p>Seat <span className="font-bold text-[#0B5345]">#{bookedSeatNumber}</span> · Departure {selectedShuttle.departureTime}</p>
                  <p className="text-[11px] text-slate-500">Show this pass to {selectedShuttle.driverName}</p>
                </div>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="w-full py-2 rounded-xl bg-[#0B5345] text-white text-xs font-semibold"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
