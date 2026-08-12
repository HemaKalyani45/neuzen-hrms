const Holiday = require('../models/Holiday');
const { initialHolidays } = require('../utils/seedData');

let memoryHolidays = [...initialHolidays];

let memoryMeetings = [
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

const getCalendarEvents = async (req, res) => {
  try {
    let holidays = [];
    try {
      holidays = await Holiday.find();
    } catch (e) {
      holidays = memoryHolidays;
    }
    if (!holidays || holidays.length === 0) {
      holidays = memoryHolidays;
    }

    res.json({
      success: true,
      data: {
        holidays,
        meetings: memoryMeetings
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addHoliday = async (req, res) => {
  try {
    const { holidayName, date, description, type } = req.body;
    if (!holidayName || !date) {
      return res.status(400).json({ success: false, message: 'Holiday name and date are required.' });
    }

    const newHoliday = {
      _id: `hol_${Date.now()}`,
      holidayName,
      date,
      dayOfWeek: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
      description: description || 'Company recognized holiday',
      type: type || 'National'
    };

    try {
      const h = new Holiday(newHoliday);
      await h.save();
    } catch (e) {}

    memoryHolidays.push(newHoliday);

    res.status(201).json({
      success: true,
      message: 'Holiday added to calendar',
      data: newHoliday
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const scheduleMeeting = async (req, res) => {
  try {
    const { title, date, time, location, department, agenda } = req.body;
    if (!title || !date || !time) {
      return res.status(400).json({ success: false, message: 'Meeting title, date, and time are mandatory.' });
    }

    const newMeeting = {
      _id: `meet_${Date.now()}`,
      title,
      date,
      time: time || '10:00 AM',
      location: location || 'Main Conference Room',
      organizer: req.user?.name || 'Sarah Connor (HR Lead)',
      department: department || 'All Departments',
      agenda: agenda || 'Scheduled team meeting'
    };

    memoryMeetings.unshift(newMeeting);

    res.status(201).json({
      success: true,
      message: `Meeting "${title}" successfully scheduled for ${date} at ${time}. Updated for all employees.`,
      data: newMeeting
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Holiday.findByIdAndDelete(id);
    } catch (e) {}
    memoryHolidays = memoryHolidays.filter(h => h._id !== id);
    res.json({ success: true, message: 'Holiday removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    memoryMeetings = memoryMeetings.filter(m => m._id !== id);
    res.json({ success: true, message: 'Meeting cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCalendarEvents,
  addHoliday,
  scheduleMeeting,
  deleteHoliday,
  deleteMeeting,
  memoryHolidays,
  memoryMeetings
};
