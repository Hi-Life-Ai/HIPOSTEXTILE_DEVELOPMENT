const [show, setShow] = useState([])

const [openview, setOpenview] = useState(false);
const handleClickOpenview = () => {
    setOpenview(true);
};
const handleCloseview = () => {
    setOpenview(false);
};




{allProductsList.length > 0 &&
                                allProductsList.map((data, i) => {
                                    return (
                                        <>
                                            {i == 0 ?
                                                (<StyledTableRow key={i} >
                                                    <TableCell colSpan={4} sx={{ padding: '5px' }}>
                                                        <Grid container spacing={1}>
                                                            <Grid item md={12} sx={{ marginTop: '-67px' }}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Product Name</Typography>
                                                                <FormControl fullWidth>
                                                                    <TextField size='small' value={data?.prodname} />
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item md={2.5}>
                                                                <Grid container spacing={1} sx={{ marginTop: '34px' }}>
                                                                    <Grid item md={12}>
                                                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Lot No:</Typography>
                                                                        <FormControl size="small" fullWidth>
                                                                            <TextField size='small'
                                                                                sx={userStyle.input}
                                                                                type='text'
                                                                                value={data?.lotnumber}
                                                                                onChange={(e) => {
                                                                                    productUserInput(i, "lotnumber", e.target.value, "Lotnumber");
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={12}>
                                                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Purchase Tax</Typography>
                                                                        <FormControl size="small" fullWidth>
                                                                            <Select
                                                                                value={data?.purchasetabletax}
                                                                                onChange={(e) => productUserInput(i, "purchasetabletax", e.target.value, "purchasetablechange")}
                                                                                MenuProps={{
                                                                                    PaperProps: {
                                                                                        style: {
                                                                                            maxHeight: 200
                                                                                        },
                                                                                    },
                                                                                }}
                                                                                fullWidth
                                                                            >
                                                                                <MenuItem value="None" >None</MenuItem>
                                                                                <MenuItem value="Exclusive" >Exclusive</MenuItem>
                                                                                <MenuItem value="Inclusive" >Inclusive</MenuItem>
                                                                            </Select>
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={12}>
                                                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Tax Slab</Typography>
                                                                        <FormControl size="small" fullWidth>
                                                                            <Select
                                                                                MenuProps={{
                                                                                    PaperProps: {
                                                                                        style: {
                                                                                            maxHeight: 200
                                                                                        },
                                                                                    },
                                                                                }}
                                                                                value={data?.purchasetax}
                                                                            >
                                                                                <MenuItem value="None" onClick={(e) => handleChangeTax(i, "None", 0, [])}>None</MenuItem>
                                                                                {taxrates && (
                                                                                    taxrates.map((row, index) => (
                                                                                        <MenuItem value={row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate} key={index} onClick={(e) => handleChangeTax(i, row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate, row.taxrate, row.subtax)}>{row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate}</MenuItem>
                                                                                    ))
                                                                                )}
                                                                            </Select>
                                                                        </FormControl>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item md={4}>
                                                                <Grid container spacing={1}>
                                                                    <Grid item md={12}>
                                                                        <Grid container>
                                                                            <Grid item md={12}>
                                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Enter Rate</Typography>
                                                                                <FormControl size="small" fullWidth>
                                                                                    <TextField size='small'
                                                                                        sx={userStyle.input}
                                                                                        type='number'
                                                                                        value={data?.enteramt}
                                                                                        onChange={(e) => {
                                                                                            productUserInput(i, "enteramt", e.target.value, "Enteramt");
                                                                                        }}
                                                                                    />
                                                                                </FormControl>
                                                                            </Grid>
                                                                            <Grid item md={4}>

                                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Qty</Typography>
                                                                                <FormControl size="small" fullWidth>
                                                                                    <TextField size='small'
                                                                                        sx={userStyle.input}
                                                                                        type='number'
                                                                                        value={data?.quantity}
                                                                                        onChange={(e) => {
                                                                                            productUserInput(i, "quantity", e.target.value, "Quantity");
                                                                                        }}
                                                                                    />
                                                                                </FormControl>
                                                                            </Grid>
                                                                            <Grid item md={8}>
                                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit</Typography>
                                                                                <FormControl size="small" fullWidth>
                                                                                    <Select
                                                                                        // value={data?.quantityunit}
                                                                                        value={data?.quantityunit}
                                                                                        MenuProps={{
                                                                                            PaperProps: {
                                                                                                style: {
                                                                                                    maxHeight: 200
                                                                                                },
                                                                                            },
                                                                                        }}
                                                                                        fullWidth
                                                                                    >
                                                                                        {allUnits && (
                                                                                            allUnits.map((row, index) => (
                                                                                                <MenuItem value={row.unit} key={index} onClick={(e) => handleChangeUnit(i, row.unit)}>{row.unit}</MenuItem>
                                                                                            ))
                                                                                        )}
                                                                                    </Select>
                                                                                </FormControl>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                    <Grid item md={12}>
                                                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Total Pcs.</Typography>
                                                                        <FormControl size="small" fullWidth>
                                                                            <TextField size='small'
                                                                                value={data?.quantitytotalpieces}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={12}>
                                                                        <Grid container>
                                                                            <Grid item md={4}>
                                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Free</Typography>
                                                                                <FormControl size="small" fullWidth>
                                                                                    <TextField size='small'
                                                                                        style={{
                                                                                            '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                                                width: '150px !important'
                                                                                            }
                                                                                        }}
                                                                                        sx={userStyle.input}
                                                                                        type='number'
                                                                                        value={data?.freeitem}
                                                                                        onChange={(e) => {
                                                                                            productUserInput(i, "freeitem", e.target.value, "Free");
                                                                                        }}
                                                                                    />
                                                                                </FormControl>
                                                                            </Grid>
                                                                            <Grid item md={8}>
                                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit</Typography>
                                                                                <FormControl size="small" fullWidth>
                                                                                    <Select
                                                                                        value={data?.freeitemunit}
                                                                                        MenuProps={{
                                                                                            PaperProps: {
                                                                                                style: {
                                                                                                    maxHeight: 200
                                                                                                },
                                                                                            },
                                                                                        }}
                                                                                        fullWidth
                                                                                        sx={{
                                                                                            '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                                                width: '150px !important'
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        {allUnits && (
                                                                                            allUnits.map((row, index) => (
                                                                                                <MenuItem value={row.unit} key={index} onClick={(e) => handleChangeFreeUnit(i, row.unit)}>{row.unit}</MenuItem>
                                                                                            ))
                                                                                        )}
                                                                                    </Select>
                                                                                </FormControl>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item md={3.5}>
                                                                <Grid container spacing={1} sx={{ marginTop: '34px' }}>
                                                                    <Grid item md={12}>
                                                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Discount type</Typography>
                                                                        <FormControl size="small" fullWidth>
                                                                            <Select
                                                                                value={data?.distypemod}
                                                                                onChange={(e) => productUserInput(i, "distypemod", e.target.value, "Discountmode")}
                                                                            >
                                                                                <MenuItem value="None">None</MenuItem>
                                                                                <MenuItem value="Fixed">Fixed</MenuItem>
                                                                                <MenuItem value="Amount" >Amount</MenuItem>
                                                                                <MenuItem value="Percentage">Percentage</MenuItem>
                                                                            </Select>
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item md={12}>
                                                                        <Grid container>
                                                                            <Grid item md={6} >
                                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Disc.Val</Typography>
                                                                                <FormControl size="small" fullWidth>
                                                                                    <TextField size='small'
                                                                                        type="number"
                                                                                        sx={userStyle.input}
                                                                                        value={data?.disvaluemod}
                                                                                        onChange={(e) => productUserInput(i, "disvaluemod", e.target.value, "Discountvalue")}
                                                                                    />
                                                                                </FormControl>
                                                                            </Grid>
                                                                            <Grid item md={6}>
                                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Disc.Amt</Typography>
                                                                                <FormControl size="small" fullWidth>
                                                                                    <TextField size='small'
                                                                                        type="text"
                                                                                        value={data?.differenceamt}
                                                                                    />
                                                                                </FormControl>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                    <Grid item md={12}>
                                                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Net Cost (After Discount)</Typography>
                                                                        <OutlinedInput
                                                                            size="small"
                                                                            id="component-outlined"
                                                                            value={data?.netcostafterdiscount}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item md={2}>
                                                                <Grid container spacing={1}>
                                                                    <Grid item md={12}>
                                                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Exc Tax</Typography>
                                                                        <OutlinedInput size='small'
                                                                            type="text"
                                                                            value={data?.purchaseexcludetax}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item md={12}>
                                                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Alphaarate</Typography>
                                                                        <OutlinedInput size='small'
                                                                            type="text"
                                                                            value={data?.excalpha}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item md={12}>
                                                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Inc Tax</Typography>
                                                                        <OutlinedInput size='small'
                                                                            type="text"
                                                                            value={data?.pruchaseincludetax}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item md={12}>
                                                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Alphaarate</Typography>
                                                                        <OutlinedInput size='small'
                                                                            type="text"
                                                                            value={data?.incalpha}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </TableCell>
                                                    <TableCell sx={{ maxWidth: '175px', padding: '5px' }}>
                                                        <Grid container spacing={1}>
                                                            <Grid item md={12}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>SKU</Typography>
                                                                <OutlinedInput size='small'
                                                                    value={data?.sku}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <InputLabel sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit Cost <br />(Before Discount)</InputLabel>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.unitcostbeforediscount}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Net Cost <br /> (Before Discount)</Typography>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.netcostbeforediscount}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit Cost <br />(After Discount)</Typography>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.unitcostafterdiscount}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Net Cost <br />(After Discount)</Typography>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.netcostafterdiscount}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </TableCell>
                                                    <TableCell sx={{ maxWidth: '175px', padding: '5px' }}>
                                                        <Grid container spacing={1}>
                                                            {data?.hsn ?
                                                                (
                                                                    <>
                                                                        <Grid item md={12}>
                                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Product Tax</Typography>
                                                                            <OutlinedInput size='small'
                                                                                value={data?.hsn}
                                                                                sx={{
                                                                                    '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                                        width: '80px'
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </Grid>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Grid item md={12}>
                                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Product Tax</Typography>
                                                                            <OutlinedInput size='small'
                                                                                value={data?.applicabletax}
                                                                                sx={{
                                                                                    '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                                        width: '80px'
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </Grid>
                                                                    </>
                                                                )
                                                            }

                                                            <Grid item md={12}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit  <br /> (Tax Amount)</Typography>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.unitcosttaxamount}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Net Tax <br />(Tax Amount)</Typography>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.netcosttaxamount}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit Cost <br /> (With Tax)</Typography>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.unitcostwithtax}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Net Cost <br />(With Tax)</Typography>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.netcostwithtax}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </TableCell>
                                                    <TableCell sx={{ maxWidth: '175px', padding: '5px' }}>
                                                        <Grid container spacing={1}>
                                                            <Grid item md={12} sx={{ marginTop: '-45px' }}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Margin%</Typography>
                                                                <OutlinedInput size='small'
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px !important'
                                                                        },
                                                                        '& input[type=number]': {
                                                                            'MozAppearance': 'textfield' //#8b5cf6
                                                                        },
                                                                        '& input[type=number]::-webkit-outer-spin-button': {
                                                                            'WebkitAppearance': 'none',
                                                                            margin: 0
                                                                        },
                                                                        '& input[type=number]::-webkit-inner-spin-button': {
                                                                            'WebkitAppearance': 'none',
                                                                            margin: 0
                                                                        }
                                                                    }}
                                                                    type='number'
                                                                    value={data?.margin}
                                                                    onChange={(e) => {
                                                                        productUserInput(i, "margin", e.target.value, "Margin data")
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Sale Unit Cost <br />(Without Tax)</Typography>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.sellingpriceunitwithoutcost}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Sale Tax Type</Typography>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.sellingpricetax}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Sale Tax Amount</Typography>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.saletaxamount}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>

                                                            <Grid item md={12}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Sale Unit Cost <br />(With Tax)</Typography>
                                                                <OutlinedInput
                                                                    size="small"
                                                                    id="component-outlined"
                                                                    value={data?.sellingpriceunitcost}
                                                                    sx={{
                                                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                            width: '80px'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </TableCell>
                                                    <TableCell>
                                                        <AiOutlineClose style={{ color: 'red', fontWeight: '900', cursor: 'pointer', fontSize: 'large' }} onClick={(e) => deleteRow(i, e)} />
                                                    </TableCell>
                                                </StyledTableRow>)
                                                :
                                                <StyledTableRow key={i} >
                                                    <TableCell colSpan={10} sx={{ padding: '5px' }}>
                                                        <Grid container spacing={1}>
                                                            <Grid item md={7.5} >
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Product Name</Typography>
                                                                <FormControl fullWidth>
                                                                    <TextField size='small' value={data?.prodname} />
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item md={1}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Purchase Tax</Typography>
                                                                <FormControl size="small" fullWidth>
                                                                    <Select
                                                                        value={data?.purchasetabletax}
                                                                        onChange={(e) => productUserInput(i, "purchasetabletax", e.target.value, "purchasetablechange")}
                                                                        MenuProps={{
                                                                            PaperProps: {
                                                                                style: {
                                                                                    maxHeight: 200
                                                                                },
                                                                            },
                                                                        }}
                                                                        fullWidth
                                                                    >
                                                                        <MenuItem value="None" >None</MenuItem>
                                                                        <MenuItem value="Exclusive" >Exclusive</MenuItem>
                                                                        <MenuItem value="Inclusive" >Inclusive</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item md={1}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Tax Slab</Typography>
                                                                <FormControl size="small" fullWidth>
                                                                    <Select
                                                                        MenuProps={{
                                                                            PaperProps: {
                                                                                style: {
                                                                                    maxHeight: 200
                                                                                },
                                                                            },
                                                                        }}
                                                                        value={data?.purchasetax}
                                                                    >
                                                                        <MenuItem value="None" onClick={(e) => handleChangeTax(i, "None", 0, [])}>None</MenuItem>
                                                                        {taxrates && (
                                                                            taxrates.map((row, index) => (
                                                                                <MenuItem value={row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate} key={index} onClick={(e) => handleChangeTax(i, row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate, row.taxrate, row.subtax)}>{row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate}</MenuItem>
                                                                            ))
                                                                        )}
                                                                    </Select>
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item md={1}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Enter Rate</Typography>
                                                                <FormControl size="small" fullWidth>
                                                                    <TextField size='small'
                                                                        sx={userStyle.input}
                                                                        type='number'
                                                                        value={data?.enteramt}
                                                                        onChange={(e) => {
                                                                            productUserInput(i, "enteramt", e.target.value, "Enteramt");
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item md={0.8}>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Qty</Typography>
                                                                <FormControl size="small" fullWidth>
                                                                    <TextField size='small'
                                                                        sx={userStyle.input}
                                                                        type='number'
                                                                        value={data?.quantity}
                                                                        onChange={(e) => {
                                                                            productUserInput(i, "quantity", e.target.value, "Quantity");
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item md={0.7} sx={{ marginTop: "30px", display: "flex", justifyContent: "space-evenly" }}>
                                                                <AiOutlineClose style={{ color: 'red', fontWeight: '900', cursor: 'pointer', fontSize: 'large' }} onClick={(e) => deleteRow(i, e)} />
                                                                <VisibilityOutlinedIcon style={{ fontSize: 'large', cursor: 'pointer', color: "#357AE8" }} onClick={(e) => { handleClickOpenview(); setShow(data) }} />
                                                            </Grid>
                                                        </Grid>
                                                    </TableCell>
                                                </StyledTableRow >
                                            }

                                        </>
                                    );
                                }
                                )}
                                
                                
                                 <Dialog open={openview} fullWidth maxWidth={'xl'} onClose={handleCloseview} >
            <DialogContent sx={{ maxWidth: "100%", alignItems: "center" }}>
                {/* {console.error(show)}
                {show?.length > 0 &&
                    show?.map((data, i) => { */}
                <StyledTableRow>
                    <TableCell colSpan={4} sx={{ padding: '5px' }}>
                        <Grid container spacing={1}>
                            <Grid item md={12} sx={{ marginTop: '-67px' }}>
                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Product Name</Typography>
                                <FormControl fullWidth>
                                    <TextField size='small' value={show?.prodname} />
                                </FormControl>
                            </Grid>
                            <Grid item md={2.5}>
                                <Grid container spacing={1} sx={{ marginTop: '34px' }}>
                                    <Grid item md={12}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Lot No:</Typography>
                                        <FormControl size="small" fullWidth>
                                            <TextField size='small'
                                                sx={userStyle.input}
                                                type='text'
                                                value={show?.lotnumber}
                                            // onChange={(e) => {
                                            //     productUserInput(i, "lotnumber", e.target.value, "Lotnumber");
                                            // }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={12}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Purchase Tax</Typography>
                                        <FormControl size="small" fullWidth>
                                            <Select
                                                value={show?.purchasetabletax}
                                                // onChange={(e) => productUserInput(i, "purchasetabletax", e.target.value, "purchasetablechange")}
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200
                                                        },
                                                    },
                                                }}
                                                fullWidth
                                            >
                                                <MenuItem value="None" >None</MenuItem>
                                                <MenuItem value="Exclusive" >Exclusive</MenuItem>
                                                <MenuItem value="Inclusive" >Inclusive</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={12}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Tax Slab</Typography>
                                        <FormControl size="small" fullWidth>
                                            <Select
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200
                                                        },
                                                    },
                                                }}
                                                value={show?.purchasetax}
                                            >
                                                <MenuItem value="None"
                                                // onClick={(e) => handleChangeTax(i, "None", 0, [])}
                                                >None</MenuItem>
                                                {taxrates && (
                                                    taxrates.map((row, index) => (
                                                        <MenuItem value={row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate} key={index}
                                                        // onClick={(e) => handleChangeTax(i, row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate, row.taxrate, row.subtax)}
                                                        >
                                                            {row.taxname + '@' + row.taxrate || row.hsn + '@' + row.taxrate}
                                                        </MenuItem>
                                                    ))
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item md={4}>
                                <Grid container spacing={1}>
                                    <Grid item md={12}>
                                        <Grid container>
                                            <Grid item md={12}>
                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Enter Rate</Typography>
                                                <FormControl size="small" fullWidth>
                                                    <TextField size='small'
                                                        sx={userStyle.input}
                                                        type='number'
                                                        value={show?.enteramt}
                                                    // onChange={(e) => {
                                                    //     productUserInput(i, "enteramt", e.target.value, "Enteramt");
                                                    // }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={4}>

                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Qty</Typography>
                                                <FormControl size="small" fullWidth>
                                                    <TextField size='small'
                                                        sx={userStyle.input}
                                                        type='number'
                                                        value={show?.quantity}
                                                    // onChange={(e) => {
                                                    //     productUserInput(i, "quantity", e.target.value, "Quantity");
                                                    // }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={8}>
                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit</Typography>
                                                <FormControl size="small" fullWidth>
                                                    <Select
                                                        // value={data?.quantityunit}
                                                        value={show?.quantityunit}
                                                        MenuProps={{
                                                            PaperProps: {
                                                                style: {
                                                                    maxHeight: 200
                                                                },
                                                            },
                                                        }}
                                                        fullWidth
                                                    >
                                                        {allUnits && (
                                                            allUnits.map((row, index) => (
                                                                <MenuItem value={row.unit} key={index}
                                                                // onClick={(e) => handleChangeUnit(i, row.unit)}
                                                                >{row.unit}</MenuItem>
                                                            ))
                                                        )}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={12}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Total Pcs.</Typography>
                                        <FormControl size="small" fullWidth>
                                            <TextField size='small'
                                                value={show?.quantitytotalpieces}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={12}>
                                        <Grid container>
                                            <Grid item md={4}>
                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Free</Typography>
                                                <FormControl size="small" fullWidth>
                                                    <TextField size='small'
                                                        style={{
                                                            '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                width: '150px !important'
                                                            }
                                                        }}
                                                        sx={userStyle.input}
                                                        type='number'
                                                        value={show?.freeitem}
                                                    // onChange={(e) => {
                                                    //     productUserInput(i, "freeitem", e.target.value, "Free");
                                                    // }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={8}>
                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit</Typography>
                                                <FormControl size="small" fullWidth>
                                                    <Select
                                                        value={show?.freeitemunit}
                                                        MenuProps={{
                                                            PaperProps: {
                                                                style: {
                                                                    maxHeight: 200
                                                                },
                                                            },
                                                        }}
                                                        fullWidth
                                                        sx={{
                                                            '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                                width: '150px !important'
                                                            }
                                                        }}
                                                    >
                                                        {allUnits && (
                                                            allUnits.map((row, index) => (
                                                                <MenuItem value={row.unit} key={index}
                                                                // onClick={(e) => handleChangeFreeUnit(i, row.unit)}
                                                                >{row.unit}</MenuItem>
                                                            ))
                                                        )}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item md={3.5}>
                                <Grid container spacing={1} sx={{ marginTop: '34px' }}>
                                    <Grid item md={12}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Discount type</Typography>
                                        <FormControl size="small" fullWidth>
                                            <Select
                                                value={show?.distypemod}
                                            // onChange={(e) => productUserInput(i, "distypemod", e.target.value, "Discountmode")}
                                            >
                                                <MenuItem value="None">None</MenuItem>
                                                <MenuItem value="Fixed">Fixed</MenuItem>
                                                <MenuItem value="Amount" >Amount</MenuItem>
                                                <MenuItem value="Percentage">Percentage</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={12}>
                                        <Grid container>
                                            <Grid item md={6} >
                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Disc.Val</Typography>
                                                <FormControl size="small" fullWidth>
                                                    <TextField size='small'
                                                        type="number"
                                                        sx={userStyle.input}
                                                        value={show?.disvaluemod}
                                                    // onChange={(e) => productUserInput(i, "disvaluemod", e.target.value, "Discountvalue")}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={6}>
                                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Disc.Amt</Typography>
                                                <FormControl size="small" fullWidth>
                                                    <TextField size='small'
                                                        type="text"
                                                        value={show?.differenceamt}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={12}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Net Cost (After Discount)</Typography>
                                        <OutlinedInput
                                            size="small"
                                            id="component-outlined"
                                            value={show?.netcostafterdiscount}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item md={2}>
                                <Grid container spacing={1}>
                                    <Grid item md={12}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Exc Tax</Typography>
                                        <OutlinedInput size='small'
                                            type="text"
                                            value={show?.purchaseexcludetax}
                                        />
                                    </Grid>
                                    <Grid item md={12}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Alphaarate</Typography>
                                        <OutlinedInput size='small'
                                            type="text"
                                            value={show?.excalpha}
                                        />
                                    </Grid>
                                    <Grid item md={12}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Inc Tax</Typography>
                                        <OutlinedInput size='small'
                                            type="text"
                                            value={show?.pruchaseincludetax}
                                        />
                                    </Grid>
                                    <Grid item md={12}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Alphaarate</Typography>
                                        <OutlinedInput size='small'
                                            type="text"
                                            value={show?.incalpha}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </TableCell>
                    <TableCell sx={{ maxWidth: '175px', padding: '5px' }}>
                        <Grid container spacing={1}>
                            <Grid item md={12}>
                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>SKU</Typography>
                                <OutlinedInput size='small'
                                    value={show?.sku}
                                    sx={{
                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                            width: '80px'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item md={12}>
                                <InputLabel sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit Cost <br />(Before Discount)</InputLabel>
                                <OutlinedInput
                                    size="small"
                                    id="component-outlined"
                                    value={show?.unitcostbeforediscount}
                                    sx={{
                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                            width: '80px'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Net Cost <br /> (Before Discount)</Typography>
                                <OutlinedInput
                                    size="small"
                                    id="component-outlined"
                                    value={show?.netcostbeforediscount}
                                    sx={{
                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                            width: '80px'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit Cost <br />(After Discount)</Typography>
                                <OutlinedInput
                                    size="small"
                                    id="component-outlined"
                                    value={show?.unitcostafterdiscount}
                                    sx={{
                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                            width: '80px'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Net Cost <br />(After Discount)</Typography>
                                <OutlinedInput
                                    size="small"
                                    id="component-outlined"
                                    value={show?.netcostafterdiscount}
                                    sx={{
                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                            width: '80px'
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </TableCell>
                    <TableCell sx={{ maxWidth: '175px', padding: '5px' }}>
                        <Grid container spacing={1}>
                            {show?.hsn ?
                                (
                                    <>
                                        <Grid item md={12}>
                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Product Tax</Typography>
                                            <OutlinedInput size='small'
                                                value={show?.hsn}
                                                sx={{
                                                    '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                        width: '80px'
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </>
                                ) : (
                                    <>
                                        <Grid item md={12}>
                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Product Tax</Typography>
                                            <OutlinedInput size='small'
                                                value={show?.applicabletax}
                                                sx={{
                                                    '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                                        width: '80px'
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </>
                                )
                            }

                            <Grid item md={12}>
                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit  <br /> (Tax Amount)</Typography>
                                <OutlinedInput
                                    size="small"
                                    id="component-outlined"
                                    value={show?.unitcosttaxamount}
                                    sx={{
                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                            width: '80px'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Net Tax <br />(Tax Amount)</Typography>
                                <OutlinedInput
                                    size="small"
                                    id="component-outlined"
                                    value={show?.netcosttaxamount}
                                    sx={{
                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                            width: '80px'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Unit Cost <br /> (With Tax)</Typography>
                                <OutlinedInput
                                    size="small"
                                    id="component-outlined"
                                    value={show?.unitcostwithtax}
                                    sx={{
                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                            width: '80px'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Net Cost <br />(With Tax)</Typography>
                                <OutlinedInput
                                    size="small"
                                    id="component-outlined"
                                    value={show?.netcostwithtax}
                                    sx={{
                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                            width: '80px'
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </TableCell>
                    <TableCell sx={{ maxWidth: '175px', padding: '5px' }}>
                        <Grid container spacing={1}>
                            <Grid item md={12} sx={{ marginTop: '-45px' }}>
                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Margin%</Typography>
                                <OutlinedInput size='small'
                                    sx={{
                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                            width: '80px !important'
                                        },
                                        '& input[type=number]': {
                                            'MozAppearance': 'textfield' //#8b5cf6
                                        },
                                        '& input[type=number]::-webkit-outer-spin-button': {
                                            'WebkitAppearance': 'none',
                                            margin: 0
                                        },
                                        '& input[type=number]::-webkit-inner-spin-button': {
                                            'WebkitAppearance': 'none',
                                            margin: 0
                                        }
                                    }}
                                    type='number'
                                    value={show?.margin}
                                    onChange={(e) => {
                                        // productUserInput(i, "margin", e.target.value, "Margin data")
                                    }}
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Sale Unit Cost <br />(Without Tax)</Typography>
                                <OutlinedInput
                                    size="small"
                                    id="component-outlined"
                                    value={show?.sellingpriceunitwithoutcost}
                                    sx={{
                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                            width: '80px'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Sale Tax Type</Typography>
                                <OutlinedInput
                                    size="small"
                                    id="component-outlined"
                                    value={show?.sellingpricetax}
                                    sx={{
                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                            width: '80px'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Sale Tax Amount</Typography>
                                <OutlinedInput
                                    size="small"
                                    id="component-outlined"
                                    value={show?.saletaxamount}
                                    sx={{
                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                            width: '80px'
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Sale Unit Cost <br />(With Tax)</Typography>
                                <OutlinedInput
                                    size="small"
                                    id="component-outlined"
                                    value={show?.sellingpriceunitcost}
                                    sx={{
                                        '.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
                                            width: '80px'
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </TableCell>
                </StyledTableRow>
                <Button variant="outlined" color='error' sx={{ float: "right" }} onClick={() => { handleCloseview() }}>
                    close
                </Button>
            </DialogContent>
        </Dialog>