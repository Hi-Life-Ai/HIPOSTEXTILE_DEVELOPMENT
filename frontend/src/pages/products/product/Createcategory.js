import React, { useState, useContext, useEffect } from 'react';
import { Box, Button, Grid, FormControl, OutlinedInput, InputLabel, TextareaAutosize, Dialog, DialogTitle, DialogContent, DialogActions, } from '@mui/material';
import { userStyle } from '../../PageStyle';
import { FaPlus } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

function Createcategory({ setFetchsavecategory }) {

    const [categorymodal, setCategorymodal] = useState(false);
    const categoryModOpen = () => { setCategorymodal(true); };
    const categoryModClose = () => {
        setCategorymodal(false);
        fetchData();
        setIsSubCategory([]);
        fetchCategorySubcategory();
        setShowAlert("");
    };
    const [showAlert, setShowAlert] = useState("")

    let newval = "0001";
    let newvalsub = "0001";

    const { auth, setngs } = useContext(AuthContext);
    const [categoryForm, setCategoryForm] = useState({ categoryname: "", categoryshotname: "", categorycode: newval, categorydescription: "", });

    const [firstSubCate, setFirstSubCate] = useState({ subcategryname: "", subcategryshotname: "", subcategrycode: newvalsub });
    const [isRemovefirstSubcategory, setIsRemovefirstSubcategory] = useState(false)
    const [isFirstSubCateView, setIsFirstSubCateView] = useState(false)
    const [categoryCode, setCategoryCode] = useState([]);
    const [categoryNames, setcategoryNames] = useState([]);
    const [categoryShotName, setcategoryShotName] = useState([]);
    const [allCategorys, setAllCategorys] = useState([]);
    const [isSubCategory, setIsSubCategory] = useState([])
    const [subStringVal, setSubStringVal] = useState("0001");
    const [allCategories, setAllCategories] = useState([])

    const fetchData = async () => {
        try {
            let res = await axios.post(SERVICE.CATEGORIES, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            let refNo = res?.data?.categories[res?.data?.categories.length - 1].categorycode;
            let codenum = refNo.slice(-4);
            newval = codenum;
            let prefixLength = Number(codenum) + 1;
            let prefixString = String(prefixLength);
            let postfixLength = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ? `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString
            setCategoryForm({ ...categoryForm, categoryname: "", categoryshotname: "", categorydescription: "", categorycode: postfixLength })

            let nameresult = res?.data?.categories.map((data, index) => {
                return data.categoryname
            })
            let shotnameresult = res?.data?.categories.map((data, index) => {
                return data.categoryshotname
            })
            let coderesult = res?.data?.categories.map((data, index) => {
                return data.categorycode
            })
            setCategoryCode(coderesult);
            setcategoryNames(nameresult);
            setcategoryShotName(shotnameresult)
            setAllCategorys(res?.data?.categories)
            let arr = [];
            res?.data?.categories?.map((data, index) => {
                data?.subcategories.filter((t) => {

                    arr.push(t.subcategryname);
                    return true;
                });
                return true;
            });
            setAllCategories(arr);
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

    useEffect(
        () => {
            fetchData()
        }, [])

    const fetchCategorySubcategory = async () => {
        try {
            let res = await axios.post(SERVICE.CATEGORIES_SUBCATEGORY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });
            let refNo = res?.data?.subcatrgories[res?.data?.subcatrgories.length - 1].subcategrycode;
            let codenum = refNo.slice(-4);
            let prefixLength = Number(codenum) + 1;
            let prefixString = String(prefixLength);
            let postfixLength = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ? `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString

            newvalsub = postfixLength;
            setFirstSubCate({ ...firstSubCate, subcategryname: "", subcategryshotname: "", subcategrycode: postfixLength });
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

    const handleShotNameLength = (e) => {
        if (e.length > 6) {
            let codeslicespace = e.replace(/[^a-zA-Z0-9]/g, '');
            let num = codeslicespace.slice(0, 6);
            setCategoryForm({ ...categoryForm, categoryShotName: num })
        }
    }

    const handleSubShotNameLength = (e) => {
        if (e.length > 6) {
            let codeslicespace = e.replace(/[^a-zA-Z0-9]/g, '');
            let num = codeslicespace.slice(0, 6);
            setFirstSubCate({ ...firstSubCate, subcategryshotname: num })
        }
    }

    //sub category add new item
    function addSubcategory() {
        let prefixLength = Number(subStringVal) + 1;
        let prefixString = String(prefixLength);
        let postfixLength = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ? `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString
        setSubStringVal(postfixLength);

        setIsSubCategory([...isSubCategory, { subcategryname: "", subcategrycode: postfixLength, subcategryshotname: "" }]);

        let value = isSubCategory.map(data => data.subcategryname);

        const hasCommonValue = (allCategories, value) => {
            return allCategories.some(item => value.includes(item));
        };

        const result = hasCommonValue(allCategories, value);
        const isDuplicateFirst = value.includes(firstSubCate.subcategryname);

        if (result || isDuplicateFirst) {

            setShowAlert("Sub Category Name Already Exists!");
            deleteSubCategory()
        }
    }

    function multiSubCategoriesInputs(referenceIndex, reference, inputvalue) {

        if (reference == "subCategoryName") {
            const isDuplicate = isSubCategory.some((item, index) => index !== referenceIndex && item.subcategryname === inputvalue);

            if (isDuplicate) {
                setShowAlert("Sub Category Name Already Exists!");
                return;
            }
            let subCategoryNameInput = isSubCategory.map((value, index) => {
                if (referenceIndex == index) {
                    let codeslicespace = inputvalue.replace(/[^a-zA-Z0-9]/g, '');
                    let numcode = codeslicespace.slice(0, 6);
                    let numcodeone = codeslicespace.slice(0, 4)
                    let numsubcode = value.subcategrycode.slice(-4);

                    return { ...value, subcategryname: inputvalue, subcategryshotname: numcode.toUpperCase(), subcategrycode: numcodeone.toUpperCase() + numsubcode }
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

                    return { ...value, subcategryshotname: todosubshotname, }
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
                let subcode = data.subcategrycode.slice(-4)
                let codeslicespace = data.subcategryname.replace(/[^a-zA-Z0-9]/g, '');
                let subslice = codeslicespace.slice(0, 4);
                let presubcode = data.subcategryname == "" ? "" : subslice.slice(0, 4).toUpperCase();
                let prefixLength = Number(subcode) - 1;
                let prefixString = String(prefixLength);
                let postfixLength = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ? `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString

                return { ...data, subcategrycode: presubcode + postfixLength, }
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
                let categryname = value.subcategryname.length == 0 ? "ALL" : value.subcategryname;
                let subspace = value.subcategryname.replace(/[^a-zA-Z0-9]/g, '');
                let subcatslice = subspace.slice(0, 6).toUpperCase();
                let categryshotname = value.subcategryshotname == "" ? subcatslice : value.subcategryshotname;
                let subspace1 = categryname.replace(/[^a-zA-Z0-9]/g, '');
                let subcslice1 = subspace1.slice(0, 4).toUpperCase();
                let subcslice2 = value.subcategrycode.slice(-4).toUpperCase();
                let categrycode = subcslice1 + subcslice2;

                return { subcategryname: categryname, subcategryshotname: categryshotname, subcategrycode: categrycode }

            })
        } else {
            let removefirstsubcategories = [...isSubCategory]
            addDefaultValueSubCate = removefirstsubcategories.map((value) => {
                let categryname = value.subcategryname.length == 0 ? "ALL" : value.subcategryname;
                let subspace = value.subcategryname.replace(/[^a-zA-Z0-9]/g, '');
                let subcatslice = subspace.slice(0, 6).toUpperCase();
                let categryshotname = value.subcategryshotname == "" ? subcatslice : value.subcategryshotname;
                let subspace1 = categryname.replace(/[^a-zA-Z0-9]/g, '');
                let subcslice1 = subspace1.slice(0, 4).toUpperCase();
                let subcslice2 = value.subcategrycode.slice(-4).toUpperCase();
                let categrycode = subcslice1 + subcslice2;

                return { subcategryname: categryname, subcategryshotname: categryshotname, subcategrycode: categrycode }

            })
        }


        let codeslicespace = categoryForm.categoryname.replace(/[^a-zA-Z0-9]/g, '');
        let resultshotname = codeslicespace.slice(0, 6).toUpperCase();
        setFetchsavecategory("new None")
        try {
            let res = await axios.post(SERVICE.CATEGORIES_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                categoryname: String(categoryForm.categoryname),
                categoryshotname: String(categoryForm.categoryshotname == "" ? resultshotname : categoryForm.categoryshotname),
                categorycode: String(categoryForm.categorycode),
                categorydescription: String(categoryForm.categorydescription),
                subcategories: addDefaultValueSubCate,
                assignbusinessid: String(setngs.businessid),
            });

            toast.success(res.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            setCategoryForm({ ...categoryForm, categoryname: "", categoryshotname: "", categorycode: "", categorydescription: "", });
            setFirstSubCate({ ...firstSubCate, subcategryname: "", subcategryshotname: "", subcategrycode: "" });
            setShowAlert("");
            setIsSubCategory([]);
            setFetchsavecategory("None")
            await fetchData();
            await fetchCategorySubcategory();
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };
    const addCateSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = allCategorys?.some(item => item.categoryname?.toLowerCase() === (categoryForm.categoryname)?.toLowerCase());
        const isShotNameMatch = allCategorys?.some(item => item.categoryshotname?.toLowerCase() === (categoryForm.categoryshotname)?.toLowerCase());
        const isCodeMatch = allCategorys?.some(item => item.categorycode?.toLowerCase() === (categoryForm.categorycode)?.toLowerCase());

        if (categoryForm.categoryname == "") {
            setShowAlert("Please enter category name!");
        } else if (categoryNames.includes(categoryForm.categoryname)) {
            setShowAlert("Category Name Already Exists");
        }
        else if (categoryShotName.includes(categoryForm.categoryshotname)) {
            setShowAlert("Category Shot Name Already Exists");
        }
        else if (categoryCode.includes(categoryForm.categorycode)) {
            setShowAlert("ID Already Exists");
        } else if (isNameMatch) {
            setShowAlert("Category Name Already Exists");
        }
        else if (isShotNameMatch) {
            setShowAlert("Category Shot Name Already Exists");
        }
        else if (isCodeMatch) {
            setShowAlert("Code Already Exists");
        } else {
            sendRequest();
            categoryModClose();
        }
    }

    const handleIdcheck = (e) => {
        let codeslicespace = e.replace(/[^a-zA-Z0-9]/g, '');
        let result = codeslicespace.slice(0, 4).toUpperCase();
        let results = codeslicespace.slice(0, 6).toUpperCase();
        let resultcode = categoryForm.categorycode.slice(-4);

        setCategoryForm({ ...categoryForm, categoryname: e, categoryshotname: results, categorycode: result + resultcode });

    }

    const handleSubIdCheck = (e) => {

        let codeslicespace = e.replace(/[^a-zA-Z0-9]/g, '');
        let result = codeslicespace.slice(0, 4).toUpperCase();
        let results = codeslicespace.slice(0, 6).toUpperCase();
        let resultcode = firstSubCate.subcategrycode.slice(-4);
        setFirstSubCate({ ...firstSubCate, subcategryname: e, subcategryshotname: results, subcategrycode: result + resultcode });
    }

    return (
        <Box>
            <Grid sx={userStyle.spanPlusIcons} onClick={categoryModOpen}  ><AddCircleOutlineOutlinedIcon /></Grid>
            <Dialog
                onClose={categoryModClose}
                aria-labelledby="customized-dialog-title1"
                open={categorymodal}
                sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #b97df0',
                    },
                }}
                maxWidth="lg"
            >
                <form>
                    <DialogTitle id="customized-dialog-title1" onClose={categoryModClose} sx={{ backgroundColor: '#e0e0e0', color: "#000", display: "flex" }}>
                        Add Category
                    </DialogTitle>
                    <DialogContent dividers sx={{
                        minWidth: '800px', height: 'auto', '& .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #4a7bf7 !important',
                        },
                    }}>
                        <Grid container spacing={3} sx={userStyle.textInput}>
                            <Grid item md={12} sm={12} xs={12}>
                                <InputLabel htmlFor="component-outlined">Category Name <b style={{ color: 'red', }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        id="component-outlined"
                                        value={categoryForm.categoryname}
                                        onChange={(e) => { handleIdcheck(e.target.value); }}
                                        type="text"
                                        name="categoryname"
                                    />
                                </FormControl>
                                <p style={{ color: 'red' }}>{showAlert}</p>
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                                <InputLabel htmlFor="component-outlined">Category Shot Name <b style={{ color: 'red', }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        id="component-outlined"
                                        value={categoryForm.categoryshotname}
                                        onChange={(e) => { setCategoryForm({ ...categoryForm, categoryshotname: e.target.value.toUpperCase() }); handleShotNameLength(e.target.value) }}
                                        type="text"
                                        name="categoryshotname"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                                <InputLabel htmlFor="component-outlined">Category Code <b style={{ color: 'red', }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        id="component-outlined"
                                        value={categoryForm.categorycode}
                                        name="categorycode"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                                <InputLabel id="demo-select-small">Description</InputLabel>
                                <FormControl size="small" fullWidth >
                                    <TextareaAutosize aria-label="minimum height" placeholder="Description" minRows={3} style={{ border: '1px solid #4a7bf7' }}
                                        value={categoryForm.categorydescription}
                                        onChange={(e) => { setCategoryForm({ ...categoryForm, categorydescription: e.target.value }) }}
                                        name="categorydescription"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid><br />
                        {!isFirstSubCateView &&
                            (
                                <>
                                    <Grid container columnSpacing={1}>
                                        <Grid item sm={5} xs={12} md={3.5} lg={3.5}>
                                            <InputLabel htmlFor="component-outlined">Sub Category Name</InputLabel>
                                            <FormControl size="small" fullWidth>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    value={firstSubCate.subcategryname}
                                                    onChange={(e) => { handleSubIdCheck(e.target.value) }}
                                                    type="text"
                                                    name="categoryname"
                                                    placeholder="Sub Category name"
                                                    defaultValue="default"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={12} xs={12} md={3.5} lg={3.5}>
                                            <InputLabel htmlFor="component-outlined">Sub Category Shot Name</InputLabel>
                                            <FormControl size="small" fullWidth>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    value={firstSubCate.subcategryshotname}
                                                    onChange={(e) => { setFirstSubCate({ ...firstSubCate, subcategryshotname: e.target.value.toUpperCase() }); handleSubShotNameLength(e.target.value) }}
                                                    type="text"
                                                    name="categoryname"
                                                    placeholder="Sub Category Shot name"
                                                    defaultValue="default"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={5} xs={12} md={3.5} lg={3.5}>
                                            <InputLabel htmlFor="component-outlined">Sub Category Code</InputLabel>
                                            <FormControl size="small" fullWidth>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    value={firstSubCate.subcategrycode}
                                                    name="categoryname"
                                                    placeholder="Sub Category code"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={1} xs={1} md={1.5} lg={1.5} sx={{ display: 'flex' }}>
                                            <Button variant="contained" color="success" type="button" onClick={() => addSubcategory()} sx={userStyle.categoryadd}><FaPlus /></Button>&nbsp;
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
                                                <Grid item sm={5} xs={12} md={3.5} lg={3.5}>
                                                    <FormControl size="small" fullWidth>
                                                        <OutlinedInput
                                                            id="component-outlined"
                                                            value={item.subcategryname}
                                                            onChange={(e) => multiSubCategoriesInputs(index, "subCategoryName", e.target.value)}
                                                            type="text"
                                                            name="categoryname"
                                                            placeholder="Sub Category name"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={12} xs={12} md={3.5} lg={3.5}>
                                                    <FormControl size="small" fullWidth>
                                                        <OutlinedInput
                                                            id="component-outlined"
                                                            value={item.subcategryshotname}
                                                            onChange={(e) => multiSubCategoriesInputs(index, "subCategoryShotName", e.target.value)}
                                                            type="text"
                                                            name="categoryname"
                                                            placeholder="Sub Category Shot name"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={5} xs={12} md={3.5} lg={3.5}>
                                                    <FormControl size="small" fullWidth>

                                                        <OutlinedInput
                                                            id="component-outlined"
                                                            value={item.subcategrycode}
                                                            type="text"
                                                            name="categoryname"
                                                            placeholder="Sub Category code"
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
                        <br />
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant='contained' sx={userStyle.buttonadd} onClick={addCateSubmit}>Save</Button>
                        <Button onClick={categoryModClose} variant='contained' sx={userStyle.buttoncancel}>Close</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}

export default Createcategory;