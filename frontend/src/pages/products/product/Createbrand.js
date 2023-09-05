import React, { useState, useContext, useEffect } from 'react';
import { Box, Button, Grid, FormControl, OutlinedInput, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { userStyle } from '../../PageStyle';
import { FaPlus } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

function Createbrand({ setFetchsavebrand }) {

    let newval = "0001";
    let newvalbrand = "0001";

    const [showAlert, setShowAlert] = useState("")

    const { auth, setngs } = useContext(AuthContext);
    const [categoryForm, setCategoryForm] = useState({ brandname: "", brandshortname: "", brandcode: newval });

    const [firstSubCate, setFirstSubCate] = useState({ subbrandname: "", subbrandshotname: "", subbrandcode: newvalbrand });
    const [isFirstSubCateView, setIsFirstSubCateView] = useState(false)
    const [isRemovefirstSubcategory, setIsRemovefirstSubcategory] = useState(false)
    const [categoryCode, setCategoryCode] = useState([]);
    const [categoryName, setcategoryName] = useState([]);
    const [categoryShotName, setcategoryShotName] = useState([]);
    const [allBrands, setAllBrands] = useState([]);
    const [isSubCategory, setIsSubCategory] = useState([])
    const [subStringVal, setSubStringVal] = useState("0001");

    const [brandmodal, setBrandmodal] = useState(false);
    const brandModOpen = () => { setBrandmodal(true); };
    const brandModClose = () => {
        setBrandmodal(false);
        fetchData();
        setIsSubCategory([]);
        fetchCategorySubcategory();
        setShowAlert("");
        setCategoryForm({ ...categoryForm, brandname: "", brandshortname: "", brandcode: newval });
        setFirstSubCate({ ...firstSubCate, subbrandname: "", subbrandshotname: "", subbrandcode: newvalbrand });
    };

    const handleShotNameLength = (e) => {
        if (e.length > 6) {
            let codeslicespace = e.replace(/[^a-zA-Z0-9]/g, '');
            let num = codeslicespace.slice(0, 6);
            setCategoryForm({ ...categoryForm, brandshortname: num })
        }
    }

    const handleSubShotNameLength = (e) => {
        if (e.length > 6) {
            let codeslicespace = e.replace(/[^a-zA-Z0-9]/g, '');
            let num = codeslicespace.slice(0, 6);
            setFirstSubCate({ ...firstSubCate, subbrandshotname: num })
        }
    }

    const fetchData = async () => {
        try {
            let res = await axios.post(SERVICE.BRAND, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            let refNo = res?.data?.brands[res?.data?.brands.length - 1].brandcode;
            let codenum = refNo.slice(-4);
            newval = codenum;
            let prefixLength = Number(codenum) + 1;
            let prefixString = String(prefixLength);
            let postfixLength = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ? `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString
            setCategoryForm({ ...categoryForm, brandname: "", brandshortname: "", brandcode: postfixLength })

            let nameresult = res.data.brands.map((data, index) => {
                return data.brandname
            })
            let shotnameresult = res.data.brands.map((data, index) => {
                return data.brandshortname
            })
            let coderesult = res.data.brands.map((data, index) => {
                return data.brandcode
            })
            setCategoryCode(coderesult);
            setcategoryName(nameresult);
            setcategoryShotName(shotnameresult)
            setAllBrands(res?.data?.brands)
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

    useEffect(() => {
        fetchData()
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

            newvalbrand = postfixLength;
            setFirstSubCate({ ...firstSubCate, subbrandname: "", subbrandshotname: "", subbrandcode: postfixLength });
            setSubStringVal(postfixLength);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            }
            // else {
            //     toast.error("Something went wrong!")
            // }
        }
    }

    useEffect(
        () => {
            fetchCategorySubcategory();
        }, [])


    //sub category add new item
    function addSubcategory() {
        let prefixLength = Number(subStringVal) + 1;
        let prefixString = String(prefixLength);
        let postfixLength = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ? `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString
        setSubStringVal(postfixLength);

        setIsSubCategory([...isSubCategory, { subbrandname: "", subbrandcode: postfixLength, subbrandshotname: "" }]);
    }

    function multiSubCategoriesInputs(referenceIndex, reference, inputvalue) {
        setShowAlert("");

        if (reference == "subCategoryName") {
            let subCategoryNameInput = isSubCategory.map((value, index) => {
                if (referenceIndex == index) {
                    let codeslicespace = inputvalue.replace(/[^a-zA-Z0-9]/g, '');
                    let numcode = codeslicespace.slice(0, 4);
                    let numcodes = codeslicespace.slice(0, 6);
                    let numsubcode = value.subbrandcode.slice(-4);

                    return { ...value, subbrandname: inputvalue, subbrandshotname: numcodes.toUpperCase(), subbrandcode: numcode.toUpperCase() + numsubcode }
                }
                else {
                    return value;
                }
            });
            return setIsSubCategory(subCategoryNameInput);
        }

        if (reference == "subCategoryShotName") {
            let subCategoryShotNameInput = isSubCategory.map((value, index) => {
                if (referenceIndex == index) {
                    let codeslicespace = inputvalue.replace(/[^a-zA-Z0-9]/g, '');
                    let todosubshotname = codeslicespace.slice(0, 6).toUpperCase();

                    return { ...value, subbrandshotname: todosubshotname, }
                }
                else {
                    return value;
                }
            });
            return setIsSubCategory(subCategoryShotNameInput);
        }


    }

    // sub category delete item of row
    const deleteSubCategory = (referenceIndex) => {
        let prefixLength = Number(subStringVal) - 1;
        let prefixString = String(prefixLength);
        let rdata = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ? `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString
        setSubStringVal(rdata);
        let deleteIndex;

        let subCategoryData = isSubCategory.filter((value, index) => {
            if (referenceIndex != index) {

                return value;
            } else {
                if (isSubCategory[index + 1]) {
                    deleteIndex = index;
                }
            }
            return false;
        });

        let resultData = subCategoryData.map((data, index) => {
            if (index >= deleteIndex) {
                let subcode = data.subbrandcode.slice(-4)
                let codeslicespace = data.subbrandname.replace(/[^a-zA-Z0-9]/g, '');
                let subslice = codeslicespace.slice(0, 4);
                let presubcode = data.subbrandname == "" ? "" : subslice.slice(0, 4).toUpperCase();
                let prefixLength = Number(subcode) - 1;
                let prefixString = String(prefixLength);
                let postfixLength = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ? `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString


                return { ...data, subbrandcode: presubcode + postfixLength, }
            } else {
                return data;
            }
        })
        setIsSubCategory(resultData);
    }

    // store category data to db
    const sendRequest = async () => {

        // default value conditin for sub category
        let addDefaultValueSubCate;
        if (!isRemovefirstSubcategory) {
            let removefirstsubcategories = [firstSubCate, ...isSubCategory]
            addDefaultValueSubCate = removefirstsubcategories.map((value) => {
                let categryname = value.subbrandname.length == 0 ? "ALL" : value.subbrandname;
                let subspace = value.subbrandname.replace(/[^a-zA-Z0-9]/g, '');
                let subcatslice = subspace.slice(0, 6).toUpperCase();
                let categryshotname = value.subbrandshotname == "" ? subcatslice : value.subbrandshotname;
                let subspace1 = categryname.replace(/[^a-zA-Z0-9]/g, '');
                let subcslice1 = subspace1.slice(0, 4).toUpperCase();
                let subcslice2 = value.subbrandcode.slice(-4).toUpperCase();
                let categrycode = subcslice1 + subcslice2;

                return { subbrandname: categryname, subbrandshotname: categryshotname, subbrandcode: categrycode }

            })
        } else {
            let removefirstsubcategories = [...isSubCategory]
            addDefaultValueSubCate = removefirstsubcategories.map((value) => {
                let categryname = value.subbrandname.length == 0 ? "ALL" : value.subbrandname;
                let subspace = value.subbrandname.replace(/[^a-zA-Z0-9]/g, '');
                let subcatslice = subspace.slice(0, 6).toUpperCase();
                let categryshotname = value.subbrandshotname == "" ? subcatslice : value.subbrandshotname;
                let subspace1 = categryname.replace(/[^a-zA-Z0-9]/g, '');
                let subcslice1 = subspace1.slice(0, 4).toUpperCase();
                let subcslice2 = value.subbrandcode.slice(-4).toUpperCase();
                let categrycode = subcslice1 + subcslice2;

                return { subbrandname: categryname, subbrandshotname: categryshotname, subbrandcode: categrycode }

            })
        }

        let codeslicespace = categoryForm.brandname.replace(/[^a-zA-Z0-9]/g, '');
        let resultshotname = codeslicespace.slice(0, 6).toUpperCase();
        setFetchsavebrand("new None")
        try {
            let res = await axios.post(SERVICE.BRAND_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                brandname: String(categoryForm.brandname),
                brandshortname: String(categoryForm.brandshortname == "" ? resultshotname : categoryForm.brandshortname),
                brandcode: String(categoryForm.brandcode),
                subbrands: addDefaultValueSubCate,
                assignbusinessid: String(setngs.businessid),
            });

            toast.success(res.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            setIsSubCategory([]);
            setFetchsavebrand("None")
            await fetchData();
            await fetchCategorySubcategory();
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(messages);
            } else {
                setShowAlert("Something went wrong!");
            }
        }
    };

    const addCateSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = allBrands.some(item => item.brandname.toLowerCase() === (categoryForm.brandname).toLowerCase());
        const isShotNameMatch = allBrands.some(item => item.brandshortname.toLowerCase() === (categoryForm.brandshortname).toLowerCase());
        const isCodeMatch = allBrands.some(item => item.brandcode.toLowerCase() === (categoryForm.brandcode).toLowerCase());

        if (categoryForm.brandname == "") {
            setShowAlert("Please enter brand name!");
        } else if (categoryShotName.includes(categoryForm.brandshortname)) {
            setShowAlert("Brand Short Name Already Exists");
        }
        else if (categoryName.includes(categoryForm.brandname)) {
            setShowAlert("Name Already Exists");
        }
        else if (categoryCode.includes(categoryForm.brandcode)) {
            setShowAlert("ID Already Exists");
        } else if (isNameMatch) {
            setShowAlert("Name Already Exists");
        }
        else if (isShotNameMatch) {
            setShowAlert("Brand Short Name Already Exists");
        }
        else if (isCodeMatch) {
            setShowAlert("Code Already Exists");
        } else {
            sendRequest();
            brandModClose();
        }
    }

    const handleIdcheck = (e) => {
        setShowAlert("");
        let codeslicespace = e.replace(/[^a-zA-Z0-9]/g, '');
        let result = codeslicespace.slice(0, 4).toUpperCase();
        let results = codeslicespace.slice(0, 6).toUpperCase();
        let resultcode = categoryForm.brandcode.slice(-4);

        setCategoryForm({ ...categoryForm, brandname: e, brandshortname: results, brandcode: result + resultcode, });

    }

    const handleSubIdCheck = (e) => {

        let codeslicespace = e.replace(/[^a-zA-Z0-9]/g, '');
        let result = codeslicespace.slice(0, 4).toUpperCase();
        let results = codeslicespace.slice(0, 6).toUpperCase();
        let resultcode = firstSubCate.subbrandcode.slice(-4);

        setFirstSubCate({ ...firstSubCate, subbrandname: e, subbrandshotname: results, subbrandcode: result + resultcode, });
    }

    return (
        <Box>
            <Grid sx={userStyle.spanPlusIcons} onClick={brandModOpen}  ><AddCircleOutlineOutlinedIcon /></Grid>
            <Dialog
                onClose={brandModClose}
                aria-labelledby="customized-dialog-title1"
                open={brandmodal}
                sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #b97df0',
                    },
                }}
                maxWidth="lg"
            >
                <form>
                    <DialogTitle id="customized-dialog-title1" onClose={brandModClose} sx={{ backgroundColor: '#e0e0e0', color: "#000", display: "flex" }}>
                        Add Brand
                    </DialogTitle>
                    <DialogContent dividers sx={{
                        minWidth: '800px', height: 'auto', '& .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #4a7bf7 !important',
                        },
                    }}>
                        <Grid container spacing={3} sx={userStyle.textInput}>
                            <Grid item md={12} sm={12} xs={12}>
                                <InputLabel htmlFor="component-outlined">Brand Name <b style={{ color: 'red', }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        id="component-outlined"
                                        value={categoryForm.brandname}
                                        onChange={(e) => { handleIdcheck(e.target.value); }}
                                        type="text"
                                        name="categoryname"
                                    />
                                </FormControl>
                                <p style={{ color: 'red' }}>{showAlert}</p>
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                                <InputLabel htmlFor="component-outlined">Brand Short Name <b style={{ color: 'red', }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        id="component-outlined"
                                        value={categoryForm.brandshortname}
                                        onChange={(e) => { setCategoryForm({ ...categoryForm, brandshortname: e.target.value.toUpperCase() }); handleShotNameLength(e.target.value) }}
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
                                        value={categoryForm.brandcode}
                                        name="brandcode"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid><br />
                        {!isFirstSubCateView &&
                            (
                                <>
                                    <Grid container columnSpacing={1}>
                                        <Grid item sm={12} xs={12} md={3.5} lg={3.5}>
                                            <InputLabel htmlFor="component-outlined">Sub Brand Name</InputLabel>
                                            <FormControl size="small" fullWidth>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    value={firstSubCate.subbrandname}
                                                    onChange={(e) => { handleSubIdCheck(e.target.value) }}
                                                    type="text"
                                                    name="categoryname"
                                                    placeholder="Sub Brand name"
                                                    defaultValue="default"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={12} xs={12} md={3.5} lg={3.5}>
                                            <InputLabel htmlFor="component-outlined">Sub Brand Short Name</InputLabel>
                                            <FormControl size="small" fullWidth>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    value={firstSubCate.subbrandshotname}
                                                    onChange={(e) => { setFirstSubCate({ ...firstSubCate, subbrandshotname: e.target.value.toUpperCase() }); handleSubShotNameLength(e.target.value) }}
                                                    type="text"
                                                    name="categoryname"
                                                    placeholder="Sub Brand Short name"
                                                    defaultValue="default"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={12} xs={12} md={3.5} lg={3.5}>
                                            <InputLabel htmlFor="component-outlined">Sub Brand Code</InputLabel>
                                            <FormControl size="small" fullWidth>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    value={firstSubCate.subbrandcode}
                                                    name="categoryname"
                                                    placeholder="Sub Brand code"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={1} xs={1} md={1.5} lg={1.5} sx={{ display: 'flex' }}>
                                            <Button variant="contained" color="success" type="button" onClick={() => addSubcategory()} sx={userStyle.categoryadd}><FaPlus /></Button>&nbsp;
                                            {/* <Button variant="contained" color="error" type="button" onClick={deleteFirstSubcate} sx={userStyle.categoryadd}><AiOutlineClose /></Button> */}
                                        </Grid>
                                    </Grid>
                                </>
                            )
                        }
                        {isSubCategory.length > 0 && (
                            <ul type="none" className="todoLlistUl" style={{ paddingLeft: '0px', marginLeft: '0px' }}>
                                {isSubCategory.map((item, index) => {
                                    return (
                                        <li key={index}>
                                            <br />
                                            <Grid container columnSpacing={1}>
                                                <Grid item sm={12} xs={12} md={3.5} lg={3.5}>
                                                    <FormControl size="small" fullWidth>
                                                        <OutlinedInput
                                                            id="component-outlined"
                                                            value={item.subbrandname}
                                                            onChange={(e) => multiSubCategoriesInputs(index, "subCategoryName", e.target.value)}
                                                            type="text"
                                                            name="categoryname"
                                                            placeholder="Sub Brand name"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={12} xs={12} md={3.5} lg={3.5}>
                                                    <FormControl size="small" fullWidth>
                                                        <OutlinedInput
                                                            id="component-outlined"
                                                            value={item.subbrandshotname}
                                                            onChange={(e) => multiSubCategoriesInputs(index, "subCategoryShotName", e.target.value)}
                                                            type="text"
                                                            name="categoryname"
                                                            placeholder="Sub Brand Short name"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={12} xs={12} md={3.5} lg={3.5}>
                                                    <FormControl size="small" fullWidth>

                                                        <OutlinedInput
                                                            id="component-outlined"
                                                            value={item.subbrandcode}
                                                            type="text"
                                                            name="categoryname"
                                                            placeholder="Sub Brand code"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={1} xs={1} md={1.5} lg={1.5} sx={{ display: 'flex' }}>
                                                    <Button variant="contained" color="success" type="button" onClick={() => addSubcategory()} sx={{ height: '30px', minWidth: '30px', marginTop: '4px', padding: '6px 10px' }}><FaPlus /></Button>&nbsp;
                                                    <Button variant="contained" color="error" type="button" onClick={(e) => deleteSubCategory(index)} sx={{ height: '30px', minWidth: '30px', marginTop: '4px', padding: '6px 10px' }}><AiOutlineClose /></Button>
                                                </Grid>
                                            </Grid>
                                        </li>
                                    )
                                })}
                            </ul>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant='contained' sx={userStyle.buttonadd} onClick={addCateSubmit}>Save</Button>
                        <Button onClick={brandModClose} variant='contained' sx={userStyle.buttoncancel}>Close</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}

export default Createbrand;