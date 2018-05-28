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
var moment_es6_1 = require("moment-es6");
var tus = require("tus-node-server");
var fs = require("fs");
var controller = require("../core/CoreController.js");
var Controllers;
(function (Controllers) {
    var Record = (function (_super) {
        __extends(Record, _super);
        function Record() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'edit',
                'getForm',
                'create',
                'update',
                'stepTo',
                'modifyEditors',
                'search',
                'getType',
                'getWorkflowSteps',
                'getMeta',
                'getTransferResponsibilityConfig',
                'updateResponsibilities',
                'doAttachment',
                'getAllTypes'
            ];
            return _this;
        }
        Record.prototype.bootstrap = function () {
        };
        Record.prototype.getMeta = function (req, res) {
            var _this = this;
            var brand = BrandingService.getBrand(req.session.branding);
            var oid = req.param('oid') ? req.param('oid') : '';
            var obs = RecordsService.getMeta(oid);
            return obs.subscribe(function (record) {
                _this.hasViewAccess(brand, req.user, record).subscribe(function (hasViewAccess) {
                    if (hasViewAccess) {
                        return res.json(record.metadata);
                    }
                    else {
                        return res.json({ status: "Access Denied" });
                    }
                });
            });
        };
        Record.prototype.edit = function (req, res) {
            var _this = this;
            var brand = BrandingService.getBrand(req.session.branding);
            var oid = req.param('oid') ? req.param('oid') : '';
            var recordType = req.param('recordType') ? req.param('recordType') : '';
            var rdmp = req.query.rdmp ? req.query.rdmp : '';
            var appSelector = 'dmp-form';
            var appName = 'dmp';
            sails.log.debug('RECORD::APP: ' + appName);
            if (recordType != '') {
                FormsService.getForm(brand.id, recordType, true).subscribe(function (form) {
                    if (form['customAngularApp'] != null) {
                        appSelector = form['customAngularApp']['appSelector'];
                        appName = form['customAngularApp']['appName'];
                    }
                    return _this.sendView(req, res, 'record/edit', { oid: oid, rdmp: rdmp, recordType: recordType, appSelector: appSelector, appName: appName });
                });
            }
            else {
                RecordsService.getMeta(oid).flatMap(function (record) {
                    var formName = record.metaMetadata.form;
                    return FormsService.getFormByName(formName, true);
                }).subscribe(function (form) {
                    sails.log.debug(form);
                    if (form['customAngularApp'] != null) {
                        appSelector = form['customAngularApp']['appSelector'];
                        appName = form['customAngularApp']['appName'];
                    }
                    return _this.sendView(req, res, 'record/edit', { oid: oid, rdmp: rdmp, recordType: recordType, appSelector: appSelector, appName: appName });
                });
            }
        };
        Record.prototype.hasEditAccess = function (brand, user, currentRec) {
            sails.log.verbose("Current Record: ");
            sails.log.verbose(currentRec);
            return Rx_1.Observable.of(RecordsService.hasEditAccess(brand, user, user.roles, currentRec));
        };
        Record.prototype.hasViewAccess = function (brand, user, currentRec) {
            sails.log.verbose("Current Record: ");
            sails.log.verbose(currentRec);
            return Rx_1.Observable.of(RecordsService.hasViewAccess(brand, user, user.roles, currentRec));
        };
        Record.prototype.getTransferResponsibilityConfig = function (req, res) {
            var brand = BrandingService.getBrand(req.session.branding);
            var type = req.param('type');
            var recordTypeConfig = sails.config.recordtype;
            return res.json(this.getTransferResponsibilityConfigObject(recordTypeConfig, type));
        };
        Record.prototype.getTransferResponsibilityConfigObject = function (config, type) {
            for (var key in config) {
                if (config[key]["packageType"] == type) {
                    return config[key]["transferResponsibility"];
                }
            }
            return {};
        };
        Record.prototype.updateResponsibilities = function (req, res) {
            var _this = this;
            var brand = BrandingService.getBrand(req.session.branding);
            var records = req.body.records;
            var role = req.body.role;
            var toEmail = req.body.email;
            var toName = req.body.name;
            sails.log.error("In update responsibilities");
            sails.log.error(req);
            var recordCtr = 0;
            if (records.length > 0) {
                _.forEach(records, function (rec) {
                    var oid = rec.oid;
                    _this.getRecord(oid).subscribe(function (record) {
                        var transferConfig = _this.getTransferResponsibilityConfigObject(sails.config.recordtype, 'rdmp');
                        var nameField = transferConfig.fields[role].fieldNames.name;
                        var emailField = transferConfig.fields[role].fieldNames.email;
                        _.set(record, "metadata." + nameField, toName);
                        _.set(record, "metadata." + emailField, toEmail);
                        if (role == "chiefInvestigator") {
                            nameField = transferConfig.fields["dataOwner"].fieldNames.name;
                            emailField = transferConfig.fields["dataOwner"].fieldNames.email;
                            _.set(record, "metadata." + nameField, toName);
                            _.set(record, "metadata." + emailField, toEmail);
                        }
                        if (role == "dataManager") {
                            _.set(record, "metadata.dataLicensingAccess_manager", toName);
                        }
                        RecordsService.updateMeta(brand, oid, record).subscribe(function (response) {
                            if (response && response.code == "200") {
                                recordCtr++;
                                var to = toEmail;
                                var subject = "Ownership transfered";
                                var data = {};
                                data['record'] = record;
                                data['name'] = toName;
                                data['oid'] = toName;
                                EmailService.sendTemplate(to, subject, "transferOwnerTo", data);
                                if (recordCtr == records.length) {
                                    response.success = true;
                                    _this.ajaxOk(req, res, null, response);
                                }
                            }
                            else {
                                sails.log.error("Failed to update authorization:");
                                sails.log.error(response);
                                _this.ajaxFail(req, res, TranslationService.t('auth-update-error'));
                            }
                        }, function (error) {
                            sails.log.error("Error updating auth:");
                            sails.log.error(error);
                            _this.ajaxFail(req, res, error.message);
                        });
                    });
                });
            }
            else {
                this.ajaxFail(req, res, 'No records specified');
            }
        };
        Record.prototype.getForm = function (req, res) {
            var _this = this;
            var brand = BrandingService.getBrand(req.session.branding);
            var name = req.param('name');
            var oid = req.param('oid');
            var editMode = req.query.edit == "true";
            var obs = null;
            if (_.isEmpty(oid)) {
                obs = FormsService.getForm(brand.id, name, editMode).flatMap(function (form) {
                    _this.mergeFields(req, res, form.fields, {});
                    return Rx_1.Observable.of(form);
                });
            }
            else {
                obs = RecordsService.getMeta(oid).flatMap(function (currentRec) {
                    if (_.isEmpty(currentRec)) {
                        return Rx_1.Observable.throw(new Error("Error, empty metadata for OID: " + oid));
                    }
                    if (editMode) {
                        return _this.hasEditAccess(brand, req.user, currentRec)
                            .flatMap(function (hasEditAccess) {
                            if (!hasEditAccess) {
                                return Rx_1.Observable.throw(new Error(TranslationService.t('edit-error-no-permissions')));
                            }
                            var formName = currentRec.metaMetadata.form;
                            return FormsService.getFormByName(formName, editMode).flatMap(function (form) {
                                if (_.isEmpty(form)) {
                                    return Rx_1.Observable.throw(new Error("Error, getting form " + formName + " for OID: " + oid));
                                }
                                _this.mergeFields(req, res, form.fields, currentRec.metadata);
                                return Rx_1.Observable.of(form);
                            });
                        });
                    }
                    else {
                        return _this.hasViewAccess(brand, req.user, currentRec)
                            .flatMap(function (hasViewAccess) {
                            if (!hasViewAccess) {
                                return Rx_1.Observable.throw(new Error(TranslationService.t('view-error-no-permissions')));
                            }
                            var formName = currentRec.metaMetadata.form;
                            return FormsService.getFormByName(formName, editMode).flatMap(function (form) {
                                if (_.isEmpty(form)) {
                                    return Rx_1.Observable.throw(new Error("Error, getting form " + formName + " for OID: " + oid));
                                }
                                _this.mergeFields(req, res, form.fields, currentRec.metadata);
                                return Rx_1.Observable.of(form);
                            });
                        });
                    }
                });
            }
            obs.subscribe(function (form) {
                if (!_.isEmpty(form)) {
                    _this.ajaxOk(req, res, null, form);
                }
                else {
                    _this.ajaxFail(req, res, null, { message: "Failed to get form with name:" + name });
                }
            }, function (error) {
                sails.log.error("Error getting form definition:");
                sails.log.error(error);
                var message = error.message;
                if (error.error && error.error.code == 500) {
                    message = TranslationService.t('missing-record');
                }
                _this.ajaxFail(req, res, message);
            });
        };
        Record.prototype.create = function (req, res) {
            var _this = this;
            var brand = BrandingService.getBrand(req.session.branding);
            var metadata = req.body;
            var record = { metaMetadata: {} };
            var recordType = req.param('recordType');
            record.authorization = { view: [req.user.username], edit: [req.user.username] };
            record.metaMetadata.brandId = brand.id;
            record.metaMetadata.createdBy = req.user.username;
            record.metaMetadata.type = recordType;
            record.metadata = metadata;
            RecordTypesService.get(brand, recordType).subscribe(function (recordType) {
                var packageType = recordType.packageType;
                WorkflowStepsService.getFirst(recordType)
                    .subscribe(function (wfStep) {
                    _this.updateWorkflowStep(record, wfStep);
                    RecordsService.create(brand, record, packageType).subscribe(function (response) {
                        if (response && response.code == "200") {
                            response.success = true;
                            _this.ajaxOk(req, res, null, response);
                        }
                        else {
                            _this.ajaxFail(req, res, null, response);
                        }
                    }, function (error) {
                        return Rx_1.Observable.throw("Failed to save record: " + error);
                    });
                }, function (error) {
                    _this.ajaxFail(req, res, "Failed to save record: " + error);
                });
            });
        };
        Record.prototype.update = function (req, res) {
            var _this = this;
            var brand = BrandingService.getBrand(req.session.branding);
            var metadata = req.body;
            var oid = req.param('oid');
            var user = req.user;
            var currentRec = null;
            var failedAttachments = [];
            this.getRecord(oid).flatMap(function (cr) {
                currentRec = cr;
                return _this.hasEditAccess(brand, user, currentRec);
            })
                .subscribe(function (hasEditAccess) {
                var origRecord = _.cloneDeep(currentRec);
                currentRec.metadata = metadata;
                return FormsService.getFormByName(currentRec.metaMetadata.form, true)
                    .flatMap(function (form) {
                    currentRec.metaMetadata.attachmentFields = form.attachmentFields;
                    return _this.updateMetadata(brand, oid, currentRec, user.username);
                })
                    .subscribe(function (response) {
                    if (response && response.code == "200") {
                        return _this.updateDataStream(oid, origRecord, metadata, response, req, res);
                    }
                    else {
                        _this.ajaxFail(req, res, null, response);
                    }
                }, function (error) {
                    sails.log.error("Error updating meta:");
                    sails.log.error(error);
                    _this.ajaxFail(req, res, error.message);
                });
            });
        };
        Record.prototype.updateDataStream = function (oid, origRecord, metadata, response, req, res) {
            var _this = this;
            var fileIdsAdded = [];
            RecordsService.updateDatastream(oid, origRecord, metadata, sails.config.record.attachments.stageDir, fileIdsAdded)
                .concatMap(function (reqs) {
                if (reqs) {
                    sails.log.verbose("Updating data streams...");
                    return Rx_1.Observable.from(reqs);
                }
                else {
                    sails.log.verbose("No datastreams to update...");
                    return Rx_1.Observable.of(null);
                }
            })
                .concatMap(function (promise) {
                if (promise) {
                    sails.log.verbose("Update datastream request is...");
                    sails.log.verbose(JSON.stringify(promise));
                    return promise.catch(function (e) {
                        sails.log.verbose("Error in updating stream::::");
                        sails.log.verbose(JSON.stringify(e));
                        return Rx_1.Observable.of(e);
                    });
                }
                else {
                    return Rx_1.Observable.of(null);
                }
            })
                .concatMap(function (updateResp) {
                if (updateResp) {
                    sails.log.verbose("Got response from update datastream request...");
                    sails.log.verbose(JSON.stringify(updateResp));
                }
                return Rx_1.Observable.of(updateResp);
            })
                .last()
                .subscribe(function (whatever) {
                sails.log.verbose("Done with updating streams and returning response...");
                response.success = true;
                _this.ajaxOk(req, res, null, response);
            }, function (error) {
                sails.log.error("Error updating datatreams:");
                sails.log.error(error);
                _this.ajaxFail(req, res, error.message);
            });
        };
        Record.prototype.saveMetadata = function (brand, oid, currentRec, metadata, user) {
            currentRec.metadata = metadata;
            return this.updateMetadata(brand, oid, currentRec, user.username);
        };
        Record.prototype.saveAuthorization = function (brand, oid, currentRec, authorization, user) {
            var _this = this;
            return this.hasEditAccess(brand, user, currentRec)
                .flatMap(function (hasEditAccess) {
                currentRec.authorization = authorization;
                return _this.updateAuthorization(brand, oid, currentRec, user.username);
            });
        };
        Record.prototype.updateWorkflowStep = function (currentRec, nextStep) {
            if (!_.isEmpty(nextStep)) {
                currentRec.workflow = nextStep.config.workflow;
                currentRec.metaMetadata.form = nextStep.config.form;
                if (sails.config.jsonld.addJsonLdContext) {
                    currentRec.metadata['@context'] = sails.config.jsonld.contexts[currentRec.metaMetadata.form];
                }
                currentRec.authorization.viewRoles = nextStep.config.authorization.viewRoles;
                currentRec.authorization.editRoles = nextStep.config.authorization.editRoles;
            }
        };
        Record.prototype.getRecord = function (oid) {
            return RecordsService.getMeta(oid).flatMap(function (currentRec) {
                if (_.isEmpty(currentRec)) {
                    return Rx_1.Observable.throw(new Error("Failed to update meta, cannot find existing record with oid: " + oid));
                }
                return Rx_1.Observable.of(currentRec);
            });
        };
        Record.prototype.updateMetadata = function (brand, oid, currentRec, username) {
            if (currentRec.metaMetadata.brandId != brand.id) {
                return Rx_1.Observable.throw(new Error("Failed to update meta, brand's don't match: " + currentRec.metaMetadata.brandId + " != " + brand.id + ", with oid: " + oid));
            }
            currentRec.metaMetadata.lastSavedBy = username;
            currentRec.metaMetadata.lastSaveDate = moment_es6_1.default().format();
            sails.log.verbose("Calling record service...");
            sails.log.verbose(currentRec);
            return RecordsService.updateMeta(brand, oid, currentRec);
        };
        Record.prototype.updateAuthorization = function (brand, oid, currentRec, username) {
            if (currentRec.metaMetadata.brandId != brand.id) {
                return Rx_1.Observable.throw(new Error("Failed to update meta, brand's don't match: " + currentRec.metaMetadata.brandId + " != " + brand.id + ", with oid: " + oid));
            }
            return RecordsService.updateMeta(brand, oid, currentRec);
        };
        Record.prototype.stepTo = function (req, res) {
            var _this = this;
            var brand = BrandingService.getBrand(req.session.branding);
            var metadata = req.body;
            var oid = req.param('oid');
            var targetStep = req.param('targetStep');
            var origRecord = null;
            return this.getRecord(oid).flatMap(function (currentRec) {
                origRecord = _.cloneDeep(currentRec);
                return _this.hasEditAccess(brand, req.user, currentRec)
                    .flatMap(function (hasEditAccess) {
                    if (!hasEditAccess) {
                        return Rx_1.Observable.throw(new Error(TranslationService.t('edit-error-no-permissions')));
                    }
                    return WorkflowStepsService.get(brand, targetStep)
                        .flatMap(function (nextStep) {
                        currentRec.metadata = metadata;
                        sails.log.verbose("Current rec:");
                        sails.log.verbose(currentRec);
                        sails.log.verbose("Next step:");
                        sails.log.verbose(nextStep);
                        _this.updateWorkflowStep(currentRec, nextStep);
                        return _this.updateMetadata(brand, oid, currentRec, req.user.username);
                    });
                });
            })
                .subscribe(function (response) {
                if (response && response.code == "200") {
                    response.success = true;
                    _this.ajaxOk(req, res, null, response);
                    return _this.updateDataStream(oid, origRecord, metadata, response, req, res);
                }
                else {
                    _this.ajaxFail(req, res, null, response);
                }
            }, function (error) {
                sails.log.error("Error updating meta:");
                sails.log.error(error);
                _this.ajaxFail(req, res, error.message);
            });
        };
        Record.prototype.mergeFields = function (req, res, fields, metadata) {
            var _this = this;
            _.forEach(fields, function (field) {
                if (_.has(metadata, field.definition.name)) {
                    field.definition.value = metadata[field.definition.name];
                }
                _this.replaceCustomFields(req, res, field, metadata);
                var val = field.definition.value;
                if (field.definition.fields && _.isObject(val) && !_.isString(val) && !_.isUndefined(val) && !_.isNull(val) && !_.isEmpty(val)) {
                    _.each(field.definition.fields, function (fld) {
                        fld.definition.value = _.get(metadata, field.definition.name + "." + fld.definition.name);
                    });
                }
                else if (field.definition.fields) {
                    _this.mergeFields(req, res, field.definition.fields, metadata);
                }
            });
        };
        Record.prototype.replaceCustomFields = function (req, res, field, metadata) {
            var variableSubstitutionFields = field.variableSubstitutionFields;
            if (!_.isEmpty(variableSubstitutionFields)) {
                _.forEach(variableSubstitutionFields, function (fieldName) {
                    _.forOwn(sails.config.record.customFields, function (customConfig, customKey) {
                        if (!_.isEmpty(field.definition[fieldName]) && _.isString(field.definition[fieldName]) && field.definition[fieldName].indexOf(customKey) != -1) {
                            var replacement = null;
                            if (customConfig.source == 'request') {
                                switch (customConfig.type) {
                                    case 'session':
                                        replacement = req.session[customConfig.field];
                                        break;
                                    case 'param':
                                        replacement = req.param(customConfig.field);
                                        break;
                                }
                            }
                            if (!_.isEmpty(replacement)) {
                                field.definition[fieldName] = field.definition[fieldName].replace(customKey, replacement);
                            }
                        }
                    });
                });
            }
        };
        Record.prototype.modifyEditors = function (req, res) {
            var _this = this;
            var records = req.body.records;
            var toUsername = req.body.username;
            var toEmail = req.body.email;
            var fromUsername = req.user.username;
            var brand = BrandingService.getBrand(req.session.branding);
            var user = req.user;
            var recordCtr = 0;
            if (records.length > 0) {
                _.forEach(records, function (rec) {
                    var oid = rec.oid;
                    _this.getRecord(oid).subscribe(function (record) {
                        var authorization = _.cloneDeep(record.authorization);
                        _.remove(authorization.edit, function (username) {
                            return username == fromUsername;
                        });
                        if (_.isUndefined(_.find(authorization.view, function (username) { return username == fromUsername; }))) {
                            authorization.view.push(fromUsername);
                        }
                        if (!_.isEmpty(toUsername)) {
                            if (_.isUndefined(_.find(authorization.edit, function (username) { return username == toUsername; }))) {
                                authorization.edit.push(toUsername);
                            }
                        }
                        else {
                            if (_.isUndefined(_.find(authorization.editPending, function (email) { return toEmail == email; }))) {
                                if (_.isUndefined(authorization.editPending)) {
                                    authorization.editPending = [];
                                }
                                authorization.editPending.push(toEmail);
                            }
                        }
                        _this.saveAuthorization(brand, oid, record, authorization, user).subscribe(function (response) {
                            if (response && response.code == "200") {
                                recordCtr++;
                                if (recordCtr == records.length) {
                                    response.success = true;
                                    _this.ajaxOk(req, res, null, response);
                                }
                            }
                            else {
                                sails.log.error("Failed to update authorization:");
                                sails.log.error(response);
                                _this.ajaxFail(req, res, TranslationService.t('auth-update-error'));
                            }
                        }, function (error) {
                            sails.log.error("Error updating auth:");
                            sails.log.error(error);
                            _this.ajaxFail(req, res, error.message);
                        });
                    });
                });
            }
            else {
                this.ajaxFail(req, res, 'No records specified');
            }
        };
        Record.prototype.search = function (req, res) {
            var _this = this;
            var brand = BrandingService.getBrand(req.session.branding);
            var type = req.param('type');
            var workflow = req.query.workflow;
            var searchString = req.query.searchStr;
            var exactSearchNames = _.isEmpty(req.query.exactNames) ? [] : req.query.exactNames.split(',');
            var exactSearches = [];
            var facetSearchNames = _.isEmpty(req.query.facetNames) ? [] : req.query.facetNames.split(',');
            var facetSearches = [];
            _.forEach(exactSearchNames, function (exactSearch) {
                exactSearches.push({ name: exactSearch, value: req.query["exact_" + exactSearch] });
            });
            _.forEach(facetSearchNames, function (facetSearch) {
                facetSearches.push({ name: facetSearch, value: req.query["facet_" + facetSearch] });
            });
            RecordsService.searchFuzzy(type, workflow, searchString, exactSearches, facetSearches, brand, req.user, req.user.roles, sails.config.record.search.returnFields)
                .subscribe(function (searchRes) {
                _this.ajaxOk(req, res, null, searchRes);
            }, function (error) {
                _this.ajaxFail(req, res, error.message);
            });
        };
        Record.prototype.getType = function (req, res) {
            var _this = this;
            var recordType = req.param('recordType');
            var brand = BrandingService.getBrand(req.session.branding);
            RecordTypesService.get(brand, recordType).subscribe(function (recordType) {
                _this.ajaxOk(req, res, null, recordType);
            }, function (error) {
                _this.ajaxFail(req, res, error.message);
            });
        };
        Record.prototype.getAllTypes = function (req, res) {
            var _this = this;
            var brand = BrandingService.getBrand(req.session.branding);
            RecordTypesService.getAll(brand).subscribe(function (recordTypes) {
                _this.ajaxOk(req, res, null, recordTypes);
            }, function (error) {
                _this.ajaxFail(req, res, error.message);
            });
        };
        Record.prototype.initTusServer = function () {
            if (!this.tusServer) {
                this.tusServer = new tus.Server();
                var targetDir = sails.config.record.attachments.stageDir;
                if (!fs.existsSync(targetDir)) {
                    fs.mkdirSync(targetDir);
                }
                this.tusServer.datastore = new tus.FileStore({
                    path: sails.config.record.attachments.path,
                    directory: targetDir
                });
                this.tusServer.on(tus.EVENTS.EVENT_UPLOAD_COMPLETE, function (event) {
                    sails.log.verbose("::: File uploaded to staging:");
                    sails.log.verbose(JSON.stringify(event));
                });
                this.tusServer.on(tus.EVENTS.EVENT_FILE_CREATED, function (event) {
                    sails.log.verbose("::: File created:");
                    sails.log.verbose(JSON.stringify(event));
                });
            }
        };
        Record.prototype.getTusMetadata = function (req, field) {
            var entries = {};
            _.each(req.headers['upload-metadata'].split(','), function (entry) {
                var elems = entry.split(' ');
                entries[elems[0]] = elems[1];
            });
            return Buffer.from(entries[field], 'base64').toString('ascii');
        };
        Record.prototype.doAttachment = function (req, res) {
            var _this = this;
            var brand = BrandingService.getBrand(req.session.branding);
            var oid = req.param('oid');
            var attachId = req.param('attachId');
            this.initTusServer();
            var method = _.toLower(req.method);
            if (method == 'post') {
                req.baseUrl = (sails.config.appPort ? ":" + sails.config.appPort : '') + "/" + req.session.branding + "/" + req.session.portal + "/record/" + oid;
            }
            else {
                req.baseUrl = '';
            }
            return this.getRecord(oid).flatMap(function (currentRec) {
                return _this.hasEditAccess(brand, req.user, currentRec).flatMap(function (hasEditAccess) {
                    if (!hasEditAccess) {
                        return Rx_1.Observable.throw(new Error(TranslationService.t('edit-error-no-permissions')));
                    }
                    if (method == 'get') {
                        var found_1 = null;
                        _.each(currentRec.metaMetadata.attachmentFields, function (attField) {
                            if (!found_1) {
                                var attFieldVal = currentRec.metadata[attField];
                                found_1 = _.find(attFieldVal, function (attVal) {
                                    return attVal.fileId == attachId;
                                });
                                if (found_1) {
                                    return false;
                                }
                            }
                        });
                        if (!found_1) {
                            return Rx_1.Observable.throw(new Error(TranslationService.t('attachment-not-found')));
                        }
                        res.set('Content-Type', found_1.mimeType);
                        res.set('Content-Disposition', "attachment; filename=\"" + found_1.name + "\"");
                        sails.log.verbose("Returning datastream observable of " + oid + ": " + found_1.name + ", attachId: " + attachId);
                        return RecordsService.getDatastream(oid, attachId).flatMap(function (response) {
                            res.end(Buffer.from(response.body), 'binary');
                            return Rx_1.Observable.of(oid);
                        });
                    }
                    else {
                        _this.tusServer.handle(req, res);
                        return Rx_1.Observable.of(oid);
                    }
                });
            })
                .subscribe(function (whatever) {
            }, function (error) {
                if (_this.isAjax(req)) {
                    _this.ajaxFail(req, res, error.message);
                }
                else {
                    if (error.message == TranslationService.t('edit-error-no-permissions')) {
                        res.forbidden();
                    }
                    else if (error.message == TranslationService.t('attachment-not-found')) {
                        res.notFound();
                    }
                }
            });
        };
        Record.prototype.getWorkflowSteps = function (req, res) {
            var _this = this;
            var recordType = req.param('recordType');
            var brand = BrandingService.getBrand(req.session.branding);
            return RecordTypesService.get(brand, recordType).subscribe(function (recordType) {
                return WorkflowStepsService.getAllForRecordType(recordType).subscribe(function (wfSteps) {
                    return _this.ajaxOk(req, res, null, wfSteps);
                });
            });
        };
        return Record;
    }(controller.Controllers.Core.Controller));
    Controllers.Record = Record;
})(Controllers = exports.Controllers || (exports.Controllers = {}));
module.exports = new Controllers.Record().exports();
