import React, { useState, useContext, useEffect } from 'react';
import { Box, OutlinedInput, FormControl, InputLabel, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { userStyle } from '../../PageStyle';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

function Createcolormod({ setFetchsavecolor }) {

    const [colormodal, setColormodal] = useState(false);
    const colorModOpen = () => { setColormodal(true); };
    const [colorData, setColorData] = useState([])
    const [allColors, setAllColors] = useState([])
    const colorModClose = () => { setColormodal(false); fetchColorData(); setColorsForm({ ...colorsForm, colorname: "" }); setShowAlert("") };
    const { auth, setngs } = useContext(AuthContext);
    const [showAlert, setShowAlert] = useState("")

    const [colorsForm, setColorsForm] = useState({
        colorname: ""
    });

    const fetchColorData = async () => {
        try {
            let res = await axios.post(SERVICE.COLOR, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            let locresult = res.data.colors.map((data, index) => {
                return data.colorname
            })
            setColorData(locresult);
            setAllColors(res?.data?.colors)
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
        fetchColorData()
    }, [])

    // Add Datas
    const sendRequest = async () => {
        setFetchsavecolor("new None")
        try {
            let response = await axios.post(SERVICE.COLOR_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                assignbusinessid: String(setngs.businessid),
                colorname: String(colorsForm.colorname),
            });

            toast.success(response.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            setFetchsavecolor("None")
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    const addColorSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = allColors.some(item => item.colorname.toLowerCase() === (colorsForm.colorname).toLowerCase());

        setShowAlert("");
        if (colorsForm.colorname == "") {
            setShowAlert("Please enter Color name!");
        }
        else if (isNameMatch) {
            setShowAlert("Color already exists");
        }
        else if (colorData.includes(colorsForm.colorname)) {
            setShowAlert("Color Already Exists");
        } else {
            sendRequest();
            colorModClose();
        }
    };

    return (
        <Box>
            <Grid sx={userStyle.spanPlusIcons} onClick={colorModOpen}  ><AddCircleOutlineOutlinedIcon /></Grid>
            <Dialog
                onClose={colorModClose}
                aria-labelledby="customized-dialog-title1"
                open={colormodal}
                sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #b97df0',
                    },
                }}
                maxWidth="md"
            >
                <form>
                    <DialogTitle id="customized-dialog-title1" onClose={colorModClose} sx={{ backgroundColor: '#e0e0e0', color: "#000", display: "flex" }}>
                        Add Color
                    </DialogTitle>
                    <DialogContent dividers sx={{
                        minWidth: '750px', height: '110px', '& .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #4a7bf7 !important',
                        },
                    }}>
                        <Grid container spacing={3} sx={userStyle.textInput}>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <InputLabel htmlFor="component-outlined">Color Name <b style={{ color: 'red', }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        id="component-outlined"
                                        value={colorsForm.colorname}
                                        onChange={(e) => { setColorsForm({ ...colorsForm, colorname: e.target.value }); setShowAlert(""); }}
                                        type="text"
                                        name="colorname"
                                    />
                                </FormControl>
                                <p style={{ color: 'red' }}>{showAlert}</p>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant='contained' sx={userStyle.buttonadd} onClick={addColorSubmit}>Save</Button>
                        <Button onClick={colorModClose} variant='contained' sx={userStyle.buttoncancel}>Close</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}

export default Createcolormod;