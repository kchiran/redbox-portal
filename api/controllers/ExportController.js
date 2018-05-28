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
    var Export = (function (_super) {
        __extends(Export, _super);
        function Export() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'index',
                'downloadRecs'
            ];
            return _this;
        }
        Export.prototype.index = function (req, res) {
            return this.sendView(req, res, 'export/index');
        };
        Export.prototype.downloadRecs = function (req, res) {
            var brand = BrandingService.getBrand(req.session.branding);
            var format = req.param('format');
            var before = _.isEmpty(req.query.before) ? null : req.query.before;
            var after = _.isEmpty(req.query.after) ? null : req.query.after;
            var filename = "Exported Records." + format;
            if (format == 'csv') {
                res.set('Content-Type', 'text/csv');
                res.set('Content-Disposition', "attachment; filename=\"" + filename + "\"");
                DashboardService.exportAllPlans(req.user.username, req.user.roles, brand, format, before, after).subscribe(function (response) {
                    return res.send(200, response);
                });
            }
            else {
                return res.send(500, 'Unsupported export format');
            }
        };
        return Export;
    }(controller.Controllers.Core.Controller));
    Controllers.Export = Export;
})(Controllers = exports.Controllers || (exports.Controllers = {}));
module.exports = new Controllers.Export().exports();
