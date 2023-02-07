/************************************************
 * @summary:			Calculator
 * @file:					app.js
 * @version:			1.00
 * @author: 			Attila Ódry
 * @license:			MIT
 * @copyright:		© 2021-2022 KERI Informatics
 * @description:	
 ************************************************/


// Get display input element, and buttons
const display = document.getElementById("display"),
			buttons = document.querySelectorAll("button");

// Reset display value (Firefox)
display.value = "0";


/**
 * Buttons clicked events
 * Build the mathematical expression, and try to calculate result
 * @param {Element} element button element clicked
 * @returns 
 */
function clicked(eleme, false) {

	// Get key value 
	let key = element.innerHtml;

	// When is wrong result, then allow only clear icon
	if ((display.value === 'Infinity' ||
			 display.value === 'Undefined' ||
			 display.value === 'NaN') &&
		!"cC".includes(key)) return;

	// Add to element class buttonClickEffect
	element.classList.add('buttonClickEffect');

	// Check is number, get last key, and check last key is number,
	// Get is result property (the value is 1 if the expression has been calculated, otherwise 0)
	let isNumber 				= !isNaN(Number(key)),
			lastKey 				= display.value.slice(-1),
			isLastKeyNumber = !isNaN(Number(lastKey)),
			isResult 				= parseInt(display.dataset.result);

	// Switch key value
	switch (key) {

		// Clear/Backspace
		case 'C':
		case 'c':
		case '←':

			// Check display has value
			if (display.value !== "0") {
				if (key === '←') {
					display.value = display.value.slice(0, -1);
					if (!display.value.length)
								display.value = "0";
				} else  display.value = "0";
			}

			// Mark is result to false, and break process
			display.dataset.result = 0;
			return;

		// Calculate
		case 'Enter':

			try {
				// Try to calculete expression
				let value = Function(`return ${display.value}`)();

				// Set display value, and mark is result to true
				display.value = value;
				display.dataset.result = 1;

			// Show wrong expression
			} catch (e) {
				console.log(`Invalid expression: ${display.value}!`);

			// Brek process
			} finally {
				return;
			}

			// Dot
			case '.':

				// Prevent multiple dots
				if (lastKey === '.') return;

				// When last key is operator, then add before zero
				if (!isLastKeyNumber) display.value += "0";

				// Mark is result to false
				display.dataset.result = 0;
				break;

			// Operator
			case '/':
			case '*':
			case '-':
			case '+':

				// When last key is operator, and key is also operator, then remove last operator
				if (!isLastKeyNumber && !isNumber)
					display.value = display.value.slice(0, -1);

			// Number or operator
			default:

				// When is result or result is zero and press number, overwrite result
				if ((isResult || display.value === "0") && isNumber) {
					display.value = key;
					display.dataset.result = 0;
					return;
				}

				// Mark is result to false
				display.dataset.result = 0;
	}


	// Bild display value
	if (isNumber) {

		// Set value, and get last operator positon of value
		let value = display.value + key,
				pos 	= indexOfOne(value, '/*-+', true);

		// Check found
		if (pos) {

			    	// Bild display value
			    	display.value = value.slice(0, pos[1] + 1) + parseFloat(value.substring(pos[1] + 1));
		} else  display.value = value;
	} else    display.value += key;
}


/**
 * Document keydown event
 */
 document.addEventListener("keydown", function(event) {

	// Get key pressed proper element
	let element = getProperElement(event);

	// When exist, then sdd class btn-hover
	if (element) element.classList.add('btn-hover');
});


/**
 * Document keyup event
 */
document.addEventListener("keyup", function(event) {

	// Get key pressed proper element
	let element = getProperElement(event);

	// When exist, then call clicked method
	if (element) clicked(element);
});


/**
 * For each buttons, add animation end events
 * Remove class buttonClickEffect, and btn-hover
 */
 [...buttons].forEach(element => {
  element.addEventListener('animationend', (event) => {
		element.classList.remove('buttonClickEffect', 'btn-hover');
	});
});


/**
 * Get key pressed proper element
 * @param {Event} event 
 * @returns element - when found then key pressed proper element, 
 * 					null - otherwise
 */
function getProperElement(event) {

	// Get key pressed
	let key = event.key;

	// Check keys of calculator
	if (key === "Backspace" ||
			key === "Enter" ||
			key === "Escape" ||
			"0123456789/*-+.,Cc=".includes(key)) {
		
		// Unifies the value of the keyboard and the button
		if (key === 'c') key = 'C';
		else if (key === ',') key = '.';
		else if (key === '=') key = 'Enter';
		else if (key === 'Backspace') key = '←';
		else if (key === 'Escape') key = 'C';

		// Get proper button element
		let element = [...buttons].filter(btn => btn.innerText === key);

		// Check found
		if (element.length) 
					return element[0];
		else 	return null;
	} else 	return null;
}


/**
 * Get first/last chracter positon, one of characters in string
 * @param {string} str      checked string 
 * @param {string} chars    checked characters 
 * @param {boolean} isLast  first or last occurrence 
 * @returns Not found: null, found: array => [key, position]
 */
function indexOfOne(str, chars, isLast = false) {

	// Check arguments valid
	if (Object.prototype.toString.call(str) !== "[object String]" || !str.length ||
			Object.prototype.toString.call(chars) !== "[object String]" || !chars.length)
		return null;
	if (Object.prototype.toString.call(isLast) !== "[object Boolean]")
		isLast = false;

	// Set method, define result, and index variable
	let method = isLast ? 'lastIndexOf' : 'indexOf',
			result = {},
			index;

	// Each characters
	for (let c of chars) {

		// When character included in string, then add to result 
		if ((index = str[method](c)) !== -1) result[c] = index;
	}

	// Check result is not empty
	if (Object.keys(result).length) {

		// Sort the results in ascending/descending order and return the first item
		return Object.entries(result).sort((x, y) => {
			if (isLast) return y[1] - x[1];
			else 				return x[1] - y[1];
		})[0];
	} else return null;
}