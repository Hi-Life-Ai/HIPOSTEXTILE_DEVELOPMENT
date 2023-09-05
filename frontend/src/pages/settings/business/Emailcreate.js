import React, { useContext } from 'react';
import { Box, Grid, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Button } from '@mui/material';
import { userStyle } from '../../PageStyle';

export default function Emailcreate() {
    return (
        <Box >
            <Grid container spacing={3} >
                <Grid item xs={12} sm={6} md={4} lg={4}>
                    <Grid sx={{ display: 'flex' }}  >
                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                            <InputLabel id="demo-select-small">Mail Driver</InputLabel>
                            <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                label="Theme Color"
                                fullWidth
                            >
                                <MenuItem value="">
                                </MenuItem>
                                <MenuItem value={1}>xxx</MenuItem>
                                <MenuItem value={2}>yyy</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <Grid sx={{ display: 'flex' }}  >
                        <FormControl size="small" fullWidth>
                            <InputLabel htmlFor="component-outlined">Host</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label="Host"
                                type="text"
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <Grid sx={{ display: 'flex' }}  >
                        <FormControl size="small" fullWidth>
                            <InputLabel htmlFor="component-outlined">Port</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label="port"
                                type="text"
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <Grid sx={{ display: 'flex' }}  >
                        <FormControl size="small" fullWidth>
                            <InputLabel htmlFor="component-outlined">User Name</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label="user name"
                                type="text"
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <Grid sx={{ display: 'flex' }}  >
                        <FormControl size="small" fullWidth>
                            <InputLabel htmlFor="component-outlined">Password</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label="password"
                                type="text"
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <Grid sx={{ display: 'flex' }}  >
                        <FormControl size="small" fullWidth>
                            <InputLabel htmlFor="component-outlined">Encryption</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label="Encryption"
                                type="text"
                                placeholder='tls/ssl'
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <Grid sx={{ display: 'flex' }}  >
                        <FormControl size="small" fullWidth>
                            <InputLabel htmlFor="component-outlined">From Address</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label="From Address"
                                type="text"
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <Grid sx={{ display: 'flex' }}  >
                        <FormControl size="small" fullWidth>
                            <InputLabel htmlFor="component-outlined">From Name</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label="From name"
                                type="text"
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>
            <br />
            <Grid container sx={{ justifyContent: 'Right !important' }}>
                <Box  >
                    <Button sx={userStyle.buttonadd}>SEND TEST EMAIL</Button>
                </Box>
            </Grid>
        </Box>
    );
}