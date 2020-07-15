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
const angular_tree_component_1 = require("angular-tree-component");
let TreeNodeCheckboxComponent = class TreeNodeCheckboxComponent {
};
__decorate([
    core_1.Input(),
    __metadata("design:type", typeof (_a = typeof angular_tree_component_1.TreeNode !== "undefined" && angular_tree_component_1.TreeNode) === "function" ? _a : Object)
], TreeNodeCheckboxComponent.prototype, "node", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], TreeNodeCheckboxComponent.prototype, "ariaLabel", void 0);
TreeNodeCheckboxComponent = __decorate([
    core_1.Component({
        selector: 'rb-tree-node-checkbox',
        encapsulation: core_1.ViewEncapsulation.None,
        styles: [],
        template: `
    <ng-container *mobxAutorun="{dontDetach: true}">
      <input
        class="tree-node-checkbox"
        type="checkbox"
        [attr.aria-label]="ariaLabel" 
        (click)="node.mouseAction('checkboxClick', $event)"
        [checked]="node.isSelected"
        [indeterminate]="node.isPartiallySelected"/>
    </ng-container>
  `
    })
], TreeNodeCheckboxComponent);
exports.TreeNodeCheckboxComponent = TreeNodeCheckboxComponent;
