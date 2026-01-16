import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaHistory,
  FaDollarSign,
  FaFilter,
  FaUser,
  FaCalendarAlt,
  FaShoppingBag,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [filterCashier, setFilterCashier] = useState("");
  const [uniqueCashiers, setUniqueCashiers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set()); // For expandable rows

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const fetchSales = async function () {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://pos-backend-3fgf.onrender.com/sales",
        {
          headers: { Authorization: token },
        }
      );
      setSales(res.data);

      if (role === "manager") {
        const cashiers = [
          ...new Set(
            res.data
              .map((cashier) => cashier.cashierId?.username)
              .filter(Boolean)
          ),
        ];
        setUniqueCashiers(cashiers);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredSales = filterCashier
    ? sales.filter((s) => s.cashierId?.username === filterCashier)
    : sales;

  const totalRevenue = filteredSales.reduce(
    (acc, curr) => acc + curr.totalAmount,
    0
  );

  const toggleRowExpansion = (saleId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(saleId)) {
      newExpanded.delete(saleId);
    } else {
      newExpanded.add(saleId);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-cyan-50 p-4 md:p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 md:mb-8 gap-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <FaHistory className="mr-3 text-blue-600" />
            {role === "manager" ? "All Sales Records" : "My Sales History"}
          </h2>

          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 w-full lg:w-auto">
            <div className="flex items-center mb-2">
              <FaDollarSign className="text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                {role === "manager" && filterCashier === ""
                  ? "Total Store Revenue"
                  : role === "manager"
                  ? `Sales by ${filterCashier}`
                  : "My Total Sales"}
              </span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">
              ${totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>

        {role === "manager" && (
          <div className="mb-6 md:mb-8 bg-white p-4 md:p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <FaFilter className="text-blue-600 text-xl" />
                <span className="text-lg font-semibold text-gray-700">
                  Filter by Cashier:
                </span>
              </div>
              <select
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-full sm:w-auto"
                value={filterCashier}
                onChange={(e) => setFilterCashier(e.target.value)}
              >
                <option value="">All Cashiers</option>
                {uniqueCashiers.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">
                Loading sales history...
              </span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full leading-normal">
                <thead className="bg-linear-to-r from-gray-100 to-gray-200">
                  <tr>
                    <th className="px-4 md:px-6 py-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <FaCalendarAlt className="inline mr-2" />
                      Date & Time
                    </th>
                    <th className="px-4 md:px-6 py-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <FaUser className="inline mr-2" />
                      Cashier
                    </th>
                    <th className="px-4 md:px-6 py-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <FaShoppingBag className="inline mr-2" />
                      Items Sold
                    </th>
                    <th className="px-4 md:px-6 py-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <FaDollarSign className="inline mr-2" />
                      Sale Total
                    </th>
                    <th className="px-4 md:px-6 py-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.map((sale) => (
                    <React.Fragment key={sale._id}>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 md:px-6 py-5 border-b border-gray-200 bg-white text-sm font-medium text-gray-900">
                          {new Date(sale.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 md:px-6 py-5 border-b border-gray-200 bg-white text-sm">
                          <span className="bg-linear-to-r from-indigo-100 to-indigo-200 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium">
                            {sale.cashierId?.username || "Unknown"}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-5 border-b border-gray-200 bg-white text-sm text-gray-600">
                          <div className="max-w-xs">
                            {sale.products.length > 3 ? (
                              <>
                                {sale.products.slice(0, 3).map((p, idx) => (
                                  <div key={idx}>
                                    {p.name} (x{p.quantity})
                                  </div>
                                ))}
                                <span
                                  className="text-blue-600 cursor-pointer"
                                  onClick={() => toggleRowExpansion(sale._id)}
                                >
                                  {expandedRows.has(sale._id)
                                    ? "Show less..."
                                    : `+${sale.products.length - 3} more...`}
                                </span>
                              </>
                            ) : (
                              sale.products.map((p, idx) => (
                                <div key={idx}>
                                  {p.name} (x{p.quantity})
                                </div>
                              ))
                            )}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-5 border-b border-gray-200 bg-white text-sm font-bold text-green-600">
                          ${sale.totalAmount}
                        </td>
                        <td className="px-4 md:px-6 py-5 border-b border-gray-200 bg-white text-sm">
                          <button
                            onClick={() => toggleRowExpansion(sale._id)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            {expandedRows.has(sale._id) ? (
                              <FaChevronUp />
                            ) : (
                              <FaChevronDown />
                            )}
                          </button>
                        </td>
                      </tr>
                      {expandedRows.has(sale._id) && (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-4 md:px-6 py-4 bg-gray-50 border-b border-gray-200"
                          >
                            <div className="text-sm text-gray-700">
                              <strong>Full Items List:</strong>
                              <ul className="mt-2 space-y-1">
                                {sale.products.map((p, idx) => (
                                  <li
                                    key={idx}
                                    className="flex justify-between"
                                  >
                                    <span>{p.name}</span>
                                    <span>
                                      Qty: {p.quantity} | Price: ${p.price}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}

                  {filteredSales.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-12 text-gray-500"
                      >
                        <FaHistory className="mx-auto text-4xl mb-4 text-gray-300" />
                        No sales records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SalesHistory;
