import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Grid, Typography, FormControl, InputLabel, OutlinedInput, TextareaAutosize, Dialog, DialogContent, DialogActions, } from '@mui/material';
import { userStyle } from '../../PageStyle';
import { FaPlus } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Headtitle from '../../../components/header/Headtitle';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

function Categoryeditlist() {

  const [isCategory, setIsCategory] = useState({});
  const [subCategories, setSubCategories] = useState([]);
  const { auth, setngs } = useContext(AuthContext);
  const [subStringVal, setSubStringVal] = useState("");
  const [allCategories, setAllCategories] = useState([])
  const [categoryNames, setcategoryNames] = useState([]);
  const id = useParams().id;

  //popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState()
  const handleClickOpen = () => { setIsErrorOpen(true); };
  const handleClosec = () => { setIsErrorOpen(false); };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

  // edit check
  const [overallCategory, setOverAlCategory] = useState("")
  const [getCategory, setGetCategory] = useState("")
  const [EditCategoryCount, setEditCategoryCount] = useState(0)

  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => { setIsErrorOpenpop(true); };
  const handleCloseerrpop = () => { setIsErrorOpenpop(false); };

  // Category
  const fetchAllCategory = async () => {
    try {
      let res = await axios.post(SERVICE.CATEGORIES, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });
      let arr = [];
      res?.data?.categories?.map((data, index) => {
        data.subcategories.filter((t) => {
          arr.push(t.subcategryname);
          return true;
        });
        return true;
      });
      setAllCategories(arr);
      setcategoryNames(res?.data?.categories?.filter(item => item._id !== isCategory._id));
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  const [setproductsData, setGetproductsData] = useState([])

  // fetch particular id value
  const fetchCategory = async () => {
    try {
      let req = await axios.get(`${SERVICE.CATEGORIES_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      setIsCategory(req?.data?.scategory);
      setSubCategories(req?.data?.scategory?.subcategories);
      getEditId(req?.data?.scategory)
      setGetCategory(req?.data?.scategory)
      setGetproductsData(req?.data?.scategory.products)
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  }

  useEffect(
    () => {
      fetchAllCategory()
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


  const getEditId = async (value) => {


    try {
      let res = await axios.post(SERVICE.EDIT_CATEGORY, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid),
        category: String(value.categoryname),
        categoryshotname: String(value.categoryshotname),
      });

      setEditCategoryCount(res?.data?.count);
      setOverAlCategory(`The ${value.categoryname} or ${value.categoryshotname} is linked in ${res?.data?.categrpedit?.length > 0 ? "CategoryGroup " : ""}
        ${res?.data?.discountEdit?.length > 0 ? "Discount  " : ""} ${res?.data?.productEdit?.length > 0 ? "Product  " : ""} ${res?.data?.stock?.length > 0 ? "Stock  " : ""}
        whether you want to do changes ..??`
      )
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
      let res = await axios.post(SERVICE.EDIT_CATEGORY, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid),
        category: String(getCategory.categoryname),
        categoryshotname: String(getCategory.categoryshotname),
      });


      editOveAllDepartment(res?.data?.productEdit, res?.data?.discountEdit, res?.data?.categrpedit, res?.data?.stock)
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

  const editOveAllDepartment = async (product, discount, categrygrp, stock) => {
    try {
      if (product.length > 0) {
        let result = product.map((data, index) => {
          let request = axios.put(`${SERVICE.PRODUCT_SINGLE}/${data._id}`, {
            headers: {
              'Authorization': `Bearer ${auth.APIToken}`
            },
            category: String(isCategory.categoryname),
            categoryshotname: String(isCategory.categoryshotname)
          });
        })
      }
      if (discount.length > 0) {
        let result = discount.map((data, index) => {
          let request = axios.put(`${SERVICE.DISCOUNT_SINGLE}/${data._id}`, {
            headers: {
              'Authorization': `Bearer ${auth.APIToken}`
            },
            category: String(isCategory.categoryname),
          });
        })
      }
      if (categrygrp.length > 0) {
        let res2 = categrygrp.map((data) => {
          if (data.categories.categoryname == getCategory) {
            var res1 = { ...data.categories, categoryname: isCategory.categoryname };
          }
          let request = axios.put(`${SERVICE.GROUP_SINGLE}/${data._id}`, {
            headers: {
              'Authorization': `Bearer ${auth.APIToken}`
            },
            categories: res1
          });
        })
      }
      if (stock.length > 0) {
        let answ = stock.forEach((d, i) => {
          const updatedTodos = d.products.map(data => {
            if (data.category === getCategory.categoryshotname) {
              return { ...data, category: isCategory.categoryshotname }
            }
            return data
          });
          let res = axios.put(`${SERVICE.STOCK_SINGLE}/${d._id}`, {
            headers: {
              'Authorization': `Bearer ${auth.APIToken}`
            },
            products: updatedTodos,
          });
        });
      }
    }
    catch (err) {
    
      const messages = err?.response?.data?.message
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  }

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

      setSubStringVal(postfixLength);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
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
    setSubCategories([...subCategories, { subcategryname: "", subcategrycode: postfixLength, _id: uniqueId, newAdded: true, subcategryshotname: "" }]);

    let value = subCategories.map(data => data.subcategryname);

    const hasCommonValue = (allCategories, value) => {
      return allCategories.some(item => value.includes(item));
    };

    const result = hasCommonValue(allCategories, value);

    if (result) {
      setShowAlert("Sub Category Name Already Exists!");
      handleClickOpen();
    }
  }

  function multiSubCategoriesInputs(referenceId, reference, inputvalue) {
    if (reference == "subCategoryName") {
      const isDuplicate = subCategories.some((item, index) => index !== referenceId && item.subcategryname === inputvalue);

      if (isDuplicate) {
        setShowAlert("Sub Category Name Already Exists!");
        handleClickOpen();
        return;
      }

      let subCategoryNameInput = subCategories.map((value, index) => {
        if (referenceId == value._id) {
          let codeslicespace = inputvalue.replace(/[^a-zA-Z0-9]/g, '');
          let numcode = codeslicespace.slice(0, 6);
          let numcodeone = codeslicespace.slice(0, 4);
          let numsubcode = value.subcategrycode.slice(-4);
          return { ...value, subcategryname: inputvalue, subcategryshotname: numcode.toUpperCase(), subcategrycode: numcodeone.toUpperCase() + numsubcode }
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
          let codeslicespace = inputvalue.replace(/[^a-zA-Z0-9]/g, '');
          let todosubshotname = codeslicespace.slice(0, 6).toUpperCase();

          return { ...value, subcategryshotname: todosubshotname, }
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
        let subcode = data.subcategrycode.slice(-4)
        let codeslicespace = data.subcategryname.replace(/[^a-zA-Z0-9]/g, '');
        let subslice = codeslicespace.slice(0, 4);
        let presubcode = data.subcategryname == "" ? "" : subslice.slice(0, 4).toUpperCase();
        let prefixLength = Number(subcode) - 1;
        let prefixString = String(prefixLength);
        let postfixLength = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ? `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString

        return { ...data, subcategrycode: presubcode + postfixLength }
      } else {
        return data;
      }
    })
    setSubCategories(resultData);
  }
  if (subCategories.length == 0) {
    addSubcategory()
  }

  let backPage = useNavigate();

  //get all values in one row so that spread sub category and brand
  const idRemovedNew = () => {
    const idRemovedSubCategory = subCategories.map((value) => {
      if (value.newAdded) {
        return { subcategryname: value.subcategryname, subcategrycode: value.subcategrycode, subcategryshotname: value.subcategryshotname }
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

    let codeslicespace = isCategory.categoryname?.replace(/[^a-zA-Z0-9]/g, '');
    let resultshotname = codeslicespace?.slice(0, 6)?.toUpperCase();


    try {
      let res = await axios.put(`${SERVICE.CATEGORIES_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        categoryname: String(isCategory.categoryname),
        categoryshotname: String(isCategory.categoryshotname == "" ? resultshotname : isCategory.categoryshotname),
        categorycode: String(isCategory.categorycode),
        categorydescription: String(isCategory.categorydescription),
        subcategories: addDefaultValueSubCate,

      });
      setIsCategory(res.data);
      await getOverAlldepUpdate();
      toast.success(res.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
      backPage("/product/category/list");
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
    const isNameMatch = categoryNames.some(item => item.categoryname?.toLowerCase() === (isCategory.categoryname)?.toLowerCase());
    const isShotNameMatch = categoryNames.some(item => item.categoryshotname?.toLowerCase() === (isCategory.categoryshotname)?.toLowerCase());

    if (isCategory.categoryname == "") {
      setShowAlert("Please enter category name!");
      handleClickOpen();

    } else if (isCategory.categorycode == "") {
      setShowAlert("Please enter category code!");
      handleClickOpen();

    }
    else if (isNameMatch) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Name already exits!"}
          </p>
        </>
      );
      handleClickOpenerrpop();
    }
    else if (isShotNameMatch) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Category Shot Name already exits!"}
          </p>
        </>
      );
      handleClickOpenerrpop();
    }
    else if (isCategory.categoryname != getCategory.categoryname || isCategory.categoryshotname != getCategory.categoryshotname && EditCategoryCount > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {overallCategory}
          </p>
        </>
      )
      handleClickOpenerrpop();
    }
    else {
      idRemovedNew();
    }

  }

  const handleShotNameLength = (e) => {
    if (e.length > 6) {
      setShowAlert("Category Shot Name can't more than 6 characters!")
      handleClickOpen();
      let codeslicespace = e.replace(/[^a-zA-Z0-9]/g, '');
      let num = codeslicespace.slice(0, 6);
      setIsCategory({ ...isCategory, categoryShotName: num })
    }
  }

  const handleCheckid = (e) => {
    let codeslicespace = e.replace(/[^a-zA-Z0-9]/g, '');
    let result = codeslicespace.slice(0, 6).toUpperCase();
    let resultone = codeslicespace.slice(0, 4).toUpperCase();
    let resultcode = isCategory?.categorycode.slice(-4);

    setIsCategory({ ...isCategory, categoryname: e, categoryshotname: result, categorycode: resultone + resultcode });

  }

  return (
    <Box>
      <Headtitle title={'Edit Category'} />
      {/* Form Start */}
      <form onSubmit={handleSubmit}>
        <Typography sx={userStyle.HeaderText}>Edit Category</Typography>
        <Box sx={userStyle.container}>
          <Grid container spacing={3} sx={userStyle.textInput}>
            <Grid item md={12} sm={12} xs={12}>
              <InputLabel htmlFor="component-outlined">Category name <b style={{ color: 'red', }}>*</b></InputLabel>
              <FormControl size="small" fullWidth>
                <OutlinedInput
                  id="component-outlined"
                  value={isCategory.categoryname}
                  onChange={(e) => { handleCheckid(e.target.value) }}
                  type="text"
                  name="categoryname"
                />
              </FormControl>
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <InputLabel htmlFor="component-outlined">Category Short Name <b style={{ color: 'red', }}>*</b></InputLabel>
              <FormControl size="small" fullWidth>
                <OutlinedInput
                  id="component-outlined"
                  value={isCategory.categoryshotname}
                  onChange={(e) => { setIsCategory({ ...isCategory, categoryshotname: e.target.value.toUpperCase() }); handleShotNameLength(e.target.value) }}
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
                  value={isCategory.categorycode}
                />
              </FormControl>
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <InputLabel id="demo-select-small">Description</InputLabel>
              <FormControl size="small" fullWidth >
                <TextareaAutosize aria-label="minimum height" minRows={3} style={{ border: '1px solid #4a7bf7' }}
                  value={isCategory.categorydescription}
                  onChange={(e) => { setIsCategory({ ...isCategory, categorydescription: e.target.value }) }}
                  name="categorydescription"
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
                          <InputLabel htmlFor="component-outlined">Sub Category Name</InputLabel>
                          <FormControl size="small" fullWidth>
                            <OutlinedInput
                              id="component-outlined"
                              value={item.subcategryname}
                              onChange={(e) => multiSubCategoriesInputs(item._id, "subCategoryName", e.target.value)}
                              type="text"
                              name="categoryname"
                              placeholder="Sub Category Name"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item sm={12} xs={12} md={3.5} lg={3.5}>
                          <InputLabel htmlFor="component-outlined">Sub Category Short Name</InputLabel>
                          <FormControl size="small" fullWidth>
                            <OutlinedInput
                              id="component-outlined"
                              value={item.subcategryshotname}
                              onChange={(e) => multiSubCategoriesInputs(index, "subCategoryShotName", e.target.value)}
                              type="text"
                              name="categoryname"
                              placeholder="Sub Category Short Name"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item sm={12} xs={12} md={3.5} lg={3.5}>
                          <InputLabel htmlFor="component-outlined">Sub Category Code</InputLabel>
                          <FormControl size="small" fullWidth>
                            <OutlinedInput
                              id="component-outlined"
                              value={item.subcategrycode}
                              name="categoryname"
                              placeholder="Sub Category Code"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item sm={1} xs={1} md={1.5} lg={1.5} sx={{ display: 'flex' }}>
                          {index === subCategories.length - 1 ? <Button variant="contained" color="success" type="button" onClick={() => addSubcategory()} sx={userStyle.categoryadd}><FaPlus /></Button> : null}&ensp;
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
            <Link to="/product/category/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
          </Grid>
        </Box>
      </form>
      {/* Form End */}
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
      {/* Edit dialog */}
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
              sx={userStyle.buttoncancel}
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

const Categoryedit = () => {
  return (
    <>
     <Categoryeditlist /><br /><br /><br /><br />
            <Footer />
    </>
  );
}
export default Categoryedit;