export const navbarstyle = {
    navbarcontainer:{
        display: { xs: 'none', sm: 'none', md: 'block' }, 
        width:'100%', 
        textAlign:'center'
    },
    menuicon:{
        mr: 2, 
        display: { md: 'none' },
         position:"absolute",
          right:0 
    },
    drawercontainer:{
        display: { xs: 'block', sm: 'block', md: 'none' },
        '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', width: '100%', 
            backgroundColor:'#1976d2', },
    },
    closebutton:{
        width:'50px', 
        height: '50px',
        color:'white',
        backgroundColor: '#2768b5',
        webkitBackgroundSize: '20px',
        backgroundSize: '20px',
        backgroundRepeat: 'no-repeat',
        webkitBackgroundPosition: 'center',
        backgroundPosition: 'center',
        cursor: 'pointer',
    },
    // mobile view
    mobilemenu:{
        backgroundColor:'#1976d2', 
        color:'white',
        boxShadow:'none',
        borderBottom:'1px solid black'
    },
    submenu:{
        backgroundColor:'white', 
        color:'black',
        padding:0
    },
    menuitemslink:{
        color:'#464038', 
        textDecoration:'none',
        fontWeight:600,
        '& .css-10hburv-MuiTypography-root':{
            fontWeight:600,
        }
    }
    
}
