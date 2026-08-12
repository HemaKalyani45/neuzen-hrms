const { memoryEmployees } = require('./employeeController');
const { memoryDepartments } = require('./departmentController');
const { memoryLeaves } = require('./leaveController');
const { memoryPayroll } = require('./payrollController');

const getSystemReports = async (req, res) => {
  try {
    const totalEmployees = memoryEmployees.length;
    const totalDepartments = memoryDepartments.length;
    const pendingLeaves = memoryLeaves.filter(l => l.status === 'Pending').length;
    const approvedLeaves = memoryLeaves.filter(l => l.status === 'Approved').length;
    
    const monthlyPayrollCost = memoryPayroll.reduce((acc, curr) => acc + (curr.netSalary || 0), 0);
    const avgSalary = totalEmployees > 0 ? Math.round(monthlyPayrollCost / totalEmployees) : 0;

    // Dynamically calculate exact department headcount and percentage
    const departmentDistribution = memoryDepartments.map(d => {
      const count = memoryEmployees.filter(e => e.departmentName === d.departmentName).length;
      const percent = totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0;
      return {
        name: d.departmentName,
        count,
        percent
      };
    });

    res.json({
      success: true,
      summary: {
        totalEmployees,
        totalDepartments,
        pendingLeaves,
        approvedLeaves,
        monthlyPayrollCost,
        avgSalary,
        presentToday: Math.min(totalEmployees, 18),
        onLeaveToday: memoryLeaves.filter(l => l.status === 'Approved').length
      },
      charts: {
        departmentDistribution
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSystemReports
};
