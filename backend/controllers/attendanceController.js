const Attendance = require('../models/Attendance');

let memoryAttendance = [
  // Today's Records (2026-08-12)
  {
    _id: 'att1_today',
    employeeId: 'emp1',
    employeeCode: 'NZ-1001',
    employeeName: 'Alex Rivera',
    date: '2026-08-12',
    checkIn: '09:05 AM',
    checkOut: '06:15 PM',
    workingHours: 9.1,
    status: 'Present'
  },
  {
    _id: 'att2_today',
    employeeId: 'emp2',
    employeeCode: 'NZ-1002',
    employeeName: 'Sarah Connor',
    date: '2026-08-12',
    checkIn: '08:55 AM',
    checkOut: '05:45 PM',
    workingHours: 8.8,
    status: 'Present'
  },
  {
    _id: 'att3_today',
    employeeId: 'emp3',
    employeeCode: 'NZ-1003',
    employeeName: 'Michael Chen',
    date: '2026-08-12',
    checkIn: '10:15 AM',
    checkOut: '06:00 PM',
    workingHours: 7.75,
    status: 'Late Entry'
  },
  {
    _id: 'att4_today',
    employeeId: 'emp4',
    employeeCode: 'NZ-1004',
    employeeName: 'Priya Sharma',
    date: '2026-08-12',
    checkIn: '09:00 AM',
    checkOut: '06:00 PM',
    workingHours: 9.0,
    status: 'Present'
  },

  // Historical Records for Alex Rivera (NZ-1001)
  {
    _id: 'att1_h1',
    employeeId: 'emp1',
    employeeCode: 'NZ-1001',
    employeeName: 'Alex Rivera',
    date: '2026-08-11',
    checkIn: '08:58 AM',
    checkOut: '06:02 PM',
    workingHours: 9.0,
    status: 'Present'
  },
  {
    _id: 'att1_h2',
    employeeId: 'emp1',
    employeeCode: 'NZ-1001',
    employeeName: 'Alex Rivera',
    date: '2026-08-10',
    checkIn: '10:12 AM',
    checkOut: '06:30 PM',
    workingHours: 8.3,
    status: 'Late Entry'
  },
  {
    _id: 'att1_h3',
    employeeId: 'emp1',
    employeeCode: 'NZ-1001',
    employeeName: 'Alex Rivera',
    date: '2026-08-08',
    checkIn: '09:00 AM',
    checkOut: '06:00 PM',
    workingHours: 9.0,
    status: 'Present'
  },
  {
    _id: 'att1_h4',
    employeeId: 'emp1',
    employeeCode: 'NZ-1001',
    employeeName: 'Alex Rivera',
    date: '2026-08-07',
    checkIn: '09:10 AM',
    checkOut: '06:20 PM',
    workingHours: 9.1,
    status: 'Present'
  },
  {
    _id: 'att1_h5',
    employeeId: 'emp1',
    employeeCode: 'NZ-1001',
    employeeName: 'Alex Rivera',
    date: '2026-08-06',
    checkIn: '08:55 AM',
    checkOut: '05:55 PM',
    workingHours: 9.0,
    status: 'Present'
  },
  {
    _id: 'att1_h6',
    employeeId: 'emp1',
    employeeCode: 'NZ-1001',
    employeeName: 'Alex Rivera',
    date: '2026-08-05',
    checkIn: '09:00 AM',
    checkOut: '06:00 PM',
    workingHours: 9.0,
    status: 'Present'
  },
  {
    _id: 'att1_h7',
    employeeId: 'emp1',
    employeeCode: 'NZ-1001',
    employeeName: 'Alex Rivera',
    date: '2026-08-04',
    checkIn: '09:05 AM',
    checkOut: '06:10 PM',
    workingHours: 9.0,
    status: 'Present'
  },
  {
    _id: 'att1_h8',
    employeeId: 'emp1',
    employeeCode: 'NZ-1001',
    employeeName: 'Alex Rivera',
    date: '2026-08-01',
    checkIn: '09:00 AM',
    checkOut: '06:00 PM',
    workingHours: 9.0,
    status: 'Present'
  },

  // Historical Records for Sarah Connor (NZ-1002)
  {
    _id: 'att2_h1',
    employeeId: 'emp2',
    employeeCode: 'NZ-1002',
    employeeName: 'Sarah Connor',
    date: '2026-08-11',
    checkIn: '09:02 AM',
    checkOut: '06:10 PM',
    workingHours: 9.1,
    status: 'Present'
  },
  {
    _id: 'att2_h2',
    employeeId: 'emp2',
    employeeCode: 'NZ-1002',
    employeeName: 'Sarah Connor',
    date: '2026-08-10',
    checkIn: '09:00 AM',
    checkOut: '06:00 PM',
    workingHours: 9.0,
    status: 'Present'
  },
  {
    _id: 'att2_h3',
    employeeId: 'emp2',
    employeeCode: 'NZ-1002',
    employeeName: 'Sarah Connor',
    date: '2026-08-08',
    checkIn: '08:50 AM',
    checkOut: '05:50 PM',
    workingHours: 9.0,
    status: 'Present'
  },
  {
    _id: 'att2_h4',
    employeeId: 'emp2',
    employeeCode: 'NZ-1002',
    employeeName: 'Sarah Connor',
    date: '2026-08-07',
    checkIn: '09:00 AM',
    checkOut: '06:00 PM',
    workingHours: 9.0,
    status: 'Present'
  },
  {
    _id: 'att2_h5',
    employeeId: 'emp2',
    employeeCode: 'NZ-1002',
    employeeName: 'Sarah Connor',
    date: '2026-08-06',
    checkIn: '09:05 AM',
    checkOut: '06:15 PM',
    workingHours: 9.1,
    status: 'Present'
  },
  {
    _id: 'att2_h6',
    employeeId: 'emp2',
    employeeCode: 'NZ-1002',
    employeeName: 'Sarah Connor',
    date: '2026-08-05',
    checkIn: '08:58 AM',
    checkOut: '05:58 PM',
    workingHours: 9.0,
    status: 'Present'
  },

  // Historical Records for Michael Chen (NZ-1003)
  {
    _id: 'att3_h1',
    employeeId: 'emp3',
    employeeCode: 'NZ-1003',
    employeeName: 'Michael Chen',
    date: '2026-08-11',
    checkIn: '09:00 AM',
    checkOut: '06:00 PM',
    workingHours: 9.0,
    status: 'Present'
  },
  {
    _id: 'att3_h2',
    employeeId: 'emp3',
    employeeCode: 'NZ-1003',
    employeeName: 'Michael Chen',
    date: '2026-08-10',
    checkIn: '09:05 AM',
    checkOut: '06:10 PM',
    workingHours: 9.0,
    status: 'Present'
  },
  {
    _id: 'att3_h3',
    employeeId: 'emp3',
    employeeCode: 'NZ-1003',
    employeeName: 'Michael Chen',
    date: '2026-08-08',
    checkIn: '09:00 AM',
    checkOut: '06:00 PM',
    workingHours: 9.0,
    status: 'Present'
  },

  // Historical Records for Priya Sharma (NZ-1004)
  {
    _id: 'att4_h1',
    employeeId: 'emp4',
    employeeCode: 'NZ-1004',
    employeeName: 'Priya Sharma',
    date: '2026-08-11',
    checkIn: '09:00 AM',
    checkOut: '06:00 PM',
    workingHours: 9.0,
    status: 'Present'
  },
  {
    _id: 'att4_h2',
    employeeId: 'emp4',
    employeeCode: 'NZ-1004',
    employeeName: 'Priya Sharma',
    date: '2026-08-10',
    checkIn: '08:55 AM',
    checkOut: '06:05 PM',
    workingHours: 9.1,
    status: 'Present'
  }
];

const checkIn = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const { employeeId, employeeName, employeeCode } = req.body;

    const empId = employeeId || 'emp1';
    const empName = employeeName || req.user?.name || 'Alex Rivera';
    const code = employeeCode || 'NZ-1001';

    const existing = memoryAttendance.find(a => a.employeeId === empId && a.date === today);
    if (existing && existing.checkIn) {
      return res.status(400).json({ 
        success: false, 
        message: `Already logged in today at ${existing.checkIn}` 
      });
    }

    const isLate = parseInt(nowTime.split(':')[0]) >= 10 && nowTime.includes('AM');
    const newRecord = {
      _id: `att_${Date.now()}`,
      employeeId: empId,
      employeeCode: code,
      employeeName: empName,
      date: today,
      checkIn: nowTime,
      checkOut: null,
      workingHours: 0,
      status: isLate ? 'Late Entry' : 'Present'
    };

    try {
      const att = new Attendance(newRecord);
      await att.save();
    } catch (e) {}

    memoryAttendance.unshift(newRecord);

    res.json({
      success: true,
      message: `Login registered successfully at ${nowTime}`,
      data: newRecord
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const checkOut = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const { employeeId } = req.body;
    const empId = employeeId || 'emp1';

    let record = memoryAttendance.find(a => a.employeeId === empId && a.date === today);

    if (!record) {
      record = {
        _id: `att_${Date.now()}`,
        employeeId: empId,
        employeeCode: 'NZ-1001',
        employeeName: req.user?.name || 'Alex Rivera',
        date: today,
        checkIn: '09:00 AM',
        checkOut: nowTime,
        workingHours: 8.5,
        status: 'Present'
      };
      memoryAttendance.unshift(record);
    } else {
      record.checkOut = nowTime;
      record.workingHours = 8.5;
    }

    try {
      await Attendance.findOneAndUpdate(
        { employeeId: empId, date: today },
        { checkOut: nowTime, workingHours: 8.5 },
        { new: true }
      );
    } catch (e) {}

    res.json({
      success: true,
      message: `Logout recorded successfully at ${nowTime}`,
      data: record
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAttendance = async (req, res) => {
  try {
    let list = memoryAttendance;
    try {
      const dbList = await Attendance.find().sort({ createdAt: -1 });
      if (dbList && dbList.length > 0) {
        list = [...dbList, ...memoryAttendance];
      }
    } catch (e) {}

    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEmployeeAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const records = memoryAttendance.filter(a => a.employeeId === employeeId || a.employeeCode === employeeId);
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  checkIn,
  checkOut,
  getAttendance,
  getEmployeeAttendance,
  memoryAttendance
};
