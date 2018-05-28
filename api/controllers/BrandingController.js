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
var skipperGridFs = require("skipper-gridfs");
require("rxjs/add/operator/toPromise");
var Controllers;
(function (Controllers) {
    var Branding = (function (_super) {
        __extends(Branding, _super);
        function Branding() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.uriCreds = "" + sails.config.datastores.mongodb.user + (_.isEmpty(sails.config.datastores.mongodb.password) ? '' : ":" + sails.config.datastores.mongodb.password);
            _this.uriHost = "" + sails.config.datastores.mongodb.host + (_.isNull(sails.config.datastores.mongodb.port) ? '' : ":" + sails.config.datastores.mongodb.port);
            _this.mongoUri = "mongodb://" + (_.isEmpty(_this.uriCreds) ? '' : _this.uriCreds + "@") + _this.uriHost + "/" + sails.config.datastores.mongodb.database;
            _this.blobAdapter = skipperGridFs({
                uri: _this.mongoUri
            });
            _this._exportedMethods = [
                'renderCss',
                'renderImage',
                'renderApiB',
                'renderSwaggerJSON',
                'renderSwaggerYAML'
            ];
            return _this;
        }
        Branding.prototype.renderCss = function (req, res) {
            BrandingConfig.findOne({
                "name": req.param('branding')
            }).exec(function (err, theme) {
                res.set('Content-Type', 'text/css');
                if (theme != null) {
                    return res.send(theme['css']);
                }
                else {
                    return res.send("/* Using the default theme */");
                }
            });
        };
        Branding.prototype.renderApiB = function (req, res) {
            res.contentType('text/plain');
            return this.sendView(req, res, "apidocsapib", { layout: false });
        };
        Branding.prototype.renderSwaggerJSON = function (req, res) {
            res.contentType('application/json');
            return this.sendView(req, res, "apidocsswaggerjson", { layout: false });
        };
        Branding.prototype.renderSwaggerYAML = function (req, res) {
            res.contentType('application/x-yaml');
            return this.sendView(req, res, "apidocsswaggeryaml", { layout: false });
        };
        Branding.prototype.renderImage = function (req, res) {
            var fd = req.param("branding") + "/logo.png";
            this.blobAdapter.read(fd, function (error, file) {
                if (error) {
                    res.sendFile(sails.config.appPath + "/assets/images/logo.png");
                }
                else {
                    res.contentType('image/png');
                    res.send(new Buffer(file));
                }
            });
        };
        return Branding;
    }(controller.Controllers.Core.Controller));
    Controllers.Branding = Branding;
})(Controllers = exports.Controllers || (exports.Controllers = {}));
module.exports = new Controllers.Branding().exports();
