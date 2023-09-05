import React, { useState, useContext, useEffect } from 'react';
import { Box, Button, Grid, FormControl, InputLabel, Typography, Dialog, DialogActions, DialogContent } from '@mui/material';
import { userStyle } from '../../PageStyle';
import Selects, { components } from "react-select";
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { toast } from 'react-toastify';
import Footer from '../../../components/footer/Footer';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';
import { MultiSelect } from "react-multi-select-component";

function GroupCreateList() {

    const { auth, setngs } = useContext(AuthContext);
    const [brand, setBrand] = useState([]);
    const [categories, setCategories] = useState([]);
    const [addGroup, setAddGroup] = useState({ brandname: "Please Select Brand", categoryname: "" });
    const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
    const [selectedOptionsBrand, setSelectedOptionsBrand] = useState([]);
    let [valueCate, setValueCate] = useState("")
    let [valueBrand, setValueBrand] = useState("")

    const [showBrand, setShowBrand] = useState(true);
    const [showCat, setShowCat] = useState(true)
    // Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

    // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };



    // Disable field
    const [isBrandOptionSelected, setIsBrandOptionSelected] = useState(false);
    const [isCategoryOptionSelected, setIsCategoryOptionSelected] = useState(false);

    const fetchBrands = async () => {
        try {
            let res = await axios.post(SERVICE.BRAND, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setBrand(res?.data?.brands?.map((t) => ({
                ...t,
                label: t.brandname,
                value: t.brandname
            })))
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    const fetchCategory = async () => {
        try {
            let res = await axios.post(SERVICE.CATEGORIES, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            setCategories(res?.data?.categories?.map((t) => ({
                ...t,
                label: t.categoryname,
                value: t.categoryname
            })))
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    useEffect(() => { fetchCategory(); fetchBrands() }, [])

    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

    // category multi select
    const handleCategoryChange = (options) => {
        handleBrandFocus(); 
        setShowCat(false);

        setValueCate(options.map((a, index) => {
            return a.categoryname
        }))
        setSelectedOptionsCate(options);
    };

    const customValueRendererCate = (valueCate, _categories) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select";
    };

    // brand multi select
    const handleBrandChange = (options) => {
        handleCategoryFocus(); 
        setShowBrand(false);
        setValueBrand(options.map((a, index) => {
            return a.value
        }))
        setSelectedOptionsBrand(options);
    };

    const customValueRendererBrand = (valueBrand, brand) => {
        return valueBrand.length
            ? valueBrand.map(({ label }) => label).join(", ")
            : "Please select";
    };

    const backLPage = useNavigate();

    const sendRequest = async () => {

        try {
            let res = await axios.post(SERVICE.GROUP_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                assignbusinessid: String(setngs.businessid),
                brandname: addGroup.brandname ? addGroup.brandname : [...valueBrand],
                categoryname: addGroup.categoryname ? addGroup.categoryname : [...valueCate],
                isBrandOptionSelected: Boolean(isBrandOptionSelected),
                isCategoryOptionSelected: Boolean(isCategoryOptionSelected),
            });
            toast.success(res.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            backLPage('/product/group/list');
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    const sendAnotherRequest = async () => {
        try {
            let res = await axios.post(SERVICE.GROUP_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                assignbusinessid: String(setngs.businessid),
                brandname: addGroup.brandname ? addGroup.brandname : [...valueBrand],
                categoryname: addGroup.categoryname ? addGroup.categoryname : [...valueCate],
                isBrandOptionSelected: Boolean(isBrandOptionSelected),
                isCategoryOptionSelected: Boolean(isCategoryOptionSelected),
            });
            toast.success(res.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isBrandOptionSelected = selectedOptionsBrand.length > 0;
        const isCategoryOptionSelected = selectedOptionsCate.length > 0;

        if (!isBrandOptionSelected) {
            if (addGroup.brandname === "" || addGroup.brandname == "Please Select Brand") {
                setShowAlert("Please Select Brand!");
                handleClickOpen();
                handleBrandFocus();
            } else if (selectedOptionsCate.length === 0) {
                setShowAlert("Please Select Category!");
                handleClickOpen();
                handleBrandFocus();
            } else {
                sendRequest();
            }
        } else if (!isCategoryOptionSelected) {
            if (addGroup.categoryname === "" || addGroup.categoryname == "Please Select Category") {
                setShowAlert("Please Select Category!");
                handleClickOpen();
                handleCategoryFocus();
            } else if (selectedOptionsBrand.length === 0) {
                setShowAlert("Please Select Brand!");
                handleClickOpen();
                handleCategoryFocus();
            } else {
                sendRequest();
            }
        }
    };

    const handleAnotherSubmit = (e) => {
        e.preventDefault();
        const isBrandOptionSelected = selectedOptionsBrand.length > 0;
        const isCategoryOptionSelected = selectedOptionsCate.length > 0;

        if (!isBrandOptionSelected) {
            if (addGroup.brandname === "" || addGroup.brandname == "Please Select Brand") {
                setShowAlert("Please Select Brand!");
                handleClickOpen();
                handleBrandFocus();
            } else if (selectedOptionsCate.length === 0) {
                setShowAlert("Please Select Category!");
                handleClickOpen();
                handleBrandFocus();
            } else {
                sendAnotherRequest();
            }
        } else if (!isCategoryOptionSelected) {
            if (addGroup.categoryname === "" || addGroup.categoryname == "Please Select Category") {
                setShowAlert("Please Select Category!");
                handleClickOpen();
                handleCategoryFocus();
            } else if (selectedOptionsBrand.length === 0) {
                setShowAlert("Please Select Brand!");
                handleClickOpen();
                handleCategoryFocus();
            } else {
                sendAnotherRequest();
            }
        }
    };

    // Disable field function
    const handleCategoryFocus = () => {
        setIsBrandOptionSelected(true);

    };

    const handleBrandFocus = () => {
        setIsCategoryOptionSelected(true);

    };

    const handleClearCate = () => {
        setAddGroup({ brandname: "Please Select Brand", });
        setSelectedOptionsCate([]);
        setIsBrandOptionSelected(false); // Reset focus state
        setIsCategoryOptionSelected(false); // Reset focus state
    };

    const handleClearBrand = () => {
        setAddGroup({ categoryname: "Please Select Category" });
        setSelectedOptionsBrand([]);
        setIsBrandOptionSelected(false); // Reset focus state
        setIsCategoryOptionSelected(false); // Reset focus state
    };

    return (
        <Box>
            <Headtitle title={'Add Category Grouping'} />
            <Typography sx={userStyle.HeaderText}>Add Category Grouping</Typography>
            {/* content start */}
            <Box sx={userStyle.container}>
                <form onSubmit={handleSubmit}>
                    {showBrand ?
                        <Grid container spacing={3} sx={userStyle.textInput}>
                            <Grid item md={4} sm={12} xs={12}>
                                <InputLabel htmlFor="component-outlined">Brand Name<b style={{ color: 'red' }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        id="component-outlined"
                                        options={brand}
                                        value={{ label: addGroup.brandname, value: addGroup.brandname }}
                                        onChange={(e) => { handleBrandFocus(); setShowCat(false); setAddGroup({ ...addGroup, brandname: e.value }); }}
                                        placeholder={addGroup.brandname}
                                        isDisabled={isBrandOptionSelected}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <InputLabel htmlFor="component-outlined">Category Name<b style={{ color: 'red' }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <MultiSelect
                                        options={categories}
                                        value={selectedOptionsCate}
                                        onChange={handleCategoryChange}
                                        valueRenderer={customValueRendererCate}
                                        labelledBy="Please Select Category"
                                        isDisabled={isBrandOptionSelected}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        :
                        <Grid container spacing={3} sx={userStyle.textInput}>
                            <Grid item md={4} sm={12} xs={12}>
                                <InputLabel htmlFor="component-outlined">Brand Name<b style={{ color: 'red' }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        id="component-outlined"
                                        options={brand}
                                        value={{ label: addGroup.brandname, value: addGroup.brandname }}
                                        onChange={(e) => { setAddGroup({ ...addGroup, brandname: e.value }); }}
                                        name="brandname"
                                        placeholder='Please Select Brand'
                                        isDisabled={isBrandOptionSelected}
                                        onFocus={handleBrandFocus}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <InputLabel htmlFor="component-outlined">Category Name<b style={{ color: 'red' }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        options={categories}
                                        value={selectedOptionsCate}
                                        onChange={handleCategoryChange}
                                        valueRenderer={customValueRendererCate}
                                        labelledBy="Please Select Category"
                                        onFocus={handleBrandFocus}
                                        isDisabled={isBrandOptionSelected}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    }
                </form>
            </Box>
            <br />
            <Box sx={userStyle.container}>
                <form onSubmit={handleSubmit}>
                    {showCat ?

                        <Grid container spacing={3} sx={userStyle.textInput}>
                            <Grid item md={4} sm={12} xs={12}>
                                <InputLabel htmlFor="component-outlined">Category Name<b style={{ color: 'red' }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        id="component-outlined"
                                        options={categories}
                                        value={{ label: addGroup.categoryname, value: addGroup.categoryname }}
                                        onChange={(e) => { handleCategoryFocus(); setShowBrand(false); setAddGroup({ ...addGroup, categoryname: e.value }); }}
                                        name="categoryname"
                                        placeholder='Please Select Category'
                                        isDisabled={isCategoryOptionSelected}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <InputLabel htmlFor="component-outlined">Brand Name<b style={{ color: 'red' }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <MultiSelect
                                        options={brand}
                                        value={selectedOptionsBrand}
                                        onChange={handleBrandChange}
                                        valueRenderer={customValueRendererBrand}
                                        labelledBy="Please Select Brand"
                                        isDisabled={isCategoryOptionSelected}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        :
                        <Grid container spacing={3} sx={userStyle.textInput}>
                            <Grid item md={4} sm={12} xs={12}>
                                <InputLabel htmlFor="component-outlined">Category Name<b style={{ color: 'red' }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        id="component-outlined"
                                        options={categories}
                                        value={{ label: addGroup.categoryname, value: addGroup.categoryname }}
                                        onChange={(e) => { setAddGroup({ ...addGroup, categoryname: e.value }); }}
                                        name="categoryname"
                                        placeholder='Please Select Category'
                                        onFocus={handleCategoryFocus}
                                        isDisabled={isCategoryOptionSelected}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <InputLabel htmlFor="component-outlined">Brand Name<b style={{ color: 'red' }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        options={brand}
                                        value={selectedOptionsBrand}
                                        onChange={handleBrandChange}
                                        valueRenderer={customValueRendererBrand}
                                        labelledBy="Please Select Brand"
                                        onFocus={handleCategoryFocus}
                                        isDisabled={isCategoryOptionSelected}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    }

                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid sx={{ display: 'flex' }}>
                            <Button sx={userStyle.buttonadd} type="submit" >SAVE</Button>
                            <Button sx={userStyle.buttonadd} onClick={handleAnotherSubmit} >SAVE AND ADD ANOTHER</Button>
                            <Link to="/product/group/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
                            <Button sx={userStyle.buttoncancel} onClick={() => { setShowCat(true); setShowBrand(true); setIsBrandOptionSelected(false); setIsCategoryOptionSelected(false); setAddGroup([]); handleClearCate(); handleClearBrand() }}>Clear</Button>
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
function GroupCreate() {
    return (
       <>
         <GroupCreateList /><br /><br /><br /><br />
                    <Footer />
       </>
    );
}

export default GroupCreate;