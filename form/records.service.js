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
const base_service_1 = require("../base-service");
const http_1 = require("@angular/http");
require("rxjs/add/operator/toPromise");
const field_control_meta_service_1 = require("./field-control-meta.service");
const Observable_1 = require("rxjs/Observable");
const _ = require("lodash");
const config_service_1 = require("../config-service");
let RecordsService = class RecordsService extends base_service_1.BaseService {
    constructor(http, fcmetaService, configService, app) {
        super(http, configService);
        this.fcmetaService = fcmetaService;
        this.configService = configService;
        this.app = app;
    }
    getForm(oid = null, recordType = null, editable = true) {
        if (_.isEmpty(oid)) {
            oid = null;
        }
        return this.getFormFieldsMeta(recordType, editable, oid).then((form) => {
            return this.fcmetaService.getLookupData(form.fieldsMeta).flatMap((fields) => {
                form.fieldsMata = fields;
                return Observable_1.Observable.of(form);
            });
        });
    }
    addRenderCompleteElement(fieldsMeta) {
        var renderCompleteElement = {
            "class": "Container",
            "compClass": "TextBlockComponent",
            "definition": {
                "value": "",
                "type": "span",
                "cssClasses": "form-render-complete"
            }
        };
        fieldsMeta.push(renderCompleteElement);
    }
    getFormFields(recordType, oid = null, editable) {
        const ts = new Date().getTime();
        console.log("Oid is: " + oid);
        const url = oid ? `${this.brandingAndPortalUrl}/record/form/auto/${oid}?edit=${editable}&ts=${ts}` : `${this.brandingAndPortalUrl}/record/form/${recordType}?edit=${editable}&ts=${ts}`;
        console.log("URL is: " + url);
        return this.http.get(url, this.options)
            .toPromise()
            .then((res) => this.extractData(res));
    }
    getFormFieldsMeta(recordType, editable, oid = null) {
        return this.getFormFields(recordType, oid, editable).then((form) => {
            if (form && form.fields) {
                if (!editable) {
                    this.addRenderCompleteElement(form.fields);
                }
                form.fieldsMeta = this.fcmetaService.getFieldsMeta(form.fields);
            }
            else {
                console.error("Error loading form:" + recordType);
                throw form;
            }
            return form;
        });
    }
    create(record, recordType, targetStep = '') {
        return this.http.post(`${this.brandingAndPortalUrl}/recordmeta/${recordType}${this.getTargetStepParam(targetStep, '?')}`, record, this.getOptionsClient())
            .map((res) => this.extractData(res));
    }
    update(oid, record, targetStep = '') {
        return this.http.put(`${this.brandingAndPortalUrl}/recordmeta/${oid}${this.getTargetStepParam(targetStep, '?')}`, record, this.getOptionsClient())
            .map((res) => this.extractData(res));
    }
    getTargetStepParam(targetStep, delim) {
        return _.isEmpty(targetStep) ? '' : `${delim}targetStep=${targetStep}`;
    }
    stepTo(oid, record, targetStep) {
        return this.http.post(`${this.brandingAndPortalUrl}/record/workflow/step/${targetStep}/${oid}`, record, this.getOptionsClient())
            .map((res) => this.extractData(res));
    }
    getDashboardUrl(recType = 'rdmp') {
        return `${this.brandingAndPortalUrl}/dashboard/${recType}`;
    }
    getAttachments(oid) {
        return this.http.get(`${this.brandingAndPortalUrl}/record/${oid}/attachments`, this.getOptionsClient()).toPromise()
            .then((res) => this.extractData(res));
    }
    modifyEditors(records, username, email) {
        return this.http.post(`${this.brandingAndPortalUrl}/record/editors/modify`, { records: records, username: username, email: email }, this.getOptionsClient())
            .toPromise()
            .then((res) => this.extractData(res));
    }
    updateResponsibilities(records, role, updateData) {
        return this.http.post(`${this.brandingAndPortalUrl}/record/responsibility/update`, { records: records, role: role, updateData: updateData }, this.getOptionsClient())
            .toPromise()
            .then((res) => this.extractData(res));
    }
    getTransferResponsibility(recordType) {
        return this.http.get(`${this.brandingAndPortalUrl}/transferconfig/${recordType}`, this.getOptionsClient())
            .toPromise()
            .then((res) => this.extractData(res));
    }
    search(params) {
        let refinedSearchStr = '';
        params.filterActiveRefinersWithNoData();
        if (_.size(params.activeRefiners) > 0) {
            let exactSearchNames = '';
            let exactSearchValues = '';
            let facetSearchNames = '';
            let facetSearchValues = '';
            _.forEach(params.activeRefiners, (refiner) => {
                switch (refiner.type) {
                    case "exact":
                        exactSearchNames = `${_.isEmpty(exactSearchNames) ? `&exactNames=` : `${exactSearchNames},`}${refiner.name}`;
                        exactSearchValues = `${exactSearchValues}&exact_${refiner.name}=${refiner.value}`;
                        break;
                    case "facet":
                        facetSearchNames = `${_.isEmpty(facetSearchNames) ? `&facetNames=` : `${facetSearchNames},`}${refiner.name}`;
                        if (!_.isEmpty(refiner.activeValue)) {
                            facetSearchValues = `${facetSearchValues}&facet_${refiner.name}=${refiner.activeValue}`;
                        }
                        break;
                }
            });
            refinedSearchStr = `${exactSearchNames}${exactSearchValues}${facetSearchNames}${facetSearchValues}`;
        }
        return this.http.get(`${this.brandingAndPortalUrl}/record/search/${params.recordType}/?searchStr=${params.basicSearch}${refinedSearchStr}`, this.getOptionsClient())
            .toPromise()
            .then((res) => this.extractData(res));
    }
    getType(name) {
        return this.http.get(`${this.brandingAndPortalUrl}/record/type/${name}`, this.getOptionsClient())
            .toPromise()
            .then((res) => this.extractData(res));
    }
    getAllTypes() {
        return this.http.get(`${this.brandingAndPortalUrl}/record/type/`, this.getOptionsClient())
            .toPromise()
            .then((res) => this.extractData(res));
    }
    getWorkflowSteps(name) {
        return this.http.get(`${this.brandingAndPortalUrl}/record/wfSteps/${name}`, this.getOptionsClient())
            .toPromise()
            .then((res) => this.extractData(res));
    }
    getRecordMeta(oid = null) {
        return this.http.get(`${this.brandingAndPortalUrl}/record/metadata/` + oid, this.options)
            .toPromise()
            .then((res) => this.extractData(res));
    }
    executeAction(action, params) {
        return this.http.post(`${this.brandingAndPortalUrl}/action/${action}`, params, this.options)
            .toPromise()
            .then((res) => this.extractData(res));
    }
    getAsyncProgress(fq) {
        return this.http.get(`${this.brandingAndPortalUrl}/asynch?fq=${fq}`, this.options)
            .toPromise()
            .then((res) => this.extractData(res));
    }
    subscribeToAsyncProgress(oid = null, connectCb) {
        io.socket.get(`${this.brandingAndPortalUrl}/asynch/subscribe/${oid}`, connectCb);
    }
    delete(oid) {
        return this.http.delete(`${this.brandingAndPortalUrl}/record/delete/${oid}`, this.getOptionsClient())
            .map((res) => this.extractData(res));
    }
};
RecordsService = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(http_1.Http)),
    __param(1, core_1.Inject(field_control_meta_service_1.FieldControlMetaService)),
    __param(2, core_1.Inject(config_service_1.ConfigService)),
    __metadata("design:paramtypes", [typeof (_a = typeof http_1.Http !== "undefined" && http_1.Http) === "function" ? _a : Object, field_control_meta_service_1.FieldControlMetaService,
        config_service_1.ConfigService, typeof (_b = typeof core_1.ApplicationRef !== "undefined" && core_1.ApplicationRef) === "function" ? _b : Object])
], RecordsService);
exports.RecordsService = RecordsService;
class RecordActionResult {
}
exports.RecordActionResult = RecordActionResult;
class RecordSearchRefiner {
    constructor(opts = {}) {
        this.name = opts.name;
        this.title = opts.title;
        this.type = opts.type;
        this.value = opts.value;
        this.typeLabel = opts.typeLabel;
        this.alwaysActive = opts.alwaysActive;
    }
    setCurrentValue(value) {
        if (this.type == "facet") {
            this.activeValue = value;
        }
        else {
            this.value = value;
        }
    }
}
exports.RecordSearchRefiner = RecordSearchRefiner;
class RecordSearchParams {
    constructor(recType) {
        this.recordType = recType;
        this.activeRefiners = [];
        this.clear();
    }
    clear() {
        this.basicSearch = null;
        _.remove(this.activeRefiners, refiner => {
            refiner.value = null;
            refiner.activeValue = null;
            return !refiner.alwaysActive;
        });
    }
    getRefinerConfig(name) {
        return _.find(this.refinerConfig, (config) => {
            return config.name == name;
        });
    }
    setRefinerConfig(config) {
        this.refinerConfig = config;
        _.forEach(this.refinerConfig, (refinerConfig) => {
            if (refinerConfig.alwaysActive) {
                this.addActiveRefiner(refinerConfig);
            }
        });
    }
    getHttpQuery(searchUrl) {
        let refinerValues = '';
        _.forEach(this.activeRefiners, (refiner) => {
            if (refiner.type == "facet") {
                refinerValues = `${refinerValues}&refiner|${refiner.name}=${_.isEmpty(refiner.activeValue) ? '' : refiner.activeValue}`;
            }
            else {
                refinerValues = `${refinerValues}&refiner|${refiner.name}=${_.isEmpty(refiner.value) ? '' : refiner.value}`;
            }
        });
        return `${searchUrl}?q=${this.basicSearch}&type=${this.recordType}${refinerValues}`;
    }
    getRefinerConfigs() {
        return this.refinerConfig;
    }
    addActiveRefiner(refiner) {
        const existingRefiner = _.find(this.activeRefiners, (activeRefiner) => {
            return activeRefiner.name == refiner.name;
        });
        if (existingRefiner) {
            existingRefiner.value = refiner.value;
        }
        else {
            this.activeRefiners.push(refiner);
        }
    }
    parseQueryStr(queryStr) {
        queryStr = decodeURI(queryStr);
        let refinerValues = {};
        _.forEach(queryStr.split('&'), (q) => {
            const qObj = q.split('=');
            if (_.startsWith(qObj[0], "q")) {
                this.basicSearch = qObj[1];
            }
            if (_.startsWith(qObj[0], "refiner|")) {
                const refinerName = qObj[0].split('|')[1];
                refinerValues[refinerName] = qObj[1];
            }
        });
        _.forOwn(refinerValues, (value, name) => {
            const config = this.getRefinerConfig(name);
            config.setCurrentValue(value);
            this.addActiveRefiner(config);
        });
    }
    filterActiveRefinersWithNoData() {
        const removed = _.remove(this.activeRefiners, (refiner) => {
            const value = refiner.type == 'exact' ? refiner.value : refiner.activeValue;
            return !refiner.alwaysActive && (_.isEmpty(value) || _.isUndefined(value));
        });
    }
    hasActiveRefiners() {
        let hasActive = false;
        _.forEach(this.activeRefiners, (refiner) => {
            if (!hasActive && (!_.isEmpty(refiner.value))) {
                hasActive = true;
            }
        });
        return hasActive;
    }
    setFacetValues(facets) {
        _.forEach(facets, (facet) => {
            const refiner = _.find(this.activeRefiners, (refinerConfig) => {
                return refinerConfig.name == facet.name;
            });
            if (refiner) {
                refiner.value = facet.values;
            }
        });
    }
}
exports.RecordSearchParams = RecordSearchParams;
