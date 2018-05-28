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
var Services;
(function (Services) {
    var Branding = (function (_super) {
        __extends(Branding, _super);
        function Branding() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'bootstrap',
                'loadAvailableBrands',
                'getDefault',
                'getBrand',
                'getAvailable',
                'getBrandAndPortalPath',
                'getBrandFromReq',
                'getPortalFromReq',
                'getFullPath'
            ];
            _this.availableBrandings = [];
            _this.brandings = [];
            _this.dBrand = { name: 'default' };
            _this.bootstrap = function () {
                return _super.prototype.getObservable.call(_this, BrandingConfig.findOne(_this.dBrand))
                    .flatMap(function (defaultBrand) {
                    if (_.isEmpty(defaultBrand)) {
                        sails.log.verbose("Default brand doesn't exist, creating...");
                        return _super.prototype.getObservable.call(_this, BrandingConfig.create(_this.dBrand));
                    }
                    sails.log.verbose("Default brand already exists...");
                    return Rx_1.Observable.of(defaultBrand);
                })
                    .flatMap(_this.loadAvailableBrands);
            };
            _this.loadAvailableBrands = function (defBrand) {
                sails.log.verbose("Loading available brands......");
                return _super.prototype.getObservable.call(_this, BrandingConfig.find({}).populate('roles'))
                    .flatMap(function (brands) {
                    _this.brandings = brands;
                    _this.availableBrandings = _.map(_this.brandings, 'name');
                    var defBrandEntry = _this.getDefault();
                    if (defBrandEntry == null) {
                        sails.log.error("Failed to load default brand!");
                        return Rx_1.Observable.throw(new Error("Failed to load default brand!"));
                    }
                    return Rx_1.Observable.of(defBrandEntry);
                });
            };
            _this.getDefault = function () {
                return _.find(_this.brandings, function (o) { return o.name == _this.dBrand.name; });
            };
            _this.getBrand = function (name) {
                return _.find(_this.brandings, function (o) { return o.name == name; });
            };
            _this.getAvailable = function () {
                return _this.availableBrandings;
            };
            return _this;
        }
        Branding.prototype.getBrandAndPortalPath = function (req) {
            var branding = this.getBrandFromReq(req);
            var portal = this.getPortalFromReq(req);
            var path = "/" + branding + "/" + portal;
            return path;
        };
        Branding.prototype.getFullPath = function (req) {
            return sails.config.appUrl + this.getBrandAndPortalPath(req);
        };
        Branding.prototype.getBrandFromReq = function (req) {
            var branding = req.params['branding'];
            if (branding == null) {
                if (req.body != null) {
                    branding = req.body.branding;
                }
            }
            if (branding == null) {
                if (req.session != null) {
                    branding = req.session.branding;
                }
            }
            if (branding == null) {
                branding = sails.config.auth.defaultBrand;
            }
            return branding;
        };
        Branding.prototype.getPortalFromReq = function (req) {
            var portal = req.params['portal'];
            if (portal == null) {
                if (req.body != null) {
                    portal = req.body.portal;
                }
            }
            if (portal == null) {
                if (req.session != null) {
                    portal = req.session.portal;
                }
            }
            if (portal == null) {
                portal = sails.config.auth.defaultPortal;
            }
            return portal;
        };
        return Branding;
    }(services.Services.Core.Service));
    Services.Branding = Branding;
})(Services = exports.Services || (exports.Services = {}));
module.exports = new Services.Branding().exports();
