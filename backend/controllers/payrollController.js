const Payroll = require('../models/Payroll');
const { initialPayroll } = require('../utils/seedData');

let memoryPayroll = [
  {
    _id: 'pay1',
    employeeId: 'emp1',
    employeeCode: 'NZ-1001',
    employeeName: 'Alex Rivera',
    designation: 'Senior Full Stack Engineer',
    department: 'Engineering & AI',
    month: 'August',
    year: 2026,
    basicSalary: 57000,
    hra: 22800,
    medicalAllowance: 5000,
    specialAllowance: 10200,
    bonus: 5000,
    pfDeduction: 6840,
    taxDeduction: 5200,
    leaveDeduction: 0,
    lateDeduction: 0,
    netSalary: 87960,
    paymentStatus: 'Paid',
    processedBy: 'Sarah Connor (HR Manager)',
    queryStatus: 'Query Raised',
    adminQueryText: 'Admin Notice: Please verify HRA calculation and tax deduction breakdown before finalizing Q3 report.',
    queryDate: '2026-08-11',
    hrResolutionNote: null
  },
  {
    _id: 'pay2',
    employeeId: 'emp2',
    employeeCode: 'NZ-1002',
    employeeName: 'Sarah Connor',
    designation: 'HR Lead Manager',
    department: 'Human Resources',
    month: 'August',
    year: 2026,
    basicSalary: 52800,
    hra: 21120,
    medicalAllowance: 5000,
    specialAllowance: 9080,
    bonus: 3000,
    pfDeduction: 6336,
    taxDeduction: 4500,
    leaveDeduction: 0,
    lateDeduction: 0,
    netSalary: 80164,
    paymentStatus: 'Paid',
    processedBy: 'Sarah Connor (HR Manager)',
    queryStatus: 'No Query',
    adminQueryText: null,
    hrResolutionNote: null
  },
  {
    _id: 'pay3',
    employeeId: 'emp3',
    employeeCode: 'NZ-1003',
    employeeName: 'Michael Chen',
    designation: 'Lead UI/UX Designer',
    department: 'Product & Design',
    month: 'August',
    year: 2026,
    basicSalary: 46800,
    hra: 18720,
    medicalAllowance: 5000,
    specialAllowance: 7480,
    bonus: 2000,
    pfDeduction: 5616,
    taxDeduction: 3800,
    leaveDeduction: 0,
    lateDeduction: 0,
    netSalary: 70584,
    paymentStatus: 'Paid',
    processedBy: 'Sarah Connor (HR Manager)',
    queryStatus: 'No Query',
    adminQueryText: null,
    hrResolutionNote: null
  },
  {
    _id: 'pay4',
    employeeId: 'emp4',
    employeeCode: 'NZ-1004',
    employeeName: 'Priya Sharma',
    designation: 'AI ML Specialist',
    department: 'Engineering & AI',
    month: 'August',
    year: 2026,
    basicSalary: 49200,
    hra: 19680,
    medicalAllowance: 5000,
    specialAllowance: 8120,
    bonus: 2500,
    pfDeduction: 5904,
    taxDeduction: 4100,
    leaveDeduction: 0,
    lateDeduction: 0,
    netSalary: 74496,
    paymentStatus: 'Paid',
    processedBy: 'Sarah Connor (HR Manager)',
    queryStatus: 'No Query',
    adminQueryText: null,
    hrResolutionNote: null
  }
];

const generatePayroll = async (req, res) => {
  try {
    const { employeeId, employeeName, designation, department, month, year, basicSalary, bonus } = req.body;
    
    const basic = Number(basicSalary) || 60000;
    const hra = Math.round(basic * 0.40);
    const medicalAllowance = 5000;
    const specialAllowance = Math.round(basic * 0.15);
    const bonusAmt = Number(bonus) || 0;
    const pfDeduction = Math.round(basic * 0.12);
    const taxDeduction = Math.round(basic * 0.08);

    const gross = basic + hra + medicalAllowance + specialAllowance + bonusAmt;
    const netSalary = gross - (pfDeduction + taxDeduction);

    const newPayroll = {
      _id: `pay_${Date.now()}`,
      employeeId: employeeId || 'emp1',
      employeeCode: 'NZ-1001',
      employeeName: employeeName || 'Alex Rivera',
      designation: designation || 'Senior Full Stack Engineer',
      department: department || 'Engineering & AI',
      month: month || 'August',
      year: Number(year) || 2026,
      basicSalary: basic,
      hra,
      medicalAllowance,
      specialAllowance,
      bonus: bonusAmt,
      pfDeduction,
      taxDeduction,
      leaveDeduction: 0,
      lateDeduction: 0,
      netSalary,
      paymentStatus: 'Paid',
      processedBy: 'Sarah Connor (HR Manager)',
      queryStatus: 'No Query',
      adminQueryText: null,
      hrResolutionNote: null,
      generatedDate: new Date()
    };

    memoryPayroll.unshift(newPayroll);

    res.status(201).json({
      success: true,
      message: `Payroll processed successfully by HR Manager for ${newPayroll.employeeName}`,
      data: newPayroll
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const raiseQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { queryText } = req.body;

    const record = memoryPayroll.find(p => p._id === id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Payroll record not found' });
    }

    record.queryStatus = 'Query Raised';
    record.adminQueryText = queryText || 'Admin raised query regarding salary component.';
    record.queryDate = new Date().toISOString().split('T')[0];

    res.json({
      success: true,
      message: `Admin query sent to HR Manager for ${record.employeeName}'s payroll.`,
      data: record
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const solveQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolutionNote } = req.body;

    const record = memoryPayroll.find(p => p._id === id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Payroll record not found' });
    }

    record.queryStatus = 'Resolved';
    record.hrResolutionNote = resolutionNote || 'HR Manager reviewed payroll components and verified correctness.';
    record.resolvedDate = new Date().toISOString().split('T')[0];

    res.json({
      success: true,
      message: `HR Manager resolved Admin query for ${record.employeeName}'s payroll.`,
      data: record
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPayroll = async (req, res) => {
  try {
    res.json({ success: true, count: memoryPayroll.length, data: memoryPayroll });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPayslipByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    let payslips = memoryPayroll.filter(p => p.employeeId === employeeId || p.employeeCode === employeeId);
    
    if (!payslips || payslips.length === 0) {
      payslips = [memoryPayroll[0]];
    }

    res.json({ success: true, data: payslips });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  generatePayroll,
  getPayroll,
  getPayslipByEmployee,
  raiseQuery,
  solveQuery,
  memoryPayroll
};
