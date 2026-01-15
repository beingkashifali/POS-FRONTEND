import React from "react";

const ProductCard = ({ product, cart, addToCart }) => {
  const cartItem = cart.find((item) => item.productId === product._id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;
  const availableStock = product.quantity - qtyInCart;

  return (
    <div
      className={`bg-white p-4 rounded-lg shadow border flex flex-col justify-between ${
        availableStock === 0 ? "opacity-50" : ""
      }`}
    >
      <div>
        {/* Product Image Layout */}
        <div className="w-full h-48 mb-4 overflow-hidden rounded-md bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <h4 className="font-bold text-lg text-gray-800">{product.name}</h4>
        <p className="text-gray-500 text-sm uppercase">{product.category}</p>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-xl font-semibold text-blue-600">
          ${product.price}
        </span>
        <span
          className={`text-sm font-bold ${
            availableStock < 5 ? "text-red-500" : "text-green-600"
          }`}
        >
          {availableStock} Left
        </span>
      </div>

      <button
        disabled={availableStock <= 0}
        onClick={() => addToCart(product)}
        className={`mt-3 w-full py-2 rounded text-white font-medium transition
          ${
            availableStock > 0
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
      >
        {availableStock > 0 ? "Add to Cart" : "Out of Stock"}
      </button>
    </div>
  );
};

export default ProductCard;
