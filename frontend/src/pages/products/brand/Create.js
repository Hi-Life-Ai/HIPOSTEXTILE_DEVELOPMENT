import React, { useState, useContext, useEffect } from 'react';
import { Box, Button, Grid, FormControl, OutlinedInput, InputLabel, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import { userStyle } from '../../PageStyle';
import { FaPlus } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Footer from '../../../components/footer/Footer';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';

function Categorycreate() {

  let newval = "0001";
  let newvalbrand = "0001";

  const { auth, setngs } = useContext(AuthContext);
  const [categoryForm, setCategoryForm] = useState({ brandname: "", brandshortname: "", brandcode: newval });

  const [firstSubCate, setFirstSubCate] = useState({ subbrandname: "", subbrandshotname: "", subbrandcode: newvalbrand });
  const [isFirstSubCateView, setIsFirstSubCateView] = useState(false)
  const [isRemovefirstSubcategory, setIsRemovefirstSubcategory] = useState(false)
  const [categoryCode, setCategoryCode] = useState([]);
  const [categoryNames, setcategoryNames] = useState([]);
  const [categoryShotName, setcategoryShotName] = useState([]);
  const [isSubCategory, setIsSubCategory] = useState([])
  const [subStringVal, setSubStringVal] = useState("0001");
  const [allBrands, setAllBrands] = useState([])
  const [brandNames, setbrandNames] = useState([]);

  //popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState()
  const handleClickOpen = () => { setIsErrorOpen(true); };
  const handleClose = () => { setIsErrorOpen(false); };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

  // Brand
  const fetchBrands = async () => {
    try {
      let res = await axios.post(SERVICE.BRAND, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });
      let arr = [];
      res?.data?.brands?.map((data, index) => {
        data.subbrands.filter((t) => {

          arr.push(t.subbrandname);
          return true;
        });
        return true;
      });
      setAllBrands(arr);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  useEffect(() => {
    fetchBrands()
  }, [])

   // brand
  const handleClear = () => {
    setCategoryForm({
      brandname: "", brandshortname: "", brandcode: categoryForm.brandcode.slice(4)
    });
    setFirstSubCate({subbrandname: "", subbrandshotname: "", subbrandcode: firstSubCate.subbrandcode.slice(4)})
    setIsSubCategory([])
  }

  const backLPage = useNavigate();

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
      setCategoryForm(res.data);
      handleClose();
      toast.success(res.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
      backLPage('/product/brand/list');
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

  const sendAnotherRequest = async () => {

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
      await fetchData();
      await fetchCategorySubcategory();

      setIsSubCategory([]);
      handleClose();
      toast.success(res.data.message, {
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

      let nameresult = res?.data?.brands.map((data, index) => {
        return data.brandname
      })
      let shotnameresult = res?.data?.brands.map((data, index) => {
        return data.brandshortname
      })
      let coderesult = res?.data?.brands.map((data, index) => {
        return data.brandcode
      })
      setCategoryCode(coderesult);
      setcategoryNames(nameresult);
      setcategoryShotName(shotnameresult)
      setbrandNames(res?.data?.brands);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      }
      // else {
      //   toast.error("Something went wrong!")
      // }
    }
  };

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
      //   toast.error("Something went wrong!")
      // }
    }
  }

  useEffect(() => {
    fetchData()
  }, [])


  useEffect(
    () => {
      fetchCategorySubcategory();
    }, [])

    useEffect(
      () => {
          const beforeUnloadHandler = (event) => handleBeforeUnload(event);
          window.addEventListener('beforeunload', beforeUnloadHandler);
          return () => {
              window.removeEventListener('beforeunload', beforeUnloadHandler);
          };
      }, []);


  //sub category add new item
  function addSubcategory() {
    let prefixLength = Number(subStringVal) + 1;
    let prefixString = String(prefixLength);
    let postfixLength = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ? `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString
    setSubStringVal(postfixLength);

    setIsSubCategory([...isSubCategory, { subbrandname: "", subbrandcode: postfixLength, subbrandshotname: "" }]);

    let value = isSubCategory.map(data => data.subbrandname);

    const hasCommonValue = (allBrands, value) => {
      return allBrands.some(item => value.includes(item));
    };

    const result = hasCommonValue(allBrands, value);
    const resultone = value.includes(firstSubCate.subbrandname)

    if (result || resultone) {
      setShowAlert("Sub Brand name Already Exists");
      handleClickOpen();
      deleteSubCategory()
    }
  }

  function multiSubCategoriesInputs(referenceIndex, reference, inputvalue) {

    if (reference == "subCategoryName") {
      const isDuplicate = isSubCategory.some((item, index) => index !== referenceIndex && item.subbrandname === inputvalue);

      if (isDuplicate) {
        setShowAlert("Sub Brand Name Already Exists!");
        handleClickOpen();
        return;
      }
      let subCategoryNameInput = isSubCategory.map((value, index) => {
        if (referenceIndex == index) {
          let codeslicespace = inputvalue.replace(/[^a-zA-Z0-9]/g, '');
          let numcode = codeslicespace.slice(0, 6);
          let numcodeone = codeslicespace.slice(0, 4);
          let numsubcode = value.subbrandcode.slice(-4);

          return { ...value, subbrandname: inputvalue, subbrandshotname: numcode.toUpperCase(), subbrandcode: numcodeone.toUpperCase() + numsubcode }
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

  const addCateSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = brandNames.some(item => item.brandname.toLowerCase() === (categoryForm.brandname).toLowerCase());
    const isShotNameMatch = brandNames.some(item => item.brandshortname.toLowerCase() === (categoryForm.brandshortname).toLowerCase());
    const isCodeMatch = brandNames.some(item => item.brandcode.toLowerCase() === (categoryForm.brandcode).toLowerCase());

    if (categoryForm.brandname == "") {
      setShowAlert("Please enter brand name!");
      handleClickOpen();
    }
    else if (isNameMatch) {
      setShowAlert("Name Already Exists");
      handleClickOpen();
    }
    else if (isShotNameMatch) {
      setShowAlert("Brand Short Name Already Exists");
      handleClickOpen();
    }

    else if (isCodeMatch) {
      setShowAlert("Code Already Exists");
      handleClickOpen();
    } else {
      sendRequest();
    }
  }

  const handleAnotherSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = brandNames.some(item => item.brandname.toLowerCase() === (categoryForm.brandname).toLowerCase());
    const isShotNameMatch = brandNames.some(item => item.brandshortname.toLowerCase() === (categoryForm.brandshortname).toLowerCase());
    const isCodeMatch = brandNames.some(item => item.brandcode.toLowerCase() === (categoryForm.brandcode).toLowerCase());

    if (categoryForm.brandname == "") {
      setShowAlert("Please enter brand name!");
      handleClickOpen();
    }
    else if (isNameMatch) {
      setShowAlert("Name Already Exists");
      handleClickOpen();
    } else if (isShotNameMatch) {
      setShowAlert("Brand Short Name Already Exists");
      handleClickOpen();
    }
    else if (isCodeMatch) {
      setShowAlert("Code Already Exists");
      handleClickOpen();
    } else {
      sendAnotherRequest();
    }
  }

  const handleIdcheck = (e) => {
    let codeslicespace = e.replace(/[^a-zA-Z0-9]/g, '');
    let result = codeslicespace.slice(0, 6).toUpperCase();
    let resultone = codeslicespace.slice(0, 4).toUpperCase();
    let resultcode = categoryForm.brandcode.slice(-4);

    setCategoryForm({ ...categoryForm, brandname: e, brandshortname: result, brandcode: resultone + resultcode, });

  }

  const handleSubIdCheck = (e) => {

    let codeslicespace = e.replace(/[^a-zA-Z0-9]/g, '');
    let result = codeslicespace.slice(0, 6).toUpperCase();
    let resultone = codeslicespace.slice(0, 4).toUpperCase();
    let resultcode = firstSubCate.subbrandcode.slice(-4);

    setFirstSubCate({ ...firstSubCate, subbrandname: e, subbrandshotname: result, subbrandcode: resultone + resultcode, });
  }

  return (
    <Box>
      <Headtitle title={'Add Brand'} />
      <Typography sx={userStyle.HeaderText}>Add Brand</Typography>
      {/* content start */}
      <Box sx={userStyle.container}>
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
        <Grid container sx={userStyle.gridcontainer}>
          <Grid sx={{ display: 'flex' }}>
            <Button sx={userStyle.buttonadd} type="submit" onClick={addCateSubmit}>SAVE</Button>
            <Button sx={userStyle.buttonadd} onClick={handleAnotherSubmit} >SAVE AND ADD ANOTHER</Button>
            <Link to="/product/brand/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
            <Button sx={userStyle.buttoncancel} onClick={handleClear}>CLEAR</Button>
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
function Brandcreate() {
  return (
   <>
    <Categorycreate /><br /><br /><br /><br />
          <Footer />
   </>
  );
}

export default Brandcreate;