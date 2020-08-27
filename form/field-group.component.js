"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const field_repeatable_component_1 = require("./field-repeatable.component");
let GenericGroupComponent = class GenericGroupComponent extends field_repeatable_component_1.EmbeddableComponent {
};
GenericGroupComponent.clName = 'GenericGroupComponent';
GenericGroupComponent = __decorate([
    core_1.Component({
        selector: 'generic-group-field',
        template: `
  <ng-container *ngIf="field.editMode">
    <div *ngIf="field.label">
      <label>
        {{field.label}} {{getRequiredLabelStr()}}
        <button type="button" class="btn btn-default" *ngIf="field.help" (click)="toggleHelp()" [attr.aria-label]="'help' | translate "><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span></button>
      </label>
      <span id="{{ 'helpBlock_' + field.name }}" class="help-block" *ngIf="this.helpShow" [innerHtml]="field.help">{{field.help}}</span>
    </div>
    <ng-container *ngIf="isEmbedded">
      <div [formGroup]='form' [ngClass]="field.cssClasses">
        <div class='row'>
          <div class="col-xs-11">
            <dmp-field *ngFor="let childField of field.fields" [name]="name" [index]="index" [field]="childField" [form]="form" [fieldMap]="fieldMap"></dmp-field>
          </div>
          <div class="col-xs-1">
            <button type='button' *ngIf="removeBtnText" [disabled]="!canRemove" (click)="onRemove($event)" [ngClass]="removeBtnClass" >{{removeBtnText}}</button>
            <button [disabled]="!canRemove" type='button' [ngClass]="removeBtnClass" (click)="onRemove($event)" [attr.aria-label]="'remove-button-label' | translate"></button>
          </div>
        </div>
      </div>
    </ng-container>
    <ng-container *ngIf="!isEmbedded">
      <div [formGroup]='form' [ngClass]="field.cssClasses">
        <dmp-field *ngFor="let field of field.fields" [field]="field" [form]="form" [fieldMap]="fieldMap"></dmp-field>
      </div>
    </ng-container>
  </ng-container>
  <ng-container *ngIf="!field.editMode">
    <div [formGroup]='form' [ngClass]="field.cssClasses">
      <dmp-field *ngFor="let fieldElem of field.fields" [field]="fieldElem" [form]="form" [fieldMap]="fieldMap"></dmp-field>
    </div>
  </ng-container>
  `,
    })
], GenericGroupComponent);
exports.GenericGroupComponent = GenericGroupComponent;
let RepeatableGroupComponent = class RepeatableGroupComponent extends field_repeatable_component_1.RepeatableComponent {
};
RepeatableGroupComponent.clName = 'RepeatableGroupComponent';
RepeatableGroupComponent = __decorate([
    core_1.Component({
        selector: 'repeatable-group',
        template: `
  <div *ngIf="field.editMode">
    <div *ngIf="field.label">
      <span class="label-font">
        {{field.label}} {{getRequiredLabelStr()}}
        <button type="button" class="btn btn-default" *ngIf="field.help" (click)="toggleHelp()" [attr.aria-label]="'help' | translate "><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span></button>
      </span>
      <span id="{{ 'helpBlock_' + field.name }}" class="help-block" *ngIf="this.helpShow" [innerHtml]="field.help">{{field.help}}</span>
    </div>
    <ng-container *ngFor="let fieldElem of field.fields; let i = index;" >
      <div class="row">
        <span class="col-xs-12">
          <generic-group-field [name]="field.name" [field]="fieldElem" [form]="form" [fieldMap]="fieldMap" [isEmbedded]="true" [removeBtnText]="field.removeButtonText" [removeBtnClass]="field.removeButtonClass" [canRemove]="field.fields.length > 1" (onRemoveBtnClick)="removeElem($event[0], $event[1])" [index]="i"></generic-group-field>
        </span>
      </div>
      <div class="row">
        <span class="col-xs-12">&nbsp;</span>
      </div>
    </ng-container>
    <div class="row">
      <span class="col-xs-11">&nbsp;
      </span>
      <span class="col-xs-1">
        <button *ngIf="field.addButtonText" type='button' (click)="addElem($event)" [ngClass]="field.addButtonTextClass" >{{field.addButtonText}}</button>
        <button *ngIf="!field.addButtonText" type='button' (click)="addElem($event)" [ngClass]="field.addButtonClass" [attr.aria-label]="'add-button-label' | translate"></button>
      </span>
    </div>
  </div>
  <li *ngIf="!field.editMode" class="key-value-pair">
    <span *ngIf="field.label" class="key">{{field.label}}</span>
    <span class="value">
      <ul class="key-value-list">
        <generic-group-field *ngFor="let fieldElem of field.fields; let i = index;" [name]="field.name" [index]="i" [field]="fieldElem" [form]="form" [fieldMap]="fieldMap"></generic-group-field>
      </ul>
    </span>
  </li>
  `,
    })
], RepeatableGroupComponent);
exports.RepeatableGroupComponent = RepeatableGroupComponent;
