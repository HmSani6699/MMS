import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Award,
  X,
  SquarePen,
  Trash2,
} from "lucide-react";
import InputField from "../../components/InputField";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

const GradesRange = () => {
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" | "edit"
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    grade_point: "",
    min_marks: "",
    max_marks: "",
    remarks: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/v1/grades");
      if (response.data.success) {
        setGrades(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching grades:", err);
      toast.error("Failed to fetch grades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    resetForm();
    setModalType("add");
    setIsModalOpen(true);
  };

  const openEditModal = (grade) => {
    setSelectedGrade(grade);
    setFormData({
      name: grade.name,
      grade_point: grade.grade_point,
      min_marks: grade.min_marks,
      max_marks: grade.max_marks,
      remarks: grade.remarks || "",
    });
    setModalType("edit");
    setIsModalOpen(true);
  };

  const openDeleteModal = (grade) => {
    setSelectedGrade(grade);
    setIsDeleteModalOpen(true);
  };

  const handleAction = async () => {
    if (!formData.name || formData.grade_point === "" || formData.min_marks === "" || formData.max_marks === "") {
      return toast.error("Please fill all required fields");
    }

    // Parse numeric values
    const payload = {
      ...formData,
      grade_point: parseFloat(formData.grade_point),
      min_marks: parseFloat(formData.min_marks),
      max_marks: parseFloat(formData.max_marks),
    };

    try {
      if (modalType === "add") {
        const response = await axiosInstance.post("/v1/grades", payload);
        if (response.data.success) {
          toast.success("Grade added successfully!");
          fetchData();
        }
      } else {
        const response = await axiosInstance.put(`/v1/grades/${selectedGrade._id}`, payload);
        if (response.data.success) {
          toast.success("Grade updated successfully!");
          fetchData();
        }
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Action error:", err);
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/v1/grades/${selectedGrade._id}`);
      if (response.data.success) {
        toast.success("Grade deleted successfully!");
        fetchData();
      }
      setIsDeleteModalOpen(false);
      setSelectedGrade(null);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete grade");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", grade_point: "", min_marks: "", max_marks: "", remarks: "" });
    setSelectedGrade(null);
  };

  const filteredGrades = grades.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBadgeColor = (gradePoint) => {
    const point = parseFloat(gradePoint);
    if (point >= 5.0) return "bg-emerald-50 text-emerald-700 border-emerald-100/50";
    if (point >= 4.0) return "bg-blue-50 text-blue-700 border-blue-100/50";
    if (point >= 3.5) return "bg-indigo-50 text-indigo-700 border-indigo-100/50";
    if (point >= 3.0) return "bg-teal-50 text-teal-700 border-teal-100/50";
    if (point >= 2.0) return "bg-amber-50 text-amber-700 border-amber-100/50";
    if (point >= 1.0) return "bg-orange-50 text-orange-700 border-orange-100/50";
    return "bg-rose-50 text-rose-700 border-rose-100/50";
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
            <Award className="w-8 h-8 text-[#00315e]" />
            Grade Management
          </h1>
          <p className=" text-[14px] text-slate-500 font-bold mt-1">
            Manage examination grades and points
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Grade Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#fff] border border-slate-200 text-slate-900 rounded-[8px] outline-none focus:ring-0.5 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-[#00315e] text-white rounded-[8px] cursor-pointer flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Grade
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[8px] shadow-xl shadow-slate-100/50 overflow-hidden relative">
        <div className="overflow-x-auto border border-gray-200 rounded-[8px]">
          <table className="w-full">
            <thead className="bg-[#00315e24]">
              <tr className="whitespace-nowrap">
                <th className="whitespace-nowrap px-10 py-3 text-left text-[12px] font-black ">ID</th>
                <th className="whitespace-nowrap px-10 py-3 text-center text-[12px] font-black ">Grade Name</th>
                <th className="whitespace-nowrap px-10 py-3 text-center text-[12px] font-black ">Grade Point</th>
                <th className="whitespace-nowrap px-10 py-3 text-center text-[12px] font-black ">Mark From</th>
                <th className="whitespace-nowrap px-10 py-3 text-center text-[12px] font-black ">Mark To</th>
                <th className="whitespace-nowrap px-10 py-3 text-center text-[12px] font-black ">Comment</th>
                <th className="whitespace-nowrap px-10 py-3 text-center text-[12px] font-black ">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-10 py-8 text-center text-slate-500 font-bold">
                    Loading grades...
                  </td>
                </tr>
              ) : filteredGrades.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-10 py-8 text-center text-slate-500 font-bold">
                    No grades found
                  </td>
                </tr>
              ) : (
                filteredGrades.map((grade, i) => (
                  <tr key={grade._id} className="group hover:bg-amber-50/10 transition-all duration-300">
                    <td className="px-10 py-3 whitespace-nowrap"><span className="text-sm font-bold text-slate-500">{i + 1}</span></td>
                    <td className="px-10 py-3 whitespace-nowrap text-center"><span className="text-[15px] font-black text-slate-800">{grade.name}</span></td>
                    <td className="px-10 py-3 whitespace-nowrap text-center"><span className="text-sm font-bold text-[#00315e]">{Number(grade.grade_point).toFixed(2)}</span></td>
                    <td className="px-10 py-3 whitespace-nowrap text-center"><span className="text-sm font-semibold text-slate-600">{grade.min_marks}%</span></td>
                    <td className="px-10 py-3 whitespace-nowrap text-center"><span className="text-sm font-semibold text-slate-600">{grade.max_marks}%</span></td>
                    <td className="px-10 py-3 whitespace-nowrap text-center">
                      {grade.remarks ? (
                        <span className={`inline-block px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider border shadow-sm ${getBadgeColor(grade.grade_point)}`}>
                          {grade.remarks}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">-</span>
                      )}
                    </td>
                    <td className="px-10 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3 justify-center">
                        <button className="cursor-pointer" onClick={() => openEditModal(grade)}>
                          <SquarePen className="w-4 h-4 text-[#00315e]" />
                        </button>
                        <button className="cursor-pointer" onClick={() => openDeleteModal(grade)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6 sm:p-10">
          <div className="bg-white rounded-[8px] w-full max-w-lg shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in duration-300 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between bg-white">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                {modalType === "add" ? "Add New Grade" : "Update Grade"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all cursor-pointer">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto">
              <div className="flex flex-col gap-4">
                <InputField
                  title="Grade Name"
                  placeholder="e.g. A+"
                  value={formData.name}
                  setValue={(val) => setFormData({ ...formData, name: val })}
                />
                <InputField
                  title="Grade Point"
                  placeholder="e.g. 5.00"
                  type="number"
                  value={formData.grade_point}
                  setValue={(val) => setFormData({ ...formData, grade_point: val })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    title="Mark From"
                    type="number"
                    placeholder="80"
                    value={formData.min_marks}
                    setValue={(val) => setFormData({ ...formData, min_marks: val })}
                  />
                  <InputField
                    title="Mark To"
                    type="number"
                    placeholder="100"
                    value={formData.max_marks}
                    setValue={(val) => setFormData({ ...formData, max_marks: val })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-black text-slate-700 uppercase">Comment (Optional)</label>
                  <textarea
                    className="w-full px-4 py-2 bg-[#fff] border border-slate-200 text-slate-900 rounded-[8px] outline-none focus:border-[#00315e] transition-all"
                    placeholder="e.g. Outstanding"
                    rows="3"
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  ></textarea>
                </div>
              </div>
              <div className="p-6 border-t-2 border-slate-100 bg-slate-50 flex justify-end gap-4 mt-5 -mx-5 -mb-5 rounded-b-[8px]">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-slate-600 hover:bg-white rounded-xl transition-all border-2 border-transparent hover:border-slate-200 cursor-pointer">Cancel</button>
                <button onClick={handleAction} className="px-8 py-3 bg-[#00315e] hover:bg-blue-900 text-white font-bold rounded-[8px] shadow-lg transition-all flex items-center gap-2 cursor-pointer">
                  {modalType === "add" ? "Save Grade" : "Update Grade"}
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
                  Are you sure you want to delete grade <span className="font-bold text-slate-700">{selectedGrade?.name}</span>?
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
    </div>
  );
};

export default GradesRange;
