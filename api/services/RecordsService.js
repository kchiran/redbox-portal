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
var request = require("request-promise");
var luceneEscapeQuery = require("lucene-escape-query");
var fs = require("fs");
var util = require('util');
var Services;
(function (Services) {
    var Records = (function (_super) {
        __extends(Records, _super);
        function Records() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'create',
                'updateMeta',
                'getMeta',
                'hasEditAccess',
                'hasViewAccess',
                'getOne',
                'search',
                'createBatch',
                'provideUserAccessAndRemovePendingAccess',
                'searchFuzzy',
                'addDatastream',
                'removeDatastream',
                'updateDatastream',
                'getDatastream',
                'deleteFilesFromStageDir'
            ];
            return _this;
        }
        Records.prototype.create = function (brand, record, packageType, formName) {
            if (formName === void 0) { formName = sails.config.form.defaultForm; }
            var options = this.getOptions(sails.config.record.baseUrl.redbox + sails.config.record.api.create.url, null, packageType);
            options.body = record;
            sails.log.verbose(util.inspect(options, { showHidden: false, depth: null }));
            return Rx_1.Observable.fromPromise(request[sails.config.record.api.create.method](options));
        };
        Records.prototype.updateMeta = function (brand, oid, record) {
            var options = this.getOptions(sails.config.record.baseUrl.redbox + sails.config.record.api.updateMeta.url, oid);
            options.body = record;
            return Rx_1.Observable.fromPromise(request[sails.config.record.api.updateMeta.method](options));
        };
        Records.prototype.getMeta = function (oid) {
            var options = this.getOptions(sails.config.record.baseUrl.redbox + sails.config.record.api.getMeta.url, oid);
            return Rx_1.Observable.fromPromise(request[sails.config.record.api.getMeta.method](options));
        };
        Records.prototype.updateDatastream = function (oid, record, newMetadata, fileRoot, fileIdsAdded) {
            var _this = this;
            return FormsService.getFormByName(record.metaMetadata.form, true).flatMap(function (form) {
                var reqs = [];
                record.metaMetadata.attachmentFields = form.attachmentFields;
                _.each(form.attachmentFields, function (attField) {
                    var oldAttachments = record.metadata[attField];
                    var newAttachments = newMetadata[attField];
                    var removeIds = [];
                    if (!_.isUndefined(oldAttachments) && !_.isNull(oldAttachments) && !_.isNull(newAttachments)) {
                        var toRemove = _.differenceBy(oldAttachments, newAttachments, 'fileId');
                        _.each(toRemove, function (removeAtt) {
                            if (removeAtt.type == 'attachment') {
                                removeIds.push(removeAtt.fileId);
                            }
                        });
                    }
                    if (!_.isUndefined(newAttachments) && !_.isNull(newAttachments)) {
                        var toAdd = _.differenceBy(newAttachments, oldAttachments, 'fileId');
                        _.each(toAdd, function (addAtt) {
                            if (addAtt.type == 'attachment') {
                                fileIdsAdded.push(addAtt.fileId);
                            }
                        });
                    }
                    reqs.push(_this.addAndRemoveDatastreams(oid, fileIdsAdded, removeIds));
                });
                if (!_.isEmpty(reqs)) {
                    return Rx_1.Observable.of(reqs);
                }
                else {
                    return Rx_1.Observable.of(null);
                }
            });
        };
        Records.prototype.removeDatastream = function (oid, fileId) {
            var apiConfig = sails.config.record.api.removeDatastream;
            var opts = this.getOptions("" + sails.config.record.baseUrl.redbox + apiConfig.url, oid);
            opts.url = opts.url + "?skipReindex=true&datastreamId=" + fileId;
            return request[apiConfig.method](opts);
        };
        Records.prototype.addDatastream = function (oid, fileId) {
            var apiConfig = sails.config.record.api.addDatastream;
            var opts = this.getOptions("" + sails.config.record.baseUrl.redbox + apiConfig.url, oid);
            opts.url = opts.url + "?skipReindex=true&datastreamId=" + fileId;
            var fpath = sails.config.record.attachments.stageDir + "/" + fileId;
            opts['formData'] = {
                content: fs.createReadStream(fpath)
            };
            return request[apiConfig.method](opts);
        };
        Records.prototype.addAndRemoveDatastreams = function (oid, addIds, removeIds) {
            var apiConfig = sails.config.record.api.addAndRemoveDatastreams;
            var opts = this.getOptions("" + sails.config.record.baseUrl.redbox + apiConfig.url, oid);
            opts.url = opts.url + "?skipReindex=false";
            if (!_.isEmpty(removeIds)) {
                var removeDataStreamIds = removeIds.join(',');
                opts.url = opts.url + "&removePayloadIds=" + removeDataStreamIds;
            }
            if (!_.isEmpty(addIds)) {
                var formData_1 = {};
                _.each(addIds, function (fileId) {
                    var fpath = sails.config.record.attachments.stageDir + "/" + fileId;
                    formData_1[fileId] = fs.createReadStream(fpath);
                });
                opts['formData'] = formData_1;
            }
            return request[apiConfig.method](opts);
        };
        Records.prototype.addDatastreams = function (oid, fileIds) {
            var apiConfig = sails.config.record.api.addDatastreams;
            var opts = this.getOptions("" + sails.config.record.baseUrl.redbox + apiConfig.url, oid);
            opts.url = opts.url + "?skipReindex=false&datastreamIds=" + fileIds.join(',');
            var formData = {};
            _.each(fileIds, function (fileId) {
                var fpath = sails.config.record.attachments.stageDir + "/" + fileId;
                formData[fileId] = fs.createReadStream(fpath);
            });
            opts['formData'] = formData;
            return request[apiConfig.method](opts);
        };
        Records.prototype.getDatastream = function (oid, fileId) {
            var apiConfig = sails.config.record.api.getDatastream;
            var opts = this.getOptions("" + sails.config.record.baseUrl.redbox + apiConfig.url, oid, null, false);
            opts.url = opts.url + "?datastreamId=" + fileId;
            opts.headers['Content-Type'] = 'application/octet-stream';
            opts.headers['accept'] = 'application/octet-stream';
            opts.resolveWithFullResponse = true;
            sails.log.verbose("Getting datastream using: ");
            sails.log.verbose(JSON.stringify(opts));
            return Rx_1.Observable.fromPromise(request[apiConfig.method](opts));
        };
        Records.prototype.deleteFilesFromStageDir = function (stageDir, fileIds) {
            _.each(fileIds, function (fileId) {
                var path = stageDir + "/" + fileId;
                fs.unlinkSync(path);
            });
        };
        Records.prototype.getOptions = function (url, oid, packageType, isJson) {
            if (oid === void 0) { oid = null; }
            if (packageType === void 0) { packageType = null; }
            if (isJson === void 0) { isJson = true; }
            if (!_.isEmpty(oid)) {
                url = url.replace('$oid', oid);
            }
            if (!_.isEmpty(packageType)) {
                url = url.replace('$packageType', packageType);
            }
            var opts = { url: url, headers: { 'Authorization': "Bearer " + sails.config.redbox.apiKey } };
            if (isJson == true) {
                opts.json = true;
                opts.headers['Content-Type'] = 'application/json; charset=utf-8';
            }
            else {
                opts.encoding = null;
            }
            return opts;
        };
        Records.prototype.hasViewAccess = function (brand, user, roles, record) {
            var viewArr = record.authorization ? _.union(record.authorization.view, record.authorization.edit) : _.union(record.authorization_view, record.authorization_edit);
            var viewRolesArr = record.authorization ? _.union(record.authorization.viewRoles, record.authorization.editRoles) : _.union(record.authorization_viewRoles, record.authorization_editRoles);
            var uname = user.username;
            var isInUserView = _.find(viewArr, function (username) {
                return uname == username;
            });
            if (!_.isUndefined(isInUserView)) {
                return true;
            }
            var isInRoleView = _.find(viewRolesArr, function (roleName) {
                var role = RolesService.getRole(brand, roleName);
                return role && !_.isUndefined(_.find(roles, function (r) {
                    return role.id == r.id;
                }));
            });
            return !_.isUndefined(isInRoleView);
        };
        Records.prototype.hasEditAccess = function (brand, user, roles, record) {
            var editArr = record.authorization ? record.authorization.edit : record.authorization_edit;
            var editRolesArr = record.authorization ? record.authorization.editRoles : record.authorization_editRoles;
            var uname = user.username;
            var isInUserEdit = _.find(editArr, function (username) {
                sails.log.verbose("Username: " + uname + " == " + username);
                return uname == username;
            });
            sails.log.verbose("isInUserEdit: " + isInUserEdit);
            if (!_.isUndefined(isInUserEdit)) {
                return true;
            }
            var isInRoleEdit = _.find(editRolesArr, function (roleName) {
                var role = RolesService.getRole(brand, roleName);
                return role && !_.isUndefined(_.find(roles, function (r) {
                    return role.id == r.id;
                }));
            });
            return !_.isUndefined(isInRoleEdit);
        };
        Records.prototype.createBatch = function (type, data, harvestIdFldName) {
            var options = this.getOptions(sails.config.record.baseUrl.redbox + sails.config.record.api.harvest.url, null, type);
            data = _.map(data, function (dataItem) {
                return { harvest_id: _.get(dataItem, harvestIdFldName, ''), metadata: { metadata: dataItem, metaMetadata: { type: type } } };
            });
            options.body = { records: data };
            sails.log.verbose("Sending data:");
            sails.log.verbose(options.body);
            return Rx_1.Observable.fromPromise(request[sails.config.record.api.harvest.method](options));
        };
        Records.prototype.search = function (type, searchField, searchStr, returnFields) {
            var url = this.getSearchTypeUrl(type, searchField, searchStr) + "&start=0&rows=" + sails.config.record.export.maxRecords;
            sails.log.verbose("Searching using: " + url);
            var options = this.getOptions(url);
            return Rx_1.Observable.fromPromise(request[sails.config.record.api.search.method](options))
                .flatMap(function (response) {
                var customResp = [];
                _.forEach(response.response.docs, function (solrdoc) {
                    var customDoc = {};
                    _.forEach(returnFields, function (retField) {
                        customDoc[retField] = solrdoc[retField][0];
                    });
                    customResp.push(customDoc);
                });
                return Rx_1.Observable.of(customResp);
            });
        };
        Records.prototype.searchFuzzy = function (type, workflowState, searchQuery, exactSearches, facetSearches, brand, user, roles, returnFields) {
            var _this = this;
            var username = user.username;
            var searchParam = workflowState ? " AND workflow_stage:" + workflowState + " " : '';
            searchParam = searchParam + " AND full_text:" + searchQuery;
            _.forEach(exactSearches, function (exactSearch) {
                searchParam = searchParam + "&fq=" + exactSearch.name + ":" + _this.luceneEscape(exactSearch.value);
            });
            if (facetSearches.length > 0) {
                searchParam = searchParam + "&facet=true";
                _.forEach(facetSearches, function (facetSearch) {
                    searchParam = searchParam + "&facet.field=" + facetSearch.name + (_.isEmpty(facetSearch.value) ? '' : "&fq=" + facetSearch.name + ":" + _this.luceneEscape(facetSearch.value));
                });
            }
            var url = "" + sails.config.record.baseUrl.redbox + sails.config.record.api.search.url + "?q=metaMetadata_brandId:" + brand.id + " AND metaMetadata_type:" + type + searchParam + "&version=2.2&wt=json&sort=date_object_modified desc";
            url = this.addAuthFilter(url, username, roles, brand, false);
            sails.log.verbose("Searching fuzzy using: " + url);
            var options = this.getOptions(url);
            return Rx_1.Observable.fromPromise(request[sails.config.record.api.search.method](options))
                .flatMap(function (response) {
                var customResp = { records: [] };
                _.forEach(response.response.docs, function (solrdoc) {
                    var customDoc = {};
                    _.forEach(returnFields, function (retField) {
                        if (_.isArray(solrdoc[retField])) {
                            customDoc[retField] = solrdoc[retField][0];
                        }
                        else {
                            customDoc[retField] = solrdoc[retField];
                        }
                    });
                    customDoc["hasEditAccess"] = _this.hasEditAccess(brand, user, roles, solrdoc);
                    customResp.records.push(customDoc);
                });
                if (response.facet_counts) {
                    customResp['facets'] = [];
                    _.forOwn(response.facet_counts.facet_fields, function (facet_field, facet_name) {
                        var numFacetsValues = _.size(facet_field) / 2;
                        var facetValues = [];
                        for (var i = 0, j = 0; i < numFacetsValues; i++) {
                            facetValues.push({
                                value: facet_field[j++],
                                count: facet_field[j++]
                            });
                        }
                        customResp['facets'].push({ name: facet_name, values: facetValues });
                    });
                }
                return Rx_1.Observable.of(customResp);
            });
        };
        Records.prototype.addAuthFilter = function (url, username, roles, brand, editAccessOnly) {
            if (editAccessOnly === void 0) { editAccessOnly = undefined; }
            var roleString = "";
            var matched = false;
            for (var i = 0; i < roles.length; i++) {
                var role = roles[i];
                if (role.branding == brand.id) {
                    if (matched) {
                        roleString += " OR ";
                        matched = false;
                    }
                    roleString += roles[i].name;
                    matched = true;
                }
            }
            url = url + "&fq=authorization_edit:" + username + (editAccessOnly ? "" : (" OR authorization_view:" + username + " OR authorization_viewRoles:(" + roleString + ")")) + " OR authorization_editRoles:(" + roleString + ")";
            return url;
        };
        Records.prototype.getOne = function (type) {
            var url = this.getSearchTypeUrl(type) + "&start=0&rows=1";
            sails.log.verbose("Getting one using url: " + url);
            var options = this.getOptions(url);
            return Rx_1.Observable.fromPromise(request[sails.config.record.api.search.method](options))
                .flatMap(function (response) {
                return Rx_1.Observable.of(response.response.docs);
            });
        };
        Records.prototype.getSearchTypeUrl = function (type, searchField, searchStr) {
            if (searchField === void 0) { searchField = null; }
            if (searchStr === void 0) { searchStr = null; }
            var searchParam = searchField ? " AND " + searchField + ":" + searchStr + "*" : '';
            return "" + sails.config.record.baseUrl.redbox + sails.config.record.api.search.url + "?q=metaMetadata_type:" + type + searchParam + "&version=2.2&wt=json&sort=date_object_modified desc";
        };
        Records.prototype.provideUserAccessAndRemovePendingAccess = function (oid, userid, pendingValue) {
            var _this = this;
            var metadataResponse = this.getMeta(oid);
            metadataResponse.subscribe(function (metadata) {
                var pendingEditArray = metadata['authorization']['editPending'];
                var editArray = metadata['authorization']['edit'];
                for (var i = 0; i < pendingEditArray.length; i++) {
                    if (pendingEditArray[i] == pendingValue) {
                        pendingEditArray = pendingEditArray.filter(function (e) { return e !== pendingValue; });
                        editArray = editArray.filter(function (e) { return e !== userid; });
                        editArray.push(userid);
                    }
                }
                metadata['authorization']['editPending'] = pendingEditArray;
                metadata['authorization']['edit'] = editArray;
                var pendingViewArray = metadata['authorization']['viewPending'];
                var viewArray = metadata['authorization']['view'];
                for (var i = 0; i < pendingViewArray.length; i++) {
                    if (pendingViewArray[i] == pendingValue) {
                        pendingViewArray = pendingViewArray.filter(function (e) { return e !== pendingValue; });
                        viewArray = viewArray.filter(function (e) { return e !== userid; });
                        viewArray.push(userid);
                    }
                }
                metadata['authorization']['viewPending'] = pendingViewArray;
                metadata['authorization']['view'] = viewArray;
                _this.updateMeta(null, oid, metadata);
            });
        };
        Records.prototype.luceneEscape = function (str) {
            return luceneEscapeQuery.escape(str);
        };
        return Records;
    }(services.Services.Core.Service));
    Services.Records = Records;
})(Services = exports.Services || (exports.Services = {}));
module.exports = new Services.Records().exports();
