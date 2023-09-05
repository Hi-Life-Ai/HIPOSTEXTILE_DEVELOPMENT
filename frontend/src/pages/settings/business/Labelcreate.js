import React, { useContext } from 'react';
import { Grid, Box, FormControl, Typography, FormGroup, FormControlLabel, InputLabel, OutlinedInput, Checkbox, } from '@mui/material';
import { userStyle } from '../../PageStyle';

export default function Labelcreate() {
    return (
        <Box>
            <Grid container spacing={3} >
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography variant='h6'>Labels for custom payments</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Payment 1</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Payment 1"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Payment 2</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Payment 2"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Payment 3</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Payment 3"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Payment 4</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Payment 4"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Payment 5</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Payment 5"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Payment 6</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Payment 6"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Payment 7</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Payment 6"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}> </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}> </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography variant='h6'>Labels for contact custom fields</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 1</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 1"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 2</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 2"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 3</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 3"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 4</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 4"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 5</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 5"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 6</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 6"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 7</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 7"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 8</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 8"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 9</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 9"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 10</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 10"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}> </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}> </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography variant='h6'>Labels for product custom fields</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 1</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 1"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 2</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 2"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 3</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 3"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 4</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 4"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography variant='h6'>Labels for location custom fields</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 1</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 1"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 2</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 2"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 3</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 3"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 4</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 4"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography variant='h6'>Labels for user custom fields</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 1</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 1"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 2</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 2"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 3</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 3"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 4</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 4"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography variant='h6'>Labels for purchase custom fields</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Grid sx={{ display: 'flex' }}  >
                        <FormControl size="small" sx={{ width: '75%' }}>
                            <InputLabel htmlFor="component-outlined">Custom Field1</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label="Custom Field1"
                                type="text"
                            />
                        </FormControl>
                        <Grid sx={userStyle.spanTextRadio} >
                            <Box sx={{ display: 'flex' }}>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="is required" />
                                </FormGroup>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Grid sx={{ display: 'flex', }} >
                        <FormControl size="small" sx={{ width: '75%' }} >
                            <InputLabel htmlFor="component-outlined">Custom Field2</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label="Custom Field1"
                                type="text"
                            />
                        </FormControl>
                        <Grid sx={userStyle.spanTextRadio} >
                            <Box sx={{ display: 'flex' }}>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="is required" />
                                </FormGroup>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Grid sx={{ display: 'flex', }} >
                        <FormControl size="small" sx={{ width: '75%' }} >
                            <InputLabel htmlFor="component-outlined">Custom Field3</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label="Custom Field1"
                                type="text"
                            />
                        </FormControl>
                        <Grid sx={userStyle.spanTextRadio} >
                            <Box sx={{ display: 'flex' }}>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="is required" />
                                </FormGroup>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Grid sx={{ display: 'flex', }} >
                        <FormControl size="small" sx={{ width: '75%' }} >
                            <InputLabel htmlFor="component-outlined">Custom Field4</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label="Custom Field1"
                                type="text"
                            />
                        </FormControl>
                        <Grid sx={userStyle.spanTextRadio} >
                            <Box sx={{ display: 'flex' }}>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="is required" />
                                </FormGroup>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography variant='h6'>Labels for purchase shipping custom fields</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Grid sx={{ display: 'flex', }} >
                        <FormControl size="small" sx={{ width: '75%' }} >
                            <InputLabel htmlFor="component-outlined">Custom Field1</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label="Custom Field1"
                                type="text"
                            />
                        </FormControl>
                        <Grid sx={userStyle.spanTextRadio} >
                            <Box sx={{ display: 'flex' }}>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="is required" />
                                </FormGroup>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Grid sx={{ display: 'flex', }} >
                        <FormControl size="small" sx={{ width: '75%' }} >
                            <InputLabel htmlFor="component-outlined">Custom Field2</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label="Custom Field1"
                                type="text"
                            />
                        </FormControl>
                        <Grid sx={userStyle.spanTextRadio} >
                            <Box sx={{ display: 'flex' }}>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="is required" />
                                </FormGroup>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Grid sx={{ display: 'flex', }} >
                        <FormControl size="small" sx={{ width: '75%' }} >
                            <InputLabel htmlFor="component-outlined">Custom Field3</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label="Custom Field1"
                                type="text"
                            />
                        </FormControl>
                        <Grid sx={userStyle.spanTextRadio} >
                            <Box sx={{ display: 'flex' }}>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="is required" />
                                </FormGroup>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Grid sx={{ display: 'flex', }} >
                        <FormControl size="small" sx={{ width: '75%' }} >
                            <InputLabel htmlFor="component-outlined">Custom Field4</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label="Custom Field1"
                                type="text"
                            />
                        </FormControl>
                        <Grid sx={userStyle.spanTextRadio} >
                            <Box sx={{ display: 'flex' }}>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="is required" />
                                </FormGroup>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Grid sx={{ display: 'flex', }} >
                        <FormControl size="small" sx={{ width: '75%' }} >
                            <InputLabel htmlFor="component-outlined">Custom Field5</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label="Custom Field1"
                                type="text"
                            />
                        </FormControl>
                        <Grid sx={userStyle.spanTextRadio} >
                            <Box sx={{ display: 'flex' }}>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="is required" />
                                </FormGroup>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}> </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography variant='h6'>Labels for sell custom fields</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Grid sx={{ display: 'flex', }} >
                        <FormControl size="small" sx={{ width: '75%' }} >
                            <InputLabel htmlFor="component-outlined">Custom Field1</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label="Custom Field1"
                                type="text"
                            />
                        </FormControl>
                        <Grid sx={userStyle.spanTextRadio} >
                            <Box sx={{ display: 'flex' }}>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="is required" />
                                </FormGroup>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Grid sx={{ display: 'flex', }} >
                        <FormControl size="small" sx={{ width: '75%' }} >
                            <InputLabel htmlFor="component-outlined">Custom Field2</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label="Custom Field1"
                                type="text"
                            />
                        </FormControl>
                        <Grid sx={userStyle.spanTextRadio} >
                            <Box sx={{ display: 'flex' }}>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="is required" />
                                </FormGroup>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Grid sx={{ display: 'flex', }} >
                        <FormControl size="small" sx={{ width: '75%' }} >
                            <InputLabel htmlFor="component-outlined">Custom Field3</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label="Custom Field1"
                                type="text"
                            />
                        </FormControl>
                        <Grid sx={userStyle.spanTextRadio} >
                            <Box sx={{ display: 'flex' }}>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="is required" />
                                </FormGroup>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Grid sx={{ display: 'flex', }} >
                        <FormControl size="small" sx={{ width: '75%' }} >
                            <InputLabel htmlFor="component-outlined">Custom Field4</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label="Custom Field1"
                                type="text"
                            />
                        </FormControl>
                        <Grid sx={userStyle.spanTextRadio} >
                            <Box sx={{ display: 'flex' }}>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="is required" />
                                </FormGroup>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography variant='h6'>Labels for sale shipping custom fields</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Grid sx={{ display: 'flex', }} >
                        <FormControl size="small" sx={{ width: '25%' }} >
                            <InputLabel htmlFor="component-outlined">Custom Field1</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label="Custom Field1"
                                type="text"
                            />
                        </FormControl>
                        <Grid sx={userStyle.spanTextRadio} >
                            <Box sx={{ display: 'flex' }}>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="is required" />
                                </FormGroup>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="Is default for contact" />
                                </FormGroup>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Grid sx={{ display: 'flex', }} >
                        <FormControl size="small" sx={{ width: '25%' }} >
                            <InputLabel htmlFor="component-outlined">Custom Field2</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label="Custom Field1"
                                type="text"
                            />
                        </FormControl>
                        <Grid sx={userStyle.spanTextRadio} >
                            <Box sx={{ display: 'flex' }}>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="is required" />
                                </FormGroup>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="Is default for contact" />
                                </FormGroup>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Grid sx={{ display: 'flex', }} >
                        <FormControl size="small" sx={{ width: '25%' }}>
                            <InputLabel htmlFor="component-outlined">Custom Field3</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label="Custom Field1"
                                type="text"
                            />
                        </FormControl>
                        <Grid sx={userStyle.spanTextRadio} >
                            <Box sx={{ display: 'flex' }}>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="is required" />
                                </FormGroup>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="Is default for contact" />
                                </FormGroup>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Grid sx={{ display: 'flex', }} >
                        <FormControl size="small" sx={{ width: '25%' }} >
                            <InputLabel htmlFor="component-outlined">Custom Field4</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label="Custom Field1"
                                type="text"
                            />
                        </FormControl>
                        <Grid sx={userStyle.spanTextRadio} >
                            <Box sx={{ display: 'flex' }}>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="is required" />
                                </FormGroup>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="Is default for contact" />
                                </FormGroup>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Grid sx={{ display: 'flex', }} >
                        <FormControl size="small" sx={{ width: '25%' }} >
                            <InputLabel htmlFor="component-outlined">Custom Field5</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label="Custom Field1"
                                type="text"
                            />
                        </FormControl>
                        <Grid sx={userStyle.spanTextRadio} >
                            <Box sx={{ display: 'flex' }}>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="is required" />
                                </FormGroup>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="Is default for contact" />
                                </FormGroup>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography variant='h6'>Labels for types of service custom fields</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 1</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 1"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 2</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 1"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 3</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 1"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 4</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 1"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 5</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 1"
                            type="text"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel htmlFor="component-outlined">Custom Field 6</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            label="Custom Field 1"
                            type="text"
                        />
                    </FormControl>
                </Grid>
            </Grid>
        </Box>
    );
}