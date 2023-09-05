import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, Select, MenuItem, TextField, TextareaAutosize, Typography, FormGroup, FormControlLabel, Checkbox, Button, Tooltip, IconButton, Dialog, DialogContent, DialogActions } from '@mui/material';
import { FcInfo } from "react-icons/fc";
import { FaInfo } from "react-icons/fa";
import { colourStyles, userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import dayjs from 'dayjs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CreateCatMod from './Categorucreate';
import Selects from "react-select";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { SERVICE } from "../../../services/Baseservice";
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import { FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Headtitle from '../../../components/header/Headtitle';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const Expesecreatelist = () => {

    const { auth, setngs } = useContext(AuthContext);
    const { isUserRoleAccess, allLocations, isActiveLocations, allTaxratesGroup } = useContext(UserRoleAccessContext);
    const [excategorys, setExcategorys] = useState([]);
    const [busilocations, setBusilocations] = useState(isActiveLocations.map((d) => (
        {
            ...d,
            label: d.name,
            value: d.locationid,
        }
    )));
    const [taxrates, setTaxrates] = useState([]);
    const [isLocation, setIsLocation] = useState({});
    //set change expense category
    const [saveExpcate, setSaveExpcate] = useState("");
    // expense date
    const [expenseDateTime, setExpenseDateTime] = useState(dayjs());
    const [paidonDateTime, setPaidonDateTime] = useState(dayjs());
    const [locationData, setLocationData] = useState([])

    const [expenseAdd, setExpenseAdd] = useState({
        businesslocation: "", expcategory: "Please Select Category", referenceno: "",
        expcontact: "", expimage: "", exptax: setngs ? setngs.applicabletax == undefined ? "None" : setngs.applicabletax : setngs.applicabletax, totalamount: "", expnote: "", isrefund: false,
        expamount: "", repeaton: "", exppaidon: "", paymethod: "Cash", payaccount: "None", cardnum: "", cardhname: "",
        cardtransnum: "", cardtype: "Please Select Card Type", month: "", year: "", securitycode: "", checkno: "",
        baccno: "", transnum1: "", transnum2: "", transnum3: "", transnum4: "",
        transnum5: "", transnum6: "", transnum7: "", paynotes: "", duppaydue: 0.00, paydue: 0.0
    });
     
    // Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

    //  Datefield
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
   
    //  File Upload
    const [files, setFiles] = useState([]);

    const handleFileUpload = (event, index) => {
        const filesname = event.target.files;
        let newSelectedFiles = [...files];
        for (let i = 0; i < filesname.length; i++) {
            const file = filesname[i];
            // Check if the file is an image
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (['jpg', 'jpeg', 'png', 'pdf'].includes(fileExtension)) {
                const reader = new FileReader();
                reader.onload = () => {
                    newSelectedFiles.push({
                        name: file.name,
                        preview: reader.result,
                        data: reader.result.split(',')[1]
                        // index: indexData
                    });
                    setFiles(newSelectedFiles);
                };
                reader.readAsDataURL(file);
            }
            else {
                // Display an error message or take appropriate action for unsupported file types
                toast.error('Unsupported file type. Only images and PDFs are allowed.');
            }
        }
    };

    const handleClear = () => {
        setExpenseAdd({
            locationplaceholder: isLocation ? isLocation.name : "",
            businesslocation: "", expcategory:"Please Select Category", referenceno: "",
            expcontact: "", expimage: "", exptax: setngs ? setngs.applicabletax == undefined ? "None" : setngs.applicabletax : setngs.applicabletax, totalamount: "", expnote: "", isrefund: false,
            expamount: "", repeaton: "", exppaidon: "", paymethod: "Cash", payaccount: "None", cardnum: "", cardhname: "",
            cardtransnum: "", cardtype: "Please Select Card Type", month: "", year: "", securitycode: "", checkno: "",
            baccno: "", transnum1: "", transnum2: "", transnum3: "", transnum4: "",
            transnum5: "", transnum6: "", transnum7: "", paynotes: "", duppaydue: 0.00, paydue: 0.0
        });
        setTaxrates([]);
        setFiles('')
    }

    const handleFileDelete = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    useEffect(
        () => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener('beforeunload', beforeUnloadHandler);
        return () => {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
        };
    }, []);

    // Expense
    const getcyear = new Date().getUTCFullYear();
    const valnyear = getcyear.toString();
    let newval = setngs ? setngs.expensesku == undefined ? `EP${valnyear}/0001` : `${setngs.expensesku}${valnyear}/` + "0001" : `EP${valnyear}/0001`;

    const [expenses, setExpenses] = useState(newval);

    const fetchExpense = async () => {
        try {
            let res = await axios.post(SERVICE.EXPENSE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]
            });
            let refNo = res?.data?.expenses[res?.data?.expenses.length - 1]?.referenceno;
            let codenum = refNo.slice(-4);
            let prefixLength = Number(codenum) + 1;
            let prefixString = String(prefixLength);
            let postfixLength = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ? `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString
            let strings = setngs ? `${setngs.expensesku}${valnyear}/` : 'EP' + valnyear + '/';
            setExpenses(strings + postfixLength)
            
            let locresult = res?.data?.expenses.map((data, index) => {
                return data.referenceno
            })
            let selectlocation = allLocations?.filter((data, index) => {
                return data.locationid == setngs.businesslocation
            })
            setIsLocation(selectlocation[0]);

            setLocationData(locresult);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            }
            // else{
            //     toast.error("Something went wrong!")
            // }
        }
    };

    // Expense Category
    const fetchExpenseCategory = async () => {
        try {
            let res = await axios.post(SERVICE.EXPENSE_CATEGORY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            const expcategory = [{ label: 'Please Select Expense Category', value: 'Please Select Expense Category' }, ...res?.data?.excategorys?.map((d) => (
                {
                    ...d,
                    label: d.categoryname,
                    value: d.categoryname
                }
            ))];
            setExcategorys(expcategory);
          
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    const fetchRates = async () => {
        try {
            setTaxrates(
                allTaxratesGroup?.map((d) => ({
                    ...d,
                    label: d.taxtype == 'hsn' ? d.hsn + '@' + d.taxrate : d.taxname + '@' + d.taxrate,
                    value: d.taxtype == 'hsn' ? d.hsn + '@' + d.taxrate : d.taxname + '@' + d.taxrate,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    // Add Expense
    const backLPage = useNavigate();

    // Store Expense data
    const sendRequest = async () => {
        try {
            let EXPENSE_REQ = await axios.post(SERVICE.EXPENSE_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businesslocation: String(expenseAdd.businesslocation),
                expcategory: String(expenseAdd.expcategory == "Please Select category" ? "ALL" : expenseAdd.expcategory),
                today: String(today),
                referenceno: String(expenses),
                expdate: String(expenseDateTime),
                expimage: String(expenseAdd.expimage),
                exptax: String(expenseAdd.exptax),
                totalamount: String(expenseAdd.totalamount),
                expnote: String(expenseAdd.expnote),
                isrefund: Boolean(expenseAdd.isrefund),
                exppaidon: String(paidonDateTime),
                expamount: Number(expenseAdd.expamount),
                paymethod: String(expenseAdd.paymethod =="Please Select Payment" ? "ALL" :expenseAdd.paymethod),
                payaccount: String(expenseAdd.payaccount),
                cardnum: String(expenseAdd.cardnum),
                cardhname: String(expenseAdd.cardhname),
                cardtransnum: String(expenseAdd.cardtransnum),
                cardtype: String(expenseAdd.cardtype == "Please Select Card Type" ? "ALL" :expenseAdd.cardtype),
                month: String(expenseAdd.month),
                year: String(expenseAdd.year),
                securitycode: String(expenseAdd.securitycode),
                checkno: String(expenseAdd.checkno),
                baccno: String(expenseAdd.baccno),
                transnum1: String(expenseAdd.transnum1),
                paynotes: String(expenseAdd.paynotes),
                paydue: Number(expenseAdd.paydue),
                files: [...files],
                assignbusinessid: String(setngs.businessid),
            });
            setExpenseAdd(EXPENSE_REQ.data);
            backLPage('/expense/expense/list');
            toast.success(EXPENSE_REQ.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                if (messages == "request entity too large") {
                    toast.error("Document Size Can't more than 5MB!");
                } else {
                    toast.error(messages);
                }
            } else {
                toast.error("Something went wrong!");
            }
        }
    };

    useEffect(
        () => {
            fetchExpense();
            fetchRates();
        }, []
    );

    useEffect(
        () => {
            fetchExpenseCategory();
        }, [saveExpcate]
    )

    const addExpenseSubmit = (e) => {
        e.preventDefault();
        if (expenseAdd.totalamount == "" || expenseAdd.totalamount == 0) {
            setShowAlert("Please enter Total amount!")
            handleClickOpen();
        }
        else if (locationData.includes(expenses)) {
            setShowAlert("ID Already Exists");
            handleClickOpen();
        }
        else {
            sendRequest();
        }
    }

    return (
        <Box>
            <Headtitle title={'Add Expense'} />
            <form onSubmit={addExpenseSubmit}>
                <Typography sx={userStyle.HeaderText}>Add Expense</Typography>
                <Box sx={userStyle.container}>
                    <Grid container spacing={3} >
                        <Grid item md={4} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Business Location</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Selects
                                    options={busilocations}
                                    styles={colourStyles}
                                    placeholder={isLocation ? isLocation.name : ""}
                                    onChange={(e) => { setExpenseAdd({ ...expenseAdd, businesslocation: e.value }); }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Expense Category <b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <Grid sx={{ display: 'flex' }}>
                                    <Selects
                                        options={excategorys}
                                        styles={colourStyles}
                                        value={{value:expenseAdd.expcategory,label:expenseAdd.expcategory}}
                                        onChange={(e) => { setExpenseAdd({ ...expenseAdd, expcategory: e.value }); }}
                                        placeholder="Please Select Category"
                                    />
                                    <Grid sx={userStyle.spanIcons}>
                                        <CreateCatMod setSaveExpcate={setSaveExpcate} />
                                    </Grid>
                                </Grid>
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Reference No</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={expenses}
                                    name="referenceno"
                                />
                            </FormControl>
                            <Typography variant='body2' sx={{ mt: '5px' }}>Leave empty to autogenerate</Typography>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Date</InputLabel>
                            <FormControl size="small" fullWidth >
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        renderInput={(props) => <TextField {...props} size="small" />}
                                        value={expenseDateTime}
                                        onChange={(newValue) => {
                                            setExpenseDateTime(newValue);
                                        }}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Applicable Tax</InputLabel>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIconTax}><FaInfo /></Grid>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        options={taxrates}
                                        styles={colourStyles}
                                        placeholder={setngs?.applicabletax}
                                        onChange={(e) => { setExpenseAdd({ ...expenseAdd, exptax: e.value, }); }}
                                    >
                                    </Selects>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Total Amount<b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    id="component-outlined"
                                    type='number'
                                    value={expenseAdd.totalamount}
                                    onChange={(e) => { setExpenseAdd({ ...expenseAdd, totalamount: e.target.value, paydue: Number(e.target.value) - Number(expenseAdd.expamount), businesslocation: expenseAdd.businesslocation == "" ? isLocation?.locationid : expenseAdd.businesslocation }) }}
                                    name="totalamount"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <InputLabel >Upload Documents</InputLabel>
                            <> <Button variant="outlined" component="label" style={{ justifyContent: "center !important" }}>
                                <div> <CloudUploadIcon sx={{ paddingTop: '5px' }} />
                                    {/* &ensp;<span style={{ paddingBottom: '14px' }}>Upload</span> */}
                                </div>
                                <input hidden type="file" multiple onChange={handleFileUpload} accept=" application/pdf, image/*" />
                            </Button>
                            </>
                        </Grid>
                        <>
                            <br /><br />
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ padding: '10px', }}>
                                <br/>
                                {files?.length > 0 &&
                                    (files.map((file, index) => (
                                        <>
                                            <Grid container spacing={2} sx={{display:"flex" , justifyContent: "center" }}>
                                                <Grid item lg={6} md={6} sm={6} xs={6}>
                                                    {/* <Typography style={{ color: "#357ae8" }}>
                                                        {((file.name).split(".")[1] === "pdf") ? <FaFilePdf style={{ fontSize: "75px" }} /> :
                                                            ((file.name).split(".")[1] === "csv") ? <FaFileCsv style={{ fontSize: "75px" }} /> :
                                                                ((file.name).split(".")[1] === "xlsx") ? <FaFileExcel style={{ fontSize: "75px" }} /> :
                                                                    ((file.name).split(".")[1] === "docx") ? <FaFileExcel style={{ fontSize: "75px" }} /> :
                                                                        <img src={`data:application/octet-stream;base64,${file.data}`} style={{ width: '80px', height: '80px' }} />}
                                                    </Typography> */}
                                                    <Typography>{file.name}</Typography>
                                                </Grid>
                                                {/* <br/> */}
                                                <Grid item lg={2} md={2} sm={2} xs={2}>
                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", marginLeft: "60px", marginTop: "-20px", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                                                </Grid>
                                                {/* <br/> */}
                                                <Grid item lg={2} md={2} sm={2} xs={2}>
                                                    <a
                                                        style={{ color: "#357AE8", marginLeft: "60px",marginTop: "-20px" }}
                                                        href={`data:application/octet-stream;base64,${file.data}`}
                                                        download={file.name}
                                                    >
                                                        <FileDownloadIcon />
                                                    </a>

                                                </Grid>
                                                {/* <br/> */}
                                                <Grid item lg={2} md={2} sm={2} xs={2}>
                                                    <Button style={{ fontsize: "large", color: "#357AE8", marginLeft: "60px", marginTop: "-20px", cursor: "pointer" }} onClick={() => handleFileDelete(index)} size="small"  ><DeleteIcon /></Button>

                                                </Grid>
                                            </Grid>
                                        </>
                                    )))}
                            </Grid>
                        </>
                        <br />
                        <Grid item lg={12} md={12} sm={12} xs={12}></Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <InputLabel id="demo-select-small" sx={{ m: 1 }}>Expense Note</InputLabel>
                            <FormControl size="small" fullWidth >
                                <TextareaAutosize aria-label="minimum height" minRows={3} style={{ border: '1px solid #4a7bf7' }}
                                    value={expenseAdd.expnote}
                                    onChange={(e) => { setExpenseAdd({ ...expenseAdd, expnote: e.target.value }) }}
                                    name="expensenotes"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box><br />
                <Box sx={userStyle.container}>
                    <Typography variant="h6" >Add payment</Typography><br />
                    <Grid container spacing={3} >
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Amount <b style={{ color: 'red' }}>*</b></InputLabel>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIcons}><MoneyOutlinedIcon /></Grid>
                                <FormControl size="small" fullWidth >
                                    <OutlinedInput
                                        sx={userStyle.input}
                                        id="component-outlined"
                                        value={expenseAdd.expamount}
                                        onChange={(e) => { setExpenseAdd({ ...expenseAdd, expamount: e.target.value, paydue: Number(expenseAdd.totalamount) - Number(e.target.value) }) }}
                                        type='number'
                                        name="expamount"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Paidon Date</InputLabel>
                            <Grid sx={{ display: 'flex' }}  >
                                <FormControl size="small" fullWidth >
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            renderInput={(props) => <TextField {...props} size="small" />}
                                            value={paidonDateTime}
                                            onChange={(newValue) => {
                                                setPaidonDateTime(newValue);
                                            }}
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Payment Method <b style={{ color: 'red' }}>*</b></InputLabel>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIcons}><MoneyOutlinedIcon /></Grid>
                                <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={expenseAdd.paymethod}
                                        onChange={(e) => { setExpenseAdd({ ...expenseAdd, paymethod: e.target.value }) }}
                                        name="paymethod"
                                        fullWidth
                                    >
                                        <MenuItem value="Please Select Payment">Please Select Payment</MenuItem>
                                        <MenuItem value="Cash">Cash</MenuItem>
                                        <MenuItem value="Card">Card</MenuItem>
                                        <MenuItem value="Cheque">Cheque</MenuItem>
                                        <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                                        <MenuItem value="Other">Other</MenuItem>
                                        <MenuItem value="UPI">UPI</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Payment Account</InputLabel>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIcons}><MoneyOutlinedIcon /></Grid>
                                <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={expenseAdd.payaccount}
                                        onChange={(e) => { setExpenseAdd({ ...expenseAdd, payaccount: e.target.value }) }}
                                        name="payaccount"
                                        fullWidth
                                    >
                                        <MenuItem value="None">None</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={8} sm={12} xs={12}></Grid>
                        {/* ****** Dropdown options ****** */}
                        {/* ****** Card Section ****** */}
                        {expenseAdd.paymethod === "Card" &&
                            (
                                <>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Card Number</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseAdd.cardnum}
                                                onChange={(e) => { setExpenseAdd({ ...expenseAdd, cardnum: e.target.value }) }}
                                                label="Card Number"
                                                type='text'
                                                name="cardnum"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Card Holder Name</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseAdd.cardhname}
                                                onChange={(e) => { setExpenseAdd({ ...expenseAdd, cardhname: e.target.value }) }}
                                                label="Card Holder Name"
                                                type="text"
                                                name="cardhname"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Card Transaction No</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseAdd.cardtransnum}
                                                onChange={(e) => { setExpenseAdd({ ...expenseAdd, cardtransnum: e.target.value }) }}
                                                label="Card Transaction No"
                                                type='text'
                                                name="cardtransnum"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} sm={12} xs={12}>
                                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                            <InputLabel id="demo-select-small">Card Type</InputLabel>
                                            <Select
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                value={expenseAdd.cardtype}
                                                onChange={(e) => { setExpenseAdd({ ...expenseAdd, cardtype: e.target.value }) }}
                                                label="Card Type"
                                                name="cardtype"
                                                fullWidth
                                            >
                                                <MenuItem value="Please Select Card Type">Please Select Card Type</MenuItem>
                                                <MenuItem value="None">None</MenuItem>
                                                <MenuItem value="Credit Card">Credit Card</MenuItem>
                                                <MenuItem value="Debit Card">Debit Card</MenuItem>
                                                <MenuItem value="Visa">Visa</MenuItem>
                                                <MenuItem value="MasterCard">MasterCard</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} sm={12} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Month</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseAdd.month}
                                                onChange={(e) => { setExpenseAdd({ ...expenseAdd, month: e.target.value }) }}
                                                label="Month"
                                                type='text'
                                                name="month"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} sm={12} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Year</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseAdd.year}
                                                onChange={(e) => { setExpenseAdd({ ...expenseAdd, year: e.target.value }) }}
                                                label="Year"
                                                type='text'
                                                name="year"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} sm={12} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Security Code</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseAdd.securitycode}
                                                onChange={(e) => { setExpenseAdd({ ...expenseAdd, securitycode: e.target.value }) }}
                                                label="Security Code"
                                                type='text'
                                                name="securitycode"
                                            />
                                        </FormControl>
                                    </Grid>
                                </>
                            )
                        }
                        {/* ****** Cheque Section ****** */}
                        {expenseAdd.paymethod === "Cheque" &&
                            (
                                <>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Cheque No.</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseAdd.checkno}
                                                onChange={(e) => { setExpenseAdd({ ...expenseAdd, checkno: e.target.value }) }}
                                                label="Cheque No."
                                                type='number'
                                                name="checkno"
                                            />
                                        </FormControl>
                                    </Grid>
                                </>
                            )
                        }
                        {/* ****** Bank Section ****** */}
                        {expenseAdd.paymethod === "Bank Transfer" &&
                            (
                                <>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Bank Account No.</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseAdd.baccno}
                                                onChange={(e) => { setExpenseAdd({ ...expenseAdd, baccno: e.target.value }) }}
                                                label="Bank Account No."
                                                type='number'
                                                name="baccno"
                                            />
                                        </FormControl>
                                    </Grid>
                                </>

                            )
                        }
                        {/* ****** Transaction Section Start ****** */}
                        {expenseAdd.paymethod === "UPI" &&
                            (
                                <>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Transaction No.</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseAdd.transnum1}
                                                onChange={(e) => { setExpenseAdd({ ...expenseAdd, transnum1: e.target.value }) }}
                                                label="Transaction No."
                                                type='text'
                                                name="transnum1"
                                            />
                                        </FormControl>
                                    </Grid>
                                </>
                            )
                        }
                        {/* *************** End ************ */}
                        <Grid item md={12} sm={12} xs={12}>
                            <InputLabel id="demo-select-small" sx={{ m: 1 }}>Payment Note</InputLabel>
                            <FormControl size="small" fullWidth >
                                <TextareaAutosize aria-label="minimum height" minRows={3} style={{ border: '1px solid #4a7bf7' }}
                                    value={expenseAdd.paynotes}
                                    onChange={(e) => { setExpenseAdd({ ...expenseAdd, paynotes: e.target.value }) }}
                                    name="paynotes"
                                />
                            </FormControl><br /><br />
                            <hr />
                        </Grid>
                        <Grid container style={{ justifyContent: "right", }} sx={userStyle.textInput}>
                            <Typography variant='subtitle1'
                                value={expenseAdd.paydue}
                                onChange={(e) => { setExpenseAdd({ ...expenseAdd, paydue: e.target.value }) }}
                            ><b>Payment due:</b> ₹ {expenseAdd.paydue}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid >
                        <Button sx={userStyle.buttoncancel} onClick={handleClear}>CLEAR</Button>
                            <Link to="/expense/expense/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
                            <Button sx={userStyle.buttonadd} type='submit'>SAVE</Button>
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
        </Box >
    );
}
const Expensecreate = () => {
    return (
        <>
           <>
           <Expesecreatelist /><br /><br /><br />
                        <Footer />
           </>
        </>
    );
}

export default Expensecreate;