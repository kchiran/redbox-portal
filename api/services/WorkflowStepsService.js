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
    var WorkflowSteps = (function (_super) {
        __extends(WorkflowSteps, _super);
        function WorkflowSteps() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'bootstrap',
                'create',
                'get',
                'getFirst',
                'getAllForRecordType'
            ];
            _this.bootstrap = function (recordTypes) {
                return _super.prototype.getObservable.call(_this, WorkflowStep.find())
                    .flatMap(function (workflows) {
                    if (_.isEmpty(workflows)) {
                        sails.log.verbose("Bootstrapping workflow definitions... ");
                        var wfSteps_1 = {};
                        _.forEach(recordTypes, function (recordType) {
                            sails.log.verbose("Processing recordType: " + recordType.name);
                            wfSteps_1[recordType.name] = [];
                            _.forOwn(sails.config.workflow[recordType.name], function (workflowConf, workflowName) {
                                if (workflowName != null) {
                                    sails.log.verbose("workflow step added to list: " + workflowName);
                                    wfSteps_1[recordType.name].push({ "recordType": recordType, "workflow": workflowName });
                                }
                            });
                        });
                        return Rx_1.Observable.of(wfSteps_1);
                    }
                    else {
                        return Rx_1.Observable.of(workflows);
                    }
                }).flatMap(function (wfSteps) {
                    sails.log.verbose("wfSteps: ");
                    sails.log.verbose(JSON.stringify(wfSteps));
                    if (_.isArray(wfSteps) && wfSteps[0]["config"] != null) {
                        sails.log.verbose("return as Observable of");
                        return Rx_1.Observable.from(wfSteps);
                    }
                    else {
                        var workflowSteps = [];
                        _.forOwn(wfSteps, function (workflowStepsObject, recordTypeName) {
                            _.forEach(workflowStepsObject, function (workflowStep) {
                                var workflowConf = sails.config.workflow[recordTypeName][workflowStep["workflow"]];
                                var obs = _this.create(workflowStep["recordType"], workflowStep["workflow"], workflowConf.config, workflowConf.starting == true);
                                workflowSteps.push(obs);
                            });
                        });
                        return Rx_1.Observable.zip.apply(Rx_1.Observable, workflowSteps);
                    }
                });
            };
            return _this;
        }
        WorkflowSteps.prototype.create = function (recordType, name, workflowConf, starting) {
            return _super.prototype.getObservable.call(this, WorkflowStep.create({
                name: name,
                config: workflowConf,
                recordType: recordType.id,
                starting: starting
            }));
        };
        WorkflowSteps.prototype.get = function (recordType, name) {
            return _super.prototype.getObservable.call(this, WorkflowStep.findOne({ recordType: recordType.id, name: name }));
        };
        WorkflowSteps.prototype.getAllForRecordType = function (recordType) {
            return _super.prototype.getObservable.call(this, WorkflowStep.find({ recordType: recordType.id }));
        };
        WorkflowSteps.prototype.getFirst = function (recordType) {
            return _super.prototype.getObservable.call(this, WorkflowStep.findOne({ recordType: recordType.id, starting: true }));
        };
        return WorkflowSteps;
    }(services.Services.Core.Service));
    Services.WorkflowSteps = WorkflowSteps;
})(Services = exports.Services || (exports.Services = {}));
module.exports = new Services.WorkflowSteps().exports();
