import React, { useState } from "react";

export default function Manager() {
  // Manually added expense data
  const [expenses, setExpenses] = useState([
    {
      employeeId: "EMP001",
      description: "Starbucks Coffee",
      category: "Meals",
      amount: 200,
      date: "3140-02-02T00:00:00.000+00:00",
      paidBy: "Cash",
      remarks: "",
      status: "Submitted",
      receiptUrl: "/uploads/receipt-1759565995060-765665566.jpg",
      createdAt: "2025-10-04T08:20:12.530+00:00",
      updatedAt: "2025-10-04T08:20:12.530+00:00"
    }
  ]);

  // Approve / Reject handler
  const handleStatusChange = (index, newStatus) => {
    const updatedExpenses = [...expenses];
    updatedExpenses[index].status = newStatus;
    setExpenses(updatedExpenses);
    alert(`Expense ${newStatus}!`);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Manager Dashboard - Expenses
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 text-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Paid By</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Receipt</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp, index) => (
                <tr
                  key={exp.employeeId + exp.createdAt}
                  className="hover:bg-gray-50 transition-all"
                >
                  <td className="border border-gray-300 px-4 py-2">{exp.description}</td>
                  <td className="border border-gray-300 px-4 py-2">{exp.category}</td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold text-green-600">
                    ₹{exp.amount}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {exp.date ? new Date(exp.date).toLocaleDateString() : ""}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{exp.paidBy}</td>
                  <td
                    className={`border border-gray-300 px-4 py-2 font-medium ${
                      exp.status === "Submitted"
                        ? "text-green-600"
                        : exp.status === "Rejected"
                        ? "text-red-500"
                        : "text-yellow-600"
                    }`}
                  >
                    {exp.status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {exp.receiptUrl ? (
                      <a
                        href={`http://localhost:5000${exp.receiptUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline hover:text-blue-700"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-500">No Receipt</span>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleStatusChange(index, "Approved")}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(index, "Rejected")}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
