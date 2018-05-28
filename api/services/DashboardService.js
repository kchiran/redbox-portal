"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Rx_1 = require("rxjs/Rx");
var services = require("../core/CoreService.js");
var request = require("request-promise");
var Services;
(function (Services) {
    var Dashboard = (function (_super) {
        __extends(Dashboard, _super);
        function Dashboard() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'getRecords',
                'exportAllPlans'
            ];
            return _this;
        }
        Dashboard.prototype.getRecords = function (workflowState, recordType, start, rows, username, roles, brand, editAccessOnly) {
            if (rows === void 0) { rows = 10; }
            if (editAccessOnly === void 0) { editAccessOnly = undefined; }
            var url = sails.config.record.baseUrl.redbox + sails.config.record.api.query.url + "?collection=metadataDocuments";
            url = this.addPaginationParams(url, start, rows);
            var roleNames = this.getRoleNames(roles, brand);
            var query = {
                "metaMetadata.brandId": brand.id,
                "metaMetadata.type": recordType,
                "$or": [
                    { "authorization.view": username },
                    { "authorization.edit": username },
                    { "authorization.editRoles": { "$in": roleNames } },
                    { "authorization.viewRoles": { "$in": roleNames } }
                ]
            };
            if (workflowState != undefined) {
                query["workflow.stage"] = workflowState;
            }
            var options = this.getOptions(url);
            options['body'] = query;
            return Rx_1.Observable.fromPromise(request[sails.config.record.api.query.method](options));
        };
        Dashboard.prototype.exportAllPlans = function (username, roles, brand, format, modBefore, modAfter) {
            var dateQ = modBefore || modAfter ? " AND date_object_modified:[" + (modAfter ? modAfter + "T00:00:00Z" : '*') + " TO " + (modBefore ? modBefore + "T23:59:59Z" : '*') + "]" : '';
            var url = sails.config.record.baseUrl.redbox;
            url = "" + url + sails.config.record.api.search.url + "?q=metaMetadata_type:rdmp" + dateQ + "&sort=date_object_modified desc&version=2.2&wt=" + format;
            url = url + "&start=0&rows=" + sails.config.record.export.maxRecords;
            url = this.addAuthFilter(url, username, roles, brand);
            url = url + "&fq=metaMetadata_brandId:" + brand.id;
            var options = this.getOptions(url);
            sails.log.verbose("Query URL is: " + url);
            return Rx_1.Observable.fromPromise(request[sails.config.record.api.search.method](options));
        };
        Dashboard.prototype.addQueryParams = function (url, workflowState) {
            url = url + "?q=metaMetadata_type:rdmp AND workflow_stage:" + workflowState + "&sort=date_object_modified desc&version=2.2";
            return url;
        };
        Dashboard.prototype.addPaginationParams = function (url, start, rows) {
            url = url + "&start=" + start + "&rows=" + rows + "&wt=json";
            return url;
        };
        Dashboard.prototype.getRoleNames = function (roles, brand) {
            var roleNames = [];
            for (var i = 0; i < roles.length; i++) {
                var role = roles[i];
                if (role.branding == brand.id) {
                    roleNames.push(roles[i].name);
                }
            }
            return roleNames;
        };
        Dashboard.prototype.addAuthFilter = function (url, username, roles, brand, editAccessOnly) {
            if (editAccessOnly === void 0) { editAccessOnly = undefined; }
            var roleString = "";
            var matched = false;
            for (var i = 0; i < roles.length; i++) {
                var role = roles[i];
                if (role.branding == brand.id) {
                    if (matched) {
                        roleString += " OR ";
                        matched = false;
                    }
                    roleString += roles[i].name;
                    matched = true;
                }
            }
            url = url + "&fq=authorization_edit:" + username + (editAccessOnly ? "" : (" OR authorization_view:" + username + " OR authorization_viewRoles:(" + roleString + ")")) + " OR authorization_editRoles:(" + roleString + ")";
            return url;
        };
        Dashboard.prototype.getOptions = function (url) {
            return { url: url, json: true, headers: { 'Authorization': "Bearer " + sails.config.redbox.apiKey, 'Content-Type': 'application/json; charset=utf-8' } };
        };
        return Dashboard;
    }(services.Services.Core.Service));
    Services.Dashboard = Dashboard;
})(Services = exports.Services || (exports.Services = {}));
module.exports = new Services.Dashboard().exports();
