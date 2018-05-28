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
    var DynamicAsset = (function (_super) {
        __extends(DynamicAsset, _super);
        function DynamicAsset() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'get'
            ];
            return _this;
        }
        DynamicAsset.prototype.get = function (req, res) {
            var assetId = req.param("asset");
            if (!assetId)
                assetId = 'apiClientConfig.json';
            sails.log.verbose("Geting asset: " + assetId);
            res.set('Content-Type', sails.config.dynamicasset[assetId].type);
            return res.view(sails.config.dynamicasset[assetId].view, { layout: false });
        };
        return DynamicAsset;
    }(controller.Controllers.Core.Controller));
    Controllers.DynamicAsset = DynamicAsset;
})(Controllers = exports.Controllers || (exports.Controllers = {}));
module.exports = new Controllers.DynamicAsset().exports();
