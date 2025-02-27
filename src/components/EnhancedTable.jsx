import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
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
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import supabase from '../config/supabaseClient.js';
import Alert from '@mui/material/Alert';



export default function EnhancedTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [fetchError, setFetchError] = React.useState(null)
  const [equipment, setEquipment] = React.useState([])
  const [formError, setFormError] = React.useState(null);
  const [formSuccess, setFormSuccess] = React.useState(null);
  

  React.useEffect(() => {
    
        const fetchEquipment = async () => {
         
            const { data, error } = await supabase
                .from('equipment')
                .select(`
                id,
                name,
                type,
                model,
                created_by,
                cost,
                description
                `)
                
           
    
            if (error) {
                setFetchError('Could not fetch checkin data');
                setEquipment([]);
             
            } else {
                setEquipment(data);
                
                setFetchError(null);
            }
        };
    
        
        fetchEquipment();
      }, []);

  function createData(id,name, type, model,created_by, cost, description) {
    return { 
        id,
        name,
        type,
        model, 
        created_by, 
        cost, 
        description
    };
}

const rows = equipment.map((item) => createData(item.id, item.name, item.type, item.model, item.created_by, item.cost, item.description));
  
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
      disablePadding: true,
      label: 'Equipment Name',
    },
    {
        id: 'type',
        numeric: false,
        disablePadding: false,
        label: 'Type of Equipment',
    },
    {
        id: 'model',
        numeric: false,
        disablePadding: false,
        label: 'Equipment Model',
    },

    {
      id: 'created_by',
      numeric: false,
      disablePadding: false,
      label: 'Created By',
    },
    
    {
      id: 'cost',
      numeric: false,
      disablePadding: false,
      label: 'Cost',
    },
    
    {
        id: 'description',
        numeric: false,
        disablePadding: false,
        label: 'Equipment description',
    },
  ];
  
  function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
      props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
  
    return (
      <TableHead sx={{background:'#94B0DA'}}>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all equipment',
              }}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
              sx={{color:'#101935', fontSize:'15px'}}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'desc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'asc' ? 'sorted descending' : 'sorted ascending'}
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
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };
  
  const handleDelete = async () => {
   

    const { error } = await supabase
      .from('equipment')
      .delete()
      .in('id', selected);
  
    if (!error) {
      setEquipment(equipment.filter(item => !selected.includes(item.id)));
      setSelected([]);
      setFormSuccess("Successfully Deleted equipment.");

    } else {
      console.error(error);
      setFormError("Error deleting items")
    }
  };

  function EnhancedTableToolbar(props) {
    const { numSelected } = props;
  
    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          background:'#101935',
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color='#101935'
            variant="subtitle1"
            component="div"
          >
           {numSelected} selected
          </Typography>

          
        ) : (
          <Typography
            sx={{ flex: '1 1 100%', color:'white', fontSize:'30px', textAlign:'center'}}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Equipment
          </Typography>

        )}


          {numSelected > 0 && (
            <Tooltip title="Delete">
              <IconButton onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
  
      </Toolbar>
    );
  }
  
  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
    
  };

 

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () => stableSort(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows]
);

  return (
    <Box>

        { formError && 
        <Alert variant="filled" severity="error">
        {formError}
        </Alert> }

        { formSuccess && 
        <Alert variant="filled" severity="success" sx={{marginBottom:'20px'}}>
          {formSuccess}
        </Alert>}

      <Box sx={{ width: '100%' , color:'#101935'}}>
      
      <Paper sx={{ width: '100%', mb: 2,  background:'#94B0DA' }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750, background:'#DCEDFF' }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows?.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                

                return (
                  <TableRow
                    
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={index}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                      sx={{color:'#101935', fontSize:'15px'}}
                    >
                      {row.name}
                    </TableCell>
                    <TableCell align="left" sx={{color:'#101935', fontSize:'15px'}}>{row.type}</TableCell>
                    
                    <TableCell align="left" sx={{color:'#101935', fontSize:'15px'}}>{row.model}</TableCell>
                    <TableCell align="left" sx={{color:'#101935', fontSize:'15px'}}>{row.created_by}</TableCell>
                    <TableCell align="left" sx={{color:'#101935', fontSize:'15px'}}>${row.cost}</TableCell>
                    <TableCell align="left" sx={{color:'#101935', fontSize:'15px'}}>{row.description}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
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
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>

    </Box>
    
  );
}