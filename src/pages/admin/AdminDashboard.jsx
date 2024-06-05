import * as React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Layoutadmin from '../../layout/Layoutadmin';
import supabase from '../../config/supabaseClient.js';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import img2 from '../../assets/img/welcomeofficial.webp';
import Box from '@mui/material/Box';

export default function AdminDashboard() {
  const [open, setOpen] = React.useState(true);
  
  const [fetchError, setFetchError] = React.useState(null)
  const [equipment, setEquipment] = React.useState(null)
  const [userName, setUserName] = React.useState(null)

  // Fetch equipment and user session data on component mount
  React.useEffect(() => {
    const fetchEquipment = async () => {
      const { data, error } = await supabase
        .schema('public')
        .from('equipment')
        .select()
        .eq('status', true)
        .eq('is_deleted', false);

      if (error) {
        setFetchError('Could not fetch equipment');
        setEquipment(null);
      }
      if (data) {
        setEquipment(data);
        setFetchError(null);
      }
    };
    fetchEquipment();

    const userSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (data) {
        setUserName(data.session.user.user_metadata.name);
      }
    };
    userSession();
  }, []);

  // Create rows for the equipment table
  function createData(name, type, model) {
    return { name, type, model };
  }

  const rows = equipment?.map((item) => createData(item.name, item.type, item.model));

  return (
    <Layoutadmin>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Welcome message */}
          <Grid item xs={12} md={8} lg={12} sx={{ position: 'relative' }}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240, background: "#94B0DA", paddingLeft: "90px" }}>
              <Typography sx={{ fontSize: "100px", color: 'white' }}>
                Welcome
              </Typography>
              <Typography sx={{ fontSize: "50px", color: 'white', textAlign: "center", marginTop: '-25px' }}>
                Admin {userName && userName.charAt(0).toUpperCase() + userName.slice(1)}
              </Typography>
            </Paper>
            <Box sx={{ position: 'absolute', top: '30px', right: '100px', paddingTop: "10px" }}>
              <img width="200px" src={img2} />
            </Box>
          </Grid>

          {/* Available equipment */}
          <Grid item xs={12}>
            <Typography sx={{ fontSize: "30px", textAlign: "center", color: "#101935" }}>
              Available Equipment
            </Typography>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', border: 10, borderColor: "#564787" }}>
              <TableContainer component={Paper} sx={{ maxHeight: 200 }}>
                <Table stickyHeader aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Equipment Name</TableCell>
                      <TableCell align="center">Type of Equipment</TableCell>
                      <TableCell align="right">Equipment Model</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows?.map((row) => (
                      <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="center">{row.type}</TableCell>
                        <TableCell align="right">{row.model}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layoutadmin>
  );
}
