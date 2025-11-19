// assets
import {
    AppstoreAddOutlined,
    AntDesignOutlined,
    BarcodeOutlined,
    BgColorsOutlined,
    FontSizeOutlined,
    LoadingOutlined
  } from '@ant-design/icons';
  
  import SchoolIcon from '@mui/icons-material/School';
  import GroupIcon from '@mui/icons-material/Group';
  import GroupAddIcon from '@mui/icons-material/GroupAdd';

  
  // icons
  const icons = {
    SchoolIcon,
    GroupIcon,
    GroupAddIcon,
    FontSizeOutlined,
    BgColorsOutlined,
    BarcodeOutlined,
    AntDesignOutlined,
    LoadingOutlined,
    AppstoreAddOutlined
  
  };
  
  // ==============================|| MENU ITEMS - UTILITIES ||============================== //
  

  
  const teachersdomain={
    id: 'Entries',
    title: 'Teachers Domain',
    type: 'group',
    children: [
     
      // {
      //   id: 'class-students',
      //   title: 'class-Students',
      //   type: 'item',
      //   url: '/classstudents',
      //   icon: icons.SchoolIcon
      // },
      {
        id: 'class-students',
        title: 'Teacher',
        type: 'item',
        url: '/allstaffs',
        icon: icons.SchoolIcon
      },
      {
        id: 'staff-allocation',
        title: 'Teacher Allocation',
        type: 'item',
        url: '/staffAllocationIndex',
        icon: icons.GroupAddIcon,
  
      },
    //   {
    //     id: 'Mark allocation',
    //     title: 'Mark allocation',
    //     type: 'item',
    //     url: '/exams',
    //     icon: icons.SchoolIcon
    //   },
      // {
      //   id: 'Profile',
      //   title: 'Profile',
      //   type: 'item',
      //   url: '/profile',
      //   icon: icons.SchoolIcon
      // },
    //   {
    //     id: 'TimeTable',
    //     title: 'TimeTable',
    //     type: 'item',
    //     url: '/timetable',
    //     icon: icons.SchoolIcon
    //   },
      
     
     
      
    ]
  }

  const teacherdomain={
    id: 'Entries',
    title: 'Teachers Domain',
    type: 'group',
    children: [

      {
        id: 'Teacher_dashBoard',
        title: 'DashBoard',
        type: 'item',
        url: '/',
        icon: icons.SchoolIcon
      },
     
      {
        id: 'class-students',
        title: 'class-Students',
        type: 'item',
        url: '/classstudents',
        icon: icons.SchoolIcon
      },
      // {
      //   id: 'class-students',
      //   title: 'Teacher',
      //   type: 'item',
      //   url: '/classstudents',
      //   icon: icons.SchoolIcon
      // },
      {
        id: 'Attendance',
        title: 'Attendance',
        type: 'item',
        url: '/attendance',
        icon: icons.SchoolIcon
      },
      {
        id: 'Mark allocation',
        title: 'Mark allocation',
        type: 'item',
        url: '/exams',
        icon: icons.SchoolIcon
      },
      {
        id: 'Profile',
        title: 'Profile',
        type: 'item',
        url: '/profile',
        icon: icons.SchoolIcon
      },
      {
        id: 'TimeTable',
        title: 'TimeTable',
        type: 'item',
        url: '/timetable',
        icon: icons.SchoolIcon
      },
      
     
     
      
    ]
  }
  const teacherdomains = sessionStorage.getItem("admin") ? teachersdomain :
  sessionStorage.getItem("super") ? teachersdomain :
   sessionStorage.getItem("employeeLoggedIn") ? teacherdomain :
  sessionStorage.getItem("employeeLoggedIn") ? teachersdomain :''
  export default teacherdomains;
  