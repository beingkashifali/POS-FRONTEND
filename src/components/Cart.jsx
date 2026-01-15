import React from "react";

const Cart = ({
  cart,
  total,
  removeFromCart,
  updateQuantity,
  handleCheckout,
}) => {
  return (
    <div className="col-span-4 flex flex-col h-full">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex-1 flex flex-col overflow-hidden">
        <h3 className="text-xl font-bold mb-4 border-b pb-2">Items In Cart</h3>

        <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div
                key={item.productId}
                className="flex flex-col bg-gray-50 p-3 rounded hover:bg-gray-100 border border-gray-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      ${item.price} per unit
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-400 hover:text-red-600 font-bold ml-2"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center border rounded bg-white overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="px-3 py-1 hover:bg-gray-100 text-gray-600 font-bold transition"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 border-x font-semibold text-sm min-w-10 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="px-3 py-1 hover:bg-gray-100 text-gray-600 font-bold transition"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-bold text-gray-700">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-400">
              No items in cart
            </div>
          )}
        </div>

        <div className="border-t pt-4 bg-white">
          <div className="flex justify-between text-xl font-bold mb-4">
            <span>Total</span>
            <span className="text-blue-600">${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold text-lg transition disabled:bg-gray-400 shadow-md"
          >
            Complete Sale
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
