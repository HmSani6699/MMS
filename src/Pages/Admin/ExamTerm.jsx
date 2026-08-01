import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Trash2,
  X,
  CalendarDays,
  SquarePen,
  Loader2
} from "lucide-react";
import InputField from "../../components/InputField";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";

const ExamTerm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalType, setModalType] = useState("add"); // "add" | "edit"

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [terms, setTerms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormState = {
    _id: "",
    name: "",
    startDate: "",
    endDate: "",
    status: "Upcoming",
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchTerms = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/v1/exam-names");
      if (response.data.success) {
        setTerms(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch exam terms");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const filteredTerms = terms.filter(term =>
    term.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setFormData(initialFormState);
    setModalType("add");
    setIsModalOpen(true);
  };

  const openEditModal = (term) => {
    setFormData({
      _id: term._id,
      name: term.name || "",
      startDate: term.startDate || "",
      endDate: term.endDate || "",
      status: term.status || "Upcoming"
    });
    setModalType("edit");
    setIsModalOpen(true);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormState);
  };

  const handleSave = async () => {
    if (!formData.name) {
      return toast.error("Exam Name is required");
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status
      };

      if (modalType === "add") {
        const response = await axiosInstance.post("/v1/exam-names", payload);
        if (response.data.success) {
          toast.success("Exam term created successfully");
          fetchTerms();
          closeModal();
        }
      } else {
        const response = await axiosInstance.put(`/v1/exam-names/${formData._id}`, payload);
        if (response.data.success) {
          toast.success("Exam term updated successfully");
          fetchTerms();
          closeModal();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${modalType} exam term`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (term) => {
    setItemToDelete(term);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      const response = await axiosInstance.delete(`/v1/exam-names/${itemToDelete._id}`);
      if (response.data.success) {
        toast.success("Exam term deleted successfully");
        fetchTerms();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete exam term");
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-[#00315e]" />
            Exam Name List
          </h1>
          <div className="flex items-center gap-2 text-[14px] text-slate-500 font-bold mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <span>Examination</span>
            <span>/</span>
            <span className="text-[#00315e]">Exam Name List</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Exam Name..."
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
            Add Exam
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[8px] shadow-xl shadow-slate-100/50 overflow-hidden relative min-h-[400px]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
            <Loader2 className="w-8 h-8 text-[#00315e] animate-spin" />
          </div>
        ) : null}

        {!isLoading && filteredTerms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-24 h-24 bg-blue-50 text-blue-300 rounded-full flex items-center justify-center mb-5 animate-pulse">
              <CalendarDays className="w-12 h-12 text-[#00315e]/40" />
            </div>
            <h3 className="text-xl font-black text-slate-700 mb-2">কোনো পরীক্ষার টার্ম পাওয়া যায়নি</h3>
            <p className="text-slate-500 font-medium text-center max-w-md">
              আপনার তালিকায় এখন পর্যন্ত কোনো পরীক্ষার টার্ম যুক্ত করা হয়নি। নতুন টার্ম যোগ করতে "Add Exam" বাটনে ক্লিক করুন।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-[8px]">
            <table className="w-full">
              <thead className="bg-[#00315e24]">
                <tr>
                  <th className="px-10 py-3 text-left text-[12px] font-black">ID</th>
                  <th className="px-10 py-3 text-center text-[12px] font-black">Exam Name</th>
                  <th className="px-10 py-3 text-center text-[12px] font-black">Schedule</th>
                  <th className="px-10 py-3 text-center text-[12px] font-black">Status</th>
                  <th className="px-10 py-3 text-center text-[12px] font-black">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-50">
                {filteredTerms.map((term, i) => (
                  <tr key={term._id} className="group hover:bg-amber-50/10 transition-all duration-300">
                    <td className="px-10 py-3">
                      <span className="text-base font-medium text-slate-700">{i + 1}</span>
                    </td>
                    <td className="px-10 py-3 text-center">
                      <span className="text-base font-black text-slate-800">{term.name}</span>
                    </td>
                    <td className="px-10 py-3 text-center">
                      <span className="text-sm font-bold text-slate-600">
                        {term.startDate} {term.startDate && term.endDate && "to"} {term.endDate}
                      </span>
                    </td>
                    <td className="px-10 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${term.status === "Active" || term.status === "Upcoming"
                          ? "bg-blue-50 text-blue-700 border-blue-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                          }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${term.status === "Active" || term.status === "Upcoming"
                            ? "bg-blue-500"
                            : "bg-amber-500"
                            }`}
                        />
                        {term.status || "Upcoming"}
                      </span>
                    </td>
                    <td className="px-10 py-3 text-center">
                      <div className="flex items-center gap-3 justify-center">
                        <button className="cursor-pointer" onClick={() => openEditModal(term)}>
                          <SquarePen className="w-4 h-4 text-[#00315e]" />
                        </button>
                        <button className="cursor-pointer" onClick={() => handleDeleteClick(term)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6 sm:p-10">
          <div className="bg-white rounded-[8px] w-full max-w-lg shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in duration-300 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between bg-white">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                {modalType === "add" ? "Add New Term" : "Update Term"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-5">
              <div className="flex flex-col gap-4">
                <InputField
                  title="Exam Name"
                  placeholder="e.g. First Term Examination 2026"
                  value={formData.name}
                  setValue={(val) => handleInputChange("name", val)}
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    title="Start Date"
                    type="date"
                    value={formData.startDate}
                    setValue={(val) => handleInputChange("startDate", val)}
                  />
                  <InputField
                    title="End Date"
                    type="date"
                    value={formData.endDate}
                    setValue={(val) => handleInputChange("endDate", val)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-slate-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 text-slate-900 rounded-[8px] outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="p-6 border-t-2 border-slate-100 bg-slate-50 flex justify-end gap-4 mt-5 -mx-5 -mb-5 rounded-b-[8px]">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 font-bold text-slate-600 hover:bg-white rounded-xl transition-all border-2 border-transparent hover:border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-[#00315e] hover:bg-blue-900 text-white font-bold rounded-[8px] shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  {modalType === "add" ? "Add Term" : "Update Term"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onDelete={confirmDelete}
        itemName={itemToDelete?.name}

        description={
          <>
            আপনি কি নিশ্চিত যে আপনি <span className="font-semibold text-gray-800">"{itemToDelete?.name}"</span> টার্মটি মুছে ফেলতে চান? এই কাজটি বাতিল করা যাবে না।
          </>
        }
        cancelText="বাতিল করুন"
        confirmText="ডিলিট করুন"
      />
    </div>
  );
};

export default ExamTerm;
