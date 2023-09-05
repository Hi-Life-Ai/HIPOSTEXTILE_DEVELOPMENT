import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Grid, Typography, FormControl, InputLabel, OutlinedInput, TextareaAutosize, } from '@mui/material';
import { userStyle } from '../../PageStyle';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Headtitle from '../../../components/header/Headtitle';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

function Categoryviewlist() {

    const [isCategory, setIsCategory] = useState({});
    const [subCategories, setSubCategories] = useState([]);
    const { auth } = useContext(AuthContext);
    const id = useParams().id;


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
            fetchCategory();
        }, []
    )

    return (
        <Box>
            <Headtitle title={'View Category'} />
            {/* Form Start */}
            <form>
                <Typography sx={userStyle.HeaderText}>View Category</Typography>
                <Box sx={userStyle.container}>
                    <Grid container spacing={3} sx={userStyle.textInput}>
                        <Grid item md={12} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined">Category Name <b style={{ color: 'red', }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={isCategory.categoryname}
                                    readOnly
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
                                    readOnly
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
                                    value={isCategory.categorycode}
                                    readOnly
                                    type="text"
                                    name="categorycode"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <InputLabel id="demo-select-small">Description</InputLabel>
                            <FormControl size="small" fullWidth >
                                <TextareaAutosize aria-label="minimum height" minRows={3} style={{ border: '1px solid #4a7bf7' }}
                                    value={isCategory.categorydescription}
                                    readOnly
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
                                                <Grid item sm={12} xs={12} md={4} lg={4}>
                                                    <InputLabel htmlFor="component-outlined">Sub Category Name</InputLabel>
                                                    <FormControl size="small" fullWidth>
                                                        <OutlinedInput
                                                            id="component-outlined"
                                                            value={item.subcategryname}
                                                            readOnly
                                                            type="text"
                                                            name="categoryname"
                                                            placeholder="Sub Category name"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={12} xs={12} md={4} lg={4}>
                                                    <InputLabel htmlFor="component-outlined">Sub Category Short Name</InputLabel>
                                                    <FormControl size="small" fullWidth>
                                                        <OutlinedInput
                                                            id="component-outlined"
                                                            value={item.subcategryshotname}
                                                            readOnly
                                                            type="text"
                                                            name="categoryname"
                                                            placeholder="Sub Category Short name"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item sm={12} xs={12} md={4} lg={4}>
                                                    <InputLabel htmlFor="component-outlined">Sub Category Code</InputLabel>
                                                    <FormControl size="small" fullWidth>
                                                        <OutlinedInput
                                                            id="component-outlined"
                                                            value={item.subcategrycode}
                                                            readOnly
                                                            type="text"
                                                            name="categoryname"
                                                            placeholder="Sub Category code"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </li>
                                    )
                                })}
                            </ul>
                        )
                    } <br />
                    <Grid container sx={{ marginTop: '20px', marginBottom: '20px', justifyContent: 'center' }}>
                        <Link to="/product/category/list"><Button sx={userStyle.buttoncancel}>BACK</Button></Link>
                    </Grid>
                </Box>
            </form>
        </Box>
    );
}

const Categoryview = () => {
    return (
        <>
             <Categoryviewlist /><br /><br /><br /><br />
                        <Footer />
        </>
    );
}
export default Categoryview;