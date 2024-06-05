import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import supabase from '../config/supabaseClient.js';
import equipmentimg from '../assets/img/equipmentimg.webp'
import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';


export default function EquipmentTable() {
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [fetchError, setFetchError] = React.useState(null);

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
        .eq('is_deleted', false);

      if (error) {
        setFetchError('Could not fetch equipment data');
        console.error(error);
      } else {
        const initialRows = data.map(item => ({
          id: item.id,
          name: item.name,
          type: item.type,
          model: item.model,
          created_by: item.created_by,
          cost: item.cost,
          description: item.description,
        }));
        setRows(initialRows);
        setFetchError(null);
      }
    };

    fetchEquipment();
  }, []);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel((prevModel) => ({
      ...prevModel,
      [id]: { mode: GridRowModes.Edit }
    }));
  };

  const handleSaveClick = (id) =>  () => {
    setRowModesModel((prevModel) => ({
      ...prevModel,
      [id]: { mode: GridRowModes.View }
    }));

    const updatedRow = rows.find((row) => row.id === id);
    
  };

  const handleDeleteClick = (id) => async () => {

    
    const { error } = await supabase
    .from('equipment')
    .update({is_deleted: true })
    .eq('id', id)
    
    // const { error } = await supabase
    //   .from('equipment')
    //   .delete()
    //   .eq('id', id);

    if (error) {
      console.error('Error deleting row:', error);
    } else {
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    }
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel((prevModel) => ({
      ...prevModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    }));

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow) => {
   
    const updatedRow = { ...newRow, isNew: false };
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === newRow.id ? updatedRow : row))
    );
    
  
    const { error } = await supabase
      .from('equipment')
      .update({
        name: updatedRow.name,
        type: updatedRow.type,
        model: updatedRow.model,
        created_by: updatedRow.created_by,
        cost: updatedRow.cost,
        description: updatedRow.description,
      })
      .eq('id', newRow.id);
  
    
  
    return updatedRow;
  };


  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { 
      field: 'name', 
      headerName: 'Equipment Name', 
      width: 220, 
      editable: true 
    },
    {
      field: 'type',
      headerName: 'Type of Equipment',
      width: 220,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Camera', 'Video Camera', 'Tripod'],
    },
    { 
      field: 'model', 
      headerName: 'Equipment Model', 
      width: 220, 
      editable: true 
    },
    { 
      field: 'created_by', 
      headerName: 'Created By', 
      width: 200, 
      editable: true 
    },
    {
      field: 'cost',
      headerName: 'Cost',
      type: 'number',
      width: 150,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      align: 'left',
      headerAlign: 'left',
      headerName: 'Actions',
      width: 140,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        background: '#DCEDFF',
        height: 500,
        width: '100%',
        '& .actions': {
          color: '#101935',
        },
        '& .textPrimary': {
          color: '#101935',
        },
        
        
      }}
    >
      <DataGrid
        sx={{color: '#101935', zIndex:5}}
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        experimentalFeatures={{ newEditingApi: true }} 
        headerClassName="equipment-table-header"
      />
      <Box sx={{position: 'absolute', bottom: '0', right: '0px', zIndex: 0, opacity: 0.2}}>
                    <img width="400px" src={equipmentimg} alt="background" />
      </Box>
    </Box>
    

    
  );
}