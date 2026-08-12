const Department = require('../models/Department');
const { memoryEmployees } = require('./employeeController');
const { initialDepartments } = require('../utils/seedData');

let memoryDepartments = [...initialDepartments];

const getDepartments = async (req, res) => {
  try {
    let depts = [];
    try {
      depts = await Department.find();
    } catch (e) {
      depts = memoryDepartments;
    }
    if (!depts || depts.length === 0) {
      depts = memoryDepartments;
    }

    // Calculate dynamic live employee count per department matching memoryEmployees 100%
    const syncDepts = depts.map(d => {
      const realCount = memoryEmployees.filter(e => e.departmentName === d.departmentName).length;
      return {
        ...d,
        employeeCount: realCount
      };
    });

    res.json({ success: true, count: syncDepts.length, data: syncDepts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createDepartment = async (req, res) => {
  try {
    const { departmentName, managerName, description } = req.body;
    if (!departmentName) {
      return res.status(400).json({ success: false, message: 'Department name is required' });
    }

    const newDept = {
      _id: `dept_${Date.now()}`,
      departmentName,
      managerName: managerName || 'Unassigned',
      employeeCount: 0,
      description: description || 'Department operational unit'
    };

    try {
      const dbDept = new Department(newDept);
      await dbDept.save();
    } catch (e) {}

    memoryDepartments.push(newDept);

    res.status(201).json({ success: true, message: 'Department created successfully', data: newDept });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    let updated = null;
    try {
      updated = await Department.findByIdAndUpdate(id, updateData, { new: true });
    } catch (e) {}

    const index = memoryDepartments.findIndex(d => d._id === id);
    if (index !== -1) {
      memoryDepartments[index] = { ...memoryDepartments[index], ...updateData };
      updated = memoryDepartments[index];
    }

    res.json({ success: true, message: 'Department updated', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Department.findByIdAndDelete(id);
    } catch (e) {}

    memoryDepartments = memoryDepartments.filter(d => d._id !== id);

    res.json({ success: true, message: 'Department deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  memoryDepartments
};
