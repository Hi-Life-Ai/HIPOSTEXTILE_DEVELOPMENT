
import React, { useContext } from 'react';
import { Box, Grid, Checkbox, Tooltip, IconButton } from '@mui/material';
import { userStyle } from '../../PageStyle';
import { FcInfo } from "react-icons/fc";

export default function Purchasecreate() {
    return (
        <Box sx={userStyle.formBorder}>
            <Grid container spacing={3} >
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Checkbox aria-label="Checkbox demo" label="Checkbox demo" defaultChecked />Enable editin product from purchase screen
                    <span>
                        <Tooltip title="If enabled product purchase price and selling price will be updated after a purchase is added or updated" arrow>
                            <IconButton size="small">
                                <FcInfo />
                            </IconButton>
                        </Tooltip>
                    </span>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Checkbox aria-label="Checkbox demo" label="Checkbox demo" defaultChecked />Enable Purchase Status
                    <span>
                        <Tooltip title="On disable all purchases will be marked as <i>Item Received</i>" arrow >
                            <IconButton size="small" >
                                <FcInfo />
                            </IconButton>
                        </Tooltip>
                    </span>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Checkbox aria-label="Checkbox demo" label="Checkbox demo" defaultChecked />Enable Lot number
                    <span>
                        <Tooltip title="This will enable you to enter Lot number for each purchase line in purchase screen" arrow>
                            <IconButton size="small">
                                <FcInfo />
                            </IconButton>
                        </Tooltip>
                    </span>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Checkbox aria-label="Checkbox demo" label="Checkbox demo" defaultChecked />Enable purchase order
                    <span>
                        <Tooltip title="A purchase order is a commercial document and first official offer issued by a buyer to a seller indicating types, quantities, and agreed prices for products or services. It is used to control the purchasing of products and services from external suppliers.Purchase orders can be an essential part of enterprise resource planning system orders." arrow>
                            <IconButton size="small">
                                <FcInfo />
                            </IconButton>
                        </Tooltip>
                    </span>
                </Grid>
            </Grid>
        </Box>
    );
}