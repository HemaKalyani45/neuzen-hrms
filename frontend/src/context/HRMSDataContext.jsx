import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// ─── Seed Data ─────────────────────────────────────────────────────────────────

const SEED_EMPLOYEES = [
  {
    _id: 'emp1',
    employeeId: 'NZ-1001',
    name: 'Alex Rivera',
    email: 'employee@neuzenai.com',
    phone: '9876543210',
    departmentName: 'Engineering & AI',
    designation: 'Senior Full Stack Engineer',
    joiningDate: '2023-01-10',
    salary: 95000,
    gender: 'Male',
    documents: [
      { id: 'doc1', title: 'Signed Employment Offer Letter', category: 'Offer Letter', fileName: 'Offer_Letter_Alex_Rivera.pdf', uploadDate: '2026-08-01', uploadedBy: 'Sarah Connor (HR)', fileSize: '1.2 MB' },
      { id: 'doc2', title: 'National Identity Proof', category: 'ID Proof', fileName: 'Identity_Proof_Alex.pdf', uploadDate: '2026-08-02', uploadedBy: 'Sarah Connor (HR)', fileSize: '2.4 MB' },
      { id: 'doc3', title: 'Senior Engineer Contract Agreement', category: 'Contract', fileName: 'Contract_Alex_Rivera.pdf', uploadDate: '2026-08-03', uploadedBy: 'Sarah Connor (HR)', fileSize: '850 KB' }
    ]
  },
  {
    _id: 'emp2',
    employeeId: 'NZ-1002',
    name: 'Sarah Connor',
    email: 'hr@neuzenai.com',
    phone: '9876543211',
    departmentName: 'Human Resources',
    designation: 'HR Lead Manager',
    joiningDate: '2022-05-01',
    salary: 88000,
    gender: 'Female',
    documents: [
      { id: 'doc4', title: 'HR Manager Offer & NDA', category: 'Offer Letter', fileName: 'HR_Offer_Sarah_Connor.pdf', uploadDate: '2026-08-01', uploadedBy: 'Admin System', fileSize: '1.5 MB' },
      { id: 'doc5', title: 'Identity & Address Verification', category: 'ID Proof', fileName: 'Passport_Sarah_Connor.pdf', uploadDate: '2026-08-01', uploadedBy: 'Admin System', fileSize: '1.8 MB' }
    ]
  },
  {
    _id: 'emp3',
    employeeId: 'NZ-1003',
    name: 'Michael Chen',
    email: 'm.chen@neuzenai.com',
    phone: '9876543212',
    departmentName: 'Product & Design',
    designation: 'Lead UI/UX Designer',
    joiningDate: '2023-08-15',
    salary: 78000,
    gender: 'Male',
    documents: [
      { id: 'doc6', title: 'Lead Designer Offer Letter', category: 'Offer Letter', fileName: 'Offer_Letter_Michael_Chen.pdf', uploadDate: '2026-08-05', uploadedBy: 'Sarah Connor (HR)', fileSize: '980 KB' },
      { id: 'doc7', title: 'University Degree Certificate', category: 'Education', fileName: 'Degree_Certificate_Michael.pdf', uploadDate: '2026-08-06', uploadedBy: 'Sarah Connor (HR)', fileSize: '3.1 MB' }
    ]
  },
  {
    _id: 'emp4',
    employeeId: 'NZ-1004',
    name: 'Priya Sharma',
    email: 'priya.s@neuzenai.com',
    phone: '9876543213',
    departmentName: 'Engineering & AI',
    designation: 'AI ML Specialist',
    joiningDate: '2024-02-01',
    salary: 82000,
    gender: 'Female',
    documents: [
      { id: 'doc8', title: 'AI Specialist Appointment Letter', category: 'Offer Letter', fileName: 'Appointment_Letter_Priya.pdf', uploadDate: '2026-08-07', uploadedBy: 'Sarah Connor (HR)', fileSize: '1.1 MB' },
      { id: 'doc9', title: 'Relieving & Experience Certificate', category: 'Experience', fileName: 'Relieving_Letter_Priya.pdf', uploadDate: '2026-08-08', uploadedBy: 'Sarah Connor (HR)', fileSize: '1.4 MB' }
    ]
  }
];

const SEED_CANDIDATES = [
  {
    _id: 'cand1',
    candidateName: 'Elena Rostova',
    candidateEmail: 'elena.r@neuzenai.com',
    position: 'AI Engineer',
    department: 'Engineering & AI',
    joiningDate: '2026-09-01',
    salary: 92000,
    benefits: 'Health insurance, Performance bonus, Remote flex, Laptop allowance',
    status: 'Offer Letter Sent',
    offerLetterNumber: 'NZ-OFF-2026-089',
    documents: [
      { id: 'cdoc1', title: 'AI Engineer Offer Letter', category: 'Offer Letter', fileName: 'Offer_Letter_Elena_Rostova.pdf', uploadDate: '2026-08-08', uploadedBy: 'Sarah Connor (HR Manager)', fileSize: '1.4 MB' },
      { id: 'cdoc2', title: 'Passport & Identity Verification', category: 'ID Proof', fileName: 'Passport_Elena_Rostova.pdf', uploadDate: '2026-08-09', uploadedBy: 'Sarah Connor (HR Manager)', fileSize: '2.1 MB' }
    ]
  },
  {
    _id: 'cand2',
    candidateName: 'Marcus Sterling',
    candidateEmail: 'm.sterling@neuzenai.com',
    position: 'Product Designer',
    department: 'Product & Design',
    joiningDate: '2026-09-15',
    salary: 76000,
    benefits: 'Health insurance, Stock options, Learning stipend',
    status: 'Documents Uploaded',
    offerLetterNumber: 'NZ-OFF-2026-090',
    documents: [
      { id: 'cdoc3', title: 'Product Designer Offer Letter', category: 'Offer Letter', fileName: 'Offer_Letter_Marcus_Sterling.pdf', uploadDate: '2026-08-10', uploadedBy: 'Sarah Connor (HR Manager)', fileSize: '1.1 MB' },
      { id: 'cdoc4', title: 'Design Portfolio & Degree Certificate', category: 'Education', fileName: 'Portfolio_Marcus_Sterling.pdf', uploadDate: '2026-08-11', uploadedBy: 'Sarah Connor (HR Manager)', fileSize: '4.5 MB' }
    ]
  }
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

const LS_EMPLOYEES_KEY = 'neuzen_employees';
const LS_CANDIDATES_KEY = 'neuzen_candidates';

function loadFromLS(key, seed) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge seed (by _id) with stored, stored wins for existing, seed fills missing
        const map = new Map();
        seed.forEach(item => map.set(item._id, item));
        parsed.forEach(item => map.set(item._id, item));
        return Array.from(map.values());
      }
    }
  } catch (e) {}
  return seed;
}

function saveToLS(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {}
}

// ─── Context ───────────────────────────────────────────────────────────────────

const HRMSDataContext = createContext(null);

export const HRMSDataProvider = ({ children }) => {
  const [employees, setEmployeesRaw] = useState(() => loadFromLS(LS_EMPLOYEES_KEY, SEED_EMPLOYEES));
  const [candidates, setCandidatesRaw] = useState(() => loadFromLS(LS_CANDIDATES_KEY, SEED_CANDIDATES));

  // Persist any change to localStorage
  const setEmployees = useCallback((updater) => {
    setEmployeesRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveToLS(LS_EMPLOYEES_KEY, next);
      return next;
    });
  }, []);

  const setCandidates = useCallback((updater) => {
    setCandidatesRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveToLS(LS_CANDIDATES_KEY, next);
      return next;
    });
  }, []);

  // Add a new candidate — also adds them as a pending entry in Employee Directory
  const addCandidate = useCallback((candidateData, uploadedByName) => {
    const newCandidate = {
      _id: `cand_${Date.now()}`,
      ...candidateData,
      status: 'Selected',
      offerLetterNumber: `NZ-OFF-2026-${Math.floor(100 + Math.random() * 900)}`,
      documents: [
        {
          id: `cdoc_${Date.now()}`,
          title: 'Initial Candidate Offer Letter',
          category: 'Offer Letter',
          fileName: `Offer_${candidateData.candidateName?.replace(/\s+/g, '_')}.pdf`,
          uploadDate: new Date().toISOString().split('T')[0],
          uploadedBy: uploadedByName || 'Sarah Connor (HR Manager)',
          fileSize: '1.2 MB'
        }
      ]
    };

    setCandidates(prev => [newCandidate, ...prev]);

    // Also add to Employee Directory as "Onboarding" status
    const newEmpEntry = {
      _id: `emp_cand_${newCandidate._id}`,
      employeeId: `NZ-OB-${Date.now().toString().slice(-4)}`,
      name: candidateData.candidateName,
      email: candidateData.candidateEmail,
      phone: '',
      departmentName: candidateData.department,
      designation: candidateData.position,
      joiningDate: candidateData.joiningDate,
      salary: Number(candidateData.salary) || 0,
      gender: '',
      status: 'Onboarding',
      documents: newCandidate.documents
    };

    setEmployees(prev => [newEmpEntry, ...prev]);

    return newCandidate;
  }, [setCandidates, setEmployees]);

  // Update a candidate's status
  const updateCandidateStatus = useCallback((candidateId, status) => {
    setCandidates(prev => prev.map(c => c._id === candidateId ? { ...c, status } : c));
  }, [setCandidates]);

  // Add a document to an employee
  const addEmployeeDocument = useCallback((employeeId, doc) => {
    setEmployees(prev => prev.map(emp =>
      emp._id === employeeId
        ? { ...emp, documents: [doc, ...(emp.documents || [])] }
        : emp
    ));
  }, [setEmployees]);

  // Delete an employee
  const deleteEmployee = useCallback((employeeId) => {
    setEmployees(prev => prev.filter(e => e._id !== employeeId));
  }, [setEmployees]);

  // Update an employee
  const updateEmployee = useCallback((employeeId, updates) => {
    setEmployees(prev => prev.map(e => e._id === employeeId ? { ...e, ...updates } : e));
  }, [setEmployees]);

  return (
    <HRMSDataContext.Provider value={{
      employees,
      setEmployees,
      candidates,
      setCandidates,
      addCandidate,
      updateCandidateStatus,
      addEmployeeDocument,
      deleteEmployee,
      updateEmployee
    }}>
      {children}
    </HRMSDataContext.Provider>
  );
};

export const useHRMSData = () => {
  const ctx = useContext(HRMSDataContext);
  if (!ctx) throw new Error('useHRMSData must be used inside HRMSDataProvider');
  return ctx;
};
