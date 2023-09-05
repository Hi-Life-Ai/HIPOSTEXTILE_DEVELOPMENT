import React, { useContext } from 'react';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { userStyle } from '../../PageStyle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function Taxcreate({isSetngs, setIsSetngs}) {

    return (
        <Box>
            <Grid container spacing={3} >
                <Grid item xs={12} sm={12} md={6} lg={4}>
                    <InputLabel htmlFor="component-outlined">Tax 1 Name</InputLabel>
                    <Grid sx={{ display: 'flex' }}  >
                        <Grid sx={userStyle.spanIcons} >
                            < InfoOutlinedIcon />
                        </Grid>
                        <FormControl size="small" fullWidth>
                            <OutlinedInput
                                id="component-outlined"
                                type="text" 
                                value={isSetngs.taxonename}
                                onChange={(e) => setIsSetngs({...isSetngs, taxonename:e.target.value }) }
                                name="taxonename"

                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                    <InputLabel htmlFor="component-outlined">Tax 1 No</InputLabel>
                    <Grid sx={{ display: 'flex' }}  >
                        <Grid sx={userStyle.spanIcons} >
                            < InfoOutlinedIcon />
                        </Grid>
                        <FormControl size="small" fullWidth>
                            <OutlinedInput
                                id="component-outlined"
                                type="text" 
                                value={isSetngs.taxonenum}
                                onChange={(e) => setIsSetngs({...isSetngs, taxonenum:e.target.value }) }
                                name="taxonenum"
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                    <InputLabel htmlFor="component-outlined">Tax 2 Name</InputLabel>
                    <Grid sx={{ display: 'flex' }}  >
                        <Grid sx={userStyle.spanIcons} >
                            < InfoOutlinedIcon />
                        </Grid>
                        <FormControl size="small" fullWidth>
                            <OutlinedInput
                                id="component-outlined"
                                type="text" 
                                value={isSetngs.taxtwoname}
                                onChange={(e) => setIsSetngs({...isSetngs, taxtwoname:e.target.value }) }
                                name="taxtwoname"
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                    <InputLabel htmlFor="component-outlined">Tax 2 No</InputLabel>
                    <Grid sx={{ display: 'flex' }}  >
                        <Grid sx={userStyle.spanIcons} >
                            < InfoOutlinedIcon />
                        </Grid>
                        <FormControl size="small" fullWidth>
                            <OutlinedInput
                                id="component-outlined"
                                type="text" 
                                value={isSetngs.taxtwonum}
                                onChange={(e) => setIsSetngs({...isSetngs, taxtwonum:e.target.value }) }
                                name="taxtwonum"
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={5}>
                    <InputLabel htmlFor="component-outlined" >Inline tax</InputLabel>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox />} label="Enable inline tax in purchase and sell" value={isSetngs.inlinepuresell} onChange={(e) => setIsSetngs({...isSetngs, inlinepuresell:!isSetngs.inlinepuresell})} />
                    </FormGroup>
                </Grid>
            </Grid>
        </Box>
    );
}