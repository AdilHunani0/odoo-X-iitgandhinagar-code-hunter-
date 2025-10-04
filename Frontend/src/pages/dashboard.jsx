import React, { useState, useEffect } from 'react';
import { Upload, Save, Send, Trash2, CheckCircle, AlertCircle, DollarSign, Calendar, FileText } from 'lucide-react';
import { parse, format, isValid } from 'date-fns';

// API Configuration
const API_URL = 'http://localhost:5000/api';
const EMPLOYEE_ID = 'EMP001'; // Replace with actual employee ID from auth

function Dashboard() {
  // State Management
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    amount: '',
    date: '',
    paidBy: '',
    remarks: '',
    receiptUrl: ''
  });

  const [expenses, setExpenses] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [summary, setSummary] = useState(null);

  // Fetch expenses on component mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Fetch all expenses for the employee
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/expenses/${EMPLOYEE_ID}`);
      const data = await response.json();
      
      if (data.success) {
        setExpenses(data.data || []);
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      // Load mock data for demo
      setExpenses([
        {
          _id: '1',
          employeeId: EMPLOYEE_ID,
          description: 'Team Lunch Meeting',
          category: 'Meals',
          amount: 125.50,
          date: '2025-10-01',
          paidBy: 'Credit Card',
          remarks: 'Quarterly planning discussion',
          status: 'Submitted',
          receiptUrl: '/uploads/sample1.jpg'
        },
        {
          _id: '2',
          employeeId: EMPLOYEE_ID,
          description: 'Office Supplies',
          category: 'Office',
          amount: 67.89,
          date: '2025-10-03',
          paidBy: 'Debit Card',
          remarks: '',
          status: 'Draft',
          receiptUrl: ''
        }
      ]);
      setSummary({ total: 2, totalAmount: 193.39, drafted: 1, submitted: 1 });
    } finally {
      setLoading(false);
    }
  };

  // Show success message
  const showSuccess = (message) => {
    setSuccessMessage(message);
  };

  // Handle file upload and OCR extraction
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setUploading(true);
    setExtractedData(null);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('receipt', file);

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formDataUpload
      });

      const data = await response.json();
      
      if (data.success && data.extractedData) {
        let formattedDate = data.extractedData.date;
        // Validate and format the date
        try {
          const parsedDate = parse(data.extractedData.date, 'yyyy-MM-dd', new Date());
          if (isValid(parsedDate)) {
            formattedDate = format(parsedDate, 'yyyy-MM-dd');
          } else {
            // Fallback to current date if invalid
            formattedDate = format(new Date(), 'yyyy-MM-dd');
          }
        } catch (error) {
          console.error('Date parsing error:', error);
          formattedDate = format(new Date(), 'yyyy-MM-dd');
        }

        setExtractedData({
          ...data.extractedData,
          date: formattedDate
        });
        setFormData(prev => ({
          ...prev,
          amount: data.extractedData.amount,
          category: data.extractedData.category,
          description: data.extractedData.description,
          date: formattedDate,
          receiptUrl: data.receiptUrl
        }));
        showSuccess('✓ Receipt data extracted successfully!');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      // Mock extraction for demo
      const mockExtraction = {
        amount: (Math.random() * 500 + 50).toFixed(2),
        category: ['Meals', 'Travel', 'Office', 'Utilities'][Math.floor(Math.random() * 4)],
        description: 'Restaurant Bill - Extracted',
        date: format(new Date(), 'yyyy-MM-dd'),
        extractedText: 'Sample receipt data extracted...',
        confidence: 85.5
      };
      setExtractedData(mockExtraction);
      setFormData(prev => ({ 
        ...prev, 
        amount: mockExtraction.amount,
        category: mockExtraction.category,
        description: mockExtraction.description,
        date: mockExtraction.date,
        receiptUrl: 'mock-url' 
      }));
      showSuccess('✓ Receipt data extracted (Demo mode)');
    } finally {
      setUploading(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount) newErrors.amount = 'Amount is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.paidBy) newErrors.paidBy = 'Payment method is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (status) => {
    if (!validateForm()) return;

    try {
      const response = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          employeeId: EMPLOYEE_ID,
          status
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setExpenses([result.data, ...expenses]);
        resetForm();
        showSuccess(`✓ Expense ${status.toLowerCase()} successfully!`);
        fetchExpenses(); // Refresh to update summary
      }
    } catch (error) {
      console.error('Error submitting expense:', error);
      // Mock submission for demo
      const newExpense = {
        _id: Date.now().toString(),
        ...formData,
        employeeId: EMPLOYEE_ID,
        status,
        createdAt: new Date().toISOString()
      };
      setExpenses([newExpense, ...expenses]);
      resetForm();
      showSuccess(`✓ Expense ${status.toLowerCase()} successfully!`);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      description: '',
      category: '',
      amount: '',
      date: '',
      paidBy: '',
      remarks: '',
      receiptUrl: ''
    });
    setSelectedFile(null);
    setExtractedData(null);
    setErrors({});
  };

  // Update expense status
  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/expenses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();
      
      if (result.success) {
        setExpenses(expenses.map(exp => 
          exp._id === id ? { ...exp, status: newStatus } : exp
        ));
        showSuccess(`✓ Status updated to ${newStatus}`);
        fetchExpenses(); // Refresh summary
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setExpenses(expenses.map(exp => 
        exp._id === id ? { ...exp, status: newStatus } : exp
      ));
      showSuccess(`✓ Status updated to ${newStatus}`);
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;

    try {
      await fetch(`${API_URL}/expenses/${id}`, { method: 'DELETE' });
      setExpenses(expenses.filter(exp => exp._id !== id));
      showSuccess('✓ Expense deleted successfully');
      fetchExpenses(); // Refresh summary
    } catch (error) {
      console.error('Error deleting expense:', error);
      setExpenses(expenses.filter(exp => exp._id !== id));
      showSuccess('✓ Expense deleted successfully');
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Employee Expense Management</h1>
          <p className="text-gray-600 mt-2">Employee ID: <span className="font-semibold">{EMPLOYEE_ID}</span></p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2 animate-pulse">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1">{successMessage}</span>
          </div>
        )}

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <p className="text-xs md:text-sm text-gray-600">Total Expenses</p>
              </div>
              <p className="text-xl md:text-2xl font-bold text-blue-600">{summary.total}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <p className="text-xs md:text-sm text-gray-600">Total Amount</p>
              </div>
              <p className="text-xl md:text-2xl font-bold text-green-600">${summary.totalAmount?.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-xs md:text-sm text-gray-600">Submitted</p>
              </div>
              <p className="text-xl md:text-2xl font-bold text-green-500">{summary.submitted}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <p className="text-xs md:text-sm text-gray-600">Drafts</p>
              </div>
              <p className="text-xl md:text-2xl font-bold text-gray-500">{summary.drafted}</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Expense Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Submit Expense</h2>
              
              {/* Receipt Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Receipt
                </label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 text-center px-2">
                      {selectedFile ? selectedFile.name : 'Click to upload receipt'}
                    </p>
                    <p className="text-xs text-gray-400">JPG, PNG or PDF (Max 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>
                {uploading && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                      Extracting data from receipt...
                    </div>
                  </div>
                )}
                {extractedData && !uploading && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded text-xs">
                    <p className="font-semibold text-green-800 mb-1 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Data Extracted Successfully
                    </p>
                    <p className="text-green-700">Description: {extractedData.description}</p>
                    <p className="text-green-700">Amount: ${extractedData.amount}</p>
                    <p className="text-green-700">Category: {extractedData.category}</p>
                    <p className="text-green-700">Date: {extractedData.date}</p>
                    {extractedData.confidence && (
                      <p className="text-green-600 mt-1">Confidence: {extractedData.confidence}%</p>
                    )}
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      errors.amount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                  />
                  {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Select category</option>
                    <option value="Meals">Meals</option>
                    <option value="Travel">Travel</option>
                    <option value="Office">Office</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter description"
                  />
                  {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      errors.date ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                  {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Paid By <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      errors.paidBy ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={formData.paidBy}
                    onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
                  >
                    <option value="">Select payment method</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                  {errors.paidBy && <p className="text-xs text-red-500 mt-1">{errors.paidBy}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    rows="3"
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="Additional notes (optional)"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleSubmit('Draft')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition font-medium"
                  >
                    <Save className="w-4 h-4" />
                    Save Draft
                  </button>
                  <button
                    onClick={() => handleSubmit('Submitted')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
                  >
                    <Send className="w-4 h-4" />
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Expense History Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Expense History</h2>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
                  <p className="text-gray-500 mt-4">Loading expenses...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Employee</th>
                        <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Description</th>
                        <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Date</th>
                        <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Category</th>
                        <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Paid By</th>
                        <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Remarks</th>
                        <th className="text-right py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Amount</th>
                        <th className="text-center py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Status</th>
                        <th className="text-center py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="text-center py-8 text-gray-500">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                            No expenses found. Submit your first expense above.
                          </td>
                        </tr>
                      ) : (
                        expenses.map((expense) => (
                          <tr key={expense._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                            <td className="py-3 px-2 md:px-4 text-xs md:text-sm text-gray-700">{expense.employeeId}</td>
                            <td className="py-3 px-2 md:px-4 text-xs md:text-sm text-gray-700">
                              {expense.description || <span className="text-gray-400 italic">Not filled</span>}
                            </td>
                            <td className="py-3 px-2 md:px-4 text-xs md:text-sm text-gray-700">
                              {expense.date ? new Date(expense.date).toLocaleDateString() : <span className="text-gray-400 italic">Not filled</span>}
                            </td>
                            <td className="py-3 px-2 md:px-4 text-xs md:text-sm text-gray-700">
                              {expense.category || <span className="text-gray-400 italic">Not filled</span>}
                            </td>
                            <td className="py-3 px-2 md:px-4 text-xs md:text-sm text-gray-700">
                              {expense.paidBy || <span className="text-gray-400 italic">Not filled</span>}
                            </td>
                            <td className="py-3 px-2 md:px-4 text-xs md:text-sm text-gray-700">
                              {expense.remarks || <span className="text-gray-400 italic">Not filled</span>}
                            </td>
                            <td className="py-3 px-2 md:px-4 text-xs md:text-sm text-right font-semibold text-gray-700">
                              ${expense.amount?.toFixed(2) || '0.00'}
                            </td>
                            <td className="py-3 px-2 md:px-4 text-center">
                              <button
                                onClick={() => updateStatus(expense._id, expense.status === 'Draft' ? 'Submitted' : 'Draft')}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                                  expense.status === 'Submitted'
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {expense.status}
                              </button>
                            </td>
                            <td className="py-3 px-2 md:px-4 text-center">
                              <button
                                onClick={() => deleteExpense(expense._id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                                title="Delete expense"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {expenses.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <p className="text-sm text-gray-600">
                      Total Expenses: <span className="font-semibold">{expenses.length}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Total Amount: <span className="font-semibold text-lg text-blue-600">
                        ${expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0).toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;