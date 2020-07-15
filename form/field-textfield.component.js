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
const field_base_1 = require("./field-base");
const field_repeatable_component_1 = require("./field-repeatable.component");
class TextField extends field_base_1.FieldBase {
    constructor(options, injector) {
        super(options, injector);
        this.type = options['type'] || '';
        this.controlType = 'textbox';
        this.cssClasses = _.isEmpty(this.cssClasses) ? 'form-control' : this.cssClasses;
    }
    postInit(value) {
        if (_.isEmpty(value)) {
            this.value = this.defaultValue ? this.defaultValue : '';
        }
        else {
            this.value = value;
        }
    }
}
exports.TextField = TextField;
class MarkdownTextArea extends field_base_1.FieldBase {
    constructor(options, injector) {
        super(options, injector);
        this.rows = options['rows'] || 5;
        this.cols = options['cols'] || null;
        this.controlType = 'textarea';
        if (_.isUndefined(this.value)) {
            this.value = "";
        }
    }
    formatValueForDisplay() {
        this.lines = this.value ? this.value.split("\n") : [];
    }
}
exports.MarkdownTextArea = MarkdownTextArea;
class TextArea extends field_base_1.FieldBase {
    constructor(options, injector) {
        super(options, injector);
        this.rows = options['rows'] || 5;
        this.cols = options['cols'] || null;
        this.controlType = 'textarea';
        this.cssClasses = _.isEmpty(this.cssClasses) ? 'form-control' : this.cssClasses;
    }
    formatValueForDisplay() {
        this.lines = this.value ? this.value.split("\n") : [];
    }
}
exports.TextArea = TextArea;
let TextFieldComponent = class TextFieldComponent extends field_repeatable_component_1.EmbeddableComponent {
};
TextFieldComponent = __decorate([
    core_1.Component({
        selector: 'textfield',
        template: `
  <div *ngIf="field.editMode && field.visible" [ngClass]="getGroupClass()">
    <div *ngIf="!isEmbedded" >
      <label [attr.for]="field.name">
        {{field.label}} {{ getRequiredLabelStr() }}
        <button type="button" class="btn btn-default" *ngIf="field.help" (click)="toggleHelp()" [attr.aria-label]="'help' | translate "><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span></button>
        <span id="{{ 'helpBlock_' + field.name }}" class="help-block" *ngIf="this.helpShow" [innerHtml]="field.help"></span>
      </label>
      <input [formGroup]='form' [formControl]="getFormControl()"  [id]="field.name" [type]="field.type" [readonly]="field.readOnly" [ngClass]="field.cssClasses" [attr.aria-label]="''" >
    </div>
    <div *ngIf="isEmbedded" class="input-group padding-bottom-15">
      <input [formControl]="getFormControl(name, index)"  [id]="field.name" [type]="field.type" [readonly]="field.readOnly" [ngClass]="field.cssClasses" [attr.aria-labelledby]="name">
      <span class="input-group-btn">
        <button type='button' *ngIf="removeBtnText" [disabled]="!canRemove" (click)="onRemove($event)" [ngClass]="removeBtnClass" >{{removeBtnText}}</button>
        <button [disabled]="!canRemove" type='button' [ngClass]="removeBtnClass" (click)="onRemove($event)" [attr.aria-label]="'remove-button-label' | translate"></button>
      </span>
    </div>
    <div *ngIf="field.required && (field.label || (field.validationMessages && field.validationMessages.required))" [style.visibility]="getFormControl() && getFormControl().hasError('required') && getFormControl().touched ? 'inherit':'hidden'">
      <div class="text-danger" *ngIf="!field.validationMessages?.required">{{field.label}} is required</div>
      <div class="text-danger" *ngIf="field.validationMessages?.required">{{field.validationMessages.required}}</div>
    </div>
  </div>
  <div *ngIf="!field.editMode && field.visible" class="key-value-pair">
    <span class="key" *ngIf="field.label">{{field.label}}</span>
    <span class="value">{{field.value}}</span>
  </div>
  `,
    })
], TextFieldComponent);
exports.TextFieldComponent = TextFieldComponent;
let RepeatableTextfieldComponent = class RepeatableTextfieldComponent extends field_repeatable_component_1.RepeatableComponent {
    ngOnInit() {
    }
    addElem(event) {
        const newElem = this.field.addElem();
    }
    removeElem(event, i) {
        this.field.removeElem(i);
    }
};
RepeatableTextfieldComponent.clName = 'RepeatableTextfieldComponent';
RepeatableTextfieldComponent = __decorate([
    core_1.Component({
        selector: 'repeatable-textfield',
        template: `
  <div *ngIf="field.editMode">
    <div class="row">
      <div class="col-xs-12">
      <span class="label-font" [id]="field.name">
        {{field.label}} {{ getRequiredLabelStr() }}
        <button type="button" class="btn btn-default" *ngIf="field.help" (click)="toggleHelp()" [attr.aria-label]="'help' | translate "><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span></button>
      </span>
      <span id="{{ 'helpBlock_' + field.name }}" class="help-block" *ngIf="this.helpShow" [innerHtml]="field.help"></span>
      </div>
    </div>
    <div *ngFor="let fieldElem of field.fields; let i = index;" class="row">
      <span class="col-xs-12">
        <textfield [name]="field.name" [field]="fieldElem" [form]="form" [fieldMap]="fieldMap" [isEmbedded]="true" [removeBtnText]="field.removeButtonText" [removeBtnClass]="field.removeButtonClass" [canRemove]="field.fields.length > 1" (onRemoveBtnClick)="removeElem($event[0], $event[1])" [index]="i"></textfield>
      </span>
    </div>
    <div class="row">
      <div class="col-xs-12" *ngIf="field.required && !field.delegateErrorHandling && (field.label || (field.validationMessages && field.validationMessages.required))" [style.visibility]="getFormControl() && hasRequiredError() && getFormControl().touched ? 'inherit':'hidden'">
        <div class="text-danger" *ngIf="!field.validationMessages?.required">{{field.label}} is required</div>
        <div class="text-danger" *ngIf="field.validationMessages?.required">{{field.validationMessages.required}}</div>
      </div>
    </div>
    <div class="row">
      <span class="col-xs-12">
        <button *ngIf="field.addButtonText" type='button' (click)="addElem($event)" [ngClass]="field.addButtonTextClass" >{{field.addButtonText}}</button>
        <button *ngIf="!field.addButtonText" type='button' (click)="addElem($event)" [ngClass]="field.addButtonClass" [attr.aria-label]="'add-button-label' | translate"></button>
      </span>
    </div>
  </div>
  <li *ngIf="!field.editMode" class="key-value-pair">
    <span *ngIf="field.label" class="key">{{field.label}}</span>
    <span class="value">
      <ul class="key-value-list">
        <textfield *ngFor="let fieldElem of field.fields; let i = index;"  [field]="fieldElem" [form]="form" [fieldMap]="fieldMap"></textfield>
      </ul>
    </span>
  </li>
  `,
    })
], RepeatableTextfieldComponent);
exports.RepeatableTextfieldComponent = RepeatableTextfieldComponent;
let TextAreaComponent = class TextAreaComponent extends field_repeatable_component_1.EmbeddableComponent {
    ngOnInit() {
        if (!this.field.editMode) {
            this.field.formatValueForDisplay();
        }
    }
};
TextAreaComponent = __decorate([
    core_1.Component({
        selector: 'text-area',
        template: `
  <div *ngIf="field.editMode" [formGroup]='form' [ngClass]="getGroupClass()">
    <label [attr.for]="field.name">
      {{field.label}} {{ getRequiredLabelStr()}}
      <button type="button" class="btn btn-default" *ngIf="field.help" (click)="toggleHelp()" [attr.aria-label]="'help' | translate "><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span></button>
    </label>
    <!-- Normal version -->
    <ng-container *ngIf="!field.isEmbedded">
      <ng-container *ngIf="this.helpShow">
        <br/>
        <span id="{{ 'helpBlock_' + field.name }}" class="help-block" [innerHtml]="field.help"></span>
      </ng-container>
      <textarea [formControl]="getFormControl()"  [attr.rows]="field.rows" [attr.cols]="field.cols" [id]="field.name" [ngClass]="field.cssClasses" >{{field.value}}</textarea>
    </ng-container>
    <!-- Embedded version -->
    <div *ngIf="isEmbedded" class="input-group padding-bottom-15">
      <textarea [formControl]="getFormControl(name, index)"  [attr.rows]="field.rows" [attr.cols]="field.cols" [id]="field.name" [ngClass]="field.cssClasses">{{field.value}}</textarea>
    </div>
    <!-- Validation messages -->
    <div *ngIf="field.required" [style.visibility]="getFormControl() && getFormControl().hasError('required') && getFormControl().touched ? 'inherit':'hidden'">
      <div class="text-danger" *ngIf="getFormControl().hasError('required') && getFormControl().touched && !field.validationMessages?.required">{{field.label}} is required</div>
      <div class="text-danger" *ngIf="getFormControl().hasError('required') && getFormControl().touched && field.validationMessages?.required">{{field.validationMessages.required}}</div>
    </div>
  </div>
  <li *ngIf="!field.editMode" class="key-value-pair">
    <span class="key" *ngIf="field.label">{{field.label}}</span>
    <span *ngFor="let line of field.lines">
      {{line}}
      <br/>
    </span>

  </li>
  `
    })
], TextAreaComponent);
exports.TextAreaComponent = TextAreaComponent;
let MarkdownTextAreaComponent = class MarkdownTextAreaComponent extends field_repeatable_component_1.EmbeddableComponent {
    ngOnInit() {
        if (!this.field.editMode) {
            this.field.formatValueForDisplay();
        }
    }
};
MarkdownTextAreaComponent = __decorate([
    core_1.Component({
        selector: 'markdown-text-area',
        template: `
  <div *ngIf="field.editMode" [formGroup]='form' class="form-group">
    <label [attr.for]="field.name">
      {{field.label}} {{ getRequiredLabelStr()}}
      <button type="button" class="btn btn-default" *ngIf="field.help" (click)="toggleHelp()" [attr.aria-label]="'help' | translate "><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span></button>
    </label><br/>
    <span id="{{ 'helpBlock_' + field.name }}" class="help-block" *ngIf="this.helpShow" [innerHtml]="field.help"></span>
    <textarea [formControl]="getFormControl()"  [attr.rows]="field.rows" [attr.cols]="field.cols" [id]="field.name" class="form-control" [(ngModel)]="field.value"></textarea>
    <div *ngIf="field.value" style='font-weight:bold'>Preview</div>
    <markdown [data]="field.value"></markdown>
    <div class="text-danger" *ngIf="getFormControl().hasError('required') && getFormControl().touched && !field.validationMessages?.required">{{field.label}} is required</div>
    <div class="text-danger" *ngIf="getFormControl().hasError('required') && getFormControl().touched && field.validationMessages?.required">{{field.validationMessages.required}}</div>
  </div>
  <li *ngIf="!field.editMode" class="key-value-pair">
    <span class="key" *ngIf="field.label">{{field.label}}</span>
    <markdown *ngIf="field.value" [data]="field.value"></markdown>
    <br/>
  </li>
  `
    })
], MarkdownTextAreaComponent);
exports.MarkdownTextAreaComponent = MarkdownTextAreaComponent;
