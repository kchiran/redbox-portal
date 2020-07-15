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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const http_1 = require("@angular/http");
const Subject_1 = require("rxjs/Subject");
require("rxjs/add/observable/interval");
require("rxjs/add/observable/of");
require("rxjs/add/operator/mergeMap");
let ConfigService = class ConfigService {
    constructor(http) {
        this.http = http;
        this.subjects = {};
        this.subjects['get'] = new Subject_1.Subject();
        this.initConfig();
    }
    getConfig(handler) {
        const subs = this.subjects['get'].subscribe(handler);
        this.emitConfig();
        return subs;
    }
    emitConfig() {
        if (this.config) {
            this.subjects['get'].next(this.config);
        }
    }
    initConfig() {
        this.http.get(`/csrfToken`).mergeMap((csrfRes) => {
            this.csrfToken = csrfRes.json()['_csrf'];
            return this.http.get(`/dynamic/apiClientConfig?v=${new Date().getTime()}`);
        })
            .subscribe((res) => {
            this.config = this.extractData(res);
            this.config['csrfToken'] = this.csrfToken;
            console.log(`ConfigService, initialized. `);
            this.emitConfig();
        });
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
};
ConfigService = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(http_1.Http)),
    __metadata("design:paramtypes", [Object])
], ConfigService);
exports.ConfigService = ConfigService;
