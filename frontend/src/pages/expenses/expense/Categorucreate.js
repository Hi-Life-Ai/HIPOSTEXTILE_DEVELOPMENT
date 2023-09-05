import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, Button, Dialog, DialogTitle, DialogContent, DialogActions,} from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SERVICE } from "../../../services/Baseservice";
import { AuthContext } from '../../../context/Appcontext';
import { userStyle } from '../../PageStyle';

function CreateCatMod({ setSaveExpcate }) {

    const [expenseCategoryForm, setExpenseCategoryForm] = useState({
        categoryname: "", categorycode: "",
    });
    const [isExcatCode, setIsExcatCode] = useState([]);
  const [isExcatName, setIsExcatName] = useState([]);
    const { auth, setngs } = useContext(AuthContext);

    // Add Modal
    const [expcategorymodadd, setExpCategorymodadd] = useState(false);
    const openAdd = () => { setExpCategorymodadd(true); };
    const closeAdd = () => { setExpCategorymodadd(false); setExpenseCategoryForm({ ...expenseCategoryForm, categoryname: "", categorycode: "" }); setShowAlert("") };

    // Popup model
    const [showAlert, setShowAlert] = useState()

    const fetchData = async () => {
        try {
            let res = await axios.post(SERVICE.EXPENSE_CATEGORY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid:String(setngs.businessid)
            });

            let excode = res.data.excategorys.map((data,index)=>{
                return data.categorycode
              })
          
            let exname = res.data.excategorys.map((data,index)=>{
            return data.categoryname
            })
              setIsExcatCode(excode);
              setIsExcatName(exname);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    useEffect(() => {
        fetchData()
    }, [])

    const sendexpRequest = async () => {
        try {
            let res = await axios.post(SERVICE.EXPENSE_CATEGORY_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                categoryname: String(expenseCategoryForm.categoryname),
                categorycode: String(expenseCategoryForm.categorycode),
                assignbusinessid: String(setngs.businessid),
            });
            setSaveExpcate("None");
            await fetchData();
            toast.success(res.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            closeAdd();
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
            setShowAlert(messages);

            } else {
                toast.error("Something went wrong")
            }
        }
    };

    const addExpCateSubmit = (e) => {
        e.preventDefault();
        if (expenseCategoryForm.categoryname == "") {
            setShowAlert("Please enter categoty name!");
        }
        else if (expenseCategoryForm.categorycode == "") {
            setShowAlert("Please enter categoty code!");
        }
        else if (isExcatName.includes(expenseCategoryForm.categoryname)) {
            setShowAlert("Name Already Exists");
        }
        else if (isExcatCode.includes(expenseCategoryForm.categorycode)) {
            setShowAlert("ID Already Exists");
        }
        else {
            setShowAlert("");
            sendexpRequest();
        }
    }

    return (
        <Box>
            <Grid sx={userStyle.spanPlusIcons} onClick={openAdd}><AddCircleOutlineOutlinedIcon /></Grid>
            <Dialog
                aria-labelledby="customized-dialog-title1"
                open={expcategorymodadd}
                sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #b97df0',
                    },
                }}
            >
                <form>
                    <DialogTitle id="customized-dialog-title1"> Add Expense Category </DialogTitle>
                    <DialogContent dividers>
                        <p style={{ color: 'red' }}>{showAlert}</p><br />
                        <Grid container spacing={3}>
                            <Grid item md={12} sm={12} xs={12}>
                            
                                <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Category name <b style={{ color: 'red' }}>*</b></InputLabel>
                                    <OutlinedInput
                                        sx={userStyle.alertOutline}
                                        id="component-outlined"
                                        value={expenseCategoryForm.categoryname}
                                        onChange={(e) => { setExpenseCategoryForm({ ...expenseCategoryForm, categoryname: e.target.value });setShowAlert(""); }}
                                        type="text"
                                        label="category name"
                                        name="categoryname"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                            
                                <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Category Code <b style={{ color: 'red' }}>*</b></InputLabel>
                                    <OutlinedInput
                                        sx={userStyle.alertOutline}
                                        id="component-outlined"
                                        value={expenseCategoryForm.categorycode}
                                        onChange={(e) => { setExpenseCategoryForm({ ...expenseCategoryForm, categorycode: e.target.value }); setShowAlert(""); }}
                                        type="text"
                                        label="category code"
                                        name="categorycode"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='contained' sx={userStyle.buttonadd} onClick={addExpCateSubmit} type="submit"> Save </Button>
                        <Button variant='contained' color="error" sx={userStyle.buttoncancel} onClick={closeAdd}>Close</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}

export default CreateCatMod;