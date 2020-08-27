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
const Uppy = require("uppy");
class DataLocationField extends field_base_1.FieldBase {
    constructor(options, injector) {
        super(options, injector);
        this.newLocation = { type: "url", location: "", notes: "" };
        this.attachmentText = "Add attachment(s)";
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
        this.locationAddText = this.getTranslated(options['locationAddText'], 'Add Location');
        this.editNotesButtonText = this.getTranslated(options['editNotesButtonText'], 'Edit');
        this.editNotesTitle = this.getTranslated(options['editNotesTitle'], 'Edit Notes');
        this.cancelEditNotesButtonText = this.getTranslated(options['cancelEditNotesButtonText'], 'Cancel');
        this.applyEditNotesButtonText = this.getTranslated(options['applyEditNotesButtonText'], 'Apply');
        this.editNotesCssClasses = options['editNotesCssClasses'] || 'form-control';
        this.typeHeader = this.getTranslated(options['typeHeader'], 'Type');
        this.locationHeader = this.getTranslated(options['locationHeader'], 'Location');
        this.notesEnabled = !_.isUndefined(options['notesEnabled']) ? options['notesEnabled'] : true;
        this.notesHeader = options['notesHeader'] ? this.getTranslated(options['notesHeader'], options['notesHeader']) : null;
        this.iscHeader = !_.isUndefined(options['iscHeader']) ? this.getTranslated(options['iscHeader'], options['iscHeader']) : 'Information Security Classification';
        this.uppyDashboardNote = this.getTranslated(options['uppyDashboardNote'], 'Maximum upload size: 1 Gb per file');
        this.iscEnabled = !_.isUndefined(options['iscEnabled']) ? options['iscEnabled'] : false;
        this.defaultSelect = !_.isUndefined(options['defaultSelect']) ? options['defaultSelect'] : "confidential";
        if (this.iscEnabled) {
            this.newLocation['isc'] = this.defaultSelect;
        }
        this.securityClassificationOptions = options['securityClassificationOptions'] || [];
        this.columns = options['columns'] || [];
        this.maxFileSize = options['maxFileSize'] || null;
        this.maxNumberOfFiles = options['maxNumberOfFiles'] || null;
        this.allowedFileTypes = options['allowedFileTypes'] || null;
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
        this.newLocation = { type: "url", location: "", notes: "", isc: this.defaultSelect };
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
    removeLocation(loc) {
        _.remove(this.value, (val) => {
            return val.type == loc.type && val.name == loc.name && val.location == loc.location;
        });
        this.setValue(this.value);
    }
}
exports.DataLocationField = DataLocationField;
let DataLocationComponent = class DataLocationComponent extends field_simple_component_1.SimpleComponent {
    constructor() {
        super(...arguments);
        this.uppy = null;
        this.oid = null;
        this.editingNotes = { notes: '', index: -1 };
    }
    ngOnInit() {
        let oid = this.field.fieldMap._rootComp.oid;
        if (this.field.editMode) {
            if (_.isNull(oid) || _.isUndefined(oid) || _.isEmpty(oid)) {
                if (!this.field.fieldMap._rootComp.getSubscription('recordCreated')) {
                    console.log(`Subscribing to record creation..... ${this.field.name}`);
                    this.field.fieldMap._rootComp.subscribe('recordCreated', this.field.name, this.eventRecordCreate.bind(this));
                    this.initUppy(oid);
                }
            }
            this.initUppy(oid);
        }
    }
    ngAfterViewInit() {
        if (this.field.editMode) {
            jQuery(`.uppy-Dashboard-input`).attr('aria-label', this.field.label);
        }
    }
    getDatalocations() {
        return this.field.value;
    }
    eventRecordCreate(createdInfo) {
        console.log(`Created record triggered: `);
        console.log(createdInfo);
        this.field.fieldMap[this.field.name].instance.initUppy(createdInfo.oid);
    }
    tempClearPending() {
        const fieldVal = _.cloneDeep(this.field.fieldMap._rootComp.form.value[this.field.name]);
        this.field.clearPendingAtt(fieldVal);
        this.field.fieldMap._rootComp.form.controls[this.field.name].setValue(fieldVal, { emitEvent: true });
    }
    applyPendingChanges(savedInfo) {
        if (savedInfo.success) {
            const finalVal = this.field.fieldMap._rootComp.form.controls[this.field.name].value;
            this.field.fieldMap[this.field.name].field.value = finalVal;
        }
        else {
            console.log(`Resetting....`);
            this.field.fieldMap._rootComp.form.controls[this.field.name].setValue(this.field.fieldMap[this.field.name].field.value);
        }
    }
    initUppy(oid) {
        this.field.fieldMap[this.field.name].instance.oid = oid;
        if (this.uppy) {
            console.log(`Uppy already created... setting oid to: ${oid}`);
            this.field.fieldMap[this.field.name].instance.uppy.getPlugin('Tus').opts.endpoint = `${this.field.recordsService.getBrandingAndPortalUrl}/record/${oid}/attach`;
            return;
        }
        const appConfig = this.field.recordsService.getConfig();
        const uppyConfig = {
            debug: true,
            autoProceed: false,
            restrictions: {
                maxFileSize: this.field.maxFileSize,
                maxNumberOfFiles: this.field.maxNumberOfFiles,
                allowedFileTypes: this.field.allowedFileTypes
            }
        };
        const uppyDashboardNote = this.field.uppyDashboardNote;
        console.debug(`Using Uppy config:`);
        console.debug(JSON.stringify(uppyConfig));
        const tusConfig = {
            endpoint: `${this.field.recordsService.getBrandingAndPortalUrl}/record/${oid}/attach`,
            headers: {
                'X-CSRF-Token': appConfig.csrfToken
            }
        };
        console.debug(`Using TUS config:::`);
        console.debug(JSON.stringify(tusConfig));
        this.uppy = Uppy.Core(uppyConfig);
        this.uppy.use(Uppy.Dashboard, {
            inline: false,
            hideProgressAfterFinish: true,
            note: uppyDashboardNote,
            metaFields: [
                { id: 'notes', name: 'Notes', placeholder: 'Notes about this file.' }
            ]
        })
            .use(Uppy.Tus, tusConfig)
            .run();
        console.log(this.uppy);
        let fieldVal = null;
        this.uppy.on('upload-success', (file, resp, uploadURL) => {
            console.debug("File info:");
            console.debug(file);
            console.debug("Response:");
            console.debug(resp);
            console.debug(`Upload URL:${uploadURL}`);
            const urlParts = uploadURL.split('/');
            const fileId = urlParts[urlParts.length - 1];
            const choppedUrl = urlParts.slice(6, urlParts.length).join('/');
            const newLoc = { type: "attachment", pending: true, location: choppedUrl, notes: file.meta.notes, mimeType: file.type, name: file.meta.name, fileId: fileId, uploadUrl: uploadURL };
            if (this.field.iscEnabled) {
                newLoc['isc'] = this.field.newLocation.isc;
            }
            console.log(`Adding new location:`);
            console.log(newLoc);
            this.field.appendLocation(newLoc);
        });
        this.field.fieldMap._rootComp.subscribe('onBeforeSave', this.field.name, (savedInfo) => {
            console.log(`Before saving record triggered.. `);
            this.field.fieldMap[this.field.name].instance.tempClearPending();
        });
        this.field.fieldMap._rootComp.subscribe('recordSaved', this.field.name, (savedInfo) => {
            console.log(`Saved record triggered.. `);
            this.field.fieldMap[this.field.name].instance.applyPendingChanges(savedInfo);
        });
    }
    isAttachmentsDisabled() {
        if (_.isEmpty(this.oid)) {
            this.field.attachmentText = "Save your record to attach files";
            return true;
        }
        else {
            this.field.attachmentText = "Add attachment(s)";
            return false;
        }
    }
    getAbsUrl(location) {
        return `${this.field.recordsService.getBrandingAndPortalUrl}/record/${location}`;
    }
    openModal() {
        this.uppy && this.uppy.getPlugin('Dashboard') && this.uppy.getPlugin('Dashboard').openModal();
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
DataLocationComponent = __decorate([
    core_1.Component({
        selector: 'data-location-selector',
        templateUrl: './field-data-location.html'
    })
], DataLocationComponent);
exports.DataLocationComponent = DataLocationComponent;
