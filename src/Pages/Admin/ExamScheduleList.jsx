import { useState, useEffect } from "react";
import {
  Plus, Search, Filter, Download, BookOpen, MapPin, X, Check, Edit, Trash2, ChevronLeft, ChevronRight, Loader2,
  SquarePen
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import talimatService from "../../services/talimatService";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

const ExamScheduleList = () => {
  // State
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dropdown options
  const [examNames, setExamNames] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Filters
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterClass, setFilterClass] = useState("");
  const [filterExam, setFilterExam] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    exam_id: "",
    class_id: "",
    subject_id: "",
    exam_date: "",
    start_time: "",
    end_time: "",
    room_no: "",
    full_marks: 100,
    pass_marks: 33
  });

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (formData.class_id) {
      fetchSubjects(formData.class_id);
    } else {
      setSubjects([]);
    }
  }, [formData.class_id]);

  useEffect(() => {
    fetchSchedules();
  }, [filterClass, filterExam]);

  const fetchInitialData = async () => {
    try {
      const [examRes, classRes] = await Promise.all([
        talimatService.getExamNames(),
        talimatService.getClasses()
      ]);
      setExamNames(examRes.data || []);
      setClasses(classRes.data || []);
    } catch (error) {
      console.error("Error fetching initial data", error);
      toast.error("Failed to load classes and exams");
    }
  };

  const fetchSubjects = async (classId) => {
    try {
      const res = await talimatService.getSubjects({ class_id: classId });
      setSubjects(res.data || []);
    } catch (error) {
      console.error("Error fetching subjects", error);
      toast.error("Failed to load subjects");
    }
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (filterClass) filters.class_id = filterClass;
      if (filterExam) filters.exam_id = filterExam;

      const res = await talimatService.getExamSchedules(filters);
      setSchedules(res.data || []);
    } catch (err) {
      console.error("Failed to fetch schedules", err);
      toast.error("Failed to fetch schedules");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditMode(false);
    setCurrentId(null);
    setFormData({
      exam_id: "",
      class_id: "",
      subject_id: "",
      exam_date: "",
      start_time: "",
      end_time: "",
      room_no: "",
      full_marks: 100,
      pass_marks: 33
    });
    setIsModalOpen(true);
  };

  const openEditModal = async (schedule) => {
    setEditMode(true);
    setCurrentId(schedule._id);
    setFormData({
      exam_id: schedule.exam_id || "",
      class_id: schedule.class_id || "",
      subject_id: schedule.subject_id || "",
      exam_date: schedule.exam_date ? new Date(schedule.exam_date).toISOString().split('T')[0] : "",
      start_time: schedule.start_time || "",
      end_time: schedule.end_time || "",
      room_no: schedule.room_no || "",
      full_marks: schedule.full_marks || 100,
      pass_marks: schedule.pass_marks || 33
    });
    // Ensure subjects are loaded for this class so the dropdown populates correctly
    if (schedule.class_id) {
      await fetchSubjects(schedule.class_id);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.exam_id || !formData.class_id || !formData.subject_id || !formData.exam_date || !formData.start_time || !formData.end_time) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editMode) {
        await talimatService.updateExamSchedule(currentId, formData);
        toast.success("Schedule updated successfully");
      } else {
        await talimatService.createExamSchedule(formData);
        toast.success("Schedule created successfully");
      }
      setIsModalOpen(false);
      fetchSchedules();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (schedule) => {
    setScheduleToDelete(schedule);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await talimatService.deleteExamSchedule(scheduleToDelete._id);
      toast.success("Schedule deleted successfully");
      setDeleteModalOpen(false);
      fetchSchedules();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  // Create an efficient lookup map for classes and subjects
  // Since schedules list doesn't fetch subject names or exam names by default in this setup,
  // we will display IDs if we don't have the names yet, but we will try to match them.
  // We can fetch all subjects once or just let the user see what's available.
  // A better approach is to fetch all subjects initially. Let's add that to fetchInitialData.

  const [allSubjects, setAllSubjects] = useState([]);

  useEffect(() => {
    // Fetch all subjects once to populate the list view
    talimatService.getSubjects().then(res => {
      setAllSubjects(res.data || []);
    }).catch(err => console.error(err));
  }, []);

  const getSubjectName = (id) => {
    const subject = allSubjects.find(s => s._id === id);
    return subject ? subject.name : "Unknown Subject";
  };
  const getExamName = (id) => {
    const exam = examNames.find(e => e._id === id);
    return exam ? exam.name : "Unknown Exam";
  };

  const filteredSchedules = schedules.filter(schedule => {
    if (searchTerm) {
      const subjectName = getSubjectName(schedule.subject_id).toLowerCase();
      if (!subjectName.includes(searchTerm.toLowerCase())) {
        return false;
      }
    }
    return true;
  });

  const exportToCSV = () => {
    const headers = ["Subject", "Exam Name", "Date", "Start Time", "End Time", "Room No", "Max Marks", "Pass Marks"];
    const csvRows = [];
    csvRows.push(headers.join(","));

    filteredSchedules.forEach(schedule => {
      const row = [
        `"${getSubjectName(schedule.subject_id)}"`,
        `"${getExamName(schedule.exam_id)}"`,
        schedule.exam_date ? new Date(schedule.exam_date).toLocaleDateString() : "N/A",
        schedule.start_time || "N/A",
        schedule.end_time || "N/A",
        schedule.room_no || "N/A",
        schedule.full_marks || 100,
        schedule.pass_marks || 33
      ];
      csvRows.push(row.join(","));
    });

    const csvData = "\uFEFF" + csvRows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "exam_schedules.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans">
      <Toaster position="top-right" />

      {/* Header and Control Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-5 w-full gap-4">
        <div>
          <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-[#00315e]" />
            Exam Schedules
          </h1>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1 ">
            <span>Dashboard</span>
            <span>/</span>
            <span>Examination</span>
            <span>/</span>
            <span className="text-[#00315e] font-semibold">Exam Schedule</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full md:w-auto">
          {/* Search */}
          {/* <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 bg-[#fff] border border-slate-200 text-slate-900 rounded-[8px] outline-none focus:ring-0.5 focus:ring-blue-500 transition-all"
            />
          </div> */}

          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-4 py-2 bg-[#fff] rounded-[8px] border border-slate-200 cursor-pointer flex items-center gap-2 whitespace-nowrap"
            >
              <Filter className="h-4 w-4" /> Filter
            </button>

            {/* Filter Dropdown */}
            {isFilterOpen && (
              <div className="absolute top-[50px] right-0 z-[100] bg-[#f2f2f3] flex flex-col gap-2 bg-white border border-gray-200 p-4 rounded-[8px] shadow-lg w-[300px]">
                <div className="flex flex-col gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Exam</label>
                    <select
                      value={filterExam}
                      onChange={(e) => setFilterExam(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-[8px] text-sm outline-none focus:border-blue-500"
                    >
                      <option value="">All Exams</option>
                      {examNames.map(exam => (
                        <option key={exam._id} value={exam._id}>{exam.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Class</label>
                    <select
                      value={filterClass}
                      onChange={(e) => setFilterClass(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-[8px] text-sm outline-none focus:border-blue-500"
                    >
                      <option value="">All Classes</option>
                      {classes.map(cls => (
                        <option key={cls._id} value={cls._id}>{cls.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-end justify-end gap-4 mt-2.5">
                  <button
                    onClick={() => { setFilterClass(""); setFilterExam(""); setIsFilterOpen(false); }}
                    className="px-4 py-2 bg-red-200 rounded-[8px] cursor-pointer text-red-700 text-sm font-semibold"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="px-4 py-2 bg-[#00315e] text-white rounded-[8px] cursor-pointer text-sm font-semibold"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            {filteredSchedules.length > 0 && (
              <button
                onClick={exportToCSV}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[8px] cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap transition-all"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            )}
            <button
              onClick={openAddModal}
              className="w-full sm:w-auto px-4 py-2 bg-[#00315e] text-white rounded-[8px] cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[8px] shadow-xl shadow-slate-100/50 overflow-hidden relative mt-8">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00315e] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold">Loading schedules...</p>
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8" />
            </div>
            <p className="text-slate-500 font-bold">No schedules found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-t-[8px]">
              <table className="w-full">
                <thead className="bg-[#00315e24]">
                  <tr className="whitespace-nowrap">
                    <th className="px-6 py-4 text-left">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-500 focus:ring-blue-500" />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-800 uppercase tracking-wider">Exam Info</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-800 uppercase tracking-wider">Exam Date</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-800 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-800 uppercase tracking-wider">Room No</th>
                    <th className="px-6 py-4 text-center text-xs font-black text-slate-800 uppercase tracking-wider">Marks (Min/Max)</th>
                    <th className="px-6 py-4 text-right text-xs font-black text-slate-800 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-100">
                  {filteredSchedules.map((schedule) => (
                    <tr key={schedule._id} className="group hover:bg-amber-50/10 transition-all duration-300">
                      <td className="px-6 py-4">
                        <input type="checkbox" className="rounded border-slate-300 text-blue-500 focus:ring-blue-500" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-[8px] bg-blue-50 flex items-center justify-center text-[#00315e]">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-slate-800 font-bold block text-sm">
                              {getSubjectName(schedule.subject_id)}
                            </span>
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                              {getExamName(schedule.exam_id)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-slate-700 font-bold text-sm">{schedule.exam_date ? new Date(schedule.exam_date).toLocaleDateString() : 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-slate-600 text-sm font-bold bg-slate-50 px-2 py-1 rounded-[8px] border border-slate-100">
                          {schedule.start_time} - {schedule.end_time || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-slate-700 text-sm font-bold">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          {schedule.room_no || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-[8px] text-xs font-bold border border-blue-100">
                          {schedule.pass_marks || 33} / {schedule.full_marks || 100}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(schedule)}
                            className="cursor-pointer p-1 text-slate-400 hover:text-[#00315e]"
                          >
                            <SquarePen className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(schedule)}
                            className="cursor-pointer p-1 text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            <div className="bg-slate-50/50 px-6 py-4 border-t-2 border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Showing <span className="text-slate-900">{filteredSchedules.length}</span> entries
              </p>
              <div className="flex items-center gap-2">
                <button className="p-2 border-2 border-slate-200 rounded-[8px] bg-white text-slate-600 hover:bg-slate-50 hover:border-blue-500 hover:text-blue-600 transition-all">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-[8px] text-xs font-black transition-all border-2 bg-[#00315e] border-[#00315e] text-white cursor-pointer">
                  1
                </button>
                <button className="p-2 border-2 border-slate-200 rounded-[8px] bg-white text-slate-600 hover:bg-slate-50 hover:border-blue-500 hover:text-blue-600 transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[8px] w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-[8px]">
              <h2 className="text-xl font-bold text-slate-800">
                {editMode ? "Edit Schedule" : "Add Exam Schedule"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors bg-slate-50 p-2 rounded-full hover:bg-rose-50">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Exam Name <span className="text-rose-500">*</span></label>
                    <select
                      name="exam_id"
                      value={formData.exam_id}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 rounded-[8px] border border-slate-200 focus:border-[#00315e] focus:ring-4 focus:ring-blue-50 outline-none bg-white text-sm transition-all"
                    >
                      <option value="">Select Exam</option>
                      {examNames.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Class <span className="text-rose-500">*</span></label>
                    <select
                      name="class_id"
                      value={formData.class_id}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 rounded-[8px] border border-slate-200 focus:border-[#00315e] focus:ring-4 focus:ring-blue-50 outline-none bg-white text-sm transition-all"
                    >
                      <option value="">Select Class</option>
                      {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Subject <span className="text-rose-500">*</span></label>
                    <select
                      name="subject_id"
                      value={formData.subject_id}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.class_id}
                      className="w-full px-4 py-2.5 rounded-[8px] border border-slate-200 focus:border-[#00315e] focus:ring-4 focus:ring-blue-50 outline-none bg-white text-sm transition-all disabled:bg-slate-50 disabled:text-slate-400"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Exam Date <span className="text-rose-500">*</span></label>
                    <input
                      type="date"
                      name="exam_date"
                      value={formData.exam_date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 rounded-[8px] border border-slate-200 focus:border-[#00315e] focus:ring-4 focus:ring-blue-50 outline-none text-sm text-slate-700 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Start Time <span className="text-rose-500">*</span></label>
                    <input
                      type="time"
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 rounded-[8px] border border-slate-200 focus:border-[#00315e] focus:ring-4 focus:ring-blue-50 outline-none text-sm text-slate-700 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">End Time <span className="text-rose-500">*</span></label>
                    <input
                      type="time"
                      name="end_time"
                      value={formData.end_time}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 rounded-[8px] border border-slate-200 focus:border-[#00315e] focus:ring-4 focus:ring-blue-50 outline-none text-sm text-slate-700 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Room No</label>
                    <input
                      name="room_no"
                      value={formData.room_no}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-[8px] border border-slate-200 focus:border-[#00315e] focus:ring-4 focus:ring-blue-50 outline-none text-sm transition-all"
                      placeholder="e.g. 101"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Max Marks</label>
                    <input
                      type="number"
                      name="full_marks"
                      value={formData.full_marks}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-[8px] border border-slate-200 focus:border-[#00315e] focus:ring-4 focus:ring-blue-50 outline-none text-sm transition-all"
                      placeholder="100"
                    />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-sm font-bold text-slate-700">Min Marks</label>
                    <input
                      type="number"
                      name="pass_marks"
                      value={formData.pass_marks}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-[8px] border border-slate-200 focus:border-[#00315e] focus:ring-4 focus:ring-blue-50 outline-none text-sm transition-all"
                      placeholder="33"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 rounded-b-[8px]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-[8px] border border-slate-200 text-slate-600 font-semibold hover:bg-white transition-all text-sm hover:shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-[8px] bg-[#00315e] text-white font-semibold hover:bg-[#002244] shadow-lg shadow-blue-200 transition-all text-sm flex items-center gap-2 disabled:opacity-70 cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {editMode ? "Update Schedule" : "Add Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDelete}
        title="ডিলিট কনফার্মেশন"
        description="আপনি কি নিশ্চিত যে আপনি এই পরীক্ষার সময়সূচী মুছে ফেলতে চান? এই অ্যাকশনটি আর ফিরিয়ে নেওয়া যাবে না।"
      />
    </div>
  );
};

export default ExamScheduleList;
