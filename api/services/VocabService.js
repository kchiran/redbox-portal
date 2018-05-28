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
var Services;
(function (Services) {
    var Vocab = (function (_super) {
        __extends(Vocab, _super);
        function Vocab() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'bootstrap',
                'getVocab',
                'loadCollection',
                'findCollection',
                'findInMint',
                'rvaGetResourceDetails'
            ];
            _this.getVocab = function (vocabId) {
                return CacheService.get(vocabId).flatMap(function (data) {
                    if (data) {
                        sails.log.verbose("Returning cached vocab: " + vocabId);
                        return Rx_1.Observable.of(data);
                    }
                    if (sails.config.vocab.nonAnds && sails.config.vocab.nonAnds[vocabId]) {
                        return _this.getNonAndsVocab(vocabId);
                    }
                    var url = "" + sails.config.vocab.rootUrl + vocabId + "/" + sails.config.vocab.conceptUri;
                    var items = null;
                    var rawItems = [];
                    return _this.getConcepts(url, rawItems).flatMap(function (allRawItems) {
                        items = _.map(allRawItems, function (rawItem) {
                            return { uri: rawItem._about, notation: rawItem.notation, label: rawItem.prefLabel._value };
                        });
                        CacheService.set(vocabId, items);
                        return Rx_1.Observable.of(items);
                    });
                });
            };
            return _this;
        }
        Vocab.prototype.bootstrap = function () {
            var _this = this;
            return Rx_1.Observable.from(sails.config.vocab.bootStrapVocabs)
                .flatMap(function (vocabId) {
                return _this.getVocab(vocabId);
            })
                .last();
        };
        Vocab.prototype.findInMint = function (sourceType, queryString) {
            queryString = _.trim(queryString);
            var searchString = '';
            if (!_.isEmpty(queryString)) {
                searchString = " AND (" + queryString + ")";
            }
            var mintUrl = "" + sails.config.record.baseUrl.mint + sails.config.mint.api.search.url + "?q=repository_type:" + sourceType + searchString + "&version=2.2&wt=json&start=0";
            var options = this.getMintOptions(mintUrl);
            return Rx_1.Observable.fromPromise(request[sails.config.record.api.search.method](options));
        };
        Vocab.prototype.getConcepts = function (url, rawItems) {
            var _this = this;
            console.log("Getting concepts...." + url);
            var options = { url: url, json: true };
            return Rx_1.Observable.fromPromise(request.get(options))
                .flatMap(function (response) {
                rawItems = rawItems.concat(response.result.items);
                if (response.result && response.result.next) {
                    return _this.getConcepts(response.result.next, rawItems);
                }
                return Rx_1.Observable.of(rawItems);
            });
        };
        Vocab.prototype.getNonAndsVocab = function (vocabId) {
            var url = sails.config.vocab.nonAnds[vocabId].url;
            var options = { url: url, json: true };
            return Rx_1.Observable.fromPromise(request.get(options)).flatMap(function (response) {
                CacheService.set(vocabId, response);
                return Rx_1.Observable.of(response);
            });
        };
        Vocab.prototype.loadCollection = function (collectionId, progressId, force) {
            var _this = this;
            if (force === void 0) { force = false; }
            var getMethod = sails.config.vocab.collection[collectionId].getMethod;
            var bufferCount = sails.config.vocab.collection[collectionId].processingBuffer;
            var processWindow = sails.config.vocab.collection[collectionId].processingTime;
            var collectionData = null;
            return this[getMethod](collectionId).flatMap(function (data) {
                if (_.isEmpty(data) || force) {
                    var url = sails.config.vocab.collection[collectionId].url;
                    sails.log.verbose("Loading collection: " + collectionId + ", using url: " + url);
                    var methodName_1 = sails.config.vocab.collection[collectionId].saveMethod;
                    var options = { url: url, json: true };
                    return Rx_1.Observable.fromPromise(request.get(options))
                        .flatMap(function (response) {
                        sails.log.verbose("Got response retrieving data for collection: " + collectionId + ", saving...");
                        sails.log.verbose("Number of items: " + response.length);
                        var itemsToSave = _.chunk(response, bufferCount);
                        collectionData = itemsToSave;
                        var updateObj = { currentIdx: 0, targetIdx: collectionData.length };
                        return AsynchsService.update({ id: progressId }, updateObj);
                    })
                        .flatMap(function (updateResp) {
                        sails.log.verbose("Updated asynch progress...");
                        return Rx_1.Observable.from(collectionData);
                    })
                        .map(function (buffer, i) {
                        setTimeout(function () {
                            sails.log.verbose("Processing chunk: " + i);
                            return _this.saveCollectionChunk(methodName_1, buffer, i)
                                .flatMap(function (saveResp) {
                                sails.log.verbose("Updating chunk progress..." + i);
                                if (i == collectionData.length) {
                                    sails.log.verbose("Asynch completed.");
                                    return AsynchsService.finish(progressId);
                                }
                                else {
                                    return AsynchsService.update({ id: progressId }, { currentIdx: i + 1, status: 'processing' });
                                }
                            });
                        }, i * processWindow);
                    })
                        .concat();
                }
                else {
                    sails.log.verbose("Collection already loaded: " + collectionId);
                    return Rx_1.Observable.of(null);
                }
            });
        };
        Vocab.prototype.saveCollectionChunk = function (methodName, buffer, i) {
            return this[methodName](buffer);
        };
        Vocab.prototype.findCollection = function (collectionId, searchString) {
            return this[sails.config.vocab.collection[collectionId].searchMethod](searchString);
        };
        Vocab.prototype.rvaGetResourceDetails = function (uri, vocab) {
            var url = sails.config.vocab.rootUrl + (vocab + "/resource.json?uri=" + uri);
            var options = { url: url, json: true };
            sails.log.error("****** URL is: " + url);
            return Rx_1.Observable.fromPromise(request.get(options)).flatMap(function (response) {
                CacheService.set(vocab, response);
                return Rx_1.Observable.of(response);
            });
        };
        Vocab.prototype.saveInst = function (instItems) {
            _.forEach(instItems, function (item) {
                item.text_name = item.name;
            });
            return RecordsService.createBatch(sails.config.vocab.collection['grid'].type, instItems, 'grid_id');
        };
        Vocab.prototype.searchInst = function (searchString, fields) {
            return RecordsService.search(sails.config.vocab.collection['grid'].type, sails.config.vocab.collection['grid'].searchField, searchString, sails.config.vocab.collection['grid'].fields);
        };
        Vocab.prototype.getInst = function (collectionId) {
            return RecordsService.getOne(sails.config.vocab.collection[collectionId].type);
        };
        Vocab.prototype.getMintOptions = function (url) {
            return { url: url, json: true, headers: { 'Authorization': "Bearer " + sails.config.mint.apiKey, 'Content-Type': 'application/json; charset=utf-8' } };
        };
        return Vocab;
    }(services.Services.Core.Service));
    Services.Vocab = Vocab;
})(Services = exports.Services || (exports.Services = {}));
module.exports = new Services.Vocab().exports();
