import React, { useEffect, useState, useContext } from 'react';
import { DialogActions, Dialog, DialogContent, Box, Grid, FormControl, InputLabel, OutlinedInput, Typography, FormGroup, FormControlLabel, Checkbox, Button } from '@mui/material';
import { userStyle } from '../../../PageStyle';
import Footer from '../../../../components/footer/Footer';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Headtitle from '../../../../components/header/Headtitle';

import { toast } from 'react-toastify';
import { SERVICE } from '../../../../services/Baseservice';
import { AuthContext, UserRoleAccessContext } from '../../../../context/Appcontext';

const Edit = () => {

  const [isTax, setIsTax] = useState([]);
  const [taxRate, setTaxRate] = useState({});
  const { auth, setngs } = useContext(AuthContext);
  const { setAllTaxratesGroup } = useContext(UserRoleAccessContext)

  // check edit
  const [overAllTax, setOverAllTax] = useState("");
  const [getTax, setGetTax] = useState("");
  const [EditTaxCount, setEditTaxCount] = useState("");

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => { setIsErrorOpenpop(true); };
  const handleCloseerrpop = () => { setIsErrorOpenpop(false); };

  //popup purchaseel
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState()
  const handleClickOpenAlert = () => { setIsErrorOpen(true); };
  const handleCloseAlert = () => { setIsErrorOpen(false); };

  const fetchTax = async () => {
    try {
      let res = await axios.post(SERVICE.TAXRATE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });
      setIsTax(res.data.taxrates);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

  useEffect(() => {
    fetchTax();
  }, [])

  const id = useParams().id;

  // Get Datas
  const fetchHandler = async () => {
    try {
      let response = await axios.get(`${SERVICE.TAXRATE_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      })
      setTaxRate(response?.data?.staxrate)
      getOverallEditSection(response?.data?.staxrate.taxname + "@" + response?.data?.staxrate.taxrate)
      setGetTax(response?.data?.staxrate.taxname + "@" + response?.data?.staxrate.taxrate)

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
    fetchHandler()
  }, [id]);

  useEffect(
    () => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener('beforeunload', beforeUnloadHandler);
        return () => {
            window.removeEventListener('beforeunload', beforeUnloadHandler);
        };
    }, []);

    

  const fetchsTaxgroupfalse = async () => {
    try {
      let res = await axios.post(SERVICE.TAXRATEGROUPFALSE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });

      setAllTaxratesGroup(res?.data?.taxratesgroupforgroupfalse)
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };
  const fetchsTaxgrouphsn = async () => {
    try {
      let res = await axios.post(SERVICE.TAXRATEGROUPHSN, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid)
      });

      setAllTaxratesGroup(res?.data?.taxratesforgrouphsnfalse)
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

  //overall edit section for all pages 
  const getOverallEditSection = async (e) => {
    try {
      let res = await axios.post(SERVICE.TAXRATE_EDIT, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid),
        tax: String(e),
      });
      setEditTaxCount(res?.data?.count);
      setOverAllTax(`The ${e} is linked in ${res?.data?.product?.length > 0 ? "Product ," : ""} 
       ${res?.data?.purchase?.length > 0 ? "Purchase ," : ""}
       ${res?.data?.purchasereturn?.length > 0 ? "Purchase Return ," : ""}
       ${res?.data?.expense?.length > 0 ? "Expense ," : ""}
       ${res?.data?.draft?.length > 0 ? "Draft ," : ""} 
       ${res?.data?.quotation?.length > 0 ? "Quotation ," : ""} whether you want to do changes ..??`)
    }
    catch (err) {
      const messages = err?.response?.data?.message
      if (messages) {
        setShowAlertpop(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
            <p style={{ fontSize: '20px', fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerrpop();
      }
      else {
        setShowAlertpop(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
            <p style={{ fontSize: '20px', fontWeight: 900 }}>{"something went wrong!"}</p>
          </>
        );
        handleClickOpenerrpop();
      }
    }
  };

  //overall edit section for all pages 
  const getOverallEditSectionUpdate = async () => {
    try {
      let res = await axios.post(SERVICE.TAXRATE_EDIT, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid),
        tax: getTax,
      });
      sendEditRequestOverall(res?.data?.product, res?.data?.purchase, res?.data?.purchasereturn,
        res?.data?.expense, res?.data?.draft, res?.data?.quotation)
    }
    catch (err) {
      const messages = err?.response?.data?.message
      if (messages) {
        setShowAlertpop(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
            <p style={{ fontSize: '20px', fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerrpop();
      }
      else {
        setShowAlertpop(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
            <p style={{ fontSize: '20px', fontWeight: 900 }}>{"something went wrong!"}</p>
          </>
        );
        handleClickOpenerrpop();
      }
    }
  };

  const sendEditRequestOverall = async (product, purchase, purchasereturn, expense, draft, quotation) => {

    try {
      if (product?.length > 0) {
        let answ = product.map((d, i) => {
          let res = axios.put(`${SERVICE.PRODUCT_SINGLE}/${d._id}`, {
            headers: {
              'Authorization': `Bearer ${auth.APIToken}`
            },
            applicabletax: String(taxRate.taxname + "@" + taxRate.taxrate),
          });
        })
      }
      if (purchase?.length > 0) {
        let answ = purchase.map((d, i) => {
          const updatedTodos = d.products.map(data => {
            if (data.purchasetax === getTax
            ) {
              return { ...data, purchasetax: taxRate.taxname + "@" + taxRate.taxrate };
            }
          });
          let res = axios.put(`${SERVICE.PURCHASE_SINGLE}/${d._id}`, {
            headers: {
              'Authorization': `Bearer ${auth.APIToken}`
            },
            products: updatedTodos,
          });
        })
      }
      if (purchasereturn?.length > 0) {
        let answ = purchasereturn.map((d, i) => {
          const updatedTodos = d.products.map(data => {
            if (data.purchasetax === getTax
            ) {
              return { ...data, purchasetax: taxRate.taxname + "@" + taxRate.taxrate };
            }
          });
          let res = axios.put(`${SERVICE.PURCHASE_RETURN_SINGLE}/${d._id}`, {
            headers: {
              'Authorization': `Bearer ${auth.APIToken}`
            },
            products: updatedTodos,
          });
        })
      }

      if (expense?.length > 0) {
        let answ = expense.map((d, i) => {
          let res = axios.put(`${SERVICE.EXPENSE_SINGLE}/${d._id}`, {
            headers: {
              'Authorization': `Bearer ${auth.APIToken}`
            },
            exptax: String(taxRate.taxname + "@" + taxRate.taxrate),
          });
        })
      }
      if (draft?.length > 0) {
        let answ = draft.map((d, i) => {
          const updatedTodos = d.goods.map(data => {
            if (data.applicabletax === getTax
            ) {
              return { ...data, applicabletax: taxRate.taxname + "@" + taxRate.taxrate };
            }
          });
          let res = axios.put(`${SERVICE.DRAFT_SINGLE}/${d._id}`, {
            headers: {
              'Authorization': `Bearer ${auth.APIToken}`
            },
            goods: updatedTodos,
          });
        })
      }
      if (quotation?.length > 0) {
        let answ = quotation.map((d, i) => {
          const updatedTodos = d.goods.map(data => {
            if (data.applicabletax === getTax
            ) {
              return { ...data, applicabletax: taxRate.taxname + "@" + taxRate.taxrate };
            }
          });
          let res = axios.put(`${SERVICE.QUOTATION_SINGLE}/${d._id}`, {
            headers: {
              'Authorization': `Bearer ${auth.APIToken}`
            },
            goods: updatedTodos,
          });
        })
      }
    } catch (err) {
      const messages = err?.response?.data?.message
      if (messages) {
        setShowAlertpop(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
            <p style={{ fontSize: '20px', fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerrpop();
      }
      else {
        setShowAlertpop(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
            <p style={{ fontSize: '20px', fontWeight: 900 }}>{"something 8 went wrong!"}</p>
          </>
        );
        handleClickOpenerrpop();
      }
    }
  };

  const backLPage = useNavigate();

  // Edit Datas
  const sendRequest = async () => {
    try {
      let response = await axios.put(`${SERVICE.TAXRATE_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        taxname: String(taxRate.taxname),
        taxrate: String(taxRate.taxrate),
        taxtype: String(taxRate.taxtype),
        fortaxgonly: Boolean(taxRate.fortaxgonly),
      });
      setTaxRate(response.data);
      backLPage('/settings/taxrate/list')
      toast.success(response.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
      await getOverallEditSectionUpdate()
      await fetchsTaxgroupfalse();
      await fetchsTaxgrouphsn();

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
    const isNameMatch = isTax.some(item => item.taxname.toLowerCase() === (taxRate.taxname).toLowerCase());

    if (taxRate.taxname == "") {
      setShowAlert("Please enter tax name!");
      handleClickOpenAlert();
    }
    else if (taxRate.taxrate == "") {
      setShowAlert("Please enter taxrate!");
      handleClickOpenAlert();
    }
    else if (isNameMatch) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Tax name already exits!"}
          </p>
        </>
      );
      handleClickOpenerrpop();
    }
    else if (taxRate.taxname + "@" + taxRate.taxrate != getTax && EditTaxCount > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}> {overAllTax} </p>
        </>
      );
      handleClickOpenerrpop()
    } else {
      sendRequest();
    }
  }

  return (
    <Box>
      <Headtitle title={'Taxrate - Edit'} />
      <form onSubmit={handleSubmit}>
        <Typography sx={userStyle.HeaderText}>Edit Tax Rate</Typography>
        <Box sx={userStyle.container}>
          <Grid container spacing={3} >
            <Grid item sm={12} md={6}>
              <InputLabel htmlFor="component-outlined">Name<b style={{ color: 'red' }}>*</b></InputLabel>
              <FormControl size="small" fullWidth >
                <OutlinedInput
                  id="component-outlined"
                  value={taxRate.taxname}
                  onChange={(e) => { setTaxRate({ ...taxRate, taxname: e.target.value }) }}
                  type='text'
                  name="taxname"
                />
              </FormControl>
            </Grid>
            <Grid item sm={12} md={6}>
              <InputLabel htmlFor="component-outlined">Tax Rate%<b style={{ color: 'red' }}>*</b></InputLabel>
              <Grid sx={{ display: "flex" }}>
                <FormControl size="small" fullWidth >
                  <OutlinedInput
                    id="component-outlined"
                    value={taxRate.taxrate}
                    onChange={(e) => { setTaxRate({ ...taxRate, taxrate: e.target.value }) }}
                    type='number'
                    name="taxRate"
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid item sm={12} md={12}>
              <input
                value={taxRate.taxtype}
                label="Tax Rate%"
                type='hidden'
                name="taxtype"
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item sm={12} md={12}>
              <FormGroup>
                <FormControlLabel control={<Checkbox
                  checked={Boolean(taxRate.fortaxgonly)}
                  onClick={(e) => { setTaxRate({ ...taxRate, fortaxgonly: !taxRate.fortaxgonly }) }}
                />} label={<div>For tax group only </div>}
                  name="fortaxgonly"
                />
              </FormGroup> <br />
            </Grid>
          </Grid>
        </Box>
        <Grid container sx={userStyle.gridcontainer}>
          <Grid >
            <Link to="/settings/taxrate/list" ><Button sx={userStyle.buttoncancel} >CANCEL</Button></Link>
            <Button sx={userStyle.buttonadd} type='submit'>UPDATE</Button>
          </Grid>
        </Grid>
      </form >
      <Dialog
        open={isErrorOpen}
        onClose={handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
          <Typography variant="h6" >{showAlert}</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={handleCloseAlert}>ok</Button>
        </DialogActions>
      </Dialog>

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
              sendRequest();
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
    </Box >
  );
}
const Taxrateedit = () => {
  return (
    <>
       <Edit /><br /><br /><br /><br />
            <Footer />
    </>
  );
}

export default Taxrateedit;