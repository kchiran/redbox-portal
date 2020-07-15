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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const _ = require("lodash");
require("rxjs/add/observable/of");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/last");
require("rxjs/add/observable/from");
const ng2_completer_1 = require("ng2-completer");
const config_service_1 = require("../config-service");
const translation_service_1 = require("../translation-service");
const util_service_1 = require("../util-service");
const field_control_meta_service_1 = require("./field-control-meta.service");
const fieldClasses_1 = require("../fieldClasses");
let FieldControlService = class FieldControlService {
    constructor(completerService, configService, translationService, utilityService, fcmetaService, app) {
        this.completerService = completerService;
        this.configService = configService;
        this.translationService = translationService;
        this.utilityService = utilityService;
        this.fcmetaService = fcmetaService;
        this.app = app;
        this.classes = fieldClasses_1.fieldClasses;
    }
    addComponentClasses(componentClasses) {
        this.classes = _.merge(this.classes, componentClasses);
    }
    getEmptyFormGroup() {
        return new forms_1.FormGroup({});
    }
    toFormGroup(fields, fieldMap = null) {
        let group = {};
        this.populateFormGroup(fields, group, fieldMap);
        this.setupEventHandlers(fieldMap);
        this.setupVisibility(fieldMap);
        return new forms_1.FormGroup(group);
    }
    setupEventHandlers(fieldMap) {
        _.forOwn(fieldMap, (fMap) => {
            if (fMap.field) {
                fMap.field.setupEventHandlers();
            }
        });
    }
    setupVisibility(fieldMap) {
        _.forOwn(fieldMap, (fMap) => {
            if (fMap.field) {
                fMap.field.checkIfVisible();
            }
        });
    }
    populateFormGroup(fields, group, fieldMap) {
        fields.forEach((field) => {
            if (field.fields && !field.hasGroup) {
                this.populateFormGroup(field.fields, group, fieldMap);
            }
            else {
                field.getGroup(group, fieldMap);
            }
        });
        return group;
    }
    getFieldsMeta(fieldsArr) {
        const fields = this.fcmetaService.getFieldsMeta(fieldsArr);
        return fields;
    }
    getLookupData(fields) {
        return this.fcmetaService.getLookupData(fields);
    }
};
FieldControlService = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(ng2_completer_1.CompleterService)),
    __param(1, core_1.Inject(config_service_1.ConfigService)),
    __param(2, core_1.Inject(translation_service_1.TranslationService)),
    __param(3, core_1.Inject(util_service_1.UtilityService)),
    __param(4, core_1.Inject(field_control_meta_service_1.FieldControlMetaService)),
    __metadata("design:paramtypes", [typeof (_a = typeof ng2_completer_1.CompleterService !== "undefined" && ng2_completer_1.CompleterService) === "function" ? _a : Object, config_service_1.ConfigService,
        translation_service_1.TranslationService,
        util_service_1.UtilityService,
        field_control_meta_service_1.FieldControlMetaService, typeof (_b = typeof core_1.ApplicationRef !== "undefined" && core_1.ApplicationRef) === "function" ? _b : Object])
], FieldControlService);
exports.FieldControlService = FieldControlService;
