import React, { useState, useContext, useEffect } from 'react';
import { userStyle } from '../../PageStyle';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

function Createunitmod({ setFetchsaveunit }) {

    // Unit Modal
    const [unitmodal, setUnitmodal] = useState(false);
    const unitModOpen = () => { setUnitmodal(true); };
    const [unitData, setUnitData] = useState([])
    const [allUnits, setAllUnits] = useState([])
    const unitModClose = () => { setUnitmodal(false); fetchData(); setUnitForm({ ...unitForm, unit: "", shotname: "" }); setShowAlert("") };
    const { auth, setngs } = useContext(AuthContext);
    const [showAlert, setShowAlert] = useState("")

    // ******** Text field ******** //
    const [unitForm, setUnitForm] = useState({ unit: "", shotname: "" });

    const fetchData = async () => {
        try {
            let res = await axios.post(SERVICE.UNIT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            let locresult = res.data.units.map((data, index) => {
                return data.unit
            })
            setUnitData(locresult);
            setAllUnits(res?.data?.units)
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

    // ******** Request to db ******** //
    // Add Datas
    const sendRequest = async () => {
        setFetchsaveunit("new None")
        try {
            let response = await axios.post(SERVICE.UNIT_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                unit: String(unitForm.unit),
                shortname: String(unitForm.shotname),
                assignbusinessid: String(setngs.businessid),
            });

            toast.success(response.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            setFetchsaveunit("None")
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    const addUnitSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = allUnits.some(item => item.unit.toLowerCase() === (unitForm.unit).toLowerCase());

        setShowAlert("");
        if (unitForm.unit == "") {
            setShowAlert("Please enter unit name!");
        } if (isNameMatch) {
            setShowAlert("Unit already exists");
        }
        else if (unitData.includes(unitForm.unit)) {
            setShowAlert("Unit already exists");
        } else {
            sendRequest();
            unitModClose();
        }
    };

    return (
        <Box>
            <Grid sx={userStyle.spanPlusIcons} onClick={unitModOpen}  ><AddCircleOutlineOutlinedIcon /></Grid>
            <Dialog
                onClose={unitModClose}
                aria-labelledby="customized-dialog-title1"
                open={unitmodal}
                sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #b97df0',
                    },
                }}
                maxWidth="md"
            >
                <form>
                    <DialogTitle id="customized-dialog-title1" onClose={unitModClose} sx={{ backgroundColor: '#e0e0e0', color: "#000", display: "flex" }}>
                        Add Unit
                    </DialogTitle>
                    <DialogContent dividers sx={{
                        minWidth: '750px', height: '210px', '& .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #4a7bf7 !important',
                        },
                    }}>
                        <Grid container spacing={3} sx={userStyle.textInput}>
                            <Grid item md={12} sm={12} xs={12}>
                                <InputLabel >Unit Name <b style={{ color: 'red' }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        sx={userStyle.alertOutline}
                                        value={unitForm.unit}
                                        onChange={(e) => { setUnitForm({ ...unitForm, unit: e.target.value }); setShowAlert(""); }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                                <InputLabel >Short Name</InputLabel>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        sx={userStyle.alertOutline}
                                        value={unitForm.shotname}
                                        onChange={(e) => { setUnitForm({ ...unitForm, shotname: e.target.value }) }}
                                    />
                                </FormControl>
                                <p style={{ color: 'red' }}>{showAlert}</p>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant='contained' sx={userStyle.buttonadd} onClick={addUnitSubmit}>Save</Button>
                        <Button onClick={unitModClose} variant='contained' sx={userStyle.buttoncancel}>Close</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}

export default Createunitmod;