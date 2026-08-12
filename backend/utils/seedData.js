const bcrypt = require('bcryptjs');

const initialUsers = [
  {
    name: 'Admin System',
    email: 'admin@neuzenai.com',
    passwordRaw: 'Admin@123',
    role: 'Admin',
    status: 'Active'
  },
  {
    name: 'Sarah Connor (HR Manager)',
    email: 'hr@neuzenai.com',
    passwordRaw: 'Hr@123',
    role: 'HR',
    status: 'Active'
  },
  {
    name: 'Alex Rivera (Sr. Developer)',
    email: 'employee@neuzenai.com',
    passwordRaw: 'Employee@123',
    role: 'Employee',
    status: 'Active'
  },
  {
    name: 'Alex Rivera',
    email: 'alex@neuzenai.com',
    passwordRaw: 'Ale@123',
    role: 'Employee',
    status: 'Active'
  },
  {
    name: 'Michael Chen',
    email: 'michael@neuzenai.com',
    passwordRaw: 'Mic@123',
    role: 'Employee',
    status: 'Active'
  },
  {
    name: 'Priya Sharma',
    email: 'priya@neuzenai.com',
    passwordRaw: 'Pri@123',
    role: 'Employee',
    status: 'Active'
  }
];


const initialEmployees = [
  {
    _id: 'emp1',
    employeeId: 'NZ-1001',
    name: 'Alex Rivera',
    email: 'employee@neuzenai.com',
    phone: '9876543210',
    dob: '1994-06-15',
    gender: 'Male',
    address: '42 AI Innovation Way, Tech Park, Cyber City',
    departmentName: 'Engineering & AI',
    designation: 'Senior Full Stack Engineer',
    joiningDate: '2023-01-10',
    salary: 95000,
    manager: 'Sarah Connor',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    emergencyContact: { name: 'Maria Rivera', relation: 'Spouse', phone: '9876500112' },
    onboardingStatus: 'Activated'
  },
  {
    _id: 'emp2',
    employeeId: 'NZ-1002',
    name: 'Sarah Connor',
    email: 'hr@neuzenai.com',
    phone: '9876543211',
    dob: '1990-11-20',
    gender: 'Female',
    address: '18 HR Heights, Executive Suite 4',
    departmentName: 'Human Resources',
    designation: 'HR Lead Manager',
    joiningDate: '2022-05-01',
    salary: 88000,
    manager: 'Admin System',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    emergencyContact: { name: 'John Connor', relation: 'Brother', phone: '9876500113' },
    onboardingStatus: 'Activated'
  },
  {
    _id: 'emp3',
    employeeId: 'NZ-1003',
    name: 'Michael Chen',
    email: 'm.chen@neuzenai.com',
    phone: '9876543212',
    dob: '1996-03-08',
    gender: 'Male',
    address: '102 Silicon Avenue, Block B',
    departmentName: 'Product & Design',
    designation: 'Lead UI/UX Designer',
    joiningDate: '2023-08-15',
    salary: 78000,
    manager: 'Sarah Connor',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    emergencyContact: { name: 'David Chen', relation: 'Father', phone: '9876500114' },
    onboardingStatus: 'Activated'
  },
  {
    _id: 'emp4',
    employeeId: 'NZ-1004',
    name: 'Priya Sharma',
    email: 'priya.s@neuzenai.com',
    phone: '9876543213',
    dob: '1998-09-12',
    gender: 'Female',
    address: '55 Boulevard Gardens, Flat 3B',
    departmentName: 'Engineering & AI',
    designation: 'AI ML Specialist',
    joiningDate: '2024-02-01',
    salary: 82000,
    manager: 'Alex Rivera',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    emergencyContact: { name: 'Sunil Sharma', relation: 'Father', phone: '9876500115' },
    onboardingStatus: 'Activated'
  }
];

const initialDepartments = [
  { _id: 'dept1', departmentName: 'Engineering & AI', managerName: 'Sarah Connor', employeeCount: 2, description: 'AI Research, Fullstack & Mobile Engineering' },
  { _id: 'dept2', departmentName: 'Human Resources', managerName: 'Sarah Connor', employeeCount: 1, description: 'Talent Acquisition, Employee Welfare & Payroll' },
  { _id: 'dept3', departmentName: 'Product & Design', managerName: 'Alex Rivera', employeeCount: 1, description: 'UI/UX Design, Product Management' },
  { _id: 'dept4', departmentName: 'Marketing & Sales', managerName: 'Admin System', employeeCount: 0, description: 'Digital Marketing & Enterprise Sales' }
];

const initialHolidays = [
  { _id: 'hol1', holidayName: 'New Year Day', date: '2026-01-01', dayOfWeek: 'Thursday', description: 'Global New Year celebration', type: 'National' },
  { _id: 'hol2', holidayName: 'Republic Day', date: '2026-01-26', dayOfWeek: 'Monday', description: 'National Republic Day holiday', type: 'National' },
  { _id: 'hol3', holidayName: 'Independence Day', date: '2026-08-15', dayOfWeek: 'Saturday', description: 'National Independence Day celebration', type: 'National' },
  { _id: 'hol4', holidayName: 'NEUZEN AI Foundation Day', date: '2026-10-10', dayOfWeek: 'Saturday', description: 'Annual company anniversary & summit', type: 'Company Event' },
  { _id: 'hol5', holidayName: 'Diwali Festival', date: '2026-11-08', dayOfWeek: 'Sunday', description: 'Festival of Lights holiday', type: 'Festival' }
];

const initialLeaves = [
  {
    _id: 'lve1',
    employeeId: 'emp1',
    employeeName: 'Alex Rivera',
    leaveType: 'Casual Leave',
    startDate: '2026-08-18',
    endDate: '2026-08-20',
    totalDays: 3,
    reason: 'Family event and personal work',
    status: 'Approved',
    approvedBy: 'Sarah Connor (HR Lead)',
    appliedOn: '2026-08-10'
  },
  {
    _id: 'lve2',
    employeeId: 'emp3',
    employeeName: 'Michael Chen',
    leaveType: 'Sick Leave',
    startDate: '2026-08-14',
    endDate: '2026-08-15',
    totalDays: 2,
    reason: 'Severe viral fever and doctor consultation',
    status: 'Pending',
    appliedOn: '2026-08-11'
  }
];

const initialPayroll = [
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
    paymentStatus: 'Paid'
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
    paymentStatus: 'Paid'
  }
];

module.exports = {
  initialUsers,
  initialDepartments,
  initialEmployees,
  initialHolidays,
  initialLeaves,
  initialPayroll
};
