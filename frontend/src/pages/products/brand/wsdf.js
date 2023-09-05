import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Grid, Typography, FormControl, InputLabel, OutlinedInput, Dialog, DialogContent, DialogActions, } from '@mui/material';
import { userStyle } from '../../PageStyle';
import { FaPlus } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Headtitle from '../../../components/header/Headtitle';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

function Brandeditlist() {

    const [isCategory, setIsCategory] = useState({});
    const [subCategories, setSubCategories] = useState([]);
    const { auth, setngs } = useContext(AuthContext);
    const [subStringVal, setSubStringVal] = useState("");
    const id = useParams().id;

    //popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenc = () => { setIsErrorOpen(true); };
    const handleClosec = () => { setIsErrorOpen(false); };

    // Edit Popup model start
    const [getBrand, setGetBrand] = useState("") // 1
    const [overAllBrand, setOverAllBrand] = useState("")//3
    const [editBrand, setEditBrand] = useState(0)//2

    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => {
        setIsErrorOpenpop(true);
    };
    const handleCloseerrpop = () => {
        setIsErrorOpenpop(false);
    };
    // Edit Popup model end


    // fetch particular id value
    const fetchCategory = async () => {
        try {
            let req = await axios.get(`${SERVICE.BRAND_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setIsCategory(req?.data?.sbrand);
            setSubCategories(req?.data?.sbrand?.subbrands);
            // start
            setGetBrand(req?.data?.sbrand.brandname)
            getEditId(req?.data?.sbrand.brandname);
            // End

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong 1!")
            }
        }
    }

    useEffect(
        () => {
            fetchCategorySubcategory();
        }, [])

    const fetchCategorySubcategory = async () => {
        try {
            let res = await axios.post(SERVICE.ALLSUBBRAND, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)

            });
            let refNo = res?.data?.subbrands[res?.data?.subbrands.length - 1].subbrandcode;
            let codenum = refNo.slice(-4);
            let prefixLength = Number(codenum) + 1;
            let prefixString = String(prefixLength);
            let postfixLength = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ? `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString

            setSubStringVal(postfixLength);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong 2!")
            }
        }
    }

    //sub category add new item
    function addSubcategory() {
        let prefixLength = Number(subStringVal) + 1;
        let prefixString = String(prefixLength);
        let postfixLength = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ? `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString
        setSubStringVal(postfixLength);
        let uniqueId = Math.random().toFixed(5)
        setSubCategories([...subCategories, { subbrandname: "", subbrandcode: postfixLength, _id: uniqueId, newAdded: true, subbrandshotname: "" }]);
    }

    function multiSubCategoriesInputs(referenceId, reference, inputvalue) {
        if (reference == "subCategoryName") {
            let subCategoryNameInput = subCategories.map((value, index) => {
                if (referenceId == value._id) {
                    let codeslicespace = inputvalue.replace(/ /g, '');
                    let numcode = codeslicespace.slice(0, 4);
                    let numsubcode = value.subbrandcode.slice(-4);
                    return { ...value, subbrandname: inputvalue, subbrandshotname: numcode.toUpperCase(), subbrandcode: numcode.toUpperCase() + numsubcode }
                }
                else {
                    return value;
                }
            });
            return setSubCategories(subCategoryNameInput);
        }

        if (reference == "subCategoryShotName") {
            let subCategoryShotNameInput = subCategories.map((value, index) => {
                if (referenceId == index) {
                    let codeslicespace = inputvalue.replace(/ /g, '');
                    let todosubshotname = codeslicespace.slice(0, 4).toUpperCase();

                    return { ...value, subbrandshotname: todosubshotname, }
                }
                else {
                    return value;
                }
            });
            return setSubCategories(subCategoryShotNameInput);
        }

    }

    // sub category delete item of row
    const deleteSubCategory = (referenceId) => {
        let prefixLength = Number(subStringVal) - 1;
        let prefixString = String(prefixLength);
        let rdata = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ? `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString
        setSubStringVal(rdata);
        let deleteIndex;
        let subCategoryData = subCategories.filter((value, index) => {
            if (referenceId != value._id) {
                return value;
            } else {
                if (subCategories[index + 1]) {
                    deleteIndex = index;
                }
            }
            return false;
        });
        let resultData = subCategoryData.map((data, index) => {
            if (index >= deleteIndex) {
                let subcode = data.subbrandcode.slice(-4)
                let codeslicespace = data.subbrandname.replace(/ /g, '');
                let subslice = codeslicespace.slice(0, 4);
                let presubcode = data.subbrandname == "" ? "" : subslice.slice(0, 4).toUpperCase();
                let prefixLength = Number(subcode) - 1;
                let prefixString = String(prefixLength);
                let postfixLength = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ? `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString

                return { ...data, subbrandcode: presubcode + postfixLength }
            } else {
                return data;
            }
        })
        setSubCategories(resultData);
    }


    let backPage = useNavigate();

    //get all values in one row so that spread sub category and brand
    const idRemovedNew = () => {
        const idRemovedSubCategory = subCategories.map((value) => {
            if (value.newAdded) {
                return { subbrandname: value.subbrandname, subbrandcode: value.subbrandcode, subbrandshotname: value.subbrandshotname }
            }
            else {
                return value;
            }
        });

        sendRequest(idRemovedSubCategory);
    }

    // store edited data to particular id update request
    const sendRequest = async (subcategories) => {

        // default value conditin add in sub category
        let addDefaultValueSubCate;
        addDefaultValueSubCate = subcategories.map((value) => {
            let categryname = value.subbrandname.length == 0 ? "Default" : value.subbrandname;
            let subspace = value.subbrandname.replace(/ /g, '');
            let subcatslice = subspace.slice(0, 4).toUpperCase();
            let categryshotname = value.subbrandshotname == "" ? subcatslice : value.subbrandshotname;
            let categrycode = value.subbrandcode.length == 0 ? "DEFA" : value.subbrandcode;

            return { subbrandname: categryname, subbrandshotname: categryshotname, subbrandcode: categrycode }

        })
        let codeslicespace = isCategory.brandname.replace(/ /g, '');
        let resultshotname = codeslicespace.slice(0, 4).toUpperCase();

        try {
            let res = await axios.put(`${SERVICE.BRAND_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                brandname: String(isCategory.brandname),
                brandshortname: String(isCategory.brandshortname == "" ? resultshotname : isCategory.brandshortname),
                brandcode: String(isCategory.brandcode),
                subbrands: addDefaultValueSubCate,

            });
            setIsCategory(res.data);
            await getOverAlldepUpdate()
            toast.success(res.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            backPage("/product/brand/list");
        } catch (err) {
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
            fetchCategory();
        }, []
    )

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isCategory.brandname == "") {
            setShowAlert("Please enter brand name!");
            handleClickOpenc();

        } else if (isCategory.brandcode == "") {
            setShowAlert("Please enter brand code!");
            handleClickOpenc();

        }
        else if (isCategory.brandname != getBrand && editBrand > 0) {
            setShowAlertpop(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {overAllBrand}
                    </p>
                </>
            )
            handleClickOpenerrpop();

        }
        else {
            idRemovedNew();
        }

    }

    // Edit Update Start
    const getEditId = async (value) => {
        try {
            let res = await axios.post(SERVICE.BRAND_EDIT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                brand: String(value),
                businessid: String(setngs.businessid),
            });

            setEditBrand(res.data.count)
            setOverAllBrand(
                `${res.data.groups.length > 0 ? "Groups  " : ""},
      ${res.data.products.length > 0 ? "Products  " : ""} these pages are  linked with Brand. whether you want to change ..? `)

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    const getOverAlldepUpdate = async () => {
        try {
            let res = await axios.post(SERVICE.BRAND_EDIT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                brand: getBrand,
                businessid: String(setngs.businessid),

            });
            editOveAllDepartment(res.data.groups, res.data.products)

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


    const editOveAllDepartment = async (groups, products) => {
        try {

            if (groups.length > 0) {
                let result = groups.map((data, index) => {

                    let request = axios.put(`${SERVICE.GROUP_SINGLE}/${data._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        brandname: String(isCategory.brandname),
                    });

                })

            }
            if (products.length > 0) {
                let result = products.map((data, index) => {
                    let request = axios.put(`${SERVICE.PRODUCT_SINGLE}/${data._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        brand: String(isCategory.brandname),
                        brandshotname: String(isCategory.brandshortname),
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

    // Edit Update End


    const handleShotNameLength = (e) => {
        if (e.length > 4) {
            setShowAlert("Brand Short Name can't more than 4 characters!")
            handleClickOpenc();
            let codeslicespace = e.replace(/ /g, '');
            let num = codeslicespace.slice(0, 4);
            setIsCategory({ ...isCategory, brandshortname: num })
        }
    }

    const handleCheckid = (e) => {
        let codeslicespace = e.replace(/ /g, '');
        let result = codeslicespace.slice(0, 4).toUpperCase();
        let resultcode = isCategory?.brandcode.slice(-4);

        setIsCategory({ ...isCategory, brandname: e, brandshortname: result, brandcode: result + resultcode });

    }

    return (
        <Box>
            <Headtitle title={'Edit Brand'} />
            {/* Form Start */}
            <form onSubmit={handleSubmit}>
                <Typography sx={userStyle.HeaderText}>Edit Brand</Typography>
                <Box sx={userStyle.container}>
                    <Grid container spacing={3} sx={userStyle.textInput}>
                        <Grid item md={12} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined">Brand name <b style={{ color: 'red', }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={isCategory.brandname}
                                    onChange={(e) => { handleCheckid(e.target.value) }}
                                    type="text"
                                    name="brandname"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined">Brand Short Name <b style={{ color: 'red', }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={isCategory.brandshortname}
                                    onChange={(e) => { setIsCategory({ ...isCategory, brandshortname: e.target.value.toUpperCase() }); handleShotNameLength(e.target.value) }}
                                    type="text"
                                    name="brandshortname"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined">Brand Code <b style={{ color: 'red', }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={isCategory.brandcode}
                                />
                            </FormControl>
                        </Grid>
                    </Grid><br />
                    {
                        subCategories.length >= 0 && (
                            <ul type="none" className="todoLlistUl" style={{ paddingLeft: '0px', marginLeft: '0px' }}>
                                {subCategories.map((item, index) => {
                                    return (
                                        <li key={index}>
                                            <br />
                                            <Grid container columnSpacing={1}>
                                                <Grid item sm={12} xs={12} md={3.5} lg={3.5}>
                                                    <InputLabel htmlFor="component-outlined">Sub Brand Name</InputLabel>
                                                    <FormControl size="small" fullWidth>
                                                        <OutlinedInput
                                                            id="component-outlined"
                                                            value={item.subbrandname}
                                                            onChange={(e) => multiSubCategoriesInputs(item._id, "subCategoryName", e.target.value)}
                                                            type="text"
                                                            name="categoryname"
                                                            placeholder="Sub Brand Name"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={12} xs={12} md={3.5} lg={3.5}>
                                                    <InputLabel htmlFor="component-outlined">Sub Brand Short Name</InputLabel>
                                                    <FormControl size="small" fullWidth>
                                                        <OutlinedInput
                                                            id="component-outlined"
                                                            value={item.subbrandshotname}
                                                            onChange={(e) => multiSubCategoriesInputs(index, "subCategoryShotName", e.target.value)}
                                                            type="text"
                                                            name="categoryname"
                                                            placeholder="Sub Brand Short Name"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={12} xs={12} md={3.5} lg={3.5}>
                                                    <InputLabel htmlFor="component-outlined">Sub Brand Code</InputLabel>
                                                    <FormControl size="small" fullWidth>
                                                        <OutlinedInput
                                                            id="component-outlined"
                                                            value={item.subbrandcode}
                                                            name="categoryname"
                                                            placeholder="Sub Brand Code"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={1} xs={1} md={1.5} lg={1.5} sx={{ display: 'flex' }}>
                                                    <Button variant="contained" color="success" type="button" onClick={() => addSubcategory()} sx={userStyle.categoryadd}><FaPlus /></Button>&nbsp;
                                                    <Button variant="contained" color="error" type="button" onClick={(e) => deleteSubCategory(item._id)} sx={userStyle.categoryadd}><AiOutlineClose /></Button>
                                                </Grid>
                                            </Grid>
                                        </li>
                                    )
                                })}
                            </ul>
                        )
                    } <br />
                    <Grid container sx={{ marginTop: '20px', marginBottom: '20px', justifyContent: 'center' }}>
                        <Button sx={userStyle.buttonadd} type="submit" autoFocus>UPDATE</Button>
                        <Link to="/product/brand/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
                    </Grid>
                </Box>
            </form>
            {/* Form End */}
            {/* ALERT DIALOG */}
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
                            handleSubmit();
                            handleCloseerrpop();
                        }}>
                            ok
                        </Button>
                        <Button
                            style={{
                                backgroundColor: '#f4f4f4',
                                color: '#444',
                                boxShadow: 'none',
                                borderRadius: '3px',
                                padding: '7px 13px',
                                border: '1px solid #0000006b',
                                '&:hover': {
                                    '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                                        backgroundColor: '#f4f4f4',
                                    },
                                },
                            }}
                            onClick={handleCloseerrpop}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleClosec}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleClosec}>ok</Button>
                    </DialogActions>
                </Dialog>
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
                            idRemovedNew();
                            handleCloseerrpop();
                        }}>
                            ok
                        </Button>
                        <Button
                            style={{
                                backgroundColor: '#f4f4f4',
                                color: '#444',
                                boxShadow: 'none',
                                borderRadius: '3px',
                                padding: '7px 13px',
                                border: '1px solid #0000006b',
                                '&:hover': {
                                    '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                                        backgroundColor: '#f4f4f4',
                                    },
                                },
                            }}
                            onClick={handleCloseerrpop}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}

const Brandedit = () => {
    return (
        <>
            <Box>
                <Navbar /><br /><br /><br /><br />
                <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                    <Box component="main" className='content'>
                        <Brandeditlist /><br /><br /><br /><br />
                        <Footer />
                    </Box>
                </Box>
            </Box>
        </>
    );
}
export default Brandedit;