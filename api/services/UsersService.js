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
    var Users = (function (_super) {
        __extends(Users, _super);
        function Users() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'bootstrap',
                'updateUserRoles',
                'updateUserDetails',
                'getUserWithId',
                'addLocalUser',
                'setUserKey',
                'hasRole',
                'findUsersWithName',
                'findUsersWithEmail',
                'findUsersWithQuery',
                'findAndAssignAccessToRecords',
                'getUsers',
            ];
            _this.localAuthInit = function () {
                var defAuthConfig = ConfigService.getBrand(BrandingService.getDefault().name, 'auth');
                var usernameField = defAuthConfig.local.usernameField, passwordField = defAuthConfig.local.passwordField;
                sails.config.passport = require('passport');
                var LocalStrategy = require('passport-local').Strategy;
                var bcrypt = require('bcrypt');
                sails.config.passport.serializeUser(function (user, done) {
                    done(null, user.id);
                });
                sails.config.passport.deserializeUser(function (id, done) {
                    User.findOne({ id: id }).populate('roles').exec(function (err, user) {
                        done(err, user);
                    });
                });
                sails.config.passport.use(new LocalStrategy({
                    usernameField: usernameField,
                    passwordField: passwordField
                }, function (username, password, done) {
                    User.findOne({ username: username }).populate('roles').exec(function (err, foundUser) {
                        if (err) {
                            return done(err);
                        }
                        if (!foundUser) {
                            return done(null, false, { message: 'Incorrect username/password' });
                        }
                        bcrypt.compare(password, foundUser.password, function (err, res) {
                            if (!res) {
                                return done(null, false, {
                                    message: 'Incorrect username/password'
                                });
                            }
                            foundUser.lastLogin = new Date();
                            User.update({ username: foundUser.username }, { lastLogin: foundUser.lastLogin });
                            return done(null, foundUser, {
                                message: 'Logged In Successfully'
                            });
                        });
                    });
                }));
            };
            _this.aafAuthInit = function () {
                var defAuthConfig = ConfigService.getBrand(BrandingService.getDefault().name, 'auth');
                var JwtStrategy = require('passport-jwt').Strategy, ExtractJwt = require('passport-jwt').ExtractJwt;
                var aafOpts = defAuthConfig.aaf.opts;
                aafOpts.jwtFromRequest = ExtractJwt.fromBodyField('assertion');
                sails.config.passport.use('aaf-jwt', new JwtStrategy(aafOpts, function (req, jwt_payload, done) {
                    var brand = BrandingService.getBrand(req.session.branding);
                    var authConfig = ConfigService.getBrand(brand.name, 'auth');
                    var aafAttributes = authConfig.aaf.attributesField;
                    var aafDefRoles = _.map(RolesService.getNestedRoles(RolesService.getDefAuthenticatedRole(brand).name, brand.roles), 'id');
                    var aafUsernameField = authConfig.aaf.usernameField;
                    var userName = Buffer.from(jwt_payload[aafUsernameField]).toString('base64');
                    User.findOne({ username: userName }, function (err, user) {
                        sails.log.verbose("At AAF Strategy verify, payload:");
                        sails.log.verbose(jwt_payload);
                        sails.log.verbose("User:");
                        sails.log.verbose(user);
                        sails.log.verbose("Error:");
                        sails.log.verbose(err);
                        if (err) {
                            return done(err, false);
                        }
                        if (user) {
                            user.lastLogin = new Date();
                            User.update(user).exec(function (err, user) {
                            });
                            return done(null, user);
                        }
                        else {
                            sails.log.verbose("At AAF Strategy verify, creating new user...");
                            var userToCreate = {
                                username: userName,
                                name: jwt_payload[aafAttributes].cn,
                                email: jwt_payload[aafAttributes].mail,
                                displayname: jwt_payload[aafAttributes].displayname,
                                cn: jwt_payload[aafAttributes].cn,
                                edupersonscopedaffiliation: jwt_payload[aafAttributes].edupersonscopedaffiliation,
                                edupersontargetedid: jwt_payload[aafAttributes].edupersontargetedid,
                                edupersonprincipalname: jwt_payload[aafAttributes].edupersonprincipalname,
                                givenname: jwt_payload[aafAttributes].givenname,
                                surname: jwt_payload[aafAttributes].surname,
                                type: 'aaf',
                                roles: aafDefRoles,
                                lastLogin: new Date()
                            };
                            sails.log.verbose(userToCreate);
                            User.create(userToCreate).exec(function (err, newUser) {
                                if (err) {
                                    sails.log.error("Error creating new user:");
                                    sails.log.error(err);
                                    return done(err, false);
                                }
                                sails.log.verbose("Done, returning new user:");
                                sails.log.verbose(newUser);
                                return done(null, newUser);
                            });
                        }
                    });
                }));
            };
            _this.bearerTokenAuthInit = function () {
                var BearerStrategy = require('passport-http-bearer').Strategy;
                sails.config.passport.use('bearer', new BearerStrategy(function (token, done) {
                    User.findOne({ token: token }).populate('roles').exec(function (err, user) {
                        if (err) {
                            return done(err);
                        }
                        if (!user) {
                            return done(null, false);
                        }
                        return done(null, user, { scope: 'all' });
                    });
                }));
            };
            _this.initDefAdmin = function (defRoles, defAdminRole) {
                var authConfig = ConfigService.getBrand(BrandingService.getDefault().name, 'auth');
                var usernameField = authConfig.local.usernameField, passwordField = authConfig.local.passwordField;
                var defaultUser = _.find(defAdminRole.users, function (o) { return o[usernameField] == authConfig.local.default.adminUser; });
                if (defaultUser == null) {
                    defaultUser = { type: 'local', name: 'Local Admin' };
                    defaultUser[usernameField] = authConfig.local.default.adminUser;
                    defaultUser[passwordField] = authConfig.local.default.adminPw;
                    defaultUser["email"] = authConfig.local.default.email;
                    defaultUser["token"] = authConfig.local.default.token;
                    sails.log.verbose("Default user missing, creating...");
                    return _super.prototype.getObservable.call(_this, User.create(defaultUser))
                        .flatMap(function (defUser) {
                        var defRoleIds = _.map(defRoles, function (o) {
                            return o.id;
                        });
                        var q = User.addToCollection(defUser.id, 'roles').members(defRoleIds);
                        return _super.prototype.getObservable.call(_this, q, 'exec', 'simplecb')
                            .flatMap(function (dUser) {
                            return Rx_1.Observable.from(defRoles)
                                .map(function (role) {
                                q = Role.addToCollection(role.id, 'users').members([defUser.id]);
                                return _super.prototype.getObservable.call(_this, q, 'exec', 'simplecb');
                            });
                        })
                            .last()
                            .flatMap(function (lastRole) {
                            return Rx_1.Observable.of({ defUser: defUser, defRoles: defRoles });
                        });
                    });
                }
                else {
                    return Rx_1.Observable.of({ defUser: defaultUser, defRoles: defRoles });
                }
            };
            _this.addLocalUser = function (username, name, email, password) {
                var authConfig = ConfigService.getBrand(BrandingService.getDefault().name, 'auth');
                var usernameField = authConfig.local.usernameField, passwordField = authConfig.local.passwordField;
                return _this.getUserWithUsername(username).flatMap(function (user) {
                    if (user) {
                        return Rx_1.Observable.throw(new Error('Username already exists'));
                    }
                    else {
                        var newUser = { type: 'local', name: name };
                        if (!_.isEmpty(email)) {
                            newUser["email"] = email;
                        }
                        newUser[usernameField] = username;
                        newUser[passwordField] = password;
                        return _super.prototype.getObservable.call(_this, User.create(newUser));
                    }
                });
            };
            _this.bootstrap = function (defRoles) {
                var defAuthConfig = ConfigService.getBrand(BrandingService.getDefault().name, 'auth');
                sails.log.verbose("Bootstrapping users....");
                var usernameField = defAuthConfig.local.usernameField, passwordField = defAuthConfig.local.passwordField;
                var defAdminRole = RolesService.getAdminFromRoles(defRoles);
                return Rx_1.Observable.of(defAdminRole)
                    .flatMap(function (defAdminRole) {
                    _this.localAuthInit();
                    _this.aafAuthInit();
                    _this.bearerTokenAuthInit();
                    return _this.initDefAdmin(defRoles, defAdminRole);
                });
            };
            _this.getUserWithUsername = function (username) {
                return _this.getObservable(User.findOne({ username: username }).populate('roles'));
            };
            _this.getUserWithId = function (userid) {
                return _this.getObservable(User.findOne({ id: userid }).populate('roles'));
            };
            _this.getUsers = function () {
                return _super.prototype.getObservable.call(_this, User.find({}).populate('roles'));
            };
            _this.setUserKey = function (userid, uuid) {
                return _this.getUserWithId(userid).flatMap(function (user) {
                    if (user) {
                        user["token"] = uuid;
                        return _this.getObservable(user, 'save', 'simplecb');
                    }
                    else {
                        return Rx_1.Observable.throw(new Error('No such user with id:' + userid));
                    }
                });
            };
            _this.updateUserDetails = function (userid, name, email, password) {
                var authConfig = ConfigService.getBrand(BrandingService.getDefault().name, 'auth');
                var passwordField = authConfig.local.passwordField;
                return _this.getUserWithId(userid).flatMap(function (user) {
                    if (user) {
                        user["name"] = name;
                        if (!_.isEmpty(email)) {
                            user["email"] = email;
                        }
                        if (!_.isEmpty(password)) {
                            var bcrypt = require('bcrypt');
                            var salt = salt = bcrypt.genSaltSync(10);
                            user[passwordField] = bcrypt.hashSync(password, salt);
                        }
                        return _this.getObservable(user, 'save', 'simplecb');
                    }
                    else {
                        return Rx_1.Observable.throw(new Error('No such user with id:' + userid));
                    }
                });
            };
            _this.updateUserRoles = function (userid, newRoleIds) {
                return _this.getUserWithId(userid).flatMap(function (user) {
                    if (user) {
                        if (_.isEmpty(newRoleIds) || newRoleIds.length == 0) {
                            return Rx_1.Observable.throw(new Error('Please assign at least one role'));
                        }
                        var q = User.replaceCollection(user.id, 'roles').members(newRoleIds);
                        return _this.getObservable(q, 'exec', 'simplecb');
                    }
                    else {
                        return Rx_1.Observable.throw(new Error('No such user with id:' + userid));
                    }
                });
            };
            return _this;
        }
        Users.prototype.hasRole = function (user, targetRole) {
            return _.find(user.roles, function (role) {
                return role.id == targetRole.id;
            });
        };
        Users.prototype.findUsersWithName = function (name, brandId, source) {
            if (source === void 0) { source = null; }
            var query = { name: { 'contains': name } };
            return this.findUsersWithQuery(query, brandId, source);
        };
        Users.prototype.findUsersWithEmail = function (email, brandId, source) {
            var query = { email: { 'contains': email } };
            return this.findUsersWithQuery(query, brandId, source);
        };
        Users.prototype.findUsersWithQuery = function (query, brandId, source) {
            if (source === void 0) { source = null; }
            if (!_.isEmpty(source) && !_.isUndefined(source) && !_.isNull(source)) {
                query['type'] = source;
            }
            return this.getObservable(User.find(query).populate('roles'))
                .flatMap(function (users) {
                if (brandId) {
                    _.remove(users, function (user) {
                        var isInBrand = _.find(user.roles, function (role) {
                            return role.branding == brandId;
                        });
                        return !isInBrand;
                    });
                }
                return Rx_1.Observable.of(users);
            });
        };
        Users.prototype.findAndAssignAccessToRecords = function (pendingValue, userid) {
            var url = "" + sails.config.record.baseUrl.redbox + sails.config.record.api.search.url + "?q=authorization_editPending:" + pendingValue + "%20OR%20authorization_viewPending:" + pendingValue + "&sort=date_object_modified desc&version=2.2&wt=json&rows=10000";
            var options = { url: url, json: true, headers: { 'Authorization': "Bearer " + sails.config.redbox.apiKey, 'Content-Type': 'application/json; charset=utf-8' } };
            var response = Rx_1.Observable.fromPromise(request[sails.config.record.api.search.method](options)).catch(function (error) { return Rx_1.Observable.of("Error: " + error); });
            response.subscribe(function (results) {
                if (results["response"] != null) {
                    var docs = results["response"]["docs"];
                    for (var i = 0; i < docs.length; i++) {
                        var doc = docs[i];
                        var item = {};
                        var oid = doc["storage_id"];
                        RecordsService.provideUserAccessAndRemovePendingAccess(oid, userid, pendingValue);
                    }
                }
                else {
                    sails.log.error(results);
                }
            });
        };
        return Users;
    }(services.Services.Core.Service));
    Services.Users = Users;
})(Services = exports.Services || (exports.Services = {}));
module.exports = new Services.Users().exports();
