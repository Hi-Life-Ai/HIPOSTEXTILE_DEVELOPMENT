import React, { useState, useContext, useEffect } from 'react';
import {
  Box, Grid, FormControl, InputLabel, Dialog, DialogActions, DialogContent, OutlinedInput,Table, TableBody, TableContainer, TableHead, Typography, Paper, Button,
} from '@mui/material';
import { colourStyles, userStyle } from '../PageStyle';
import { StyledTableRow, StyledTableCell } from '../../components/Table';
import Selects from "react-select";
import Footer from '../../components/footer/Footer';
import axios from 'axios';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { toast } from 'react-toastify';
import { SERVICE } from '../../services/Baseservice';
import { AuthContext, UserRoleAccessContext } from '../../context/Appcontext';
import Headtitle from '../../components/header/Headtitle';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { useNavigate } from 'react-router-dom';
import { AiOutlineClose } from "react-icons/ai";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

function StockTransferCreate() {

  const [productsList, setProductsList] = useState([]);
  const [busilocations, setBusilocations] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const [tableData, setTableData] = useState([]); 
  const productilputs = {
    productname:"", productcode:"", currentstock:"", unit:"",category:"",subcategory:"",brand:"",size:"",color:"",sellingpricetaxtype:"",productuniqid:"", quantity:[], locations:[]
  }
  const { auth, setngs } = useContext(AuthContext);
  //role access
  const {isActiveLocations, allProducts } = useContext(UserRoleAccessContext);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState()
  const handleOpen = () => { setIsErrorOpen(true); };
  const handleClose = () => { setIsErrorOpen(false); };
  const backPage = useNavigate();
  const [transfer, setTransfer] = useState({location: ""});

  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + '-' + mm + '-' + yyyy;

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

  //  Error popup
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => { 
    if (transfer.location == "") {
      setShowAlert("please select from location")
      handleOpen()
    } else if (productsList.length == 0) {
      setShowAlert("please select any one of product")
      handleOpen()
    }else if (selectedValue.length == 0) {
      setShowAlert("please select to location")
      handleOpen()
    } else {
      setIsDeleteOpen(true)
    }
     };
  const handleCloseClick = () => { setIsDeleteOpen(false) };

   // business location multiselect
   const handleChangeLocation = (e) => {
    setSelectedValue(Array.isArray(e) ? e.map((x) => x.value) : []);
};

  //event for tabale data fetching
  const fetchEvent = (e) => {
    let isAlreadyAdded = false;
    let addQuantity = tableData.map((item) => {
      if (e.sku == item.productcode) {
        isAlreadyAdded = true
        setShowAlert("This product is already added!")
        handleOpen();
        return { ...item }
      } else {
        return item
      }
    })
    if (isAlreadyAdded) {
      setTableData(addQuantity)
    } else {
      setTableData((tableData) => {
        return [...tableData, {
          ...productilputs,
          productname: e.productname,
          productcode: e.sku,
          currentstock: e.currentstock,
          category: e.category,
          subcategory: e.subcategory,
          brand: e.brand,
          color: e.color,
          size: e.size,
          sellingpricetaxtype:e.sellingpricetax,
          productuniqid: e._id,
          unit: e.unit,
          quantity:[],
          locations:[],
        }]
      });
    }
  }

  // get all products based on location
  const getProducts = (e) => {
    let prod = allProducts.filter((data) => {
      return e.value == data.businesslocation
    })
    setProductsList(
      prod?.map((d) => (
        {
          ...d,
          label: d.productname + ' ' + d.sku,
          value: d.sku,
        }
      ))
    );
  }

  useEffect(
    () => {
    fetchLocation();
  },[])

  useEffect(
    () => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener('beforeunload', beforeUnloadHandler);
        return () => {
            window.removeEventListener('beforeunload', beforeUnloadHandler);
        };
    }, []);

    

  const addTransfer = async () => {
    try {
     let res = await axios.post(SERVICE.TRANSFER_CREATE, {
      headers: {
        'Authorization': `Bearer ${auth.APIToken}`
      },

        tobusinesslocations:[...selectedValue],
        status:Boolean(false),
        products: [...tableData],
        fromlocation: String(transfer.location),
        date:String(today),
        reject:Boolean(false),
        assignbusinessid:String(setngs.businessid),
      })

      handleCloseClick();
      toast.success(res.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
      backPage('/stocktransfer/List')
    } catch (err) {
      const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
    }
  }

  const addQuantity = (id, value, locationindex) => {
      let valueQuantity = tableData.map((item, index) => {
        if (index == id) {
          if(value > item.currentstock){
            setShowAlert("Please Enter Value Less Than Quantity");
            handleOpen();
            return {...item,  locations:[...selectedValue]}
          }else {
            return {...item, quantity:{...item.quantity, [selectedValue[locationindex]] : Number(value)}, locations:[...selectedValue]}
          }
        }
        else {
          return {...item, locations:[...selectedValue]};
        }
      })
      setTableData(valueQuantity);
  }
 
  // Business Locations
  const fetchLocation = async () => {
    try {
      
      setBusilocations(
        isActiveLocations.map((d) => (
          {
            ...d,
            label: d.name,
            value: d.locationid,
          }
        ))
      );
    } catch (err) {
      const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
    }
  };
  //function for delete columns
  const deleteRow = (i, e) => {
    setTableData(tableData.filter((e, item) => item !== i));
    tableData.splice(i, 1);
  }

  return (
    <>
      <Headtitle title={'Create Stock Transfer'} />
      <Typography sx={userStyle.importheadtext}>Create Stock Transfer</Typography><br />
      <Box sx={userStyle.container} style={{ minHeight: '300px', overflow: "visible" }}>
        <Typography sx={userStyle.importheadtext}>Add products to transfer</Typography><br /><br />
        <Grid container spacing={2} >
          <Grid item md={3} sx={12} xs={12}>
            <InputLabel htmlFor="component-outlined" >From Business Location <b style={{ color: 'red' }}>*</b></InputLabel>
            <FormControl fullWidth  >
              <Selects
                options={busilocations}
                styles={colourStyles}
                onChange={(e) => { setTransfer({ ...transfer, location: e.value }); getProducts(e) }}
                 />
            </FormControl>
          </Grid>
          <Grid item md={3} sx={12} xs={12}>
            <InputLabel htmlFor="component-outlined" >To Business Locations <b style={{ color: 'red' }}>*</b></InputLabel>
            <FormControl fullWidth>
              <Selects
                isMulti
                styles={colourStyles}
                options={busilocations}
                onChange={handleChangeLocation}
              />
            </FormControl>
          </Grid>
          <Grid item md={3}>
            <InputLabel htmlFor="component-outlined" >Products Name <b style={{ color: 'red' }}>*</b></InputLabel>
            <FormControl size="small" fullWidth >
              <Selects
              options={productsList}
              styles={colourStyles}
              onChange={(e) => { fetchEvent(e) }}
                />
            </FormControl>
          </Grid>
          <Grid item md={3} sx={12} xs={12}>
            <Button style={{ top: "18px" }} sx={userStyle.buttonadd} onClick={handleClickOpen}>SHARE</Button>
          </Grid>
        </Grid>
        <br />
        <>
          <TableContainer component={Paper}>
            <Table aria-label="customized table" id="">
              <TableHead >
                <StyledTableRow >
                  <StyledTableCell >Product name</StyledTableCell>
                  <StyledTableCell >Product Code</StyledTableCell>
                  <StyledTableCell >Current Stock</StyledTableCell>
                  <StyledTableCell >Quantity</StyledTableCell>
                  <StyledTableCell ><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {tableData && tableData.map((item, index) => {
                  return (
                    <StyledTableRow key={index}>
                      <StyledTableCell >{item.productname}</StyledTableCell>
                      <StyledTableCell>{item.productcode}</StyledTableCell>
                      <StyledTableCell>{item.currentstock}</StyledTableCell>
                      <StyledTableCell>
                        {selectedValue?.map((data, locationindex)=>(
                            <>            
                            <OutlinedInput
                              id="component-outlined"
                              key={locationindex}
                              value={[item.quantity[data]]}
                              onChange={(e) => { 
                                addQuantity(index, e.target.value, locationindex);  }}
                              size="small"
                              type="number"
                            />
                          </>
                          ))
                        }
                      </StyledTableCell>
                      <StyledTableCell><AiOutlineClose onClick={(e) => { deleteRow(index, e); }} style={{ color: "red", cursor: "pointer" }} /></StyledTableCell>
                    </StyledTableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
        <br />
      </Box><br /><br />

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
            <Button variant="contained" color="error" onClick={handleClose} >ok</Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Dialog
        open={isDeleteOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
          <CheckCircleOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
          <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseClick} variant="outlined">Cancel</Button>
          <Button autoFocus variant="contained" color='error' onClick={() => { addTransfer();}}> OK </Button>
        </DialogActions>
      </Dialog>

    </>
  )

}
function StockTransferCreatetable() {
  return (
     <>
      <StockTransferCreate /><br /><br /><br /><br />
                <Footer />
     </>
  );
}
export default StockTransferCreatetable;