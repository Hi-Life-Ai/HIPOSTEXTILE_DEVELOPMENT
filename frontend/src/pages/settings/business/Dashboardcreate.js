import React, { useContext } from 'react';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, Typography } from '@mui/material';
import { userStyle } from '../../PageStyle';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';

export default function Dashboardcreate() {
    return (
        <Box>
            <Grid container spacing={3} >
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Grid sx={{ display: 'flex' }}  >
                        <Grid sx={userStyle.spanIcons} ><EventBusyOutlinedIcon /></Grid>
                        <FormControl size="small" fullWidth>
                            <InputLabel htmlFor="component-outlined">View Stock Expiry Alert For</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label="View Stock Expiry Alert For"
                                type="text"
                                placeholder='pos by hilife AI'
                            />
                        </FormControl>
                        <Grid sx={userStyle.spanText} >
                            <Typography>days</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}