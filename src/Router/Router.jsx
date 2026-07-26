import { createBrowserRouter, Navigate } from "react-router-dom";
// import Login from "../Pages/Auth/Login";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

// Role-Based Dashboards
import SuperAdminDashboard from "../Pages/SuperAdmin/Dashboard";
import MadrasaList from "../Pages/SuperAdmin/MadrasaList";
import Settings from "../Pages/SuperAdmin/Settings";
import PlanList from "../Pages/SuperAdmin/PlanList";
import BillingList from "../Pages/SuperAdmin/BillingList";
import SmsSettings from "../Pages/SuperAdmin/SmsSettings";
import AdminDashboard from "../Pages/Admin/Dashboard";
import SmsPortal from "../Pages/Admin/SmsPortal";
import Placeholder from "../Pages/Admin/Placeholder";
import { adminNavigation } from "../navigation/adminNavigation";
import { teacherNavigation } from "../navigation/teacherNavigation";
import { studentNavigation } from "../navigation/studentNavigation";
import { guardianNavigation } from "../navigation/guardianNavigation";
import { talimatNavigation } from "../navigation/talimatNavigation";
import { accountingNavigation } from "../navigation/accountingNavigation";
import TalimatDashboard from "../Pages/Talimat/Dashboard";
import AccountingDashboard from "../Pages/Accounting/Dashboard";
import TeachersDashboard from "../Pages/Teachers/Dashboard";
import StudentsDashboard from "../Pages/Students/Dashboard";
import StaffDashboard from "../Pages/Staff/Dashboard";
import MySchedule from "../Pages/Teachers/MySchedule";
import MarkAttendance from "../Pages/Teachers/MarkAttendance";
import HomeworkManager from "../Pages/Teachers/HomeworkManager";
import Gradebook from "../Pages/Teachers/Gradebook";
import MySubjects from "../Pages/Teachers/MySubjects";
import TeacherStudentList from "../Pages/Teachers/StudentList";
import NoticeBoard from "../Pages/Teachers/NoticeBoard";
import TeacherProfile from "../Pages/Teachers/Profile";
import TeacherExamSchedule from "../Pages/Teachers/ExamSchedule";
import TeacherPayroll from "../Pages/Teachers/TeacherPayroll";
import TeacherAttendanceReport from "../Pages/Teachers/AttendanceReport";
import FrontendManager from "../Pages/Admin/FrontendManager";
import OnlineAdmissionList from "../Pages/Admin/OnlineAdmissionList";
import CreateAdmission from "../Pages/Admin/CreateAdmission";
import StudentList from "../Pages/Admin/StudentList";
import StudentProfile from "../Pages/Admin/StudentProfile";
import DeactivatedStudentList from "../Pages/Admin/DeactivatedStudentList";
import ParentList from "../Pages/Admin/ParentList";
import DeactivatedParentList from "../Pages/Admin/DeactivatedParentList";
import EmployeeList from "../Pages/Admin/EmployeeList";
import DepartmentList from "../Pages/Admin/DepartmentList";
import DesignationList from "../Pages/Admin/DesignationList";
import DeactivatedEmployeeList from "../Pages/Admin/DeactivatedEmployeeList";
import CreateEmployee from "../Pages/Admin/CreateEmployee";
import StudentAttendance from "../Pages/Admin/StudentAttendance";
import EmployeeAttendance from "../Pages/Admin/EmployeeAttendance";
import ExamAttendance from "../Pages/Admin/ExamAttendance";
import AssignTeacher from "../Pages/Admin/AssignTeacher";
import SubjectTypeList from "../Pages/Admin/SubjectTypeList";
import ClassSubjectAssign from "../Pages/Admin/ClassSubjectAssign";
import ClassList from "../Pages/Admin/ClassList";
import SectionList from "../Pages/Admin/SectionList";
import ClassAssign from "../Pages/Admin/ClassAssign";
import ClassSchedule from "../Pages/Admin/ClassSchedule";
import ClassSyllabus from "../Pages/Admin/ClassSyllabus";
import TeacherSchedule from "../Pages/Admin/TeacherSchedule";
import HomeworkList from "../Pages/Admin/HomeworkList";
import HomeworkReport from "../Pages/Admin/HomeworkReport";
import TabulationSheet from "../Pages/Admin/TabulationSheet";
import ExamScheduleList from "../Pages/Admin/ExamScheduleList";
import MarkEntries from "../Pages/Admin/MarkEntries";
import GradesRange from "../Pages/Admin/GradesRange";
import ExamTerm from "../Pages/Admin/ExamTerm";
import IdCardTemplate from "../Pages/Admin/IdCardTemplate";
import StudentIdCard from "../Pages/Admin/StudentIdCard";
import EmployeeIdCard from "../Pages/Admin/EmployeeIdCard";
import AdmitCardTemplate from "../Pages/Admin/AdmitCardTemplate";
import GenerateAdmitCard from "../Pages/Admin/GenerateAdmitCard";
import CertificateTemplate from "../Pages/Admin/CertificateTemplate";
import GenerateStudentCertificate from "../Pages/Admin/GenerateStudentCertificate";
import GenerateEmployeeCertificate from "../Pages/Admin/GenerateEmployeeCertificate";
import ProductList from "../Pages/Admin/ProductList";
import CategoryList from "../Pages/Admin/CategoryList";
import StoreList from "../Pages/Admin/StoreList";
import SupplierList from "../Pages/Admin/SupplierList";
import UnitList from "../Pages/Admin/UnitList";
import PurchaseList from "../Pages/Admin/PurchaseList";
import SalesList from "../Pages/Admin/SalesList";
import IssueList from "../Pages/Admin/IssueList";
import LibraryManager from "../Pages/Admin/LibraryManager";
import EventsManager from "../Pages/Admin/EventsManager";
import MessageCenter from "../Pages/Admin/MessageCenter";
import StudentReports from "../Pages/Admin/StudentReports";
import FeesReports from "../Pages/Admin/FeesReports";
import FinancialReports from "../Pages/Admin/FinancialReports";
import AttendanceReports from "../Pages/Admin/AttendanceReports";
import ExamReports from "../Pages/Admin/ExamReports";
import InventoryReports from "../Pages/Admin/InventoryReports";
import AdmissionReports from "../Pages/Admin/AdmissionReports";
import StudentAcademicReport from "../Pages/Admin/AcademicReports/StudentAcademicReport";
import ClassRoutineReport from "../Pages/Admin/AcademicReports/ClassRoutineReport";
import SyllabusCoverageReport from "../Pages/Admin/AcademicReports/SyllabusCoverageReport";
import ClassSubjectAssignmentReport from "../Pages/Admin/AcademicReports/ClassSubjectAssignmentReport";
import OverallHomeworkReport from "../Pages/Admin/AcademicReports/OverallHomeworkReport";
import StudentAttendanceReport from "../Pages/Admin/StudentAttendanceReport";
import StaffAttendanceReport from "../Pages/Admin/StaffAttendanceReport";
import ExamAttendanceReport from "../Pages/Admin/ExamAttendanceReport";
import SettingsPage from "../Pages/Admin/SettingsPage";
import DonationEntry from "../Pages/Accounting/DonationEntry";
import FeeCollection from "../Pages/Accounting/FeeCollection";
import PayrollProcess from "../Pages/Accounting/PayrollProcess";
import FeeSetup from "../Pages/Accounting/FeeType";
import DuesPending from "../Pages/Admin/DuesPending";
import DonationHistory from "../Pages/Accounting/DonationHistory";
import SalaryHistory from "../Pages/Accounting/SalaryHistory";
import MadrasaPortal from "../Pages/Portal/MadrasaPortal";
import AboutUs from "../Pages/Portal/AboutUs";
import AdmissionGuidelines from "../Pages/Portal/AdmissionGuidelines";
import OnlineAdmissionForm from "../Pages/Portal/OnlineAdmissionForm";
import Login from "../Pages/Auth/Login";
import AccountDeactivated from "../Pages/Auth/AccountDeactivated";

// import DepartmentSectionList from "../Pages/Admin/DepartmentSectionList";
import PaySalary from "../Pages/Accounting/PaySalary";
import FreeCollectionReport from "../Pages/Accounting/FreeCollectionReport";
import SalaryReport from "../Pages/Accounting/SalaryReport";
import DonationReport from "../Pages/Accounting/DonationReport";
import IncomeExpenseReport from "../Pages/Accounting/IncomeExpenseReport";
import IncomeEntry from "../Pages/Accounting/IncomeEntry";
import ExpenseEntry from "../Pages/Accounting/ExpenseEntry";
import PortalLayout from "../layouts/PortalLayout";
import SalarySetup from "../Pages/Admin/SalarySetup";



// Guardian Pages
import FeesAndDues from "../Pages/Guardian/FeesAndDues";
import PaymentHistory from "../Pages/Guardian/PaymentHistory";
import GuardianAttendance from "../Pages/Guardian/Attendance";
import GuardianProfile from "../Pages/Guardian/Profile";
import GuardianDashboard from "../Pages/Guardian/Dashboard";
import LeaveApplication from "../Pages/Guardian/LeaveApplication";
import GuardianNoticeBoard from "../Pages/Guardian/NoticeBoard";
import GuardianCommunication from "../Pages/Guardian/Communication";
import GuardianSubjectList from "../Pages/Guardian/SubjectList";
import GuardianClassRoutine from "../Pages/Guardian/ClassRoutine";
import GuardianExamSchedule from "../Pages/Guardian/ExamSchedule";
import GuardianExamResults from "../Pages/Guardian/ExamResults";

// Student Pages
import StudentSchedule from "../Pages/Students/Schedule";
import StudentSubjects from "../Pages/Students/Subjects";
import PendingTasks from "../Pages/Students/PendingTasks";
import SubmissionHistory from "../Pages/Students/SubmissionHistory";
import StudentExamSchedule from "../Pages/Students/ExamSchedule";
import StudentResults from "../Pages/Students/Results";
import StudentLibrary from "../Pages/Students/Library";
import EBooks from "../Pages/Students/EBooks";
import StudentProfilePage from "../Pages/Students/Profile";
import FeeType from "../Pages/Accounting/FeeType";
import Home from "../Pages/Home/Home";

// Helper to flatten routes
const flattenRoutes = (navItems) => {
  let routes = [];
  navItems.forEach((item) => {
    if (item.path && item.path !== "/admin" && item.path !== "/teacher") {
      let element = <Placeholder title={item.name} />;

      // Map specific paths to their components
      if (item.path === "/admin/frontend") {
        element = <FrontendManager />;
      }
      if (item.path === "/admin/admissions/online") {
        element = <OnlineAdmissionList />;
      }
      if (item.path === "/admin/admission/create") {
        element = <CreateAdmission />;
      }
      if (item.path === "/admin/admission/report") {
        element = <AdmissionReports />;
      }
      if (item.path.startsWith("/admin/student/profile/")) {
        element = <StudentProfile />;
      }
      if (item.path === "/admin/student/list") {
        element = <StudentList />;
      }
      if (item.path === "/admin/student/deactive") {
        element = <DeactivatedStudentList />;
      }
      if (item.path === "/admin/parents/list") {
        element = <ParentList />;
      }
      if (item.path === "/admin/parents/deactive") {
        element = <DeactivatedParentList />;
      }
      if (item.path === "/admin/employee/list") {
        element = <EmployeeList />;
      }
      if (item.path === "/admin/employee/create") {
        element = <CreateEmployee />;
      }
      if (item.path === "/admin/employee/department") {
        element = <DepartmentList />;
      }
      if (item.path === "/admin/employee/designation") {
        element = <DesignationList />;
      }
      if (item.path === "/admin/employee/salary-setup") {
        element = <SalarySetup />;
      }

      if (item.path === "/admin/employee/deactive") {
        element = <DeactivatedEmployeeList />;
      }
      if (item.path === "/admin/attendance/student") {
        element = <StudentAttendance />;
      }
      if (item.path === "/admin/attendance/employee") {
        element = <EmployeeAttendance />;
      }

      if (item.path === "/admin/attendance/exam") {
        element = <ExamAttendance />;
      }
      if (item.path === "/admin/academic/class") {
        element = <ClassList />;
      }
      if (item.path === "/admin/academic/section") {
        element = <SectionList />;
      }
      if (item.path === "/admin/academic/assign-teacher") {
        element = <AssignTeacher />;
      }
      if (item.path === "/admin/academic/subject-type") {
        element = <SubjectTypeList />;
      }
      if (item.path === "/admin/academic/class-subject") {
        element = <ClassSubjectAssign />;
      }
      if (item.path === "/admin/academic/class-assign") {
        element = <ClassAssign />;
      }
      if (item.path === "/admin/academic/schedule/class") {
        element = <ClassSchedule />;
      }
      if (item.path === "/admin/academic/syllabus") {
        element = <ClassSyllabus />;
      }
      if (item.path === "/admin/academic/schedule/teacher") {
        element = <TeacherSchedule />;
      }
      if (item.path === "/admin/academic/reports/student") {
        element = <StudentAcademicReport />;
      }
      if (item.path === "/admin/academic/reports/routine") {
        element = <ClassRoutineReport />;
      }
      if (item.path === "/admin/academic/reports/syllabus") {
        element = <SyllabusCoverageReport />;
      }
      if (item.path === "/admin/academic/reports/assignments") {
        element = <ClassSubjectAssignmentReport />;
      }
      if (item.path === "/admin/academic/reports/homework") {
        element = <OverallHomeworkReport />;
      }

      if (item.path === "/admin/homework/list") {
        element = <HomeworkList />;
      }
      if (item.path === "/admin/homework/report") {
        element = <HomeworkReport />;
      }
      if (item.path === "/admin/exam/term") {
        element = <ExamTerm />;
      }
      if (item.path === "/admin/exam/schedule") {
        element = <ExamScheduleList />;
      }
      if (item.path === "/admin/exam/grade") {
        element = <GradesRange />;
      }
      if (item.path === "/admin/exam/marks/entry") {
        element = <MarkEntries />;
      }
      if (item.path === "/admin/exam/tabulation") {
        element = <TabulationSheet />;
      }
      if (item.path === "/admin/card/template") {
        element = <IdCardTemplate />;
      }
      if (item.path === "/admin/card/student") {
        element = <StudentIdCard />;
      }
      if (item.path === "/admin/card/employee") {
        element = <EmployeeIdCard />;
      }
      if (item.path === "/admin/card/admit-template") {
        element = <AdmitCardTemplate />;
      }
      if (item.path === "/admin/card/admit-generate") {
        element = <GenerateAdmitCard />;
      }
      if (item.path === "/admin/certificate/template") {
        element = <CertificateTemplate />;
      }
      if (item.path === "/admin/certificate/student") {
        element = <GenerateStudentCertificate />;
      }
      if (item.path === "/admin/certificate/employee") {
        element = <GenerateEmployeeCertificate />;
      }
      if (item.path === "/admin/inventory/product") {
        element = <ProductList />;
      }
      if (item.path === "/admin/inventory/category") {
        element = <CategoryList />;
      }
      if (item.path === "/admin/inventory/store") {
        element = <StoreList />;
      }
      if (item.path === "/admin/inventory/supplier") {
        element = <SupplierList />;
      }
      if (item.path === "/admin/inventory/unit") {
        element = <UnitList />;
      }
      if (item.path === "/admin/inventory/purchase") {
        element = <PurchaseList />;
      }
      if (item.path === "/admin/inventory/sales") {
        element = <SalesList />;
      }
      if (item.path === "/admin/inventory/issue") {
        element = <IssueList />;
      }
      if (item.path === "/admin/library") {
        element = <LibraryManager />;
      }
      if (item.path === "/admin/events") {
        element = <EventsManager />;
      }
      if (item.path === "/admin/message") {
        element = <MessageCenter />;
      }

      // Accounting Routes Mapping
      if (item.path === "/admin/accounting/donation/create") {
        element = <DonationEntry />;
      }
      if (item.path === "/admin/accounting/donation/list") {
        element = <DonationHistory />;
      }
      if (item.path === "/admin/accounting/fees/collect") {
        element = <FeeCollection />;
      }
      // if (item.path === "/admin/accounting/fees/setup") {
      //   element = <FeeSetup />;
      // }
      if (item.path === "/admin/accounting/fees/type") {
        element = <FeeType />;
      }
      if (item.path === "/admin/accounting/payroll/process") {
        element = <PayrollProcess />;
      }
      if (item.path === "/admin/accounting/payroll/pay") {
        element = <PaySalary />;
      }
      if (item.path === "/admin/accounting/payroll/history") {
        element = <SalaryHistory />;
      }
      if (item.path === "/admin/accounting/fees/dues") {
        element = <DuesPending />;
      }
      if (item.path === "/admin/accounting/income/create") {
        element = <IncomeEntry />;
      }
      if (item.path === "/admin/accounting/expense/create") {
        element = <ExpenseEntry />;
      }

      // Reports
      if (item.path?.startsWith("/admin/reports/student")) {
        element = <StudentReports />;
      }
      if (item.path?.startsWith("/admin/reports/fees")) {
        element = <FeesReports />;
      }
      if (item.path?.startsWith("/admin/reports/finance")) {
        element = <FinancialReports />;
      }
      if (item.path === "/admin/attendance/report/student") {
        element = <StudentAttendanceReport />;
      }
      if (item.path === "/admin/attendance/report/staff") {
        element = <StaffAttendanceReport />;
      }
      if (item.path === "/admin/attendance/report/exam") {
        element = <ExamAttendanceReport />;
      }
      if (item.path?.startsWith("/admin/reports/attendance")) {
        element = <AttendanceReports />;
      }
      if (item.path?.startsWith("/admin/reports/exam")) {
        element = <ExamReports />;
      }
      if (item.path?.startsWith("/admin/reports/inventory")) {
        element = <InventoryReports />;
      }
      if (item.path === "/admin/accounting/report/free-collection") {
        element = <FreeCollectionReport />;
      }
      if (item.path === "/admin/accounting/report/salary") {
        element = <SalaryReport />;
      }
      if (item.path === "/admin/accounting/report/donation") {
        element = <DonationReport />;
      }
      if (item.path === "/admin/accounting/report/income-expense") {
        element = <IncomeExpenseReport />;
      }

      // Settings
      if (item.path === "/admin/settings") {
        element = <SettingsPage />;
      }
      if (item.path === "/admin/sms-portal") {
        element = <SmsPortal />;
      }

      // Teacher Routes Mapping
      if (item.path === "/teacher/academic/schedule") {
        element = <MySchedule />;
      }
      if (item.path === "/teacher/attendance/daily") {
        element = <MarkAttendance />;
      }
      if (item.path?.startsWith("/teacher/homework")) {
        element = <HomeworkManager />;
      }
      if (item.path === "/teacher/exam/marks") {
        element = <Gradebook />;
      }

      if (item.path === "/teacher/academic/subjects") {
        element = <MySubjects />;
      }
      if (item.path?.startsWith("/teacher/student")) {
        element = <TeacherStudentList />;
      }
      if (item.path?.startsWith("/teacher/notice")) {
        element = <NoticeBoard />;
      }

      if (item.path === "/teacher/exam/schedule") {
        element = <TeacherExamSchedule />;
      }
      if (item.path === "/teacher/attendance/report") {
        element = <TeacherAttendanceReport />;
      }

      // Secondary/Shared Teacher Routes
      if (item.path?.startsWith("/teacher/message")) {
        element = <MessageCenter />;
      }
      
      if (item.path === "/teacher/finance/salary") {
        element = <TeacherPayroll />;
      }

      if (item.path === "/teacher/profile") {
        element = <TeacherProfile />;
      }

      // Guardian Routes Mapping
      if (item.path === "/guardian/dashboard") element = <GuardianDashboard />;
      if (item.path === "/guardian/finance/fees") element = <FeesAndDues />;
      if (item.path === "/guardian/finance/history")
        element = <PaymentHistory />;
      if (item.path === "/guardian/attendance")
        element = <GuardianAttendance />;
      if (item.path === "/guardian/leave-application")
        element = <LeaveApplication />;
      if (item.path === "/guardian/notice") element = <GuardianNoticeBoard />;
      if (item.path === "/guardian/message") element = <GuardianCommunication />;
      if (item.path === "/guardian/profile") element = <GuardianProfile />;
      
      // New Academic & Examination Routes
      if (item.path === "/guardian/academic/subjects") element = <GuardianSubjectList />;
      if (item.path === "/guardian/academic/routine") element = <GuardianClassRoutine />;
      if (item.path === "/guardian/examination/schedule") element = <GuardianExamSchedule />;
      if (item.path === "/guardian/examination/results") element = <GuardianExamResults />;

      // Student Routes Mapping
      if (item.path === "/student/dashboard") element = <StudentsDashboard />;
      if (item.path === "/student/academic/schedule")
        element = <StudentSchedule />;
      if (item.path === "/student/academic/subjects")
        element = <StudentSubjects />;
      if (item.path === "/student/homework/pending") element = <PendingTasks />;
      if (item.path === "/student/homework/history")
        element = <SubmissionHistory />;
      if (item.path === "/student/exam/schedule")
        element = <StudentExamSchedule />;
      if (item.path === "/student/exam/results") element = <StudentResults />;
      if (item.path === "/student/library") element = <StudentLibrary />;
      if (item.path === "/student/library/ebooks") element = <EBooks />;
      if (item.path === "/student/notice") element = <NoticeBoard />;
      if (item.path === "/student/message") element = <MessageCenter />;
      if (item.path === "/student/profile") element = <StudentProfilePage />;

      routes.push({ path: item.path, element });
    }
    if (item.children) {
      routes = [...routes, ...flattenRoutes(item.children)];
    }
  });
  return routes;
};

const adminRoutes = flattenRoutes(adminNavigation);
const teacherRoutes = flattenRoutes(teacherNavigation);
const studentRoutes = flattenRoutes(studentNavigation);
const guardianRoutes = flattenRoutes(guardianNavigation);
const talimatRoutes = flattenRoutes(talimatNavigation);
const accountingRoutes = flattenRoutes(accountingNavigation);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/:slug",
    element: <PortalLayout />,
    children: [
      { index: true, element: <MadrasaPortal /> },
      { path: "about", element: <AboutUs /> },
      { path: "admission", element: <AdmissionGuidelines /> },
      { path: "online-admission", element: <OnlineAdmissionForm /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/account-deactivated",
        element: <AccountDeactivated />,
      },
    ],
  },
  {
    element: <ProtectedRoute />, // Wrap with Main Layout
    children: [
      {
        element: <MainLayout />,
        children: [
          // Super Admin Routes
          {
            element: <ProtectedRoute allowedRoles={["super_admin"]} />,
            children: [
              { path: "/super-admin", element: <SuperAdminDashboard /> },
              { path: "/super-admin/madrasas", element: <MadrasaList /> },
              { path: "/super-admin/settings", element: <Settings /> },
              { path: "/super-admin/plans", element: <PlanList /> },
              { path: "/super-admin/billing", element: <BillingList /> },
              { path: "/super-admin/sms", element: <SmsSettings /> },
            ],
          },
          // Admin (Muhtamim) Routes - accessible by talimat and accountant for specific modules
          {
            element: (
              <ProtectedRoute
                allowedRoles={["admin", "talimat", "accountant", "mohtamim"]}
              />
            ),
            children: [
              { path: "/admin", element: <AdminDashboard /> },
              {
                path: "/admin/student/profile/:id",
                element: <StudentProfile />,
              },
              ...adminRoutes,
            ],
          },
          // Teacher Routes - accessible by admin and talimat too
          {
            element: (
              <ProtectedRoute allowedRoles={["teacher", "admin", "talimat", "mohtamim"]} />
            ),
            children: [
              { path: "/teacher", element: <TeachersDashboard /> },
              ...teacherRoutes,
            ],
          },
          // Talimat Routes
          {
            element: <ProtectedRoute allowedRoles={["talimat", "admin", "mohtamim"]} />,
            children: [
              { path: "/talimat", element: <TalimatDashboard /> },
              ...talimatRoutes,
            ],
          },
          // Accounting Routes
          {
            element: <ProtectedRoute allowedRoles={["accountant", "admin", "mohtamim"]} />,
            children: [
              { path: "/accounting", element: <AccountingDashboard /> },
              ...accountingRoutes,
            ],
          },
          // Other Roles

          {
            element: <ProtectedRoute allowedRoles={["student"]} />,
            children: [
              {
                path: "/student",
                element: <Navigate to="/student/dashboard" replace />,
              },
              { path: "/student/dashboard", element: <StudentsDashboard /> },
              ...studentRoutes,
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={["guardian"]} />,
            children: [
              {
                path: "/guardian",
                element: <Navigate to="/guardian/dashboard" replace />,
              },
              ...guardianRoutes,
            ],
          },
          { path: "/students", element: <StudentsDashboard /> },
          { path: "/staff", element: <StaffDashboard /> },
        ],
      },
    ],
  },
  {
    path: "/unauthorized",
    element: (
      <div className="p-10 text-center">
        <h1>Unauthorized Access</h1>
        <a href="/login" className="text-blue-500">
          Go to Login
        </a>
      </div>
    ),
  },
  {
    path: "*",
    element: (
      <div className="p-10 text-center">
        <h1>404 - Page Not Found</h1>
      </div>
    ),
  },
]);

export default router;
