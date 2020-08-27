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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const field_simple_component_1 = require("./field-simple.component");
const field_base_1 = require("./field-base");
const forms_1 = require("@angular/forms");
const _ = require("lodash");
const dashboard_service_1 = require("../dashboard-service");
class RelatedObjectSelectorField extends field_base_1.FieldBase {
    constructor(options, injector) {
        super(options, injector);
        this.relatedObjectSelected = new core_1.EventEmitter();
        this.resetSelectorEvent = new core_1.EventEmitter();
        this.clName = 'RelatedObjectDataField';
        this.columnTitle = options['columnTitle'] || "Record title";
        this.value = options['value'] || this.setEmptyValue();
        this.recordType = options['recordType'];
        this.dashboardService = this.getFromInjector(dashboard_service_1.DashboardService);
        var that = this;
        this.dashboardService.getAllRecordsCanEdit(this.recordType, '').then((draftPlans) => {
            this.plans = draftPlans;
        });
    }
    recordSelected(record, config) {
        this.setValue({ oid: record.oid, title: record.title });
        if (this.fieldMap) {
            this.fieldMap._rootComp.setRelatedRecordId(record.oid);
        }
    }
    recordSelectedEmit(record, event) {
        this.setValue({ oid: record.oid, title: record.title });
        if (this.fieldMap) {
            this.fieldMap._rootComp.setRelatedRecordId(record.oid);
        }
        this.relatedObjectSelected.emit(record.oid);
    }
    resetSelector() {
        this.setEmptyValue();
        if (this.fieldMap) {
            this.fieldMap._rootComp.setRelatedRecordId(null);
        }
        this.resetSelectorEvent.emit();
    }
    createFormModel(valueElem = undefined) {
        if (valueElem) {
            this.value = valueElem;
        }
        this.formModel = new forms_1.FormControl(this.value || []);
        if (this.value) {
            this.setValue(this.value);
            if (this.fieldMap) {
                this.fieldMap._rootComp.setRelatedRecordId(this.value.oid);
            }
        }
        return this.formModel;
    }
    setValue(value) {
        this.value = value;
        this.formModel.patchValue(value, { emitEvent: false });
        this.formModel.markAsTouched();
    }
    setEmptyValue() {
        this.value = {};
        return this.value;
    }
    onFilterChange() {
        this.filteredPlans = _.filter(this.plans.items, (plan) => {
            plan.selected = false;
            const title = _.isArray(plan.title) ? plan.title[0] : plan.title;
            return _.toLower(title).includes(_.toLower(this.searchFilterName));
        });
    }
    resetFilter() {
        this.searchFilterName = null;
        this.onFilterChange();
    }
}
exports.RelatedObjectSelectorField = RelatedObjectSelectorField;
let RelatedObjectSelectorComponent = class RelatedObjectSelectorComponent extends field_simple_component_1.SimpleComponent {
    hasFilteredResults() {
        return this.field.searchFilterName && !_.isEmpty(_.trim(this.field.searchFilterName)) && this.field.filteredPlans && this.field.filteredPlans.length > 0;
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", RelatedObjectSelectorField)
], RelatedObjectSelectorComponent.prototype, "field", void 0);
RelatedObjectSelectorComponent = __decorate([
    core_1.Component({
        selector: 'rb-RelatedObjectSelector',
        templateUrl: './field-relatedobjectselector.html'
    })
], RelatedObjectSelectorComponent);
exports.RelatedObjectSelectorComponent = RelatedObjectSelectorComponent;
