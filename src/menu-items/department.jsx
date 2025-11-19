// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Person4Icon from '@mui/icons-material/Person4';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
// icons
const icons = {
  SchoolIcon,
  GroupIcon,
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined,
  GroupAddIcon,
  CurrencyRupeeIcon,
  Person4Icon,
  MenuBookIcon

};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const admindepartment = {
  id: 'department',
  title: 'Allocation',
  type: 'group',
  children: [
    {
      id: 'Department Allocation',
      title: 'Department Allocation',
      type: 'item',
      url: '/department',
      icon: icons.SchoolIcon
    },
    {
      id: 'staff-allocation',
      title: 'Teacher Allocation',
      type: 'item',
      url: '/staffAllocationIndex',
      icon: icons.GroupAddIcon,

    },
    {
      id: 'Student Allocation',
      title: 'Student Allocation',
      type: 'item',
      url: '/allocation',
      icon: icons.MenuBookIcon
    },
    {
      id: 'Fees Allocation',
      title: 'Fees Allocation',
      type: 'item',
      url: '/feescomponents',
      icon: icons.CurrencyRupeeIcon
    },
    
    
  ]
};
const department = sessionStorage.getItem("admin") ? admindepartment:''
// sessionStorage.getItem("super") ? admindepartment :''
export default department;
