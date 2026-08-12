import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useHRMSData } from '../../context/HRMSDataContext';
import { UserPlus, FileText, Send, CheckCircle, Upload, Download, Sparkles, X, Eye, ShieldCheck, FileCheck, ArrowRight, UserCheck } from 'lucide-react';
import jsPDF from 'jspdf';

export default function OnboardingModule() {
  const { hasRole, user } = useAuth();
  const { candidates, setCandidates, addCandidate, employees: employeeDocsList, updateCandidateStatus } = useHRMSData();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);

  // Document Viewer Modal State
  const [showDocsViewerModal, setShowDocsViewerModal] = useState(false);
  const [activeDocSubject, setActiveDocSubject] = useState(null);

  const [formData, setFormData] = useState({
    candidateName: '',
    candidateEmail: '',
    position: '',
    department: 'Engineering & AI',
    joiningDate: '2026-09-01',
    salary: 85000,
    benefits: 'Comprehensive Medical Insurance, Performance Bonus, Stock Options'
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errs = {};
    if (!formData.candidateName.trim()) errs.candidateName = 'Candidate name is mandatory.';
    if (!formData.candidateEmail.trim() || !formData.candidateEmail.includes('@')) errs.candidateEmail = 'Valid email is mandatory.';
    if (!formData.position.trim()) errs.position = 'Position is mandatory.';
    if (Number(formData.salary) <= 0) errs.salary = 'Offered salary must be positive.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await api.post('/onboarding', formData);
    } catch (err) {}

    // addCandidate from shared context — syncs to Onboarding, HR Employee Management & Admin Employee Management instantly
    addCandidate({
      candidateName: formData.candidateName,
      candidateEmail: formData.candidateEmail,
      position: formData.position,
      department: formData.department,
      joiningDate: formData.joiningDate,
      salary: Number(formData.salary),
      benefits: formData.benefits
    }, user?.name || 'Sarah Connor (HR Manager)');

    setShowAddModal(false);
    setFormData({
      candidateName: '',
      candidateEmail: '',
      position: '',
      department: 'Engineering & AI',
      joiningDate: '2026-09-01',
      salary: 85000,
      benefits: 'Comprehensive Medical Insurance, Performance Bonus, Stock Options'
    });
    setErrors({});
  };

  // Convert Onboarding Candidate to Active Employee — reflected in both HR & Admin Employee Management
  const handleActivateAsEmployee = async (cand) => {
    try {
      await api.post('/employees', {
        name: cand.candidateName,
        email: cand.candidateEmail,
        designation: cand.position,
        departmentName: cand.department,
        salary: cand.salary,
        joiningDate: cand.joiningDate,
        documents: cand.documents || []
      });
    } catch (err) {}

    // Update candidate status in shared context
    updateCandidateStatus(cand._id, 'Employee Activated');
    alert(`Candidate ${cand.candidateName} has been successfully activated as an Active Employee in Employee Management!`);
  };

  const openDocViewer = (subject, docs, type) => {
    setActiveDocSubject({
      name: subject.candidateName || subject.name,
      email: subject.candidateEmail || subject.email,
      role: subject.position || subject.designation,
      department: subject.department || subject.departmentName,
      type,
      documents: docs || subject.documents || []
    });
    setShowDocsViewerModal(true);
  };

  const handleGenerateOffer = async (cand) => {
    try {
      await api.post(`/onboarding/offer-letter/${cand._id}`);
    } catch (err) {}

    setCandidates(prev => prev.map(c => c._id === cand._id ? { ...c, status: 'Offer Letter Sent' } : c));
    setSelectedCandidate({ ...cand, status: 'Offer Letter Sent' });
    setShowOfferModal(true);
  };

  const downloadOfferPDF = (cand) => {
    const doc = new jsPDF();

    doc.setFillColor(101, 146, 135);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('NEUZEN AI HRMS', 20, 25);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('CONFIDENTIAL EMPLOYMENT OFFER LETTER', 115, 25);

    doc.setTextColor(28, 45, 39);
    doc.setFontSize(11);
    doc.text(`Ref No: ${cand.offerLetterNumber || 'NZ-OFF-2026-089'}`, 20, 55);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 63);

    doc.text(`To,`, 20, 75);
    doc.setFont('helvetica', 'bold');
    doc.text(`${cand.candidateName}`, 20, 83);
    doc.setFont('helvetica', 'normal');
    doc.text(`Email: ${cand.candidateEmail}`, 20, 91);

    doc.text(`Dear ${cand.candidateName},`, 20, 105);
    const text = `We are delighted to extend this formal offer of employment for the position of ${cand.position} in the ${cand.department} department at NEUZEN AI.`;
    doc.text(doc.splitTextToSize(text, 170), 20, 115);

    doc.setFillColor(230, 242, 221);
    doc.rect(20, 135, 170, 45, 'F');

    doc.text(`Position: ${cand.position}`, 25, 145);
    doc.text(`Joining Date: ${cand.joiningDate}`, 25, 153);
    doc.text(`Annual Compensation (CTC): INR ${(cand.salary * 12).toLocaleString('en-IN')}`, 25, 161);
    doc.text(`Benefits: ${cand.benefits}`, 25, 169);

    doc.text('Authorized Signatory:', 20, 210);
    doc.setFont('helvetica', 'bold');
    doc.text('Sarah Connor (Head of People & HR, NEUZEN AI)', 20, 225);

    doc.save(`Offer_Letter_${cand.candidateName.replace(/\s+/g, '_')}.pdf`);
  };

  const isAdmin = hasRole('Admin');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="responsive-header-flex">
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#063A4B' }}>Employee Onboarding & Document Verification</h1>
          <p style={{ color: '#09637E', fontSize: '0.95rem' }}>
            {isAdmin 
              ? 'Admin Verification Portal: Inspect HR onboarding documents and convert candidates to active employees.' 
              : 'Manage candidate selection pipeline, document verifications, and offer letter generation.'}
          </p>
        </div>
        <button onClick={() => { setErrors({}); setShowAddModal(true); }} className="btn-primary">
          <UserPlus size={18} />
          <span>New Candidate</span>
        </button>
      </div>

      {/* Onboarding Workflow Stepper */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', color: '#063A4B', marginBottom: '1.2rem', fontWeight: 800 }}>Onboarding Workflow Stepper</h3>
        <div className="onboarding-stepper-grid">
          {[
            { step: '1', title: 'Candidate Selected', color: '#09637E' },
            { step: '2', title: 'Upload Documents', color: '#088395' },
            { step: '3', title: 'Generate Offer Letter', color: '#7AB2B2' },
            { step: '4', title: 'Admin Document Audit', color: '#09637E' },
            { step: '5', title: 'Employee Activated', color: '#088395' }
          ].map((s, idx) => (
            <div key={idx} style={{ 
              padding: '0.9rem', 
              background: '#EBF4F6', 
              borderRadius: '12px', 
              borderTop: `4px solid ${s.color}`,
              border: '1px solid #7AB2B2',
              boxShadow: '0 2px 8px rgba(9, 99, 126, 0.05)'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#09637E', fontWeight: 800, letterSpacing: '0.05em' }}>STEP {s.step}</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#063A4B', marginTop: '0.25rem' }}>{s.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Candidate Onboarding Pipeline Table */}
      <div className="custom-table-container">
        <div style={{ padding: '1rem 1.2rem', background: '#EBF4F6', borderBottom: '1px solid #7AB2B2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#063A4B', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
            <FileCheck size={18} color="#09637E" />
            <span>Onboarding Candidates Pipeline</span>
          </h3>
          <span className="badge badge-info">{candidates.length} Onboarding Candidates</span>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Offer Ref #</th>
              <th>Candidate Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Monthly CTC</th>
              <th>Pipeline Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((cand) => (
              <tr key={cand._id}>
                <td style={{ fontWeight: 700, color: '#09637E' }}>{cand.offerLetterNumber}</td>
                <td>
                  <strong style={{ color: '#063A4B' }}>{cand.candidateName}</strong>
                  <div style={{ fontSize: '0.8rem', color: '#09637E' }}>{cand.candidateEmail}</div>
                </td>
                <td>{cand.position}</td>
                <td><span className="badge badge-info">{cand.department}</span></td>
                <td style={{ fontWeight: 600, color: '#063A4B' }}>₹ {(cand.salary || 80000).toLocaleString('en-IN')}</td>
                <td>
                  <span className={`badge ${
                    cand.status === 'Employee Activated' ? 'badge-success' :
                    cand.status === 'Offer Letter Sent' ? 'badge-info' : 'badge-warning'
                  }`}>
                    {cand.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleGenerateOffer(cand)}
                      className="btn-primary"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      <Send size={14} />
                      <span>Send Offer Letter</span>
                    </button>
                    <button
                      onClick={() => downloadOfferPDF(cand)}
                      className="btn-secondary"
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                      title="Download PDF Offer Letter"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Active Employee Management HR Uploaded Document Repository (ONLY VISIBLE FOR ADMIN ROLE) */}
      {isAdmin && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#063A4B', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
                <ShieldCheck size={20} color="#09637E" />
                <span>Active Employee Management - HR Uploaded Documents</span>
              </h3>
              <p style={{ color: '#09637E', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                Synchronized view of all active employees (Alex Rivera, Sarah Connor, Michael Chen, Priya Sharma) and their HR uploaded verification documents.
              </p>
            </div>
            <span className="badge badge-success">✓ 100% Synced Directory</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.2rem' }}>
            {employeeDocsList.map((emp) => (
              <div key={emp._id} style={{ background: '#FFFFFF', border: '1px solid #7AB2B2', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', boxShadow: '0 2px 8px rgba(9,99,126,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ color: '#063A4B', fontSize: '1rem', fontWeight: 700 }}>{emp.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: '#09637E' }}>{emp.designation} ({emp.employeeId})</span>
                  </div>
                  <span className="badge badge-info">{emp.departmentName}</span>
                </div>

                <div style={{ background: '#EBF4F6', border: '1px solid #7AB2B2', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.82rem', color: '#09637E', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>HR Uploaded Verification Docs:</span>
                  <strong style={{ color: '#088395' }}>{emp.documents?.length || 0} Documents</strong>
                </div>

                <button
                  onClick={() => openDocViewer(emp, emp.documents, 'Active Employee')}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.6rem', fontSize: '0.85rem' }}
                >
                  <Eye size={16} />
                  <span>View & Audit Documents for {emp.name.split(' ')[0]}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin / HR Document Viewer Modal */}
      {showDocsViewerModal && activeDocSubject && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <div>
                <h2 style={{ color: '#063A4B' }}>Uploaded Document Verification - {activeDocSubject.name}</h2>
                <span style={{ fontSize: '0.85rem', color: '#09637E' }}>
                  {activeDocSubject.type}: {activeDocSubject.role} | Dept: {activeDocSubject.department}
                </span>
              </div>
              <button onClick={() => setShowDocsViewerModal(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#EBF4F6', border: '1px solid #7AB2B2', padding: '1rem', borderRadius: '12px', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <ShieldCheck size={24} color="#09637E" />
              <div>
                <div style={{ fontWeight: 700, color: '#063A4B', fontSize: '0.92rem' }}>Admin Document Audit & Compliance View</div>
                <div style={{ fontSize: '0.82rem', color: '#09637E' }}>
                  Reviewing all official verification files uploaded by HR for <strong>{activeDocSubject.name}</strong> ({activeDocSubject.email}).
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '320px', overflowY: 'auto' }}>
              {activeDocSubject.documents && activeDocSubject.documents.length > 0 ? (
                activeDocSubject.documents.map((doc) => (
                  <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem', background: '#ffffff', border: '1px solid #E6F2DD', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div style={{ background: '#E6F2DD', padding: '0.6rem', borderRadius: '8px', color: '#659287' }}>
                        <FileText size={22} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#1C2D27', fontSize: '0.95rem' }}>{doc.title}</div>
                        <div style={{ fontSize: '0.8rem', color: '#566E65' }}>
                          File: <strong>{doc.fileName}</strong> | Category: <span className="badge badge-info" style={{ padding: '0.1rem 0.4rem', fontSize: '0.72rem' }}>{doc.category}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#659287', marginTop: '0.1rem' }}>
                          Uploaded by: {doc.uploadedBy} on {doc.uploadDate} ({doc.fileSize})
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Downloading verified document for ${activeDocSubject.name}: ${doc.fileName}`)}
                      className="btn-secondary"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.4rem' }}
                    >
                      <Download size={14} />
                      <span>Download</span>
                    </button>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#566E65', background: '#F5FBF3', borderRadius: '8px' }}>
                  No documents uploaded yet by HR for {activeDocSubject.name}.
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.2rem' }}>
              <button onClick={() => setShowDocsViewerModal(false)} className="btn-secondary">Close Viewer</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Candidate Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Register Selected Candidate</h2>
              <button onClick={() => setShowAddModal(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCandidate} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">
                    <span>Candidate Name</span>
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className={errors.candidateName ? 'input-error' : ''}
                    value={formData.candidateName}
                    onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                  />
                  {errors.candidateName && <span className="error-hint">{errors.candidateName}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Email Address</span>
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="email"
                    className={errors.candidateEmail ? 'input-error' : ''}
                    value={formData.candidateEmail}
                    onChange={(e) => setFormData({ ...formData, candidateEmail: e.target.value })}
                  />
                  {errors.candidateEmail && <span className="error-hint">{errors.candidateEmail}</span>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">
                    <span>Position Offered</span>
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className={errors.position ? 'input-error' : ''}
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  />
                  {errors.position && <span className="error-hint">{errors.position}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  >
                    <option value="Engineering & AI">Engineering & AI</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Marketing & Sales">Marketing & Sales</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Expected Joining Date</label>
                  <input
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Offered Monthly Salary (₹)</span>
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="number"
                    className={errors.salary ? 'input-error' : ''}
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  />
                  {errors.salary && <span className="error-hint">{errors.salary}</span>}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Add Candidate</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Offer Letter Preview Modal */}
      {showOfferModal && selectedCandidate && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '720px' }}>
            <div className="modal-header">
              <h2>Official Offer Letter Preview</h2>
              <button onClick={() => setShowOfferModal(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <div style={{ border: '2px dashed #659287', padding: '1.8rem', borderRadius: '12px', background: '#ffffff', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #E6F2DD', paddingBottom: '1rem', marginBottom: '1.2rem' }}>
                <div>
                  <h2 style={{ color: '#659287' }}>NEUZEN AI</h2>
                  <span style={{ fontSize: '0.8rem', color: '#566E65' }}>EMPLOYMENT OFFER LETTER</span>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#566E65' }}>
                  Ref: {selectedCandidate.offerLetterNumber}<br />
                  Date: {new Date().toLocaleDateString()}
                </div>
              </div>

              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '0.8rem' }}>
                Dear <strong>{selectedCandidate.candidateName}</strong>,
              </p>

              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                We are thrilled to offer you the position of <strong>{selectedCandidate.position}</strong> at <strong>NEUZEN AI</strong>. Your joining date is scheduled for <strong>{selectedCandidate.joiningDate}</strong>.
              </p>

              <div style={{ background: '#F5FBF3', padding: '1rem', borderRadius: '8px', marginBottom: '1.2rem' }}>
                <div><strong>Monthly Compensation:</strong> ₹ {(selectedCandidate.salary || 85000).toLocaleString('en-IN')}</div>
                <div><strong>Benefits Package:</strong> Health Insurance, Flex Benefits, Annual Bonus</div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontStyle: 'italic', color: '#659287', fontWeight: 700 }}>Sarah Connor</div>
                  <div style={{ fontSize: '0.8rem', color: '#566E65' }}>Head of HR, NEUZEN AI</div>
                </div>
                <div style={{ border: '1px solid #2E7D32', padding: '0.4rem 0.8rem', borderRadius: '6px', color: '#2E7D32', fontSize: '0.8rem', fontWeight: 700 }}>
                  ✓ Digitally Verified
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
              <button onClick={() => downloadOfferPDF(selectedCandidate)} className="btn-secondary">
                <Download size={18} />
                <span>Download PDF</span>
              </button>
              <button onClick={() => { alert(`Offer letter emailed to ${selectedCandidate.candidateEmail}`); setShowOfferModal(false); }} className="btn-primary">
                <Send size={18} />
                <span>Dispatch Email</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
