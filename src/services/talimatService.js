import axiosInstance from '../api/axiosInstance';
import endpoints from '../api/endpoints';

const talimatService = {
  createExam: async (examData) => {
    const response = await axiosInstance.post(endpoints.talimat.exams, examData);
    return response.data;
  },

  enterResult: async (resultData) => {
    const response = await axiosInstance.post(endpoints.talimat.results, resultData);
    return response.data;
  },

  getExamResults: async (examId) => {
    const response = await axiosInstance.get(`${endpoints.talimat.results}/${examId}`);
    return response.data;
  },

  // Exam Schedules
  getExamSchedules: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await axiosInstance.get(`${endpoints.talimat.examSchedules}${params ? `?${params}` : ''}`);
    return response.data;
  },
  createExamSchedule: async (data) => {
    const response = await axiosInstance.post(endpoints.talimat.examSchedules, data);
    return response.data;
  },
  updateExamSchedule: async (id, data) => {
    const response = await axiosInstance.put(`${endpoints.talimat.examSchedules}/${id}`, data);
    return response.data;
  },
  deleteExamSchedule: async (id) => {
    const response = await axiosInstance.delete(`${endpoints.talimat.examSchedules}/${id}`);
    return response.data;
  },

  // Exam Names
  getExamNames: async () => {
    const response = await axiosInstance.get(endpoints.talimat.examNames);
    return response.data;
  },

  // Classes & Subjects
  getClasses: async () => {
    const response = await axiosInstance.get(endpoints.common.classes);
    return response.data;
  },
  getSubjects: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await axiosInstance.get(`${endpoints.common.subjects}${params ? `?${params}` : ''}`);
    return response.data;
  }
};

export default talimatService;
