import React, { useState, useContext, useEffect } from 'react';
import { Box, Button, Grid, FormControl, OutlinedInput, InputLabel, TextField, Typography, Dialog, DialogContent, DialogActions, } from '@mui/material';
import { userStyle, colourStyles } from '../../PageStyle';
import Selects from "react-select";
import { FaPlus } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import Footer from '../../../components/footer/Footer';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';

function Rackcreatelist() {

    const { auth, setngs } = useContext(AuthContext);
    const [busilocations, setBusilocations] = useState([]);
    const [isBusilocations, setIsBusilocations] = useState({});
    const [allRacks, setAllRacks] = useState([])
    const [rack, setRack] = useState({locationplaceholder:isBusilocations ? isBusilocations.name : "", businesslocation: "", mainrack: "", subrack: "" })
    const [todos, setTodos] = useState([]);
    const [check, setCheck] = useState([]);
    const [racklist, setRacklist] = useState([]);
    const [todoValue, setTodoValue] = useState({ subrackcode: '', });


    //access...
    const { allLocations, isActiveLocations, isUserRoleAccess } = useContext(UserRoleAccessContext);

    // Pop up error
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState("")
    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

    const handleAddTodo = () => {
        if(rack.mainrack == "" || rack.mainrack == undefined){
            setShowAlert("Please Enter MainRack Name");
            handleClickOpen();
        }else{
            if (rack.subrack == "") {
                setShowAlert("Please Enter SubRack");
                handleClickOpen();
            } else {
                const newTodo = { subrackcode: rack.mainrack == undefined ? "" : rack.subrack == undefined ? rack.mainrack : rack.mainrack + rack.subrack, };
                if (allRacks.includes(newTodo?.subrackcode)) {
                    setShowAlert("Rack Already Exists");
                    handleClickOpen();
                    setRack({ ...rack, subrack: "" });
                }
                else if (check.includes(newTodo?.subrackcode)) {
                    setShowAlert("Rack Already Exists");
                    handleClickOpen();
                    setRack({ ...rack, subrack: "" });
                } else {
                    setCheck([...check, newTodo?.subrackcode]);
                    setTodos([...todos, newTodo]);
                    setRack({ ...rack, subrack: "" });
                }
            }
        }

    };

    const handleFileDelete = (index) => { setTodos((prevFiles) => prevFiles?.filter((_, i) => i !== index)); };

    const backLPage = useNavigate();

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };


    // Location
    const fetchLocation = async () => {
        try {
            let selectlocation = allLocations.filter((data, index) => {
                return data?.locationid == setngs?.businesslocation
            })
            setIsBusilocations(selectlocation[0]);

            setRack({...rack,  locationplaceholder: selectlocation[0]?.name});

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
            let resdata = res?.data?.racks.map((data, index) => {
                data.combinerack.forEach((t) => {
                    arr.push(t.subrackcode);
                });
                return arr;
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

    const handleClear = () => {
        setRack({
            locationplaceholder: isBusilocations ? isBusilocations.name : "",
            businesslocation: "", mainrack: "", subrack: ""
        })
        setTodos([]);

    }

    useEffect(
        () => {
            fetchLocation();

        }, []
    );

    useEffect(
        () => {
            fetchRack();

        }, []
    );

    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

    // store category data to db
    const sendRequest = async () => {
        try {
            let res = await axios.post(SERVICE.RACK_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businesslocation: String(rack.businesslocation == "" ? setngs?.businesslocation : rack.businesslocation),
                mainrack: String(rack.mainrack),
                combinerack: [...todos],
                assignbusinessid: String(setngs.businessid),
            });
            setRack(res.data);
            handleClose();
            toast.success(res.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            backLPage('/product/rack/list');
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(messages);
                handleClickOpen();
            } else {
                setShowAlert("Something went wrong!");
                handleClickOpen();
            }
        }
    };

    const sendAnotherRequest = async () => {
        try {
            let res = await axios.post(SERVICE.RACK_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businesslocation: String(rack.businesslocation == "" ? setngs?.businesslocation : rack.businesslocation),
                mainrack: String(rack.mainrack),
                combinerack: [...todos],
                assignbusinessid: String(setngs.businessid),
            });
            setRack({  locationplaceholder: isBusilocations ? isBusilocations.name : "",
            businesslocation: "", mainrack: "", subrack: "" });
            setTodos(todos.map(item => ({ ...item, subrackcode: "" })));
            handleClose();
            toast.success(res.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            await fetchRack();
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(messages);
                handleClickOpen();
            } else {
                setShowAlert("Something went wrong!");
                handleClickOpen();
            }
        }
    };

    const addSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = racklist?.some(item => item.toLowerCase() === (rack.mainrack).toLowerCase());
        if (rack.businesslocation == "" && rack.locationplaceholder == "") {
            setShowAlert("Please select business location!");
            handleClickOpen();
        } else if (rack.mainrack == "") {
            setShowAlert("Please enter main rack!");
            handleClickOpen();
        } else if (isNameMatch) {
            setShowAlert("Main Rack Already Exits!");
            handleClickOpen();
        } else if (todos.length === 0) {
            setShowAlert("Please enter any one of the sub rack!");
            handleClickOpen();
        } else {
            sendRequest();
        }
    }

    const handleAnotherSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = racklist?.some(item => item.toLowerCase() === (rack.mainrack).toLowerCase());
        if (rack.businesslocation == "" && rack.locationplaceholder == "") {
            setShowAlert("Please select bussiness location!");
            handleClickOpen();
        } else if (rack.mainrack == "") {
            setShowAlert("Please enter main rack!");
            handleClickOpen();
        } else if (isNameMatch) {
            setShowAlert("Main Rack Already Exits!");
            handleClickOpen();
        }
        else if (todos.length === 0) {
            setShowAlert("Please enter any one of sub rack!");
            handleClickOpen();
        } else {
            sendAnotherRequest();
        }
    }

    return (
        <Box>
            <Headtitle title={'Add Rack'} />
            <Typography sx={userStyle.HeaderText}>Add Rack</Typography>
            {/* content start */}
            <form>
                <Box sx={userStyle.container}>
                    <Grid container spacing={3} sx={userStyle.textInput}>
                        <Grid item md={6} sm={12} xs={12}>
                            <InputLabel id="demo-select-small">Business Location  <b style={{ color: 'red', }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <Selects
                                    options={busilocations}
                                    styles={colourStyles}
                                    Value={{ value: rack.locationplaceholder, label: rack.locationplaceholder }}
                                    placeholder={isBusilocations ? isBusilocations.name : ""}
                                    onChange={(e) => { setRack({ ...rack, businesslocation: e.value, locationplaceholder:e.label }); }}
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
                                        setRack({ ...rack, mainrack: e.target.value.toUpperCase(), });
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
                                        setRack({ ...rack, subrack: e.target.value });
                                    }}
                                    placeholder="Enter a Sub Rack"
                                />
                            </FormControl>
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
                                                <TextField value={item.subrackcode} onChange={() => { setTodoValue({ ...todoValue, subrackcode: item.subrackcode }) }} />
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

                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid sx={{ display: 'flex' }}>
                            <Button sx={userStyle.buttonadd} type="submit" onClick={addSubmit} >SAVE</Button>
                            <Button sx={userStyle.buttonadd} onClick={handleAnotherSubmit} >SAVE AND ADD ANOTHER</Button>
                            <Link to="/product/rack/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
                            <Button sx={userStyle.buttoncancel} onClick={handleClear}>CLEAR</Button>
                        </Grid>
                    </Grid>
                </Box>
            </form>
            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleClose}>ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}

function Rackcreate() {
    return (
        <>
            <Rackcreatelist /><br /><br /><br /><br />
            <Footer />
        </>
    );
}
export default Rackcreate;