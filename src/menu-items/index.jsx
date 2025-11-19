// project import
import dashboards from './dashboard';
import pages from './page';
import utilities from './utilities';
import studentdomains from './students';
import teacherdomains from './teacherdomai';
// import support from './support';
import department from './department';
import FeesDomain from './FeesDomai';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboards, studentdomains, teacherdomains, FeesDomain]
};

export default menuItems;
