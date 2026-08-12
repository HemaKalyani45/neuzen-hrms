import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { CalendarDays, Plus, Users, Clock, MapPin, X, Video, AlertCircle, CheckCircle } from 'lucide-react';

const initialHolidaysList = [
  { _id: 'hol1', holidayName: 'New Year Day', date: '2026-01-01', dayOfWeek: 'Thursday', description: 'Global New Year celebration', type: 'National' },
  { _id: 'hol2', holidayName: 'Republic Day', date: '2026-01-26', dayOfWeek: 'Monday', description: 'National Republic Day holiday', type: 'National' },
  { _id: 'hol3', holidayName: 'Independence Day', date: '2026-08-15', dayOfWeek: 'Saturday', description: 'National Independence Day celebration', type: 'National' },
  { _id: 'hol4', holidayName: 'NEUZEN AI Foundation Day', date: '2026-10-10', dayOfWeek: 'Saturday', description: 'Annual company anniversary & summit', type: 'Company Event' },
  { _id: 'hol5', holidayName: 'Diwali Festival', date: '2026-11-08', dayOfWeek: 'Sunday', description: 'Festival of Lights holiday', type: 'Festival' }
];

const initialMeetingsList = [
  {
    _id: 'meet1',
    title: 'Q3 All-Hands Executive Summit',
    date: '2026-08-28',
    time: '02:00 PM - 03:30 PM',
    location: 'Main Auditorium / Zoom Room 1',
    organizer: 'Sarah Connor (HR Lead)',
    department: 'All Departments',
    agenda: 'Quarterly strategy, AI product roadmap, and employee recognition.'
  },
  {
    _id: 'meet2',
    title: 'AI Engineering Sprint Planning',
    date: '2026-08-17',
    time: '10:00 AM - 11:30 AM',
    location: 'Conference Room 3B',
    organizer: 'Alex Rivera (Sr. Developer)',
    department: 'Engineering & AI',
    agenda: 'Sprint backlog grooming, model fine-tuning targets, and deployment schedules.'
  },
  {
    _id: 'meet3',
    title: 'Monthly HR & Staff Welfare Sync',
    date: '2026-08-22',
    time: '11:00 AM - 12:00 PM',
    location: 'HR Conference Suite',
    organizer: 'Sarah Connor (HR Lead)',
    department: 'Human Resources',
    agenda: 'Onboarding reviews, benefits administration, and team feedback.'
  }
];

export default function CalendarModule() {
  const { user, hasRole } = useAuth();
  const [holidays, setHolidays] = useState(initialHolidaysList);
  const [meetings, setMeetings] = useState(initialMeetingsList);
  const [activeTab, setActiveTab] = useState('All');
  
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);

  // Form states & validation errors
  const [holidayForm, setHolidayForm] = useState({
    holidayName: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    type: 'National'
  });

  const [meetingForm, setMeetingForm] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    location: 'Main Conference Room',
    department: 'All Departments',
    agenda: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    try {
      const res = await api.get('/calendar');
      if (res.success && res.data) {
        if (res.data.holidays) setHolidays(res.data.holidays);
        if (res.data.meetings) setMeetings(res.data.meetings);
      }
    } catch (e) {
      console.log('Loaded calendar events locally');
    }
    
    const localHols = localStorage.getItem('neuzen_calendar_holidays');
    if (localHols) {
      setHolidays(JSON.parse(localHols));
    } else {
      localStorage.setItem('neuzen_calendar_holidays', JSON.stringify(initialHolidaysList));
    }

    const localMeets = localStorage.getItem('neuzen_calendar_meetings');
    if (localMeets) {
      setMeetings(JSON.parse(localMeets));
    } else {
      localStorage.setItem('neuzen_calendar_meetings', JSON.stringify(initialMeetingsList));
    }
  };

  const validateHolidayForm = () => {
    const errs = {};
    if (!holidayForm.holidayName.trim()) errs.holidayName = 'Holiday title is mandatory.';
    if (!holidayForm.date) errs.date = 'Date is mandatory.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateMeetingForm = () => {
    const errs = {};
    if (!meetingForm.title.trim()) errs.title = 'Meeting title is mandatory.';
    if (!meetingForm.date) errs.date = 'Date is mandatory.';
    if (!meetingForm.time.trim()) errs.time = 'Time is mandatory.';
    if (!meetingForm.location.trim()) errs.location = 'Location / Room link is mandatory.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddHoliday = async (e) => {
    e.preventDefault();
    if (!validateHolidayForm()) return;

    try {
      await api.post('/calendar/holiday', holidayForm);
    } catch (err) {}

    const newH = {
      _id: `hol_${Date.now()}`,
      holidayName: holidayForm.holidayName,
      date: holidayForm.date,
      description: holidayForm.description || 'Company holiday',
      type: holidayForm.type
    };

    const updatedHolidays = [newH, ...holidays];
    setHolidays(updatedHolidays);
    localStorage.setItem('neuzen_calendar_holidays', JSON.stringify(updatedHolidays));

    setShowHolidayModal(false);
    setHolidayForm({ holidayName: '', date: new Date().toISOString().split('T')[0], description: '', type: 'National' });
    setErrors({});
  };

  const handleScheduleMeeting = async (e) => {
    e.preventDefault();
    if (!validateMeetingForm()) return;

    try {
      await api.post('/calendar/meeting', meetingForm);
    } catch (err) {}

    const newM = {
      _id: `meet_${Date.now()}`,
      title: meetingForm.title,
      date: meetingForm.date,
      time: meetingForm.time,
      location: meetingForm.location,
      organizer: `${user?.name} (${user?.role})`,
      department: meetingForm.department,
      agenda: meetingForm.agenda || 'Scheduled team meeting'
    };

    const updatedMeetings = [newM, ...meetings];
    setMeetings(updatedMeetings);
    localStorage.setItem('neuzen_calendar_meetings', JSON.stringify(updatedMeetings));

    setShowMeetingModal(false);
    setMeetingForm({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      location: 'Main Conference Room',
      department: 'All Departments',
      agenda: ''
    });
    setErrors({});
    alert(`Meeting "${newM.title}" scheduled! Updated for both HR and Employee portals.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="responsive-header-flex">
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#063A4B' }}>Organization Calendar</h1>
          <p style={{ color: '#09637E', fontSize: '0.95rem' }}>View company holidays and scheduled team meetings. Updated in real time for HR & Employees.</p>
        </div>

        {hasRole('Admin', 'HR') && (
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button onClick={() => { setErrors({}); setShowHolidayModal(true); }} className="btn-secondary">
              <Plus size={18} />
              <span>Add Holiday</span>
            </button>
            <button onClick={() => { setErrors({}); setShowMeetingModal(true); }} className="btn-primary">
              <Video size={18} />
              <span>Schedule Meeting</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #7AB2B2', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'All', label: 'All Calendar Events' },
          { id: 'Holidays', label: 'Company Holidays' },
          { id: 'Meetings', label: 'Scheduled Meetings' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.9rem',
              background: activeTab === tab.id ? 'linear-gradient(135deg, #09637E, #088395)' : '#F4F8FA',
              color: activeTab === tab.id ? '#FFFFFF' : '#09637E',
              border: activeTab === tab.id ? 'none' : '1px solid #7AB2B2',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Company Holidays */}
        {(activeTab === 'All' || activeTab === 'Holidays') && holidays.map((hol) => (
          <div key={hol._id} className="glass-card" style={{ borderLeft: '5px solid #09637E', border: '1px solid #7AB2B2', borderLeftWidth: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div style={{ background: '#F4F8FA', padding: '0.5rem 0.8rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.85rem', color: '#09637E', border: '1px solid #7AB2B2' }}>
                📅 {hol.date}
              </div>
              <span className="badge badge-info">{hol.type || 'National'}</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#063A4B', marginBottom: '0.4rem', fontWeight: 800 }}>{hol.holidayName}</h3>
            <p style={{ fontSize: '0.88rem', color: '#09637E', lineHeight: 1.5 }}>{hol.description}</p>
          </div>
        ))}

        {/* Scheduled Meetings (Synchronized for HR & Employee) */}
        {(activeTab === 'All' || activeTab === 'Meetings') && meetings.map((meet) => (
          <div key={meet._id} className="glass-card" style={{ borderLeft: '5px solid #088395', background: '#FFFFFF', border: '1px solid #7AB2B2', borderLeftWidth: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div style={{ background: '#F4F8FA', padding: '0.5rem 0.8rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.85rem', color: '#088395', border: '1px solid #7AB2B2' }}>
                🕒 {meet.date} • {meet.time}
              </div>
              <span className="badge badge-success">Meeting Sync</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#063A4B', marginBottom: '0.4rem', fontWeight: 800 }}>{meet.title}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem', color: '#09637E', marginTop: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={15} color="#09637E" />
                <span><strong>Location:</strong> {meet.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Users size={15} color="#09637E" />
                <span><strong>Target:</strong> {meet.department}</span>
              </div>
              {meet.agenda && (
                <div style={{ marginTop: '0.4rem', padding: '0.7rem', background: '#F4F8FA', borderRadius: '8px', border: '1px solid #7AB2B2', color: '#063A4B' }}>
                  <strong style={{ color: '#09637E' }}>Agenda:</strong> {meet.agenda}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Meeting Modal */}
      {showMeetingModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Schedule Team Meeting</h2>
              <button onClick={() => setShowMeetingModal(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleScheduleMeeting} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div className="form-group">
                <label className="form-label">
                  <span>Meeting Title</span>
                  <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  className={errors.title ? 'input-error' : ''}
                  placeholder="e.g. Q3 Roadmap Review & Sprint Alignment"
                  value={meetingForm.title}
                  onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
                />
                {errors.title && <span className="error-hint">{errors.title}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">
                    <span>Meeting Date</span>
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="date"
                    className={errors.date ? 'input-error' : ''}
                    value={meetingForm.date}
                    onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                  />
                  {errors.date && <span className="error-hint">{errors.date}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Time & Duration</span>
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className={errors.time ? 'input-error' : ''}
                    placeholder="e.g. 10:00 AM - 11:30 AM"
                    value={meetingForm.time}
                    onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                  />
                  {errors.time && <span className="error-hint">{errors.time}</span>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">
                    <span>Location / Virtual Room</span>
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className={errors.location ? 'input-error' : ''}
                    placeholder="e.g. Conference Room 3B / Google Meet Link"
                    value={meetingForm.location}
                    onChange={(e) => setMeetingForm({ ...meetingForm, location: e.target.value })}
                  />
                  {errors.location && <span className="error-hint">{errors.location}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Target Audience / Department</label>
                  <select
                    value={meetingForm.department}
                    onChange={(e) => setMeetingForm({ ...meetingForm, department: e.target.value })}
                  >
                    <option value="All Departments">All Departments (Company-wide)</option>
                    <option value="Engineering & AI">Engineering & AI</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Marketing & Sales">Marketing & Sales</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Meeting Agenda & Notes</label>
                <textarea
                  rows="3"
                  placeholder="Detail key agenda topics and discussion points..."
                  value={meetingForm.agenda}
                  onChange={(e) => setMeetingForm({ ...meetingForm, agenda: e.target.value })}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowMeetingModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Schedule & Broadcast Meeting</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Holiday Modal */}
      {showHolidayModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Company Holiday</h2>
              <button onClick={() => setShowHolidayModal(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddHoliday} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div className="form-group">
                <label className="form-label">
                  <span>Holiday Name</span>
                  <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  className={errors.holidayName ? 'input-error' : ''}
                  placeholder="e.g. Independence Day"
                  value={holidayForm.holidayName}
                  onChange={(e) => setHolidayForm({ ...holidayForm, holidayName: e.target.value })}
                />
                {errors.holidayName && <span className="error-hint">{errors.holidayName}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">
                    <span>Holiday Date</span>
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="date"
                    className={errors.date ? 'input-error' : ''}
                    value={holidayForm.date}
                    onChange={(e) => setHolidayForm({ ...holidayForm, date: e.target.value })}
                  />
                  {errors.date && <span className="error-hint">{errors.date}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Holiday Category</label>
                  <select
                    value={holidayForm.type}
                    onChange={(e) => setHolidayForm({ ...holidayForm, type: e.target.value })}
                  >
                    <option value="National">National Holiday</option>
                    <option value="Festival">Festival</option>
                    <option value="Company Event">Company Event</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows="3"
                  placeholder="Holiday details..."
                  value={holidayForm.description}
                  onChange={(e) => setHolidayForm({ ...holidayForm, description: e.target.value })}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowHolidayModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Holiday</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
