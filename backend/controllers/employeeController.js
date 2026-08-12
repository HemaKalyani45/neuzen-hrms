const Employee = require('../models/Employee');
const User = require('../models/User');
const { initialEmployees } = require('../utils/seedData');

// Initial employee repository with pre-seeded documents
let memoryEmployees = [
  {
    ...initialEmployees[0],
    documents: [
      { id: 'doc1', title: 'Signed Employment Offer Letter', category: 'Offer Letter', fileName: 'Offer_Letter_Alex_Rivera.pdf', uploadDate: '2026-08-01', uploadedBy: 'Sarah Connor (HR)', fileSize: '1.2 MB' },
      { id: 'doc2', title: 'National Identity Proof (Aadhaar/Passport)', category: 'ID Proof', fileName: 'Identity_Proof_Alex.pdf', uploadDate: '2026-08-02', uploadedBy: 'Sarah Connor (HR)', fileSize: '2.4 MB' },
      { id: 'doc3', title: 'Senior Engineer Contract Agreement', category: 'Contract', fileName: 'Contract_Alex_Rivera.pdf', uploadDate: '2026-08-03', uploadedBy: 'Sarah Connor (HR)', fileSize: '850 KB' }
    ]
  },
  {
    ...initialEmployees[1],
    documents: [
      { id: 'doc4', title: 'HR Manager Offer & NDA', category: 'Offer Letter', fileName: 'HR_Offer_Sarah_Connor.pdf', uploadDate: '2026-08-01', uploadedBy: 'Admin System', fileSize: '1.5 MB' },
      { id: 'doc5', title: 'Identity & Address Verification', category: 'ID Proof', fileName: 'Passport_Sarah_Connor.pdf', uploadDate: '2026-08-01', uploadedBy: 'Admin System', fileSize: '1.8 MB' }
    ]
  },
  {
    ...initialEmployees[2],
    documents: [
      { id: 'doc6', title: 'Lead Designer Offer Letter', category: 'Offer Letter', fileName: 'Offer_Letter_Michael_Chen.pdf', uploadDate: '2026-08-05', uploadedBy: 'Sarah Connor (HR)', fileSize: '980 KB' },
      { id: 'doc7', title: 'University Degree Certificate', category: 'Education', fileName: 'Degree_Certificate_Michael.pdf', uploadDate: '2026-08-06', uploadedBy: 'Sarah Connor (HR)', fileSize: '3.1 MB' }
    ]
  },
  {
    ...initialEmployees[3],
    documents: [
      { id: 'doc8', title: 'AI Specialist Appointment Letter', category: 'Offer Letter', fileName: 'Appointment_Letter_Priya.pdf', uploadDate: '2026-08-07', uploadedBy: 'Sarah Connor (HR)', fileSize: '1.1 MB' },
      { id: 'doc9', title: 'Relieving & Experience Certificate', category: 'Experience', fileName: 'Relieving_Letter_Priya.pdf', uploadDate: '2026-08-08', uploadedBy: 'Sarah Connor (HR)', fileSize: '1.4 MB' }
    ]
  }
];

const getEmployees = async (req, res) => {
  try {
    res.json({ success: true, count: memoryEmployees.length, data: memoryEmployees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = memoryEmployees.find(e => e._id === id || e.employeeId === id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const newEmpData = req.body;
    if (!newEmpData.name || !newEmpData.email || !newEmpData.designation) {
      return res.status(400).json({ success: false, message: 'Name, email, and designation are required.' });
    }

    const count = memoryEmployees.length + 1;
    const employeeId = newEmpData.employeeId || `NZ-${1000 + count}`;

    const formattedEmp = {
      _id: `emp_${Date.now()}`,
      employeeId,
      name: newEmpData.name,
      email: newEmpData.email,
      phone: newEmpData.phone || '9876543210',
      dob: newEmpData.dob || '1995-01-01',
      gender: newEmpData.gender || 'Male',
      address: newEmpData.address || 'NEUZEN AI Headquarters',
      departmentName: newEmpData.departmentName || 'Engineering & AI',
      designation: newEmpData.designation,
      joiningDate: newEmpData.joiningDate || new Date().toISOString().split('T')[0],
      salary: Number(newEmpData.salary) || 60000,
      manager: newEmpData.manager || 'Sarah Connor',
      photo: newEmpData.photo || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      emergencyContact: newEmpData.emergencyContact || { name: 'Emergency Contact', relation: 'Family', phone: '9999999999' },
      onboardingStatus: 'Activated',
      documents: newEmpData.documents || [
        { id: `doc_${Date.now()}`, title: 'Initial Offer Letter', category: 'Offer Letter', fileName: `Offer_${newEmpData.name.replace(/\s+/g, '_')}.pdf`, uploadDate: new Date().toISOString().split('T')[0], uploadedBy: 'HR Manager', fileSize: '1.0 MB' }
      ],
      createdAt: new Date()
    };

    memoryEmployees.unshift(formattedEmp);

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: formattedEmp
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const index = memoryEmployees.findIndex(e => e._id === id || e.employeeId === id);
    if (index !== -1) {
      memoryEmployees[index] = { ...memoryEmployees[index], ...updateData };
    }

    res.json({ success: true, message: 'Employee profile updated', data: memoryEmployees[index] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const uploadDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, fileName } = req.body;

    const employee = memoryEmployees.find(e => e._id === id || e.employeeId === id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    if (!employee.documents) employee.documents = [];

    const newDoc = {
      id: `doc_${Date.now()}`,
      title: title || 'Employee Document',
      category: category || 'General',
      fileName: fileName || 'Uploaded_Document.pdf',
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: req.user?.name || 'Sarah Connor (HR)',
      fileSize: `${(1 + Math.random() * 2).toFixed(1)} MB`
    };

    employee.documents.unshift(newDoc);

    res.json({ success: true, message: 'Document uploaded successfully by HR', data: newDoc, employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    memoryEmployees = memoryEmployees.filter(e => e._id !== id && e.employeeId !== id);
    res.json({ success: true, message: 'Employee removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  uploadDocument,
  deleteEmployee,
  memoryEmployees
};
