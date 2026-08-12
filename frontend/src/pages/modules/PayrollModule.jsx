import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { CreditCard, Download, Plus, FileText, CheckCircle, X, ShieldCheck, HelpCircle, MessageSquare, AlertTriangle, Send } from 'lucide-react';
import jsPDF from 'jspdf';

const initialPayrollList = [
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
    adminQueryText: 'Admin Query: Please verify HRA allowance and tax deduction breakdown before finalizing Q3 report.',
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

export default function PayrollModule() {
  const { user, hasRole } = useAuth();
  const [payrollList, setPayrollList] = useState(initialPayrollList);

  // Modals state
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showAdminQueryModal, setShowAdminQueryModal] = useState(false);
  const [showHRSolveModal, setShowHRSolveModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);

  // Query & Resolution Text
  const [queryInputText, setQueryInputText] = useState('');
  const [resolutionInputText, setResolutionInputText] = useState('');

  const [formData, setFormData] = useState({
    employeeName: 'Alex Rivera',
    designation: 'Senior Full Stack Engineer',
    department: 'Engineering & AI',
    month: 'August',
    year: 2026,
    basicSalary: 60000,
    bonus: 5000
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPayroll();
  }, []);

  const fetchPayroll = async () => {
    try {
      const res = await api.get('/payroll');
      if (res.success && res.data && res.data.length > 0) {
        const mergedMap = new Map();
        initialPayrollList.forEach(item => {
          mergedMap.set(item._id, item);
        });
        res.data.forEach(item => {
          mergedMap.set(item._id, item);
        });
        setPayrollList(Array.from(mergedMap.values()));
      }
    } catch (e) {
      console.log('Loaded local payroll data');
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.employeeName.trim()) errs.employeeName = 'Employee name is mandatory.';
    if (!formData.designation.trim()) errs.designation = 'Designation is mandatory.';
    if (Number(formData.basicSalary) <= 0) errs.basicSalary = 'Basic salary must be positive.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Process Payroll Action (HR Role Only)
  const handleGeneratePayroll = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await api.post('/payroll', formData);
    } catch (err) {}

    const basic = Number(formData.basicSalary) || 60000;
    const hra = Math.round(basic * 0.40);
    const medicalAllowance = 5000;
    const specialAllowance = Math.round(basic * 0.15);
    const bonusAmt = Number(formData.bonus) || 0;
    const pfDeduction = Math.round(basic * 0.12);
    const taxDeduction = Math.round(basic * 0.08);
    const netSalary = (basic + hra + medicalAllowance + specialAllowance + bonusAmt) - (pfDeduction + taxDeduction);

    const newPayroll = {
      _id: `pay_${Date.now()}`,
      employeeId: 'emp1',
      employeeCode: `NZ-${1000 + payrollList.length + 1}`,
      employeeName: formData.employeeName,
      designation: formData.designation,
      department: formData.department,
      month: formData.month,
      year: Number(formData.year),
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
      hrResolutionNote: null
    };

    setPayrollList(prev => [newPayroll, ...prev]);
    setShowGenerateModal(false);
    setErrors({});
    alert(`Payroll processed successfully by HR Manager (${user?.name || 'Sarah Connor'})!`);
  };

  // Admin Sends Query to HR
  const openAdminQueryModal = (item) => {
    setSelectedPayroll(item);
    setQueryInputText(item.adminQueryText || '');
    setShowAdminQueryModal(true);
  };

  const handleSendAdminQuery = async (e) => {
    e.preventDefault();
    if (!queryInputText.trim()) {
      alert('Please enter your query message for HR.');
      return;
    }

    try {
      await api.post(`/payroll/${selectedPayroll._id}/query`, { queryText: queryInputText });
    } catch (err) {}

    const queryMessage = `Admin Query: ${queryInputText}`;

    setPayrollList(prev => prev.map(p => {
      if (p._id === selectedPayroll._id) {
        return {
          ...p,
          queryStatus: 'Query Raised',
          adminQueryText: queryMessage,
          queryDate: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    }));

    setShowAdminQueryModal(false);
    alert(`Query sent successfully to HR Manager! HR will review and resolve this query.`);
  };

  // HR Solves Admin Query
  const openHRSolveModal = (item) => {
    setSelectedPayroll(item);
    setResolutionInputText(item.hrResolutionNote || 'Verified and updated salary component calculations per company policy.');
    setShowHRSolveModal(true);
  };

  const handleSolveHRQuery = async (e) => {
    e.preventDefault();
    if (!resolutionInputText.trim()) {
      alert('Please enter the resolution details.');
      return;
    }

    try {
      await api.post(`/payroll/${selectedPayroll._id}/solve`, { resolutionNote: resolutionInputText });
    } catch (err) {}

    setPayrollList(prev => prev.map(p => {
      if (p._id === selectedPayroll._id) {
        return {
          ...p,
          queryStatus: 'Resolved',
          hrResolutionNote: resolutionInputText,
          resolvedDate: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    }));

    setShowHRSolveModal(false);
    alert(`Query for ${selectedPayroll.employeeName}'s payroll marked as SOLVED by HR Manager! Admin can view the resolution.`);
  };

  const downloadPayslipPDF = (item) => {
    const doc = new jsPDF();

    doc.setFillColor(101, 146, 135);
    doc.rect(0, 0, 210, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('NEUZEN AI', 20, 22);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`CONFIDENTIAL SALARY PAYSLIP - ${item.month.toUpperCase()} ${item.year}`, 105, 22);

    doc.setTextColor(28, 45, 39);
    doc.setFontSize(10);
    doc.rect(20, 45, 170, 32);

    doc.text(`Employee Code: ${item.employeeCode || 'NZ-1001'}`, 25, 54);
    doc.text(`Employee Name: ${item.employeeName}`, 25, 62);
    doc.text(`Designation: ${item.designation || 'Engineer'}`, 25, 70);

    doc.text(`Department: ${item.department || 'Engineering'}`, 110, 54);
    doc.text(`Pay Period: ${item.month} ${item.year}`, 110, 62);
    doc.text(`Processed By: ${item.processedBy || 'HR Manager'}`, 110, 70);

    doc.setFillColor(230, 242, 221);
    doc.rect(20, 85, 82, 10, 'F');
    doc.rect(108, 85, 82, 10, 'F');

    doc.setFont('helvetica', 'bold');
    doc.text('EARNINGS & ALLOWANCES', 25, 91);
    doc.text('DEDUCTIONS & TAXES', 113, 91);
    doc.setFont('helvetica', 'normal');

    doc.text(`Basic Salary: INR ${item.basicSalary.toLocaleString('en-IN')}`, 25, 103);
    doc.text(`House Rent Allowance (HRA): INR ${item.hra.toLocaleString('en-IN')}`, 25, 111);
    doc.text(`Medical Allowance: INR ${item.medicalAllowance.toLocaleString('en-IN')}`, 25, 119);
    doc.text(`Special Allowance: INR ${item.specialAllowance.toLocaleString('en-IN')}`, 25, 127);
    doc.text(`Performance Bonus: INR ${(item.bonus || 0).toLocaleString('en-IN')}`, 25, 135);

    doc.text(`Provident Fund (PF): INR ${item.pfDeduction.toLocaleString('en-IN')}`, 113, 103);
    doc.text(`Income Tax (TDS): INR ${item.taxDeduction.toLocaleString('en-IN')}`, 113, 111);
    doc.text(`Leave Deductions: INR ${(item.leaveDeduction || 0).toLocaleString('en-IN')}`, 113, 119);
    doc.text(`Late Entry Deductions: INR ${(item.lateDeduction || 0).toLocaleString('en-IN')}`, 113, 127);

    doc.setFillColor(101, 146, 135);
    doc.rect(20, 150, 170, 18, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`NET TAKE HOME SALARY: INR ${item.netSalary.toLocaleString('en-IN')}`, 30, 162);

    doc.setTextColor(86, 110, 101);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('This is a computer generated payslip', 20, 185);

    doc.save(`Payslip_${item.employeeName.replace(/\s+/g, '_')}_${item.month}_${item.year}.pdf`);
  };

  const isHR = hasRole('HR');
  const isAdmin = hasRole('Admin');
  const isEmployee = !isHR && !isAdmin;

  const displayedPayroll = isEmployee
    ? payrollList.filter(item => user?.name?.includes(item.employeeName) || item.employeeName.includes(user?.name?.split(' ')[0]))
    : payrollList;

  // Count pending queries for HR
  const pendingQueriesCount = payrollList.filter(p => p.queryStatus === 'Query Raised').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#1C2D27' }}>Payroll Management & Query Portal</h1>
          <p style={{ color: '#566E65', fontSize: '0.95rem' }}>
            {isHR 
              ? 'HR Processing Portal: Calculate salary components, process monthly payroll, and solve Admin queries.' 
              : isAdmin 
                ? 'Admin Supervision Portal: Audit HR payroll disbursements and send discrepancy queries directly to HR.'
                : 'Employee Portal: View and download your monthly salary payslips.'}
          </p>
        </div>

        {isHR && (
          <button onClick={() => { setErrors({}); setShowGenerateModal(true); }} className="btn-primary">
            <Plus size={18} />
            <span>Process New Payroll (HR)</span>
          </button>
        )}
      </div>

      {/* Role & Workflow Status Card */}
      <div className="glass-card" style={{ borderLeft: isHR ? '4px solid #659287' : (isAdmin ? '4px solid #ED6C02' : '4px solid #88BDA4'), background: 'linear-gradient(135deg, #ffffff, #F5FBF3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <ShieldCheck size={24} color={isHR ? '#659287' : (isAdmin ? '#ED6C02' : '#88BDA4')} />
            <div>
              <strong style={{ color: '#1C2D27', fontSize: '0.98rem' }}>
                {isHR ? 'HR Payroll Processing Rights: ACTIVE' : (isAdmin ? 'Admin Payroll Supervision & Query Rights: ACTIVE' : 'Employee Portal: Personal Payslips')}
              </strong>
              <div style={{ fontSize: '0.82rem', color: '#566E65', marginTop: '0.1rem' }}>
                {isHR 
                  ? 'Payroll is processed exclusively by HR Manager. You can review and solve queries raised by Admin below.'
                  : (isAdmin ? 'HR processes all staff payrolls. As Admin, if you find any discrepancy, click "Send Query to HR" to notify HR.' : 'View and download your monthly salary payslips below.')}
              </div>
            </div>
          </div>
          {!isEmployee && pendingQueriesCount > 0 && (
            <span className="badge badge-warning" style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem' }}>
              ⚠️ {pendingQueriesCount} Pending Query requiring HR Action
            </span>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {!isEmployee && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
          <div className="glass-card">
            <span style={{ fontSize: '0.85rem', color: '#566E65', fontWeight: 600 }}>Total Monthly Disbursement</span>
            <h2 style={{ fontSize: '1.6rem', color: '#659287', marginTop: '0.3rem' }}>
              ₹ {payrollList.reduce((acc, c) => acc + (c.netSalary || 0), 0).toLocaleString('en-IN')}
            </h2>
            <span style={{ fontSize: '0.8rem', color: '#2E7D32' }}>August 2026 Payroll Cycle</span>
          </div>

          <div className="glass-card">
            <span style={{ fontSize: '0.85rem', color: '#566E65', fontWeight: 600 }}>Processed by HR Manager</span>
            <h2 style={{ fontSize: '1.6rem', color: '#1C2D27', marginTop: '0.3rem' }}>{payrollList.length} Staff</h2>
            <span style={{ fontSize: '0.8rem', color: '#566E65' }}>Processed by HR</span>
          </div>

          <div className="glass-card">
            <span style={{ fontSize: '0.85rem', color: '#566E65', fontWeight: 600 }}>Admin Queries Status</span>
            <h2 style={{ fontSize: '1.6rem', color: pendingQueriesCount > 0 ? '#ED6C02' : '#2E7D32', marginTop: '0.3rem' }}>
              {pendingQueriesCount} Pending
            </h2>
            <span style={{ fontSize: '0.8rem', color: '#566E65' }}>HR Resolution Tracker</span>
          </div>
        </div>
      )}

      {/* Payroll Records or Personal Payslips */}
      {!isEmployee ? (
        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Employee Code</th>
                <th>Employee Name</th>
                <th>Designation</th>
                <th>Pay Period</th>
                <th>Net Take-Home</th>
                <th>Processed By</th>
                <th>Query Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payrollList.map((item) => (
                <tr key={item._id}>
                <td style={{ fontWeight: 700, color: '#659287' }}>{item.employeeCode || 'NZ-1001'}</td>
                <td>
                  <strong>{item.employeeName}</strong>
                  <div style={{ fontSize: '0.78rem', color: '#566E65' }}>{item.department}</div>
                </td>
                <td>{item.designation}</td>
                <td>{item.month} {item.year}</td>
                <td style={{ fontWeight: 700, fontSize: '1rem', color: '#1C2D27' }}>
                  ₹ {item.netSalary.toLocaleString('en-IN')}
                </td>
                <td>
                  <span className="badge badge-info" style={{ fontSize: '0.78rem' }}>
                    {item.processedBy || 'Sarah Connor (HR)'}
                  </span>
                </td>
                <td>
                  {item.queryStatus === 'Query Raised' ? (
                    <div>
                      <span className="badge badge-warning" style={{ fontSize: '0.78rem' }}>
                        ⚠️ Query Raised by Admin
                      </span>
                      <div style={{ fontSize: '0.75rem', color: '#ED6C02', marginTop: '0.2rem', maxWidth: '200px' }}>
                        {item.adminQueryText}
                      </div>
                    </div>
                  ) : item.queryStatus === 'Resolved' ? (
                    <div>
                      <span className="badge badge-success" style={{ fontSize: '0.78rem' }}>
                        ✓ Solved by HR
                      </span>
                      <div style={{ fontSize: '0.75rem', color: '#2E7D32', marginTop: '0.2rem', maxWidth: '200px' }}>
                        {item.hrResolutionNote}
                      </div>
                    </div>
                  ) : (
                    <span className="badge badge-info" style={{ fontSize: '0.78rem' }}>
                      ✓ Verified Clean
                    </span>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => downloadPayslipPDF(item)}
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                    >
                      <Download size={14} />
                      <span>Payslip</span>
                    </button>

                    {/* Admin can send Query to HR */}
                    {isAdmin && (
                      <button
                        onClick={() => openAdminQueryModal(item)}
                        className="btn-primary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', background: item.queryStatus === 'Query Raised' ? '#ED6C02' : '#659287' }}
                      >
                        <HelpCircle size={14} />
                        <span>{item.queryStatus === 'Query Raised' ? 'Edit Query' : 'Send Query to HR'}</span>
                      </button>
                    )}

                    {/* HR can Solve Admin Query */}
                    {isHR && item.queryStatus === 'Query Raised' && (
                      <button
                        onClick={() => openHRSolveModal(item)}
                        className="btn-primary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', background: '#2E7D32' }}
                      >
                        <CheckCircle size={14} />
                        <span>Solve Query (HR)</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {displayedPayroll.map(item => (
            <div key={item._id} className="glass-card" style={{ borderLeft: '4px solid #659287' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E6F2DD', paddingBottom: '1rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ color: '#1C2D27', fontSize: '1.2rem', marginBottom: '0.2rem' }}>{item.month} {item.year} Payslip</h3>
                  <div style={{ color: '#566E65', fontSize: '0.9rem' }}>Net Salary: <strong style={{ color: '#1C2D27' }}>₹ {item.netSalary.toLocaleString('en-IN')}</strong></div>
                </div>
                <button
                  onClick={() => downloadPayslipPDF(item)}
                  className="btn-primary"
                  style={{ background: '#659287' }}
                >
                  <Download size={16} />
                  <span>Download Payslip</span>
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                <div>
                  <h4 style={{ color: '#659287', marginBottom: '0.5rem', fontSize: '1rem' }}>Earnings</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.3rem', color: '#566E65' }}><span>Basic Salary</span><span>₹ {item.basicSalary.toLocaleString('en-IN')}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.3rem', color: '#566E65' }}><span>HRA</span><span>₹ {item.hra.toLocaleString('en-IN')}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.3rem', color: '#566E65' }}><span>Medical</span><span>₹ {item.medicalAllowance.toLocaleString('en-IN')}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.3rem', color: '#566E65' }}><span>Special Allowance</span><span>₹ {item.specialAllowance.toLocaleString('en-IN')}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.3rem', color: '#566E65' }}><span>Bonus</span><span>₹ {(item.bonus || 0).toLocaleString('en-IN')}</span></div>
                </div>
                <div>
                  <h4 style={{ color: '#ED6C02', marginBottom: '0.5rem', fontSize: '1rem' }}>Deductions</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.3rem', color: '#566E65' }}><span>Provident Fund (PF)</span><span>₹ {item.pfDeduction.toLocaleString('en-IN')}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.3rem', color: '#566E65' }}><span>Income Tax (TDS)</span><span>₹ {item.taxDeduction.toLocaleString('en-IN')}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.3rem', color: '#566E65' }}><span>Leave Deductions</span><span>₹ {(item.leaveDeduction || 0).toLocaleString('en-IN')}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.3rem', color: '#566E65' }}><span>Late Deductions</span><span>₹ {(item.lateDeduction || 0).toLocaleString('en-IN')}</span></div>
                </div>
              </div>
            </div>
          ))}
          {displayedPayroll.length === 0 && (
            <div className="glass-card" style={{ textAlign: 'center', padding: '2rem', color: '#566E65' }}>
              No payslips found for your account.
            </div>
          )}
        </div>
      )}

      {/* Admin Query Modal */}
      {showAdminQueryModal && selectedPayroll && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h2>Send Payroll Discrepancy Query to HR</h2>
              <button onClick={() => setShowAdminQueryModal(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#FFF8E1', borderLeft: '4px solid #ED6C02', padding: '0.8rem 1rem', borderRadius: '6px', marginBottom: '1.2rem' }}>
              <div style={{ fontWeight: 600, color: '#1C2D27', fontSize: '0.9rem' }}>
                Payroll Subject: {selectedPayroll.employeeName} ({selectedPayroll.employeeCode})
              </div>
              <div style={{ fontSize: '0.8rem', color: '#566E65' }}>
                Month: {selectedPayroll.month} {selectedPayroll.year} | Net Take-Home: ₹ {selectedPayroll.netSalary.toLocaleString('en-IN')}
              </div>
            </div>

            <form onSubmit={handleSendAdminQuery} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">
                  <span>Enter Query / Discrepancy Details for HR Manager</span>
                  <span className="required-star">*</span>
                </label>
                <textarea
                  rows="4"
                  placeholder="e.g. Please clarify tax deduction breakdown or verify bonus eligibility for this employee..."
                  value={queryInputText}
                  onChange={(e) => setQueryInputText(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #B1D3B9' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAdminQueryModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary" style={{ background: '#ED6C02' }}>
                  <Send size={16} />
                  <span>Send Query to HR</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HR Solve Query Modal */}
      {showHRSolveModal && selectedPayroll && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h2>Solve Admin Payroll Query (HR Manager)</h2>
              <button onClick={() => setShowHRSolveModal(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#F5FBF3', borderLeft: '4px solid #659287', padding: '0.9rem', borderRadius: '8px', marginBottom: '1.2rem' }}>
              <div style={{ fontWeight: 600, color: '#1C2D27', fontSize: '0.9rem' }}>
                Query for: {selectedPayroll.employeeName} ({selectedPayroll.employeeCode})
              </div>
              <div style={{ fontSize: '0.85rem', color: '#ED6C02', marginTop: '0.3rem', fontStyle: 'italic' }}>
                "{selectedPayroll.adminQueryText}"
              </div>
            </div>

            <form onSubmit={handleSolveHRQuery} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">
                  <span>HR Resolution Note & Solution</span>
                  <span className="required-star">*</span>
                </label>
                <textarea
                  rows="4"
                  placeholder="e.g. Verified salary slip against IT Act Section 10(13A). Recalculated HRA allowance and updated statutory deductions..."
                  value={resolutionInputText}
                  onChange={(e) => setResolutionInputText(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #B1D3B9' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowHRSolveModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary" style={{ background: '#2E7D32' }}>
                  <CheckCircle size={16} />
                  <span>Solve Query & Confirm Payroll</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generate Payroll Modal (HR Role Only) */}
      {showGenerateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Generate Staff Payroll (HR Manager)</h2>
              <button onClick={() => setShowGenerateModal(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleGeneratePayroll} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">
                    <span>Employee Name</span>
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className={errors.employeeName ? 'input-error' : ''}
                    value={formData.employeeName}
                    onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                  />
                  {errors.employeeName && <span className="error-hint">{errors.employeeName}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Designation</span>
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className={errors.designation ? 'input-error' : ''}
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  />
                  {errors.designation && <span className="error-hint">{errors.designation}</span>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Pay Month</label>
                  <select
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  >
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Pay Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">
                    <span>Basic Salary (₹)</span>
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="number"
                    className={errors.basicSalary ? 'input-error' : ''}
                    value={formData.basicSalary}
                    onChange={(e) => setFormData({ ...formData, basicSalary: e.target.value })}
                  />
                  {errors.basicSalary && <span className="error-hint">{errors.basicSalary}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Performance Bonus (₹)</label>
                  <input
                    type="number"
                    value={formData.bonus}
                    onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowGenerateModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Process & Disburse Payroll</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
