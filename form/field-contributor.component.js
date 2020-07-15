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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const field_simple_component_1 = require("./field-simple.component");
const field_base_1 = require("./field-base");
const forms_1 = require("@angular/forms");
const _ = require("lodash");
const field_vocab_component_1 = require("./field-vocab.component");
const Rx_1 = require("rxjs/Rx");
const KEY_TAB = 9;
const KEY_EN = 13;
class ContributorField extends field_base_1.FieldBase {
    constructor(options, injector) {
        super(options, injector);
        this.fullNameResponseField = "text_full_name";
        this.clName = 'ContributorField';
        this.controlType = 'textbox';
        this.splitNames = options['splitNames'] || false;
        this.familyNameHdr = options['familyNameHdr'] ? this.getTranslated(options['familyNameHdr'], options['familyNameHdr']) : 'Family';
        this.givenNameHdr = options['givenNameHdr'] ? this.getTranslated(options['givenNameHdr'], options['givenNameHdr']) : 'Given';
        this.nameColHdr = options['nameColHdr'] ? this.getTranslated(options['nameColHdr'], options['nameColHdr']) : 'Researcher Name';
        this.emailColHdr = options['emailColHdr'] ? this.getTranslated(options['emailColHdr'], options['emailColHdr']) : 'Email Address';
        this.roleColHdr = options['roleColHdr'] ? this.getTranslated(options['roleColHdr'], options['roleColHdr']) : 'Project Role';
        this.orcidColHdr = options['orcidColHdr'] ? this.getTranslated(options['orcidColHdr'], options['orcidColHdr']) : 'ORCID';
        this.showHeader = options['showHeader'] || true;
        this.showRole = options['showRole'] || true;
        this.baseMarginTop = options['baseMarginTop'] || '';
        this.roles = options['roles'] || [];
        this.value = options['value'] || this.setEmptyValue();
        this.activeValidators = options['activeValidators'];
        this.fieldNames = options['fieldNames'] || [];
        const textFullNameFieldName = _.find(this.fieldNames, fieldNameObject => {
            return fieldNameObject['text_full_name'] != undefined;
        });
        if (textFullNameFieldName != null) {
            this.fullNameResponseField = textFullNameFieldName['text_full_name'];
        }
        this.validationMessages = options['validationMessages'] || { required: {
                email: this.getTranslated(options['validation_required_email'], 'Email required'),
                text_full_name: this.getTranslated(options['validation_required_name'], 'Name is required'),
                role: this.getTranslated(options['validation_required_role'], 'Select a role'),
                family_name: this.getTranslated(options['validation_required_family_name'], 'Family name is required'),
                given_name: this.getTranslated(options['validation_required_given_name'], 'Given name is required'),
            },
            invalid: { email: this.getTranslated(options['validation_invalid_email'], 'Email format is incorrect') } };
        this.groupFieldNames = ['text_full_name', 'email'];
        this.freeText = options['freeText'] || false;
        this.forceLookupOnly = options['forceLookupOnly'] || false;
        if (this.forceLookupOnly) {
            this.freeText = false;
        }
        this.role = options['role'] ? this.getTranslated(options['role'], options['role']) : null;
        this.username = options['username'] || '';
        this.previousEmail = this.value ? this.value.email : '';
        this.validators = {
            text_full_name: [forms_1.Validators.required],
            email: [forms_1.Validators.required, forms_1.Validators.email]
        };
        if (!this.freeText) {
            this.vocabField = new field_vocab_component_1.VocabField(this.options, this.injector);
            this.hasLookup = true;
        }
        if (this.splitNames) {
            this.groupFieldNames.push('family_name');
            this.groupFieldNames.push('given_name');
            this.validators['family_name'] = [forms_1.Validators.required];
            this.validators['given_name'] = [forms_1.Validators.required];
        }
        this.findRelationshipFor = options['findRelationshipFor'] || '';
        this.findRelationship = options['findRelationship'] || null;
        this.relationshipFor = options['relationshipFor'] || '';
    }
    setLookupServices(completerService, lookupService) {
        if (!this.freeText) {
            this.vocabField.setLookupServices(completerService, lookupService);
        }
    }
    createFormModel(valueElem = undefined) {
        if (valueElem) {
            this.value = valueElem;
        }
        if (_.isEmpty(this.value.role)) {
            this.value.role = this.role;
        }
        if (!this.freeText) {
            this.formModel = this.vocabField.createFormModel(this.value, true);
            this.formModel.addControl('username', new forms_1.FormControl(this.value.username));
            this.formModel.addControl('role', new forms_1.FormControl(this.value.role));
            this.formModel.addControl('orcid', new forms_1.FormControl(this.value.orcid));
            if (this.value) {
                this.setValue(this.value);
            }
        }
        else {
            this.formModel = new forms_1.FormGroup({ text_full_name: new forms_1.FormControl(this.value.text_full_name || null),
                email: new forms_1.FormControl(this.value.email || null),
                role: new forms_1.FormControl(this.value.role || null),
                username: new forms_1.FormControl(this.value.username || ''),
                orcid: new forms_1.FormControl(this.value.orcid || '')
            });
            if (this.splitNames) {
                this.formModel.addControl('family_name', new forms_1.FormControl(this.value.family_name));
                this.formModel.addControl('given_name', new forms_1.FormControl(this.value.given_name));
            }
        }
        if (this.required) {
            this.enableValidators();
        }
        else {
            if (this.splitNames) {
                const reqFields = ['family_name', 'given_name'];
                const handler = this.getToggleConditionalValidationHandler(reqFields, true);
                _.each(reqFields, (reqField) => {
                    this.formModel.controls[reqField].valueChanges.subscribe(handler);
                });
                const hasValue = !_.isEmpty(this.value.family_name) || !_.isEmpty(this.value.given_name);
                this.toggleConditionalValidation(hasValue);
            }
            else {
                this.toggleConditionalValidation(!_.isEmpty(this.value.text_full_name));
            }
        }
        return this.formModel;
    }
    getToggleConditionalValidationHandler(requiredFields, useFormControl) {
        return ((value) => {
            let hasValue = true;
            if (useFormControl) {
                _.each(requiredFields, (reqField) => {
                    hasValue = hasValue || !_.isEmpty(this.formModel.controls[reqField].value);
                });
            }
            else {
                hasValue = !_.isEmpty(value);
            }
            this.toggleConditionalValidation(hasValue);
        });
    }
    setValue(value, emitEvent = true, updateTitle = false) {
        this.setMissingFields(value);
        if (!this.hasInit) {
            this.hasInit = true;
            value.username = _.isUndefined(value.username) ? '' : value.username;
        }
        else {
            if (_.isUndefined(value.username) || (value.email && value.email != this.previousEmail)) {
                value.username = '';
                this.previousEmail = value.email;
            }
        }
        this.formModel.patchValue(value, { emitEvent: emitEvent });
        this.formModel.markAsTouched();
        this.formModel.markAsDirty();
        if (updateTitle && !this.freeText) {
            this.component.ngCompleter.ctrInput.nativeElement.value = this.vocabField.getTitle(value);
        }
        if (this.splitNames) {
            const hasValue = !_.isEmpty(value.family_name) || !_.isEmpty(value.given_name);
            this.toggleConditionalValidation(hasValue);
        }
        else {
            this.toggleConditionalValidation(!_.isEmpty(value.text_full_name));
        }
    }
    toggleConditionalValidation(hasValue) {
        if (hasValue) {
            _.forOwn(this.activeValidators, (vConfig, fName) => {
                if (!_.isUndefined(this.validators[fName])) {
                    this.formModel.controls[fName].setValidators(this.validators[fName]);
                }
            });
        }
        else {
            _.forOwn(this.activeValidators, (vConfig, fName) => {
                if (!_.isUndefined(this.validators[fName])) {
                    this.formModel.controls[fName].clearValidators();
                }
            });
        }
    }
    toggleValidator(c) {
        return (value) => {
            if (value || _.find(this.formModel.controls, (c) => { return c.value; })) {
                this.enableValidators();
            }
            else {
                this.disableValidators();
            }
        };
    }
    enableValidators() {
        if (this.enabledValidators) {
            return;
        }
        this.enabledValidators = true;
        _.forEach(this.groupFieldNames, (f) => {
            if (!_.isUndefined(this.validators[f])) {
                this.formModel.controls[f].setValidators(this.validators[f]);
            }
        });
    }
    disableValidators() {
        if (!this.enabledValidators) {
            return;
        }
        this.enabledValidators = false;
        _.forEach(this.formModel.controls, (c) => {
            c.setValidators(null);
            c.setErrors(null);
        });
    }
    postInit(value) {
        if (value) {
            this.value = value;
            if (!this.freeText) {
                this.vocabField.value = value;
                this.vocabField.initialValue = _.cloneDeep(value);
                this.vocabField.initialValue.title = this.vocabField.getTitle(value);
                this.vocabField.initLookupData();
            }
            if (this.findRelationship && _.isEmpty(this.vocabField.initialValue.title)) {
                if (this.findRelationshipFor && this.relationshipFor) {
                    const doInit = _.find(this.findRelationshipFor, r => r === this.relationshipFor);
                    if (doInit) {
                        this.initWithRelationship();
                    }
                }
            }
        }
        else {
            this.setEmptyValue();
        }
    }
    initWithRelationship() {
        const related = this.findRelationship['relateWith'];
        const relatedWith = this.options[related];
        const role = this.findRelationship['role'] || '';
        const relationship = this.findRelationship['relationship'] || '';
        const searchField = this.findRelationship['searchField'] || '';
        const searchFieldLower = this.findRelationship['searchFieldLower'];
        const searchRelation = this.findRelationship['searchRelation'] || '';
        const searchRelationLower = this.findRelationship['searchRelationLower'];
        const titleCompleter = this.findRelationship['title'] || '';
        const emailCompleter = this.findRelationship['email'] || '';
        const fullNameHonorificCompleter = this.findRelationship['fullNameHonorific'] || '';
        const honorificCompleter = this.findRelationship['honorific'] || '';
        const givenNameCompleter = this.findRelationship['givenName'] || '';
        const familyNameCompleter = this.findRelationship['familyName'] || '';
        this.vocabField.relationshipLookup(relatedWith, searchFieldLower, searchField)
            .flatMap(res => {
            let rel = null;
            if (res && res['status'] === 200) {
                const data = res.json();
                if (!_.isEmpty(data) && !data['error']) {
                    const obj = _.first(data);
                    if (_.isArray(obj[relationship])) {
                        rel = _.first(obj[relationship]);
                    }
                }
            }
            if (rel) {
                return this.vocabField.relationshipLookup(rel, searchRelationLower, searchRelation);
            }
            else {
                return Rx_1.Observable.of(null);
            }
        })
            .subscribe(res => {
            if (res && res['status'] === 200) {
                const data = res.json();
                if (!_.isEmpty(data) && !data['error']) {
                    const obj = _.first(data);
                    if (obj) {
                        const emailCompleterValue = this.getFirstOrDefault(obj[emailCompleter], '');
                        const titleCompleterValue = this.getFirstOrDefault(obj[titleCompleter], '');
                        const fullNameHonorificValue = this.getFirstOrDefault(obj[fullNameHonorificCompleter], '');
                        const honorificValue = this.getFirstOrDefault(obj[honorificCompleter], '');
                        const givenNameValue = this.getFirstOrDefault(obj[givenNameCompleter], '');
                        const familyNameValue = this.getFirstOrDefault(obj[familyNameCompleter], '');
                        this.vocabField.initialValue = {
                            text_full_name: titleCompleterValue,
                            text_full_name_honorific: fullNameHonorificValue,
                            email: emailCompleterValue,
                            givenName: givenNameValue,
                            familyName: familyNameValue,
                            honorific: honorificValue,
                            full_name_family_name_first: `${familyNameValue}, ${givenNameValue}`,
                            role: role
                        };
                        this.vocabField.initialValue.title = titleCompleterValue;
                    }
                }
            }
        }, error => {
            console.error('initWithRelationship error');
            console.error(error.message);
        });
    }
    getFirstOrDefault(obj, defaultValue) {
        return _.defaultTo(_.isArray(obj) ? _.first(obj) : obj, defaultValue);
    }
    setEmptyValue(emitEvent = true) {
        this.value = { text_full_name: null, email: null, role: null, username: '' };
        if (this.formModel) {
            _.forOwn(this.formModel.controls, (c, cName) => {
                c.setValue(null, { emitEvent: emitEvent });
            });
        }
        return this.value;
    }
    get isValid() {
        let validity = false;
        _.forEach(this.groupFieldNames, (f) => {
            validity = validity && this.formModel.controls[f].valid;
        });
        return validity;
    }
    triggerValidation() {
        _.forEach(this.groupFieldNames, (f) => {
            this.formModel.controls[f].updateValueAndValidity({ onlySelf: true, emitEvent: false });
            this.formModel.controls[f].markAsTouched();
        });
    }
    getValidationError() {
        let errObj = null;
        if (this.formModel) {
            _.forEach(this.groupFieldNames, (f) => {
                if (!_.isEmpty(this.formModel.controls[f].errors)) {
                    errObj = this.formModel.controls[f].errors;
                }
            });
        }
        return errObj;
    }
    setMissingFields(value) {
        if (this.splitNames && (value && value.text_full_name && (_.isEmpty(value.family_name) || _.isUndefined(value.family_name)))) {
            const names = value.text_full_name.split(' ');
            value['given_name'] = names[0];
            names.splice(0, 1);
            value['family_name'] = names.join(' ');
            value['full_name_family_name_first'] = `${value['family_name']}, ${value['given_name']}`;
        }
        return value;
    }
    reactEvent(eventName, eventData, origData) {
        if (_.isEmpty(this.componentReactors)) {
            this.setValue(eventData, false, true);
        }
        else {
            _.each(this.componentReactors, (compReact) => {
                compReact.reactEvent(eventName, eventData, origData, this);
            });
        }
    }
}
exports.ContributorField = ContributorField;
let ContributorComponent = class ContributorComponent extends field_simple_component_1.SimpleComponent {
    constructor() {
        super(...arguments);
        this.isEmbedded = false;
        this.emptied = false;
        this.blurred = false;
    }
    ngOnInit() {
        this.field.componentReactors.push(this);
        this.field.component = this;
    }
    ngAfterViewInit() {
        if (this.field.editMode && this.ngCompleter) {
            const that = this;
            this.ngCompleter.ctrInput.nativeElement.setAttribute('aria-label', 'Name');
            this.ngCompleter.registerOnChange((v) => {
                that.emptied = _.isEmpty(v);
                if (that.emptied && that.blurred) {
                    that.blurred = false;
                    console.log(`Forced lookup, clearing data..`);
                    this.field.setEmptyValue(true);
                    this.lastSelected = null;
                    this.field.toggleConditionalValidation(false);
                }
            });
        }
    }
    getGroupClass(fldName, wideMode = false) {
        let hasError = false;
        hasError = hasError || (this.field.formModel.controls[fldName].hasError('required'));
        if (!hasError && fldName == 'email') {
            hasError = hasError || (this.field.formModel.controls[fldName].hasError('email'));
        }
        const additionalClass = this.field.splitNames ? ' padding-remove' : '';
        return `col-xs-${wideMode ? '3' : '2'} form-group${additionalClass}${hasError ? ' has-error' : ''}`;
    }
    onSelect(selected, emitEvent = true, updateTitle = false) {
        if (selected) {
            if ((_.isEmpty(selected.title) || _.isUndefined(selected.title)) && (_.isEmpty(selected.text_full_name) || _.isUndefined(selected.text_full_name))) {
                console.log(`Same or empty selection, returning...`);
                this.lastSelected = null;
                return;
            }
            else {
                if (selected.title && selected.title == this.field.formModel.value.text_full_name) {
                    console.log(`Same or empty selection, returning...`);
                    return;
                }
            }
            this.lastSelected = selected;
            let val;
            if (!this.field.freeText) {
                if (_.isEmpty(selected.text_full_name)) {
                    if (this.field.vocabField.restrictToSelection || selected.originalObject) {
                        val = this.field.vocabField.getValue(selected);
                    }
                    else {
                        val = { text_full_name: selected.title };
                    }
                }
                else if (selected[this.field.fullNameResponseField]) {
                    val = this.field.vocabField.getValue(selected);
                }
                else {
                    val = { text_full_name: selected.title };
                }
                if (!_.isEmpty(selected.orcid) && !_.isUndefined(selected.orcid)) {
                    val['orcid'] = selected.orcid;
                }
                if (!_.isEmpty(selected.username) && !_.isUndefined(selected.username)) {
                    val['username'] = selected.username;
                }
                val.role = this.field.role;
                this.field.setValue(val, emitEvent, updateTitle);
            }
            else {
                val = this.field.setMissingFields(selected);
                this.field.setValue(val, emitEvent, updateTitle);
            }
        }
        else {
            console.log(`No selected user.`);
            if (this.field.forceLookupOnly) {
                console.log(`Forced lookup, clearing data..`);
                this.field.setEmptyValue(emitEvent);
                this.lastSelected = null;
            }
        }
    }
    reactEvent(eventName, eventData, origData, elem) {
        console.log(`Contributor component reacting:`);
        console.log(eventData);
        this.onSelect(eventData, false, true);
    }
    onKeydown(event) {
        if (event && (event.keyCode === KEY_EN || event.keyCode === KEY_TAB)) {
            if (this.lastSelected && this.emptied) {
                const that = this;
                setTimeout(() => {
                    const value = that.lastSelected.title;
                    that.ngCompleter.ctrInput.nativeElement.value = that.lastSelected.title;
                }, 40);
            }
            else {
                if (this.emptied && this.field.forceLookupOnly) {
                    console.log(`Forced lookup, clearing data..`);
                    this.field.setEmptyValue(true);
                    this.lastSelected = null;
                    this.field.toggleConditionalValidation(false);
                }
            }
        }
        else {
            const val = this.field.vocabField.getValue({ text_full_name: this.ngCompleter.ctrInput.nativeElement.value });
            this.field.setValue(val, true, false);
        }
    }
    onKeyUp(event) {
        const val = this.ngCompleter.ctrInput.nativeElement.value;
        this.field.toggleConditionalValidation(!_.isEmpty(val));
    }
    onBlur() {
        if (this.field.forceLookupOnly) {
            this.blurred = true;
        }
    }
    onOpen(isOpen) {
        if (isOpen) {
            this.field.toggleConditionalValidation(false);
        }
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], ContributorComponent.prototype, "isEmbedded", void 0);
__decorate([
    core_1.ViewChild('ngCompleter'),
    __metadata("design:type", Object)
], ContributorComponent.prototype, "ngCompleter", void 0);
ContributorComponent = __decorate([
    core_1.Component({
        selector: 'rb-contributor',
        templateUrl: './field-contributor.component.html',
    })
], ContributorComponent);
exports.ContributorComponent = ContributorComponent;
