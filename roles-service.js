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
const base_service_1 = require("../shared/base-service");
const config_service_1 = require("./config-service");
let RolesService = class RolesService extends base_service_1.BaseService {
    constructor(http, configService) {
        super(http, configService);
        this.configService = configService;
    }
    getBrandRoles() {
        return this.http.get(`${this.brandingAndPortalUrl}/admin/roles/get`, this.options)
            .toPromise()
            .then((res) => this.extractData(res));
    }
    updateUserRoles(userid, roleIds) {
        return this.http.post(`${this.brandingAndPortalUrl}/admin/roles/user`, { userid: userid, roles: roleIds }, this.options)
            .toPromise()
            .then((res) => this.extractData(res));
    }
};
RolesService = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(http_1.Http)), __param(1, core_1.Inject(config_service_1.ConfigService)),
    __metadata("design:paramtypes", [typeof (_a = typeof http_1.Http !== "undefined" && http_1.Http) === "function" ? _a : Object, config_service_1.ConfigService])
], RolesService);
exports.RolesService = RolesService;
