import React from "react";
import toast from "react-hot-toast";

const InvoiceModal = function ({
  showInvoice,
  lastSale,
  cashierName,
  setShowInvoice,
}) {
  if (!showInvoice || !lastSale) return null;
  const handleClick = function () {
    setShowInvoice(false);
    toast.success("Order Completed");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-96 shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-4">Invoice</h2>
        <div className="text-center text-gray-500 mb-4 text-sm">
          <p>Date: {new Date().toLocaleString()}</p>
          <p>
            Cashier:{" "}
            <span className="font-semibold text-gray-800">{cashierName}</span>
          </p>
        </div>
        <div className="border-t border-b py-4 mb-4 space-y-2 max-h-60 overflow-y-auto">
          {lastSale.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>
                {item.name} (x{item.quantity})
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold text-xl mb-6">
          <span>Total Paid</span>
          <span>${lastSale.totalAmount.toFixed(2)}</span>
        </div>
        <button
          onClick={() => handleClick()}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Close & Print
        </button>
      </div>
    </div>
  );
};

export default InvoiceModal;
