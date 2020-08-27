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
const records_service_1 = require("./records.service");
const _ = require("lodash");
require("rxjs/add/operator/bufferTime");
require("rxjs/add/operator/filter");
const moment_es6_1 = require("moment-es6");
class AsynchField extends field_simple_1.NotInFormField {
    constructor(options, injector) {
        super(options, injector);
        this.relatedRecordId = options['relatedRecordId'] || undefined;
        this.completionRateType = options['completionRateType'] || 'percentage';
        this.nameLabel = options['nameLabel'] ? this.getTranslated(options['nameLabel'], options['nameLabel']) : 'Name';
        this.statusLabel = options['statusLabel'] ? this.getTranslated(options['statusLabel'], options['statusLabel']) : 'Status';
        this.dateStartedLabel = options['dateStartedLabel'] ? this.getTranslated(options['dateStartedLabel'], options['dateStartedLabel']) : 'Date Started';
        this.dateCompletedLabel = options['dateCompletedLabel'] ? this.getTranslated(options['dateCompletedLabel'], options['dateCompletedLabel']) : 'Date Completed';
        this.startedByLabel = options['startedByLabel'] ? this.getTranslated(options['startedByLabel'], options['startedByLabel']) : 'Started By';
        this.messageLabel = options['messageLabel'] ? this.getTranslated(options['messageLabel'], options['messageLabel']) : 'Message';
        this.completionLabel = options['completionLabel'] ? this.getTranslated(options['completionLabel'], options['completionLabel']) : 'Completion';
        this.lastUpdateLabel = options['lastUpdateLabel'] ? this.getTranslated(options['lastUpdateLabel'], options['lastUpdateLabel']) : 'Last Updated';
        this.dateFormat = options['dateFormat'] || 'L LT';
        this.listenType = options['listenType'] || "record";
        this.taskType = options['taskType'] || '';
        this.criteria = options['criteria'] || { where: { relatedRecordId: '@oid' } };
        this.RecordsService = this.getFromInjector(records_service_1.RecordsService);
    }
    getStatusLabel(status) {
        return this.getTranslated(`${this.options.statusLabel}-${status}`, status);
    }
}
exports.AsynchField = AsynchField;
let AsynchComponent = class AsynchComponent extends field_simple_component_1.SimpleComponent {
    constructor(changeRef) {
        super();
        this.changeRef = changeRef;
        this.locale = window.navigator.language;
    }
    ngOnInit() {
        let oid = this.field.relatedRecordId || this.field.fieldMap._rootComp.oid;
        const that = this;
        if (_.isNull(oid) || _.isUndefined(oid) || _.isEmpty(oid)) {
            if (!this.field.fieldMap._rootComp.getSubscription('recordCreated')) {
                console.log(`Subscribing to record creation..... ${this.field.name}`);
                this.field.fieldMap._rootComp.subscribe('recordCreated', this.field.name, (createdInfo) => {
                    that.field.relatedRecordId = createdInfo.oid;
                    that.startListen();
                });
            }
        }
        if (oid) {
            this.field.relatedRecordId = this.field.fieldMap._rootComp.oid;
            this.startListen();
        }
    }
    startListen() {
        if (!this.isListening && (!_.isUndefined(this.field.relatedRecordId) && !_.isEmpty(this.field.relatedRecordId))) {
            const fq = JSON.stringify(this.field.criteria).replace(/@oid/g, this.field.relatedRecordId);
            this.field.RecordsService.getAsyncProgress(fq).then(progressArr => {
                _.each(progressArr, (progress) => {
                    progress.completionRate = progress.currentIdx / progress.targetIdx;
                    if (this.field.listenType == "progress") {
                        this.field.RecordsService.subscribeToAsyncProgress(progress.id, (data, socketRes) => {
                            console.log(`Subscribed to async tasks: ${progress.id}`);
                            console.log(data);
                            console.log(socketRes);
                        });
                    }
                });
                if (this.field.listenType == "record") {
                    this.field.RecordsService.subscribeToAsyncProgress(this.field.relatedRecordId, (data, socketRes) => {
                        console.log(`Subscribed to async tasks for record: ${this.field.relatedRecordId}`);
                        console.log(data);
                        console.log(socketRes);
                    });
                }
                else if (this.field.listenType == "taskType") {
                    this.field.RecordsService.subscribeToAsyncProgress(`${this.field.relatedRecordId}-${this.field.taskType}`, (data, socketRes) => {
                        console.log(`Subscribed to async tasks for record with taskType: ${this.field.relatedRecordId}-${this.field.taskType}`);
                        console.log(data);
                        console.log(socketRes);
                    });
                }
                io.socket.on('start', this.onStart.bind(this));
                io.socket.on('stop', this.onStop.bind(this));
                io.socket.on('update', this.onUpdate.bind(this));
                this.field.progressArr = progressArr;
                this.isListening = true;
            });
        }
    }
    onStart(progress) {
        console.log(`Got start event:`);
        console.log(progress);
        this.field.progressArr ? this.field.progressArr.push(progress) : this.field.progressArr = [progress];
        this.changeRef.detectChanges();
    }
    onStop(progress) {
        console.log(`Got stop event:`);
        console.log(progress);
        this.updateProgress(progress);
    }
    onUpdate(progress) {
        console.log(`Got update event:`);
        console.log(progress);
        this.updateProgress(progress);
    }
    updateProgress(progress) {
        const targetProgress = _.find(this.field.progressArr, (prog) => { return prog.id == progress.id; });
        _.assign(targetProgress, progress);
        this.changeRef.detectChanges();
    }
    formatDateForDisplay(value) {
        return value ? moment_es6_1.default(value).locale(this.locale).format(this.field.dateFormat) : '';
    }
};
AsynchComponent = __decorate([
    core_1.Component({
        selector: 'asynch-component',
        templateUrl: './field-asynch.component.html'
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.ChangeDetectorRef !== "undefined" && core_1.ChangeDetectorRef) === "function" ? _a : Object])
], AsynchComponent);
exports.AsynchComponent = AsynchComponent;
