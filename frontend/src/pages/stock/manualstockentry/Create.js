import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, Typography, Button, Dialog, DialogContent, DialogActions } from '@mui/material';
import { userStyle, colourStyles } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Selects from "react-select";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { SERVICE } from "../../../services/Baseservice";
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';
import CreatableSelect from "react-select/creatable";



const ManualStocklist = () => {

    //  Datefield
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

    const [busilocations, setBusilocations] = useState([]);
    const [isBusilocations, setIsBusilocations] = useState({});
    const [brandOptions, setBrandOptions] = useState([]);
    const [subBrandOptions, setSubBrandOptions] = useState([]);
    const [subcategoryOptions, setSubCategoryOptions] = useState([]);
    const [suppliers, setSuppliers] = useState("");
    const { auth, setngs } = useContext(AuthContext);
    const { isUserRoleAccess, allLocations, allTaxratesGroup, isActiveLocations, allTaxrates } = useContext(UserRoleAccessContext);
    const [manualStockCategory, setManualStockCategory] = useState({
        suppliername: "Please Select Supplier Name",
        category: "Please Select Category",
        subcategory: "Please Select Subcategory",
        brand: "Please Select Brand",
        subbrand: "Please Select Subbrand",
        size: "",
        color: "",
        unit: "",
        productname: "Please Select Product Name",
        businesslocation: "",
        sku:"",
        producttax: "",
        producttaxtype: "",
        purchaserate: "",
        alpha: "",
        quantity: "",
        totalquantity: "",
        sellcostwithtax: "",
        sellcostwithouttax: "",
        sellingalpha: "",
        saletaxamount: "",
        margin: ""

    });
  // Fetch Category
  const [category, setCategory] = useState([]);
  const [subcategory, setSubCategory] = useState([]);

  // Fetch Brand
  const [brand, setBrand] = useState([]);
  const [subbrand, setSubBrand] = useState([]);

  const [products, setProducts] = useState([]);
  const [unit, setUnit] = useState([]);

  //fetch supplier...
  const [supplier, setSupplier] = useState([]);

  // Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState()
  const handleClickOpen = () => { setIsErrorOpen(true); };
  const handleClose = () => { setIsErrorOpen(false); };

    useEffect(() => {
        fetchLocations();
        fetchCategory();
        fetchUnit();
        fetchSupplier();
    }, [])

    //add dats...
    const sendRequest = async () => {
        try {
            let req = await axios.post(SERVICE.MANUALSTOCKENTRY_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                category: String(manualStockCategory.category),
                subcategory: String(manualStockCategory.subcategory),
                brand: String(manualStockCategory.brand),
                subbrand: String(manualStockCategory.subbrand),
                size: String(manualStockCategory.size),
                color: String(manualStockCategory.color),
                style: String(manualStockCategory.style),
                unit: String(manualStockCategory.unit),
                productname: String(manualStockCategory.productname),
                businesslocation: String(manualStockCategory.businesslocation == undefined ? "" : manualStockCategory.businesslocation),
                producttax: String(manualStockCategory.producttax),
                producttaxtype: String(manualStockCategory.producttaxtype),
                purchaserate: String(manualStockCategory.purchaserate),
                alpha: String(manualStockCategory.alpha),
                quantity: String(manualStockCategory.quantity),
                totalquantity: String(manualStockCategory.totalquantity),
                sellcostwithtax: String(manualStockCategory.sellcostwithtax),
                sellcostwithouttax: String(manualStockCategory.sellcostwithouttax),
                sellingalpha: String(manualStockCategory.sellingalpha),
                saletaxamount: String(manualStockCategory.saletaxamount),
                assignbusinessid: String(setngs.businessid),
                today: String(today),
                margin: String(manualStockCategory.margin),
                suppliername: String(manualStockCategory.suppliername),
            });
            toast.success(req.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
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

    const fetchSupplier = async () => {
        try {
            let res = await axios.post(SERVICE.SUPPLIER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            setSupplier(
                res?.data?.suppliers?.map((d) => ({
                    ...d,
                    label: d.suppliername,
                    value: d.suppliername
                }))
            )

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

 //fetch category
 const fetchCategory = async () => {
    try {
        const [
            res,
            ressubcat
        ] = await Promise.all([
            axios.post(SERVICE.CATEGORIES, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            }),
            axios.post(SERVICE.CATEGORIES_SUBCATEGORY, {
                headers: {
                  'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            }) 
        ])

        const categoryid = [{ label: 'ALL', value: 'ALL' }, ...res?.data?.categories.map((d) => (
            {
                ...d,
                label: d.categoryname,
                value: d.categoryname,
            }
        ))];

        setCategory(categoryid);

        const subcategoryid = [{ label: 'ALL', value: 'ALL' }, ...ressubcat?.data?.subcatrgories.map((d) => (
            {
                ...d,
                label: d.subcategryname,
                value: d.subcategryname,
            }
        ))];

        setSubCategoryOptions(subcategoryid)

    } catch (err) {
        const messages = err?.response?.data?.message;
        if (messages) {
            toast.error(messages);
        } else {
            toast.error("Something went wrong!")
        }
    }
};

//fetch Sub Category from category
const fetchSubCate = async (value) => {
    
    if(value != "ALL"){
        try {
            let res = await axios.post(SERVICE.SUB_CATEGORIES, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                categoryname: String(value)
            });

            const subcategoryid = [{ label: 'ALL', value: 'ALL' }, ...res?.data?.subcategories.map((d) => (
                {
                    ...d,
                    label: d.subcategryname,
                    value: d.subcategryname,
                }
            ))];

            setSubCategory(subcategoryid);

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }else{

        setSubCategory(subcategoryOptions)
    }
};

//fetch category vice brand
const fetchBrandName = async (valucategoryname) => {
    let catearray = [];
    let newarray = [];
    let allbransarray = [];
    if(valucategoryname != "ALL"){
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
            catearray.forEach((value)=>{
                value.forEach((valueData)=>{
                    allbransarray.push(valueData);
                })
                })

            newarray = [...new Set(allbransarray)];

            const brandid = [{ label: 'ALL', value: 'ALL' }, ...newarray.map((d) => (
                {
                    ...d,
                    label: d,
                    value: d,
                }
            ))];

            setBrandOptions(brandid);
                
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }else{
        setBrandOptions([])
    }
    
};

//fetch brand
const fetchBrand = async () => {
    try {

        const [
            res,
            ressubbrand
        ] = await Promise.all([
            axios.post(SERVICE.BRAND, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            }),
            axios.post(SERVICE.ALLSUBBRAND, {
                headers: {
                  'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            }) 
        ])
        
        const brandid = [{ label: 'ALL', value: 'ALL' }, ...res?.data?.brands.map((d) => (
            {
                ...d,
                label: d.brandname,
                value: d.brandname,
            }
        ))];

        setBrand(brandid);

        const subbrandid = [{ label: 'ALL', value: 'ALL' }, ...ressubbrand?.data?.subbrands.map((d) => (
            {
                ...d,
                label: d.subbrandname,
                value: d.subbrandname,
            }
        ))];

        setSubBrandOptions(subbrandid)

    } catch (err) {
        const messages = err?.response?.data?.message;
        if (messages) {
            toast.error(messages);
        } else {
            toast.error("Something went wrong!")
        }
    }
};
// Sub sub brand
const fetchSubBrand = async (value) => {
    if(value != 'ALL'){
        try {
            let res = await axios.post(SERVICE.SUB_BRANDS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                brandname: String(value)
            });

            const subbrandid = [{ label: 'ALL', value: 'ALL' }, ...res?.data?.subbrands.map((d) => (
                {
                    ...d,
                    label: d.subbrandname,
                    value: d.subbrandname,
                }
            ))];

            setSubBrand(subbrandid);


        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }else{

        setSubBrand(subBrandOptions);
    }
};

// filter condition
const fetchProductbySBrandandSizeandColorandStyle = async (e) => {
    let location = manualStockCategory.businesslocation == "" ? isBusilocations.locationid : setManualStockCategory.businesslocation;
    if(manualStockCategory.category == "ALL" || manualStockCategory.category == "Please Select Category"){
        if(manualStockCategory.subcategory == "ALL" || manualStockCategory.subcategory == "Please Select Subcategory"){
            if(manualStockCategory.brand == "ALL" || manualStockCategory.brand == "Please Select Brand"){
                try {
                    let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        assignbusinessid: String(setngs.businessid),
                        businesslocation: String(location),
        
                    });

                    setProducts(
                        res?.data?.products?.map((d) => ({
                            ...d,
                            label: d.productname,
                            value: d.productname
                        }))
                    )
        
                } catch (err) {
                    const messages = err?.response?.data?.message;
                    if (messages) {
                        toast.error(messages);
                    } else {
                        toast.error("Something went wrong!")
                    }
                }
            }else if(manualStockCategory.brand !== "ALL" || manualStockCategory.brand !== "Please Select Brand"){
                try {
                    let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        assignbusinessid: String(setngs.businessid),
                        businesslocation: String(location),
                        brand: String(manualStockCategory.brand),
        
                    });
                   
                    setProducts(
                        res?.data?.products?.map((d) => ({
                            ...d,
                            label: d.productname,
                            value: d.productname
                        }))
                    )
        
                } catch (err) {
                    const messages = err?.response?.data?.message;
                    if (messages) {
                        toast.error(messages);
                    } else {
                        toast.error("Something went wrong!")
                    }
                }
            }else {
                try {
                    let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        assignbusinessid: String(setngs.businessid),
                        businesslocation: String(location),
        
                    });
                   
                    setProducts(
                        res?.data?.products?.map((d) => ({
                            ...d,
                            label: d.productname,
                            value: d.productname
                        }))
                    )
        
                } catch (err) {
                    const messages = err?.response?.data?.message;
                    if (messages) {
                        toast.error(messages);
                    } else {
                        toast.error("Something went wrong!")
                    }
                }
            }
           
        }else if(manualStockCategory.subcategory !== "ALL" || manualStockCategory.subcategory !== "Please Select Subcategory"){
            if(manualStockCategory.brand == "ALL" || manualStockCategory.brand == "Please Select Brand"){
                try {
                    let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        assignbusinessid: String(setngs.businessid),
                        businesslocation: String(location),
                        subcategory: String(manualStockCategory.subcategory),
        
                    });
                   
                    setProducts(
                        res?.data?.products?.map((d) => ({
                            ...d,
                            label: d.productname,
                            value: d.productname
                        }))
                    )
        
                } catch (err) {
                    const messages = err?.response?.data?.message;
                    if (messages) {
                        toast.error(messages);
                    } else {
                        toast.error("Something went wrong!")
                    }
                }
            }else if(manualStockCategory.brand !== "ALL" || manualStockCategory.brand !== "Please Select Brand"){
                try {
                    let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        assignbusinessid: String(setngs.businessid),
                        businesslocation: String(location),
                        subcategory: String(manualStockCategory.subcategory),
                        brand: String(manualStockCategory.brand),
        
                    });
                   
                    setProducts(
                        res?.data?.products?.map((d) => ({
                            ...d,
                            label: d.productname,
                            value: d.productname
                        }))
                    )
        
                } catch (err) {
                    const messages = err?.response?.data?.message;
                    if (messages) {
                        toast.error(messages);
                    } else {
                        toast.error("Something went wrong!")
                    }
                }
            }else {
                try {
                    let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        assignbusinessid: String(setngs.businessid),
                        subcategory: String(manualStockCategory.subcategory),
                        businesslocation: String(location),
        
                    });
                   
                    setProducts(
                        res?.data?.products?.map((d) => ({
                            ...d,
                            label: d.productname,
                            value: d.productname
                        }))
                    )
        
                } catch (err) {
                    const messages = err?.response?.data?.message;
                    if (messages) {
                        toast.error(messages);
                    } else {
                        toast.error("Something went wrong!")
                    }
                }
            }
        }
    }else if(manualStockCategory.category !== "ALL" || manualStockCategory.category !== "Please Select Category"){
        if(manualStockCategory.subcategory == "ALL" || manualStockCategory.subcategory == "Please Select Subcategory"){
            if(manualStockCategory.brand == "ALL" || manualStockCategory.brand == "Please Select Brand"){
                try {
                    let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        assignbusinessid: String(setngs.businessid),
                        businesslocation: String(location),
                        category: String(manualStockCategory.category),
        
                    });
                   
                    setProducts(
                        res?.data?.products?.map((d) => ({
                            ...d,
                            label: d.productname,
                            value: d.productname
                        }))
                    )
        
                } catch (err) {
                    const messages = err?.response?.data?.message;
                    if (messages) {
                        toast.error(messages);
                    } else {
                        toast.error("Something went wrong!")
                    }
                }
            }else if(manualStockCategory.brand !== "ALL" || manualStockCategory.brand !== "Please Select Brand"){
                try {
                    let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        assignbusinessid: String(setngs.businessid),
                        businesslocation: String(location),
                        category: String(manualStockCategory.category),
                        brand: String(manualStockCategory.brand),
        
                    });
                  
                    setProducts(
                        res?.data?.products?.map((d) => ({
                            ...d,
                            label: d.productname,
                            value: d.productname
                        }))
                    )
        
                } catch (err) {
                    const messages = err?.response?.data?.message;
                    if (messages) {
                        toast.error(messages);
                    } else {
                        toast.error("Something went wrong!")
                    }
                }
            }else {
                try {
                    let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        assignbusinessid: String(setngs.businessid),
                        category: String(manualStockCategory.category),
                        businesslocation: String(location),
        
                    });
                  
                    setProducts(
                        res?.data?.products?.map((d) => ({
                            ...d,
                            label: d.productname,
                            value: d.productname
                        }))
                    )
        
                } catch (err) {
                    const messages = err?.response?.data?.message;
                    if (messages) {
                        toast.error(messages);
                    } else {
                        toast.error("Something went wrong!")
                    }
                }
            }
           
        }else if(manualStockCategory.subcategory !== "ALL" || manualStockCategory.subcategory !== "Please Select Subcategory"){
            if(manualStockCategory.brand == "ALL" || manualStockCategory.brand == "Please Select Brand"){
                try {
                    let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        assignbusinessid: String(setngs.businessid),
                        businesslocation: String(location),
                        category: String(manualStockCategory.category),
                        subcategory: String(manualStockCategory.subcategory),
        
                    });
                   
                    setProducts(
                        res?.data?.products?.map((d) => ({
                            ...d,
                            label: d.productname,
                            value: d.productname
                        }))
                    )
        
                } catch (err) {
                    const messages = err?.response?.data?.message;
                    if (messages) {
                        toast.error(messages);
                    } else {
                        toast.error("Something went wrong!")
                    }
                }
            }else if(manualStockCategory.brand !== "ALL" || manualStockCategory.brand !== "Please Select Brand"){
                try {
                    let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        assignbusinessid: String(setngs.businessid),
                        businesslocation: String(location),
                        category: String(manualStockCategory.category),
                        subcategory: String(manualStockCategory.subcategory),
                        brand: String(manualStockCategory.brand),
        
                    });
                   
                    setProducts(
                        res?.data?.products?.map((d) => ({
                            ...d,
                            label: d.productname,
                            value: d.productname
                        }))
                    )
        
                } catch (err) {
                    const messages = err?.response?.data?.message;
                    if (messages) {
                        toast.error(messages);
                    } else {
                        toast.error("Something went wrong!")
                    }
                }
            }else {
                try {
                    let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        assignbusinessid: String(setngs.businessid),
                        category: String(manualStockCategory.category),
                        subcategory: String(manualStockCategory.subcategory),
                        businesslocation: String(location),
        
                    });
                  
                    setProducts(
                        res?.data?.products?.map((d) => ({
                            ...d,
                            label: d.productname,
                            value: d.productname
                        }))
                    )
        
                } catch (err) {
                    const messages = err?.response?.data?.message;
                    if (messages) {
                        toast.error(messages);
                    } else {
                        toast.error("Something went wrong!")
                    }
                }
            }
        }
    }
    
    else {
        try {
            let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                assignbusinessid: String(setngs.businessid),
                businesslocation: String(manualStockCategory.businesslocation == "" ? isBusilocations.locationid : manualStockCategory.businesslocation),
                category: String(manualStockCategory.category == "Please Select Category" ? "" : manualStockCategory.category),
                subcategory: String(manualStockCategory.subcategory == "Please Select Subcategory" ? "" : manualStockCategory.subcategory),
                brand: String(manualStockCategory.brand == "Please Select Brand" ? "" : manualStockCategory.brand),
                subbrand: String(manualStockCategory.subbrand == "Please Select Subbrand" ? "" : manualStockCategory.subbrand),

            });
            
            setProducts(
                res?.data?.products?.map((d) => ({
                    ...d,
                    label: d.productname,
                    value: d.productname
                }))
            )

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }
   
}

    const fetchUnit = async () => {
        try {
            let res = await axios.post(SERVICE.UNIT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setUnit(res?.data?.units.map((d) => (
                {
                    ...d,
                    label: d.unit,
                    value: d.unit
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
 

    const handleClear = () => {
        setManualStockCategory({
            suppliername: "Please Select Supplier Name",
            category: "Please Select Category",
            subcategory: "Please Select Subcategory",
            brand: "Please Select Brand",
            subbrand: "Please Select Subbrand",
            size: "Please Select Size",
            color: "Please Select Color",
            style: "Please Select Style",
            unit: "",
            productname: "Please Select Product Name",
            businesslocation: "",
            producttax: "",
            producttaxtype: "",
            purchaserate: "",
            alpha: "",
            quantity: "",
            totalquantity: "",
            sellcostwithtax: "",
            sellcostwithouttax: "",
            sellingalpha: "",
            saletaxamount: "",
            margin: ""

        })

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (manualStockCategory.suppliername == "") {
            setShowAlert("Please select supplier!");
            handleClickOpen();
        }
        else if (manualStockCategory.category == "") {
            setShowAlert("Please select Category!");
            handleClickOpen();
        }
        else if (manualStockCategory.subcategory == "") {
            setShowAlert("Please select SubCategory!");
            handleClickOpen();
        }
        else if (manualStockCategory.brand == "") {
            setShowAlert("Please select Brand!");
            handleClickOpen();
        }
        else if (manualStockCategory.size == "") {
            setShowAlert("Please select Size!");
            handleClickOpen();
        }
        else if (manualStockCategory.color == "") {
            setShowAlert("Please select Color!");
            handleClickOpen();
        }
        else if (manualStockCategory.style == "") {
            setShowAlert("Please select Style!");
            handleClickOpen();
        }
        else {
            sendRequest();
        }
    }

    return (
        <Box>
            <Headtitle title={'Manual Stock Entry'} />
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3} >
                    <Grid item lg={8} md={8} sm={12} xs={12}>
                        <Typography sx={userStyle.HeaderText}>Manual Stock Entry</Typography>
                    </Grid>
                    <Grid item lg={4} md={4} sm={6} xs={12}>
                        <InputLabel >Business Location<b style={{ color: "red" }}> *</b></InputLabel>
                        <FormControl size="small" fullWidth>
                            <Selects
                                options={busilocations}
                                styles={colourStyles}
                                placeholder={isBusilocations ? isBusilocations.name : ""}
                                onChange={(e) => { setManualStockCategory({ ...manualStockCategory, businesslocation: e.value }); }}
                            />
                        </FormControl>
                    </Grid>
                </Grid><br />
                <Box sx={userStyle.container}>
                    <Grid container spacing={3} >
                        <Grid item lg={3} md={3} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Supplier name</InputLabel>
                            <FormControl size="small" fullWidth>

                                <CreatableSelect
                                    options={supplier}
                                    placeholder="Please Select Supplier Name"
                                    value={{ label: manualStockCategory.suppliername, value: manualStockCategory.suppliername }}
                                    onChange={(e) => { setManualStockCategory({ ...manualStockCategory, suppliername: e.value }); }}
                                    onCreateOption={(inputValue) => {
                                        const newOption2 = {
                                            value: inputValue,
                                            label: inputValue
                                        };

                                        setManualStockCategory({ ...manualStockCategory, suppliername: newOption2.value });
                                    }}
                                    formatCreateLabel={(inputValue) =>
                                        `Create "${inputValue}"`
                                    }
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12} >
                        <InputLabel id="demo-select-small">Category</InputLabel>
                        <FormControl size="small" fullWidth>
                            <Selects
                                isClearable={true}
                                options={category}
                                value={{ label: manualStockCategory.category, value: manualStockCategory.category }}
                                onChange={(e) => {
                                    fetchSubCate(e.value);
                                    fetchBrandName(e.value)
                                    setManualStockCategory({ ...manualStockCategory, category: e.value, subcategory: "Please Select Subcategory", brand: "Please Select Brand", subbrand:"Please Select Subbrand"});
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={3} md={3} sm={6} xs={12} >
                        <InputLabel id="demo-select-small">SubCategory</InputLabel>
                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                            <Grid sx={{ display: 'flex' }}>
                                <Selects
                                    isClearable={true}
                                    options={subcategory}
                                    value={{ label: manualStockCategory.subcategory, value: manualStockCategory.subcategory }}
                                    onChange={(e) => {
                                        setManualStockCategory({ ...manualStockCategory, subcategory: e.value, });
                                    }}

                                />
                            </Grid>
                        </FormControl>
                    </Grid>
                    <Grid item lg={3} md={3} sm={6} xs={12} >
                        <InputLabel id="demo-select-small">Brand</InputLabel>
                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                            <Grid sx={{ display: 'flex' }}>
                                <Selects
                                    isClearable={true}
                                    options={manualStockCategory.category == "Please Select Category" || manualStockCategory.category == "ALL" ? brand : brandOptions}
                                    value={{ label: manualStockCategory.brand, value: manualStockCategory.brand }}
                                    onChange={(e) => {
                                        fetchSubBrand(e.value);
                                        setManualStockCategory({ ...manualStockCategory, brand: e.value, subbrand:"Please Select Subbrand"});
                                    }}

                                />
                            </Grid>
                        </FormControl>
                    </Grid>
                    <Grid item lg={3} md={3} sm={6} xs={12} >
                        <InputLabel id="demo-select-small">SubBrand</InputLabel>
                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                            <Grid sx={{ display: 'flex' }}>
                                <Selects
                                    isClearable={true}
                                    options={subbrand}
                                    value={{ label: manualStockCategory.subbrand, value: manualStockCategory.subbrand }}
                                    onChange={(e) => {
                                        setManualStockCategory({ ...manualStockCategory, subbrand: e.value, });
                                    }}

                                />
                            </Grid>
                        </FormControl>
                    </Grid>
                    <Grid item lg={3} md={3} sm={6} xs={12} >
                        <InputLabel id="demo-select-small">Product</InputLabel>
                        <FormControl size="small" fullWidth>
                            <Selects
                                isClearable={true}
                                options={products}
                                value={{ label: manualStockCategory.productname, value: manualStockCategory.productname }}
                                onChange={(e) => {
                                    setManualStockCategory({ ...manualStockCategory, size:e.size, color:e.color, productname:e.productname, sku:e.sku, producttax:e.hsn == "" || e.hsn == "None" ? e.applicabletax : e.hsn, producttaxtype:e.sellingpricetax});
                                }}
                            />
                        </FormControl>
                    </Grid>
                        <Grid item lg={12} md={12} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Supplier  Address :</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <Grid sx={{ display: 'flex' }}>
                                    <Typography>{suppliers}</Typography>
                                </Grid>
                            </FormControl>
                        </Grid>

                        <Grid container sx={userStyle.gridcontainer}>
                            <Grid>
                                <Button sx={userStyle.buttonadd} onClick={fetchProductbySBrandandSizeandColorandStyle}>filter</Button>
                            </Grid>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Product Tax</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={manualStockCategory.producttax}
                                    name="Producttax"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Selling Tax Type</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={manualStockCategory.producttaxtype}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Margin</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput

                                    id="component-outlined"
                                    value={setngs.dprofitpercent}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item lg={3} md={3} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Purchase Rate</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={manualStockCategory.purchaserate}
                                    placeholder="Purchase Rate"
                                    onChange={(e) => { setManualStockCategory({ ...manualStockCategory, purchaserate: e.target.value});}}
                                    type="number"
                                    sx={userStyle.input}
                                    name="purchaserate"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Purchase Alpha</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}

                                    id="component-outlined"
                                    value={manualStockCategory.purchasealpha}
                                    type="number"
                                    name="alpha"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Quantity</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}

                                    id="component-outlined"
                                    value={manualStockCategory.quantity}
                                    placeholder="Quantity"

                                    onChange={(e) => setManualStockCategory({ ...manualStockCategory, quantity: e.target.value })}
                                    type="number"
                                    name="quantity"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Unit</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Selects
                                    options={unit}
                                    placeholder="Unit"
                                    value={{ label: manualStockCategory.unit, value: manualStockCategory.unit }}
                                    onChange={(e) => {
                                        setManualStockCategory({
                                            ...manualStockCategory, unit: e.value,
                                        });

                                    }}


                                />
                            </FormControl>
                        </Grid>


                        <Grid item lg={3} md={3} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Total Quantity</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}

                                    id="component-outlined"
                                    value={manualStockCategory.totalquantity}
                                    placeholder="Total Quantity"

                                    onChange={(e) => { setManualStockCategory({ ...manualStockCategory, totalquantity: e.target.value });}}
                                    type="number"
                                    name="totalquantity"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Selling Cost With Tax</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}

                                    id="component-outlined"
                                    value={manualStockCategory.sellcostwithtax}
                                    placeholder="Selling Cost With Tax"

                                    onChange={(e) => { setManualStockCategory({ ...manualStockCategory, sellcostwithtax: e.target.value });}}
                                    type="number"
                                    name="totalquantity"
                                />
                            </FormControl>
                        </Grid>


                        <Grid item lg={3} md={3} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Sale Tax Amount</InputLabel>
                            <FormControl size="small" fullWidth>

                                <OutlinedInput
                                    sx={userStyle.input}

                                    id="component-outlined"
                                    placeholder="Sale Tax Amount"

                                    value={manualStockCategory.saletaxamount}
                                    onChange={(e) => { setManualStockCategory({ ...manualStockCategory, saletaxamount: e.target.value });}}
                                    type="number"
                                    name="totalquantity"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Selling Cost Without Tax</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    id="component-outlined"
                                    value={manualStockCategory.sellcostwithouttax}
                                    placeholder="Selling Cost Without Tax"
                                    onChange={(e) => { setManualStockCategory({ ...manualStockCategory, sellcostwithouttax: e.target.value }); }}
                                    type="number"
                                    name="totalquantity"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid >
                            <Button sx={userStyle.buttoncancel} onClick={handleClear}>CLEAR</Button>
                            <Link to="/stock/manualstock/List"><Button sx={userStyle.buttoncancel}>CLOSE</Button></Link>
                            <Button sx={userStyle.buttonadd} type='submit'>SAVE</Button>
                        </Grid>
                    </Grid>
                </Box><br />
            </form >
            {/* ALERT DIALOG */}
            < Box >
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
            </Box >
        </Box >
    );
}
const ManualStockcreate = () => {
    return (
        <>
            <ManualStocklist /><br /><br /><br />
            <Footer />
        </>
    );
}

export default ManualStockcreate;  