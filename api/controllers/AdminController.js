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
var uuidv4 = require("uuid/v4");
var controller = require("../core/CoreController.js");
var Controllers;
(function (Controllers) {
    var Admin = (function (_super) {
        __extends(Admin, _super);
        function Admin() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'rolesIndex',
                'usersIndex',
                'getBrandRoles',
                'getUsers',
                'updateUserRoles',
                'updateUserDetails',
                'addLocalUser',
                'generateUserKey',
                'revokeUserKey'
            ];
            return _this;
        }
        Admin.prototype.rolesIndex = function (req, res) {
            return this.sendView(req, res, 'admin/roles');
        };
        Admin.prototype.usersIndex = function (req, res) {
            return this.sendView(req, res, 'admin/users');
        };
        Admin.prototype.getUsers = function (req, res) {
            var _this = this;
            var pageData = {};
            var users = UsersService.getUsers().flatMap(function (users) {
                _.map(users, function (user) {
                    if (_.isEmpty(_.find(sails.config.auth.hiddenUsers, function (hideUser) { return hideUser == user.name; }))) {
                        if (_.isEmpty(pageData.users)) {
                            pageData.users = [];
                        }
                        pageData.users.push(user);
                    }
                });
                return Rx_1.Observable.of(pageData);
            })
                .subscribe(function (pageData) {
                _this.ajaxOk(req, res, null, pageData.users);
            });
        };
        Admin.prototype.getBrandRoles = function (req, res) {
            var _this = this;
            var pageData = {};
            var brand = BrandingService.getBrand(req.session.branding);
            var roles = RolesService.getRolesWithBrand(brand).flatMap(function (roles) {
                _.map(roles, function (role) {
                    if (_.isEmpty(_.find(sails.config.auth.hiddenRoles, function (hideRole) { return hideRole == role.name; }))) {
                        if (_.isEmpty(pageData.roles)) {
                            pageData.roles = [];
                        }
                        pageData.roles.push(role);
                    }
                });
                return Rx_1.Observable.of(pageData);
            })
                .subscribe(function (pageData) {
                _this.ajaxOk(req, res, null, pageData.roles);
            });
        };
        Admin.prototype.generateUserKey = function (req, res) {
            var _this = this;
            var userid = req.body.userid;
            if (userid) {
                var uuid = uuidv4();
                UsersService.setUserKey(userid, uuid).subscribe(function (user) {
                    _this.ajaxOk(req, res, uuid);
                }, function (error) {
                    sails.log.error("Failed to set UUID:");
                    sails.log.error(error);
                    _this.ajaxFail(req, res, error.message);
                });
            }
            else {
                return this.ajaxFail(req, res, "Please provide userid");
            }
        };
        Admin.prototype.revokeUserKey = function (req, res) {
            var _this = this;
            var userid = req.body.userid;
            if (userid) {
                var uuid = null;
                UsersService.setUserKey(userid, uuid).subscribe(function (user) {
                    _this.ajaxOk(req, res, "UUID revoked successfully");
                }, function (error) {
                    sails.log.error("Failed to revoke UUID:");
                    sails.log.error(error);
                    _this.ajaxFail(req, res, error.message);
                });
            }
            else {
                return this.ajaxFail(req, res, "Please provide userid");
            }
        };
        Admin.prototype.addLocalUser = function (req, res) {
            var _this = this;
            var username = req.body.username;
            var details = req.body.details;
            if (details.name) {
                var name = details.name;
            }
            ;
            if (details.password) {
                var password = details.password;
            }
            ;
            if (username && name && password) {
                UsersService.addLocalUser(username, name, details.email, password).subscribe(function (user) {
                    if (details.roles) {
                        var roles = details.roles;
                        var brand = BrandingService.getBrand(req.session.branding);
                        var roleIds = RolesService.getRoleIds(brand.roles, roles);
                        UsersService.updateUserRoles(user.id, roleIds).subscribe(function (user) {
                            _this.ajaxOk(req, res, "User created successfully");
                        }, function (error) {
                            sails.log.error("Failed to update user roles:");
                            sails.log.error(error);
                            _this.ajaxFail(req, res, error.message);
                        });
                    }
                    else {
                        _this.ajaxOk(req, res, "User created successfully");
                    }
                }, function (error) {
                    sails.log.error("Failed to create user:");
                    sails.log.error(error);
                    _this.ajaxFail(req, res, error.message);
                });
            }
            else {
                this.ajaxFail(req, res, "Please provide minimum of username, name and password");
            }
        };
        Admin.prototype.updateUserDetails = function (req, res) {
            var _this = this;
            var userid = req.body.userid;
            var details = req.body.details;
            if (details.name) {
                var name = details.name;
            }
            ;
            if (userid && name) {
                UsersService.updateUserDetails(userid, name, details.email, details.password).subscribe(function (user) {
                    if (details.roles) {
                        var roles = details.roles;
                        var brand = BrandingService.getBrand(req.session.branding);
                        var roleIds = RolesService.getRoleIds(brand.roles, roles);
                        UsersService.updateUserRoles(userid, roleIds).subscribe(function (user) {
                            _this.ajaxOk(req, res, "User updated successfully");
                        }, function (error) {
                            sails.log.error("Failed to update user roles:");
                            sails.log.error(error);
                            _this.ajaxFail(req, res, error.message);
                        });
                    }
                    else {
                        _this.ajaxOk(req, res, "Save OK.");
                    }
                }, function (error) {
                    sails.log.error("Failed to update user details:");
                    sails.log.error(error);
                    _this.ajaxFail(req, res, error.message);
                });
            }
            else {
                this.ajaxFail(req, res, "Please provide minimum of userid and name");
            }
        };
        Admin.prototype.updateUserRoles = function (req, res) {
            var _this = this;
            var newRoleNames = req.body.roles;
            var userid = req.body.userid;
            if (userid && newRoleNames) {
                var brand = BrandingService.getBrand(req.session.branding);
                var roleIds = RolesService.getRoleIds(brand.roles, newRoleNames);
                UsersService.updateUserRoles(userid, roleIds).subscribe(function (user) {
                    _this.ajaxOk(req, res, "Save OK.");
                }, function (error) {
                    sails.log.error("Failed to update user roles:");
                    sails.log.error(error);
                    _this.ajaxFail(req, res, error.message);
                });
            }
            else {
                this.ajaxFail(req, res, "Please provide userid and/or roles names.");
            }
        };
        return Admin;
    }(controller.Controllers.Core.Controller));
    Controllers.Admin = Admin;
})(Controllers = exports.Controllers || (exports.Controllers = {}));
module.exports = new Controllers.Admin().exports();
