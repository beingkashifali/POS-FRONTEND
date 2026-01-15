/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
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

  const token = localStorage.getItem("token");
  const cashierName = localStorage.getItem("username");

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/products", {
        headers: { Authorization: token },
      });
      setProducts(res.data.products);
    } catch (err) {
      console.error("Error fetching products");
    }
  };

  const addToCart = (product) => {
    const existing = cart.find((item) => item.productId === product._id);
    if (existing) {
      updateQuantity(product._id, 1);
    } else {
      if (product.quantity < 1) return alert("Out of stock!");
      const newCart = [
        ...cart,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image, 
          quantity: 1,
        },
      ];
      setCart(newCart);
      calculateTotal(newCart);
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
    if (newQuantity > product.quantity) {
      alert("Cannot exceed available stock!");
      return;
    }

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
    const newTotal = currentCart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(newTotal);
  };

  const handleCheckout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/sales",
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

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <div className="flex flex-1 overflow-hidden p-4 gap-6">
        <div className="flex-1 flex flex-col h-full min-w-0">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  cart={cart}
                  addToCart={addToCart}
                />
              ))}
            </div>
          </div>
        </div>

        <aside className="w-96 flex flex-col h-[93%] bg-white rounded-lg shadow-lg overflow-hidden border">
          <Cart
            cart={cart}
            total={total}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            handleCheckout={handleCheckout}
          />
        </aside>
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
