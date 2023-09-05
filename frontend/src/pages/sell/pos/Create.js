import React, { useState, useEffect, useRef, useContext, createRef } from "react";
import { userStyle } from "../../PageStyle";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid, Tabs, Tab, FormControl, InputLabel, OutlinedInput, Select, MenuItem, Paper, TextField, TableCell, Typography, Drawer, Button, Table, Tooltip, IconButton, TableContainer, TableHead, TableRow, TableBody, DialogActions, DialogContent, Dialog, DialogTitle, Card, } from "@mui/material";
import { FaClock, FaMoneyBillAlt, FaRegWindowClose, } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Mainlogo from "../../../assets/images/mainlogo.png";
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Link } from 'react-router-dom';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import CloseIcon from "@material-ui/icons/Close";
import PropTypes from 'prop-types';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import noimage from "../../../assets/images/dashboardbg/no-image.png";
import { UserRoleAccessContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import moment from 'moment';

// right Navbar overlap width
const drawerWidth = 250;
const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex"
    },
    hide: {
        display: "none"
    },
    drawer: {
        width: drawerWidth
    },
    drawerPaper: {
        width: drawerWidth
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: "flex-start"
    },
    closeicon: {
        textAlign: "left"
    },
}));

// recent transction popup tab
// Tabpanel
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Poscreate = () => {

    const { auth, setngs } = useContext(AuthContext);
    const [isLocation, setIsLocation] = useState({});

    //recent
    const [draftRecent, setDraftRecent] = useState([])
    const [quotationRecent, setQuotationRecent] = useState([]);
    const [posRecent, setPosRecent] = useState([]);

    // Access
    const { isUserRoleAccess, allLocations,allTaxrates, isActiveLocations, allProducts, allPos, setAllProducts } = useContext(UserRoleAccessContext);

    // Amount gain alter Alert
    const [isAmountgain, setisAmountgain] = useState("")

    const classes = useStyles();

    // pos inside products array data
    const productInputs = {
        discountvalue:"",businesslocation:"",productid: "", productname: "", quantity: "", sellingpricetax: "", taxtareval: "", subtotal: "", sellingexcludevalue: "", sellingincludevalue: "", applicabletax: "", discountamt: "0", discountvalue: 0
    }

    // pos db store data 
    const [posAdd, setPosAdd] = useState({
        businesslocation:isLocation ? isLocation?.locationid : "",referenceno: "", customer: "Walk-in-customer", date: "", counter: "", location: "", contactnumber: "", contactid: "", creditlimit: "",
        ledgerbalance: "", totalitems: "", totalproducts: 0, grandtotal: 0, shippingtax: "", granddistype: "None", gdiscountvalue: 0, gdiscountamtvalue: 0, aftergranddisctotal: 0,
        totalbillamt: "", ordertax: "", packcharge: "", roundof: "", amountgain: 0, balance: 0, userbyadd: ""

    });

    const [customers, setCustomers] = useState([]);
    const [productsList, setProductsList] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [pos, setPos] = useState([]);
    const [mergeprod, setMergeprod] = useState();
    const [discounts, setDiscounts] = useState("");
    const [drafts, setDrafts] = useState([]);
    const [customer, setCustomer] = useState({});
    const [quotations, setQuotations] = useState();
    const [locationData, setLocationData] = useState([])

    //all location
    const [busilocations, setBusilocations] = useState(isActiveLocations.map((d) => ({
        ...d,
        label: d.name,
        value: d.locationid,
    })));
    

    // pos date
    const [purchaseDateTime, setPurchaseDateTime] = useState(dayjs());

    //collapse Navbar drawer open for category
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [category, setCategory] = useState([])
    const [subcategory, setSubCategory] = useState([])
    const [comparecate, setComparecate] = useState()
    const [comparesub, setComparesub] = useState()
    const [comparebrand, setComparebrand] = useState()
    const [businesslocation, setBusinesslocation] = useState([]);

    const handleDrawerOpen = () => { setOpen1(true); };
    const handleDrawerClose = () => { setOpen1(false); };

    //Navbarsub drawer open for sub category
    const handleDrawerOpen1 = () => { setOpen2(true); };
    const handleDrawerClose1 = () => { setOpen2(false); };

    //Navbarsub drawer open for brand
    const handleDrawerOpen2 = () => { setOpen3(true); };
    const handleDrawerClose2 = () => { setOpen3(false); };

    //card popup
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => { setIsDeleteOpen(true); };
    const handleClickClose = () => { setIsDeleteOpen(false); };

    const backLPage = useNavigate();

    // paynow button popup
    const [isPay, setIsPay] = useState(false);
    const handleClickOpenpay = () => {
        {
            if(locationData.includes(posAdd.referenceno)){
                setShowAlert("ID Already Exists");
                handleClickOpen();
            }else if(posAdd.businesslocation == ""){
                setShowAlert("Please select business location!");
                alertOpen(); 
            }
           else if (tableData.length == 0) {
                setShowAlert("Please select any one of product details!");
                alertOpen();
            } else {
                setIsPay(true);
            }
        };
    }
    const handleClosepay = () => { setIsPay(false); };

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'HIPOS | INVOICE',
        pageStyle: 'print'
    });

    const ref = createRef();
    const options = {
        orientation: 'portrait',
        unit: 'in'
    };

    // Show Ledger Alert
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const alertOpen = () => { setIsErrorOpen(true); };
    const alertClose = () => { setIsErrorOpen(false); };

    //  Recent Transactions Modal
    const [recentTranMod, setRecentTranMod] = useState(false);
    const recentTranModOpen = () => { setRecentTranMod(true) }
    const recentTranModClose = () => { setRecentTranMod(false) }

     //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;

    //discount value
    const [dissval, setDissVal] = useState();

    // TABS
    const [valueMod, setValueMod] = useState(0);
    const handleChangeMod = (event, newValue) => { setValueMod(newValue); };

    let total = 0;
    let tempTotal = 0;
    let getsku;
    let discount;
    let subitems = [];
    let branditems = [];

    // fetch all products for category/brand/sub category onclick with particular data
    const fetchProd = async (e) => {
        try {            
            setMergeprod(allProducts);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    // get all stock data
    const fetchHandleStock = async () => {
        try {
            var res = await axios.post(SERVICE.STOCKSALESPRODUCTS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid:String(setngs.businessid),
                role:String(isUserRoleAccess.role),
                userassignedlocation:[isUserRoleAccess.businesslocation]
            });
            
            
            let newstocklistproducts = [...new Set(res?.data?.stockproducts)];
            setProductsList(
                newstocklistproducts.map((d) => ({
                    ...d,
                    label: d.productname + "-" + d.sku,
                    value: d.stockid,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                setShowAlert(messages);
                alertOpen();
            }else{
                setShowAlert("Something went wrong!");
                alertOpen();
            }
        }
    }

    // get all customer data from select option for customer
    const fetchCustomers = async () => {
        try {
            let res = await axios.post(SERVICE.CUSTOMER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid:String(setngs.businessid)
              });

            setCustomers(
                res.data.customers.map((d) => ({
                    ...d,
                    label: d.firstname || d.businessname,
                    value: d.firstname || d.businessname + "-" + d.contactid,

                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    // fetch categories
    const fetchcategory = async (e) => {
        try {
            let res = await axios.post(SERVICE.CATEGORIES, {
                headers: {
                  'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid:String(setngs.businessid)
              });
              
            let reqdata = res.data.categories.filter(item => {
                return item.subcategories
            })

            setSubCategory(reqdata);
            
            setCategory(res?.data?.categories);

        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    }

    // fetch product compare with category,subcategory and brand
    const singleId = (id) => {
        let compareitem = allProducts.filter(row => {
            return row.category == id
        })
        setComparecate(compareitem)
    }
    const singlesub = (id) => {
        let compareitem = allProducts.filter(row => {
            return row.subcategory == id
        })
        setComparesub(compareitem)
    }

    const singlebrand = (id) => {
        let compareitem = allProducts.filter(row => {
            return row.brand == id
        })
        setComparebrand(compareitem)
    }

    // Product Onchange to get particular productid
    const rowData = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.PRODUCT_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            })
            fetchtable(res?.data?.sproduct)
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    }

    // get all discount 
    const fetchDiscounts = async () => {
        try {
            let response = await axios.post(SERVICE.DISCOUNT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid:String(setngs.businessid),
                role:String(isUserRoleAccess.role),
                userassignedlocation:[isUserRoleAccess.businesslocation]
            });
          
            setDiscounts(response?.data?.discounts);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    // pos/draft/quotation auto id
    let newvalpos = setngs ? setngs.salesku == undefined ? "PO0001" : setngs.salesku + "0001" : "PO0001";

    let newval = setngs ? setngs.draftsku == undefined ? "DR0001" : setngs.draftsku + "0001" : "DR0001";

    let newvalquot = setngs ? setngs.quotationsku == undefined ? "QA0001" : setngs.quotationsku + "0001" : "QA0001";

    let quantity;
    let tot;
    const fetchDataProd = (e) => {
        let discAmtData = discounts?.filter((item) => {
            if (e.sku == item.productid) {
                return item
            }
        })
        let getTaxRateData = allTaxrates?.filter((data) => {
            if(e.applicabletax == data.hsn || data.taxname){
                return data
            }else if(e.applicabletax == data.taxname){
                return data
            }
        })
        let isAlreadyAdded = false;
        let addQuantity = tableData.map((item) => {
            if(e.sku == item.productid) {
                isAlreadyAdded = true
                return { ...item, quantity: item.quantity + 1, subtotal: ((Number(item.sellingincludevalue) - Number(item.discountamt)) * Number(item.quantity + 1)) }
            }else {
                return item
            }
        })

        if (isAlreadyAdded) {
            setTableData(addQuantity)
        } else {
            setTableData((tableData) => {
                return [...tableData, {
                    ...productInputs,
                    businesslocation:e.businesslocation,
                    productid: e.sku,
                    productname: e.productname,
                    quantity: 1,
                    stockid: e.stockid,
                    sellingpricetax: e.sellingpricetax,
                    sellingexcludevalue: e.sellingpricetax == 'Exclusive' ? e.sellingprice : ((Number(e.sellingprice) * (Number(e.applicabletax == "" || e.applicabletax == "None" || e.applicabletax == undefined ? 0 : 0) / 100) - Number(e.sellingprice))),
                    sellingincludevalue: e.sellingpricetax == 'Inclusive' ? e.sellingprice : ((Number(e.sellingprice) * (Number(e.applicabletax == "" || e.applicabletax == "None" || e.applicabletax == undefined ? 0 : getTaxRateData[0]?.taxrate) / 100)) + Number(e.sellingprice)),
                    applicabletax: e.applicabletax == "" || e.applicabletax == "None" ? "" : e.applicabletax,
                    discountamt: discAmtData[0] ? discAmtData[0].discountamt : 0,
                    taxtareval: e.applicabletax == "" || e.applicabletax == "None" ? "" : getTaxRateData[0]?.taxrate,
                    subtotal: (Number(1) * (Number(e.sellingpricetax == 'Inclusive' ? Number(e.sellingprice) : ((Number(e.sellingprice) * (Number(e.applicabletax == "" || e.applicabletax == "None" ? 0 : getTaxRateData[0]?.taxrate) / 100)) + Number(e.sellingprice))) - Number(discAmtData[0] ? Number(discAmtData[0].discountamt) : Number(0)))),
                    discountvalue: e.sellingpricetax == 'Inclusive' ? ((Number(((Number(e.sellingprice) * (Number(e?.applicabletax == "" || e?.applicabletax == "None" ? 0 : getTaxRateData[0]?.taxrate) / 100)) + Number(e.sellingprice))) * (Number(e?.applicabletax == "" || e?.applicabletax == "None" ? 0 : getTaxRateData[0]?.taxrate) / 100) - Number(((Number(e.sellingprice) * (Number(e?.applicabletax == "" || e?.applicabletax == "None" ? 0 : getTaxRateData[0]?.taxrate) / 100)) + Number(e.sellingprice)))) * (Number() / 100)) : ((((Number(e.sellingprice) * (Number(e.applicabletax == "" || e.applicabletax == "None" ? 0 : getTaxRateData[0]?.taxrate) / 100) - Number(e.sellingprice))) * (Number(e.applicabletax == "" || e.applicabletax == "None" ? 0 : getTaxRateData[0]?.taxrate) / 100)))
                }]
            });

        }
    };

    useEffect(
        () => {
            grandtotalCalc();
        }, [tableData, posAdd.gdiscountvalue, posAdd.granddistype]
    )

    // grand total calculation
    const grandtotalCalc = () => {

        let totalgrandValue = 0;
        if (tableData?.length > 0) {
            tableData?.forEach((value) => {
                totalgrandValue += Number(value.subtotal)
            })
            if (posAdd.granddistype == "Fixed" || posAdd.granddistype == "Amount") {
                setPosAdd(
                    {
                        ...posAdd, gdiscountamtvalue: posAdd.gdiscountvalue, grandtotal: Number(totalgrandValue), aftergranddisctotal: (Number(totalgrandValue) - Number(posAdd.gdiscountvalue))
                    })
            }
            else if (posAdd.granddistype == "Percentage") {
                let percentCalc = Number(totalgrandValue) * (Number(posAdd.gdiscountvalue) / 100);
                setPosAdd(
                    {
                        ...posAdd, gdiscountamtvalue: percentCalc, grandtotal: Number(totalgrandValue), aftergranddisctotal: (Number(totalgrandValue) - percentCalc)
                    });
            }
            else {
                setPosAdd(
                    {
                        ...posAdd, grandtotal: Number(totalgrandValue), aftergranddisctotal: (Number(totalgrandValue))
                    }
                )
            }
        }
    }
    // total qunatity calculation
    const totalQuantityCalc = () => {
        let totalquanvalue = 0;
        if (tableData?.length > 0) {
            tableData?.forEach((value) => {
                totalquanvalue += Number(value.quantity)
            })
            return totalquanvalue?.toFixed(0);
        }
    }

    //total taxvalue calc for invoice
    const totalTaxValCal = () => {
        let totaltaxvalue = 0;
        if (tableData?.length > 0) {
            tableData?.forEach((value) => {
                totaltaxvalue += Math.abs(Number(value.discountvalue)) * Number(value.quantity)
            })
            return totaltaxvalue;
        }
    }
    // delete table data after data fetchparticular row
    const deleteRow = (i, e) => {
        setTableData(tableData.filter((e, item) => item !== i));
        tableData.splice(i, 1);
        if (tableData.length > 0) {
            tempTotal = 0
        }
    }

    // exit screen and re exit screen
    const fulscren = document.getElementById("fullScreen")

    function openFullscreen() {
        if (fulscren.requestFullscreen) {
            fulscren.requestFullscreen();
        } else if (fulscren.webkitRequestFullscreen) { /* Safari */
            fulscren.webkitRequestFullscreen();
        } else if (fulscren.msRequestFullscreen) { /* IE11 */
            fulscren.msRequestFullscreen();
        }
    }

    // Select particular customer id to get credit limit 
    const searchCus = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.CUSTOMER_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setCustomer(res?.data?.scustomer);
            setPosAdd({ ...posAdd, contactnumber: res.data.scustomer.whatsappno, location: res.data.scustomer.city, contactid: res.data.scustomer.contactid, customer: res.data.scustomer.firstname + " " + res.data.scustomer.lastname })

        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    // fetch pos forrecent transction
    const fetchPos = async () => {
        try {

            let selectlocation = allLocations.filter((data, index) => {
                return data.locationid == setngs.businesslocation
            })

            var setngresult = allLocations?.filter((item) => {
                return item.locationid == setngs.businesslocation
            })
            
            let locresult = allPos?.map((data, index)=>{
                   return data.referenceno
            })

            setBusinesslocation(setngresult);
            setIsLocation(selectlocation[0]);
            
            setLocationData(locresult);
            setPos(allPos);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    // fetch quotation for recent quotation
    const fetchQot = async () => {
        try {
            let req = await axios.post(SERVICE.QUOTATION, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid:String(setngs.businessid),
                role:String(isUserRoleAccess.role),
                userassignedlocation:[isUserRoleAccess.businesslocation]
            });
           
            setQuotations(req?.data?.quotations);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };


    //auto id for draft

    {
        drafts && (
            drafts?.map(
                () => {
                    let strings = setngs ? setngs.draftsku : "DR";
                    let refNo = drafts[drafts.length - 1].referenceno;
                    let digits = (drafts.length + 1).toString();
                    const stringLength = refNo.length;
                    let lastChar = refNo.charAt(stringLength - 1);
                    let getlastBeforeChar = refNo.charAt(stringLength - 2);
                    let getlastThreeChar = refNo.charAt(stringLength - 3);
                    let lastBeforeChar = refNo.slice(-2);
                    let lastThreeChar = refNo.slice(-3);
                    let lastDigit = refNo.slice(-4);
                    let refNOINC = parseInt(lastChar) + 1
                    let refLstTwo = parseInt(lastBeforeChar) + 1;
                    let refLstThree = parseInt(lastThreeChar) + 1;
                    let refLstDigit = parseInt(lastDigit) + 1;
                    if (digits.length < 4 && getlastBeforeChar == 0 && getlastThreeChar == 0) {
                        refNOINC = ("000" + refNOINC);
                        newval = strings + refNOINC;
                    } else if (digits.length < 4 && getlastBeforeChar > 0 && getlastThreeChar == 0) {
                        refNOINC = ("00" + refLstTwo);
                        newval = strings + refNOINC;
                    } else if (digits.length < 4 && getlastThreeChar > 0) {
                        refNOINC = ("0" + refLstThree);
                        newval = strings + refNOINC;
                    } else {
                        refNOINC = (refLstDigit);
                        newval = strings + refNOINC;
                    }
                }))
    }

    //auto id for quotation
    {
        quotations && (
            quotations.map(
                () => {
                    let strings = setngs ? setngs.quotationsku : "QA";
                    let refNo = quotations[quotations.length - 1].referenceno;
                    let digits = (quotations.length + 1).toString();
                    const stringLength = refNo.length;
                    let lastChar = refNo.charAt(stringLength - 1);
                    let getlastBeforeChar = refNo.charAt(stringLength - 2);
                    let getlastThreeChar = refNo.charAt(stringLength - 3);
                    let lastBeforeChar = refNo.slice(-2);
                    let lastThreeChar = refNo.slice(-3);
                    let lastDigit = refNo.slice(-4);
                    let refNOINC = parseInt(lastChar) + 1
                    let refLstTwo = parseInt(lastBeforeChar) + 1;
                    let refLstThree = parseInt(lastThreeChar) + 1;
                    let refLstDigit = parseInt(lastDigit) + 1;
                    if (digits.length < 4 && getlastBeforeChar == 0 && getlastThreeChar == 0) {
                        refNOINC = ("000" + refNOINC);
                        newvalquot = strings + refNOINC;
                    } else if (digits.length < 4 && getlastBeforeChar > 0 && getlastThreeChar == 0) {
                        refNOINC = ("00" + refLstTwo);
                        newvalquot = strings + refNOINC;
                    } else if (digits.length < 4 && getlastThreeChar > 0) {
                        refNOINC = ("0" + refLstThree);
                        newvalquot = strings + refNOINC;
                    } else {
                        refNOINC = (refLstDigit);
                        newvalquot = strings + refNOINC;
                    }
                }))
    }

    // Auto id for pos cash/card
    {
        pos && (
            pos.map(
                () => {
                    let strings = setngs ? setngs.salesku : "PO";
                    let refNo = pos[pos.length - 1].referenceno;
                    let digits = (pos.length + 1).toString();
                    const stringLength = refNo.length;
                    let lastChar = refNo.charAt(stringLength - 1);
                    let getlastBeforeChar = refNo.charAt(stringLength - 2);
                    let getlastThreeChar = refNo.charAt(stringLength - 3);
                    let lastBeforeChar = refNo.slice(-2);
                    let lastThreeChar = refNo.slice(-3);
                    let lastDigit = refNo.slice(-4);
                    let refNOINC = parseInt(lastChar) + 1
                    let refLstTwo = parseInt(lastBeforeChar) + 1;
                    let refLstThree = parseInt(lastThreeChar) + 1;
                    let refLstDigit = parseInt(lastDigit) + 1;
                    if (digits.length < 4 && getlastBeforeChar == 0 && getlastThreeChar == 0) {
                        refNOINC = ("000" + refNOINC);
                        newvalpos = strings + refNOINC;
                    } else if (digits.length < 4 && getlastBeforeChar > 0 && getlastThreeChar == 0) {
                        refNOINC = ("00" + refLstTwo);
                        newvalpos = strings + refNOINC;
                    } else if (digits.length < 4 && getlastThreeChar > 0) {
                        refNOINC = ("0" + refLstThree);
                        newvalpos = strings + refNOINC;
                    } else {
                        refNOINC = (refLstDigit);
                        newvalpos = strings + refNOINC;
                    }
                }))
    }

    // save pos data to db cash
    const sendRequest = async () => {

        // reduce Current Stock in product
        tableData.map((item, index) => {
            allProducts.forEach((data, i) => {
                if (item.productid == data.sku) {
                    axios.put(`${SERVICE.PRODUCT_SINGLE}/${data._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        currentstock: Number(data.currentstock) - Number(item.quantity),
                    });
                }
            })
        })

        try {
            let PRODUCT_REQ = await axios.post(SERVICE.POS_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },

                customer: String(posAdd.customer),
                today:String(today),
                location: String(customer.city == undefined ? "" : customer.city),
                contactnumber: Number(customer.whatsappno == undefined ? "" : customer.whatsappno),
                businesslocation:String(posAdd.businesslocation),
                date: String(purchaseDateTime),
                counter: String(isUserRoleAccess.counter),
                creditlimit: Number(customer.creditlimit == undefined ? 0 : customer.creditlimit),
                ledgerbalance: Number(customer.ledgerbalance == undefined ? 0 : customer.ledgerbalance),
                goods: [...tableData],
                totalitems: Number(tableData.length),
                grandtotal: Number(posAdd.grandtotal?.toFixed(0)),
                ordertax: Number(posAdd.ordertax),
                shippingtax: Number(posAdd.shippingtax),
                packcharge: Number(posAdd.packcharge),
                granddistype: String(posAdd.granddistype),
                gdiscountvalue: Number(posAdd.gdiscountvalue),
                gdiscountamtvalue: Number(posAdd.gdiscountamtvalue),
                aftergranddisctotal: Number(posAdd.aftergranddisctotal?.toFixed(2)),
                dueamount: Number((Number(posAdd.aftergranddisctotal) - Number(posAdd.amountgain)) > 0 ? (Number(posAdd.aftergranddisctotal) - Number(posAdd.amountgain)) : (Number(posAdd.aftergranddisctotal) == Number(posAdd.amountgain)) ? 0 : (Number(posAdd.aftergranddisctotal) < Number(posAdd.amountgain)) ? (Number(posAdd.amountgain) - Number(posAdd.aftergranddisctotal)) : 0),
                paymentstatus: String((Number(posAdd.aftergranddisctotal) - Number(posAdd.amountgain)) > 0 ? "Partial" : (Number(posAdd.aftergranddisctotal) == Number(posAdd.amountgain)) ? "Paid" : (Number(posAdd.aftergranddisctotal) < Number(posAdd.amountgain)) ? "Paid" : "Paid"),
                referenceno: String(newvalpos),
                paymentmethod:String('Cash'),
                roundof: Number(posAdd.aftergranddisctotal?.toFixed(0)),
                amountgain: Number(posAdd.amountgain),
                balance: Number(posAdd.balance),
                userbyadd: String(isUserRoleAccess.staffname),
                contactid: String(customer.contactid == undefined ? "" : customer.contactid),
                customerledgeid: String(customer._id == undefined ? "" : customer._id),
                assignbusinessid: String(setngs.businessid),
            });
            handleprint();
            handleClosepay();
            await fetchQot();
            await fetchDraft();
            await fetchPos();
            handleSubmitclear();
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                setShowAlert(messages);
                alertOpen();
            }else{
                setShowAlert("Something went wrong!");
                alertOpen();
            }
        }
    };

    const cardCustomerLedgerbalance = () => {

        if (posAdd.customer == "" || posAdd.customer == undefined || posAdd.customer == "Walk-in-customer") {
            setShowAlert("please select customer name!");
            alertOpen();
        }else if(posAdd.businesslocation == ""){
            setShowAlert("Please select business location!");
            alertOpen(); 
        } else if (tableData.length == 0) {
            setShowAlert("Please select any one of product details!");
            alertOpen();
        } else {
            if (posAdd.customer == "" || posAdd.customer == undefined) {
                setPosAdd({ ...posAdd, customer: 'Walk-in-customer' })
            }

            if ((!posAdd.customer == "") || (!posAdd.customer == "Walk-in-customer")) {
                if ((customer.creditlimit < customer.ledgerbalance)) {
                    setShowAlert("Check ledger balance!")
                    alertOpen();
                } else {
                    handleCreditSubmit();
                }
            } else {
                handleCreditSubmit();
            }
        }

    }

    // save pos card to db for ledger balance calculation
    const sendRequestCredit = async () => {

        // reduce Current Stock in product
        tableData.map((item, index) => {
            allProducts.forEach((data, i) => {
                if ((item.productid == data.sku)) {
                    axios.put(`${SERVICE.PRODUCT_SINGLE}/${data._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        currentstock: Number(data.currentstock) - Number(item.quantity),
                    });
                }
            })
        })

        //update ledger balance in customer
        await axios.put(`${SERVICE.CUSTOMER_SINGLE}/${customer._id}`, {
            headers: {
                'Authorization': `Bearer ${auth.APIToken}`
            },
            ledgerbalance: Number(customer.ledgerbalance) + Number(posAdd.aftergranddisctotal)
        })

        try {
            let PRODUCT_REQ = await axios.post(SERVICE.POS_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                customer: String(posAdd.customer),
                today:String(today),
                location: String(customer.city == undefined ? "" : customer.city),
                contactnumber: Number(customer.whatsappno == undefined ? "" : customer.whatsappno),
                businesslocation:String(posAdd.businesslocation),
                date: String(purchaseDateTime),
                counter: String(isUserRoleAccess.counter),
                creditlimit: Number(customer.creditlimit == undefined ? 0 : customer.creditlimit),
                ledgerbalance: Number(customer.ledgerbalance == undefined ? 0 : customer.ledgerbalance),
                goods: [...tableData],
                totalitems: Number(tableData.length),
                grandtotal: Number(posAdd.grandtotal?.toFixed(0)),
                ordertax: Number(posAdd.ordertax),
                shippingtax: Number(posAdd.shippingtax),
                packcharge: Number(posAdd.packcharge),
                granddistype: String(posAdd.granddistype),
                gdiscountvalue: Number(posAdd.gdiscountvalue),
                gdiscountamtvalue: Number(posAdd.gdiscountamtvalue),
                aftergranddisctotal: Number(posAdd.aftergranddisctotal?.toFixed(2)),
                dueamount: Number(0),
                paymentstatus: String(""),
                paymentmethod:String("Credit"),
                referenceno: String(newvalpos),
                roundof: Number(posAdd.aftergranddisctotal?.toFixed(0)),
                amountgain: Number(posAdd.amountgain),
                balance: Number(posAdd.balance),
                userbyadd: String(isUserRoleAccess.staffname),
                contactid: String(customer.contactid == undefined ? "" : customer.contactid),
                customerledgeid: String(customer._id == undefined ? "" : customer._id),
                assignbusinessid: String(setngs.businessid),
            });
            await fetchQot();
            await fetchDraft();
            await fetchPos();
            handleprint();
            handleSubmitclear();
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                setShowAlert(messages);
                alertOpen();
            }else{
                setShowAlert("Something went wrong!");
                alertOpen();
            }
        }
    };

    // store quotation data
    const sendQuotation = async () => {

        try {
            let PRODUCT_REQ = await axios.post(SERVICE.QUOTATION_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                customer: String(posAdd.customer),
                today:String(today),
                location: String(customer.city == undefined ? "" : customer.city),
                contactnumber: Number(customer.whatsappno == undefined ? "" : customer.whatsappno),
                businesslocation:String(posAdd.businesslocation),
                date: String(purchaseDateTime),
                counter: String(isUserRoleAccess.counter),
                creditlimit: Number(customer.creditlimit == undefined ? 0 : customer.creditlimit),
                ledgerbalance: Number(customer.ledgerbalance == undefined ? 0 : customer.ledgerbalance),
                goods: [...tableData],
                totalitems: Number(tableData.length),
                grandtotal: Number(posAdd.grandtotal?.toFixed(0)),
                ordertax: Number(posAdd.ordertax),
                shippingtax: Number(posAdd.shippingtax),
                packcharge: Number(posAdd.packcharge),
                granddistype: String(posAdd.granddistype),
                gdiscountvalue: Number(posAdd.gdiscountvalue),
                gdiscountamtvalue: Number(posAdd.gdiscountamtvalue),
                aftergranddisctotal: Number(posAdd.aftergranddisctotal?.toFixed(2)),
                dueamount: Number(0),
                paymentstatus: String(""),
                paymentmethod:String("None"),
                referenceno: String(newvalquot),
                roundof: Number(posAdd.aftergranddisctotal?.toFixed(0)),
                amountgain: Number(posAdd.amountgain),
                balance: Number(posAdd.balance),
                userbyadd: String(isUserRoleAccess.staffname),
                contactid: String(customer.contactid == undefined ? "" : customer.contactid),
                customerledgeid: String(customer._id == undefined ? "" : customer._id),
                assignbusinessid: String(setngs.businessid),
            });
            setPosAdd(PRODUCT_REQ.data);
            toast.success("Successfullty added!")
            setPosAdd({
                referenceno: "", customer: "Walk-in-customer", date: "", counter: "", location: "", contactnumber: "", contactid: "", creditlimit: "",
                ledgerbalance: "", totalitems: "", totalproducts: 0, grandtotal: 0, shippingtax: "", granddistype: "None", gdiscountvalue: 0, gdiscountamtvalue: 0, aftergranddisctotal: 0,
                totalbillamt: "", ordertax: "", packcharge: "", roundof: "", amountgain: 0, balance: 0, userbyadd: ""

            });
            setTableData(clearvalall);
            await fetchQot();
            await fetchDraft();
            await fetchPos();
            backLPage('/sell/pos/create');

        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    const handlePosSubmit = (e) => {
        e.preventDefault();
        
        setPosAdd({ ...posAdd, referenceno: newvalpos })
        if (tableData.length == 0) {
            setShowAlert("Please select any one of product details!");
            alertOpen();
        }else if(posAdd.businesslocation == ""){
            setShowAlert("Please select business location!");
            alertOpen(); 
        }else if (posAdd.amountgain == "" || posAdd.amountgain == 0) {
            setisAmountgain("please enter amount!");
        } 
        else {
            if (posAdd.customer == "" || posAdd.customer == undefined) {
                setPosAdd({ ...posAdd, customer: 'Walk-in-customer' });
                setisAmountgain("");
                sendRequest();
            } else {
                setisAmountgain("");
                sendRequest();
            }
        }

    }
    const handleCreditSubmit = (e) => {
        // e.preventDefault();
        setPosAdd({ ...posAdd, referenceno: newvalpos });
        if (tableData.length == 0) {
            setShowAlert("Please select any one of product details!");
            alertOpen();
        }else if(posAdd.businesslocation == ""){
            setShowAlert("Please select business location!");
            alertOpen(); 
        } else {
            if (posAdd.customer == "" || posAdd.customer == undefined) {
                setPosAdd({ ...posAdd, customer: 'Walk-in-customer' });
                sendRequestCredit();
            } else {
                sendRequestCredit();
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPosAdd({ ...posAdd, referenceno: newval })
        if (tableData.length == 0) {
            setShowAlert("Please select any one of product details!");
            alertOpen();
        }else if(posAdd.businesslocation == ""){
            setShowAlert("Please select business location!");
            alertOpen(); 
        } else {
            if (posAdd.customer == "" || posAdd.customer == undefined) {
                setPosAdd({ ...posAdd, customer: 'Walk-in-customer' })
            }

            try {
                let PRODUCT_REQ = await axios.post(SERVICE.DRAFT_CREATE, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    customer: String(posAdd.customer),
                    today:String(today),
                    location: String(customer.city == undefined ? "" : customer.city),
                    contactnumber: Number(customer.whatsappno == undefined ? "" : customer.whatsappno),
                    businesslocation:String(posAdd.businesslocation),
                    date: String(purchaseDateTime),
                    counter: String(isUserRoleAccess.counter),
                    creditlimit: Number(customer.creditlimit == undefined ? 0 : customer.creditlimit),
                    ledgerbalance: Number(customer.ledgerbalance == undefined ? 0 : customer.ledgerbalance),
                    goods: [...tableData],
                    totalitems: Number(tableData.length),
                    grandtotal: Number(posAdd.grandtotal?.toFixed(0)),
                    ordertax: Number(posAdd.ordertax),
                    shippingtax: Number(posAdd.shippingtax),
                    packcharge: Number(posAdd.packcharge),
                    granddistype: String(posAdd.granddistype),
                    gdiscountvalue: Number(posAdd.gdiscountvalue),
                    gdiscountamtvalue: Number(posAdd.gdiscountamtvalue),
                    aftergranddisctotal: Number(posAdd.aftergranddisctotal?.toFixed(2)),
                    dueamount: Number(0),
                    paymentstatus: String(""),
                    referenceno: String(newval),
                    roundof: Number(posAdd.aftergranddisctotal?.toFixed(0)),
                    amountgain: Number(posAdd.amountgain),
                    paymentmethod: String('None'),
                    balance: Number(posAdd.balance),
                    userbyadd: String(isUserRoleAccess.staffname),
                    contactid: String(customer.contactid == undefined ? "" : customer.contactid),
                    customerledgeid: String(customer._id == undefined ? "" : customer._id),
                    assignbusinessid: String(setngs.businessid),
                });
                setPosAdd(PRODUCT_REQ.data);
                toast.success("Successfully Added!");
                setPosAdd({
                    referenceno: "", customer: "Walk-in-customer", date: "", counter: "", location: "", contactnumber: "", contactid: "", creditlimit: "",
                    ledgerbalance: "", totalitems: "", totalproducts: 0, grandtotal: 0, shippingtax: "", granddistype: "None", gdiscountvalue: 0, gdiscountamtvalue: 0, aftergranddisctotal: 0,
                    totalbillamt: "", ordertax: "", packcharge: "", roundof: "", amountgain: 0, balance: 0, userbyadd: ""

                });
                setTableData(clearvalall);
                await fetchQot();
                await fetchDraft();
                await fetchPos();
                backLPage('/sell/pos/create');
            } catch (err) {
                const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
            }
        }

    };

    const handleSubmitquotation = (e) => {
        setPosAdd({ ...posAdd, referenceno: newvalquot })
        e.preventDefault();
        if (tableData.length == 0) {
            setShowAlert("Please select any one of product details!");
            alertOpen();
        } else if(posAdd.businesslocation == ""){
            setShowAlert("Please select business location!");
            alertOpen(); 
        }else {
            if (posAdd.customer == "" || posAdd.customer == undefined) {
                setPosAdd({ ...posAdd, customer: 'Walk-in-customer' });
                sendQuotation();
            } else {
                sendQuotation();
            }
        }
    };
    let clearvalall = [];

    const handleSubmitclear = (e) => {
        setPosAdd({
            referenceno: "", customer: "Walk-in-customer", date: "", counter: "", location: "", contactnumber: "", contactid: "", creditlimit: "",
            ledgerbalance: "", totalitems: "", totalproducts: 0, grandtotal: 0, shippingtax: "", granddistype: "None", gdiscountvalue: 0, gdiscountamtvalue: 0, aftergranddisctotal: 0,
            totalbillamt: "", ordertax: "", packcharge: "", roundof: "", amountgain: 0, balance: 0, userbyadd: ""

        });
        setTableData(clearvalall);
    };

    // Fetching datas for image to table
    const fetchtable = (e) => {
        let discAmtData = discounts?.filter((item) => {
            if (e.sku == item.productid) {
                return item
            }
        })
        let getTaxRateData = allTaxrates?.filter((data) => {
            if (e.hsncode == data.hsn || data.taxname) {
                return data
            } else if (e.applicabletax == data.hsn || data.taxname) {
                return data
            }
        })

        let isAlreadyAdded = false;
        let addQuantity = tableData.map((item) => {
            if (e.sku == item.productid) {
                isAlreadyAdded = true
                return { ...item, quantity: item.quantity + 1, subtotal: ((Number(item.sellingincludevalue) - Number(item.discountamt)) * Number(item.quantity + 1)) }
            } else {
                return item
            }
        })

        if (isAlreadyAdded) {
            setTableData(addQuantity)
        } else {
            setTableData((tableData) => {
                return [...tableData, {
                    ...productInputs,
                    businesslocation:e.businesslocation,
                    productid: e.sku,
                    productname:
                        e.productname,
                    quantity: 1,
                    sellingpricetax: e.sellingpricetax,
                    sellingexcludevalue: e.sellingpricetax == 'Exclusive' ? e.sellingexcludetax : ((Number(e.sellingexcludetax) * (Number(e.hsn == "" ? e.applicabletax == "" || e.applicabletax == "None" ? 0 : getTaxRateData[0]?.taxrate : getTaxRateData[0]?.taxrate) / 100) - Number(e.sellingexcludetax))),
                    sellingincludevalue: e.sellingpricetax == 'Inclusive' ? e.sellingexcludetax : ((Number(e.sellingexcludetax) * (Number(e.hsn == "" ? e.applicabletax == "" || e.applicabletax == "None" ? 0 : getTaxRateData[0]?.taxrate : getTaxRateData[0]?.taxrate) / 100)) + Number(e.sellingexcludetax)),
                    applicabletax: e.hsn == "" ? e.applicabletax == "" || e.applicabletax == "None" ? "" : e.applicabletax : e.hsn,
                    discountamt: discAmtData[0] ? discAmtData[0].discountamt : 0,
                    taxtareval: e.hsn == "" ? e.applicabletax == "" || e.applicabletax == "None" ? "" : getTaxRateData[0]?.taxrate : getTaxRateData[0]?.taxrate,
                    subtotal: (Number(1) * (Number(e.sellingpricetax == 'Inclusive' ? Number(e.sellingexcludetax) : ((Number(e.sellingexcludetax) * (Number(e.hsn == "" ? e.applicabletax == "" || e.applicabletax == "None" ? 0 : getTaxRateData[0]?.taxrate : getTaxRateData[0]?.taxrate) / 100)) + Number(e.sellingexcludetax))) - Number(discAmtData[0] ? Number(discAmtData[0].discountamt) : Number(0)))),
                    discountvalue: e.sellingpricetax == 'Inclusive' ? ((Number(((Number(e.sellingexcludetax) * (Number(e.hsn == "" ? e.applicabletax == "" || e.applicabletax == "None" ? 0 : getTaxRateData[0]?.taxrate : getTaxRateData[0]?.taxrate) / 100)) + Number(e.sellingexcludetax))) * (Number(e.hsn == "" ? e.applicabletax == "" || e.applicabletax == "None" ? 0 : getTaxRateData[0]?.taxrate : getTaxRateData[0]?.taxrate) / 100) - Number(((Number(e.sellingexcludetax) * (Number(e.hsn == "" ? e.applicabletax == "" || e.applicabletax == "None" ? 0 : getTaxRateData[0]?.taxrate : getTaxRateData[0]?.taxrate) / 100)) + Number(e.sellingexcludetax)))) * (Number(e.hsn == "" ? e.applicabletax == "" || e.applicabletax == "None" ? 0 : getTaxRateData[0]?.taxrate : getTaxRateData[0]?.taxrate) / 100)) : ((((Number(e.sellingexcludetax) * (Number(e.hsn == "" ? e.applicabletax == "" || e.applicabletax == "None" ? 0 : getTaxRateData[0]?.taxrate : getTaxRateData[0]?.taxrate) / 100) - Number(e.sellingexcludetax))) * (Number(e.hsn == "" ? e.applicabletax == "" || e.applicabletax == "None" ? 0 : getTaxRateData[0]?.taxrate : getTaxRateData[0]?.taxrate) / 100)))

                }]
            });
        }

    };

    let totalprice;
    // fetch draft for recent draft
    const fetchDraft = async () => {
        try {
            let response = await axios.post(SERVICE.DRAFT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid:String(setngs.businessid),
                role:String(isUserRoleAccess.role),
                userassignedlocation:[isUserRoleAccess.businesslocation]
            });
            
            setDrafts(response?.data?.drafts);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    const fetchTodayDraft = async () => {
        try {
            let res = await axios.post(SERVICE.DRAFT_TODAY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid:String(setngs.businessid),
                role:String(isUserRoleAccess.role),
                userassignedlocation:[isUserRoleAccess.businesslocation]
            });
            setDraftRecent(res?.data?.drafts)
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    const fetchTodayQuotation = async () => {
        try {
            let res = await axios.post(SERVICE.QUOTATION_TODAY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid:String(setngs.businessid),
                role:String(isUserRoleAccess.role),
                userassignedlocation:[isUserRoleAccess.businesslocation]
            });
            setQuotationRecent(res?.data?.quotations)
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    const fetchTodaySales = async () => {
        try {
            let res = await axios.post(SERVICE.POS_TODAY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid:String(setngs.businessid),
                role:String(isUserRoleAccess.role),
                userassignedlocation:[isUserRoleAccess.businesslocation]
            });
            setPosRecent(res?.data?.pos1)
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    useEffect(
        ()=>{
            fetchTodayDraft();
            fetchTodayQuotation();
            fetchTodaySales();
        },[]
    )

    useEffect(() => {
        fetchCustomers();
        fetchDraft();
        fetchPos();
        fetchQot();
        fetchDiscounts();
        fetchHandleStock();
    }, []);

    return (
        <Box id="fullScreen"
            sx={{
                backgroundColor: 'white',
                // color: "red",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <Headtitle title={'Pos Add'} />
            <form >
                {/* Navbar Start */}
                <Box sx={userStyle.container}>
                    <Grid container sx={userStyle.poscontainer} >
                        <Grid item lg={1} md={1} sm={2} xs={2}>
                            <Box sx={{ float: "left" }}>
                                <Link to="/">
                                    <img src={Mainlogo} alt="logo" style={{ width: '50px', height: '50px' }}></img>
                                </Link>
                            </Box>
                        </Grid>
                        <Grid item lg={2} md={5} sm={4} xs={10}>
                        <InputLabel id="demo-select-small">Business Location <b style={{ color: "red" }}> *</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <Selects
                                    placeholder={isLocation ? isLocation.name : ""}
                                    options={busilocations}
                                    onChange={(e) => { setPosAdd({ ...posAdd, businesslocation: e.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={2} md={5} sm={4} xs={10} sx={{ marginTop: "17px" }}>
                            <InputLabel sx={{ marginTop: '-21px' }}>Customer</InputLabel>
                            <Grid sx={{ display: "flex" }}>
                                <Grid sx={userStyle.spanIcons} style={{ height: "38px" }}>
                                    <SearchOutlinedIcon />
                                </Grid>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        options={customers}
                                        onChange={(i, e) => {
                                            searchCus(i._id);
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item lg={1} md={1} sm={2} xs={2} sx={{ marginTop: "17px" }}>
                            <Button onClick={(e) => { openFullscreen() }}><FullscreenOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                        </Grid>
                        <Grid item lg={2} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small" sx={{ marginTop: '-3px' }}> Date </InputLabel>
                            <FormControl size="small" fullWidth>
                                <LocalizationProvider dateAdapter={AdapterDayjs} >
                                    <DateTimePicker
                                        renderInput={(props) => <TextField {...props} />}
                                        size='small'
                                        sx={userStyle.posNavbarInput}
                                        value={purchaseDateTime}
                                        onChange={(newValue) => {
                                            setPurchaseDateTime(newValue);
                                        }}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                        <Grid item lg={2} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small" sx={{ marginTop: '-3px' }}> Counter </InputLabel>
                            <FormControl
                                size="small"
                                fullWidth
                                sx={{ display: "flex" }}
                            >
                                <OutlinedInput
                                    id="component-outlined"
                                    value={isUserRoleAccess.counter == undefined ? "" : isUserRoleAccess.counter}
                                    type="text"
                                    sx={userStyle.posNavbarInput}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={1} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small" sx={{ marginTop: '-3px' }}> Credit Limit </InputLabel>
                            <Grid sx={{ display: "flex" }}>
                                <Grid sx={userStyle.spanIcons} style={{ height: '34px' }}>
                                    <MoneyOutlinedIcon sx={{ marginTop: '-1px' }} />
                                </Grid>
                                <FormControl
                                    size="small"
                                    fullWidth
                                    sx={{ display: "flex" }}
                                >
                                    <OutlinedInput
                                        id="component-outlined"
                                        value={customer.creditlimit}
                                        onChange={(e) => {
                                            setPosAdd({ ...posAdd, creditlimit: e.target.value });

                                        }}
                                        type="text"
                                        sx={userStyle.posNavbarInput}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item lg={1} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small" sx={{ marginTop: '-3px' }}> Ledger Balance </InputLabel>
                            <Grid sx={{ display: "flex" }}>
                                <Grid sx={userStyle.spanIcons} style={{ height: '34px' }}>
                                    <PersonOutlineOutlinedIcon sx={{ marginTop: '-1px' }} />
                                </Grid>
                                <FormControl
                                    size="small"
                                    fullWidth
                                    sx={{ display: "flex" }}
                                >
                                    <OutlinedInput
                                        type="text"
                                        value={customer.ledgerbalance}
                                        sx={userStyle.posNavbarInput}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
                {/* Navbar Ends */}
                <Grid container sx={{ backgroundColor: "#f0f2ff", }} >
                    <Grid item xs={12} sm={12} md={8} lg={8} sx={{ paddingRight: '3px', backgroundColor: '#fff' }} >
                        {/* <br /> */}
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12} md={12} lg={12} >
                                {/* Table start */}
                                <TableContainer
                                    sx={{ paddingLeft: 1, height: '478px' }}
                                >
                                    <Table
                                        aria-label="customized table" padding='none'>
                                        <TableHead >
                                            <TableRow>
                                                <TableCell sx={userStyle.tableHead1} style={{ marginLeft: '5px' }}>Product Name</TableCell>
                                                <TableCell sx={userStyle.tableHead1}>Qty</TableCell>
                                                <TableCell sx={userStyle.tableHead1}>Unit Cost ( Ex. Tax )</TableCell>
                                                <TableCell sx={userStyle.tableHead1}>Tax</TableCell>
                                                <TableCell sx={userStyle.tableHead1}>Unit Cost ( Inc. Tax )</TableCell>
                                                <TableCell sx={userStyle.tableHead1}>Discount value</TableCell>
                                                <TableCell sx={userStyle.tableHead1}>Subtotal </TableCell>
                                                <TableCell sx={userStyle.tableHead1}></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {tableData.length > 0 &&
                                                tableData.map((data, i) => {
                                                    return (
                                                        <>
                                                            <TableRow sx={{ height: '16px' }}>
                                                                <TableCell key={i}>{data?.productname}</TableCell>
                                                                <TableCell>
                                                                    <Typography>
                                                                        {data?.quantity}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography>
                                                                        {Math.abs(data?.sellingexcludevalue)}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography>
                                                                        {data?.taxtareval}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography>
                                                                        {data?.sellingincludevalue}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell >
                                                                    <Grid container >
                                                                        <Grid item lg={8} md={9} sm={9} xs={9}>
                                                                            <Typography>
                                                                                {data?.discountamt}
                                                                            </Typography>
                                                                        </Grid>
                                                                    </Grid>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant='subtitle1'>{data?.subtotal?.toFixed(2)}</Typography>
                                                                </TableCell>
                                                                <TableCell sx={{ color: 'red', fontWeight: '900', cursor: 'pointer', fontSize: '15px !important' }}><AiOutlineClose onClick={(e) => { deleteRow(i, e); }} /></TableCell>
                                                            </TableRow>
                                                        </>
                                                    );
                                                })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                {/* Table Ends */}
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} sx={{ marginTop: '-24px' }}>
                                <Grid container spacing={1}>
                                    <Grid item md={3} sm={4} xs={12}>
                                        <Typography sx={{ marginLeft: '15px' }}>
                                            <b> Total Items :</b>{tableData.length}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={2} sm={4} xs={12}
                                        sx={{ display: 'flex' }}
                                    >
                                        <FormControl size="small" fullWidth>
                                            <InputLabel> Discount Type </InputLabel>
                                            <Select
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                fullWidth
                                                label="Discount Type"
                                                value={posAdd.granddistype}
                                                onChange={(e) => {
                                                    setPosAdd({ ...posAdd, granddistype: e.target.value })
                                                }}
                                            >
                                                <MenuItem value="None">None</MenuItem>
                                                <MenuItem value="Fixed">Fixed</MenuItem>
                                                <MenuItem value="Amount">Amount</MenuItem>
                                                <MenuItem value="Percentage">Percentage</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={2} sm={4} xs={12}>
                                        <TextField
                                            size="small"
                                            value={posAdd.gdiscountvalue}
                                            onChange={(e) => {
                                                setPosAdd({ ...posAdd, gdiscountvalue: e.target.value });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={5} sm={4} xs={12} sx={{ paddingLeft: '4px', paddingRight: '1px', marginTop: '-4px' }}>
                                        <Button fullWidth variant="contained" sx={{ marginTop: "5px", }}>
                                            <b>GRAND TOTAL :</b>&ensp;{posAdd.grandtotal?.toFixed(2)}
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <Typography sx={{ marginTop: "5px", marginLeft: '15px' }}>
                                            <b>Discount:</b>{posAdd.gdiscountamtvalue}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4} sx={{ p: 1, backgroundColor: '#fff', }}>
                        <Grid container  >
                            <Grid item md={3} sm={3} xs={6} sx={{ padding: '3px' }}>
                                <Button fullWidth sx={userStyle.paynowbtn}
                                    onClick={(e) => { fetchProd(e); }}
                                >
                                    All
                                </Button>
                            </Grid>
                            <Grid item md={3} sm={3} xs={6} sx={{ padding: '3px' }}>
                                <Button
                                    fullWidth
                                    sx={userStyle.paynowbtn}
                                    onClick={(e) => { handleDrawerOpen(); fetchcategory() }}
                                >
                                    Category
                                </Button>
                                <Drawer
                                    className={classes.drawer}
                                    variant="persistent"
                                    anchor="right"
                                    open={open1}
                                    classes={{
                                        paper: classes.drawerPaper
                                    }}
                                >
                                    {/* Navbar sub-category */}
                                    <div className={classes.closeicon}>
                                        <IconButton sx={userStyle.closeicon} onClick={handleDrawerClose}>
                                            <CloseIcon />
                                        </IconButton>
                                        <Typography style={{ fontSize: '20px', marginLeft: '0.5em', marginBottom: '1em', fontFamily: "'Source Sans Pro','Helvetica Neue',Helvetica,Arial,sans-serif", color: '#7009ab', fontWeight: 'bolder' }}>List of Category</Typography>
                                        <Grid item md={12} sm={12} xs={12}>
                                            <Grid style={{ marginLeft: '3em', "&:hover": { backgroundColor: 'red' } }}>
                                                <img src={noimage} onClick={(e) => { fetchProd(e); }} style={{ width: '110px', height: '130px', cursor: 'pointer' }} />
                                                <Typography style={{}}><b>All Category</b></Typography>
                                            </Grid>
                                            {category && (
                                                category.map((row, index) => (
                                                    <>
                                                        <br />
                                                        <div key={index} style={{ curser: 'pointer' }}>
                                                            <img src={noimage} alt="image" onClick={(e) => { singleId(row.categoryname) }} style={{ width: '100px', height: '100px', marginLeft: '3em', border: 'none' }} />
                                                            <Typography style={{ marginLeft: '3em' }}>{row.categoryname}</Typography>
                                                        </div>
                                                    </>
                                                ))
                                            )}
                                        </Grid>
                                    </div>
                                </Drawer>
                            </Grid>
                            <Grid item md={3} sm={3} xs={6} sx={{ padding: '3px' }}>
                                <Button
                                    fullWidth
                                    sx={userStyle.paynowbtn}
                                    style={{ p: '5px' }}
                                    onClick={(e) => { handleDrawerOpen1(); fetchcategory(); }}
                                >
                                    SubCategory
                                </Button>
                                <Drawer
                                    className={classes.drawer}
                                    variant="persistent"
                                    anchor="right"
                                    open={open2}
                                    classes={{
                                        paper: classes.drawerPaper
                                    }}
                                >
                                    {/* Navbar sub-category */}

                                    <div className={classes.closeicon}>
                                        <IconButton onClick={handleDrawerClose1}>
                                            <CloseIcon />
                                        </IconButton>
                                        <Typography style={{ fontSize: '16px', marginLeft: '0.5em', marginBottom: '1em', fontFamily: "'Source Sans Pro','Helvetica Neue',Helvetica,Arial,sans-serif", color: '#7009ab', fontWeight: 'bolder' }}>List of Sub-Category</Typography>
                                        <Grid item md={12} sm={12} xs={12}>
                                            <Grid style={{ marginLeft: '3em', "&:hover": { backgroundColor: 'red' } }}>
                                                <img src={noimage} onClick={(e) => { fetchProd(e) }} style={{ width: '110px', height: '130px', cursor: 'pointer' }} />
                                                <Typography style={{}}><b>All Subcategory</b></Typography>
                                            </Grid>
                                            {subcategory && (
                                                subcategory?.map((row, index) => (
                                                    row.subcategories.map(((meta, i) => {
                                                        subitems.push(meta);
                                                    }))
                                                ))
                                            )}
                                            {subitems.map((item, i) => {
                                                return (
                                                    <>
                                                        <br />
                                                        <div key={i} style={{ curser: 'pointer' }}>
                                                            <img src={noimage} alt="image" onClick={(e) => { singlesub(item.subcategryname) }} style={{ width: '100px', height: '100px', marginLeft: '3em', border: 'none' }} />
                                                            <Typography style={{ marginLeft: '3em' }}>{item.subcategryname}</Typography>
                                                        </div>
                                                    </>
                                                )
                                            })}
                                        </Grid>
                                    </div>
                                </Drawer>
                            </Grid>
                            <Grid item md={3} sm={3} xs={6} sx={{ padding: '3px' }}>
                                <Button
                                    fullWidth
                                    sx={userStyle.paynowbtn}
                                    onClick={(e) => { handleDrawerOpen2(); fetchcategory(); }}
                                >
                                    Brand
                                </Button>
                                <Drawer
                                    className={classes.drawer}
                                    variant="persistent"
                                    anchor="right"
                                    open={open3}
                                    classes={{
                                        paper: classes.drawerPaper
                                    }}
                                >
                                    {/* Navbar brand */}
                                    <div className={classes.closeicon}>
                                        <IconButton onClick={handleDrawerClose2}>
                                            <CloseIcon />
                                        </IconButton>
                                        <Typography style={{ fontSize: '20px', marginLeft: '0.5em', marginBottom: '1em', fontFamily: "'Source Sans Pro','Helvetica Neue',Helvetica,Arial,sans-serif", color: '#7009ab', fontWeight: 'bolder' }}>List of Brand</Typography>
                                        <Grid item md={12} sm={12} xs={12}>
                                            <Grid style={{ marginLeft: '3em', "&:hover": { backgroundColor: 'red' } }}>
                                                <img src={noimage} onClick={(e) => { fetchProd(e) }} style={{ width: '110px', height: '130px', cursor: 'pointer' }} />
                                                <Typography style={{ marginLeft: '1.3em' }}><b>All Brand</b></Typography>
                                            </Grid>
                                            {category && (
                                                category?.map((row, index) => (
                                                    row.brands.map(((meta, i) => {
                                                        branditems.push(meta);
                                                    }))
                                                ))
                                            )}
                                            {branditems.map((item, i) => {
                                                return (
                                                    <>
                                                        <br />
                                                        <div key={i} style={{ curser: 'pointer' }}>
                                                            <img src={noimage} alt="image" onClick={(e) => { singlebrand(item.brandname) }} style={{ width: '100px', height: '100px', marginLeft: '3em', border: 'none' }} />
                                                            <Typography style={{ marginLeft: '3em' }}>{item.brandname}</Typography>
                                                        </div>
                                                    </>
                                                )
                                            })}
                                        </Grid>
                                    </div>
                                </Drawer>
                            </Grid>
                            <br /><br /><br />
                            <Grid item md={12} sm={12} xs={12} sx={{ marginLeft: '25px' }}>
                                <Grid sx={{ display: "flex" }}>
                                    <Grid sx={userStyle.spanIcons} style={{ height: "38px" }}>
                                        <SearchOutlinedIcon />
                                    </Grid>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={productsList}
                                            onChange={(e) => {
                                                fetchDataProd(e);
                                                totalQuantityCalc();
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid item md={12} sm={12} xs={12} sx={{}}>
                                <br />
                                <Grid container spacing={2} sx={{ display: 'flex' }}>
                                    <br />
                                    <>
                                        <Grid container>
                                            {comparecate && (
                                                comparecate.map((row, index) => (
                                                    <Grid item md={3} key={index} sx={{ justifyContent: 'space-between', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', height: 150, margin: '5px' }}>
                                                        <Grid >
                                                            <p style={{ fontSize: '14px', marginLeft: '3em', color: 'black' }}><b>Qty: {row.currentstock}</b></p>
                                                            <img src={row.productimage ? row.productimage : noimage} alt={row.category} onClick={(e) => { rowData(row._id); }} width="100px" height="100px" style={{ margin: '0px  17px', '@media (maxWidth: 400px)': { width: "70px", height: "100px", margin: '0px  0px', } }} />
                                                        </Grid>
                                                        <p style={{ fontSize: '14px', marginLeft: '4em', color: '#5CB85C' }}><b>₹ {row.sellingexcludetax}</b></p>
                                                    </Grid>
                                                )))}
                                        </Grid>
                                    </>

                                    <>
                                        <Grid container>
                                            {comparesub && (
                                                comparesub.map((row, index) => (
                                                <Grid item md={3} key={index} sx={{ justifyContent: 'space-between', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', height: 150, margin: '5px' }}>
                                                        <Grid >
                                                            <p style={{ fontSize: '14px', marginLeft: '3em', color: 'black' }}><b>Qty: {row.currentstock}</b></p>
                                                            <img src={row.productimage ? row.productimage : noimage} alt={row.category} onClick={(e) => { rowData(row._id); }} width="100px" height="100px" style={{ margin: '0px  17px', '@media (maxWidth: 400px)': { width: "70px", height: "100px", margin: '0px  0px', } }} />
                                                        </Grid>
                                                        <p style={{ fontSize: '14px', marginLeft: '4em', color: '#5CB85C' }}><b>₹ {row.sellingexcludetax}</b></p>
                                                </Grid>
                                                )))}
                                        </Grid>
                                    </>

                                    <>
                                        <Grid container>
                                            {comparebrand && (
                                                comparebrand.map((row, index) => (
                                                    <Grid item md={3} key={index} sx={{ justifyContent: 'space-between', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', height: 150, margin: '5px' }}>
                                                        <Grid >
                                                            <p style={{ fontSize: '14px', marginLeft: '3em', color: 'black' }}><b>Qty: {row.currentstock}</b></p>
                                                            <img src={row.productimage ? row.productimage : noimage} alt={row.category} onClick={(e) => { rowData(row._id); }} width="100px" height="100px" style={{ margin: '0px  17px', '@media (maxWidth: 400px)': { width: "70px", height: "100px", margin: '0px  0px', } }} />
                                                        </Grid>
                                                        <p style={{ fontSize: '14px', marginLeft: '4em', color: '#5CB85C' }}><b>₹ {row.sellingexcludetax}</b></p>
                                                </Grid>
                                                )))}
                                        </Grid>
                                    </>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <br />
                <br />
                <Grid container sx={userStyle.btnGrid}>
                    <Grid item md={8} sm={8} xs={12} sx={{ display: "flex", color: 'black' }}>
                        <Button disableRipple sx={userStyle.btnBack} type="submit" onClick={handleSubmit}>
                            <EditOutlinedIcon style={{ fontSize: "large" }} />
                            &ensp;Draft
                        </Button>
                        <Button disableRipple sx={userStyle.btnPause} type="submit" onClick={handleSubmitquotation}>
                            <EditOutlinedIcon style={{ fontSize: "large" }} />
                            Quotation
                        </Button>
                        {/* <Button disableRipple sx={userStyle.btnCred}>
                            <FaCheck />
                            &ensp;UPI
                        </Button> */}
                        {/* <Button disableRipple sx={userStyle.btnCard} onClick={handleClickOpen}>
                            <FaCreditCard />
                            &ensp;Card
                        </Button> */}
                        <Button disableRipple sx={userStyle.btnCash} onClick={handleClickOpenpay}>
                            <FaMoneyBillAlt />
                            &ensp;Cash
                        </Button>
                        <Button disableRipple sx={userStyle.btnCancel} onClick={handleSubmitclear}>
                            <FaRegWindowClose />
                            &ensp;Cancel
                        </Button>
                        <Button disableRipple sx={userStyle.btnCard} onClick={cardCustomerLedgerbalance}>
                            <FaRegWindowClose />
                            &ensp;Credit
                        </Button>
                        <Typography value={posAdd.totalbillamt}
                            sx={{ marginLeft: '15px', color: 'grey', fontSize: "20px" }}>
                            <b>Total:</b> <span style={{ color: 'green' }}>{posAdd.aftergranddisctotal?.toFixed(2)}</span>
                        </Typography>
                    </Grid>
                    <Grid item md={4} sm={4} xs={12}>
                        <Box sx={{ float: "right" }}>
                            <Button disableRipple sx={userStyle.btnRec} onClick={recentTranModOpen}>
                                <FaClock />
                                &ensp;Recent Transactions
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
            {/*  card details*/}
            <Dialog
                open={isDeleteOpen}
                onClose={handleClickClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent sx={{ width: '610px', height: '300px' }}>
                    <Typography sx={userStyle.HeaderText}>Enter Card  Details</Typography>
                    <Grid container spacing={1} sx={{ paddingTop: '2em' }}>
                        <Grid item lg={4} md={4} sm={6} xs={12} >
                            <InputLabel htmlFor="component-outlined">Card Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12} >
                            <InputLabel htmlFor="component-outlined">Card Holder Name</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Card Transaction Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} >
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Card Type</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                >
                                    <MenuItem value="Visa" > Visa</MenuItem>
                                    <MenuItem value="Master Card" > Master Card</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Month</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">year</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Security Code</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickClose} variant="outlined">Cancel</Button>
                    <Button autoFocus variant="contained" color='error'> OK </Button>
                </DialogActions>
            </Dialog>
            {/* Cash dialog box */}
            <Dialog
                open={isPay}
                onClose={handleClosepay}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
            >
                <DialogTitle>
                    <Typography sx={userStyle.HeaderText}>Enter Cash Details</Typography>
                </DialogTitle>
                <DialogContent sx={{ padding: '0px' }}>
                    <Grid container sx={{ padding: '10px' }} spacing={3}>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <Grid container spacing={3}  >
                                <Grid item xs={12} sm={12} md={12} lg={12} >
                                    <Grid container >
                                        <Grid item md={12} sm={12} xs={12}>
                                            <InputLabel id="demo-select-small"> Amount </InputLabel>
                                            <Grid sx={{ display: "flex" }}>
                                                <Grid sx={userStyle.spanIcons}>
                                                    <MoneyOutlinedIcon />
                                                </Grid>
                                                <FormControl
                                                    size="small"
                                                    fullWidth
                                                    sx={{ display: "flex" }}
                                                >
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        value={posAdd.aftergranddisctotal?.toFixed(0)}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <br />
                                        </Grid>
                                        <Grid item md={12} sm={12} xs={12}>
                                        <p style={{color:'red'}}>{isAmountgain}</p>
                                            <InputLabel id="demo-select-small">
                                                Amount Gain
                                            </InputLabel>
                                            <Grid sx={{ display: "flex" }}>
                                                <Grid sx={userStyle.spanIcons}>
                                                    <MoneyOutlinedIcon />
                                                </Grid>
                                                <FormControl
                                                    size="small"
                                                    fullWidth
                                                    sx={{ display: "flex" }}
                                                >
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        value={posAdd.amountgain}
                                                        onChange={(e) => { setPosAdd({ ...posAdd, amountgain: e.target.value, balance: (Number(posAdd.aftergranddisctotal?.toFixed(0)) - Number(e.target.value)) }); setisAmountgain(""); }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <br />
                                        </Grid>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <InputLabel id="demo-select-small">
                                            Balance
                                        </InputLabel>
                                        <Grid sx={{ display: "flex" }}>
                                            <Grid sx={userStyle.spanIcons}>
                                                <MoneyOutlinedIcon />
                                            </Grid>
                                            <FormControl
                                                size="small"
                                                fullWidth
                                                sx={{ display: "flex" }}
                                            >
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={Math.abs(posAdd.balance?.toFixed(0))}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} sx={{ paddingLeft: '20px' }}>
                            <Card sx={{ padding: '30px' }}>
                                <TableContainer sx={{ boxShadow: '0 0 15px -2px #444444' }}>
                                    <Table>
                                        <TableBody>
                                            <StyledTableRow>
                                                <StyledTableCell><b>Total Products :</b></StyledTableCell>
                                                <StyledTableCell>{totalQuantityCalc()}</StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell><b>OrderTax :</b></StyledTableCell>
                                                <StyledTableCell>Rs.0.00</StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell> <b>Shipping :</b></StyledTableCell>
                                                <StyledTableCell>Rs.0.00</StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell><b>Discount :</b></StyledTableCell>
                                                <StyledTableCell>{posAdd.gdiscountamtvalue}</StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell> <b>Packing Charge :</b></StyledTableCell>
                                                <StyledTableCell>Rs.0.00</StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell> <b>Round off :</b></StyledTableCell>
                                                <StyledTableCell>{posAdd.aftergranddisctotal?.toFixed(0)}</StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell><b>Grand Total :</b></StyledTableCell>
                                                <StyledTableCell>{posAdd.aftergranddisctotal?.toFixed(0)}</StyledTableCell>
                                            </StyledTableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Card>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosepay} variant="outlined">Cancel</Button>
                    <Button autoFocus variant="contained" color='primary' type="submit" onClick={(e) => { handlePosSubmit(e) }}> Print </Button>
                </DialogActions>
            </Dialog>
            {/* Cash Dialog Ends */}
               {/* Recent Transactions Modal Start */}
               <Dialog
                open={recentTranMod}
                onClose={recentTranModClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
            >
                <DialogContent sx={{ minWidth: '750px', height: '500px' }}>
                    <Typography sx={userStyle.importheadtext}>Recent Transactions</Typography>
                    <br /><br />
                    <Grid container >
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', textTransform: 'CAPITALIZE', }}>
                                <Tabs value={valueMod} onChange={handleChangeMod} TabIndicatorProps={{
                                    style: {
                                        background: 'none',
                                        borderTop: '5px solid #7009ab', borderLeft: '2px solid black', top: '0', borderRadius: '5px !important'
                                    }
                                }}
                                    aria-label="basic tabs example" scrollButtons variant="scrollable"  >
                                    <Tab iconPosition="start" label={<><div><CheckOutlinedIcon />&ensp;Final</div></>} {...a11yProps(0)}></Tab>
                                    <Tab iconPosition="start" label={<><div><ChevronRightOutlinedIcon />&ensp;Quotation</div></>} {...a11yProps(1)}></Tab>
                                    <Tab iconPosition="start" label={<><div><ChevronRightOutlinedIcon />&ensp;Draft</div></>} {...a11yProps(2)}></Tab>
                                </Tabs>
                            </Box>

                            {/* Pos Panel */}
                            <TabPanel value={valueMod} index={0}>
                                <Grid container >
                                    <Grid item xs={12} sm={12} md={12} lg={12} >
                                        <TableContainer>
                                            <Table>
                                                <TableBody>
                                                    {posRecent &&
                                                        (posRecent?.map((item, i) => (
                                                            <StyledTableRow key={i}>
                                                                <StyledTableCell>{item.referenceno}</StyledTableCell>
                                                                <StyledTableCell>{item.customer}</StyledTableCell>
                                                                <StyledTableCell>{item.grandtotal}</StyledTableCell>
                                                            </StyledTableRow>
                                                        )))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                </Grid>
                            </TabPanel>
                            {/* Quotation Panel */}
                            <TabPanel value={valueMod} index={1}>
                                <Grid container >
                                    <Grid item xs={12} sm={12} md={12} lg={12} >
                                        <TableContainer>
                                            <Table>
                                                <TableBody>
                                                    {quotationRecent &&
                                                        (quotationRecent?.map((item, i) => (
                                                            <StyledTableRow key={i}>
                                                                <StyledTableCell>{item.referenceno}</StyledTableCell>
                                                                <StyledTableCell>{item.customer}</StyledTableCell>
                                                                <StyledTableCell>{item.grandtotal}</StyledTableCell>
                                                            </StyledTableRow>
                                                        )))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                </Grid>
                            </TabPanel>

                            {/* Draft Panel */}
                            <TabPanel value={valueMod} index={2}>
                                <Grid container  >
                                    <Grid item xs={12} sm={12} md={12} lg={12} >
                                        <TableContainer>
                                            <Table>
                                                <TableBody>
                                                    {draftRecent &&
                                                        (draftRecent?.map((item, i) => (
                                                            <StyledTableRow key={i}>
                                                                <StyledTableCell>{item.referenceno}</StyledTableCell>
                                                                <StyledTableCell>{item.customer}</StyledTableCell>
                                                                <StyledTableCell>{item.grandtotal}</StyledTableCell>
                                                            </StyledTableRow>
                                                        )))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                </Grid>
                            </TabPanel>
                        </Box>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button disableRipple onClick={recentTranModClose} variant="outlined">Close</Button>
                </DialogActions>
            </Dialog>
            {/* Recent Transactions Modal Ends */}
            {/* Error model */}
           <Dialog
                    open={isErrorOpen}
                    onClose={alertClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={alertClose}>ok</Button>
                    </DialogActions>
                </Dialog>
            {/* invoice print layout     */}

            <>
                <Box sx={userStyle.printcls} ref={componentRef}>
                    <Box sx={{ textAlign: 'center', width: '400px' }}>
                        {/* <img> </img> */}
                        <Typography>{setngs?.businessname}</Typography>
                        <Typography>{setngs?.buniessaddress}</Typography>
                        <Typography>{businesslocation[0]?.zipcde}</Typography>
                        <Typography>CIN : {setngs ? setngs.ciono : ""}</Typography>
                        <Typography>GST NO :{setngs ? setngs.gstno : ""}</Typography>
                        <Typography variant="h6">INVOICE</Typography>
                        <Box sx={{ borderWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}></Box>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography name="print" align='left'><b>Invoice No :</b>{newvalpos}</Typography>
                                <Typography name="print" align='left'><b>Counter :</b> {isUserRoleAccess.counter}</Typography>
                                <Typography name="print" align='left'><b>Customer ID :</b> {customer.contactid == undefined ? "" : customer.contactid}</Typography>
                                <Typography name="print" align='left'><b>Mail ID :</b> {businesslocation[0]?.email}</Typography>
                            </Grid>
                            <Grid item xs={6} align="right" >
                                <Typography name="print" ><b>Cashier :</b>{isUserRoleAccess.userid}</Typography>
                                <Typography name="print" ><b>Name : </b>{isUserRoleAccess.staffname}</Typography>
                                <Typography name="print" ><b>Phone : </b>{businesslocation[0]?.whatsappno}</Typography>
                            </Grid>
                        </Grid>
                        <Box style={{ borderWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}></Box>
                        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: 'none' }}>
                            <Table aria-label="simple table" >
                                <TableHead >
                                    <TableRow sx={{ borderBottom: 'none' }}>
                                        <TableCell sx={{ fontSize: '13px', fontWeight: "1000", padding: '14px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}>ITEM</TableCell>
                                        <TableCell sx={{ fontSize: '13px', fontWeight: "1000", padding: '14px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}>QUANTITY</TableCell>
                                        <TableCell sx={{ fontSize: '13px', fontWeight: "1000", padding: '14px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}>PRICE</TableCell>
                                        <TableCell sx={{ fontSize: '13px', fontWeight: "1000", padding: '14px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}>AMOUNT</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableData.length > 0 &&
                                        tableData.map((data, i) => {
                                            return (
                                                <>
                                                    <TableRow>
                                                        <TableCell align="center" sx={{ fontSize: '14px', fontWeight: "1000", padding: '5px', borderBottom: "none" }} key={i}>{data?.productid} <br />

                                                        </TableCell>
                                                        <TableCell align="center" sx={{ fontSize: '12px', fontWeight: "1000", padding: '5px', borderBottom: "none" }}>
                                                            <Typography>
                                                                {data?.quantity}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center" sx={{ fontSize: '12px', fontWeight: "1000", padding: '5px', borderBottom: "none" }}>
                                                            <Typography>
                                                                {Math.abs(data?.sellingexcludevalue)}
                                                            </Typography>
                                                        </TableCell>

                                                        <TableCell align="center" sx={{ fontSize: '12px', fontWeight: "1000", padding: '5px', borderBottom: "none" }}>
                                                            <Typography variant='subtitle1'>{Number(data?.subtotal)?.toFixed(2)}</Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell sx={{ fontSize: '14px', fontWeight: "1000", padding: '0px', borderBottom: "none" }} colSpan={4}>{data?.productname}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell sx={{ fontSize: '14px', fontWeight: "1000", padding: '0px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }} colSpan={2}> {"HSN CODE :"}{data?.applicabletax}</TableCell>
                                                        <TableCell sx={{ fontSize: '14px', fontWeight: "1000", padding: '0px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }} colSpan={2}> {"Taxable value : "}{Math.abs(((data?.sellingexcludevalue * data?.taxtareval / 100) - +data?.sellingexcludevalue) + +data?.discountamt) * data?.quantity}</TableCell>
                                                    </TableRow>
                                                </>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <br />
                        <Grid container>
                            <Grid item xs={6}>
                                <Typography name="print" ><b>GRAND TOTAL :</b></Typography>
                            </Grid>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={3}>
                                <Typography name="print" ><b>{Number(posAdd.aftergranddisctotal)?.toFixed(2)}</b> </Typography>
                            </Grid>
                        </Grid><br />
                        <Box style={{ borderWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}></Box><br />
                        <Grid container>
                            <Grid item xs={6}>
                                <Typography name="print" ><b>NET TOTAL :</b></Typography>
                                <Typography name="print" ><b>NET TAX :</b></Typography>
                            </Grid>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={3}>
                                <Typography name="print" ><b>{Number(posAdd.aftergranddisctotal)?.toFixed(2)}</b> </Typography>
                                <Typography name="print" ><b>{Number(totalTaxValCal())?.toFixed(2)}</b> </Typography>
                            </Grid>
                        </Grid><br />
                        <Box style={{ borderWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}></Box><br />
                        <Typography variant="h6">TAX DETAILS</Typography>
                        <Box style={{ borderWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}></Box><br />
                        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: 'none' }}>
                            <Table aria-label="simple table" >
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ padding: '2px', borderBottom: '0px' }}>HSN/Tax</TableCell>
                                        <TableCell sx={{ padding: '2px', borderBottom: '0px' }}>TAX DESC</TableCell>
                                        <TableCell sx={{ padding: '2px', borderBottom: '0px' }}>Taxable VALUE</TableCell>
                                        <TableCell sx={{ padding: '2px', borderBottom: '0px' }}>TAX</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableData.length > 0 &&
                                        tableData.map((data, i) => {
                                            return (
                                                <>
                                                    <TableRow>
                                                        <TableCell sx={{ padding: '2px', borderBottom: '0px' }}>{data?.applicabletax}</TableCell>
                                                        <TableCell sx={{ padding: '2px', borderBottom: '0px' }}>{data?.applicabletax}</TableCell>
                                                        <TableCell sx={{ padding: '2px', borderBottom: '0px' }}>{Math.abs((((data?.sellingexcludevalue * data?.taxtareval / 100) - +data?.sellingexcludevalue) + +data?.discountamt))?.toFixed(2)}</TableCell>
                                                        <TableCell sx={{ padding: '2px', borderBottom: '0px' }}>{Math.abs((data?.sellingexcludevalue * data?.taxtareval / 100) * data?.quantity)?.toFixed(2)}</TableCell>
                                                    </TableRow>
                                                </>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography name="print" ><b>TOTAL :</b></Typography>
                            </Grid>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={3}>
                                <Typography name="print" ><b>{Number(totalTaxValCal())?.toFixed(2)}</b> </Typography>
                            </Grid>
                        </Grid><br />
                        <Box style={{ borderWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}></Box><br />

                        <Grid container>
                            <Grid item xs={7}>
                                <Typography name="print" ><b></b></Typography>
                                <Typography name="print" ><b>TOTAL RECEIVED AMOUNT</b></Typography>
                            </Grid>
                            <Grid item xs={1}></Grid>
                            <Grid item xs={3}>
                                <Typography name="print" ><b></b> </Typography>
                                <Typography name="print" ><b>{posAdd.amountgain}</b> </Typography>
                            </Grid>
                        </Grid><br />
                        <Box style={{ borderWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}></Box><br />
                        <Grid container>
                            <Grid item xs={6}>
                                <Typography name="print" ><b>NO. OF ITEMS:  </b>{totalQuantityCalc()}</Typography>
                                <Typography name="print" ><b>TOTAL ITEMS: </b>{totalQuantityCalc()}</Typography>
                            </Grid>
                        </Grid><br />
                        <Grid container>
                            <Grid>
                                <Typography variatnt="subtitle2" align="left">* All Offers are subject to applicable T&C.</Typography>
                                <Typography variatnt="subtitle2" align="left">* No return / Exchange / Refund on Innerwear, Dresses, Cloths and Chudidhar.</Typography>
                                <Typography variatnt="subtitle2" align="left">* This is computer generated invoice and hence does not require any signature.</Typography>
                            </Grid>
                        </Grid>
                    </Box><br /><br /><br /><br />
                </Box><br /><br />
            </>
        </Box>
    );
};
export default Poscreate;
