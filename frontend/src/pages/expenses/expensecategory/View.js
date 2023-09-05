import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, Button, Typography, Dialog, DialogContent, DialogActions} from '@mui/material';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { toast } from 'react-toastify';
import { SERVICE } from "../../../services/Baseservice";
import { AuthContext } from '../../../context/Appcontext';

function Expensecategoryviewlist() {

    const [expenseCategoryForm, setExpenseCategoryForm] = useState({});
    const { auth } = useContext(AuthContext);

    const id = useParams().id

    //  Expense category
    const fetchHandler = async () => {
        try { 
          let response = await axios.get(`${SERVICE.EXPENSE_CATEGORY_SINGLE}/${id}`,{
            headers: {
                'Authorization': `Bearer ${auth.APIToken}`
            },
          });
          setExpenseCategoryForm(response?.data?.sexcategory);
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
        fetchHandler();
    }, [id]);

    return (
        <Box>
            <Typography sx={userStyle.HeaderText}> View Expense Category </Typography>
            <form>
                <Box sx={userStyle.container}>
                    <Grid container spacing={2}>
                        <Grid item md={6} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined">Category name <b style={{color:'red'}}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={expenseCategoryForm.categoryname}
                                    type="text"
                                    name="categoryname"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={6} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined">Category Code<b style={{color:'red'}}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={expenseCategoryForm.categorycode}
                                    type="text"
                                    name="categorycode"
                                />
                            </FormControl>
                        </Grid>
                        <Grid container sx={userStyle.gridcontainer}>
                            <Grid >
                                <Link to="/expense/expensecategory/list"><Button sx={userStyle.buttoncancel}>BACK</Button></Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </Box>
    );
}

const Expensecategoryview = () => {
    return (
        <>
            <Expensecategoryviewlist /><br /><br /><br />
                        <Footer />
        </>
    );
}
export default Expensecategoryview;