"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const field_simple_component_1 = require("./field-simple.component");
const field_base_1 = require("./field-base");
const forms_1 = require("@angular/forms");
const _ = require("lodash");
const records_service_1 = require("./records.service");
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/zip");
const fromPromise_1 = require("rxjs/observable/fromPromise");
class RelatedObjectDataField extends field_base_1.FieldBase {
    constructor(options, injector) {
        super(options, injector);
        this.relatedObjects = [];
        this.accessDeniedObjects = [];
        this.failedObjects = [];
        this.columns = options['columns'] || [];
        var relatedObjects = this.relatedObjects;
        this.value = options['value'] || this.setEmptyValue();
        this.recordsService = this.getFromInjector(records_service_1.RecordsService);
    }
    asyncLoadData() {
        let getRecordMetaObs = [];
        var that = this;
        _.forEach(this.value, (item) => {
            getRecordMetaObs.push(fromPromise_1.fromPromise(this.recordsService.getRecordMeta(item.id)).flatMap(meta => {
                if (!meta) {
                    that.failedObjects.push(meta);
                }
                else if (meta['status'] == "Access Denied") {
                    that.accessDeniedObjects.push(meta);
                }
                else if (meta['title']) {
                    that.relatedObjects.push(meta);
                }
                else {
                    that.failedObjects.push(meta);
                }
                return Observable_1.Observable.of(null);
            }));
        });
        if (getRecordMetaObs.length > 0) {
            return Observable_1.Observable.zip(...getRecordMetaObs);
        }
        else {
            return Observable_1.Observable.of(null);
        }
    }
    createFormModel(valueElem = undefined) {
        if (valueElem) {
            this.value = valueElem;
        }
        this.formModel = new forms_1.FormControl(this.value || []);
        if (this.value) {
            this.setValue(this.value);
        }
        return this.formModel;
    }
    setValue(value) {
        this.formModel.patchValue(value, { emitEvent: false });
        this.formModel.markAsTouched();
    }
    setEmptyValue() {
        this.value = [];
        return this.value;
    }
}
exports.RelatedObjectDataField = RelatedObjectDataField;
let rbRelatedObjectDataTemplate = './field-relatedobjectdata.html';
if (typeof aotMode == 'undefined') {
    rbRelatedObjectDataTemplate = '../angular/shared/form/field-relatedobjectdata.html';
}
let RelatedObjectDataComponent = class RelatedObjectDataComponent extends field_simple_component_1.SimpleComponent {
};
RelatedObjectDataComponent = __decorate([
    core_1.Component({
        selector: 'rb-relatedobjectdata',
        templateUrl: './field-relatedobjectdata.html'
    })
], RelatedObjectDataComponent);
exports.RelatedObjectDataComponent = RelatedObjectDataComponent;
