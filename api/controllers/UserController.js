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
var uuidv4 = require("uuid/v4");
var controller = require("../core/CoreController.js");
var Controllers;
(function (Controllers) {
    var User = (function (_super) {
        __extends(User, _super);
        function User() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'login',
                'logout',
                'info',
                'aafLogin',
                'localLogin',
                'redirLogin',
                'redirPostLogin',
                'getPostLoginUrl',
                'respond',
                'update',
                'profile',
                'generateUserKey',
                'revokeUserKey',
                'find'
            ];
            return _this;
        }
        User.prototype.login = function (req, res) {
            this.sendView(req, res, sails.config.auth.loginPath);
        };
        User.prototype.profile = function (req, res) {
            this.sendView(req, res, "user/profile");
        };
        User.prototype.redirLogin = function (req, res) {
            if (req.path.indexOf(sails.config.auth.loginPath) == -1) {
                req.session.redirUrl = req.url;
            }
            return res.redirect(BrandingService.getBrandAndPortalPath(req) + "/" + sails.config.auth.loginPath);
        };
        User.prototype.redirPostLogin = function (req, res) {
            res.redirect(this.getPostLoginUrl(req, res));
        };
        User.prototype.getPostLoginUrl = function (req, res) {
            var branding = BrandingService.getBrandFromReq(req);
            var postLoginUrl = null;
            if (req.session.redirUrl) {
                postLoginUrl = req.session.redirUrl;
            }
            else {
                postLoginUrl = BrandingService.getBrandAndPortalPath(req) + "/" + ConfigService.getBrand(branding, 'auth').local.postLoginRedir;
            }
            sails.log.debug("post login url: " + postLoginUrl);
            return postLoginUrl;
        };
        User.prototype.logout = function (req, res) {
            req.logout();
            req.session.destroy(function (err) {
                res.redirect(sails.config.auth.postLogoutRedir);
            });
        };
        User.prototype.info = function (req, res) {
            return res.json({ user: req.user });
        };
        User.prototype.update = function (req, res) {
            var _this = this;
            var userid;
            if (req.isAuthenticated()) {
                userid = req.user.id;
            }
            else {
                this.ajaxFail(req, res, "No current user session. Please login.");
            }
            if (!userid) {
                this.ajaxFail(req, res, "Error: unable to get user ID.");
            }
            var details = req.body.details;
            if (!details) {
                this.ajaxFail(req, res, "Error: user details not specified");
            }
            var name;
            if (details.name) {
                name = details.name;
            }
            ;
            if (name) {
                UsersService.updateUserDetails(userid, name, details.email, details.password).subscribe(function (user) {
                    _this.ajaxOk(req, res, "Profile updated successfully.");
                }, function (error) {
                    sails.log.error("Failed to update user profile:");
                    sails.log.error(error);
                    _this.ajaxFail(req, res, error.message);
                });
            }
            else {
                this.ajaxFail(req, res, "Error: name must not be null");
            }
        };
        User.prototype.generateUserKey = function (req, res) {
            var _this = this;
            var userid;
            if (req.isAuthenticated()) {
                userid = req.user.id;
            }
            else {
                this.ajaxFail(req, res, "No current user session. Please login.");
            }
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
                return this.ajaxFail(req, res, "Error: unable to get user ID.");
            }
        };
        User.prototype.revokeUserKey = function (req, res) {
            var _this = this;
            var userid;
            if (req.isAuthenticated()) {
                userid = req.user.id;
            }
            else {
                this.ajaxFail(req, res, "No current user session. Please login.");
            }
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
                return this.ajaxFail(req, res, "Error: unable to get user ID.");
            }
        };
        User.prototype.localLogin = function (req, res) {
            sails.config.passport.authenticate('local', function (err, user, info) {
                if ((err) || (!user)) {
                    return res.send({
                        message: info.message,
                        user: user
                    });
                }
                req.logIn(user, function (err) {
                    if (err)
                        res.send(err);
                    return sails.getActions()['user/respond'](req, res, function (req, res) {
                        return res.json({ user: user, message: 'Login OK', url: sails.getActions()['user/getpostloginurl'](req, res) });
                    }, function (req, res) {
                        return sails.getActions()['user/redirpostlogin'](req, res);
                    });
                });
            })(req, res);
        };
        User.prototype.aafLogin = function (req, res) {
            sails.config.passport.authenticate('aaf-jwt', function (err, user, info) {
                sails.log.verbose("At AAF Controller, verify...");
                sails.log.verbose("Error:");
                sails.log.verbose(err);
                sails.log.verbose("Info:");
                sails.log.verbose(info);
                sails.log.verbose("User:");
                sails.log.verbose(user);
                if ((err) || (!user)) {
                    return res.send({
                        message: info.message,
                        user: user
                    });
                }
                req.logIn(user, function (err) {
                    if (err)
                        res.send(err);
                    sails.log.debug("AAF Login OK, redirecting...");
                    return sails.getActions()['user/redirpostlogin'](req, res);
                });
            })(req, res);
        };
        User.prototype.find = function (req, res) {
            var _this = this;
            var brand = BrandingService.getBrand(req.session.branding);
            var searchSource = req.query.source;
            var searchName = req.query.name;
            UsersService.findUsersWithName(searchName, brand.id, searchSource).subscribe(function (users) {
                var userArr = _.map(users, function (user) {
                    return {
                        name: user.name,
                        id: user.id,
                        username: user.username
                    };
                });
                _this.ajaxOk(req, res, null, userArr, true);
            }, function (error) {
                _this.ajaxFail(req, res, null, error, true);
            });
        };
        return User;
    }(controller.Controllers.Core.Controller));
    Controllers.User = User;
})(Controllers = exports.Controllers || (exports.Controllers = {}));
module.exports = new Controllers.User().exports();
