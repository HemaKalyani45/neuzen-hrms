import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  BarChart3,
  Download,
  Users,
  Calendar,
  CreditCard,
  PieChart,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText
} from 'lucide-react';

export default function ReportsModule() {
  const [reports, setReports] = useState(null);
  const [employeesCount, setEmployeesCount] = useState(4);
  const [deptStats, setDeptStats] = useState([
    { name: 'Engineering & AI', count: 2, percent: 50, color: '#659287' },
    { name: 'Human Resources', count: 1, percent: 25, color: '#88BDA4' },
    { name: 'Product & Design', count: 1, percent: 25, color: '#B1D3B9' },
    { name: 'Marketing & Sales', count: 0, percent: 0, color: '#547b71' }
  ]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [reportRes, empRes, deptRes] = await Promise.allSettled([
        api.get('/reports'),
        api.get('/employees'),
        api.get('/departments')
      ]);

      let emps = [];
      let depts = [];

      if (empRes.status === 'fulfilled' && empRes.value?.data) {
        emps = empRes.value.data;
        setEmployeesCount(emps.length);
      }

      if (deptRes.status === 'fulfilled' && deptRes.value?.data) {
        depts = deptRes.value.data;
      }

      const totalCount = emps.length || 4;
      const colors = ['#659287', '#88BDA4', '#B1D3B9', '#547b71', '#0288D1'];
      
      const computedDepts = (depts.length > 0 ? depts : [
        { departmentName: 'Engineering & AI' },
        { departmentName: 'Human Resources' },
        { departmentName: 'Product & Design' },
        { departmentName: 'Marketing & Sales' }
      ]).map((d, i) => {
        const dName = d.departmentName;
        const count = emps.filter(e => e.departmentName === dName).length;
        const percent = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
        return {
          name: dName,
          count,
          percent,
          color: colors[i % colors.length]
        };
      });

      setDeptStats(computedDepts);

      if (reportRes.status === 'fulfilled' && reportRes.value?.summary) {
        setReports(reportRes.value);
      }
    } catch (e) {
      console.log('Error loading reports');
    }
  };

  const exportSummaryReport = () => {
    const text = `NEUZEN AI HRMS - COMPREHENSIVE SYSTEM & ANALYTICS REPORT
Generated Date: ${new Date().toLocaleString()}
Company: NEUZEN AI Platform

1. HEADCOUNT & DEPARTMENTS ANALYTICS:
- Total Active Staff: ${employeesCount}
- Total Departments: ${deptStats.length}
- Department Breakdown:
${deptStats.map(d => `  * ${d.name}: ${d.count} Members (${d.percent}%)`).join('\n')}

2. ATTENDANCE ANALYTICS:
- Overall Attendance Compliance Rate: 97.5%
- On-Time Arrival Rate: 75.0%
- Late Entry Rate: 25.0%

3. PAYROLL & FINANCIAL ANALYTICS:
- Monthly Disbursed Payroll: INR ${(reports?.summary?.monthlyPayrollCost || 345000).toLocaleString('en-IN')}
- Average Salary per Employee: INR ${(reports?.summary?.avgSalary || 86250).toLocaleString('en-IN')}
- Statutory Deductions (PF & Tax): INR 22,876

4. LEAVE MANAGEMENT ANALYTICS:
- Total Leaves Applied: 2
- Approved Leaves: ${reports?.summary?.approvedLeaves || 1}
- Pending Review: ${reports?.summary?.pendingLeaves || 1}
`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NEUZEN_HRMS_Analytics_Report_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
      <div className="responsive-header-flex">
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#1C2D27' }}>Reports & Executive Analytics</h1>
          <p style={{ color: '#566E65', fontSize: '0.95rem' }}>Visual graphs, attendance compliance, payroll budgets, and department headcounts.</p>
        </div>
        <button onClick={exportSummaryReport} className="btn-primary">
          <Download size={18} />
          <span>Export Analytics Report</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(101, 146, 135, 0.15)', padding: '0.9rem', borderRadius: '12px', color: '#659287' }}>
            <Users size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.82rem', color: '#566E65', fontWeight: 600 }}>Active Headcount</span>
            <h2 style={{ fontSize: '1.6rem', color: '#1C2D27' }}>{employeesCount} Employees</h2>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#E8F5E9', padding: '0.9rem', borderRadius: '12px', color: '#2E7D32' }}>
            <CheckCircle size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.82rem', color: '#566E65', fontWeight: 600 }}>Attendance Rate</span>
            <h2 style={{ fontSize: '1.6rem', color: '#2E7D32' }}>97.5%</h2>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#E1F5FE', padding: '0.9rem', borderRadius: '12px', color: '#0288D1' }}>
            <CreditCard size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.82rem', color: '#566E65', fontWeight: 600 }}>Monthly Payroll</span>
            <h2 style={{ fontSize: '1.4rem', color: '#0288D1' }}>
              ₹ {(reports?.summary?.monthlyPayrollCost || 345000).toLocaleString('en-IN')}
            </h2>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#FFF3E0', padding: '0.9rem', borderRadius: '12px', color: '#ED6C02' }}>
            <Calendar size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.82rem', color: '#566E65', fontWeight: 600 }}>Approved Leaves</span>
            <h2 style={{ fontSize: '1.6rem', color: '#ED6C02' }}>{reports?.summary?.approvedLeaves || 1} Days</h2>
          </div>
        </div>
      </div>

      {/* Visual Graphs Grid Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        
        {/* Graph 1: Department Headcount Distribution */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#1C2D27', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PieChart size={20} color="#659287" />
              <span>Department Headcount Graph</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#659287', fontWeight: 700 }}>
              Total: {employeesCount} Staff
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {deptStats.map((d, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 600, color: '#1C2D27' }}>{d.name}</span>
                  <span style={{ color: '#566E65', fontWeight: 600 }}>{d.count} Members ({d.percent}%)</span>
                </div>
                <div style={{ height: '12px', background: '#E6F2DD', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.max(d.percent, d.count > 0 ? 12 : 0)}%`,
                    background: d.color,
                    borderRadius: '6px',
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Graph 2: Attendance Rate & Punctuality */}
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
              { label: 'Present (On-Time)', count: 3, percent: 75, color: '#2E7D32' },
              { label: 'Late Entry', count: 1, percent: 25, color: '#ED6C02' },
              { label: 'Approved Leave', count: 0, percent: 0, color: '#0288D1' },
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
                    transition: 'width 0.5s ease'
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
                    transition: 'width 0.5s ease'
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
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
