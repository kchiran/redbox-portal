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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const Observable_1 = require("rxjs/Observable");
const _ = require("lodash");
const fieldClasses_1 = require("../fieldClasses");
const config_service_1 = require("../config-service");
const field_vocab_component_1 = require("./field-vocab.component");
const ng2_completer_1 = require("ng2-completer");
const translation_service_1 = require("../translation-service");
const util_service_1 = require("../util-service");
const base_service_1 = require("../base-service");
const http_1 = require("@angular/http");
let FieldControlMetaService = class FieldControlMetaService extends base_service_1.BaseService {
    constructor(http, vocabFieldLookupService, completerService, configService, translationService, utilityService, app) {
        super(http, configService);
        this.vocabFieldLookupService = vocabFieldLookupService;
        this.completerService = completerService;
        this.configService = configService;
        this.translationService = translationService;
        this.utilityService = utilityService;
        this.app = app;
        this.classes = fieldClasses_1.fieldClasses;
    }
    getFieldsMeta(fieldsArr) {
        const fields = _.map(fieldsArr, (f) => {
            const inst = new this.classes[f.class].meta(f.definition, this.app['_injector']);
            inst.utilityService = this.getInjectedService('utilityService');
            inst.appConfig = this.getInjectedService('configService').config;
            if (_.isArray(this.classes[f.class].comp)) {
                inst.compClass = _.find(this.classes[f.class].comp, (c) => {
                    return c.clName == f.compClass;
                });
                if (_.isUndefined(inst.compClass)) {
                    inst.compClass = this.classes[f.class].comp[0];
                }
            }
            else {
                inst.compClass = this.classes[f.class].comp;
            }
            if (f.definition && f.definition.fields) {
                inst.fields = this.getFieldsMeta(f.definition.fields);
            }
            return inst;
        });
        return fields;
    }
    flattenFields(fields, fieldArr) {
        _.map(fields, (f) => {
            fieldArr.push(f);
            if (f.fields) {
                this.flattenFields(f.fields, fieldArr);
            }
        });
    }
    getLookupData(fields) {
        let fieldArray = [];
        this.flattenFields(fields, fieldArray);
        return Observable_1.Observable.from(fieldArray).flatMap((f) => {
            if (f.hasLookup) {
                const lookupServiceName = this.classes[f.clName].lookupService;
                const serviceInst = this.getInjectedService(lookupServiceName);
                f.setLookupServices(this.getInjectedService('completerService'), serviceInst);
                return serviceInst.getLookupData(f);
            }
            else {
                return Observable_1.Observable.of(null);
            }
        })
            .flatMap((field) => {
            return Observable_1.Observable.of(field);
        })
            .last()
            .flatMap((whatever) => {
            return Observable_1.Observable.of(fields);
        });
    }
    getInjectedService(serviceName) {
        let serviceInst = null;
        switch (serviceName) {
            case 'vocabFieldLookupService':
                serviceInst = this.vocabFieldLookupService;
                break;
            case 'completerService':
                serviceInst = this.completerService;
                break;
            case 'configService':
                serviceInst = this.configService;
                break;
            case 'translationService':
                serviceInst = this.translationService;
                break;
            case 'utilityService':
                serviceInst = this.utilityService;
                break;
        }
        return serviceInst;
    }
};
FieldControlMetaService = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(http_1.Http)),
    __param(1, core_1.Inject(field_vocab_component_1.VocabFieldLookupService)),
    __param(2, core_1.Inject(ng2_completer_1.CompleterService)),
    __param(3, core_1.Inject(config_service_1.ConfigService)),
    __param(4, core_1.Inject(translation_service_1.TranslationService)),
    __param(5, core_1.Inject(util_service_1.UtilityService)),
    __metadata("design:paramtypes", [typeof (_a = typeof http_1.Http !== "undefined" && http_1.Http) === "function" ? _a : Object, field_vocab_component_1.VocabFieldLookupService, typeof (_b = typeof ng2_completer_1.CompleterService !== "undefined" && ng2_completer_1.CompleterService) === "function" ? _b : Object, config_service_1.ConfigService,
        translation_service_1.TranslationService,
        util_service_1.UtilityService, typeof (_c = typeof core_1.ApplicationRef !== "undefined" && core_1.ApplicationRef) === "function" ? _c : Object])
], FieldControlMetaService);
exports.FieldControlMetaService = FieldControlMetaService;
