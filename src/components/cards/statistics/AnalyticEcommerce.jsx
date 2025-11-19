import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// project import
import MainCard from 'components/MainCard';

// assets
import RiseOutlined from '@ant-design/icons/RiseOutlined';
import FallOutlined from '@ant-design/icons/FallOutlined';

const iconSX = { fontSize: '0.75rem', color: 'inherit', marginLeft: 0, marginRight: 0 };

export default function AnalyticEcommerce({ color = 'primary', title, count, percentage, isLoss, extra, year }) {
  const [selectedYear, setSelectedYear] = useState(year || '2024');

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    console.log('year', selectedYear);
    // You can perform any additional actions here, like fetching data for the selected year
  };

  return (
    <MainCard contentSX={{ p: 2.25 }}>
      <Stack spacing={0.5}>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
        <Grid container alignItems="center">
          <Grid item>
            <Typography variant="h4" color="inherit">
              {count}
            </Typography>
          </Grid>
          {percentage && (
            <Grid item>
              <Chip
                variant="combined"
                color={color}
                icon={isLoss ? <FallOutlined style={iconSX} /> : <RiseOutlined style={iconSX} />}
                label={`${percentage}%`}
                sx={{ ml: 1.25, pl: 1 }}
                size="small"
              />
            </Grid>
          )}
          {year && ( // Render the year dropdown only if the year prop is provided
            <Grid item sx={{ ml: 1.25 }}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="year-select-label">Year</InputLabel>
                <Select labelId="year-select-label" id="year-select" value={selectedYear} onChange={handleYearChange} size="small">
                  <MenuItem value={'2023-2024'}>2023-2024</MenuItem>
                  <MenuItem value={'2024-2025'}>2024-2025</MenuItem>
                  <MenuItem value={'2025-2026'}>2025-2026</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
      </Stack>
    </MainCard>
  );
}

AnalyticEcommerce.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.string,
  year: PropTypes.string,
  isLoss: PropTypes.bool,
  extra: PropTypes.string,
  percentage: PropTypes.number
};
