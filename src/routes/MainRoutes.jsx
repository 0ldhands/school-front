import { lazy } from 'react';
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

import { element } from 'prop-types';

// Your component imports
import StaffApplication from 'components/TeachersDomain/StaffApplication';
import StudentAllocation from 'components/StudentsDomain/StudentAllocation';
import DepartmentAlloc from 'components/Department/DepartmentAlloc';
import AddDepartment from 'components/Department/AddDepartment';
import Allocation from 'components/StudentsDomain/Allocation';
import EditAlloc from 'components/StudentsDomain/EditAlloc';
import Feespay from 'pages/component-overview/Feesmanagement/Feespay';
import FeesApplication from 'pages/component-overview/Feesmanagement/FeesApplication';
import PayFeesLog from 'pages/component-overview/Feesmanagement/PayFeesLog';
import Timetable from 'components/Timetable/Timetable';
import DiscountIndex from 'components/Discount/DiscountIndex';
import ClassTeach from 'components/StaffAllocation/ClassTeach';
import Studentsattenance from 'components/Employee/Studentsattenance';
import Students from 'components/EmployeField/Students';
import FeesAllocmanu from 'components/Feesmanagement/FeesAllocmanu';
import Allfeesalloc from 'components/Feesmanagement/Allfeesalloc';
import Feesallocstudent from 'components/Feesmanagement/Feesallocstudent';
import Detailattenance from 'components/EmployeField/Detailattenance';
import Markallocation from 'components/EmployeField/Markallocation';
import Exams from 'components/EmployeField/Exams';
import Staffattenance from 'components/EmployeField/Staffattenance';
import Staffdetail from 'components/EmployeField/Staffdetail';
import Vanattenance from 'components/EmployeField/Vanattenance';
import Vanattenancedetails from 'components/EmployeField/Vanattenancedetails';
import Feesslip from 'components/Feesmanagement/Feesslip';
import Classstudents from 'components/EmployeField/Classstudents';
import UploadExcel from 'components/StudentsDomain/UploadExcel';
import ClassList from 'components/ClassesDomain/ClassList';
import AllBookingStudents from 'components/StudentsDomain/StudentsBooking';
import StudentAdmissionApplication from 'components/StudentsDomain/StudentAdmisson';
import EnquiryStudents from 'components/StudentsDomain/EnquiryStudents';
import VanStudent from 'components/Feesmanagement/VanFees';
import EcaStudent from 'components/Feesmanagement/EcaFees';
import ViewStudents from 'components/ClassesDomain/ViewStudents';
import SchemeStudent from 'components/Feesmanagement/SchemeFees';
import ClassSectionAllocation from 'components/ClassesDomain/NewClassAllocate';
import EcaFeeCollectionForm from 'components/Feesmanagement/Ecapayfees';
import VanFeeCollectionForm from 'components/Feesmanagement/vanpayfees';
import SchemeFeeCollectionForm from 'components/Feesmanagement/Shemepayfees';
import VerificationPage from 'components/academic_year/VerificationPage';
import AcademicYearPage from 'components/academic_year/AcademicYearPage';
import LastYearPendingFees from 'components/academic_year/LastYearPendingFees';
import LastyearPayfees from 'components/academic_year/LastyearPayfees';
import LastyearVanfees from 'components/academic_year/LastyearVanfees';
import LastyearSchemefees from 'components/academic_year/LastyearSchemefees';
import LastyearEcafees from 'components/academic_year/LastyearEcapfees';
import Academicyearwisestudents from "../components/academic_year/Academicyearwisestudents"

// import Mystudents from 'components/EmployeField/Mystudents';

const Login = Loadable(lazy(() => import('pages/authentication/login')));
const AddStaffAllocation = Loadable(lazy(() => import('components/StaffAllocation/AddStaffAllocation')));
const StaffAllocationIndex = Loadable(lazy(() => import('components/StaffAllocation/StaffAllocationIndex')));
const Invoice = Loadable(lazy(() => import('components/Invoice/Invoice')));
const EcaInvoice = Loadable(lazy(() => import('components/Invoice/ecainvoice')));
const VanInvoice = Loadable(lazy(() => import('components/Invoice/vaninvoice')));
const SchemeInvoice = Loadable(lazy(() => import('components/Invoice/schemeinvoice')));
const AllFeesLogIndex = Loadable(lazy(() => import('pages/component-overview/Feesmanagement/AllFeesLogIndex')));
const SingleFeeDiscountIndex = Loadable(lazy(() => import('components/Discount/SingleFeeDiscountIndex')));
const FeesPendingStudentsIndex = Loadable(lazy(() => import('components/FeesPendingStudents/FeesPendingStudentsIndex')));
const TimeTableIndex = Loadable(lazy(() => import('components/Timetable/TimeTableIndex')));
const SiblingStudentsIndex = Loadable(lazy(() => import('components/StudentsDomain/SiblingStudentsIndex')));
const FeesLogsIndex = Loadable(lazy(() => import('pages/component-overview/Feesmanagement/FeesLogsIndex')));
const StudentApplication = Loadable(lazy(() => import('components/StudentsDomain/StudentEnquiryApplication')));
const StudentBookingApplication = Loadable(lazy(() => import('components/StudentsDomain/Booking')));
const AllStudents = Loadable(lazy(() => import('components/StudentsDomain/AllStudents')));
const Allstaffs = Loadable(lazy(() => import('components/TeachersDomain/Allstaffs')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const SuperDashboardDefault = Loadable(lazy(() => import('pages/superAdminDashboard/index')));
const EmployeDash = Loadable(lazy(() => import('pages/empdashboard/index')));
const Payfees = Loadable(lazy(() => import('components/Feesmanagement/Payfees')));
const StudentFeespage = Loadable(lazy(() => import('components/Feesmanagement/StudentFeespage')));


const superadminRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <SuperDashboardDefault />
    },
    {
      path: 'Booking',
      element: <StudentBookingApplication />
    },
    {
      path: 'StudentsBooking',
      element: <AllBookingStudents />
    },
    {
      path: 'newAdmission',
      element: <EnquiryStudents />
    },
    {
      path: 'StudentsAdmisson',
      element: <StudentAdmissionApplication />
    },
    {
      path: 'allstudentlist',
      element: <AllStudents />
    },
    {
      path: 'addStudent',
      element: <StudentApplication />
    },
    {
      path: 'uploadExcel',
      element: <UploadExcel />
    },
    {
      path: 'sibStu',
      element: <SiblingStudentsIndex />
    },
    {
      path: 'feePendingStu',
      element: <FeesPendingStudentsIndex />
    },
    {
      path: 'discount',
      element: <DiscountIndex />
    },
    {
      path: 'singleFeesDiscountIndex/:fees_id',
      element: <SingleFeeDiscountIndex />
    },

    {
      path: 'studentalloc/:cls_id',
      element: <StudentAllocation />
    },
    {
      path: '/feespage/:cls_id',
      element: <StudentFeespage />
    },
    {
      path: 'addStaff',
      element: <StaffApplication />
    },
    {
      path: 'allstaffs',
      element: <Allstaffs />
    },
    {
      path: 'addStaffAllocation',
      element: <AddStaffAllocation />
    },
    {
      path: 'staffAllocationIndex',
      element: <StaffAllocationIndex />
    },
    {
      path: 'department',
      element: <DepartmentAlloc />
    },
    {
      path: 'feesslip/:stu_id',
      element: <Feesslip />
    },
    {
      path: 'editalloc',
      element: <EditAlloc />
    },
    {
      path: 'addDept',
      element: <AddDepartment />
    },
    {
      path: 'feesallocationmanu',
      element: <FeesAllocmanu />
    },
    {
      path: 'payfees/:stu_id',
      element: <Payfees />
    },

    {
      path: 'ecapayfees/:stu_id',
      element: <EcaFeeCollectionForm />
    },
    {
      path: 'vanpayfees/:stu_id',
      element: <VanFeeCollectionForm />
    },
    {
      path: 'schemepayfees/:stu_id',
      element: <SchemeFeeCollectionForm />
    },
    {
      path: 'feesstudent',
      element: <Feesallocstudent />
    },
    {
      path: 'feescomponents',
      element: <Allfeesalloc />
    },
    {
      path: 'allocation',
      element: <Allocation />
    },
    {
      path: 'feespay',
      element: <Feespay />
    },
    {
      path: 'allFeesLogIndex',
      element: <AllFeesLogIndex />
    },

    {
      path: 'payfeeslog',
      element: <PayFeesLog />
    },
    {
      path: 'feeLogsByFeeId/:fees_id',
      element: <FeesLogsIndex />
    },
    {
      path: 'invoice/:feeslogid',
      element: <Invoice />
    },
    {
      path: 'ecainvoice/:feeslogid',
      element: <EcaInvoice />
    },
    {
      path: 'vaninvoice/:feeslogid',
      element: <VanInvoice />
    },
    {
      path: 'schemeinvoice/:feeslogid',
      element: <SchemeInvoice />
    },
    {
      path: 'feesapplication',
      element: <FeesApplication />
    },
    {
      path: 'classteach',
      element: <ClassTeach />
    },
    {
      path: 'Studattenance',
      element: <Studentsattenance />
    },
    {
      path: 'allclass',
      element: <ClassList />
    },
    {
      path: 'classAllocation',
      element: <ClassSectionAllocation />
    },
    {
      path: 'viewStudents/:classId',
      element: <ViewStudents />
    },
    {
      path: 'vanfees',
      element: <VanStudent />
    },
    {
      path: 'ecafees',
      element: <EcaStudent />
    },
    {
      path: 'schemefees',
      element: <SchemeStudent />
    },

    {
      path: '/verfication',
      element: <VerificationPage />
    },
    {
      path: '/academic',
      element: <AcademicYearPage />
    },
    {
      path:'/LastYearPandingFees',
      element:<LastYearPendingFees/>
    },
    {
      path:'/LastyearPayfees/:stu_id',
      element:<LastyearPayfees/>
    },
    {
      path:'/LastyearVanfees/:stu_id',
      element:<LastyearVanfees/>    
    },
    {
      path:'/LastyearSchemefees/:stu_id',
      element:<LastyearSchemefees/>
    },
    {
      path:'/LastyearEcafees/:stu_id',
      element:<LastyearEcafees/>
    },
    {
      path:'/Academicyearwisestudents',
      element:<Academicyearwisestudents/>
   },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    }
  ]
};
const adminRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'Booking',
      element: <StudentBookingApplication />
    },
    {
      path: 'StudentsBooking',
      element: <AllBookingStudents />
    },
    {
      path: 'newAdmission',
      element: <EnquiryStudents />
    },
    {
      path: 'StudentsAdmisson',
      element: <StudentAdmissionApplication />
    },
    {
      path: 'allstudentlist',
      element: <AllStudents />
    },
    {
      path: 'addStudent',
      element: <StudentApplication />
    },
    {
      path: 'uploadExcel',
      element: <UploadExcel />
    },
    {
      path: 'sibStu',
      element: <SiblingStudentsIndex />
    },
    {
      path: 'feePendingStu',
      element: <FeesPendingStudentsIndex />
    },
    {
      path: 'discount',
      element: <DiscountIndex />
    },
    {
      path: 'singleFeesDiscountIndex/:fees_id',
      element: <SingleFeeDiscountIndex />
    },

    {
      path: 'studentalloc/:cls_id',
      element: <StudentAllocation />
    },
    {
      path: '/feespage/:cls_id',
      element: <StudentFeespage />
    },
    {
      path: 'addStaff',
      element: <StaffApplication />
    },
    {
      path: 'allstaffs',
      element: <Allstaffs />
    },
    {
      path: 'addStaffAllocation',
      element: <AddStaffAllocation />
    },
    {
      path: 'staffAllocationIndex',
      element: <StaffAllocationIndex />
    },
    {
      path: 'department',
      element: <DepartmentAlloc />
    },
    {
      path: 'feesslip/:stu_id',
      element: <Feesslip />
    },
    {
      path: 'editalloc',
      element: <EditAlloc />
    },
    {
      path: 'addDept',
      element: <AddDepartment />
    },
    {
      path: 'feesallocationmanu',
      element: <FeesAllocmanu />
    },
    {
      path: '/payfees/:stu_id',
      element: <Payfees />
    },
    {
      path: 'ecapayfees/:stu_id',
      element: <EcaFeeCollectionForm />
    },
    {
      path: 'vanpayfees/:stu_id',
      element: <VanFeeCollectionForm />
    },
    {
      path: 'schemepayfees/:stu_id',
      element: <SchemeFeeCollectionForm />
    },
    {
      path: 'feesstudent',
      element: <Feesallocstudent />
    },
    {
      path: 'feescomponents',
      element: <Allfeesalloc />
    },
    {
      path: 'allocation',
      element: <Allocation />
    },
    {
      path: 'feespay',
      element: <Feespay />
    },
    {
      path: 'allFeesLogIndex',
      element: <AllFeesLogIndex />
    },

    {
      path: 'payfeeslog',
      element: <PayFeesLog />
    },
    {
      path: 'feeLogsByFeeId/:fees_id',
      element: <FeesLogsIndex />
    },
    {
      path: 'invoice/:feeslogid',
      element: <Invoice />
    },
    {
      path: 'ecainvoice/:feeslogid',
      element: <EcaInvoice />
    },
    {
      path: 'vaninvoice/:feeslogid',
      element: <VanInvoice />
    },
    {
      path: 'feesapplication',
      element: <FeesApplication />
    },
    {
      path: 'classteach',
      element: <ClassTeach />
    },
    {
      path: 'Studattenance',
      element: <Studentsattenance />
    },
    {
      path: 'allclass',
      element: <ClassList />
    },
    {
      path: 'classAllocation',
      element: <ClassSectionAllocation />
    },
    {
      path: 'viewStudents/:classId',
      element: <ViewStudents />
    },
    {
      path: 'vanfees',
      element: <VanStudent />
    },
    {
      path: 'ecafees',
      element: <EcaStudent />
    },
    {
      path: 'schemefees',
      element: <SchemeStudent />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    }
  ]
};

const employeeRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <EmployeDash />
        }
      ]
    },

    {
      path: '/',
      element: <EmployeDash />
    },
    // {
    //   path: '/mystudents',
    //   element: <Mystudents/>
    // },

    {
      path: '/classstudents',
      element: <Classstudents />
    },
    {
      path: '/attendance',
      element: <Students />
    },
    {
      path: '/markallocstud',
      element: <Markallocation />
    },
    {
      path: '/stafffeesdetail/:staff_id',
      element: <Staffdetail />
    },
    {
      path: '/profile',
      element: <Staffattenance />
    },
    {
      path: '/exams',
      element: <Exams />
    },
    {
      path: '/vanattenance/:staff_id',
      element: <Vanattenance />
    },

    {
      path: '/vanattenancedetails/:staff_id',
      element: <Vanattenancedetails />
    },
    {
      path: 'timeTable',
      element: <TimeTableIndex />
    },
    {
      path: 'addtimetable',
      element: <Timetable />
    },

    {
      path: '/attenancedetails/:staff_id',
      element: <Detailattenance />
    }
  ]
};

const MainRoutes = sessionStorage.getItem('super')
  ? superadminRoutes
  : sessionStorage.getItem('admin')
    ? adminRoutes
    : sessionStorage.getItem('employeeLoggedIn')
      ? employeeRoutes
      : {
          path: '/',
          element: <Login />
        };

export default MainRoutes;
