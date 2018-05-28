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
var NodeCache = require("node-cache");
var moment_es6_1 = require("moment-es6");
var Services;
(function (Services) {
    var Cache = (function (_super) {
        __extends(Cache, _super);
        function Cache() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'bootstrap',
                'get',
                'set'
            ];
            return _this;
        }
        Cache.prototype.bootstrap = function () {
            var cacheOpts = { stdTTL: sails.config.custom_cache.cacheExpiry, checkperiod: sails.config.custom_cache.checkPeriod ? sails.config.custom_cache.checkPeriod : 600 };
            sails.log.verbose("Using node cache options: ");
            sails.log.verbose(cacheOpts);
            this.cache = new NodeCache(cacheOpts);
        };
        Cache.prototype.get = function (name) {
            var _this = this;
            var cacheGet = Rx_1.Observable.bindNodeCallback(this.cache.get)(name);
            return cacheGet.flatMap(function (data) {
                if (data) {
                    return Rx_1.Observable.of(data);
                }
                else {
                    sails.log.verbose("Getting DB cache entry for name: " + name);
                    return _super.prototype.getObservable.call(_this, CacheEntry.findOne({ name: name })).flatMap(function (dbData) {
                        if (!_.isEmpty(dbData)) {
                            sails.log.verbose("Got DB cache entry");
                            if (moment_es6_1.default().unix() - dbData.ts_added > sails.config.custom_cache.cacheExpiry) {
                                sails.log.verbose("Cache entry for " + name + " has expired while on the DB, returning null...");
                                return Rx_1.Observable.of(null);
                            }
                            else {
                                _this.cache.set(name, dbData.data);
                                return Rx_1.Observable.of(dbData.data);
                            }
                        }
                        sails.log.verbose("No DB cache entry for: " + name);
                        return Rx_1.Observable.of(null);
                    });
                }
            });
        };
        Cache.prototype.set = function (name, data, expiry) {
            var _this = this;
            if (expiry === void 0) { expiry = sails.config.custom_cache.cacheExpiry; }
            sails.log.verbose("Setting cache for entry: " + name + "...");
            this.cache.set(name, data, expiry);
            _super.prototype.getObservable.call(this, CacheEntry.findOne({ name: name }))
                .flatMap(function (dbData) {
                if (!_.isEmpty(dbData)) {
                    sails.log.verbose("Updating entry name: " + name);
                    return _super.prototype.getObservable.call(_this, CacheEntry.update({ name: name }, { name: name, data: data, ts_added: moment_es6_1.default().unix() }));
                }
                else {
                    sails.log.verbose("Creating entry name: " + name);
                    return _super.prototype.getObservable.call(_this, CacheEntry.create({ name: name, data: data, ts_added: moment_es6_1.default().unix() }));
                }
            })
                .flatMap(function (dbData) {
                return Rx_1.Observable.of(dbData);
            })
                .subscribe(function (data) {
                sails.log.verbose("Saved local and remote cache for entry:" + name);
            }, function (error) {
                sails.log.error("Error updating cache for entry " + name + ":");
                sails.log.error(error);
            });
        };
        return Cache;
    }(services.Services.Core.Service));
    Services.Cache = Cache;
})(Services = exports.Services || (exports.Services = {}));
module.exports = new Services.Cache().exports();
