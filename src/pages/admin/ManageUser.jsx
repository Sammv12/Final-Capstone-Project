import * as React from 'react';
import Layoutadmin from '../../layout/Layoutadmin';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import supabase from '../../config/supabaseClient.js';
import userimg from '../../assets/img/userimg.webp'
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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

export default function ManageUser(){

  const [userinfo, setUserinfo] = React.useState(null);
  const [fetchError, setFetchError] = React.useState(null);

  React.useEffect(() => {
    
    // Fetch user info on component mount
    const fetchUserInfo = async () => {
      const { data, error } = await supabase
        .from('user_info')
        .select();
   
      if (error) {
        setFetchError('Could not fetch user info');
        setUserinfo(null);
      }
      if (data) {
        setUserinfo(data);
        setFetchError(null);
      }
    };
    fetchUserInfo();
  
  }, []);

  return(
    <Layoutadmin >

      <Typography sx={{fontSize:"30px", textAlign: "center", color:"#1D3461", marginBottom:"20px"}}>
        Users
      </Typography>

      <TableContainer component={Paper} >
        <Table sx={{ minWidth: 650 }} aria-label="customized table">
          <TableHead >
            <TableRow >
              <StyledTableCell >Id</StyledTableCell>
              <StyledTableCell align="center">User Name</StyledTableCell>
              <StyledTableCell align="center">Email</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userinfo?.map((item, key) => (
              <StyledTableRow
                key={item.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {item.id}
                </TableCell>
                <TableCell align="center">{item.username}</TableCell>
                <TableCell align="center">{item.user_email}</TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{position: 'absolute', bottom: '0', left: '10', zIndex: 0, opacity: 0.2}}>
        <img width="300px" src={userimg} alt="background" />
      </Box>
    </Layoutadmin>
  );
}
