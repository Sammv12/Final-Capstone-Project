import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ViewListIcon from '@mui/icons-material/ViewList';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';

import { Link } from 'react-router-dom';




export const mainListItems = (
  <React.Fragment >

    
    <ListItemButton component={Link} to="/admin/dashboard">
      <ListItemIcon>
        <DashboardIcon  sx={{color: "white"}}/>
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton >

    <ListItemButton component={Link} to="/admin/add"> 
      <ListItemIcon>
        <AddIcon sx={{color: "white"}}/>
      </ListItemIcon>
      <ListItemText primary="Add Equipment" />
    </ListItemButton>

    <ListItemButton component={Link} to="/admin/manageuser"> 
      <ListItemIcon>
        <ManageAccountsIcon sx={{color: "white"}}/>
      </ListItemIcon>
      <ListItemText primary="App Users" />
    </ListItemButton>

    <ListItemButton component={Link} to="/admin/alllogs"> 
      <ListItemIcon>
        <ViewListIcon sx={{color: "white"}}/>
      </ListItemIcon>
      <ListItemText primary="Logs" />
    </ListItemButton>

    <ListItemButton component={Link} to="/admin/camerasout"> 
      <ListItemIcon>
        <CameraAltIcon sx={{color: "white"}}/>
      </ListItemIcon>
      <ListItemText primary="Equipment Out" />
    </ListItemButton>

    <ListItemButton component={Link} to="/admin/equipment"> 
      <ListItemIcon>
        <HomeRepairServiceIcon sx={{color: "white"}}/>
      </ListItemIcon>
      <ListItemText primary="Equipment" />
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
  