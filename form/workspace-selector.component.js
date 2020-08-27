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
const _ = require("lodash");
let WorkspaceSelectorComponent = class WorkspaceSelectorComponent extends field_simple_component_1.SimpleComponent {
    getLabel(val) {
        const opt = _.find(this.field.options, (opt) => {
            return opt.value == val;
        });
        if (opt) {
            return opt.label;
        }
        else {
            return '';
        }
    }
};
WorkspaceSelectorComponent.clName = 'WorkspaceSelectorComponent';
WorkspaceSelectorComponent = __decorate([
    core_1.Component({
        selector: 'workspace-selector-parent',
        template: ''
    })
], WorkspaceSelectorComponent);
exports.WorkspaceSelectorComponent = WorkspaceSelectorComponent;
let WorkspaceSelectorFieldComponent = class WorkspaceSelectorFieldComponent extends WorkspaceSelectorComponent {
    ngOnInit() {
        this.field.init();
        this.field.registerEvents();
    }
    saveAndOpenWorkspace() {
        this.fieldMap._rootComp.onSubmit().subscribe(response => {
            window.location.href = `${this.field.appLink}${this.field.workspaceApp.name}/edit?rdmp=${this.field.rdmp}`;
        });
    }
};
WorkspaceSelectorFieldComponent.clName = 'WorkspaceSelectorFieldComponent';
WorkspaceSelectorFieldComponent = __decorate([
    core_1.Component({
        selector: 'workspace-selector',
        template: `
  <div [formGroup]='form' *ngIf="field.editMode" [ngClass]="getGroupClass()">
  <label [attr.for]="field.name">
    {{field.label}} {{ getRequiredLabelStr()}}
    <button type="button" class="btn btn-default" *ngIf="field.help" (click)="toggleHelp()" [attr.aria-label]="'help' | translate "><span
      class="glyphicon glyphicon-question-sign" aria-hidden="true"></span></button>
  </label>
  <br/>
  <span id="{{ 'helpBlock_' + field.name }}" class="help-block" *ngIf="this.helpShow" [innerHtml]="field.help"></span>
  <select [id]="field.name" [ngClass]="field.cssClasses"
          (change)="field.loadWorkspaceDetails($event.target.value)">
    <option *ngFor="let opt of field.workspaceApps; let i = index"
     [ngValue]="opt" [selected]="i == 0"
     [value]="opt.name">{{opt.label}}
    </option>
  </select>
  <br/><br/><br/>
  <div class="row">
    <div *ngIf="field.workspaceApp" class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">{{ field.workspaceApp.name | uppercase }}</h4>
      </div>
      <div class="panel-body">
        <div class="row">
          <div class="col-md-8 col-sm-8 col-xs-8 col-lg-8">
            <h5>{{ field.workspaceApp.subtitle }}</h5>
            <span *ngIf="field.rdmp">
              <p>{{ field.workspaceApp.description }}</p>
              <button (click)="saveAndOpenWorkspace()"  class="btn btn-primary">{{ field.open }}</button>
            </span>
            <span *ngIf="!field.rdmp">
              <p class="text-danger">
                <strong>{{ field.saveFirst }}</strong>
              </p>
            </span>
          </div>
          <div class="col-md-4 col-sm-4 col-xs-4 col-lg-4">
            <img src="{{ field.workspaceApp.logo }}" alt="{{field.workspaceApp.name}}">
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  `,
    })
], WorkspaceSelectorFieldComponent);
exports.WorkspaceSelectorFieldComponent = WorkspaceSelectorFieldComponent;
