import React, { useEffect, useState, useContext } from 'react';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, TextareaAutosize, Typography, Button } from '@mui/material';
import { FaInfo } from "react-icons/fa";
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import dayjs from 'dayjs';
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SERVICE } from "../../../services/Baseservice";
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import { FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import Headtitle from '../../../components/header/Headtitle'
import SearchIcon from '@mui/icons-material/Search';

const Expenseviewlist = () => {

    const { auth } = useContext(AuthContext);
    const { allLocations } = useContext(UserRoleAccessContext);
    const [expenseForm, setExpenseForm] = useState({});
    const [isLocation, setIsLocation] = useState({});

    //  File Upload
    const [files, setFiles] = useState([]);

    const id = useParams().id

    const fetchHandler = async () => {
        try {
            let response = await axios.get(`${SERVICE.EXPENSE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setExpenseForm(response?.data?.sexpense);
            setFiles(response?.data?.sexpense?.files);
            let selectlocation = allLocations.filter((data, index) => {
                return data.locationid == response?.data?.sexpense?.businesslocation
            })
            setIsLocation(selectlocation[0]);

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    useEffect(() => {
        fetchHandler();
    }, [id]);

    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    return (
        <Box>
            <Headtitle title={'View Expense'} />
            <form>
                <Typography sx={userStyle.HeaderText}>View Expense</Typography>
                <Box sx={userStyle.container}>
                    <Grid container spacing={3}>
                        <Grid item md={4} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Business Location</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id='component-outlined'
                                    value={isLocation ? isLocation.name : ""}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Expense Category <b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    id="component-outlined"
                                    type='text'
                                    value={expenseForm.expcategory}
                                    name="referenceno"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Reference No</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    type='text'
                                    value={expenseForm.referenceno}
                                    name="referenceno"
                                />
                            </FormControl>
                            <Typography variant='body2' sx={{ mt: '5px' }}>Leave empty to autogenerate</Typography>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Date</InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    id="component-outlined"
                                    type='text'
                                    value={expenseForm.expdate}
                                    name="referenceno"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Applicable Tax</InputLabel>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIconTax}><FaInfo /></Grid>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type='text'
                                        value={expenseForm.exptax}
                                        name="referenceno"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Total Amount<b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    type='number'
                                    value={expenseForm.totalamount}
                                    name="totalamount"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Documents</InputLabel>
                            {files &&
                                (files.map((file, index) => (
                                    <>
                                        <Button variant='contained' onClick={() => renderFilePreview(file)} style={{ textTranform: 'capitalize' }}><SearchIcon />Preview</Button>

                                        <Grid sx={{ display: 'flex', justifyContent: "center" }}>

                                            {/* <Typography><a style={{ color: "#357ae8" }}
                                                href={`data:application/octet-stream;base64,${file.data}`}
                                                download={file.name}
                                            >
                                                {((file.name).split(".")[1] === "pdf") ? <FaFilePdf style={{ fontSize: "75px" }} /> :
                                                    ((file.name).split(".")[1] === "csv") ? <FaFileCsv style={{ fontSize: "75px" }} /> :
                                                        ((file.name).split(".")[1] === "xlsx") ? <FaFileExcel style={{ fontSize: "75px" }} /> :
                                                            ((file.name).split(".")[1] === "docx" || "txt" || "doc") ? <FaFileExcel style={{ fontSize: "75px" }} /> :
                                                                <img src={`data:application/octet-stream;base64,${file.data}`} alt="edit" style={{ width: '80px', height: '80px' }} />}
                                            </a></Typography> <br></br> */}
                                            <Typography>{file.name}</Typography>
                                        </Grid>
                                    </>
                                )))}
                        </Grid>
                        {/* <Grid item md={4} sm={6} xs={12} >
                            <FormGroup>
                                <span><FormControlLabel control={<Checkbox checked={Boolean(expenseForm.isrefund)}
                                    onClick={(e) => { setExpenseForm({ ...expenseForm, isrefund: !expenseForm.isrefund }) }}
                                />} label=" Is refund?" />
                                    <Tooltip arrow title="If checked expense will be refunded">
                                        <IconButton size="small">
                                            <FcInfo />
                                        </IconButton>
                                    </Tooltip>
                                </span>
                            </FormGroup>
                        </Grid> */}
                        <Grid item md={12} sm={12} xs={12}>
                            <InputLabel id="demo-select-small" sx={{ m: 1 }}>Expense Note</InputLabel>
                            <FormControl size="small" fullWidth >
                                <TextareaAutosize aria-label="minimum height" minRows={3} style={{ border: '1px solid #4a7bf7' }}
                                    value={expenseForm.expnote}
                                    name="paynotes"
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
                                        id="component-outlined"
                                        value={expenseForm.expamount}
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
                                    <OutlinedInput
                                        id="component-outlined"
                                        type='text'
                                        value={expenseForm.exppaidon}
                                        name="referenceno"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Payment Method <b style={{ color: 'red' }}>*</b></InputLabel>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIcons}><MoneyOutlinedIcon /></Grid>
                                <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type='text'
                                        value={expenseForm.paymethod}
                                        name="referenceno"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Payment Account</InputLabel>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIcons}><MoneyOutlinedIcon /></Grid>
                                <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type='text'
                                        value={expenseForm.payaccount}
                                        name="referenceno"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={8} sm={12} xs={12}></Grid>
                        {/* ****** Dropdown options ****** */}
                        {/* ****** Card Section ****** */}
                        {expenseForm.paymethod === "Card" &&
                            (
                                <>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Card Number</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseForm.cardnum}
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
                                                value={expenseForm.cardhname}
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
                                                value={expenseForm.cardtransnum}
                                                label="Card Transaction No"
                                                type='text'
                                                name="cardtransnum"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} sm={12} xs={12}>
                                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                            <InputLabel id="demo-select-small">Card Type</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type='text'
                                                value={expenseForm.cardtype}
                                                name="referenceno"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} sm={12} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Month</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseForm.month}
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
                                                value={expenseForm.year}
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
                                                value={expenseForm.securitycode}
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
                        {expenseForm.paymethod === "Cheque" &&
                            (
                                <>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Cheque No.</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseForm.checkno}
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
                        {expenseForm.paymethod === "Bank Transfer" &&
                            (
                                <>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Bank Account No.</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseForm.baccno}
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
                        {expenseForm.paymethod === "UPI" &&
                            (
                                <>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Transaction No.</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseForm.transnum1}
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
                                    value={expenseForm.paynotes}
                                    name="paynotes"
                                />
                            </FormControl><br /><br />
                            <hr />
                        </Grid>
                        <Grid container style={{ justifyContent: "right", }} sx={userStyle.textInput}>
                            <Typography variant='subtitle1'
                                value={expenseForm.paydue}
                            ><b>Payment due:</b> ₹ {expenseForm.paydue}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid >
                            <Link to="/expense/expense/list"><Button sx={userStyle.buttoncancel}>BACK</Button></Link>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </Box >
    );
}
const Expenseview = () => {
    return (
        <>
            <Expenseviewlist /><br /><br /><br />
                        <Footer />
        </>
    );
}

export default Expenseview;