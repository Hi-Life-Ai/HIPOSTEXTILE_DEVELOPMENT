const express = require('express');
const contactRoute = express.Router();

// connect customer group controller
const { EditCusGrp, getAllCGroup, addCGroup, updateCGroup, getSingleCGroup, deleteCGroup } = require('../controller/modules/contact/customergroup');

contactRoute.route('/cgroups').post(getAllCGroup);
contactRoute.route('/editcusgrp').post(EditCusGrp);
contactRoute.route('/cgroup/new').post(addCGroup);
contactRoute.route('/cgroup/:id').get(getSingleCGroup).put(updateCGroup).delete(deleteCGroup);

// connect Customer controller
const { getAllCustomer, addCustomer, updateCustomer, getSingleCustomer, deleteCustomer, getAllCustomerGroup, getAllCustomerEdit } = require('../controller/modules/contact/customer');
contactRoute.route('/customers').post(getAllCustomer);
contactRoute.route('/checkcustomergroups').post(getAllCustomerGroup);
contactRoute.route('/customer/new').post(addCustomer);
contactRoute.route('/customer/:id').get(getSingleCustomer).put(updateCustomer).delete(deleteCustomer);
contactRoute.route('/customeredit').post(getAllCustomerEdit);

// connect supplier controller
const { EditSupplierName, getAllSupplier, getAllSupplierName, addSupplier, updateSupplier, getSingleSupplier, deleteSupplier } = require('../controller/modules/contact/supplier');
contactRoute.route('/suppliers').post(getAllSupplier);
contactRoute.route('/suppliersname').post(getAllSupplierName);
contactRoute.route('/editsupplier').post(EditSupplierName);
contactRoute.route('/supplier/new').post(addSupplier);
contactRoute.route('/supplier/:id').get(getSingleSupplier).put(updateSupplier).delete(deleteSupplier);

module.exports = contactRoute;
