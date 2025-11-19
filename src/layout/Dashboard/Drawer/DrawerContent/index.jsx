import Navigation from './Navigation';
import SimpleBar from 'components/third-party/SimpleBar';

// ==============================|| DRAWER CONTENT ||============================== //

export default function DrawerContent() {
  return (
    <>
  <SimpleBar sx={{
  height: '110vh', // Takes up 80% of the viewport height
  '& .simplebar-content': { 
    display: 'flex', 
    flexDirection: 'column' 
  }
}}>
  <Navigation />
</SimpleBar>


    </>
  );
}
