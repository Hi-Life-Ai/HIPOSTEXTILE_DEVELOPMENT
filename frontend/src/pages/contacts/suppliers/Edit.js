import React, { useState, useEffect, useContext } from 'react';
import { Button, Grid, Typography, Box, FormControl,TextareaAutosize,FormGroup,Checkbox,FormControlLabel,OutlinedInput,InputLabel, MenuItem, Table, TableBody, TableContainer, TableHead, Paper, Dialog, DialogContent, DialogActions } from '@mui/material';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import EmailIconOutlined from '@mui/icons-material/EmailOutlined';
import LocationOnIconOutlined from '@mui/icons-material/LocationOnOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { userStyle, colourStyles } from '../../PageStyle';
import axios from 'axios';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';
import { AuthContext } from '../../../context/Appcontext';
import { SERVICE } from '../../../services/Baseservice';
import { Country, State, City } from "country-state-city";
import Select from 'react-select';

function Suppliereditlist() {

    const { auth, setngs } = useContext(AuthContext);
    const [suppliers, setSuppliers] = useState([]);

    const [supplier, setSupplier] = useState({
        autogenerate: "", suppliername: "", addressone: "", addresstwo: "", country: "", state: "",
        city: "", pincode: "", supplieremail: "", gstn: "", phoneone: "", phonetwo: "", phonethree: "", phonecheck: false,
        phonefour: "", landline: "", whatsapp: "", contactperson: "", creditdays: "", suppshortname: ""
    });

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [overallsupplier, setOverAlSupllier] = useState("")
    const [getSupplier, setGetSupplier] = useState("")
    const [editSupCount, setEditSupCount] = useState(0)
    const[todos , setTodos] = useState([])
    const[bankname , setbankname] = useState("Please Select Bank Name")
const[branchname , setbranchname] = useState("")
const[ifsccode , setifsccode] = useState("")
const[accntno , setaccntno] = useState("")
const[accholname , setaccholname] = useState("")
const[banknameEdit , setbanknameEdit] = useState("")
const[branchnameEdit , setbranchnameEdit] = useState("")
const[ifsccodeEdit , setifsccodeEdit] = useState("")
const[accntnoEdit , setaccntnoEdit] = useState("")
const[accholnameEdit , setaccholnameEdit] = useState("")
const [sorting, setSorting] = useState({ column: '', direction: '' });

    // Error Popup model
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => { setIsErrorOpenpop(true); };
    const handleCloseerrpop = () => { setIsErrorOpenpop(false); };
    const[getTodoEdit , setGetTodoEdit] = useState({branchname : "" , bankname : "" , ifsccode : "", accno : "", accholdername : ""  })
const[getEditIndex , setGetEditIndex] = useState("")

    // Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

        // Edit model
        const [isEditOpen, setIsEditOpen] = useState(false);
        const handleClickOpenEdit = () => {
            setIsEditOpen(true);
        };
        const handleCloseModEdit = (e, reason) => {
            if (reason && reason === "backdropClick")
                return;
            setIsEditOpen(false);
        };
    
    // Phone number length
    const handlePincode = (e) => {
        if (e.length > 6) {
            setShowAlert("Pincode can't have more than 6 characters!")
            handleClickOpen();
            let num = e.slice(0, 6);
            setSupplier({ ...supplier, pincode: num })
        }
    }

    const handlePhoneone = (e) => {
        if (e.length > 10) {
            setShowAlert("Phone number can't more than 10 characters!")
            handleClickOpen();
            let num = e.slice(0, 10);
            setSupplier({ ...supplier, phoneone: num })
        }
    }
    const handlePhonetwo = (e) => {
        if (e.length > 10) {
            setShowAlert("Phone number can't more than 10 characters!")
            handleClickOpen();
            let num = e.slice(0, 10);
            setSupplier({ ...supplier, phonetwo: num })
        }
    }
    const handlePhonethree = (e) => {
        if (e.length > 10) {
            setShowAlert("Phone number can't more than 10 characters!")
            handleClickOpen();
            let num = e.slice(0, 10);
            setSupplier({ ...supplier, phonethree: num })
        }
    }

    const handleShortname = (e) => {
        let codeslicespace = e.replace(/[^a-zA-Z0-9]/g, '');
        if (codeslicespace.length > 4) {
            setShowAlert("ShortName can't more than 4 characters!")
            handleClickOpen();
            let num = codeslicespace.slice(0, 4);
            setSupplier({ ...supplier, suppshortname: num.toUpperCase() })
        }
    }

    const handlePhonefour = (e) => {
        if (e.length > 10) {
            setShowAlert("Phone number can't more than 10 characters!")
            handleClickOpen();
            let num = e.slice(0, 10);
            setSupplier({ ...supplier, phonefour: num })
        }
    }
    const handleWhatsapp = (e) => {
        if (e.length > 10) {
            setShowAlert("Whatsapp number can't more than 10 characters!")
            handleClickOpen();
            let num = e.slice(0, 10);
            setSupplier({ ...supplier, whatsapp: num })
        }
    }
    const handleGstn = (e) => {
        if (e.length > 15) {
            setShowAlert("GSTN number can't more than 15 characters!")
            handleClickOpen();
            let num = e.slice(0, 15);
            setSupplier({ ...supplier, gstn: num })
        }
    }

    const handleValidationSName = (e) => {
        let codeslicespace = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
        let resultshotname = codeslicespace.slice(0, 4).toUpperCase();

        setSupplier({ ...supplier, suppliername: e.target.value, suppshortname: resultshotname })

    }

    const handleValidationLandline = (e) => {
        let val = e.target.value;
        let numbers = new RegExp('[a-z]');
        var regex = /[`!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/;
        if (e.target.value.match(numbers)) {
            setShowAlert("Please enter number only! (0-9)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setSupplier({ ...supplier, landline: value })
        }
        else if (regex.test(e.target.value)) {
            setShowAlert("Please enter number only! (0-9)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setSupplier({ ...supplier, landline: value })
        }
    }

    const id = useParams().id

    // Fetch supplier by id
    const fetchHandler = async () => {
        try {
            let response = await axios.get(`${SERVICE.SUPPLIER_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            const savedSupplier = response?.data?.ssupplier;

            // Find the corresponding Country, State, and City objects
            const country = Country.getAllCountries().find(country => country.name === savedSupplier.country);
            const state = State.getStatesOfCountry(country?.isoCode).find(state => state.name === savedSupplier.state);
            const city = City.getCitiesOfState(state?.countryCode, state?.isoCode).find(city => city.name === savedSupplier.city);

            setSelectedCountry(country);
            setSelectedState(state);
            setSelectedCity(city);
            setSupplier(savedSupplier);
            setTodos(response?.data?.ssupplier?.bankdetails)
            getEditId(response?.data?.ssupplier?.suppliername)
            setGetSupplier(response?.data?.ssupplier?.suppliername)
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!");
            }
        }
    };

    const accounttypes = [
        { value: "ALLAHABAD BANK", label: "ALLAHABAD BANK" },
        { value: "ANDHRA BANK", label: "ANDHRA BANK" },
        { value: "AXIS BANK", label: "AXIS BANK" },
        { value: "STATE BANK OF INDIA", label: "STATE BANK OF INDIA" },
        { value: "BANK OF BARODA", label: "BANK OF BARODA" },
        { value: "CITY UNION BANK", label: "CITY UNION BANK" },
        { value: "UCO BANK", label: "UCO BANK" },
        { value: "UNION BANK OF INDIA", label: "UNION BANK OF INDIA" },
        { value: "BANK OF INDIA", label: "BANK OF INDIA" },
        { value: "BANDHAN BANK LIMITED", label: "BANDHAN BANK LIMITED" },
        { value: "CANARA BANK", label: "CANARA BANK" },
        { value: "GRAMIN VIKASH BANK", label: "GRAMIN VIKASH BANK" },
        { value: "CORPORATION BANK", label: "CORPORATION BANK" },
        { value: "INDIAN BANK", label: "INDIAN BANK" },
        { value: "INDIAN OVERSEAS BANK", label: "INDIAN OVERSEAS BANK" },
        { value: "ORIENTAL BANK OF COMMERCE", label: "ORIENTAL BANK OF COMMERCE" },
        { value: "PUNJAB AND SIND BANK", label: "PUNJAB AND SIND BANK" },
        { value: "PUNJAB NATIONAL BANK", label: "PUNJAB NATIONAL BANK" },
        { value: "RESERVE BANK OF INDIA", label: "RESERVE BANK OF INDIA" },
        { value: "SOUTH INDIAN BANK", label: "SOUTH INDIAN BANK" },
        { value: "UNITED BANK OF INDIA", label: "UNITED BANK OF INDIA" },
        { value: "CENTRAL BANK OF INDIA", label: "CENTRAL BANK OF INDIA" },
        { value: "VIJAYA BANK", label: "VIJAYA BANK" },
        { value: "DENA BANK", label: "DENA BANK" },
        { value: "BHARATIYA MAHILA BANK LIMITED", label: "BHARATIYA MAHILA BANK LIMITED" },
        { value: "FEDERAL BANK LTD", label: "FEDERAL BANK LTD" },
        { value: "HDFC BANK LTD", label: "HDFC BANK LTD" },
        { value: "ICICI BANK LTD", label: "ICICI BANK LTD" },
        { value: "IDBI BANK LTD", label: "IDBI BANK LTD" },
        { value: "PAYTM BANK", label: "PAYTM BANK" },
        { value: "FINO PAYMENT BANK", label: "FINO PAYMENT BANK" },
        { value: "INDUSIND BANK LTD", label: "INDUSIND BANK LTD" },
        { value: "KARNATAKA BANK LTD", label: "KARNATAKA BANK LTD" },
        { value: "KOTAK MAHINDRA BANK", label: "KOTAK MAHINDRA BANK" },
        { value: "YES BANK LTD", label: "YES BANK LTD" },
        { value: "SYNDICATE BANK", label: "SYNDICATE BANK" },
        { value: "BANK OF MAHARASHTRA", label: "BANK OF MAHARASHTRA" },
        { value: "DCB BANK", label: "DCB BANK" },
        { value: "IDFC BANK", label: "IDFC BANK" },
        { value: "JAMMU AND KASHMIR BANK BANK", label: "JAMMU AND KASHMIR BANK BANK" },
        { value: "KARUR VYSYA BANK", label: "KARUR VYSYA BANK" },
        { value: "RBL BANK", label: "RBL BANK" },
        { value: "DHANLAXMI BANK", label: "DHANLAXMI BANK" },
        { value: "CSB BANK", label: "CSB BANK" }
    
    ];

    useEffect(() => {
        fetchHandler()
    }, [id]);

    // Suppliers
    const fetchSuppliers = async () => {
        try {
            let res = await axios.post(SERVICE.SUPPLIER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setSuppliers(res?.data?.suppliers?.filter(item => item._id !== supplier._id));
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
        fetchSuppliers()
    }, [suppliers, supplier]);

    const getEditId = async (value) => {

        try {
            let res = await axios.post(SERVICE.EDIT_SUPPLIER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                assignbusinessid: String(setngs.businessid),
                suppliername: String(value)
            });
            setEditSupCount(res.data.suppliername.length)
            setOverAlSupllier(`The ${value} is linked in ${res.data.suppliername.length > 0 ? "Purchase ," : ""} whether you want to do changes ..??`)
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };
    // page refersh reload code
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

    const getOverAlldepUpdate = async () => {
        try {
            let res = await axios.post(SERVICE.EDIT_SUPPLIER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                assignbusinessid: String(setngs.businessid),
                suppliername: getSupplier

            });
            editOveAllDepartment(res.data.suppliername)
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

    const editOveAllDepartment = async (suppliers) => {
        try {
            if (suppliers.length > 0) {
                let result2 = suppliers.map((data, index) => {

                    const updatedTodos = data.products.map(todo => {
                        if (todo.supplier === getSupplier
                        ) {
                            return { ...todo, supplier: supplier.suppliername, suppliershortname: supplier.suppshortname };
                        }
                    });
                    let request = axios.put(`${SERVICE.PURCHASE_SINGLE}/${data._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        supplier: String(supplier.suppliername),
                        suppliershortname: String(supplier.suppshortname),
                        products: updatedTodos
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

    const bactToPage = useNavigate();

    const updateSupplier = async () => {
        let codeslicespace = supplier.suppliername.replace(/[^a-zA-Z0-9]/g, '');
        let resultshotname = codeslicespace.slice(0, 4).toUpperCase();
        try {
            let req = await axios.put(`${SERVICE.SUPPLIER_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                autogenerate: String(supplier.autogenerate),
                suppliername: String(supplier.suppliername),
                addressone: String(supplier.addressone),
                addresstwo: String(supplier.addresstwo),
                country: String(supplier.country),
                state: String(supplier.state),
                city: String(supplier.city),
                pincode: Number(supplier.pincode),
                supplieremail: String(supplier.supplieremail),
                gstn: String(supplier.gstn),
                phoneone: Number(supplier.phoneone),
                phonetwo: Number(supplier.phonetwo),
                phonethree: Number(supplier.phonethree),
                phonefour: Number(supplier.phonefour),
                landline: String(supplier.landline),
                whatsapp: Number(supplier.whatsapp),
                contactperson: String(supplier.contactperson),
                creditdays: Number(supplier.creditdays),
                suppshortname: String(supplier.suppshortname == "" || supplier.suppshortname == undefined ? resultshotname : supplier.suppshortname),
                bankdetails:[...todos]
            });
            setSupplier(req.data)
            await getOverAlldepUpdate();
            toast.success(req.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            bactToPage('/contact/supplier/list');
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = suppliers.some(item => item.suppliername.toLowerCase() === supplier.suppliername.toLowerCase());

        if (supplier.suppliername == "") {
            setShowAlert("Please enter supplier name!")
            handleClickOpen();
        }
        // else if (supplier.pincode != "" && supplier.pincode.length != 6) {
        //     setShowAlert("Please enter pincode can't more than 6 characters!")
        //     handleClickOpen();
        // }
        else if (supplier.gstn != "" && supplier.gstn.length != 15) {
            setShowAlert("Please enter GSTN No can't more than 15 characters!")
            handleClickOpen();
        }
        else if (supplier.phoneone == "") {
            setShowAlert("Please enter Phone No!")
            handleClickOpen();
        }
        // else if (supplier.phoneone.length != 10) {
        //     setShowAlert("Please enter Phone No 1 can't more than 10 characters!")
        //     handleClickOpen();
        // }
        // else if (supplier.phonetwo != "" || 0 && supplier.phonetwo.length != 10) {
        //     setShowAlert("Please enter Phone No 2 can't more than 10 characters!")
        //     handleClickOpen();
        // }
        // else if (supplier.phonethree != "" || 0 && supplier.phonethree.length != 10) {
        //     setShowAlert("Please enter Phone No 3 can't more than 10 characters!")
        //     handleClickOpen();
        // }
        // else if (supplier.phonefour != ""|| 0  && supplier.phonefour.length != 10) {
        //     setShowAlert("Please enter Phone No 4 can't more than 10 characters!")
        //     handleClickOpen();
        // }
        else if (supplier.whatsapp == "") {
            setShowAlert("Please enter Whatsapp No!")
            handleClickOpen();
        }
        // else if (supplier.whatsapp.length != 10) {
        //     setShowAlert("Please enter Whatsapp No can't more than 10 characters!")
        //     handleClickOpen();
        // }
        else if (isNameMatch) {
            setShowAlertpop(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Name already exits!"}
                    </p>
                </>
            );
            handleClickOpenerrpop();
        }
        else if (supplier.suppliername != getSupplier && editSupCount > 0) {
            setShowAlertpop(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {overallsupplier}
                    </p>
                </>
            )
            handleClickOpenerrpop();
        }
        else {
            updateSupplier();
        }
    }





// Sorting
const handleSorting = (column) => {
    const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
    setSorting({ column, direction });
};

// create todo list
   const handleAddInput = () => {
    if( branchname != "" && branchname != "" && ifsccode != "" && accntno > 0 && accholname != ""){
 
     if (
         !todos.find(
             (todo, index) =>
                  Number(todo.accno) ===  Number(accntno))
     ){
 
         const newTodocheck = {
             branchname :branchname || "",
             bankname : bankname||"",
             ifsccode : ifsccode||"",
             accno : accntno || "",
             accholdername : accholname || ""
         };
         setTodos([...todos, newTodocheck]);
         setbankname("Please Select Bank Name");
     setbranchname("");
     setifsccode("");
     setaccntno("");
     setaccholname("");
     }
     else {
         const newTodoscheck = [...todos];
         alert("account name already exits")
         setTodos(newTodoscheck);
       
     
     }
     
    }
    else {
     setShowAlert("please enter all Bank  details")
     handleClickOpen(); 
 }
     
    
 
 
     };
 
     const handleDeleteTodocheck = (index) => {
         const newTodoscheck = [...todos];
         newTodoscheck.splice(index, 1);
         setTodos(newTodoscheck);
     };
 
 
     const getTodoCode =(ind) =>{
         setbanknameEdit(todos[ind].bankname)
         setbranchnameEdit(todos[ind].branchname)
         setifsccodeEdit(todos[ind].ifsccode)
         setaccntnoEdit(todos[ind].accno)
         setaccholnameEdit(todos[ind].accholdername)
     }
 
     const handleUpdateTodocheck = () => {
         const branchname = branchnameEdit ;
         const bankname = banknameEdit;
         const ifsccode = ifsccodeEdit;
         const accno = accntnoEdit ;
         const accholdername = accholnameEdit;
        //  console.log(branchname != "" ,bankname != ""  , ifsccodeEdit !=="" , accno > 0 , accholdername != ""  , 'bsdhbshfbhsdbhfbsdf')
         if (branchname != "" && bankname != "" &&  ifsccode !="" && accno  && accholdername != ""){
             if (
                 !todos.find(
                     (todo, index) =>
                         index !== getEditIndex && Number(todo.accno) ===  Number(accntnoEdit))
             ) {
                 const newTodoscheck = [...todos];
                 newTodoscheck[getEditIndex].branchname = branchname;
                 newTodoscheck[getEditIndex].bankname = bankname;
                 newTodoscheck[getEditIndex].ifsccode = ifsccode;
                 newTodoscheck[getEditIndex].accno = accno;
                 newTodoscheck[getEditIndex].accholdername = accholdername;
     
                 setTodos(newTodoscheck);
                 setGetEditIndex(-1);
                 setbanknameEdit("")
                 setbranchnameEdit("")
                 setifsccodeEdit("")
                 setaccntnoEdit("")
                 setaccholnameEdit("")
                 handleCloseModEdit();
         }
          
         else {
             const newTodoscheck = [...todos];
             alert("account name already exits")
             setTodos(newTodoscheck);
           
         
         }
         }
         else {
             setShowAlert("please enter all details")
             handleClickOpen(); 
         }
         
 
     
 }

 const renderSortingIcon = (column) => {
    if (sorting.column !== column) {
        return <>
            <Box sx={{ color: '#bbb6b6' }}>
                <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                    <ArrowDropUpOutlinedIcon />
                </Grid>
                <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                    <ArrowDropDownOutlinedIcon />
                </Grid>
            </Box>
        </>;
    } else if (sorting.direction === 'asc') {
        return <>
            <Box >
                <Grid sx={{ height: '6px' }}>
                    <ArrowDropUpOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                </Grid>
                <Grid sx={{ height: '6px' }}>
                    <ArrowDropDownOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                </Grid>
            </Box>
        </>;
    } else {
        return <>
            <Box >
                <Grid sx={{ height: '6px' }}>
                    <ArrowDropUpOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                </Grid>
                <Grid sx={{ height: '6px' }}>
                    <ArrowDropDownOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                </Grid>
            </Box>
        </>;
    }
};

    return (
        <Box>
            <Headtitle title={'Supplier Edit'} />
            <Typography sx={userStyle.HeaderText}>Edit Supplier</Typography>
            <Box sx={userStyle.container}>
                <form onSubmit={handleEditSubmit}>
                    <Grid container spacing={3}>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='h6' sx={{ justifyContent: 'center' }}>Supplier Details</Typography>
                        </Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='h6'>Fields</Typography>
                        </Grid>
                        <Grid item md={8} sm={6} xs={12}></Grid>

                        <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>1.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='h6'>Supplier Code</Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Auto Generate</InputLabel>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIcons}><ContactPageOutlinedIcon /></Grid>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        id="component-outlined"
                                        value={supplier.autogenerate}
                                        type="text"
                                        name="autogenerate"
                                        readOnly
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>2.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='h6' sx={{ display: "flex" }}>Supplier Name <Typography style={{ color: "red" }}>*</Typography></Typography>
                        </Grid>
                        <Grid item md={3} sm={3} xs={12}>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIcons}><PersonOutlineOutlinedIcon /></Grid>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        id="component-outlined"
                                        value={supplier.suppliername}
                                        onChange={(e) => { handleValidationSName(e) }}
                                        type="text"
                                        name="suppliername"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={3} sm={3} xs={12}>
                            <FormControl size="small" fullWidth>
                                <InputLabel>Supplier Shortname</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={supplier.suppshortname}
                                    onChange={(e) => { setSupplier({ ...supplier, suppshortname: e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() }); handleShortname(e.target.value) }}
                                    type="text"
                                    name="suppliershortname"
                                    label="suppliershortname"
                                />
                            </FormControl>                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>3.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='h6'>Address1</Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <FormControl size="small" fullWidth >
                                <TextareaAutosize aria-label="minimum height" minRows={3} style={{ border: '1px solid #4a7bf7' }}
                                    value={supplier.addressone}
                                    onChange={(e) => { setSupplier({ ...supplier, addressone: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>4.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='h6'>Address2</Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <FormControl size="small" fullWidth >
                                <TextareaAutosize aria-label="minimum height" minRows={3} style={{ border: '1px solid #4a7bf7' }}
                                    value={supplier.addresstwo}
                                    onChange={(e) => { setSupplier({ ...supplier, addresstwo: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>5.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='h6'>Country</Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <Grid sx={{ display: 'flex' }}>
                                <Grid sx={userStyle.spanIcons}><LanguageOutlinedIcon /></Grid>
                                <FormControl size="small" fullWidth>
                                    <Select
                                        options={Country.getAllCountries()}
                                        getOptionLabel={(options) => options["name"]}
                                        getOptionValue={(options) => options["name"]}
                                        value={selectedCountry}
                                        styles={colourStyles}
                                        onChange={(item) => {
                                            setSelectedCountry(item);
                                            // Update supplier's country property
                                            setSupplier((prevSupplier) => ({
                                                ...prevSupplier,
                                                country: item?.name || "",
                                            }));
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>6.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='h6'>State</Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <Grid sx={{ display: 'flex' }}>
                                <Grid sx={userStyle.spanIcons}><LocationOnIconOutlined /></Grid>
                                <FormControl size="small" fullWidth>
                                    <Select
                                        options={State?.getStatesOfCountry(selectedCountry?.isoCode)}
                                        getOptionLabel={(options) => options["name"]}
                                        getOptionValue={(options) => options["name"]}
                                        value={selectedState}
                                        styles={colourStyles}
                                        onChange={(item) => {
                                            setSelectedState(item);
                                            // Update supplier's state property
                                            setSupplier((prevSupplier) => ({
                                                ...prevSupplier,
                                                state: item?.name || "",
                                            }));
                                        }}
                                    />
                                </FormControl>

                            </Grid>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>7.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='h6'>City</Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIcons}><LocationOnIconOutlined /></Grid>
                                <FormControl size="small" fullWidth>
                                    <Select
                                        options={City.getCitiesOfState(
                                            selectedState?.countryCode,
                                            selectedState?.isoCode
                                        )}
                                        getOptionLabel={(options) => options["name"]}
                                        getOptionValue={(options) => options["name"]}
                                        value={selectedCity}
                                        styles={colourStyles}
                                        onChange={(item) => {
                                            setSelectedCity(item);
                                            // Update supplier's city property
                                            setSupplier((prevSupplier) => ({
                                                ...prevSupplier,
                                                city: item?.name || "",
                                            }));
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>8.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='h6'>Pincode</Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIcons}><LocationOnIconOutlined /></Grid>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        sx={userStyle.input}
                                        id="component-outlined"
                                        value={supplier.pincode}
                                        onChange={(e) => {
                                            setSupplier({ ...supplier, pincode: e.target.value });
                                            handlePincode(e.target.value)
                                        }}
                                        type="number"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>9.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='h6'>Email</Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIcons}><EmailIconOutlined /></Grid>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        id="component-outlined"
                                        value={supplier.supplieremail}
                                        onChange={(e) => { setSupplier({ ...supplier, supplieremail: e.target.value }) }}
                                        type="email"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>10.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='h6'>GSTN</Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    id="component-outlined"
                                    value={supplier.gstn}
                                    onChange={(e) => { setSupplier({ ...supplier, gstn: e.target.value }); handleGstn(e.target.value) }}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>11.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='h6' sx={{ display: "flex" }}>Phone <Typography style={{ color: "red" }}>*</Typography></Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <Grid container spacing={1}>
                                <Grid item md={6} sm={6} xs={12}>
                                    <InputLabel htmlFor="component-outlined">Phone1</InputLabel>
                                    <FormControl size="small" fullWidth>
                                        <OutlinedInput
                                            sx={userStyle.input}
                                            id="component-outlined"
                                            value={supplier.phoneone}
                                            onChange={(e) => { setSupplier({ ...supplier, phoneone: e.target.value }); handlePhoneone(e.target.value) }}
                                            type="number"
                                        />
                                    </FormControl>
                                    {/* <Grid>
                                        <FormGroup>
                                            <FormControlLabel control={<Checkbox checked={Boolean(supplier.phonecheck)} onChange={(e) => setSupplier({ ...supplier, phonecheck: !supplier.phonecheck })} />} label="Same as whatsapp number" />
                                        </FormGroup>
                                    </Grid> */}
                                </Grid>
                                <Grid item md={6} sm={6} xs={12}>
                                    <InputLabel htmlFor="component-outlined">Phone2</InputLabel>
                                    <FormControl size="small" fullWidth>
                                        <OutlinedInput
                                            sx={userStyle.input}
                                            id="component-outlined"
                                            value={supplier.phonetwo}
                                            onChange={(e) => { setSupplier({ ...supplier, phonetwo: e.target.value }); handlePhonetwo(e.target.value) }}
                                            type="number"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} sm={6} xs={12}>
                                    <InputLabel htmlFor="component-outlined">Phone3</InputLabel>
                                    <FormControl size="small" fullWidth>
                                        <OutlinedInput
                                            sx={userStyle.input}
                                            id="component-outlined"
                                            value={supplier.phonethree}
                                            onChange={(e) => { setSupplier({ ...supplier, phonethree: e.target.value }); handlePhonethree(e.target.value) }}
                                            type="number"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} sm={6} xs={12}>
                                    <InputLabel htmlFor="component-outlined">Phone4</InputLabel>
                                    <FormControl size="small" fullWidth>
                                        <OutlinedInput
                                            sx={userStyle.input}
                                            id="component-outlined"
                                            value={supplier.phonefour}
                                            onChange={(e) => { setSupplier({ ...supplier, phonefour: e.target.value }); handlePhonefour(e.target.value) }}
                                            type="number"
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>12.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='h6'>Landline</Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    id="component-outlined"
                                    value={supplier.landline}
                                    onChange={(e) => { setSupplier({ ...supplier, landline: e.target.value }); handleValidationLandline(e); }}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>13.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='h6' sx={{ display: "flex" }}>Whatsapp <Typography style={{ color: "red" }}>*</Typography></Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    id="component-outlined"
                                    value={supplier.whatsapp}
                                    onChange={(e) => { setSupplier({ ...supplier, whatsapp: e.target.value }); handleWhatsapp(e.target.value) }}
                                    type="number"
                                />
                            </FormControl>

                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>14.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='h6'>Contact Person</Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={supplier.contactperson}
                                    onChange={(e) => { setSupplier({ ...supplier, contactperson: e.target.value }) }}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>15.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='h6'>Credit Days</Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    id="component-outlined"
                                    value={supplier.creditdays}
                                    onChange={(e) => { setSupplier({ ...supplier, creditdays: e.target.value }) }}
                                    type="number"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid item md={2} sm={3} xs={12}><Typography variant='h6' sx={{ marginLeft: '50px' }}>16.</Typography></Grid>
                        <Grid item md={2} sm={3} xs={12}>
                            <Typography variant='h6'>Bank Details</Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <Grid container spacing={2}>
                                <Grid item md={4} sm={6} xs={6}>
                                    <InputLabel htmlFor="component-outlined" sx={{ display: "flex" }}>Bank Name</InputLabel>
                                    <FormControl size="small" fullWidth >
                                    <Select
                                        options={accounttypes}
                                        id="addCustGroupName"
                                        value={{label:bankname, value:bankname}}
                                        placeholder='Please Select Bank Name'
                                        styles={colourStyles}
                                        onChange={(e)=>{
                                            setbankname(e.value)
                                        }}
                                        
                                    />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sm={6} xs={6}>
                                    <InputLabel htmlFor="component-outlined" sx={{ display: "flex" }}>Branch Name</InputLabel>
                                    <FormControl size="small" fullWidth >
                                        <OutlinedInput
                                            id="addCustGroupName"
                                            placeholder="Branch Name"
                                            type="text"
                                            value={branchname}
                                            onChange={(e)=>{
                                                setbranchname(e.target.value)
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sm={6} xs={6}>
                                    <InputLabel htmlFor="component-outlined" sx={{ display: "flex" }}>IFSC Code</InputLabel>
                                    <FormControl size="small" fullWidth >
                                        <OutlinedInput
                                            id="addCustGroupName"
                                            placeholder="Ifsc code"
                                            type="text"
                                            value={ifsccode}
                                            onChange={(e)=>{
                                                setifsccode(e.target.value)
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sm={6} xs={6}>
                                    <InputLabel htmlFor="component-outlined" sx={{ display: "flex" }}>Accout Number</InputLabel>
                                    <FormControl size="small" fullWidth >
                                        <OutlinedInput
                                            sx={userStyle.input}
                                            id="component-outlined"
                                            placeholder="Account Number"
                                            type="number"
                                            value={accntno}
                                            onChange={(e)=>{
                                                setaccntno(Number(e.target.value));
                                                // handleValidationAccNum(e.target.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sm={6} xs={6}>
                                    <InputLabel htmlFor="component-outlined" sx={{ display: "flex" }}>Account Holder Name</InputLabel>
                                    <FormControl size="small" fullWidth >
                                        <OutlinedInput
                                            id="addCustGroupName"
                                            placeholder="Accout Holder Name"
                                            type="text"
                                            value={accholname}
                                            onChange={(e)=>{
                                                setaccholname(e.target.value)
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item sm={1} xs={1} md={1.5} lg={1.5} sx={{ display: 'flex' }}>
                                   {  branchname != "" && branchname != "" && ifsccode != "" && accntno > 0 && accholname != "" ? <Button variant="contained" color="success" type="button" sx={userStyle.categoryadd} onClick={handleAddInput}><FaPlus /></Button> : ""}
                                    {/* <Button variant="contained" color="error" type="button" onClick={deleteFirstSubcate} sx={userStyle.categoryadd}><AiOutlineClose /></Button> */}
                                </Grid>
                            </Grid>
                        </Grid><br/><br/>

                        <Grid  item md={12} sm={6} xs={12} sx={{ justifyContent: "center" ,display:"flex"}}>
                                <TableContainer component={Paper} sx={userStyle.tablecontainer}>
                                    <Table sx={{ minWidth: 700 }} aria-label="customized table" id="categorytable">
                                        <TableHead>
                                            <StyledTableRow>
                                                <StyledTableCell onClick={() => handleSorting('bankname')}><Box sx={userStyle.tableheadstyle}><Box>Brank Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('bankname')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('branchname')}><Box sx={userStyle.tableheadstyle}><Box>Branch Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('branchname')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('accountholdername')}><Box sx={userStyle.tableheadstyle}><Box>Account Holder Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('accountholdername')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('accountnumber')}><Box sx={userStyle.tableheadstyle}><Box>Account Number</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('accountnumber')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSorting('ifsccode')}><Box sx={userStyle.tableheadstyle}><Box>IFSC Code</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('ifsccode')}</Box></Box></StyledTableCell>
                                                <StyledTableCell>Action</StyledTableCell>
                                            </StyledTableRow>
                                        </TableHead>
                                     
                                        <TableBody align="left">
                                        {todos.length > 0 ? todos.map((todo , index)=>{  
                                            return(
                                                <>
                                        <StyledTableRow key={index}>     
                                        <StyledTableCell component="th" scope="row"> { todo.bankname} </StyledTableCell>
                                                <StyledTableCell component="th" scope="row"> { todo.branchname} </StyledTableCell>
                                                <StyledTableCell component="th" scope="row"> {todo.accholdername } </StyledTableCell>
                                                <StyledTableCell component="th" scope="row"> {todo.accno } </StyledTableCell>
                                                <StyledTableCell component="th" scope="row"> {todo.ifsccode } </StyledTableCell>
                                                <StyledTableCell align="left">
                                                            <Grid sx={{ display: 'flex' }}>
                                                                <Button sx={userStyle.buttonedit} style={{ minWidth: '0px' }}><EditOutlinedIcon style={{ fontSize: 'large' }} onClick={()=>{handleClickOpenEdit();
                                                                getTodoCode(index);
                                                                setGetEditIndex(index);}} /></Button>
                                                                <Button sx={userStyle.buttondelete} onClick={()=>handleDeleteTodocheck(index)} ><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                                                            </Grid>
                                                        </StyledTableCell>
                                            </StyledTableRow>
                                            </>
                                     
                                     )}) : 
                                     <StyledTableRow><StyledTableCell colSpan={6} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                                 }
                                        </TableBody>
                                  
                                    </Table>
                                </TableContainer>
                         </Grid>

                 
                        <Grid container sx={userStyle.gridcontainer}>
                            <Grid >
                                <Link to="/contact/supplier/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
                                <Button sx={userStyle.buttonadd} type="submit">UPDATE</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
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
                            updateSupplier();
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
                                        {/* ALERT DIALOG */}
                                        <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                >
                    <DialogContent sx={{ width: "850px", height:"100px", padding: '20px' }}>
                        <Box >
                            <>
                                <Typography sx={userStyle.HeaderText}>
                                    Edit Bank Details
                                </Typography>
                                <Grid item md={6} sm={6} xs={12}>
                            <Grid container spacing={2}>
                                <Grid item md={4} sm={6} xs={6}>
                                    <InputLabel htmlFor="component-outlined" sx={{ display: "flex" }}>Bank Name</InputLabel>
                                    <FormControl size="small" fullWidth >
                                    <Select
                                        options={accounttypes}
                                        id="addCustGroupName"
                                        value={{label:banknameEdit, value:banknameEdit}}
                                        placeholder='Please Select Bank Name'
                                        styles={colourStyles}
                                        onChange={(e)=>setbanknameEdit(e.value)}
                                        
                                    />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sm={6} xs={6}>
                                    <InputLabel htmlFor="component-outlined" sx={{ display: "flex" }}>Branch Name</InputLabel>
                                    <FormControl size="small" fullWidth >
                                        <OutlinedInput
                                            id="addCustGroupName"
                                            placeholder="Branch Name"
                                            type="text"
                                            value={branchnameEdit}
                                            onChange={(e)=>setbranchnameEdit(e.target.value)}

                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sm={6} xs={6}>
                                    <InputLabel htmlFor="component-outlined" sx={{ display: "flex" }}>IFSC Code</InputLabel>
                                    <FormControl size="small" fullWidth >
                                        <OutlinedInput
                                            id="addCustGroupName"
                                            placeholder="Ifsc code"
                                            type="text"
                                            value={ifsccodeEdit}
                                            onChange={(e)=>setifsccodeEdit(e.target.value)}

                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sm={6} xs={6}>
                                    <InputLabel htmlFor="component-outlined" sx={{ display: "flex" }}>Accout Number</InputLabel>
                                    <FormControl size="small" fullWidth >
                                        <OutlinedInput
                                            id="addCustGroupName"
                                            sx={userStyle.input}
                                            placeholder="Account Number"
                                            type="number"
                                            value={accntnoEdit}
                                            onChange={(e)=>setaccntnoEdit(e.target.value)}

                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sm={6} xs={6}>
                                    <InputLabel htmlFor="component-outlined" sx={{ display: "flex" }}>Account Holder Name</InputLabel>
                                    <FormControl size="small" fullWidth >
                                        <OutlinedInput
                                            id="addCustGroupName"
                                            placeholder="Accout Holder Name"
                                            type="text"
                                            value={accholnameEdit}
                                            onChange={(e)=>setaccholnameEdit(e.target.value)}

                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid><br/><br/>
                        <Grid container spacing={2}>
                                    <Grid item lg={4} md={4} xs={12} sm={12}>
                                        <Button variant="contained" onClick={handleUpdateTodocheck}>
                                            Update
                                        </Button>
                                    </Grid>
                                    <Grid item lg={4} md={4} xs={12} sm={12}>
                                        <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>
                            </>
                        </Box>
                    </DialogContent>
                </Dialog>
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

function Supplieredit() {
    return (
       <>
        <Suppliereditlist /><br /><br /><br /><br />
                    <Footer />
       </>
    );
}

export default Supplieredit;