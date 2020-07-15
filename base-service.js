"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("@angular/http");
require("rxjs/add/observable/interval");
require("rxjs/add/observable/of");
require("rxjs/add/operator/mergeMap");
const Subject_1 = require("rxjs/Subject");
class BaseService {
    constructor(http, configService) {
        this.http = http;
        this.configService = configService;
        this.initSubject = new Subject_1.Subject();
        this.configService.getConfig((config) => {
            this.config = config;
            this.baseUrl = this.config.baseUrl;
            this.brandingAndPortalUrl = `${this.baseUrl}/${this.config.branding}/${this.config.portal}`;
            this.options = this.getOptionsClient();
            this.emitInit();
        });
    }
    get getBrandingAndPortalUrl() {
        return this.brandingAndPortalUrl;
    }
    get getBaseUrl() {
        return this.baseUrl;
    }
    waitForInit(handler) {
        const subs = this.initSubject.subscribe(handler);
        this.emitInit();
        return subs;
    }
    getInitSubject() {
        return this.initSubject;
    }
    emitInit() {
        if (this.config) {
            this.initSubject.next(this);
        }
    }
    getConfig() {
        return this.config;
    }
    extractData(res, parentField = null) {
        let body = res.json();
        if (parentField) {
            return body[parentField] || {};
        }
        else {
            return body || {};
        }
    }
    getOptions(headersObj) {
        let headers = new http_1.Headers(headersObj);
        return new http_1.RequestOptions({ headers: headers });
    }
    getOptionsClient(headersObj = {}) {
        headersObj['X-Source'] = 'jsclient';
        headersObj['Content-Type'] = 'application/json;charset=utf-8';
        headersObj['X-CSRF-Token'] = this.config.csrfToken;
        return this.getOptions(headersObj);
    }
}
exports.BaseService = BaseService;
