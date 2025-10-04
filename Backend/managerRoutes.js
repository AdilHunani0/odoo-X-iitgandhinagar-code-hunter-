import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Approval Schema & Model (define once globally)
const approvalSchema = new mongoose.Schema({
  subject: { type: String, default: "none" },
  requestOwner: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: "USD" },
}, { timestamps: true });

const Approval = mongoose.models.Approval || mongoose.model("Approval", approvalSchema);

// Routes
router.get("/approvals", async (req, res) => {
  const approvals = await Approval.find();
  res.json(approvals);
});

router.post("/approvals", async (req, res) => {
  const approval = new Approval(req.body);
  await approval.save();
  res.json(approval);
});

router.put("/approvals/:id", async (req, res) => {
  const { id } = req.params;
  const approval = await Approval.findByIdAndUpdate(id, req.body, { new: true });
  res.json(approval);
});

export default router;