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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const translation_service_1 = require("../translation-service");
const Observable_1 = require("rxjs/Observable");
const _ = require("lodash");
class FieldBase {
    constructor(options = {}, injector) {
        this.componentReactors = [];
        this.onValueUpdate = new core_1.EventEmitter();
        this.onValueLoaded = new core_1.EventEmitter();
        this.injector = injector;
        this.translationService = this.getFromInjector(translation_service_1.TranslationService);
        this.setOptions(options);
        this.validators = null;
    }
    getFromInjector(token) {
        return this.injector.get(token);
    }
    setOptions(options = {}) {
        this.value = this.getTranslated(options.value, undefined);
        this.name = options.name || '';
        this.id = options.id || '';
        this.label = this.getTranslated(options.label, '');
        if (options.selectFor && options.defaultSelect) {
            if (_.isArray(options.help)) {
                const newHelp = _.defaultTo(_.find(options.help, f => f.key === options.selectFor), _.find(options.help, f => f.key === options.defaultSelect));
                options.help = newHelp.value;
            }
        }
        this.help = this.getTranslated(options.help, undefined);
        this.required = !!options.required;
        this.controlType = options.controlType || '';
        this.cssClasses = options.cssClasses || {};
        this.groupClasses = options['groupClasses'] || '';
        this.groupName = options.groupName || null;
        this.editMode = _.isUndefined(options.editMode) ? false : options.editMode;
        this.readOnly = _.isUndefined(options.readOnly) ? false : options.readOnly;
        this.onChange = options['onChange'] || null;
        this.publish = options['publish'] || null;
        this.subscribe = options['subscribe'] || null;
        this.visible = _.isUndefined(options['visible']) ? true : options['visible'];
        this.visibilityCriteria = options['visibilityCriteria'];
        this.requiredIfHasValue = options['requiredIfHasValue'] || [];
        this.hasValueLabel = this.getTranslated(options['hasValueLabel'], 'Multiple Values');
        this.confirmChangesLabel = this.getTranslated(options['confirmChangesLabel'], 'Confirm Changes');
        this.confirmChangesParagraphLabel = this.getTranslated(options['confirmChangesParagraphLabel'], 'The following values will be cleared');
        if (this.groupName) {
            this.hasGroup = true;
        }
        this.options = options;
        this.hasControl = true;
        this.validationMessages = {};
        _.forOwn(options['validationMessages'] || {}, (messageKey, messageName) => {
            this.validationMessages[messageName] = this.getTranslated(messageKey, messageKey);
        });
        this.defaultValue = this.getTranslated(options.defaultValue, undefined);
        if ((_.isUndefined(this.value) || _.isEmpty(this.value)) && !_.isUndefined(this.defaultValue)) {
            this.value = this.defaultValue;
        }
    }
    getTranslated(key, defValue) {
        if (!_.isEmpty(key) && !_.isUndefined(key)) {
            if (_.isFunction(key.startsWith) && key.startsWith('@') && this.translationService) {
                return this.translationService.t(key);
            }
            else {
                return key;
            }
        }
        else {
            return defValue;
        }
    }
    get isValid() {
        if (this.form && this.form.controls) {
            return this.form.controls[this.name].valid;
        }
        return false;
    }
    createFormModel(valueElem = null) {
        if (valueElem) {
            this.value = valueElem;
        }
        if (this.required) {
            this.validators = forms_1.Validators.required;
        }
        this.formModel = new forms_1.FormControl(this.value || '', this.validators);
        return this.formModel;
    }
    getGroup(group, fieldMap) {
        this.fieldMap = fieldMap;
        let retval = null;
        _.set(fieldMap, `${this.getFullFieldName()}.field`, this);
        let control = this.createFormModel();
        _.set(fieldMap, `${this.getFullFieldName()}.control`, control);
        if (this.hasGroup && this.groupName) {
            if (group[this.groupName]) {
                group[this.groupName].addControl(this.name, control);
            }
            else {
                const fg = {};
                fg[this.name] = control;
                group[this.groupName] = new forms_1.FormGroup(fg);
            }
            retval = group[this.groupName];
        }
        else {
            if (this.hasControl) {
                group[this.name] = control;
                retval = group[this.name];
            }
        }
        return retval;
    }
    triggerValidation() {
        if (this.formModel) {
            this.formModel.markAsTouched();
            this.formModel.updateValueAndValidity({ onlySelf: false, emitEvent: false });
        }
    }
    valueNotNull(data) {
        return !_.isNull(data) && (_.isArray(data) ? (!_.isNull(data[0])) : true);
    }
    setupEventHandlers() {
        const publishConfig = this.publish;
        const subscribeConfig = this.subscribe;
        if (!_.isEmpty(this.formModel)) {
            if (!_.isEmpty(publishConfig)) {
                _.forOwn(publishConfig, (eventConfig, eventName) => {
                    const eventSourceName = eventConfig.modelEventSource;
                    let eventSource = eventSourceName ? this.formModel[eventSourceName] : null;
                    if (!eventSource) {
                        eventSource = this.getEventEmitter(eventSourceName, 'this');
                        if (!eventSource) {
                            this[eventSource] = new core_1.EventEmitter();
                        }
                    }
                    eventSource.subscribe((value) => {
                        if (this.valueNotNull(value)) {
                            let emitData = value;
                            if (!_.isEmpty(eventConfig.fields)) {
                                if (_.isArray(value)) {
                                    emitData = [];
                                    _.each(value, (v) => {
                                        if (!_.isEmpty(v)) {
                                            const item = {};
                                            _.each(eventConfig.fields, (f) => {
                                                _.forOwn(f, (src, tgt) => {
                                                    item[tgt] = _.get(v, src);
                                                });
                                            });
                                            emitData.push(item);
                                        }
                                    });
                                }
                                else {
                                    emitData = {};
                                    if (!_.isEmpty(value)) {
                                        _.each(eventConfig.fields, (f) => {
                                            _.forOwn(f, (src, tgt) => {
                                                emitData[tgt] = _.get(value, src);
                                            });
                                        });
                                    }
                                }
                            }
                            this.emitEvent(eventName, emitData, value);
                        }
                    });
                });
            }
        }
        if (!_.isEmpty(subscribeConfig)) {
            _.forOwn(subscribeConfig, (subConfig, srcName) => {
                _.forOwn(subConfig, (eventConfArr, eventName) => {
                    const eventEmitter = this.getEventEmitter(eventName, srcName);
                    eventEmitter.subscribe((value) => {
                        let curValue = value;
                        if (_.isArray(value)) {
                            curValue = [];
                            _.each(value, (v) => {
                                let entryVal = v;
                                _.each(eventConfArr, (eventConf) => {
                                    const fn = _.get(this, eventConf.action);
                                    if (fn) {
                                        let boundFunction = fn;
                                        if (eventConf.action.indexOf(".") == -1) {
                                            boundFunction = fn.bind(this);
                                        }
                                        else {
                                            var objectName = eventConf.action.substring(0, eventConf.action.indexOf("."));
                                            boundFunction = fn.bind(this[objectName]);
                                        }
                                        entryVal = boundFunction(entryVal, eventConf);
                                    }
                                });
                                if (!_.isEmpty(entryVal)) {
                                    curValue.push(entryVal);
                                }
                            });
                        }
                        else {
                            _.each(eventConfArr, (eventConf) => {
                                const fn = _.get(this, eventConf.action);
                                if (fn) {
                                    let boundFunction = fn;
                                    if (eventConf.action.indexOf(".") == -1) {
                                        boundFunction = fn.bind(this);
                                    }
                                    else {
                                        var objectName = eventConf.action.substring(0, eventConf.action.indexOf("."));
                                        boundFunction = fn.bind(this[objectName]);
                                    }
                                    curValue = boundFunction(curValue, eventConf);
                                }
                            });
                        }
                        if (!_.isUndefined(curValue)) {
                            this.reactEvent(eventName, curValue, value);
                        }
                    });
                });
            });
        }
    }
    getEventEmitter(eventName, srcName) {
        if (srcName == "this") {
            return _.get(this, eventName);
        }
        if (srcName == "form") {
            return _.get(this.fieldMap['_rootComp'], eventName);
        }
        return _.get(this.fieldMap[srcName].field, eventName);
    }
    emitEvent(eventName, eventData, origData) {
        this[eventName].emit(eventData);
    }
    reactEvent(eventName, eventData, origData) {
        this.value = eventData;
        if (this.formModel) {
            this.formModel.setValue(eventData, { onlySelf: true, emitEvent: false });
        }
        _.each(this.componentReactors, (compReact) => {
            compReact.reactEvent(eventName, eventData, origData, this);
        });
    }
    setFieldMapEntry(fieldMap, fieldCompRef) {
        if (!_.isUndefined(this.name) && !_.isEmpty(this.name) && !_.isNull(this.name)) {
            _.set(fieldMap, `${this.getFullFieldName()}.instance`, fieldCompRef.instance);
        }
    }
    getFullFieldName(name = null) {
        const fldName = `${name ? name : this.name}`;
        return fldName;
    }
    getControl(name = null, fieldMap = null) {
        return _.get(fieldMap ? fieldMap : this.fieldMap, `${this.getFullFieldName(name)}.control`);
    }
    setValue(value, emitEvent = true) {
        this.value = value;
        this.formModel.setValue(value, { onlySelf: true, emitEvent: emitEvent });
    }
    toggleVisibility() {
        this.visible = !this.visible;
    }
    setVisibility(data) {
        let newVisible = this.visible;
        if (_.isObject(this.visibilityCriteria) && this.visibilityCriteria.type == 'function') {
            const fn = _.get(this, this.visibilityCriteria.action);
            if (this.visibilityCriteria.debug) {
                console.log(`visibilityCriteria: ${this.visibilityCriteria.debug}`);
            }
            if (fn) {
                let boundFunction = fn;
                if (this.visibilityCriteria.action.indexOf(".") == -1) {
                    boundFunction = fn.bind(this);
                }
                else {
                    var objectName = this.visibilityCriteria.action.substring(0, this.visibilityCriteria.action.indexOf("."));
                    boundFunction = fn.bind(this[objectName]);
                }
                newVisible = boundFunction(data, this.visibilityCriteria);
            }
        }
        else {
            newVisible = _.isEqual(data, this.visibilityCriteria);
        }
        this.updateVisible(newVisible);
    }
    updateVisible(newVisible) {
        const that = this;
        setTimeout(() => {
            if (!newVisible) {
                if (that.visible) {
                    if (that.formModel) {
                        that.formModel.clearValidators();
                        that.formModel.updateValueAndValidity();
                    }
                }
            }
            else {
                if (!that.visible) {
                    if (that.formModel) {
                        that.formModel.setValidators(that.validators);
                        that.formModel.updateValueAndValidity();
                    }
                }
            }
            that.visible = newVisible;
        });
    }
    checkIfVisible() {
        if (_.isObject(this.visibilityCriteria) && this.visibilityCriteria.type == 'function') {
            this.setVisibility(this.visibilityCriteria);
        }
    }
    replaceValWithConfig(val) {
        _.forOwn(this.appConfig, (configVal, configKey) => {
            val = val.replace(new RegExp(`@${configKey}`, 'g'), configVal);
        });
        return val;
    }
    getConfigEntry(name, defValue) {
        return _.isUndefined(_.get(this.appConfig, name)) ? defValue : _.get(this.appConfig, name);
    }
    publishValueLoaded() {
        this.onValueLoaded.emit(this.value);
    }
    setRequiredAndClearValueOnFalse(flag) {
        this.required = flag;
        if (flag) {
            this.validators = forms_1.Validators.required;
            this.formModel.setValidators(this.validators);
        }
        else {
            if (_.isFunction(this.validators) && _.isEqual(this.validators, forms_1.Validators.required)) {
                this.validators = null;
            }
            this.formModel.clearValidators();
            this.formModel.setValue(null);
            this.value = null;
        }
    }
    setRequired(flag) {
        this.required = flag;
        if (flag) {
            this.validators = forms_1.Validators.required;
        }
        else {
            if (_.isFunction(this.validators) && _.isEqual(this.validators, forms_1.Validators.required)) {
                this.validators = null;
            }
            else {
                _.remove(this.validators, (v) => {
                    return _.isEqual(v, forms_1.Validators.required);
                });
            }
        }
        if (this.validators) {
            this.formModel.setValidators(this.validators);
        }
        else {
            this.formModel.clearValidators();
        }
    }
    setRequiredIfDependenciesHaveValue(data) {
        let retVal = false;
        _.each(this.requiredIfHasValue, (name) => {
            const depVal = this.fieldMap._rootComp.getFieldValue(name);
            let hasVal = false;
            if (_.isArrayLike(depVal)) {
                hasVal = !_.isEmpty(depVal);
            }
            else {
                hasVal = !_.isUndefined(depVal) && !_.isNull(depVal);
            }
            retVal = retVal || hasVal;
        });
        this.setRequired(retVal);
    }
    asyncLoadData() {
        return Observable_1.Observable.of(null);
    }
    setProp(change, config) {
        let defered = false;
        let value;
        let checked;
        if (_.isObject(change)) {
            value = change.value;
            defered = _.isUndefined(change.defered) ? false : change.defered;
            checked = _.isUndefined(change.checked) ? false : change.checked;
        }
        else {
            value = change;
            checked = true;
        }
        if (config['defer'] && !defered) {
            return;
        }
        if (config['valueCase']) {
            let caseSet;
            _.each(config['valueCase'], (cases) => {
                if (cases['val'] === value) {
                    value = cases['set'];
                    caseSet = checked;
                    return false;
                }
            });
            if (caseSet) {
                this.setValue(this.getTranslated(value, undefined));
            }
        }
        else if (config['valueSet']) {
            if (this.formModel) {
                this.setValue(this.getTranslated(value, undefined));
            }
            else {
                this.value = this.getTranslated(value, undefined);
            }
        }
        else if (config['valueTest']) {
            if (_.includes(config['valueTest'], value)) {
                _.each(config['props'], (prop) => {
                    this.setPropValue(prop, checked, config['debug']);
                });
            }
            else if (_.includes(config['valueFalse'], value)) {
                _.each(config['props'], (prop) => {
                    this.setPropValue(prop, false, config['debug']);
                });
            }
        }
    }
    setPropValue(prop, checked, debug) {
        if (debug) {
            console.log(debug);
        }
        if (prop.key === 'required') {
            if (checked) {
                this.setRequired(prop.val);
            }
            else {
                this.setRequired(!prop.val);
            }
        }
        else if (prop.key === 'value') {
            if (prop.clear && !checked) {
                if (this.formModel) {
                    this.setValue('');
                }
                else {
                    if (Array.isArray(this.value)) {
                        this.getControl().controls = [];
                        this.getControl().setValue([]);
                    }
                    else {
                        this.value = null;
                    }
                }
            }
            else if (checked) {
                if (this.formModel) {
                    this.setValue(this.getTranslated(prop.val, undefined));
                }
                else {
                    this.value = this.getTranslated(prop.val, undefined);
                }
            }
        }
        else if (prop.key === 'visible') {
            if (checked) {
                this.updateVisible(prop.val);
            }
            else if (!checked) {
                this.updateVisible(!prop.val);
            }
        }
    }
    updateVisibility(visible, config) {
        if (config['debug']) {
            console.log(config['debug']);
        }
        const fieldName = config['field'];
        const fieldValue = config['fieldValue'];
        let field;
        if (this.fieldMap && this.fieldMap[fieldName]) {
            field = this.fieldMap[fieldName]['field'];
            if (field && _.includes(field['value'], fieldValue)) {
                console.log(`updateVisibility to true: ${config['debug']}`);
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    getFieldDisplay(f) {
        let valueLabel = f.control.value;
        const options = f.field.options.options;
        if (options) {
            if (Array.isArray(valueLabel)) {
                valueLabel = this.hasValueLabel;
            }
            else {
                valueLabel = options.find(o => f.control.value === o.value).label;
            }
        }
        return {
            valueLabel: valueLabel === true ? '' : valueLabel,
            label: f.field.label
        };
    }
}
__decorate([
    core_1.Output(),
    __metadata("design:type", typeof (_a = typeof core_1.EventEmitter !== "undefined" && core_1.EventEmitter) === "function" ? _a : Object)
], FieldBase.prototype, "onValueUpdate", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", typeof (_b = typeof core_1.EventEmitter !== "undefined" && core_1.EventEmitter) === "function" ? _b : Object)
], FieldBase.prototype, "onValueLoaded", void 0);
exports.FieldBase = FieldBase;
