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
var controller = require("../../typescript/controllers/CoreController.js");
var Controllers;
(function (Controllers) {
    var Dashboard = (function (_super) {
        __extends(Dashboard, _super);
        function Dashboard() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'render',
                'getRecordList'
            ];
            return _this;
        }
        Dashboard.prototype.bootstrap = function () {
        };
        Dashboard.prototype.render = function (req, res) {
            var recordType = req.param('recordType') ? req.param('recordType') : '';
            return this.sendView(req, res, 'dashboard', { recordType: recordType });
        };
        Dashboard.prototype.getRecordList = function (req, res) {
            var _this = this;
            var brand = BrandingService.getBrand(req.session.branding);
            var editAccessOnly = req.query.editOnly;
            var roles = [];
            var username = "guest";
            var user = {};
            if (req.isAuthenticated()) {
                roles = req.user.roles;
                user = req.user;
                username = req.user.username;
            }
            else {
                user = { username: username };
                roles = [];
                roles.push(RolesService.getDefUnathenticatedRole(brand));
            }
            var recordType = req.param('recordType');
            var workflowState = req.param('state');
            var start = req.param('start');
            var rows = req.param('rows');
            this.getRecords(workflowState, recordType, start, rows, user, roles, brand, editAccessOnly).flatMap(function (results) {
                return results;
            }).subscribe(function (response) {
                if (response && response.code == "200") {
                    response.success = true;
                    _this.ajaxOk(req, res, null, response);
                }
                else {
                    _this.ajaxFail(req, res, null, response);
                }
            }, function (error) {
                sails.log.error("Error updating meta:");
                sails.log.error(error);
                _this.ajaxFail(req, res, error.message);
            });
        };
        Dashboard.prototype.getDocMetadata = function (doc) {
            var metadata = {};
            for (var key in doc) {
                if (key.indexOf('authorization_') != 0 && key.indexOf('metaMetadata_') != 0) {
                    metadata[key] = doc[key];
                }
                if (key == 'authorization_editRoles') {
                    metadata[key] = doc[key];
                }
            }
            return metadata;
        };
        Dashboard.prototype.getRecords = function (workflowState, recordType, start, rows, user, roles, brand, editAccessOnly) {
            var _this = this;
            if (editAccessOnly === void 0) { editAccessOnly = undefined; }
            var username = user.username;
            var response = DashboardService.getRecords(workflowState, recordType, start, rows, username, roles, brand, editAccessOnly);
            return response.map(function (results) {
                var totalItems = results["response"]["numFound"];
                var startIndex = results["response"]["start"];
                var noItems = 10;
                var pageNumber = (startIndex / noItems) + 1;
                var response = {};
                response["totalItems"] = totalItems;
                response["currentPage"] = pageNumber;
                response["noItems"] = noItems;
                var items = [];
                var docs = results["response"]["docs"];
                for (var i = 0; i < docs.length; i++) {
                    var doc = docs[i];
                    var item = {};
                    item["oid"] = doc["redboxOid"];
                    item["title"] = doc["metadata"]["title"];
                    item["metadata"] = _this.getDocMetadata(doc);
                    item["dateCreated"] = doc["date_object_created"][0];
                    item["dateModified"] = doc["date_object_modified"][0];
                    item["hasEditAccess"] = RecordsService.hasEditAccess(brand, user, roles, doc);
                    items.push(item);
                }
                response["items"] = items;
                return Rx_1.Observable.of(response);
            });
        };
        return Dashboard;
    }(controller.Controllers.Core.Controller));
    Controllers.Dashboard = Dashboard;
})(Controllers = exports.Controllers || (exports.Controllers = {}));
module.exports = new Controllers.Dashboard().exports();
