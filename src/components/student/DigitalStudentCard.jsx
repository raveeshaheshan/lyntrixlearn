import React from 'react';
import { useApp } from '../../context/AppContext';
import { QrCode, Sparkles, ShieldCheck, CheckCircle2, Download, Printer } from 'lucide-react';

export const DigitalStudentCard = () => {
  const { currentStudent, showIdCardModal, setShowIdCardModal, showToast } = useApp();

  if (!showIdCardModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-[#E1EDF7] rounded-3xl max-w-md w-full p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-2xl animate-in zoom-in-95 relative my-auto max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#E1EDF7]">
          <div className="flex items-center gap-2 text-[#2C3E50] font-bold text-xs">
            <Sparkles className="w-4 h-4 text-[#6BA8E5]" />
            <span>OFFICIAL STUDENT ENTRANCE PASS</span>
          </div>
          <button
            onClick={() => setShowIdCardModal(false)}
            className="w-8 h-8 rounded-full bg-[#F4F8FA] border border-[#E1EDF7] text-[#2C3E50] hover:bg-[#E1EDF7] flex items-center justify-center text-sm font-bold transition"
          >
            ✕
          </button>
        </div>

        {/* HOLOGRAPHIC LIGHT PASS CARD CONTAINER */}
        <div className="relative rounded-3xl p-4 sm:p-6 overflow-hidden border border-[#E1EDF7] bg-gradient-to-br from-[#F4F8FA] via-white to-[#F4F8FA] shadow-md">
          {/* Top Logo */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#8EC5FC] text-[#2C3E50] flex items-center justify-center font-black text-xs shadow-sm border border-[#8EC5FC]">
                LL
              </div>
              <div>
                <div className="font-black text-xs tracking-wider text-[#2C3E50]">LYNTRIX LEARN</div>
                <div className="text-[9px] text-[#6BA8E5] font-bold">SMART ID & ATTENDANCE CARD</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>ACTIVE 2026</span>
            </span>
          </div>

          {/* Student Details & Photo */}
          <div className="mt-5 flex items-center gap-3.5">
            <div className="relative shrink-0">
              <img
                src={currentStudent.avatar}
                alt={currentStudent.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#8EC5FC] shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                <ShieldCheck className="w-3 h-3 text-white" />
              </div>
            </div>

            <div className="space-y-0.5 overflow-hidden">
              <h3 className="font-black text-[#2C3E50] text-sm sm:text-base leading-tight truncate">{currentStudent.name}</h3>
              <div className="text-xs font-mono text-[#357ABD] font-bold">{currentStudent.indexNumber}</div>
              <div className="text-[11px] text-[#4A6572] font-medium truncate">{currentStudent.batch}</div>
              <div className="text-[10px] text-[#4A6572]/80">NIC: {currentStudent.nic}</div>
            </div>
          </div>

          {/* QR Code & Barcode Section */}
          <div className="mt-5 pt-4 border-t border-[#E1EDF7] flex items-center justify-between gap-3">
            {/* Dynamic QR Box */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white p-1.5 rounded-2xl border border-[#E1EDF7] flex flex-col items-center justify-center shadow-sm shrink-0">
              <div className="w-full h-full bg-[#2C3E50] p-1 rounded-xl flex items-center justify-center relative overflow-hidden">
                <QrCode className="w-full h-full text-white" />
              </div>
            </div>

            {/* Barcode & Instructions */}
            <div className="flex-1 space-y-1.5 text-right">
              <div className="text-[10px] text-[#4A6572] font-bold uppercase tracking-wider">Attendance Token:</div>
              <div className="font-mono text-xs text-[#2C3E50] font-bold bg-[#E1EDF7]/70 border border-[#8EC5FC]/40 px-2 py-0.5 rounded inline-block">
                {currentStudent.qrToken}
              </div>
              <p className="text-[10px] text-[#4A6572] leading-tight">
                Scan this card at the entrance gate scanner or hall check-in counter.
              </p>
            </div>
          </div>
        </div>

        {/* Card Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => showToast("Student ID Card exported as PDF image!", "success")}
            className="flex-1 py-2.5 bg-[#8EC5FC] hover:bg-[#6BA8E5] text-[#2C3E50] hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-[#8EC5FC]/25 active:scale-95 border border-[#8EC5FC]"
          >
            <Download className="w-4 h-4" />
            <span>Download Card</span>
          </button>
          <button
            onClick={() => window.print()}
            className="p-2.5 bg-[#F4F8FA] hover:bg-[#E1EDF7] text-[#2C3E50] rounded-xl text-xs transition border border-[#E1EDF7]"
            title="Print ID Card"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
