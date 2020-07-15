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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const http_1 = require("@angular/http");
require("rxjs/add/operator/map");
require("rxjs/add/operator/toPromise");
const moment_es6_1 = require("moment-es6");
const base_service_1 = require("../shared/base-service");
const config_service_1 = require("./config-service");
const translation_service_1 = require("./translation-service");
const _ = require("lodash");
let DashboardService = class DashboardService extends base_service_1.BaseService {
    constructor(http, configService, translator) {
        super(http, configService);
        this.configService = configService;
        this.translator = translator;
    }
    getAllDraftPlansCanEdit() {
        const rows = this.config.maxTransferRowsPerPage;
        const start = 0;
        return this.http.get(`${this.brandingAndPortalUrl}/listRecords?recordType=rdmp&state=draft&editOnly=true&start=${start}&rows=${rows}&ts=${moment_es6_1.default().unix()}`, this.options)
            .toPromise()
            .then((res) => this.formatDates(this.extractData(res)));
    }
    getAllRecordsCanEdit(recordType, state) {
        const rows = this.config.maxTransferRowsPerPage;
        const start = 0;
        let url = `${this.brandingAndPortalUrl}/listRecords?recordType=${recordType}&editOnly=true&start=${start}&rows=${rows}&ts=${moment_es6_1.default().unix()}`;
        if (state != '') {
            url += `&state=${state}`;
        }
        return this.http.get(url, this.options)
            .toPromise()
            .then((res) => this.formatDates(this.extractData(res)));
    }
    getActivePlans(pageNumber) {
        var rows = 10;
        var start = (pageNumber - 1) * rows;
        return this.http.get(`${this.brandingAndPortalUrl}/listRecords?state=active&start=${start}&rows=${rows}&ts=${moment_es6_1.default().unix()}`, this.options)
            .toPromise()
            .then((res) => this.formatDates(this.extractData(res)));
    }
    getDraftPlans(pageNumber) {
        var rows = 10;
        var start = (pageNumber - 1) * rows;
        return this.http.get(`${this.brandingAndPortalUrl}/listRecords?recordType=rdmp&state=draft&start=${start}&rows=${rows}&ts=${moment_es6_1.default().unix()}`, this.options)
            .toPromise()
            .then((res) => this.formatDates(this.extractData(res)));
    }
    getRecords(recordType, state, pageNumber, packageType = undefined, sort = undefined) {
        var rows = 10;
        var start = (pageNumber - 1) * rows;
        recordType = (!_.isEmpty(recordType) && !_.isUndefined(recordType)) ? `recordType=${recordType}` : '';
        packageType = (!_.isEmpty(packageType) && !_.isUndefined(packageType)) ? `packageType=${packageType}` : '';
        sort = (!_.isEmpty(sort) && !_.isUndefined(sort)) ? `&sort=${sort}` : '';
        state = (!_.isEmpty(state) && !_.isUndefined(state)) ? `&state=${state}` : '';
        return this.http.get(`${this.brandingAndPortalUrl}/listRecords?${recordType}${packageType}${state}${sort}&start=${start}&rows=${rows}&ts=${moment_es6_1.default().unix()}`, this.options)
            .toPromise()
            .then((res) => this.formatDates(this.extractData(res)));
    }
    formatDates(response) {
        var items = response["items"];
        for (var i = 0; i < items.length; i++) {
            items[i]["dateCreated"] = moment_es6_1.default(items[i]["dateCreated"]).local().format('LLL');
            items[i]["dateModified"] = moment_es6_1.default(items[i]["dateModified"]).local().format('LLL');
        }
        return response;
    }
    setDashboardTitle(planTable, plans = null) {
        _.forEach(planTable ? planTable.items : plans, (plan) => {
            plan.dashboardTitle = (_.isUndefined(plan.title) || _.isEmpty(plan.title) || _.isEmpty(plan.title[0])) ? this.translator.t('plan-with-no-title') : plan.title;
        });
    }
    searchRecords(pageNumber, basicSearch, facets = null) {
        const rows = this.config.maxSearchRowsPerPage;
        const start = (pageNumber - 1) * rows;
        return this.http.get(`${this.brandingAndPortalUrl}/searchPlans?start=${start}&rows=${rows}&query=${basicSearch}&facets=${facets}&ts=${moment_es6_1.default().unix()}`, this.options)
            .toPromise()
            .then((res) => this.formatDates(this.extractData(res)));
    }
};
DashboardService = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(http_1.Http)),
    __param(1, core_1.Inject(config_service_1.ConfigService)),
    __param(2, core_1.Inject(translation_service_1.TranslationService)),
    __metadata("design:paramtypes", [typeof (_a = typeof http_1.Http !== "undefined" && http_1.Http) === "function" ? _a : Object, config_service_1.ConfigService,
        translation_service_1.TranslationService])
], DashboardService);
exports.DashboardService = DashboardService;
