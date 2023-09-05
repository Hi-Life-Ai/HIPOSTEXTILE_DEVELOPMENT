import React from 'react';
import { Box, Grid, FormControl, InputLabel, } from '@mui/material';
import { userStyle } from '../../PageStyle';
import Selects from 'react-select'

export default function StocklabelCreate({ isSetngs, setIsSetngs }) {


    const optionswithtax = [
        { label: "None", value: "None" },
        { label: "Decimal", value: "Decimal" },
        { label: "Roundoff", value: "Roundoff" },
    ]

    return (
        <Box>
            <Grid container spacing={3} >
                <Grid item xs={12} sm={12} md={6} lg={8}>
                    <InputLabel htmlFor="component-outlined">Salesunitcost with tax</InputLabel>
                    <FormControl size="small" fullWidth>
                        <Selects
                            id="component-outlined"
                            placeholder={isSetngs.saleswithtax}
                            options={optionswithtax}
                            sx={userStyle.input}
                            onChange={(e) => {
                                setIsSetngs((prevState) => {
                                    return { ...prevState, saleswithtax: e.value };
                                });
                            }}
                            name="saleswithouttax"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={8}>
                    <InputLabel htmlFor="component-outlined">Salesunitcost without tax</InputLabel>
                    <FormControl size="small" fullWidth>
                        <Selects
                            id="component-outlined"
                            options={optionswithtax}
                            placeholder={isSetngs.saleswithouttax}
                            onChange={(e) => {
                                setIsSetngs((prevState) => {
                                    return { ...prevState, saleswithouttax: e.value };
                                });
                            }}
                            name="saleswithouttax"
                        />
                    </FormControl>
                </Grid>
            </Grid>

        </Box>
    );
}