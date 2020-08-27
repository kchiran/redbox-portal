"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const field_simple_component_1 = require("./field-simple.component");
const field_base_1 = require("./field-base");
const records_service_1 = require("./records.service");
class ActionButton extends field_base_1.FieldBase {
    constructor(options, injector) {
        super(options, injector);
        this.submitting = false;
        this.targetAction = options['targetAction'] || null;
        this.recordService = this.getFromInjector(records_service_1.RecordsService);
        this.value = options['value'] || null;
    }
    setValue(value) {
        this.value = value;
        this.formModel.patchValue(value, { emitEvent: true, emitModelToViewChange: true });
        this.formModel.markAsTouched();
    }
}
exports.ActionButton = ActionButton;
let ActionButtonComponent = class ActionButtonComponent extends field_simple_component_1.SimpleComponent {
    executeAction(event) {
        this.field.submitting = true;
        let that = this;
        this.field.recordService.executeAction(this.field.targetAction, { oid: this.field.fieldMap._rootComp.oid })
            .then(function (response) {
            that.field.submitting = false;
            that.field.setValue("http://203.101.227.135:5000/dataset/" + that.field.fieldMap._rootComp.oid);
            that.fieldMap._rootComp.onSubmit().subscribe();
        });
    }
    isDisabled() {
        return false;
    }
};
ActionButtonComponent = __decorate([
    core_1.Component({
        selector: 'action-button',
        template: `
  <div *ngIf="field.editMode">
    <div *ngIf="field.value">Record published to CKAN at <a target="_blank" [attr.href]="field.value">{{ field.value }}</a></div>
    <div *ngIf="!field.value"><button *ngIf="!field.submitting" type="{{field.type}}" [ngClass]="field.cssClasses" (click)="executeAction($event)" [disabled]="isDisabled()">{{field.label}}</button><span *ngIf="field.submitting">Submitting to CKAN</span>
    </div>
    <div [formGroup]='form'>
    <input [formControl]="getFormControl()"  [id]="field.name" name="{{field.name}}" type="hidden" />
    </div>
  </div>
  <div *ngIf="!field.editMode">
    <div *ngIf="field.value">Record published to CKAN at <a target="_blank" [attr.href]="field.value">{{ field.value }}</a></div>
    <div *ngIf="!field.value">Record not yet published</div>
  </div>
  `,
    })
], ActionButtonComponent);
exports.ActionButtonComponent = ActionButtonComponent;
