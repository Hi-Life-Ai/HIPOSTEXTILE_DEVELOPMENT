import React, { useEffect, useState, useContext } from 'react';
import { userStyle, colourStyles } from '../../PageStyle';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, TextField, Select, MenuItem, Paper, TableCell, Dialog, DialogContent, DialogActions, TextareaAutosize, Typography, Button, Table, TableContainer, TableHead, TableBody, } from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { FaSearch } from "react-icons/fa";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import Purchasesupplieradd from './Purchasesupplieradd';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import { AiOutlineClose } from "react-icons/ai";
import Headtitle from '../../../components/header/Headtitle';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Purchaseproductadd from './Purchaseproductadd';
import Selects from "react-select";
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SERVICE } from "../../../services/Baseservice";
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import 'react-quill/dist/quill.snow.css';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import DeleteIcon from '@mui/icons-material/Delete';
import Purchasetable from './Purchastable';

const Purchasecreatelist = () => {

    const { auth, setngs } = useContext(AuthContext);
    const [supplier, setSupplier] = useState({});
    const [suppliers, setSuppliers] = useState([]);
    const [busilocations, setBusilocations] = useState([]);
    const [isBusilocations, setIsBusilocations] = useState({});
    const [taxrates, setTaxrates] = useState([]);
    const [taxRate, setTaxRate] = useState(0);
    const [productsList, setProductsList] = useState([]);
    
    const [isSupplierFetch, setIsSupplierFetch] = useState("");
    const [locationData, setLocationData] = useState([])
    
    const [isQuantity, setIsQuantity] = useState(false);

    //  Datefield
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

    //role access
    const { isUserRoleAccess, allLocations, allTaxratesGroup, isActiveLocations, allTaxrates } = useContext(UserRoleAccessContext);

    // paid date
    const [paidDateTime, setPaidDateTime] = useState(dayjs());
    let purchaseStatusPending = "Pending";
    let purchaseStatusReceived = "Received";
    let balanceamt = 0.00;
    let totalalltaxamt = 0.00;
    let totalitem = 0.00;
    let totalvalue = 0.00;
    
    const [allProductsList, setAllProductsList] = useState([]);
    // purchase list og data only in add purchase
    const [purchaseAdd, setPurchaseAdd] = useState({
        supplier: "", referenceno: "",freightamount:"0.00",totalamount:"0.00",expenseamount:"0.00", billamount: "0.00",suppliershrtname:"", purchasedate: today, purchasetaxmode: "None", purchasetaxlabmode: "None", purchasestatus: "Pending", discounttypemode:"None", discountvaluemode:'0.00', discountamountmode:'0.00', addressone: "", balance: 0,
        totaltaxamount:"",businesslocation: "", invoiceno: "", nettotal: 0.0, totalitem: 0,
        purchasetax: "", additionalnotes: [], paydue: 0, payamount: 0.0, advancebalance: "", paidon: "", paymentmethod: "None"
    });

    // auto id for purchase number
    let newval = setngs ? setngs.purchasesku == undefined ? "PU0001" : setngs.purchasesku + "0001" : "PU0001";
    //auto id
    const [purchases, setPurchases] = useState(newval);
    //  File Upload
    const [files, setFiles] = useState([]);

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();

    const handleClickOpen = () => {
        setIsErrorOpen(true);
    };
    const handleClose = () => {
        setIsErrorOpen(false);
    };
     //Quantity popup model
     const [isQuantityOpen, setIsQuantityOpen] = useState(false);

     const handleQuantityOpen = () => {
         setIsQuantityOpen(true);
     };
     const handleQuantityClose = () => {
         setIsQuantityOpen(false);
     };

     //Store popup model
     const [isStoreOpen, setIsStoreOpen] = useState(false);

     const handleStoreOpen = () => {
         setIsStoreOpen(true);
     };
     const handleStoreClose = () => {
         setIsStoreOpen(false);
     };

    // Purchase 
    const fetchPurchases = async () => {
        try {
            let res = await axios.post(SERVICE.PURCHASE_LASTINDEX, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            let refNo = res?.data?.purchases[res?.data?.purchases?.length - 1].referenceno;
            let codenum = refNo.slice(-4);
            let prefixLength = Number(codenum) + 1;
            let prefixString = String(prefixLength);
            let strings = setngs ? setngs.purchasesku : "PU";
            let postfixLength = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ? `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString
            setPurchases(strings + postfixLength)
            //setCategoryForm({ ...categoryForm, categorycode: strings+postfixLength })

            let locresult = res?.data?.purchases.map((data, index) => {
                return data.referenceno
            })
            setLocationData(locresult);

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            }
            // else {
            //     toast.error("Something went wrong!")
            // }
        }
    };

    // Search Addressone
    const searchAdd = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.SUPPLIER_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setSupplier(res?.data?.ssupplier);
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    // Suppliers
    const fetchSuppliers = async () => {
        try {
            let res = await axios.post(SERVICE.SUPPLIER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setTaxrates(allTaxratesGroup);

            setSuppliers(
                res.data.suppliers.map((d) => ({
                    ...d,
                    label: d.suppliername,
                    value: d.suppliername,
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
    };

    const fetchProducts = async () => {
        try {
            let res = await axios.post(SERVICE.PRODUCT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]
            });

            setProductsList(
                res.data.products.map((d) => ({
                    ...d,
                    label: d.productname,
                    value: d.productname,
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
    };

    // Products
    const fetchLocations = async () => {
        try {

            let selectlocation = allLocations?.filter((data, index) => {
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

    //  File Upload
    const handleFileUpload = (event) => {
        const files = event.target.files[0];

        const reader = new FileReader()
        const file = files;
        reader.readAsDataURL(files)
        if (file) {
            // Get the file extension
            const fileExtension = file.name.split('.').pop().toLowerCase();
            // Check if the file is an image or PDF
            if (['jpg', 'jpeg', 'png', 'pdf'].includes(fileExtension)) {
                // Handle the file upload here
                reader.onloadend = (event) => {
                    setFiles((prevFiles) => [
                        ...prevFiles,
                        { name: file.name, preview: reader.result, data: reader.result.split(',')[1] },
                    ]);
                };
            } else {
                // Display an error message or take appropriate action for unsupported file types
                toast.error('Unsupported file type. Only images and PDFs are allowed.');
            }
        }


    };

    const handleFileDelete = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleChangeTaxvalue = (taxvalue) =>{
        setTaxRate(taxvalue);
    }

    useEffect(() => {
        fetchPurchases();
        fetchLocations();
    }, []);

    useEffect(
        () => {
        fetchSuppliers();
    }, [isSupplierFetch]);
    
    
    const backPage = useNavigate();

    // compare bill amount net total then only purchase status changed and update currentstock
    const purchaseStatusInput = (value) => {
        if (value == "Received") {
            if (purchaseAdd.billamount == Number(totalvalue)) {
                setPurchaseAdd({
                    ...purchaseAdd, purchasestatus: "Received"
                });
            } else {
                setPurchaseAdd({
                    ...purchaseAdd, purchasestatus: "Pending"
                });
                purchaseStatusReceived = "Pending";
                setShowAlert("Bill Amount and Net total didn't match");
                handleClickOpen();
            }
        }
    }

    // purchase data add to database
    const addPurchase = async () => {

        // current stock when the user submit
        if (purchaseAdd.purchasestatus == "Received") {
            allProductsList.map((item, index) => {
                productsList.forEach((data, i) => {
                    if ((item.sku == data.sku)) {
                        axios.put(`${SERVICE.PRODUCT_SINGLE}/${data._id}`, {
                            
                            currentstock: Number(data.currentstock) + Number(item.quantitytotalpieces) + Number(item.freeitemtotalpieces),
                            purchaseexcludetax: Number(item.purchaseexcludetax), 
                            pruchaseincludetax: Number(item.pruchaseincludetax),
                            sellingexcludetax: Number(item.sellingpriceunitcost)
                        });
                    }
                })
            })
        }

        let allproductreverse = [...allProductsList.reverse()];
        let supplieraddress = supplier.addressone + "," + supplier.addresstwo + "," + supplier.country + "," + supplier.state + "," + supplier.city + " " + "-" + " " + supplier.pincode + "," + "Ph" + " " + ":" + " " + supplier.phoneone;

        try {
            let purchase = await axios.post(SERVICE.PURCHASE_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                supplier: String(purchaseAdd.supplier),
                today: String(today),
                referenceno: String(purchaseAdd.referenceno),
                purchasedate: String(purchaseAdd.purchasedate),
                purchasestatus: String(purchaseAdd.purchasestatus),
                addressone: String(supplieraddress),
                businesslocation: String(purchaseAdd.businesslocation),
                billamount: String(purchaseAdd.billamount),
                freightamount: String(purchaseAdd.freightamount),
                totalamount: String(purchaseAdd.totalamount),
                expenseamount: String(purchaseAdd.expenseamount),
                totaltaxamount: String(totalalltaxamt == NaN || totalalltaxamt == undefined ? '0.00' : Number(totalalltaxamt)?.toFixed(2)),
                invoiceno: String(purchaseAdd.invoiceno),
                purchasetaxmode: String(purchaseAdd.purchasetaxmode),
                purchasetaxlabmode: String(purchaseAdd.purchasetaxlabmode),
                discounttypemode: String(purchaseAdd.discounttypemode),
                discountvaluemode: String(purchaseAdd.discountvaluemode),
                discountamountmode: String(purchaseAdd.discountamountmode),
                overalltaxrate: String(taxRate),
                products: [...allproductreverse],
                purchasetax: String(purchaseAdd.purchasetax),
                additionalnotes: String(purchaseAdd.additionalnotes == undefined ? "" : purchaseAdd.additionalnotes),
                totalitem: String(totalitem),
                nettotal: String(totalvalue),
                advancebalance: String(purchaseAdd.advancebalance),
                payamount: String(purchaseAdd.payamount),
                paidon: String(paidDateTime),
                paymentmethod: String(purchaseAdd.paymentmethod),
                paydue: String(purchaseAdd.paydue),
                balance: String(balanceamt),
                userbyadd: String(isUserRoleAccess.staffname),
                files: [...files],
                assignbusinessid: String(setngs.businessid),
            });
            setPurchaseAdd(purchase.data);
            toast.success(purchase.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            backPage('/purchase/purchase/list');
            await fetchProducts();
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                if (messages == "request entity too large") {
                    setShowAlert("Document Size Can't more than 5MB!");
                    handleClickOpen();
                } else {
                    setShowAlert(messages);
                    handleClickOpen();
                }
            } else {
                setShowAlert("Something went wrong!");
                handleClickOpen();
            }
        }
    }

    function totalNetCostCalc() {
        let total = 0;
        if (allProductsList?.length > 0) {
            allProductsList?.forEach((value) => {
                total += Number(value.netcostwithtax)
            })
            return Number(total)?.toFixed(0);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (locationData.includes(purchaseAdd.referenceno)) {
            setShowAlert("Reference Number Already Exists");
            handleClickOpen();
        }
        else if (purchaseAdd.supplier == "") {
            setShowAlert("Please enter supplier name!");
            handleClickOpen();
        } else if (purchaseAdd.billamount == 0 || purchaseAdd.billamount == "") {
            setShowAlert("Please enter bill amount!");
            handleClickOpen();
        }
        // else if (allProductsList.length == 0) {
        //     setShowAlert("Please select any one of product!");
        //     handleClickOpen();
        // } else if (totalvalue == 0 || totalvalue == undefined) {
        //     setShowAlert("Please enter any one of product detail!");
        //     handleClickOpen();
        // }
        else {
            // addPurchase();

            handleStoreOpen();
        }
    }

    let balanceamtval = purchaseAdd.billamount == "" || purchaseAdd.billamount == undefined || purchaseAdd.billamount == "0.00" ? 0 : Number(purchaseAdd.billamount);
    balanceamt = totalNetCostCalc() == 0 || totalNetCostCalc() == undefined || totalNetCostCalc() == NaN ? 0 : (Number(balanceamtval) - Number(totalNetCostCalc())).toFixed(2);

    // total quantity and free item calculation
    
    {
        allProductsList && (
            allProductsList.forEach(
                (item => {
                    totalitem += +item.quantity 
                    totalalltaxamt += +item.netcosttaxamount
                    totalvalue += +item.netcostwithtax
                })
            ))
    }

    function payDueCalc() {
        setPurchaseAdd(
            { ...purchaseAdd, paydue: totalNetCostCalc() == undefined ? 0 : Number(totalNetCostCalc()) - Number(purchaseAdd.payamount) }
        )
    }

    useEffect(
        ()=>{
            totalNetCostCalc();
        },[]
    )

    useEffect(
        () => {
            payDueCalc();
        }, [purchaseAdd]
    )

    //change form
  const handleBillAmt = (e) => {
    // Regular expression to match only positive numeric values
    // const regex = /^[0-9]+$/;  // Only allows positive integers
    const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === '') {
      // Update the state with the valid numeric value
      setPurchaseAdd({ ...purchaseAdd, billamount: inputValue, businesslocation: setngs?.businesslocation, totalamount:Number(Number(inputValue)+Number(purchaseAdd.expenseamount)+Number(purchaseAdd.freightamount))?.toFixed(2) });
    }
  };

  const handleFreightAmt = (e) => {
    // Regular expression to match only positive numeric values
    // const regex = /^[0-9]+$/;  // Only allows positive integers
    const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === '') {
      // Update the state with the valid numeric value
      setPurchaseAdd({ ...purchaseAdd, freightamount: inputValue, totalamount:Number(Number(purchaseAdd.billamount)+Number(purchaseAdd.expenseamount)+Number(inputValue))?.toFixed(2) });
    }
  };

  const handleExpenseAmt = (e) => {
    // Regular expression to match only positive numeric values
    // const regex = /^[0-9]+$/;  // Only allows positive integers
    const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === '') {
      // Update the state with the valid numeric value
      setPurchaseAdd({ ...purchaseAdd, expenseamount: inputValue, totalamount:Number(Number(purchaseAdd.billamount)+Number(inputValue)+Number(purchaseAdd.freightamount))?.toFixed(2) });
    }
  };

  const handlePayAmt = (e) => {
    // Regular expression to match only positive numeric values
    // const regex = /^[0-9]+$/;  // Only allows positive integers
    const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === '') {
      // Update the state with the valid numeric value
      setPurchaseAdd({ ...purchaseAdd, payamount: inputValue });
    }
  };

  const handleDiscount = (e) =>{

    //Regular expression to match only positive numeric values
    // const regex = /^[0-9]+$/;  // Only allows positive integers
    const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    //Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === '') {
        if(purchaseAdd.discounttypemode == "None"){
            setPurchaseAdd({ ...purchaseAdd, discountvaluemode:'0.00', discountamountmode:'0.00' });
        }
        else if(purchaseAdd.discounttypemode == "Fixed" || purchaseAdd.discounttypemode == "Amount"){
            let inputdata = inputValue;
            setPurchaseAdd({ ...purchaseAdd, discountvaluemode: inputValue, discountamountmode: Number(inputdata)?.toFixed(2) });
        }
        else if(purchaseAdd.discounttypemode == "Percentage"){
            let disamt = (Number(inputValue) / 100);

            setPurchaseAdd({ ...purchaseAdd, discountvaluemode: inputValue, discountamountmode: Number(disamt)?.toFixed(2) });
        }
    }
  }

  const handleChangeDiscountMode = (value) =>{
        if(value == "None"){
            setPurchaseAdd({ ...purchaseAdd, discounttypemode: value, discountvaluemode:'0.00', discountamountmode:'0.00' });
        }
        else if(value == "Fixed" || value == "Amount"){
            setPurchaseAdd({ ...purchaseAdd, discounttypemode: value, discountvaluemode: Number(purchaseAdd.discountvaluemode)?.toFixed(2), discountamountmode: Number(purchaseAdd.discountvaluemode)?.toFixed(2) });
        }
        else if(value == "Percentage"){
            let disamt = (Number(purchaseAdd.discountvaluemode) / 100);

            setPurchaseAdd({ ...purchaseAdd, discounttypemode: value, discountvaluemode: Number(purchaseAdd.discountvaluemode)?.toFixed(2), discountamountmode: Number(disamt)?.toFixed(2) });
        }
  }

    return (
        <Box>
            <Headtitle title={'Purchase Add'} />
            <form onSubmit={handleSubmit}>
                <Typography sx={userStyle.HeaderText}>Add Purchase</Typography>
                <Box sx={userStyle.container}>
                    <Grid container spacing={3} sx={userStyle.textInput}>
                        <Grid item md={3} sm={6} xs={12}>
                            <InputLabel >Supplier <b style={{ color: "red" }}> *</b></InputLabel>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIconTax}><PersonOutlineOutlinedIcon /></Grid>
                                <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                    <Selects
                                        options={suppliers}
                                        styles={colourStyles}
                                        onChange={(e) => {
                                            setPurchaseAdd({
                                                ...purchaseAdd, supplier: e.value, referenceno: purchases, suppliershrtname:e.suppshortname
                                            }); 
                                            searchAdd(e._id);
                                        }}
                                    />
                                </FormControl>
                                <Grid sx={userStyle.spanIcons} style={{ paddingRight: '5px' }}>
                                    <Purchasesupplieradd setIsSupplierFetch={setIsSupplierFetch} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Reference No</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    value={purchases}
                                    name="referenceno"
                                />
                            </FormControl>
                            <Typography variant='body2' sx={{ opacity: '0.9', marginTop: '5px' }}>Autogenerate</Typography>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Purchase Date</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={purchaseAdd.purchasedate}
                                    type="date"
                                    onChange={(e) => { setPurchaseAdd({ ...purchaseAdd, purchasedate: e.target.value }); }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Invoice No</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={purchaseAdd.invoiceno}
                                    type="text"
                                    onChange={(e) => { setPurchaseAdd({ ...purchaseAdd, invoiceno: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12}>
                            <InputLabel >Business Location</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Selects
                                    options={busilocations}
                                    styles={colourStyles}
                                    placeholder={isBusilocations ? isBusilocations.name : ""}
                                    onChange={(e) => { setPurchaseAdd({ ...purchaseAdd, businesslocation: e.value }); }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel>Bill Amount</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={purchaseAdd.billamount}
                                    sx={userStyle.input}
                                    inputProps={{
                                        style: { color: 'black' } // Replace 'red' with the color of your choice
                                      }}
                                    placeholder='0.00'
                                    type="number"
                                    onChange={(e) => { handleBillAmt(e); }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Purchase Tax</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Select
                                    value={purchaseAdd.purchasetaxmode}
                                    onChange={(e) => { setPurchaseAdd({ ...purchaseAdd, purchasetaxmode: e.target.value }) }}
                                    fullWidth
                                >
                                    <MenuItem value="None" >None</MenuItem>
                                    <MenuItem value="Exclusive" >Exclusive</MenuItem>
                                    <MenuItem value="Inclusive" >Inclusive</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Tax Slab</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Select
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 200
                                            },
                                        },
                                    }}
                                    value={purchaseAdd.purchasetaxlabmode}
                                    onChange={(e) => { setPurchaseAdd({ ...purchaseAdd, purchasetaxlabmode: e.target.value }); }}
                                    fullWidth
                                >
                                    <MenuItem value="None" onClick={(e) => handleChangeTaxvalue(0)}>None</MenuItem>
                                    {taxrates && (
                                        taxrates.map((row, index) => (
                                            <MenuItem value={row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate} key={index} onClick={(e) => handleChangeTaxvalue(row?.taxrate)}>{row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate}</MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Disc. type</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Select
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 200
                                            },
                                        },
                                    }}
                                    value={purchaseAdd.discounttypemode}
                                    onChange={(e) => { handleChangeDiscountMode(e.target.value) }}
                                    fullWidth
                                >
                                    <MenuItem value="None">None</MenuItem>
                                    <MenuItem value="Fixed">Fixed</MenuItem>
                                    <MenuItem value="Amount" >Amount</MenuItem>
                                    <MenuItem value="Percentage">Percentage</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Disc. value</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={purchaseAdd.discountvaluemode}
                                    type="number"
                                    onChange={(e) => { handleDiscount(e); }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Disc. Amt</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={purchaseAdd.discountamountmode}
                                />
                            </FormControl>
                        </Grid>
                        {files.length < 1 ? (
                            <Grid item md={2} sm={1} xs={12}>
                                <InputLabel >Upload Documents</InputLabel>
                                {!files.length > 0 && <> <Button variant="outlined" component="label" style={{ justifyContent: "center !important" }}>
                                    {!files.length > 0 && <div> <CloudUploadIcon sx={{ paddingTop: '5px' }} />
                                        {/* &ensp;<span style={{ paddingBottom: '14px' }}>Upload</span> */}
                                    </div>}
                                    <input hidden type="file" onChange={handleFileUpload} accept=" application/pdf, image/*" />
                                </Button>
                                </>}
                            </Grid>
                        ) :
                        (
                            <>
                                <br />
                                <Grid item md={2} sm={6} xs={12} sx={{ padding: '10px', justifyContent: "center" }}>
                                    <InputLabel >Upload Documents</InputLabel>
                                    {files &&
                                        (files.map((file, index) => (
                                            <>
                                                <Grid container sx={{ padding: '10px', }}>
                                                    <Grid item md={1.5} xs={11} sm={11}>
                                                        <Typography><a style={{ color: "#357ae8" }}
                                                            href={`data:application/octet-stream;base64,${file.data}`}
                                                            download={file.name}
                                                        >
                                                            {((file.name).split(".")[1] === "pdf") ? <FaFilePdf style={{ fontSize: "75px" }} /> :
                                                                ((file.name).split(".")[1] === "csv") ? <FaFileCsv style={{ fontSize: "75px" }} /> :
                                                                    ((file.name).split(".")[1] === "xlsx") ? <FaFileExcel style={{ fontSize: "75px" }} /> :
                                                                        ((file.name).split(".")[1] === "docx") ? <FaFileExcel style={{ fontSize: "75px" }} /> :
                                                                            <img src={`data:application/octet-stream;base64,${file.data}`} style={{ width: '80px', height: '80px' }} />}
                                                        </a></Typography>
                                                    </Grid>
                                                    <Grid item md={1} xs={1} sm={1} >
                                                        <Typography><Button onClick={() => handleFileDelete(index)} size="small" sx={{ marginLeft: "40px", marginTop: "-12px" }} ><DeleteIcon /></Button>  </Typography>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        )))}
                                </Grid>
                            </>
                        )}
                        <Grid item md={2} sm={6} xs={6}>
                            <InputLabel >Balance Amount:-</InputLabel>
                            <Typography value={purchaseAdd.balance}
                                style={{ color: 'red', fontSize: '20px' }}
                            > {balanceamt == NaN ? 0 : balanceamt}</Typography>
                        </Grid>
                        <Grid item md={2} sm={6} xs={6}>
                            <InputLabel >Tax Amount:-</InputLabel>
                            <Typography
                                style={{ color: 'red', fontSize: '20px' }}
                            >{ totalalltaxamt == NaN || totalalltaxamt == undefined ? 0 : Number(totalalltaxamt)?.toFixed(2)}</Typography>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Expense Amount</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={purchaseAdd.expenseamount}
                                    sx={userStyle.input}
                                    type="number"
                                    onChange={(e) => { handleExpenseAmt(e);}}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Freight Amount</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={purchaseAdd.freightamount}
                                    sx={userStyle.input}
                                    type="number"
                                    onChange={(e) => { handleFreightAmt(e); }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Total Amount</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={purchaseAdd.totalamount}
                                />
                            </FormControl>
                        </Grid>

                    </Grid><br />
                    <Grid container spacing={3}>
                        <Grid item md={6} sm={6} xs={12}>
                            <Typography variant='subtitle1'>
                                <b>Address:</b> <br />
                                {supplier.addressone == null || supplier.addressone == undefined ? "" : supplier.addressone + ","}
                                {supplier.addresstwo == null || supplier.addresstwo == undefined ? "" : " " + supplier.addresstwo + ","}
                                {supplier.country == null || supplier.country == undefined ? "" : " " + supplier.country + ","}
                                {supplier.state == null || supplier.state == undefined ? "" : " " + supplier.state + ","}
                                {supplier.city == null || supplier.city == undefined ? "" : " " + supplier.city + " " + "-"}
                                {supplier.pincode == null || supplier.pincode == undefined ? "" : " " + supplier.pincode + ","}<br />
                                {supplier.phoneone == null || supplier.phoneone == undefined ? "" : " " + "Ph" + " " + ": " + " " + +supplier.phoneone}
                                <br />
                            </Typography>
                        </Grid>
                    </Grid>
                </Box><br />
                <Box>
                    <Purchasetable setProductsList={setProductsList} productsList={productsList} allProductsList={allProductsList} setAllProductsList={setAllProductsList} purchaseAdd={purchaseAdd} setPurchaseAdd={setPurchaseAdd} taxRate={taxRate} taxrates={taxrates} />
                </Box>
                <br />
                <Box sx={userStyle.container}>
                    {/* purchasestatus section start */}
                    <Grid container>
                        <Grid item md={3} sm={6} xs={12}>
                            <InputLabel >Purchase Status</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Select
                                    value={purchaseAdd.purchasestatus}
                                    onChange={(e) => {
                                        setPurchaseAdd({ ...purchaseAdd, purchasestatus: e.target.value });
                                        purchaseStatusInput(e.target.value);
                                    }}
                                >
                                    <MenuItem value={purchaseStatusPending}>{purchaseStatusPending}</MenuItem>
                                    <MenuItem value={purchaseStatusReceived}>{purchaseStatusReceived}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid><br />
                    {/* purchase status section end */}
                    {purchaseAdd.purchasestatus == "Received" ?
                        (
                            <>
                                <Typography variant="h6" >Add payment</Typography>
                                <Grid container spacing={3} sx={userStyle.textInput}>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <Typography variant="body2" ><b>Advance Balance:</b> ₹ {purchaseAdd.advancebalance}</Typography>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <InputLabel htmlFor="component-outlined">Amount <b style={{ color: "red" }}> *</b></InputLabel>
                                        <Grid sx={{ display: 'flex' }}  >
                                            <Grid sx={userStyle.spanIconTax}><MoneyOutlinedIcon style={{ fontSize: 'large' }} /></Grid>
                                            <FormControl size="small" fullWidth >
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    value={purchaseAdd.payamount}
                                                    sx={userStyle.input}
                                                    onChange={(e) => {
                                                        handlePayAmt(e);
                                                    }}
                                                    type='number'
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12} >
                                        <InputLabel htmlFor="component-outlined">Paid Date:<b style={{ color: "red" }}> *</b></InputLabel>
                                        <Grid sx={{ display: 'flex' }}  >
                                            <FormControl size="small" fullWidth >
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DateTimePicker
                                                        renderInput={(props) => <TextField {...props} />}
                                                        value={paidDateTime}
                                                        onChange={(newValue) => {
                                                            setPaidDateTime(newValue);
                                                        }}
                                                    />
                                                </LocalizationProvider>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <InputLabel >Payment Method</InputLabel>
                                        <FormControl size="small" fullWidth>
                                            <Select


                                                value={purchaseAdd.paymentmethod}
                                                onChange={(e) => {
                                                    setPurchaseAdd({ ...purchaseAdd, paymentmethod: e.target.value });
                                                }}
                                            >
                                                <MenuItem value="None">None</MenuItem>
                                                <MenuItem value="Cash">Cash</MenuItem>
                                                <MenuItem value="Credit Card">Credit Card</MenuItem>
                                                <MenuItem value="UPI">UPI</MenuItem>
                                                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                                                <MenuItem value="Net Banking">Net Banking</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <InputLabel id="demo-select-small" sx={{ m: 1 }}>Payment Note</InputLabel>
                                        <FormControl size="small" fullWidth >
                                            <TextareaAutosize aria-label="minimum height" minRows={3} style={{ border: '1px solid #4a7bf7' }}
                                                value={purchaseAdd.additionalnotes}
                                                onChange={(e) => { setPurchaseAdd({ ...purchaseAdd, additionalnotes: e.target.value, }) }}
                                            />
                                        </FormControl><br /><br />
                                        <hr />
                                    </Grid>
                                    <Grid container style={{ justifyContent: "right", }} sx={userStyle.textInput}>
                                        <Grid>
                                            <Typography variant='subtitle1'
                                                value={purchaseAdd.paydue}
                                            ><b>Payment due:</b> ₹ {purchaseAdd.paydue}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </>
                        ) : null
                    }
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid sx={{ display: 'flex' }}>
                            <Button sx={userStyle.buttonadd} type="submit">SAVE</Button>
                            <Link to="/purchase/purchase/list"><Button sx={userStyle.buttoncancel} type="button">CANCEL</Button></Link>
                        </Grid>
                    </Grid>
                    <br />
                </Box>
            </form>

            {/* Alert Modal */}
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

            {/* Quantity Modal */}
            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isQuantityOpen}
                    onClose={handleQuantityClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" sx={{backgroundColor:'green'}} onClick={(e)=>{setIsQuantity(true);handleQuantityClose();}}>OK</Button>
                        <Button variant="contained" color="error" onClick={(e)=>{setIsQuantity(false);handleQuantityClose();}}>CANCEL</Button>
                    </DialogActions>
                </Dialog>
            </Box>
                    {/* Save before Model */}
            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isStoreOpen}
                    onClose={handleStoreClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '600px', textAlign: 'center', alignItems: 'center' }}>
                        <Typography variant='h6' ><b>Total GST:</b>{totalalltaxamt == NaN || totalalltaxamt == undefined ? '0.00' : Number(totalalltaxamt)?.toFixed(2)}</Typography>
                        <Typography variant='h6' ><b>Frieght Amt:</b>{Number(purchaseAdd.freightamount)?.toFixed(2)} <b>Expense Amt:</b>{Number(purchaseAdd.expenseamount)?.toFixed(2)}</Typography>
                        <Typography variant='h6' ><b>Added Amt:</b>{totalvalue == NaN || totalvalue == undefined ? '0.00' : Number(totalvalue)?.toFixed(2)} <b>Round off Amt:</b>{totalvalue == NaN || totalvalue == undefined ? 0 : Number(totalvalue)?.toFixed(0)}</Typography>
                        <Typography variant='h6' ><b>Balance Amt:</b>{Number(balanceamt)?.toFixed(2)}</Typography>
                        <Typography variant='h6' ><b >Status:<p style={{color:'red'}}>{purchaseAdd.purchasestatus == "Received" ? "Completed" : purchaseAdd.purchasestatus}</p></b></Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" sx={{backgroundColor:'green'}} onClick={()=>{addPurchase();handleStoreClose();}}>OK</Button>
                        {/* <Button variant="contained" color="error" onClick={handleStoreClose}>CANCEL</Button> */}
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}

const Purchasecreate = () => {
    return (
        <>
            <Box>
                <Navbar /><br /><br /><br /><br />
                <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                    <Box component="main" className='content'>
                        <Purchasecreatelist /><br /><br />
                        <Footer />
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default Purchasecreate;