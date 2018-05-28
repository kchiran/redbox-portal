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
    var Roles = (function (_super) {
        __extends(Roles, _super);
        function Roles() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'bootstrap',
                'getRole',
                'getAdmin',
                'getRoleIds',
                'getRolesWithBrand',
                'getAdminFromRoles',
                'getRoleWithName',
                'getDefAuthenticatedRole',
                'getDefUnathenticatedRole',
                'getNestedRoles'
            ];
            _this.getRoleWithName = function (roles, roleName) {
                return _.find(roles, function (o) { return o.name == roleName; });
            };
            _this.getRole = function (brand, roleName) {
                return _this.getRoleWithName(brand.roles, roleName);
            };
            _this.getAdmin = function (brand) {
                return _this.getRole(brand, _this.getConfigRole('Admin').name);
            };
            _this.getAdminFromRoles = function (roles) {
                return _this.getRoleWithName(roles, _this.getConfigRole('Admin').name);
            };
            _this.getDefAuthenticatedRole = function (brand) {
                sails.log.verbose(_this.getRoleWithName(brand.roles, _this.getConfigRole(ConfigService.getBrand(brand.name, 'auth').aaf.defaultRole).name));
                return _this.getRoleWithName(brand.roles, _this.getConfigRole(ConfigService.getBrand(brand.name, 'auth').aaf.defaultRole).name);
            };
            _this.getNestedRoles = function (role, brandRoles) {
                var roles = [];
                switch (role) {
                    case "Admin":
                        roles.push(_this.getRoleWithName(brandRoles, 'Admin'));
                    case "Maintainer":
                        roles.push(_this.getRoleWithName(brandRoles, 'Maintainer'));
                    case "Researcher":
                        roles.push(_this.getRoleWithName(brandRoles, 'Researcher'));
                    case "Guest":
                        roles.push(_this.getRoleWithName(brandRoles, 'Guest'));
                        break;
                }
                return roles;
            };
            _this.getDefUnathenticatedRole = function (brand) {
                return _this.getRoleWithName(brand.roles, _this.getConfigRole(ConfigService.getBrand(brand.name, 'auth').defaultRole).name);
            };
            _this.getRolesWithBrand = function (brand) {
                return _super.prototype.getObservable.call(_this, Role.find({ branding: brand.id }).populate('users'));
            };
            _this.getRoleIds = function (fromRoles, roleNames) {
                sails.log.verbose("Getting id of role names...");
                return _.map(_.filter(fromRoles, function (role) { return _.includes(roleNames, role.name); }), 'id');
            };
            _this.bootstrap = function (defBrand) {
                var adminRole = _this.getAdmin(defBrand);
                if (adminRole == null) {
                    sails.log.verbose("Creating default admin, and other roles...");
                    return Rx_1.Observable.from(_this.getConfigRoles())
                        .flatMap(function (roleConfig) {
                        return _super.prototype.getObservable.call(_this, Role.create(roleConfig))
                            .flatMap(function (newRole) {
                            sails.log.verbose("Adding role to brand:" + newRole.id);
                            var brand = sails.services.brandingservice.getDefault();
                            var q = BrandingConfig.addToCollection(brand.id, 'roles').members([newRole.id]);
                            return _super.prototype.getObservable.call(_this, q, 'exec', 'simplecb');
                        });
                    })
                        .last()
                        .flatMap(function (brand) {
                        return sails.services.brandingservice.loadAvailableBrands();
                    });
                }
                else {
                    sails.log.verbose("Admin role exists.");
                    return Rx_1.Observable.of(defBrand);
                }
            };
            _this.getConfigRole = function (roleName) {
                return _.find(sails.config.auth.roles, function (o) { return o.name == roleName; });
            };
            _this.getConfigRoles = function (roleProp, customObj) {
                if (roleProp === void 0) { roleProp = null; }
                if (customObj === void 0) { customObj = null; }
                var retVal = sails.config.auth.roles;
                if (roleProp) {
                    retVal = [];
                    _.map(sails.config.auth.roles, function (o) {
                        var newObj = {};
                        newObj[roleProp] = o;
                        if (customObj) {
                            newObj['custom'] = customObj;
                        }
                        retVal.push(newObj);
                    });
                }
                sails.log.verbose(retVal);
                return retVal;
            };
            return _this;
        }
        return Roles;
    }(services.Services.Core.Service));
    Services.Roles = Roles;
})(Services = exports.Services || (exports.Services = {}));
module.exports = new Services.Roles().exports();
