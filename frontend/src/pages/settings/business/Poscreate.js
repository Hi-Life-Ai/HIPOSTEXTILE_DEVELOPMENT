import React, { useContext } from 'react';
import {
    Typography, Grid, Box, FormControl, FormGroup, FormControlLabel, InputLabel, OutlinedInput, TableHead, Checkbox, Tooltip, IconButton, Select,
    MenuItem, Table, TableContainer, TableBody, Paper
} from '@mui/material';
import { userStyle } from '../../PageStyle';
import { FcInfo } from "react-icons/fc";
import { StyledTableRow, StyledTableCell } from '../../../components/Table';

export default function Poscreate() {
    return (
        <Box>
            <TableContainer component={Paper} sx={{
                padding: 1,
                width: '100%',
                margin: 'auto',
                overflow: 'auto',
                boxShadow: 'none',
                "&::-webkit-scrollbar": {
                    width: 20
                },
                "&::-webkit-scrollbar-track": {
                    backgroundColor: 'pink'
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: 'blue'
                }
            }} >
                <Grid container spacing={3} >
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <h3>Add keyboard shortcuts:</h3>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography>
                            shortcut should be the names of the keys separated by '+',example:ctrl+shift+b,ctrl+h
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography variant='h6'>Available key names are:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography>
                            shift, ctrl, alt, backspace, tab, enter, return, capslock, esc, escape, space, pageup, pagedown, end, home,
                            left, up, right, down, ins, del, and plus
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} >
                        <Table style={{ minWidth: 200 }} aria-label="customized table">
                            <TableHead>
                                <StyledTableRow>
                                    <StyledTableCell><Typography variant='h5'>Operations</Typography></StyledTableCell>
                                    <StyledTableCell><Typography variant='h5'>Keyboard Shortcut</Typography></StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                <StyledTableRow>
                                    <StyledTableCell><Typography sx={userStyle.reportTableBoldtxt}>Express Checkout: </Typography></StyledTableCell>
                                    <StyledTableCell align="left"> <FormControl size="small" fullWidth>
                                        <InputLabel htmlFor="component-outlined">shift+e</InputLabel>
                                        <OutlinedInput
                                            id="component-outlined"
                                            label="shift+e"
                                            type="text"
                                        />
                                    </FormControl></StyledTableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell><Typography sx={userStyle.reportTableBoldtxt}>Pay & Checkout: </Typography></StyledTableCell>
                                    <StyledTableCell align="left"> <FormControl size="small" fullWidth>
                                        <InputLabel htmlFor="component-outlined">shift+p</InputLabel>
                                        <OutlinedInput
                                            id="component-outlined"
                                            label="shift+p"
                                            type="text"
                                        />
                                    </FormControl></StyledTableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell><Typography sx={userStyle.reportTableBoldtxt}>Draft: </Typography></StyledTableCell>
                                    <StyledTableCell align="left"> <FormControl size="small" fullWidth>
                                        <InputLabel htmlFor="component-outlined">shift+d</InputLabel>
                                        <OutlinedInput
                                            id="component-outlined"
                                            label="shift+d"
                                            type="text"
                                        />
                                    </FormControl></StyledTableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell><Typography sx={userStyle.reportTableBoldtxt}>Cancel: </Typography></StyledTableCell>
                                    <StyledTableCell align="left"> <FormControl size="small" fullWidth>
                                        <InputLabel htmlFor="component-outlined">shift+c</InputLabel>
                                        <OutlinedInput
                                            id="component-outlined"
                                            label="shift+c"
                                            type="text"
                                        />
                                    </FormControl></StyledTableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell><Typography sx={userStyle.reportTableBoldtxt}>Go to product quantity: </Typography></StyledTableCell>
                                    <StyledTableCell align="left"> <FormControl size="small" fullWidth>
                                        <InputLabel htmlFor="component-outlined">f2</InputLabel>
                                        <OutlinedInput
                                            id="component-outlined"
                                            label="f2"
                                            type="text"
                                        />
                                    </FormControl></StyledTableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell><Typography sx={userStyle.reportTableBoldtxt}>Weighing Scale: </Typography></StyledTableCell>
                                    <StyledTableCell align="left"> <FormControl size="small" fullWidth>
                                        <InputLabel htmlFor="component-outlined"></InputLabel>
                                        <OutlinedInput
                                            id="component-outlined"
                                            label="Scale"
                                            type="text"
                                        />
                                    </FormControl></StyledTableCell>
                                </StyledTableRow>
                            </TableBody>
                        </Table>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} >
                        <Table md={{ minWidth: 200, maxHeight: '5px', overflow: 'auto' }} aria-label="customized table">
                            <TableHead>
                                <StyledTableRow>
                                    <StyledTableCell><Typography variant='h5'>Operations</Typography></StyledTableCell>
                                    <StyledTableCell><Typography variant='h5'>Keyboard Shortcut</Typography></StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                <StyledTableRow>
                                    <StyledTableCell><Typography sx={userStyle.reportTableBoldtxt}>Edit Discount: </Typography></StyledTableCell>
                                    <StyledTableCell align="left"> <FormControl size="small" fullWidth>
                                        <InputLabel htmlFor="component-outlined">shift+i</InputLabel>
                                        <OutlinedInput
                                            id="component-outlined"
                                            label="shift+i"
                                            type="text"
                                        />
                                    </FormControl></StyledTableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell><Typography sx={userStyle.reportTableBoldtxt}>Edit Order Tax: </Typography></StyledTableCell>
                                    <StyledTableCell align="left"> <FormControl size="small" fullWidth>
                                        <InputLabel htmlFor="component-outlined">shift+t</InputLabel>
                                        <OutlinedInput
                                            id="component-outlined"
                                            label="shift+t"
                                            type="text"
                                        />
                                    </FormControl></StyledTableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell><Typography sx={userStyle.reportTableBoldtxt}>Add Payment Row: </Typography></StyledTableCell>
                                    <StyledTableCell align="left"> <FormControl size="small" fullWidth>
                                        <InputLabel htmlFor="component-outlined">shift+r</InputLabel>
                                        <OutlinedInput
                                            id="component-outlined"
                                            label="shift+r"
                                            type="text"
                                        />
                                    </FormControl></StyledTableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell><Typography sx={userStyle.reportTableBoldtxt}>Finalize Payment: </Typography></StyledTableCell>
                                    <StyledTableCell align="left"> <FormControl size="small" fullWidth>
                                        <InputLabel htmlFor="component-outlined">shift+f</InputLabel>
                                        <OutlinedInput
                                            id="component-outlined"
                                            label="shift+f"
                                            type="text"
                                        />
                                    </FormControl></StyledTableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell><Typography sx={userStyle.reportTableBoldtxt}>Add new product: </Typography></StyledTableCell>
                                    <StyledTableCell align="left">
                                        <FormControl size="small" fullWidth>
                                            <InputLabel htmlFor="component-outlined">f4</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                label="f4"
                                                type="text"
                                            />
                                        </FormControl>
                                    </StyledTableCell>
                                </StyledTableRow>
                            </TableBody>
                        </Table>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography variant='h5'>POS settings:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} label="Display Multiple Pay" value={setngs.displaymultiple} onChange={(e) => setSetngs({ ...setngs, displaymultiple: !setngs.displaymultiple })} />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} label="Disable Draft" value={setngs.disabledraft} onChange={(e) => setSetngs({ ...setngs, disabledraft: !setngs.disabledraft })} />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} label="Disable Express Checkout" value={setngs.disablexpress} onChange={(e) => setSetngs({ ...setngs, disablexpress: !setngs.disablexpress })} />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} label="Don't show product suggestion" value={setngs.showproduct} onChange={(e) => setSetngs({ ...setngs, showproduct: !setngs.showproduct })} />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} label="Don't show recent transcations" value={setngs.showrecent} onChange={(e) => setSetngs({ ...setngs, showrecent: !setngs.showrecent })} />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} label="Disable Discount" value={setngs.disablediscount} onChange={(e) => setSetngs({ ...setngs, disablediscount: !setngs.disablediscount })} />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} label="Disable order tax" value={setngs.disableorder} onChange={(e) => setSetngs({ ...setngs, disableorder: !setngs.disableorder })} />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} label="Subtotal Editable" value={setngs.subtotal} onChange={(e) => setSetngs({ ...setngs, subtotal: !setngs.subtotal })} />
                        </FormGroup>
                        <span>
                            <Tooltip title="Check this to make Subtotal field editable for each product in POS screen" arrow>
                                <IconButton size="small">
                                    <FcInfo />
                                </IconButton>
                            </Tooltip>
                        </span>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} label="Disable Suspend sale" value={setngs.disablesspend} onChange={(e) => setSetngs({ ...setngs, disablesspend: !setngs.disablesspend })} />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} label="Enable transcation date on POS screen" value={setngs.enabletransc} onChange={(e) => setSetngs({ ...setngs, enabletransc: !setngs.enabletransc })} />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} label="Enable service staff in product line" value={setngs.enableservicestaff} onChange={(e) => setSetngs({ ...setngs, enableservicestaff: !setngs.enableservicestaff })} />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} label="is service staff required" value={setngs.servicestaff} onChange={(e) => setSetngs({ ...setngs, servicestaff: !setngs.servicestaff })} />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} label="Disable credit sale buttton" value={setngs.disablecredit} onChange={(e) => setSetngs({ ...setngs, disablecredit: !setngs.disablecredit })} />
                        </FormGroup>
                        <span>
                            <Tooltip title="If enabled credit sale button will be shown in place of Card button on pos screen" arrow>
                                <IconButton size="small">
                                    <FcInfo />
                                </IconButton>
                            </Tooltip>
                        </span>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} label="Enable Weighing Scale" value={setngs.enableweighing} onChange={(e) => setSetngs({ ...setngs, enableweighing: !setngs.enableweighing })} />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} label="Show invoice scheme" value={setngs.showinvoice} onChange={(e) => setSetngs({ ...setngs, enableracks: !setngs.enableracks })} />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} label="Show invoice layout dropdown" value={setngs.printinvoice} onChange={(e) => setSetngs({ ...setngs, enableracks: !setngs.enableracks })} />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} label="print invoice on suspend" value={setngs.enableracks} onChange={(e) => setSetngs({ ...setngs, enableracks: !setngs.enableracks })} />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} label="Show pricing on product suggestion tooltip" value={setngs.enableracks} onChange={(e) => setSetngs({ ...setngs, enableracks: !setngs.enableracks })} />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}> </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}> </Grid>
                    <hr />
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography variant='h6'>Cash Denominations</Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <FormControl size="small" fullWidth>
                            <InputLabel htmlFor="component-outlined"></InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label=""
                                type="text"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography>Comma separated values Example: 100,200,500,2000</Typography>
                    </Grid>
                    <hr />
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography variant='h5'>Weighing Scale barcode Setting:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography>Configure barcode as per your weighing scale.</Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} lg={3}>
                        <FormControl size="small" fullWidth>
                            <InputLabel htmlFor="component-outlined">Prefix</InputLabel>
                            <OutlinedInput
                                id="component-outlined"
                                label=""
                                type="text"
                                value={setngs.editcusState}
                                onChange={(event) => { setSetngs({ ...setngs, editcusState: event.target.value }) }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={3}>
                        <Grid sx={{ display: 'flex' }}  >
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <InputLabel id="demo-select-small">Product sku length</InputLabel>
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    label="Product sku length"
                                    value={setngs.editcusState}
                                    onChange={(event) => { setSetngs({ ...setngs, editcusState: event.target.value }) }}
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
                    <Grid item xs={12} sm={6} md={3} lg={3}>
                        <Grid sx={{ display: 'flex' }}  >
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <InputLabel id="demo-select-small">Quantity integer part length</InputLabel>
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    label="Quantity integer part length"
                                    value={setngs.editcusState}
                                    onChange={(event) => { setSetngs({ ...setngs, editcusState: event.target.value }) }}
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
                    <Grid item xs={12} sm={6} md={3} lg={3}>
                        <Grid sx={{ display: 'flex' }}  >
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <InputLabel id="demo-select-small">Quantity fractional part length</InputLabel>
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    label="Quantity fractional part length"
                                    value={setngs.editcusState}
                                    onChange={(event) => { setSetngs({ ...setngs, editcusState: event.target.value }) }}
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
                </Grid>
            </TableContainer>
        </Box>
    );
}