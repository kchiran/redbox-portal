"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const field_base_1 = require("./field-base");
const _ = require("lodash");
const moment_es6_1 = require("moment-es6");
let DmpFieldComponent = class DmpFieldComponent {
    constructor(componentFactoryResolver, app) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.app = app;
        this.isEmbedded = false;
        this.disabled = false;
        this.disabledElements = [];
    }
    get isValid() {
        if (this.form && this.form.controls) {
            return this.form.controls[this.field.name].valid;
        }
        return false;
    }
    isDisabled() {
        var disabledExpression = this.field.options['disabledExpression'];
        if (disabledExpression != null) {
            var imports = this.fieldAnchor;
            var variables = { imports: {} };
            _.forOwn(this.fieldMap._rootComp, (val, key) => {
                variables.imports[key] = val;
            });
            variables.imports['moment'] = moment_es6_1.default;
            var compiled = _.template(disabledExpression, variables);
            var parentElement = jQuery(this.fieldElement.nativeElement.parentElement);
            if (compiled() == "true") {
                if (!this.disabled) {
                    this.disabledElements = parentElement.find('*:disabled');
                    parentElement.find('input').prop("disabled", true);
                    parentElement.find('button').filter((index, buttonElem) => {
                        const isHelp = jQuery(buttonElem).find("span[class='glyphicon glyphicon-question-sign']");
                        return isHelp.length <= 0;
                    }).prop("disabled", true);
                    parentElement.find('textarea').prop("disabled", true);
                    parentElement.find('select').prop("disabled", true);
                    this.disabled = true;
                }
                return 'disabled';
            }
            else {
                if (this.disabled) {
                    parentElement.find('input').prop("disabled", false);
                    parentElement.find('button').prop("disabled", false);
                    parentElement.find('textarea').prop("disabled", false);
                    parentElement.find('select').prop("disabled", false);
                    _.each(this.disabledElements, disabledElement => {
                        if (_.isFunction(disabledElement.prop)) {
                            disabledElement.prop("disabled", true);
                        }
                    });
                    this.disabledElements = [];
                    this.disabled = false;
                }
                return null;
            }
        }
        return null;
    }
    ngOnChanges() {
        if (!this.field || !this.componentFactoryResolver) {
            return;
        }
        this.fieldAnchor.clear();
        let compFactory = this.componentFactoryResolver.resolveComponentFactory(this.field.compClass);
        let fieldCompRef = this.fieldAnchor.createComponent(compFactory, undefined, this.app['_injector']);
        fieldCompRef.instance.injector = this.app['_injector'];
        fieldCompRef.instance.field = this.field;
        fieldCompRef.instance.form = this.form;
        fieldCompRef.instance.fieldMap = this.fieldMap;
        fieldCompRef.instance.parentId = this.parentId;
        fieldCompRef.instance.isEmbedded = this.isEmbedded;
        fieldCompRef.instance.name = this.name;
        fieldCompRef.instance.index = this.index;
        this.field.setFieldMapEntry(this.fieldMap, fieldCompRef);
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", field_base_1.FieldBase)
], DmpFieldComponent.prototype, "field", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", typeof (_a = typeof forms_1.FormGroup !== "undefined" && forms_1.FormGroup) === "function" ? _a : Object)
], DmpFieldComponent.prototype, "form", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], DmpFieldComponent.prototype, "value", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], DmpFieldComponent.prototype, "fieldMap", void 0);
__decorate([
    core_1.ViewChild('field', { read: core_1.ViewContainerRef }),
    __metadata("design:type", typeof (_b = typeof core_1.ViewContainerRef !== "undefined" && core_1.ViewContainerRef) === "function" ? _b : Object)
], DmpFieldComponent.prototype, "fieldAnchor", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DmpFieldComponent.prototype, "parentId", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], DmpFieldComponent.prototype, "isEmbedded", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], DmpFieldComponent.prototype, "name", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], DmpFieldComponent.prototype, "index", void 0);
__decorate([
    core_1.ViewChild('field'),
    __metadata("design:type", Object)
], DmpFieldComponent.prototype, "fieldElement", void 0);
DmpFieldComponent = __decorate([
    core_1.Component({
        selector: 'dmp-field',
        template: '<span [attr.disabled]="isDisabled()" #field></span>'
    }),
    __param(0, core_1.Inject(core_1.ComponentFactoryResolver)),
    __metadata("design:paramtypes", [typeof (_c = typeof core_1.ComponentFactoryResolver !== "undefined" && core_1.ComponentFactoryResolver) === "function" ? _c : Object, typeof (_d = typeof core_1.ApplicationRef !== "undefined" && core_1.ApplicationRef) === "function" ? _d : Object])
], DmpFieldComponent);
exports.DmpFieldComponent = DmpFieldComponent;
