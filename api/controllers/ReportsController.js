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
    var Reports = (function (_super) {
        __extends(Reports, _super);
        function Reports() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'render'
            ];
            return _this;
        }
        Reports.prototype.bootstrap = function () {
        };
        Reports.prototype.render = function (req, res) {
            var _this = this;
            var brand = BrandingService.getBrand(req.session.branding);
            ReportsService.findAllReportsForBrand(brand).subscribe(function (reports) {
                req.options.locals["reports"] = reports;
                return _this.sendView(req, res, 'admin/reports');
            });
        };
        return Reports;
    }(controller.Controllers.Core.Controller));
    Controllers.Reports = Reports;
})(Controllers = exports.Controllers || (exports.Controllers = {}));
module.exports = new Controllers.Reports().exports();
