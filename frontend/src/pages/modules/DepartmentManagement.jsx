import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Building2, Plus, Users, Edit3, Trash2, X } from 'lucide-react';

const initialDepartmentsList = [
  { _id: 'dept1', departmentName: 'Engineering & AI', managerName: 'Sarah Connor', employeeCount: 2, description: 'AI Research, Fullstack & Mobile Engineering' },
  { _id: 'dept2', departmentName: 'Human Resources', managerName: 'Sarah Connor', employeeCount: 1, description: 'Talent Acquisition, Employee Welfare & Payroll' },
  { _id: 'dept3', departmentName: 'Product & Design', managerName: 'Alex Rivera', employeeCount: 1, description: 'UI/UX Design, Product Management' },
  { _id: 'dept4', departmentName: 'Marketing & Sales', managerName: 'Admin System', employeeCount: 0, description: 'Digital Marketing & Enterprise Sales' }
];

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState(initialDepartmentsList);
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({
    departmentName: '',
    managerName: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      if (res.success && res.data && res.data.length > 0) {
        setDepartments(res.data);
      }
    } catch (e) {
      console.log('Loaded local departments');
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.departmentName.trim()) errs.departmentName = 'Department name is mandatory.';
    if (!formData.managerName.trim()) errs.managerName = 'Manager name is mandatory.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingDept) {
        await api.put(`/departments/${editingDept._id}`, formData);
      } else {
        await api.post('/departments', formData);
      }
    } catch (err) {}

    if (editingDept) {
      setDepartments(prev => prev.map(d => d._id === editingDept._id ? { ...d, ...formData } : d));
    } else {
      const newDept = {
        _id: `dept_${Date.now()}`,
        departmentName: formData.departmentName,
        managerName: formData.managerName,
        employeeCount: 0,
        description: formData.description || 'Operational department unit.'
      };
      setDepartments(prev => [newDept, ...prev]);
    }

    setShowModal(false);
    setEditingDept(null);
    setErrors({});
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await api.delete(`/departments/${id}`);
      } catch (err) {}
      setDepartments(prev => prev.filter(d => d._id !== id));
    }
  };

  const openAddModal = () => {
    setEditingDept(null);
    setErrors({});
    setFormData({ departmentName: '', managerName: '', description: '' });
    setShowModal(true);
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    setErrors({});
    setFormData({
      departmentName: dept.departmentName || '',
      managerName: dept.managerName || '',
      description: dept.description || ''
    });
    setShowModal(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#1C2D27' }}>Department Management</h1>
          <p style={{ color: '#566E65', fontSize: '0.95rem' }}>Organize organizational units, assigned department leads, and team counts.</p>
        </div>
        <button onClick={openAddModal} className="btn-primary">
          <Plus size={18} />
          <span>Add Department</span>
        </button>
      </div>

      {/* Grid of Departments */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {departments.map((dept) => (
          <div key={dept._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ background: 'rgba(101, 146, 135, 0.15)', padding: '0.75rem', borderRadius: '12px', color: '#659287' }}>
                  <Building2 size={24} />
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button onClick={() => openEditModal(dept)} className="btn-secondary" style={{ padding: '0.35rem', borderRadius: '6px' }}>
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => handleDelete(dept._id)} className="btn-danger" style={{ padding: '0.35rem', borderRadius: '6px' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h2 style={{ fontSize: '1.3rem', color: '#1C2D27', marginBottom: '0.4rem' }}>{dept.departmentName}</h2>
              <p style={{ color: '#566E65', fontSize: '0.88rem', marginBottom: '1.2rem', lineHeight: 1.4 }}>
                {dept.description || 'Department operational unit.'}
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(101, 146, 135, 0.15)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#566E65', display: 'block' }}>DEPARTMENT MANAGER</span>
                <strong style={{ fontSize: '0.9rem', color: '#1C2D27' }}>{dept.managerName || 'Unassigned'}</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#566E65', display: 'block' }}>STAFF COUNT</span>
                <span className="badge badge-info">{dept.employeeCount !== undefined ? dept.employeeCount : 0} Members</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Clean Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingDept ? 'Update Department' : 'Create New Department'}</h2>
              <button onClick={() => setShowModal(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div className="form-group">
                <label className="form-label">
                  <span>Department Name</span>
                  <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  className={errors.departmentName ? 'input-error' : ''}
                  placeholder="e.g. AI Research & Engineering"
                  value={formData.departmentName}
                  onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                />
                {errors.departmentName && <span className="error-hint">{errors.departmentName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Manager Name</span>
                  <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  className={errors.managerName ? 'input-error' : ''}
                  placeholder="e.g. Sarah Connor"
                  value={formData.managerName}
                  onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                />
                {errors.managerName && <span className="error-hint">{errors.managerName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows="3"
                  placeholder="Brief description of department scope..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Department</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
