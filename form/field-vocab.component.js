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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const field_simple_component_1 = require("./field-simple.component");
const field_base_1 = require("./field-base");
const forms_1 = require("@angular/forms");
const _ = require("lodash");
const rxjs_1 = require("rxjs");
const Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/toPromise");
require("rxjs/add/observable/of");
require("rxjs/add/operator/map");
const http_1 = require("@angular/http");
const base_service_1 = require("../base-service");
const config_service_1 = require("../config-service");
const luceneEscapeQuery = require("lucene-escape-query");
class VocabField extends field_base_1.FieldBase {
    constructor(options, injector) {
        super(options, injector);
        this.onItemSelect = new core_1.EventEmitter();
        this.clName = 'VocabField';
        this.hasLookup = true;
        this.vocabId = options['vocabId'] || '';
        this.controlType = 'textbox';
        this.titleFieldName = options['titleFieldName'] || 'title';
        this.titleFieldArr = options['titleFieldArr'] || [];
        this.searchFields = options['searchFields'] || '';
        this.titleFieldDelim = options['titleFieldDelim'] || ' - ';
        this.titleCompleterDescription = options['titleCompleterDescription'] || '';
        this.fieldNames = options['fieldNames'] || [];
        this.sourceType = options['sourceType'] || 'vocab';
        this.placeHolder = options['placeHolder'] || 'Select a valid value';
        this.disableEditAfterSelect = options['disableEditAfterSelect'] == undefined ? true : options['disableEditAfterSelect'];
        this.stringLabelToField = options['stringLabelToField'] ? options['stringLabelToField'] : 'dc_title';
        this.restrictToSelection = _.isUndefined(options['restrictToSelection']) ? false : options['restrictToSelection'];
        this.storeLabelOnly = options['storeLabelOnly'] ? options['storeLabelOnly'] : false;
        this.provider = options['provider'] ? options['provider'] : '';
        this.resultArrayProperty = options['resultArrayProperty'] ? options['resultArrayProperty'] : '';
    }
    createFormModel(valueElem = undefined, createFormGroup = false) {
        if (valueElem) {
            this.value = valueElem;
        }
        if (createFormGroup) {
            const flds = {};
            _.forEach(this.fieldNames, fld => {
                _.forOwn(fld, (srcFld, targetFld) => {
                    flds[targetFld] = new forms_1.FormControl(this.value[targetFld] || '');
                });
            });
            this.formModel = new forms_1.FormGroup(flds);
        }
        else {
            this.formModel = new forms_1.FormControl(this.value || '');
        }
        if (this.value) {
            if (!_.isString(this.value)) {
                const init = _.cloneDeep(this.value);
                init.title = this.getTitle(this.value);
                this.initialValue = init;
            }
            else {
                let init = {};
                init['title'] = this.value;
                init[this.stringLabelToField] = this.value;
                this.initialValue = init;
            }
        }
        if (this.required) {
            this.formModel.setValidators([forms_1.Validators.required]);
        }
        return this.formModel;
    }
    postInit(value) {
        if (value) {
            this.value = value;
        }
        else {
            this.setEmptyValue();
        }
        this.initLookupData();
    }
    setEmptyValue(updateTitle = false) {
        this.value = null;
        if (this.formModel) {
            this.formModel.setValue(null, { emitEvent: true });
        }
        if (updateTitle && this.component && this.component.ngCompleter) {
            this.component.ngCompleter.ctrInput.nativeElement.value = null;
        }
        return this.value;
    }
    setLookupServices(completerService, lookupService) {
        this.completerService = completerService;
        this.lookupService = lookupService;
    }
    initLookupData() {
        if (this.sourceType == "vocab") {
            _.forEach(this.sourceData, (data) => {
                data.title = this.getTitle(data);
            });
            this.dataService = this.completerService.local(this.sourceData, this.searchFields, 'title');
        }
        else if (this.sourceType == "collection" || this.sourceType == "user") {
            let url = this.lookupService.getCollectionRootUrl(this.vocabId);
            if (this.sourceType == "user") {
                url = this.lookupService.getUserLookupUrl();
            }
            console.log(`Using: ${url}`);
            const title = this.titleFieldArr.length == 1 ? this.titleFieldArr[0] : 'title';
            console.log(`Using title: ${title}`);
            this.dataService = this.completerService.remote(url, this.searchFields, title);
        }
        else if (this.sourceType == "mint") {
            const url = this.lookupService.getMintRootUrl(this.vocabId);
            console.log(`Using: ${url}`);
            this.dataService = new MintLookupDataService(url, this.lookupService.http, this.fieldNames, this.titleFieldName, this.titleFieldArr, this.titleFieldDelim, this.titleCompleterDescription, this.searchFields);
        }
        else if (this.sourceType == "external") {
            const url = this.lookupService.getExternalServiceUrl(this.provider);
            this.dataService = new ExternalLookupDataService(url, this.lookupService.http, this.resultArrayProperty, this.titleFieldName, this.titleFieldArr, this.titleFieldDelim);
        }
    }
    getTitle(data) {
        let title = '';
        if (data) {
            if (_.isString(data)) {
                return data;
            }
            if (_.isString(this.titleFieldDelim)) {
                _.forEach(this.titleFieldArr, (titleFld) => {
                    const titleVal = data[titleFld];
                    if (titleVal) {
                        title = `${title}${_.isEmpty(title) ? '' : this.titleFieldDelim}${titleVal}`;
                    }
                });
            }
            else {
                _.forEach(this.titleFieldArr, (titleFld, idx) => {
                    const delimPair = this.titleFieldDelim[idx];
                    const titleVal = data[titleFld];
                    if (titleVal) {
                        title = `${title}${_.isEmpty(title) ? '' : delimPair.prefix}${titleVal}${_.isEmpty(title) ? '' : delimPair.suffix}`;
                    }
                });
            }
        }
        return title;
    }
    getValue(data) {
        const valObj = {};
        if (!_.isUndefined(data) && !_.isEmpty(data)) {
            if (_.isString(data)) {
                console.log(`Data is string...`);
                if (this.storeLabelOnly) {
                    return data;
                }
                else {
                    valObj[this.stringLabelToField] = data;
                }
                return valObj;
            }
            _.forEach(this.fieldNames, (fldName) => {
                if (data.originalObject) {
                    this.getFieldValuePair(fldName, data.originalObject, valObj);
                }
                else {
                    this.getFieldValuePair(fldName, data, valObj);
                }
            });
        }
        return valObj;
    }
    getFieldValuePair(fldName, data, valObj) {
        if (_.isString(fldName)) {
            valObj[fldName] = _.get(data, fldName);
        }
        else {
            _.forOwn(fldName, (srcFld, targetFld) => {
                if (_.get(data, srcFld)) {
                    valObj[targetFld] = _.get(data, srcFld);
                }
                else {
                    valObj[targetFld] = _.get(data, targetFld);
                }
            });
        }
    }
    setValue(value, emitEvent = true, updateTitle = false) {
        this.formModel.setValue(value, { emitEvent: emitEvent });
        if (updateTitle) {
            this.component.ngCompleter.ctrInput.nativeElement.value = this.getTitle(value);
        }
    }
    relationshipLookup(searchTerm, lowerTerm, searchFields) {
        const url = this.lookupService.getMintRootUrl(this.vocabId);
        console.log(`Using: ${url}`);
        const mlu = new MintRelationshipLookup(url, this.lookupService.http, searchFields);
        return mlu.search(searchTerm, lowerTerm);
    }
}
__decorate([
    core_1.Output(),
    __metadata("design:type", typeof (_a = typeof core_1.EventEmitter !== "undefined" && core_1.EventEmitter) === "function" ? _a : Object)
], VocabField.prototype, "onItemSelect", void 0);
exports.VocabField = VocabField;
class ExternalLookupDataService extends Subject_1.Subject {
    constructor(url, http, arrayProperty, compositeTitleName, titleFieldArr, titleFieldDelim) {
        super();
        this.url = url;
        this.http = http;
        this.arrayProperty = arrayProperty;
        this.compositeTitleName = compositeTitleName;
        this.titleFieldArr = titleFieldArr;
        this.titleFieldDelim = titleFieldDelim;
    }
    search(term) {
        this.http.post(this.url, { options: { query: term } }).map((res, index) => {
            let data = res.json();
            let itemArray = _.get(data, this.arrayProperty);
            let matches = [];
            _.each(itemArray, item => {
                matches.push(this.convertToItem(item));
            });
            this.next(matches);
        }).subscribe();
    }
    cancel() {
    }
    convertToItem(data) {
        if (!data) {
            return null;
        }
        let completerItem = {};
        completerItem[this.compositeTitleName] = this.getTitle(data);
        completerItem['originalObject'] = data;
        return completerItem;
    }
    getTitle(data) {
        let title = '';
        if (data) {
            if (_.isString(this.titleFieldDelim)) {
                _.forEach(this.titleFieldArr, (titleFld) => {
                    const titleVal = _.get(data, titleFld);
                    if (titleVal) {
                        title = `${title}${_.isEmpty(title) ? '' : this.titleFieldDelim}${titleVal}`;
                    }
                });
            }
            else {
            }
        }
        return title;
    }
}
class MintLookupDataService extends Subject_1.Subject {
    constructor(url, http, fields, compositeTitleName, titleFieldArr, titleFieldDelim, titleCompleterDescription, searchFieldStr) {
        super();
        this.url = url;
        this.http = http;
        this.fields = fields;
        this.compositeTitleName = compositeTitleName;
        this.titleFieldArr = titleFieldArr;
        this.titleFieldDelim = titleFieldDelim;
        this.titleCompleterDescription = titleCompleterDescription;
        this.searchFields = searchFieldStr.split(',');
    }
    search(term) {
        term = _.trim(luceneEscapeQuery.escape(term));
        let searchString = '';
        if (!_.isEmpty(term)) {
            term = _.toLower(term);
            _.forEach(this.searchFields, (searchFld) => {
                searchString = `${searchString}${_.isEmpty(searchString) ? '' : ' OR '}${searchFld}:${term}*`;
            });
        }
        const searchUrl = `${this.url}${searchString}`;
        this.http.get(`${searchUrl}`).map((res, index) => {
            let data = res.json();
            let matches = _.map(data, (mintDataItem) => { return this.convertToItem(mintDataItem); });
            this.next(matches);
        }).subscribe();
    }
    cancel() {
    }
    convertToItem(data) {
        if (!data) {
            return null;
        }
        const item = {};
        _.forEach(this.fields, (fieldName) => {
            if (_.isString(fieldName)) {
                item[fieldName] = data[fieldName];
            }
            else {
                _.forOwn(fieldName, (srcFld, targetFld) => {
                    if (_.get(data, srcFld)) {
                        item[srcFld] = _.get(data, srcFld);
                    }
                    else {
                        item[targetFld] = _.get(data, targetFld);
                    }
                });
            }
        });
        let completerItem = {};
        completerItem[this.compositeTitleName] = this.getTitle(data);
        completerItem['description'] = this.getCompleterDescription(data);
        completerItem['originalObject'] = item;
        return completerItem;
    }
    getCompleterDescription(data) {
        let description = '';
        const fieldDesc = this.titleCompleterDescription;
        if (data) {
            if (_.isString(fieldDesc)) {
                const ele = data[fieldDesc];
                description = _.toString(_.head(ele)) || '';
            }
        }
        return description;
    }
    getTitle(data) {
        let title = '';
        if (data) {
            if (_.isString(this.titleFieldDelim)) {
                _.forEach(this.titleFieldArr, (titleFld) => {
                    const titleVal = data[titleFld];
                    if (titleVal) {
                        title = `${title}${_.isEmpty(title) ? '' : this.titleFieldDelim}${data[titleFld]}`;
                    }
                });
            }
            else {
                _.forEach(this.titleFieldArr, (titleFld, idx) => {
                    const delimPair = this.titleFieldDelim[idx];
                    const titleVal = data[titleFld];
                    if (titleVal) {
                        title = `${title} ${titleVal}${delimPair.suffix}`;
                    }
                });
            }
        }
        return title;
    }
}
let VocabFieldLookupService = class VocabFieldLookupService extends base_service_1.BaseService {
    constructor(http, configService) {
        super(http, configService);
        this.configService = configService;
    }
    getLookupData(field) {
        const vocabId = field.vocabId;
        if (field.sourceType == "vocab") {
            const url = `${this.brandingAndPortalUrl}/${this.config.vocabRootUrl}/${vocabId}`;
            return this.http.get(url, this.options)
                .flatMap((res) => {
                const data = this.extractData(res);
                field.sourceData = data;
                field.postInit(field.value);
                return rxjs_1.Observable.of(field);
            });
        }
        field.postInit(field.value);
        return rxjs_1.Observable.of(field);
    }
    getCollectionRootUrl(collectionId) {
        return `${this.brandingAndPortalUrl}/${this.config.collectionRootUri}/${collectionId}/?search=`;
    }
    getUserLookupUrl(searchSource = '') {
        return `${this.brandingAndPortalUrl}/${this.config.userRootUri}/?source=${searchSource}&name=`;
    }
    findLookupData(field, search) {
    }
    getMintRootUrl(source) {
        return `${this.brandingAndPortalUrl}/${this.config.mintRootUri}/${source}/?search=`;
    }
    getExternalServiceUrl(provider) {
        return `${this.brandingAndPortalUrl}/external/vocab/${provider}`;
    }
};
VocabFieldLookupService = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(http_1.Http)), __param(1, core_1.Inject(config_service_1.ConfigService)),
    __metadata("design:paramtypes", [typeof (_b = typeof http_1.Http !== "undefined" && http_1.Http) === "function" ? _b : Object, config_service_1.ConfigService])
], VocabFieldLookupService);
exports.VocabFieldLookupService = VocabFieldLookupService;
let VocabFieldComponent = class VocabFieldComponent extends field_simple_component_1.SimpleComponent {
    constructor() {
        super();
        this.isEmbedded = false;
        this.canRemove = false;
        this.removeBtnText = null;
        this.removeBtnClass = 'fa fa-minus-circle btn text-20 pull-right btn-danger';
        this.disableEditAfterSelect = true;
        this.onRemoveBtnClick = new core_1.EventEmitter();
    }
    ngOnInit() {
        this.field.component = this;
        if (_.isEmpty(this.field.value) || _.isNull(this.field.value) || _.isUndefined(this.field.value)) {
            this.loaded = true;
        }
    }
    getGroupClass(fldName = null) {
        if (this.isEmbedded) {
            return `col-xs-12 form-group ${this.hasRequiredError() ? 'has-error' : ''}`;
        }
        else {
            return '';
        }
    }
    onSelect(selected, emitEvent = true, updateTitle = false) {
        console.log(`On select:`);
        console.log(selected);
        let disableEditAfterSelect = this.disableEditAfterSelect && this.field.disableEditAfterSelect;
        if (selected) {
            if (this.loaded) {
                this.field.onItemSelect.emit(selected['originalObject']);
            }
            else {
                this.loaded = true;
            }
            if (this.field.storeLabelOnly) {
                this.field.setValue(this.field.getValue(selected.title), emitEvent, updateTitle);
            }
            else {
                this.field.setValue(this.field.getValue(selected['originalObject']), emitEvent, updateTitle);
            }
            if (disableEditAfterSelect)
                this.disableInput = true;
        }
        else {
            if (disableEditAfterSelect) {
                this.field.setValue(null, emitEvent, updateTitle);
            }
            else {
                this.field.setValue(this.field.getValue(this.field.searchStr), emitEvent, updateTitle);
            }
        }
    }
    onKeyup(value) {
        let disableEditAfterSelect = this.disableEditAfterSelect && this.field.disableEditAfterSelect;
        if (!disableEditAfterSelect && !this.field.restrictToSelection) {
            this.field.formModel.setValue(this.field.getValue(this.field.searchStr));
        }
    }
    onRemove(event) {
        this.onRemoveBtnClick.emit([event, this.index]);
    }
    getTitle() {
        return this.field && _.isFunction(this.field.getTitle) ? this.field.getTitle(this.field.value) : '';
    }
    getClearUnselected() {
        if (this.field.restrictToSelection) {
            return true;
        }
        else {
            return this.disableEditAfterSelect && this.field.disableEditAfterSelect;
        }
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", VocabField)
], VocabFieldComponent.prototype, "field", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], VocabFieldComponent.prototype, "isEmbedded", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], VocabFieldComponent.prototype, "canRemove", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], VocabFieldComponent.prototype, "removeBtnText", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], VocabFieldComponent.prototype, "removeBtnClass", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], VocabFieldComponent.prototype, "index", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], VocabFieldComponent.prototype, "disableEditAfterSelect", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", typeof (_c = typeof core_1.EventEmitter !== "undefined" && core_1.EventEmitter) === "function" ? _c : Object)
], VocabFieldComponent.prototype, "onRemoveBtnClick", void 0);
__decorate([
    core_1.ViewChild('ngCompleter'),
    __metadata("design:type", typeof (_d = typeof core_1.ElementRef !== "undefined" && core_1.ElementRef) === "function" ? _d : Object)
], VocabFieldComponent.prototype, "ngCompleter", void 0);
VocabFieldComponent = __decorate([
    core_1.Component({
        selector: 'rb-vocab',
        template: `
  <div *ngIf="field.editMode && !isEmbedded" [formGroup]='form' [ngClass]="getGroupClass()">
    <label [attr.for]="field.name" *ngIf="field.label">
      {{field.label}} {{getRequiredLabelStr()}}
      <button type="button" class="btn btn-default" *ngIf="field.help" (click)="toggleHelp()" [attr.aria-label]="'help' | translate "><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span></button>
    </label>
    <span id="{{ 'helpBlock_' + field.name }}" class="help-block" *ngIf="this.helpShow" [innerHtml]="field.help">{{field.help}}</span>
    <ng2-completer #ngCompleter  (keyup)="onKeyup($event)" [inputId]="field.name" [(ngModel)]="field.searchStr" [ngModelOptions]="{standalone: true}" [disableInput]="disableInput" [placeholder]="field.placeHolder" [clearUnselected]="getClearUnselected()" (selected)="onSelect($event)" [datasource]="field.dataService" [minSearchLength]="0" [inputClass]="'form-control'" [initialValue]="field.initialValue"></ng2-completer>
    <div class="text-danger" *ngIf="hasRequiredError()">{{field.validationMessages.required}}</div>
  </div>
  <div *ngIf="field.editMode && isEmbedded" [formGroup]='form' [ngClass]="getGroupClass()">
    <div class="row">
      <span id="{{ 'helpBlock_' + field.name }}" class="help-block" *ngIf="this.helpShow" [innerHtml]="field.help">{{field.help}}</span>
      <div class="col-xs-11 padding-remove">
        <ng2-completer #ngCompleter  (keyup)="onKeyup($event)" [inputId]="name" [(ngModel)]="field.searchStr" [ngModelOptions]="{standalone: true}" [disableInput]="disableInput" [placeholder]="field.placeHolder" [clearUnselected]="getClearUnselected()" (selected)="onSelect($event)" [datasource]="field.dataService" [minSearchLength]="0" [inputClass]="'form-control'" [initialValue]="field.initialValue"></ng2-completer>
      </div>
      <div class="col-xs-1 padding-remove">
        <button type='button' *ngIf="removeBtnText" [disabled]="!canRemove" (click)="onRemove($event)" [ngClass]="removeBtnClass" >{{removeBtnText}}</button>
        <button [disabled]="!canRemove" type='button' [ngClass]="removeBtnClass" (click)="onRemove($event)" [attr.aria-label]="'remove-button-label' | translate"></button>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 text-danger" *ngIf="hasRequiredError()">{{field.validationMessages.required}}</div>
    </div>
  </div>

  <li *ngIf="!field.editMode" class="key-value-pair">
    <span *ngIf="field.label" class="key">{{field.label}}</span>
    <span class="value">{{getTitle()}}</span>
  </li>
  `,
    }),
    __metadata("design:paramtypes", [])
], VocabFieldComponent);
exports.VocabFieldComponent = VocabFieldComponent;
class MintRelationshipLookup {
    constructor(url, http, searchFieldStr) {
        this.url = url;
        this.http = http;
        this.searchFieldStr = searchFieldStr;
    }
    search(term, lower) {
        term = _.trim(luceneEscapeQuery.escape(term));
        let searchString = '';
        if (!_.isEmpty(term)) {
            if (lower)
                term = _.toLower(term);
            if (_.isEmpty(this.searchFieldStr)) {
                searchString = term;
            }
            else {
                _.forEach(this.searchFieldStr.split(','), (searchFld) => {
                    searchString = `${searchString}${_.isEmpty(searchString) ? '' : ' OR '}${searchFld}:${term}`;
                });
            }
        }
        const searchUrl = `${this.url}${searchString}`;
        return this.http.get(`${searchUrl}`);
    }
}
exports.MintRelationshipLookup = MintRelationshipLookup;
