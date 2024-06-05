import * as React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Layout from '../layout/Layout';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import supabase from '../config/supabaseClient.js';
import img2 from '../assets/img/welcomeofficial.webp';
import Box from '@mui/material/Box';

export default function Dashboard() {
  const [fetchError, setFetchError] = React.useState(null) // State for fetch error
  const [equipment, setEquipment] = React.useState(null) // State for equipment data
  const [userName, setUserName] = React.useState(null) // State for user name

  React.useEffect(() => {
    const fetchEquipment = async () => {
      // Fetch equipment data from Supabase
      const { data, error } = await supabase
        .schema('public')
        .from('equipment')
        .select()
        .eq('status', true)

      if (error) {
        setFetchError('could not fetch equipment') // Set error message
        setEquipment(null) // Clear equipment data
      }
      if (data) {
        setEquipment(data) // Set fetched equipment data
        setFetchError(null) // Clear error message
      }
    }
    fetchEquipment(); // Call fetchEquipment on component mount

    const userSession = async () => {
      // Fetch user session data from Supabase
      const { data, error } = await supabase.auth.getSession()

      if (data) {
        setUserName(data.session.user.user_metadata.name) // Set user name
      }
    }
    userSession(); // Call userSession on component mount
  }, []);

  // Create data structure for table rows
  function createData(name, type, model) {
    return { name, type, model };
  }

  const rows = equipment?.map((item) => createData(item.name, item.type, item.model)); // Map equipment data to table rows

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>

          <Grid item xs={12} md={8} lg={12} sx={{ position: 'relative' }}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
                background: "#94B0DA",
                paddingLeft: "90px"
              }}
            >
              <Typography sx={{ fontSize: "100px", color: 'white' }}>
                Welcome
              </Typography>

              <Typography sx={{ fontSize: "50px", color: 'white', textAlign: "center", marginTop: '-25px' }}>
                {userName && userName.charAt(0).toUpperCase() + userName.slice(1)}
              </Typography>
            </Paper>
            <Box sx={{ position: 'absolute', top: '30px', right: '100px', paddingTop: "10px" }} >
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
                      <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
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
    </Layout>
  );
}
