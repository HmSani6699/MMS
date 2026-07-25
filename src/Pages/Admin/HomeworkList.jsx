import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  BookOpen,
  Filter,
  SquarePen,
  Trash2,
  ExternalLink,
  X
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";
import InputField from "../../components/InputField";
import SelectInputField from "../../components/SelectInputField";

const HomeworkList = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    class: "",
    subject: "",
    date: "",
    status: ""
  });
  const [appliedFilters, setAppliedFilters] = useState({
    class: "",
    subject: "",
    date: "",
    status: ""
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    class_id: "",
    section_id: "",
    subject_id: "",
    dueDate: "",
    description: "",
  });

  const [homeworks, setHomeworks] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [hwRes, classRes, subjectRes, sectionRes] = await Promise.all([
        axiosInstance.get("/v1/homework"),
        axiosInstance.get("/v1/classes"),
        axiosInstance.get("/v1/subjects"),
        axiosInstance.get("/v1/sections")
      ]);

      if (hwRes.data.success) {
        setHomeworks(hwRes.data.data);
      }
      if (classRes.data.success) {
        setClasses(classRes.data.data);
      }
      if (subjectRes.data.success) {
        setSubjects(subjectRes.data.data);
      }
      if (sectionRes.data.success) {
        setSections(sectionRes.data.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setModalType("add");
    setFormData({
      title: "",
      class_id: "",
      section_id: "",
      subject_id: "",
      dueDate: "",
      description: "",
    });
    setSelectedHomework(null);
    setIsModalOpen(true);
  };

  const openEditModal = (hw) => {
    setModalType("edit");
    setFormData({
      title: hw.title || "",
      class_id: hw.class_id || "",
      section_id: hw.section_id || "",
      subject_id: hw.subject_id || "",
      dueDate: hw.dueDate ? new Date(hw.dueDate).toISOString().split('T')[0] : "",
      description: hw.description || "",
    });
    setSelectedHomework(hw);
    setIsModalOpen(true);
  };

  const openDeleteModal = (hw) => {
    setSelectedHomework(hw);
    setIsDeleteModalOpen(true);
  };

  const openViewModal = (hw) => {
    setSelectedHomework(hw);
    setIsViewModalOpen(true);
  };

  const handleAction = async () => {
    if (!formData.title || !formData.class_id || !formData.section_id || !formData.subject_id || !formData.dueDate) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // Auto-detect assigned teacher from the selected section
    const selectedSection = sections.find(s => s._id === formData.section_id);
    const autoTeacherId = selectedSection?.classTeacher?._id || selectedSection?.classTeacher || selectedSection?.teacher_id || "000000000000000000000000";

    try {
      const payload = {
        title: formData.title,
        class_id: formData.class_id,
        section_id: formData.section_id,
        subject_id: formData.subject_id,
        teacher_id: autoTeacherId,
        dueDate: formData.dueDate,
        description: formData.description,
      };
      
      if (modalType === "add") {
        const response = await axiosInstance.post("/v1/homework", payload);
        if (response.data.success) {
          toast.success("Homework assigned successfully");
        }
      } else {
        const response = await axiosInstance.put(`/v1/homework/${selectedHomework._id}`, payload);
        if (response.data.success) {
          toast.success("Homework updated successfully");
        }
      }
      
      setIsModalOpen(false);
      fetchData();
      setFormData({
        title: "",
        class_id: "",
        section_id: "",
        subject_id: "",
        dueDate: "",
        description: "",
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save homework");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/v1/homework/${selectedHomework._id}`);
      if (response.data.success) {
        toast.success("Homework deleted successfully");
        fetchData();
      }
      setIsDeleteModalOpen(false);
      setSelectedHomework(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete homework");
    }
  };

  const filteredHomeworks = homeworks.filter((hw) => {
    const hwStatus = new Date(hw.dueDate) >= new Date() ? "active" : "expired";

    const matchClass = appliedFilters.class === "" || hw.class_id === appliedFilters.class;
    const matchSubject = appliedFilters.subject === "" || hw.subject_id === appliedFilters.subject;
    
    let matchDate = true;
    if (appliedFilters.date !== "") {
      const filterDate = new Date(appliedFilters.date).toLocaleDateString();
      const assignedDate = new Date(hw.created_at || hw.createdAt || hw.assignedDate).toLocaleDateString();
      const dueDate = new Date(hw.dueDate).toLocaleDateString();
      matchDate = filterDate === assignedDate || filterDate === dueDate;
    }
    
    const matchStatus = appliedFilters.status === "" || hwStatus === appliedFilters.status.toLowerCase();

    return matchClass && matchSubject && matchDate && matchStatus;
  });

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-[#00315e]" />
            Homework Management
          </h1>
          <div className="flex items-center gap-2 text-[14px] text-slate-500 font-bold mt-1">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Dashboard</span>
            <span>/</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Academics</span>
            <span>/</span>
            <span className="text-slate-800">Homework Management</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-3 w-full md:w-auto relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`px-4 py-2 rounded-[8px] flex items-center gap-2 transition-all ${
                isFilterOpen || Object.values(appliedFilters).some(v => v !== "")
                  ? "bg-blue-50 text-blue-600 border border-blue-200 font-bold"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 font-medium"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
              {Object.values(appliedFilters).filter(v => v !== "").length > 0 && (
                <span className="bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center ml-1">
                  {Object.values(appliedFilters).filter(v => v !== "").length}
                </span>
              )}
            </button>

            {/* Filter Dropdown Modal */}
            {isFilterOpen && (
              <div className="absolute top-full mt-2 right-0 w-[300px] sm:w-[400px] z-[60] bg-white p-5 rounded-[8px] border border-slate-200 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-slate-800">Filter Homeworks</h3>
                  <button 
                    onClick={() => {
                      const empty = { class: "", subject: "", date: "", status: "" };
                      setFilters(empty);
                      setAppliedFilters(empty);
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    Clear All
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-black text-slate-700">Class</label>
                    <select 
                      value={filters.class}
                      onChange={(e) => setFilters({...filters, class: e.target.value, subject: ""})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 rounded-[8px] outline-none focus:border-blue-500 transition-all text-sm font-medium"
                    >
                      <option value="">All Classes</option>
                      {classes.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-black text-slate-700">Subject</label>
                    <select 
                      value={filters.subject}
                      onChange={(e) => setFilters({...filters, subject: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 rounded-[8px] outline-none focus:border-blue-500 transition-all text-sm font-medium"
                    >
                      <option value="">All Subjects</option>
                      {subjects
                        .filter(s => filters.class === "" || s.class_id === filters.class)
                        .map(s => (
                        <option key={s._id} value={s._id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-black text-slate-700">Date</label>
                    <input 
                      type="date" 
                      value={filters.date}
                      onChange={(e) => setFilters({...filters, date: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 rounded-[8px] outline-none focus:border-blue-500 transition-all text-sm font-medium" 
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-black text-slate-700">Status</label>
                    <select 
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 rounded-[8px] outline-none focus:border-blue-500 transition-all text-sm font-medium"
                    >
                      <option value="">All Status</option>
                      <option value="complete">Complete</option>
                      <option value="incomplete">Incomplete</option>
                      <option value="active">Active</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-5 flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-[8px] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setAppliedFilters(filters);
                      setIsFilterOpen(false);
                    }}
                    className="px-6 py-2 text-sm font-bold text-white bg-[#00315e] hover:bg-blue-900 rounded-[8px] shadow-md transition-colors cursor-pointer"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-[#00315e] text-white rounded-[8px] cursor-pointer flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Create Homework
          </button>
        </div>
      </div>


      {/* Homework List Table */}
      <div className="bg-white rounded-[8px] shadow-xl shadow-slate-100/50 overflow-hidden relative">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00315e] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold">Loading homeworks...</p>
          </div>
        ) : filteredHomeworks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8" />
            </div>
            <p className="text-slate-500 font-bold">No homeworks found</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-[8px]">
            <table className="w-full">
              <thead className="bg-[#00315e24]">
                <tr>
                  <th className="px-6 py-3 text-left text-[12px] font-black">ID</th>
                  <th className="px-6 py-3 text-left text-[12px] font-black">Title & Details</th>
                  <th className="px-6 py-3 text-center text-[12px] font-black">Dates</th>
                  <th className="px-6 py-3 text-center text-[12px] font-black">Status</th>
                  <th className="px-6 py-3 text-center text-[12px] font-black">Submissions</th>
                  <th className="px-6 py-3 text-center text-[12px] font-black">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-50">
                {filteredHomeworks.map((hw, i) => {
                  const hwClass = classes.find(c => c._id === hw.class_id)?.name || "Unknown";
                  const hwSubject = subjects.find(s => s._id === hw.subject_id)?.name || "Unknown";
                  const hwStatus = new Date(hw.dueDate) >= new Date() ? "active" : "expired";
                  const submissions = hw.submissions || 0;
                  const totalStudents = hw.totalStudents || 0;
                  const progress = totalStudents > 0 ? (submissions / totalStudents) * 100 : 0;
                  
                  return (
                  <tr
                    key={hw._id || i}
                    className="group hover:bg-amber-50/10 transition-all duration-300"
                  >
                    <td className="px-6 py-4">
                      <span className="">{i + 1}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800">{hw.title}</span>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mt-1">
                          <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">{hwClass}</span>
                          <span className="text-slate-300">•</span>
                          <span>{hwSubject}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col gap-1 items-center">
                        <span className="text-xs font-bold text-slate-500">Assigned: {new Date(hw.created_at || hw.createdAt || hw.assignedDate).toLocaleDateString()}</span>
                        <span className={`text-xs font-bold ${hwStatus === 'expired' ? 'text-rose-500' : 'text-slate-500'}`}>Due: {new Date(hw.dueDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${hwStatus === "active"
                            ? "bg-blue-50 text-blue-700 border-blue-100"
                            : "bg-slate-50 text-slate-500 border-slate-200"
                          }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${hwStatus === "active" ? "bg-blue-500" : "bg-slate-400"
                            }`}
                        />
                        {hwStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-center">
                        <span className="text-xs font-black text-slate-700">
                          {submissions} / {totalStudents}
                        </span>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${hwStatus === 'active' ? 'bg-blue-500' : 'bg-slate-300'}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 justify-center">
                        <button className="cursor-pointer" onClick={() => openViewModal(hw)} title="View Details">
                          <ExternalLink className="w-4 h-4 text-blue-500" />
                        </button>
                        <button className="cursor-pointer" onClick={() => openEditModal(hw)} title="Edit">
                          <SquarePen className="w-4 h-4 text-[#00315e]" />
                        </button>
                        <button className="cursor-pointer" onClick={() => openDeleteModal(hw)} title="Delete">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Simplified Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6 sm:p-10">
          <div className="bg-white rounded-[8px] w-full max-w-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in duration-300 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between bg-white">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">{modalType === 'add' ? 'Assign Homework' : 'Edit Homework'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all cursor-pointer">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto">
              <div className="space-y-4">
                <InputField 
                  title="Homework Title" 
                  placeholder="e.g. Chapter 4 Exercises" 
                  value={formData.title}
                  setValue={(val) => setFormData({ ...formData, title: val })}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectInputField
                    title="Class"
                    options={classes.map(c => ({ value: c._id, label: c.name }))}
                    value={formData.class_id}
                    setValue={(val) => setFormData({ ...formData, class_id: val, section_id: "", subject_id: "" })}
                  />
                  <SelectInputField
                    title="Section"
                    options={sections
                      .filter(s => {
                        const selectedClass = classes.find(c => c._id === formData.class_id);
                        return selectedClass ? s._id === selectedClass.section_id : false;
                      })
                      .map(s => ({ value: s._id, label: s.name }))}
                    value={formData.section_id}
                    setValue={(val) => setFormData({ ...formData, section_id: val })}
                  />
                  <SelectInputField
                    title="Subject"
                    options={subjects.filter(s => s.class_id === formData.class_id).map(s => ({ value: s._id, label: s.name }))}
                    value={formData.subject_id}
                    setValue={(val) => setFormData({ ...formData, subject_id: val })}
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-black text-slate-700">Submission Deadline</label>
                    <input 
                      type="date" 
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-[8px] outline-none focus:border-blue-500 transition-all text-sm font-medium" 
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-black text-slate-700">Details / Note</label>
                  <textarea
                    rows="4"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter homework details or notes here..."
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-[8px] outline-none focus:border-blue-500 transition-all text-sm font-medium resize-y"
                  ></textarea>
                </div>
              </div>

              <div className="p-6 border-t-2 border-slate-100 bg-slate-50 flex justify-end gap-4 mt-6 -mx-5 -mb-5 rounded-b-[8px]">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 font-bold text-slate-600 hover:bg-white rounded-xl transition-all border-2 border-transparent hover:border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  className="px-8 py-3 bg-[#00315e] hover:bg-blue-900 text-white font-bold rounded-[8px] shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  {modalType === 'add' ? 'Add Assignment' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[8px] w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-800">Confirm Deletion</h2>
                <p className="text-slate-500">
                  Are you sure you want to delete <span className="font-bold text-slate-700">{selectedHomework?.title}</span>?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-[8px] font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 bg-red-500 text-white rounded-[8px] font-bold cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isViewModalOpen && selectedHomework && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6 sm:p-10">
          <div className="bg-white rounded-[8px] w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between bg-white">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Homework Details</h2>
              <button onClick={() => setIsViewModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all cursor-pointer">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{selectedHomework.title}</h3>
                  <p className="text-sm text-slate-500 mt-2">{selectedHomework.description || "No description provided."}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-[8px] border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Class</span>
                    <span className="text-sm font-bold text-slate-700">{classes.find(c => c._id === selectedHomework.class_id)?.name || "N/A"}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-[8px] border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Section</span>
                    <span className="text-sm font-bold text-slate-700">{sections.find(s => s._id === selectedHomework.section_id)?.name || "N/A"}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-[8px] border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Subject</span>
                    <span className="text-sm font-bold text-slate-700">{subjects.find(s => s._id === selectedHomework.subject_id)?.name || "N/A"}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-[8px] border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Status</span>
                    <span className={`text-sm font-bold ${new Date(selectedHomework.dueDate) >= new Date() ? 'text-blue-600' : 'text-red-500'}`}>
                      {new Date(selectedHomework.dueDate) >= new Date() ? 'Active' : 'Expired'}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-[8px] border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Assigned Date</span>
                    <span className="text-sm font-bold text-slate-700">{new Date(selectedHomework.created_at || selectedHomework.createdAt || selectedHomework.assignedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-[8px] border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Due Date</span>
                    <span className="text-sm font-bold text-slate-700">{new Date(selectedHomework.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end bg-slate-50/50 mt-auto">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-6 py-2 bg-[#00315e] hover:bg-blue-900 text-white font-bold rounded-[8px] transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeworkList;

