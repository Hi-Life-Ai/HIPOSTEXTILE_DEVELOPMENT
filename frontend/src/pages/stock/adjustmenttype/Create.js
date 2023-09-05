import React, { useState, useContext, useEffect } from 'react';
import { Box, OutlinedInput, FormControl, InputLabel, Grid, Button, Typography, Dialog,DialogContent, DialogActions } from '@mui/material';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import Selects from "react-select";
import axios from 'axios';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import AdjustmentTypelist from './List';

function AdjustmentTypecretetable({setSaveType}) {

    //  Datefield
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;


    const { auth, setngs } = useContext(AuthContext);
    
    const [isAdjustmnets, setIsAdjustments] = useState([]);
    const mode = [
        { value: "Add", label: 'Add', },
        { value: "Sub", label: 'Sub', }
    ]
    const [adjustment, setAdjustment] = useState({
        adjustmentitem: "", mode: "Select adjustment mode"
    });

    //popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState("")
  const handleOpen = () => {
    setIsErrorOpen(true);
  };
  const handleClose = () => {
    setIsErrorOpen(false);
  };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };


      // adjustment
      const fetchAdjustment = async () => {
        try {
            let res = await axios.post(SERVICE.ADJUSTMENTTYPE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid)
            });

            let result = res?.data?.adjustments.map((data, index)=>{
                return data.adjustmentitem
            })
            setIsAdjustments(result);
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
        fetchAdjustment();
    },[])
    
  useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

    // Add Datas
    const addAdjustment = async () => {
        try {
            let req = await axios.post(SERVICE.ADJUSTMENTTYPE_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                assignbusinessid: String(setngs.businessid),
                adjustmentitem: String(adjustment.adjustmentitem),
                mode: String(adjustment.mode),
                today: String(today),

            });
            setSaveType("None");
            toast.success(req.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            setAdjustment({
                adjustmentitem: "",
                mode: "Select adjustment mode",
            })
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong")
            }
        }
    }


    const addStyleSubmit = (e) => {
        e.preventDefault();
        if(adjustment.adjustmentitem == ""){
            setShowAlert("Please enter adjustment type!");
            handleOpen();

        }else if(isAdjustmnets.includes(adjustment.adjustmentitem)){
            setShowAlert("Name Already Exists!!");
            handleOpen();

        }else if(adjustment.mode == "" | adjustment.mode == "Select adjustment mode"){
            setShowAlert("Please select adjustment mode!");
            handleOpen();
        }
        else{
            addAdjustment();
        }
       

    };

    return (
        <Box>
            <Headtitle title={'Adjustment Type Master'} />
            {/* header text */}
            <form >
                <Typography sx={userStyle.HeaderText}>Create Adjustment Type</Typography>
                {/* content start */}
                <Box sx={userStyle.container}>
                    <Grid container spacing={3} sx={userStyle.textInput}>
                        <Grid item lg={5} md={6} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined">Adjustment Type</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={adjustment.adjustmentitem}
                                    onChange={(e) => { setAdjustment({ ...adjustment, adjustmentitem: e.target.value }) }}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={5} md={6} sm={12} xs={12} >
                            <InputLabel id="demo-select-small">Mode</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <Grid sx={{ display: 'flex' }}>
                                    <Selects
                                        options={mode}
                                        placeholder='Select adjustment mode.....'
                                        value={{ label: adjustment.mode, value: adjustment.mode }}
                                        onChange={(e) => { setAdjustment({ ...adjustment, mode: e.value }); }}
                                    />
                                </Grid>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid>
                            <Button sx={userStyle.buttoncancel} onClick={() => {
                                setAdjustment({
                                    adjustmentitem: "",
                                    mode: "Select adjustment mode",
                                })
                            }}>CLEAR</Button>
                            <Button sx={userStyle.buttonadd} onClick={(e) => { addStyleSubmit(e) }}>SAVE</Button>
                        </Grid>
                    </Grid>
                </Box>
            </form>

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

function Adjustmenttypecreate() {
    
    // Access
    const { isUserRoleCompare } = useContext(UserRoleAccessContext);
    const [saveType, setSaveType] = useState("");

    return (
       <>
        {isUserRoleCompare[0]?.astockadjustmenttype && (
                <>
                 <AdjustmentTypecretetable  setSaveType={setSaveType} /><br />
                </>
              )}
                    <AdjustmentTypelist saveType={saveType} />
                    <Footer />
       </>
    );
}
export default Adjustmenttypecreate;