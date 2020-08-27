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
const moment_es6_1 = require("moment-es6");
class PDFListField extends field_base_1.FieldBase {
    constructor(options, injector) {
        super(options, injector);
        this.showHistoryTable = false;
        this.relatedObjects = [];
        this.accessDeniedObjects = [];
        this.failedObjects = [];
        this.columns = options['columns'] || [];
        this.startsWith = options['startsWith'] || 'rdmp-pdf';
        var relatedObjects = this.relatedObjects;
        this.recordsService = this.getFromInjector(records_service_1.RecordsService);
        this.pdfAttachments = [];
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
exports.PDFListField = PDFListField;
let PDFListComponent = class PDFListComponent extends field_simple_component_1.SimpleComponent {
    ngOnInit() {
        const oid = this.fieldMap._rootComp.oid;
        if (oid) {
            let allAttachmentsPromise = this.field.recordsService.getAttachments(oid);
            let matchingExpression = new RegExp(`${this.field.startsWith}-[0-9a-fA-F]{32}-[0-9]+\.pdf`);
            var that = this;
            allAttachmentsPromise.then(allAttachments => {
                this.field.latestPdf = null;
                _.forEach(allAttachments, (attachment) => {
                    if (matchingExpression.test(attachment.label)) {
                        attachment.dateUpdated = moment_es6_1.default(attachment.dateUpdated).format('LLL');
                        this.field.pdfAttachments.push(attachment);
                        if (this.field.latestPdf == null || moment_es6_1.default(this.field.latestPdf['dateUpdated']).isBefore(moment_es6_1.default(attachment.dateUpdated))) {
                            this.field.latestPdf = attachment;
                        }
                    }
                });
                this.field.pdfAttachments.sort(function compare(a, b) {
                    let before = moment_es6_1.default(a['dateUpdated']).isBefore(moment_es6_1.default(b['dateUpdated']));
                    return before ? -1 : 1;
                });
            });
        }
    }
    getDownloadUrl(attachment) {
        const oid = this.fieldMap._rootComp.oid;
        return `${this.field.recordsService.getBrandingAndPortalUrl}/record/${oid}/datastream?datastreamId=${attachment.label}`;
    }
};
PDFListComponent = __decorate([
    core_1.Component({
        selector: 'rb-pdf-list',
        templateUrl: './field-pdflist.html'
    })
], PDFListComponent);
exports.PDFListComponent = PDFListComponent;
