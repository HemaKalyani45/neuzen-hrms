import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useHRMSData } from '../../context/HRMSDataContext';
import { Users, Plus, Search, Filter, Edit3, Trash2, Download, Shield, X, Upload, FileText, CheckCircle, Eye } from 'lucide-react';

export default function EmployeeManagement() {
  const { hasRole, user } = useAuth();
  const { employees, setEmployees, addEmployeeDocument, deleteEmployee, updateEmployee } = useHRMSData();
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const [showModal, setShowModal] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);

  // Upload Document Modal State
  const [showDocModal, setShowDocModal] = useState(false);
  const [selectedEmpForDoc, setSelectedEmpForDoc] = useState(null);
  const [docFormData, setDocFormData] = useState({
    title: '',
    category: 'Offer Letter',
    fileName: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    departmentName: 'Engineering & AI',
    joiningDate: new Date().toISOString().split('T')[0],
    salary: 75000,
    gender: 'Male',
    address: '',
    manager: 'Sarah Connor'
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is mandatory.';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is mandatory.';
    if (!formData.phone.trim()) errs.phone = 'Phone number is mandatory.';
    if (!formData.designation.trim()) errs.designation = 'Designation is mandatory.';
    if (Number(formData.salary) <= 0) errs.salary = 'Salary must be a positive number.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingEmp) {
        await api.put(`/employees/${editingEmp._id}`, formData);
      } else {
        await api.post('/employees', formData);
      }
    } catch (err) {}

    if (editingEmp) {
      updateEmployee(editingEmp._id, { ...formData, salary: Number(formData.salary) });
    } else {
      const newEmp = {
        _id: `emp_${Date.now()}`,
        employeeId: `NZ-${1000 + employees.length + 1}`,
        ...formData,
        salary: Number(formData.salary),
        documents: [
          { id: `doc_${Date.now()}`, title: 'Employment Offer Letter', category: 'Offer Letter', fileName: `Offer_Letter_${formData.name.replace(/\s+/g, '_')}.pdf`, uploadDate: new Date().toISOString().split('T')[0], uploadedBy: user?.name || 'Sarah Connor (HR)', fileSize: '1.2 MB' }
        ]
      };
      setEmployees(prev => [newEmp, ...prev]);
    }

    setShowModal(false);
    setEditingEmp(null);
    setErrors({});
  };

  const openDocUploadModal = (emp) => {
    setSelectedEmpForDoc(emp);
    setDocFormData({
      title: '',
      category: 'Offer Letter',
      fileName: ''
    });
    setShowDocModal(true);
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!docFormData.title.trim()) {
      alert('Document title is mandatory.');
      return;
    }

    const fileName = docFormData.fileName || `${docFormData.title.replace(/\s+/g, '_')}.pdf`;

    try {
      await api.post(`/employees/${selectedEmpForDoc._id}/documents`, {
        title: docFormData.title,
        category: docFormData.category,
        fileName
      });
    } catch (err) {}

    const newDoc = {
      id: `doc_${Date.now()}`,
      title: docFormData.title,
      category: docFormData.category,
      fileName,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: user?.name || 'Sarah Connor (HR)',
      fileSize: '1.5 MB'
    };

    // Update shared context — reflects in Admin Onboarding view too
    addEmployeeDocument(selectedEmpForDoc._id, newDoc);

    setSelectedEmpForDoc(prev => ({
      ...prev,
      documents: [newDoc, ...(prev.documents || [])]
    }));

    setDocFormData({ title: '', category: 'Offer Letter', fileName: '' });
    alert(`Document "${docFormData.title}" uploaded successfully by HR! It is now accessible under Employee Onboarding.`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee record?')) {
      try {
        await api.delete(`/employees/${id}`);
      } catch (err) {}
      deleteEmployee(id);
    }
  };

  const openAddModal = () => {
    setEditingEmp(null);
    setErrors({});
    setFormData({
      name: '',
      email: '',
      phone: '',
      designation: '',
      departmentName: 'Engineering & AI',
      joiningDate: new Date().toISOString().split('T')[0],
      salary: 75000,
      gender: 'Male',
      address: '',
      manager: 'Sarah Connor'
    });
    setShowModal(true);
  };

  const openEditModal = (emp) => {
    setEditingEmp(emp);
    setErrors({});
    setFormData({
      name: emp.name || '',
      email: emp.email || '',
      phone: emp.phone || '',
      designation: emp.designation || '',
      departmentName: emp.departmentName || 'Engineering & AI',
      joiningDate: emp.joiningDate || '',
      salary: emp.salary || 60000,
      gender: emp.gender || 'Male',
      address: emp.address || '',
      manager: emp.manager || 'Sarah Connor'
    });
    setShowModal(true);
  };

  const exportCSV = () => {
    const headers = ['Employee ID,Name,Email,Department,Designation,Salary,Joining Date,Documents Count\n'];
    const rows = filteredEmployees.map(e => `${e.employeeId},"${e.name}",${e.email},${e.departmentName},${e.designation},${e.salary},${e.joiningDate},${e.documents?.length || 0}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Employee_Directory_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name?.toLowerCase().includes(search.toLowerCase()) ||
                          emp.email?.toLowerCase().includes(search.toLowerCase()) ||
                          emp.employeeId?.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.departmentName === selectedDept;
    return matchesSearch && matchesDept;
  });

  const isHR = hasRole('HR');
  const isAdmin = hasRole('Admin');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#063A4B' }}>Employee Directory & Management</h1>
          <p style={{ color: '#09637E', fontSize: '0.95rem' }}>
            {isHR 
              ? 'HR Management Portal: Manage employee records, add new staff, and upload official verification documents.' 
              : 'Admin Supervision Portal: View employee directory, inspect HR-uploaded verification documents, and audit profiles.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button onClick={exportCSV} className="btn-secondary">
            <Download size={18} />
            <span>Export CSV</span>
          </button>
          {hasRole('Admin', 'HR') && (
            <button onClick={openAddModal} className="btn-primary">
              <Plus size={18} />
              <span>Add Employee</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#566E65' }} />
          <input
            type="text"
            placeholder="Search by name, email, or employee ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.8rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} color="#566E65" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            style={{ padding: '0.75rem 1rem' }}
          >
            <option value="All">All Departments</option>
            <option value="Engineering & AI">Engineering & AI</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Product & Design">Product & Design</option>
            <option value="Marketing & Sales">Marketing & Sales</option>
          </select>
        </div>
      </div>

      {/* Employee Data Table */}
      <div className="custom-table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Salary (CTC)</th>
              <th>Uploaded Documents</th>
              <th>Joining Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp._id}>
                <td>
                  <span style={{ fontWeight: 700, color: '#659287' }}>{emp.employeeId}</span>
                </td>
                <td>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1C2D27' }}>{emp.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#566E65' }}>{emp.email}</div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-info">{emp.departmentName}</span>
                </td>
                <td>{emp.designation}</td>
                <td style={{ fontWeight: 600 }}>₹ {(emp.salary || 60000).toLocaleString('en-IN')}</td>
                <td>
                  <button
                    onClick={() => openDocUploadModal(emp)}
                    className="btn-secondary"
                    style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem', gap: '0.4rem' }}
                  >
                    <FileText size={14} color="#659287" />
                    <span>{emp.documents?.length || 0} Docs</span>
                  </button>
                </td>
                <td>{emp.joiningDate}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {/* ONLY HR can Upload Documents */}
                    {isHR ? (
                      <button
                        onClick={() => openDocUploadModal(emp)}
                        className="btn-primary"
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', gap: '0.3rem' }}
                        title="Upload Employee Verification Documents (HR Only)"
                      >
                        <Upload size={14} />
                        <span>Upload Doc</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => openDocUploadModal(emp)}
                        className="btn-secondary"
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', gap: '0.3rem' }}
                        title="Inspect HR Uploaded Documents"
                      >
                        <Eye size={14} />
                        <span>View Docs</span>
                      </button>
                    )}

                    <button onClick={() => openEditModal(emp)} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '6px' }}>
                      <Edit3 size={16} />
                    </button>
                    {isAdmin && (
                      <button onClick={() => handleDelete(emp._id)} className="btn-danger" style={{ padding: '0.4rem', borderRadius: '6px' }}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload Documents Modal */}
      {showDocModal && selectedEmpForDoc && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <div>
                <h2>{isHR ? 'Upload & Manage Documents' : 'Employee Verification Documents'} - {selectedEmpForDoc.name}</h2>
                <span style={{ fontSize: '0.85rem', color: '#566E65' }}>
                  Employee ID: {selectedEmpForDoc.employeeId} | Dept: {selectedEmpForDoc.departmentName}
                </span>
              </div>
              <button onClick={() => setShowDocModal(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            {/* Document Upload Form (ONLY VISIBLE FOR HR ROLE) */}
            {isHR ? (
              <form onSubmit={handleUploadDocument} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#F5FBF3', padding: '1.2rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', color: '#1C2D27', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Upload size={18} color="#659287" />
                  <span>Upload New Verification Document (HR Only)</span>
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Document Title <span className="required-star">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Offer Letter, Aadhaar Card, Passport"
                      value={docFormData.title}
                      onChange={(e) => setDocFormData({ ...docFormData, title: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Document Category</label>
                    <select
                      value={docFormData.category}
                      onChange={(e) => setDocFormData({ ...docFormData, category: e.target.value })}
                    >
                      <option value="Offer Letter">Offer Letter</option>
                      <option value="ID Proof">Identity Proof (Aadhaar / Passport)</option>
                      <option value="Contract">Employment Contract Agreement</option>
                      <option value="Experience">Relieving & Experience Certificate</option>
                      <option value="Education">University Degree Certificate</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Select File (PDF / DOCX / Image)</label>
                  <input
                    type="file"
                    onChange={(e) => {
                      const name = e.target.files && e.target.files[0] ? e.target.files[0].name : '';
                      if (name) setDocFormData({ ...docFormData, fileName: name });
                    }}
                    style={{ background: '#ffffff', padding: '0.5rem' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
                    <Upload size={16} />
                    <span>Upload & Store Document</span>
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ background: '#F5FBF3', borderLeft: '4px solid #659287', padding: '0.8rem 1rem', borderRadius: '8px', marginBottom: '1.2rem', fontSize: '0.88rem', color: '#566E65' }}>
                ℹ️ <strong>Admin Supervision View:</strong> Document uploading is managed exclusively by the HR Manager. As Admin, you can inspect and download all verified files below.
              </div>
            )}

            {/* List of Previously Uploaded Documents */}
            <h3 style={{ fontSize: '1rem', color: '#1C2D27', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} color="#659287" />
              <span>Uploaded HR Document Repository ({selectedEmpForDoc.documents?.length || 0})</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '220px', overflowY: 'auto' }}>
              {selectedEmpForDoc.documents && selectedEmpForDoc.documents.length > 0 ? (
                selectedEmpForDoc.documents.map((doc) => (
                  <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: '#ffffff', border: '1px solid #E6F2DD', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ background: '#E6F2DD', padding: '0.5rem', borderRadius: '8px', color: '#659287' }}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#1C2D27', fontSize: '0.9rem' }}>{doc.title}</div>
                        <div style={{ fontSize: '0.78rem', color: '#566E65' }}>
                          {doc.fileName} • {doc.category} • Uploaded by {doc.uploadedBy} on {doc.uploadDate}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Downloading ${doc.fileName} (Uploaded by HR)`)}
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem' }}
                    >
                      <Download size={14} />
                      <span>Download</span>
                    </button>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: '#566E65', background: '#F5FBF3', borderRadius: '8px' }}>
                  No documents uploaded yet for this employee.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Employee Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingEmp ? 'Edit Employee Profile' : 'Add New Employee'}</h2>
              <button onClick={() => setShowModal(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">
                    <span>Full Name</span>
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className={errors.name ? 'input-error' : ''}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {errors.name && <span className="error-hint">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Email Address</span>
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="email"
                    className={errors.email ? 'input-error' : ''}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {errors.email && <span className="error-hint">{errors.email}</span>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">
                    <span>Phone Number</span>
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className={errors.phone ? 'input-error' : ''}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  {errors.phone && <span className="error-hint">{errors.phone}</span>}
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
                  <label className="form-label">Department</label>
                  <select
                    value={formData.departmentName}
                    onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                  >
                    <option value="Engineering & AI">Engineering & AI</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Marketing & Sales">Marketing & Sales</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Monthly Salary (₹)</span>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Joining Date</label>
                  <input
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Employee Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
