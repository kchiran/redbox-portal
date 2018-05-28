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
require("rxjs/add/operator/toPromise");
var request = require("request-promise");
var ejs = require("ejs");
var fs = require("graceful-fs");
var Services;
(function (Services) {
    var Email = (function (_super) {
        __extends(Email, _super);
        function Email() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'sendMessage',
                'buildFromTemplate',
                'sendTemplate'
            ];
            return _this;
        }
        Email.prototype.sendMessage = function (msgTo, msgBody, msgSubject, msgFrom, msgFormat) {
            if (msgSubject === void 0) { msgSubject = sails.config.emailnotification.defaults.subject; }
            if (msgFrom === void 0) { msgFrom = sails.config.emailnotification.defaults.from; }
            if (msgFormat === void 0) { msgFormat = sails.config.emailnotification.defaults.format; }
            if (!sails.config.emailnotification.settings.enabled) {
                sails.log.verbose("Received email notification request, but is disabled. Ignoring.");
                return { 'code': '200', 'msg': 'Email services disabled.' };
            }
            sails.log.verbose('Received email notification request. Processing.');
            var url = "" + sails.config.record.baseUrl.redbox + sails.config.emailnotification.api.send.url;
            var body = {
                "to": msgTo,
                "subject": msgSubject,
                "body": msgBody,
                "from": msgFrom,
                "format": msgFormat
            };
            sails.log.error("Body: ");
            sails.log.error(body);
            var options = { url: url, json: true, body: body, headers: { 'Authorization': "Bearer " + sails.config.redbox.apiKey, 'Content-Type': 'application/json; charset=utf-8' } };
            var response = Rx_1.Observable.fromPromise(request[sails.config.emailnotification.api.send.method](options)).catch(function (error) { return Rx_1.Observable.of("Error: " + error); });
            return response.map(function (result) {
                if (result['code'] != '200') {
                    sails.log.error("Unable to post message to message queue: " + result);
                    result['msg'] = 'Email unable to be submitted';
                }
                else {
                    sails.log.verbose('Message submitted to message queue successfully');
                    result['msg'] = 'Email sent!';
                }
                return result;
            });
        };
        Email.prototype.buildFromTemplate = function (template, data) {
            if (data === void 0) { data = {}; }
            var readFileAsObservable = Rx_1.Observable.bindNodeCallback(function (path, encoding, callback) { return fs.readFile(path, encoding, callback); });
            var res = {};
            var readTemplate = readFileAsObservable(sails.config.emailnotification.settings.templateDir + template + '.ejs', 'utf8');
            return readTemplate.map(function (buffer) {
                try {
                    var renderedTemplate = ejs.render((buffer || "").toString(), data, { cache: true, filename: template });
                }
                catch (e) {
                    sails.log.error("Unable to render template " + template + " with data: " + data);
                    res['status'] = 500;
                    res['body'] = 'Templating error.';
                    res['ex'] = e;
                    return res;
                }
                res['status'] = 200;
                res['body'] = renderedTemplate;
                return res;
            }, function (error) {
                sails.log.error("Unable to read template file for " + template);
                res['status'] = 500;
                res['body'] = 'Template read error.';
                res['ex'] = error;
                return res;
            });
        };
        Email.prototype.sendTemplate = function (to, subject, template, data) {
            var _this = this;
            sails.log.error("Inside Send Template");
            var buildResponse = this.buildFromTemplate(template, data);
            sails.log.error("buildResponse");
            buildResponse.subscribe(function (buildResult) {
                if (buildResult['status'] != 200) {
                    return buildResult;
                }
                else {
                    var sendResponse = _this.sendMessage(to, buildResult['body'], subject);
                    sendResponse.subscribe(function (sendResult) {
                        return sendResult;
                    });
                }
            });
        };
        return Email;
    }(services.Services.Core.Service));
    Services.Email = Email;
})(Services = exports.Services || (exports.Services = {}));
module.exports = new Services.Email().exports();
