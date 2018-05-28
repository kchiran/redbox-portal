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
    var RenderView = (function (_super) {
        __extends(RenderView, _super);
        function RenderView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'render'
            ];
            return _this;
        }
        RenderView.prototype.render = function (req, res) {
            var view = req.options.locals.view;
            if (view != null) {
                this.sendView(req, res, view);
            }
            else {
                res.notFound(req.options.locals, "404");
            }
        };
        return RenderView;
    }(controller.Controllers.Core.Controller));
    Controllers.RenderView = RenderView;
})(Controllers = exports.Controllers || (exports.Controllers = {}));
module.exports = new Controllers.RenderView().exports();
