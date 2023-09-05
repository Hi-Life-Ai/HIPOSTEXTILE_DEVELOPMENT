import React, { useState, useContext, useEffect } from 'react';
import { Box, Button, Grid, FormControl, OutlinedInput, InputLabel, TextField, Typography, Dialog, DialogContent, DialogActions, } from '@mui/material';
import { userStyle, colourStyles } from '../../PageStyle';
import Selects from "react-select";
import { FaPlus, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import Footer from '../../../components/footer/Footer';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function Rackeditlist() {

    const { auth, setngs } = useContext(AuthContext);
    const [busilocations, setBusilocations] = useState();
    const [isBusilocations, setIsBusilocations] = useState();
    const [rack, setRack] = useState({ businesslocation: "", mainrack: "", subrack: "" })
    const [todos, setTodos] = useState([]);
    const [check, setCheck] = useState([]);
    const [inputValues, setInputValues] = useState({ subrackcode: '', });
    const [editingIndexedit, setEditingIndexedit] = useState(-1);
    const [editedTodoedit, setEditedTodoedit] = useState("");
    const [newTodoEditedIndexValue, setNewTodoEditedIndexValue] = useState("");

    //access...
    const { allLocations, isActiveLocations } = useContext(UserRoleAccessContext);

    // check edit
    const [overAllRack, setOverAllRack] = useState("")
    const [getRack, setGetRack] = useState("")
    const [editRackCount, setEditRackCount] = useState(0)

    // Error Popup model
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => { setIsErrorOpenpop(true); };
    const handleCloseerrpop = () => { setIsErrorOpenpop(false); };

    // Pop up error
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClose = () => { setIsErrorOpen(false); };
    const handleClickOpenc = () => { setIsErrorOpen(true); };
    const handleInputChange = (event) => { setInputValues({ ...inputValues, subrackcode: event }); };

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    // Location
    const fetchLocation = async () => {
        try {
            let selectlocation = allLocations?.length > 0 && allLocations.filter((data, index) => {
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

    useEffect(() => { fetchLocation(); }, []);

    const handleAddTodo = () => {
        if(rack.mainrack == ""){
            setShowAlert("Please Enter MainRack Name!");
            handleClickOpenc();
        }else {
            if (rack.subrack == "" || rack.subrack == undefined) {
                setShowAlert("Please Enter SubRack!");
                handleClickOpenc();
            } else {
                const newTodo = { subrackcode: rack.mainrack + rack.subrack, };
                // Check if the new subrackcode already exists in allRacks array
                const isDuplicate = todos.some((item) => item.subrackcode === newTodo.subrackcode);
                const subrackcodeExists = check.includes(newTodo.subrackcode);
    
                if (subrackcodeExists || isDuplicate) {
                    setShowAlert("Rack Already Exists");
                    handleClickOpenc();
                    setRack({ ...rack, subrack: "" });
                } else {
                    setTodos([...todos, newTodo]);
                    setCheck([...check, newTodo?.subrackcode]);
                    setRack({ ...rack, subrack: "" });
                }
            }
        }
    };

    const handleEditTodoEdit = (index) => {
        setEditingIndexedit(index);
        // setEditedTodoedit(todos[index].label);
        setEditedTodoedit(todos[index].subrackcode);
        getEditId(todos[index].subrackcode);
        setGetRack(todos[index].subrackcode)
    };


    const handleUpdateTodoEdit = (index) => {
        if (editingIndexedit >= 0 && editingIndexedit < todos.length) {
            const newLabel = editedTodoedit;

            if (newLabel.trim() !== "") {
                const newTodos = [...todos];
                newTodos[index].subrackcode = newLabel;

                // Check if rack already exists
                if (todos.some(todo => todo.subrackcode === editedTodoedit && todo !== todos[index])) {
                    setShowAlert("Rack Already Exists");
                    handleClickOpenc(); // Make sure this function is correctly defined
                    return; // Return early to prevent updating todos and resetting state
                }

                setTodos(newTodos);
                setNewTodoEditedIndexValue(newLabel)
            }

            // Reset editing state
            setEditingIndexedit(-1);
            setEditedTodoedit("");
        }
    };


    const handleDeleteTodoEdit = (index) => {
        const newTodosedit = [...todos];
        newTodosedit.splice(index, 1);
        setTodos(newTodosedit);

        // Set the todos state with the updated array
        setTodos(newTodosedit);
    };

    // const handleFileDelete = (index) => { setTodos((prevFiles) => prevFiles?.filter((_, i) => i !== index)); };

    const id = useParams().id;

    const [locationName, setLocationName] = useState()
    // Get Datas
    const fetchHandler = async () => {
        try {
            let response = await axios.get(`${SERVICE.RACK_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });

            let selectlocation = allLocations.filter((data, index) => {
                return data.locationid == response?.data?.srack?.businesslocation
            })
            setLocationName(selectlocation[0])
            setRack(response?.data?.srack);
            setTodos(response?.data?.srack?.combinerack || []);
            let arr = [];
            let resdata = response?.data?.srack?.combinerack.map((t) => {
                return t.subrackcode
            });
            setCheck(resdata)
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    useEffect(() => { fetchHandler(); }, [id]);

    const getEditId = async (value) => {
        try {
            let res = await axios.post(SERVICE.RACK_EDIT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                rack: String(value)
            });
            setEditRackCount(res?.data?.products?.length)
            setOverAllRack(`The ${value} is linked in ${res?.data?.products?.length > 0 ? "Product ," : ""} whether you want to do changes ..??`)
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
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

    const getOverAllRackUpdate = async () => {
        try {
            let res = await axios.post(SERVICE.RACK_EDIT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                rack: getRack
            });
            editOveAllRack(res?.data?.products)
        }
        catch (err) {
            const messages = err?.response?.data?.message
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    const editOveAllRack = async (products) => {
        try {

            if (products.length > 0) {
                let answ = products?.map((d, i) => {
                    let res = axios.put(`${SERVICE.PRODUCT_SINGLE}/${d._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        rack: newTodoEditedIndexValue ? newTodoEditedIndexValue : d.rack
                    });
                })
            }
        } catch (err) {
            const messages = err?.response?.data?.message
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    const backLPage = useNavigate();


    // store category data to db
    const sendRequest = async () => {
        try {
            let res = await axios.put(`${SERVICE.RACK_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businesslocation: String(rack.businesslocation),
                mainrack: String(rack.mainrack),
                combinerack: [...todos],
                assignbusinessid: String(setngs.businessid),
            });
            await getOverAllRackUpdate()
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
                handleClickOpenc();
            } else {
                setShowAlert("Something went wrong!");
                handleClickOpenc();
            }
        }
    };

    const editSubmit = (e) => {
        e.preventDefault();
        if (rack.businesslocation == "") {
            setShowAlert("Please select bussiness location!");
            handleClickOpenc();
        } else if (rack.mainrack == "") {
            setShowAlert("Please enter main rack!");
            handleClickOpenc();
        } else if (todos.length == 0) {
            setShowAlert("Please enter any one of sub rack!");
            handleClickOpenc();
        }
        else if (editedTodoedit != getRack && editRackCount > 0) {
            setShowAlertpop(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}> {overAllRack} </p>
                </>
            );
            handleClickOpenerrpop()
        }
        else {
            sendRequest();
        }
    }

    return (
        <Box>
            <Headtitle title={'Edit Rack'} />
            <Typography sx={userStyle.HeaderText}>Edit Rack</Typography>
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
                                    value={{ label: locationName?.name, value: locationName?.locationid }}
                                    onChange={(e) => { setRack({ ...rack, businesslocation: e.value }); setLocationName({ ...locationName, name: e.label, locationid: e.value }) }}
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
                                    onChange={(e) => { setRack({ ...rack, subrack: e.target.value }); handleInputChange(e.target.value); }}
                                    placeholder="Enter a Sub Rack"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={2} xs={2}>
                            <Button variant="contained" color="success" type="button" onClick={handleAddTodo} sx={userStyle.categoryadd}><FaPlus /></Button>&nbsp;
                        </Grid>
                    </Grid><br />
                    {todos?.map((todo, index) => (
                        <div key={index}>
                            {editingIndexedit === index ? (
                                <Grid container spacing={1}>
                                    <Grid item md={5} sm={5} xs={5}>
                                        <TextField
                                            size="small"
                                            label="Edit Rack"
                                            variant="outlined"
                                            fullWidth
                                            value={rack.mainrack + editedTodoedit == undefined ? "" : editedTodoedit}
                                            onChange={(e) =>
                                                setEditedTodoedit(e.target.value)
                                            }
                                        />
                                    </Grid>
                                    <Grid item md={1} sm={1} xs={1}>
                                        <Button
                                            variant="contained"
                                            style={{
                                                minWidth: '20px',
                                                minHeight: '41px',
                                                background: 'transparent',
                                                boxShadow: 'none',
                                                marginTop: '-3px !important',
                                                '&:hover': {
                                                    background: '#f4f4f4',
                                                    borderRadius: '50%',
                                                    minHeight: '41px',
                                                    minWidth: '20px',
                                                    boxShadow: 'none',
                                                },
                                            }}
                                            onClick={() => handleUpdateTodoEdit(index)}
                                        >
                                            <CheckCircleIcon
                                                style={{
                                                    color: "#216d21",
                                                    fontSize: "1.5rem"
                                                }}
                                            />
                                        </Button>
                                    </Grid>
                                    <Grid item md={1} sm={1} xs={1}>
                                        <Button
                                            variant="contained"
                                            style={{
                                                minWidth: '20px',
                                                minHeight: '41px',
                                                background: 'transparent',
                                                boxShadow: 'none',
                                                marginTop: '-3px !important',
                                                '&:hover': {
                                                    background: '#f4f4f4',
                                                    borderRadius: '50%',
                                                    minHeight: '41px',
                                                    minWidth: '20px',
                                                    boxShadow: 'none',
                                                },
                                            }}
                                            onClick={() => setEditingIndexedit(-1)}
                                        >
                                            <CancelIcon
                                                style={{
                                                    color: "#b92525",
                                                    fontSize: "1.5rem"
                                                }}
                                            />
                                        </Button>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Grid container spacing={1}>
                                    <Grid item md={4} sm={4} xs={4}>
                                        <Typography
                                            variant="subtitle2"
                                            color="textSecondary"
                                            sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}
                                        >
                                            {todo.subrackcode}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={1.5} sm={1.5} xs={2}>
                                        <Button
                                            variant="contained"
                                            style={{
                                                minWidth: '20px',
                                                minHeight: '41px',
                                                background: 'transparent',
                                                boxShadow: 'none',
                                                marginTop: '-13px !important',
                                                '&:hover': {
                                                    background: '#f4f4f4',
                                                    borderRadius: '50%',
                                                    minHeight: '41px',
                                                    minWidth: '20px',
                                                    boxShadow: 'none',
                                                },
                                            }}
                                            onClick={() => handleEditTodoEdit(index)}
                                        >
                                            <FaEdit
                                                style={{
                                                    color: "#1976d2",
                                                    fontSize: "1.2rem"
                                                }}
                                            />
                                        </Button>
                                    </Grid>
                                    <Grid item md={1} sm={1} xs={1}>
                                        <Button
                                            variant="contained"
                                            style={{
                                                minWidth: '20px',
                                                minHeight: '41px',
                                                background: 'transparent',
                                                boxShadow: 'none',
                                                marginTop: '-13px !important',
                                                '&:hover': {
                                                    background: '#f4f4f4',
                                                    borderRadius: '50%',
                                                    minHeight: '41px',
                                                    minWidth: '20px',
                                                    boxShadow: 'none',
                                                },
                                            }}
                                            onClick={() => handleDeleteTodoEdit(index)}
                                        >
                                            <DeleteIcon
                                                style={{
                                                    color: "#b92525",
                                                    fontSize: "1.2rem"
                                                }}
                                            />
                                        </Button>
                                    </Grid>
                                </Grid>
                            )}
                            <br />
                        </div>
                    ))}
                    <InputLabel id="demo-select-small">Display Rack</InputLabel><br />
                    <Grid container sx={{ display: "flex", }} >
                        {todos.map((item, index) => {
                            return (
                                <Grid item lg={2} md={4} sm={6} xs={12}>

                                    <Typography sx={{ border: "1px solid #1976d2", textAlign: "center", paddingTop: "20px", paddingBottom: "20px" }} >
                                        {item.subrackcode}
                                    </Typography>
                                </Grid>
                            )
                        })}&emsp;
                    </Grid>
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid sx={{ display: 'flex' }}>
                            <Button sx={userStyle.buttonadd} type="submit" onClick={editSubmit} >UPDATE</Button>
                            <Link to="/product/rack/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
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

            {/* Check edit */}
            <Box>
                <Dialog
                    open={isErrorOpenpop}
                    onClose={handleCloseerrpop}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <Typography variant="h6">{showAlertpop}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" style={{
                            padding: '7px 13px',
                            color: 'white',
                            background: 'rgb(25, 118, 210)'
                        }} onClick={() => {
                            sendRequest();
                            handleCloseerrpop();
                        }}>
                            ok
                        </Button>
                        <Button
                            sx={userStyle.buttoncancel}
                            onClick={handleCloseerrpop}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}

function Rackedit() {
    return (
        <>
            <Rackeditlist /><br /><br /><br /><br />
            <Footer />
        </>
    );
}
export default Rackedit;