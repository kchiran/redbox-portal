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
    var WorkspaceService = (function (_super) {
        __extends(WorkspaceService, _super);
        function WorkspaceService() {
            var _this = _super.call(this) || this;
            _this._exportedMethods = [
                'createWorkspaceRecord',
                'getRecordMeta',
                'updateRecordMeta',
                'registerUserApp',
                'userInfo',
                'provisionerUser',
                'getCookies',
                'getCookieValue',
                'cookieJar',
                'infoFormUserId',
                'createWorkspaceInfo',
                'updateWorkspaceInfo',
                'workspaceAppFromUserId',
                'removeAppFromUserId',
                'mapToRecord'
            ];
            return _this;
        }
        WorkspaceService.prototype.getCookies = function (cookies) {
            var cookieJar = [];
            cookies.forEach(function (rawcookies) {
                var cookie = request.cookie(rawcookies);
                cookieJar.push({ key: cookie.key, value: cookie.value, expires: cookie.expires });
            });
            return cookieJar;
        };
        WorkspaceService.prototype.getCookieValue = function (cookieJar, key) {
            var cookie = _.findWhere(cookieJar, { key: key });
            if (cookie) {
                return cookie.value;
            }
            else
                return '';
        };
        WorkspaceService.prototype.cookieJar = function (jar, config, key, value) {
            var keyvalue = key + '=' + value;
            var cookie = request.cookie('' + keyvalue);
            jar.setCookie(cookie, config.host, function (error, cookie) {
                sails.log.debug(cookie);
            });
            return jar;
        };
        WorkspaceService.prototype.mapToRecord = function (obj, recordMap) {
            var newObj = {};
            _.each(recordMap, function (value) {
                newObj[value.record] = _.get(obj, value.ele);
            });
            return newObj;
        };
        WorkspaceService.prototype.createWorkspaceRecord = function (config, username, project, recordType, workflowStage) {
            sails.log.debug(config);
            var post = request({
                uri: config.brandingAndPortalUrl + ("/api/records/metadata/" + recordType),
                method: 'POST',
                body: {
                    authorization: {
                        edit: [username],
                        view: [username],
                        editPending: [],
                        viewPending: []
                    },
                    metadata: project,
                    workflowStage: workflowStage
                },
                json: true,
                headers: config.redboxHeaders
            });
            return Rx_1.Observable.fromPromise(post);
        };
        WorkspaceService.prototype.getRecordMeta = function (config, rdmp) {
            var get = request({
                uri: config.brandingAndPortalUrl + '/api/records/metadata/' + rdmp,
                json: true,
                headers: config.redboxHeaders
            });
            return Rx_1.Observable.fromPromise(get);
        };
        WorkspaceService.prototype.updateRecordMeta = function (config, record, id) {
            var post = request({
                uri: config.brandingAndPortalUrl + '/api/records/metadata/' + id,
                method: 'PUT',
                body: record,
                json: true,
                headers: config.redboxHeaders
            });
            return Rx_1.Observable.fromPromise(post);
        };
        WorkspaceService.prototype.userInfo = function (userId) {
            return _super.prototype.getObservable.call(this, User.findOne({ id: userId }));
        };
        WorkspaceService.prototype.provisionerUser = function (username) {
            return _super.prototype.getObservable.call(this, User.findOne({ username: username }));
        };
        WorkspaceService.prototype.infoFormUserId = function (userId) {
            return this.getObservable(User.findOne({ id: userId }).populate('workspaceApps'));
        };
        WorkspaceService.prototype.createWorkspaceInfo = function (userId, appName, info) {
            return this.getObservable(WorkspaceApp.findOrCreate({ app: appName, user: userId }, { app: appName, user: userId, info: info }));
        };
        WorkspaceService.prototype.updateWorkspaceInfo = function (id, info) {
            return this.getObservable(WorkspaceApp.update({ id: id }, { info: info }));
        };
        WorkspaceService.prototype.workspaceAppFromUserId = function (userId, appName) {
            return this.getObservable(WorkspaceApp.findOne({ app: appName, user: userId }));
        };
        WorkspaceService.prototype.removeAppFromUserId = function (userId, id) {
            return this.getObservable(WorkspaceApp.destroy({ id: id, user: userId }));
        };
        return WorkspaceService;
    }(services.Services.Core.Service));
    Services.WorkspaceService = WorkspaceService;
})(Services = exports.Services || (exports.Services = {}));
module.exports = new Services.WorkspaceService().exports();
