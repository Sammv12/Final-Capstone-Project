import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import DashboardIcon from '@mui/icons-material/Dashboard';
import OfflinePinIcon from '@mui/icons-material/OfflinePin';
import LogoutIcon from '@mui/icons-material/Logout';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ViewListIcon from '@mui/icons-material/ViewList';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';










export const mainListItems = (
  <React.Fragment >

    
    <ListItemButton component={Link} to="/dashboard">
      <ListItemIcon>
        <DashboardIcon  sx={{color: "white"}}/>
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton >

    <ListItemButton component={Link} to="/add"> 
      <ListItemIcon>
        <AddIcon sx={{color: "white"}}/>
      </ListItemIcon>
      <ListItemText primary="Add Equipment" />
    </ListItemButton>

    <ListItemButton component={Link} to="/checkin">
      <ListItemIcon>
        <OfflinePinIcon  sx={{color: "white"}}/>
      </ListItemIcon>
      <ListItemText primary="Check In" />
    </ListItemButton>

    <ListItemButton component={Link} to="/checkout"> 
      <ListItemIcon>
        <MeetingRoomIcon sx={{color: "white"}}/>
      </ListItemIcon>
      <ListItemText primary="Check Out" />
    </ListItemButton>

    <ListItemButton component={Link} to="/logs"> 
      <ListItemIcon>
        <ViewListIcon sx={{color: "white"}}/>
      </ListItemIcon>
      <ListItemText primary="Logs" />
    </ListItemButton>

  </React.Fragment>
);


// log out button
export const secondaryListItems = ({ handleLogout }) =>(
 
  <React.Fragment>
    
    <ListItemButton sx ={{mt:'auto'}} onClick={handleLogout} > 
      <ListItemIcon>
        <LogoutIcon sx={{color: "white"}} />
      </ListItemIcon>
      <ListItemText primary="LogOut"  /> 

    </ListItemButton>
   
  </React.Fragment>
);
  


