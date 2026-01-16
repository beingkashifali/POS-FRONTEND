import React from "react";
import {
  FaCartPlus,
  FaBoxOpen,
  FaCircleExclamation,
  FaBox,
} from "react-icons/fa6"; // Added FaBox

const ProductCard = ({ product, cart, addToCart }) => {
  const cartItem = cart.find((item) => item.productId === product._id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;
  const availableStock = product.quantity - qtyInCart;
  const isOutOfStock = availableStock <= 0;
  const isLowStock = availableStock < 5 && availableStock > 0;

  return (
    <div className="group flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-300 overflow-hidden">
      {/* IMAGE CONTAINER */}
      <div className="relative h-48 w-full p-6 flex items-center justify-center bg-white border-b border-slate-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 ${
              isOutOfStock ? "grayscale opacity-30" : ""
            }`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-300">
            <FaBoxOpen className="text-4xl mb-2 opacity-50" />
            <span className="text-[10px] uppercase font-bold tracking-wider">
              No Image
            </span>
          </div>
        )}

        {/* --- MODIFIED SECTION: STATUS BADGES --- */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
          {/* Always show current stock */}
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded border ${
              availableStock > 0
                ? "bg-blue-50 text-blue-700 border-blue-100"
                : "bg-slate-100 text-slate-500 border-slate-200"
            }`}
          >
            <FaBox /> Stock: {availableStock}
          </span>

          {isLowStock && (
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-1 rounded border border-amber-100">
              <FaCircleExclamation /> Low
            </span>
          )}
        </div>
        {/* --------------------------------------- */}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <span className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* CARD BODY */}
      <div className="flex flex-col flex-1 p-4">
        <div className="mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {product.category}
          </span>
          <h3
            className="text-slate-800 font-semibold text-sm leading-snug line-clamp-2 h-10"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900">
            ${Number(product.price).toFixed(2)}
          </span>

          <button
            disabled={isOutOfStock}
            onClick={() => addToCart(product)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
              isOutOfStock
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white active:bg-blue-700"
            }`}
          >
            <FaCartPlus />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
