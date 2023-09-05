import React, { useState, useEffect, useContext } from 'react';
import { userStyle, colourStyles } from '../../PageStyle';
import { Box, Grid, FormControl, Tooltip, InputLabel, Dialog, DialogContent, DialogActions, OutlinedInput, TextareaAutosize, Typography, TextField, FormGroup, FormControlLabel, Checkbox, Button, IconButton } from '@mui/material';
import { FcInfo } from "react-icons/fc";
import Selects from "react-select";
import Footer from '../../../components/footer/Footer';
import Createunitmod from './Createunitmod';
import Createsizemod from './Createsizemod';
import Createcolormod from './Createcolormod';
import Createcategory from './Createcategory';
import Createbrand from './Createbrand';
import Createrack from './Createrack';
import Createstyle from './Createstyles';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Webcamimage from '../Webcamproduct';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';
import { MultiSelect } from "react-multi-select-component";
import { Style } from '@mui/icons-material';

function Productcreatelist() {

    const { auth, setngs } = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [styles, setStyles] = useState([]);
    const [units, setUnits] = useState([]);
    const [file, setFile] = useState();
    const [busilocations, setBusilocations] = useState([]);
    const [isBusilocations, setIsBusilocations] = useState({});
    const [subcategories, setSubcategories] = useState([]);
    const [fetchsaveunit, setFetchsaveunit] = useState("");
    const [fetchsavesize, setFetchsavesize] = useState("");
    const [fetchsavecolor, setFetchsavecolor] = useState("");
    const [fetchsavecategory, setFetchsavecategory] = useState("");
    const [fetchsavebrand, setFetchsavebrand] = useState("");
    const [fetchsaverack, setFetchsaverack] = useState("");
    const [fetchsavestyle, setFetchsavestyle] = useState("");
    const [isProducts, setIsProducts] = useState([]);
    const [taxrates, setTaxrates] = useState();
    const [hsnGrp, sethsnGrp] = useState([]);
    const [hsnCodes, sethsnCodes] = useState(false);
    const [colors, setColors] = useState([]);
    let newval = setngs ? setngs.skuprefix == undefined ? "SK0001" : setngs.skuprefix + "0001" : "SK0001";
    let scnewval = setngs ? setngs.skuprefix + "0000" : "SK0000";
    let defaultmultiple = setngs?.multivalue;
    const [isColorMulti, setIsColorMulti] = useState([]);
    const [isSizeMulti, setIsSizeMulti] = useState([]);
    const [isRacks, setRacks] = useState([]);
    const [isAllRacks, setAllRacks] = useState([]);
    const [brands, setBrands] = useState([]);
    const [brandsubbrand, setBrandsubbrand] = useState([]);
    const [isFetchbrand, setIsFetchBrand] = useState(false)
    const [checkAllbrands, setCheckAllBrands] = useState([])
    const [cmpProName, setCmpProdName] = useState([])

    // Access
    const { allTaxratesGroup, allLocations, isActiveLocations, isUserRoleAccess } = useContext(UserRoleAccessContext);
    // Text field
    const [product, setProduct] = useState({
        locationplaceholder: isBusilocations ? isBusilocations.name : "",
        productname: "", sku: "", categoryshotname: "", subbrand: "Please Select SubBrand", style: "Please Select Style", subbrandshotname: "",
        subcategryshotname: "", brandshotname: "", hsn: "Please select HSN", hsncode: "", barcodetype: "Please Select Barcode",
        unit: setngs.defaultunit, brand: "Please Select Brand", size: "ALL", currentstock: 0, pruchaseincludetax: 0, sellingexcludetax: 0,
        producttype: setngs?.producttype, applicabletax: setngs?.applicabletax, purchaseexcludetax: 0, sellingpricetax: setngs?.sellingpricetax,
        category: "Please Select Category", reorderlevel: "", subcategory: "Please Select Subcategory",
        businesslocation: "", managestock: true, minquantity: setngs?.minquantity, maxquantity: setngs?.maxquantity, rack: "Please Select Rack",
        productdescription: "", productimage: "", color: "ALL",
    });
    let subrackarray = [];

    //webcam
    const [isWebcamOpen, setIsWebcamOpen] = useState(false);
    const [getImg, setGetImg] = useState(null)
    const [isWebcamCapture, setIsWebcamCapture] = useState(false)

    // ****** Multi Select ****** //
    const [multiSize, setMultiSize] = useState([]);
    const [multiColor, setMultiColor] = useState([]);
    const [sizeName, setSizeName] = useState(["ALL"]);
    const [colorName, setColorName] = useState(["ALL"]);

    //settings size multi select
    const [isMultiSize, setIsMultiSize] = useState([]);
    const [isMultiColor, setIsMultiColor] = useState([])

    //popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState("");
    const handleClickOpenalert = () => { setIsErrorOpen(true); };
    const handleClosealert = () => { setIsErrorOpen(false); };

    useEffect(
        () => {
            fetchProductsName();
            fetchLocation();
        }, []
    )

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

    useEffect(
        () => {
            getColorSizeMulti();
        }, [setngs]
    )
    useEffect(() => {
        taxrateRequest();
        fetchRates();
        fetchProducts();
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

    //size multi onchange
    const handleChangesizemulti = (e) => {
        setSizeName(Array.isArray(e) ? e.map((x) => x.value) : []);
        setMultiSize(e)
    }

    const checkBoxMultiSize = (sizeName, _isSizeMulti) => {
        return sizeName.length
            ? sizeName.map(({ label }) => label).join(", ")
            : "Please select Size";
    };

    //color multi onchange
    const handleChangecolormulti = (e) => {
        setColorName(Array.isArray(e) ? e.map((x) => x.value) : []);
        setMultiColor(e)
    };

    const checkBoxMultiColor = (colorName, _isColorMulti) => {
        return colorName.length
            ? colorName.map(({ label }) => label).join(", ")
            : "Please select Color";
    };
    //selling price tax 
    const selltaxtype = [
        { value: "None", label: "None" },
        { value: "Exclusive", label: "Exclusive" },
        { value: "Inclusive", label: "Inclusive" }
        ,
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

    // locations
    const fetchLocation = async () => {

        try {


            let selectlocation = allLocations.filter((data, index) => {
                return data.locationid == setngs.businesslocation
            })
            setIsBusilocations(selectlocation[0]);
            setProduct({ ...product, locationplaceholder: selectlocation[0]?.name, minquantity: setngs?.minquantity, maxquantity: setngs?.maxquantity });
            setBusilocations(isActiveLocations.map((d) => (
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

    const fetchRacks = async () => {
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
                return data.businesslocation == setngs?.businesslocation
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
            const rackall = [...subrackarray.map((d) => (
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
        const rackall = [...subrackarray.map((d) => (
            {
                ...d,
                label: d.subrackcode,
                value: d.subrackcode
            }
        ))];
        setRacks(rackall);
    }

    isProducts?.map(
        () => {
            let strings = setngs ? setngs.skuprefix : "SK";
            let refNo = isProducts[isProducts.length - 1].sku;
            let digits = (isProducts.length + 1).toString();
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
        });

    const resetImage = () => {
        setProduct({ ...product, productimage: "" });
        setGetImg("");
        setFile("");
    }

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
            const colorallmulti = [...res?.data?.colors.map((d) => (
                {
                    ...d,
                    label: d.colorname,
                    value: d.colorname
                }
            ))];
            setIsColorMulti(colorallmulti)
            setColors(colorall);

            return colorall;
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

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


    // Brand
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

    // Size
    const fetchSize = async () => {

        try {
            let res = await axios.post(SERVICE.SIZE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            const sizeall = [{ label: 'ALL', value: 'ALL' }, ...res?.data?.sizes.map((d) => (
                {
                    ...d,
                    label: d.sizename,
                    value: d.sizename
                }
            ))];
            const sizeallmulti = [...res?.data?.sizes.map((d) => (
                {
                    ...d,
                    label: d.sizename,
                    value: d.sizename
                }
            ))];

            setIsSizeMulti(sizeallmulti);
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


                const subbrandall = [{ label: 'ALL', value: 'ALL' }, ...result[0]?.subbrands.map((d) => (
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


    // Taxrates
    const fetchRates = async () => {
        try {

            setTaxrates(
                allTaxratesGroup?.map((d) => ({
                    ...d,
                    label: d.taxname + '@' + d.taxrate,
                    value: d.taxname + '@' + d.taxrate,
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

    // Get Datas
    const taxrateRequest = async () => {
        try {
            let response = await axios.post(SERVICE.TAXRATEHSN, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            sethsnGrp(
                response?.data?.taxrateshsn.map((d) => ({
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

    const fetchProducts = async () => {
        try {
            let res = await axios.post(SERVICE.PRODUCT_LASTINDEXID, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            })

            setIsProducts(res?.data?.products);
            return res?.data?.products;

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    const fetchProductsName = async () => {
        try {
            let res = await axios.post(SERVICE.PRODUCT_NAME, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            })
            setCmpProdName(res?.data?.products)

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    const webcamOpen = () => {
        setIsWebcamOpen(true);
    };
    const webcamClose = () => {
        setIsWebcamOpen(false);
    };

    const webcamDataStore = () => {
        setIsWebcamCapture(true)
        //popup close
        webcamClose();
    }

    //add webcamera popup
    const showWebcam = () => {
        webcamOpen();
    }

    const getColorSizeMulti = () => {
        if (defaultmultiple == "None") {
            setIsMultiSize(false)
            setIsMultiColor(false)
        } else if (defaultmultiple == "Size") {
            setIsMultiSize(true)
            setIsMultiColor(false)
        } else if (defaultmultiple == "Color") {
            setIsMultiSize(false)
            setIsMultiColor(true)
        }
    }

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

    const backLPage = useNavigate();
    let capture = isWebcamCapture == true ? getImg : product.productimage;

    const sizeMulti = async () => {
        let personLength = sizeName.length;
        let products = await fetchProducts();
        let sku = products.length != 0 ? products[products.length - 1].sku : scnewval;

        let strings = setngs ? setngs.skuprefix : "SK";
        let prefixLength = strings.length
        let skuId = sku.slice(prefixLength, sku.length)


        for (let i = 0; i < personLength;) {
            let incrementId = String(Number(skuId) + i + 1)
            let incrementedSku;
            if (incrementId.length == 1) {
                incrementedSku = `${strings}${skuId.slice(0, skuId.length >= 1 ? skuId.length - 1 : 0)}${incrementId}`
            } else if (incrementId.length == 2) {
                incrementedSku = `${strings}${skuId.slice(0, skuId.length >= 2 ? skuId.length - 2 : 0)}${incrementId}`
            } else if (incrementId.length == 3) {
                incrementedSku = `${strings}${skuId.slice(0, skuId.length >= 3 ? skuId.length - 3 : 0)}${incrementId}`
            } else {
                incrementedSku = `${strings}${incrementId}`
            }
            await sendSizeRequest(sizeName[i], incrementedSku)
            i++;
        }
        backLPage('/product/product/list');
    }

    const colorMulti = async () => {
        let personLength = colorName.length;
        let products = await fetchProducts();
        let sku = products.length != 0 ? products[products.length - 1].sku : scnewval;
        let strings = setngs ? setngs.skuprefix : "SK";
        let prefixLength = strings.length
        let skuId = sku.slice(prefixLength, sku.length)
        for (let i = 0; i < personLength;) {

            const isNameMatch = cmpProName?.some(item => item?.toLowerCase() === (product.category + '_' + product.subcategory + '_' + product.brand + '_' + product.subbrand + '_' + product.style + '_' + product.size + '_' + colorName[i])?.toLowerCase());
            if (isNameMatch) {
                setShowAlert(
                    <>
                    <p style={{fontSize:'12px'}}>{product.category + '_' + product.subcategory + '_' + product.brand + '_' + product.subbrand + '_' + product.style + '_' + product.size + '_' + colorName[i]+ ' Already Exist!'}</p>
                    </>
                );
                handleClickOpenalert();
                let incrementedSku;
            }else{
                let incrementId = String(Number(skuId) + i + 1)
                let incrementedSku;
                if (incrementId.length == 1) {
                    incrementedSku = `${strings}${skuId.slice(0, skuId.length >= 1 ? skuId.length - 1 : 0)}${incrementId}`
                } else if (incrementId.length == 2) {
                    incrementedSku = `${strings}${skuId.slice(0, skuId.length >= 2 ? skuId.length - 2 : 0)}${incrementId}`
                } else if (incrementId.length == 3) {
                    incrementedSku = `${strings}${skuId.slice(0, skuId.length >= 3 ? skuId.length - 3 : 0)}${incrementId}`
                } else {
                    incrementedSku = `${strings}${incrementId}`
                }
                await sendColorRequest(colorName[i], incrementedSku);
                await fetchProductsName();
            }
            i++;
        }

        backLPage('/product/product/list');
    }

    const sendSizeRequest = async (sizename, newval) => {

        try {
            let PRODUCT_REQ = await axios.post(SERVICE.PRODUCT_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                productname: String(product.category + '_' + product.subcategory + '_' + product.brand + '_' + product.subbrand + '_' + product.style + '_' + sizename + '_' + product.color),
                sku: String(newval),
                barcodetype: String(product.barcodetype),
                unit: String(product.unit == "Please Select Unit" ? "ALL" : product.unit),
                size: String(sizename == "Please Select Size" ? "ALL" : sizename),
                businesslocation: String(product.businesslocation),
                category: String(product.category == "Please Select Category" ? "ALL" : product.category),
                subcategory: String(product.subcategory == "Please Select Subcategory" ? "ALL" : product.subcategory),
                brand: String(product.brand == "Please Select Brand" ? "ALL" : product.brand),
                subbrand: String(product.subbrand == "Please Select SubBrand" ? "ALL" : product.subbrand),
                categoryshotname: String(product.categoryshotname == undefined ? "" : product.categoryshotname),
                subcategryshotname: String(product.subcategryshotname == undefined ? "" : product.subcategryshotname),
                brandshotname: String(product.brandshotname == undefined ? "" : product.brandshotname),
                subbrandshotname: String(product.subbrandshotname == undefined ? "" : product.subbrandshotname),
                managestock: Boolean(product.managestock),
                hsnenable: Boolean(hsnCodes),
                minquantity: Number(product.managestock ? product.minquantity : 0),
                maxquantity: Number(product.managestock ? product.maxquantity : 0),
                productdescription: String(product.productdescription),
                rack: String(product.rack == undefined || product.rack == "Please Select Rack" ? "ALL" : product.rack),
                productimage: String(capture),
                color: String(product.color == "Please Select Color" ? "ALL" : product.color),
                style: String(product.style == "Please Select Style" ? "ALL" : product.style),
                hsn: String(hsnCodes == true ? product.hsn : ""),
                hsncode: String(hsnCodes == true ? product.hsncode : ""),
                applicabletax: String(hsnCodes == false ? product.applicabletax : "None"),
                sellingpricetax: String(product.sellingpricetax),
                producttype: String(product.producttype),
                currentstock: Number(0),
                pruchaseincludetax: Number(0),
                purchaseexcludetax: Number(0),
                sellingexcludetax: Number(0),
                sellunitcostwithouttax: Number(0),
                reorderlevel: Number(product.reorderlevel),
                assignbusinessid: String(setngs.businessid),
            });
            setProduct(PRODUCT_REQ.data);
            toast.success(PRODUCT_REQ.data.message);
            // backLPage('/product/product/list');
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
    }

    const sendColorRequest = async (colorname, newval) => {

        try {
            let PRODUCT_REQ = await axios.post(SERVICE.PRODUCT_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                productname: String(product.category + '_' + product.subcategory + '_' + product.brand + '_' + product.subbrand + '_' + product.style + '_' + product.size + '_' + colorname),
                sku: String(newval),
                barcodetype: String(product.barcodetype),
                unit: String(product.unit == "Please Select Unit" ? "ALL" : product.unit),
                size: String(product.size == "Please Select Size" ? "ALL" : product.size),
                businesslocation: String(product.businesslocation),
                category: String(product.category == "Please Select Category" ? "ALL" : product.category),
                subcategory: String(product.subcategory == "Please Select Subcategory" ? "ALL" : product.subcategory),
                brand: String(product.brand == "Please Select Brand" ? "ALL" : product.brand),
                subbrand: String(product.subbrand == "Please Select SubBrand" ? "ALL" : product.subbrand),
                categoryshotname: String(product.categoryshotname == undefined ? "" : product.categoryshotname),
                subcategryshotname: String(product.subcategryshotname == undefined ? "" : product.subcategryshotname),
                brandshotname: String(product.brandshotname == undefined ? "" : product.brandshotname),
                subbrandshotname: String(product.subbrandshotname == undefined ? "" : product.subbrandshotname),
                managestock: Boolean(product.managestock),
                minquantity: Number(product.managestock ? product.minquantity : 0),
                maxquantity: Number(product.managestock ? product.maxquantity : 0),
                productdescription: String(product.productdescription),
                rack: String(product.rack == undefined || product.rack == "Please Select Rack" ? "ALL" : product.rack),
                productimage: String(capture),
                color: String(colorname == "Please Select Color" ? "ALL" : colorname),
                style: String(product.style == "Please Select Style" ? "ALL" : product.style),
                hsnenable: Boolean(hsnCodes),
                hsn: String(hsnCodes == true ? product.hsn : ""),
                hsncode: String(hsnCodes == true ? product.hsncode : ""),
                applicabletax: String(hsnCodes == false ? product.applicabletax : "None"),
                sellingpricetax: String(product.sellingpricetax),
                producttype: String(product.producttype),
                currentstock: Number(0),
                pruchaseincludetax: Number(0),
                purchaseexcludetax: Number(0),
                sellingexcludetax: Number(0),
                sellunitcostwithouttax: Number(0),
                reorderlevel: Number(product.reorderlevel),
                assignbusinessid: String(setngs.businessid),

            });
            setProduct(PRODUCT_REQ.data);
            toast.success(PRODUCT_REQ.data.message);
            // backLPage('/product/product/list');
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
    }

    // store product data
    const sendRequest = async () => {

        try {
            let PRODUCT_REQ = await axios.post(SERVICE.PRODUCT_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                productname: String(product.productname),
                sku: String(product.sku),
                barcodetype: String(product.barcodetype),
                unit: String(product.unit == "Please Select Unit" ? "ALL" : product.unit),
                size: String(product.size == "Please Select Size" ? "ALL" : product.size),
                businesslocation: String(product.businesslocation),
                category: String(product.category == "Please Select Category" ? "ALL" : product.category),
                subcategory: String(product.subcategory == "Please Select Subcategory" ? "ALL" : product.subcategory),
                brand: String(product.brand == "Please Select Brand" ? "ALL" : product.brand),
                subbrand: String(product.subbrand == "Please Select SubBrand" ? "ALL" : product.subbrand),
                categoryshotname: String(product.categoryshotname == undefined ? "" : product.categoryshotname),
                subcategryshotname: String(product.subcategryshotname == undefined ? "" : product.subcategryshotname),
                brandshotname: String(product.brandshotname == undefined ? "" : product.brandshotname),
                subbrandshotname: String(product.subbrandshotname == undefined ? "" : product.subbrandshotname),
                managestock: Boolean(product.managestock),
                minquantity: Number(product.managestock ? product.minquantity : 0),
                maxquantity: Number(product.managestock ? product.maxquantity : 0),
                productdescription: String(product.productdescription),
                rack: String(product.rack == undefined || product.rack == "Please Select Rack" ? "ALL" : product.rack),
                productimage: String(capture),
                color: String(product.color == "Please Select Color" ? "ALL" : product.color),
                style: String(product.style == "Please Select Style" ? "ALL" : product.style),
                hsnenable: Boolean(hsnCodes),
                hsn: String(hsnCodes == true ? product.hsn : ""),
                hsncode: String(hsnCodes == true ? product.hsncode : ""),
                applicabletax: String(hsnCodes == false ? product.applicabletax : "None"),
                sellingpricetax: String(product.sellingpricetax),
                producttype: String(product.producttype),
                currentstock: Number(0),
                pruchaseincludetax: Number(0),
                purchaseexcludetax: Number(0),
                sellingexcludetax: Number(0),
                sellunitcostwithouttax: Number(0),
                reorderlevel: Number(product.reorderlevel),
                assignbusinessid: String(setngs.businessid),
            });
            setProduct(PRODUCT_REQ.data);
            toast.success(PRODUCT_REQ.data.message);
            if (colorMulti || sizeMulti) {
                backLPage('/product/product/list');
            } else {

            }
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

    // store product data for next page
    const sendOtherRequest = async () => {

        try {
            let PRODUCT_REQ = await axios.post(SERVICE.PRODUCT_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                productname: String(product.productname),
                sku: String(newval),
                barcodetype: String(product.barcodetype),
                unit: String(product.unit == "Please Select Unit" ? "ALL" : product.unit),
                size: String(product.size == "Please Select Size" ? "ALL" : product.size),
                businesslocation: String(product.businesslocation),
                category: String(product.category == "Please Select Category" ? "ALL" : product.category),
                subcategory: String(product.subcategory == "Please Select Subcategory" ? "ALL" : product.subcategory),
                brand: String(product.brand == "Please Select Brand" ? "ALL" : product.brand),
                subbrand: String(product.subbrand == "Please Select SubBrand" ? "ALL" : product.subbrand),
                categoryshotname: String(product.categoryshotname == undefined ? "" : product.categoryshotname),
                subcategryshotname: String(product.subcategryshotname == undefined ? "" : product.subcategryshotname),
                brandshotname: String(product.brandshotname == undefined ? "" : product.brandshotname),
                subbrandshotname: String(product.subbrandshotname == undefined ? "" : product.subbrandshotname),
                managestock: Boolean(product.managestock),
                minquantity: Number(product.managestock ? product.minquantity : 0),
                maxquantity: Number(product.managestock ? product.maxquantity : 0),
                productdescription: String(product.productdescription),
                hsnenable: Boolean(hsnCodes),
                rack: String(product.rack == undefined || product.rack == "Please Select Rack" ? "ALL" : product.rack),
                productimage: String(capture),
                color: String(product.color == "Please Select Color" ? "ALL" : product.color),
                style: String(product.style == "Please Select Style" ? "ALL" : product.style),
                hsn: String(hsnCodes == true ? product.hsn : ""),
                hsncode: String(hsnCodes == true ? product.hsncode : ""),
                applicabletax: String(hsnCodes == false ? product.applicabletax : "None"),
                sellingpricetax: String(product.sellingpricetax),
                producttype: String(product.producttype),
                currentstock: Number(0),
                pruchaseincludetax: Number(0),
                purchaseexcludetax: Number(0),
                sellingexcludetax: Number(0),
                sellunitcostwithouttax: Number(0),
                reorderlevel: Number(product.reorderlevel),
                assignbusinessid: String(setngs.businessid),
            });
            await fetchProducts(); fetchProductsName();
            toast.success(PRODUCT_REQ.data.message);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = cmpProName?.some(item => item?.toLowerCase() === (product?.productname)?.toLowerCase());

        if (isNameMatch) {
            setShowAlert("Product Name Already Exists");
            handleClickOpenalert();
        }
        else if (product.category == "Please Select Category" || product.category == "") {
            setShowAlert("Please select category!");
            handleClickOpenalert()
        } else {
            if (isMultiColor === false && isMultiSize === false) {
                sendRequest();
            } else if (isMultiColor === true && isMultiSize === false) {
                if (colorName.length == 0 || colorName.length == "") {
                    setShowAlert("Please select any one of color!");
                    handleClickOpenalert()
                } else {
                    colorMulti();
                }

            } else if (isMultiColor === false && isMultiSize === true) {
                if (sizeName.length == 0 || sizeName.length == "") {
                    setShowAlert("Please select any one of size!");
                    handleClickOpenalert()
                } else {
                    sizeMulti();
                }

            }
        }
    };

    const handleotherSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = cmpProName?.some(item => item?.toLowerCase() === (product?.productname)?.toLowerCase());

        if (isNameMatch) {
            setShowAlert("Product Name Already Exists");
            handleClickOpenalert();
        }
        else if (cmpProName.includes(product.productname)) {
            setShowAlert("Product Name Already Exists");
            handleClickOpenalert();
        }
        else if (product.category == "Please Select Category" || product.category == "") {
            setShowAlert("Please select category!");
            handleClickOpenalert()
        } else {
            sendOtherRequest();
        }
    };

    const handleClear = () => {
        setProduct({
            locationplaceholder: isBusilocations ? isBusilocations.name : "", businesslocation: isBusilocations ? isBusilocations.name : "",
            productname: "", sku: "", categoryshotname: "", subbrand: "Please Select SubBrand", style: "Please Select Style", subbrandshotname: "", subcategryshotname: "", brandshotname: "", hsn: "Please select HSN", hsncode: "", barcodetype: "Please Select Barcode",
            applicabletax: setngs?.applicabletax, unit: setngs?.defaultunit, minquantity: setngs?.minquantity,
            maxquantity: setngs?.maxquantity, sellingpricetax: setngs?.sellingpricetax, barcodetype: setngs?.barcodetype, producttype: setngs?.producttype,
            brand: "Please Select Brand", size: "ALL", currentstock: 0, pruchaseincludetax: 0, sellingexcludetax: 0,
            purchaseexcludetax: 0, category: "Please Select Category", reorderlevel: "", subcategory: "Please Select Subcategory", managestock: true, minquantity: "", maxquantity: "", rack: "Please Select Rack", productdescription: "", productimage: "", color: "ALL", rack: "Please Select Rack",
        })
        setGetImg("");
        setFile("");
        setColorName([]);
        setMultiSize([]);
        setMultiColor([]);
        setSubcategories([]);
        setBrandsubbrand([]);
        setBrands([]);
        setIsFetchBrand(false);
    }

    return (
        <Box>
            <Headtitle title={'Product Add'} />
            <form>
                {/* header text */}
                <Typography sx={userStyle.HeaderText}>Add new product</Typography>
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
                                        onChange={(e) => {
                                            fetchBrandName(e?.value);
                                            fetchSubcategories(e);
                                            setProduct({
                                                ...product,
                                                category: e.value,
                                                categoryshotname: e.categoryshotname == undefined ? "" : e.categoryshotname,
                                                productname: e.value + '_' + ("ALL") + '_' + ("ALL") + '_' + ("ALL") + '_' + (product.style == "" || product.style == undefined || product.style == "Please Select Style" ? "ALL" : product.style) + '_' + (product.size == "" || product.size == undefined || product.size == "Please Select Size" ? "ALL" : product.size) + '_' + (product.color == "" || product.color == undefined || product.color == "Please Select Color" ? "ALL" : product.color),
                                                sku: newval,
                                                rack: product.rack,
                                                size: product.size == "Please Select Size" ? "ALL" : product.size,
                                                style: product.style == "Please Select Style" ? "ALL" : product.style,
                                                color: product.color == "Please Select Color" ? "ALL" : product.color,
                                                subcategory: "ALL",
                                                brand: "ALL",
                                                subbrand: "ALL",
                                                businesslocation: setngs?.businesslocation,
                                                applicabletax: setngs?.applicabletax,
                                                unit: setngs?.defaultunit,
                                                minquantity: setngs?.minquantity,
                                                maxquantity: setngs?.maxquantity,
                                                sellingpricetax: setngs?.sellingpricetax,
                                                barcodetype: setngs?.barcodetype,
                                                producttype: setngs?.producttype
                                            });
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
                                    placeholder='ALL'
                                    onChange={(e) => {
                                        setProduct({
                                            ...product,
                                            subcategory: e.value,
                                            subcategryshotname: e.subcategryshotname,
                                            productname: product.category + '_' + e.value + '_' + (product.brand == "Please Select Brand" || product.brand == undefined ? "ALL" : product.brand) + '_' + (product.subbrand == "Please Select SubBrand" || product.subbrand == undefined ? "ALL" : product.subbrand) + '_' + (product.style == "" || product.style == undefined || product.style == "Please Select Style" ? "ALL" : product.style) + '_' + (product.size == "" || product.size == undefined || product.size == "Please Select Size" ? "ALL" : product.size) + '_' + (product.color == "" || product.color == undefined || product.color == "Please Select Color" ? "ALL" : product.color),
                                        });
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
                                    setIsFetchBrand(s => !s); setProduct({
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
                                    options={brandsubbrand}
                                    styles={colourStyles}
                                    value={{ label: product.subbrand, value: product.subbrand }}
                                    placeholder="ALL"
                                    onChange={(e) => {
                                        setProduct({
                                            ...product,
                                            subbrand: e.value,
                                            subbrandshotname: e.subbrandshotname,
                                            productname: product.category + '_' + product.subcategory + '_' + product.brand + '_' + (e.value == undefined ? "ALL" : e.value) + '_' + (product.style == "" || product.style == undefined || product.style == "Please Select Style" ? "ALL" : product.style) + '_' + (product.size == "" || product.size == undefined || product.size == "Please Select Size" ? "ALL" : product.size) + '_' + (product.color == "" || product.color == undefined || product.color == "Please Select Color" ? "ALL" : product.color),

                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Product Name <b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={product.productname}

                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={2} md={2} sm={6} xs={12}>
                            <Grid sx={{ display: "flex" }}>
                                <InputLabel htmlFor="component-outlined">SKU <b style={{ color: 'red' }}>*</b></InputLabel>
                                <Grid style={userStyle.spanIcon}>
                                    <Tooltip title='"Unique product id it blank to automatically generate sku.You can modify sku prefix in Business settings.' placement="top" arrow>
                                        <IconButton edge="end" size="small">
                                            <FcInfo />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={newval}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={2} md={2} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">HSN</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Selects
                                    options={hsnGrp}
                                    styles={colourStyles}
                                    onChange={(e) => { setProduct({ ...product, hsn: e.value, hsncode: e.value }); }}
                                />
                            </FormControl>
                            <FormControlLabel control={<Checkbox checked={hsnCodes} onClick={(e) => { sethsnCodes(s => !s); }} />} label="Enable tax with HSN code" sx={{ fontSize: '10px' }} />
                        </Grid>
                        <Grid item lg={2} md={2} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Barcode type</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Selects
                                    options={barcodetypes}
                                    styles={colourStyles}
                                    placeholder={setngs?.barcodetype}
                                    onChange={(e) => { setProduct({ ...product, barcodetype: e.value }); }}
                                />
                            </FormControl>
                        </Grid>
                        {/* size multi select start */}
                        {isMultiSize ?
                            (
                                <>
                                    <Grid item lg={3} md={3} sm={6} xs={12}>
                                        <InputLabel id="demo-select-small">Size</InputLabel>
                                        <Grid sx={{ display: 'flex' }}>
                                            <FormControl size="small" fullWidth>
                                                <MultiSelect
                                                    isMulti
                                                    name="businesslocation"
                                                    styles={colourStyles}
                                                    options={isSizeMulti}
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    value={multiSize}
                                                    onChange={handleChangesizemulti}
                                                    valueRenderer={checkBoxMultiSize}
                                                />
                                            </FormControl>
                                            <Grid sx={userStyle.spanIcons}>
                                                <Createsizemod setFetchsavesize={setFetchsavesize} />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </>
                            ) :
                            (
                                <>
                                    <Grid item lg={3} md={3} sm={6} xs={12}>
                                        <InputLabel id="demo-select-small">Size</InputLabel>
                                        <Grid sx={{ display: 'flex' }}>
                                            <FormControl size="small" fullWidth>
                                                <Selects
                                                    options={sizes}
                                                    styles={colourStyles}
                                                    placeholder='ALL'
                                                    value={{ label: product.size, value: product.size }}
                                                    onChange={(e) => { setProduct({ ...product, size: e.value, sku: newval, productname: product.category + '_' + product.subcategory + '_' + product.brand + '_' + product.subbrand + '_' + product.style + '_' + e.value + '_' + product.color }); }}
                                                />
                                            </FormControl>
                                            <Grid sx={userStyle.spanIcons}>
                                                <Createsizemod setFetchsavesize={setFetchsavesize} />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </>
                            )
                        }
                        {/* size multi select end */}
                        {/* color multi select start */}
                        {isMultiColor ?
                            (
                                <>
                                    <Grid item lg={3} md={3} sm={6} xs={12}>
                                        <InputLabel id="demo-select-small">Color</InputLabel>
                                        <Grid sx={{ display: 'flex' }}>
                                            <FormControl size="small" fullWidth>
                                                {/* <Selects
                                                    isMulti
                                                    styles={colourStyles}
                                                    options={isColorMulti}
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    placeholder='Please Select Color'
                                                    onChange={handleChangecolormulti}
                                                /> */}

                                                <MultiSelect
                                                    isMulti
                                                    name="businesslocation"
                                                    styles={colourStyles}
                                                    options={isColorMulti}
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    value={multiColor}
                                                    onChange={handleChangecolormulti}
                                                    valueRenderer={checkBoxMultiColor}
                                                />
                                            </FormControl>
                                            <Grid sx={userStyle.spanIcons}>
                                                <Createcolormod setFetchsavecolor={setFetchsavecolor} />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </>
                            ) :
                            (
                                <>
                                    <Grid item lg={3} md={3} sm={6} xs={12}>
                                        <InputLabel id="demo-select-small">Color </InputLabel>
                                        <Grid sx={{ display: 'flex' }}>
                                            <FormControl size="small" fullWidth >
                                                <Selects
                                                    options={colors}
                                                    placeholder='ALL'
                                                    styles={colourStyles}
                                                    value={{ label: product.color, value: product.color }}
                                                    onChange={(e) => { setProduct({ ...product, color: e.value, productname: product.category + '_' + product.subcategory + '_' + product.brand + '_' + product.subbrand + '_' + product.style + '_' + product.size + '_' + e.value }); }}
                                                />
                                            </FormControl>
                                            <Grid sx={userStyle.spanIcons}>
                                                <Createcolormod setFetchsavecolor={setFetchsavecolor} />
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                </>
                            )
                        }
                        {/* color multi select end */}
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Unit </InputLabel>
                            <Grid sx={{ display: 'flex' }}  >
                                <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                    <Selects
                                        options={units}
                                        styles={colourStyles}
                                        placeholder={setngs?.defaultunit}
                                        value={{ label: product.unit, value: product.unit }}
                                        onChange={(e) => { setProduct({ ...product, unit: e.value, }); }}
                                    />
                                </FormControl>
                                <Grid sx={userStyle.spanIcons}>
                                    <Createunitmod setFetchsaveunit={setFetchsaveunit} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Style </InputLabel>
                            <Grid sx={{ display: 'flex' }}  >
                                <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                    <Selects
                                        options={styles}
                                        styles={colourStyles}
                                        placeholder='ALL'
                                        value={{ label: product.style, value: product.style }}
                                        onChange={(e) => { setProduct({ ...product, style: e.value, productname: product.category + '_' + product.subcategory + '_' + product.brand + '_' + product.subbrand + '_' + e.value + '_' + product.size + '_' + product.color }); }}
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
                                    value={{ value: product.locationplaceholder, label: product.locationplaceholder }}
                                    onChange={(e) => { setProduct({ ...product, businesslocation: e.value, locationplaceholder: e.label }); handleRackchange(e.value) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={2} md={2} sm={6} xs={12}>
                            <FormGroup>
                                <span><FormControlLabel control={<Checkbox checked={product.managestock}
                                    onClick={(e) => { setProduct({ ...product, managestock: !product.managestock }) }} />} label="Manage Stock" />
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
                                            value={product.minquantity}
                                            // placeholder={setngs?.minquantity}
                                            onChange={(e) => { setProduct({ ...product, minquantity: e.target.value }) }}
                                            type="number"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={2} md={2} sm={6} xs={12}>
                                    <InputLabel htmlFor="outlined-adornment-password">Maximum Quantity</InputLabel>
                                    <FormControl variant="outlined" size="small" fullWidth>
                                        <OutlinedInput
                                            sx={userStyle.input}
                                            id="outlined-adornment-password"
                                            // placeholder={setngs?.maxquantity}
                                            value={product.maxquantity}
                                            onChange={(e) => { setProduct({ ...product, maxquantity: e.target.value }) }}
                                            type="number"
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
                                        value={{ label: product.rack, value: product.rack }}
                                        onChange={(e) => { setProduct({ ...product, rack: e.value }); }}
                                    />
                                </FormControl>
                                <Grid sx={userStyle.spanIcons}>
                                    <Createrack setFetchsaverack={setFetchsaverack} />
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* <Grid item lg={2} md={2} sm={6} xs={12}>
                                    <InputLabel htmlFor="outlined-adornment-password">Re-order level</InputLabel>
                                    <FormControl variant="outlined" size="small" fullWidth>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            value={product.reorderlevel}
                                            onChange={(e) => { setProduct({ ...product, reorderlevel: e.target.value }) }}
                                            type="number"
                                        />
                                    </FormControl>
                                </Grid> */}
                        <Grid item lg={9} md={9} sm={8} xs={12}>
                            <InputLabel id="demo-select-small" sx={{ m: 1 }}>Product Description</InputLabel>
                            <FormControl size="small" fullWidth >
                                <TextareaAutosize aria-label="minimum height" minRows={3} style={{ border: '1px solid #4a7bf7' }}
                                    value={product.productdescription}
                                    onChange={(e) => { setProduct({ ...product, productdescription: e.target.value, }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={4} xs={12}>
                            <InputLabel sx={{ m: 1 }}>Product Image</InputLabel>
                            {file || capture ? (
                                <>
                                    <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <img src={file || capture} style={{ width: '50%' }} height="80px" />
                                    </Grid>
                                </>
                            ) : (
                                <></>
                            )}
                            <Grid sx={{ display: 'flex' }}>
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
                    </Grid>
                    <br />
                    <Grid container spacing={2}>
                        {hsnCodes ?
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
                                        placeholder={setngs?.applicabletax}
                                        value={{ label: product.applicabletax, value: product.applicabletax }}
                                        onChange={(e) => { setProduct({ ...product, applicabletax: e.value, }); }}
                                    >
                                    </Selects>
                                </FormControl>
                            </Grid>
                        }
                        <Grid item md={4} sm={4} xs={12}>
                            <InputLabel id="demo-select-small">Selling Price Tax Type </InputLabel>
                            <FormControl size="small" fullWidth>
                                <Selects
                                    options={selltaxtype}
                                    styles={colourStyles}
                                    placeholder={setngs?.sellingpricetax}
                                    value={{ label: product.sellingpricetax, value: product.sellingpricetax }}
                                    onChange={(e) => { setProduct({ ...product, sellingpricetax: e.value }); }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={4} xs={12}>
                            <InputLabel >Product Type</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Selects
                                    options={producttypes}
                                    styles={colourStyles}
                                    placeholder={setngs?.producttype}
                                    value={{ label: product.producttype, value: product.producttype }}
                                    onChange={(e) => { setProduct({ ...product, producttype: e.value }); }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid>
                            <Button sx={userStyle.buttoncancel} onClick={handleClear}>CLEAR</Button>
                            <Link to="/product/product/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
                            {isMultiColor === true || isMultiSize === true ? null :
                                <>
                                    <Button sx={userStyle.buttonadd} type="submit" onClick={handleotherSubmit}>Save And Add Another</Button>
                                </>

                            }
                            <Button sx={userStyle.buttonadd} type="submit" onClick={handleSubmit}>Save</Button>
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
            </Box>
        </Box >
    );
}


function Productcreate() {
    return (
        <>
            <Productcreatelist /><br /><br /><br /><br />
            <Footer />
        </>
    );
}

export default Productcreate;