import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import supabase from '../config/supabaseClient.js';
import alllogs from '../assets/img/alllogs.webp';


export default function TableAllLogs() {
    const [checkin, setCheckin] = React.useState([]);
    const [fetchError, setFetchError] = React.useState(null);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('name');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    React.useEffect(() => {
        const fetchCheckin = async () => {
            const { data, error } = await supabase
                .from('checkin')
                .select(`
                id,
                date_returned,
                verify,
                load_pics,
                battery_charger,
                user_email,
                checkout(
                  id,
                  user_id,
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
                setFetchError('Could not fetch checkin data');
                setCheckin(null);
                
            } else {
                setCheckin(data);
            
                setFetchError(null);
            }
        };
        fetchCheckin();
    }, []);

    function createData(name, user_email, purpose, date, date_returned, e_additional, sd_card, battery_charger, rbattery_charger, verify, load_pics) {
        return {
            name,
            user_email,
            purpose,
            date,
            date_returned,
            e_additional,
            sd_card,
            battery_charger,
            rbattery_charger,
            verify,
            load_pics,
        };
    }

    const rows = checkin?.map((item) =>
        createData(
            item.checkout.equipment.name,
            item.user_email,
            item.checkout.purpose,
            new Date(new Date(item.checkout.date).setHours(new Date(item.checkout.date).getHours() - 7)).toLocaleString(),
            new Date(new Date(item.date_returned).setHours(new Date(item.date_returned).getHours() - 7)).toLocaleString(),
            item.checkout.e_additional ? 'Yes' : 'No',
            item.checkout.sd_card,
            item.checkout.battery_charger ? 'Yes' : 'No',
            item.battery_charger ? 'Yes' : 'No',
            item.verify ? 'Yes' : 'No',
            item.load_pics ? 'Yes' : 'No'
        )
    );

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function stableSort(array, comparator) {
        const stabilizedThis = array?.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) {
                return order;
            }
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    const headCells = [
        { 
        id: 'name', 
        numeric: false,
        disablePadding: false, 
        label: 'Equipment Name' 
        },

        { 
        id: 'user', 
        numeric: false, 
        disablePadding: false, 
        label: 
        'User Name' 
        },

        { 
        id: 'purpose', 
        numeric: false, 
        disablePadding: false, 
        label: 'Purpose' 
        },

        { 
        id: 'date', 
        numeric: false, 
        disablePadding: false,
        label: 'Checkout Date' 
        },

        { 
        id: 'returned_date', 
        numeric: false, 
        disablePadding: false, 
        label: 'Returned Date' 
        },

        { 
        id: 'additional', 
        numeric: false, 
        disablePadding: false, 
        label: 'Additional Equipment' 
        },

        { 
        id: 'sd',
         numeric: false, 
         disablePadding: false, 
         label: 'SD Card Name' 
        },

        { 
        id: 'b_c', 
        numeric: false, 
        disablePadding: false, 
        label: 'Took a battery or charger?' 
        },

        { 
        id: 'r_b_c', 
        numeric: false, 
        disablePadding: false, 
        label: 'Returned a battery or charger?' 
        },

        { 
         id: 'verify',
          numeric: false,
           disablePadding: false, 
           label: 'Was this equipment verified?' 
        },

        { 
        id: 'loaded',
         numeric: false,
         disablePadding: false, 
          label: 'Did you load pictures?' 
        },
    ];

    function EnhancedTableHead(props) {
        const { order, orderBy, onRequestSort } = props;
        const createSortHandler = (property) => (event) => {
            onRequestSort(event, property);
        };

        return (
            <TableHead sx={{background:'#94B0DA'}}>
                <TableRow>
                    {headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.id === 'user' ? 'center' : (headCell.numeric ? 'right' : 'left')}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    }

    EnhancedTableHead.propTypes = {
        onRequestSort: PropTypes.func.isRequired,
        order: PropTypes.oneOf(['asc', 'desc']).isRequired,
        orderBy: PropTypes.string.isRequired,
    };

    function EnhancedTableToolbar() {
        return (
            <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                background:'#101935'}}
                >
                <Typography 
                sx={{ flex: '1 1 100%', color:'white', fontSize:'30px', textAlign:'center'}}
                variant="h6"
                id="tableTitle"
                component="div"
                >
                    Equipment Logs
                </Typography>
            </Toolbar>
        );
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const visibleRows = React.useMemo(
        () => stableSort(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage, rows]
    );

    return (
        <Box sx={{ width: '105%',  color:'#101935' }}>
            <Paper sx={{ width: '100%', mb: 2,  background:'#94B0DA' }}>
                <EnhancedTableToolbar />
                <TableContainer>
                    <Table sx={{ minWidth: 750, background:'#DCEDFF' }}
                    aria-labelledby="tableTitle" 
                    size={'medium'}>
                        <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                        <TableBody>
                        {visibleRows.map((row, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow hover tabIndex={-1} key={index} sx={{ cursor: 'pointer' }}>
                                        <TableCell component="th" id={labelId} scope="row" padding="normal">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">{row.user_email}</TableCell>
                                        <TableCell align="left">{row.purpose}</TableCell>
                                        <TableCell align="left">{row.date}</TableCell>
                                        <TableCell align="left">{row.date_returned}</TableCell>
                                        <TableCell align="left">{row.e_additional}</TableCell>
                                        <TableCell align="left">{row.sd_card}</TableCell>
                                        <TableCell align="left">{row.battery_charger}</TableCell>
                                        <TableCell align="left">{row.rbattery_charger}</TableCell>
                                        <TableCell align="left">{row.verify}</TableCell>
                                        <TableCell align="left">{row.load_pics}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <Box sx={{position: 'absolute', bottom: '0', right: '0', zIndex: 0, opacity: 0.3}}>
        <img width="300px" src={alllogs} alt="background" />
</Box> 
            
            
        </Box>

        
    );
}
