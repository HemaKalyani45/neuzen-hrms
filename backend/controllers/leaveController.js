const LeaveRequest = require('../models/LeaveRequest');
const { initialLeaves } = require('../utils/seedData');

let memoryLeaves = [...initialLeaves];

const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, totalDays, reason, employeeId, employeeName } = req.body;
    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ success: false, message: 'Please complete all required fields.' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newLeave = {
      _id: `lve_${Date.now()}`,
      employeeId: employeeId || 'emp1',
      employeeName: employeeName || req.user?.name || 'Alex Rivera',
      leaveType,
      startDate,
      endDate,
      totalDays: totalDays || calculatedDays || 1,
      reason,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0]
    };

    try {
      const dbLeave = new LeaveRequest(newLeave);
      await dbLeave.save();
    } catch (e) {}

    memoryLeaves.unshift(newLeave);

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully. Pending HR review.',
      data: newLeave
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getLeaves = async (req, res) => {
  try {
    let leaves = [];
    try {
      leaves = await LeaveRequest.find().sort({ appliedOn: -1 });
    } catch (e) {
      leaves = memoryLeaves;
    }
    if (!leaves || leaves.length === 0) {
      leaves = memoryLeaves;
    }
    res.json({ success: true, count: leaves.length, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comments, approvedBy } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be Approved or Rejected' });
    }

    let updated = null;
    try {
      updated = await LeaveRequest.findByIdAndUpdate(
        id, 
        { status, comments, approvedBy: approvedBy || req.user?.name || 'Sarah Connor (HR Lead)' },
        { new: true }
      );
    } catch (e) {}

    const index = memoryLeaves.findIndex(l => l._id === id);
    if (index !== -1) {
      memoryLeaves[index].status = status;
      if (comments) memoryLeaves[index].comments = comments;
      memoryLeaves[index].approvedBy = approvedBy || req.user?.name || 'Sarah Connor (HR Lead)';
      updated = memoryLeaves[index];
    }

    res.json({
      success: true,
      message: `Leave request has been ${status.toLowerCase()}`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await LeaveRequest.findByIdAndDelete(id);
    } catch (e) {}
    memoryLeaves = memoryLeaves.filter(l => l._id !== id);
    res.json({ success: true, message: 'Leave request cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  applyLeave,
  getLeaves,
  updateLeaveStatus,
  deleteLeave,
  memoryLeaves
};
