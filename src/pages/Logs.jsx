import * as React from 'react';
import Layout from '../layout/Layout';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import img from '../assets/img/welcomeimg.webp';
import Box from '@mui/material/Box';
import supabase from '../config/supabaseClient.js';

// Custom styling for table cells
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#94B0DA",
    color: "#101935",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

// Custom styling for table rows
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function Logs() {
  const [checkin, setCheckin] = React.useState(null); // State for checkin data
  const [fetchError, setFetchError] = React.useState(null); // State for fetch error

  React.useEffect(() => {
    const fetchCheckin = async () => {
      // Fetch checkin data from Supabase
      const { data, error } = await supabase
        .from('checkin')
        .select(`
          id,
          date_returned,
          checkout(
            id,
            purpose,
            sd_card,
            battery_charger,
            status,
            date,
            e_additional,
            equipment( id, name )
          )
        `);

      if (error) {
        setFetchError('Could not fetch checkin data'); // Set error message
        setCheckin(null); // Clear checkin data
      } else {
        const sortedData = data.sort((a, b) => new Date(b.date_returned) - new Date(a.date_returned)); // Sort data by date returned
        setCheckin(sortedData); // Set sorted checkin data
        setFetchError(null); // Clear error message
      }
    };

    fetchCheckin(); // Call fetchCheckin on component mount
  }, []);

  return (
    <Layout>
      <Typography sx={{ fontSize: "30px", textAlign: "center", color: "#1D3461", marginBottom: "20px" }}>
        User History Logs
      </Typography>

      <Box sx={{ position: 'relative' }}>
        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Equipment Name</StyledTableCell>
                <StyledTableCell align="center">Purpose</StyledTableCell>
                <StyledTableCell align="center">Check Out</StyledTableCell>
                <StyledTableCell align="center">Check in</StyledTableCell>
                <StyledTableCell align="center">Additional Equipment</StyledTableCell>
                <StyledTableCell align="center">SD Card Name</StyledTableCell>
                <StyledTableCell align="center">Did you take a battery or charger?</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {checkin?.map((item, key) => (
                <TableRow
                  key={item.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {item.checkout.equipment.name}    
                  </TableCell>
                  <TableCell align="center">{item.checkout.purpose}</TableCell>
                  <TableCell align="center">{new Date(new Date(item.checkout.date).setHours(new Date(item.checkout.date).getHours() - 7)).toLocaleString()}</TableCell>
                  <TableCell align="center">{new Date(new Date(item.date_returned).setHours(new Date(item.date_returned).getHours() - 7)).toLocaleString()}</TableCell>
                  <TableCell align="center">{item.checkout.e_additional ? "Yes" : "No"}</TableCell>
                  <TableCell align="center">{item.checkout.sd_card}</TableCell>
                  <TableCell align="center">{item.checkout.battery_charger ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ position: 'absolute', top: '0', right: '-80px', zIndex: 0, opacity: 0.3 }}>
          <img width="600px" src={img} alt="background" />
        </Box>
      </Box>
    </Layout>
  );
}
