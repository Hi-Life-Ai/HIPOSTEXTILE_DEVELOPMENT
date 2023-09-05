import React, { useState, useContext } from 'react';
import { Box, Grid, InputLabel, FormControl, OutlinedInput, MenuItem, Select, Typography } from '@mui/material';
import { userStyle } from '../../PageStyle';

export default function Smscreate() {

//*** Nexmo Key ****/
const [shownNexmo, setShownNexmo] = useState(false);
//*** Twilio Key ****/
const [shownTwilio, setShownTwilio] = useState(false);
// *** other Key ****//
const [shownOther, setShownOther] = useState(true);

return (
        <Box >
            <Grid container spacing={3} >
                <Grid item xs={12} sm={6} md={4} lg={4}>
                        <FormControl size="small" fullWidth>
                            <InputLabel id="demo-select-small">SMS Service</InputLabel>
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    label="sms service"
                                    fullWidth
                                    defaultValue={1}
                                >
                                <MenuItem value={1} onClick={() => { setShownOther(true); setShownTwilio(false); setShownNexmo(false) }}>other</MenuItem>
                                <MenuItem value={2} onClick={() => { setShownNexmo(true); setShownTwilio(false); setShownOther(false) }}>Nexmo</MenuItem>
                                <MenuItem value={3} onClick={() => { setShownTwilio(true); setShownNexmo(false); setShownOther(false) }}>Twilo</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}> </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}> </Grid>
            {/* Nexmo inputs start*/}
                {shownNexmo ?
                    <>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Nexmo Key</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Nexmo Key"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Nexmo Secret</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Nexmo Secret"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">From</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="From"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                    </>
                    : null}
            {/* Nexmo inputs end*/}

            {/* Twilio inputs start*/}
                {shownTwilio ?
                    <>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Twilio Account SID</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Twilio Account SID"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Twilio Access Token</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Twilio Access Token"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">From</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="From"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                    </>
                    : null}
            {/* Twilio inputs end*/}

            {/* other inputs start*/}
                {shownOther ?
                    <>                <Grid item xs={12} sm={12} md={3} lg={3}>
                        <FormControl size="small" fullWidth>
                            <InputLabel htmlFor="component-outlined">URL</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label="urL"
                                type="text"
                            />
                        </FormControl>
                    </Grid>
                        <Grid item xs={12} sm={12} md={3} lg={3}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Send to parameter name</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Send to parameter name"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={3} lg={3}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Message parameter name</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Message parameter name"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} lg={3}>
                            <Grid sx={{ display: 'flex' }}  >
                                <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                    <InputLabel id="demo-select-small">Request Method</InputLabel>
                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        label="Request Method"
                                        fullWidth
                                    >
                                        <MenuItem value="">
                                        </MenuItem>
                                        <MenuItem value={1} >GET</MenuItem>
                                        <MenuItem value={2} >POST</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br />
                        <br />

                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Header 1 key</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Header 1 key"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Header 1 value</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Header 1 value"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}> </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Header 2 key</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Header 1 key"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Header 2 value</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Header 1 value"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}> </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Header 3 key</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Header 1 key"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Header 3 value</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Header 1 value"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}> </Grid>
                        <br />

                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Parameter 1 key</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Parameter 1 key"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Parameter 1 value:</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Parameter 1 value:"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}> </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Parameter 2 key</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Parameter 1 key"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Parameter 2 value:</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Parameter 1 value:"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}> </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Parameter 3 key</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Parameter 1 key"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Parameter 3 value:</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Parameter 1 value:"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}> </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Parameter 4 key</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Parameter 1 key"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Parameter 4 value:</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Parameter 1 value:"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}> </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Parameter 5 key</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Parameter 1 key"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Parameter 5 value:</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Parameter 1 value:"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}> </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Parameter 6 key</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Parameter 1 key"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Parameter 6 value:</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Parameter 1 value:"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}> </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Parameter 7 key</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Parameter 1 key"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Parameter 7 value:</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Parameter 1 value:"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}> </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Parameter 8 key</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Parameter 1 key"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Parameter 8 value:</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Parameter 1 value:"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}> </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Parameter 9 key</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Parameter 1 key"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Parameter 9 value:</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Parameter 1 value:"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}> </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Parameter 10 key</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Parameter 10 key"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel htmlFor="component-outlined">Parameter 10 value:</InputLabel>
                                <OutlinedInput
                                    id="component-outlined"
                                    label="Parameter 10 value:"
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}> </Grid>
                        <br />
                        <Grid item xs={12} sm={12} md={2} lg={2}> </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={8}>
                            <Grid sx={{ display: 'flex', }} >
                                <FormControl size="small" sx={{ width: '80%' }} >
                                    <InputLabel htmlFor="component-outlined">Custom Field4</InputLabel>
                                    <OutlinedInput
                                        id="component-outlined"
                                        label="Custom Field1"
                                        type="text"
                                    />
                                </FormControl>
                                <Grid sx={userStyle.spanText}>
                                        <Typography>send sms test</Typography>    
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={2} lg={2}> </Grid>
                    </>
                    : null}
          {/* other inputs start*/}
            </Grid>
        </Box>
    );
}