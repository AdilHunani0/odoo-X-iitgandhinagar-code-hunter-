import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connect (manual connection string)
mongoose.connect("mongodb://localhost:27017/your-db-name", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Approval Schema & Model
const approvalSchema = new mongoose.Schema({
  subject: { type: String, default: "none" },
  requestOwner: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: "USD" },
}, { timestamps: true });

const Approval = mongoose.model("Approval", approvalSchema);

// Routes
app.get("/approvals", async (req, res) => {
  const approvals = await Approval.find();
  res.json(approvals);
});

app.post("/approvals", async (req, res) => {
  const approval = new Approval(req.body);
  await approval.save();
  res.json(approval);
});

app.put("/approvals/:id", async (req, res) => {
  const { id } = req.params;
  const approval = await Approval.findByIdAndUpdate(id, req.body, { new: true });
  res.json(approval);
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Manager server running on port ${PORT}`));