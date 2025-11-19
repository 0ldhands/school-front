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

// icons
const icons = {
  SchoolIcon,
  GroupIcon,
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const admindomains = {
  id: 'Entries',
  title: 'Student Domains',
  type: 'group',
  children: [
    {
      id: 'student-index',
      key: 'student-index', // unique key added
      title: 'New Admission',
      type: 'item',
      url: '/newAdmission',
      icon: icons.SchoolIcon
    },
    {
      id: 'students-index',
      key: 'students-index', // unique key added
      title: 'Booking',
      type: 'item',
      url: '/StudentsBooking',
      icon: icons.SchoolIcon
    },
    {
      id: 'studentss-index',
      key: 'studentss-index', // unique key added
      title: 'Student list',
      type: 'item',
      url: '/allstudentlist',
      icon: icons.GroupIcon
    },
    {
      id: 'studentssS-index',
      key: 'studentssS-index', // unique key added
      title: 'Student Allocation',
      type: 'item',
      url: '/allocation',
      icon: icons.GroupIcon
    },
    {
      id: 'classs-index',
      key: 'classs-index', // unique key added
      title: 'Fees Report',
      type: 'item',
      url: '/allclass',
      icon: icons.GroupIcon
    },
    {
      id: 'classsnew-index',
      key: 'classsnew-index', // unique key added
      title: 'New academic Allocate',
      type: 'item',
      url: '/classAllocation',
      icon: icons.GroupIcon
    }
  ]
};

const Admindomains = sessionStorage.getItem('admin') ? admindomains : sessionStorage.getItem('super') ? admindomains : '';
export default Admindomains;
