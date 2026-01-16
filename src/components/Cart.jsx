import React from "react";
import {
  FaCartShopping,
  FaTrash,
  FaMinus,
  FaPlus,
  FaMoneyBillWave,
  FaSpinner,
} from "react-icons/fa6";

const Cart = ({
  cart,
  total,
  removeFromCart,
  updateQuantity,
  handleCheckout,
  loading,
}) => {
  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 shadow-xl">
      {/* HEADER */}
      <div className="p-5 border-b border-slate-100 bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <FaCartShopping size={16} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Current Order</h2>
            <p className="text-xs text-slate-500 font-medium">
              {cart.length === 0
                ? "Ready for new sale"
                : `${cart.length} items added`}
            </p>
          </div>
        </div>
      </div>

      {/* ITEMS LIST */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 custom-scrollbar">
        {cart.length > 0 ? (
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3"
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="font-semibold text-slate-700 text-sm leading-tight line-clamp-2">
                    {item.name}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-slate-300 hover:text-red-500 transition p-1"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center bg-slate-100 rounded-lg p-1 gap-3">
                    <button
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="w-6 h-6 flex items-center justify-center bg-white text-slate-600 rounded shadow-sm hover:text-blue-600 active:scale-95 transition"
                      disabled={loading}
                    >
                      <FaMinus size={10} />
                    </button>
                    <span className="text-xs font-bold text-slate-700 w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="w-6 h-6 flex items-center justify-center bg-white text-slate-600 rounded shadow-sm hover:text-blue-600 active:scale-95 transition"
                      disabled={loading}
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400">
                      ${item.price}/ea
                    </p>
                    <p className="font-bold text-slate-800 text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60 gap-3">
            <FaCartShopping size={40} />
            <p className="text-sm font-medium">Cart is empty</p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="p-5 bg-white border-t border-slate-200 z-10">
        <div className="flex justify-between items-center mb-4">
          <span className="text-slate-500 text-sm font-medium">Subtotal</span>
          <span className="text-2xl font-extrabold text-slate-900">
            ${total.toFixed(2)}
          </span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={cart.length === 0 || loading}
          className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
            cart.length === 0
              ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
              : "bg-slate-900 hover:bg-black text-white shadow-slate-300"
          }`}
        >
          {loading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaMoneyBillWave />
          )}
          {loading ? "Processing..." : "Complete Payment"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
