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
var moment_es6_1 = require("moment-es6");
var Services;
(function (Services) {
    var Asynchs = (function (_super) {
        __extends(Asynchs, _super);
        function Asynchs() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'start',
                'update',
                'finish'
            ];
            return _this;
        }
        Asynchs.prototype.start = function (brandId, processName, username) {
            return _super.prototype.getObservable.call(this, AsynchProgress.create({ name: processName, started_by: username, branding: brandId, status: 'starting', date_started: moment_es6_1.default().format('YYYY-MM-DDTHH:mm:ss') }));
        };
        Asynchs.prototype.update = function (criteria, progressObj) {
            return _super.prototype.getObservable.call(this, AsynchProgress.update(criteria, progressObj));
        };
        Asynchs.prototype.finish = function (progressId, progressObj) {
            if (progressObj === void 0) { progressObj = null; }
            if (progressObj) {
                progressObj.date_completed = moment_es6_1.default().format('YYYY-MM-DD HH:mm:ss');
            }
            else {
                progressObj = { date_completed: moment_es6_1.default().format('YYYY-MM-DD HH:mm:ss') };
            }
            progressObj.status = 'finished';
            return _super.prototype.getObservable.call(this, AsynchProgress.update({ id: progressId }, progressObj));
        };
        return Asynchs;
    }(services.Services.Core.Service));
    Services.Asynchs = Asynchs;
})(Services = exports.Services || (exports.Services = {}));
module.exports = new Services.Asynchs().exports();
