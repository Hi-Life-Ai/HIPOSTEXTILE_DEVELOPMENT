// import React, { useState, useEffect, useContext } from 'react';
// import { colourStyles, userStyle } from '../../PageStyle';
// import { Box, Grid, FormControl, InputLabel, TextareaAutosize, Dialog, DialogContent, DialogActions, OutlinedInput, Typography, TextField, FormGroup, FormControlLabel, Checkbox, Button, IconButton, Tooltip } from '@mui/material';
// import { FcInfo } from "react-icons/fc";
// import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
// import Selects from "react-select";
// import Footer from '../../../components/footer/Footer';
// import { UserRoleAccessContext } from '../../../context/Appcontext';
// import Createunitmod from './Createunitmod';
// import Createsizemod from './Createsizemod';
// import Createcolormod from './Createcolormod';
// import Createcategory from './Createcategory';
// import Createbrand from './Createbrand';
// import Createrack from './Createrack';
// import Createstyle from './Createstyles';
// import axios from 'axios';
// import { useNavigate, useParams, Link } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import Webcamimage from '../Webcamproduct';
// import { SERVICE } from '../../../services/Baseservice';
// import { AuthContext } from '../../../context/Appcontext';
// import Headtitle from '../../../components/header/Headtitle';

// function Producteditlist() {

//     const { auth, setngs } = useContext(AuthContext);
//     const [categories, setCategories] = useState([]);
//     const [sizes, setSizes] = useState([]);
//     const [units, setUnits] = useState([]);
//     const [styles, setStyles] = useState([]);
//     const [isProducts, setIsProducts] = useState([]);
//     const [isAllProducts, setIsAllProducts] = useState([])
//     const [isAllProductsCheck, setIsAllProductsCheck] = useState([])
//     const [file, setFile] = useState();
//     const [busilocations, setBusilocations] = useState();
//     const [isBusilocations, setIsBusilocations] = useState();
//     const [subcategories, setSubcategories] = useState([]);
//     const [fetchsaveunit, setFetchsaveunit] = useState("");
//     const [fetchsavesize, setFetchsavesize] = useState("");
//     const [fetchsavecolor, setFetchsavecolor] = useState("");
//     const [fetchsavecategory, setFetchsavecategory] = useState("");
//     const [fetchsavebrand, setFetchsavebrand] = useState("");
//     const [fetchsaverack, setFetchsaverack] = useState("");
//     const [fetchsavestyle, setFetchsavestyle] = useState("");
//     const [taxrates, setTaxrates] = useState();
//     const [hsnGrp, sethsnGrp] = useState([]);
//     const [colors, setColors] = useState();
//     const [isRacks, setRacks] = useState([]);
//     const [isAllRacks, setAllRacks] = useState([]);
//     const [brands, setBrands] = useState([]);
//     const [brandsubbrand, setBrandsubbrand] = useState([]);
//     const [isFetchbrand, setIsFetchBrand] = useState(false)
//     const [checkAllbrands, setCheckAllBrands] = useState([])

//     // Access
//     const { allLocations, isActiveLocations, allTaxratesGroup, isUserRoleAccess } = useContext(UserRoleAccessContext);

//     // Text field
//     const [product, setProduct] = useState({
//         productname: "", sku: "", categoryshotname: "", subbrand: "Please Select SubBrand", style: "Please Select Style", subbrandshotname: "", subcategryshotname: "", brandshotname: "", hsn: "Please select HSN", hsncode: "Please select HSN", barcodetype: "Please Select Barcode", unit: "Please Select Unit", brand: "Please Select Brand", size: "Please Select Size", currentstock: 0, pruchaseincludetax: 0, sellingexcludetax: 0, producttype: "Please Select Producttypes", applicabletax: "Please select Applicable tax",
//         purchaseexcludetax: 0, sellingpricetax: "Please Select SelltaxType", category: "Please Select Category", reorderlevel: "", subcategory: "Please Select Subcategory", businesslocation: "", managestock: true, minquantity: "", maxquantity: "", rack: "Please Select Rack", productdescription: "", productimage: "", color: "Please Select Color",
//     });

//     // check edit
//     const [overAllProduct, setOverAllProduct] = useState("");
//     const [getProduct, setGetProduct] = useState("");
//     const [editProductCount, setEditProductCount] = useState("");
//     const [checkSkuEdit, setCheckSkuEdit] = useState("");

//     // Error Popup model
//     const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
//     const [showAlertpop, setShowAlertpop] = useState();
//     const handleClickOpenerrpop = () => { setIsErrorOpenpop(true); };
//     const handleCloseerrpop = () => { setIsErrorOpenpop(false); };

//     // ALERT POPUP
//     //popup model
//     const [isErrorOpen, setIsErrorOpen] = useState(false);
//     const [showAlert, setShowAlert] = useState()
//     const handleClickOpenalert = () => { setIsErrorOpen(true); };
//     const handleClosealert = () => { setIsErrorOpen(false); };

//     const id = useParams().id;
//     let subrackarray = [];

//     //webcam
//     const [isWebcamOpen, setIsWebcamOpen] = useState(false);
//     const [getImg, setGetImg] = useState(null)
//     const [isWebcamCapture, setIsWebcamCapture] = useState(false)
//     const webcamOpen = () => {
//         setIsWebcamOpen(true);
//     };
//     const webcamClose = () => {
//         setIsWebcamOpen(false);
//     };

//     const webcamDataStore = () => {
//         setIsWebcamCapture(true)
//         //popup close
//         webcamClose();
//     }

//     //add webcamera popup
//     const showWebcam = () => {
//         webcamOpen();
//     }

//     //window reload
//     const handleBeforeUnload = (event) => {
//         event.preventDefault();
//         event.returnValue = ''; // This is required for Chrome support
//     };

//     useEffect(
//         () => {
//             const beforeUnloadHandler = (event) => handleBeforeUnload(event);
//             window.addEventListener('beforeunload', beforeUnloadHandler);
//             return () => {
//                 window.removeEventListener('beforeunload', beforeUnloadHandler);
//             };
//         }, []);

//     const resetImage = () => {
//         setProduct({ ...product, productimage: "" });
//         setGetImg("");
//         setFile("");
//     }
//     //selling price tax 
//     const selltaxtype = [
//         { value: "None", label: "None" },
//         { value: "Exclusive", label: "Exclusive" },
//         { value: "Inclusive", label: "Inclusive" }
//     ];

//     //product types 
//     const producttypes = [
//         { value: "Single", label: "Single" },
//         { value: "Combo", label: "Combo" }
//     ];

//     //barcode code types 
//     const barcodetypes = [
//         { value: "Qr code", label: "Qr code" },
//         { value: "Code 128 (C128)", label: "Code 128 (C128)" },
//         { value: "Code 39 (C39)", label: "Code 39 (C39)" },
//         { value: "EAN-13", label: "EAN-13" },
//         { value: "EAN-8", label: "EAN-8" },
//         { value: "UPC-A", label: "UPC-A" },
//         { value: "UPC-E", label: "UPC-E" },
//     ];

//     // Image Upload
//     function handleChange(e) {
//         let productimage = document.getElementById("productimage")
//         var path = (window.URL || window.webkitURL).createObjectURL(productimage.files[0]);
//         toDataURL(path, function (dataUrl) {
//             productimage.setAttribute('value', String(dataUrl));
//             setProduct({ ...product, productimage: String(dataUrl) })
//             return dataUrl;
//         })
//         setFile(URL.createObjectURL(e.target.files[0]));
//     }

//     function toDataURL(url, callback) {
//         var xhr = new XMLHttpRequest();
//         xhr.onload = function () {
//             var reader = new FileReader();
//             reader.onloadend = function () {
//                 callback(reader.result);
//             }
//             reader.readAsDataURL(xhr.response);
//         };
//         xhr.open('GET', url);
//         xhr.responseType = 'blob';
//         xhr.send();
//     }

//     const fetchProductsName = async () => {
//         try {
//             let res = await axios.post(SERVICE.PRODUCT_NAME, {
//                 headers: {
//                     'Authorization': `Bearer ${auth.APIToken}`
//                 },
//                 businessid: String(setngs.businessid)
//             })
//             setIsAllProducts(res?.data?.products);
//         } catch (err) {
//             const messages = err?.response?.data?.message;
//             if (messages) {
//                 toast.error(messages);
//             } else {
//                 toast.error("Something went wrong!")
//             }
//         }
//     }

//     useEffect(
//         () => {
//             fetchProductsName();
//         }, []
//     )

//     const fetchProducts = async () => {
//         try {
//             let res = await axios.post(SERVICE.PRODUCT_LASTINDEXID, {
//                 headers: {
//                     'Authorization': `Bearer ${auth.APIToken}`
//                 },
//                 businessid: String(setngs.businessid)
//             })
//             setIsProducts(res?.data?.products);
//         } catch (err) {
//             const messages = err?.response?.data?.message;
//             if (messages) {
//                 toast.error(messages);
//             } else {
//                 toast.error("Something went wrong!")
//             }
//         }
//     }

//     useEffect(() => {
//         fetchProducts();
//     }, [])

//     // Units
//     const fetchUnit = async () => {
//         try {
//             let res = await axios.post(SERVICE.UNIT, {
//                 headers: {
//                     'Authorization': `Bearer ${auth.APIToken}`
//                 },
//                 businessid: String(setngs.businessid)
//             });
//             const unitall = [...res?.data?.units.map((d) => (
//                 {
//                     ...d,
//                     label: d.unit,
//                     value: d.unit
//                 }
//             ))];
//             setUnits(unitall);
//         } catch (err) {
//             const messages = err?.response?.data?.message;
//             if (messages) {
//                 toast.error(messages);
//             } else {
//                 toast.error("Something went wrong!")
//             }
//         }
//     };

//     // Colors
//     const fetchColor = async () => {
//         try {
//             let res = await axios.post(SERVICE.COLOR, {
//                 headers: {
//                     'Authorization': `Bearer ${auth.APIToken}`
//                 },
//                 businessid: String(setngs.businessid)
//             });
//             const colorall = [{ label: 'ALL', value: 'ALL' }, ...res?.data?.colors.map((d) => (
//                 {
//                     ...d,
//                     label: d.colorname,
//                     value: d.colorname
//                 }
//             ))];
//             setColors(colorall);
//         } catch (err) {
//             const messages = err?.response?.data?.message;
//             if (messages) {
//                 toast.error(messages);
//             } else {
//                 toast.error("Something went wrong!")
//             }
//         }
//     };


//     // brand
//     const fetchBrandName = async (valucategoryname) => {
//         let catearray = [];
//         let newarray = [];
//         let allbransarray = [];
//         if (valucategoryname != "ALL") {
//             try {
//                 let res = await axios.post(SERVICE.GROUPS, {
//                     headers: {
//                         'Authorization': `Bearer ${auth.APIToken}`
//                     },
//                     businessid: String(setngs.businessid)
//                 });
//                 let result = res?.data?.groups.map((data, index) => {
//                     let iscatearray = data?.categoryname.forEach((item, i) => {
//                         if (item == valucategoryname) {
//                             catearray.push(data?.brandname);
//                         }
//                     });
//                     return iscatearray
//                 });

//                 //individual products
//                 catearray.forEach((value) => {
//                     value.forEach((valueData) => {
//                         allbransarray.push(valueData);
//                     })
//                 })

//                 newarray = [...new Set(allbransarray)];
//                 const brandall = [{ label: 'ALL', value: 'ALL' }, ...newarray.map((d) => (
//                     {
//                         ...d,
//                         label: d,
//                         value: d
//                     }
//                 ))];

//                 setBrands(brandall);

//             } catch (err) {
//                 const messages = err?.response?.data?.message;
//                 if (messages) {
//                     toast.error(messages);
//                 } else {
//                     toast.error("Something went wrong!")
//                 }
//             }
//         } else {
//             const brandall = [{ label: 'ALL', value: 'ALL' }];

//             setBrands(brandall);
//         }

//     };

//     //Sub category
//     const fetchSubcategories = (e) => {
//         if (e?.subcategories?.length > 0) {
//             try {

//                 const subcatall = [{ label: 'ALL', value: 'ALL' }, ...e?.subcategories.map((d) => (
//                     {
//                         ...d,
//                         label: d.subcategryname,
//                         value: d.subcategryname
//                     }
//                 ))];

//                 setSubcategories(subcatall);
//             } catch (err) {
//                 const messages = err?.response?.data?.message;
//                 if (messages) {
//                     toast.error(messages);
//                 } else {
//                     toast.error("Something went wrong!")
//                 }
//             }
//         } else {
//             const subcatall = [{ label: 'ALL', value: 'ALL' }];
//             setSubcategories(subcatall);

//         }

//     }

//     // Categorys
//     const fetchCategory = async () => {

//         try {
//             let res = await axios.post(SERVICE.CATEGORIES, {
//                 headers: {
//                     'Authorization': `Bearer ${auth.APIToken}`
//                 },
//                 businessid: String(setngs.businessid)
//             });

//             const categoryall = [...res?.data?.categories.map((d) => (
//                 {
//                     ...d,
//                     label: d.categoryname,
//                     value: d.categoryname
//                 }
//             ))];

//             setCategories(categoryall);
//         } catch (err) {
//             const messages = err?.response?.data?.message;
//             if (messages) {
//                 toast.error(messages);
//             } else {
//                 toast.error("Something went wrong!")
//             }
//         }
//     };

//     useEffect(
//         () => {

//             fetchCategory();
//         }, [fetchsavecategory, categories]
//     )

//     // Brand
//     const fetchBrand = async (e) => {

//         if (e?.value != "ALL") {
//             try {
//                 let res = await axios.post(SERVICE.BRAND, {
//                     headers: {
//                         'Authorization': `Bearer ${auth.APIToken}`
//                     },
//                     businessid: String(setngs.businessid)
//                 });

//                 let result = res?.data?.brands.filter((data) => {
//                     return data.brandname == e.value
//                 })

//                 setProduct({
//                     ...product,
//                     brand: e.value,
//                     brandshotname: result[0]?.brandshortname,
//                     productname: product.category + '_' + product.subcategory + '_' + e.value + '_' + ("ALL") + '_' + (product.style == "" || product.style == undefined || product.style == "Please Select Style" ? "ALL" : product.style) + '_' + (product.size == "" || product.size == undefined || product.size == "Please Select Size" ? "ALL" : product.size) + '_' + (product.color == "" || product.color == undefined || product.color == "Please Select Color" ? "ALL" : product.color),
//                 });


//                 const subbrandall = [
//                     { label: 'ALL', value: 'ALL' }, ...result[0]?.subbrands.map((d) => (
//                         {
//                             ...d,
//                             label: d.subbrandname,
//                             value: d.subbrandname
//                         }
//                     ))];

//                 setBrandsubbrand(subbrandall);


//             } catch (err) {
//                 const messages = err?.response?.data?.message;
//                 if (messages) {
//                     toast.error(messages);
//                 } else {
//                     toast.error("Something went wrong!")
//                 }
//             }
//         }  else {
//             try{
//                 let res = await  axios.post(SERVICE.ALLSUBBRAND, {
//                     headers: {
//                       'Authorization': `Bearer ${auth.APIToken}`
//                     },
//                     businessid: String(setngs.businessid)
//                 });

//                 const subbrandid = [{ label: 'ALL', value: 'ALL' }, ...res?.data?.subbrands.map((d) => (
//                     {
//                         ...d,
//                         label: d.subbrandname,
//                         value: d.subbrandname,
//                     }
//                 ))];

//                 setProduct({
//                     ...product,
//                     brand: e.value,
//                     brandshotname: "",
//                     productname: product.category + '_' + product.subcategory + '_' + e.value + '_' + ("ALL") + '_' + (product.style == "" || product.style == undefined || product.style == "Please Select Style" ? "ALL" : product.style) + '_' + (product.size == "" || product.size == undefined || product.size == "Please Select Size" ? "ALL" : product.size) + '_' + (product.color == "" || product.color == undefined || product.color == "Please Select Color" ? "ALL" : product.color),
//                 });
//                 setBrandsubbrand(subbrandid)
//             }catch (err) {
//                 const messages = err?.response?.data?.message;
//                 if (messages) {
//                     toast.error(messages);
//                 } else {
//                     toast.error("Something went wrong!")
//                 }
//             }
//         }
//     };

//     //allchck barnds
//     const fetchCheckBrand = async () => {

//         try {
//             let res = await axios.post(SERVICE.BRAND, {
//                 headers: {
//                     'Authorization': `Bearer ${auth.APIToken}`
//                 },
//                 businessid: String(setngs.businessid)
//             });

//             const brandsall = [{ label: 'ALL', value: 'ALL' },...res?.data?.brands.map((d) => (
//                 {
//                     ...d,
//                     label: d.brandname,
//                     value: d.brandname
//                 }
//             ))];
//             setCheckAllBrands(brandsall)

//         } catch (err) {
//             const messages = err?.response?.data?.message;
//             if (messages) {
//                 toast.error(messages);
//             } else {
//                 toast.error("Something went wrong!")
//             }
//         }
//     };
//     // Size
//     const fetchSize = async () => {
//         try {
//             let res = await axios.post(SERVICE.SIZE, {
//                 headers: {
//                     'Authorization': `Bearer ${auth.APIToken}`
//                 },
//                 businessid: String(setngs.businessid)
//             });
//             const sizeall = [
//                 { label: 'ALL', value: 'ALL' }, ...res?.data?.sizes.map((d) => (
//                     {
//                         ...d,
//                         label: d.sizename,
//                         value: d.sizename
//                     }
//                 ))];

//             setSizes(sizeall);
//         } catch (err) {
//             const messages = err?.response?.data?.message;
//             if (messages) {
//                 toast.error(messages);
//             } else {
//                 toast.error("Something went wrong!")
//             }
//         }
//     };

//     let capture = isWebcamCapture == true ? getImg : product.productimage;

//     // Taxrates
//     const fetchRates = async () => {
//         try {

//             setTaxrates(
//                 allTaxratesGroup?.map((d) => ({
//                     ...d,
//                     label: d.taxname + '@' + d.taxrate,
//                     value: d.taxname + '@' + d.taxrate
//                 }))
//             );
//         } catch (err) {
//             const messages = err?.response?.data?.message;
//             if (messages) {
//                 toast.error(messages);
//             } else {
//                 toast.error("Something went wrong!")
//             }
//         }
//     };

//     const fetchRacks = async (resproducts) => {
//         try {
//             let res = await axios.post(SERVICE.RACK, {
//                 headers: {
//                     'Authorization': `Bearer ${auth.APIToken}`
//                 },
//                 businessid: String(setngs.businessid),
//                 role: String(isUserRoleAccess.role),
//                 userassignedlocation: [isUserRoleAccess.businesslocation]
//             });
//             let result = res?.data?.racks.filter((data, index) => {
//                 return data.businesslocation == resproducts?.businesslocation
//             })
//             let resultvalue = result.map((data, index) => {
//                 return data.combinerack
//             })

//             resultvalue.forEach((value) => {
//                 value.forEach((valueData) => {
//                     subrackarray.push(valueData)
//                 })
//             })
//             setAllRacks(res?.data?.racks);
//             const rackall = [
//                 ...subrackarray.map((d) => (
//                     {
//                         ...d,
//                         label: d.subrackcode,
//                         value: d.subrackcode
//                     }
//                 ))];
//             setRacks(rackall);

//         } catch (err) {
//             const messages = err?.response?.data?.message;
//             if (messages) {
//                 toast.error(messages);
//             } else {
//                 toast.error("Something went wrong!")
//             }
//         }
//     }

//     const handleRackchange = (islocation) => {
//         let result = isAllRacks.filter((data, index) => {
//             return data.businesslocation == islocation
//         })

//         let resultvalue = result.map((data, index) => {
//             return data.combinerack
//         })

//         resultvalue.forEach((value) => {
//             value.forEach((valueData) => {
//                 subrackarray.push(valueData)
//             })
//         })
//         const rackall = [
//             ...subrackarray.map((d) => (
//                 {
//                     ...d,
//                     label: d.subrackcode,
//                     value: d.subrackcode
//                 }
//             ))];
//         setRacks(rackall);
//     }

//     // Get Datas
//     const taxrateRequest = async () => {
//         try {
//             let res = await axios.post(SERVICE.TAXRATEHSN, {
//                 headers: {
//                     'Authorization': `Bearer ${auth.APIToken}`
//                 },
//                 businessid: String(setngs.businessid)
//             });

//             sethsnGrp(
//                 res?.data?.taxrateshsn.map((d) => ({
//                     ...d,
//                     label: d.hsn,
//                     value: d.hsn,
//                 }))
//             );
//         } catch (err) {
//             const messages = err?.response?.data?.message;
//             if (messages) {
//                 toast.error(messages);
//             } else {
//                 toast.error("Something went wrong!")
//             }
//         }
//     }

//     // Styles
//     const fetchStyle = async () => {

//         try {
//             let res = await axios.post(SERVICE.STYLE, {
//                 headers: {
//                     'Authorization': `Bearer ${auth.APIToken}`
//                 },
//                 businessid: String(setngs.businessid)
//             });

//             const styleall = [{ label: 'ALL', value: 'ALL' }, ...res?.data?.styles.map((d) => (
//                 {
//                     ...d,
//                     label: d.stylename,
//                     value: d.stylename
//                 }
//             ))];

//             setStyles(styleall);
//         } catch (err) {
//             const messages = err?.response?.data?.message;
//             if (messages) {
//                 toast.error(messages);
//             } else {
//                 toast.error("Something went wrong!")
//             }
//         }
//     };

//     useEffect(
//         () => {
//             fetchRacks(product);
//         }, [fetchsaverack, isRacks]
//     )

//     useEffect(
//         () => {
//             fetchStyle();
//         }, [fetchsavestyle, styles]

//     )
//     useEffect(() => {
//         fetchCheckBrand();
//     }, [fetchsavebrand, checkAllbrands])

//     // fetch all data from page load
//     useEffect(
//         () => {
//             fetchUnit();
//         }, [fetchsaveunit, units]);

//     useEffect(() => {
//         fetchSize();
//     }, [fetchsavesize, sizes]);

//     useEffect(() => {
//         fetchColor();
//     }, [fetchsavecolor, colors]);

//     useEffect(() => {
//         taxrateRequest();
//         fetchRates();
//     }, []);

//     // Tget HSN taxrates
//     const getProducts = async () => {
//         try {
//             let res = await axios.get(`${SERVICE.PRODUCT_SINGLE}/${id}`, {
//                 headers: {
//                     'Authorization': `Bearer ${auth.APIToken}`
//                 },
//             })
//             let selectlocation = allLocations.filter((data, index) => {
//                 return data.locationid == res?.data?.sproduct?.businesslocation
//             })
//             setIsBusilocations(selectlocation[0]);
//             setBusilocations(isActiveLocations.map((d) => (
//                 {
//                     ...d,
//                     label: d.name,
//                     value: d.locationid,
//                 }
//             )));
//             setProduct(res?.data?.sproduct);
//             getOverallEditSection(res?.data?.sproduct)
//             setGetProduct(res?.data?.sproduct?.productname)
//             setCheckSkuEdit(res?.data?.sproduct?.sku)
//             await fetchRacks(res?.data?.sproduct)
//         } catch (err) {
//             const messages = err?.response?.data?.message;
//             if (messages) {
//                 toast.error(messages);
//             } else {
//                 toast.error("Something went wrong!")
//             }
//         }
//     }
//     useEffect(() => {
//         getProducts();
//     }, [id]);

//     const fetchAllProducts = async () => {
//         try {
//             let res = await axios.post(SERVICE.PRODUCT, {
//                 headers: {
//                     'Authorization': `Bearer ${auth.APIToken}`
//                 },
//                 businessid: String(setngs.businessid),
//                 role: String(isUserRoleAccess.role),
//                 userassignedlocation: [isUserRoleAccess.businesslocation]
//             })
//             setIsAllProductsCheck(res?.data?.products?.filter(item => item._id !== product._id));
//         } catch (err) {
//             const messages = err?.response?.data?.message;
//             if (messages) {
//                 toast.error(messages);
//             } else {
//                 toast.error("Something went wrong!")
//             }
//         }
//     }

//     useEffect(() => {
//         fetchAllProducts();
//     }, [product, isAllProductsCheck])

//     //overall edit section for all pages 
//     const getOverallEditSection = async (e) => {
//         try {
//             let res = await axios.post(SERVICE.PRODUCT_EDIT, {
//                 headers: {
//                     'Authorization': `Bearer ${auth.APIToken}`
//                 },
//                 businessid: String(setngs.businessid),
//                 productname: String(e.productname),
//                 sku: String(e.sku),
//             });
//             setEditProductCount(res?.data?.count);
//             setOverAllProduct(`The ${e.productname} is linked in 
//                 ${res.data.purchase.length > 0 ? "Purchase ," : ""}
//                 ${res.data.purchasereturn.length > 0 ? "Purchase Return ," : ""}
//                 ${res.data.pos.length > 0 ? "Pos ," : ""}
//                 ${res.data.draft.length > 0 ? "Draft ," : ""} 
//                 ${res.data.quotation.length > 0 ? "Quotation ," : ""} whether you want to do changes ..??`
//             )
//         }
//         catch (err) {
//             const messages = err?.response?.data?.message
//             if (messages) {
//                 setShowAlertpop(
//                     <>
//                         <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
//                         <p style={{ fontSize: '20px', fontWeight: 900 }}>{messages}</p>
//                     </>
//                 );
//                 handleClickOpenerrpop();
//             }
//             else {
//                 setShowAlertpop(
//                     <>
//                         <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
//                         <p style={{ fontSize: '20px', fontWeight: 900 }}>{"something went wrong!"}</p>
//                     </>
//                 );
//                 handleClickOpenerrpop();
//             }
//         }
//     };

//     //overall edit section for all pages 
//     const getOverallEditSectionUpdate = async () => {
//         try {
//             let res = await axios.post(SERVICE.PRODUCT_EDIT, {
//                 headers: {
//                     'Authorization': `Bearer ${auth.APIToken}`
//                 },
//                 businessid: String(setngs.businessid),
//                 productname: getProduct,
//                 sku: String(checkSkuEdit),
//             });
//             sendEditRequestOverall(res?.data?.purchase, res?.data?.purchasereturn,
//                 res?.data?.pos, res?.data?.draft, res?.data?.quotation)
//         }
//         catch (err) {
//             const messages = err?.response?.data?.message
//             if (messages) {
//                 setShowAlertpop(
//                     <>
//                         <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
//                         <p style={{ fontSize: '20px', fontWeight: 900 }}>{messages}</p>
//                     </>
//                 );
//                 handleClickOpenerrpop();
//             }
//             else {
//                 setShowAlertpop(
//                     <>
//                         <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
//                         <p style={{ fontSize: '20px', fontWeight: 900 }}>{"something went wrong!"}</p>
//                     </>
//                 );
//                 handleClickOpenerrpop();
//             }
//         }
//     };

//     const sendEditRequestOverall = async (purchase, purchasereturn, pos, draft, quotation) => {
//         try {
//             if (purchase.length > 0) {
//                 let answ = purchase.map((d, i) => {
//                     const updatedTodos = d.products.map(data => {
//                         if (data.sku === checkSkuEdit) {
//                             return { ...data, prodname: product.productname };
//                         }
//                         return data
//                     });
//                     let res = axios.put(`${SERVICE.PURCHASE_SINGLE}/${d._id}`, {
//                         headers: {
//                             'Authorization': `Bearer ${auth.APIToken}`
//                         },
//                         products: updatedTodos,
//                     });
//                 })
//             }
//             if (purchasereturn.length > 0) {
//                 let answ = purchasereturn.map((d, i) => {
//                     const updatedTodos = d.products.map(data => {
//                         if (data.sku === checkSkuEdit) {
//                             return { ...data, prodname: product.productname };
//                         }
//                         return data
//                     });
//                     let res = axios.put(`${SERVICE.PURCHASE_RETURN_SINGLE}/${d._id}`, {
//                         headers: {
//                             'Authorization': `Bearer ${auth.APIToken}`
//                         },
//                         products: updatedTodos,
//                     });
//                 })
//             }
//             if (pos.length > 0) {
//                 let answ = pos.map((d, i) => {
//                     const updatedTodos = d.goods.map(data => {
//                         if (data.productid === checkSkuEdit) {
//                             return { ...data, productname: product.productname };
//                         }
//                         return data
//                     });
//                     let res = axios.put(`${SERVICE.POS_SINGLE}/${d._id}`, {
//                         headers: {
//                             'Authorization': `Bearer ${auth.APIToken}`
//                         },
//                         goods: updatedTodos,
//                     });
//                 })
//             }
//             if (draft.length > 0) {
//                 let answ = draft.map((d, i) => {
//                     const updatedTodos = d.goods.map(data => {
//                         if (data.productid === checkSkuEdit) {
//                             return { ...data, productname: product.productname };
//                         }
//                         return data
//                     });
//                     let res = axios.put(`${SERVICE.DRAFT_SINGLE}/${d._id}`, {
//                         headers: {
//                             'Authorization': `Bearer ${auth.APIToken}`
//                         },
//                         goods: updatedTodos,
//                     });
//                 })
//             }
//             if (quotation.length > 0) {
//                 let answ = quotation.map((d, i) => {
//                     const updatedTodos = d.goods.map(data => {
//                         if (data.productid === checkSkuEdit) {
//                             return { ...data, productname: product.productname };
//                         }
//                         return data
//                     });
//                     let res = axios.put(`${SERVICE.QUOTATION_SINGLE}/${d._id}`, {
//                         headers: {
//                             'Authorization': `Bearer ${auth.APIToken}`
//                         },
//                         goods: updatedTodos,
//                     });
//                 })
//             }
//         } catch (err) {
//             const messages = err?.response?.data?.message
//             if (messages) {
//                 setShowAlertpop(
//                     <>
//                         <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
//                         <p style={{ fontSize: '20px', fontWeight: 900 }}>{messages}</p>
//                     </>
//                 );
//                 handleClickOpenerrpop();
//             }
//             else {
//                 setShowAlertpop(
//                     <>
//                         <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
//                         <p style={{ fontSize: '20px', fontWeight: 900 }}>{"something 8 went wrong!"}</p>
//                     </>
//                 );
//                 handleClickOpenerrpop();
//             }
//         }
//     };

//     const backLPage = useNavigate();

//     // Edit Datas
//     const sendRequest = async () => {
//         try {
//             let productedit = await axios.put(`${SERVICE.PRODUCT_SINGLE}/${id}`, {
//                 headers: {
//                     'Authorization': `Bearer ${auth.APIToken}`
//                 },
//                 productname: String(product.productname == undefined ? "" : product.productname),
//                 sku: String(product.sku),
//                 barcodetype: String(product.barcodetype == undefined ? "" : product.barcodetype),
//                 unit: String(product.unit == undefined || product.unit == "Please Select Unit" ? "ALL" : product.unit),
//                 size: String(product.size == undefined || product.size == "Please Select Size" ? "ALL" : product.size),
//                 style: String(product.style == undefined || product.style == "Please Select Style" ? "ALL" : product.style),
//                 businesslocation: String(product.businesslocation == undefined ? "" : product.businesslocation),
//                 category: String(product.category == undefined || product.category == "Please Select Category" ? "ALL" : product.category),
//                 subcategory: String(product.subcategory == undefined || product.subcategory == "Please Select Subcategory" ? "ALL" : product.subcategory),
//                 brand: String(product.brand == undefined || product.brand == "Please Select Brand" ? "ALL" : product.brand),
//                 subbrand: String(product.subbrand == undefined || product.subbrand == "Please Select SubBrand" ? "ALL" : product.subbrand),
//                 categoryshotname: String(product.categoryshotname == undefined ? "" : product.categoryshotname),
//                 subcategryshotname: String(product.subcategryshotname == undefined ? "" : product.subcategryshotname),
//                 brandshotname: String(product.brandshotname == undefined ? "" : product.brandshotname),
//                 subbrandshotname: String(product.subbrandshotname == undefined ? "" : product.subbrandshotname),
//                 managestock: Boolean(product.managestock == undefined ? false : product.managestock),
//                 minquantity: Number(product.managestock ? product.minquantity : 0),
//                 maxquantity: Number(product.managestock ? product.maxquantity : 0),
//                 rack: String(product.rack == undefined || product.rack == "Please Select Rack" ? "ALL" : product.rack),
//                 reorderlevel: String(product.reorderlevel == undefined ? "" : product.reorderlevel),
//                 productdescription: String(product.productdescription == undefined ? "" : product.productdescription),
//                 productimage: String(capture),
//                 color: String(product.color == undefined || product.color == "Please Select Color" ? "ALL" : product.color),
//                 hsnenable: Boolean(product.hsnenable == undefined ? false : product.hsnenable),
//                 hsn: String(product.hsnenable == true ? product.hsn : ""),
//                 hsncode: String(product.hsnenable == true ? product.hsncode : ""),
//                 applicabletax: String(product.hsnenable == false ? product.applicabletax : ""),
//                 sellingpricetax: String(product.sellingpricetax == undefined ? "" : product.sellingpricetax),
//                 producttype: String(product.producttype == undefined ? "" : product.producttype),
//                 currentstock: Number(product.currentstock == undefined || product.currentstock == null ? 0 : product.currentstock),
//                 pruchaseincludetax: Number(product.pruchaseincludetax == undefined || product.pruchaseincludetax == null ? 0 : product.pruchaseincludetax),
//                 purchaseexcludetax: Number(product.purchaseexcludetax == undefined || product.purchaseexcludetax == null ? 0 : product.purchaseexcludetax),
//                 sellingexcludetax: Number(product.sellingexcludetax == undefined || product.sellingexcludetax == null ? 0 : product.sellingexcludetax),
//                 sellunitcostwithouttax: Number(product.sellunitcostwithouttax == undefined || product.sellunitcostwithouttax == null ? 0 : product.sellunitcostwithouttax),
//             });

//             setProduct(productedit.data);
//             toast.success(productedit.data.message, {
//                 position: toast.POSITION.TOP_CENTER
//             });

//             backLPage('/product/product/list');
//             await getOverallEditSectionUpdate()
//         } catch (err) {
//             const messages = err?.response?.data?.message;
//             if (messages) {
//                 if (messages == "request entity too large") {
//                     setShowAlert("Image Size Can't more than 5MB!");
//                     handleClickOpenalert();
//                 } else {
//                     setShowAlert(messages);
//                     handleClickOpenalert();
//                 }
//             } else {
//                 setShowAlert("Something went wrong!");
//                 handleClickOpenalert();
//             }
//         }
//     };


//     const editProductSubmit = (e) => {
//         e.preventDefault();
//         const isNameMatch = isAllProductsCheck.some(item => item.productname?.toLowerCase() === (product.productname)?.toLowerCase());

//         if (isNameMatch) {
//             setShowAlert("Product Name Already Exits");
//             handleClickOpenalert();
//         }
//         else if (product.category == "Please Select Category" || product.category == "") {
//             setShowAlert("Please select category");
//             handleClickOpenalert();
//         }
//         else if (product.productname != getProduct && editProductCount > 0) {
//             setShowAlertpop(
//                 <>
//                     <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
//                     <p style={{ fontSize: "20px", fontWeight: 900 }}> {overAllProduct} </p>
//                 </>
//             );
//             handleClickOpenerrpop()
//         }
//         else {
//             sendRequest();

//         }
//     }

//     return (
//         <Box>
//             <Headtitle title={'Edit Product'} />
//             <form onSubmit={editProductSubmit}>

//                 {/* header text */}
//                 <Typography sx={userStyle.HeaderText}>Edit Product</Typography>
//                 {/* content start */}
//                 <Box sx={userStyle.container}>
//                     <Grid container spacing={2} sx={userStyle.textInput}>
//                         <Grid item lg={3} md={3} sm={6} xs={12}>
//                             <InputLabel id="demo-select-small">Category <b style={{ color: 'red' }}>*</b></InputLabel>
//                             <Grid sx={{ display: 'flex' }}>
//                                 <FormControl size="small" fullWidth>
//                                     <Selects
//                                         options={categories}
//                                         styles={colourStyles}
//                                         value={{ label: product.category, value: product.category }}
//                                         placeholder={product.category}
//                                         onChange={(e) => {
//                                             fetchBrandName(e?.value);
//                                             fetchSubcategories(e);
//                                             setProduct({
//                                                 ...product,
//                                                 category: e.value,
//                                                 categoryshotname: e.categoryshotname == undefined ? "" : e.categoryshotname,
//                                                 productname: e.value + '_' + ("ALL") + '_' + ("ALL") + '_' + ("ALL") + '_' + (product.style == "" || product.style == undefined || product.style == "Please Select Style" ? "ALL" : product.style) + '_' + (product.size == "" || product.size == undefined || product.size == "Please Select Size" ? "ALL" : product.size) + '_' + (product.color == "" || product.color == undefined || product.color == "Please Select Color" ? "ALL" : product.color),
//                                                 subcategory: 'ALL',
//                                                 brand: 'ALL',
//                                                 subbrand: 'ALL',
//                                             })
//                                         }}
//                                     />
//                                 </FormControl>
//                                 <Grid sx={userStyle.spanIcons}>
//                                     <Createcategory setFetchsavecategory={setFetchsavecategory} />
//                                 </Grid>
//                             </Grid>
//                         </Grid>
//                         <Grid item lg={3} md={3} sm={6} xs={12}>
//                             <InputLabel id="demo-select-small">Sub category</InputLabel>
//                             <FormControl size="small" fullWidth>
//                                 <Selects
//                                     options={subcategories}
//                                     styles={colourStyles}
//                                     value={{ label: product.subcategory, value: product.subcategory }}
//                                     placeholder={product.subcategory}
//                                     onChange={(e) => {
//                                         setProduct({
//                                             ...product,
//                                             subcategory: e.value,
//                                             subcategryshotname: e.subcategryshotname,
//                                             productname: product.category + '_' + e.value + '_' + product.brand + '_' + product.subbrand + '_' + product.style + '_' + product.size + '_' + product.color
//                                         })
//                                     }}
//                                 />
//                             </FormControl>
//                         </Grid>
//                         <Grid item lg={3} md={3} sm={6} xs={12}>
//                             <InputLabel id="demo-select-small">Brand</InputLabel>
//                             <Grid sx={{ display: 'flex' }}>
//                                 <FormControl size="small" fullWidth >
//                                     <Selects
//                                         options={isFetchbrand ? checkAllbrands : brands}
//                                         styles={colourStyles}
//                                         value={{ label: product.brand, value: product.brand }}
//                                         placeholder='ALL'
//                                         onChange={(e) => { fetchBrand(e); }}
//                                     />
//                                 </FormControl>
//                                 <Grid sx={userStyle.spanIcons}>
//                                     <Createbrand setFetchsavebrand={setFetchsavebrand} />
//                                 </Grid>

//                             </Grid>
//                             <Grid sx={{ display: "flex" }}>
//                                 <FormControlLabel control={<Checkbox checked={isFetchbrand} onClick={(e) => { setIsFetchBrand(s => !s);  
//                                setProduct({
//                                             ...product,
//                                             brand:"Please Select Brand",
//                                             subbrand:"Please Select SubBrand"
//                                         });setBrandsubbrand([]);}} />} label="All Brands" sx={{ fontSize: '10px' }} />
//                                 <Grid style={userStyle.spanIcon}>
//                                     <Tooltip title='If you click this all brands are list in dropdown ' placement="top" arrow>
//                                         <IconButton edge="end" size="small">
//                                             <FcInfo />
//                                         </IconButton>
//                                     </Tooltip>
//                                 </Grid>
//                             </Grid>
//                         </Grid>
//                         <Grid item lg={3} md={3} sm={6} xs={12}>
//                             <InputLabel id="demo-select-small">Sub Brand</InputLabel>
//                             <FormControl size="small" fullWidth >
//                                 <Selects
//                                     // options={brandsubbrand}
//                                     options={brandsubbrand}
//                                     styles={colourStyles}
//                                     value={{ label: product.subbrand, value: product.subbrand }}
//                                     placeholder={product.subbrand}
//                                     onChange={(e) => {
//                                         setProduct({
//                                             ...product,
//                                             subbrand: e.value,
//                                             subbrandshotname: e.subbrandshotname,
//                                             productname: product.category + '_' + product.subcategory + '_' + product.brand + '_' + e.value + '_' + product.style + '_' + product.size + '_' + product.color,
//                                         })
//                                     }}
//                                 />
//                             </FormControl>
//                         </Grid>
//                         <Grid item lg={6} md={6} sm={6} xs={12}>
//                             <InputLabel htmlFor="component-outlined" >Product Name <b style={{ color: 'red' }}>*</b></InputLabel>
//                             <FormControl size="small" fullWidth >
//                                 <OutlinedInput
//                                     id="component-outlined"
//                                     value={product.productname}
//                                 // onChange={(e) => { setProduct({ ...product, productname: e.target.value }) }}
//                                 />
//                             </FormControl>
//                         </Grid>
//                         <Grid item lg={2} md={2} sm={6} xs={12}>
//                             <Grid sx={{ display: "flex" }}>
//                                 <InputLabel htmlFor="outlined-adornment-password">SKU <b style={{ color: 'red' }}>*</b></InputLabel>
//                                 <Grid style={userStyle.spanIcon}>
//                                     <Tooltip title='"Unique product id it blank to automatically generate sku.You can modify sku prefix in Business settings.' placement="top" arrow>
//                                         <IconButton edge="end" size="small">
//                                             <FcInfo />
//                                         </IconButton>
//                                     </Tooltip>
//                                 </Grid>
//                             </Grid>
//                             <FormControl variant="outlined" size="small" fullWidth>
//                                 <OutlinedInput
//                                     id="component-outlined"
//                                     value={product.sku}
//                                     onChange={(e) => { setProduct({ ...product, sku: e.target.value }) }}
//                                 />
//                             </FormControl>
//                         </Grid>
//                         <Grid item lg={2} md={2} sm={6} xs={12}>
//                             <InputLabel id="demo-select-small">HSN</InputLabel>
//                             <FormControl size="small" fullWidth>
//                                 <Selects
//                                     options={hsnGrp}
//                                     styles={colourStyles}
//                                     placeholder={product.hsn}
//                                     onChange={(e) => { setProduct({ ...product, hsn: e.value, hsncode: e.value }); }}
//                                 />
//                             </FormControl>
//                             <FormControlLabel control={<Checkbox checked={product.hsnenable}
//                                 onClick={(e) => { setProduct({ ...product, hsnenable: !product.hsnenable }) }} />} label="Enable tax with HSN code" />
//                         </Grid>
//                         <Grid item lg={2} md={2} sm={6} xs={12}>
//                             <InputLabel id="demo-select-small">Barcode type</InputLabel>
//                             <FormControl size="small" fullWidth>
//                                 <Selects
//                                     options={barcodetypes}
//                                     styles={colourStyles}
//                                     placeholder={product.barcodetype}
//                                     onChange={(e) => { setProduct({ ...product, barcodetype: e.value }); }}
//                                 />
//                             </FormControl>
//                         </Grid>
//                         <Grid item lg={3} md={3} sm={6} xs={12}>
//                             <InputLabel id="demo-select-small">Size</InputLabel>
//                             <Grid sx={{ display: 'flex' }}>
//                                 <FormControl size="small" fullWidth>
//                                     <Selects
//                                         options={sizes}
//                                         styles={colourStyles}
//                                         value={{ label: product.size, value: product.size }}
//                                         onChange={(e) => { setProduct({ ...product, size: e.value, productname: product.category + '_' + product.subcategory + '_' + product.brand + '_' + product.subbrand + '_' + product.style + '_' + e.value + '_' + product.color, }); }}
//                                     />
//                                 </FormControl>
//                                 <Grid sx={userStyle.spanIcons}>
//                                     <Createsizemod setFetchsavesize={setFetchsavesize} />
//                                 </Grid>
//                             </Grid>
//                         </Grid>
//                         <Grid item lg={3} md={3} sm={6} xs={12}>
//                             <InputLabel id="demo-select-small">Color </InputLabel>
//                             <Grid sx={{ display: 'flex' }}>
//                                 <FormControl size="small" fullWidth >
//                                     <Selects
//                                         options={colors}
//                                         styles={colourStyles}
//                                         value={{ label: product.color, value: product.color }}
//                                         onChange={(e) => { setProduct({ ...product, color: e.value, productname: product.category + '_' + product.subcategory + '_' + product.brand + '_' + product.subbrand + '_' + product.style + '_' + product.size + '_' + e.value, }); }}
//                                     />
//                                 </FormControl>
//                                 <Grid sx={userStyle.spanIcons}>
//                                     <Createcolormod setFetchsavecolor={setFetchsavecolor} />
//                                 </Grid>
//                             </Grid>
//                         </Grid>
//                         <Grid item lg={3} md={3} sm={6} xs={12}>
//                             <InputLabel id="demo-select-small">Unit</InputLabel>
//                             <FormControl size="small" fullWidth>
//                                 <Grid sx={{ display: 'flex' }}  >
//                                     <Selects
//                                         options={units}
//                                         styles={colourStyles}
//                                         placeholder={product.unit}
//                                         onChange={(e) => { setProduct({ ...product, unit: e.unit, }); }}
//                                     />
//                                     <Grid sx={userStyle.spanIcons}>
//                                         <Createunitmod setFetchsaveunit={setFetchsaveunit} />
//                                     </Grid>
//                                 </Grid>
//                             </FormControl>
//                         </Grid>
//                         <Grid item lg={3} md={3} sm={6} xs={12}>
//                             <InputLabel id="demo-select-small">Style</InputLabel>
//                             <Grid sx={{ display: 'flex' }}  >
//                                 <FormControl size="small" fullWidth>
//                                     <Selects
//                                         options={styles}
//                                         styles={colourStyles}
//                                         value={{ label: product.style, value: product.style }}
//                                         onChange={(e) => { setProduct({ ...product, style: e.value, productname: product.category + '_' + product.subcategory + '_' + product.brand + '_' + product.subbrand + '_' + e.value + '_' + product.size + '_' + product.color, }); }}
//                                     />
//                                 </FormControl>
//                                 <Grid sx={userStyle.spanIcons}>
//                                     <Createstyle setFetchsavestyle={setFetchsavestyle} />
//                                 </Grid>
//                             </Grid>
//                         </Grid>
//                         <Grid item lg={4} md={4} sm={6} xs={12}>
//                             <InputLabel id="demo-select-small">Business Location</InputLabel>
//                             <FormControl size="small" fullWidth>
//                                 <Selects
//                                     options={busilocations}
//                                     styles={colourStyles}
//                                     placeholder={isBusilocations ? isBusilocations.name : ""}
//                                     onChange={(e) => { setProduct({ ...product, businesslocation: e.value }); handleRackchange(e.value) }}
//                                 />
//                             </FormControl>
//                         </Grid>
//                         {/* <Grid item lg={12} md={12} sm={12} xs={12}></Grid> */}
//                         <Grid item lg={2} md={2} sm={6} xs={12}>
//                             <FormGroup>
//                                 <span><FormControlLabel control={<Checkbox checked={product.managestock} onClick={(e) => { setProduct({ ...product, managestock: !product.managestock }) }} />} label="Manage Stock"

//                                 />
//                                     <Tooltip title="Enable or disable stock management for a product." placement="top" arrow>
//                                         <IconButton size="small">
//                                             <FcInfo />
//                                         </IconButton>
//                                     </Tooltip>
//                                 </span>
//                             </FormGroup>
//                             {/* <Typography variant='body2' style={{ marginTop: "5px" }}>Enable stock management at product level</Typography> */}
//                         </Grid>
//                         {product.managestock ? (
//                             <>
//                                 <Grid item lg={2} md={2} sm={6} xs={12}>
//                                     <InputLabel htmlFor="outlined-adornment-password">Minimum Quantity</InputLabel>
//                                     <FormControl variant="outlined" size="small" fullWidth>
//                                         <OutlinedInput
//                                             sx={userStyle.input}
//                                             id="outlined-adornment-password"
//                                             type="number"
//                                             value={product.minquantity}
//                                             onChange={(e) => { setProduct({ ...product, minquantity: e.target.value }) }}
//                                         />
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item lg={2} md={2} sm={6} xs={12}>
//                                     <InputLabel htmlFor="outlined-adornment-password">Maximum Quantity</InputLabel>
//                                     <FormControl variant="outlined" size="small" fullWidth>
//                                         <OutlinedInput
//                                             sx={userStyle.input}
//                                             id="outlined-adornment-password"
//                                             type="number"
//                                             value={product.maxquantity}
//                                             onChange={(e) => { setProduct({ ...product, maxquantity: e.target.value }) }}
//                                         />
//                                     </FormControl>
//                                 </Grid>
//                             </>
//                         ) : (

//                             <>
//                                 <Grid item lg={4} md={4}></Grid>
//                             </>
//                         )}
//                         <Grid item lg={2} md={2} sm={6} xs={12}>
//                             <InputLabel htmlFor="outlined-adornment-password">Rack</InputLabel>
//                             <Grid sx={{ display: 'flex' }}>
//                                 <FormControl variant="outlined" size="small" fullWidth>
//                                     <Selects
//                                         options={isRacks}
//                                         styles={colourStyles}
//                                         placeholder={product.rack}
//                                         onChange={(e) => { setProduct({ ...product, rack: e.value }); }}
//                                     />
//                                 </FormControl>
//                                 <Grid sx={userStyle.spanIcons}>
//                                     <Createrack setFetchsaverack={setFetchsaverack} />
//                                 </Grid>
//                             </Grid>
//                         </Grid>
//                         <Grid item lg={9} md={9} sm={6} xs={12}></Grid>
//                         <Grid item lg={9} md={9} sm={8} xs={12}>
//                             <InputLabel id="demo-select-small" sx={{ m: 1 }}>Product Description</InputLabel>
//                             <FormControl size="small" fullWidth >
//                                 <TextareaAutosize aria-label="minimum height" minRows={3} style={{ border: '1px solid #4a7bf7' }}
//                                     value={product.productdescription}
//                                     onChange={(e) => { setProduct({ ...product, productdescription: e.target.value }) }}
//                                 />
//                             </FormControl>
//                         </Grid>
//                         <Grid item lg={3} md={3} sm={4} xs={12}>
//                             <InputLabel sx={{ m: 1 }}>Product Image</InputLabel>
//                             {file || capture || product.productimage ? (
//                                 <>
//                                     <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
//                                         <img src={file ? file : capture ? capture : product.productimage} width="50%" height="80px" />
//                                     </Grid>
//                                 </>
//                             ) : (
//                                 <></>
//                             )}
//                             <FormControl size="small" fullWidth>
//                                 <Grid sx={{ display: 'flex' }}>
//                                     <Button component="label" sx={userStyle.uploadBtn}>
//                                         Upload
//                                         <input type='file' id="productimage" accept="image/*" name='file' hidden onChange={handleChange}
//                                         />
//                                     </Button>
//                                     <Button onClick={showWebcam} sx={userStyle.uploadBtn}>Webcam</Button>&ensp;
//                                     <Button onClick={resetImage} sx={userStyle.buttoncancel}>Reset</Button>
//                                 </Grid>

//                                 <Typography variant='body2' style={{ marginTop: "5px" }}>Max File size: 5MB</Typography>
//                             </FormControl>
//                         </Grid>
//                     </Grid>
//                     <br />
//                     <Grid container spacing={2}>
//                         {product.hsnenable ?
//                             <Grid item md={4} sm={4} xs={12}>
//                                 <InputLabel id="demo-select-small">HSN code</InputLabel>
//                                 <FormControl size="small" fullWidth>
//                                     <TextField
//                                         id="date"
//                                         type="text"
//                                         size='small'
//                                         value={product.hsncode}
//                                     />
//                                 </FormControl>
//                             </Grid>
//                             :
//                             <Grid item md={4} sm={4} xs={12}>
//                                 <InputLabel id="demo-select-small">Applicable Tax</InputLabel>
//                                 <FormControl size="small" fullWidth>
//                                     <Selects
//                                         options={taxrates}
//                                         styles={colourStyles}
//                                         placeholder={product.applicabletax}
//                                         onChange={(e) => { setProduct({ ...product, applicabletax: e.value }) }}
//                                     >
//                                     </Selects>
//                                 </FormControl>
//                             </Grid>
//                         }
//                         <Grid item md={4} sm={4} xs={12}>
//                             <InputLabel id="demo-select-small">Selling Price Tax Type <b style={{ color: 'red' }}>*</b></InputLabel>
//                             <FormControl size="small" fullWidth>
//                                 <Selects
//                                     options={selltaxtype}
//                                     styles={colourStyles}
//                                     placeholder={product.sellingpricetax}
//                                     onChange={(e) => { setProduct({ ...product, sellingpricetax: e.value }); }}
//                                 />
//                             </FormControl>
//                         </Grid>
//                         <Grid item md={4} sm={4} xs={12}>
//                             <InputLabel >Product Type </InputLabel>
//                             <FormControl size="small" fullWidth>
//                                 <Selects
//                                     options={producttypes}
//                                     styles={colourStyles}
//                                     placeholder={product.producttype}
//                                     onChange={(e) => { setProduct({ ...product, producttype: e.value }); }}
//                                 />
//                             </FormControl>
//                         </Grid>
//                     </Grid>
//                     <Grid container sx={userStyle.gridcontainer}>
//                         <Grid >
//                             <Link to="/product/product/List"><Button sx={userStyle.buttoncancel} type='button'>CANCEL</Button></Link>
//                             <Button sx={userStyle.buttonadd} onClick={sendRequest}>UPDATE</Button>
//                         </Grid>
//                     </Grid>
//                 </Box>
//                 {/* content end */}
//             </form >
//             <br /> <br />
//             {/* ALERT DIALOG */}
//             <Box>
//                 <Dialog
//                     open={isErrorOpen}
//                     onClose={handleClosealert}
//                     aria-labelledby="alert-dialog-title"
//                     aria-describedby="alert-dialog-description"
//                 >
//                     <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
//                         <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
//                         <Typography variant="h6" >{showAlert}</Typography>
//                     </DialogContent>
//                     <DialogActions>
//                         <Button variant="contained" color="error" onClick={handleClosealert}>ok</Button>
//                     </DialogActions>
//                 </Dialog>
//             </Box>
//             {/* webcam alert start */}
//             <Dialog
//                 open={isWebcamOpen}
//                 onClose={webcamClose}
//                 aria-labelledby="alert-dialog-title"
//                 aria-describedby="alert-dialog-description"
//             >
//                 <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
//                     <Webcamimage getImg={getImg} setGetImg={setGetImg} />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button variant="contained" color="success" onClick={webcamDataStore}>OK</Button>
//                     <Button variant="contained" color="error" onClick={webcamClose}>CANCEL</Button>
//                 </DialogActions>
//             </Dialog>
//             {/* webcam alert end */}

//             {/* Check edit popup */}
//             <Box>
//                 <Dialog
//                     open={isErrorOpenpop}
//                     onClose={handleCloseerrpop}
//                     aria-labelledby="alert-dialog-title"
//                     aria-describedby="alert-dialog-description"
//                 >
//                     <DialogContent
//                         sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
//                     >
//                         <Typography variant="h6">{showAlertpop}</Typography>
//                     </DialogContent>
//                     <DialogActions>
//                         <Button variant="contained" style={{
//                             padding: '7px 13px',
//                             color: 'white',
//                             background: 'rgb(25, 118, 210)'
//                         }} onClick={() => {
//                             sendRequest();
//                             handleCloseerrpop();
//                         }}>
//                             ok
//                         </Button>
//                         <Button
//                             sx={userStyle.buttoncancel}
//                             onClick={handleCloseerrpop}
//                         >
//                             Cancel
//                         </Button>
//                     </DialogActions>
//                 </Dialog>
//             </Box>
//         </Box >
//     );
// }

// function Productedit() {
//     return (

//         <>
//             <Producteditlist /><br /><br /><br /><br />
//             <Footer />
//         </>
//     );
// }

// export default Productedit;

import React, { useState, useEffect, useContext } from 'react';
import { colourStyles, userStyle } from '../../PageStyle';
import { Box, Grid, FormControl, InputLabel, TextareaAutosize, Dialog, DialogContent, DialogActions, OutlinedInput, Typography, TextField, FormGroup, FormControlLabel, Checkbox, Button, IconButton, Tooltip } from '@mui/material';
import { FcInfo } from "react-icons/fc";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Selects from "react-select";
import Footer from '../../../components/footer/Footer';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import Createunitmod from './Createunitmod';
import Createsizemod from './Createsizemod';
import Createcolormod from './Createcolormod';
import Createcategory from './Createcategory';
import Createbrand from './Createbrand';
import Createrack from './Createrack';
import Createstyle from './Createstyles';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Webcamimage from '../Webcamproduct';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';

function Producteditlist() {

    const { auth, setngs } = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [units, setUnits] = useState([]);
    const [styles, setStyles] = useState([]);
    const [isAllProductsCheck, setIsAllProductsCheck] = useState([])
    const [file, setFile] = useState();
    const [busilocations, setBusilocations] = useState();
    const [isBusilocations, setIsBusilocations] = useState();
    const [subcategories, setSubcategories] = useState([]);
    const [fetchsaveunit, setFetchsaveunit] = useState("");
    const [fetchsavesize, setFetchsavesize] = useState("");
    const [fetchsavecolor, setFetchsavecolor] = useState("");
    const [fetchsavecategory, setFetchsavecategory] = useState("");
    const [fetchsavebrand, setFetchsavebrand] = useState("");
    const [fetchsaverack, setFetchsaverack] = useState("");
    const [fetchsavestyle, setFetchsavestyle] = useState("");
    const [taxrates, setTaxrates] = useState();
    const [hsnGrp, sethsnGrp] = useState([]);
    const [colors, setColors] = useState();
    const [isRacks, setRacks] = useState([]);
    const [isAllRacks, setAllRacks] = useState([]);
    const [brands, setBrands] = useState([]);
    const [brandsubbrand, setBrandsubbrand] = useState([]);
    const [isFetchbrand, setIsFetchBrand] = useState(false)
    const [checkAllbrands, setCheckAllBrands] = useState([])

    // Access
    const { allLocations, isActiveLocations, allTaxratesGroup, isUserRoleAccess } = useContext(UserRoleAccessContext);

    // Text field
    const [product, setProduct] = useState({
        productname: "", sku: "", categoryshotname: "", subbrand: "Please Select SubBrand", style: "Please Select Style", subbrandshotname: "", subcategryshotname: "", brandshotname: "", hsn: "Please select HSN", hsncode: "Please select HSN", barcodetype: "Please Select Barcode", unit: "Please Select Unit", brand: "Please Select Brand", size: "Please Select Size", currentstock: 0, pruchaseincludetax: 0, sellingexcludetax: 0, producttype: "Please Select Producttypes", applicabletax: "Please select Applicable tax",
        purchaseexcludetax: 0, sellingpricetax: "Please Select SelltaxType", category: "Please Select Category", reorderlevel: "", subcategory: "Please Select Subcategory", businesslocation: "", managestock: true, minquantity: "", maxquantity: "", rack: "Please Select Rack", productdescription: "", productimage: "", color: "Please Select Color",
    });

    // check edit
    const [overAllProduct, setOverAllProduct] = useState("");
    const [getProduct, setGetProduct] = useState("");
    const [editProductCount, setEditProductCount] = useState("");
    const [checkSkuEdit, setCheckSkuEdit] = useState("");

    // Error Popup model
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => { setIsErrorOpenpop(true); };
    const handleCloseerrpop = () => { setIsErrorOpenpop(false); };

    //popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenalert = () => { setIsErrorOpen(true); };
    const handleClosealert = () => { setIsErrorOpen(false); };

    const id = useParams().id;
    let subrackarray = [];

    //webcam
    const [isWebcamOpen, setIsWebcamOpen] = useState(false);
    const [getImg, setGetImg] = useState(null)
    const [isWebcamCapture, setIsWebcamCapture] = useState(false)
    const webcamOpen = () => { setIsWebcamOpen(true); };
    const webcamClose = () => { setIsWebcamOpen(false); };
    const webcamDataStore = () => { setIsWebcamCapture(true); webcamClose(); }

    //add webcamera popup
    const showWebcam = () => { webcamOpen(); }

    useEffect(
        () => {
            fetchStyle();
        }, [fetchsavestyle]
    )
    useEffect(() => {
        fetchCheckBrand();
    }, [fetchsavebrand])

    useEffect(
        () => {
            fetchCategoryOptions()
        }, [fetchsavecategory]
    )

    useEffect(() => {
        taxrateRequest();
        fetchRates();
    }, [])

    useEffect(() => {
        fetchRacks();
    }, [fetchsaverack])


    useEffect(
        () => {
            fetchColor();
        }, [fetchsavecolor]
    );
    useEffect(
        () => {
            fetchUnit();
        }, [fetchsaveunit]
    );
    useEffect(
        () => {
            fetchSize();
        }, [fetchsavesize]
    );

    useEffect(
        () => {
        }, [fetchsavesize]
    );

    //window reload
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

    //selling price tax 
    const selltaxtype = [
        { value: "None", label: "None" },
        { value: "Exclusive", label: "Exclusive" },
        { value: "Inclusive", label: "Inclusive" }
    ];

    //product types 
    const producttypes = [
        { value: "Single", label: "Single" },
        { value: "Combo", label: "Combo" }
    ];

    //barcode code types 
    const barcodetypes = [
        { value: "Qr code", label: "Qr code" },
        { value: "Code 128 (C128)", label: "Code 128 (C128)" },
        { value: "Code 39 (C39)", label: "Code 39 (C39)" },
        { value: "EAN-13", label: "EAN-13" },
        { value: "EAN-8", label: "EAN-8" },
        { value: "UPC-A", label: "UPC-A" },
        { value: "UPC-E", label: "UPC-E" },
    ];

    // Units
    const fetchUnit = async () => {
        try {
            let res = await axios.post(SERVICE.UNIT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            const unitall = [...res?.data?.units.map((d) => (
                {
                    ...d,
                    label: d.unit,
                    value: d.unit
                }
            ))];
            setUnits(unitall);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    // Colors
    const fetchColor = async () => {
        try {
            let res = await axios.post(SERVICE.COLOR, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            const colorall = [{ label: 'ALL', value: 'ALL' }, ...res?.data?.colors.map((d) => (
                {
                    ...d,
                    label: d.colorname,
                    value: d.colorname
                }
            ))];
            setColors(colorall);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    // Categorys
    const fetchCategoryOptions = async () => {

        try {
            let res = await axios.post(SERVICE.CATEGORIES, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            const categoryall = [...res?.data?.categories.map((d) => (
                {
                    ...d,
                    label: d.categoryname,
                    value: d.categoryname
                }
            ))];

            setCategories(categoryall);


        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    // brand
    const fetchBrandName = async (valucategoryname) => {
        let catearray = [];
        let newarray = [];
        let allbransarray = [];
        if (valucategoryname != "ALL") {
            try {
                let res = await axios.post(SERVICE.GROUPS, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid)
                });
                let result = res?.data?.groups.map((data, index) => {
                    let iscatearray = data?.categoryname.forEach((item, i) => {
                        if (item == valucategoryname) {
                            catearray.push(data?.brandname);
                        }
                    });
                    return iscatearray
                });

                //individual products
                catearray.forEach((value) => {
                    value.forEach((valueData) => {
                        allbransarray.push(valueData);
                    })
                })

                newarray = [...new Set(allbransarray)];
                const brandall = [{ label: 'ALL', value: 'ALL' }, ...newarray.map((d) => (
                    {
                        ...d,
                        label: d,
                        value: d
                    }
                ))];

                setBrands(brandall);

            } catch (err) {
                const messages = err?.response?.data?.message;
                if (messages) {
                    toast.error(messages);
                } else {
                    toast.error("Something went wrong!")
                }
            }
        } else {
            const brandall = [{ label: 'ALL', value: 'ALL' }];

            setBrands(brandall);
        }

    };

    //Sub category
    const fetchSubcategories = (e) => {
        if (e?.subcategories?.length > 0) {
            try {

                const subcatall = [{ label: 'ALL', value: 'ALL' }, ...e?.subcategories.map((d) => (
                    {
                        ...d,
                        label: d.subcategryname,
                        value: d.subcategryname
                    }
                ))];

                setSubcategories(subcatall);
            } catch (err) {
                const messages = err?.response?.data?.message;
                if (messages) {
                    toast.error(messages);
                } else {
                    toast.error("Something went wrong!")
                }
            }
        } else {
            const subcatall = [{ label: 'ALL', value: 'ALL' }];
            setSubcategories(subcatall);

        }

    }

    // Categorys
    const fetchCategory = async () => {

        try {
            let res = await axios.post(SERVICE.CATEGORIES, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            const categoryall = [...res?.data?.categories.map((d) => (
                {
                    ...d,
                    label: d.categoryname,
                    value: d.categoryname
                }
            ))];

            setCategories(categoryall);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    // Brand
    const fetchBrand = async (e) => {

        if (e?.value != "ALL") {
            try {
                let res = await axios.post(SERVICE.BRAND, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid)
                });

                let result = res?.data?.brands.filter((data) => {
                    return data.brandname == e.value
                })

                setProduct({
                    ...product,
                    brand: e.value,
                    brandshotname: result[0]?.brandshortname,
                    productname: product.category + '_' + product.subcategory + '_' + e.value + '_' + ("ALL") + '_' + (product.style == "" || product.style == undefined || product.style == "Please Select Style" ? "ALL" : product.style) + '_' + (product.size == "" || product.size == undefined || product.size == "Please Select Size" ? "ALL" : product.size) + '_' + (product.color == "" || product.color == undefined || product.color == "Please Select Color" ? "ALL" : product.color),
                });


                const subbrandall = [
                    { label: 'ALL', value: 'ALL' }, ...result[0]?.subbrands.map((d) => (
                        {
                            ...d,
                            label: d.subbrandname,
                            value: d.subbrandname
                        }
                    ))];

                setBrandsubbrand(subbrandall);


            } catch (err) {
                const messages = err?.response?.data?.message;
                if (messages) {
                    toast.error(messages);
                } else {
                    toast.error("Something went wrong!")
                }
            }
        } else {
            try {
                let res = await axios.post(SERVICE.ALLSUBBRAND, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    businessid: String(setngs.businessid)
                });

                const subbrandid = [{ label: 'ALL', value: 'ALL' }, ...res?.data?.subbrands.map((d) => (
                    {
                        ...d,
                        label: d.subbrandname,
                        value: d.subbrandname,
                    }
                ))];

                setProduct({
                    ...product,
                    brand: e.value,
                    brandshotname: "",
                    productname: product.category + '_' + product.subcategory + '_' + e.value + '_' + ("ALL") + '_' + (product.style == "" || product.style == undefined || product.style == "Please Select Style" ? "ALL" : product.style) + '_' + (product.size == "" || product.size == undefined || product.size == "Please Select Size" ? "ALL" : product.size) + '_' + (product.color == "" || product.color == undefined || product.color == "Please Select Color" ? "ALL" : product.color),
                });
                setBrandsubbrand(subbrandid)
            } catch (err) {
                const messages = err?.response?.data?.message;
                if (messages) {
                    toast.error(messages);
                } else {
                    toast.error("Something went wrong!")
                }
            }
        }
    };

    //allchck barnds
    const fetchCheckBrand = async () => {

        try {
            let res = await axios.post(SERVICE.BRAND, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            const brandsall = [{ label: 'ALL', value: 'ALL' }, ...res?.data?.brands.map((d) => (
                {
                    ...d,
                    label: d.brandname,
                    value: d.brandname
                }
            ))];
            setCheckAllBrands(brandsall)

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    // Size
    const fetchSize = async () => {
        try {
            let res = await axios.post(SERVICE.SIZE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            const sizeall = [
                { label: 'ALL', value: 'ALL' }, ...res?.data?.sizes.map((d) => (
                    {
                        ...d,
                        label: d.sizename,
                        value: d.sizename
                    }
                ))];

            setSizes(sizeall);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    let capture = isWebcamCapture == true ? getImg : product.productimage;

    // Taxrates
    const fetchRates = async () => {
        try {

            setTaxrates(
                allTaxratesGroup?.map((d) => ({
                    ...d,
                    label: d.taxname + '@' + d.taxrate,
                    value: d.taxname + '@' + d.taxrate
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

    const fetchRacks = async (resproducts) => {
        try {
            let res = await axios.post(SERVICE.RACK, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]
            });
            let result = res?.data?.racks.filter((data, index) => {
                return data.businesslocation == resproducts?.businesslocation
            })
            let resultvalue = result.map((data, index) => {
                return data.combinerack
            })

            resultvalue.forEach((value) => {
                value.forEach((valueData) => {
                    subrackarray.push(valueData)
                })
            })
            setAllRacks(res?.data?.racks);
            const rackall = [
                ...subrackarray.map((d) => (
                    {
                        ...d,
                        label: d.subrackcode,
                        value: d.subrackcode
                    }
                ))];
            setRacks(rackall);

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    const handleRackchange = (islocation) => {
        let result = isAllRacks.filter((data, index) => {
            return data.businesslocation == islocation
        })

        let resultvalue = result.map((data, index) => {
            return data.combinerack
        })

        resultvalue.forEach((value) => {
            value.forEach((valueData) => {
                subrackarray.push(valueData)
            })
        })
        const rackall = [
            ...subrackarray.map((d) => (
                {
                    ...d,
                    label: d.subrackcode,
                    value: d.subrackcode
                }
            ))];
        setRacks(rackall);
    }

    // Get Datas
    const taxrateRequest = async () => {
        try {
            let res = await axios.post(SERVICE.TAXRATEHSN, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            sethsnGrp(
                res?.data?.taxrateshsn.map((d) => ({
                    ...d,
                    label: d.hsn,
                    value: d.hsn,
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

    // Styles
    const fetchStyle = async () => {

        try {
            let res = await axios.post(SERVICE.STYLE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            const styleall = [{ label: 'ALL', value: 'ALL' }, ...res?.data?.styles.map((d) => (
                {
                    ...d,
                    label: d.stylename,
                    value: d.stylename
                }
            ))];

            setStyles(styleall);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    // Tget HSN taxrates
    const getProducts = async () => {
        try {
            let res = await axios.get(`${SERVICE.PRODUCT_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            })
            let selectlocation = allLocations.filter((data, index) => {
                return data.locationid == res?.data?.sproduct?.businesslocation
            })
            setIsBusilocations(selectlocation[0]);
            setBusilocations(isActiveLocations.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.locationid,
                }
            )));
            setProduct(res?.data?.sproduct);
            getOverallEditSection(res?.data?.sproduct)
            setGetProduct(res?.data?.sproduct?.productname)
            setCheckSkuEdit(res?.data?.sproduct?.sku)
            await fetchRacks(res?.data?.sproduct)
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
        getProducts();
    }, [id]);

    const fetchAllProducts = async () => {
        try {
            let res = await axios.post(SERVICE.PRODUCT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]
            })
            setIsAllProductsCheck(res?.data?.products?.filter(item => item._id !== product._id));
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
        fetchAllProducts();
    }, [product, isAllProductsCheck])

    // Image Upload
    function handleChange(e) {
        let productimage = document.getElementById("productimage")
        var path = (window.URL || window.webkitURL).createObjectURL(productimage.files[0]);
        toDataURL(path, function (dataUrl) {
            productimage.setAttribute('value', String(dataUrl));
            setProduct({ ...product, productimage: String(dataUrl) })
            return dataUrl;
        })
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    function toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    const resetImage = () => {
        setProduct({ ...product, productimage: "" });
        setGetImg("");
        setFile("");
    }

    //overall edit section for all pages 
    const getOverallEditSection = async (e) => {
        try {
            let res = await axios.post(SERVICE.PRODUCT_EDIT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                productname: String(e.productname),
                sku: String(e.sku),
            });
            setEditProductCount(res?.data?.count);
            setOverAllProduct(`The ${e.productname} is linked in 
                ${res.data.purchase.length > 0 ? "Purchase ," : ""}
                ${res.data.purchasereturn.length > 0 ? "Purchase Return ," : ""}
                ${res.data.pos.length > 0 ? "Pos ," : ""}
                ${res.data.draft.length > 0 ? "Draft ," : ""} 
                ${res.data.quotation.length > 0 ? "Quotation ," : ""} whether you want to do changes ..??`
            )
        }
        catch (err) {
            const messages = err?.response?.data?.message
            if (messages) {
                setShowAlertpop(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerrpop();
            }
            else {
                setShowAlertpop(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{"something went wrong!"}</p>
                    </>
                );
                handleClickOpenerrpop();
            }
        }
    };

    //overall edit section for all pages 
    const getOverallEditSectionUpdate = async () => {
        try {
            let res = await axios.post(SERVICE.PRODUCT_EDIT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                productname: getProduct,
                sku: String(checkSkuEdit),
            });
            sendEditRequestOverall(res?.data?.purchase, res?.data?.purchasereturn,
                res?.data?.pos, res?.data?.draft, res?.data?.quotation)
        }
        catch (err) {
            const messages = err?.response?.data?.message
            if (messages) {
                setShowAlertpop(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerrpop();
            }
            else {
                setShowAlertpop(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{"something went wrong!"}</p>
                    </>
                );
                handleClickOpenerrpop();
            }
        }
    };

    const sendEditRequestOverall = async (purchase, purchasereturn, pos, draft, quotation) => {
        try {
            if (purchase.length > 0) {
                let answ = purchase.map((d, i) => {
                    const updatedTodos = d.products.map(data => {
                        if (data.sku === checkSkuEdit) {
                            return { ...data, prodname: product.productname };
                        }
                        return data
                    });
                    let res = axios.put(`${SERVICE.PURCHASE_SINGLE}/${d._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        products: updatedTodos,
                    });
                })
            }
            if (purchasereturn.length > 0) {
                let answ = purchasereturn.map((d, i) => {
                    const updatedTodos = d.products.map(data => {
                        if (data.sku === checkSkuEdit) {
                            return { ...data, prodname: product.productname };
                        }
                        return data
                    });
                    let res = axios.put(`${SERVICE.PURCHASE_RETURN_SINGLE}/${d._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        products: updatedTodos,
                    });
                })
            }
            if (pos.length > 0) {
                let answ = pos.map((d, i) => {
                    const updatedTodos = d.goods.map(data => {
                        if (data.productid === checkSkuEdit) {
                            return { ...data, productname: product.productname };
                        }
                        return data
                    });
                    let res = axios.put(`${SERVICE.POS_SINGLE}/${d._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        goods: updatedTodos,
                    });
                })
            }
            if (draft.length > 0) {
                let answ = draft.map((d, i) => {
                    const updatedTodos = d.goods.map(data => {
                        if (data.productid === checkSkuEdit) {
                            return { ...data, productname: product.productname };
                        }
                        return data
                    });
                    let res = axios.put(`${SERVICE.DRAFT_SINGLE}/${d._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        goods: updatedTodos,
                    });
                })
            }
            if (quotation.length > 0) {
                let answ = quotation.map((d, i) => {
                    const updatedTodos = d.goods.map(data => {
                        if (data.productid === checkSkuEdit) {
                            return { ...data, productname: product.productname };
                        }
                        return data
                    });
                    let res = axios.put(`${SERVICE.QUOTATION_SINGLE}/${d._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        goods: updatedTodos,
                    });
                })
            }
        } catch (err) {
            const messages = err?.response?.data?.message
            if (messages) {
                setShowAlertpop(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerrpop();
            }
            else {
                setShowAlertpop(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{"something 8 went wrong!"}</p>
                    </>
                );
                handleClickOpenerrpop();
            }
        }
    };

    const backLPage = useNavigate();

    // Edit Datas
    const sendRequest = async () => {
        try {
            let productedit = await axios.put(`${SERVICE.PRODUCT_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                productname: String(product.productname == undefined ? "" : product.productname),
                sku: String(product.sku),
                barcodetype: String(product.barcodetype == undefined ? "" : product.barcodetype),
                unit: String(product.unit == undefined || product.unit == "Please Select Unit" ? "ALL" : product.unit),
                size: String(product.size == undefined || product.size == "Please Select Size" ? "ALL" : product.size),
                style: String(product.style == undefined || product.style == "Please Select Style" ? "ALL" : product.style),
                businesslocation: String(product.businesslocation == undefined ? "" : product.businesslocation),
                category: String(product.category == undefined || product.category == "Please Select Category" ? "ALL" : product.category),
                subcategory: String(product.subcategory == undefined || product.subcategory == "Please Select Subcategory" ? "ALL" : product.subcategory),
                brand: String(product.brand == undefined || product.brand == "Please Select Brand" ? "ALL" : product.brand),
                subbrand: String(product.subbrand == undefined || product.subbrand == "Please Select SubBrand" ? "ALL" : product.subbrand),
                categoryshotname: String(product.categoryshotname == undefined ? "" : product.categoryshotname),
                subcategryshotname: String(product.subcategryshotname == undefined ? "" : product.subcategryshotname),
                brandshotname: String(product.brandshotname == undefined ? "" : product.brandshotname),
                subbrandshotname: String(product.subbrandshotname == undefined ? "" : product.subbrandshotname),
                managestock: Boolean(product.managestock == undefined ? false : product.managestock),
                minquantity: Number(product.managestock ? product.minquantity : 0),
                maxquantity: Number(product.managestock ? product.maxquantity : 0),
                rack: String(product.rack == undefined || product.rack == "Please Select Rack" ? "ALL" : product.rack),
                reorderlevel: String(product.reorderlevel == undefined ? "" : product.reorderlevel),
                productdescription: String(product.productdescription == undefined ? "" : product.productdescription),
                productimage: String(capture),
                color: String(product.color == undefined || product.color == "Please Select Color" ? "ALL" : product.color),
                hsnenable: Boolean(product.hsnenable == undefined ? false : product.hsnenable),
                hsn: String(product.hsnenable == true ? product.hsn : ""),
                hsncode: String(product.hsnenable == true ? product.hsncode : ""),
                applicabletax: String(product.hsnenable == false ? product.applicabletax : ""),
                sellingpricetax: String(product.sellingpricetax == undefined ? "" : product.sellingpricetax),
                producttype: String(product.producttype == undefined ? "" : product.producttype),
                currentstock: Number(product.currentstock == undefined || product.currentstock == null ? 0 : product.currentstock),
                pruchaseincludetax: Number(product.pruchaseincludetax == undefined || product.pruchaseincludetax == null ? 0 : product.pruchaseincludetax),
                purchaseexcludetax: Number(product.purchaseexcludetax == undefined || product.purchaseexcludetax == null ? 0 : product.purchaseexcludetax),
                sellingexcludetax: Number(product.sellingexcludetax == undefined || product.sellingexcludetax == null ? 0 : product.sellingexcludetax),
                sellunitcostwithouttax: Number(product.sellunitcostwithouttax == undefined || product.sellunitcostwithouttax == null ? 0 : product.sellunitcostwithouttax),
            });

            setProduct(productedit.data);
            toast.success(productedit.data.message, {
                position: toast.POSITION.TOP_CENTER
            });

            backLPage('/product/product/list');
            await getOverallEditSectionUpdate()
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                if (messages == "request entity too large") {
                    setShowAlert("Image Size Can't more than 5MB!");
                    handleClickOpenalert();
                } else {
                    setShowAlert(messages);
                    handleClickOpenalert();
                }
            } else {
                setShowAlert("Something went wrong!");
                handleClickOpenalert();
            }
        }
    };


    const editProductSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = isAllProductsCheck.some(item => item.productname?.toLowerCase() === (product.productname)?.toLowerCase());

        if (isNameMatch) {
            setShowAlert("Product Name Already Exits");
            handleClickOpenalert();
        }
        else if (product.category == "Please Select Category" || product.category == "") {
            setShowAlert("Please select category");
            handleClickOpenalert();
        }
        else if (product.productname != getProduct && editProductCount > 0) {
            setShowAlertpop(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}> {overAllProduct} </p>
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
            <Headtitle title={'Edit Product'} />
            <form onSubmit={editProductSubmit}>

                {/* header text */}
                <Typography sx={userStyle.HeaderText}>Edit Product</Typography>
                {/* content start */}
                <Box sx={userStyle.container}>
                    <Grid container spacing={2} sx={userStyle.textInput}>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Category <b style={{ color: 'red' }}>*</b></InputLabel>
                            <Grid sx={{ display: 'flex' }}>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        options={categories}
                                        styles={colourStyles}
                                        value={{ label: product.category, value: product.category }}
                                        placeholder={product.category}
                                        onChange={(e) => {
                                            fetchBrandName(e?.value);
                                            fetchSubcategories(e);
                                            setProduct({
                                                ...product,
                                                category: e.value,
                                                categoryshotname: e.categoryshotname == undefined ? "" : e.categoryshotname,
                                                productname: e.value + '_' + ("ALL") + '_' + ("ALL") + '_' + ("ALL") + '_' + (product.style == "" || product.style == undefined || product.style == "Please Select Style" ? "ALL" : product.style) + '_' + (product.size == "" || product.size == undefined || product.size == "Please Select Size" ? "ALL" : product.size) + '_' + (product.color == "" || product.color == undefined || product.color == "Please Select Color" ? "ALL" : product.color),
                                                subcategory: 'ALL',
                                                brand: 'ALL',
                                                subbrand: 'ALL',
                                            })
                                        }}
                                    />
                                </FormControl>
                                <Grid sx={userStyle.spanIcons}>
                                    <Createcategory setFetchsavecategory={setFetchsavecategory} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Sub category</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Selects
                                    options={subcategories}
                                    styles={colourStyles}
                                    value={{ label: product.subcategory, value: product.subcategory }}
                                    placeholder={product.subcategory}
                                    onChange={(e) => {
                                        setProduct({
                                            ...product,
                                            subcategory: e.value,
                                            subcategryshotname: e.subcategryshotname,
                                            productname: product.category + '_' + e.value + '_' + product.brand + '_' + product.subbrand + '_' + product.style + '_' + product.size + '_' + product.color
                                        })
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Brand</InputLabel>
                            <Grid sx={{ display: 'flex' }}>
                                <FormControl size="small" fullWidth >
                                    <Selects
                                        options={isFetchbrand ? checkAllbrands : brands}
                                        styles={colourStyles}
                                        value={{ label: product.brand, value: product.brand }}
                                        placeholder='ALL'
                                        onChange={(e) => { fetchBrand(e); }}
                                    />
                                </FormControl>
                                <Grid sx={userStyle.spanIcons}>
                                    <Createbrand setFetchsavebrand={setFetchsavebrand} />
                                </Grid>

                            </Grid>
                            <Grid sx={{ display: "flex" }}>
                                <FormControlLabel control={<Checkbox checked={isFetchbrand} onClick={(e) => {
                                    setIsFetchBrand(s => !s);
                                    setProduct({
                                        ...product,
                                        brand: "Please Select Brand",
                                        subbrand: "Please Select SubBrand"
                                    }); setBrandsubbrand([]);
                                }} />} label="All Brands" sx={{ fontSize: '10px' }} />
                                <Grid style={userStyle.spanIcon}>
                                    <Tooltip title='If you click this all brands are list in dropdown ' placement="top" arrow>
                                        <IconButton edge="end" size="small">
                                            <FcInfo />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Sub Brand</InputLabel>
                            <FormControl size="small" fullWidth >
                                <Selects
                                    // options={brandsubbrand}
                                    options={brandsubbrand}
                                    styles={colourStyles}
                                    value={{ label: product.subbrand, value: product.subbrand }}
                                    placeholder={product.subbrand}
                                    onChange={(e) => {
                                        setProduct({
                                            ...product,
                                            subbrand: e.value,
                                            subbrandshotname: e.subbrandshotname,
                                            productname: product.category + '_' + product.subcategory + '_' + product.brand + '_' + e.value + '_' + product.style + '_' + product.size + '_' + product.color,
                                        })
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Product Name <b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    id="component-outlined"
                                    value={product.productname}
                                // onChange={(e) => { setProduct({ ...product, productname: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={2} md={2} sm={6} xs={12}>
                            <Grid sx={{ display: "flex" }}>
                                <InputLabel htmlFor="outlined-adornment-password">SKU <b style={{ color: 'red' }}>*</b></InputLabel>
                                <Grid style={userStyle.spanIcon}>
                                    <Tooltip title='"Unique product id it blank to automatically generate sku.You can modify sku prefix in Business settings.' placement="top" arrow>
                                        <IconButton edge="end" size="small">
                                            <FcInfo />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={product.sku}
                                    onChange={(e) => { setProduct({ ...product, sku: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={2} md={2} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">HSN</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Selects
                                    options={hsnGrp}
                                    styles={colourStyles}
                                    placeholder={product.hsn}
                                    onChange={(e) => { setProduct({ ...product, hsn: e.value, hsncode: e.value }); }}
                                />
                            </FormControl>
                            <FormControlLabel control={<Checkbox checked={product.hsnenable}
                                onClick={(e) => { setProduct({ ...product, hsnenable: !product.hsnenable }) }} />} label="Enable tax with HSN code" />
                        </Grid>
                        <Grid item lg={2} md={2} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Barcode type</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Selects
                                    options={barcodetypes}
                                    styles={colourStyles}
                                    placeholder={product.barcodetype}
                                    onChange={(e) => { setProduct({ ...product, barcodetype: e.value }); }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Size</InputLabel>
                            <Grid sx={{ display: 'flex' }}>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        options={sizes}
                                        styles={colourStyles}
                                        value={{ label: product.size, value: product.size }}
                                        onChange={(e) => { setProduct({ ...product, size: e.value, productname: product.category + '_' + product.subcategory + '_' + product.brand + '_' + product.subbrand + '_' + product.style + '_' + e.value + '_' + product.color, }); }}
                                    />
                                </FormControl>
                                <Grid sx={userStyle.spanIcons}>
                                    <Createsizemod setFetchsavesize={setFetchsavesize} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Color </InputLabel>
                            <Grid sx={{ display: 'flex' }}>
                                <FormControl size="small" fullWidth >
                                    <Selects
                                        options={colors}
                                        styles={colourStyles}
                                        value={{ label: product.color, value: product.color }}
                                        onChange={(e) => { setProduct({ ...product, color: e.value, productname: product.category + '_' + product.subcategory + '_' + product.brand + '_' + product.subbrand + '_' + product.style + '_' + product.size + '_' + e.value, }); }}
                                    />
                                </FormControl>
                                <Grid sx={userStyle.spanIcons}>
                                    <Createcolormod setFetchsavecolor={setFetchsavecolor} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Unit</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Grid sx={{ display: 'flex' }}  >
                                    <Selects
                                        options={units}
                                        styles={colourStyles}
                                        placeholder={product.unit}
                                        onChange={(e) => { setProduct({ ...product, unit: e.unit, }); }}
                                    />
                                    <Grid sx={userStyle.spanIcons}>
                                        <Createunitmod setFetchsaveunit={setFetchsaveunit} />
                                    </Grid>
                                </Grid>
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Style</InputLabel>
                            <Grid sx={{ display: 'flex' }}  >
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        options={styles}
                                        styles={colourStyles}
                                        value={{ label: product.style, value: product.style }}
                                        onChange={(e) => { setProduct({ ...product, style: e.value, productname: product.category + '_' + product.subcategory + '_' + product.brand + '_' + product.subbrand + '_' + e.value + '_' + product.size + '_' + product.color, }); }}
                                    />
                                </FormControl>
                                <Grid sx={userStyle.spanIcons}>
                                    <Createstyle setFetchsavestyle={setFetchsavestyle} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Business Location</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Selects
                                    options={busilocations}
                                    styles={colourStyles}
                                    placeholder={isBusilocations ? isBusilocations.name : ""}
                                    onChange={(e) => { setProduct({ ...product, businesslocation: e.value }); handleRackchange(e.value) }}
                                />
                            </FormControl>
                        </Grid>
                        {/* <Grid item lg={12} md={12} sm={12} xs={12}></Grid> */}
                        <Grid item lg={2} md={2} sm={6} xs={12}>
                            <FormGroup>
                                <span><FormControlLabel control={<Checkbox checked={product.managestock} onClick={(e) => { setProduct({ ...product, managestock: !product.managestock }) }} />} label="Manage Stock"

                                />
                                    <Tooltip title="Enable or disable stock management for a product." placement="top" arrow>
                                        <IconButton size="small">
                                            <FcInfo />
                                        </IconButton>
                                    </Tooltip>
                                </span>
                            </FormGroup>
                            {/* <Typography variant='body2' style={{ marginTop: "5px" }}>Enable stock management at product level</Typography> */}
                        </Grid>
                        {product.managestock ? (
                            <>
                                <Grid item lg={2} md={2} sm={6} xs={12}>
                                    <InputLabel htmlFor="outlined-adornment-password">Minimum Quantity</InputLabel>
                                    <FormControl variant="outlined" size="small" fullWidth>
                                        <OutlinedInput
                                            sx={userStyle.input}
                                            id="outlined-adornment-password"
                                            type="number"
                                            value={product.minquantity}
                                            onChange={(e) => { setProduct({ ...product, minquantity: e.target.value }) }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={2} md={2} sm={6} xs={12}>
                                    <InputLabel htmlFor="outlined-adornment-password">Maximum Quantity</InputLabel>
                                    <FormControl variant="outlined" size="small" fullWidth>
                                        <OutlinedInput
                                            sx={userStyle.input}
                                            id="outlined-adornment-password"
                                            type="number"
                                            value={product.maxquantity}
                                            onChange={(e) => { setProduct({ ...product, maxquantity: e.target.value }) }}
                                        />
                                    </FormControl>
                                </Grid>
                            </>
                        ) : (

                            <>
                                <Grid item lg={4} md={4}></Grid>
                            </>
                        )}
                        <Grid item lg={2} md={2} sm={6} xs={12}>
                            <InputLabel htmlFor="outlined-adornment-password">Rack</InputLabel>
                            <Grid sx={{ display: 'flex' }}>
                                <FormControl variant="outlined" size="small" fullWidth>
                                    <Selects
                                        options={isRacks}
                                        styles={colourStyles}
                                        placeholder={product.rack}
                                        onChange={(e) => { setProduct({ ...product, rack: e.value }); }}
                                    />
                                </FormControl>
                                <Grid sx={userStyle.spanIcons}>
                                    <Createrack setFetchsaverack={setFetchsaverack} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item lg={9} md={9} sm={6} xs={12}></Grid>
                        <Grid item lg={9} md={9} sm={8} xs={12}>
                            <InputLabel id="demo-select-small" sx={{ m: 1 }}>Product Description</InputLabel>
                            <FormControl size="small" fullWidth >
                                <TextareaAutosize aria-label="minimum height" minRows={3} style={{ border: '1px solid #4a7bf7' }}
                                    value={product.productdescription}
                                    onChange={(e) => { setProduct({ ...product, productdescription: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={4} xs={12}>
                            <InputLabel sx={{ m: 1 }}>Product Image</InputLabel>
                            {file || capture || product.productimage ? (
                                <>
                                    <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <img src={file ? file : capture ? capture : product.productimage} width="50%" height="80px" />
                                    </Grid>
                                </>
                            ) : (
                                <></>
                            )}
                            <FormControl size="small" fullWidth>
                                <Grid sx={{ display: 'flex' }}>
                                    <Button component="label" sx={userStyle.uploadBtn}>
                                        Upload
                                        <input type='file' id="productimage" accept="image/*" name='file' hidden onChange={handleChange}
                                        />
                                    </Button>
                                    <Button onClick={showWebcam} sx={userStyle.uploadBtn}>Webcam</Button>&ensp;
                                    <Button onClick={resetImage} sx={userStyle.buttoncancel}>Reset</Button>
                                </Grid>

                                <Typography variant='body2' style={{ marginTop: "5px" }}>Max File size: 5MB</Typography>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={2}>
                        {product.hsnenable ?
                            <Grid item md={4} sm={4} xs={12}>
                                <InputLabel id="demo-select-small">HSN code</InputLabel>
                                <FormControl size="small" fullWidth>
                                    <TextField
                                        id="date"
                                        type="text"
                                        size='small'
                                        value={product.hsncode}
                                    />
                                </FormControl>
                            </Grid>
                            :
                            <Grid item md={4} sm={4} xs={12}>
                                <InputLabel id="demo-select-small">Applicable Tax</InputLabel>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        options={taxrates}
                                        styles={colourStyles}
                                        placeholder={product.applicabletax}
                                        onChange={(e) => { setProduct({ ...product, applicabletax: e.value }) }}
                                    >
                                    </Selects>
                                </FormControl>
                            </Grid>
                        }
                        <Grid item md={4} sm={4} xs={12}>
                            <InputLabel id="demo-select-small">Selling Price Tax Type <b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <Selects
                                    options={selltaxtype}
                                    styles={colourStyles}
                                    placeholder={product.sellingpricetax}
                                    onChange={(e) => { setProduct({ ...product, sellingpricetax: e.value }); }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={4} xs={12}>
                            <InputLabel >Product Type </InputLabel>
                            <FormControl size="small" fullWidth>
                                <Selects
                                    options={producttypes}
                                    styles={colourStyles}
                                    placeholder={product.producttype}
                                    onChange={(e) => { setProduct({ ...product, producttype: e.value }); }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid >
                            <Link to="/product/product/List"><Button sx={userStyle.buttoncancel} type='button'>CANCEL</Button></Link>
                            <Button sx={userStyle.buttonadd} onClick={sendRequest}>UPDATE</Button>
                        </Grid>
                    </Grid>
                </Box>
                {/* content end */}
            </form >
            <br /> <br />
            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleClosealert}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleClosealert}>ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* webcam alert start */}
            <Dialog
                open={isWebcamOpen}
                onClose={webcamClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
                    <Webcamimage getImg={getImg} setGetImg={setGetImg} />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="success" onClick={webcamDataStore}>OK</Button>
                    <Button variant="contained" color="error" onClick={webcamClose}>CANCEL</Button>
                </DialogActions>
            </Dialog>
            {/* webcam alert end */}

            {/* Check edit popup */}
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
        </Box >
    );
}

function Productedit() {
    return (

        <>
            <Producteditlist /><br /><br /><br /><br />
            <Footer />
        </>
    );
}

export default Productedit;