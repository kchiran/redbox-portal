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
var UrlPattern = require("url-pattern");
var Services;
(function (Services) {
    var PathRules = (function (_super) {
        __extends(PathRules, _super);
        function PathRules() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'bootstrap',
                'getRulesFromPath',
                'canRead',
                'canWrite'
            ];
            _this.bootstrap = function (defUser, defRoles) {
                sails.log.verbose("Bootstrapping path rules....");
                var defBrand = BrandingService.getDefault();
                return _this.loadRules()
                    .flatMap(function (rules) {
                    if (!rules || rules.length == 0) {
                        sails.log.verbose("Rules, don't exist, seeding...");
                        var seedRules = sails.config.auth.rules;
                        _.forEach(seedRules, function (rule) {
                            var role = RolesService.getRoleWithName(defRoles, rule.role);
                            rule.role = role.id;
                            rule.branding = defBrand.id;
                        });
                        return Rx_1.Observable.from(seedRules)
                            .flatMap(function (rule) {
                            return _super.prototype.getObservable.call(_this, PathRule.create(rule));
                        })
                            .last()
                            .flatMap(function (rule) {
                            return _this.loadRules();
                        })
                            .flatMap(function (rules) {
                            return Rx_1.Observable.of(rules);
                        });
                    }
                    else {
                        sails.log.verbose("Rules exists.");
                        return Rx_1.Observable.of(rules);
                    }
                });
            };
            _this.loadRules = function () {
                return _super.prototype.getObservable.call(_this, PathRule.find({}).populate('role').populate('branding'))
                    .flatMap(function (rules) {
                    _this.pathRules = rules;
                    _this.rulePatterns = {};
                    _.forEach(rules, function (rule) {
                        _this.rulePatterns[rule.path] = { pattern: new UrlPattern(rule.path), rule: rule };
                    });
                    return Rx_1.Observable.of(_this.pathRules);
                });
            };
            _this.getRulesFromPath = function (path, brand) {
                var matchedRulePatterns = _.filter(_this.rulePatterns, function (rulePattern) {
                    var pattern = rulePattern.pattern;
                    return pattern.match(path) && rulePattern.rule.branding.id == brand.id;
                });
                if (matchedRulePatterns && matchedRulePatterns.length > 0) {
                    return _.map(matchedRulePatterns, 'rule');
                }
                else {
                    return null;
                }
            };
            _this.canRead = function (rules, roles, brandName) {
                var matchRule = _.filter(rules, function (rule) {
                    var userRole = _.find(roles, function (role) {
                        return role.id == rule.role.id && rule.branding.name == brandName;
                    });
                    return userRole != undefined && (rule.can_read == true || rule.can_update == true);
                });
                return matchRule.length > 0;
            };
            _this.canWrite = function (rules, roles, brandName) {
                return _.filter(rules, function (rule) {
                    var userRole = _.find(roles, function (role) {
                        return role.id == rule.role.id && rule.branding.name == brandName;
                    });
                    return userRole != undefined && (rule.can_update == true);
                }).length > 0;
            };
            return _this;
        }
        return PathRules;
    }(services.Services.Core.Service));
    Services.PathRules = PathRules;
})(Services = exports.Services || (exports.Services = {}));
module.exports = new Services.PathRules().exports();
