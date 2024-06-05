import * as React from 'react';
import Layoutadmin from '../../layout/Layoutadmin';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import supabase from '../../config/supabaseClient';
import noData from '../../assets/img/nodata.webp';
import Box from '@mui/material/Box';
import checkinimg from '../../assets/img/checkin.webp';

// Custom styling for table cell and row
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor:"#94B0DA",
      color:"#101935",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
}));

export default function OutCameras(){
    const [checkout, setCheckout] = React.useState(null);
    const [fetchError, setFetchError] = React.useState(null);

    React.useEffect(() => {
        
        // Fetch checkout data on component mount
        const fetchCheckout = async () => {
            const { data, error } = await supabase
                .from('checkout')
                .select(`
                    id,
                    e_name,
                    purpose,
                    e_additional,
                    sd_card,
                    battery_charger,
                    date,
                    user_email,
                    equipment(
                        id,
                        name
                    )
                `)
                .eq('status', false);
            
            if (error) {
                setFetchError('Could not fetch checkin data');
                setCheckout(null);
            } else {
                setCheckout(data);
                setFetchError(null);
            }
        };

        fetchCheckout();
    }, []);

    return(
        <Layoutadmin>
            <Typography sx={{fontSize:"30px", textAlign: "center", color:"#1D3461", marginBottom:"20px"}}>
                Currently Cameras Out
            </Typography>
            {checkout && checkout.length > 0 ? (
                <TableContainer component={Paper} >
                    <Table sx={{ minWidth: 650 }} aria-label="customized table">
                        <TableHead >
                            <TableRow >
                                <StyledTableCell >Camera Name</StyledTableCell>
                                <StyledTableCell align="center">Purpose</StyledTableCell>
                                <StyledTableCell align="center">Date</StyledTableCell>
                                <StyledTableCell align="center">User Email</StyledTableCell>
                                <StyledTableCell align="center">Additional Equipment</StyledTableCell>
                                <StyledTableCell align="center">Sd Card Name</StyledTableCell>
                                <StyledTableCell align="center">Battery or Charger</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {checkout?.map((item, key) => (
                                <TableRow
                                    key={item.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {item.equipment.name}
                                    </TableCell>
                                    <TableCell align="center">{item.purpose}</TableCell>
                                    <TableCell align="center">{new Date(new Date(item.date).setHours(new Date(item.date).getHours() -7)).toLocaleString()}</TableCell>
                                    <TableCell align="center">{item.user_email}</TableCell>
                                    <TableCell align="center">{item.e_additional ? "Yes" : "No"}</TableCell>
                                    <TableCell align="center">{item.sd_card}</TableCell>
                                    <TableCell align="center">{item.battery_charger ? "Yes" : "No"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Box sx={{position: 'absolute', bottom: '0', right: '0px', zIndex: 0, opacity: 0.2}}>
                        <img width="550px" src={checkinimg} alt="background" />
                    </Box>
                </TableContainer>
            ) : (
                <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
                    <Typography sx={{fontSize:"40px", textAlign: "center", color:"#101935", marginTop:"10px"}}>
                        There is no equipment out
                    </Typography>
                    <img src={noData} width="300px" alt="No data available"  />
                </Box>
            )}
        </Layoutadmin>
    );
}
