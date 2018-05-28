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
var controller = require("../core/CoreController.js");
var Controllers;
(function (Controllers) {
    var Report = (function (_super) {
        __extends(Report, _super);
        function Report() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'render',
                'get',
                'getResults',
                'downloadCSV'
            ];
            return _this;
        }
        Report.prototype.bootstrap = function () {
        };
        Report.prototype.render = function (req, res) {
            return this.sendView(req, res, 'admin/report');
        };
        Report.prototype.get = function (req, res) {
            var _this = this;
            var brand = BrandingService.getBrand(req.session.branding);
            ReportsService.get(brand, req.param('name')).subscribe(function (response) {
                return _this.ajaxOk(req, res, null, response);
            });
        };
        Report.prototype.getResults = function (req, res) {
            var _this = this;
            var brand = BrandingService.getBrand(req.session.branding);
            var response = ReportsService.getResults(brand, req.param('name'), req, req.param('start'), req.param('rows'));
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
                    for (var key in doc) {
                        item[key] = doc[key];
                    }
                    items.push(item);
                }
                response["items"] = items;
                return Rx_1.Observable.of(response);
            }).flatMap(function (results) {
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
            ;
        };
        Report.prototype.downloadCSV = function (req, res) {
            var brand = BrandingService.getBrand(req.session.branding);
            var response = ReportsService.getCSVResult(brand, req.param('name'));
            response.subscribe(function (results) {
                res.setHeader('Content-disposition', 'attachment; filename=' + req.param('name') + '.csv');
                res.set('Content-Type', 'text/csv');
                res.status(200).send(results);
                return res;
            });
        };
        return Report;
    }(controller.Controllers.Core.Controller));
    Controllers.Report = Report;
})(Controllers = exports.Controllers || (exports.Controllers = {}));
module.exports = new Controllers.Report().exports();
