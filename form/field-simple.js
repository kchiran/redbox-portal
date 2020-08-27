"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const field_base_1 = require("./field-base");
const forms_1 = require("@angular/forms");
const _ = require("lodash");
const moment_es6_1 = require("moment-es6");
class NotInFormField extends field_base_1.FieldBase {
    constructor(options, injector) {
        super(options, injector);
    }
    createFormModel(valueElem = null) {
    }
    getGroup(group, fieldMap) {
        this.fieldMap = fieldMap;
        _.set(fieldMap, `${this.getFullFieldName()}.field`, this);
    }
    reactEvent(eventName, eventData, origData) {
    }
}
exports.NotInFormField = NotInFormField;
class SelectionField extends field_base_1.FieldBase {
    constructor(options, injector) {
        super(options, injector);
        this.selectOptions = [];
        this.storeValueAndLabel = false;
        this.onItemSelect = new core_1.EventEmitter();
        if (options.selectFor && options.defaultSelect) {
            const newOptions = _.defaultTo(_.find(options['options'], f => f.key === options.selectFor), _.find(options['options'], f => f.key === options.defaultSelect));
            options['options'] = newOptions.value;
        }
        this.selectOptions = _.map(options['options'] || [], (option) => {
            option['label'] = this.getTranslated(option['label'], option['label']);
            option['value'] = this.getTranslated(option['value'], option['value']);
            return option;
        });
        if (options['storeValueAndLabel']) {
            this.storeValueAndLabel = true;
            if (options['value'] == undefined) {
                let emptyOptions = _.find(this.selectOptions, selectOption => {
                    return selectOption.value == "";
                });
                if (emptyOptions != null) {
                    this.value = emptyOptions;
                }
            }
        }
    }
    createFormModel() {
        if (this.controlType == 'checkbox') {
            const fgDef = [];
            _.map(this.selectOptions, (opt) => {
                const hasValue = _.find(this.value, (val) => {
                    return val == opt.value;
                });
                if (hasValue) {
                    fgDef.push(new forms_1.FormControl(opt.value));
                }
            });
            return new forms_1.FormArray(fgDef);
        }
        else {
            return super.createFormModel();
        }
    }
    nextOption() {
        if (this.controlType == 'radio') {
            let nextIdx = 0;
            const opt = _.find(this.selectOptions, (opt, idx) => {
                const match = opt.value == this.value;
                if (match) {
                    nextIdx = ++idx;
                }
                return match;
            });
            if (nextIdx >= this.selectOptions.length) {
                nextIdx = 0;
            }
            const value = this.selectOptions[nextIdx].value;
            this.setValue(value);
        }
        return this.value;
    }
}
__decorate([
    core_1.Output(),
    __metadata("design:type", typeof (_a = typeof core_1.EventEmitter !== "undefined" && core_1.EventEmitter) === "function" ? _a : Object)
], SelectionField.prototype, "onItemSelect", void 0);
exports.SelectionField = SelectionField;
class Container extends field_base_1.FieldBase {
    constructor(options, injector) {
        super(options, injector);
        this.controlType = 'div';
        this.content = options['content'] || '';
        this.active = options['active'] || false;
        this.type = options['type'] || '';
        this.isGroup = true;
        this.hasControl = _.isUndefined(this.groupName);
        if (_.isEmpty(this.cssClasses) && _.startsWith(this.type, 'h')) {
            this.cssClasses = [`${this.type}-header`];
        }
    }
    getGroup(group, fieldMap) {
        this.fieldMap = fieldMap;
        _.set(fieldMap, `${this.getFullFieldName()}.field`, this);
        group[this.name] = this.required ? new forms_1.FormGroup({}, forms_1.Validators.required) : new forms_1.FormGroup({});
        _.each(this.fields, (field) => {
            field.getGroup(group, fieldMap);
        });
        return group[this.name];
    }
    createFormModel(valueElem = null) {
        const grp = {};
        _.each(this.fields, (field) => {
            let fldVal = null;
            if (this.value) {
                fldVal = _.get(this.value, field.name);
            }
            field.value = fldVal;
            grp[field.name] = field.createFormModel(fldVal);
        });
        this.formModel = this.required ? new forms_1.FormGroup(grp, forms_1.Validators.required) : new forms_1.FormGroup(grp);
        return this.formModel;
    }
    setValue(value, emitEvent = true) {
        this.value = value;
        _.forOwn(value, (val, key) => {
            const fld = _.find(this.fields, (fldItem) => {
                return fldItem.name == key;
            });
            fld.setValue(val, emitEvent);
        });
    }
}
exports.Container = Container;
class TabOrAccordionContainer extends Container {
    constructor(options, injector) {
        super(options, injector);
        this.onTabChange = new core_1.EventEmitter();
        this.onAccordionCollapseExpand = new core_1.EventEmitter();
        this.expandAccordionsOnOpen = false;
        this.allExpanded = false;
        this.tabNavContainerClass = options['tabNavContainerClass'] || 'col-md-2';
        this.tabNavClass = options['tabNavClass'] || 'nav nav-pills nav-stacked';
        this.tabContentContainerClass = options['tabContentContainerClass'] || 'col-md-10';
        this.tabContentClass = options['tabContentClass'] || 'tab-content';
        this.accContainerClass = options['accContainerClass'] || 'col-md-12';
        this.accClass = options['accClass'] || 'panel panel-default';
        this.expandAccordionsOnOpen = options['expandAccordionsOnOpen'] || false;
    }
}
__decorate([
    core_1.Output(),
    __metadata("design:type", typeof (_b = typeof core_1.EventEmitter !== "undefined" && core_1.EventEmitter) === "function" ? _b : Object)
], TabOrAccordionContainer.prototype, "onTabChange", void 0);
exports.TabOrAccordionContainer = TabOrAccordionContainer;
class ButtonBarContainer extends Container {
    constructor(options, injector) {
        super(options, injector);
    }
}
exports.ButtonBarContainer = ButtonBarContainer;
class DateTime extends field_base_1.FieldBase {
    constructor(options, injector) {
        super(options, injector);
        this.datePickerOpts = options['datePickerOpts'] || false;
        this.timePickerOpts = options['timePickerOpts'] || false;
        this.hasClearButton = options['hasClearButton'] || false;
        this.valueFormat = options['valueFormat'] || 'YYYY-MM-DD';
        this.displayFormat = options['displayFormat'] || 'YYYY-MM-DD';
        this.controlType = 'datetime';
        this.value = this.value ? this.parseToDate(this.value) : this.value;
        this.adjustStartRange = !_.isUndefined(options['adjustStartRange']) ? options['adjustStartRange'] : false;
    }
    setValue(value) {
        this.value = value;
        this.formModel.patchValue(value, { emitEvent: true, emitModelToViewChange: true });
        this.formModel.markAsTouched();
    }
    formatValue(value) {
        console.log(`Formatting value: ${value}`);
        return value ? moment_es6_1.default(value).local().format(this.valueFormat) : value;
    }
    parseToDate(value) {
        return moment_es6_1.default(value, this.valueFormat).local().toDate();
    }
    formatValueForDisplay() {
        const locale = window.navigator.language;
        return this.value ? moment_es6_1.default(this.value).locale(locale).format(this.displayFormat) : '';
    }
    reactEvent(eventName, eventData, origData) {
        if (this.adjustStartRange) {
            const thisDate = moment_es6_1.default(eventData);
            const prevStartDate = moment_es6_1.default(this.formModel.value);
            if (!prevStartDate.isValid() || thisDate.isAfter(prevStartDate)) {
                this.formModel.setValue(eventData);
            }
            const newOpts = _.cloneDeep(this.datePickerOpts);
            newOpts.startDate = eventData;
            this.datePickerOpts = newOpts;
        }
        else {
            const value = this.parseToDate(eventData);
            this.setValue(value);
        }
    }
}
exports.DateTime = DateTime;
class SaveButton extends NotInFormField {
    constructor(options, injector) {
        super(options, injector);
        this.label = this.getTranslated(options['label'], 'Save');
        this.closeOnSave = options['closeOnSave'] || false;
        this.redirectLocation = options['redirectLocation'] || false;
        this.cssClasses = options['cssClasses'] || "btn-primary";
        this.targetStep = options['targetStep'] || null;
        this.additionalData = options['additionalData'] || null;
        this.confirmationMessage = options['confirmationMessage'] ? this.getTranslated(options['confirmationMessage'], null) : null;
        this.confirmationTitle = options['confirmationTitle'] ? this.getTranslated(options['confirmationTitle'], null) : null;
        this.cancelButtonMessage = options['cancelButtonMessage'] ? this.getTranslated(options['cancelButtonMessage'], null) : null;
        this.confirmButtonMessage = options['confirmButtonMessage'] ? this.getTranslated(options['confirmButtonMessage'], null) : null;
        this.isDelete = options['isDelete'];
    }
}
exports.SaveButton = SaveButton;
class CancelButton extends field_base_1.FieldBase {
    constructor(options, injector) {
        super(options, injector);
        this.label = this.getTranslated(options['label'], 'Cancel');
    }
}
exports.CancelButton = CancelButton;
class TabNavButton extends field_base_1.FieldBase {
    constructor(options, injector) {
        super(options, injector);
        this.tabs = [];
        this.prevLabel = this.getTranslated(options.prevLabel, 'Previous');
        this.nextLabel = this.getTranslated(options.nextLabel, 'Next');
        this.targetTabContainerId = options.targetTabContainerId;
        this.endDisplayMode = options.endDisplayMode == 'hidden' ? 'hidden' : 'disabled';
    }
    getTabs() {
        const targetContainerTab = this.getTargetTab(this.fieldMap._rootComp.formDef.fields);
        if (targetContainerTab) {
            _.each(targetContainerTab.definition.fields, (tab) => {
                this.tabs.push(tab.definition.id);
            });
            this.currentTab = this.tabs[0];
        }
        else {
            console.log(`Target Container Tab not found: ${this.targetTabContainerId}`);
        }
    }
    getTargetTab(fields) {
        const targetTab = _.find(fields, (f) => {
            if (f.definition && f.definition.id == this.targetTabContainerId) {
                return true;
            }
            if (f.definition && f.definition.fields) {
                return this.getTargetTab(f.definition.fields);
            }
        });
        return targetTab;
    }
    getCurrentTabIdx() {
        return _.findIndex(this.tabs, (curTab) => { return curTab == this.currentTab; });
    }
    getTabId(step) {
        const curTabIdx = this.getCurrentTabIdx();
        const tabIdx = curTabIdx + step;
        if (tabIdx >= 0 && tabIdx < this.tabs.length) {
            return this.tabs[tabIdx];
        }
        return null;
    }
}
exports.TabNavButton = TabNavButton;
class AnchorOrButton extends field_base_1.FieldBase {
    constructor(options, injector) {
        super(options, injector);
        this.onClick_RootFn = options['onClick_RootFn'] || null;
        this.isDisabledFn = options['isDisabledFn'] || null;
        this.type = options['type'] || 'button';
        this.controlType = options['controlType'] || 'button';
        this.hasControl = false;
        this.showPencil = options['showPencil'] || false;
        this.anchorHtml = options['anchorHtml'] || '';
    }
}
exports.AnchorOrButton = AnchorOrButton;
class HiddenValue extends field_base_1.FieldBase {
    constructor(options, injector) {
        super(options, injector);
        this.controlType = 'hidden';
    }
}
exports.HiddenValue = HiddenValue;
class LinkValue extends field_base_1.FieldBase {
    constructor(options, injector) {
        super(options, injector);
        this.controlType = 'link';
        this.target = options.target || '_blank';
    }
}
exports.LinkValue = LinkValue;
class ParameterRetrieverField extends field_base_1.FieldBase {
    constructor(options, injector) {
        super(options, injector);
        this.parameterName = options.parameterName || '';
    }
    publishParameterValue(value) {
        this.onValueUpdate.emit(value);
    }
}
exports.ParameterRetrieverField = ParameterRetrieverField;
class Spacer extends NotInFormField {
    constructor(options, injector) {
        super(options, injector);
        this.width = options.width;
        this.height = options.height;
    }
}
exports.Spacer = Spacer;
class Toggle extends field_base_1.FieldBase {
    constructor(options, injector) {
        super(options, injector);
        this.onItemSelect = new core_1.EventEmitter();
        this.type = options['type'] || 'checkbox';
        this.value = this.setToggle();
    }
    setToggle() {
        if (_.isUndefined(this.options['value'])) {
            if (this.options.valueCheck && this.options['checkedWhen'] && this.editMode) {
                return this.options.valueCheck === this.options['checkedWhen'];
            }
            else {
                return false;
            }
        }
        {
            return this.options['value'];
        }
    }
}
__decorate([
    core_1.Output(),
    __metadata("design:type", typeof (_c = typeof core_1.EventEmitter !== "undefined" && core_1.EventEmitter) === "function" ? _c : Object)
], Toggle.prototype, "onItemSelect", void 0);
exports.Toggle = Toggle;
class HtmlRaw extends NotInFormField {
    getGroup(group, fieldMap) {
        super.getGroup(group, fieldMap);
        this.value = this.replaceValWithConfig(this.value);
    }
}
exports.HtmlRaw = HtmlRaw;
