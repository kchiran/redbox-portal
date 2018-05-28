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
    var WorkspaceTypes = (function (_super) {
        __extends(WorkspaceTypes, _super);
        function WorkspaceTypes() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'bootstrap',
                'create',
                'get',
                'getOne'
            ];
            _this.bootstrap = function (defBrand) {
                return _super.prototype.getObservable.call(_this, WorkspaceType.find({ branding: defBrand.id })).flatMap(function (workspaceTypes) {
                    sails.log.debug('WorkspaceTypes::Bootstrap');
                    if (_.isEmpty(workspaceTypes) && !_.isEmpty(sails.config.workspacetype)) {
                        var wTypes = [];
                        sails.log.verbose("Bootstrapping workspace type definitions... ");
                        _.forOwn(sails.config.workspacetype, function (config, workspaceType) {
                            workspaceTypes.push(workspaceType);
                            var obs = _this.create(defBrand, config);
                            wTypes.push(obs);
                        });
                        return Rx_1.Observable.zip.apply(Rx_1.Observable, wTypes);
                    }
                    else {
                        sails.log.verbose("Default or no workspaceTypes definition(s).");
                        sails.log.verbose(workspaceTypes);
                        return Rx_1.Observable.of('');
                    }
                });
            };
            return _this;
        }
        WorkspaceTypes.prototype.create = function (brand, workspaceType) {
            return _super.prototype.getObservable.call(this, WorkspaceType.create({
                name: workspaceType['name'],
                label: workspaceType['label'],
                branding: brand.id,
                subtitle: workspaceType['subtitle'],
                description: workspaceType['description'],
                logo: workspaceType['logo']
            }));
        };
        WorkspaceTypes.prototype.get = function (brand) {
            return _super.prototype.getObservable.call(this, WorkspaceType.find({ branding: brand.id }));
        };
        WorkspaceTypes.prototype.getOne = function (brand, name) {
            return _super.prototype.getObservable.call(this, WorkspaceType.findOne({ branding: brand.id, name: name }));
        };
        return WorkspaceTypes;
    }(services.Services.Core.Service));
    Services.WorkspaceTypes = WorkspaceTypes;
})(Services = exports.Services || (exports.Services = {}));
module.exports = new Services.WorkspaceTypes().exports();
