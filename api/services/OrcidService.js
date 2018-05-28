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
    var Orcids = (function (_super) {
        __extends(Orcids, _super);
        function Orcids() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'searchOrcid'
            ];
            _this.bootstrap = function (defBrand) {
            };
            return _this;
        }
        Orcids.prototype.searchOrcid = function (givenNames, familyName, page) {
            var _this = this;
            var rows = 10;
            var start = (page - 1) * rows;
            var url = sails.config.orcid.url + '/v1.2/search/orcid-bio/?q=family-name:"' + familyName + '"%20AND%20given-names:"' + givenNames + '"&start=' + start + '&rows=' + rows;
            var options = this.getOptions(url);
            var orcidRes = Rx_1.Observable.fromPromise(request[sails.config.record.api.search.method](options));
            return orcidRes.flatMap(function (orcidResult) {
                var results = {};
                results["numFound"] = orcidResult["orcid-search-results"]["num-found"];
                results["items"] = [];
                for (var i = 0; i < orcidResult["orcid-search-results"]["orcid-search-result"].length; i++) {
                    var orcidSearchResult = orcidResult["orcid-search-results"]["orcid-search-result"][i];
                    var item = _this.mapToPeopleSearchResult(orcidSearchResult);
                    results["items"].push(item);
                }
                return Rx_1.Observable.of(results);
            });
        };
        Orcids.prototype.mapToPeopleSearchResult = function (orcidSearchResult) {
            var item = {};
            var profile = orcidSearchResult["orcid-profile"];
            item["givenNames"] = profile["orcid-bio"]["personal-details"]["given-names"]["value"];
            item["familyName"] = profile["orcid-bio"]["personal-details"]["family-name"]["value"];
            item["identifier"] = profile["orcid-identifier"]["uri"];
            item["extendedAttributes"] = [];
            var otherNames = profile["orcid-bio"]["personal-details"]["other-names"] == null ? null : {};
            if (otherNames != null) {
                var otherNamesArray = profile["orcid-bio"]["personal-details"]["other-names"]["other-name"];
                otherNames = this.getExtendedAttributeObject('orcid-other-names', otherNamesArray);
                item["extendedAttributes"].push(otherNames);
            }
            var biography = profile["orcid-bio"]["biography"] == null ? null : {};
            if (biography != null) {
                var biographyValue = profile["orcid-bio"]["biography"];
                biography = this.getExtendedAttributeObject('orcid-biography', biographyValue);
                item["extendedAttributes"].push(biography);
            }
            var researcherUrls = profile["orcid-bio"]["researcher-urls"] == null ? null : {};
            if (researcherUrls != null) {
                var researcherUrlsValueArray = [];
                var researcherUrlsArray = profile["orcid-bio"]["researcher-urls"]["researcher-url"];
                _.forEach(researcherUrlsArray, function (researcherUrl) {
                    var researcherUrlItem = {};
                    researcherUrlItem["value"] = researcherUrl["url-name"]["value"];
                    researcherUrlItem["url"] = researcherUrl["url"]["value"];
                    researcherUrlsValueArray.push(researcherUrlItem);
                });
                researcherUrls = this.getExtendedAttributeObject('orcid-researcher-urls', researcherUrlsValueArray);
                researcherUrls["displayAsLinks"] = true;
                item["extendedAttributes"].push(researcherUrls);
            }
            var keywords = profile["orcid-bio"]["keywords"] == null ? null : {};
            if (keywords != null) {
                var keywordsArray = profile["orcid-bio"]["keywords"]["keyword"];
                keywords = this.getExtendedAttributeObject('orcid-keywords', keywordsArray);
                item["extendedAttributes"].push(keywords);
            }
            return item;
        };
        Orcids.prototype.getExtendedAttributeObject = function (label, value) {
            var extendedAttributes = {};
            extendedAttributes["label"] = label;
            extendedAttributes["value"] = value;
            return extendedAttributes;
        };
        Orcids.prototype.getOptions = function (url, contentType) {
            if (contentType === void 0) { contentType = 'application/json; charset=utf-8'; }
            return { url: url, json: true, headers: { 'Content-Type': contentType } };
        };
        return Orcids;
    }(services.Services.Core.Service));
    Services.Orcids = Orcids;
})(Services = exports.Services || (exports.Services = {}));
module.exports = new Services.Orcids().exports();
