require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Tesseract = require('tesseract.js');
const { parse, format, isValid } = require('date-fns');

const app = express();

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Create uploads directory
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
}

// ==================== DATABASE CONNECTION ====================
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB Connected');
  console.log(`📊 Database: ${mongoose.connection.name}`);
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  process.exit(1);
});

// ==================== MONGOOSE SCHEMA & MODEL ====================
const expenseSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    index: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  category: {
    type: String,
    enum: {
      values: ['Meals', 'Travel', 'Office', 'Utilities', 'Other', ''],
      message: '{VALUE} is not a valid category'
    },
    default: ''
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  paidBy: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: {
      values: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer'],
      message: '{VALUE} is not a valid payment method'
    }
  },
  remarks: {
    type: String,
    default: '',
    maxlength: [500, 'Remarks cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['Draft', 'Submitted'],
      message: '{VALUE} is not a valid status'
    },
    default: 'Draft'
  },
  receiptUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes
expenseSchema.index({ employeeId: 1, createdAt: -1 });
expenseSchema.index({ status: 1 });
expenseSchema.index({ date: -1 });

// Instance methods
expenseSchema.methods.isEditable = function() {
  return this.status === 'Draft';
};

// Pre-save middleware
expenseSchema.pre('save', function(next) {
  if (this.amount) {
    this.amount = Math.round(this.amount * 100) / 100;
  }
  next();
});

const Expense = mongoose.model('Expense', expenseSchema);

// ==================== FILE UPLOAD CONFIGURATION ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'receipt-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (JPG, PNG) and PDFs are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

// ==================== OCR EXTRACTION FUNCTIONS ====================

// Mock OCR extraction
const mockOCRExtraction = () => {
  const categories = ['Meals', 'Travel', 'Office', 'Utilities'];
  const descriptions = [
    'Starbucks Coffee', 'Uber Ride', 'Office Depot', 'AT&T Bill',
    'Restaurant Bill', 'Taxi Fare', 'Printer Ink', 'Internet Service',
    'Gas Station', 'Hotel Stay', 'Amazon Purchase', 'Parking Fee'
  ];
  
  return {
    amount: (Math.random() * 500 + 20).toFixed(2),
    category: categories[Math.floor(Math.random() * categories.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    date: format(new Date(), 'yyyy-MM-dd'),
    confidence: (Math.random() * 20 + 80).toFixed(1)
  };
};

// Real OCR extraction
const extractTextFromImage = async (imagePath) => {
  try {
    console.log('🔍 Starting OCR extraction...');
    
    const result = await Tesseract.recognize(imagePath, 'eng', {
      logger: info => {
        if (info.status === 'recognizing text') {
          console.log(`OCR Progress: ${(info.progress * 100).toFixed(0)}%`);
        }
      }
    });
    
    const text = result.data.text;
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    console.log('📄 Text extracted, analyzing...');
    
    // Extract amount
    let amount = 0;
    const amountPatterns = [
      /total[:\s]*\$?\s*(\d+\.?\d{0,2})/i,
      /amount[:\s]*\$?\s*(\d+\.?\d{0,2})/i,
      /sum[:\s]*\$?\s*(\d+\.?\d{0,2})/i,
      /\$\s*(\d+\.\d{2})/,
      /(\d+\.\d{2})/
    ];
    
    for (const pattern of amountPatterns) {
      const match = text.match(pattern);
      if (match) {
        const extractedAmount = parseFloat(match[1]);
        if (extractedAmount > 0 && extractedAmount < 10000) {
          amount = extractedAmount;
          break;
        }
      }
    }
    
    // Extract and normalize date
    let extractedDate = format(new Date(), 'yyyy-MM-dd'); // Default to today
    const datePatterns = [
      /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/,
      /(\d{4}[-/]\d{1,2}[-/]\d{1,2})/,
      /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{4}/i
    ];
    
    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        const parsedDate = parse(match[0], getDateFormat(match[0]), new Date());
        if (isValid(parsedDate)) {
          extractedDate = format(parsedDate, 'yyyy-MM-dd');
          break;
        }
      }
    }
    
    // Helper function to determine date format
    function getDateFormat(dateStr) {
      if (dateStr.match(/\d{4}[-/]\d{1,2}[-/]\d{1,2}/)) return 'yyyy-MM-dd';
      if (dateStr.match(/\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/)) return 'MM-dd-yyyy';
      if (dateStr.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{4}/i)) 
        return 'MMM dd, yyyy';
      return 'yyyy-MM-dd';
    }
    
    // Extract description
    let description = '';
    const businessKeywords = [
      'restaurant', 'cafe', 'coffee', 'hotel', 'store', 'shop', 
      'market', 'gas', 'station', 'pharmacy', 'hospital', 'inn',
      'bar', 'grill', 'bistro', 'deli', 'bakery', 'pizza', 'starbucks',
      'walmart', 'target', 'costco', 'amazon', 'uber', 'lyft'
    ];
    
    for (const line of lines) {
      if (line.length < 3 || /^[\d\s\-\.\$]+$/.test(line)) continue;
      if (/receipt|invoice|bill|tax|total|subtotal|date|time/i.test(line)) continue;
      
      const hasKeyword = businessKeywords.some(keyword => 
        line.toLowerCase().includes(keyword)
      );
      
      if (hasKeyword || (line.length >= 5 && line.length <= 50)) {
        description = line;
        break;
      }
    }
    
    if (!description && lines.length > 0) {
      description = lines.find(line => 
        line.length >= 5 && line.length <= 50 && !/^[\d\s\-\.\$]+$/.test(line)
      ) || lines[0] || 'Extracted from receipt';
    }
    
    // Detect category
    let category = '';
    const categoryKeywords = {
      'Meals': [
        'restaurant', 'cafe', 'coffee', 'food', 'dining', 'lunch', 
        'dinner', 'breakfast', 'pizza', 'burger', 'grill', 'bistro',
        'starbucks', 'mcdonald', 'subway', 'chipotle', 'domino'
      ],
      'Travel': [
        'hotel', 'taxi', 'uber', 'lyft', 'flight', 'airline', 
        'bus', 'train', 'parking', 'gas', 'fuel', 'rental',
        'airport', 'airways', 'shuttle', 'inn', 'motel', 'shell', 'chevron'
      ],
      'Office': [
        'office', 'supplies', 'staples', 'printer', 'paper', 
        'pen', 'desk', 'computer', 'software', 'depot',
        'xerox', 'ink', 'toner', 'amazon', 'bestbuy'
      ],
      'Utilities': [
        'electric', 'water', 'gas', 'internet', 'phone', 
        'utility', 'bill', 'telecom', 'cable', 'power',
        'energy', 'wireless', 'mobile', 'broadband', 'att', 'verizon'
      ]
    };
    
    const lowerText = text.toLowerCase();
    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        category = cat;
        break;
      }
    }
    
    console.log('✅ OCR extraction complete');
    
    return {
      amount: amount || (Math.random() * 300 + 20).toFixed(2),
      category: category || 'Other',
      description: description || 'Extracted from receipt',
      date: extractedDate,
      extractedText: text.substring(0, 300),
      confidence: result.data.confidence || 0,
      success: true
    };
    
  } catch (error) {
    console.error('❌ OCR Error:', error.message);
    return { ...mockOCRExtraction(), success: false, error: error.message };
  }
};

// ==================== API ROUTES ====================

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Upload receipt and extract data
app.post('/api/upload', upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const receiptUrl = `/uploads/${req.file.filename}`;
    
    console.log(`📤 File uploaded: ${req.file.filename} (${(req.file.size / 1024).toFixed(2)} KB)`);
    
    let extractedData;
    if (req.file.mimetype === 'application/pdf') {
      console.log('📄 PDF detected, using mock extraction');
      extractedData = mockOCRExtraction();
    } else {
      extractedData = await extractTextFromImage(filePath);
    }
    
    res.json({
      success: true,
      receiptUrl,
      extractedData,
      fileInfo: {
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process receipt',
      details: error.message 
    });
  }
});

// Create new expense
app.post('/api/expenses', async (req, res) => {
  try {
    const { employeeId, description, category, amount, date, paidBy, remarks, status, receiptUrl } = req.body;
    
    if (!employeeId || !description || !amount || !date || !paidBy) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: employeeId, description, amount, date, paidBy' 
      });
    }
    
    const expense = new Expense({
      employeeId,
      description,
      category: category || '',
      amount: parseFloat(amount),
      date: new Date(date),
      paidBy,
      remarks: remarks || '',
      status: status || 'Draft',
      receiptUrl: receiptUrl || ''
    });
    
    await expense.save();
    console.log(`✅ Expense created: ${expense._id} - ${description} ($${amount})`);
    
    res.status(201).json({ success: true, data: expense });
    
  } catch (error) {
    console.error('Create expense error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400). грубе.json({ 
        success: false,
        error: 'Validation error',
        details: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to create expense',
      details: error.message 
    });
  }
});

// Get expenses for an employee
app.get('/api/expenses/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { status, startDate, endDate, category } = req.query;
    
    const query = { employeeId };
    if (status) query.status = status;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const expenses = await Expense.find(query).sort({ createdAt: -1 });
    
    const summary = {
      total: expenses.length,
      totalAmount: expenses.reduce((sum, exp) => sum + exp.amount, 0),
      drafted: expenses.filter(exp => exp.status === 'Draft').length,
      submitted: expenses.filter(exp => exp.status === 'Submitted').length
    };
    
    res.json({ success: true, count: expenses.length, summary, data: expenses });
    
  } catch (error) {
    console.error('Fetch expenses error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch expenses',
      details: error.message 
    });
  }
});

// Get single expense by ID
app.get('/api/expenses/detail/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }
    
    res.json({ success: true, data: expense });
    
  } catch (error) {
    console.error('Fetch expense error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch expense',
      details: error.message 
    });
  }
});

// Update expense status
app.patch('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['Draft', 'Submitted'].includes(status)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid status. Must be Draft or Submitted' 
      });
    }
    
    const expense = await Expense.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }
    
    console.log(`✅ Expense ${id} status updated to ${status}`);
    res.json({ success: true, data: expense });
    
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update expense',
      details: error.message 
    });
  }
});

// Update entire expense
app.put('/api/expenses/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }
    
    if (!expense.isEditable()) {
      return res.status(403).json({ 
        success: false,
        error: 'Cannot edit submitted expense' 
      });
    }
    
    const allowedFields = ['description', 'category', 'amount', 'date', 'paidBy', 'remarks'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        expense[field] = req.body[field];
      }
    });
    
    await expense.save();
    res.json({ success: true, data: expense });
    
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update expense',
      details: error.message 
    });
  }
});

// Delete expense
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }
    
    if (expense.receiptUrl) {
      const filePath = path.join(__dirname, expense.receiptUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Deleted receipt: ${expense.receiptUrl}`);
      }
    }
    
    await expense.deleteOne();
    console.log(`✅ Expense deleted: ${req.params.id}`);
    
    res.json({ success: true, message: 'Expense deleted successfully' });
    
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete expense',
      details: error.message 
    });
  }
});

// Get all expenses (admin)
app.get('/api/expenses', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    
    const expenses = await Expense.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Expense.countDocuments(query);
    
    res.json({
      success: true,
      count: expenses.length,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      data: expenses
    });
    
  } catch (error) {
    console.error('Fetch all expenses error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch expenses',
      details: error.message 
    });
  }
});

// ==================== ERROR HANDLING ====================
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({ 
    error: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API Endpoint: http://localhost:${PORT}/api`);
  console.log(`💾 MongoDB: ${MONGODB_URI}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(50));
});

// Example: Fetch expenses for an employee
fetch('http://localhost:5000/api/expenses/EMPLOYEE_ID')
  .then(res => res.json())
  .then(data => {
    // handle data
  });