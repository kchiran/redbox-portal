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
    var Reports = (function (_super) {
        __extends(Reports, _super);
        function Reports() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'bootstrap',
                'create',
                'findAllReportsForBrand',
                'get',
                'getResults',
                'getCSVResult',
            ];
            _this.bootstrap = function (defBrand) {
                return _super.prototype.getObservable.call(_this, Report.find({ branding: defBrand.id })).flatMap(function (reports) {
                    if (_.isEmpty(reports)) {
                        var rTypes = [];
                        sails.log.verbose("Bootstrapping report definitions... ");
                        _.forOwn(sails.config.reports, function (config, report) {
                            var obs = _this.create(defBrand, report, config);
                            obs.subscribe(function (repProcessed) { });
                            rTypes.push(obs);
                        });
                        return Rx_1.Observable.from(rTypes);
                    }
                    else {
                        var rTypes = [];
                        _.each(reports, function (report) {
                            rTypes.push(Rx_1.Observable.of(report));
                        });
                        sails.log.verbose("Default reports definition(s) exist.");
                        return Rx_1.Observable.from(rTypes);
                    }
                })
                    .last();
            };
            return _this;
        }
        Reports.prototype.findAllReportsForBrand = function (brand) {
            return _super.prototype.getObservable.call(this, Report.find({
                branding: brand.id
            }));
        };
        Reports.prototype.get = function (brand, name) {
            return _super.prototype.getObservable.call(this, Report.findOne({
                key: brand.id + "_" + name
            }));
        };
        Reports.prototype.create = function (brand, name, config) {
            return _super.prototype.getObservable.call(this, Report.create({
                name: name,
                branding: brand.id,
                solr_query: config.solr_query,
                title: config.title,
                filter: config.filter,
                columns: config.columns
            }));
        };
        Reports.prototype.getResults = function (brand, name, req, start, rows) {
            var _this = this;
            if (name === void 0) { name = ''; }
            if (start === void 0) { start = 0; }
            if (rows === void 0) { rows = 10; }
            var reportObs = _super.prototype.getObservable.call(this, Report.findOne({
                key: brand.id + "_" + name
            }));
            return reportObs.flatMap(function (report) {
                var url = _this.addQueryParams(sails.config.record.baseUrl.redbox + sails.config.record.api.search.url, report);
                url = _this.addPaginationParams(url, start, rows);
                url = url + "&fq=metaMetadata_brandId:" + brand.id + "&wt=json";
                if (report.filter != null) {
                    if (report.filter.type == 'date-range') {
                        var fromDate = req.param("fromDate");
                        var toDate = req.param("toDate");
                        var searchProperty = report.filter.property;
                        var filterQuery = "&fq=" + searchProperty + ":[";
                        filterQuery = filterQuery + (fromDate == null ? "*" : fromDate);
                        filterQuery = filterQuery + " TO ";
                        filterQuery = filterQuery + (toDate == null ? "*" : toDate) + "]";
                        url = url + filterQuery;
                    }
                }
                var options = _this.getOptions(url);
                return Rx_1.Observable.fromPromise(request[sails.config.record.api.search.method](options));
            });
        };
        Reports.prototype.getCSVResult = function (brand, name, start, rows) {
            var _this = this;
            if (name === void 0) { name = ''; }
            if (start === void 0) { start = 0; }
            if (rows === void 0) { rows = 10; }
            var reportObs = _super.prototype.getObservable.call(this, Report.findOne({
                key: brand.id + "_" + name
            }));
            return reportObs.flatMap(function (report) {
                var url = _this.addQueryParams(sails.config.record.baseUrl.redbox + sails.config.record.api.search.url, report);
                url = _this.addPaginationParams(url, start, 1000000000);
                url = url + "&fq=metaMetadata_brandId:" + brand.id + "&wt=csv";
                var options = _this.getOptions(url, 'text/csv');
                return Rx_1.Observable.fromPromise(request[sails.config.record.api.search.method](options));
            });
        };
        Reports.prototype.addQueryParams = function (url, report) {
            url = url + "?q=" + report.solr_query + "&sort=date_object_modified desc&version=2.2&fl=";
            for (var i = 0; i < report.columns.length; i++) {
                var column = report.columns[i];
                url = url + column.property;
                if (i != report.columns.length - 1) {
                    url = url + ",";
                }
            }
            return url;
        };
        Reports.prototype.addPaginationParams = function (url, start, rows) {
            if (start === void 0) { start = 0; }
            url = url + "&start=" + start + "&rows=" + rows;
            return url;
        };
        Reports.prototype.getOptions = function (url, contentType) {
            if (contentType === void 0) { contentType = 'application/json; charset=utf-8'; }
            return { url: url, json: true, headers: { 'Authorization': "Bearer " + sails.config.redbox.apiKey, 'Content-Type': contentType } };
        };
        return Reports;
    }(services.Services.Core.Service));
    Services.Reports = Reports;
})(Services = exports.Services || (exports.Services = {}));
module.exports = new Services.Reports().exports();
