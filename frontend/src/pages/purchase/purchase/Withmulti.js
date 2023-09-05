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

const Purchasecreatelist = () => {

    const { auth, setngs } = useContext(AuthContext);
    const [supplier, setSupplier] = useState({});
    const [suppliers, setSuppliers] = useState([]);
    const [busilocations, setBusilocations] = useState();
    const [isBusilocations, setIsBusilocations] = useState();
    const [taxrates, setTaxrates] = useState();
    const [fetchsaveproduct, setFetchsaveproduct] = useState();
    const [taxRate, setTaxRate] = useState(0);
    const [productsList, setProductsList] = useState([]);
    const [alpha, setAlpha] = useState("");
    const [isSupplierFetch, setIsSupplierFetch] = useState();
    const [allTotalItems, setAlltotalItems] = useState([]);
    const totalItem = { quantity: 0, freeitem: 0 };
    const [locationData, setLocationData] = useState([])
    const [allUnits, setAllUnits] = useState([])
    const [groupUnit, setGroupUnit] = useState({quantity:0, unitgrouping:"",subquantity:0})
    const [isQuantity, setIsQuantity] = useState(false);

    //  Datefield
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

    //role access
    const { isUserRoleAccess, allLocations, allTaxratesGroup, isActiveLocations, allProducts, allPurchases, allTaxrates } = useContext(UserRoleAccessContext);

    // paid date
    const [paidDateTime, setPaidDateTime] = useState(dayjs());
    let purchaseStatusPending = "Pending";
    let purchaseStatusReceived = "Received";
    let balanceamt = 0.00;
    let totalalltaxamt = 0.00;
    // produts list for add purchase data into db
    const productInputs = {
        produniqid:"",prodname:"",supplier:"",suppliershortname:"",date:"",sku:"",hsn:"",hsntax:"",applicabletax: "",
        applicabletaxrate: "",lotnumber: "",purchasetabletax:"None",purchasetax: "None",purchasetaxrate:"",sellingpricetax:"",enteramt:"",margin: "",
        purchaseexcludetax:"",pruchaseincludetax: "",excalpha: "",incalpha: "",quantity: 1,
        quantityunit: "None",quantitynitpiece:"",quantitysubunitpieces:1,quantitytotalpieces: 1,quantityunitstatus: false,freeitem: "",freeitemunit:"None",freeitemtotalpieces:1,
        freeitemunitstatus:false,freeitemnitpiece:"",freeitemsubunitpieces:1,netcostafterdiscount:"",netcostbeforediscount:"",netcosttaxamount:0,netcostwithtax:0,unitcostbeforediscount: "",
        unitcostafterdiscount:"",unitcosttaxamount: "",unitcostwithtax:"",purchasenetcost:"",purchasenetcosttax: "",purchasenetcostaftertax: "",
        distypemod: "None",disvaluemod:"",differenceamt:"",subtaxs:[],ratebydismod:"",sellingpriceunitcost:"",sellingpriceunitwithoutcost: "",saletaxamount: ""
    }
    const [allProductsList, setAllProductsList] = useState([]);
    // purchase list og data only in add purchase
    const [purchaseAdd, setPurchaseAdd] = useState({
        supplier: "", referenceno: "",freightamount:"",totalamount:"",expenseamount:"", billamount: "",suppliershrtname:"", purchasedate: today, purchasetaxmode: "None", purchasetaxlabmode: "None", purchasestatus: "Pending", addressone: "", balance: 0,
        totaltaxamount:"",businesslocation: "", invoiceno: "", expenseamount: "", freightamount: "", totalamount: "", nettotal: 0.0, totalitem: 0,
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

    // add hsn to the product list data
    const gethsncode = async (e) => {

        try {
            let taxRateData = allTaxrates?.filter((data) => {
                if (data.hsn + '@' + data.taxrate == e.hsncode) {
                    return data
                } else if (data.taxname + '@' + data.taxrate == e.applicabletax) {
                    return data
                }
            });
            let isAlreadyAdded = false;
            let addedproductId = allProductsList.map((item) => {
                if (e.sku == item.sku) {
                    isAlreadyAdded = true
                    setShowAlert("This product already added!")
                    handleClickOpen();
                    return { ...item }
                } else {
                    return item
                }
            })
            if (isAlreadyAdded) {
                setAllProductsList(addedproductId)
            } else {
                setAllProductsList((productslistdata) => {
                    return [{ ...productInputs, produniqid: e._id,suppliershortname: purchaseAdd.suppliershrtname, quantityunit:"None", freeitemunit: "None", purchasetabletax: purchaseAdd.purchasetaxmode == "Inclusive" ? "Inclusive" : purchaseAdd.purchasetaxmode == "Exclusive" ? "Exclusive" : "None", purchasetaxrate:taxRate, purchasetax: purchaseAdd.purchasetaxlabmode, supplier: purchaseAdd.supplier, date: purchaseAdd.purchasedate, margin: setngs.dprofitpercent, applicabletax: e.applicabletax == "" || e.applicabletax == "None" ? "" : e.applicabletax, applicabletaxrate: e.applicabletax == "" || e.applicabletax == "None" ? 0 : taxRateData[0]?.taxrate, hsntax: e.hsn == "" || e.hsn == "None" ? 0 : taxRateData[0]?.taxrate, prodname: e.productname, sku: e.sku, hsn: e.hsn == "" || e.hsn == "None" ? "" : e.hsn, sellingpricetax: e.sellingpricetax }, ...productslistdata]
                });
            }

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }

    }

    // const handleChangephonenumber = (e) => {
    //     // Regular expression to match only positive numeric values
    //     const regex = /^[0-9]+$/;  // Only allows positive integers
    //     // const regex = /^\d*\.?\d*$/;
    //     const inputValue = e.target.value;
    //     // Check if the input value matches the regex or if it's empty (allowing backspace)
    //     if (regex.test(inputValue) || inputValue === '') {
    //       // Update the state with the valid numeric value
    //       setBranch({ ...branch, phone: inputValue });
    //     }
    //   };

    const fetchUnits = async () => {
        try {
            let res = await axios.post(SERVICE.UNIT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            
            setAllUnits(
                res.data.units.map((d) => ({
                    ...d,
                    label: d.unit,
                    value: d.unit,
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

    // Purchase 
    const fetchPurchases = async () => {
        try {

            let refNo = allPurchases[allPurchases?.length - 1].referenceno;
            let codenum = refNo.slice(-4);
            let prefixLength = Number(codenum) + 1;
            let prefixString = String(prefixLength);
            let strings = setngs ? setngs.purchasesku : "PU";
            let postfixLength = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ? `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString
            setPurchases(strings + postfixLength)
            //setCategoryForm({ ...categoryForm, categorycode: strings+postfixLength })

            let locresult = allPurchases?.map((data, index) => {
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

    // Products
    const fetchProducts = async () => {
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

            setProductsList(
                allProducts?.map((d) => ({
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

    // alpha
    const fetchAlpha = async () => {
        try {
            let res = await axios.post(SERVICE.ALPHARATEACTIVE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            setAlpha(res?.data?.alpharates);

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }

    }

    //quantity unit change compare with unit group
    const handleChangeUnit = async (unitindex,valueunitname) =>{
        let resdata = [];
        let resunidata = [];
        try {
            let res = await axios.post(SERVICE.UNIT_GROUPS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            let unitcompare = res?.data?.unitgroupings.filter((data,index)=>{
                if(valueunitname == data.unit){
                    resunidata.push({...data, subquantity:1});
                    return data;
                }
            });

            // if(valueunitname == "Pieces" || valueunitname == "Piece" || valueunitname == "pieces" || valueunitname == "piece"){
            //     return {quantity:0, unitgrouping:valueunitname}
            // }else if(valueunitname == data.unit){
            //     return data
            // }

            let unitpiececompare = res?.data?.unitgroupings.filter((data, index)=>{
                if(unitcompare[0]?.unitgrouping != "Pieces" || unitcompare[0]?.unitgrouping != "Piece" || unitcompare[0]?.unitgrouping != "pieces" || unitcompare[0]?.unitgrouping != "piece"){
                    if(unitcompare[0]?.unitgrouping == data.unit){
                        resdata.push({...data, subquantity:unitcompare[0]?.quantity})
                        return {...data, subquantity:unitcompare[0]?.quantity}
                    }
                }
            })

            if(unitcompare.length == 0){
                // setShowAlert("Unit name didn't present unit group! Quantity calulate as single piece!");
                // handleQuantityOpen();
                let result = valueunitname == "Pieces" || valueunitname == "Piece" || valueunitname == "pieces" || valueunitname == "piece" ? [{quantity:0,unitgrouping:valueunitname}] : unitcompare[0]?.unitgrouping == "Pieces" || unitcompare[0]?.unitgrouping == "Piece" || unitcompare[0]?.unitgrouping == "pieces" || unitcompare[0]?.unitgrouping == "piece" ? resunidata : resdata;
                setGroupUnit(result[0]);
                await  productUserInput(unitindex, "quantityunit", valueunitname, "Quantityunit","",result[0]?.quantity,result[0]?.subquantity);
            }else{
                let result = valueunitname == "Pieces" || valueunitname == "Piece" || valueunitname == "pieces" || valueunitname == "piece" ? [{quantity:0,unitgrouping:valueunitname}] : unitcompare[0]?.unitgrouping == "Pieces" || unitcompare[0]?.unitgrouping == "Piece" || unitcompare[0]?.unitgrouping == "pieces" || unitcompare[0]?.unitgrouping == "piece" ? resunidata : resdata;
                
            setGroupUnit(result[0]);
            await  productUserInput(unitindex, "quantityunit", valueunitname, "Quantityunit", result[0]?.quantity, false,result[0]?.subquantity);
            }
            

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    //free quantity unit change compare with unit group
    const handleChangeFreeUnit = async (unitindex,valueunitname) =>{
        let resdata = [];
        let resunidata = [];
        try {
            let res = await axios.post(SERVICE.UNIT_GROUPS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            let unitcompare = res?.data?.unitgroupings.filter((data,index)=>{
                if(valueunitname == data.unit){
                    resunidata.push({...data, subquantity:1});
                    return data;
                }
            });

            // if(valueunitname == "Pieces" || valueunitname == "Piece" || valueunitname == "pieces" || valueunitname == "piece"){
            //     return {quantity:0, unitgrouping:valueunitname}
            // }else if(valueunitname == data.unit){
            //     return data
            // }

            let unitpiececompare = res?.data?.unitgroupings.filter((data, index)=>{
                if(unitcompare[0]?.unitgrouping != "Pieces" || unitcompare[0]?.unitgrouping != "Piece" || unitcompare[0]?.unitgrouping != "pieces" || unitcompare[0]?.unitgrouping != "piece"){
                    if(unitcompare[0]?.unitgrouping == data.unit){
                        resdata.push({...data, subquantity:unitcompare[0]?.quantity})
                        return {...data, subquantity:unitcompare[0]?.quantity}
                    }
                }
            })

            if(unitcompare.length == 0){
                let result = valueunitname == "Pieces" || valueunitname == "Piece" || valueunitname == "pieces" || valueunitname == "piece" ? [{quantity:0,unitgrouping:valueunitname}] : unitcompare[0]?.unitgrouping == "Pieces" || unitcompare[0]?.unitgrouping == "Piece" || unitcompare[0]?.unitgrouping == "pieces" || unitcompare[0]?.unitgrouping == "piece" ? resunidata : resdata;
                setGroupUnit(result[0]);
                await  productUserInput(unitindex, "freeitemunit", valueunitname, "Free Unit","",true,result[0]?.subquantity);
            }else{
                let result = valueunitname == "Pieces" || valueunitname == "Piece" || valueunitname == "pieces" || valueunitname == "piece" ? [{quantity:0,unitgrouping:valueunitname}] : unitcompare[0]?.unitgrouping == "Pieces" || unitcompare[0]?.unitgrouping == "Piece" || unitcompare[0]?.unitgrouping == "pieces" || unitcompare[0]?.unitgrouping == "piece" ? resunidata : resdata;
                
            setGroupUnit(result[0]);
            await  productUserInput(unitindex, "freeitemunit", valueunitname, "Free Unit", result[0]?.quantity, false,result[0]?.subquantity);
            }
            

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    // alpharate for exclude tax
    let gotalpha = "";
    const getAlphaRate = (inputValue) => {
        let getalpha = alpha.slice(0).filter((data) => {
            var num = inputValue;
            var digits = num.toString().split('');
            var realDigits = digits.map((item) => {
                if (item == '.') {
                    gotalpha += '.'
                }
                else {
                    gotalpha += data[item]
                }
            });
        });
        return gotalpha
    }

    //alpharate include tax
    const getAlphaRateInc = (taxValue) => {
        let alphaValue = ""
        let getalpha = alpha.slice(0).filter((data) => {
            var num = taxValue;
            var digits = num.toString().split('');
            var realDigits = digits.map((item) => {
                if (item == '.') {
                    alphaValue += '.'
                }
                else {
                    alphaValue += data[item]
                }
            })
        });
        return alphaValue;
    }

    const handleChangeTaxvalue = (taxvalue) =>{
        setTaxRate(taxvalue);
    }

    const handleChangeTax = async (index,taxname,taxvalue,taxsubarray) => {

       await productUserInput(index, "purchasetax", taxname, "taxchange",0,"",0,taxvalue,taxsubarray);
    }

    useEffect(() => {
        fetchPurchases();
        fetchUnits();
        fetchAlpha();
        totalNetCostCalc();
    }, []);

    useEffect(() => {
        totalNetTaxAmtCalc();
    }, [allProductsList]);
    
    useEffect(
        () => {
        fetchSuppliers();
    }, [isSupplierFetch]);
    
    useEffect(
        () => {
        fetchProducts();
    }, [fetchsaveproduct]);

    const backPage = useNavigate();

    // compare bill amount net total then only purchase status changed and update currentstock
    const purchaseStatusInput = (value) => {
        if (value == "Received") {
            if (purchaseAdd.billamount == Number(totalNetCostCalc())) {
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
                billamount: Number(purchaseAdd.billamount),
                freightamount: Number(purchaseAdd.freightamount),
                totalamount: Number(purchaseAdd.totalamount),
                expenseamount: Number(purchaseAdd.expenseamount),
                totaltaxamount: Number(totalNetTaxAmtCalc() == NaN || totalNetTaxAmtCalc() == undefined ? '0.00' : Number(totalNetTaxAmtCalc())?.toFixed(2)),
                invoiceno: String(purchaseAdd.invoiceno),
                purchasetaxmode: String(purchaseAdd.purchasetaxmode),
                purchasetaxlabmode: String(purchaseAdd.purchasetaxlabmode),
                products: [...allproductreverse],
                purchasetax: String(purchaseAdd.purchasetax),
                additionalnotes: String(purchaseAdd.additionalnotes == undefined ? "" : purchaseAdd.additionalnotes),
                totalitem: Number(totalitem),
                nettotal: Number(totalNetCostCalc()),
                advancebalance: Number(purchaseAdd.advancebalance),
                payamount: Number(purchaseAdd.payamount),
                paidon: String(paidDateTime),
                paymentmethod: String(purchaseAdd.paymentmethod),
                paydue: Number(purchaseAdd.paydue),
                balance: Number(balanceamt),
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
        // } else if (totalNetCostCalc() == 0 || totalNetCostCalc() == undefined) {
        //     setShowAlert("Please enter any one of product detail!");
        //     handleClickOpen();
        // }
        else {
            // addPurchase();

            handleStoreOpen();
        }
    }

    // all tabel product tax calculation
    function productUserInput(indexInput, productInputName, inputValue, reference = "", unituantityvalue, unitstatus, unitsubquantity, taxratevalue, taxsubarray) {
        let userInputs = allProductsList.map((value, indexList) => {
            if (indexInput == indexList) {
                if (reference == "purchasetablechange") {
                    if (inputValue == "None") {
                        if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
          
                            //quantity
                            let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(value.enteramt) - Number(disamt);
                                let differenceValue = Number(value.enteramt) + Number(disamt);
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            

                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (inputValue == "Inclusive") {
                        if(value.purchasetax == "None" && value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive"){
                           //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                           let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Number(value.enteramt) - Number(disamt);
                               let differenceValue = Number(value.enteramt) + Number(disamt);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }else if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseEx =Number(purchaseincamtfix) - (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseIn = Number(value.enteramt);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netatxamt = Number(netCostBefrTax) - Number(netCostAftTax);
                            let unittaxamt = Number(unitcostBefrTax) - Number(unitcostAftTax);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftTax)?.toFixed(2),netcostbeforediscount:Number(netCostAftTax)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostAftTax)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftTax)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitcostAftTax)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftEx =(Number(discountValue) - ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostBeforeDisTax) - Number(netCostAfterDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(value.enteramt) - Number(disamt);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftEx =(Number(discountValue) - ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostBeforeDisTax) - Number(netCostAfterDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue,differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (inputValue == "Exclusive") {
                        if(value.purchasetax == "None" && value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive"){
                           //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                           let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Number(value.enteramt) - Number(disamt);
                               let differenceValue = Number(value.enteramt) + Number(disamt);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }else if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseIn =Number(purchaseincamtfix) + (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseEx = Number(value.enteramt);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrDisc = (Number(netCostBefrDisc)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftdisc = (Number(netCostAftDisc)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           
                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netatxamt = Number(netCostAftTax) - Number(netCostBefrTax);
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftDisc)?.toFixed(2),netcostbeforediscount:Number(netCostBefrDisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostBefrDisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitcostAftTax)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostAfterDisTax) - Number(netCostBeforeDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(value.enteramt) - Number(disamt);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostAfterDisTax) - Number(netCostBeforeDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue,differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                }
                else if (reference == "taxchange") {
                    if (value.purchasetabletax == "None") {
                        if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
          
                            //quantity
                            let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let unitcostdisc = value.enteramt;
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(value.enteramt) - Number(disamt);
                                let differenceValue = Number(value.enteramt) + Number(disamt);
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            

                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Inclusive") {
                        if(inputValue == "None" && value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive"){
                           //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                           let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Number(value.enteramt) - Number(disamt);
                               let differenceValue = Number(value.enteramt) + Number(disamt);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }else if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseEx =Number(purchaseincamtfix) - (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseIn = Number(value.enteramt);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netatxamt = Number(netCostBefrTax) - Number(netCostAftTax);
                            let unittaxamt = Number(unitcostBefrTax) - Number(unitcostAftTax);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftTax)?.toFixed(2),netcostbeforediscount:Number(netCostAftTax)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostAftTax)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftTax)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitcostAftTax)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftEx =(Number(discountValue) - ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostBeforeDisTax) - Number(netCostAfterDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(value.enteramt) - Number(disamt);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftEx =(Number(discountValue) - ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostBeforeDisTax) - Number(netCostAfterDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue,differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }else if (value.purchasetabletax == "Exclusive") {
                        if(inputValue == "None" && value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive"){
                           //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                           let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Number(value.enteramt) - Number(disamt);
                               let differenceValue = Number(value.enteramt) + Number(disamt);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }else if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseIn =Number(purchaseincamtfix) + (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseEx = Number(value.enteramt);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrDisc = (Number(netCostBefrDisc)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftdisc = (Number(netCostAftDisc)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           
                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netatxamt = Number(netCostAftTax) - Number(netCostBefrTax);
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftDisc)?.toFixed(2),netcostbeforediscount:Number(netCostBefrDisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostBefrDisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitcostAftTax)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostAfterDisTax) - Number(netCostBeforeDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(value.enteramt) - Number(disamt);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostAfterDisTax) - Number(netCostBeforeDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue,differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    } 
                }
                else if (reference == "Enteramt") {
                    if (value.purchasetabletax == "None") {
                        if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(inputValue) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(inputValue) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
          
                            //quantity
                            let netCost = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let unitcostdisc = inputValue;
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(inputValue) - Number(value.disvaluemod);
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Number(inputValue) * (Number(value.disvaluemod) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(inputValue) - Number(disamt);
                                let differenceValue = Number(inputValue) + Number(disamt);
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            

                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Inclusive") {
                        if(value.purchasetax == "None" && value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive"){
                           //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(inputValue) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(inputValue) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                           let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Number(inputValue) - Number(value.disvaluemod);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Number(inputValue) * (Number(value.disvaluemod) / 100);
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Number(inputValue) - Number(disamt);
                               let differenceValue = Number(inputValue) + Number(disamt);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }else if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            let purchaseincamtfix = Number(inputValue);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseEx =Number(purchaseincamtfix) - (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseIn = Number(inputValue);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netatxamt = Number(netCostBefrTax) - Number(netCostAftTax);
                            let unittaxamt = Number(unitcostBefrTax) - Number(unitcostAftTax);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftTax)?.toFixed(2),netcostbeforediscount:Number(netCostAftTax)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostAftTax)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftTax)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitcostAftTax)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(inputValue) - Number(value.disvaluemod);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftEx =(Number(discountValue) - ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(inputValue) - (Number(inputValue) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(inputValue);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostBeforeDisTax) - Number(netCostAfterDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Number(inputValue) * (Number(value.disvaluemod) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(inputValue) - Number(disamt);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftEx =(Number(discountValue) - ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(inputValue) - (Number(inputValue) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(inputValue);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostBeforeDisTax) - Number(netCostAfterDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue,differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }else if (value.purchasetabletax == "Exclusive") {
                        if(value.purchasetax == "None" && value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive"){
                           //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(inputValue) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(inputValue) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                           let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Number(inputValue) - Number(value.disvaluemod);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Number(inputValue) * (Number(value.disvaluemod) / 100);
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Number(inputValue) - Number(disamt);
                               let differenceValue = Number(inputValue) + Number(disamt);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }else if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            let purchaseincamtfix = Number(inputValue);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseIn =Number(purchaseincamtfix) + (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseEx = Number(inputValue);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrDisc = (Number(netCostBefrDisc)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftdisc = (Number(netCostAftDisc)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           
                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netatxamt = Number(netCostAftTax) - Number(netCostBefrTax);
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftDisc)?.toFixed(2),netcostbeforediscount:Number(netCostBefrDisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostBefrDisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitcostAftTax)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(inputValue) - Number(value.disvaluemod);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(inputValue) - (Number(inputValue) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(inputValue);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostAfterDisTax) - Number(netCostBeforeDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Number(inputValue) * (Number(value.disvaluemod) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(inputValue) - Number(disamt);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(inputValue) - (Number(inputValue) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(inputValue);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostAfterDisTax) - Number(netCostBeforeDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue,differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                }
                else if (reference == "Quantity") {
                    if (value.purchasetabletax == "None") {
                        if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            let res1 = Number(value.quantitysubunitpieces == "" || value.quantitysubunitpieces == 0 ? 1 : value.quantitysubunitpieces) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? 1 : value.quantitynitpiece)
                            let resquantity = Number(value.enteramt) * Number(res1);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(inputValue) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(inputValue) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
          
                            //quantity
                            let netCost = Number(inputValue) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                            let unitcost = (Number(netCost)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                            let unitcostdisc = inputValue;
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(inputValue) - Number(value.disvaluemod);
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Number(inputValue) * (Number(value.disvaluemod) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(inputValue) - Number(disamt);
                                let differenceValue = Number(inputValue) + Number(disamt);
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            

                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Inclusive") {
                        if(value.purchasetax == "None" && value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive"){
                            let res1 = Number(value.quantitysubunitpieces == "" || value.quantitysubunitpieces == 0 ? 1 : value.quantitysubunitpieces) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? 1 : value.quantitynitpiece)
                            let resquantity = Number(value.enteramt) * Number(res1);
                            //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(inputValue) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(inputValue) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                           let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Number(inputValue) - Number(value.disvaluemod);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Number(inputValue) * (Number(value.disvaluemod) / 100);
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Number(inputValue) - Number(disamt);
                               let differenceValue = Number(inputValue) + Number(disamt);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }else if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            let res1 = Number(value.quantitysubunitpieces == "" || value.quantitysubunitpieces == 0 ? 1 : value.quantitysubunitpieces) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? 1 : value.quantitynitpiece)
                            let resquantity = Number(value.enteramt) * Number(res1);
                            let purchaseincamtfix = Number(inputValue);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseEx =Number(purchaseincamtfix) - (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseIn = Number(inputValue);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netatxamt = Number(netCostBefrTax) - Number(netCostAftTax);
                            let unittaxamt = Number(unitcostBefrTax) - Number(unitcostAftTax);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftTax)?.toFixed(2),netcostbeforediscount:Number(netCostAftTax)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostAftTax)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftTax)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitcostAftTax)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(inputValue) - Number(value.disvaluemod);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftEx =(Number(discountValue) - ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(inputValue) - (Number(inputValue) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(inputValue);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostBeforeDisTax) - Number(netCostAfterDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Number(inputValue) * (Number(value.disvaluemod) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(inputValue) - Number(disamt);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftEx =(Number(discountValue) - ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(inputValue) - (Number(inputValue) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(inputValue);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostBeforeDisTax) - Number(netCostAfterDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue,differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Exclusive") {
                        if(value.purchasetax == "None" && value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive"){
                            let res1 = Number(value.quantitysubunitpieces == "" || value.quantitysubunitpieces == 0 ? 1 : value.quantitysubunitpieces) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? 1 : value.quantitynitpiece)
                            let resquantity = Number(value.enteramt) * Number(res1);
                            //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(inputValue) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(inputValue) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                           let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Number(inputValue) - Number(value.disvaluemod);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Number(inputValue) * (Number(value.disvaluemod) / 100);
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Number(inputValue) - Number(disamt);
                               let differenceValue = Number(inputValue) + Number(disamt);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }else if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            let res1 = Number(value.quantitysubunitpieces == "" || value.quantitysubunitpieces == 0 ? 1 : value.quantitysubunitpieces) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? 1 : value.quantitynitpiece)
                            let resquantity = Number(value.enteramt) * Number(res1);
                            let purchaseincamtfix = Number(inputValue);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseIn =Number(purchaseincamtfix) + (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseEx = Number(inputValue);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrDisc = (Number(netCostBefrDisc)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftdisc = (Number(netCostAftDisc)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           
                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netatxamt = Number(netCostAftTax) - Number(netCostBefrTax);
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftDisc)?.toFixed(2),netcostbeforediscount:Number(netCostBefrDisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostBefrDisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitcostAftTax)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(inputValue) - Number(value.disvaluemod);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(inputValue) - (Number(inputValue) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(inputValue);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostAfterDisTax) - Number(netCostBeforeDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Number(inputValue) * (Number(value.disvaluemod) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(inputValue) - Number(disamt);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(inputValue) - (Number(inputValue) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(inputValue);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(inputValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostAfterDisTax) - Number(netCostBeforeDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue,differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }


                    if (value.purchasetabletax == "None") {
                        if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            let res1 = Number(value.quantitysubunitpieces == "" || value.quantitysubunitpieces == 0 ? 1 : value.quantitysubunitpieces) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? 1 : value.quantitynitpiece)
                            let resquantity = Number(value.enteramt) * Number(res1);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
          
                            //quantity
                            let netCost = Number(value.enteramt) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                            let unitcost = (Number(netCost)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                            let unitcostdisc = value.enteramt;
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces:value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity, disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces:value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(value.enteramt) - Number(disamt);
                                let differenceValue = Number(value.enteramt) + Number(disamt);
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            

                                return { ...value, [productInputName]: inputValue, quantitytotalpieces:value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Inclusive") {
                        if(value.purchasetax == "None" && value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive"){
                            let res1 = Number(value.quantitysubunitpieces == "" || value.quantitysubunitpieces == 0 ? 1 : value.quantitysubunitpieces) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? 1 : value.quantitynitpiece)
                                let resquantity = Number(value.enteramt) * Number(res1);
                            //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(value.enteramt) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                           let unitcost = (Number(netCost)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue, quantitytotalpieces:value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity, disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, quantitytotalpieces:value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Number(value.enteramt) - Number(disamt);
                               let differenceValue = Number(value.enteramt) + Number(disamt);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, quantitytotalpieces:value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }else if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            let res1 = Number(value.quantitysubunitpieces == "" || value.quantitysubunitpieces == 0 ? 1 : value.quantitysubunitpieces) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? 1 : value.quantitynitpiece)
                            let resquantity = Number(value.enteramt) * Number(res1);
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseEx =Number(purchaseincamtfix) - (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseIn = Number(value.enteramt);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrTax = Number(purchaseIn) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                            let netCostAftTax = Number(purchaseEx) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                            let netatxamt = Number(netCostBefrTax) - Number(netCostAftTax);
                            let unittaxamt = Number(unitcostBefrTax) - Number(unitcostAftTax);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces:value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity, disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftTax)?.toFixed(2),netcostbeforediscount:Number(netCostAftTax)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostAftTax)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftTax)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitcostAftTax)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftEx =(Number(discountValue) - ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftEx) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)); 
                        
                                let netatxamt = Number(netCostBeforeDisTax) - Number(netCostAfterDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces:value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(value.enteramt) - Number(disamt);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftEx =(Number(discountValue) - ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)); 
                        
                                let netatxamt = Number(netCostBeforeDisTax) - Number(netCostAfterDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces:value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity,  differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }else if (value.purchasetabletax == "Exclusive") {
                        if(value.purchasetax == "None" && value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive"){
                            let res1 = Number(value.quantitysubunitpieces == "" || value.quantitysubunitpieces == 0 ? 1 : value.quantitysubunitpieces) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? 1 : value.quantitynitpiece)
                            let resquantity = Number(value.enteramt) * Number(res1);
                            //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(value.enteramt) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                           let unitcost = (Number(netCost)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue, quantitytotalpieces:value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity, disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, quantitytotalpieces:value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Number(value.enteramt) - Number(disamt);
                               let differenceValue = Number(value.enteramt) + Number(disamt);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, quantitytotalpieces:value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }else if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            let res1 = Number(value.quantitysubunitpieces == "" || value.quantitysubunitpieces == 0 ? 1 : value.quantitysubunitpieces) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? 1 : value.quantitynitpiece)
                            let resquantity = Number(value.enteramt) * Number(res1);
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseIn =Number(purchaseincamtfix) + (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseEx = Number(value.enteramt);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrDisc = Number(purchaseEx) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                            let unitcostBefrDisc = (Number(netCostBefrDisc)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                            let netCostAftDisc = Number(purchaseEx) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                            let unitcostAftdisc = (Number(netCostAftDisc)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                           
                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                            let netatxamt = Number(netCostAftTax) - Number(netCostBefrTax);
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces:value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity, disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftDisc)?.toFixed(2),netcostbeforediscount:Number(netCostBefrDisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostBefrDisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitcostAftTax)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(purchaseDiscAftEx) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)); 
                        
                                let netatxamt = Number(netCostAfterDisTax) - Number(netCostBeforeDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces:value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(value.enteramt) - Number(disamt);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity == 0 ? 1 : resquantity)); 
                        
                                let netatxamt = Number(netCostAfterDisTax) - Number(netCostBeforeDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces:value.quantitynitpiece == "" || value.quantitynitpiece == 0 ? inputValue:resquantity, differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                }
                else if (reference == "Quantityunit") {
                    
                    if (value.purchasetabletax == "None" && unitstatus == true) {
                        if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
          
                            //quantity
                            let netCost = Number(value.enteramt) * Number(value.quantity == "" || 0 ? 1 : value.quantity)
                            let unitcost = (Number(netCost)/Number(value.quantity == "" || 0 ? 1 : value.quantity));
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces:value.quantity,quantityunitstatus:true, quantitysubunitpieces:unitsubquantity, disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantity == "" || 0 ? 1 : value.quantity)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantity));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantity == "" || 0 ? 1 : value.quantity)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantity));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces:value.quantity,quantityunitstatus:true, quantitysubunitpieces:unitsubquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(value.enteramt) - Number(disamt);
                                let differenceValue = Number(value.enteramt) + Number(disamt);
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantity == "" || 0 ? 1 : value.quantity)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantity));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantity == "" || 0 ? 1 : value.quantity)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantity));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            

                                return { ...value, [productInputName]: inputValue, quantitytotalpieces:value.quantity,quantityunitstatus:true, quantitysubunitpieces:unitsubquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (unitstatus == true && value.purchasetabletax == "Exclusive" || value.purchasetabletax == "Inclusive") {
                        if(value.purchasetax == "None" && value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive"){
                            let res1 = Number(unitsubquantity) * Number(unituantityvalue)
                            let resquantity = Number(value.quantity) * Number(res1) 
                            //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(value.enteramt) * Number(resquantity)
                           let unitcost = (Number(netCost)/Number(resquantity));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue, quantitytotalpieces:resquantity,quantityunitstatus:true, quantitysubunitpieces:unitsubquantity, disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(resquantity)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(resquantity));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(resquantity)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(resquantity));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, quantitytotalpieces:resquantity,quantityunitstatus:true, quantitysubunitpieces:unitsubquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Number(value.enteramt) - Number(disamt);
                               let differenceValue = Number(value.enteramt) + Number(disamt);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(resquantity)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(resquantity));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(resquantity)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(resquantity));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, quantitytotalpieces:resquantity,quantityunitstatus:true, quantitysubunitpieces:unitsubquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }else if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            let res1 = Number(unitsubquantity) * Number(unituantityvalue)
                            let resquantity = Number(value.quantity) * Number(res1);
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseEx =Number(purchaseincamtfix) - (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseIn = Number(value.enteramt);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrTax = Number(purchaseIn) * Number(resquantity)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(resquantity));
                            let netCostAftTax = Number(purchaseEx) * Number(resquantity)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(resquantity));
                            let netatxamt = Number(netCostBefrTax) - Number(netCostAftTax);
                            let unittaxamt = Number(unitcostBefrTax) - Number(unitcostAftTax);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces:resquantity,quantityunitstatus:true, quantitysubunitpieces:unitsubquantity, disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftTax)?.toFixed(2),netcostbeforediscount:Number(netCostAftTax)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostAftTax)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftTax)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitcostAftTax)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftEx =(Number(discountValue) - ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(resquantity)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(resquantity));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(resquantity)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(resquantity));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(resquantity)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(resquantity));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftEx) * Number(resquantity)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(resquantity)); 
                        
                                let netatxamt = Number(netCostBeforeDisTax) - Number(netCostAfterDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces:resquantity,quantityunitstatus:true, quantitysubunitpieces:unitsubquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(value.enteramt) - Number(disamt);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftEx =(Number(discountValue) - ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(resquantity)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(resquantity));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(resquantity)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(resquantity));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(resquantity)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(resquantity));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftEx) * Number(resquantity)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(resquantity)); 
                        
                                let netatxamt = Number(netCostBeforeDisTax) - Number(netCostAfterDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces:resquantity,quantityunitstatus:true, quantitysubunitpieces:unitsubquantity, differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "None") {
                        if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            let res1 = Number(unitsubquantity) * Number(unituantityvalue)
                            let resquantity = Number(value.quantity) * Number(res1) 
                            
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
          
                            //quantity
                            let netCost = Number(value.enteramt) * Number(resquantity)
                            let unitcost = (Number(netCost)/Number(resquantity));
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces:resquantity,quantityunitstatus:false, quantitynitpiece:unituantityvalue,quantitysubunitpieces:unitsubquantity,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let res1 = Number(unitsubquantity) * Number(unituantityvalue)
                                let resquantity = Number(value.quantity) * Number(res1) 
                                let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(resquantity)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(resquantity));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(resquantity)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(resquantity));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces:resquantity,quantityunitstatus:false, quantitynitpiece:unituantityvalue,quantitysubunitpieces:unitsubquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let res1 = Number(unitsubquantity) * Number(unituantityvalue)
                                let resquantity = Number(value.quantity) * Number(res1) 
                                let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(value.enteramt) - Number(disamt);
                                let differenceValue = Number(value.enteramt) + Number(disamt);
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(resquantity)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(resquantity));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(resquantity)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(resquantity));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            

                                return { ...value, [productInputName]: inputValue, quantitytotalpieces:resquantity,quantityunitstatus:false, quantitynitpiece:unituantityvalue,quantitysubunitpieces:unitsubquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Exclusive" || value.purchasetabletax == "Inclusive") {
                        if(value.purchasetax == "None" && value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive"){
                            let res1 = Number(unitsubquantity) * Number(unituantityvalue)
                            let resquantity = Number(value.quantity) * Number(res1) 
                           //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);

         
                           //quantity
                           let netCost = Number(value.enteramt) * Number(resquantity)
                           let unitcost = (Number(netCost)/Number(resquantity));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue,quantitytotalpieces:resquantity,quantityunitstatus:false, quantitynitpiece:unituantityvalue,quantitysubunitpieces:unitsubquantity,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(resquantity)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(resquantity));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(resquantity)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(resquantity));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, quantitytotalpieces:resquantity,quantityunitstatus:false, quantitynitpiece:unituantityvalue,quantitysubunitpieces:unitsubquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Number(value.enteramt) - Number(disamt);
                               let differenceValue = Number(value.enteramt) + Number(disamt);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(resquantity)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(resquantity));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(resquantity)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(resquantity));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, quantitytotalpieces:resquantity,quantityunitstatus:false, quantitynitpiece:unituantityvalue,quantitysubunitpieces:unitsubquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }else if(value.purchasetax != "None" && value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            let res1 = Number(unitsubquantity) * Number(unituantityvalue)
                            let resquantity = Number(value.quantity) * Number(res1) 
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseEx =Number(purchaseincamtfix) - (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseIn = Number(value.enteramt);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrTax = Number(purchaseIn) * Number(resquantity)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(resquantity));
                            let netCostAftTax = Number(purchaseEx) * Number(resquantity)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(resquantity));
                            let netatxamt = Number(netCostBefrTax) - Number(netCostAftTax);
                            let unittaxamt = Number(unitcostBefrTax) - Number(unitcostAftTax);
                           
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces:resquantity,quantityunitstatus:false, quantitynitpiece:unituantityvalue,quantitysubunitpieces:unitsubquantity, disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftTax)?.toFixed(2),netcostbeforediscount:Number(netCostAftTax)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostAftTax)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftTax)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitcostAftTax)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftEx =(Number(discountValue) - ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(resquantity)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(resquantity));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(resquantity)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(resquantity));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(resquantity)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(resquantity));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftEx) * Number(resquantity)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(resquantity)); 
                        
                                let netatxamt = Number(netCostBeforeDisTax) - Number(netCostAfterDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces:resquantity,quantityunitstatus:false, quantitynitpiece:unituantityvalue,quantitysubunitpieces:unitsubquantity, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(value.enteramt) - Number(disamt);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftEx =(Number(discountValue) - ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(resquantity)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(resquantity));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(resquantity)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(resquantity));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(resquantity)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(resquantity));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftEx) * Number(resquantity)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(resquantity)); 
                        
                                let netatxamt = Number(netCostBeforeDisTax) - Number(netCostAfterDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue, quantitytotalpieces:resquantity,quantityunitstatus:false, quantitynitpiece:unituantityvalue,quantitysubunitpieces:unitsubquantity, differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    } 
                }
                else if (reference == "Discountmode") {
                    if (value.purchasetabletax == "None") {
                        if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
          
                            //quantity
                            let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let unitcostdisc = value.enteramt;
                            //discount
                            if (inputValue == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (inputValue == "Fixed" || inputValue == "Amount") {
                                let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (inputValue == "Percentage") {
                                let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(value.enteramt) - Number(disamt);
                                let differenceValue = Number(value.enteramt) + Number(disamt);
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            

                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Inclusive") {
                        if(value.purchasetax == "None" && value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive"){
                           //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                           let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           //discount
                           if (inputValue == "None") {
                               return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (inputValue == "Fixed" || inputValue == "Amount") {
                               let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (inputValue == "Percentage") {
                               let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Number(value.enteramt) - Number(disamt);
                               let differenceValue = Number(value.enteramt) + Number(disamt);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }else if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseEx =Number(purchaseincamtfix) - (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseIn = Number(value.enteramt);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netatxamt = Number(netCostBefrTax) - Number(netCostAftTax);
                            let unittaxamt = Number(unitcostBefrTax) - Number(unitcostAftTax);
                            //discount
                            if (inputValue == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftTax)?.toFixed(2),netcostbeforediscount:Number(netCostAftTax)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostAftTax)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftTax)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitcostAftTax)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (inputValue == "Fixed" || inputValue == "Amount") {
                                let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftEx =(Number(discountValue) - ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostBeforeDisTax) - Number(netCostAfterDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (inputValue == "Percentage") {
                                let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(value.enteramt) - Number(disamt);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftEx =(Number(discountValue) - ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostBeforeDisTax) - Number(netCostAfterDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue,differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }else if (value.purchasetabletax == "Exclusive") {
                        if(value.purchasetax == "None" && value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive"){
                           //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                           let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           //discount
                           if (inputValue == "None") {
                               return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (inputValue == "Fixed" || inputValue == "Amount") {
                               let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (inputValue == "Percentage") {
                               let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Number(value.enteramt) - Number(disamt);
                               let differenceValue = Number(value.enteramt) + Number(disamt);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }else if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseIn =Number(purchaseincamtfix) + (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseEx = Number(value.enteramt);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrDisc = (Number(netCostBefrDisc)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftdisc = (Number(netCostAftDisc)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           
                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netatxamt = Number(netCostAftTax) - Number(netCostBefrTax);
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            //discount
                            if (inputValue == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftDisc)?.toFixed(2),netcostbeforediscount:Number(netCostBefrDisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostBefrDisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitcostAftTax)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (inputValue == "Fixed" || inputValue == "Amount") {
                                let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostAfterDisTax) - Number(netCostBeforeDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (inputValue == "Percentage") {
                                let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(value.enteramt) - Number(disamt);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostAfterDisTax) - Number(netCostBeforeDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue,differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                }
                else if (reference == "Discountvalue") {
                    if (value.purchasetabletax == "None") {
                        if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
          
                            //quantity
                            let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let unitcostdisc = value.enteramt;
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(value.enteramt) - Number(inputValue);
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Number(value.enteramt) * (Number(inputValue) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(value.enteramt) - Number(disamt);
                                let differenceValue = Number(value.enteramt) + Number(disamt);
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            

                                return { ...value, [productInputName]: inputValue, differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Inclusive") {
                        if(value.purchasetax == "None" && value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive"){
                           //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                           let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Number(value.enteramt) - Number(inputValue);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Number(value.enteramt) * (Number(inputValue) / 100);
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Number(value.enteramt) - Number(disamt);
                               let differenceValue = Number(value.enteramt) + Number(disamt);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue,  differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }else if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseEx =Number(purchaseincamtfix) - (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseIn = Number(value.enteramt);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netatxamt = Number(netCostBefrTax) - Number(netCostAftTax);
                            let unittaxamt = Number(unitcostBefrTax) - Number(unitcostAftTax);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftTax)?.toFixed(2),netcostbeforediscount:Number(netCostAftTax)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostAftTax)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftTax)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitcostAftTax)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(value.enteramt) - Number(inputValue);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftEx =(Number(discountValue) - ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostBeforeDisTax) - Number(netCostAfterDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue,  differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Number(value.enteramt) * (Number(inputValue) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(value.enteramt) - Number(disamt);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftEx =(Number(discountValue) - ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostBeforeDisTax) - Number(netCostAfterDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue,differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Exclusive") {
                        if(value.purchasetax == "None" && value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive"){
                           //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(value.enteramt) * (Number(value.margin) / 100));
                           let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                           let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Number(value.enteramt) - Number(inputValue);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Number(value.enteramt) * (Number(inputValue) / 100);
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Number(value.enteramt) - Number(disamt);
                               let differenceValue = Number(value.enteramt) + Number(disamt);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(value.margin) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }else if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseIn =Number(purchaseincamtfix) + (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseEx = Number(value.enteramt);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(value.margin) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrDisc = (Number(netCostBefrDisc)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftdisc = (Number(netCostAftDisc)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           
                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netatxamt = Number(netCostAftTax) - Number(netCostBefrTax);
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftDisc)?.toFixed(2),netcostbeforediscount:Number(netCostBefrDisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostBefrDisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitcostAftTax)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(value.enteramt) - Number(inputValue);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostAfterDisTax) - Number(netCostBeforeDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Number(value.enteramt) * (Number(inputValue) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(value.enteramt) - Number(disamt);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostAfterDisTax) - Number(netCostBeforeDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(value.margin) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue,differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                }
                else if (reference == "Free") {
                    setAlltotalItems((alltotalitems) => {
                        let allItems = [...alltotalitems];
                        allItems[indexInput] = { ...totalItem, freeitem: inputValue };
                        return allItems;

                    });
                    return { ...value, [productInputName]: inputValue, freeitemtotalpieces:inputValue };
                }
                else if(reference == "Free Unit"){
                  
                    let res1 = Number(unitsubquantity) * Number(unituantityvalue)
                    let resquantity = Number(value.freeitem) * Number(res1) 
                    
                    return { ...value, [productInputName]: inputValue, freeitemtotalpieces:resquantity == "" || resquantity == 0 ? value.freeitem : resquantity,freeitemunitstatus:false, freeitemnitpiece:unituantityvalue,freeitemsubunitpieces:unitsubquantity, };
                }
                else if (reference == "Margin data") {
                    if (value.purchasetabletax == "None") {
                        if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(value.enteramt) * (Number(inputValue) / 100));
                            let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
          
                            //quantity
                            let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let unitcostdisc = value.enteramt;
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(inputValue) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(value.enteramt) - Number(disamt);
                                let differenceValue = Number(value.enteramt) + Number(disamt);
                                
                                //before disc netcost && unit 
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                //after disc netcost
                                let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                                
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(inputValue) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            

                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Inclusive") {
                        if(value.purchasetax == "None" && value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive"){
                           //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(value.enteramt) * (Number(inputValue) / 100));
                           let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                           let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(inputValue) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Number(value.enteramt) - Number(disamt);
                               let differenceValue = Number(value.enteramt) + Number(disamt);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(inputValue) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: Number(unitcostaftdisc)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcostaftdisc)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }else if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseEx =Number(purchaseincamtfix) - (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseIn = Number(value.enteramt);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(inputValue) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netatxamt = Number(netCostBefrTax) - Number(netCostAftTax);
                            let unittaxamt = Number(unitcostBefrTax) - Number(unitcostAftTax);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftTax)?.toFixed(2),netcostbeforediscount:Number(netCostAftTax)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostAftTax)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftTax)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitcostAftTax)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftEx =(Number(discountValue) - ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostBeforeDisTax) - Number(netCostAfterDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(inputValue) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(value.enteramt) - Number(disamt);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftEx =(Number(discountValue) - ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftIn = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostBeforeDisTax) - Number(netCostAfterDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(inputValue) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue,differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                    else if (value.purchasetabletax == "Exclusive") {
                        if(value.purchasetax == "None" && value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive"){
                           //selling price exclusive purchase price exclusive unit cost
                           let sellingvaluemargin = (Number(value.enteramt) * (Number(inputValue) / 100));
                           let sellingExmargin = Number(value.enteramt) + Number(sellingvaluemargin);
                           let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                           let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                           let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                           let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                           let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                           let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
         
                           //quantity
                           let netCost = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                           let unitcost = (Number(netCost)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           //discount
                           if (value.distypemod == "None") {
                               return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCost)?.toFixed(2),netcostbeforediscount:Number(netCost)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCost)?.toFixed(2),unitcostbeforediscount: Number(unitcost)?.toFixed(2),unitcostafterdiscount:Number(unitcost)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcost)?.toFixed(2),purchaseexcludetax: Number(unitcost)?.toFixed(2), pruchaseincludetax: Number(unitcost)?.toFixed(2), incalpha: getAlphaRateInc(Number(unitcost)?.toFixed(0)), excalpha: getAlphaRate(Number(unitcost)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                               let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(inputValue) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amoount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           
                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                           else if (value.distypemod == "Percentage") {
                               let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                               // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                               let discountValue = Number(value.enteramt) - Number(disamt);
                               let differenceValue = Number(value.enteramt) + Number(disamt);
                               
                               //before disc netcost && unit 
                               let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostbrfdisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                               //after disc netcost
                               let netCostAftdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                               let unitcostaftdisc = (Number(netCostAftdisc)/Number(value.quantitytotalpieces));
                               
                               //selling price exclusive purchase price exclusive unit cost
                               let sellingvaluemargin = (Number(unitcostaftdisc) * (Number(inputValue) / 100));
                               //sell bef tax
                               let sellingExmargin = Number(unitcostaftdisc) + Number(sellingvaluemargin);
                               let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                               let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                               let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                               let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                               //sell aft tax
                               let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                               //sell tax amount
                               let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
           

                               return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(disamt)?.toFixed(2), netcostafterdiscount:Number(netCostAftdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:"0.00",netcostwithtax:Number(netCostAftdisc)?.toFixed(2),unitcostbeforediscount: Number(unitcostbrfdisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostaftdisc)?.toFixed(2),unitcosttaxamount: "0.00",unitcostwithtax:Number(unitcostaftdisc)?.toFixed(2),purchaseexcludetax: Number(unitcostaftdisc)?.toFixed(2), pruchaseincludetax: "0.00", incalpha: "", excalpha: getAlphaRate(Number(unitcostaftdisc)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                           }
                        }else if (value.sellingpricetax == "Exclusive" || value.sellingpricetax == "Inclusive") {
                            let purchaseincamtfix = Number(value.enteramt);
                            let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                            let purchaseIn =Number(purchaseincamtfix) + (Number(purchaseincamtfix) * ((Number(tax)) / Number(100)));
                            let purchaseEx = Number(value.enteramt);
                            //selling price exclusive purchase price exclusive unit cost
                            let sellingvaluemargin = (Number(purchaseEx) * (Number(inputValue) / 100));
                            let sellingExmargin = Number(purchaseEx) + Number(sellingvaluemargin);
                            let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                            let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                            let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                            let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                            let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                            let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                            //quantity
                            let netCostBefrDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrDisc = (Number(netCostBefrDisc)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftDisc = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftdisc = (Number(netCostAftDisc)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                           
                            let netCostBefrTax = Number(purchaseEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostBefrTax = (Number(netCostBefrTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netCostAftTax = Number(purchaseIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                            let unitcostAftTax = (Number(netCostAftTax)/Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces));
                            let netatxamt = Number(netCostAftTax) - Number(netCostBefrTax);
                            let unittaxamt = Number(unitcostAftTax) - Number(unitcostBefrTax);
                            //discount
                            if (value.distypemod == "None") {
                                return { ...value, [productInputName]: inputValue,disvaluemod:"0.00", differenceamt:"0.00", netcostafterdiscount:Number(netCostAftDisc)?.toFixed(2),netcostbeforediscount:Number(netCostBefrDisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAftTax)?.toFixed(2),unitcostbeforediscount: Number(unitcostBefrDisc)?.toFixed(2),unitcostafterdiscount:Number(unitcostAftdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitcostAftTax)?.toFixed(2),purchaseexcludetax: Number(purchaseEx)?.toFixed(2), pruchaseincludetax: Number(purchaseIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Fixed" || value.distypemod == "Amount") {
                                let discountValue = Number(value.enteramt) - Number(value.disvaluemod);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(purchaseDiscAftEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostAfterDisTax) - Number(netCostBeforeDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);
                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(inputValue) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
            
                                return { ...value, [productInputName]: inputValue, disvaluemod: Number(value?.disvaluemod)?.toFixed(2), differenceamt: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }
                            else if (value.distypemod == "Percentage") {
                                let disamt = Number(value.enteramt) * (Number(value.disvaluemod) / 100);
                                // let totpiecedis = Number(value.quantitytotalpieces) * Number(disamt);
                                let discountValue = Number(value.enteramt) - Number(disamt);
                                //exclude and include with disc
                                let tax = value.purchasetaxrate == undefined || "" ? 0 : value.purchasetaxrate;
                                let purchaseDiscAftIn =(Number(discountValue) + ((Number(discountValue) * ((Number(tax)) / Number(100)))));
                                let purchaseDiscAftEx = Number(discountValue);
                                //exclude and include without disc
                                let purchaseDiscBfrEx =Number(value.enteramt) - (Number(value.enteramt) * ((Number(tax)) / Number(100)));
                                let purchaseDiscBfrIn = Number(value.enteramt);

                                //unit nad net cost before discount
                                let netCostBeforedisc = Number(value.enteramt) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforedisc = (Number(netCostBeforedisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost after discount
                                let netCostAfterdisc = Number(discountValue) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterdisc = (Number(netCostAfterdisc)/Number(value.quantitytotalpieces));
                                
                                //unit and net cost before disc with tax
                                let netCostBeforeDisTax = Number(purchaseDiscBfrEx) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostBeforeDisTax = (Number(netCostBeforeDisTax)/Number(value.quantitytotalpieces));

                                //unit and net cost after disc with tax
                                let netCostAfterDisTax = Number(purchaseDiscAftIn) * Number(value.quantitytotalpieces == "" || 0 ? 1 : value.quantitytotalpieces)
                                let unitCostAfterDisTax = (Number(netCostAfterDisTax)/Number(value.quantitytotalpieces)); 
                        
                                let netatxamt = Number(netCostAfterDisTax) - Number(netCostBeforeDisTax);
                                let unittaxamt = Number(purchaseDiscAftIn) - Number(purchaseDiscAftEx);

                                //selling price exclusive purchase price exclusive unit cost
                                let sellingvaluemargin = (Number(purchaseDiscAftEx) * (Number(inputValue) / 100));
                                //sell bef tax
                                let sellingExmargin = Number(purchaseDiscAftEx) + Number(sellingvaluemargin);
                                let taxhsn = value?.hsntax == undefined || "" ? 0 : value?.hsntax;
                                let taxapplicable = value?.applicabletaxrate == undefined || "" ? 0 : value?.applicabletaxrate;
                                let sellingtaxamt = (Number((taxhsn != 0 ? Number(taxhsn) : Number(taxapplicable)) / 100));
                                let sellingvaluetax = (Number(sellingExmargin) * Number(sellingtaxamt));
                                //sell aft tax
                                let sellingExcludevaluetax = Number(sellingExmargin) + Number(sellingvaluetax);
                                //sell tax amoount
                                let selltax = Number(sellingExcludevaluetax) - Number(sellingExmargin);
                                return { ...value, [productInputName]: inputValue,differenceamt: Number(disamt)?.toFixed(2), disvaluemod: Number(value?.disvaluemod)?.toFixed(2), netcostafterdiscount:Number(netCostAfterdisc)?.toFixed(2),netcostbeforediscount:Number(netCostBeforedisc)?.toFixed(2),netcosttaxamount:Number(netatxamt)?.toFixed(2),netcostwithtax:Number(netCostAfterDisTax)?.toFixed(2),unitcostbeforediscount: Number(unitCostBeforedisc)?.toFixed(2),unitcostafterdiscount:Number(unitCostAfterdisc)?.toFixed(2),unitcosttaxamount: Number(unittaxamt)?.toFixed(2),unitcostwithtax:Number(unitCostAfterDisTax)?.toFixed(2),purchaseexcludetax: Number(purchaseDiscAftEx)?.toFixed(2), pruchaseincludetax: Number(purchaseDiscAftIn)?.toFixed(2), incalpha: getAlphaRateInc(Number(purchaseDiscAftIn)?.toFixed(0)), excalpha: getAlphaRate(Number(purchaseDiscAftEx)?.toFixed(0)),sellingpriceunitcost: Number(sellingExcludevaluetax)?.toFixed(2), sellingpriceunitwithoutcost:Number(sellingExmargin)?.toFixed(2), saletaxamount:(selltax)?.toFixed(2) }
                            }

                        }
                    }
                }
                return { ...value, [productInputName]: inputValue }
                }
            else {
                return value;
            }
        });
        setAllProductsList(userInputs);
    }


    function totalNetCostCalc() {
        let totalvalue = 0;
        if (allProductsList?.length > 0) {
            allProductsList?.forEach((value) => {
                totalvalue += Number(value.netcostwithtax)
            })
            return Number(totalvalue)?.toFixed(2);
        }
    }

    function totalNetTaxAmtCalc() {
        if (allProductsList?.length > 0) {
            allProductsList?.forEach((value) => {
                totalalltaxamt += Number(value.netcosttaxamount == "" ? 0 : value.netcosttaxamount)
            })
            return Number(totalalltaxamt)?.toFixed(2);
        }
    }

    let balanceamtval = Number(purchaseAdd.billamount) ? Number(purchaseAdd.billamount) : 0;
    balanceamt = ((balanceamtval ? balanceamtval : 0) - (Number(totalNetCostCalc()))?.toFixed(2) ? Number(totalNetCostCalc())?.toFixed(2) : 0)

    // total quantity and free item calculation
    let totalitem = 0.00;
    {
        allProductsList && (
            allProductsList.forEach(
                (item => {
                    totalitem += +item.quantity + +item.freeitem
                })
            ))
    }

    function payDueCalc() {
        setPurchaseAdd(
            { ...purchaseAdd, paydue: totalNetCostCalc() == undefined ? 0 : Number(totalNetCostCalc()) - Number(purchaseAdd.payamount) }
        )
    }

    useEffect(
        () => {
            payDueCalc();
        }, [purchaseAdd]
    )

    //change form
  const handleBillAmt = (e) => {
    // Regular expression to match only positive numeric values
    const regex = /^[0-9]+$/;  // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === '') {
      // Update the state with the valid numeric value
      setPurchaseAdd({ ...purchaseAdd, billamount: inputValue, businesslocation: setngs?.businesslocation, totalamount:Number(inputValue)+Number(purchaseAdd.expenseamount)+Number(purchaseAdd.freightamount) });
    }
  };

  const handleFreightAmt = (e) => {
    // Regular expression to match only positive numeric values
    const regex = /^[0-9]+$/;  // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === '') {
      // Update the state with the valid numeric value
      setPurchaseAdd({ ...purchaseAdd, freightamount: inputValue, totalamount:Number(purchaseAdd.billamount)+Number(purchaseAdd.expenseamount)+Number(inputValue) });
    }
  };

  const handleExpenseAmt = (e) => {
    // Regular expression to match only positive numeric values
    const regex = /^[0-9]+$/;  // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === '') {
      // Update the state with the valid numeric value
      setPurchaseAdd({ ...purchaseAdd, expenseamount: inputValue, totalamount:Number(purchaseAdd.billamount)+Number(inputValue)+Number(purchaseAdd.freightamount) });
    }
  };

  const handlePayAmt = (e) => {
    // Regular expression to match only positive numeric values
    const regex = /^[0-9]+$/;  // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === '') {
      // Update the state with the valid numeric value
      setPurchaseAdd({ ...purchaseAdd, payamount: inputValue });
    }
  };


    // Delete Searched Product
    const deleteRow = (i, e) => {
        setAllProductsList(allProductsList.filter((v, item) => item !== i));
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
                                            }); searchAdd(e._id)
                                        }}
                                    />
                                </FormControl>
                                <Grid sx={userStyle.spanIcons} style={{ paddingRight: '5px' }}>
                                    <Purchasesupplieradd setIsSupplierFetch={setIsSupplierFetch} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12}>
                            <InputLabel >Reference No</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    value={purchases}
                                    name="referenceno"
                                />
                            </FormControl>
                            <Typography variant='body2' sx={{ opacity: '0.9', marginTop: '5px' }}>Leave empty to autogenerate</Typography>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12}>
                            <InputLabel >Purchase Date</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={purchaseAdd.purchasedate}
                                    type="date"
                                    onChange={(e) => { setPurchaseAdd({ ...purchaseAdd, purchasedate: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12}>
                            <InputLabel >Bill Amount</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={purchaseAdd.billamount}
                                    type="number"
                                    onChange={(e) => { handleBillAmt(e); }}
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
                        <Grid item md={3} sm={6} xs={12}>
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
                        <Grid item md={3} sm={6} xs={12}>
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
                        <Grid item md={3} sm={6} xs={12}>
                            <InputLabel >Invoice No</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={purchaseAdd.invoiceno}
                                    placeholder='Enter invoice number'
                                    type="text"
                                    onChange={(e) => { setPurchaseAdd({ ...purchaseAdd, invoiceno: e.target.value }) }}
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
                            >{ totalNetTaxAmtCalc() == NaN || totalNetTaxAmtCalc() == undefined ? 0 : Number(totalNetTaxAmtCalc())?.toFixed(2)}</Typography>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Expense Amount</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={purchaseAdd.expenseamount}
                                    type="number"
                                    onChange={(e) => { handleExpenseAmt(e);  }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12}>
                            <InputLabel >Freight Amount</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={purchaseAdd.freightamount}
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
                <Box sx={userStyle.container} style={{ minHeight: '300px', }}>
                    <Grid container style={{ justifyContent: "center", padding: '10px' }} sx={userStyle.textInput} >
                        <Grid md={8} sx={12} xs={12}>
                            <Grid sx={{ display: 'flex' }} >
                                <Grid sx={userStyle.spanIconTax}>< FaSearch /></Grid>
                                <FormControl size="small" fullWidth >
                                    <Selects
                                        styles={colourStyles}
                                        placeholder="Enter Product Name / SKU "
                                        options={productsList}
                                        onChange={(e) => {
                                            gethsncode(e)
                                        }}
                                    />
                                </FormControl>
                                <Grid sx={userStyle.spanIcons}>
                                    <Purchaseproductadd setFetchsaveproduct={setFetchsaveproduct} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <br />
                    <TableContainer component={Paper} sx={userStyle.tablecontainer}>
                        <Table aria-label="customized table">
                            <TableHead >
                                <StyledTableRow>
                                    <TableCell sx={userStyle.tableHead1}>Purchase Tax</TableCell>
                                    <TableCell sx={userStyle.tableHead1}>Rate/Quantity</TableCell>
                                    <TableCell sx={userStyle.tableHead1}>Discount Unit Cost</TableCell>
                                    <TableCell sx={userStyle.tableHead1}>Unit Tax</TableCell>
                                    <TableCell sx={userStyle.tableHead1}>Purchase Rate</TableCell>
                                    <TableCell sx={userStyle.tableHead1}>Purchase Cost</TableCell>
                                    <TableCell sx={userStyle.tableHead1}>SalePrice Cost(Unit)</TableCell>
                                    <TableCell sx={userStyle.tableHead1}><DeleteOutlineOutlinedIcon style={{ fontSize: 'large' }} /></TableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {allProductsList.length > 0 &&
                                    allProductsList.map((data, i) => {
                                        return (
                                            <>
                                                <StyledTableRow key={i}>
                                                    <TableCell>
                                                        <Grid container spacing={1}>
                                                            <Grid item md={12}>
                                                                <InputLabel >Purchase Tax</InputLabel>
                                                                <FormControl size="small" fullWidth>
                                                                    <Select
                                                                        value={data?.purchasetabletax}
                                                                        onChange={(e) => productUserInput(i, "purchasetabletax", e.target.value, "purchasetablechange")}
                                                                        MenuProps={{
                                                                            PaperProps: {
                                                                                style: {
                                                                                    maxHeight: 200
                                                                                },
                                                                            },
                                                                        }}
                                                                        fullWidth
                                                                    >
                                                                        <MenuItem value="None" >None</MenuItem>
                                                                        <MenuItem value="Exclusive" >Exclusive</MenuItem>
                                                                        <MenuItem value="Inclusive" >Inclusive</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item md={12}>
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
                                                                        value={data?.purchasetax}
                                                                    >
                                                                        <MenuItem value="None" onClick={(e) => handleChangeTax(i, "None", 0, [])}>None</MenuItem>
                                                                        {taxrates && (
                                                                            taxrates.map((row, index) => (
                                                                                <MenuItem value={row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate} key={index} onClick={(e) => handleChangeTax(i, row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate, row.taxrate, row.subtax)}>{row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate}</MenuItem>
                                                                            ))
                                                                        )}
                                                                    </Select>
                                                                </FormControl>
                                                            </Grid>
                                                        </Grid>
                                                    </TableCell>
                                                    <TableCell colspan={3}>
                                                        <Typography variant='body2'>Product Name</Typography>
                                                        <FormControl fullWidth>
                                                            <TextField size='small' value={data?.prodname} />
                                                        </FormControl>
                                                        <Grid container spacing={1}>
                                                            <Grid item md={4}>
                                                                <Grid container>
                                                                    <Grid item md={6}>
                                                                        <Typography variant='body2'>Oty</Typography>
                                                                        <FormControl size="small" fullWidth>
                                                                            <TextField size='small'
                                                                                sx={{
                                                                                    '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                                        // width: '80px'
                                                                                    }
                                                                                }}
                                                                                type='number'
                                                                                value={data?.quantity}
                                                                                onChange={(e) => {
                                                                                    productUserInput(i, "quantity", e.target.value, "Quantity");
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={6}>
                                                                        <Typography variant='body2'>Unit</Typography>
                                                                        <FormControl size="small" fullWidth>
                                                                            <Select
                                                                                value={data?.quantityunit}
                                                                                MenuProps={{
                                                                                    PaperProps: {
                                                                                        style: {
                                                                                            maxHeight: 200
                                                                                        },
                                                                                    },
                                                                                }}
                                                                                fullWidth
                                                                            >
                                                                                <MenuItem value="None" ></MenuItem>
                                                                                {allUnits && (
                                                                                    allUnits.map((row, index) => (
                                                                                        <MenuItem value={row.unit} key={index} onClick={(e) => handleChangeUnit(i, row.unit)}>{row.unit}</MenuItem>
                                                                                    ))
                                                                                )}
                                                                            </Select>
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={12}>
                                                                        <Typography variant='body2'>Total Pcs.</Typography>
                                                                        <FormControl size="small" fullWidth>
                                                                            <TextField size='small'
                                                                                sx={{
                                                                                    '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                                        // width: '80px'
                                                                                    }
                                                                                }}
                                                                                type='number'
                                                                                value={data?.quantitytotalpieces}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={6}>
                                                                        <Typography variant='body2'>Free</Typography>
                                                                        <FormControl size="small" fullWidth>
                                                                            <TextField size='small'
                                                                                sx={{
                                                                                    '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                                        width: '150px !important'
                                                                                    }
                                                                                }}
                                                                                type='number'
                                                                                value={data?.freeitem}
                                                                                onChange={(e) => {
                                                                                    productUserInput(i, "freeitem", e.target.value, "Free");
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={6}>
                                                                        <Typography variant='body2'>Unit</Typography>
                                                                        <FormControl size="small" fullWidth>
                                                                            <Select
                                                                                value={data?.freeitemunit}
                                                                                MenuProps={{
                                                                                    PaperProps: {
                                                                                        style: {
                                                                                            maxHeight: 200
                                                                                        },
                                                                                    },
                                                                                }}
                                                                                fullWidth
                                                                                sx={{
                                                                                    '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                                        width: '150px !important'
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <MenuItem value="None" ></MenuItem>
                                                                                {allUnits && (
                                                                                    allUnits.map((row, index) => (
                                                                                        <MenuItem value={row.unit} key={index} onClick={(e) => handleChangeFreeUnit(i, row.unit)}>{row.unit}</MenuItem>
                                                                                    ))
                                                                                )}
                                                                            </Select>
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={12}>
                                                                        <Typography variant='body2'>Enter Rate</Typography>
                                                                        <FormControl size="small" fullWidth>
                                                                            <TextField size='small'
                                                                                sx={{
                                                                                    '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                                        // width: '80px'
                                                                                    }
                                                                                }}
                                                                                type='number'
                                                                                value={data?.enteramt}
                                                                                onChange={(e) => {
                                                                                    productUserInput(i, "enteramt", e.target.value, "Enteramt");
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item md={4}>
                                                                <Grid container sx={{ marginTop: '34px' }}>

                                                                    <Grid item md={12}>
                                                                        <InputLabel >Discount type</InputLabel>
                                                                        <FormControl size="small" fullWidth>
                                                                            <Select
                                                                                value={data?.distypemod}
                                                                                onChange={(e) => productUserInput(i, "distypemod", e.target.value, "Discountmode")}
                                                                            >
                                                                                <MenuItem value="None">None</MenuItem>
                                                                                <MenuItem value="Fixed">Fixed</MenuItem>
                                                                                <MenuItem value="Amount" >Amount</MenuItem>
                                                                                <MenuItem value="Percentage">Percentage</MenuItem>
                                                                            </Select>
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={6} >
                                                                        <InputLabel >Disc.Val</InputLabel>
                                                                        <TextField size='small'
                                                                            type="number"
                                                                            sx={{
                                                                                '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                                }
                                                                            }}
                                                                            value={data?.disvaluemod}
                                                                            onChange={(e) => productUserInput(i, "disvaluemod", e.target.value, "Discountvalue")}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item md={6}>
                                                                        <InputLabel >Disc.Amt</InputLabel>
                                                                        <TextField size='small'
                                                                            type="text"
                                                                            sx={{
                                                                                '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                                }
                                                                            }}
                                                                            value={data?.differenceamt}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item md={12}>
                                                                        <InputLabel >Net Cost (After Discount)</InputLabel>
                                                                        <OutlinedInput
                                                                            size="small"
                                                                            id="component-outlined"
                                                                            value={data?.netcostafterdiscount}
                                                                        />
                                                                    </Grid>
                                                                </Grid>

                                                            </Grid>
                                                            <Grid item md={4}>
                                                                <Grid container >

                                                                    <Grid item md={12}>
                                                                        <InputLabel >Exc Tax</InputLabel>
                                                                        <TextField size='small'
                                                                            type="text"

                                                                            value={data?.purchaseexcludetax}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item md={12}>
                                                                        <InputLabel >Alphaarate</InputLabel>
                                                                        <TextField size='small'
                                                                            type="text"
                                                                            sx={{
                                                                                '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                                }
                                                                            }}
                                                                            value={data?.excalpha}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item md={12}>
                                                                        <InputLabel >Inc Tax</InputLabel>
                                                                        <TextField size='small'
                                                                            type="text"
                                                                            sx={{
                                                                                '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                                }
                                                                            }}
                                                                            value={data?.pruchaseincludetax}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item md={12}>
                                                                        <InputLabel >Alphaarate</InputLabel>
                                                                        <TextField size='small'
                                                                            type="text"
                                                                            value={data?.incalpha}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </TableCell>
                                                    <TableCell sx={{ maxWidth: '171PX' }}>
                                                        <Grid container>
                                                            <Grid item md={12}>
                                                                <Typography variant='body2'>SKU</Typography>
                                                                <TextField size='small'
                                                                    value={data?.sku}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <InputLabel >Unit Cost(Before Discount)</InputLabel>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.unitcostbeforediscount}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <InputLabel>Net Cost(Before Discount)</InputLabel>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.netcostbeforediscount}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <InputLabel >Unit Cost(After Discount)</InputLabel>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.unitcostafterdiscount}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <InputLabel >Net Cost(After Discount)</InputLabel>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.netcostafterdiscount}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </TableCell>
                                                    <TableCell sx={{ maxWidth: '171PX' }}>
                                                        <Grid container>
                                                            <InputLabel >Product Tax</InputLabel>
                                                            {data?.hsn ?
                                                                (
                                                                    <>
                                                                        <Grid item md={12}>
                                                                            <TextField size='small'
                                                                                value={data?.hsn}
                                                                            />
                                                                        </Grid>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Grid item md={12}>
                                                                            <TextField size='small'
                                                                                value={data?.applicabletax}
                                                                            />
                                                                        </Grid>
                                                                    </>
                                                                )
                                                            }

                                                            <Grid item md={12}>
                                                                <InputLabel >Unit Tax(Tax Amount)</InputLabel>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.unitcosttaxamount}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <InputLabel>Net Tax(Tax Amount)</InputLabel>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.netcosttaxamount}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <InputLabel >Unit Cost(With Tax)</InputLabel>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.unitcostwithtax}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <InputLabel >Net Cost(With Tax)</InputLabel>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.netcostwithtax}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </TableCell>
                                                    <TableCell sx={{ maxWidth: '171PX' }}>
                                                        <Grid container>
                                                            <Grid item md={12}>
                                                                <InputLabel >Margin</InputLabel>
                                                                <FormControl size="small" fullWidth>
                                                                    <TextField size='small'
                                                                        sx={{
                                                                            '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                                // width: '80px'
                                                                            }
                                                                        }}
                                                                        type='number'
                                                                        value={data?.margin}
                                                                        onChange={(e) => {
                                                                            productUserInput(i, "margin", e.target.value, "Margin data")
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <InputLabel >Sale Tax Type</InputLabel>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.sellingpricetax}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <InputLabel>Sale Tax Amount</InputLabel>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.saletaxamount}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <InputLabel >Sale Unit Cost(Without Tax)</InputLabel>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.sellingpriceunitwithoutcost}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <InputLabel>Sale Unit Cost(With Tax)</InputLabel>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.sellingpriceunitcost}
                                                                />
                                                            </Grid>
                                                        </Grid>

                                                    </TableCell>
                                                    <TableCell>
                                                        <AiOutlineClose style={{ color: 'red', fontWeight: '900', cursor: 'pointer', fontSize: 'large' }} onClick={(e) => deleteRow(i, e)} />
                                                    </TableCell>

                                                </StyledTableRow>
                                            </>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer><br />
                    <Grid container>
                        <Grid item xs={6} sm={6} md={8} lg={8}>
                        </Grid>
                        <Grid item xs={6} sm={6} md={4} lg={4}>
                            <Typography variant="subtitle1"><b>Total items:</b>{totalitem}</Typography>
                            <Typography variant="subtitle1"
                                value={purchaseAdd.nettotal}
                                onChange={(e) => { setPurchaseAdd({ ...purchaseAdd, nettotal: totalNetCostCalc() }) }}
                            ><b> Net Total Amount:</b> ₹ {totalNetCostCalc()}</Typography>
                        </Grid>
                    </Grid>
                </Box><br />
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
                        <Typography variant='h6' ><b>Total GST:</b>{totalNetTaxAmtCalc() == NaN || totalNetTaxAmtCalc() == undefined ? '0.00' : Number(totalNetTaxAmtCalc())?.toFixed(2)}</Typography>
                        <Typography variant='h6' ><b>Frieght Amt:</b>{Number(purchaseAdd.freightamount)?.toFixed(2)} <b>Expense Amt:</b>{Number(purchaseAdd.expenseamount)?.toFixed(2)}</Typography>
                        <Typography variant='h6' ><b>Added Amt:</b>{totalNetCostCalc() == NaN || totalNetCostCalc() == undefined ? '0.00' : Number(totalNetCostCalc())?.toFixed(2)} <b>Round off Amt:</b>{totalNetCostCalc() == NaN || totalNetCostCalc() == undefined ? 0 : Number(totalNetCostCalc())?.toFixed(0)}</Typography>
                        <Typography variant='h6' ><b>Balance Amt:</b>{Number(balanceamt)?.toFixed(2)}</Typography>
                        <Typography variant='h6' ><b >Status:<p style={{color:'red'}}>{purchaseAdd.purchasestatus}</p></b></Typography>
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