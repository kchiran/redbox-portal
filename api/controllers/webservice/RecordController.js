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
var controller = require("../../core/CoreController.js");
var Controllers;
(function (Controllers) {
    var Record = (function (_super) {
        __extends(Record, _super);
        function Record() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'create',
                'updateMeta',
                'getMeta',
                'addUserEdit',
                'removeUserEdit',
                'addUserView',
                'removeUserView',
                'getPermissions'
            ];
            return _this;
        }
        Record.prototype.bootstrap = function () {
        };
        Record.prototype.getPermissions = function (req, res) {
            var brand = BrandingService.getBrand(req.session.branding);
            var oid = req.param('oid');
            RecordsService.getMeta(oid).subscribe(function (record) {
                return res.json(record["authorization"]);
            });
        };
        Record.prototype.addUserEdit = function (req, res) {
            var brand = BrandingService.getBrand(req.session.branding);
            var oid = req.param('oid');
            var body = req.body;
            var users = body["users"];
            var pendingUsers = body["pendingUsers"];
            RecordsService.getMeta(oid).subscribe(function (record) {
                if (users != null && users.length > 0) {
                    record["authorization"]["edit"] = _.union(record["authorization"]["edit"], users);
                }
                if (pendingUsers != null && pendingUsers.length > 0) {
                    record["authorization"]["editPending"] = _.union(record["authorization"]["editPending"], pendingUsers);
                }
                var obs = RecordsService.updateMeta(brand, oid, record);
                obs.subscribe(function (result) {
                    if (result["code"] == 200) {
                        RecordsService.getMeta(result["oid"]).subscribe(function (record) {
                            return res.json(record["authorization"]);
                        });
                    }
                    else {
                        return res.json(result);
                    }
                });
            });
        };
        Record.prototype.addUserView = function (req, res) {
            var brand = BrandingService.getBrand(req.session.branding);
            var oid = req.param('oid');
            var body = req.body;
            var users = body["users"];
            var pendingUsers = body["pendingUsers"];
            RecordsService.getMeta(oid).subscribe(function (record) {
                if (users != null && users.length > 0) {
                    record["authorization"]["view"] = _.union(record["authorization"]["view"], users);
                }
                if (pendingUsers != null && pendingUsers.length > 0) {
                    record["authorization"]["viewPending"] = _.union(record["authorization"]["viewPending"], pendingUsers);
                }
                var obs = RecordsService.updateMeta(brand, oid, record);
                obs.subscribe(function (result) {
                    if (result["code"] == 200) {
                        RecordsService.getMeta(result["oid"]).subscribe(function (record) {
                            return res.json(record["authorization"]);
                        });
                    }
                    else {
                        return res.json(result);
                    }
                });
            });
        };
        Record.prototype.removeUserEdit = function (req, res) {
            var brand = BrandingService.getBrand(req.session.branding);
            var oid = req.param('oid');
            var body = req.body;
            var users = body["users"];
            var pendingUsers = body["pendingUsers"];
            RecordsService.getMeta(oid).subscribe(function (record) {
                if (users != null && users.length > 0) {
                    record["authorization"]["edit"] = _.difference(record["authorization"]["edit"], users);
                }
                if (pendingUsers != null && pendingUsers.length > 0) {
                    record["authorization"]["editPending"] = _.difference(record["authorization"]["editPending"], pendingUsers);
                }
                var obs = RecordsService.updateMeta(brand, oid, record);
                obs.subscribe(function (result) {
                    if (result["code"] == 200) {
                        RecordsService.getMeta(result["oid"]).subscribe(function (record) {
                            return res.json(record["authorization"]);
                        });
                    }
                    else {
                        return res.json(result);
                    }
                });
            });
        };
        Record.prototype.removeUserView = function (req, res) {
            var brand = BrandingService.getBrand(req.session.branding);
            var oid = req.param('oid');
            var body = req.body;
            var users = body["users"];
            var pendingUsers = body["pendingUsers"];
            RecordsService.getMeta(oid).subscribe(function (record) {
                if (users != null && users.length > 0) {
                    record["authorization"]["view"] = _.difference(record["authorization"]["view"], users);
                }
                if (pendingUsers != null && pendingUsers.length > 0) {
                    record["authorization"]["viewPending"] = _.difference(record["authorization"]["viewPending"], pendingUsers);
                }
                var obs = RecordsService.updateMeta(brand, oid, record);
                obs.subscribe(function (result) {
                    if (result["code"] == 200) {
                        RecordsService.getMeta(result["oid"]).subscribe(function (record) {
                            return res.json(record["authorization"]);
                        });
                    }
                    else {
                        return res.json(result);
                    }
                });
            });
        };
        Record.prototype.getMeta = function (req, res) {
            var brand = BrandingService.getBrand(req.session.branding);
            var oid = req.param('oid');
            RecordsService.getMeta(oid).subscribe(function (record) {
                return res.json(record["metadata"]);
            });
        };
        Record.prototype.updateMeta = function (req, res) {
            var brand = BrandingService.getBrand(req.session.branding);
            var oid = req.param('oid');
            RecordsService.getMeta(oid).subscribe(function (record) {
                record["metadata"] = req.body;
                var obs = RecordsService.updateMeta(brand, oid, record);
                obs.subscribe(function (result) {
                    return res.json(result);
                });
            });
        };
        Record.prototype.create = function (req, res) {
            var brand = BrandingService.getBrand(req.session.branding);
            var recordType = req.param('recordType');
            var body = req.body;
            if (body != null) {
                var authorizationEdit, authorizationView, authorizationEditPending, authorizationViewPending;
                if (body["authorization"] != null) {
                    authorizationEdit = body["authorization"]["edit"];
                    authorizationView = body["authorization"]["view"];
                    authorizationEditPending = body["authorization"]["editPending"];
                    authorizationViewPending = body["authorization"]["viewPending"];
                }
                else {
                    body["authorization"] = [];
                    authorizationEdit = [];
                    authorizationView = [];
                    authorizationEdit.push(req.user.username);
                    authorizationView.push(req.user.username);
                }
                var recordTypeObservable = RecordTypesService.get(brand, recordType);
                recordTypeObservable.subscribe(function (recordTypeModel) {
                    if (recordTypeModel) {
                        var metadata = body["metadata"];
                        var workflowStage = body["workflowStage"];
                        var request = {};
                        var metaMetadata = {};
                        metaMetadata["brandId"] = brand.id;
                        metaMetadata["type"] = recordTypeModel.name;
                        metaMetadata["createdBy"] = "admin";
                        request["metaMetadata"] = metaMetadata;
                        if (metadata == null) {
                            request["metadata"] = body;
                        }
                        else {
                            request["metadata"] = metadata;
                        }
                        var workflowStepsObs = WorkflowStepsService.getAllForRecordType(recordTypeModel);
                        workflowStepsObs.subscribe(function (workflowSteps) {
                            _.each(workflowSteps, function (workflowStep) {
                                if (workflowStage == null) {
                                    if (workflowStep["starting"] == true) {
                                        request["workflow"] = workflowStep["config"]["workflow"];
                                        request["authorization"] = workflowStep["config"]["authorization"];
                                        request["authorization"]["view"] = authorizationView;
                                        request["authorization"]["edit"] = authorizationEdit;
                                        request["authorization"]["viewPending"] = authorizationViewPending;
                                        request["authorization"]["editPending"] = authorizationEditPending;
                                        metaMetadata["form"] = workflowStep["config"]["form"];
                                    }
                                }
                                else {
                                    if (workflowStep["name"] == workflowStage) {
                                        request["workflow"] = workflowStep["config"]["workflow"];
                                        request["authorization"] = workflowStep["config"]["authorization"];
                                        request["authorization"]["view"] = authorizationView;
                                        request["authorization"]["edit"] = authorizationEdit;
                                        request["authorization"]["viewPending"] = authorizationViewPending;
                                        request["authorization"]["editPending"] = authorizationEditPending;
                                        metaMetadata["form"] = workflowStep["config"]["form"];
                                    }
                                }
                            });
                            var obs = RecordsService.create(brand, request, recordTypeModel.packageType);
                            obs.subscribe(function (result) {
                                if (result["code"] == "200") {
                                    result["code"] = 201;
                                    res.set('Location', sails.config.appUrl + BrandingService.getBrandAndPortalPath(req) + "/api/records/metadata/" + result["oid"]);
                                }
                                return res.status(201).json(result);
                            });
                        });
                    }
                    else {
                        return res.status(400).json({ message: "Record Type provided is not valid" });
                    }
                });
            }
        };
        return Record;
    }(controller.Controllers.Core.Controller));
    Controllers.Record = Record;
})(Controllers = exports.Controllers || (exports.Controllers = {}));
module.exports = new Controllers.Record().exports();
