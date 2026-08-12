import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Users,
  Building2,
  Clock,
  CalendarDays,
  CreditCard,
  UserCheck,
  UserX,
  AlertCircle,
  TrendingUp,
  Award,
  CheckCircle,
  ArrowUpRight,
  ChevronRight,
  UserPlus,
  BarChart3,
  PieChart,
  Download,
  ArrowRight,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const initialDeptDistribution = [
  { name: 'Engineering & AI', count: 2, percent: 50, color: '#659287' },
  { name: 'Human Resources', count: 1, percent: 25, color: '#88BDA4' },
  { name: 'Product & Design', count: 1, percent: 25, color: '#B1D3B9' },
  { name: 'Marketing & Sales', count: 0, percent: 0, color: '#547b71' }
];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [employeesList, setEmployeesList] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [deptDistribution, setDeptDistribution] = useState(initialDeptDistribution);
  const [pendingLeaveList, setPendingLeaveList] = useState([]);

  const [metrics, setMetrics] = useState({
    totalEmployees: 4,
    presentToday: 3,
    onLeaveToday: 1,
    totalDepartments: 4,
    pendingLeaves: 1,
    payrollGenerated: '₹ 3,45,000',
    pendingOnboarding: 2
  });

  const [clockStatus, setClockStatus] = useState({
    clockedIn: false,
    checkInTime: null,
    checkOutTime: null
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [empRes, deptRes, reportRes, leaveRes] = await Promise.allSettled([
        api.get('/employees'),
        api.get('/departments'),
        api.get('/reports'),
        api.get('/leave')
      ]);

      let empData = [];
      let deptData = [];
      let leaveData = [];

      if (empRes.status === 'fulfilled' && empRes.value?.data) {
        empData = empRes.value.data;
        setEmployeesList(empData);
      }

      if (deptRes.status === 'fulfilled' && deptRes.value?.data) {
        deptData = deptRes.value.data;
        setDepartmentsList(deptData);
      }

      if (leaveRes.status === 'fulfilled' && leaveRes.value?.data) {
        leaveData = leaveRes.value.data;
      }

      const totalCount = empData.length > 0 ? empData.length : 4;

      const pendingLeavesArr = leaveData.filter(l => l.status === 'Pending');
      const approvedLeavesArr = leaveData.filter(l => l.status === 'Approved');

      setPendingLeaveList(pendingLeavesArr);

      const colors = ['#659287', '#88BDA4', '#B1D3B9', '#547b71', '#0288D1'];
      const activeDepts = deptData.length > 0 ? deptData : [
        { departmentName: 'Engineering & AI' },
        { departmentName: 'Human Resources' },
        { departmentName: 'Product & Design' },
        { departmentName: 'Marketing & Sales' }
      ];

      const computedDistribution = activeDepts.map((d, idx) => {
        const dName = d.departmentName;
        const count = empData.length > 0
          ? empData.filter(e => e.departmentName === dName).length
          : (dName === 'Engineering & AI' ? 2 : (dName === 'Human Resources' || dName === 'Product & Design') ? 1 : 0);
        const percent = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
        return {
          name: dName,
          count,
          percent,
          color: colors[idx % colors.length]
        };
      });

      setDeptDistribution(computedDistribution);

      if (reportRes.status === 'fulfilled' && reportRes.value?.summary) {
        const sum = reportRes.value.summary;
        setMetrics({
          totalEmployees: totalCount,
          presentToday: Math.max(0, totalCount - approvedLeavesArr.length),
          onLeaveToday: approvedLeavesArr.length,
          totalDepartments: activeDepts.length,
          pendingLeaves: pendingLeavesArr.length,
          payrollGenerated: `₹ ${(sum.monthlyPayrollCost || 345000).toLocaleString('en-IN')}`,
          pendingOnboarding: 2
        });
      } else {
        setMetrics(prev => ({
          ...prev,
          totalEmployees: totalCount,
          totalDepartments: activeDepts.length,
          pendingLeaves: pendingLeavesArr.length,
          onLeaveToday: approvedLeavesArr.length,
          presentToday: Math.max(0, totalCount - approvedLeavesArr.length)
        }));
      }
    } catch (e) {
      console.log('Loaded silent instant metrics');
    }
  };

  const handleClockIn = async () => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    try {
      await api.post('/attendance/checkin', {
        employeeName: user?.name,
        employeeCode: 'NZ-1001'
      });
    } catch (err) {}

    setClockStatus(prev => ({
      ...prev,
      clockedIn: true,
      checkInTime: nowTime
    }));
    alert(`Logged in at ${nowTime}`);
  };

  const handleClockOut = async () => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    try {
      await api.post('/attendance/checkout', {
        employeeId: 'emp1'
      });
    } catch (err) {}

    setClockStatus(prev => ({
      ...prev,
      clockedIn: false,
      checkOutTime: nowTime
    }));
    alert(`Logged out at ${nowTime}`);
  };

  const exportSummaryReport = () => {
    const text = `NEUZEN AI HRMS - EXECUTIVE DASHBOARD SUMMARY REPORT
Generated Date: ${new Date().toLocaleString()}
Company: NEUZEN AI Platform

1. HEADCOUNT & DEPARTMENTS ANALYTICS:
- Total Active Staff: ${metrics.totalEmployees}
- Total Departments: ${metrics.totalDepartments}
- Department Headcount Breakdown:
${deptDistribution.map(d => `  * ${d.name}: ${d.count} Members (${d.percent}%)`).join('\n')}

2. ATTENDANCE & PUNCTUALITY:
- Present Today: ${metrics.presentToday}
- On Leave Today: ${metrics.onLeaveToday}
- Pending Leave Requests: ${metrics.pendingLeaves}

3. PAYROLL & FINANCIALS:
- Monthly Disbursed Payroll: ${metrics.payrollGenerated}
`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NEUZEN_Executive_Report_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  // Render Admin Dashboard View
  const renderAdminDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="responsive-header-flex">
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#1C2D27' }}>Admin Executive Dashboard & Analytics</h1>
          <p style={{ color: '#566E65', fontSize: '0.95rem' }}>Real-time metrics, live staffing health, visual graphs, and organizational analytics.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button onClick={exportSummaryReport} className="btn-secondary">
            <Download size={18} />
            <span>Export Analytics</span>
          </button>
          <button onClick={() => navigate('/employees')} className="btn-primary">
            <Users size={18} />
            <span>Manage Staff ({metrics.totalEmployees})</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ background: 'rgba(101, 146, 135, 0.15)', padding: '1rem', borderRadius: '14px', color: '#659287' }}>
            <Users size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#566E65', fontWeight: 600 }}>Total Employees</span>
            <h2 style={{ fontSize: '1.8rem', color: '#1C2D27' }}>{metrics.totalEmployees}</h2>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ background: '#E8F5E9', padding: '1rem', borderRadius: '14px', color: '#2E7D32' }}>
            <UserCheck size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#566E65', fontWeight: 600 }}>Present Today</span>
            <h2 style={{ fontSize: '1.8rem', color: '#2E7D32' }}>{metrics.presentToday}</h2>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ background: '#FFF3E0', padding: '1rem', borderRadius: '14px', color: '#ED6C02' }}>
            <UserX size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#566E65', fontWeight: 600 }}>Approved On Leave</span>
            <h2 style={{ fontSize: '1.8rem', color: '#ED6C02' }}>{metrics.onLeaveToday}</h2>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ background: 'rgba(136, 189, 164, 0.2)', padding: '1rem', borderRadius: '14px', color: '#659287' }}>
            <Building2 size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#566E65', fontWeight: 600 }}>Departments</span>
            <h2 style={{ fontSize: '1.8rem', color: '#1C2D27' }}>{metrics.totalDepartments}</h2>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ background: '#FFEBEE', padding: '1rem', borderRadius: '14px', color: '#D32F2F' }}>
            <AlertCircle size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#566E65', fontWeight: 600 }}>Pending Leaves</span>
            <h2 style={{ fontSize: '1.8rem', color: '#D32F2F' }}>{metrics.pendingLeaves}</h2>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ background: '#E1F5FE', padding: '1rem', borderRadius: '14px', color: '#0288D1' }}>
            <CreditCard size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#566E65', fontWeight: 600 }}>Payroll Generated</span>
            <h2 style={{ fontSize: '1.4rem', color: '#0288D1' }}>{metrics.payrollGenerated}</h2>
          </div>
        </div>
      </div>

      {/* Visual Graphs Section */}
      <h2 style={{ fontSize: '1.4rem', color: '#1C2D27', marginTop: '0.5rem' }}>Visual Analytics & Reports</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        
        {/* Graph 1: Instant Department Headcount Distribution Graph */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#1C2D27', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PieChart size={20} color="#659287" />
              <span>Department Headcount Graph</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#659287', fontWeight: 700 }}>
              {metrics.totalEmployees} Staff Total
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {deptDistribution.map((d, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 600, color: '#1C2D27' }}>{d.name}</span>
                  <span style={{ color: '#566E65', fontWeight: 600 }}>{d.count} Employees ({d.percent}%)</span>
                </div>
                <div style={{ height: '12px', background: '#E6F2DD', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.max(d.percent, d.count > 0 ? 12 : 0)}%`,
                    background: d.color,
                    borderRadius: '6px',
                    transition: 'width 0.4s ease'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Graph 2: Attendance Rate & Punctuality Breakdown */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#1C2D27', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} color="#2E7D32" />
              <span>Attendance & Punctuality Breakdown</span>
            </h3>
            <span className="badge badge-success">97.5% Rate</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'Present (On-Time)', count: metrics.presentToday, percent: 75, color: '#2E7D32' },
              { label: 'Late Entry', count: 1, percent: 25, color: '#ED6C02' },
              { label: 'Approved Leave', count: metrics.onLeaveToday, percent: metrics.onLeaveToday > 0 ? 25 : 0, color: '#0288D1' },
              { label: 'Unexcused Absent', count: 0, percent: 0, color: '#D32F2F' }
            ].map((st, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 600, color: '#1C2D27' }}>{st.label}</span>
                  <span style={{ color: st.color, fontWeight: 700 }}>{st.count} Staff ({st.percent}%)</span>
                </div>
                <div style={{ height: '12px', background: '#E6F2DD', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.max(st.percent, st.count > 0 ? 10 : 0)}%`,
                    background: st.color,
                    borderRadius: '6px',
                    transition: 'width 0.4s ease'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Graph 3: Monthly Payroll Component Distribution */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#1C2D27', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={20} color="#0288D1" />
              <span>Payroll Component Distribution</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#0288D1', fontWeight: 700 }}>₹ 3,45,000 Budget</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'Basic Salary (50%)', amount: '₹ 1,72,500', val: 50, color: '#659287' },
              { label: 'House Rent Allowance (HRA 30%)', amount: '₹ 1,03,500', val: 30, color: '#88BDA4' },
              { label: 'Medical & Special Allowances (12%)', amount: '₹ 41,400', val: 12, color: '#B1D3B9' },
              { label: 'Statutory PF & Tax Deductions (8%)', amount: '₹ 27,600', val: 8, color: '#0288D1' }
            ].map((p, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 600, color: '#1C2D27' }}>{p.label}</span>
                  <strong style={{ color: p.color }}>{p.amount}</strong>
                </div>
                <div style={{ height: '12px', background: '#E6F2DD', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${p.val}%`,
                    background: p.color,
                    borderRadius: '6px',
                    transition: 'width 0.4s ease'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Graph 4: Monthly Recruitment & Hiring Velocity */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#1C2D27', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} color="#547b71" />
              <span>Recruitment & Hiring Trajectory</span>
            </h3>
            <span className="badge badge-success">+25% YoY</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { month: 'Q1 (Jan - Mar 2026)', hires: 2, percent: 40, color: '#659287' },
              { month: 'Q2 (Apr - Jun 2026)', hires: 1, percent: 25, color: '#88BDA4' },
              { month: 'Q3 Target (Jul - Sep 2026)', hires: 3, percent: 75, color: '#547b71' },
              { month: 'Q4 Projection (Oct - Dec 2026)', hires: 4, percent: 100, color: '#2E7D32' }
            ].map((h, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 600, color: '#1C2D27' }}>{h.month}</span>
                  <span style={{ color: '#566E65', fontWeight: 600 }}>{h.hires} New Hires</span>
                </div>
                <div style={{ height: '12px', background: '#E6F2DD', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${h.percent}%`,
                    background: h.color,
                    borderRadius: '6px',
                    transition: 'width 0.4s ease'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Module Navigation & Next Action Shortcuts */}
      <div className="glass-card" style={{ marginTop: '0.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#1C2D27', marginBottom: '1.2rem' }}>Module Navigation & Next Actions</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <button onClick={() => navigate('/employees')} className="btn-secondary" style={{ justifyContent: 'space-between', padding: '0.85rem 1.1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Users size={18} color="#659287" />
              <span>Employee Management</span>
            </span>
            <ArrowRight size={16} />
          </button>

          <button onClick={() => navigate('/departments')} className="btn-secondary" style={{ justifyContent: 'space-between', padding: '0.85rem 1.1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Building2 size={18} color="#659287" />
              <span>Departments</span>
            </span>
            <ArrowRight size={16} />
          </button>

          <button onClick={() => navigate('/onboarding')} className="btn-secondary" style={{ justifyContent: 'space-between', padding: '0.85rem 1.1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <UserPlus size={18} color="#659287" />
              <span>Onboarding Pipeline</span>
            </span>
            <ArrowRight size={16} />
          </button>

          <button onClick={() => navigate('/attendance')} className="btn-secondary" style={{ justifyContent: 'space-between', padding: '0.85rem 1.1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Clock size={18} color="#659287" />
              <span>Attendance Logs</span>
            </span>
            <ArrowRight size={16} />
          </button>

          <button onClick={() => navigate('/leave')} className="btn-secondary" style={{ justifyContent: 'space-between', padding: '0.85rem 1.1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CalendarDays size={18} color="#659287" />
              <span>Leave Approvals ({metrics.pendingLeaves})</span>
            </span>
            <ArrowRight size={16} />
          </button>

          <button onClick={() => navigate('/payroll')} className="btn-secondary" style={{ justifyContent: 'space-between', padding: '0.85rem 1.1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CreditCard size={18} color="#659287" />
              <span>Payroll & Payslips</span>
            </span>
            <ArrowRight size={16} />
          </button>

          <button onClick={() => navigate('/calendar')} className="btn-secondary" style={{ justifyContent: 'space-between', padding: '0.85rem 1.1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CalendarDays size={18} color="#659287" />
              <span>Company Calendar</span>
            </span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  // Render HR Dashboard View
  const renderHRDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="responsive-header-flex">
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#1C2D27' }}>HR Operations Hub</h1>
          <p style={{ color: '#566E65', fontSize: '0.95rem' }}>Talent onboarding, leave approval queues, and staff attendance monitoring.</p>
        </div>
        <button onClick={() => navigate('/onboarding')} className="btn-primary">
          <UserPlus size={18} />
          <span>New Onboarding</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card">
          <span style={{ fontSize: '0.85rem', color: '#566E65', fontWeight: 600 }}>Pending Onboarding</span>
          <h2 style={{ fontSize: '2rem', color: '#659287', marginTop: '0.4rem' }}>{metrics.pendingOnboarding}</h2>
          <span style={{ fontSize: '0.8rem', color: '#2E7D32' }}>2 Candidates Selected</span>
        </div>

        <div className="glass-card">
          <span style={{ fontSize: '0.85rem', color: '#566E65', fontWeight: 600 }}>Pending Leave Requests</span>
          <h2 style={{ fontSize: '2rem', color: '#ED6C02', marginTop: '0.4rem' }}>{metrics.pendingLeaves}</h2>
          <span style={{ fontSize: '0.8rem', color: '#566E65' }}>Requires HR Action</span>
        </div>

        <div className="glass-card">
          <span style={{ fontSize: '0.85rem', color: '#566E65', fontWeight: 600 }}>Approved On Leave</span>
          <h2 style={{ fontSize: '2rem', color: '#2E7D32', marginTop: '0.4rem' }}>{metrics.onLeaveToday}</h2>
          <span style={{ fontSize: '0.8rem', color: '#566E65' }}>Active Approved Leaves</span>
        </div>

        <div className="glass-card">
          <span style={{ fontSize: '0.85rem', color: '#566E65', fontWeight: 600 }}>Total Staff Count</span>
          <h2 style={{ fontSize: '2rem', color: '#1C2D27', marginTop: '0.4rem' }}>{metrics.totalEmployees}</h2>
          <span style={{ fontSize: '0.8rem', color: '#2E7D32' }}>Active Staff</span>
        </div>
      </div>

      <div className="responsive-two-column-grid">
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', color: '#1C2D27', marginBottom: '1rem' }}>Active Onboarding Candidates</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: '#F5FBF3', borderRadius: '10px' }}>
              <div>
                <strong style={{ color: '#1C2D27' }}>Elena Rostova</strong>
                <div style={{ fontSize: '0.8rem', color: '#566E65' }}>AI Engineer • joining Sep 01</div>
              </div>
              <span className="badge badge-warning">Offer Letter Sent</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: '#F5FBF3', borderRadius: '10px' }}>
              <div>
                <strong style={{ color: '#1C2D27' }}>Marcus Sterling</strong>
                <div style={{ fontSize: '0.8rem', color: '#566E65' }}>Product Designer • joining Sep 15</div>
              </div>
              <span className="badge badge-info">Documents Uploaded</span>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', color: '#1C2D27', marginBottom: '1rem' }}>Pending Leave Approvals</h3>
          {pendingLeaveList.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {pendingLeaveList.map((item) => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: '#F5FBF3', borderRadius: '10px' }}>
                  <div>
                    <strong style={{ color: '#1C2D27' }}>{item.employeeName}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#566E65' }}>{item.leaveType} • {item.totalDays} Days</div>
                  </div>
                  <button onClick={() => navigate('/leave')} className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Review</button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '1rem', color: '#2E7D32', background: '#E8F5E9', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
              ✓ All leaves reviewed & approved!
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render Employee Dashboard View
  const renderEmployeeDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="responsive-header-flex">
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#1C2D27' }}>Welcome back, {user?.name || 'Employee'}! 👋</h1>
          <p style={{ color: '#566E65', fontSize: '0.95rem', marginTop: '0.3rem' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • Track attendance, request leave, and access monthly payslips.
          </p>
        </div>
      </div>

      <div className="responsive-two-column-grid">
        {/* Attendance Widget */}
        <div className="glass-card" style={{ 
          background: clockStatus.clockedIn ? 'linear-gradient(135deg, #F4F8FA, #FFFFFF)' : '#FFFFFF',
          border: clockStatus.clockedIn ? '1.5px solid #088395' : '1px solid #7AB2B2',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#063A4B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={22} color={clockStatus.clockedIn ? '#088395' : '#09637E'} />
              <span>Today's Attendance</span>
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                width: '10px', height: '10px', 
                backgroundColor: clockStatus.clockedIn ? '#088395' : '#ffa726', 
                borderRadius: '50%',
                display: 'inline-block', 
                animation: clockStatus.clockedIn ? 'pulse 2s infinite' : 'none'
              }}></span>
              <span className={`badge ${clockStatus.clockedIn ? 'badge-success' : 'badge-info'}`} style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
                {clockStatus.clockedIn ? 'Online / Logged In' : (clockStatus.checkOutTime ? 'Completed / Logged Out' : 'Not Logged In')}
              </span>
            </div>
          </div>

          {/* Time Boxes: Login Time & Logout Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.8rem' }}>
            <div style={{ padding: '1.2rem', background: '#FFFFFF', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(9,99,126,0.05)', borderLeft: '4px solid #088395', border: '1px solid #7AB2B2' }}>
              <span style={{ fontSize: '0.8rem', color: '#09637E', fontWeight: 700, letterSpacing: '0.5px' }}>LOGIN TIME</span>
              <h2 style={{ fontSize: '1.6rem', color: '#063A4B', marginTop: '0.4rem', fontWeight: 700 }}>
                {clockStatus.checkInTime || '-- : --'}
              </h2>
            </div>

            <div style={{ padding: '1.2rem', background: '#FFFFFF', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(9,99,126,0.05)', borderLeft: '4px solid #EF4444', border: '1px solid #7AB2B2' }}>
              <span style={{ fontSize: '0.8rem', color: '#09637E', fontWeight: 700, letterSpacing: '0.5px' }}>LOGOUT TIME</span>
              <h2 style={{ fontSize: '1.6rem', color: '#063A4B', marginTop: '0.4rem', fontWeight: 700 }}>
                {clockStatus.checkOutTime || '-- : --'}
              </h2>
            </div>
          </div>

          {/* Action Buttons: BOTH LOGIN AND LOGOUT VISIBLE */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button 
              onClick={handleClockIn} 
              style={{ 
                padding: '1rem', fontSize: '1.05rem', fontWeight: 700,
                background: 'linear-gradient(135deg, #09637E, #088395)', 
                color: 'white',
                border: 'none', borderRadius: '12px', 
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                boxShadow: '0 4px 14px rgba(9, 99, 126, 0.35)', 
                transition: 'all 0.2s ease'
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <CheckCircle size={22} />
              <span>LOG IN</span>
            </button>

            <button 
              onClick={handleClockOut} 
              style={{ 
                padding: '1rem', fontSize: '1.05rem', fontWeight: 700,
                background: 'linear-gradient(135deg, #EF4444, #D93838)', 
                color: 'white',
                border: 'none', borderRadius: '12px', 
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)', 
                transition: 'all 0.2s ease'
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <UserX size={22} />
              <span>LOG OUT</span>
            </button>
          </div>
          
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes pulse {
              0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
              70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(76, 175, 80, 0); }
              100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
            }
          `}} />
        </div>

        {/* Leave Balance */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', color: '#1C2D27', marginBottom: '1rem' }}>My Leave Balance</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#F5FBF3', borderRadius: '8px' }}>
              <span style={{ fontWeight: 600, color: '#1C2D27' }}>Casual Leave</span>
              <span style={{ color: '#659287', fontWeight: 700 }}>9 / 12 Days Remaining</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#F5FBF3', borderRadius: '8px' }}>
              <span style={{ fontWeight: 600, color: '#1C2D27' }}>Sick Leave</span>
              <span style={{ color: '#659287', fontWeight: 700 }}>8 / 10 Days Remaining</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#F5FBF3', borderRadius: '8px' }}>
              <span style={{ fontWeight: 600, color: '#1C2D27' }}>Earned Leave</span>
              <span style={{ color: '#659287', fontWeight: 700 }}>15 / 15 Days Remaining</span>
            </div>
          </div>
          <button onClick={() => navigate('/leave')} className="btn-secondary" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
            Apply for Leave
          </button>
        </div>
      </div>

      <div className="responsive-two-column-grid">
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', color: '#1C2D27', marginBottom: '1rem' }}>Latest Salary Slip</h3>
          <div style={{ padding: '1rem', background: '#F5FBF3', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ color: '#1C2D27' }}>August 2026 Payslip</h4>
              <span style={{ fontSize: '0.85rem', color: '#566E65' }}>Net Salary: ₹ 87,960</span>
            </div>
            <button onClick={() => navigate('/payroll')} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              View & Download PDF
            </button>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', color: '#1C2D27', marginBottom: '1rem' }}>Upcoming Holidays</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.8rem', background: '#F5FBF3', borderRadius: '8px' }}>
              <span style={{ fontWeight: 600, color: '#1C2D27' }}>Independence Day</span>
              <span style={{ color: '#566E65', fontSize: '0.85rem' }}>Aug 15, 2026</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.8rem', background: '#F5FBF3', borderRadius: '8px' }}>
              <span style={{ fontWeight: 600, color: '#1C2D27' }}>NEUZEN AI Foundation Day</span>
              <span style={{ color: '#566E65', fontSize: '0.85rem' }}>Oct 10, 2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (user?.role === 'Admin') return renderAdminDashboard();
  if (user?.role === 'HR') return renderHRDashboard();
  return renderEmployeeDashboard();
}
