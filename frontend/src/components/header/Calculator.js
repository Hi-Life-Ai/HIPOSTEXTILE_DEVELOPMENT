import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Style.css';

let output = '';
let history = '';
let symbols = ['*', '-', '+', '/'];

const keys = [
	{ id: 'clear', class: 'function', value: 'C' },
	{ id: 'clearBack', class: 'function', value: 'CE' },
	{ id: 'multiply', class: 'operator', value: '*' },
	{ id: '9', class: 'number', value: '9' },
	{ id: '8', class: 'number', value: '8' },
	{ id: '7', class: 'number', value: '7' },
	{ id: 'minus', class: 'operator', value: '-' },
	{ id: '6', class: 'number', value: '6' },
	{ id: '5', class: 'number', value: '5' },
	{ id: '4', class: 'number', value: '4' },
	{ id: 'add', class: 'operator', value: '+' },
	{ id: '3', class: 'number', value: '3' },
	{ id: '2', class: 'number', value: '2' },
	{ id: '1', class: 'number', value: '1' },
	{ id: 'divide', class: 'operator', value: '/' },
	{ id: 'dot', class: 'number', value: '.' },
	{ id: '0', class: 'number', value: '0' },
	{ id: '%', class: 'number', value: '%' },
	{ id: 'calc', class: 'function', value: '=' }
];

function Keyboard({ onClick }) {
	return (
		<div className="keyboard">
			{keys.map(key => (
				<div
					className="btn"
					id={key.id}
					key={key.id}
					onClick={() => onClick(key.id, key.class, key.value)}
				>
					{key.value}
				</div>
			))}
		</div>
	);
}

Keyboard.propTypes = {
	onClick: PropTypes.func
};

function ResultView({ history, output }) {
	// CHANGE COLOR TO RED IF ERROR OCCURRED
	let colorStyle = {
		color: output === 'Error' ? '#9f3ed7' : '#9f3ed7'
	};

	return (
		<div style={colorStyle} className="result">
			<div className="history">{history}</div>
			<div className="output">{output}</div>
		</div>
	);
}

ResultView.propTypes = {
	history: PropTypes.string,
	output: PropTypes.string
};

function Calculator() {
	const [state, setState] = useState({
		history: '',
		displayValue: ''
	});
	const updateState = () => {
		setState({ history: history.toString(), displayValue: output.toString() });
	};

	// ONCLICK BUTTON CLICK
	const onClick = (id, keyType, value) => {
		// CONVERT TO STRING
		output = output.toString();
		// GET LAST INPUT VALUE
		let lastInput = output.slice(-1);

		switch (keyType) {
			case 'function':
				functionKey(id, lastInput);
				break;
			case 'operator':
				operatorKey(value, lastInput);
				break;
			case 'number':
				numberKey(value, lastInput);
				break;
			default:
				return;
		}
	};
	const functionKey = (id, lastInput) => {
		const resetOutput = display => {
			// RESET VALUES
			history = '';
			output = '';
			// Update state if display == true
			display && updateState();
		};
		const calculate = lastInput => {
			// CHECK IF LAST INPUT IS NUMBER AND OUTPUT IS NOT EMPTY
			if (!symbols.includes(lastInput) && output) {
				try {
					history = output;
					output = eval(output.replace(/%/g, '*0.01'));
					output = Number.isInteger(output) ? output : output.toFixed(3);
					updateState();
					// UPDATE HISTORY TO RESULT AND RESET OUTPUT
					history = output;
					output = '';
				} catch (error) {
					output = 'Error';
					updateState();
					resetOutput();
				}
			}
		};

		switch (id) {
			case 'clear':
				resetOutput(true);
				break;
			case 'clearBack':
				output = output.slice(0, -1);
				updateState();
				break;
			case 'calc':
				calculate(lastInput);
				break;
			default:
				return;
		}
	};
	const operatorKey = (value, lastInput) => {
		// PREVENT STARTING WITH AN OPERATOR
		if (output === '' && value !== '-') {
			return;
		} else {
			// REPLACE OPERATOR SYMBOL IF LASTINPUT IS OPERATOR
			symbols.includes(lastInput)
				? (output = output.slice(0, -1) + value)
				: (output += value);
		}
		updateState();
	};
	const numberKey = (value, lastInput) => {
		// PREVENT ENTERING . OR % MULTIPY TIMES
		if (value === '.' || value === '%') {
			// PREVENT STARTING WITH '%'
			if (output === '' && value === '%') return;
			lastInput === '.' || lastInput === '%' || (output += value);
		} else {
			output += value;
		}
		updateState();
	};

	return (
		<div className="app">
			<div className="container">
				<ResultView history={state.history} output={state.displayValue} />
				<Keyboard onClick={onClick} />
			</div>
		</div>
	);
}


export default Calculator;