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
    var Email = (function (_super) {
        __extends(Email, _super);
        function Email() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'sendNotification'
            ];
            return _this;
        }
        Email.prototype.sendNotification = function (req, res) {
            var _this = this;
            if (!req.body.to) {
                sails.log.error("No email recipient in email notification request!");
                return;
            }
            if (!req.body.template) {
                sails.log.error("No template specified in email notification request!");
                return;
            }
            var to = req.body.to;
            var template = req.body.template;
            var subject;
            if (req.body.subject) {
                subject = req.body.subject;
            }
            else {
                subject = sails.config.emailnotification.templates[template].subject;
            }
            var data = {};
            if (req.body.data) {
                data = req.body.data;
            }
            var buildResponse = EmailService.buildFromTemplate(template, data);
            buildResponse.subscribe(function (buildResult) {
                if (buildResult['status'] != 200) {
                    _this.ajaxFail(req, res, buildResult['msg']);
                }
                else {
                    var sendResponse = EmailService.sendMessage(to, buildResult['body'], subject);
                    sendResponse.subscribe(function (sendResult) {
                        if (sendResult['code'] != 200) {
                            _this.ajaxFail(req, res, sendResult['msg']);
                        }
                        else {
                            _this.ajaxOk(req, res, sendResult['msg']);
                        }
                    });
                }
            });
        };
        return Email;
    }(controller.Controllers.Core.Controller));
    Controllers.Email = Email;
})(Controllers = exports.Controllers || (exports.Controllers = {}));
module.exports = new Controllers.Email().exports();
