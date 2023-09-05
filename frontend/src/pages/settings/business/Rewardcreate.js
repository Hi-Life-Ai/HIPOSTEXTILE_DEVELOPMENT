import { Typography } from "@mui/material";
import React, { useContext } from "react";
import { Box, Grid, FormControl, InputLabel, Checkbox, OutlinedInput, Tooltip, IconButton, Select, MenuItem } from '@mui/material';
import { userStyle } from '../../PageStyle';
import { FcInfo } from "react-icons/fc";
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';

export default function Rewardcreate() {

   
    return (
        <Box>

            <Box>
                <Grid container spacing={3} >
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Checkbox aria-label="Checkbox demo" label="Checkbox demo" defaultChecked />Enable Reward Point
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Grid sx={{ display: 'flex' }}  >
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Reward Point Display Name</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="From name"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}> </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography>
                            Earning Points Settings:
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Grid sx={{ display: 'flex' }}  >
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Amount spend for unit point</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Amount spend for unit point"
                                    type="text"
                                />
                            </FormControl>
                            <Tooltip  title="amount spend " >
                                <IconButton>
                                    <FcInfo />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Grid sx={{ display: 'flex' }}  >
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">minimum order total to earn reward</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="minimum order total to earn reward"
                                    type="text"
                                />
                            </FormControl>
                            <Tooltip  title="minimum order " >
                                <IconButton>
                                    <FcInfo />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Grid sx={{ display: 'flex' }}  >
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">minimum points per order</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="minimum points per order"
                                    type="text"
                                />
                            </FormControl>
                            <Tooltip  title="minimum order " >
                                <IconButton>
                                    <FcInfo />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <br />
            <Box sx={userStyle.formBorder}>
                <Grid container spacing={2} >
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography>
                            Redeem Points Settings:
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Grid sx={{ display: 'flex' }}  >
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Reedem amount per unit point</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Reedem amount per unit point"
                                    type="text"
                                />
                            </FormControl>
                            <Tooltip  title="minimum order " >
                                <IconButton>
                                    <FcInfo />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Grid sx={{ display: 'flex' }}  >
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Minimum order total to redem points</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Minimum order total to redem points"
                                    type="text"
                                />
                            </FormControl>
                            <Tooltip  title="minimum order " >
                                <IconButton>
                                    <FcInfo />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Grid sx={{ display: 'flex' }}  >
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Minimum redeem point</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Minimum redeem point"
                                    type="text"
                                />
                            </FormControl>
                            <Tooltip  title="minimum order " >
                                <IconButton>
                                    <FcInfo />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Grid sx={{ display: 'flex' }}  >
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Maximum redeem point per order</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Maximum redeem point per order"
                                    type="text"
                                />
                            </FormControl>
                            <Tooltip  title="minimum order " >
                                <IconButton>
                                    <FcInfo />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <Grid sx={{ display: 'flex' }}  >
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Maximum redeem Expiry period</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Maximum redeem Expiry period"
                                    type="text"
                                />
                            </FormControl>
                            <Grid sx={userStyle.spanTextRadio}><RemoveOutlinedIcon style={{fontSize:'large'}}/></Grid>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <InputLabel id="demo-select-small">Year</InputLabel>
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    label="Please Select"
                                    // value={editcusModForm.editcusPayTerm}
                                    // onChange={(event) => { setEditCusModForm({ ...editcusModForm, editcusPayTerm: event.target.value }) }}
                                    fullWidth
                                >
                                    <MenuItem value="">
                                        <em>Year</em>
                                    </MenuItem>
                                    <MenuItem value={1}>month</MenuItem>
                                    <MenuItem value={2}>Days</MenuItem>
                                </Select>
                            </FormControl>
                            <Tooltip  title="minimum order " >
                                <IconButton>
                                    <FcInfo />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Box >
    );
}