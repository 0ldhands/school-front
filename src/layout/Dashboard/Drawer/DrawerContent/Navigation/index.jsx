// material-ui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

export default function Navigation() {
  const navGroups = menuItem.items.map((item, index) => {
    // Create a unique key by combining id with index
    const key = item.id ? `${item.id}-${index}` : index;

    switch (item.type) {
      case 'group':
        return <NavGroup key={key} item={item} />;
      default:
        return (
          <Typography key={key} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
}
