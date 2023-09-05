import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, Button, Typography, Dialog, DialogContent, DialogActions, Select, MenuItem, } from '@mui/material';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Headtitle from '../../../components/header/Headtitle';
import { AuthContext } from '../../../context/Appcontext';
import { SERVICE } from '../../../services/Baseservice';
import Footer from '../../../components/footer/Footer';
import { useNavigate } from 'react-router-dom';
import { userStyle, colourStyles } from '../../PageStyle';
import { toast } from 'react-toastify';
import Selects from 'react-select';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import axios from 'axios';

const Discountcreate = () => {

    const [discounts, setDiscounts] = useState();
    const [productList, setProductList] = useState([]);
    const [busilocations, setBusilocations] = useState([]);
    const [product, setProduct] = useState({});
    const { auth, setngs } = useContext(AuthContext);
    const [locationData, setLocationData] = useState([])
    const [duplicate, setDuplicate] = useState([]);
    // Access
    const { isUserRoleAccess, allLocations, isActiveLocations, allProducts } = useContext(UserRoleAccessContext);

    const [disAddForm, setDisAddForm] = useState({
        category: "Please Select Category",
        subcategory: "Please Select Subcategory",
        brand: "Please Select Brand",
        subbrand: "Please Select Subbrand",
        products: "Please Select Product",
        discounttype: "None", selectdiscountprice: "Purchase Excluding Tax",
        businesslocation: "", discountid: "", name: "",
        purchaseexcludetax: "",
        pruchaseincludetax: "", sellingexcludetax: "",
        discountamt: 0, discountvalue: 0, startsat: "", endsat: "", isactive: "",
    });

    // Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };



    // start  ...........................
    const [isBusilocations, setIsBusilocations] = useState({});
    const [category, setCategory] = useState([]);

    const fetchLocations = async () => {
        try {

            let selectlocation = allLocations?.filter((data, index) => {
                return data?.locationid == setngs.businesslocation
            })
            setIsBusilocations(selectlocation[0]);
            setBusilocations(isActiveLocations?.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d?.locationid,
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

    useEffect(() => { fetchLocations() }, [])

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
    useEffect(() => { fetchCategory() }, [])

    //fetch Sub Category from category
    const [subcategory, setSubCategory] = useState([]);
    const [subcategoryOptions, setSubCategoryOptions] = useState([]);

    const fetchSubCate = async (value) => {

        if (value != "ALL") {
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
        } else {

            setSubCategory(subcategoryOptions)
        }
    };

    const [brand, setBrand] = useState([]);
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

    //fetch category vice brand
    const [brandOptions, setBrandOptions] = useState([]);
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
        } else {
            setBrandOptions([])
        }

    };

    // Sub sub brand
    const [subbrand, setSubBrand] = useState([]);
    const [subBrandOptions, setSubBrandOptions] = useState([]);
    const fetchSubBrand = async (value) => {
        if (value != 'ALL') {
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
        } else {

            setSubBrand(subBrandOptions);
        }
    };
    const [filterData, setFilterData] = useState([])

    const fetchProductbySBrandandSizeandColorandStyle = async (e) => {

        let location = disAddForm.businesslocation == "" ? isBusilocations?.locationid : disAddForm.businesslocation;

        if (disAddForm.category == "ALL" || disAddForm.category == "Please Select Category") {
            if (disAddForm.subcategory == "ALL" || disAddForm.subcategory == "Please Select Subcategory") {
                if (disAddForm.brand == "ALL" || disAddForm.brand == "Please Select Brand") {
                    try {
                        let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                            headers: {
                                'Authorization': `Bearer ${auth.APIToken}`
                            },
                            assignbusinessid: String(setngs.businessid),
                            businesslocation: String(location),

                        });

                        setFilterData(
                            res?.data?.products.map((d) => ({
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
                } else if (disAddForm.brand !== "ALL" || disAddForm.brand !== "Please Select Brand") {
                    try {
                        let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                            headers: {
                                'Authorization': `Bearer ${auth.APIToken}`
                            },
                            assignbusinessid: String(setngs.businessid),
                            businesslocation: String(location),
                            brand: String(disAddForm.brand),

                        });

                        setFilterData(
                            res?.data?.products.map((d) => ({
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
                } else {
                    try {
                        let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                            headers: {
                                'Authorization': `Bearer ${auth.APIToken}`
                            },
                            assignbusinessid: String(setngs.businessid),
                            businesslocation: String(location),

                        });

                        setFilterData(
                            res?.data?.products.map((d) => ({
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
                }

            } else if (disAddForm.subcategory !== "ALL" || disAddForm.subcategory !== "Please Select Subcategory") {
                if (disAddForm.brand == "ALL" || disAddForm.brand == "Please Select Brand") {
                    try {
                        let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                            headers: {
                                'Authorization': `Bearer ${auth.APIToken}`
                            },
                            assignbusinessid: String(setngs.businessid),
                            businesslocation: String(location),
                            subcategory: String(disAddForm.subcategory),

                        });

                        setFilterData(
                            res?.data?.products.map((d) => ({
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
                } else if (disAddForm.brand !== "ALL" || disAddForm.brand !== "Please Select Brand") {
                    try {
                        let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                            headers: {
                                'Authorization': `Bearer ${auth.APIToken}`
                            },
                            assignbusinessid: String(setngs.businessid),
                            businesslocation: String(location),
                            subcategory: String(disAddForm.subcategory),
                            brand: String(disAddForm.brand),

                        });

                        setFilterData(
                            res?.data?.products.map((d) => ({
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
                } else {
                    try {
                        let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                            headers: {
                                'Authorization': `Bearer ${auth.APIToken}`
                            },
                            assignbusinessid: String(setngs.businessid),
                            subcategory: String(disAddForm.subcategory),
                            businesslocation: String(location),

                        });

                        setFilterData(
                            res?.data?.products.map((d) => ({
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
                }
            }
        } else if (disAddForm.category !== "ALL" || disAddForm.category !== "Please Select Category") {
            if (disAddForm.subcategory == "ALL" || disAddForm.subcategory == "Please Select Subcategory") {
                if (disAddForm.brand == "ALL" || disAddForm.brand == "Please Select Brand") {
                    try {
                        let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                            headers: {
                                'Authorization': `Bearer ${auth.APIToken}`
                            },
                            assignbusinessid: String(setngs.businessid),
                            businesslocation: String(location),
                            category: String(disAddForm.category),

                        });

                        setFilterData(
                            res?.data?.products.map((d) => ({
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
                } else if (disAddForm.brand !== "ALL" || disAddForm.brand !== "Please Select Brand") {
                    try {
                        let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                            headers: {
                                'Authorization': `Bearer ${auth.APIToken}`
                            },
                            assignbusinessid: String(setngs.businessid),
                            businesslocation: String(location),
                            category: String(disAddForm.category),
                            brand: String(disAddForm.brand),

                        });

                        setFilterData(
                            res?.data?.products.map((d) => ({
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
                } else {
                    try {
                        let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                            headers: {
                                'Authorization': `Bearer ${auth.APIToken}`
                            },
                            assignbusinessid: String(setngs.businessid),
                            category: String(disAddForm.category),
                            businesslocation: String(location),

                        });

                        setFilterData(
                            res?.data?.products.map((d) => ({
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
                }

            } else if (disAddForm.subcategory !== "ALL" || disAddForm.subcategory !== "Please Select Subcategory") {
                if (disAddForm.brand == "ALL" || disAddForm.brand == "Please Select Brand") {
                    try {
                        let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                            headers: {
                                'Authorization': `Bearer ${auth.APIToken}`
                            },
                            assignbusinessid: String(setngs.businessid),
                            businesslocation: String(location),
                            category: String(disAddForm.category),
                            subcategory: String(disAddForm.subcategory),

                        });

                        setFilterData(
                            res?.data?.products.map((d) => ({
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
                } else if (disAddForm.brand !== "ALL" || disAddForm.brand !== "Please Select Brand") {
                    try {
                        let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                            headers: {
                                'Authorization': `Bearer ${auth.APIToken}`
                            },
                            assignbusinessid: String(setngs.businessid),
                            businesslocation: String(location),
                            category: String(disAddForm.category),
                            subcategory: String(disAddForm.subcategory),
                            brand: String(disAddForm.brand),

                        });

                        setFilterData(
                            res?.data?.products.map((d) => ({
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
                } else {
                    try {
                        let res = await axios.post(SERVICE.PRODUCT_CATEGORY_STOCK, {
                            headers: {
                                'Authorization': `Bearer ${auth.APIToken}`
                            },
                            assignbusinessid: String(setngs.businessid),
                            category: String(disAddForm.category),
                            subcategory: String(disAddForm.subcategory),
                            businesslocation: String(location),

                        });

                        setFilterData(
                            res?.data?.products.map((d) => ({
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
                    businesslocation: String(disAddForm.businesslocation == "" ? isBusilocations?.locationid : disAddForm.businesslocation),
                    category: String(disAddForm.category == "Please Select Category" ? "" : disAddForm.category),
                    subcategory: String(disAddForm.subcategory == "Please Select Subcategory" ? "" : disAddForm.subcategory),
                    brand: String(disAddForm.brand == "Please Select Brand" ? "" : disAddForm.brand),
                    subbrand: String(disAddForm.subbrand == "Please Select Subbrand" ? "" : disAddForm.subbrand),

                });

                setFilterData(
                    res?.data?.products.map((d) => ({
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
        }

    }
    useEffect(() => { fetchBrand(); }, [])
    // end .............................


    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    // auto id for pur  chase number
    let newval = setngs ? setngs.discountsku == undefined ? "DS0001" : setngs.discountsku + "0001" : "DS0001";

    // Discounts
    const fetchDiscount = async () => {
        try {
            let res = await axios.post(SERVICE.DISCOUNT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]
            });

            let locresult = res.data.discounts.map((data, index) => {
                return data.discountid
            })
            setDuplicate(res.data.discounts)
            setBusilocations(isActiveLocations.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.locationid,
                }
            )));
            setLocationData(locresult);
            setDiscounts(res?.data?.discounts);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    // get all products based on location
    const getProducts = (e) => {
        let getcustomerallbill = allProducts?.filter((item) => {
            return e.locationid == item.businesslocation
        })
        setProductList(
            getcustomerallbill?.map((d) => ({
                ...d,
                label: d.productname,
                value: d.productname,
            }))
        );

    }

    // Search Addressone
    const searchAdd = async (id) => {
        try {
            let request = await axios.get(`${SERVICE.PRODUCT_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setProduct(request?.data?.sproduct);
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

    useEffect(
        () => {
            fetchDiscount()
        }, []
    );

    let purExc = product.purchaseexcludetax
    let purInc = product.pruchaseincludetax
    let selExc = product.sellingexcludetax

    const getDiscount = () => {

        if (disAddForm.discounttype == "None") {
            setDisAddForm({
                ...disAddForm, discountvalue: disAddForm.discountvalue
            })
        }
        if (disAddForm.discounttype == "Fixed" || disAddForm.discounttype == "Amount") {
            if (disAddForm.selectdiscountprice == "Purchase Excluding Tax") {
                setDisAddForm({
                    ...disAddForm, discountvalue: Number(purExc) - Number(disAddForm.discountamt)
                })
            }
            else if (disAddForm.selectdiscountprice == "Purchase Including Tax") {
                setDisAddForm({
                    ...disAddForm, discountvalue: Number(purInc) - Number(disAddForm.discountamt)
                })
            }
            else if (disAddForm.selectdiscountprice == "Selling Tax") {
                setDisAddForm({
                    ...disAddForm, discountvalue: Number(selExc) - Number(disAddForm.discountamt)
                })
            }
        }
        if (disAddForm.discounttype == "Percentage") {
            if (disAddForm.selectdiscountprice == "Purchase Excluding Tax") {
                setDisAddForm({
                    ...disAddForm, discountvalue: Number(purExc) - (Number(purExc) * (Number(disAddForm.discountamt) / 100))
                })
            }
            else if (disAddForm.selectdiscountprice == "Purchase Including Tax") {
                setDisAddForm({
                    ...disAddForm, discountvalue: Number(purInc) - (Number(purExc) * (Number(disAddForm.discountamt) / 100))
                })
            }
            else if (disAddForm.selectdiscountprice == "Selling Tax") {
                setDisAddForm({
                    ...disAddForm, discountvalue: Number(selExc) - (Number(purExc) * (Number(disAddForm.discountamt) / 100))
                })
            }
        }
    }

    useEffect(() => {
        getDiscount();
    }, [productList, disAddForm.discountamt, disAddForm.discountvalue])

    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

    const bactToPage = useNavigate();

    const sendRequest = async () => {
        try {
            let req = await axios.post(SERVICE.DISCOUNT_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businesslocation: String(disAddForm.businesslocation == "" ? isBusilocations.name : disAddForm.businesslocation),
                discountid: String(newval),
                name: String(disAddForm.name),
                products: String(disAddForm.products),
                productid: String(product.sku),
                category: String(product.category),
                subcategory: String(product.subcategory),
                brand: String(product.brand),
                subbrand: String(product.subbrand),
                purchaseexcludetax: Number(product.purchaseexcludetax),
                pruchaseincludetax: Number(product.pruchaseincludetax),
                sellingvalue: Number(product.sellingexcludetax),
                discounttype: String(disAddForm.discounttype),
                selectdiscountprice: String(disAddForm.selectdiscountprice),
                discountamt: Number(disAddForm.discountamt),
                discountvalue: Number(disAddForm.discountvalue),
                startsat: String(disAddForm.startsat),
                endsat: String(disAddForm.endsat),
                assignbusinessid: String(setngs.businessid),
            });
            setDisAddForm(req.data);
            toast.success(req.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            bactToPage('/product/discount/list');
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }

    }

    const handleAddSubmit = (e) => {
        e.preventDefault();
        const isProNameMatch = duplicate.some(item => item.productid?.toLowerCase() === (product.sku)?.toLowerCase());
        const isStartDate = duplicate.some(item => item.startsat?.toLowerCase() === (disAddForm.startsat)?.toLowerCase());
        const isEndDate = duplicate.some(item => item.endsat?.toLowerCase() === (disAddForm.endsat)?.toLowerCase());

        if (locationData.includes(disAddForm.discounid)) {
            setShowAlert("ID Already Exists");
            handleClickOpen();
        }
        else if (disAddForm.name == "") {
            setShowAlert("Please Enter Name!")
            handleClickOpen();
        }
        else if (disAddForm.products == "") {
            setShowAlert("Please Select Product Name!")
            handleClickOpen();
        }
        else if (disAddForm.discounttype == "") {
            setShowAlert("Please Select Discount Type!")
            handleClickOpen();
        }
        else if (disAddForm.discountamt == "") {
            setShowAlert("Please Enter Discount Amount!")
            handleClickOpen();
        }
        else if (disAddForm.startsat == "") {
            setShowAlert("Please Enter Start Date!")
            handleClickOpen();
        }
        else if (disAddForm.endsat == "") {
            setShowAlert("Please Enter End Date!")
            handleClickOpen();
        }
        else if (isProNameMatch && isStartDate) {
            setShowAlert("This Product StarDate Already Exists!")
            handleClickOpen();
        }
        else if (isProNameMatch && isEndDate) {
            setShowAlert("This Product EndDate Already Exists!")
            handleClickOpen();
        }
        else {
            sendRequest();
        }
    }

    const handleBack = () => {
        bactToPage('/product/discount/list')
    }

    const handleValidationName = (e) => {
        let val = e.target.value;
        let numbers = new RegExp('[0-9]')
        var regExSpecialChar = /[`₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (e.target.value.match(numbers)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setDisAddForm({ ...disAddForm, name: value })
        }
        else if (regExSpecialChar.test(e.target.value)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setDisAddForm({ ...disAddForm, name: value })
        }
    }

    const handleValidationAmount = (e) => {
        let val = e.target.value;
        let alphabets = new RegExp('[a-zA-Z]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (e.target.value.match(alphabets)) {
            setShowAlert("Please enter numbers only! (0-9)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setDisAddForm({ ...disAddForm, discountamt: value })
        }
        else if (regExSpecialChar.test(e.target.value)) {
            setShowAlert("Please enter numbers only! (0-9)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setDisAddForm({ ...disAddForm, discountamt: value })
        }
    }

    const handleClear = () => {
        setDisAddForm({
            category: "Please Select Category",
            subcategory: "Please Select Subcategory",
            brand: "Please Select Brand",
            subbrand: "Please Select Subbrand",
            products: "Please Select Product",
            discounttype: "None", selectdiscountprice: "Purchase Excluding Tax",
            businesslocation: "", discountid: "", name: "", purchaseexcludetax: "",
            pruchaseincludetax: "", sellingexcludetax: "",
            discountamt: "", discountvalue: "", startsat: "", endsat: "", isactive: "",
        })
    }

    return (
        <Box>
            <Headtitle title={'Add Discount'} />
            <Grid container spacing={3} >
                <Grid item lg={8} md={8} sm={12} xs={12}>
                    <Typography sx={userStyle.HeaderText} style={{ paddingTop: "10px" }}>Add Discount</Typography>
                </Grid>
                <Grid item lg={4} md={4} sm={6} xs={12}>
                    <InputLabel >Business Location<b style={{ color: "red" }}> *</b></InputLabel>
                    <FormControl size="small" fullWidth>
                        <Selects
                            options={busilocations}
                            styles={colourStyles}
                            placeholder={isBusilocations ? isBusilocations.name : ""}
                            onChange={(e) => {
                                getProducts(e);
                                setDisAddForm({ ...disAddForm, businesslocation: e.value });
                            }} />
                    </FormControl>
                </Grid>
            </Grid><br />
            <Box sx={userStyle.container}>
                <Grid container spacing={3}>
                    <Grid item lg={3} md={3} sm={6} xs={12} >
                        <InputLabel id="demo-select-small">Category</InputLabel>
                        <FormControl size="small" fullWidth>
                            <Selects
                                styles={colourStyles}
                                isClearable={true}
                                options={category}
                                placeholder={"Please Select Category"}
                                value={{ label: disAddForm.category, value: disAddForm.category }}
                                onChange={(e) => {
                                    fetchSubCate(e?.value);
                                    fetchBrandName(e?.value)
                                    setDisAddForm({ ...disAddForm, category: e.value, subcategory: "Please Select Subcategory", brand: "Please Select Brand", subbrand: "Please Select Subbrand" });
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={3} md={3} sm={6} xs={12} >
                        <InputLabel id="demo-select-small">SubCategory</InputLabel>
                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                            <Grid sx={{ display: 'flex' }}>
                                <Selects
                                    placeholder={"Please Select SubCategory"}
                                    styles={colourStyles}
                                    isClearable={true}
                                    options={subcategory}
                                    value={{ label: disAddForm.subcategory, value: disAddForm.subcategory }}
                                    onChange={(e) => {
                                        setDisAddForm({ ...disAddForm, subcategory: e.value, });
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
                                    placeholder={"Please Select Brand"}
                                    styles={colourStyles}
                                    isClearable={true}
                                    options={disAddForm.category == "Please Select Category" || disAddForm.category == "ALL" ? brand : brandOptions}
                                    value={{ label: disAddForm.brand, value: disAddForm.brand }}
                                    onChange={(e) => {
                                        fetchSubBrand(e.value);
                                        setDisAddForm({ ...disAddForm, brand: e.value, subbrand: "Please Select Subbrand" });
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
                                    placeholder={"Please Select SubBrand"}
                                    styles={colourStyles}
                                    isClearable={true}
                                    options={subbrand}
                                    value={{ label: disAddForm.subbrand, value: disAddForm.subbrand }}
                                    onChange={(e) => {
                                        setDisAddForm({ ...disAddForm, subbrand: e.value, });
                                    }}

                                />
                            </Grid>
                        </FormControl>
                    </Grid>
                    <Grid item lg={4} md={4} sm={6} xs={12}>
                        <InputLabel htmlFor="component-outlined" >Product Name <b style={{ color: "red", marginLeft: "2px" }}>*</b></InputLabel>
                        <FormControl size="small" fullWidth>
                            <FormControl size="small" fullWidth>
                                <Selects
                                    value={{ label: disAddForm.products, value: disAddForm.products }}
                                    onChange={(e) => {
                                        setDisAddForm({ ...disAddForm, products: e.value });
                                        searchAdd(e._id)
                                    }}
                                    styles={colourStyles}
                                    options={filterData}
                                />
                            </FormControl>

                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container sx={userStyle.gridcontainer}>
                    <Grid>
                        <Button sx={userStyle.buttonadd} onClick={() => { fetchProductbySBrandandSizeandColorandStyle() }}>filter</Button>
                    </Grid>
                </Grid>
            </Box>
            <br />            <Box sx={userStyle.container}>
                <form onSubmit={handleAddSubmit}>
                    <Grid container spacing={3}>
                        {/* Grid one */}
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Discount Id</InputLabel>
                            <FormControl size="small" fullWidth>
                                {discounts && (
                                    discounts.map(
                                        () => {
                                            let strings = setngs ? setngs.discountsku : "DS";
                                            let refNo = discounts[discounts.length - 1].discountid;
                                            let digits = (discounts.length + 1).toString();
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
                                                refNOINC = ("000" + refNOINC).substr(-4);
                                                newval = strings + refNOINC;
                                            } else if (digits.length < 4 && getlastBeforeChar > 0 && getlastThreeChar == 0) {
                                                refNOINC = ("00" + refLstTwo).substr(-4);
                                                newval = strings + refNOINC;
                                            } else if (digits.length < 4 && getlastThreeChar > 0) {
                                                refNOINC = ("0" + refLstThree).substr(-4);
                                                newval = strings + refNOINC;
                                            } else {
                                                refNOINC = (refLstDigit).substr(-4);
                                                newval = strings + refNOINC;
                                            }
                                        }))}
                                <OutlinedInput
                                    id="component-outlined"
                                    value={newval}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Name <b style={{ color: "red", marginLeft: "2px" }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={disAddForm.name}
                                    onChange={(e) => { setDisAddForm({ ...disAddForm, name: e.target.value, discountid: newval }); handleValidationName(e) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Purchase Excluding Tax</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={product.purchaseexcludetax}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Purchase Including Tax</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={product.pruchaseincludetax}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Selling Tax</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={product.sellingexcludetax}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small" >Discount Type <b style={{ color: "red", marginLeft: "2px" }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={disAddForm.discounttype}
                                    onChange={(e) => {
                                        setDisAddForm({ ...disAddForm, discounttype: e.target.value });
                                    }}
                                >
                                    <MenuItem value="None" onClick={(e) => { getDiscount() }}>None</MenuItem>
                                    <MenuItem value="Fixed" onClick={(e) => { getDiscount() }}>Fixed</MenuItem>
                                    <MenuItem value="Amount" onClick={(e) => { getDiscount() }}>Amount</MenuItem>
                                    <MenuItem value="Percentage" onClick={(e) => { getDiscount() }}>Percentage</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Select Discount Price</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Select
                                    id="demo-select-small"
                                    value={disAddForm.selectdiscountprice}
                                    onChange={(e) => {
                                        setDisAddForm({ ...disAddForm, selectdiscountprice: e.target.value });

                                    }}
                                >
                                    <MenuItem value="Purchase Including Tax" onClick={(e) => { getDiscount() }}>Purchase Including Tax</MenuItem>
                                    <MenuItem value="Purchase Excluding Tax" onClick={(e) => { getDiscount() }}>Purchase Excluding Tax</MenuItem>
                                    <MenuItem value="Selling Tax" onClick={(e) => { getDiscount() }}>Selling Tax</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Discount Amount <b style={{ color: "red", marginLeft: "2px" }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={disAddForm.discountamt}
                                    type="number"
                                    onChange={(e) => { setDisAddForm({ ...disAddForm, discountamt: e.target.value }); handleValidationAmount(e) }}
                                />
                            </FormControl>
                        </Grid>
                        {/* Grid four */}
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Discount value</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="number"
                                    value={disAddForm.discountvalue}
                                    onChange={(e) => { setDisAddForm({ ...disAddForm, discountvalue: e.target.value }); }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Start At <b style={{ color: "red", marginLeft: "2px" }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={disAddForm.startsat}
                                    onChange={(e) => { setDisAddForm({ ...disAddForm, startsat: e.target.value }) }}
                                    type="date"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Ends At <b style={{ color: "red", marginLeft: "2px" }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={disAddForm.endsat}
                                    onChange={(e) => { setDisAddForm({ ...disAddForm, endsat: e.target.value }) }}
                                    type="date"
                                />
                            </FormControl>
                        </Grid>
                        <Grid container sx={userStyle.gridcontainer}>
                            <Grid >
                                <Button sx={userStyle.buttoncancel} onClick={handleClear}>CLEAR</Button>
                                <Button sx={userStyle.buttoncancel} onClick={handleBack}>CANCEL</Button>
                                <Button autoFocus sx={userStyle.buttonadd} type="submit" disableRipple>SAVE</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </Box>
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
function Discountcreates() {
    return (

        <>
            <Discountcreate /><br /><br /><br /><br />
            <Footer />
        </>
    );
}

export default Discountcreates;