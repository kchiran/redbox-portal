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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const field_simple_component_1 = require("./field-simple.component");
const field_simple_1 = require("./field-simple");
const forms_1 = require("@angular/forms");
const _ = require("lodash");
class RepeatableContainer extends field_simple_1.Container {
    constructor(options, injector) {
        super(options, injector);
        this.hasGroup = true;
        this.addButtonText = options['addButtonText'] || '';
        this.removeButtonText = options['removeButtonText'] || null;
        this.skipClone = options['skipClone'] || [];
        this.forceClone = options['forceClone'] || [];
        this.addButtonTextClass = options['addButtonTextClass'] || 'btn btn-success pull-right';
        this.addButtonClass = options['addButtonClass'] || 'fa fa-plus-circle btn text-20 pull-right btn-success';
        this.removeButtonTextClass = options['removeButtonTextClass'] || 'btn btn-danger pull-right';
        this.removeButtonClass = options['removeButtonClass'] || 'fa fa-minus-circle btn text-20 pull-right btn-danger';
        this.moveUpButtonClass = options['addButtonClass'] || 'fa fa-chevron-circle-up btn text-20 pull-left btn-primary';
        this.moveDownButtonClass = options['addButtonClass'] || 'fa fa-chevron-circle-down btn text-20 pull-left btn-primary';
        this.delegateErrorHandling = !_.isUndefined(options['delegateErrorHandling']) ? options['delegateErrorHandling'] : true;
    }
    getInitArrayEntry() {
        if (this.fields[0].isGroup) {
            const grp = {};
            const fm = {};
            const fg = this.fields[0].getGroup(grp, fm);
            return [fg];
        }
        return [this.fields[0].createFormModel()];
    }
    getGroup(group, fieldMap) {
        this.fieldMap = fieldMap;
        fieldMap[this.name] = { field: this };
        if (!this.value || this.value.length == 0) {
            this.formModel = this.required ? new forms_1.FormArray(this.getInitArrayEntry(), forms_1.Validators.required) : new forms_1.FormArray(this.getInitArrayEntry());
        }
        else {
            let fieldCtr = 0;
            const baseField = this.fields[0];
            const elems = [];
            this.fields = _.map(this.value, (valueElem) => {
                let fieldClone = null;
                if (fieldCtr == 0) {
                    fieldClone = baseField;
                    fieldClone.value = _.isArray(valueElem) ? valueElem[fieldCtr] : valueElem;
                }
                else {
                    fieldClone = this.createNewElem(baseField, _.isArray(valueElem) ? valueElem[fieldCtr] : valueElem);
                    fieldClone.value = _.isArray(valueElem) ? valueElem[fieldCtr] : valueElem;
                }
                fieldCtr++;
                elems.push(fieldClone.createFormModel());
                return fieldClone;
            });
            this.formModel = this.required ? new forms_1.FormArray(elems, forms_1.Validators.required) : new forms_1.FormArray(elems);
            _.each(this.fields, f => {
                f.setupEventHandlers();
            });
        }
        fieldMap[this.name].control = this.formModel;
        if (this.groupName) {
            if (group[this.groupName]) {
                group[this.groupName].addControl(this.name, this.formModel);
            }
            else {
                const fg = {};
                fg[this.name] = this.formModel;
                group[this.groupName] = fg;
            }
        }
        else {
            group[this.name] = this.formModel;
        }
    }
    createNewElem(baseFieldInst, value = null) {
        const newOpts = _.cloneDeep(baseFieldInst.options);
        newOpts.value = value;
        const newInst = new baseFieldInst.constructor(newOpts, this.injector);
        _.forEach(this.skipClone, (f) => {
            newInst[f] = null;
        });
        _.forEach(this.forceClone, (f) => {
            if (_.isString(f)) {
                newInst[f] = _.cloneDeepWith(baseFieldInst[f], this.getCloneCustomizer({
                    skipClone: ['fields', 'fieldMap', 'formModel', 'injector', 'onValueUpdate', 'onValueLoaded', 'translationService', 'utilityService', 'componentReactors'],
                    copy: ['fieldMap', 'injector', 'translationService', 'utilityService']
                }));
            }
            else {
                newInst[f.field] = _.cloneDeepWith(baseFieldInst[f.field], this.getCloneCustomizer(f));
            }
        });
        if (_.isFunction(newInst.postInit)) {
            newInst.postInit(value);
        }
        return newInst;
    }
    getCloneCustomizer(cloneOpts) {
        const that = this;
        return function (value, key) {
            if (_.includes(cloneOpts.skipClone, key)) {
                if (_.includes(cloneOpts.copy, key)) {
                    return that[key];
                }
                return false;
            }
        };
    }
    addElem(val = null) {
        const newElem = this.createNewElem(this.fields[0], val);
        if (val == null && _.isFunction(newElem.setEmptyValue)) {
            newElem.setEmptyValue();
        }
        this.fields.push(newElem);
        const newFormModel = newElem.createFormModel();
        this.formModel.push(newFormModel);
        return newElem;
    }
    removeElem(index) {
        _.remove(this.fields, (val, idx) => { return idx == index; });
        this.formModel.removeAt(index);
    }
    swap(fromIdx, toIdx) {
        let temp = this.fields[toIdx];
        this.fields[toIdx] = this.fields[fromIdx];
        this.fields[fromIdx] = temp;
        temp = this.formModel.at(toIdx);
        this.formModel.setControl(toIdx, this.formModel.at(fromIdx));
        this.formModel.setControl(fromIdx, temp);
    }
    setValueAtElem(index, value) {
        this.fields[index].setValue(value, true);
    }
    triggerValidation() {
        _.forEach(this.fields, (f) => {
            f.triggerValidation();
        });
    }
    reactEvent(eventName, eventData, origData) {
        console.log(`Repeatable container field reacting: ${eventName}`);
        console.log(eventData);
        for (let toDelIdx = 1; toDelIdx < this.fields.length; toDelIdx++) {
            this.removeElem(toDelIdx);
        }
        _.each(eventData, (entry, idx) => {
            if (idx >= this.formModel.controls.length) {
                this.addElem(entry);
            }
            else {
                this.setValueAtElem(idx, entry);
            }
        });
    }
    removeAllElems() {
        _.each(this.fields, (f, idx) => {
            this.removeElem(idx);
        });
    }
    reset(data = null, eventConfig = null) {
        this.fields[0].setValue(null);
        if (this.fields.length > 1) {
            for (var i = 1; i < this.fields.length; i++) {
                this.removeElem(i);
            }
        }
        return data;
    }
}
exports.RepeatableContainer = RepeatableContainer;
class EmbeddableComponent extends field_simple_component_1.SimpleComponent {
    constructor() {
        super(...arguments);
        this.canRemove = false;
        this.removeBtnText = null;
        this.removeBtnClass = 'btn fa fa-minus-circle btn text-20 pull-left btn btn-danger';
        this.onRemoveBtnClick = new core_1.EventEmitter();
    }
    onRemove(event) {
        this.onRemoveBtnClick.emit([event, this.index]);
    }
    getGroupClass(fldName = null) {
        let baseClass = 'form-group';
        if (this.isEmbedded) {
            baseClass = '';
        }
        return `${baseClass} ${this.hasRequiredError() ? 'has-error' : ''} ${this.field.groupClasses}`;
    }
}
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], EmbeddableComponent.prototype, "canRemove", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], EmbeddableComponent.prototype, "removeBtnText", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], EmbeddableComponent.prototype, "removeBtnClass", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], EmbeddableComponent.prototype, "index", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", typeof (_a = typeof core_1.EventEmitter !== "undefined" && core_1.EventEmitter) === "function" ? _a : Object)
], EmbeddableComponent.prototype, "onRemoveBtnClick", void 0);
exports.EmbeddableComponent = EmbeddableComponent;
class RepeatableComponent extends field_simple_component_1.SimpleComponent {
    addElem(event) {
        this.field.addElem();
    }
    removeElem(event, i) {
        this.field.removeElem(i);
    }
    hasRequiredError() {
        let hasError = false;
        _.each(this.field.formModel.controls, (c) => {
            if (c.hasError('required')) {
                hasError = true;
                return false;
            }
        });
        return hasError;
    }
}
exports.RepeatableComponent = RepeatableComponent;
class RepeatableVocab extends RepeatableContainer {
    constructor(options, injector) {
        super(options, injector);
        this.clName = 'RepeatableVocab';
    }
    setValueAtElem(index, value) {
        console.log(`Repeatable vocab setting value at: ${index}`);
        console.log(value);
        let selected = {};
        selected['originalObject'] = value;
        this.fields[index].component.onSelect(selected, false, true);
    }
}
exports.RepeatableVocab = RepeatableVocab;
let RepeatableVocabComponent = class RepeatableVocabComponent extends RepeatableComponent {
};
RepeatableVocabComponent.clName = 'RepeatableVocabComponent';
RepeatableVocabComponent = __decorate([
    core_1.Component({
        selector: 'repeatable-vocab',
        template: `
  <div *ngIf="field.editMode">
    <div class="row">
      <div class="col-xs-12">
      <label [attr.for]="field.name">{{field.label}}
        <button type="button" class="btn btn-default" *ngIf="field.help" (click)="toggleHelp()" [attr.aria-label]="'help' | translate "><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span></button>
      </label>
      <span id="{{ 'helpBlock_' + field.name }}" class="help-block" *ngIf="this.helpShow" [innerHtml]="field.help"></span>
      </div>
    </div>
    <div *ngFor="let fieldElem of field.fields; let i = index;" class="row">
      <span class="col-xs-12">
        <rb-vocab [name]="field.name" [field]="fieldElem" [form]="form" [fieldMap]="fieldMap" [isEmbedded]="true" [removeBtnText]="field.removeButtonText" [removeBtnClass]="field.removeButtonClass" [canRemove]="field.fields.length > 1" (onRemoveBtnClick)="removeElem($event[0], $event[1])" [index]="i"></rb-vocab>
      </span>
    </div>
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
        <rb-vocab *ngFor="let fieldElem of field.fields; let i = index;" [field]="fieldElem" [form]="form" [fieldMap]="fieldMap"></rb-vocab>
      </ul>
    </span>
  </li>
  `,
    })
], RepeatableVocabComponent);
exports.RepeatableVocabComponent = RepeatableVocabComponent;
class RepeatableContributor extends RepeatableContainer {
    constructor(options, injector) {
        super(options, injector);
        this.canSort = _.isUndefined(options['canSort']) ? false : options['canSort'];
    }
    setValueAtElem(index, value) {
        this.fields[index].component.onSelect(value, false, true);
    }
    addElem(val = null) {
        this.fields[0].setMissingFields(val);
        return super.addElem(val);
    }
}
exports.RepeatableContributor = RepeatableContributor;
let RepeatableContributorComponent = class RepeatableContributorComponent extends RepeatableComponent {
    ngOnInit() {
        this.field.fields[0]['showHeader'] = false;
        this.field.fields[0].marginTop = this.field.fields[0].baseMarginTop;
        this.field.fields[0].componentReactors.push(this);
    }
    addElem(event) {
        const newElem = this.field.addElem();
        newElem.marginTop = '0px';
        newElem.vocabField.initialValue = null;
        newElem.setupEventHandlers();
        newElem.showHeader = false;
        newElem.componentReactors.push(this);
    }
    removeElem(event, i) {
        this.field.removeElem(i);
        if (i == 0) {
            this.field.fields[0].marginTop = this.field.fields[0].baseMarginTop;
        }
    }
    reactEvent(eventName, eventData, origData, elem) {
        if (this.field.fields.length > 0) {
            elem.marginTop = '0px';
            elem.vocabField.initialValue = eventData;
            elem.setupEventHandlers();
            elem.componentReactors.push(this);
        }
    }
    moveUp(event, i) {
        const newIdx = i - 1;
        if (newIdx >= 0) {
            this.field.swap(i, newIdx);
            if (newIdx == 0) {
                this.field.fields[i].marginTop = '';
                this.field.fields[newIdx].marginTop = this.field.fields[newIdx].baseMarginTop;
            }
        }
    }
    moveDown(event, i) {
        const newIdx = i + 1;
        if (newIdx < this.field.fields.length) {
            this.field.swap(i, newIdx);
            if (i == 0) {
                this.field.fields[i].marginTop = this.field.fields[i].baseMarginTop;
                this.field.fields[newIdx].marginTop = '';
            }
        }
    }
};
RepeatableContributorComponent = __decorate([
    core_1.Component({
        selector: 'repeatable-contributor',
        template: `
  <div *ngIf="field.editMode">
    <div class="row" *ngIf="field.fields[0].label">
      <div class="col-xs-12">
        <span class="label-font">
          {{field.fields[0].label}} {{getRequiredLabelStr()}}
          <button type="button" class="btn btn-default" *ngIf="field.fields[0].help" (click)="toggleHelp()" [attr.aria-label]="'help' | translate "><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span></button>
        </span>
      </div>
    </div>
    <div class="row"  *ngIf="this.helpShow">
      <span id="{{ 'helpBlock_' + field.name }}" class="col-xs-12 help-block" [innerHtml]="field.fields[0].help"></span>
    </div>
    <div *ngFor="let fieldElem of field.fields; let i = index;" class="row">
      <span class="col-xs-10">
        <rb-contributor [field]="fieldElem" [form]="form" [fieldMap]="fieldMap" [isEmbedded]="true"></rb-contributor>
      </span>
      <span class="col-xs-2">
        <button type='button' *ngIf="field.fields.length > 1 && field.canSort"  (click)="moveUp($event, i)" [ngClass]="field.moveUpButtonClass" [ngStyle]="{'margin-top': fieldElem.marginTop}" [attr.aria-label]="'move-up-button' | translate"></button>
        <button type='button' *ngIf="field.fields.length > 1 && field.canSort"  (click)="moveDown($event, i)" [ngClass]="field.moveDownButtonClass" [ngStyle]="{'margin-top': fieldElem.marginTop}" [attr.aria-label]="'move-down-button' | translate"></button>
        <button type='button' *ngIf="field.fields.length > 1 && field.removeButtonText" (click)="removeElem($event, i)"  [ngClass]="field.removeButtonTextClass" [ngStyle]="{'margin-top': fieldElem.marginTop}" >{{field.removeButtonText}}</button>
        <button type='button' *ngIf="field.fields.length > 1 && !field.removeButtonText" (click)="removeElem($event, i)" [ngClass]="field.removeButtonClass" [ngStyle]="{'margin-top': fieldElem.marginTop}" [attr.aria-label]="'remove-button-label' | translate" ></button>
      </span>
    </div>
    <div class="row">
      <span class="col-xs-12">
        <button *ngIf="field.addButtonText" type='button' (click)="addElem($event)" [ngClass]="field.addButtonTextClass" >{{field.addButtonText}}</button>
        <button *ngIf="!field.addButtonText" type='button' (click)="addElem($event)" [ngClass]="field.addButtonClass" [attr.aria-label]="'add-button-label' | translate" ></button>
      </span>
    </div>
  </div>
  <ng-container  *ngIf="!field.editMode">
    <div class="view-contributor">
      <div *ngIf="field.fields[0].label" class="row">
        <div class="col-xs-12 key-value-pair"><span class="key">{{field.fields[0].label}}</span></div>
      </div>
      <div class="row view-contributor">
        <div class="col-xs-3 label-font">{{field.fields[0].nameColHdr}}</div>
        <div class="col-xs-3 label-font">{{field.fields[0].emailColHdr}}</div>
        <div class="col-xs-3 label-font">{{field.fields[0].roleColHdr}}</div>
        <div class="col-xs-3 label-font">{{field.fields[0].orcidColHdr}}</div>
      </div>
      <div class="row view-contributor" *ngFor="let fieldElem of field.fields; let i = index;">
        <div class="col-xs-3">{{fieldElem.value.text_full_name}}</div>
        <div class="col-xs-3">{{fieldElem.value.email}}</div>
        <div class="col-xs-3">{{fieldElem.value.role}}</div>
        <div class="col-xs-3">{{fieldElem.value.orcid}}</div>
      </div>
    </div>
  </ng-container>
  `,
    })
], RepeatableContributorComponent);
exports.RepeatableContributorComponent = RepeatableContributorComponent;
