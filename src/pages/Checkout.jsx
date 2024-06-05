import * as React from 'react';
import Layout from '../layout/Layout';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid'; 
import supabase from '../config/supabaseClient.js';
import Alert from '@mui/material/Alert';
import checkoutimg from '../assets/img/checkoutimg.webp';




export default function Checkout(){
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [purpose, setPurpose] = React.useState('');
    const [sd_card, setSd_card] = React.useState('');
    const [battery_charger, setBattery_charger] = React.useState(true);
    const [status, setStatus] = React.useState(false);
    const [e_name, setE_name] = React.useState();
    const [e_additional, setE_additional] = React.useState(true);
    const [formError, setFormError] = React.useState(null);
    const [formSuccess, setFormSuccess] = React.useState(null);
    
  

    const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    const id = event.currentTarget.getAttribute('data-id');
    const newId= parseInt(id);
   
    
    setE_name(newId);
    };

    const [fetchError, setFetchError] = React.useState(null)
    const [equipment, setEquipment] = React.useState(null)
    const [user_email, setUser_email] = React.useState('');



    const fetchEquipment = async () => {
        const { data, error } = await supabase
            .schema('public')
            .from('equipment')
            .select()
            .eq('status', true)
            .eq('is_deleted', false);

        setE_name(data[0]?.id);

        if (error) {
            setFetchError('Could not fetch equipment');
            setEquipment(null);
            
        }
        if (data) {

            const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
            setEquipment(sortedData);
            setE_name(sortedData[0]?.id);
            setFetchError(null);

            



        }
    };

    React.useEffect(() => {
            
            fetchEquipment();

            const userSession = async () =>{
                const { data, error } = await supabase.auth.getSession()
    
                if (data){
                    setUser_email(data.session.user.email)
                    
    
                    
                }
    
              }
              userSession();
            
        }, []);
    
    

    const handleSubmit = async (e) => {
        e.preventDefault()


        if(!purpose || !sd_card || !battery_charger || !e_additional){
            setFormError("Please fill in all the fields correctly")
            return
        }

        // console.log(purpose, sd_card, battery_charger, e_name, e_additional)
        

        const {data, error} = await supabase
        .from("checkout")
        .insert([{purpose, sd_card, battery_charger, e_name, e_additional, status, user_email}])

        if(!error){
            const { error } = await supabase
            .from('equipment')
            .update({status: false })
            .eq('id', e_name)

            fetchEquipment(); 
           
            
        }
        

        

        setFormError(null);
        setFormSuccess("Successfully checkout a equipment.");
        setPurpose('');
        setSd_card('');
        setBattery_charger(true)
        setE_name()
        setE_additional(true)
        setStatus(false)
    }
    
    return(
        <Layout>
           <form onSubmit={handleSubmit}>
           <Typography sx={{fontSize:"60px", textAlign: "center", color:"#101935"}}>
                Check Out
            </Typography>
            {/* Selector for camera */}
            {formError && <p style={{ color: 'red' }} className='error'>{formError}</p>}

            { formSuccess && 
			<Alert variant="filled" severity="success" sx={{marginBottom:'20px'}}>
				{formSuccess}
			</Alert>}
            
            <Grid container spacing={2}>
            <Grid item xs={6}>
            <Box sx={{ width: '90%'}}>
                    <Typography sx={{fontSize:"30px", textAlign: "center", color:"#101935"}}>
                        Equipment Name
                    </Typography>
                
                    <List component="nav" aria-label="main mailbox folders" sx={{bgcolor: '#DCEDFF', color:"#101935", height: '350px',
                    overflowY: 'auto' }}>
                    
                    {/* gets name of the equipment */}
                   {fetchError && <p>{fetchError}</p>}
                   {equipment && (
                   <div>
                    {equipment.map((item, key) => (
                        <ListItemButton 
                        key={key}
                        selected={selectedIndex === key}
                        onClick={(event) => handleListItemClick(event, key, item.id)}
                        data-id={item.id}
                        sx={{
                            '&.Mui-selected': {
                                bgcolor: '#94B0DA',
                                color: '#fff'
                            }
                        }}
                        >
                        <ListItemText primary={item.name} secondary={item.type}/>
                        </ListItemButton>
                    ))} 
                    </div>
                     )}
                 
                       
                    </List>
                </Box>
                
            </Grid>

            {/* textbox for input of purpose */}
            <Grid item xs={6}>
                
                <Box
                component="div"
                sx={{
                '& .MuiTextField-root': {width: '100%' },
                marginBottom: "20px"
                
                }}
                noValidate
                autoComplete="off"
                >
                <Typography sx={{fontSize:"30px", color:"#101935"}}>
                    Purpose
                </Typography>

                <TextField
                    sx={{ background:"#DCEDFF7A", zIndex: 5}}
                    required
                    id="outlined-textarea"
                    label="Required"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Please enter purpuse of check out"
                    multiline

                />
                </Box>

                {/* textbox for input of additionla equipment */}
               
                <Box>
                <Typography sx={{fontSize:"30px", color:"#101935"}}>
                        Additional Equipment 
                </Typography>

                <FormControl sx={{marginLeft:"20px"}}>
                <FormLabel id="row-radio-buttons-group-label" sx={{fontSize:"20px", color:"#101935", marginTop:"10px", }} >
                    Did you take a Tripod?</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="radio-for-checking if tripod wherer taken out"
                    name="row-radio-buttons-group"
                    value={e_additional}
                    onChange={(e) => setE_additional(e.target.value)}
                >
                    <FormControlLabel value={true} control={<Radio/>} label="Yes"/>
                    <FormControlLabel value={false} control={<Radio />} label="No"/>
                </RadioGroup>
                </FormControl>

                </Box>

                {/* textbox for input of SD card name */}
                <Box
                component="div"
                sx={{
                '& .MuiTextField-root': { width: '100%' },
                marginBottom: "20px"
                }}
                noValidate
                autoComplete="off"
                >
                <Typography sx={{fontSize:"30px", color:"#101935"}}>
                        SD Card Name
                </Typography>

                <TextField
                    sx={{ background:"#DCEDFF7A" ,zIndex: 5}}
                    required
                    id="outlined-textarea"
                    label="Required"
                    value={sd_card}
                    onChange={(e) => setSd_card(e.target.value)}
                    placeholder="Please enter SD Card Name"

                />
                </Box>

                <Box>
                <FormControl >
                <FormLabel id="row-radio-buttons-group-label" sx={{fontSize:"20px", color:"#101935", marginTop:"10px"}} >
                    Did you take a battery or charger?</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="radio-for-checking if batteries wherer taken out"
                    name="row-radio-buttons-group"
                    value={battery_charger}
                    onChange={(e) => setBattery_charger(e.target.value)}
                >
                    <FormControlLabel value={true} control={<Radio/>} label="Yes"/>
                    <FormControlLabel value={false} control={<Radio />} label="No"/>
                </RadioGroup>
                </FormControl>

                </Box>

                <Box sx={{position: 'absolute', bottom: '0', right: '0px', zIndex: 0, opacity: 0.3}}>
                    <img width="400px" src={checkoutimg} alt="background" />
                </Box>

                
              
                    
                </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Button variant="contained"
                size="large"
                type="submit"
                sx={{background:"#564787"}}
                >
                Check Out</Button>

            </Box>

           </form>

           
            
                
        </Layout>
    );
}