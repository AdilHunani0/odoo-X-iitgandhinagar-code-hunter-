import React from "react";
import { useNavigate } from "react-router-dom";

const users = [
  {
    user: "marc",
    role: "Manager",
    manager: "sarah",
    email: "marc@gmail.com",
  },
  {
    user: "",
    role: "Employee",
    manager: "",
    email: "",
  },
];

const UserTable = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-16">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl px-0 py-10">
        <div className="flex items-center justify-between px-10 mb-4">
          <button
            onClick={() => navigate("/admin-view")}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-lg shadow-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition"
          >
            New
          </button>
          <span className="text-xs text-gray-500 italic">Click 'New' to add user</span>
        </div>
        <table className="w-full border-separate border-spacing-0 text-base">
          <thead>
            <tr className="bg-indigo-100">
              <th className="border-b-2 border-indigo-300 py-3 px-6 font-semibold text-indigo-700">User</th>
              <th className="border-b-2 border-indigo-300 py-3 px-6 font-semibold text-indigo-700">Role</th>
              <th className="border-b-2 border-indigo-300 py-3 px-6 font-semibold text-indigo-700">Manager</th>
              <th className="border-b-2 border-indigo-300 py-3 px-6 font-semibold text-indigo-700">Email</th>
              <th className="border-b-2 border-indigo-300 py-3 px-6 font-semibold text-indigo-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((row, idx) => (
              <tr
                key={idx}
                className={`${
                  idx === 0 ? "bg-blue-50" : "bg-white"
                } hover:bg-indigo-50 transition`}
              >
                <td className="py-4 px-6 border-b border-indigo-200 text-lg">
                  {row.user ? (
                    <strong>{row.user}</strong>
                  ) : (
                    <span className="text-gray-400 italic">-</span>
                  )}
                </td>
                <td className="py-4 px-6 border-b border-indigo-200 text-lg">
                  {row.role}
                </td>
                <td className="py-4 px-6 border-b border-indigo-200 text-lg">
                  {row.manager ? (
                    <span className="bg-indigo-100 px-3 py-1 rounded-lg text-indigo-700 font-medium">
                      {row.manager}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">-</span>
                  )}
                </td>
                <td className="py-4 px-6 border-b border-indigo-200 text-lg">
                  {row.email ? (
                    <span className="text-indigo-700">{row.email}</span>
                  ) : (
                    <>
                      <span className="text-gray-400 italic">-</span>
                    </>
                  )}
                </td>
                <td className="py-4 px-6 border-b border-indigo-200">
                  {row.user && row.email ? (
                    <button
                      className="px-5 py-2 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold shadow hover:from-green-500 hover:to-blue-600"
                      onClick={() => alert("Password sent to user! (demo)")}
                    >
                      Send password
                    </button>
                  ) : (
                    <span className="text-gray-200">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-sm text-gray-600 mt-6 px-10">
          <span className="font-semibold">Note:</span> Clicking "Send password" will send a randomly generated password to the user's email, with instructions to change it afterwards.
        </div>
      </div>
    </div>
  );
};

export default UserTable;
