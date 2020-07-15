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
const _ = require("lodash");
const records_service_1 = require("./records.service");
class PublishDataLocationSelectorField extends field_base_1.FieldBase {
    constructor(options, injector) {
        super(options, injector);
        this.newLocation = { type: "url", location: "", notes: "" };
        this.dataTypes = [{
                'label': 'URL',
                'value': 'url',
            },
            {
                'label': 'Physical location',
                'value': 'physical',
            },
            {
                'label': 'File path',
                'value': 'file',
            },
            {
                'label': 'Attachment',
                'value': 'attachment'
            }
        ];
        this.dataTypeLookup = {
            'url': "URL",
            'physical': "Physical location",
            'attachment': "Attachment",
            'file': "File path"
        };
        this.accessDeniedObjects = [];
        this.columns = options['columns'] || [];
        this.editNotesButtonText = this.getTranslated(options['editNotesButtonText'], 'Edit');
        this.editNotesTitle = this.getTranslated(options['editNotesTitle'], 'Edit Notes');
        this.cancelEditNotesButtonText = this.getTranslated(options['cancelEditNotesButtonText'], 'Cancel');
        this.applyEditNotesButtonText = this.getTranslated(options['applyEditNotesButtonText'], 'Apply');
        this.editNotesCssClasses = options['editNotesCssClasses'] || 'form-control';
        this.typeHeader = this.getTranslated(options['typeHeader'], 'Type');
        this.locationHeader = this.getTranslated(options['locationHeader'], 'Location');
        this.notesHeader = this.getTranslated(options['notesHeader'], 'Notes');
        this.iscEnabled = !_.isUndefined(options['iscEnabled']) ? options['iscEnabled'] : false;
        this.notesEnabled = !_.isUndefined(options['notesEnabled']) ? options['notesEnabled'] : true;
        this.iscHeader = !_.isUndefined(options['iscHeader']) ? this.getTranslated(options['iscHeader'], options['iscHeader']) : 'Information Security Classification';
        this.noLocationSelectedText = !_.isUndefined(options['noLocationSelectedText']) ? this.getTranslated(options['noLocationSelectedText'], options['noLocationSelectedText']) : 'Publish Metadata Only';
        this.noLocationSelectedHelp = !_.isUndefined(options['noLocationSelectedHelp']) ? this.getTranslated(options['noLocationSelectedHelp'], options['noLocationSelectedHelp']) : 'Publicise only metadata (or description)';
        this.publicCheck = !_.isUndefined(options['publicCheck']) ? this.getTranslated(options['publicCheck'], options['publicCheck']) : 'public';
        this.selectionCriteria = !_.isUndefined(options['selectionCriteria']) ? this.getTranslated(options['selectionCriteria'], options['selectionCriteria']) : [{ isc: 'public', type: 'attachment' }];
        this.value = options['value'] || this.setEmptyValue();
        this.recordsService = this.getFromInjector(records_service_1.RecordsService);
    }
    setValue(value, emitEvent = true) {
        this.formModel.setValue(value, { emitEvent: emitEvent, emitModelToViewChange: true });
        this.formModel.markAsTouched();
        this.formModel.markAsDirty();
    }
    setEmptyValue() {
        this.value = [];
        return this.value;
    }
    addLocation() {
        this.value.push(this.newLocation);
        this.setValue(this.value);
        this.newLocation = { type: "url", location: "", notes: "" };
    }
    appendLocation(newLoc) {
        this.value.push(newLoc);
        this.setValue(this.value, true);
    }
    clearPendingAtt(value) {
        _.each(value, (val) => {
            if (val.type == 'attachment') {
                _.unset(val, 'pending');
            }
        });
    }
    populateDataLocation(oid, config) {
        console.log(oid);
        this.recordsService.getRecordMeta(oid).then(record => {
            this.value = record.dataLocations;
        });
    }
    removeLocation(loc) {
        _.remove(this.value, (val) => {
            return val.type == loc.type && val.name == loc.name && val.location == loc.location;
        });
        this.setValue(this.value);
    }
    selectAllPublic() {
        this.applySelectionCriteria(true);
        this.checkIfLocationsSelected();
    }
    applySelectionCriteria(checked) {
        _.each(this.value, dL => {
            _.each(this.selectionCriteria, sC => {
                const isSelected = _.filter(sC, (val, key) => dL[key] && dL[key] === val);
                if (isSelected.length === Object.keys(sC).length) {
                    dL.selected = checked;
                }
            });
        });
    }
    ;
    canBeSelected(dL) {
        let canBeSelected = false;
        _.each(this.selectionCriteria, sC => {
            const isSelected = _.filter(sC, (val, key) => dL[key] && dL[key] === val);
            if (isSelected.length === Object.keys(sC).length) {
                canBeSelected = true;
            }
        });
        return canBeSelected && this.editMode ? null : '';
    }
    checkIfLocationsSelected() {
        const locationSelected = _.find(this.value, (dataLocation) => {
            return dataLocation.selected;
        });
        if (locationSelected) {
            this.noLocationSelected = false;
        }
        else {
            this.noLocationSelected = true;
        }
    }
}
exports.PublishDataLocationSelectorField = PublishDataLocationSelectorField;
let PublishDataLocationSelectorComponent = class PublishDataLocationSelectorComponent extends field_simple_component_1.SimpleComponent {
    constructor() {
        super(...arguments);
        this.editingNotes = { notes: '', index: -1 };
        this.locationSelected = false;
    }
    ngOnInit() {
        this.field.checkIfLocationsSelected();
    }
    selectAllLocations(checked) {
        if (this.field.iscEnabled) {
            this.field.applySelectionCriteria(checked);
        }
        else {
            _.each(this.field.value, (dataLocation) => {
                dataLocation.selected = checked;
            });
        }
        this.field.checkIfLocationsSelected();
    }
    getDatalocations() {
        return this.field.value;
    }
    getAbsUrl(location) {
        return `${this.field.recordsService.getBrandingAndPortalUrl}/record/${location}`;
    }
    editNotes(dataLocation, i) {
        this.editingNotes = { notes: dataLocation.notes, index: i };
        jQuery(`#${this.field.name}_editnotes`).modal('show');
    }
    hideEditNotes() {
        jQuery(`#${this.field.name}_editnotes`).modal('hide');
    }
    saveNotes() {
        jQuery(`#${this.field.name}_editnotes`).modal('hide');
        this.field.value[this.editingNotes.index].notes = this.editingNotes.notes;
    }
};
PublishDataLocationSelectorComponent = __decorate([
    core_1.Component({
        selector: 'publish-data-location-selector',
        templateUrl: './field-publishdatalocationselector.html'
    })
], PublishDataLocationSelectorComponent);
exports.PublishDataLocationSelectorComponent = PublishDataLocationSelectorComponent;
