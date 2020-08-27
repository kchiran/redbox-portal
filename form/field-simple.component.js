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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const field_base_1 = require("./field-base");
const forms_1 = require("@angular/forms");
const _ = require("lodash");
class SimpleComponent {
    constructor() {
        this.isEmbedded = false;
    }
    getFormControl(name = null, ctrlIndex = null) {
        let fc = null;
        if (_.isEmpty(name)) {
            name = this.name;
        }
        if (_.isEmpty(name)) {
            name = this.field.name;
        }
        if (this.fieldMap && this.field) {
            fc = this.field.getControl(name, this.fieldMap);
        }
        if (!_.isNull(ctrlIndex) && !_.isUndefined(ctrlIndex)) {
            if (!_.isNull(fc.controls) && !_.isUndefined(fc.controls)) {
                fc = fc.controls[ctrlIndex];
            }
        }
        else if (this.index != null) {
            fc = fc.controls[this.index];
        }
        if (name != this.field.name && !_.isEmpty(this.field.name) && !_.isUndefined(fc.controls)) {
            fc = fc.controls[this.field.name];
        }
        return fc;
    }
    getGroupClass(fldName = null) {
        return `${this.field.groupClasses} form-group ${this.hasRequiredError() ? 'has-error' : ''}`;
    }
    hasRequiredError() {
        return (this.field.formModel ? this.field.formModel.touched && this.field.formModel.hasError('required') : false);
    }
    toggleHelp() {
        this.helpShow = !this.helpShow;
    }
    getRequiredLabelStr() {
        return this.field.required ? '(*)' : '';
    }
    getFromInjector(token) {
        return this.injector.get(token);
    }
}
__decorate([
    core_1.Input(),
    __metadata("design:type", field_base_1.FieldBase)
], SimpleComponent.prototype, "field", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", typeof (_a = typeof forms_1.FormGroup !== "undefined" && forms_1.FormGroup) === "function" ? _a : Object)
], SimpleComponent.prototype, "form", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], SimpleComponent.prototype, "fieldMap", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], SimpleComponent.prototype, "index", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], SimpleComponent.prototype, "name", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], SimpleComponent.prototype, "isEmbedded", void 0);
exports.SimpleComponent = SimpleComponent;
class SelectionComponent extends SimpleComponent {
    getLabel(val) {
        if (_.isUndefined(val)) {
            return '';
        }
        const opt = _.find(this.field.selectOptions, (opt) => {
            return opt.value == val;
        });
        if (opt) {
            return opt.label;
        }
        else {
            return '';
        }
    }
}
exports.SelectionComponent = SelectionComponent;
let DropdownFieldComponent = class DropdownFieldComponent extends SelectionComponent {
    constructor() {
        super(...arguments);
        this.compare = this.compareFn.bind(this);
    }
    compareFn(a, b) {
        if (this.field.storeValueAndLabel) {
            if (b == null || b == "") {
                return a.value == b;
            }
            return a.value == b.value;
        }
        return a == b;
    }
};
DropdownFieldComponent.clName = 'DropdownFieldComponent';
DropdownFieldComponent = __decorate([
    core_1.Component({
        selector: 'dropdownfield',
        template: `
  <div [formGroup]='form' *ngIf="field.editMode" [ngClass]="getGroupClass()">
     <label [attr.for]="field.name">
      {{field.label}} {{ getRequiredLabelStr()}}
      <button type="button" class="btn btn-default" *ngIf="field.help" (click)="toggleHelp()" [attr.aria-label]="'help' | translate "><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span></button>
     </label><br/>
     <span id="{{ 'helpBlock_' + field.name }}" class="help-block" *ngIf="this.helpShow" [innerHtml]="field.help"></span>
     <select [compareWith]="compare" [formControl]="getFormControl()"  [id]="field.name" [ngClass]="field.cssClasses">
        <ng-template [ngIf]="!field.storeValueAndLabel">
          <option *ngFor="let opt of field.selectOptions" [value]="opt.value">{{opt.label}}</option>
        </ng-template>
        <ng-template [ngIf]="field.storeValueAndLabel">
          <option *ngFor="let opt of field.selectOptions" [ngValue]="opt">{{opt.label}}</option>
        </ng-template>
     </select>
     <div class="text-danger" *ngIf="getFormControl().hasError('required') && getFormControl().touched && !field.validationMessages?.required">{{field.label}} is required</div>
     <div class="text-danger" *ngIf="getFormControl().hasError('required') && getFormControl().touched && field.validationMessages?.required">{{field.validationMessages.required}}</div>
  </div>
  <div *ngIf="!field.editMode" class="key-value-pair">
    <span class="key" *ngIf="field.label">{{field.label}}</span>
    <ng-template [ngIf]="!field.storeValueAndLabel">
    <span class="value">{{getLabel(field.value)}}</span>
    </ng-template>
    <ng-template [ngIf]="field.storeValueAndLabel && field.value.value != ''">
    <span class="value">{{getLabel(field.value.value)}}</span>
    </ng-template>
  </div>
  `,
    })
], DropdownFieldComponent);
exports.DropdownFieldComponent = DropdownFieldComponent;
let SelectionFieldComponent = class SelectionFieldComponent extends SelectionComponent {
    constructor() {
        super(...arguments);
        this.defer = {};
        this.defered = false;
        this.confirmChanges = true;
    }
    isValArray() {
        return _.isArray(this.field.value);
    }
    isRadio() {
        return this.field.controlType == 'radio';
    }
    getControlFromOption(opt) {
        const control = _.find(this.getFormControl()['controls'], (ctrl) => {
            return opt.value == ctrl.value;
        });
        return control;
    }
    modifies(opt, event, defered) {
        this.confirmChanges = true;
        const fieldName = this.field['name'];
        let fields = this.fieldMap;
        this.defer['fields'] = new Array();
        _.each(opt['modifies'], e => {
            const contval = this.fieldMap[e].control.value;
            if (!_.isEmpty(contval) || contval === true) {
                jQuery(`#modal_${fieldName}`).modal({ backdrop: 'static', keyboard: false, show: true });
                this.defer['opt'] = opt;
                this.defer['event'] = event;
                this.defer['fields'].push(this.field.getFieldDisplay(this.fieldMap[e]));
                this.confirmChanges = false;
            }
        });
        if (this.confirmChanges) {
            this.defer = {};
            this.onChange(opt, event, true);
        }
    }
    confirmChange(doConfirm) {
        const fieldName = this.field['name'];
        jQuery(`#modal_${fieldName}`).modal('hide');
        this.confirmChanges = doConfirm;
        const defer = this.defer;
        if (this.isRadio()) {
            defer.event.target.checked = doConfirm;
            if (!doConfirm) {
                const revert = this.defer['opt']['revert'];
                this.field.setValue(revert);
                defer.opt = _.find(this.field.options.options, { value: revert });
            }
        }
        else {
            defer.event.target.checked = !doConfirm;
        }
        this.defer = {};
        this.onChange(defer.opt, defer.event, true);
    }
    onChange(opt, event, defered) {
        defered = defered || !_.isUndefined(defered);
        let formcontrol = this.getFormControl();
        if (event.target.checked) {
            if (_.isObject(formcontrol.push)) {
                formcontrol.push(new forms_1.FormControl(opt.value));
            }
            else if (this.isRadio()) {
                if (opt['modifies'] && !defered) {
                    this.modifies(opt, event, defered);
                }
                else {
                    defered = true;
                }
            }
        }
        else {
            if (opt['modifies'] && !defered) {
                this.modifies(opt, event, defered);
            }
            if (!defered) {
                let idx = null;
                _.forEach(formcontrol.controls, (ctrl, i) => {
                    if (ctrl.value == opt.value) {
                        idx = i;
                        return false;
                    }
                });
                formcontrol.removeAt(idx);
            }
        }
        if (this.field.publish && this.confirmChanges) {
            if (this.field.publish.onItemSelect) {
                this.field.onItemSelect.emit({ value: opt['publishTag'], checked: event.target.checked, defered: defered });
            }
            if (this.field.publish.onValueUpdate) {
                this.field.onValueUpdate.emit({ value: opt['publishTag'], checked: event.target.checked, defered: defered });
            }
        }
    }
};
SelectionFieldComponent.clName = 'SelectionFieldComponent';
SelectionFieldComponent = __decorate([
    core_1.Component({
        selector: 'selectionfield',
        template: `
  <div [formGroup]='form' *ngIf="field.editMode && field.visible" class="form-group">
     <span class="label-font">
      {{field.label}} {{ getRequiredLabelStr()}}
      <button type="button" class="btn btn-default" *ngIf="field.help" (click)="toggleHelp()" [attr.aria-label]="'help' | translate "><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span></button>
     </span><br/>
     <span id="{{ 'helpBlock_' + field.name }}" class="help-block" *ngIf="this.helpShow" [innerHtml]="field.help"></span>
     <fieldset>
      <legend [hidden]="true"><span></span></legend>
        <span *ngFor="let opt of field.selectOptions">
          <!-- radio type hard-coded otherwise accessor directive will not work! -->
          <input *ngIf="isRadio()" type="radio" name="{{field.name}}" [id]="field.name + '_' + opt.value" [formControl]="getFormControl()" [value]="opt.value" [attr.disabled]="field.readOnly ? '' : null " (change)="onChange(opt, $event)" [attr.checked]="getControlFromOption(opt)">
          <input *ngIf="!isRadio()" type="{{field.controlType}}" name="{{field.name}}" [id]="field.name + '_' + opt.value" [value]="opt.value" (change)="onChange(opt, $event)" [attr.selected]="getControlFromOption(opt)" [attr.checked]="getControlFromOption(opt)" [attr.disabled]="field.readOnly ? '' : null ">
          <label for="{{field.name + '_' + opt.value}}" class="radio-label">{{ opt.label }}</label>
          <br/>
        </span>
     </fieldset>
     <div class="text-danger" *ngIf="getFormControl().hasError('required') && getFormControl().touched && !field.validationMessages?.required">{{field.label}} is required</div>
     <div class="text-danger" *ngIf="getFormControl().hasError('required') && getFormControl().touched && field.validationMessages?.required">{{field.validationMessages.required}}</div>
  </div>
  <div *ngIf="!field.editMode" class="key-value-pair">
    <ng-container *ngIf="isRadio()">
      <span *ngIf="field.label" class="key">{{field.label}}</span>
      <span class="value">{{getLabel(field.value)}}</span>
    </ng-container>
    <ng-container *ngIf="!isRadio()">
      <span *ngIf="field.label" class="key">{{field.label}}</span>
      <span class="value" *ngIf="!isValArray()">{{getLabel(field.value)}}</span>
      <ng-container *ngIf="isValArray()">
        <div class="value" *ngFor="let val of field.value">
          {{getLabel(val)}}
        </div>
      </ng-container>
    </ng-container>

  </div>
  <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="selectionComponent" aria-hidden="true" id="{{ 'modal_' + field.name }}">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">{{field.confirmChangesLabel}}</h4>
          <p>{{field.confirmChangesParagraphLabel}}</p>
          <p *ngFor="let f of defer.fields">
            <strong>{{f.label}}</strong><br/>
            {{f.valueLabel}}
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" (click)="confirmChange(true)">Yes</button>
          <button type="button" class="btn btn-primary" (click)="confirmChange(false)">No</button>
        </div>
      </div>
    </div>
  </div>
  `,
    })
], SelectionFieldComponent);
exports.SelectionFieldComponent = SelectionFieldComponent;
let TabOrAccordionContainerComponent = class TabOrAccordionContainerComponent extends SimpleComponent {
    constructor(changeRef) {
        super();
        this.changeRef = changeRef;
    }
    ngAfterViewInit() {
        let that = this;
        setTimeout(() => {
            _.each(this.field.fields, tab => {
                tab['expandedChar'] = '+';
                jQuery(`#${tab.id}`).on('shown.bs.collapse', () => {
                    tab["expandedChar"] = '-';
                    that.changeRef.detectChanges();
                    that.field.onAccordionCollapseExpand.emit({ shown: true, tabId: tab.id });
                });
                jQuery(`#${tab.id}`).on('hidden.bs.collapse', () => {
                    tab["expandedChar"] = '+';
                    that.changeRef.detectChanges();
                    that.field.onAccordionCollapseExpand.emit({ shown: false, tabId: tab.id });
                });
            });
        });
        if (!this.field.editMode && this.field.expandAccordionsOnOpen) {
            this.field.allExpanded = false;
            this.expandCollapseAll();
        }
    }
    expandCollapseAll() {
        if (this.field.allExpanded) {
            _.each(this.field.fields, tab => {
                jQuery(`#${tab.id}`).collapse('hide');
            });
            this.field.allExpanded = false;
        }
        else {
            _.each(this.field.fields, tab => {
                jQuery(`#${tab.id}`).collapse('show');
            });
            this.field.allExpanded = true;
        }
        return false;
    }
};
TabOrAccordionContainerComponent = __decorate([
    core_1.Component({
        selector: 'tabcontainer',
        template: `
  <div *ngIf="field.editMode" class="row" style="min-height:300px;">
    <div [ngClass]="field.cssClasses">
      <div [ngClass]="field.tabNavContainerClass">
        <ul [ngClass]="field.tabNavClass">
          <li *ngFor="let tab of field.fields" [ngClass]="{'active': tab.active}"><a href="#{{tab.id}}" data-toggle="tab" role="tab">{{tab.label}}</a></li>
        </ul>
      </div>
      <div [ngClass]="field.tabContentContainerClass">
        <div [ngClass]="field.tabContentClass">
      <!--
      Inlined the tab definition instead of creating it's own component otherwise Bootstrap refuses to toggle the panes
      Likely because of the extra DOM node (component selector) that it doesn't know what to do.
      TODO: remove inlining, or perhaps consider a 3rd-party NG2 tab component
      -->
          <div *ngFor="let tab of field.fields" [ngClass]="{'tab-pane': true, 'fade': true, 'active': tab.active==true, 'in': tab.active==true}" id="{{tab.id}}">
            <dmp-field *ngFor="let field of tab.fields" [field]="field" [form]="form" class="form-row" [fieldMap]="fieldMap" [parentId]="tab.id"></dmp-field>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div *ngIf="!field.editMode" [ngClass]="field.accContainerClass">
    <div class="panel-group">
      <a href="#" (click)="expandCollapseAll(); false">Expand/Collapse all</a>
      <div *ngFor="let tab of field.fields" [ngClass]="field.accClass">
        <div class="panel-heading">
          <span class="panel-title tab-header-font">
            <a data-toggle="collapse" href="#{{tab.id}}">
              {{ tab.expandedChar }} {{ tab.label }}
            </a>
          </span>
        </div>
        <div id="{{tab.id}}" class="panel-collapse collapse">
          <div class="panel-body">
            <ul class="key-value-list">
              <dmp-field *ngFor="let field of tab.fields" [field]="field" [form]="form" class="form-row" [fieldMap]="fieldMap"></dmp-field>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof core_1.ChangeDetectorRef !== "undefined" && core_1.ChangeDetectorRef) === "function" ? _b : Object])
], TabOrAccordionContainerComponent);
exports.TabOrAccordionContainerComponent = TabOrAccordionContainerComponent;
let ButtonBarContainerComponent = class ButtonBarContainerComponent extends SimpleComponent {
};
ButtonBarContainerComponent = __decorate([
    core_1.Component({
        selector: 'buttonbarcontainer',
        template: `
    <div *ngIf="field.editMode" class="form-row">
      <div class="pull-right col-md-10">
      <dmp-field *ngFor="let field1 of field.fields" [field]="field1" [form]="form" class="form-row" [fieldMap]="fieldMap"></dmp-field>
    </div>
  `
    })
], ButtonBarContainerComponent);
exports.ButtonBarContainerComponent = ButtonBarContainerComponent;
let HtmlRawComponent = class HtmlRawComponent extends SimpleComponent {
};
HtmlRawComponent = __decorate([
    core_1.Component({
        selector: 'htmlraw',
        template: `
  <span *ngIf="field.visible" [innerHtml]="field.value"></span>
  `,
    })
], HtmlRawComponent);
exports.HtmlRawComponent = HtmlRawComponent;
let TextBlockComponent = class TextBlockComponent extends SimpleComponent {
};
TextBlockComponent.clName = 'TextBlockComponent';
TextBlockComponent = __decorate([
    core_1.Component({
        selector: 'text-block',
        template: `
  <div *ngIf="field.visible" [ngSwitch]="field.type">
    <span *ngSwitchCase="'h1'" [ngClass]="field.cssClasses">{{field.value}}</span>
    <span *ngSwitchCase="'h2'" [ngClass]="field.cssClasses">{{field.value}}</span>
    <span *ngSwitchCase="'h3'" [ngClass]="field.cssClasses">{{field.value}}</span>
    <span *ngSwitchCase="'h4'" [ngClass]="field.cssClasses">{{field.value}}</span>
    <span *ngSwitchCase="'h5'" [ngClass]="field.cssClasses">{{field.value}}</span>
    <span *ngSwitchCase="'h6'" [ngClass]="field.cssClasses">{{field.value}}</span>
    <hr *ngSwitchCase="'hr'" [ngClass]="field.cssClasses">
    <span *ngSwitchCase="'span'" [ngClass]="field.cssClasses">{{field.value}}</span>
    <p *ngSwitchDefault [ngClass]="field.cssClasses">{{field.value}}</p>
  </div>
  `,
    })
], TextBlockComponent);
exports.TextBlockComponent = TextBlockComponent;
let SaveButtonComponent = class SaveButtonComponent extends SimpleComponent {
    onClick(event) {
        if (this.field.confirmationMessage) {
            this.showConfirmDlg();
            return;
        }
        this.doAction();
    }
    showConfirmDlg() {
        jQuery(`#${this.field.name}_confirmation`).modal('show');
    }
    hideConfirmDlg() {
        jQuery(`#${this.field.name}_confirmation`).modal('hide');
    }
    doAction() {
        var successObs = null;
        if (this.field.isDelete) {
            successObs = this.fieldMap._rootComp.delete();
        }
        else {
            successObs = this.field.targetStep ?
                this.fieldMap._rootComp.onSubmit(this.field.targetStep, false, this.field.additionalData)
                : this.fieldMap._rootComp.onSubmit(null, false, this.field.additionalData);
        }
        successObs.subscribe(status => {
            if (status) {
                if (this.field.closeOnSave == true) {
                    window.location.href = this.field.redirectLocation;
                }
            }
            if (this.field.confirmationMessage) {
                this.hideConfirmDlg();
            }
        });
    }
};
SaveButtonComponent = __decorate([
    core_1.Component({
        selector: 'save-button',
        template: `
    <button type="button" (click)="onClick($event)" class="btn" [ngClass]="field.cssClasses" [disabled]="!fieldMap._rootComp.needsSave || fieldMap._rootComp.isSaving()">{{field.label}}</button>
    <div *ngIf="field.confirmationMessage" class="modal fade" id="{{ field.name }}_confirmation" tabindex="-1" role="dialog" >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="{{ field.name }}_confirmation_label" [innerHtml]="field.confirmationTitle"></h4>
          </div>
          <div class="modal-body" [innerHtml]="field.confirmationMessage"></div>
          <div class="modal-footer">
            <button (click)="hideConfirmDlg()" type="button" class="btn btn-default" data-dismiss="modal" [innerHtml]="field.cancelButtonMessage"></button>
            <button (click)="doAction()" type="button" class="btn btn-primary" [innerHtml]="field.confirmButtonMessage"></button>
          </div>
        </div>
      </div>
    </div>
  `,
    })
], SaveButtonComponent);
exports.SaveButtonComponent = SaveButtonComponent;
let CancelButtonComponent = class CancelButtonComponent extends SimpleComponent {
};
CancelButtonComponent = __decorate([
    core_1.Component({
        selector: 'cancel-button',
        template: `
    <button type="button" class="btn btn-warning" [disabled]="fieldMap._rootComp.isSaving()" (click)="fieldMap._rootComp.onCancel()">{{field.label}}</button>
  `,
    })
], CancelButtonComponent);
exports.CancelButtonComponent = CancelButtonComponent;
let AnchorOrButtonComponent = class AnchorOrButtonComponent extends SimpleComponent {
    onClick(event) {
        this.fieldMap._rootComp[this.field.onClick_RootFn]();
    }
    isDisabled() {
        if (this.field.isDisabledFn) {
            return this.fieldMap._rootComp[this.field.isDisabledFn]();
        }
        return false;
    }
};
AnchorOrButtonComponent = __decorate([
    core_1.Component({
        selector: 'anchor-button',
        template: `
  <button *ngIf="field.controlType=='button'" type="{{field.type}}" [ngClass]="field.cssClasses" (click)="onClick($event)" [disabled]="isDisabled()">{{field.label}}</button>
  <a *ngIf="field.controlType=='anchor'" href='{{field.value}}' [ngClass]="field.cssClasses" ><span *ngIf="field.showPencil" class="glyphicon glyphicon-pencil">&nbsp;</span>{{field.label}}</a>
  <a *ngIf="field.controlType=='htmlAnchor'" href='{{field.value}}' [ngClass]="field.cssClasses" [innerHtml]="field.anchorHtml"></a>
  `,
    })
], AnchorOrButtonComponent);
exports.AnchorOrButtonComponent = AnchorOrButtonComponent;
let TabNavButtonComponent = class TabNavButtonComponent extends SimpleComponent {
    constructor(changeRef) {
        super();
        this.changeRef = changeRef;
    }
    ngOnInit() {
        this.field.getTabs();
        jQuery('a[data-toggle="tab"]').on('shown.bs.tab', (e) => {
            const tabId = e.target.href.split('#')[1];
            this.field.currentTab = tabId;
            this.changeRef.detectChanges();
        });
    }
    ngAfterViewInit() {
        const focusTabId = this.getUrlParameter('focusTabId');
        if (!_.isEmpty(focusTabId)) {
            this.fieldMap._rootComp.gotoTab(focusTabId);
        }
    }
    stepToTab(step) {
        const tabId = this.field.getTabId(step);
        if (tabId) {
            this.fieldMap._rootComp.gotoTab(tabId);
        }
        else {
            console.log(`Invalid tab: ${tabId}`);
        }
    }
    getUrlParameter(param) {
        var pageURL = decodeURIComponent(window.location.search.substring(1)), urlVariables = pageURL.split('&'), parameterName, i;
        for (i = 0; i < urlVariables.length; i++) {
            parameterName = urlVariables[i].split('=');
            if (parameterName[0] === param) {
                return parameterName[1] === undefined ? null : parameterName[1];
            }
        }
    }
};
TabNavButtonComponent = __decorate([
    core_1.Component({
        selector: 'tab-nav-button',
        template: `
    <span *ngIf="field.endDisplayMode == 'disabled'">
    <button type='button'[ngClass]='field.cssClasses' [disabled]="!field.getTabId(-1)" (click)="stepToTab(-1)" >{{field.prevLabel}}</button>
    <button type='button'[ngClass]='field.cssClasses' [disabled]="!field.getTabId(1)" (click)="stepToTab(1)" >{{field.nextLabel}}</button>
    </span>
    <span *ngIf="field.endDisplayMode == 'hidden'">
    <button type='button'[ngClass]='field.cssClasses' [style.display]="!field.getTabId(-1)?'none':'inherit'" (click)="stepToTab(-1)" >{{field.prevLabel}}</button>
    <button type='button'[ngClass]='field.cssClasses' [style.display]="!field.getTabId(1)?'none':'inherit'" (click)="stepToTab(1)" >{{field.nextLabel}}</button>
    </span>
  `,
    }),
    __metadata("design:paramtypes", [typeof (_c = typeof core_1.ChangeDetectorRef !== "undefined" && core_1.ChangeDetectorRef) === "function" ? _c : Object])
], TabNavButtonComponent);
exports.TabNavButtonComponent = TabNavButtonComponent;
let LinkValueComponent = class LinkValueComponent extends SimpleComponent {
    isVisible() {
        return !_.isEmpty(this.field.value);
    }
};
LinkValueComponent = __decorate([
    core_1.Component({
        selector: 'link-value',
        template: `
  <li *ngIf="isVisible()" class="key-value-pair padding-bottom-10">
    <span class="key" *ngIf="field.label">{{field.label}}</span>
    <span class="value"><a href='{{field.value}}' target="field.target">{{field.value}}</a></span>
  </li>
  `,
    })
], LinkValueComponent);
exports.LinkValueComponent = LinkValueComponent;
let HiddenValueComponent = class HiddenValueComponent extends SimpleComponent {
    handleChange(value, source) {
        console.log(`Hidden Value change: ${source}`);
        console.log(value);
        let targetVal = null;
        if (_.isArray(value)) {
            targetVal = [];
            _.forEach(value, (v) => {
                let tVal = '';
                _.forEach(this.field.onChange.control.subFields, (subField) => {
                    tVal = `${_.isEmpty(tVal) ? tVal : `${tVal}${this.field.onChange.control.delim}`}${v[subField]}`;
                });
                targetVal.push(tVal);
            });
        }
        this.getFormControl().setValue(targetVal, this.field.onChange.updateConf);
        console.log(`Form now has value:`);
        console.log(this.form.value);
    }
};
HiddenValueComponent = __decorate([
    core_1.Component({
        selector: 'hidden-field',
        template: `
  <div [formGroup]='form'>
    <input type="hidden" name="{{field.name}}" [formControl]="getFormControl()" />
  </div>
  `,
    })
], HiddenValueComponent);
exports.HiddenValueComponent = HiddenValueComponent;
let DateTimeComponent = class DateTimeComponent extends SimpleComponent {
    ngAfterViewInit() {
        if (this.field.editMode && this.field.visible) {
            jQuery(`#${this.dateTime.idDatePicker}`).attr('aria-label', this.field.label);
        }
    }
    formatValue() {
        return this.field.formatValue(this.getFormControl().value);
    }
};
__decorate([
    core_1.ViewChild('dateTime'),
    __metadata("design:type", Object)
], DateTimeComponent.prototype, "dateTime", void 0);
DateTimeComponent = __decorate([
    core_1.Component({
        selector: 'date-time',
        template: `
  <div *ngIf="field.editMode && field.visible" [formGroup]='form' class="form-group">
    <span class="label-font">
      {{field.label}} {{ getRequiredLabelStr()}}
      <button type="button" class="btn btn-default" *ngIf="field.help" (click)="toggleHelp()" [attr.aria-label]="'help' | translate "><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span></button>
    </span><br/>
    <span id="{{ 'helpBlock_' + field.name }}" class="help-block" *ngIf="this.helpShow" [innerHtml]="field.help"></span>
    <datetime #dateTime [formControl]="getFormControl()" [timepicker]="field.timePickerOpts" [datepicker]="field.datePickerOpts" [hasClearButton]="field.hasClearButton"></datetime>
    <div *ngIf="field.required" [style.visibility]="getFormControl() && getFormControl().hasError('required') && getFormControl().touched ? 'inherit':'hidden'">
      <div class="text-danger" *ngIf="!field.validationMessages?.required">{{field.label}} is required</div>
      <div class="text-danger" *ngIf="field.validationMessages?.required">{{field.validationMessages.required}}</div>
    </div>
  </div>
  <li *ngIf="!field.editMode && field.visible" class="key-value-pair">
    <span class="key" *ngIf="field.label">{{field.label}}</span>
    <span class="value">{{field.formatValueForDisplay()}}</span>
  </li>
  `
    })
], DateTimeComponent);
exports.DateTimeComponent = DateTimeComponent;
let ParameterRetrieverComponent = class ParameterRetrieverComponent extends SimpleComponent {
    ngAfterViewInit() {
        const paramValue = this.getUrlParameter(this.field.parameterName);
        if (paramValue) {
            this.field.publishParameterValue(paramValue);
        }
    }
    getUrlParameter(param) {
        var pageURL = decodeURIComponent(window.location.search.substring(1)), urlVariables = pageURL.split('&'), parameterName, i;
        for (i = 0; i < urlVariables.length; i++) {
            parameterName = urlVariables[i].split('=');
            if (parameterName[0] === param) {
                return parameterName[1] === undefined ? true : parameterName[1];
            }
        }
    }
};
ParameterRetrieverComponent = __decorate([
    core_1.Component({
        selector: 'parameter-retriever',
        template: `
  <div>

  </div>
  `,
    })
], ParameterRetrieverComponent);
exports.ParameterRetrieverComponent = ParameterRetrieverComponent;
let SpacerComponent = class SpacerComponent extends SimpleComponent {
};
SpacerComponent = __decorate([
    core_1.Component({
        selector: 'spacer',
        template: `
  <span [style.display]="'inline-block'" [style.width]="field.width" [style.height]="field.height">&nbsp;</span>
  `,
    })
], SpacerComponent);
exports.SpacerComponent = SpacerComponent;
let ToggleComponent = class ToggleComponent extends SimpleComponent {
    constructor() {
        super(...arguments);
        this.defer = {};
        this.confirmChanges = true;
    }
    onChange(opt, event, defered) {
        defered = defered || !_.isUndefined(defered);
        console.log(`ToggleComponent, onChanged Checked: ${event.target.checked}`);
        if (opt['modifies'] && !defered) {
            const fieldName = this.field['name'];
            let fields = this.fieldMap;
            this.defer['fields'] = new Array();
            opt['modifies'].some(e => {
                const contval = this.fieldMap[e].control.value;
                if (!_.isEmpty(contval) || contval === true) {
                    jQuery(`#modal_${fieldName}`).modal({ backdrop: 'static', keyboard: false, show: true });
                    this.defer['opt'] = opt;
                    this.defer['event'] = event;
                    this.defer['fields'].push(this.field.getFieldDisplay(this.fieldMap[e]));
                    this.confirmChanges = false;
                }
            });
        }
        if (this.field.publish && this.confirmChanges) {
            setTimeout(() => {
                this.field.onItemSelect.emit({ value: opt['publishTag'], checked: event.target.checked });
            });
        }
    }
    confirmChange(doConfirm) {
        const fieldName = this.field['name'];
        jQuery(`#modal_${fieldName}`).modal('hide');
        this.confirmChanges = doConfirm;
        const defer = this.defer;
        this.defer = {};
        defer.event.target.checked = !doConfirm;
        this.onChange(defer.opt, defer.event, true);
    }
};
ToggleComponent = __decorate([
    core_1.Component({
        selector: 'toggle',
        template: `
    <div *ngIf="field.type == 'checkbox' && field.visible" [formGroup]='form'>
      <input type="checkbox" [checked]="field.value" name="{{field.name}}" [id]="field.name" [formControl]="getFormControl()" [attr.disabled]="field.editMode ? null : ''" (change)="onChange(field.options, $event)">
      <label for="{{ field.name }}" class="radio-label">{{ field.label }} <button *ngIf="field.editMode && field.help" type="button" class="btn btn-default" (click)="toggleHelp()" [attr.aria-label]="'help' | translate "><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span></button></label>
      <span id="{{ 'helpBlock_' + field.name }}" class="help-block" *ngIf="this.helpShow" [innerHtml]="field.help"></span>
    </div>
    <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="toggleComponent" aria-hidden="true" id="{{ 'modal_' + field.name }}">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{ field.confirmChangesLabel }}</h4>
            <p>{{ field.confirmChangesParagraphLabel }}</p>
            <p *ngFor="let f of defer.fields">
              <strong>{{f.label}}</strong><br/>
              {{f.valueLabel}}
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" (click)="confirmChange(true)">Yes</button>
            <button type="button" class="btn btn-primary" (click)="confirmChange(false)">No</button>
          </div>
        </div>
      </div>
    </div>
  `
    })
], ToggleComponent);
exports.ToggleComponent = ToggleComponent;
