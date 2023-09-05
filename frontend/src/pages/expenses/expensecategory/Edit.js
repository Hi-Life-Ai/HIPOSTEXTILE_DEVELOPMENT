import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, Button, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { toast } from 'react-toastify';
import { SERVICE } from "../../../services/Baseservice";
import { AuthContext } from '../../../context/Appcontext';

function Expensecategoryeditlist() {

    const [expenseCategoryForm, setExpenseCategoryForm] = useState({});
    const { auth, setngs } = useContext(AuthContext);
    const backLPage = useNavigate();
    // Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };
    const [overallExcategory, setOverAllExcategory] = useState("");
    const [getExcategory, setGetExcategory] = useState("");
    const [EditExcategoryCount, setEditExcategoryCount] = useState(0);

    // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

    // Error Popup model
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => {
        setIsErrorOpenpop(true);
    };
    const handleCloseerrpop = () => {
        setIsErrorOpenpop(false);
    };
    
    const getEditId = async (value) => {
        try {
            let res = await axios.post(SERVICE.EDIT_EXCATEGORY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                assignbusinessid:String(setngs.businessid),
                expcategory: String(value)

            });
            setEditExcategoryCount(res?.data?.excategory?.length)
            setOverAllExcategory(`${res?.data?.excategory?.length > 0 ? "Expencecategory is linked with Expense whether you want to change ?" : ""} `)

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };







    const getOverAlldepUpdate = async () => {
        try {
            let res = await axios.post(SERVICE.EDIT_EXCATEGORY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                assignbusinessid:String(setngs.businessid),
                expcategory: getExcategory

            });
            editOveAllDepartment(res.data.excategory)
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



    const editOveAllDepartment = async (excategory) => {
        try {

            if (excategory?.length > 0) {
                let result = excategory.map((data, index) => {
                    let request = axios.put(`${SERVICE.EXPENSE_SINGLE}/${data._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        expcategory: String(expenseCategoryForm.categoryname),
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



    const sendRequest = async () => {
        try {
            let expensecateedit = await axios.put(`${SERVICE.EXPENSE_CATEGORY_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                categoryname: String(expenseCategoryForm.categoryname),
                categorycode: String(expenseCategoryForm.categorycode),
            });
            setExpenseCategoryForm(expensecateedit.data);
            await getOverAlldepUpdate();
            toast.success(expensecateedit.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            backLPage('/expense/expensecategory/list');
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    const id = useParams().id

    //  Expense category
    const fetchHandler = async () => {
        try {
            let response = await axios.get(`${SERVICE.EXPENSE_CATEGORY_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setExpenseCategoryForm(response?.data?.sexcategory);
            getEditId(response.data.sexcategory.categoryname);
            setGetExcategory(response.data.sexcategory.categoryname)
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
        fetchHandler();
    }, [id]);


    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);
        

    const editExpCateSubmit = (e) => {
        e.preventDefault();
        if (expenseCategoryForm.categoryname == "") {
            setShowAlert("Please enter categoty name!");
            handleClickOpen();
        } else if (expenseCategoryForm.categorycode == "") {
            setShowAlert("Please enter categoty code!");
            handleClickOpen();
        }
        else if (expenseCategoryForm.categoryname != getExcategory && EditExcategoryCount > 0) {
            setShowAlertpop(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {overallExcategory}
                    </p>
                </>
            )
            handleClickOpenerrpop();

        } else {
            sendRequest();
        }
    }
    return (
        <Box>
            <Typography sx={userStyle.HeaderText}> Edit Expense Category </Typography>
            <form onSubmit={editExpCateSubmit}>
                <Box sx={userStyle.container}>
                    <Grid container spacing={2}>
                        <Grid item md={6} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined">Category name <b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={expenseCategoryForm.categoryname}
                                    onChange={(e) => { setExpenseCategoryForm({ ...expenseCategoryForm, categoryname: e.target.value }) }}
                                    type="text"
                                    name="categoryname"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={6} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined">Category Code<b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={expenseCategoryForm.categorycode}
                                    type="text"
                                    name="categorycode"
                                />
                            </FormControl>
                        </Grid>
                        <Grid container sx={userStyle.gridcontainer}>
                            <Grid >
                                <Link to="/expense/expensecategory/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
                                <Button sx={userStyle.buttonadd} type='submit'>UPDATE</Button>
                            </Grid>
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
                            style={{
                                backgroundColor: '#f4f4f4',
                                color: '#444',
                                boxShadow: 'none',
                                borderRadius: '3px',
                                padding: '7px 13px',
                                border: '1px solid #0000006b',
                                '&:hover': {
                                    '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                                        backgroundColor: '#f4f4f4',
                                    },
                                },
                            }}
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

const Expensecategoryedit = () => {
    return (
        <>
            <Expensecategoryeditlist /><br /><br /><br />
                        <Footer />
        </>
    );
}
export default Expensecategoryedit;