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
const field_base_1 = require("./field-base");
const forms_1 = require("@angular/forms");
const _ = require("lodash");
const workspace_service_1 = require("../workspace-service");
let WorkspaceFieldComponent = class WorkspaceFieldComponent {
    constructor(componentFactoryResolver, app) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.app = app;
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
            var variables = {};
            variables['imports'] = this.fieldMap._rootComp;
            var compiled = _.template(disabledExpression, variables);
            var parentElement = jQuery(this.fieldElement.nativeElement.parentElement);
            if (compiled() == "true") {
                this.disabledElements = parentElement.find('*:disabled');
                parentElement.find('input').prop("disabled", true);
                return 'disabled';
            }
            else {
                if (jQuery(this.fieldElement.nativeElement).prop('disabled') == 'disabled') {
                    parentElement.find('input').prop("disabled", false);
                    _.each(this.disabledElements, disabledElement => disabledElement.prop("disabled", true));
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
        this.fieldMap[this.field.name].instance = fieldCompRef.instance;
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", field_base_1.FieldBase)
], WorkspaceFieldComponent.prototype, "field", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", typeof (_a = typeof forms_1.FormGroup !== "undefined" && forms_1.FormGroup) === "function" ? _a : Object)
], WorkspaceFieldComponent.prototype, "form", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WorkspaceFieldComponent.prototype, "value", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WorkspaceFieldComponent.prototype, "fieldMap", void 0);
__decorate([
    core_1.ViewChild('field', { read: core_1.ViewContainerRef }),
    __metadata("design:type", typeof (_b = typeof core_1.ViewContainerRef !== "undefined" && core_1.ViewContainerRef) === "function" ? _b : Object)
], WorkspaceFieldComponent.prototype, "fieldAnchor", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], WorkspaceFieldComponent.prototype, "parentId", void 0);
__decorate([
    core_1.ViewChild('field'),
    __metadata("design:type", Object)
], WorkspaceFieldComponent.prototype, "fieldElement", void 0);
WorkspaceFieldComponent = __decorate([
    core_1.Component({
        selector: 'ws-field',
        template: '<span [attr.disabled]="isDisabled()" #field></span>'
    }),
    __param(0, core_1.Inject(core_1.ComponentFactoryResolver)),
    __metadata("design:paramtypes", [typeof (_c = typeof core_1.ComponentFactoryResolver !== "undefined" && core_1.ComponentFactoryResolver) === "function" ? _c : Object, typeof (_d = typeof core_1.ApplicationRef !== "undefined" && core_1.ApplicationRef) === "function" ? _d : Object])
], WorkspaceFieldComponent);
exports.WorkspaceFieldComponent = WorkspaceFieldComponent;
class WorkspaceSelectorField extends field_base_1.FieldBase {
    constructor(options, injector) {
        super(options, injector);
        this.workspaceApps = [];
        this.services = [];
        this.workspaceTypeService = this.getFromInjector(workspace_service_1.WorkspaceTypeService);
        this.open = this.getTranslated(options['open'], options['open']);
        this.saveFirst = this.getTranslated(options['saveFirst'], options['saveFirst']);
        this.rdmp = undefined;
        this.workspaceApps = _.map(options['defaultSelection'] || [], (option) => {
            option['label'] = this.getTranslated(option['label'], option['label']);
            option['name'] = '';
            return option;
        });
        this.appLink = this.workspaceTypeService.getBrand() + '/record/';
        this.workspaceTypeService.getWorkspaceTypes().then(response => {
            if (response['status']) {
                this.workspaceApps = _.concat(this.workspaceApps, response['workspaceTypes']);
            }
            else {
                throw new Error('cannot get workspaces');
            }
        }).catch(error => {
            console.error(error);
        });
        this.workspaceTypeService.getAvailableWorkspaces().then(response => {
            if (response['status']) {
                this.services = _.concat(this.services, response['workspaces']);
            }
            else {
                throw new Error('cannot get workspaces');
            }
        }).catch(error => {
            console.error(error);
        });
    }
    init() {
        this.rdmp = this.fieldMap._rootComp.oid || undefined;
    }
    registerEvents() {
        this.fieldMap._rootComp.recordCreated.subscribe(this.setOid.bind(this));
        this.fieldMap._rootComp.recordSaved.subscribe(this.setOid.bind(this));
    }
    setOid(o) {
        this.rdmp = o.oid;
    }
    loadWorkspaceDetails(value) {
        if (!value) {
            this.workspaceApp = null;
        }
        else {
            this.workspaceApp = _.find(this.workspaceApps, function (w) {
                return w['name'] == value;
            });
        }
    }
    createFormModel() {
        if (this.controlType == 'checkbox') {
            const fgDef = [];
            _.map(this.options, (opt) => {
                const hasValue = _.find(this.value, (val) => {
                    return val == opt.value;
                });
                if (hasValue) {
                    fgDef.push(new forms_1.FormControl(opt.value));
                }
            });
            return new forms_1.FormArray(fgDef);
        }
        else {
            return super.createFormModel();
        }
    }
}
exports.WorkspaceSelectorField = WorkspaceSelectorField;
