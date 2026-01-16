/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaFilter, FaStore } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import InvoiceModal from "../components/InvoiceModel";
import Cart from "../components/Cart";

const POS = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [showInvoice, setShowInvoice] = useState(false);
  const [lastSale, setLastSale] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const cashierName = localStorage.getItem("username");

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const res = await axios.get(
        "https://pos-backend-3fgf.onrender.com/products",
        { headers: { Authorization: token } }
      );
      setProducts(res.data.products);
    } catch (err) {
      console.error("Error fetching products");
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existing = cart.find((item) => item.productId === product._id);
    if (existing) {
      updateQuantity(product._id, 1);
    } else {
      if (product.quantity < 1) return;
      setCart([
        ...cart,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ]);
      calculateTotal([
        ...cart,
        { productId: product._id, price: product.price, quantity: 1 },
      ]);
    }
  };

  const updateQuantity = (productId, delta) => {
    const product = products.find((p) => p._id === productId);
    const existing = cart.find((item) => item.productId === productId);
    if (!existing) return;
    const newQuantity = existing.quantity + delta;
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    if (newQuantity > product.quantity) return;
    const newCart = cart.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(newCart);
    calculateTotal(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter((item) => item.productId !== productId);
    setCart(newCart);
    calculateTotal(newCart);
  };

  const calculateTotal = (currentCart) => {
    setTotal(
      currentCart.reduce((acc, item) => acc + item.price * item.quantity, 0)
    );
  };

  const handleCheckout = async () => {
    try {
      const res = await axios.post(
        "https://pos-backend-3fgf.onrender.com/sales",
        { products: cart, totalAmount: total },
        { headers: { Authorization: token } }
      );
      setLastSale({ ...res.data.sale, items: cart });
      setShowInvoice(true);
      setCart([]);
      setTotal(0);
      fetchProducts();
    } catch (err) {
      alert("Checkout Failed");
    }
  };

  const categories = [...new Set(products.map((p) => p.category))];
  const filteredProducts = products.filter(
    (p) =>
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === "" || p.category === selectedCategory)
  );

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50 font-sans">
      {/* LEFT: PRODUCTS */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-8 py-6 pb-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Point of Sale
              </h1>
              <p className="text-slate-500 text-sm">
                Manage transactions efficiently
              </p>
            </div>
            <div className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
              <FaStore className="inline mr-2 text-blue-500" /> {cashierName}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative min-w-45">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                className="w-full pl-10 pr-8 py-3 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer shadow-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
          {loading ? (
            <div className="loader-container h-full">
              <div className="loader"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  cart={cart}
                  addToCart={addToCart}
                />
              ))}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400">
              <p>No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: CART */}
      <div className="w-95 z-20 h-full">
        <Cart
          cart={cart}
          total={total}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          handleCheckout={handleCheckout}
          loading={loading}
        />
      </div>

      <InvoiceModal
        showInvoice={showInvoice}
        lastSale={lastSale}
        cashierName={cashierName}
        setShowInvoice={setShowInvoice}
      />
    </div>
  );
};

export default POS;
