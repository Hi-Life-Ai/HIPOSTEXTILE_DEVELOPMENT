export const SidebarItems = [
    {
        id: 1,
        label: 'Home',
        dbname:'home',
        route: '/dashboard',
    },
    {
        id: 2,
        label: 'User Management',
        dbname:'usermanagement',
        name : 'user',
        children: [
            {
               
                label: 'User',
                dbname:'alluser',
                route: '/user/user/list',
            },
            {
            
                label: 'Role',
                dbname: 'allrole',
                route: '/user/role/list',
            },
            {
                
                label: 'Department',
                dbname: 'alldepartment',
                route: '/user/department/list',
            }
        ]
    },
    {
        id: 3,
        label: 'Suppliers',
        dbname:'suppliermanagement',
        name: 'contact',
        children: [
            {
                label: 'Add Suppliers',
                dbname:'asupplier',
                route: '/contact/supplier/create',
            },
            {
        
               
                label: 'Import Suppliers',
                dbname:'isupplier',
                route: '/contact/supplier/import',
            },
            {
            
               
                label: 'List Suppliers',
                dbname:'allsupplier',
                route: '/contact/supplier/list',
            },
        ]
    },
    {
        id: 4,
        label: 'Customers',
        dbname:'customermanagement',
        name: 'contact',
        children: [
            {
               
                label: 'Add Customers',
                dbname:'acustomer',
                route: '/contact/customer/create',
            },
            {
        
                label: 'Import Customers',
                dbname:'icustomer',
                route: '/contact/customer/import',
            },
            {
                
               
                label: 'List Customers',
                dbname:'allcustomer',
                route: '/contact/customer/list',
            },
            {
                
               
                label: 'List Customer Group',
                dbname:'allcustomergrp',
                route: '/contact/customergroup/list',
            }
        ]
    },
    {
        id:5,
        label: 'Products',
        dbname:'productmanagement',
        name: 'product',
        children:[
            {
                label: 'Size',
                dbname:'allsize',
                route:'',
                children:[
                    {
                        label: 'Add Size',
                        dbname:'asize',
                        route:'/product/size/create'
                    },
                    {
                        label: 'List Size',
                        dbname:'allsize',
                        route:'/product/size/list'
                    }
                ]
            },
            {
                
                label: 'Style',
                dbname:'allstyle',
                route:'',
                children:[
                    {
                        label: 'Add Style',
                        dbname:'astyle',
                        route:'/product/style/create',
                    },
                    {
                        label: 'List Style',
                        dbname:'allstyle',
                        route:'/product/style/list',
                    },
                ]
            },
            {
                
                label: 'Units',
                dbname:'allunit',
                route:'',
                children:[
                    {
                        label: 'Add Unit',
                        dbname:'aunit',
                        route:'/product/unit/create',
                    },
                    {
                        label: 'List Unit',
                        dbname:'allunit',
                        route:'/product/unit/list',
                    },
                    {
                        label: 'Unit Grouping',
                        dbname:'allUnitGroup',
                        route:'/product/unitgrouping'
                    }
                ]
            },
            {
                label: 'Color',
                dbname:'allcolor',
                route:'',
                children:[
                    {
                        label: 'Add Color',
                        dbname:'acolor',
                        route:'/product/color/create',
                    },
                    {
                        label: 'List Color',
                        dbname:'allcolor',
                        route:'/product/color/list',
                    },
                ]
            },
            {
                
                label: 'Rack',
                dbname:'allracks',
                route:'',
                children:[
                    {
                        label: 'Add Rack',
                        dbname:'aracks',
                        route:'/product/rack/create',
                    },  
                    {
                        label: 'List Rack',
                        dbname:'allracks',
                        route:'/product/rack/list',
                    }
                ]
            },
            {
                label: 'Section Grouping',
                dbname:'allsectiongrp',
                route:'/product/sectiongrouping',
            },
            {
                label: 'Category',
                dbname:'allcategory',
                route:'',
                children:[
                    {
                        label: 'Add Category',
                        dbname:'acategory',
                        route:'/product/category/create',
                    },
                    {
                        label: 'List Category',
                        dbname:'allcategory',
                        route:'/product/category/list',
                    },
                ]
            },
            {
                
                label: 'Brand',
                dbname:'allbrand',
                route:'',
                children:[
                    {
                        label: 'Add Brand',
                        dbname:'abrand',
                        route:'/product/brand/create',
                    },
                    {
                        label: 'List Brand',
                        dbname:'allbrand',
                        route:'/product/brand/list',
                    },
                ]

            },
            {
                label: 'Category Grouping',
                dbname:'allgrouping',
                route:'',
                children:[
                    {
                        label: 'Add Category Grouping',
                        dbname:'addgrouping',
                        route:'/product/group/create',
                    },
                    {
                        label: 'List Category Grouping',
                        dbname:'allgrouping',
                        route:'/product/group/list',
                    },

                ]
            },
            {
                label: 'Products',
                dbname:'allproduct',
                route:'',
                children:[
                    {
                        label: 'Add product',
                        dbname:'aproduct',
                        route:'/product/product/create',
                    },
                    {
                        label: 'List product',
                        dbname:'allproduct',
                        route:'/product/product/list',
                    },
                    {
                        label: 'Import Products',
                        dbname:'iproduct',
                        route: '/product/importproducts',
                    },
                ]
            },
            {
                label: 'Discount',
                dbname:'alldiscount',
                route:'',
                children:[
                    {
                        label: 'Add Discount',
                        dbname:'adiscount',
                        route: '/product/discount/create',
                    },
                    {
                        label: 'List Discount',
                        dbname:'alldiscount',
                        route: '/product/discount/list',
                    },                   
                ]
            },
            {
                label: 'Print Labels',
                dbname:'allproductlabel',
                route: '/product/printlabel',
            }

        ]
    },
    {
        id: 6,   
        label: 'Purchases',
        dbname:'purchasemanagement',
        name: 'allpurchase',
        children:[
            {
                label: 'Add Purchase',
                dbname:'apurchase',
                route: '/purchase/purchase/create',
            },
            {
                label: 'List Purchase',
                dbname:'allpurchase',
                route: '/purchase/purchase/list',
            },
            {
                label: 'Purchase Return',
                dbname:'allpurchasereturn',
                route: '/purchase/purchasereturn/list',
            },
          
        ]
    },
    {
        id: 7,
        label: 'Sell',
        dbname:'sellmanagement',
        name: 'sell',
        children: [
            {
                label: 'POS',
                dbname:'apos',
                route: '/sell/pos/create',
            },
            {
                label: 'List POS',
                dbname:'allpos',
                route: '/sell/pos/list',
            },
            {
                label: 'List Drafts',
                dbname:'alldraft',
                route: '/sell/draft/list',
            },
            {
                label: 'List Quatations',
                dbname:'allquotation',
                route: '/sell/quotation/list',
            },
        ]
    },
    {
        id: 8,
        label: 'Stock',
        dbname:'allstock',
        name: 'Stock',
        children:[
            {
                label: 'All Stock Details',
                dbname:'allstock',
                route: '/product/stock/list',
            },
            {
                label: 'Stock Queue',
                dbname:'allstocktransferlist',
                route: '',
            },
            {
                label: 'Stock Transfer',
                dbname:'allstocktransferlist',
                route: '',
                children:[
                    {

                        label: 'Add Stock Transfer',
                        dbname:'astocktransferlist',
                        route: '/stocktransfer/create',
                    },
                    {
                        label: 'List Stock Transfer',
                        dbname:'allstocktransferlist',
                        route: '/stocktransfer/list',
                    }
                ]
            },
            {
                label: 'Stock Adjustment',
                dbname:'stockadjustmanagement',
                route: '',
                children:[
                    {
                        label: 'Add Stock Adjustment',
                        dbname:'astockadjust',
                        route: '/stock/adjustment/create',
                    },
                    {
                        label: 'List Stock Adjustment',
                        dbname:'allstockadjust',
                        route: '/stock/adjustment/list',
                    },
                    {
                        label: 'Adjustment Type Master',
                        dbname:'allstockadjustmenttype',
                        route: '/stock/adjustmenttype/create',
                    },
                ]
            },
        ]
    },
    {
        id: 9,
        label: 'Expenses',
        dbname:'expensemanagement',
        name: 'expenses',
        children: [
            {
                label: 'Add Expenses',
                dbname:'aexpense',
                route: '/expense/expense/create',
            },
            {
                
                label: 'List Expenses',
                dbname:'allexpense',
                route: '/expense/expense/list',
            },
            {
                id: 3,
               
                label: 'Expenses Categories',
                dbname:'allexpensecategory',
                route: '/expense/expensecategory/list',
            }
        ]
    },
 
    {
        id: 10,
        label: 'Passwords',
        dbname:'passwordmanagement',
        name: 'password',
        children: [
            {
                
                label: 'Add Password',
                dbname:'apassword',
                route: '/passwords/password/create',
            },
            {
                
                label: 'List Passwords',
                dbname:'allpassword',
                route: '/passwords/password/list',
            },
            {
                
                label: 'Add Folder',
                dbname:'allfolder',
                route: '/passwords/folder/list',
            },
            {
                
                label: 'Assign Password',
                dbname:'allassignpassword',
                route: '/passwords/assignpassword/create',
            },
            {
                
                label: 'User Password',
                dbname:'assignpasswordlist',
                route: '/passwords/assignpassword/list',
            },
        ]
    },
    {
        id: 11,
      
        label: 'Settings',
        dbname:'settingsmanagement',
       
        name: 'setting',
        children: [
            {
                
               
                label: 'Business Settings',
                dbname:'businesssettings',
                route: '/settings/business/list',
            },
            {
                
               
                label: 'Business Location',
                dbname:'allbusinesslocation',
                route: '/settings/location/list',
            },
            {
                
               
                label: 'Alpharate',
                dbname:'allalpharate',
                route: '/settings/alpharate/list',
            },
            {
            
               
                label: 'Tax Rates',
                dbname:'alltaxrate',
                route: '/settings/taxrate/list',
            },
            {
            
               
                label: 'Payment Integration',
                dbname:'allpaymentintegration',
                route: '/settings/paymentintegration/list',
            }
        ]
    },
    
]
