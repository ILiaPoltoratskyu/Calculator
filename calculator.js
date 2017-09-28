function Calculator(sSelector, width, height) {
    var __jCalc = $(sSelector);
    var __jExpression = null;
    var __jValue = null;
    var __jMemIndicator = null;
    var __result = NaN;
    var __memory = 0;
    var __operation = "";
    var __currentValue = NaN;
    var __valueChanging = false;
    var __operatorChanging = false;
    var __sRightOperand = "";
    var __sCurrentExpression = "";

    function calculate() {
        switch (__operation) {
            case "+":
                __result += __currentValue;
                break;
            case "-":
                __result -= __currentValue;
                break;
            case "*":
                __result *= __currentValue;
                break;
            case "/":
                if (__currentValue == 0) {
                    __jValue.text("divide by zero error");
                    clear();
                }
                else 
                    __result /= __currentValue;
                break;
            default:
                __result = __currentValue;
        }
        __currentValue = parseFloat(__result.toPrecision(12));
        __jValue.text(__currentValue);
        __sRightOperand = "";
    }

    function clear() {
        __result = NaN;
        __currentValue = NaN;
        __operation = "";
        __jExpression.html("");
        __sCurrentExpression = "";
        __sRightOperand = "";
    }

    function displayValue() {
        var str = __currentValue.toString();
        return str.indexOf(".") < str.length - 5 ? __currentValue.toFixed(5) : str;
    }

    function handleBackSpace() {
        if (__valueChanging) {
            __jValue.text(__jValue.text().substr(0, __jValue.text().length - 1));
            __currentValue = parseFloat(__jValue.text());
        }
    }

    function handleNumeric(key) {
        if (key == ",") {
            if (__valueChanging) {
                if (__jValue.text().indexOf(".") < 0)
                    __jValue.text(__jValue.text() + ".");
            }
            else
                __jValue.text("0.");
        }
        else
            __jValue.text(__valueChanging ? __jValue.text() + key : key);

        __currentValue = parseFloat(__jValue.text());
        __sRightOperand = "";
        __jExpression.html(__sCurrentExpression);
        __valueChanging = true;
        __operatorChanging = false;
    }

    function handleOperator(key) {
        if (__operatorChanging) {
            __sCurrentExpression = __sCurrentExpression.substr(0, __sCurrentExpression.length - 2); // remove space and previous operator
            if (isNaN(__sCurrentExpression)) { // we have something more than just one value
                if ((__operation == "*" || __operation == "/") && (key == "+" || key == "-"))
                    __sCurrentExpression = __sCurrentExpression.substr(1, __sCurrentExpression.length - 2); // remove brackets
                else if ((__operation == "+" || __operation == "-") && (key == "*" || key == "/"))
                    __sCurrentExpression = "(" + __sCurrentExpression + ")"; // add brackets
            }
        }
        else {
            __sCurrentExpression += ((__sCurrentExpression ? " " : "") + (__sRightOperand || displayValue()));
            if (isNaN(__sCurrentExpression) && (key == "*" || key == "/"))
                __sCurrentExpression = "(" + __sCurrentExpression + ")"; // add brackets
            calculate();
        }

        __sCurrentExpression += (" " + key);
        __jExpression.html(__sCurrentExpression);
        __operation = key;
        __valueChanging = false;
        __operatorChanging = true;
    }

    function handleEqual() {
        calculate();
        __jExpression.html("");
        __result = NaN;
        __operation = "";
        __sRightOperand = "";
        __sCurrentExpression = "";
    }

    function onClick() {
        var btnTxt = $(this).text();

        if (btnTxt.charCodeAt(0) == 10232) // backspace
            handleBackSpace();

        else if ($(this).hasClass("num")) 
            handleNumeric(btnTxt);

        else if ($(this).hasClass("binary")) {
            if (btnTxt.charCodeAt(0) == 8210) // minus
                handleOperator("-");
            else
                handleOperator(btnTxt);
        }

        else {
            __valueChanging = false;
            __operatorChanging = false;
            switch (btnTxt) {
                case "=":
                    handleEqual();
                    break;
                case "1/x":
                    if (__currentValue == 0) {
                        __jValue.text("divide by zero error");
                        clear();
                    }
                    else {
                        __sRightOperand = "1/" + (__sRightOperand || displayValue());
                        __jExpression.html(__sCurrentExpression + " " + __sRightOperand);
                        __currentValue = parseFloat((1 / __currentValue).toPrecision(12));
                        __jValue.text(__currentValue);
                    }
                    break;
                    
                case "%":
                    __currentValue = (__result * __currentValue) / 100;
                    __jValue.text(__currentValue);
                    __sRightOperand = displayValue();
                    __jExpression.html(__sCurrentExpression + " " + __sRightOperand);
                    break;
                case "MC":
                    __memory = 0;
                    __jMemIndicator.hide();
                    break;
                case "MR":
                    __sRightOperand = "";
                    __currentValue = __memory;
                    __jValue.text(__memory);
                    break;
                case "MS":
                    __memory = __currentValue;
                    __jMemIndicator.show();
                    break;
                case "M+":
                    __memory += __currentValue;
                    __jMemIndicator.show();
                    break;
                case "M-":
                    __mцemory -= __currentValue;
                    __jMemIndicator.show();
                    break;
                case "CE":
                    __currentValue = 0;
                    __jValue.text(0);
                    __sRightOperand = "";
                    break;
                case "C":
                    __jValue.text("");
                    clear();
                    break;
                default:
                    switch ($(this).text().charCodeAt(0)) {
                        case 177: // plus/minus
                            var tmp = __sRightOperand || displayValue();
                            __sRightOperand = tmp.indexOf("-") == 0 ? tmp.substr(1, tmp.length-1) : "-" + tmp;
                            __jExpression.html(__sCurrentExpression + " " + __sRightOperand);
                            __currentValue = __currentValue * -1;
                            __jValue.text(__currentValue);
                            break;
                        case 8730: // square root
                            if (__currentValue < 0) {
                                __jValue.text("invalid value");
                                clear();
                            }
                            else {
                                __sRightOperand = "&#8730;" + (__sRightOperand || displayValue());
                                __jExpression.html(__sCurrentExpression + " " + __sRightOperand);
                                __currentValue = parseFloat(Math.sqrt(__currentValue).toPrecision(12));
                                __jValue.text(__currentValue);
                            }
                            break;
                        default:
                            __jValue.text("Not implemented yet ...")
                    }
            }
        }
    }

    function onKeyDown(event) {
        if (!isNaN(event.key))
            handleNumeric(event.key);
        else {
            switch (event.key) {
                case "Backspace":
                    handleBackSpace();
                    break;
                case ".":
                case ",":
                case "Decimal":
                    handleNumeric(",");
                    break;
                case "+":
                case "-":
                case "*":
                case "/":
                    handleOperator(event.key);
                    break;
                case "Add":
                    handleOperator("+");
                    break;
                case "Subtract":
                    handleOperator("-");
                    break;
                case "Multiply":
                    handleOperator("*");
                    break;
                case "Divide":
                    handleOperator("/");
                    break;
                case "=":
                case "Enter":
                    handleEqual();
                    break;
            }
        }
    }

    function createBtn() {
        var btn = $("<div></div>").addClass("button").css("line-height", 0.1 * height + "px").css("font-size", 0.08 * height + "px").click(onClick);
        __jCalc.append(btn);
        return btn;
    }

    // Now let's draw it
    __jCalc.addClass("calculator").css("width", width + "px").css("height", height + "px");
    var divResult = $("<div></div>").addClass("result");
    __jExpression = $("<div></div>").css("line-height", 0.4 * 0.26 * height + "px").css("font-size", 0.4 * 0.20 * height + "px");
    __jValue = $("<div></div>").css("line-height", 0.6 * 0.26 * height + "px").css("font-size", 0.6 * 0.20 * height + "px");
    __jMemIndicator = $("<div></div>").addClass("mem-indicator").css("font-size", 0.05 * height + "px").text("M").hide();
    divResult.append(__jExpression).append(__jValue).append(__jMemIndicator);
    __jCalc.append(divResult);

    createBtn().html("MC");
    createBtn().html("MR");
    createBtn().html("MS");
    createBtn().html("M+");
    createBtn().html("M-");
    createBtn().html("&#10232;").addClass("func").addClass("big");
    createBtn().html("CE")      .addClass("func");
    createBtn().html("C")       .addClass("func");
    createBtn().html("&#177;")  .addClass("func").addClass("big");
    createBtn().html("&#8730;") .addClass("func").addClass("big");
    createBtn().html("7")       .addClass("num");
    createBtn().html("8")       .addClass("num");
    createBtn().html("9")       .addClass("num");
    createBtn().html("/")       .addClass("binary").addClass("func").addClass("big");
    createBtn().html("%")       .addClass("func");
    createBtn().html("4")       .addClass("num");
    createBtn().html("5")       .addClass("num");
    createBtn().html("6")       .addClass("num");
    createBtn().html("*")       .addClass("binary").addClass("func");
    createBtn().html("1/x")     .addClass("func");
    createBtn().html("1")       .addClass("num");
    createBtn().html("2")       .addClass("num");
    createBtn().html("3")       .addClass("num");
    createBtn().html("&#8210;") .addClass("binary").addClass("func").addClass("big");
    createBtn().html("=")       .addClass("func").addClass("equal").addClass("big");
    createBtn().html("0")       .addClass("num").addClass("zero");
    createBtn().html(",")       .addClass("num").addClass("big");
    createBtn().html("+")       .addClass("binary").addClass("func").addClass("big");

    __jCalc.children(".equal").css("line-height", 0.22 * height + "px");

    __jCalc.attr("tabindex", 0);
    __jCalc.focus();
    __jCalc.keydown(onKeyDown);
}

// console.log(0.2 + 0.1); - Just a funny JS bug
