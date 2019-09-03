(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/forms')) :
    typeof define === 'function' && define.amd ? define('ngx-number-format', ['exports', '@angular/core', '@angular/forms'], factory) :
    (global = global || self, factory(global['ngx-number-format'] = {}, global.ng.core, global.ng.forms));
}(this, function (exports, core, forms) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NgxNumberFormatDirective = /** @class */ (function () {
        function NgxNumberFormatDirective(el) {
            this.el = el;
            this._oldValueForDetectChange = null;
            this._oldValue = null;
            this._displayValue = null;
            this._max = 0;
            this._decimal = 0;
            this._format = false;
            this._specialKeys = ['Backspace', 'Tab', 'End', 'Home', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Delete'];
            this._regExNumber = new RegExp(/^[0-9]*$/g);
            this._regExNumberAndDecimal = new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g);
            this._oldSelectionStart = 0;
            this._detectDelete = false;
            this._detectBackspace = false;
            this._detectSelectAll = false;
            this._process = false;
            this.onChange = (/**
             * @param {?} _
             * @return {?}
             */
            function (_) { });
            this.onTouch = (/**
             * @return {?}
             */
            function () { });
        }
        /**
         * @return {?}
         */
        NgxNumberFormatDirective.prototype.ngOnInit = /**
         * @return {?}
         */
        function () {
            this._formElement = this.el.nativeElement;
        };
        Object.defineProperty(NgxNumberFormatDirective.prototype, "initialize", {
            set: /**
             * @param {?} _value
             * @return {?}
             */
            function (_value) {
                this.setFormat(_value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {?} event
         * @return {?}
         */
        NgxNumberFormatDirective.prototype.onKeyDown = /**
         * @param {?} event
         * @return {?}
         */
        function (event) {
            if (this._process) {
                if (event.key == 'Backspace') {
                    this._detectBackspace = true;
                    /** @type {?} */
                    var last = this._formElement.value.substring(this._formElement.selectionStart - 1, this._formElement.selectionStart);
                    if (this._formElement.selectionStart == this._formElement.selectionEnd && last == ',') {
                        this.setCursorAt(this._formElement.selectionStart - 1);
                        event.preventDefault();
                    }
                }
                else {
                    this._detectBackspace = false;
                }
                if (event.key == 'Delete') {
                    this._detectDelete = true;
                    /** @type {?} */
                    var last = this._formElement.value.substring(this._formElement.selectionEnd, this._formElement.selectionEnd + 1);
                    if (this._formElement.selectionStart == this._formElement.selectionEnd && last == ',') {
                        this.setCursorAt(this._formElement.selectionEnd + 1);
                        event.preventDefault();
                    }
                }
                else {
                    this._detectDelete = false;
                }
                if (this._specialKeys.indexOf(event.key) !== -1
                    || (event.keyCode === 65 && (event.ctrlKey || event.metaKey)) // Allow: Ctrl + A
                    || (event.keyCode === 67 && (event.ctrlKey || event.metaKey)) // Allow: Ctrl + C
                    || (event.keyCode === 86 && (event.ctrlKey || event.metaKey)) // Allow: Ctrl + V
                    || (event.keyCode === 88 && (event.ctrlKey || event.metaKey)) // Allow: Ctrl + X
                ) {
                    return;
                }
                /** @type {?} */
                var current = this.el.nativeElement.value;
                /** @type {?} */
                var firstPart = current.substring(0, this._formElement.selectionStart);
                /** @type {?} */
                var secondPart = current.substring(this._formElement.selectionEnd);
                /** @type {?} */
                var next = (firstPart.concat(event.key) + secondPart).replace(/,/g, '');
                /** @type {?} */
                var regEx = this.getRegEx();
                /** @type {?} */
                var value = next.split('.');
                if (next && !String(next).match(regEx) || (value[0].length > this._max && this._formElement.selectionStart == this._formElement.selectionEnd) || (this._decimal > 0 && value.length == 2 && (value[1].length > this._decimal && this._formElement.selectionStart == this._formElement.selectionEnd))) {
                    event.preventDefault();
                }
                else {
                    this._oldSelectionStart = this._formElement.selectionStart;
                    this._oldValue = this._formElement.value;
                }
            }
        };
        /**
         * @param {?} event
         * @return {?}
         */
        NgxNumberFormatDirective.prototype.onClick = /**
         * @param {?} event
         * @return {?}
         */
        function (event) {
            this._oldSelectionStart = this._formElement.selectionStart;
            this._oldValue = this._formElement.value;
            this._oldValueForDetectChange = event.target.value;
        };
        /**
         * @param {?} event
         * @return {?}
         */
        NgxNumberFormatDirective.prototype.onInput = /**
         * @param {?} event
         * @return {?}
         */
        function (event) {
            /** @type {?} */
            var value = event.target.value;
            if (this._process) {
                if (value && !String(value).replace(/,/g, '').match(this.getRegEx())) {
                    this._formElement.value = '';
                }
                else {
                    if (this._detectBackspace || this._detectDelete) {
                        this._oldSelectionStart = this._formElement.selectionStart - 1;
                        this._oldValue = this._formElement.value;
                    }
                    this.onValueChange(value);
                }
            }
        };
        /**
         * @param {?} event
         * @return {?}
         */
        NgxNumberFormatDirective.prototype.onBlur = /**
         * @param {?} event
         * @return {?}
         */
        function (event) {
            /** @type {?} */
            var value = event.target.value;
            if (value.length > 0 && this._decimal > 0) {
                value = value.replace(/,/g, '');
                value = Number(value).toFixed(this._decimal).toString();
                this._formElement.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            this.onTouch();
            // Fix bug on Internet Explorer and Microsoft Edge not fire change event when set value to input element by javascript.
            /** @type {?} */
            var isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
            if (isIEOrEdge && (value != this._oldValueForDetectChange)) {
                /** @type {?} */
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent("change", false, true);
                event.target.dispatchEvent(evt);
            }
        };
        /**
         * @param {?} _oldValue
         * @param {?} _oldSelectionStart
         * @param {?} _newValue
         * @return {?}
         */
        NgxNumberFormatDirective.prototype.processCursorPosition = /**
         * @param {?} _oldValue
         * @param {?} _oldSelectionStart
         * @param {?} _newValue
         * @return {?}
         */
        function (_oldValue, _oldSelectionStart, _newValue) {
            /** @type {?} */
            var _oldTotalComma = 0;
            /** @type {?} */
            var _newTotalComma = 0;
            if (_newValue) {
                _oldValue = _oldValue.substr(0, _oldSelectionStart);
                _oldTotalComma = (_oldValue.match(/,/g) || []).length;
                _newValue = _newValue.substr(0, _oldSelectionStart + 1);
                _newTotalComma = (_newValue.match(/,/g) || []).length;
                this.setCursorAt(_oldSelectionStart + 1 + (_newTotalComma - _oldTotalComma));
            }
        };
        /**
         * @param {?} position
         * @return {?}
         */
        NgxNumberFormatDirective.prototype.setCursorAt = /**
         * @param {?} position
         * @return {?}
         */
        function (position) {
            if (this._formElement.setSelectionRange) {
                this._formElement.focus();
                this._formElement.setSelectionRange(position, position);
            }
        };
        /**
         * @param {?} value
         * @return {?}
         */
        NgxNumberFormatDirective.prototype.writeValue = /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (value != null && value != '') {
                if (typeof (value) === 'string') {
                    value = value.replace(/,/g, '');
                }
                else {
                    value = value.toString();
                }
            }
            this.onValueChange(value, false);
        };
        /**
         * @param {?} fn
         * @return {?}
         */
        NgxNumberFormatDirective.prototype.registerOnChange = /**
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            this.onChange = fn;
        };
        /**
         * @param {?} fn
         * @return {?}
         */
        NgxNumberFormatDirective.prototype.registerOnTouched = /**
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            this.onTouch = fn;
        };
        /**
         * @param {?} value
         * @return {?}
         */
        NgxNumberFormatDirective.prototype.setDisabledState = /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._formElement.disabled = value;
        };
        /**
         * @private
         * @param {?} newValue
         * @param {?=} cursor
         * @return {?}
         */
        NgxNumberFormatDirective.prototype.onValueChange = /**
         * @private
         * @param {?} newValue
         * @param {?=} cursor
         * @return {?}
         */
        function (newValue, cursor) {
            if (cursor === void 0) { cursor = true; }
            if (newValue !== this._displayValue && this._process) {
                /** @type {?} */
                var value = void 0;
                if ((newValue == null) || (newValue.trim() === '')) {
                    value = '';
                }
                else {
                    value = newValue.replace(/,/g, '');
                    value = this.removeLeadingZero(value);
                }
                if (this._format) {
                    this._displayValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                else {
                    this._displayValue = value;
                }
                this._formElement.value = this._displayValue;
                this.onChange(value);
                if (cursor) {
                    this.processCursorPosition(this._oldValue, this._oldSelectionStart, this._displayValue);
                }
            }
        };
        /**
         * @private
         * @param {?} value
         * @return {?}
         */
        NgxNumberFormatDirective.prototype.removeLeadingZero = /**
         * @private
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (value.indexOf('.') == -1) {
                /** @type {?} */
                var convertVal = +value;
                value = convertVal.toString();
            }
            return value;
        };
        /**
         * @private
         * @return {?}
         */
        NgxNumberFormatDirective.prototype.getRegEx = /**
         * @private
         * @return {?}
         */
        function () {
            return (this._decimal > 0) ? this._regExNumberAndDecimal : this._regExNumber;
        };
        /**
         * @private
         * @param {?} _value
         * @return {?}
         */
        NgxNumberFormatDirective.prototype.setFormat = /**
         * @private
         * @param {?} _value
         * @return {?}
         */
        function (_value) {
            if (_value) {
                this._process = true;
            }
            else {
                this._process = false;
            }
            if (_value.indexOf(',') !== -1) {
                this._format = true;
            }
            else {
                this._format = false;
            }
            _value = _value.replace(/,/g, '');
            /** @type {?} */
            var data = _value.split('.');
            if (data.length == 1) {
                this._max = data[0].length;
            }
            else if (data.length == 2) {
                this._max = data[0].length;
                this._decimal = data[1].length;
            }
        };
        NgxNumberFormatDirective.decorators = [
            { type: core.Directive, args: [{
                        selector: '[ngxNumberFormat]',
                        providers: [
                            {
                                provide: forms.NG_VALUE_ACCESSOR,
                                useExisting: core.forwardRef((/**
                                 * @return {?}
                                 */
                                function () { return NgxNumberFormatDirective; })),
                                multi: true
                            }
                        ]
                    },] }
        ];
        /** @nocollapse */
        NgxNumberFormatDirective.ctorParameters = function () { return [
            { type: core.ElementRef }
        ]; };
        NgxNumberFormatDirective.propDecorators = {
            initialize: [{ type: core.Input, args: ['ngxNumberFormat',] }],
            onKeyDown: [{ type: core.HostListener, args: ['keydown', ['$event'],] }],
            onClick: [{ type: core.HostListener, args: ['click', ['$event'],] }],
            onInput: [{ type: core.HostListener, args: ['input', ['$event'],] }],
            onBlur: [{ type: core.HostListener, args: ['blur', ['$event'],] }]
        };
        return NgxNumberFormatDirective;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NgxNumberFormatModule = /** @class */ (function () {
        function NgxNumberFormatModule() {
        }
        NgxNumberFormatModule.decorators = [
            { type: core.NgModule, args: [{
                        declarations: [NgxNumberFormatDirective],
                        exports: [NgxNumberFormatDirective]
                    },] }
        ];
        return NgxNumberFormatModule;
    }());

    exports.NgxNumberFormatModule = NgxNumberFormatModule;
    exports.ɵa = NgxNumberFormatDirective;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ngx-number-format.umd.js.map
