"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const field_base_1 = require("./field-base");
const records_service_1 = require("./records.service");
const field_simple_component_1 = require("./field-simple.component");
class RecordMetadataRetrieverField extends field_base_1.FieldBase {
    constructor(options, injector) {
        super(options, injector);
        this.recordsService = this.getFromInjector(records_service_1.RecordsService);
        this.parameterName = options.parameterName || '';
    }
    publishMetadata(oid, config) {
        this.recordsService.getRecordMeta(oid).then(data => {
            data.oid = oid;
            this.onValueUpdate.emit(data);
            this.onValueLoaded.emit(data);
        });
    }
}
exports.RecordMetadataRetrieverField = RecordMetadataRetrieverField;
let RecordMetadataRetrieverComponent = class RecordMetadataRetrieverComponent extends field_simple_component_1.SimpleComponent {
};
RecordMetadataRetrieverComponent = __decorate([
    core_1.Component({
        selector: 'record-metadata-retriever',
        template: `
  `,
    })
], RecordMetadataRetrieverComponent);
exports.RecordMetadataRetrieverComponent = RecordMetadataRetrieverComponent;
