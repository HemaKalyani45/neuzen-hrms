import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Shield, FileText, CheckCircle } from 'lucide-react';

export default function ProfileModule() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || 'Alex Rivera',
    email: user?.email || 'employee@neuzenai.com',
    employeeId: 'NZ-1001',
    phone: '+91 98765 43210',
    dob: '1994-06-15',
    gender: 'Male',
    address: '42 AI Innovation Way, Tech Park, Cyber City',
    department: 'Engineering & AI',
    designation: user?.role === 'Admin' ? 'System Administrator' : user?.role === 'HR' ? 'HR Manager' : 'Senior Full Stack Engineer',
    joiningDate: '2023-01-10',
    manager: 'Sarah Connor',
    emergencyContact: {
      name: 'Maria Rivera',
      relation: 'Spouse',
      phone: '+91 98765 00112'
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', color: '#1C2D27' }}>My Profile</h1>
        <p style={{ color: '#566E65', fontSize: '0.95rem' }}>Personal credentials, work details, emergency contacts, and verification records.</p>
      </div>

      {/* Header Banner Card */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.8rem', background: 'linear-gradient(135deg, #ffffff, #F5FBF3)' }}>
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #659287, #88BDA4)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          fontWeight: 800,
          boxShadow: '0 8px 20px rgba(101, 146, 135, 0.3)'
        }}>
          {profile.name.charAt(0)}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.3rem' }}>
            <h2 style={{ fontSize: '1.6rem', color: '#1C2D27' }}>{profile.name}</h2>
            <span className="badge badge-success">{profile.employeeId}</span>
            <span className="badge badge-info">{user?.role}</span>
          </div>

          <div style={{ color: '#566E65', fontSize: '0.95rem', fontWeight: 600 }}>
            {profile.designation} • {profile.department}
          </div>
        </div>
      </div>

      {/* Profile Sections Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Personal Details */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', color: '#1C2D27', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} color="#659287" />
            <span>Personal Information</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E6F2DD', paddingBottom: '0.4rem' }}>
              <span style={{ color: '#566E65' }}>Email Address:</span>
              <strong style={{ color: '#1C2D27' }}>{profile.email}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E6F2DD', paddingBottom: '0.4rem' }}>
              <span style={{ color: '#566E65' }}>Phone Number:</span>
              <strong style={{ color: '#1C2D27' }}>{profile.phone}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E6F2DD', paddingBottom: '0.4rem' }}>
              <span style={{ color: '#566E65' }}>Date of Birth:</span>
              <strong style={{ color: '#1C2D27' }}>{profile.dob}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E6F2DD', paddingBottom: '0.4rem' }}>
              <span style={{ color: '#566E65' }}>Gender:</span>
              <strong style={{ color: '#1C2D27' }}>{profile.gender}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#566E65' }}>Residential Address:</span>
              <strong style={{ color: '#1C2D27', textAlign: 'right', maxWidth: '220px' }}>{profile.address}</strong>
            </div>
          </div>
        </div>

        {/* Work & Employment Details */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', color: '#1C2D27', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={20} color="#659287" />
            <span>Employment & Emergency Contact</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E6F2DD', paddingBottom: '0.4rem' }}>
              <span style={{ color: '#566E65' }}>Department:</span>
              <strong style={{ color: '#1C2D27' }}>{profile.department}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E6F2DD', paddingBottom: '0.4rem' }}>
              <span style={{ color: '#566E65' }}>Joining Date:</span>
              <strong style={{ color: '#1C2D27' }}>{profile.joiningDate}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E6F2DD', paddingBottom: '0.4rem' }}>
              <span style={{ color: '#566E65' }}>Reporting Manager:</span>
              <strong style={{ color: '#1C2D27' }}>{profile.manager}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E6F2DD', paddingBottom: '0.4rem' }}>
              <span style={{ color: '#566E65' }}>Emergency Contact Name:</span>
              <strong style={{ color: '#1C2D27' }}>{profile.emergencyContact.name} ({profile.emergencyContact.relation})</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#566E65' }}>Emergency Contact Phone:</span>
              <strong style={{ color: '#1C2D27' }}>{profile.emergencyContact.phone}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
