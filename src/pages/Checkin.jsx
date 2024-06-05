import * as React from 'react';
import Layout from '../layout/Layout';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import supabase from '../config/supabaseClient.js';
import Alert from '@mui/material/Alert';
import checkinimg from '../assets/img/checkin.webp';
import noData from '../assets/img/nodata.webp';

export default function Checkin(){
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [checkout, setCheckout] = React.useState([]);
    const [fetchError, setFetchError] = React.useState(null)
    const [checkout_id, setCheckout_id] = React.useState(null);
    const [battery_charger, setBattery_charger] = React.useState(true);
    const [load_pics, setLoad_pics] = React.useState(true);
    const [verify, setVerify] = React.useState(true);
    const [formError, setFormError] = React.useState(null);
    const [formSuccess, setFormSuccess] = React.useState(null);
    const [user_email, setUser_email] = React.useState('');
    
    // handle list item click
    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
        const id = event.currentTarget.getAttribute('data-id');
        const newId= parseInt(id);
        setCheckout_id(newId);
    };

    // fetch checkouts
    const fetchCheckout = async () => {
        const { data, error } = await supabase.from('checkout')
            .select(`
                id,
                equipment ( id, name )
            `).eq('status', false);

        if (error) {
            setFetchError('Could not fetch checkouts');
            setCheckout(null);
        } else {
            setCheckout(data);
            setFetchError(null);
        }
    };
    
    // useEffect to fetch checkouts and user session
    React.useEffect(() => {
        fetchCheckout();

        const userSession = async () =>{
            const { data, error } = await supabase.auth.getSession()

            if (data){
                setUser_email(data.session.user.email)
            }
        }
        userSession();
    }, []);

    // handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!load_pics || !verify || !battery_charger){
            setFormError("Please fill in all the fields correctly")
            return
        }

        const {data, error} = await supabase
        .from("checkin")
        .insert({checkout_id, load_pics, verify, battery_charger, user_email})

        if(!error){
            const { error } = await supabase
            .from('checkout')
            .update({status: true })
            .eq('id', checkout_id)
          
            const selectedCheckout = checkout.find(item => item.id === checkout_id);
            const equipmentId = selectedCheckout ? selectedCheckout.equipment.id : null;

            const { errors } = await supabase
            .from('equipment')
            .update({status: true })
            .eq('id', equipmentId)
            
            fetchCheckout();
        }

        setFormError(null);
        setFormSuccess("Successfully checkin a equipment.");
        setCheckout_id(null);
        setLoad_pics(true);
        setBattery_charger(true);
        setVerify(true);
    }

    return(
        <Layout>
            {checkout && checkout.length > 0 ? (
            <form onSubmit={handleSubmit}> 
            <Box sx={{ width: '100%'}}>
                {/* Display form errors */}
                <Typography sx={{fontSize:"30px", textAlign: "center", color:"#101935", marginBottom:"10px"}}>
                    Currently Equipment out
                </Typography>
                {formError && <p style={{ color: 'red' }} className='error'>{formError}</p>}
                { formSuccess && 
                    <Alert variant="filled" severity="success" sx={{marginBottom:'20px'}}>
                        {formSuccess}
                    </Alert>
                }
            
                <List component="nav" aria-label="main mailbox folders" sx={{bgcolor: '#DCEDFF', color:"white" }}>
                    {/* Gets name of the equipment */}
                    {fetchError && <p>{fetchError}</p>}
                    {checkout && (
                        <div>
                            {checkout.map((item, key) => (
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
                                    <ListItemText primary={item.equipment.name}/>
                                </ListItemButton>
                            ))} 
                        </div>
                    )}
                </List>
            </Box>

            {/* Form controls */}
            <Box>
                <FormControl >
                    <FormLabel id="demo-row-radio-buttons-group-label" sx={{fontSize:"20px", color:"#101935", marginTop:"20px"}} >
                        Did you return the battery or charger?
                    </FormLabel>
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

            <Box>
                <FormControl >
                    <FormLabel id="demo-row-radio-buttons-group-label" sx={{fontSize:"20px", color:"#101935", marginTop:"20px"}} >
                        Did you Load your pictures?
                    </FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="radio-for-checking if batteries wherer taken out"
                        name="row-radio-buttons-group"
                        value={load_pics}
                        onChange={(e) => setLoad_pics(e.target.value)}
                    >
                        <FormControlLabel value={true} control={<Radio/>} label="Yes"/>
                        <FormControlLabel value={false} control={<Radio />} label="No"/>
                    </RadioGroup>
                </FormControl>
            </Box>

            <Box>
                <FormControl >
                    <FormLabel id="demo-row-radio-buttons-group-label" sx={{fontSize:"20px", color:"#101935", marginTop:"20px"}} >
                        By checking Yes, I verify that all the equipment has been returned and there is no damage to the equipment. 
                        By checking No, I verify that I have talked to my teacher about any missing item or damage to the equipment.
                    </FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="radio-for-checking if batteries wherer taken out"
                        name="row-radio-buttons-group"
                        value={verify}
                        onChange={(e) => setVerify(e.target.value)}
                    >
                        <FormControlLabel value={true} control={<Radio/>} label="Yes"/>
                        <FormControlLabel value={false} control={<Radio />} label="No"/>
                    </RadioGroup>
                </FormControl>
            </Box>

            <Box sx={{position: 'absolute', bottom: '0', right: '-80px', zIndex: 0, opacity: 0.3}}>
                <img width="600px" src={checkinimg} alt="background" />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Button variant="contained"
                    size="large"
                    type="submit"
                    sx={{background:"#564787"}}
                >
                    Check In
                </Button>
            </Box>
            </form>
            ) : (
                <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
                    <Typography sx={{fontSize:"40px", textAlign: "center", color:"#101935", marginTop:"10px"}}>
                        There is not equipment to check in
                    </Typography>
                    <img src={noData} width="300px" alt="No data available" />
                </Box>
            )}
        </Layout>
    ); 
}
