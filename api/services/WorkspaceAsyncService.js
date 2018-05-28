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
var services = require("../core/CoreService.js");
var util = require('util');
var moment = require('moment');
var Services;
(function (Services) {
    var WorkspaceAsync = (function (_super) {
        __extends(WorkspaceAsync, _super);
        function WorkspaceAsync() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'start',
                'update',
                'pending',
                'loop'
            ];
            return _this;
        }
        WorkspaceAsync.prototype.start = function (_a) {
            var name = _a.name, recordType = _a.recordType, username = _a.username, service = _a.service, method = _a.method, args = _a.args;
            return _super.prototype.getObservable.call(this, WorkspaceAsync.create({ name: name, started_by: username, recordType: recordType,
                method: method, args: args, status: 'started' }));
        };
        WorkspaceAsync.prototype.update = function (id, obj) {
            if (obj.status === 'finished') {
                obj.date_completed = moment().format('YYYY-MM-DD HH:mm:ss');
            }
            return _super.prototype.getObservable.call(this, WorkspaceAsync.update({ id: id }, obj));
        };
        WorkspaceAsync.prototype.pending = function () {
            return _super.prototype.getObservable.call(this, WorkspaceAsync.find({ status: 'pending' }));
        };
        WorkspaceAsync.prototype.loop = function () {
            var _this = this;
            sails.log.verbose('::::LOOP PENDING STATE::::::');
            this.pending().subscribe(function (pending) {
                _.forEach(pending, function (wa) {
                    var args = wa.args || null;
                    sails.services[wa.service][wa.method]({ args: args }).subscribe(function (message) {
                        _this.update(wa.id, { status: 'finished', message: message }).subscribe();
                    }, function (error) {
                        _this.update(wa.id, { status: 'error', message: error }).subscribe();
                    });
                });
            }, function (error) {
                sails.log.error(error);
            });
        };
        return WorkspaceAsync;
    }(services.Services.Core.Service));
    Services.WorkspaceAsync = WorkspaceAsync;
})(Services = exports.Services || (exports.Services = {}));
module.exports = new Services.WorkspaceAsync().exports();
