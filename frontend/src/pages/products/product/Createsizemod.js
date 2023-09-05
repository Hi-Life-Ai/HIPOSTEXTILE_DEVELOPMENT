import React, { useState, useContext, useEffect } from 'react';
import { Box, OutlinedInput, FormControl, InputLabel, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { userStyle } from '../../PageStyle';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

function Createsizemod({ setFetchsavesize }) {

    const [sizemodal, setSizemodal] = useState(false);
    const sizeModOpen = () => { setSizemodal(true); };
    const [allSizes, setAllSizes] = useState([])
    const sizeModClose = () => { 
        setSizemodal(false);
        fetchSizeData(); 
        setSizeForm({ ...sizeForm, sizename: "" }); 
        setShowAlert("");
        
 };
    const { auth, setngs } = useContext(AuthContext);
    const [showAlert, setShowAlert] = useState("")

    const [sizeForm, setSizeForm] = useState({
        sizename: ""
    });

    const fetchSizeData = async () => {
        try {
            let res = await axios.post(SERVICE.SIZE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            
            setAllSizes(res?.data?.sizes);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    useEffect(() => {
        fetchSizeData()
    }, [])

    // Add Datas
    const sendRequest = async () => {
        setFetchsavesize("new None");
        try {
            let response = await axios.post(SERVICE.SIZE_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                assignbusinessid: String(setngs.businessid),
                sizename: String(sizeForm.sizename),
            });
            
            toast.success(response.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            setFetchsavesize("None");
            
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }

    };

    const addSizeSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = allSizes.some(item => item?.sizename.toLowerCase() === (sizeForm?.sizename).toLowerCase());

        setShowAlert("")
        if (sizeForm.sizename == "") {
            setShowAlert("Please Enter Size Name!");
        }
        else if (isNameMatch) {
            setShowAlert("Sizename Already Exists");
        }else {
            sendRequest();
            sizeModClose();
        }

    };

    return (
        <Box>
            <Grid sx={userStyle.spanPlusIcons} onClick={sizeModOpen} ><AddCircleOutlineOutlinedIcon /></Grid>
            <Dialog
                onClose={sizeModClose}
                aria-labelledby="customized-dialog-title1"
                open={sizemodal}
                sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #b97df0',
                    },
                }}
                maxWidth="md"
            >
                <form>
                    <DialogTitle id="customized-dialog-title1" onClose={sizeModClose} sx={{ backgroundColor: '#e0e0e0', color: "#000", display: "flex" }}>
                        Add Size
                    </DialogTitle>
                    <DialogContent dividers sx={{
                        minWidth: '750px', height: '110px', '& .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #4a7bf7 !important',
                        },
                    }}>
                        <Grid container spacing={3} sx={userStyle.textInput}>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <InputLabel >Size Name <b style={{ color: 'red', }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        value={sizeForm.sizename}
                                        onChange={(e) => { setSizeForm({ ...sizeForm, sizename: e.target.value }); setShowAlert("") }}
                                        type="text"
                                        name="sizename"
                                    />
                                </FormControl>
                                <p style={{ color: 'red' }}>{showAlert}</p>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant='contained' sx={userStyle.buttonadd} onClick={addSizeSubmit}>Save</Button>
                        <Button onClick={sizeModClose} variant='contained' sx={userStyle.buttoncancel}>Close</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}

export default Createsizemod;