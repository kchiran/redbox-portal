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
    var Forms = (function (_super) {
        __extends(Forms, _super);
        function Forms() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'bootstrap',
                'getForm',
                'flattenFields',
                'getFormByName'
            ];
            _this.bootstrap = function (workflowSteps) {
                if (!workflowSteps || workflowSteps.length == 0 || workflowSteps[0] == null) {
                    return Rx_1.Observable.of(null);
                }
                else {
                    return _super.prototype.getObservable.call(_this, Form.find({ workflowStep: workflowSteps[0].id })).flatMap(function (form) {
                        if (!form || form.length == 0) {
                            sails.log.verbose("Bootstrapping form definitions... ");
                            var formDefs_1 = [];
                            _.forOwn(sails.config.form.forms, function (formDef, formName) {
                                formDefs_1.push(formName);
                            });
                            return Rx_1.Observable.from(formDefs_1);
                        }
                        else {
                            return Rx_1.Observable.of(null);
                        }
                    })
                        .flatMap(function (formName) {
                        var formsObs = [];
                        if (formName) {
                            _.each(workflowSteps, function (workflowStep) {
                                if (workflowStep.config.form == formName) {
                                    var formObj = {
                                        name: formName,
                                        fields: sails.config.form.forms[formName].fields,
                                        workflowStep: workflowStep.id,
                                        type: sails.config.form.forms[formName].type,
                                        messages: sails.config.form.forms[formName].messages,
                                        viewCssClasses: sails.config.form.forms[formName].viewCssClasses,
                                        editCssClasses: sails.config.form.forms[formName].editCssClasses,
                                        skipValidationOnSave: sails.config.form.forms[formName].skipValidationOnSave,
                                        attachmentFields: sails.config.form.forms[formName].attachmentFields,
                                        customAngularApp: sails.config.form.forms[formName].customAngularApp || null
                                    };
                                    var q = Form.create(formObj);
                                    formsObs.push(Rx_1.Observable.bindCallback(q["exec"].bind(q))());
                                }
                            });
                        }
                        return Rx_1.Observable.zip.apply(Rx_1.Observable, formsObs);
                    })
                        .flatMap(function (result) {
                        if (result) {
                            sails.log.verbose("Created form record: ");
                            sails.log.verbose(result);
                            return Rx_1.Observable.from(result[0]);
                        }
                        return Rx_1.Observable.of(result);
                    }).flatMap(function (result) {
                        if (result) {
                            sails.log.verbose("Updating workflowstep " + result.workflowStep + " to: " + result.id);
                            var q = WorkflowStep.update({ id: result.workflowStep }).set({ form: result.id });
                            return Rx_1.Observable.bindCallback(q["exec"].bind(q))();
                        }
                        return Rx_1.Observable.of(null);
                    })
                        .last();
                }
            };
            _this.getFormByName = function (formName, editMode) {
                return _super.prototype.getObservable.call(_this, Form.findOne({ name: formName })).flatMap(function (form) {
                    if (form) {
                        _this.setFormEditMode(form.fields, editMode);
                        return Rx_1.Observable.of(form);
                    }
                    return Rx_1.Observable.of(null);
                });
            };
            _this.getForm = function (branding, recordType, editMode) {
                return _super.prototype.getObservable.call(_this, RecordType.findOne({ key: branding + "_" + recordType }))
                    .flatMap(function (recordType) {
                    return _super.prototype.getObservable.call(_this, WorkflowStep.findOne({ recordType: recordType.id }));
                }).flatMap(function (workflowStep) {
                    if (workflowStep.starting == true) {
                        return _super.prototype.getObservable.call(_this, Form.findOne({ name: workflowStep.config.form }));
                    }
                    return Rx_1.Observable.of(null);
                }).flatMap(function (form) {
                    if (form) {
                        _this.setFormEditMode(form.fields, editMode);
                        return Rx_1.Observable.of(form);
                    }
                    return Rx_1.Observable.of(null);
                }).filter(function (result) { return result !== null; }).last();
            };
            return _this;
        }
        Forms.prototype.setFormEditMode = function (fields, editMode) {
            var _this = this;
            _.remove(fields, function (field) {
                if (editMode) {
                    return field.viewOnly == true;
                }
                else {
                    return field.editOnly == true;
                }
            });
            _.forEach(fields, function (field) {
                field.definition.editMode = editMode;
                if (!_.isEmpty(field.definition.fields)) {
                    _this.setFormEditMode(field.definition.fields, editMode);
                }
            });
        };
        Forms.prototype.flattenFields = function (fields, fieldArr) {
            var _this = this;
            _.map(fields, function (f) {
                fieldArr.push(f);
                if (f.fields) {
                    _this.flattenFields(f.fields, fieldArr);
                }
            });
        };
        return Forms;
    }(services.Services.Core.Service));
    Services.Forms = Forms;
})(Services = exports.Services || (exports.Services = {}));
module.exports = new Services.Forms().exports();
