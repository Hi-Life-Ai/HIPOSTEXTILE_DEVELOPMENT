import React, { useState, useEffect, useContext } from 'react';
import { Grid, Typography, Select, TextField, Box, FormControl, InputLabel, Button, MenuItem, Dialog, DialogContent, DialogActions } from '@mui/material';
import { dashboardstyle } from './Dashboardstyle';
import { SmartScreenSharp, DoDisturbOnSharp, PriorityHighSharp, PrivacyTipSharp, ShoppingCart } from '@mui/icons-material';
import Dashbrdchart from './Dashbrdchart';
import Dashpurbarchart from './Dashpurbarchart';
import Dashpiechart from './Dashpiechart';
import Dashstockalert from './Dashstockalert';
import Dashtopselling from './Dashtopselling';
import Dashrecentsale from './Dashrecentsale';
import Dashcuspie from './Dashcuspie';
import axios from 'axios';
import Headtitle from '../components/header/Headtitle';
import { UserRoleAccessContext } from '../context/Appcontext';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { SERVICE } from '../services/Baseservice';
import moment from "moment";
import { toast } from "react-toastify";
import { AuthContext } from '../context/Appcontext';

const Dashboard = () => {

  const [purchases, setPurchases] = useState([]);
  const [purchasesreturn, setPurchasesreturn] = useState([]);
  const [pos, setPos] = useState([]);
  const [expenses, setExpenses] = useState();
  const [isLocations, setIsLocations] = useState("");
  const [isLocationChange, setIsLocationChange] = useState(false)
  const [busilocations, setBusilocations] = useState();

  const { isUserRoleAccess, setAllPos, setIsActiveLocations, setAllLocations, setAllPurchases, isUserRoleCompare } = useContext(UserRoleAccessContext);
  const { auth, setngs } = useContext(AuthContext);
  
  //popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState()
  const handleOpen = () => {
    setIsErrorOpen(true);
  };
  const handleClose = () => {
    setIsErrorOpen(false);
  };
  // Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  const [dateFilter, setDateFilter] = useState({
    startdate: "", enddate: "",
  })

  useEffect(
    () => {
      fetchTodayPurchase();
      fetchTodaySales();
      fetchTodayPurchasertn();
      fetchTodayExpense();
    }, []
  )

  useEffect(
    () => {
      fetchAllLocation();
      fetchAllPurchase();
      fetchAllSales();
    }, []
  )

  //  fetch location data
  const fetchAllLocation = async () => {
    try {
      let res = await axios.post(SERVICE.BUSINESS_LOCATION, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
      },
        businessid:String(setngs.businessid),
        role:String(isUserRoleAccess.role),
        userassignedlocation:[isUserRoleAccess.businesslocation]
      });
      setBusilocations(res?.data?.businesslocationsactive);
      setAllLocations(res?.data?.businesslocations);
      setIsActiveLocations(res?.data?.businesslocationsactive)
    } catch (err) {
      const messages = err?.response?.data?.message;
      if(messages) {
          toast.error(messages);
      }else{
          toast.error("Something went wrong!")
      }
    }
  };

  //  fetch purchases data
  const fetchAllPurchase = async () => {
    try {
      let res = await axios.post(SERVICE.PURCHASE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid:String(setngs.businessid),
        role:String(isUserRoleAccess.role),
        userassignedlocation:[isUserRoleAccess.businesslocation]
      });
      setAllPurchases(res?.data?.purchases)
    } catch (err) {
      const messages = err?.response?.data?.message;
      if(messages) {
          toast.error(messages);
      }else{
          toast.error("Something went wrong!")
      }
    }
  };

  //  fetch sales data
  const fetchAllSales = async () => {
    try {
      let res = await axios.post(SERVICE.POS, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
      },
        businessid:String(setngs.businessid),
        role:String(isUserRoleAccess.role),
        userassignedlocation:[isUserRoleAccess.businesslocation]
      });
      setAllPos(res?.data?.pos1)
    } catch (err) {
      const messages = err?.response?.data?.message;
      if(messages) {
          toast.error(messages);
      }else{
          toast.error("Something went wrong!")
      }
    }
  };

  //get today purchases data
  const fetchTodayPurchase = async () => {
    try {
      let res = await axios.post(SERVICE.PURCHASE_TODAY, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
      },
        businessid: String(setngs.businessid),
        role: String(isUserRoleAccess.role),
        userassignedlocation: [isUserRoleAccess.businesslocation]
      });

      setPurchases(res?.data?.todaypurchase);

    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

  //get today sales
  const fetchTodaySales = async () => {
    try {
      let res = await axios.post(SERVICE.POS_TODAY, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
      },
        businessid: String(setngs.businessid),
        role: String(isUserRoleAccess.role),
        userassignedlocation: [isUserRoleAccess.businesslocation]
      });
      setPos(res?.data?.pos1)
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

  //get today purchase rtn
  const fetchTodayPurchasertn = async () => {
    try {
      let res = await axios.post(SERVICE.PURCHASERETURN_TODAY, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid),
        role: String(isUserRoleAccess.role),
        userassignedlocation: [isUserRoleAccess.businesslocation]
      });

      setPurchasesreturn(res?.data?.todaypurchasertn);

    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

  //get today expense
  const fetchTodayExpense = async () => {
    try {
      let res = await axios.post(SERVICE.EXPENSE_TODAY, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid),
        role: String(isUserRoleAccess.role),
        userassignedlocation: [isUserRoleAccess.businesslocation]
      });
      setExpenses(res?.data?.todayexpense);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

  //sales vice date filter
  const fetchDateAllSales = async () => {
    try {
      let res = await axios.post(SERVICE.ALLRECENTSALES, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
      },
        businessid: String(setngs.businessid),
        role: String(isUserRoleAccess.role),
        userassignedlocation: [isUserRoleAccess.businesslocation],
        startdate: String(moment(dateFilter.startdate).format("YYYY-MM-DD")),
        enddate: String(moment(dateFilter.enddate).format("YYYY-MM-DD")),
        islocation: Boolean(isLocationChange),
        location: String(isLocations)
      });
      setPos(res?.data?.salesall)
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

  //datefilter vice purchase rtn
  const fetchDatePurchaseReturn = async () => {
    try {
      let res = await axios.post(SERVICE.PURCHASE_RETURNDASH, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid),
        role: String(isUserRoleAccess.role),
        userassignedlocation: [isUserRoleAccess.businesslocation],
        startdate: String(moment(dateFilter.startdate).format("YYYY-MM-DD")),
        enddate: String(moment(dateFilter.enddate).format("YYYY-MM-DD")),
        islocation: Boolean(isLocationChange),
        location: String(isLocations)
      });

      setPurchasesreturn(res?.data?.purchasertnall);

    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

  //purchase date filter
  const fetchDatePurchase = async () => {
    try {
      let res = await axios.post(SERVICE.DASHPURCHASES, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
      },
        businessid: String(setngs.businessid),
        role: String(isUserRoleAccess.role),
        userassignedlocation: [isUserRoleAccess.businesslocation],
        startdate: String(moment(dateFilter.startdate).format("YYYY-MM-DD")),
        enddate: String(moment(dateFilter.enddate).format("YYYY-MM-DD")),
        islocation: Boolean(isLocationChange),
        location: String(isLocations)
      });

      setPurchases(res?.data?.purchaseall);

    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

  //expense date filter
  const fetchDateExpense = async () => {
    try {
      let res = await axios.post(SERVICE.EXPENSEALL, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid),
        role: String(isUserRoleAccess.role),
        userassignedlocation: [isUserRoleAccess.businesslocation],
        startdate: String(moment(dateFilter.startdate).format("YYYY-MM-DD")),
        enddate: String(moment(dateFilter.enddate).format("YYYY-MM-DD")),
        islocation: Boolean(isLocationChange),
        location: String(isLocations)
      });
      
      setExpenses(res?.data?.expenseall);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

  const handleFetch = () =>{
    if(dateFilter.startdate == ""){
      setShowAlert("Please select from date!");
      handleOpen();
    }else if(dateFilter.enddate == ""){
      setShowAlert("Please select to date!");
      handleOpen();
    }else{
      fetchDateExpense();
      fetchDateAllSales();
      fetchDatePurchaseReturn();
      fetchDatePurchase();
    }
  }

  let purchasetotal = 0;
  let purchaseduetotal = 0;
  let saletotal = 0;
  let saleduetotal = 0;
  let expensetotal = 0;
  let retpurchasetotal = 0;

  return (

    <Box sx={{ overflow: 'hidden' }}>
      <Headtitle title={'Home'} />
      <Typography variant="h5" sx={{ color: 'rgb(94, 53, 177)' }}>Welcome {isUserRoleAccess?.role}</Typography><br />
      <Grid container sx={{ justifyContent: 'space-between' }} spacing={1}>
        {isUserRoleCompare[0]?.selectlocation && (
          <>
            <Grid item lg={4} md={4} sm={6} xs={12} sx={{ '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #B97DF0', borderRadius: '10px', } }}>
              <InputLabel htmlFor="component-outlined">Select Location</InputLabel>
              <FormControl size="small" fullwidth sx={{ display: "flex" }}>
                <Select
                  placeholder="Please Select"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200
                      },
                    },
                  }}
                  fullWidth
                  onChange={(e) => { setIsLocations(e.target.value); setIsLocationChange(true); }}
                >
                  {busilocations &&
                    busilocations.map((row, index) => (
                      <MenuItem key={index} value={row.locationid}>{row.name}</MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </>
        )}
        {isUserRoleCompare[0]?.from && (
          <Grid item lg={3} md={3} sm={6} xs={12}>
            <InputLabel htmlFor="component-outlined">From</InputLabel>
            <FormControl size="small" fullwidth="true">
              <TextField
                variant="standard"
                type="date"
                value={dateFilter.startdate}
                onChange={(e) => { setDateFilter({ ...dateFilter, startdate: e.target.value }); }}
              />
            </FormControl>
          </Grid>
        )}
        {isUserRoleCompare[0]?.to && (
          <>
            <Grid item lg={3} md={3} sm={6} xs={12}>
              <InputLabel htmlFor="component-outlined">To</InputLabel>
              <FormControl size="small" fullwidth="true">
                <TextField
                  variant="standard"
                  type="date"
                  value={dateFilter.enddate}
                  onChange={(e) => { setDateFilter({ ...dateFilter, enddate: e.target.value }) }}
                />
              </FormControl>
            </Grid>
            <Grid item lg={2} md={2} sm={6} xs={12}>
              <Button variant='contained' color='secondary' sx={{ marginLeft: "1em" }} onClick={handleFetch}>Generate</Button>
            </Grid>
          </>
        )}
      </Grid><br />
      {/* Grid Layout for TOTAL  start*/}
      <Grid container spacing={{ xs: 3, sm: 3, md: 4, lg: 4 }}>
        {isUserRoleCompare[0]?.totalpurchase && (
          <Grid item xs={12} sm={6} md={4} lg={3} >
            <Grid sx={dashboardstyle.container}>
              <Grid sx={dashboardstyle.conetntbox}>
                <Grid sx={dashboardstyle.contentboxicon}><SmartScreenSharp style={{ fontSize: '52px', padding: '5px', backgroundColor: 'rgb(146 4 196)!important', marginTop: '2px', }} /></Grid>
                {purchases && (
                  purchases.forEach(
                    (item => {
                      purchasetotal += +item?.nettotal;
                      purchaseduetotal += +item?.paydue
                    })
                  ))}
                <span>TOTAL PURCHASE<br /><span style={{ fontSize: '35px' }}>₹ {purchasetotal?.toFixed(0)}</span></span>
              </Grid>
            </Grid>
          </Grid>
        )}
        {isUserRoleCompare[0]?.totalsales && (
          <Grid item xs={12} sm={6} md={4} lg={3} >
            <Grid sx={dashboardstyle.containerOne}>
              <Grid sx={dashboardstyle.conetntbox}>
                <Grid sx={dashboardstyle.contentboxicon}><ShoppingCart style={{ fontSize: '52px', padding: '5px', }} /></Grid>
                {pos && (
                  pos.forEach(
                    (item => {
                      saletotal += +item?.aftergranddisctotal;
                      saleduetotal += Number(item?.dueamount == undefined || "" ? 0 : item?.dueamount)
                    })
                  ))}
                <span>TOTAL SALES<br /><span style={{ fontSize: '35px' }}>₹ {saletotal?.toFixed(0)}</span></span>
              </Grid>
            </Grid>
          </Grid>
        )}
        {isUserRoleCompare[0]?.purchasedue && (
          <Grid item xs={12} sm={6} md={4} lg={3} >
            <Grid sx={dashboardstyle.containerTwo}>
              <Grid sx={dashboardstyle.conetntbox}>
                <Grid sx={dashboardstyle.contentboxicon}><PriorityHighSharp style={{ fontSize: '42px', padding: '5px', }} /></Grid>
                <span>PURCHASE DUE<br /><span style={{ fontSize: '35px' }}>₹ {purchaseduetotal?.toFixed(0)}</span></span>
              </Grid>
            </Grid>
          </Grid>
        )}
        {isUserRoleCompare[0]?.salesdue && (
          <Grid item xs={12} sm={6} md={4} lg={3} >
            <Grid sx={dashboardstyle.containerThree}>
              <Grid sx={dashboardstyle.conetntbox}>
                <Grid sx={dashboardstyle.contentboxicon}><PrivacyTipSharp style={{ fontSize: '42px', padding: '5px', }} /></Grid>
                <span>SALES DUE<br /><span style={{ fontSize: '35px' }}>₹ {saleduetotal?.toFixed(0)}</span></span>
              </Grid>
            </Grid>
          </Grid>
        )}

        {isUserRoleCompare[0]?.expenses && (
          <Grid item xs={12} sm={6} md={4} lg={3} >
            <Grid sx={dashboardstyle.containerFour}>
              <Grid sx={dashboardstyle.conetntbox}>
                <Grid sx={dashboardstyle.contentboxicon}><DoDisturbOnSharp style={{ fontSize: '42px', padding: '5px', }} /></Grid>
                {expenses && (
                  expenses.forEach(
                    (item => {
                      expensetotal += +item?.totalamount;
                    })
                  ))}
                <span>EXPENSES<br /><span style={{ fontSize: '35px' }}>₹ {expensetotal.toFixed(0)}</span></span>
              </Grid>
            </Grid>
          </Grid>
        )}

        {isUserRoleCompare[0]?.totalpurchasereturn && (
          <Grid item xs={12} sm={6} md={4} lg={3} >
            <Grid sx={dashboardstyle.containerFour}>
              <Grid sx={dashboardstyle.conetntbox}>
                <Grid sx={dashboardstyle.contentboxicon}><DoDisturbOnSharp style={{ fontSize: '42px', padding: '5px', }} /></Grid>
                {purchasesreturn && (
                  purchasesreturn.forEach(

                    (item => {
                      retpurchasetotal += Number(item?.nettotal)

                    })
                  ))}
                <span>Total Purchase Return<br /><span style={{ fontSize: '35px' }}>₹ {Math.abs(retpurchasetotal.toFixed(0))}</span></span>
              </Grid>
            </Grid>
          </Grid>
        )}

      </Grid><br /><br />
      {/* Grid Layout for TOTAL end */}
      {/* Table start */}

      <Grid container>
        <Grid item lg={12} md={12} sm={12} xs={12} fullwidth="true">
          {isUserRoleCompare[0]?.recentsalestable && (
            <>
              <Dashrecentsale pos={pos} /><br />
            </>
          )}
        </Grid>
        {isUserRoleCompare[0]?.barchart && (
          <Grid item lg={8} md={8} sm={12} xs={12} fullwidth="true"><Dashbrdchart isLocations={isLocations} isLocationChange={isLocationChange}/></Grid>
        )}
        {isUserRoleCompare[0]?.topproductspiechart && (
          <Grid item lg={4} md={4} sm={12} xs={12} fullwidth="true"><Dashpiechart isLocations={isLocations} isLocationChange={isLocationChange} /></Grid>
        )}
        {isUserRoleCompare[0]?.barchart && (
          <Grid item lg={8} md={8} sm={12} xs={12} fullwidth="true"><Dashpurbarchart isLocations={isLocations} isLocationChange={isLocationChange} /></Grid>
        )}
        {isUserRoleCompare[0]?.topcustomerspiechart && (
          <Grid item l={4} md={4} sm={12} xs={12} fullwidth="true"><Dashcuspie isLocations={isLocations} isLocationChange={isLocationChange} /></Grid>
        )}
      </Grid><br />
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={12} xs={12} fullwidth="true">
          {isUserRoleCompare[0]?.stockalerttable && (
            <Dashstockalert isLocations={isLocations} isLocationChange={isLocationChange}  />
          )}
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12} fullwidth="true">
          {isUserRoleCompare[0]?.topsellproductstable && (
            <Dashtopselling isLocations={isLocations}  isLocationChange={isLocationChange}/>
          )}
        </Grid>
      </Grid>
      {/* Table end */}
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

export default Dashboard;