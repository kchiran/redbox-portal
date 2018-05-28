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
    var Asynch = (function (_super) {
        __extends(Asynch, _super);
        function Asynch() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'index',
                'start',
                'progress'
            ];
            return _this;
        }
        Asynch.prototype.index = function (req, res) {
            return this.sendView(req, res, 'asynch/index');
        };
        Asynch.prototype.start = function (req, res) {
            var _this = this;
            var procId = req.param("procId");
            var forceHarvest = req.query.force == "true";
            var brand = BrandingService.getBrand(req.session.branding);
            var username = req.user.username;
            switch (procId) {
                case "load_grid":
                    AsynchsService.start(brand.id, 'Load Institution Lookup data.', username)
                        .subscribe(function (progress) {
                        _this.ajaxOk(req, res, null, { status: 'Starting', progressId: progress.id }, true);
                        var progressId = progress.id;
                        VocabService.loadCollection('grid', progressId, forceHarvest).subscribe(function (prog) {
                            console.log("Asynch progress: ");
                            console.log(prog);
                        }, function (error) {
                            console.error("Asynch Error: ");
                            console.error(error);
                            AsynchsService.finish(progressId, { id: progressId, status: 'errored', message: error.message }).subscribe(function (finish) {
                                console.log("Asynch error update completed.");
                            });
                        });
                    });
                    break;
                default:
                    this.ajaxFail(req, res, null, { message: 'Invalid process id.' }, true);
                    break;
            }
        };
        Asynch.prototype.progress = function (req, res) {
        };
        return Asynch;
    }(controller.Controllers.Core.Controller));
    Controllers.Asynch = Asynch;
})(Controllers = exports.Controllers || (exports.Controllers = {}));
module.exports = new Controllers.Asynch().exports();
