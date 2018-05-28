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
    var Vocab = (function (_super) {
        __extends(Vocab, _super);
        function Vocab() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'get',
                'getCollection',
                'loadCollection',
                'getMint',
                'searchPeople',
                'rvaGetResourceDetails'
            ];
            return _this;
        }
        Vocab.prototype.get = function (req, res) {
            var _this = this;
            var vocabId = req.param("vocabId");
            VocabService.getVocab(vocabId).subscribe(function (data) {
                _this.ajaxOk(req, res, null, data);
            }, function (error) {
                sails.log.error("Failed to get vocab: " + vocabId);
                sails.log.error(error);
                _this.ajaxFail(req, res, null, [], true);
            });
        };
        Vocab.prototype.getCollection = function (req, res) {
            var _this = this;
            var collectionId = req.param('collectionId');
            var searchString = req.query.search ? req.query.search.toLowerCase() : '';
            VocabService.findCollection(collectionId, searchString).subscribe(function (collections) {
                _this.ajaxOk(req, res, null, collections, true);
            }, function (error) {
                sails.log.error("Failed to find collection: " + collectionId + ", using: '" + searchString + "'");
                sails.log.error(error);
                _this.ajaxFail(req, res, null, [], true);
            });
        };
        Vocab.prototype.loadCollection = function (req, res) {
            var _this = this;
            var collectionId = req.param('collectionId');
            VocabService.loadCollection(collectionId).subscribe(function (receipt) {
                _this.ajaxOk(req, res, null, { status: 'queued', message: 'All good.', receipt: receipt }, true);
            }, function (error) {
                _this.ajaxFail(req, res, null, error, true);
            });
        };
        Vocab.prototype.getMint = function (req, res) {
            var _this = this;
            var mintSourceType = req.param('mintSourceType');
            var searchString = req.query.search;
            VocabService.findInMint(mintSourceType, searchString).subscribe(function (mintResponse) {
                _this.ajaxOk(req, res, null, mintResponse.response.docs, true);
            }, function (error) {
                _this.ajaxFail(req, res, null, error, true);
            });
        };
        Vocab.prototype.searchPeople = function (req, res) {
            var _this = this;
            var source = req.param('source');
            var page = req.param('page');
            var givenNames = req.param('givenNames');
            var surname = req.param('surname');
            sails.config.peopleSearch[source](givenNames, surname, page).subscribe(function (response) {
                _this.ajaxOk(req, res, null, response, true);
            }, function (error) {
                _this.ajaxFail(req, res, null, error, true);
            });
        };
        Vocab.prototype.rvaGetResourceDetails = function (req, res) {
            var _this = this;
            var uri = req.param('uri');
            var vocab = req.param('vocab');
            VocabService.rvaGetResourceDetails(uri, vocab).subscribe(function (response) {
                _this.ajaxOk(req, res, null, response, true);
            }, function (error) {
                _this.ajaxFail(req, res, null, error, true);
            });
        };
        return Vocab;
    }(controller.Controllers.Core.Controller));
    Controllers.Vocab = Vocab;
})(Controllers = exports.Controllers || (exports.Controllers = {}));
module.exports = new Controllers.Vocab().exports();
