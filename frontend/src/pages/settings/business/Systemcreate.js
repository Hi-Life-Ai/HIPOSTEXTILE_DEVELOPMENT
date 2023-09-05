import React, { useContext } from 'react';
import { Box, Grid, FormControl, InputLabel, Select, MenuItem, Checkbox } from '@mui/material';
import { userStyle } from '../../PageStyle';

export default function Systemcreate() {


    return (
        <Box>
            <Grid container spacing={3} >
                 <Grid item xs={12} sm={6} md={4}>
                    <FormControl size="small" fullWidth >
                        <InputLabel id="demo-select-small">Theme Color</InputLabel>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            label="Theme Color"
                        >
                            <MenuItem value="">
                            </MenuItem>
                            <MenuItem value={1}>blue</MenuItem>
                            <MenuItem value={2}>black</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Grid sx={{ display: 'flex' }}  >
                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                            <InputLabel id="demo-select-small">Default datatable page entries</InputLabel>
                            <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                label="Default datatable page entries"
                                fullWidth
                            >
                                <MenuItem value="">
                                </MenuItem>
                                <MenuItem value={1}>25</MenuItem>
                                <MenuItem value={2}>50</MenuItem>
                                <MenuItem value={2}>100</MenuItem>
                                <MenuItem value={2}>200</MenuItem>
                                <MenuItem value={2}>1000</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <Checkbox aria-label="Checkbox demo" label="Checkbox demo" defaultChecked />Show help text
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}> </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}> </Grid>
            </Grid>
      
        </Box>
    );
}