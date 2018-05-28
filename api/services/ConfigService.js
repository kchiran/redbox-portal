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
var Services;
(function (Services) {
    var Config = (function (_super) {
        __extends(Config, _super);
        function Config() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'getBrand'
            ];
            return _this;
        }
        Config.prototype.getBrand = function (brandName, configBlock) {
            var configVal = sails.config[configBlock][brandName];
            if (_.isUndefined(configVal)) {
                brandName = sails.config.auth.defaultBrand;
                configVal = sails.config[configBlock][brandName];
            }
            return configVal;
        };
        return Config;
    }(services.Services.Core.Service));
    Services.Config = Config;
})(Services = exports.Services || (exports.Services = {}));
module.exports = new Services.Config().exports();
