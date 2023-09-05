import React, { useState, useContext, useEffect } from 'react';
import { Box, Button, Grid, FormControl, OutlinedInput, InputLabel, Typography, TextareaAutosize, Dialog, DialogContent, DialogActions, } from '@mui/material';
import { userStyle } from '../../PageStyle';
import { FaPlus } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../../components/header/Navbar';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Footer from '../../../components/footer/Footer';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';

function Categorycreate() {

  let newval = "0001";
  let newvalsub = "0001";
  let newvalbrand = "0001";

  const { auth, setngs } = useContext(AuthContext);
  const [categoryForm, setCategoryForm] = useState({ categoryname: "", categorycode: newval, categorydescription: "", });

  const [firstSubCate, setFirstSubCate] = useState({ subcategryname: "", subcategrycode: newvalsub });
  const [isBrand, setIsBrand] = useState([])
  const [firstBrand, setFirstBrand] = useState({ brandname: "", brandcode: newvalbrand })
  const [isRemovefirstSubcategory, setIsRemovefirstSubcategory] = useState(false)
  const [isFirstSubCateView, setIsFirstSubCateView] = useState(false)
  const [isRemovefirstBrand, setIsRemovefirstBrand] = useState(false)
  const [isFirstBrandView, setIsFirstBrandView] = useState(false)
  const [categoryCode, setCategoryCode] = useState([]);
  const [categoryName, setcategoryName] = useState([]);
  const [autoId, setAutoId] = useState([])
  const [subAutoId, setSubAutoId] = useState([])
  const [brandAutoId, setBrandAutoId] = useState([])
  const [isSubCategory, setIsSubCategory] = useState([])
  const [subStringVal, setSubStringVal] = useState("0001");
  const [brandStringVal, setBrandStringVal] = useState("0001");

  //popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState()
  const handleClickOpenc = () => {
    setIsErrorOpen(true);
  };
  const handleClose = () => {
    setIsErrorOpen(false);
  };

  const backLPage = useNavigate();

  // store category data to db
  const sendRequest = async () => {

    // default value conditin for sub category
    let addDefaultValueSubCate;
    if (!isRemovefirstSubcategory) {
      let removefirstsubcategories = [firstSubCate, ...isSubCategory]
      addDefaultValueSubCate = removefirstsubcategories.map((value) => {
        let categryname = value.subcategryname.length == 0 ? "Default" : value.subcategryname;
        let categrycode = value.subcategrycode.length == 0 ? "Default" : value.subcategrycode;
        return { subcategryname: categryname, subcategrycode: categrycode }

      })
    } else {
      let removefirstsubcategories = [...isSubCategory]
      addDefaultValueSubCate = removefirstsubcategories.map((value) => {
        let categryname = value.subcategryname.length == 0 ? "Default" : value.subcategryname;
        let categrycode = value.subcategrycode.length == 0 ? "Default" : value.subcategrycode;
        return { subcategryname: categryname, subcategrycode: categrycode }

      })
    }

    // brand default value condition
    let addDefaultValueBrand;
    if (!isRemovefirstBrand) {
      let removefirstbrands = [firstBrand, ...isBrand]
      addDefaultValueBrand = removefirstbrands.map((value) => {
        let bnname = value.brandname.length == 0 ? "Default" : value.brandname;
        let bncode = value.brandcode.length == 0 ? "Default" : value.brandcode;
        return { brandname: bnname, brandcode: bncode }

      })
    } else {
      let removefirstbrands = [...isBrand]
      addDefaultValueBrand = removefirstbrands.map((value) => {
        let bnname = value.brandname.length == 0 ? "Default" : value.brandname;
        let bncode = value.brandcode.length == 0 ? "Default" : value.brandcode;
        return { brandname: bnname, brandcode: bncode }

      })
    }

    try {
      let res = await axios.post(SERVICE.CATEGORIES_CREATE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        categoryname: String(categoryForm.categoryname),
        categorycode: String(newval),
        categorydescription: String(categoryForm.categorydescription),
        subcategories: addDefaultValueSubCate,
        brands: addDefaultValueBrand,
        assignbusinessid: String(setngs.businessid),
      });
      setCategoryForm(res.data);
      handleClose();
      toast.success(res.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
      backLPage('/product/category/list');
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(messages);
        handleClickOpenc();
      } else {
        setShowAlert("Something went wrong!");
        handleClickOpenc();
      }
    }
  };

  const handleValidationName = (e) => {
    let val = e.target.value;
    let numbers = new RegExp('[0-9]');
    var regex = /[`!@#$%^&*()_+\-=\[\]{};':"\\| ,<>\/?~]/;
    if (e.target.value.match(numbers)) {
      setShowAlert("Please enter letter only! (a-z)")
      handleClickOpenc();
      let num = val.length;
      let value = val.slice(0, num - 1)

    }
    else if (regex.test(e.target.value)) {
      setShowAlert("Please enter letter only! (a-z)")
      handleClickOpenc();
      let num = val.length;
      let value = val.slice(0, num - 1)
    }
  }

  const fetchData = async () => {
    try {
      let res = await axios.post(SERVICE.CATEGORIES, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });

      setAutoId(res?.data?.categories)
      let refNo = res?.data?.categories[res?.data?.categories.length - 1].categorycode;
      let codenum = refNo.slice(-4);
      newval = codenum;
      setCategoryForm({...categoryForm, categorycode:codenum})

      let nameresult = res.data.categories.map((data, index) => {
        return data.categoryname
      })
      let coderesult = res.data.categories.map((data, index) => {
        return data.categorycode
      })
      setCategoryCode(coderesult);
      setcategoryName(nameresult);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

  const fetchCategorySubcategory = async () => {
    try {
      let res = await axios.post(SERVICE.CATEGORIES_SUBCATEGORY, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });
      setSubAutoId(res?.data?.subcatrgories)
      let refNo = res?.data?.subcatrgories[res?.data?.subcatrgories.length - 1].subcategrycode;
      let subcodenum = refNo.slice(-4);
      setFirstSubCate({ ...firstSubCate, subcategrycode:subcodenum });
      newvalsub = subcodenum;
      setSubStringVal(subcodenum);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  }

  const fetchCategoryBrand = async () => {
    try {
      let res = await axios.post(SERVICE.CATEGORIES_BRAND, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });
      setBrandAutoId(res?.data?.brands)
      let refNo = res?.data?.brands[res?.data?.brands.length - 1].brandcode;
      let brandcodenum = refNo.slice(-4);
      newvalbrand = brandcodenum;
      setFirstBrand({ ...firstBrand, brandcode: brandcodenum })
      setBrandStringVal(brandcodenum);
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
    fetchData()
  }, [])


  useEffect(
    () => {
      fetchCategorySubcategory();
      fetchCategoryBrand();
    }, [])

 
  //sub category add new item
  function addSubcategory() {
    let prefixLength = Number(subStringVal) + 1;
    let prefixString = String(prefixLength);
    let postfixLength = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ? `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString
    setSubStringVal(postfixLength);

    setIsSubCategory([...isSubCategory, { subcategryname: "", subcategrycode: postfixLength, }]);
  }

  function multiSubCategoriesInputs(referenceIndex, reference, inputvalue) { 
                                                                              
    if (reference == "subCategoryName") {
      let subCategoryNameInput = isSubCategory.map((value, index) => {
        if (referenceIndex == index) {
          let numcode = inputvalue.slice(0, 4);
          let numsubcode = value.subcategrycode.slice(-4);
          return { ...value, subcategryname: inputvalue, subcategrycode: numcode.toUpperCase() + numsubcode }
        }
        else {
          return value;
        }
      });
      return setIsSubCategory(subCategoryNameInput);
    }
  }

  // sub category delete item of row
  const deleteSubCategory = (referenceIndex) => {
    let subCategoryData = isSubCategory.filter((value, index) => {
      if (referenceIndex != index) {
        return value;
      }
    });
    let postfixLength;
    let resultdata = subCategoryData.map((data, index)=>{
      let subcode = data.subcategrycode.slice(-4)
      let prefixLength = Number(subcode) - 1;
      let prefixString = String(prefixLength);
      postfixLength = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ? `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString
      // setSubStringVal(postfixLength);
  
      // setIsSubCategory([...isSubCategory, { subcategryname: "", subcategrycode: postfixLength, }]);

      return {...data, subcategrycode:postfixLength}
    })
    let subStringDecrease = Number(postfixLength) - 1
      setSubStringVal(subStringDecrease);
    
    setIsSubCategory(resultdata);
  }

  // remove first sub category row
  const deleteFirstSubcate = () => {
    setIsFirstSubCateView(true);
    setIsRemovefirstSubcategory(true);
  }

  //brand add new item
  function addBrand() {
    let prefixLength = Number(brandStringVal) + 1;
    let prefixString = String(prefixLength);
    let postfixLength = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ? `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString
    setBrandStringVal(postfixLength);
    setIsBrand([...isBrand, { brandname: "", brandcode: postfixLength, }]);
  }

  function multiBrandInputs(referenceIndex, reference, inputvalue) {
    if (reference == "brandName") {
      let brandNameInput = isBrand.map((value, index) => {
        if (referenceIndex == index) {
          let numcode = inputvalue.slice(0, 4);
          let numbrandcode = value.brandcode.slice(-4);
          return { ...value, brandname: inputvalue, brandcode: numcode.toUpperCase() + numbrandcode}
        }
        else {
          return value;
        }
      });
      return setIsBrand(brandNameInput);
    }
  }

  //brand delete item of row
  const deleteBrand = (referenceIndex) => {
    let brandData = isBrand.filter((value, index) => {
      if (referenceIndex != index) {
        return value;
      }
    });
    setIsBrand(brandData);
  }

  // remove first brand row
  const deleteFirstBarnd = () => {
    setIsFirstBrandView(true);
    setIsRemovefirstBrand(true);
  }

  const addCateSubmit = (e) => {
    e.preventDefault();
    if (categoryForm.categoryname == "") {
      setShowAlert("Please enter category name!");
      handleClickOpenc();

    }

    else if (categoryName.includes(categoryForm.categoryname)) {
      setShowAlert("Name Already Exists");
      handleClickOpenc();
    }
    else if (categoryCode.includes(categoryForm.categorycode)) {
      setShowAlert("ID Already Exists");
      handleClickOpenc();
    } else {
      sendRequest();
    }
  }

  const handleIdcheck = (e) => {
    let result = e.slice(0, 4).toUpperCase();

    setCategoryForm({ ...categoryForm, categoryname:e, categorycode: result + newval });

  }

  const handleSubIdCheck = (e) => {

    let result = e.slice(0, 4).toUpperCase();

    setFirstSubCate({ ...firstSubCate, subcategryname:e, subcategrycode: result + newvalsub });
  }

  const handleBrandIdCheck = (e) => {

    let result = e.slice(0, 4).toUpperCase();
    setFirstBrand({ ...firstBrand, brandname: e, brandcode: result + newvalbrand })
  }


  return (
    <Box>
      <Headtitle title={'Add category'} />
      <Typography sx={userStyle.HeaderText}>Add Category</Typography>
      {/* content start */}
      <Box sx={userStyle.container}>
        <Grid container spacing={3} sx={userStyle.textInput}>
          <Grid item md={12} sm={12} xs={12}>
            <InputLabel htmlFor="component-outlined">Category Name <b style={{ color: 'red', }}>*</b></InputLabel>
            <FormControl size="small" fullWidth>
              <OutlinedInput
                id="component-outlined"
                value={categoryForm.categoryname}
                onChange={(e) => { handleIdcheck(e.target.value); handleValidationName(e) }}
                type="text"
                name="categoryname"
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
                <Grid item sm={5} xs={12} md={5} lg={5}>
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
                <Grid item sm={5} xs={12} md={5} lg={5}>
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
                <Grid item sm={1} xs={1} md={2} lg={2} sx={{ display: 'flex' }}>
                  <Button variant="contained" color="success" type="button" onClick={() => addSubcategory()} sx={userStyle.categoryadd}><FaPlus /></Button>&nbsp;
                  <Button variant="contained" color="error" type="button" onClick={deleteFirstSubcate} sx={userStyle.categoryadd}><AiOutlineClose /></Button>
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
                    <Grid item sm={5} xs={12} md={5} lg={5}>
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
                    <Grid item sm={5} xs={12} md={5} lg={5}>
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
                    <Grid item sm={1} xs={1} md={2} lg={2} sx={{ display: 'flex' }}>
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
        {!isFirstBrandView &&
          (
            <>
              <Grid container columnSpacing={1}>
                <Grid item sm={5} xs={12} md={5} lg={5}>
                  <InputLabel htmlFor="component-outlined">Brand Name</InputLabel>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      id="component-outlined"
                      value={firstBrand.brandname}
                      onChange={(e) => handleBrandIdCheck(e.target.value)}
                      type="text"
                      name="categoryname"
                      placeholder='Brand name'
                    />
                  </FormControl>
                </Grid>
                <Grid item sm={5} xs={12} md={5} lg={5}>
                  <InputLabel htmlFor="component-outlined">Brand Code</InputLabel>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      id="component-outlined"
                      value={firstBrand.brandcode}
                      type="text"
                      name="categoryname"
                      placeholder='Brand code'
                    />
                  </FormControl>
                </Grid>
                <Grid item sm={1} xs={1} md={1} lg={1} sx={{ display: 'flex' }}>
                  <Button variant="contained" color="success" type="button" onClick={() => addBrand()} sx={userStyle.categoryadd}><FaPlus /></Button>&nbsp;
                  <Button variant="contained" color="error" type="button" onClick={deleteFirstBarnd} sx={userStyle.categoryadd}><AiOutlineClose /></Button>
                </Grid>
              </Grid>
            </>
          )
        }
        {isBrand.length > 0 && (
          <ul type="none" className="todoLlistUl" style={{ paddingLeft: '0px', marginLeft: '0px' }}>
            {isBrand.map((item, index) => {
              return (
                <li key={index}>
                  <br />
                  <Grid container columnSpacing={1}>
                    <Grid item sm={5} xs={12} md={5} lg={5}>
                      <FormControl size="small" fullWidth>
                        <OutlinedInput
                          id="component-outlined"
                          value={item.brandname}
                          onChange={(e) => multiBrandInputs(index, "brandName", e.target.value)}
                          type="text"
                          name="brandname"
                          placeholder="Brand name"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item sm={5} xs={12} md={5} lg={5}>
                      <FormControl size="small" fullWidth>
                        <OutlinedInput
                          id="component-outlined"
                          value={item.brandcode}
                          onChange={(e) => multiBrandInputs(index, "brandCode", e.target.value)}
                          type="text"
                          name="barandcode"
                          placeholder="Brand code"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item sm={1} xs={1} md={1} lg={1} sx={{ display: 'flex' }}>
                      <Button variant="contained" color="success" type="button" onClick={() => addBrand()} sx={{ height: '30px', minWidth: '30px', marginTop: '4px', padding: '6px 10px' }}><FaPlus /></Button>&nbsp;
                      <Button variant="contained" color="error" type="button" onClick={() => deleteBrand(index)} sx={{ height: '30px', minWidth: '30px', marginTop: '4px', padding: '6px 10px' }}><AiOutlineClose /></Button>
                    </Grid>
                  </Grid>
                </li>
              )
            })}
          </ul>
        )}
        <Grid container sx={userStyle.gridcontainer}>
          <Grid sx={{ display: 'flex' }}>
            <Button sx={userStyle.buttonadd} type="submit" onClick={addCateSubmit}>SAVE</Button>
            <Link to="/product/category/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
          </Grid>
        </Grid>
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
function Catcreate() {
  return (
    <Box>
      <Navbar /><br /><br /><br /><br /><br />
      <Box sx={{ width: '100%', overflowX: 'hidden' }}>
        <Box component="main" className='content'>
          <Categorycreate /><br /><br /><br /><br />
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}

export default Catcreate;