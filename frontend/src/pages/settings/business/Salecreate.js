import React, { useContext } from 'react';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, FormGroup, FormControlLabel, Checkbox, Select, MenuItem, Tooltip, IconButton, Typography } from '@mui/material';
import { userStyle } from '../../PageStyle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PercentOutlinedIcon from '@mui/icons-material/PercentOutlined';
import { FcInfo } from "react-icons/fc";

export default function Salecreate({isSetngs, setIsSetngs}) {


    return (
        <Box>
            <Grid container spacing={3} >
                <Grid item xs={12} sm={12} md={6} lg={4}>
                    <InputLabel htmlFor="component-outlined">Default Sale Discount</InputLabel>
                    <Grid sx={{ display: 'flex' }}  >
                        <Grid sx={userStyle.spanIcons} >
                            <PercentOutlinedIcon />
                        </Grid>
                        <FormControl size="small" fullWidth>
                            <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={isSetngs.dsalediscount}
                                onChange={(e) => setIsSetngs({ ...isSetngs, dsalediscount: e.target.value })}
                                name="dsaledisc"
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4}>
                    <InputLabel id="demo-select-small">Default Sale Tax</InputLabel>
                    <Grid sx={{ display: 'flex' }}  >
                        <Grid sx={userStyle.spanIcons} >
                            <InfoOutlinedIcon />
                        </Grid>
                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                            <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                name="dsaletax"
                                value={isSetngs.dsaletax}
                                onChange={(e) => setIsSetngs({ ...isSetngs, dsaletax: e.target.value })}
                                fullWidth
                            >
                                <MenuItem value="TAX">TAX</MenuItem>
                            </Select>
                        </FormControl>

                    </Grid>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4}>
                    <InputLabel id="demo-select-small">Sales Commission Agent</InputLabel>
                    <Grid sx={{ display: 'flex' }}  >
                        <Grid sx={userStyle.spanIcons} >
                            <InfoOutlinedIcon />
                        </Grid>
                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                            <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                name="salescomagent"
                                value={isSetngs.salescomagent}
                                onChange={(e) => setIsSetngs({ ...isSetngs, salescomagent: e.target.value })}
                                fullWidth
                            >
                                <MenuItem value="Bisable">Bisable</MenuItem>
                                <MenuItem value="Logged in user">Logged in user</MenuItem>
                                <MenuItem value="Select from user's list">Select from user's list</MenuItem>
                                <MenuItem value="Select from commission agent's list">Select from commission agent's list</MenuItem>
                            </Select>
                        </FormControl>

                    </Grid>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4}>
                    <InputLabel id="demo-select-small">Commission Calculate Type</InputLabel>
                    <Grid sx={{ display: 'flex' }}  >
                        <Grid sx={userStyle.spanIcons} >
                            <InfoOutlinedIcon />
                        </Grid>
                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                            <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                name="comcaltype"
                                value={isSetngs.comcaltype}
                                onChange={(e) => setIsSetngs({ ...isSetngs, comcaltype: e.target.value })}
                                fullWidth
                            >
                                <MenuItem value="Invoice value">Invoice value</MenuItem>
                                <MenuItem value="Payment Received">Payment Received</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4}>
                    <InputLabel id="demo-select-small">Sales item Addition Method</InputLabel>
                    <Grid sx={{ display: 'flex' }}  >
                        <Grid sx={userStyle.spanIcons} >
                            <InfoOutlinedIcon />
                        </Grid>
                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                            <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                name="salesitemaddmethod"
                                value={isSetngs.salesitemaddmethod}
                                onChange={(e) => setIsSetngs({ ...isSetngs, salesitemaddmethod: e.target.value })}
                                fullWidth
                            >
                                <MenuItem value="Add item in new row">Add item in new row</MenuItem>
                                <MenuItem value="Increase item quantity if it already exists">Increase item quantity if it already exists</MenuItem>
                            </Select>
                        </FormControl>

                    </Grid>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4}>
                    <InputLabel id="demo-select-small">Amount rounding method
                        <Tooltip title="Round to nearest 
                                whole number:</b> 2.23 => 2, 2.50 => 3, 2.73 => 3 <br><b>Round to nearest 
                                decimal (multiple of 0.05):</b> 2.11 => 2.10, 2.12 => 2.10, 2.13 => 2.15" >
                            <FcInfo />
                        </Tooltip>
                    </InputLabel>
                    <Grid sx={{ display: 'flex' }}  >
                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                            <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                name="amountroundmethod"
                                value={isSetngs.amountroundmethod}
                                onChange={(e) => setIsSetngs({ ...isSetngs, amountroundmethod: e.target.value })}
                                fullWidth
                            >
                                <MenuItem value="None">None</MenuItem>
                                <MenuItem value="Round to nearest whole number">Round to nearest whole number</MenuItem>
                                <MenuItem value="Round to nearest decimal (multiple of 0.0.5)">Round to nearest decimal (multiple of 0.0.5)</MenuItem>
                                <MenuItem value="Round to nearest decimal (multiple of 0.1)">Round to nearest decimal (multiple of 0.1)</MenuItem>
                                <MenuItem value="Round to nearest decimal (multiple of 0.5)">Round to nearest decimal (multiple of 0.5)</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox />} label="Sales price is miminum selling price" value={isSetngs.minsellprice} onChange={(e) => setIsSetngs({ ...isSetngs, minsellprice: !isSetngs.minsellprice })} />
                    </FormGroup>
                    <span>
                        <Tooltip title="If this is enabled, on the POS or Sales screen default selling price will be the minimum selling price for the product. You cannot set price below the default selling price." arrow>
                            <IconButton>
                                <FcInfo />
                            </IconButton>
                        </Tooltip>
                    </span>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox />} label="Allow Overselling" value={isSetngs.aoverselling} onChange={(e) => setIsSetngs({ ...isSetngs, aoverselling: !isSetngs.aoverselling })} />
                    </FormGroup>
                    <span>
                        <Tooltip title="Check this field to allow a product to sell more than the available quantity. Oversold quantity will be adjusted automatically from future stock." arrow>
                            <IconButton>
                                <FcInfo />
                            </IconButton>
                        </Tooltip>
                    </span>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox />} label="Enable Sales Order" value={isSetngs.esalesorder} onChange={(e) => setIsSetngs({ ...isSetngs, esalesorder: !isSetngs.esalesorder })} />
                    </FormGroup>
                    <span>
                        <Tooltip title="The sales order, sometimes abbreviated as SO, is an order issued by a business or sole trader to a customer. A sales order may be for products and/or services." arrow>
                            <IconButton>
                                <FcInfo />
                            </IconButton>
                        </Tooltip>
                    </span>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography>Payment Link:
                        <span>
                            <Tooltip title="By enabling users can pay invoice using payment link" arrow>
                                <IconButton>
                                    <FcInfo />
                                </IconButton>
                            </Tooltip>
                        </span>
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox />} label="Enable Payment Link" value={isSetngs.epaymentlink} onChange={(e) => setIsSetngs({ ...isSetngs, epaymentlink: !isSetngs.epaymentlink })} />
                    </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography>Razorpay: (For INR India)
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                    <InputLabel htmlFor="component-outlined">Key ID</InputLabel>
                    <FormControl size="small" fullWidth>
                        <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={isSetngs.keyid}
                            onChange={(e) => setIsSetngs({ ...isSetngs, keyid: e.target.value })}
                            name="keyid"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                    <InputLabel htmlFor="component-outlined">Key Secret</InputLabel>
                    <FormControl size="small" fullWidth>
                        <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={isSetngs.keysecret}
                            onChange={(e) => setIsSetngs({ ...isSetngs, keysecret: e.target.value })}
                            name="keysecret"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}> </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography>Stripe:
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                    <InputLabel htmlFor="component-outlined">Stripe Public Key</InputLabel>
                    <FormControl size="small" fullWidth>
                        <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={isSetngs.stripepubkey}
                            onChange={(e) => setIsSetngs({ ...isSetngs, stripepubkey: e.target.value })}
                            name="stripepubkey"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                    <InputLabel htmlFor="component-outlined">Stripe Secret Key</InputLabel>
                    <FormControl size="small" fullWidth>
                        <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={isSetngs.stripeseckey}
                            onChange={(e) => setIsSetngs({ ...isSetngs, stripeseckey: e.target.value })}
                            name="stripeseckey"
                        />
                    </FormControl>
                </Grid>
            </Grid>
        </Box>
    );
}