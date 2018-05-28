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
var controller = require("../core/CoreController.js");
var Controllers;
(function (Controllers) {
    var WorkspaceAsync = (function (_super) {
        __extends(WorkspaceAsync, _super);
        function WorkspaceAsync() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'start',
                'loop'
            ];
            return _this;
        }
        WorkspaceAsync.prototype.start = function (req, res) {
            var _this = this;
            var name = req.param('name');
            var recordType = req.param('recordType');
            var username = req.username;
            var method = req.param('method');
            var args = req.param('args');
            WorkspaceAsyncService.start({ name: name, recordType: recordType, username: username, method: method, args: args })
                .subscribe(function (response) {
                _this.ajaxOk(req, res, null, {});
            }, function (error) {
                sails.log.error(error);
                _this.ajaxFail(req, res, 'Error registering async workspace', error);
            });
        };
        return WorkspaceAsync;
    }(controller.Controllers.Core.Controller));
    Controllers.WorkspaceAsync = WorkspaceAsync;
})(Controllers = exports.Controllers || (exports.Controllers = {}));
