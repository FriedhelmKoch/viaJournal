/*!
 * 
 * Copyright (c) 2014 Friedhelm Koch
 *
 * This file is part of viaLinked Project. It is subject to the license terms 
 * in the LICENSE file found in the top-level directory of this distribution 
 * and at http://www.viaLinked.com/license.html. 
 * No part of viaLinked Project, including this file, may be copied, modified, 
 * propagated, or distributed except according to the terms contained in the 
 * LICENSE file.
 *
 */

var viaCalc = viaCalc || {};
viaCalc.Pages = viaCalc.Pages || {};


// handles all of the page events and dispatches them to a handler, if one exists
viaCalc.Pages.Kernel = function (event) {
	var that = this,
		eventType = event.type,
		pageName = $(this).attr("calc");

	// if you want to see jQuery Mobile's page event lifecycle, uncomment the line below
	//console.log("Kernel: "+pageName+", "+eventType);
	if (viaCalc && viaCalc.Pages && pageName && viaCalc.Pages[pageName] && viaCalc.Pages[pageName][eventType]) {
		viaCalc.Pages[pageName][eventType].call(that);
	}};


// hooks all of the page events
// uses "live" so that the event will stay hooked even if new elements are added later
viaCalc.Events = function () {
	$("div[calc]").on(
		'pagebeforecreate pagecreate pagebeforeload pagebeforeshow pageshow pagebeforechange pagechange pagebeforehide pagehide pageinit',
		viaCalc.Pages.Kernel);
}();


// this is the handler for all page events
viaCalc.Pages.calculator = function(){
	var pageshow = function () {
		viaCalc.Display.init($("#displayControl")[0]);
		$(".calc").tap(function(event){
			var key = $(this).attr("calc-key"),
				id = this.id;
//			event.preventDefault();

			switch(id){
				case "key0":
				case "key1":
				case "key2":
				case "key3":
				case "key4":
				case "key5":
				case "key6":
				case "key7":
				case "key8":
				case "key9":
				case "keyDecimalPoint":
					viaCalc.Display.enterDigit(key);
					break;
				case "keyC":
					viaCalc.Display.clearDisplay();
					break;
				case "keyCe":
					viaCalc.Display.clearError();
					break;
				case "keySquareRoot":
					viaCalc.Display.squareRoot();
					break;
				case "keyPercent":
					viaCalc.Display.percent();
					break;					
				case "keyInverseSign":
					viaCalc.Display.inverseSign();
					break;
				case "keyInverse":
					viaCalc.Display.inverse();
					break;
				case "keyAdd":
					viaCalc.Display.setOperator("+");
					break;
				case "keySubtract":
					viaCalc.Display.setOperator("-");
					break;
				case "keyMultiply":
					viaCalc.Display.setOperator("*");
					break;
				case "keyDivide":
					viaCalc.Display.setOperator("/");
					break;
				case "keyEquals":
					viaCalc.Display.setOperator("=");
					break;
			}
			return false;
		});
	},
	pagehide = function () {
		$(".calc").unbind("tap");
	};
	return {
		pageshow: pageshow,
		pagehide: pagehide
	};
}();


// Display in this case refers to the input type="text" above the buttons
viaCalc.Display = function() {
	var $displayControl,
		operator,
		operatorSet = false,
		equalsPressed = false,
		accumulator = null,

		add = function(x, y) {
			return x + y;
		},
		divide = function(x, y) {
			if (y == 0) {
				alert("Can't divide by 0");
				return 0;
			}
			return x / y;
		},
		multiply = function(x, y) {
			return x * y;
		},
		subtract = function(x, y) {
			return x - y;
		},
		calculate = function() {
			if (!operator || accumulator == null) return;
			var currNumber = parseFloat($displayControl.value),
				newVal = 0;
			switch (operator) {
				case "+":
					newVal = add(accumulator, currNumber);
					break;
				case "-":
					newVal = subtract(accumulator, currNumber);
					break;
				case "*":
					newVal = multiply(accumulator, currNumber);
					break;
				case "/":
					newVal = divide(accumulator, currNumber);
					break;
			}
			setValue(newVal);
			accumulator = newVal;
		},
		setValue = function(val) {
			$displayControl.value = val;
		},
		getValue = function(){
			return $displayControl.value + "";
		},
		// inverseSign
		inverseSign = function() {
			setValue(-parseFloat($displayControl.value));
		},
		// inverse - Umkehrfunktion
		inverse = function() {
			setValue(1 / parseFloat($displayControl.value));
		},
		// square - Wurzelfunktion
		squareRoot = function() {
			setValue(Math.sqrt(parseFloat($displayControl.value)));
		},		
		// percent - Prozentfunktion (funktioniert nach kaufmännischem Muster!)
		percent = function() {
			var currNumber = parseFloat($displayControl.value);
			if(operator === '+' || operator === '-') {
				setValue(accumulator * currNumber / 100);
			} else {
				setValue(currNumber / 100);
			}
		},
		// clears all of the digits
		clearDisplay = function() {
			accumulator = null;
			equalsPressed = operatorSet = false;
			setValue("0");
		},
		// removes the last digit entered in the display
		clearError = function(){
			var display = getValue();
			// if the string is valid, remove the right most character from it
			// remember: to be valid, must have a value and length
			if(display){
				display = display.slice(0, display.length - 1);
				display = display? display: "0";
				setValue(display);
			}
		},
		// handles a numeric or decimal point key being entered
		enterDigit = function(buttonValue) {
			var currentlyDisplayed = $displayControl.value;
			// keep the max digits to a reasonable number
			if(currentlyDisplayed.length < 20){
				if (operatorSet == true || currentlyDisplayed === "0") {
					setValue("");
					operatorSet = false;
				}
				// already pressed a decimal point
				if(buttonValue === "." && currentlyDisplayed.indexOf(".")>= 0){
					return;
				}
				setValue($displayControl.value + buttonValue);
			}
		},
		setOperator = function(newOperator) {
			if (newOperator === "=") {
				equalsPressed = true;
				calculate();
				return;
			}
			if (!equalsPressed) calculate();
			equalsPressed = false;
			operator = newOperator;
			operatorSet = true;
			accumulator = parseFloat($displayControl.value);
		},
		// set the pointer to the HTML element which displays the text
		init = function(currNumber) {
			$displayControl = currNumber;
		};
	// all of the functions below are visible outside of this function
	return {
		clearDisplay: clearDisplay,
		clearError: clearError,
		inverseSign: inverseSign,
		inverse: inverse,
		squareRoot: squareRoot,
		percent: percent,
		enterDigit: enterDigit,
		setOperator: setOperator,
		init: init
	};
}();


// EOF


