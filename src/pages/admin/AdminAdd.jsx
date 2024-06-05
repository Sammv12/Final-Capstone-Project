import * as React from 'react';
import Layoutadmin from '../../layout/Layoutadmin';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid'; 
import Typography from '@mui/material/Typography';
import supabase from '../../config/supabaseClient.js';
import Alert from '@mui/material/Alert';
import addimg from '../../assets/img/addimg.webp';

export default function AdminAdd() {
    const [name, setName] = React.useState('');
    const [type, setType] = React.useState('');
    const [cost, setCost] = React.useState('');
    const [model, setModel] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [status, setStatus] = React.useState(true);
    const [formError, setFormError] = React.useState(null);
    const [created_by, setCreated_by] = React.useState('');
    const [formSuccess, setFormSuccess] = React.useState(null);

    // Handles form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if all fields are filled
        if (!name || !type || !cost || !model || !description) {
            setFormError("Please fill in all the fields correctly");
            return;
        }

        try {
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

            // If session data is available, get the user's name
            if (sessionData) {
                const userName = sessionData.session.user.user_metadata.name;
                setCreated_by(userName);

                // Insert new equipment into the database
                const { data, error } = await supabase
                    .from("equipment")
                    .insert([{ name, type, cost, model, description, status, created_by: userName }]);

                if (error) {
                    setFormError("Please fill in all the fields correctly");
                }
            }

            // Reset form and set success message
            setFormError(null);
            setFormSuccess("Successfully Added an equipment.");

            // Clear form fields
            setName('');
            setType('');
            setCost('');
            setModel('');
            setDescription('');
            setStatus(true);

        } catch (error) {
            console.error(error);
            setFormError("An unexpected error occurred");
        }
    };

    return (
        <Layoutadmin>
            <form onSubmit={handleSubmit}>
                {/* Title */}
                <Typography sx={{ fontSize: "60px", textAlign: "center", color: "#101935", marginBottom: '10px' }}>
                    Add Equipment 
                </Typography>
                
                {/* Error message */}
                {formError && <p className='error'>{formError}</p>}

                {/* Success message */}
                {formSuccess && 
                    <Alert variant="filled" severity="success" sx={{ marginBottom: '20px' }}>
                        {formSuccess}
                    </Alert>
                }

                <Grid container spacing={2} sx={{ zIndex: 5 }}>
                    <Grid item xs={6}>
                        {/* Equipment name input */}
                        <Box component="div" sx={{ '& .MuiTextField-root': { width: "100%" } }} noValidate autoComplete="off">
                            <Typography sx={{ fontSize: "30px", textAlign: "center", color: "#101935", marginBottom: '10px' }}>
                                Name of Equipment 
                            </Typography>
                            <TextField
                                sx={{ background: "#DCEDFF7A", zIndex: 5 }}
                                required
                                id="outlined-required"
                                label="Required"
                                placeholder="Name of equipment"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        {/* Type of equipment selector */}
                        <Box>
                            <Typography sx={{ fontSize: "30px", textAlign: "center", color: "#101935", marginBottom: '10px' }}>
                                Type of Equipment 
                            </Typography>
                            <FormControl sx={{ minWidth: '569px', background: "#DCEDFF7A" }}>
                                <InputLabel id="demo-simple-select-helper-label">Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    label="Type"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    <MenuItem value={"Camera"}>Camera</MenuItem>
                                    <MenuItem value={"Video Camera"}>Video Camera</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        {/* Replacement cost input */}
                        <Box component="div" sx={{ '& .MuiTextField-root': { width: "100%" }, marginTop: "20px" }} noValidate autoComplete="off">
                            <Typography sx={{ fontSize: "30px", textAlign: "center", color: "#101935", marginBottom: '10px' }}>
                                Replacement Cost 
                            </Typography>
                            <TextField
                                sx={{ background: "#DCEDFF7A", zIndex: 5 }}
                                required
                                id="outlined-required"
                                label="Required"
                                placeholder="Replacement cost"
                                value={cost}
                                onChange={(e) => setCost(e.target.value)}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        {/* Equipment model input */}
                        <Box component="div" sx={{ '& .MuiTextField-root': { width: "100%" }, marginTop: "20px" }} noValidate autoComplete="off">
                            <Typography sx={{ fontSize: "30px", textAlign: "center", color: "#101935", marginBottom: '10px' }}>
                                Equipment Model 
                            </Typography>
                            <TextField
                                sx={{ background: "#DCEDFF7A", zIndex: 5 }}
                                required
                                id="outlined-required"
                                label="Required"
                                placeholder="Equipment model"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                            />
                        </Box>
                    </Grid>
                </Grid>

                {/* Description input */}
                <Box component="div" sx={{ '& .MuiTextField-root': { width: '100%' }, marginTop: "20px" }} noValidate autoComplete="off">
                    <Typography sx={{ fontSize: "30px", textAlign: "center", color: "#101935", marginBottom: '10px' }}>
                        Description 
                    </Typography>
                    <TextField
                        sx={{ background: "#DCEDFF7A", zIndex: 5 }}
                        required
                        id="outlined-textarea"
                        label="Required"
                        placeholder="Please enter a description"
                        multiline
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Box>

                {/* Submit button */}
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Button variant="contained" size="large" type="submit" sx={{ background: "#564787" }}>
                        Add Equipment
                    </Button>
                </Box>
            </form>

            {/* Background image */}
            <Box sx={{ position: 'absolute', bottom: '0', left: '10', zIndex: 0, opacity: 0.2 }}>
                <img width="300px" src={addimg} alt="background" />
            </Box>
        </Layoutadmin>
    );
}
