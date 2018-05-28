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
var i18next = require("i18next");
var Backend = require("i18next-sync-fs-backend");
var Services;
(function (Services) {
    var Translation = (function (_super) {
        __extends(Translation, _super);
        function Translation() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'bootstrap',
                't'
            ];
            return _this;
        }
        Translation.prototype.bootstrap = function () {
            i18next
                .use(Backend)
                .init({
                preload: ['en'],
                debug: true,
                lng: 'en',
                fallbackLng: 'en',
                initImmediate: false,
                backend: {
                    loadPath: sails.config.appPath + "/assets/locales/{{lng}}/{{ns}}.json"
                }
            });
        };
        Translation.prototype.t = function (key, context) {
            if (context === void 0) { context = null; }
            return i18next.t(key);
        };
        return Translation;
    }(services.Services.Core.Service));
    Services.Translation = Translation;
})(Services = exports.Services || (exports.Services = {}));
module.exports = new Services.Translation().exports();
