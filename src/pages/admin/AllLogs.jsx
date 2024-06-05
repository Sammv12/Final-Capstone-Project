import * as React from 'react';
import Layoutadmin from '../../layout/Layoutadmin';
import Typography from '@mui/material/Typography';
import TableAllLogs from '../../components/TableAllLogs';








export default function AllLogs(){
  // const [checkin, setCheckin] = React.useState(null);
 

    return(
        <Layoutadmin>
            <Typography sx={{fontSize:"60px", textAlign: "center", color:"#1D3461", marginBottom:"20px"}}>
                All Logs
            </Typography>

            <TableAllLogs />

        </Layoutadmin>
    );
}