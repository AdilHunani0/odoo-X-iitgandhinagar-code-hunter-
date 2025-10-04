import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const initialApprovers = [
  { name: "John", required: true },
  { name: "Mitchell", required: false },
  { name: "Andreas", required: false },
];

export default function AdminApprovalRules() {
  const location = useLocation();
  const adminMsg = location.state?.adminMsg || "";
  const [user] = useState("marc");
  const [manager, setManager] = useState("sarah");
  const [ruleDesc] = useState("Approval rule for miscellaneous expenses");
  const [isManagerApprover, setIsManagerApprover] = useState(false);
  const [approvers, setApprovers] = useState(initialApprovers);
  const [sequence, setSequence] = useState(false);
  const [minApproval, setMinApproval] = useState("");

  // Handler for required checkbox
  const toggleRequired = (idx) => {
    setApprovers((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, required: !a.required } : a))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex flex-col items-center py-10 px-3">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-9">
        {/* Show admin login message if present */}
        {adminMsg && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-center font-semibold">
            {adminMsg}
          </div>
        )}
        <h1 className="text-2xl font-bold mb-8 text-indigo-700 tracking-tight">Admin View (Approval rules)</h1>
        <div className="mb-6">
          <div className="mb-2">
            <span className="font-medium text-gray-700 mr-3">User:</span>
            <span className="bg-indigo-100 px-3 py-1 rounded-lg font-semibold text-indigo-600">{user}</span>
          </div>
          <div className="mb-2 text-gray-500">Description about rules</div>
          <div className="mb-4 flex items-center gap-2">
            <span className="font-semibold text-lg">{ruleDesc}</span>
          </div>
          <div className="mb-2">
            <span className="font-medium text-gray-700 mr-3">Manager:</span>
            <select
              className="bg-indigo-50 px-3 py-1 rounded-lg border"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
            >
              <option value="sarah">Sarah</option>
              <option value="marc">Marc</option>
              {/* Dynamically load other managers if needed */}
            </select>
            <span className="ml-3 text-xs text-gray-400 italic">Dynamic dropdown (can be changed if needed)</span>
          </div>
        </div>
        <div className="border rounded-xl p-5 bg-gray-50 shadow mb-5">
          <div className="flex items-center mb-4 gap-4">
            <label className="font-medium text-gray-700 flex-1">Is manager an approver?</label>
            <input
              type="checkbox"
              checked={isManagerApprover}
              onChange={() => setIsManagerApprover(!isManagerApprover)}
              className="w-5 h-5 accent-indigo-500"
            />
            <span className="text-xs text-green-700 ml-2">
              (If checked, requests go to manager first before other approvers.)
            </span>
          </div>
          <div className="">
            <table className="w-full rounded-lg overflow-hidden mb-3">
              <thead className="bg-indigo-200">
                <tr>
                  <th className="py-2 px-4 text-left text-indigo-700 font-bold">#</th>
                  <th className="py-2 px-4 text-left text-indigo-700 font-bold">User</th>
                  <th className="py-2 px-4 text-left text-indigo-700 font-bold">Required</th>
                </tr>
              </thead>
              <tbody>
                {approvers.map((approver, idx) => (
                  <tr key={idx} className="even:bg-indigo-50">
                    <td className="py-2 px-4">{idx + 1}</td>
                    <td className="py-2 px-4">{approver.name}</td>
                    <td className="py-2 px-4">
                      <input
                        type="checkbox"
                        checked={approver.required}
                        onChange={() => toggleRequired(idx)}
                        className="w-5 h-5 accent-indigo-600"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <span className="text-xs text-gray-400">
              (If required is checked, this approver must approve in all scenarios)
            </span>
          </div>
          <div className="flex items-center mt-4 gap-4">
            <input
              type="checkbox"
              checked={sequence}
              onChange={() => setSequence(!sequence)}
              className="w-5 h-5 accent-indigo-500"
            />
            <span className="font-medium text-gray-700 flex-1">Approvers Sequence</span>
          </div>
          <div className="text-xs text-gray-500 mt-2 ml-7">
            {`If checked, requests are sent to approvers in order (if 1 rejects, request is rejected). If unchecked, all approvers process the request in parallel.`}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <label className="font-medium text-gray-700">Minimum Approval percentage:</label>
          <input
            type="number"
            min="0"
            max="100"
            value={minApproval}
            onChange={(e) => setMinApproval(e.target.value)}
            className="w-20 p-2 border rounded-lg bg-blue-50 text-right"
            placeholder="%"
          />
        </div>
      </div>
    </div>
  );
}
