import React, { useState, useContext, useEffect } from 'react';
import { Box, Button, Grid, FormControl, OutlinedInput, TextField, InputLabel, Typography, Dialog, DialogTitle, DialogContent, DialogActions, } from '@mui/material';
import { userStyle, colourStyles } from '../../PageStyle';
import Selects from "react-select";
import { FaPlus } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

function Createrack({ setFetchsaverack }) {

    const [rackmodal, setRackmodal] = useState(false);
    const rackModOpen = () => { setRackmodal(true); };
    const rackModClose = () => {
        setRackmodal(false);
        fetchRack();
        setRack({ ...rack, businesslocation: "", mainrack: "", subrack: "", subrackcode: "" });
        setTodos(todos.map(item => ({ ...item, subrackcode: "" })));
        setShowAlert("")
    };

    const [todoValue, setTodoValue] = useState({ subrackcode: '', });
    const [showAlert, setShowAlert] = useState("")
    const { auth, setngs } = useContext(AuthContext);
    const [busilocations, setBusilocations] = useState();
    const [isBusilocations, setIsBusilocations] = useState();
    const [check, setCheck] = useState([]);
    const [racklist, setRacklist] = useState([]);
    const [allRacks, setAllRacks] = useState([])
    const [rack, setRack] = useState({ businesslocation: "", mainrack: "" })
    const [todos, setTodos] = useState([]);

    //access...
    const { allLocations, isActiveLocations, isUserRoleAccess } = useContext(UserRoleAccessContext);

    // Location
    const fetchLocation = async () => {
        try {
            let selectlocation = allLocations.filter((data, index) => {
                return data.locationid == setngs.businesslocation
            })
            setIsBusilocations(selectlocation[0]);
            setBusilocations(isActiveLocations?.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.locationid,
                }
            )));
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    useEffect(
        () => {
            fetchLocation();
        }, []
    );

    // Rack
    const fetchRack = async () => {
        try {
            let res = await axios.post(SERVICE.RACK, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]
            });
            let resultmainrack = res?.data?.racks.map((data, index) => {
                return data.mainrack
            });

            setRacklist(resultmainrack)
            let arr = [];
            res?.data?.racks?.map((data, index) => {
                data.combinerack.filter((t) => {
                    arr.push(t.subrackcode);
                    return true;
                });
                return true;
            });
            setAllRacks(arr);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!");
            }
        }
    };

    useEffect(
        () => {
            fetchRack();
        }, []
    );

    const handleAddTodo = () => {
        if (rack.subrack == "") {
            setShowAlert("Please Enter SubRack");
        } else {
            const newTodo = { subrackcode: rack.mainrack == undefined ? "" : rack.subrack == undefined ? rack.mainrack : rack.mainrack + rack.subrack, };
            if (allRacks.includes(newTodo?.subrackcode)) {
                setShowAlert("Rack Already Exists");
                setRack({ ...rack, subrack: "" });
            }
            else if (check.includes(newTodo?.subrackcode)) {
                setShowAlert("Rack Already Exists");
                setRack({ ...rack, subrack: "" });
            } else {
                setCheck([...check, newTodo?.subrackcode]);
                setTodos([...todos, newTodo]);
                setRack({ ...rack, subrack: "" });
            }
        }
    };

    const handleFileDelete = (index) => { setTodos((prevFiles) => prevFiles?.filter((_, i) => i !== index)); };

    // store category data to db
    const sendRequest = async () => {
        setFetchsaverack("new None")
        try {
            let res = await axios.post(SERVICE.RACK_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businesslocation: String(rack.businesslocation),
                mainrack: String(rack.mainrack),
                combinerack: [...todos],
                assignbusinessid: String(setngs.businessid),
            });

            toast.success(res.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            setFetchsaverack("None")
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(messages);
            } else {
                setShowAlert("Something went wrong!");
            }
        }
    };

    const addSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = racklist?.some(item => item.mainrack?.toLowerCase() === (rack.mainrack).toLowerCase());

        setShowAlert("")
        if (rack.businesslocation == "") {
            setShowAlert("Please select bussiness location!");
        } else if (rack.mainrack == "") {
            setShowAlert("Please enter main rack!");
        }
        else if (isNameMatch) {
            setShowAlert("Main Rack Already Exits!");
        }
        else if (todos.length == 0) {
            setShowAlert("Please enter any one of sub rack!");
        }
        else {
            sendRequest();
            rackModClose();
        }
    }

    return (
        <Box>
            <Grid sx={userStyle.spanPlusIcons} onClick={rackModOpen}  ><AddCircleOutlineOutlinedIcon /></Grid>
            <Dialog
                onClose={rackModClose}
                aria-labelledby="customized-dialog-title1"
                open={rackmodal}
                sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #b97df0',
                    },
                }}
                maxWidth="lg"
            >
                <form>
                    <DialogTitle id="customized-dialog-title1" onClose={rackModClose} sx={{ backgroundColor: '#e0e0e0', color: "#000", display: "flex" }}>
                        Add Rack
                    </DialogTitle>
                    <DialogContent dividers sx={{
                        minWidth: '800px', height: 'auto', '& .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #4a7bf7 !important',
                        },
                    }}>
                        <Grid container spacing={3} sx={userStyle.textInput}>
                            <Grid item md={6} sm={12} xs={12}>
                                <InputLabel id="demo-select-small">Business Location  <b style={{ color: 'red', }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        options={busilocations}
                                        styles={colourStyles}
                                        // defaultValue={{ label: setngs?.businessname, value: setngs?.businessname }}
                                        placeholder={isBusilocations ? isBusilocations.name : ""}
                                        onChange={(e) => { setRack({ ...rack, businesslocation: e.value }); }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={6} sm={12} xs={12}>
                                <InputLabel htmlFor="component-outlined">Main Rack <b style={{ color: 'red', }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        name="mainrack"
                                        value={rack.mainrack}
                                        onChange={(e) => {
                                            setRack({ ...rack, mainrack: e.target.value.toUpperCase(), }); setShowAlert("");
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item lg={5} md={5} sm={10} xs={10}>
                                <InputLabel htmlFor="component-outlined">Sub Rack <b style={{ color: 'red', }}>*</b> </InputLabel>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        type="text"
                                        sx={userStyle.input}
                                        name="subrack"
                                        value={rack.subrack}
                                        onChange={(e) => {
                                            setRack({ ...rack, subrack: e.target.value }); setShowAlert("");
                                        }}
                                        placeholder="Enter a Sub Rack"
                                    />
                                </FormControl>
                                <p style={{ color: 'red' }}>{showAlert}</p>
                            </Grid>
                            <Grid item md={2} sm={2} xs={2}>
                                <Button variant="contained" color="success" type="button" onClick={handleAddTodo} sx={userStyle.categoryadd}><FaPlus /></Button>&nbsp;
                            </Grid>

                        </Grid><br />

                        <ul type="none" className="todoLlistUl" style={{ paddingLeft: '0px', marginLeft: '0px' }}>
                            {todos.map((item, index) => {
                                if (!item.subrackcode) return null; // Skip rendering if subrackcode is empty
                                return (
                                    <li key={index}>
                                        <br />
                                        <Grid container>
                                            <Grid item sm={8} xs={12} md={6} lg={5} sx={{ display: "flex", justifyContent: "center" }}>
                                                <FormControl size="small" fullWidth>
                                                    {/* <Typography>
                                                    {item.subrackcode}
                                                </Typography> */}
                                                    <TextField size="small" value={item.subrackcode} onChange={() => { setTodoValue({ ...todoValue, subrackcode: item.subrackcode }) }} />
                                                </FormControl>
                                                <Button variant="contained" color="error" type="button" onClick={() => handleFileDelete(index)} sx={{ height: '30px', minWidth: '30px', marginTop: '4px', padding: '6px 10px' }}><AiOutlineClose /></Button>
                                            </Grid>
                                        </Grid>
                                    </li>
                                );
                            })}
                        </ul>
                        <InputLabel htmlFor="component-outlined">Display Rack</InputLabel>
                        <Grid container sx={{ display: "flex" }}>
                            {todos.map((item, index) => {
                                if (!item.subrackcode) return null; // Skip rendering if subrackcode is empty
                                return (
                                    <Grid item lg={2} md={4} sm={6} xs={12}>
                                        <Typography sx={{ border: "1px solid #1976d2", textAlign: "center", paddingTop: "20px", paddingBottom: "20px" }} >
                                            {item.subrackcode}
                                        </Typography>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant='contained' sx={userStyle.buttonadd} onClick={addSubmit}>Save</Button>
                        <Button onClick={rackModClose} variant='contained' sx={userStyle.buttoncancel}>Close</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box >
    );
}

export default Createrack;