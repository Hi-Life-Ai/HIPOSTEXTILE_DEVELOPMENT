import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Dashboard
import Layout from '../components/header/Layout';
import Dashboard from '../dashboard/Dashboard';
// user module import 
import Usercreate from '../pages/user/users/Create';
import Useredit from '../pages/user/users/Edit';
import Userview from '../pages/user/users/View';
import Userslist from '../pages/user/users/List';
import Rolecreate from '../pages/user/roles/Create';
import Roleedit from '../pages/user/roles/Edit';
import Roleslist from '../pages/user/roles/List'; 
import RoleView from '../pages/user/roles/View';
import Departmentscreate from '../pages/user/department/Create';
import Departmentsedit from '../pages/user/department/Edit';
import Departmentlist from '../pages/user/department/List';
import Departmentsview  from '../pages/user/department/View'
// contacts module import 
import Customerlist from '../pages/contacts/customer/List';
import Customercreate from '../pages/contacts/customer/Create';
import Customeredit from '../pages/contacts/customer/Edit';
import Customerimport from '../pages/contacts/customer/Import';
import Customerview from '../pages/contacts/customer/View';
import CustomerGroupsList from '../pages/contacts/customergroup/List';
import Customorgroupcreate from '../pages/contacts/customergroup/Create';
import Customergrpedit from '../pages/contacts/customergroup/Edit';
import Customergrpview from '../pages/contacts/customergroup/View';
import Supplierlist from '../pages/contacts/suppliers/List';
import Suppliercreate from '../pages/contacts/suppliers/Create';
import Supplieredit from '../pages/contacts/suppliers/Edit';
import Supplierview from '../pages/contacts/suppliers/View';
import Supplierimport from '../pages/contacts/suppliers/Import';
// /* product module import */
import Productlist from '../pages/products/product/List';
import Productcreate from '../pages/products/product/Create';
import Productedit from '../pages/products/product/Edit';
import Productview from '../pages/products/product/View';
import Categorieslist from '../pages/products/category/List';
import Categorycreate from '../pages/products/category/Create';
import Categoriesedit from '../pages/products/category/Edit';
import Categoryview from '../pages/products/category/View';
import Unitslist from '../pages/products/units/List';
import Unitcreate from '../pages/products/units/Create';
import Unitsedit from '../pages/products/units/Edit';
import Sizecreatetable from '../pages/products/size/Create';
import Sizelist from '../pages/products/size/List';
import Sizeedit from '../pages/products/size/Edit';
import Colorlist from '../pages/products/color/List';
import Colorcreate from '../pages/products/color/Create';
import Coloredit from '../pages/products/color/Edit';
import Colorview from '../pages/products/color/View'
import Sizeview from '../pages/products/size/View'
import Unitview from '../pages/products/units/View'
import Discountview from '../pages/products/discount/View'
import ImportProducts from '../pages/products/ImportProducts';
import PrintLabel from '../pages/products/PrintLable';
import Discountcreate from '../pages/products/discount/Create';
import Discountedit from '../pages/products/discount/Edit';
import Discoutlist from '../pages/products/discount/List';
import GroupCreate from '../pages/products/group/Create';
import GroupList from '../pages/products/group/List';
import UnitGrouping from '../pages/products/unitgroup/List';
import Stylecreate from '../pages/products/style/Create';
import Stylelist from '../pages/products/style/List';
import Styleedit from '../pages/products/style/Edit';
import StyleView from '../pages/products/style/View';
//brand
import BrandCreate from '../pages/products/brand/Create';
import Brandlist from '../pages/products/brand/List';
import Brandedit from '../pages/products/brand/Edit';
import Brandview from '../pages/products/brand/View';

//Rack list...
import Rackcreate from '../pages/products/rack/Create';
import Racklist from '../pages/products/rack/List';
import Rackedit from '../pages/products/rack/Edit';
import Rackview from '../pages/products/rack/View';
//section Grouping...
import SectionGrouping from '../pages/products/sectiongrouping/sectiongrouping';

// purchase module
import Purchaselists from '../pages/purchase/purchase/List';
import Purchasecreate from '../pages/purchase/purchase/Create';
import Purchaseedit from '../pages/purchase/purchase/Edit';
import Purchaseview from '../pages/purchase/purchase/View';
import Purchasereturncreate from '../pages/purchase/purchasereturn/Create';
import Purchasereutrnedit from '../pages/purchase/purchasereturn/Edit';
import Purchasereturnlist from '../pages/purchase/purchasereturn/List';
import Purchasereutrnview from '../pages/purchase/purchasereturn/View';
// sell module
import Poslist from '../pages/sell/pos/List';
import Poscreate from '../pages/sell/pos/Create';
import Posedit from '../pages/sell/pos/Edit';
import Posview from '../pages/sell/pos/View';
// import Draftedit from '../pages/sell/draft/Edit';
import Draftlist from '../pages/sell/draft/List';
import Draftview from '../pages/sell/draft/View';
// import Quotationedit from '../pages/sell/quation/Edit';
import Quotationlist from '../pages/sell/quation/List';
import Quotationview from '../pages/sell/quation/View';

// Expenses
import Expenselist from '../pages/expenses/expense/List';
import Expensecreate from '../pages/expenses/expense/Create';
import Expenseedit from '../pages/expenses/expense/Edit';
import Expensecategorylist from '../pages/expenses/expensecategory/List';
import Expensecategoryedit from '../pages/expenses/expensecategory/Edit';
import ExpenseCategorycreate from '../pages/expenses/expensecategory/Create';
import Expensecategoryview from '../pages/expenses/expensecategory/View'
import Expenseview from '../pages/expenses/expense/View'
// Settings
import Businesssettings from '../pages/settings/business/List';
import Locationlist from '../pages/settings/location/List';
import Locationcreate from '../pages/settings/location/Create';
import Businesslocationedit from '../pages/settings/location/Edit';
import Businesslocationview from '../pages/settings/location/View'
import Taxratelist from '../pages/settings/taxrate/List';
import TaxGrpCreate from '../pages/settings/taxrate/taxgroup/Create';
import TaxrateCreate from '../pages/settings/taxrate/taxrate/Create';
import Hsncreate from '../pages/settings/taxrate/hsn/Create';
import Taxrateedit from '../pages/settings/taxrate/taxrate/Edit';
import Hsnview from '../pages/settings/taxrate/hsn/View'
import Taxrategroupview from '../pages/settings/taxrate/taxgroup/View'
import Taxrateview from '../pages/settings/taxrate/taxrate/View'
import Alpharatelist from '../pages/settings/alpharate/List';
import Alphacreate from '../pages/settings/alpharate/Create';
import Alphaedit from '../pages/settings/alpharate/Edit';
import Alpharateprint from '../pages/settings/alpharate/Print';
import Paymentintegrationlist from '../pages/settings/paymentintegration/List';
import Paymentintegrationcreate from '../pages/settings/paymentintegration/Create';
import Payintegrationedit from '../pages/settings/paymentintegration/Edit';
import Payintegrationview from '../pages/settings/paymentintegration/View';
//stock transfer
import Transferlists from '../pages/stocktransfer/List';
import StockTransferCreatetable from '../pages/stocktransfer/Create';
import Categoryvicereport from '../pages/stock/report/Categoryviceproducts';
import Stocktransferview from '../pages/stocktransfer/View';
import StocktransferandAdjust from '../pages/stockadjust/List';
import Stockadjustview from '../pages/stockadjust/View';
import StockAdjustmentcreate from '../pages/stock/adjustment/Create';
import StockAdjustmentList from '../pages/stock/adjustment/List';
import StockAdjustmentView from '../pages/stock/adjustment/View';
import Adjustmenttypecreate from '../pages/stock/adjustmenttype/Create';
import AdjustmenttypeEdit from '../pages/stock/adjustmenttype/Edit';
import AdjustmentTypeView from '../pages/stock/adjustmenttype/View';
import Stocklisttable from '../pages/stock/stocks/List';
import Stockcreate from '../pages/stock/stocks/Create';
import ManualStockcreate from '../pages/stock/manualstockentry/Create'
import ManualStockView from '../pages/stock/manualstockentry/View'
import ManualStockList from '../pages/stock/manualstockentry/List'
//passwords module
import Folderlist from '../pages/passwords/folder/List';
import Folderview from '../pages/passwords/folder/View';
import AssignedPasswordlist from '../pages/passwords/assignepassword/Create';
import Passworduser from '../pages/passwords/assignepassword/List';

import Passwordlist from '../pages/passwords/password/List';
import Passwordcreate from '../pages/passwords/password/Create';
import Passwordedit from '../pages/passwords/password/Edit';
import Passwordview from '../pages/passwords/password/View';

import SelectAllGrouping from '../pages/products/selectall/List';

 function Applicationstack() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            {/* Dashboard routes */}
            <Route path="/" element={<Layout />} >
            <Route index path="dashboard" element={<Dashboard/>} />

            {/* user module */}
            <Route path="user/user/create" element={<Usercreate />} />
            <Route path="user/user/edit/:id" element={<Useredit />} />
            <Route path="user/user/view/:id" element={<Userview />} />
            <Route path="user/user/list" element={<Userslist />} />
            <Route path="user/role/create" element={<Rolecreate />} />
            <Route path="user/role/edit/:id" element={<Roleedit />} />
            <Route path="user/role/list" element={<Roleslist />} />
            <Route path="user/role/view/:id" element={<RoleView />} />
            <Route path="user/department/create" element={<Departmentscreate />} />
            <Route path="user/department/edit/:id" element={<Departmentsedit />} />
            <Route path="user/department/list" element={<Departmentlist />} />
            <Route path="user/department/view/:id" element={<Departmentsview />} />


            {/* contacts module */}
            <Route path="contact/customer/list" element={<Customerlist />} />
            <Route path="contact/customer/create" element={<Customercreate />} />
            <Route path="contact/customer/edit/:id" element={<Customeredit />} />
            <Route path="contact/customer/import" element={<Customerimport />} />
            <Route path="contact/customer/view/:id" element={<Customerview />} />
            <Route path="contact/customergroup/list" element={<CustomerGroupsList />} />
            <Route path="contact/customergroup/create" element={<Customorgroupcreate />} />
            <Route path="contact/customergroup/edit/:id" element={<Customergrpedit />} />
            <Route path="contact/customergroup/view/:id" element={<Customergrpview />} />
            <Route path="contact/supplier/list" element={<Supplierlist />} />
            <Route path="contact/supplier/create" element={<Suppliercreate />} />
            <Route path="contact/supplier/edit/:id" element={<Supplieredit />} />
            <Route path="contact/supplier/view/:id" element={<Supplierview />} />
            <Route path="contact/supplier/import" element={<Supplierimport />} />
        
            {/* products module */}
            <Route path="product/product/list" element={<Productlist />} />
            <Route path="product/product/create" element={<Productcreate />} />
            <Route path="product/product/edit/:id" element={<Productedit />} />
            <Route path="product/product/view/:id" element={<Productview />} />
            <Route path="product/importproducts" element={<ImportProducts />} />
            <Route path="product/printlabel" element={<PrintLabel />} />
            <Route path="product/category/list" element={<Categorieslist />} />
            <Route path="product/category/create" element={<Categorycreate />} />
            <Route path="product/category/edit/:id" element={<Categoriesedit />} />
            <Route path="product/category/view/:id" element={<Categoryview />} />
            <Route path="product/size/create" element={<Sizecreatetable />} />
            <Route path="product/size/list" element={<Sizelist />} />
            <Route path="product/size/edit/:id" element={<Sizeedit />} />
            <Route path="product/color/list" element={<Colorlist />} />
            <Route path="product/color/create" element={<Colorcreate />} />
            <Route path="product/color/edit/:id" element={<Coloredit />} />
            <Route path="product/unit/list" element={<Unitslist />} />
            <Route path="product/unit/create" element={<Unitcreate />} />
            <Route path="product/unit/edit/:id" element={<Unitsedit />} />
            <Route path="product/size/view/:id" element={<Sizeview />} />
            <Route path="product/unit/view/:id" element={<Unitview />} />
            <Route path="product/color/view/:id" element={<Colorview />} />
            <Route path="product/discount/view/:id" element={<Discountview />} />
            <Route path="product/stock/list" element={<Stocklisttable />} />
            <Route path="product/stock/create/:id/:qty" element={<Stockcreate />} />
            <Route path="product/discount/list" element={<Discoutlist />} />
            <Route path="product/discount/create" element={<Discountcreate />} />
            <Route path="product/discount/edit/:id" element={<Discountedit />} />
            {/* Rack */}
            <Route path="product/rack/create" element={<Rackcreate />} />
            <Route path="product/rack/list" element ={<Racklist />} />
            <Route path="product/rack/edit/:id" element ={<Rackedit />} />
            <Route path="product/rack/view/:id" element ={<Rackview />} />
            {/* Brand */}
            <Route path="product/brand/create" element={<BrandCreate />} />
            <Route path="product/brand/list" element={<Brandlist />} />
            <Route path="product/brand/edit/:id" element={<Brandedit />} />
            <Route path="product/brand/view/:id" element={<Brandview />} />
            <Route path="product/group/create" element={<GroupCreate />} />
            <Route path="product/group/list" element={<GroupList />} />
            {/* section grouping */}
            <Route path="product/sectiongrouping" element={<SectionGrouping />} />
            {/* unit group */}
            <Route path="product/unitgrouping" element={<UnitGrouping />} />
            <Route path="product/style/create" element={<Stylecreate />} />
            <Route path="product/style/list" element={<Stylelist />} />
            <Route path="product/style/edit/:id" element={<Styleedit />} />
            <Route path="product/style/view/:id" element={<StyleView />} />

            { /* purchase module */ }
            <Route path="purchase/purchase/list" element={<Purchaselists />} />
            <Route path="purchase/purchase/create" element={<Purchasecreate />} />
            <Route path="purchase/purchase/edit/:id" element={<Purchaseedit />} />
            <Route path="purchase/purchase/view/:id" element={<Purchaseview />} />
            <Route path="purchase/purchasereturn/create" element={<Purchasereturncreate />} />
            <Route path="purchase/purchasereturn/edit/:id" element={<Purchasereutrnedit />} />
            <Route path="purchase/purchasereturn/list" element={<Purchasereturnlist />} />
            <Route path="purchase/purchasereturn/view/:id" element={<Purchasereutrnview />} />

            {/* stock transfer and adjust */}
            <Route path="stocktransfer/list" element={<Transferlists />} />
            <Route path="stocktransfer/create" element={<StockTransferCreatetable />} />
            <Route path="stocktransfer/view/:id" element={<Stocktransferview />} />
            <Route path="stockadjust/list" element={<StocktransferandAdjust />} />
            <Route path="stockadjust/view/:id" element={<Stockadjustview />} />
            <Route path="stock/adjustment/list" element={<StockAdjustmentList />} />
            <Route path="stock/adjustment/create" element={<StockAdjustmentcreate />} />
            <Route path="stock/adjustment/view/:id" element={<StockAdjustmentView />} />
            <Route path="stock/adjustmenttype/create" element={<Adjustmenttypecreate />} />
            <Route path="stock/adjustmenttype/edit/:id" element={<AdjustmenttypeEdit />} />
            <Route path="stock/adjustmenttype/view/:id" element={<AdjustmentTypeView />} />
            <Route path="stock/report" element={<Categoryvicereport />} />
            <Route path="stock/manualstockentry/create" element={<ManualStockcreate />} />
            <Route path="stock/manualstockentry/list" element={<ManualStockList />} />
            <Route path="stock/manualstockentry/view/:id" element={<ManualStockView />} />
            
            { /* sell module */ }
            <Route path="sell/pos/list" element={<Poslist />} />
            <Route path="sell/pos/create" element={<Poscreate />} />
            <Route path="sell/pos/create/:id" element={<Posedit />} />
            <Route path="sell/pos/view/:id" element={<Posview />} />
            {/* <Route path="sell/pos/draft/:id" element={<Draftedit />} /> */}
            <Route path="sell/draft/view/:id" element={<Draftview />} />
            <Route path="sell/quotation/view/:id" element={<Quotationview />} />
            {/* <Route path="sell/pos/quotation/:id" element={<Quotationedit />} /> */}
            <Route path="sell/draft/list" element={<Draftlist />} />
            <Route path="sell/quotation/list" element={<Quotationlist />} />
     
            { /* Expenses module */ }
            <Route path="expense/expense/list" element={<Expenselist/>} />
            <Route path="expense/expense/create" element={<Expensecreate />} />
            <Route path="expense/espense/edit/:id" element={<Expenseedit />} />
            <Route path="expense/expensecategory/list" element={<Expensecategorylist/>} />
            <Route path="expense/expensecategory/create" element={<ExpenseCategorycreate/>} />
            <Route path="expense/expensecategory/edit/:id" element={<Expensecategoryedit/>} />
            <Route path="expense/expensecategory/view/:id" element={<Expensecategoryview />} />
            <Route path="expense/espense/view/:id" element={<Expenseview />} />

            {/* Passwords module */}
            <Route path="/passwords/folder/list" element={<Folderlist />} />
            <Route path="/passwords/folder/view/:id" element={<Folderview />} />
            <Route path="/passwords/password/list" element={<Passwordlist />} />
            <Route path="/passwords/password/create" element={<Passwordcreate />} />
            <Route path="/passwords/password/edit/:id" element={<Passwordedit />} />
            <Route path="/passwords/password/view/:id" element={<Passwordview />} />
            <Route path="/passwords/assignpassword/create" element={<AssignedPasswordlist />} />
            <Route path="/passwords/assignpassword/list" element={<Passworduser />} />

            { /* Settings module */}
            <Route path="settings/business/list" element={<Businesssettings />} />
            <Route path="settings/location/list" element={<Locationlist />} />
            <Route path="settings/location/create" element={<Locationcreate />} />
            <Route path="settings/location/edit/:id" element={<Businesslocationedit />} />
            <Route path="settings/location/view/:id" element={<Businesslocationview />} />
            <Route path="settings/alpharate/list" element={<Alpharatelist />} />
            <Route path="settings/alpharate/create" element={<Alphacreate />} />
            <Route path="settings/alpharate/view/:id" element={<Alphaedit />} />
            <Route path="settings/alpharate/print/:id" element={<Alpharateprint />} />
            <Route path="settings/taxrate/list" element={<Taxratelist />} />
            <Route path="settings/taxrate/create" element={<TaxrateCreate />} />
            <Route path="settings/hsn/create" element={<Hsncreate />} />
            <Route path="settings/taxrateg/create" element={<TaxGrpCreate />} />
            <Route path="settings/taxrate/edit/:id" element={<Taxrateedit />} />
            <Route path="settings/hsn/view/:id" element={<Hsnview />} />
            <Route path="settings/taxrategroup/view/:id" element={<Taxrategroupview />} />
            <Route path="settings/taxrate/view/:id" element={<Taxrateview />} />
            <Route path="settings/paymentintegration/list" element={<Paymentintegrationlist />} />
            <Route path="settings/paymentintegration/create" element={<Paymentintegrationcreate />} />
            <Route path="settings/paymentintegration/edit/:id" element={<Payintegrationedit />} />
            <Route path="settings/paymentintegration/view/:id" element={<Payintegrationview />} />

            <Route path="selectall" element={<SelectAllGrouping />} />
            </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default Applicationstack; 