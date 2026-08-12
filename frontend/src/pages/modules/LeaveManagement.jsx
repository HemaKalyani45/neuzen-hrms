import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { CalendarDays, Plus, CheckCircle, XCircle, Clock, X } from 'lucide-react';

const initialLeavesList = [
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

export default function LeaveManagement() {
  const { user, hasRole } = useAuth();
  const [leaves, setLeaves] = useState(initialLeavesList);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [reviewComments, setReviewComments] = useState('');

  const [formData, setFormData] = useState({
    leaveType: 'Casual Leave',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchLeaves();
  }, []);

  const saveLeaves = (newLeaves) => {
    setLeaves(newLeaves);
    localStorage.setItem('neuzen_leaves', JSON.stringify(newLeaves));
  };

  const fetchLeaves = async () => {
    try {
      const stored = localStorage.getItem('neuzen_leaves');
      if (stored) {
        setLeaves(JSON.parse(stored));
      } else {
        setLeaves(initialLeavesList);
        localStorage.setItem('neuzen_leaves', JSON.stringify(initialLeavesList));
      }
    } catch (e) {
      console.log('Error loading local leave applications');
    }
  };

  const validateApplyForm = () => {
    const errs = {};
    if (!formData.startDate) errs.startDate = 'Start date is mandatory.';
    if (!formData.endDate) errs.endDate = 'End date is mandatory.';
    if (!formData.reason.trim()) errs.reason = 'Reason for leave is mandatory.';
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      errs.endDate = 'End date cannot be prior to start date.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!validateApplyForm()) return;

    try {
      await api.post('/leave', {
        ...formData,
        employeeName: user?.name
      });
    } catch (err) {}

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end - start);
    const calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newLeave = {
      _id: `lve_${Date.now()}`,
      employeeId: 'emp1',
      employeeName: user?.name || 'Alex Rivera',
      leaveType: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalDays: calculatedDays,
      reason: formData.reason,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0]
    };

    saveLeaves([newLeave, ...leaves]);
    setShowApplyModal(false);
    setFormData({
      leaveType: 'Casual Leave',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      reason: ''
    });
    setErrors({});
    alert('Leave application submitted! Pending HR review.');
  };

  const handleReviewAction = async (status) => {
    if (!selectedLeave) return;
    try {
      await api.put(`/leave/${selectedLeave._id}`, {
        status,
        comments: reviewComments,
        approvedBy: `${user?.name} (${user?.role})`
      });
    } catch (err) {}

    const updatedLeaves = leaves.map(l => {
      if (l._id === selectedLeave._id) {
        return { ...l, status, comments: reviewComments, approvedBy: `${user?.name || 'Admin'} (${user?.role || 'Admin'})` };
      }
      return l;
    });
    saveLeaves(updatedLeaves);

    setShowReviewModal(false);
    setSelectedLeave(null);
    setReviewComments('');
  };

  const openReviewModal = (leave) => {
    setSelectedLeave(leave);
    setReviewComments(leave.comments || '');
    setShowReviewModal(true);
  };

  const displayedLeaves = (hasRole('Admin') || hasRole('HR')) 
    ? leaves 
    : leaves.filter(l => l.employeeName?.toLowerCase().includes(user?.name?.toLowerCase() || ''));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="responsive-header-flex">
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#063A4B' }}>Leave Management</h1>
          <p style={{ color: '#09637E', fontSize: '0.95rem' }}>Submit leave requests, review pending applications, and manage leave balances.</p>
        </div>
        <button onClick={() => { setErrors({}); setShowApplyModal(true); }} className="btn-primary">
          <Plus size={18} />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Leave Balance Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ background: '#EBF4F6', border: '1px solid #7AB2B2', boxShadow: '0 4px 15px rgba(9, 99, 126, 0.06)' }}>
          <span style={{ fontSize: '0.85rem', color: '#09637E', fontWeight: 700, letterSpacing: '0.02em' }}>Casual Leave (CL)</span>
          <h2 style={{ fontSize: '1.8rem', color: '#09637E', marginTop: '0.3rem', fontWeight: 800 }}>9 / 12 Days</h2>
          <span style={{ fontSize: '0.8rem', color: '#063A4B', fontWeight: 600 }}>Available Balance</span>
        </div>

        <div className="glass-card" style={{ background: '#EBF4F6', border: '1px solid #7AB2B2', boxShadow: '0 4px 15px rgba(9, 99, 126, 0.06)' }}>
          <span style={{ fontSize: '0.85rem', color: '#088395', fontWeight: 700, letterSpacing: '0.02em' }}>Sick Leave (SL)</span>
          <h2 style={{ fontSize: '1.8rem', color: '#088395', marginTop: '0.3rem', fontWeight: 800 }}>8 / 10 Days</h2>
          <span style={{ fontSize: '0.8rem', color: '#063A4B', fontWeight: 600 }}>Available Balance</span>
        </div>

        <div className="glass-card" style={{ background: '#EBF4F6', border: '1px solid #7AB2B2', boxShadow: '0 4px 15px rgba(9, 99, 126, 0.06)' }}>
          <span style={{ fontSize: '0.85rem', color: '#09637E', fontWeight: 700, letterSpacing: '0.02em' }}>Earned Leave (EL)</span>
          <h2 style={{ fontSize: '1.8rem', color: '#063A4B', marginTop: '0.3rem', fontWeight: 800 }}>15 / 15 Days</h2>
          <span style={{ fontSize: '0.8rem', color: '#063A4B', fontWeight: 600 }}>Available Balance</span>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="custom-table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Leave Type</th>
              <th>Date Range</th>
              <th>Duration</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Reviewed By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedLeaves.map((lve) => (
              <tr key={lve._id}>
                <td><strong style={{ color: '#063A4B' }}>{lve.employeeName}</strong></td>
                <td><span className="badge badge-info">{lve.leaveType}</span></td>
                <td>{lve.startDate} to {lve.endDate}</td>
                <td style={{ fontWeight: 600 }}>{lve.totalDays || 1} Days</td>
                <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lve.reason}</td>
                <td>
                  <span style={{
                    padding: '0.3rem 0.6rem',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    display: 'inline-block',
                    background: lve.status === 'Approved' ? '#E8F5E9' : lve.status === 'Rejected' ? '#FFEBEE' : '#FFF3E0',
                    color: lve.status === 'Approved' ? '#2E7D32' : lve.status === 'Rejected' ? '#C62828' : '#E65100'
                  }}>
                    {lve.status}
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem', color: '#566E65' }}>{lve.approvedBy || '--'}</td>
                <td>
                  {(hasRole('Admin') || hasRole('HR')) ? (
                    lve.status === 'Pending' ? (
                      <button onClick={() => openReviewModal(lve)} className="btn-primary" style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}>
                        Review
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#566E65' }}>Complete</span>
                    )
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#566E65' }}>--</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Submit Leave Application</h2>
              <button onClick={() => setShowApplyModal(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div className="form-group">
                <label className="form-label">
                  <span>Leave Category</span>
                  <span className="required-star">*</span>
                </label>
                <select
                  value={formData.leaveType}
                  onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                >
                  <option value="Casual Leave">Casual Leave (CL)</option>
                  <option value="Sick Leave">Sick Leave (SL)</option>
                  <option value="Earned Leave">Earned Leave (EL)</option>
                  <option value="Maternity/Paternity">Maternity/Paternity</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">
                    <span>Start Date</span>
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="date"
                    className={errors.startDate ? 'input-error' : ''}
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                  {errors.startDate && <span className="error-hint">{errors.startDate}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>End Date</span>
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="date"
                    className={errors.endDate ? 'input-error' : ''}
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                  {errors.endDate && <span className="error-hint">{errors.endDate}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Reason for Leave</span>
                  <span className="required-star">*</span>
                </label>
                <textarea
                  rows="3"
                  className={errors.reason ? 'input-error' : ''}
                  placeholder="Provide explicit reasons for your leave application..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                ></textarea>
                {errors.reason && <span className="error-hint">{errors.reason}</span>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowApplyModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal for HR/Admin */}
      {showReviewModal && selectedLeave && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Review Leave Application</h2>
              <button onClick={() => setShowReviewModal(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#F5FBF3', padding: '1.2rem', borderRadius: '10px', marginBottom: '1.2rem', border: '1px solid rgba(101,146,135,0.2)' }}>
              <div><strong>Applicant:</strong> {selectedLeave.employeeName}</div>
              <div><strong>Category:</strong> {selectedLeave.leaveType}</div>
              <div><strong>Dates:</strong> {selectedLeave.startDate} to {selectedLeave.endDate} ({selectedLeave.totalDays} Days)</div>
              <div style={{ marginTop: '0.5rem' }}><strong>Reason:</strong> {selectedLeave.reason}</div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Reviewer Note / Feedback</label>
              <textarea
                rows="3"
                placeholder="Optional feedback for applicant..."
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
              ></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
              <button onClick={() => handleReviewAction('Rejected')} className="btn-danger">
                <XCircle size={18} />
                <span>Reject Application</span>
              </button>
              <button onClick={() => handleReviewAction('Approved')} className="btn-primary">
                <CheckCircle size={18} />
                <span>Approve Leave</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
