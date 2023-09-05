import React, { useState, useEffect, useContext } from 'react';
import {Box} from '@mui/material';
import CanvasJSReact from './canvasjs.react';
import moment from "moment";
import { UserRoleAccessContext } from '../context/Appcontext';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/Appcontext';
import axios from 'axios';
import { SERVICE } from '../services/Baseservice';
import { ThreeDots } from 'react-loader-spinner';


var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Dashpurbarchart = ({ isLocationChange, isLocations }) => {

	const { auth, setngs } = useContext(AuthContext);

	const [dataPurchase, setDataPurchase] = useState([]);
	const [apidata, setApidata] = useState([]);
	const currentDate = new Date();
	var colors = ["#77C2FE", "#249CFF", "#1578CF", "#0A579E", "#003870"];
	const { isUserRoleAccess, setAllPos, setIsActiveLocations, setAllLocations, setAllPurchases, isUserRoleCompare, isActiveLocations, allPurchases, allPos } = useContext(UserRoleAccessContext);

	const [isLoader, setIsLoader] = useState(false);

	const previousWeekDates = [];

	for (let i = 1; i <= 7; i++) {
		const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7 + i);
		previousWeekDates.push(moment(previousDate).utc().format('DD-MM-YYYY'));

	}

	// purchase data fetching get call
	const fetchPurchase = async () => {
		try {
			let res = await axios.post(SERVICE.WEEKLYPURCHASE, {
				businessid: String(setngs.businessid),
				userassignedlocation: [isUserRoleAccess.businesslocation],
				islocation: Boolean(isLocationChange),
				location: String(isLocations)
			});

			let res_data = res.data.weeklyreport
			const result = [...res_data.reduce((r, o) => {
				const key = moment(o.purchasedate).utc().format('DD-MM-YYYY');
				const items = r.get(key) || Object.assign({}, o, {
					nettotal: 0
				});
				items.nettotal += +o.nettotal
				return r.set(key, items);
			}, new Map).values()];
			setDataPurchase(result?.map(function (data, i) {
				return { label: moment(data.purchasedate).utc().format('DD-MM-YYYY'), y: data.nettotal, color: colors[i] };
			}))
			setIsLoader(true)
		} catch (err) {
			setIsLoader(true)
			const messages = err?.response?.data?.message;
			if (messages) {
				toast.error(messages);
			}
			else {
				toast.error("Something went wrong!")
			}
		}
	}

	useEffect(() => {
		fetchPurchase()
	}, [isLocationChange, isLocations])

	// options for purchase sales
	const optionsPurchase = {
		animationEnabled: true,
		title: {
			text: "Weekly Purchases",
			fontSize: 20,
			// fontStyle: "timesnewroman"
		},
		axisX: {
			title: "Date",
			valueFormatString: "MMM DD"
		},
		axisY: {
			title: "Purchase (₹)",
			includeZero: false
		},
		data: [
			{
				showInLegend: true,
				type: "column",
				dataPoints: dataPurchase,
				name: "Purchase"
			},
		]
	}

	return (
		<div>
			{isLoader ? (
				<>
					<CanvasJSChart sx={{ width: '100%' }} options={optionsPurchase} /><br />
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
export default Dashpurbarchart;
