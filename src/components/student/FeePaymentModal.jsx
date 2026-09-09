import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CreditCard, 
  UploadCloud, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Sparkles,
  Lock
} from 'lucide-react';
import { R2FileUploader } from '../common/R2FileUploader';

export const FeePaymentModal = () => {
  const { 
    paymentModalData, 
    setPaymentModalData, 
    currentStudent, 
    submitBankSlip, 
    processInstantCardPayment,
    showToast 
  } = useApp();

  const [paymentMode, setPaymentMode] = useState('card');
  
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8812');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('742');

  const [slipForm, setSlipForm] = useState({
    bank: 'Commercial Bank',
    referenceNo: '',
    amount: paymentModalData?.batch?.monthlyFee || 3500,
    slipImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'
  });

  if (!paymentModalData) return null;

  const batch = paymentModalData.batch || {
    id: paymentModalData.batchId || 'd0000000-0000-0000-0000-000000000001',
    title: paymentModalData.title || '2025 A/L Combined Maths — Full Theory Masterclass',
    monthlyFee: paymentModalData.amount || 3500
  };

  const instructor = paymentModalData.instructor || {
    name: 'Eng. Kasun Ranasinghe',
    subject: 'Combined Mathematics'
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    processInstantCardPayment({
      studentId: currentStudent?.id || 'b0000000-0000-0000-0000-000000000001',
      batchId: batch.id,
      amount: batch.monthlyFee
    });
  };

  const handleSlipSubmit = (e) => {
    e.preventDefault();
    if (!slipForm.referenceNo) {
      showToast("Please enter the deposit receipt reference number", "error");
      return;
    }
    if (!slipForm.slipImage) {
      showToast("Please upload your deposit receipt photo to Cloudflare R2", "error");
      return;
    }

    submitBankSlip({
      studentId: currentStudent?.id || 'b0000000-0000-0000-0000-000000000001',
      batchId: batch.id,
      amount: slipForm.amount,
      bank: slipForm.bank,
      referenceNo: slipForm.referenceNo,
      slipImage: slipForm.slipImage
    });

    setPaymentModalData(null);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-[#E1EDF7] rounded-3xl max-w-lg w-full p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl animate-in zoom-in-95 my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E1EDF7]">
          <div>
            <h3 className="font-black text-[#2C3E50] text-sm sm:text-base">Monthly Class Tuition Fee</h3>
            <p className="text-xs text-[#357ABD] font-bold truncate max-w-[240px] sm:max-w-none">{batch.title}</p>
          </div>
          <button
            onClick={() => setPaymentModalData(null)}
            className="w-8 h-8 rounded-full bg-[#F4F8FA] border border-[#E1EDF7] text-[#2C3E50] hover:bg-[#E1EDF7] flex items-center justify-center font-bold text-sm transition"
          >
            ✕
          </button>
        </div>

        {/* Amount Summary */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F4F8FA] border border-[#E1EDF7] flex items-center justify-between gap-3">
          <div className="overflow-hidden">
            <div className="text-xs text-[#4A6572] font-medium truncate">Instructor: {instructor.name}</div>
            <div className="text-xs sm:text-sm font-bold text-[#2C3E50] truncate">{batch.code} • 1 Month Access</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[10px] sm:text-xs text-[#4A6572] font-medium">Total Fee</div>
            <div className="text-lg sm:text-xl font-black text-[#2C3E50] font-mono">LKR {batch.monthlyFee}</div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-2 bg-[#F4F8FA] p-1 rounded-2xl border border-[#E1EDF7]">
          <button
            type="button"
            onClick={() => setPaymentMode('card')}
            className={`py-2 sm:py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              paymentMode === 'card'
                ? 'bg-[#8EC5FC] text-[#2C3E50] shadow-sm border border-[#8EC5FC]'
                : 'text-[#4A6572] hover:text-[#2C3E50]'
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#6BA8E5]" />
            <span>Card Gateway</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMode('slip')}
            className={`py-2 sm:py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              paymentMode === 'slip'
                ? 'bg-[#8EC5FC] text-[#2C3E50] shadow-sm border border-[#8EC5FC]'
                : 'text-[#4A6572] hover:text-[#2C3E50]'
            }`}
          >
            <UploadCloud className="w-4 h-4 text-[#6BA8E5]" />
            <span>Bank Slip</span>
          </button>
        </div>

        {/* FORM 1: ONLINE CARD PAYMENT */}
        {paymentMode === 'card' && (
          <form onSubmit={handleCardSubmit} className="space-y-3.5 sm:space-y-4">
            <div className="p-3 rounded-xl bg-[#F4F8FA] border border-[#E1EDF7] text-xs text-[#4A6572] space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Encrypted Card Checkout</span>
              </div>
              <p className="text-[11px] text-[#4A6572]">Instant pass activation right after checkout confirmation.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C3E50] mb-1">Card Number:</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full bg-[#F4F8FA] border border-[#E1EDF7] rounded-xl px-3 py-2 text-xs text-[#2C3E50] font-mono focus:outline-none focus:border-[#8EC5FC]"
                placeholder="4532 •••• •••• 8812"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#2C3E50] mb-1">Expires:</label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="w-full bg-[#F4F8FA] border border-[#E1EDF7] rounded-xl px-3 py-2 text-xs text-[#2C3E50] font-mono focus:outline-none focus:border-[#8EC5FC]"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2C3E50] mb-1">CVC / CVV:</label>
                <input
                  type="text"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  className="w-full bg-[#F4F8FA] border border-[#E1EDF7] rounded-xl px-3 py-2 text-xs text-[#2C3E50] font-mono focus:outline-none focus:border-[#8EC5FC]"
                  placeholder="742"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#8EC5FC] hover:bg-[#6BA8E5] text-[#2C3E50] hover:text-white rounded-xl text-xs font-bold shadow-md shadow-[#8EC5FC]/25 transition flex items-center justify-center gap-2 active:scale-95 border border-[#8EC5FC]"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay LKR {batch.monthlyFee} & Unlock Pass</span>
            </button>
          </form>
        )}

        {/* FORM 2: BANK SLIP UPLOAD */}
        {paymentMode === 'slip' && (
          <form onSubmit={handleSlipSubmit} className="space-y-3.5 sm:space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#F4F8FA] border border-[#E1EDF7] text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-[#357ABD] font-bold">
                <Building2 className="w-4 h-4 text-[#6BA8E5]" />
                <span>Tuition Master's Official Bank Account</span>
              </div>
              <div className="text-[#4A6572] font-medium">
                Bank: <strong className="text-[#2C3E50]">{instructor.bankDetails?.bank || "Commercial Bank"}</strong>
              </div>
              <div className="text-[#4A6572] font-medium">
                Account Name: <strong className="text-[#2C3E50]">{instructor.bankDetails?.accountName || instructor.name}</strong>
              </div>
              <div className="text-[#4A6572] font-medium">
                Account Number: <strong className="text-[#2C3E50] font-mono text-sm">{instructor.bankDetails?.accountNumber || "8009124451"}</strong>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C3E50] mb-1">Select Deposited Bank:</label>
              <select
                value={slipForm.bank}
                onChange={(e) => setSlipForm({ ...slipForm, bank: e.target.value })}
                className="w-full bg-[#F4F8FA] border border-[#E1EDF7] rounded-xl px-3 py-2 text-xs text-[#2C3E50] focus:outline-none focus:border-[#8EC5FC]"
              >
                <option value="Commercial Bank">Commercial Bank of Ceylon</option>
                <option value="Bank of Ceylon (BOC)">Bank of Ceylon (BOC)</option>
                <option value="Sampath Bank">Sampath Bank PLC</option>
                <option value="Hatton National Bank (HNB)">Hatton National Bank (HNB)</option>
                <option value="People's Bank">People's Bank</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C3E50] mb-1">Deposit Slip Reference No:</label>
              <input
                type="text"
                placeholder="e.g. COMB-889921 or CDM-4512"
                value={slipForm.referenceNo}
                onChange={(e) => setSlipForm({ ...slipForm, referenceNo: e.target.value })}
                className="w-full bg-[#F4F8FA] border border-[#E1EDF7] rounded-xl px-3 py-2 text-xs text-[#2C3E50] font-mono focus:outline-none focus:border-[#8EC5FC]"
                required
              />
            </div>

            {/* Cloudflare R2 Slip Photo Uploader */}
            <div>
              <R2FileUploader
                folder="slips"
                accept="image/*,application/pdf"
                label="Deposit Slip Photo / ATM Receipt"
                helperText="Upload photo or PDF receipt directly to Cloudflare R2"
                isImage={true}
                currentUrl={slipForm.slipImage}
                onUploadSuccess={(res) => {
                  if (res.url) {
                    setSlipForm((prev) => ({ ...prev, slipImage: res.url }));
                  }
                }}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#8EC5FC] hover:bg-[#6BA8E5] text-[#2C3E50] hover:text-white rounded-xl text-xs font-bold shadow-md shadow-[#8EC5FC]/25 transition flex items-center justify-center gap-2 active:scale-95 border border-[#8EC5FC]"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Submit Slip for Approval</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
