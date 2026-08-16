import { useState, useEffect } from "react";
import {
  Search,
  Save,
  Filter,
  BookOpen,
  X,
} from "lucide-react";
import SelectInputField from "../../components/SelectInputField";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

const MarkEntries = () => {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedExam, setSelectedExam] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [marksData, setMarksData] = useState({});

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchSubjects(selectedClass);
    } else {
      setSubjects([]);
      setSelectedSubject("");
    }
  }, [selectedClass]);

  const fetchInitialData = async () => {
    try {
      const [examNamesRes, classesRes] = await Promise.all([
        axiosInstance.get("/v1/exam-names"),
        axiosInstance.get("/v1/classes"),
      ]);

      if (examNamesRes.data?.success) {
        setExams(
          examNamesRes.data.data.map((ex) => ({
            value: ex._id,
            label: ex.name || "Unknown Exam",
          }))
        );
      }
      if (classesRes.data?.success) {
        setClasses(
          classesRes.data.data.map((c) => ({ value: c._id, label: c.name }))
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load initial data");
    }
  };

  const fetchSubjects = async (classId) => {
    try {
      const res = await axiosInstance.get(`/v1/subjects?class_id=${classId}`);
      if (res.data?.success) {
        setSubjects(
          res.data.data.map((s) => ({ value: s._id, label: s.name }))
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load subjects");
    }
  };

  const handleApplyFilters = () => {
    setIsFilterModalOpen(false);
    if (!selectedExam || !selectedClass || !selectedSubject) {
      toast.error("Please select Exam, Class and Subject");
      return;
    }
    fetchStudentsAndMarks();
  };

  const fetchStudentsAndMarks = async () => {
    setLoading(true);
    try {
      const [studentsRes, resultsRes] = await Promise.all([
        axiosInstance.get(`/v1/students?class_id=${selectedClass}`),
        axiosInstance.get(
          `/v1/results?exam_id=${selectedExam}&class_id=${selectedClass}&subject_id=${selectedSubject}`
        ),
      ]);

      let fetchedStudents = [];
      let fetchedResults = [];

      if (studentsRes.data?.success) fetchedStudents = studentsRes.data.data;
      if (resultsRes.data?.success) fetchedResults = resultsRes.data.data;

      setStudents(fetchedStudents);
      setResults(fetchedResults);

      const initialMarksData = {};
      fetchedStudents.forEach((student) => {
        const existingResult = fetchedResults.find(
          (r) =>
            r.student_id === student._id || r.student_id?._id === student._id
        );
        if (existingResult) {
          initialMarksData[student._id] = {
            result_id: existingResult._id,
            marks_obtained: existingResult.marks_obtained,
            isNew: false,
          };
        } else {
          initialMarksData[student._id] = {
            result_id: null,
            marks_obtained: "",
            isNew: true,
          };
        }
      });
      setMarksData(initialMarksData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load students and marks");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (studentId, value) => {
    setMarksData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        marks_obtained: value,
      },
    }));
  };

  const handleSaveChanges = async () => {
    if (!selectedExam || !selectedClass || !selectedSubject) {
      toast.error("Please apply filters first");
      return;
    }

    setIsSaving(true);
    let successCount = 0;
    let failCount = 0;

    try {
      const promises = students.map((student) => {
        const markInfo = marksData[student._id];

        if (markInfo && markInfo.marks_obtained !== "") {
          const payload = {
            student_id: student._id,
            exam_id: selectedExam,
            class_id: selectedClass,
            subject_id: selectedSubject,
            marks_obtained: Number(markInfo.marks_obtained),
            total_marks: 100, // Assuming out of 100
          };

          if (markInfo.isNew) {
            return axiosInstance
              .post("/v1/results", payload)
              .then(() => {
                successCount++;
              })
              .catch(() => {
                failCount++;
              });
          } else {
            return axiosInstance
              .put(`/v1/results/${markInfo.result_id}`, payload)
              .then(() => {
                successCount++;
              })
              .catch(() => {
                failCount++;
              });
          }
        }
        return Promise.resolve();
      });

      await Promise.all(promises);

      if (successCount > 0)
        toast.success(`Saved marks for ${successCount} students`);
      if (failCount > 0)
        toast.error(`Failed to save for ${failCount} students`);

      // Refresh to get updated result IDs
      if (successCount > 0) {
        fetchStudentsAndMarks();
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredStudents = students.filter(
    (student) => {
      const fullName = `${student.firstName || ""} ${student.lastName || ""}`.trim();
      return (
        fullName.toLowerCase().includes((searchTerm || "").toLowerCase()) ||
        (student.roll_number &&
          student.roll_number.toString().includes(searchTerm))
      );
    }
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-5 gap-4">
        <div className="mb-2 lg:mb-0">
          <h1 className="text-[20px] font-black text-slate-800 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-[#00315e]" />
            Mark Entries
          </h1>
          <p className="text-[14px] text-slate-500 font-bold mt-1">
            Register and manage student examination scores
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
              className="w-full sm:w-auto px-4 h-[42px] bg-white border border-slate-200 text-slate-700 rounded-[8px] cursor-pointer flex items-center justify-center gap-2 transition-colors hover:bg-slate-50 font-bold text-sm"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>

            {/* Filter Dropdown */}
            {isFilterModalOpen && (
              <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-[320px] bg-white rounded-[8px] shadow-2xl border border-slate-200 z-50 p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-black text-slate-800 text-sm flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#00315e]" />
                    Filter Options
                  </h3>
                  <button
                    onClick={() => setIsFilterModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <SelectInputField
                  title={"Exam Name"}
                  options={exams}
                  value={selectedExam}
                  setValue={setSelectedExam}
                />
                <SelectInputField
                  title={"Class"}
                  options={classes}
                  value={selectedClass}
                  setValue={setSelectedClass}
                />
                <SelectInputField
                  title={"Subject"}
                  options={subjects}
                  value={selectedSubject}
                  setValue={setSelectedSubject}
                />
                <div className="pt-2">
                  <button
                    onClick={handleApplyFilters}
                    className="w-full py-2 bg-[#00315e] hover:bg-blue-900 text-white font-bold rounded-[8px] shadow-sm transition-all cursor-pointer text-sm"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleSaveChanges}
            disabled={isSaving || students.length === 0}
            className={`w-full sm:w-auto px-6 h-[42px] text-white rounded-[8px] cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap transition-colors font-bold text-sm ${isSaving || students.length === 0
                ? "bg-slate-300 cursor-not-allowed"
                : "bg-[#00315e] hover:bg-blue-900"
              }`}
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="bg-white rounded-[8px] shadow-xl shadow-slate-100/50 border border-gray-200 mb-20 p-16 flex flex-col items-center justify-center text-center animate-in fade-in">
          <div className="w-12 h-12 border-4 border-[#00315e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-black text-slate-800 mb-1">Loading Data</h3>
          <p className="text-slate-500 font-bold">Please wait while we fetch the students and marks.</p>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-[8px] shadow-xl shadow-slate-100/50 border border-gray-200 mb-20 p-16 flex flex-col items-center justify-center text-center animate-in fade-in">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-5 border-4 border-blue-100/50">
            <Filter className="w-10 h-10 text-[#00315e]" />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">No Students Loaded</h3>
          <p className="text-slate-500 font-bold max-w-md">
            Please select an Exam, Class, and Subject from the filter menu and apply to load the marking list.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[8px] shadow-xl shadow-slate-100/50 overflow-hidden mb-20 relative border border-gray-200 animate-in fade-in">
          <div className="p-4 bg-white border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-[12px] font-black text-slate-800 uppercase tracking-widest">
                Marking Table
              </span>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-[6px] text-[10px] font-bold text-slate-500 uppercase">
                  Total (100)
                </span>
              </div>
            </div>
            <div className="relative w-full sm:w-64 flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 text-slate-900 rounded-[8px] outline-none focus:ring-0.5 focus:ring-blue-500 transition-all text-sm"
                placeholder="Search student..."
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#00315e24]">
                <tr>
                  <th className="px-8 py-3 text-left text-[12px] font-black text-slate-800 uppercase tracking-widest">
                    Roll
                  </th>
                  <th className="px-8 py-3 text-left text-[12px] font-black text-slate-800 uppercase tracking-widest">
                    Student
                  </th>

                  <th className="px-8 py-3 text-center text-[12px] font-black text-slate-800 uppercase tracking-widest">
                    Marks Obtained
                  </th>

                  <th className="px-8 py-3 text-center text-[12px] font-black text-slate-800 uppercase tracking-widest">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-50">
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-slate-500 font-bold">
                      No matching students found for "{searchTerm}".
                    </td>
                  </tr>
                )}
                {filteredStudents.map((student) => {
                  const markInfo = marksData[student._id] || {};

                  return (
                    <tr
                      key={student._id}
                      className="group hover:bg-blue-50/30 transition-colors duration-300"
                    >
                      <td className="px-8 py-4">
                        <span className="text-sm font-black text-[#00315e] tracking-tight">
                          {student.roll_number || "N/A"}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800">
                            {student.firstName} {student.lastName}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            ID: {student._id?.slice(-6)}
                          </span>
                        </div>
                      </td>

                      <td className="px-8 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            disabled={student.status === "inactive"}
                            value={
                              markInfo.marks_obtained !== undefined
                                ? markInfo.marks_obtained
                                : ""
                            }
                            onChange={(e) =>
                              handleMarkChange(student._id, e.target.value)
                            }
                            className={`w-24 px-4 py-2 bg-white border border-slate-200 rounded-[8px] text-sm font-bold text-center focus:outline-none transition-all ${student.status === "inactive"
                                ? "opacity-30 bg-slate-50"
                                : "focus:border-[#00315e] focus:ring-1 focus:ring-[#00315e]"
                              }`}
                            placeholder="00"
                          />
                        </div>
                      </td>

                      <td className="px-8 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${student.status === "active"
                              ? "bg-blue-50 text-blue-700 border-blue-100"
                              : "bg-rose-50 text-rose-700 border-rose-100"
                            }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${student.status === "active"
                                ? "bg-blue-500"
                                : "bg-rose-500"
                              }`}
                          />
                          {student.status || "active"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkEntries;
