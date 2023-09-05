import React, { useState, useEffect, useContext } from 'react';
import {Box} from '@mui/material';
import CanvasJSReact from './canvasjs.react';
import moment from "moment";
import { AuthContext, UserRoleAccessContext } from '../context/Appcontext';
import { toast } from 'react-toastify';
import { SERVICE } from '../services/Baseservice';
import Headtitle from '../components/header/Headtitle';
import Dashcuspie from './Dashcuspie';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Dashbrdchart = ({ isLocations, isLocationChange }) => {

	const [dataPoints, setDataPoints] = useState([]);
	const { setngs } = useContext(AuthContext);
	const currentDate = new Date();
	const [apidata, setApidata] = useState([]);
	const { isUserRoleAccess, setAllPos, setIsActiveLocations, setAllLocations, setAllPurchases, isUserRoleCompare, isActiveLocations, allPurchases, allPos } = useContext(UserRoleAccessContext);

	var colors = ["#97A1D9", "#6978C9", "#4A5596", "#2C3365", "#111539", "#003870", "#77C2FE", "#0087AC"];
	let allArray = [];


	const [isLoader, setIsLoader] = useState(false);





	const fetchAllSales = async () => {
		try {
			let res = await axios.post(SERVICE.WEEKLYSALEPOS, {
				businessid: String(setngs.businessid),
				businesslocation: [isUserRoleAccess.businesslocation],
				islocation: Boolean(isLocationChange),
				location: String(isLocations)
			});

			let res_data = res.data.weeklyreport


			const resultpos = [...res_data.reduce((r, o) => {
				const key = moment(o.date).utc().format('DD-MM-YYYY');
				const items = r.get(key) || Object.assign({}, o, {
					aftergranddisctotal: 0
				});

				items.aftergranddisctotal += +o.aftergranddisctotal
				return r.set(key, items);

			}, new Map).values()];

			allArray = resultpos?.map(function (data, i) {
				return { label: moment(data.date).utc().format('DD-MM-YYYY'), y: data.aftergranddisctotal, color: colors[i] };
			});
			setDataPoints(allArray);
			setIsLoader(true)

		} catch (err) {
			setIsLoader(true)

			const messages = err?.response?.data?.message;
			if (messages) {
				toast.error(messages);
			} else {
				toast.error("Something went wrong!")
			}
		}
	};











	useEffect(() => {

		fetchAllSales();
	}, [isLocationChange, isLocations])

	// options for Pos Sales
	const options = {
		animationEnabled: true,
		title: {
			text: "Weekly Sales",
			fontSize: 20,
		},
		axisX: {
			title: "Date",
			valueFormatString: "MMM DD"
		},
		axisY: {
			title: "Sales (₹)",
			includeZero: false
		},
		data: [
			{
				showInLegend: true,
				type: "column",
				dataPoints: dataPoints,
				name: "sales"
			},
		]
	}

	return (
		<div>
			{isLoader ? (
				<>
					<CanvasJSChart options={options} /><br /><br />
				</>
			) : (
				<>
					<Box sx={{ display: 'flex', justifyContent: 'center' }}>
						<ThreeDots height="80" width="80" radius="9" color="#1976D2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
					</Box>
				</>
			)}

		</div>
	);

}
export default Dashbrdchart;
