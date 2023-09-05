
import React, { useState, useContext, useEffect } from 'react';
import { SidebarItems } from './SidebarListItem';
import MenuItems from './Menuitem';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  ListItemIcon,
  useMediaQuery, 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext, UserRoleAccessContext } from '../../context/Appcontext';
import { SERVICE } from '../../services/Baseservice';
import { AUTH } from '../../services/Authservice';
import { navbarStyle } from './Style';

const Navbar = () => {
  const [filterSidebar, setFilterSidebar] = useState([]);
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);

  const roleAccess = isUserRoleCompare[0];

  useEffect(() => {
    const fetchFilterSidebarItems = async () => {
      try {
        let roleSidebar = SidebarItems.filter((item) => {
          return item.dbname && roleAccess[item.dbname];
        });
        let roleBasedSidebar = roleSidebar.map((item) => {
          if (item.children) {
            let roleBasedChild = item.children.filter((item) => {
              return item.dbname && roleAccess[item.dbname];
            });
            let childrenbasedChild = roleBasedChild.map((value, i) => {
              if (value.children) {
                let roleBasedinnerChild = value.children.filter((item) => {
                  return item.dbname && roleAccess[item.dbname];
                });
                let childrenbasedInnerChild = roleBasedinnerChild.map((innerValue, j) => {
                  if (innerValue.children) {
                    let roleBasedInnermostChild = innerValue.children.filter((item) => {
                      return item.dbname && roleAccess[item.dbname];
                    });
                    return { ...innerValue, children: roleBasedInnermostChild };
                  } else {
                    return innerValue;
                  }
                });
                return { ...value, children: childrenbasedInnerChild };
              } else {
                return value;
              }
            });
            let childrenbasedChild1 = childrenbasedChild.map((values, i) => {
              if (values.children) {
                let roleBasedinnerChild1 = values.children.filter((item) => {
                  return item.dbname && roleAccess[item.dbname];
                });
                let childrenbasedInnerChild1 = roleBasedinnerChild1.map((innerValue1, j) => {
                  if (innerValue1.children) {
                    let roleBasedInnermostChild1 = innerValue1.children.filter((item) => {
                      return item.dbname && roleAccess[item.dbname];
                    });
                    return { ...innerValue1, children: roleBasedInnermostChild1 };
                  } else {
                    return innerValue1;
                  }
                });
                return { ...values, children: childrenbasedInnerChild1 };
              } else {
                return values;
              }
            });
            return { ...item, children: childrenbasedChild1 };
          } else {
            return item;
          }
        });
        setFilterSidebar(roleBasedSidebar);
      } catch (err) {
        console.error(err?.response?.data?.message);
      }
    };

    fetchFilterSidebarItems();
  }, [roleAccess]);

  const theme = createTheme(); // Create an empty theme object

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const toggleMobileMenu = (event) => {
    setMobileMenuOpen(!mobileMenuOpen);
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
    setMobileMenuAnchor(null);
  };

  const isScreenSize930px = useMediaQuery('(min-width: 930px)');

  return (
    // <ThemeProvider theme={theme}>
    <>

      <Toolbar>
        {isScreenSize930px ? (
          <nav>
            <ul className="menus">
              {filterSidebar.map((menu, index) => (
                <MenuItems
                  key={index}
                  items={menu}
                  depthLevel={0}
                  isMobileMenuOpen={false}
                />
              ))}
            </ul>
          </nav>
        ) : (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleMobileMenu}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>


      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        <List>
          {filterSidebar.map((menu, index) => (
            <NestedMenu
              key={index}
              menu={menu}
              depthLevel={0}
              isMobileMenu
              handleMobileMenuClose={handleMobileMenuClose}
            />
          ))}
        </List>
      </Drawer>
    </>
    // </ThemeProvider>
  );
};

const NestedMenu = ({
  menu,
  depthLevel,
  isMobileMenu,
  handleMobileMenuClose,
  parentUrl = '',
}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setOpen(!open);
  };

  const isExpandable = menu.children && menu.children.length > 0;

  const handleMenuItemClick = (route) => {
    navigate(route);
    handleMobileMenuClose();
  };
  

  return (
    <>
      <ListItem
        button
        onClick={isExpandable ? handleClick : () => handleMenuItemClick(menu.route)}
        style={{ paddingLeft: `${depthLevel * 20}px`, minWidth: '270px', backgroundColor: isExpandable ? '#8080805e' : '#F5F5F5', paddingLeft: isExpandable ? '10px' : `${depthLevel * 20}px`, }}
      >
        {depthLevel > 0 && !isExpandable && <FiberManualRecordIcon style={{ marginRight: '8px', fontSize: "10px" }} />}
        {menu.icon && <ListItemIcon>{menu.icon}</ListItemIcon>}
        <ListItemText primary={menu.label} />
        {isExpandable &&
          (isMobileMenu ? (open ? <ExpandLessIcon /> : <ExpandMoreIcon />) : <ArrowRightIcon />)
        }
      </ListItem>

      {isExpandable && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {menu.children.map((children, index) => (
              <NestedMenu
                key={index}
                menu={children}
                depthLevel={depthLevel + 1}
                isMobileMenu={isMobileMenu}
                handleMobileMenuClose={handleMobileMenuClose}
                parentUrl={menu.route}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default Navbar;


// // **********************************************************************************************************************************************************************************************************************************************//

// // added the old code
// import React, { useState, useEffect, useContext } from 'react';
// import { Box,MenuItem, Grid, Menu, Badge, Button, AppBar, Accordion, AccordionDetails, AccordionSummary,DialogActions, Dialog, DialogContent, Typography, CssBaseline, Drawer, IconButton, Toolbar, List, ListItemButton, ListItemText } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import CloseIcon from '@mui/icons-material/Close';
// import { BiCalculator } from 'react-icons/bi';
// import { CgMicrosoft } from 'react-icons/cg';
// import { Logout } from '@mui/icons-material';
// import { SidebarItems } from './SidebarListItem';
// import { Link, useNavigate } from 'react-router-dom';
// import MenuItems from './Menuitem';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Header from './Header';
// import { navbarstyle } from './Navbarstyle';
// import { navbarStyle } from './Style';
// import Calculator from './Calculator';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { AuthContext, UserRoleAccessContext } from '../../context/Appcontext';
// import { SERVICE } from '../../services/Baseservice';
// import { AUTH } from '../../services/Authservice';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import QuestionMarkIcon from '@mui/icons-material/QuestionMark';


// function Navbar(props) {

//   const { window } = props;
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const handleDrawerToggleOpen = () => {
//     setMobileOpen(true);
//   };

//   const handleDrawerToggleClose = () => {
//     setMobileOpen((prevState) => !prevState);
//   };


//   const drawer = (
//     <Box onClick={handleDrawerToggleOpen} sx={{ textAlign: 'center', width:'100%'  }}>
//       <Box sx={{ display: { xs: 'inline-block'}, width:'100%' }}>
//       <ControlledAccordions />
//       </Box>
//     </Box>
//   );

//   const container = window !== undefined ? () => window().document.body : undefined;

//   return (
//     <>
//     <Box>
//       <CssBaseline />
//       <AppBar component="nav" >
//         <Header />
//         <Toolbar >
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             edge="start"
//             onClick={handleDrawerToggleOpen}
//             sx={navbarstyle.menuicon}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Box sx={navbarstyle.navbarcontainer}>
//             <ul className="menus">
//               {SidebarItems.map((menu, index) => {
//                 const depthLevel = 0;
//                 return (
//                   <MenuItems
//                     items={menu}
//                     key={index}
//                     depthLevel={depthLevel}
//                   />
//                 );
//               })}
//             </ul>
//           </Box>
//         </Toolbar>
//       </AppBar>
//       <Box component="nav">
//         <Drawer
//           container={container}
//           variant="temporary"
//           open={mobileOpen}
//           onClose={handleDrawerToggleClose}
//           ModalProps={{
//             keepMounted: true,
//           }}
//           sx={navbarstyle.drawercontainer}
//         >
//           <Headerone handleDrawerToggleClose={handleDrawerToggleClose}/>
//           {drawer}
//         </Drawer>
//       </Box>
//     </Box>
//     </>
//   );
// }

// Navbar.propTypes = {
//   window: 900,
// };

// //mobile view header

// const Headerone = ({handleDrawerToggleClose}) => {

//   //***** Action button *****//

//   const [Notification, setNotification] = useState()

//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);
//   const handleClick = (event) => { setAnchorEl(event.currentTarget); };
//   const handleClose = () => { setAnchorEl(null); };

//   const { auth, setAuth, setngs, setSetngs } = useContext(AuthContext);
//   const { isUserRoleAccess, isUserRoleCompare } = useContext(UserRoleAccessContext);

//  // Start model
//  const [isAppstart, setIsAppstart] = useState(false);
//  const handleAppstartOpen = () => { handleSteponeClose();handleSteptwoClose();handleStepthreeClose();handleStepfourClose();handleStepfiveClose();handleStepsixClose();setIsAppstart(true); };
//  const handleAppstartClose = () => { setIsAppstart(false); };

//  // Step 1 model
//  const [isStepone, setIsStepone] = useState(false);
//  const handleSteponeOpen = () => { handleAppstartClose();handleSteptwoClose();handleStepthreeClose();handleStepfourClose();handleStepfiveClose();handleStepsixClose();setIsStepone(true); };
//  const handleSteponeClose = () => { setIsStepone(false); };

//  // Step 2 model
//  const [isSteptwo, setIsSteptwo] = useState(false);
//  const handleSteptwoOpen = () => { handleAppstartClose();handleSteponeClose();handleStepthreeClose();handleStepfourClose();handleStepfiveClose();handleStepsixClose();setIsSteptwo(true); };
//  const handleSteptwoClose = () => { setIsSteptwo(false); };

//   // Step 3 model
//   const [isStepthree, setIsStepthree] = useState(false);
//   const handleStepthreeOpen = () => { handleAppstartClose();handleSteptwoClose();handleSteponeClose();handleStepfourClose();handleStepfiveClose();handleStepsixClose();setIsStepthree(true); };
//   const handleStepthreeClose = () => { setIsStepthree(false); };

//   // Step 4 model
//   const [isStepfour, setIsStepfour] = useState(false);
//   const handleStepfourOpen = () => { handleAppstartClose();handleSteptwoClose();handleStepthreeClose();handleSteponeClose();handleStepfiveClose();handleStepsixClose();setIsStepfour(true); };
//   const handleStepfourClose = () => { setIsStepfour(false); };

//    // Step 5 model
//    const [isStepfive, setIsStepfive] = useState(false);
//    const handleStepfiveOpen = () => { handleAppstartClose();handleSteptwoClose();handleStepthreeClose();handleStepfourClose();handleSteponeClose();handleStepsixClose();setIsStepfive(true); };
//    const handleStepfiveClose = () => { setIsStepfive(false); };

//     // Step 6 model
//     const [isStepsix, setIsStepsix] = useState(false);
//     const handleStepsixOpen = () => { handleAppstartClose();handleSteptwoClose();handleStepthreeClose();handleStepfourClose();handleSteponeClose();handleStepfiveClose();setIsStepfive(true); };
//     const handleStepsixClose = () => { setIsStepsix(false); };
 
//   useEffect(
//     () => {
//       fetchTransfers();
//     }, []
//   )

//   const fetchTransfers = async () => {
//     try {
//       var response = await axios.post(SERVICE.TRANSFERS, {
//         headers: {
//           'Authorization': `Bearer ${auth.APIToken}`
//         },
//         businessid:String(setngs.businessid),
//         role:String(isUserRoleAccess.role),
//         userassignedlocation:[isUserRoleAccess.businesslocation]
//       });

//       let arr = [];
      
//       let answer = response?.data?.transfers?.filter((data, index) => {
//         if ((data.status == false && data.reject == false ) || (data.status == false && data.reject == true)) {
//           arr.push(data)
//           return data
//         }
//       })
//       setNotification(arr.length);
//     } catch (err) {
//       const messages = err?.response?.data?.message;
//         if(messages) {
//             toast.error(messages);
//         }else{
//             toast.error("Something went wrong!")
//         }
//     }
//   }
 
//   const backLPage = useNavigate();

//   const logOut = async () => {
//     try {
//       let res = await axios.get(AUTH.LOGOUT, {
//         headers: {
//           'Authorization': `Bearer ${auth.APIToken}`
//         }
//       })
//       //change login state
//       setAuth({ ...auth, loginState: false });
//       toast.success(res.data.message);
//       localStorage.clear();
//       setSetngs({});
//       backLPage('/signin');
//     } catch (err) {
//       const messages = err?.response?.data?.message;
//             if(messages) {
//                 toast.error(messages);
//             }else{
//                 toast.error("Something went wrong!")
//             }
//     }
//   }

//   return (
//     <>
//       <Box sx={{ display: 'flex' }}>
//         <Grid container sx={{ justifyContent: 'flex-start', color: 'white', marginTop: '3px', fontSize: '18px', fontWeight: 600 }}>
//           {setngs?.businesslogo ? <img src={setngs?.businesslogo} width="50px" height="50px" alt="Logo" /> : setngs?.businessname ? <p>{setngs?.businessname}</p> : <></>}
//         </Grid>
//         <Grid container sx={{ justifyContent: 'flex-end', paddingTop: "10px" }}>
//         <Button onClick={handleAppstartOpen} sx={navbarStyle.navbarrightbtn}><QuestionMarkIcon /></Button>
//           {isUserRoleCompare[0]?.allstocktransferlist && (
//             <>
//             <Link to='/stockadjust/list'>
//               <Badge badgeContent={Notification} color="error"
//                 style={{ color: 'white', cursor: "pointer" }}  anchorOrigin={{ vertical: 'top', horizontal: 'left', }}>
//                 <NotificationsIcon sx={navbarStyle.navbarrightbtn} style={{ padding: "5px" }} />
//               </Badge>
//             </Link>
//           </>
//           )}
//           <>
//             <Button
//               id="demo-customized-button"
//               aria-controls={open ? 'demo-customized-menu' : undefined}
//               aria-haspopup="true"
//               aria-expanded={open ? 'true' : undefined}
//               disableElevation
//               onClick={handleClick}
//               sx={navbarStyle.navbarrightbtn}
//             >
//               <BiCalculator></BiCalculator>
//             </Button>
//             <Menu
//               id="demo-customized-menu"
//               MenuListProps={{
//                 'aria-labelledby': 'demo-customized-button',
//               }}
//               anchorEl={anchorEl}
//               open={open}
//               onClose={handleClose}
//             >
//               <MenuItem>
//                 <Calculator />
//               </MenuItem>
//             </Menu>
//           </>
//           {isUserRoleCompare[0]?.apos && (
//             <Link to="/sell/pos/create"><Button sx={navbarStyle.navbarrightbtn}><CgMicrosoft />&ensp;POS</Button></Link>
//           )}
//           <Button onClick={logOut} sx={navbarStyle.navbarrightbtn}><Logout /></Button>
//           <Button sx={navbarstyle.closebutton} onClick={handleDrawerToggleClose}><CloseIcon /></Button>
//         </Grid>
//       </Box>
//         {/* Application tour */}
//       <Box>
//           {/* START DIALOG */}
//         <Box>
//             <Dialog
//                 open={isAppstart}
//                 aria-labelledby="alert-dialog-title"
//                 aria-describedby="alert-dialog-description"
//             >
//                 <DialogContent sx={{ width: '350px'}}>
//                 <Typography variant="h5"><b>Application Tour</b></Typography><br />
//                 <Typography variant="body1" >Let's go through the application in 5 quick steps..</Typography>
//                 </DialogContent>
//                 <DialogActions sx={{display:'flex', justifyContent:'space-between'}}>
//                   <Button variant="contained" sx={{backgroundColor:'#0ec17c', color:'white'}} onClick={handleSteponeOpen}>Next</Button>
//                   <Button variant="contained" sx={{backgroundColor:'#878080', color:'white'}} onClick={handleAppstartClose}>End Tour</Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>

//         {/* STEP 1 DIALOG */}
//           <Box>
//             <Dialog
//                 open={isStepone}
//                 aria-labelledby="alert-dialog-title"
//                 aria-describedby="alert-dialog-description"
//             >
//                 <DialogContent sx={{ width: '450px'}}>
//                 <Typography variant="h4"><b>Step1: Shop Details</b></Typography><br />
//                 <Typography sx={{fontSize:'20px', color:'black'}} >Settings you can find your shop related information, Basic information,Business name, branches, Product SKU,Add Multiple Locations,Taxes & other for your shop.</Typography>
//                 </DialogContent>
//                 <DialogActions sx={{display:'flex', justifyContent:'flex-start'}}>
//                 <Button variant="contained" sx={{backgroundColor:'#0ec17c', color:'white'}} onClick={handleAppstartOpen}>Previous</Button>
//                   <Button variant="contained" sx={{backgroundColor:'#0ec17c', color:'white'}} onClick={handleSteptwoOpen}>Next</Button>
//                 </DialogActions>
//             </Dialog>
//           </Box>
//         {/* STEP 2 DIALOG */}
//         <Box>
//             <Dialog
//                 open={isSteptwo}
//                 aria-labelledby="alert-dialog-title"
//                 aria-describedby="alert-dialog-description"
//             >
//                 <DialogContent sx={{ width: '450px'}}>
//                 <Typography variant="h4"><b>Step2: Manage User</b></Typography><br />
//                 <Typography sx={{fontSize:'20px', color:'black'}} >User - here you can add your new users assign multiple branches access, add role app each module access and departments.</Typography>
//                 </DialogContent>
//                 <DialogActions sx={{display:'flex', justifyContent:'flex-start'}}>
//                 <Button variant="contained" sx={{backgroundColor:'#0ec17c', color:'white'}} onClick={handleSteponeOpen}>Previous</Button>
//                   <Button variant="contained" sx={{backgroundColor:'#0ec17c', color:'white'}} onClick={handleStepthreeOpen}>Next</Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//           {/* STEP 3 DIALOG */}
//              <Box>
//                 <Dialog
//                     open={isStepthree}
//                     aria-labelledby="alert-dialog-title"
//                     aria-describedby="alert-dialog-description"
//                 >
//                     <DialogContent sx={{ width: '450px'}}>
//                     <Typography variant="h4"><b>Step3: Manage Products</b></Typography><br />
//                     <Typography sx={{fontSize:'20px', color:'black'}} >Add Products - Import products, Units, variaous categories and subcategories, print layout, Products report</Typography>
//                     </DialogContent>
//                     <DialogActions sx={{display:'flex', justifyContent:'flex-start'}}>
//                     <Button variant="contained" sx={{backgroundColor:'#0ec17c', color:'white'}} onClick={handleSteptwoOpen}>Previous</Button>
//                       <Button variant="contained" sx={{backgroundColor:'#0ec17c', color:'white'}} onClick={handleStepfourOpen}>Next</Button>
//                     </DialogActions>
//                 </Dialog>
//             </Box>
//             {/* STEP 4 DIALOG */}
//             <Box>
//                 <Dialog
//                     open={isStepfour}
//                     aria-labelledby="alert-dialog-title"
//                     aria-describedby="alert-dialog-description"
//                 >
//                     <DialogContent sx={{ width: '450px'}}>
//                     <Typography variant="h4"><b>Step4: Purchase</b></Typography><br />
//                     <Typography sx={{fontSize:'20px', color:'black'}} >Purchase - Here you can purchase new products with tax details, invoice detals and stock update</Typography>
//                     </DialogContent>
//                     <DialogActions sx={{display:'flex', justifyContent:'flex-start'}}>
//                     <Button variant="contained" sx={{backgroundColor:'#0ec17c', color:'white'}} onClick={handleStepthreeOpen}>Previous</Button>
//                       <Button variant="contained" sx={{backgroundColor:'#0ec17c', color:'white'}} onClick={handleStepfiveOpen}>Next</Button>
//                     </DialogActions>
//                 </Dialog>
//             </Box>
//              {/* STEP 5 DIALOG */}
//              <Box>
//                 <Dialog
//                     open={isStepfive}
//                     aria-labelledby="alert-dialog-title"
//                     aria-describedby="alert-dialog-description"
//                 >
//                     <DialogContent sx={{ width: '450px'}}>
//                     <Typography variant="h4"><b>Step5: Manage Stock</b></Typography><br />
//                     <Typography sx={{fontSize:'20px', color:'black'}} >Stock - Product stock update, stock details, transfer products multiple branches and verify transfered products</Typography>
//                     </DialogContent>
//                     <DialogActions sx={{display:'flex', justifyContent:'flex-start'}}>
//                     <Button variant="contained" sx={{backgroundColor:'#0ec17c', color:'white'}} onClick={handleStepfourOpen}>Previous</Button>
//                       <Button variant="contained" sx={{backgroundColor:'#0ec17c', color:'white'}} onClick={handleStepsixOpen}>Next</Button>
//                     </DialogActions>
//                 </Dialog>
//             </Box>
//              {/* STEP 6 DIALOG */}
//              <Box>
//                 <Dialog
//                     open={isStepsix}
//                     aria-labelledby="alert-dialog-title"
//                     aria-describedby="alert-dialog-description"
//                 >
//                     <DialogContent sx={{ width: '450px'}}>
//                     <Typography variant="h4"><b>Step6: Manage Sales</b></Typography><br />
//                     <Typography sx={{fontSize:'20px', color:'black'}} >Sell - POS, Use this screen while selling products or billing. Select Location, Add Products, discounts and invoice details Finalize it..</Typography>
//                     </DialogContent>
//                     <DialogActions sx={{display:'flex', justifyContent:'space-between'}}>
//                     <Button variant="contained" sx={{backgroundColor:'#0ec17c', color:'white'}} onClick={handleStepfiveOpen}>Previous</Button>
//                     <Button variant="contained" sx={{backgroundColor:'#878080', color:'white'}} onClick={handleAppstartClose}>End Tour</Button>                    
//                     </DialogActions>
//                 </Dialog>
//             </Box>
//       </Box>
//     </>
//   )
// }

// //mobile view navbar
// export function ControlledAccordions() {
//   const [expanded, setExpanded] = React.useState(false);

//   const handleChange = (panel) => (event, isExpanded) => {
//     setExpanded(isExpanded ? panel : false);
//   };

//   return (
//     <div>
//         {SidebarItems.length > 0 && SidebarItems.map((item,index)=>(
//           <Accordion expanded={expanded === `panel${index+1}`} onChange={handleChange(`panel${index+1}`)} sx={navbarstyle.mobilemenu}>
//               <AccordionSummary
//               expandIcon={item.children && <ExpandMoreIcon sx={{color:'white'}} />}
//               aria-controls="panel1bh-content"
//               id="panel1bh-header"
//               >
//                 {item.children ? <Typography sx={{flexShrink: 0 }}>{item.label}</Typography> : <Link to={item.route} style={{color:'white'}}><Typography sx={{flexShrink: 0 }}>{item.label}</Typography></Link> }
//               </AccordionSummary>
//              {item.children && item.children.map((data, index)=>(
//               <>
//                 <AccordionDetails sx={navbarstyle.children}>
//                   <List sx={{padding:0, '& .css-h4y409-MuiList-root':{padding:0}}}>
//                       <Link to={data.route}>
//                       <ListItemButton sx={navbarstyle.menuitemslink}>
//                           <ListItemText>{data.label}</ListItemText>
//                       </ListItemButton>
//                       </Link>
//                   </List>
//                 </AccordionDetails>
//               </>
//              ))} 
//           </Accordion>
//         ))}
//     </div>
//   );
// }

// export default Navbar;