// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function Dashboard() {
//   const [sales, setSales] = useState([]);
//   const [products, setProducts] = useState([]);

//   const fetchData = async function () {
//     const token = localStorage.getItem("token");
//     const salesData = await axios.get("http://localhost:8000/sales", {
//       headers: { Authorization: token },
//     });
//     const productsData = await axios.get("http://localhost:8000/products", {
//       headers: { Authorization: token },
//     });
//     setSales(salesData.data);
//     setProducts(productsData.data.products);
//   };

//   useEffect(() => {
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     fetchData();
//   }, []);

//   const today = new Date().toDateString();
//   const todaySales = sales
//     .filter((sale) => new Date(sale.createdAt).toDateString() === today)
//     .reduce((acc, curr) => acc + curr.totalAmount, 0);
//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Card 1 */}
//         <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
//           <h3 className="text-gray-500 text-sm font-medium uppercase">
//             Total Sales Today
//           </h3>
//           <p className="text-3xl font-bold text-gray-800 mt-2">${todaySales}</p>
//         </div>

//         {/* Card 2 */}
//         <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
//           <h3 className="text-gray-500 text-sm font-medium uppercase">
//             Total Products
//           </h3>
//           <p className="text-3xl font-bold text-gray-800 mt-2">
//             {products.length}
//           </p>
//         </div>

//         {/* Card 3 */}
//         <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
//           <h3 className="text-gray-500 text-sm font-medium uppercase">
//             Total Transactions
//           </h3>
//           <p className="text-3xl font-bold text-gray-800 mt-2">
//             {sales.length}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);

  const userRole = localStorage.getItem("role");

  const fetchData = async function () {
    const token = localStorage.getItem("token");
    try {
      const salesData = await axios.get("http://localhost:8000/sales", {
        headers: { Authorization: token },
      });
      const productsData = await axios.get("http://localhost:8000/products", {
        headers: { Authorization: token },
      });
      setSales(salesData.data);
      setProducts(productsData.data.products);
    } catch (err) {
      console.log("Error fetching dashboard data", err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const today = new Date().toDateString();
  const todaySales = sales
    .filter((sale) => new Date(sale.createdAt).toDateString() === today)
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  // 2. Determine labels based on role
  const isManager = userRole === "manager";

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {isManager ? "Manager Dashboard" : "Cashier Dashboard"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-medium uppercase">
            {isManager ? "Total Store Sales Today" : "My Sales Today"}
          </h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            ${todaySales.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-medium uppercase">
            Total Products
          </h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {products.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <h3 className="text-gray-500 text-sm font-medium uppercase">
            {isManager ? "Total Store Transactions" : "My Total Transactions"}
          </h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {sales.length}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
