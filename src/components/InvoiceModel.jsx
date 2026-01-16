import React from "react";
import toast from "react-hot-toast";
import { FaPrint, FaCheckCircle, FaStore } from "react-icons/fa";

const InvoiceModal = function ({
  showInvoice,
  lastSale,
  cashierName,
  setShowInvoice,
}) {
  if (!showInvoice || !lastSale) return null;

  const handleClick = function () {
    setShowInvoice(false);
    toast.success("Transaction Closed");
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden transform transition-all scale-100">
        {/* Success Header */}
        <div className="bg-emerald-500 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white/20 to-transparent pointer-events-none"></div>

          {/* FIX: Corrected the closing tag and removed the garbage text */}
          <FaCheckCircle className="text-5xl mx-auto mb-3 shadow-sm rounded-full relative z-10" />

          <h2 className="text-2xl font-bold tracking-tight relative z-10">
            Payment Success!
          </h2>
          <p className="text-emerald-100 text-sm font-medium relative z-10">
            Thank you for your purchase
          </p>
        </div>

        {/* Receipt Body */}
        <div className="p-6 bg-slate-50/50">
          <div className="flex justify-between items-end border-b border-dashed border-slate-300 pb-4 mb-4 text-xs text-slate-500 uppercase tracking-wide font-semibold">
            <div>
              <span className="block text-[10px] opacity-70">Date</span>
              {new Date().toLocaleDateString()}
            </div>
            <div className="text-right">
              <span className="block text-[10px] opacity-70">Cashier</span>
              <span className="flex items-center gap-1">
                <FaStore /> {cashierName}
              </span>
            </div>
          </div>

          <div className="space-y-3 mb-6 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
            {lastSale.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-start text-sm group"
              >
                <div className="flex gap-2">
                  <span className="bg-white border border-slate-200 text-slate-600 font-bold w-6 h-6 flex items-center justify-center rounded text-xs shadow-sm">
                    {item.quantity}
                  </span>
                  <span className="text-slate-700 font-medium leading-snug">
                    {item.name}
                  </span>
                </div>
                <span className="text-slate-900 font-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Total Paid</span>
              <span className="text-2xl font-extrabold text-slate-800">
                ${lastSale.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={handleClick}
            className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-bold text-sm shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <FaPrint />
            Close & Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
