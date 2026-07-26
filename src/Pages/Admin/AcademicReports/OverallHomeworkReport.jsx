import { useState, useEffect } from "react";
import { ClipboardList, Download, Search, CheckCircle, Clock, Filter, X, Users, BookOpen, GraduationCap } from "lucide-react";
import axiosInstance from "../../../api/axiosInstance";

const OverallHomeworkReport = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("class"); // 'class' or 'student'
  
  // Filter States
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // Dropdown Data
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [classRes, sectionRes] = await Promise.all([
          axiosInstance.get("/v1/classes").catch(() => ({ data: { data: [] } })),
          axiosInstance.get("/v1/sections").catch(() => ({ data: { data: [] } }))
        ]);
        
        if (classRes.data?.data) setClasses(classRes.data.data);
        if (sectionRes.data?.data) setSections(sectionRes.data.data);
      } catch (err) {
        console.error("Error fetching dropdowns:", err);
      }
    };
    fetchDropdowns();
  }, []);

  const handleFilter = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsFilterModalOpen(false);
      setShowReport(true);
    }, 800);
  };

  // Realistic Mock Data
  const classWiseData = [
    { subject: "Arabic", teacher: "Ustad Hakim", totalAssignments: 15, active: 2, expired: 13, submissionRate: 85 },
    { subject: "Fiqh", teacher: "Mufti Rahman", totalAssignments: 8, active: 0, expired: 8, submissionRate: 92 },
    { subject: "Math", teacher: "Mr. Hasan", totalAssignments: 22, active: 3, expired: 19, submissionRate: 78 },
    { subject: "English", teacher: "Ms. Ayesha", totalAssignments: 12, active: 1, expired: 11, submissionRate: 88 },
  ];

  const studentWiseData = [
    { studentId: "STD-2023-001", name: "Ahmed Ali", roll: "01", completed: 45, missing: 2, late: 3, avgGrade: "A" },
    { studentId: "STD-2023-002", name: "Fatima Noor", roll: "02", completed: 50, missing: 0, late: 0, avgGrade: "A+" },
    { studentId: "STD-2023-003", name: "Omar Farooq", roll: "03", completed: 35, missing: 10, late: 5, avgGrade: "B" },
    { studentId: "STD-2023-004", name: "Zainab Hasan", roll: "04", completed: 48, missing: 1, late: 1, avgGrade: "A" },
    { studentId: "STD-2023-005", name: "Ibrahim Khan", roll: "05", completed: 20, missing: 25, late: 5, avgGrade: "C" },
  ];

  // CSV Export Functionality
  const downloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (activeTab === "class") {
      csvContent += "Subject,Teacher,Total Assignments,Active,Expired,Submission Rate (%)\n";
      classWiseData.forEach(row => {
        csvContent += `"${row.subject}","${row.teacher}",${row.totalAssignments},${row.active},${row.expired},${row.submissionRate}\n`;
      });
    } else {
      csvContent += "Student ID,Name,Roll No,Completed,Missing,Late,Avg Grade\n";
      studentWiseData.forEach(row => {
        csvContent += `"${row.studentId}","${row.name}","${row.roll}",${row.completed},${row.missing},${row.late},"${row.avgGrade}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Homework_${activeTab === "class" ? "Class_Report" : "Student_Report"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-[#00315e]" />
            Homework Report
          </h1>
          <div className="flex items-center gap-2 text-sm text-slate-500 font-bold mt-1">
            <span className="hover:text-[#00315e] cursor-pointer transition-colors">Dashboard</span>
            <span>/</span>
            <span className="hover:text-[#00315e] cursor-pointer transition-colors">Academic Reports</span>
            <span>/</span>
            <span className="text-slate-800">Homework Report</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {showReport && (
            <button 
              onClick={downloadCSV}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-[8px] flex items-center gap-2 hover:bg-slate-50 transition-colors font-bold text-sm cursor-pointer"
            >
              <Download size={18} />
              Export CSV
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
              className="px-4 py-2 bg-[#00315e] text-white rounded-[8px] flex items-center gap-2 hover:bg-[#00315e]/90 transition-colors font-bold text-sm cursor-pointer"
            >
              <Filter size={18} />
              Filter
            </button>

            {isFilterModalOpen && (
              <div className="absolute top-full mt-2 right-0 z-[100] w-[340px] flex flex-col gap-4 bg-white border border-gray-200 p-4 rounded-[12px] shadow-xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-700">Filter Report</h3>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        setSelectedClass("");
                        setSelectedSection("");
                        setStartDate("");
                        setEndDate("");
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                    >
                      Clear All
                    </button>
                    <button onClick={() => setIsFilterModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer bg-slate-50 p-1 rounded-md">
                      <X size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Class</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[8px] focus:border-blue-500 outline-none text-sm font-medium transition-all"
                    value={selectedClass}
                    onChange={(e) => {
                      setSelectedClass(e.target.value);
                      setSelectedSection("");
                    }}
                  >
                    <option value="">Select Class</option>
                    {classes.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Section</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[8px] focus:border-blue-500 outline-none text-sm font-medium transition-all"
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    disabled={!selectedClass}
                  >
                    <option value="">Select Section</option>
                    {sections
                      .filter(s => {
                        const sClass = classes.find(c => c._id === selectedClass);
                        return sClass ? s._id === sClass.section_id : true;
                      })
                      .map(s => (
                        <option key={s._id} value={s._id}>{s.name}</option>
                      ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600">Date Range (Optional)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Start Date</span>
                      <input 
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-[8px] focus:border-blue-500 outline-none text-xs font-medium transition-all text-slate-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">End Date</span>
                      <input 
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-[8px] focus:border-blue-500 outline-none text-xs font-medium transition-all text-slate-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setIsFilterModalOpen(false)}
                    className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-[8px] font-bold text-sm hover:bg-slate-200 transition-all flex justify-center items-center cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFilter}
                    disabled={loading || !selectedClass}
                    className={`flex-1 py-2 text-white rounded-[8px] font-bold text-sm transition-all flex justify-center items-center gap-2 ${(!selectedClass) ? 'bg-slate-300 cursor-not-allowed' : 'bg-[#00315e] hover:bg-[#00315e]/90 cursor-pointer shadow-md'}`}
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Search size={16} />
                        Apply
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-slate-100">
        <button
          onClick={() => setActiveTab("class")}
          className={`flex items-center gap-2 px-6 py-3 font-black text-sm transition-all ${
            activeTab === "class"
              ? "text-blue-600 border-b-4 border-blue-600"
              : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Class-Wise Report
        </button>
        <button
          onClick={() => setActiveTab("student")}
          className={`flex items-center gap-2 px-6 py-3 font-black text-sm transition-all ${
            activeTab === "student"
              ? "text-blue-600 border-b-4 border-blue-600"
              : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Users className="w-4 h-4" />
          Student-Wise Report
        </button>
      </div>

      {showReport ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Overview Cards based on Tab */}
          {activeTab === "class" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-[8px] p-5 flex items-center justify-between shadow-lg relative overflow-hidden group">
                <div className="absolute -top-[5%] -left-[20%] h-[200px] w-[200px] bg-blue-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                <div className="z-[10]">
                  <p className="text-2xl font-black text-slate-800 mb-1">57</p>
                  <p className="text-xs font-bold text-slate-500 uppercase ">Total Assignments</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center z-[10]">
                  <ClipboardList className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="bg-white rounded-[8px] p-5 flex items-center justify-between shadow-lg relative overflow-hidden group">
                <div className="absolute -top-[5%] -left-[20%] h-[200px] w-[200px] bg-emerald-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                <div className="z-[10]">
                  <p className="text-2xl font-black text-slate-800 mb-1">84%</p>
                  <p className="text-xs font-bold text-slate-500 uppercase ">Avg Submission Rate</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center z-[10]">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <div className="bg-white rounded-[8px] p-5 flex items-center justify-between shadow-lg relative overflow-hidden group">
                <div className="absolute -top-[5%] -left-[20%] h-[200px] w-[200px] bg-amber-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                <div className="z-[10]">
                  <p className="text-2xl font-black text-slate-800 mb-1">6</p>
                  <p className="text-xs font-bold text-slate-500 uppercase ">Active Assignments</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center z-[10]">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-[8px] p-5 flex items-center justify-between shadow-lg relative overflow-hidden group">
                <div className="absolute -top-[5%] -left-[20%] h-[200px] w-[200px] bg-blue-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                <div className="z-[10]">
                  <p className="text-2xl font-black text-slate-800 mb-1">30</p>
                  <p className="text-xs font-bold text-slate-500 uppercase ">Students Enrolled</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center z-[10]">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="bg-white rounded-[8px] p-5 flex items-center justify-between shadow-lg relative overflow-hidden group">
                <div className="absolute -top-[5%] -left-[20%] h-[200px] w-[200px] bg-emerald-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                <div className="z-[10]">
                  <p className="text-2xl font-black text-slate-800 mb-1">198</p>
                  <p className="text-xs font-bold text-slate-500 uppercase ">On-time Submissions</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center z-[10]">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <div className="bg-white rounded-[8px] p-5 flex items-center justify-between shadow-lg relative overflow-hidden group">
                <div className="absolute -top-[5%] -left-[20%] h-[200px] w-[200px] bg-rose-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                <div className="z-[10]">
                  <p className="text-2xl font-black text-slate-800 mb-1">38</p>
                  <p className="text-xs font-bold text-slate-500 uppercase ">Missing Tasks</p>
                </div>
                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center z-[10]">
                  <X className="w-6 h-6 text-rose-600" />
                </div>
              </div>
            </div>
          )}

          {/* Report Content */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 bg-[#00315e]/5 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-800">
                {activeTab === "class" ? "Subject Breakdown" : "Student Performance"}
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              {activeTab === "class" ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-4 font-bold text-sm text-slate-600">Subject</th>
                      <th className="p-4 font-bold text-sm text-slate-600">Teacher</th>
                      <th className="p-4 font-bold text-sm text-slate-600">Total Assignments</th>
                      <th className="p-4 font-bold text-sm text-slate-600">Active / Expired</th>
                      <th className="p-4 font-bold text-sm text-slate-600">Submission Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classWiseData.map((item, index) => (
                      <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-bold text-sm text-slate-800">{item.subject}</td>
                        <td className="p-4 font-medium text-sm text-slate-600">{item.teacher}</td>
                        <td className="p-4 font-bold text-sm text-slate-600">{item.totalAssignments}</td>
                        <td className="p-4">
                          <span className="text-blue-600 font-bold">{item.active}</span>
                          <span className="text-slate-300 mx-1">/</span>
                          <span className="text-slate-500 font-bold">{item.expired}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  item.submissionRate >= 85 ? 'bg-emerald-500' :
                                  item.submissionRate < 70 ? 'bg-amber-500' : 'bg-[#00315e]'
                                }`}
                                style={{ width: `${item.submissionRate}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-bold text-slate-500 w-8">{item.submissionRate}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-4 font-bold text-sm text-slate-600">Student Info</th>
                      <th className="p-4 font-bold text-sm text-slate-600 text-center">Completed</th>
                      <th className="p-4 font-bold text-sm text-slate-600 text-center">Late</th>
                      <th className="p-4 font-bold text-sm text-slate-600 text-center">Missing</th>
                      <th className="p-4 font-bold text-sm text-slate-600 text-center">Avg Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentWiseData.map((student, index) => (
                      <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-slate-800">{student.name}</span>
                            <span className="text-xs font-bold text-slate-500">ID: {student.studentId} • Roll: {student.roll}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 font-black text-xs rounded-full">{student.completed}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="px-3 py-1 bg-amber-50 text-amber-600 font-black text-xs rounded-full">{student.late}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="px-3 py-1 bg-rose-50 text-rose-600 font-black text-xs rounded-full">{student.missing}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`font-black text-lg ${
                            student.avgGrade.includes('A') ? 'text-emerald-500' :
                            student.avgGrade.includes('B') ? 'text-blue-500' : 'text-amber-500'
                          }`}>
                            {student.avgGrade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 px-4 bg-white/60 backdrop-blur-md border border-blue-100 rounded-[8px] shadow-sm border-dashed">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-[#00315e] rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-white border border-blue-50 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-500">
              <ClipboardList className="w-10 h-10 text-[#00315e]" />
            </div>
          </div>
          <h3 className="mt-6 text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#00315e] to-blue-600 text-center">
            Homework Report
          </h3>
          <div className="mt-3 flex items-center gap-2 bg-blue-50/80 px-4 py-2.5 rounded-xl border border-blue-100">
            <Filter className="w-4 h-4 text-blue-500" />
            <p className="text-sm font-bold text-slate-600 text-center">
              Please filter by <span className="text-[#00315e]">Class</span> to view the comprehensive report.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverallHomeworkReport;
