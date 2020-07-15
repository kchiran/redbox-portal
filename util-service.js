"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const _ = require("lodash");
const moment_es6_1 = require("moment-es6");
let UtilityService = class UtilityService {
    concatenate(data, config) {
        let result = '';
        _.each(config.fields, (f) => {
            if (_.isArray(data)) {
                result = [];
                let itemResult = '';
                _.each(data, (d) => {
                    const fldData = _.get(d, f);
                    if (fldData) {
                        itemResult = `${itemResult}${_.isEmpty(itemResult) ? '' : config.delim}${fldData}`;
                    }
                });
                result.push(itemResult);
            }
            else {
                const fldData = _.get(data, f);
                if (fldData) {
                    result = `${result}${_.isEmpty(result) ? '' : config.delim}${fldData}`;
                }
            }
        });
        return result;
    }
    getPropertyFromObject(data, config) {
        const fieldPath = config.field;
        return _.get(data, fieldPath);
    }
    getPropertyFromObjectMapping(data, config) {
        const fieldPath = config.field;
        const val = _.isUndefined(fieldPath) ? data : _.get(data, fieldPath);
        const foundMapping = _.find(config.mapping, (mapEntry) => {
            return `${mapEntry.key}` == `${val}`;
        });
        return foundMapping ? foundMapping.value : config.default;
    }
    hasValue(data, config = null) {
        return !_.isEmpty(data) && !_.isUndefined(data) && !_.isNull(data);
    }
    getPropertyFromObjectConcat(data, config) {
        let values = [];
        _.each(config.field, (f) => {
            values.push(_.get(data, f));
        });
        return _.concat([], ...values);
    }
    splitStringToArray(data, config) {
        let delim = config.delim;
        let field = config.field;
        let value = data;
        if (field) {
            value = _.get(data, field);
        }
        return value.split(delim);
    }
    splitArrayStringsToArray(data, config) {
        let regex = config.regex || ',';
        let flags = config.flags || 'g';
        const reg = new RegExp(regex, flags);
        let regexTrail = config.regexTrail || '(^,)|(,$)';
        let flagsTrail = config.flagsTrail || 'g';
        const regTrail = new RegExp(regexTrail, flagsTrail);
        let field = config.field;
        let value = data;
        if (field) {
            value = _.get(data, field);
        }
        const values = [];
        _.each(value, (v) => {
            if (v) {
                v = v.replace(regTrail, '');
            }
            values.push(v.split(reg).map(item => item.trim()));
        });
        return _.concat([], ...values);
    }
    getFirstofArray(data, config) {
        let delim = config.delim;
        let field = config.field;
        let value = data;
        if (field) {
            value = _.get(data, field);
        }
        return _.first(value);
    }
    convertToDateFormat(data, config) {
        let delim = config.delim;
        let field = config.field;
        let formatOrigin = config.formatOrigin || 'DD-MMM-YY';
        let formatTarget = config.formatTarget || 'YYYY-MM-DD';
        let value = data;
        if (field) {
            value = _.get(data, field);
        }
        const converted = moment_es6_1.default(value, formatOrigin).format(formatTarget);
        console.log(`convertToDateFormat ${converted}`);
        return converted;
    }
    joinArray(data, config, fieldName = null, fieldSeparator = null) {
        return _.join(_.get(data, fieldName ? fieldName : config.field), fieldSeparator ? fieldSeparator : config.separator);
    }
    runTemplate(data, config) {
        const imports = _.extend({ data: data, config: config, moment: moment_es6_1.default }, this);
        const templateData = { imports: imports };
        const template = _.template(config.template, templateData);
        return template();
    }
    todaysDate(data, config) {
        let format = config.format || 'YYYY-MM-DD';
        return moment_es6_1.default().local().format(format);
    }
};
UtilityService = __decorate([
    core_1.Injectable()
], UtilityService);
exports.UtilityService = UtilityService;
