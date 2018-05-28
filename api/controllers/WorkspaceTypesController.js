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
var skipperGridFs = require("skipper-gridfs");
var controller = require("../core/CoreController.js");
var Controllers;
(function (Controllers) {
    var WorkspaceTypes = (function (_super) {
        __extends(WorkspaceTypes, _super);
        function WorkspaceTypes() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.uriCreds = "" + sails.config.datastores.mongodb.user + (_.isEmpty(sails.config.datastores.mongodb.password) ? '' : ":" + sails.config.datastores.mongodb.password);
            _this.uriHost = "" + sails.config.datastores.mongodb.host + (_.isNull(sails.config.datastores.mongodb.port) ? '' : ":" + sails.config.datastores.mongodb.port);
            _this.mongoUri = "mongodb://" + (_.isEmpty(_this.uriCreds) ? '' : _this.uriCreds + "@") + _this.uriHost + "/" + sails.config.datastores.mongodb.database;
            _this.blobAdapter = skipperGridFs({
                uri: _this.mongoUri
            });
            _this._exportedMethods = [
                'get',
                'getOne',
                'uploadLogo',
                'renderImage'
            ];
            return _this;
        }
        WorkspaceTypes.prototype.bootstrap = function () {
        };
        WorkspaceTypes.prototype.get = function (req, res) {
            var _this = this;
            var brand = BrandingService.getBrand(req.session.branding);
            return WorkspaceTypesService.get(brand).subscribe(function (response) {
                var workspaceTypes = [];
                if (response) {
                    workspaceTypes = response.slice();
                }
                _this.ajaxOk(req, res, null, { status: true, workspaceTypes: workspaceTypes });
            }, function (error) {
                var errorMessage = 'Cannot get workspace types';
                _this.ajaxFail(req, res, error, errorMessage);
            });
        };
        WorkspaceTypes.prototype.getOne = function (req, res) {
            var _this = this;
            var name = req.param('name');
            var brand = BrandingService.getBrand(req.session.branding);
            return WorkspaceTypesService.getOne(brand, name)
                .subscribe(function (response) {
                var workspaceType = null;
                if (response) {
                    workspaceType = response;
                }
                _this.ajaxOk(req, res, null, { status: true, workspaceType: workspaceType });
            }, function (error) {
                var errorMessage = 'Cannot get workspace types';
                _this.ajaxFail(req, res, error, errorMessage);
            });
        };
        WorkspaceTypes.prototype.uploadLogo = function (req, res) {
            req.file('logo').upload({
                adapter: this.blobAdapter
            }, function (err, filesUploaded) {
                if (err)
                    this.ajaxFail(req, res, err);
                this.ajaxOk(req, res, null, { status: true });
            });
        };
        WorkspaceTypes.prototype.renderImage = function (req, res) {
            var _this = this;
            var type = req.param('workspaceType');
            var brand = BrandingService.getBrand(req.session.branding);
            return WorkspaceTypesService.getOne(brand, type).subscribe(function (response) {
                _this.blobAdapter.read(response.logo, function (error, file) {
                    if (error) {
                        res.sendFile(sails.config.appPath + "assets/images/logo.png");
                    }
                    else {
                        res.contentType('image/png');
                        res.send(new Buffer(file));
                    }
                });
            });
        };
        return WorkspaceTypes;
    }(controller.Controllers.Core.Controller));
    Controllers.WorkspaceTypes = WorkspaceTypes;
})(Controllers = exports.Controllers || (exports.Controllers = {}));
module.exports = new Controllers.WorkspaceTypes().exports();
