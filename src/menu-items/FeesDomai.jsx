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
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PendingActionsIcon from '@mui/icons-material/PendingActions'; // Pending icon
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi'; // Van icon
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import StartIcon from '@mui/icons-material/Start';
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
  title: 'Fees Domain',
  type: 'group',
  children: [

    {
      id: 'Fees Allocation',
      title: 'Fees Allocation',
      type: 'item',
      url: '/feescomponents',
      icon: icons.CurrencyRupeeIcon
    },
    {
      id: 'VanFees Allocation',
      title: 'VAN-Fees',
      type: 'item',
      url: '/vanfees',
      icon: icons.CurrencyRupeeIcon
    },
    {
      id: 'EcaFees Allocation',
      title: 'ECA-Fees',
      type: 'item',
      url: '/ecafees',
      icon: icons.CurrencyRupeeIcon
    },

    {
      id: 'SchemeFees Allocation',
      title: 'Scheme-Fees',
      type: 'item',
      url: '/schemefees',
      icon: icons.CurrencyRupeeIcon
    },

  ]
};



const superadmindepartment = {
  id: 'department',
  title: 'Fees Domain',
  type: 'group',
  children: [

    {
      id: 'Fees Allocation',
      title: 'Fees Allocation',
      type: 'item',
      url: '/feesallocationmanu',
      icon: MonetizationOnIcon
    },
    {
      id: 'Student',
      title: 'Student pay fee',
      type: 'item',
      url: '/feesstudent',
      icon: icons.Person4Icon
    },
    {
      id: 'Fees pending Allocation',
      title: 'Pending Fees List',
      type: 'item',
      url: '/feePendingStu',
      icon: PendingActionsIcon 
    },
    {
      id: 'VanFees Allocation',
      title: 'VAN-Fees',
      type: 'item',
      url: '/vanfees',
      icon: LocalTaxiIcon
    },
    {
      id: 'EcaFees Allocation',
      title: 'ECA-Fees',
      type: 'item',
      url: '/ecafees',
      icon: SportsSoccerIcon
    },

    {
      id: 'SchemeFees Allocation',
      title: 'Scheme-Fees',
      type: 'item',
      url: '/schemefees',
      icon: AttachMoneyIcon
    },
    {
      id:'AcademicYear',
      title:'LastYear-Pending List',
      type:'item',
      url:'/LastYearPandingFees',
      icon:PendingActionsIcon
    },

    {
      id: 'Academic-year-wise-students',
      title: 'Academic year students',
      type: 'item',
      url: '/Academicyearwisestudents',
      icon: AttachMoneyIcon
    },
    {
      id: 'Academy',
      title: 'Academic-year',
      type: 'item',
      url: '/verfication',
      icon: StartIcon
    }

    
  ]
};


const FeesDomain = sessionStorage.getItem("admin") ? admindepartment :
  sessionStorage.getItem("super") ? superadmindepartment : ''
export default FeesDomain;