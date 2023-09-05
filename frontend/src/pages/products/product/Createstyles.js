import React, { useState, useContext, useEffect } from 'react';
import { Box, OutlinedInput, FormControl, InputLabel, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { userStyle } from '../../PageStyle';
import axios from 'axios';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

function Createstyle({ setFetchsavestyle }) {

    const { auth, setngs } = useContext(AuthContext);
    const [styleData, setstyleData] = useState([])
    const [allStyles, setAllStyles] = useState([])
    const [stylemodal, setStyleModal] = useState(false);
    const styleModOpen = () => { setStyleModal(true); };
    const styleModClose = () => { setStyleModal(false); fetchData(); setstyleForm({ ...styleForm, stylename: "" }); setShowAlert("") };
    const [showAlert, setShowAlert] = useState("")

    const [styleForm, setstyleForm] = useState({
        stylename: ""
    });

    const fetchData = async () => {
        try {
            let res = await axios.post(SERVICE.STYLE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            let resultloc = res.data.styles.map((data, index) => {
                return data.stylename
            })
            setstyleData(resultloc);
            setAllStyles(res?.data?.styles)
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
        fetchData()
    }, [])

    // Add Datas
    const sendRequest = async () => {
        setFetchsavestyle("new None");
        try {
            let req = await axios.post(SERVICE.STYLE_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                stylename: String(styleForm.stylename),
                assignbusinessid: String(setngs.businessid),
            });

            toast.success(req.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            setFetchsavestyle("None");
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                setShowAlert("Something went wrong!");
            }
        }
    };

    const addStyleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = allStyles.some(item => item.stylename.toLowerCase() === (styleForm.stylename).toLowerCase());

        setShowAlert("");
        if (styleForm.stylename == "") {
            setShowAlert("Please enter style name!");
        }
        else if (isNameMatch) {
            setShowAlert("Stylename already exists");
        } else if (styleData.includes(styleForm.stylename)) {
            setShowAlert("Stylename Already Exists");
        } else {
            sendRequest();
            styleModClose();
        }
    };

    return (
        <Box>
            <Grid sx={userStyle.spanPlusIcons} onClick={styleModOpen}  ><AddCircleOutlineOutlinedIcon /></Grid>
            <Dialog
                onClose={styleModClose}
                aria-labelledby="customized-dialog-title1"
                open={stylemodal}
                sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #b97df0',
                    },
                }}
                maxWidth="md"
            >
                <form>
                    <DialogTitle id="customized-dialog-title1" onClose={styleModClose} sx={{ backgroundColor: '#e0e0e0', color: "#000", display: "flex" }}>
                        Add Style
                    </DialogTitle>
                    <DialogContent dividers sx={{
                        minWidth: '750px', height: '110px', '& .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #4a7bf7 !important',
                        },
                    }}>
                        <Grid container spacing={3} sx={userStyle.textInput}>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <InputLabel htmlFor="component-outlined">Style Name <b style={{ color: 'red', }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        value={styleForm.stylename}
                                        onChange={(e) => { setstyleForm({ ...styleForm, stylename: e.target.value }); setShowAlert(""); }}
                                        type="text"
                                        name="stylename"
                                    />
                                </FormControl>
                                <p style={{ color: 'red' }}>{showAlert}</p>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant='contained' sx={userStyle.buttonadd} onClick={addStyleSubmit}>Save</Button>
                        <Button onClick={styleModClose} variant='contained' sx={userStyle.buttoncancel}>Close</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}

export default Createstyle;