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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const field_simple_component_1 = require("./field-simple.component");
const field_base_1 = require("./field-base");
const ands_service_1 = require("../ands-service");
const angular_tree_component_1 = require("angular-tree-component");
const _ = require("lodash");
const Observable_1 = require("rxjs/Observable");
const Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/bufferTime");
require("rxjs/add/operator/filter");
class ANDSVocabField extends field_base_1.FieldBase {
    constructor(options, injector) {
        super(options, injector);
        this.value = options['value'] || this.setEmptyValue();
        this.vocabId = options['vocabId'] || 'anzsrc-for';
        this.andsService = this.getFromInjector(ands_service_1.ANDSService);
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
    setSelected(item, flag) {
        const curVal = this.formModel.value;
        if (flag) {
            curVal.push(item);
        }
        else {
            _.remove(curVal, (entry) => {
                return entry.notation == item.notation;
            });
        }
        this.setValue(curVal);
    }
}
exports.ANDSVocabField = ANDSVocabField;
let ANDSVocabComponent = class ANDSVocabComponent extends field_simple_component_1.SimpleComponent {
    constructor(elementRef) {
        super();
        this.treeData = [];
        this.expandNodeIds = [];
        this.STATUS_INIT = 0;
        this.STATUS_LOADING = 1;
        this.STATUS_LOADED = 2;
        this.STATUS_EXPANDING = 3;
        this.STATUS_EXPANDED = 4;
        this.elementRef = elementRef;
        this.treeData = [];
        this.options = {
            useCheckbox: true,
            useTriState: false,
            getChildren: this.getChildren.bind(this),
            scrollContainer: document.body.parentElement
        };
        this.nodeEventSubject = new Subject_1.Subject();
        this.loadState = this.STATUS_INIT;
    }
    ngOnInit() {
        if (this.field.editMode) {
            jQuery(this.elementRef.nativeElement)['vocab_widget']({
                repository: this.field.vocabId,
                endpoint: 'https://vocabs.ands.org.au/apps/vocab_widget/proxy/',
                fields: ["label", "notation", "about"],
                cache: false
            });
            this.field.componentReactors.push(this);
        }
    }
    ngAfterViewInit() {
        if (this.field.editMode) {
            const that = this;
            if (this.loadState == this.STATUS_INIT) {
                this.loadState = this.STATUS_LOADING;
                jQuery(this.elementRef.nativeElement).on('top.vocab.ands', function (event, data) {
                    if (_.isEmpty(that.treeData)) {
                        that.treeData = that.mapItemsToChildren(data.items);
                        that.loadState = that.STATUS_LOADED;
                    }
                });
                jQuery(this.elementRef.nativeElement)['vocab_widget']('top');
                this.nodeEventSubject.bufferTime(1000)
                    .filter(eventArr => {
                    return eventArr.length > 0;
                })
                    .subscribe(eventArr => {
                    this.handleNodeEvent(eventArr);
                });
                this.startTreeInit();
            }
        }
    }
    startTreeInit() {
        this.treeInitListener = Observable_1.Observable.interval(1000).subscribe(() => {
            if (!_.isEmpty(this.expandNodeIds)) {
                this.expandNodes();
            }
            else if (!_.isEmpty(this.andsTree.treeModel.getVisibleRoots()) && this.loadState == this.STATUS_LOADED) {
                this.loadState = this.STATUS_EXPANDING;
                this.updateTreeView(this);
                this.expandNodes();
            }
            else if (this.loadState == this.STATUS_EXPANDING) {
                this.treeInitListener.unsubscribe();
                this.loadState = this.STATUS_EXPANDED;
            }
        });
    }
    onEvent(event) {
        switch (event.eventName) {
            case "select":
                this.field.setSelected(this.getValueFromChildData(event.node), true);
                break;
            case "deselect":
                this.field.setSelected(this.getValueFromChildData(event.node), false);
                break;
        }
    }
    handleNodeEvent(eventArr) {
        let event = eventArr[0];
        if (eventArr.length >= 2) {
            event = eventArr[1];
        }
        let currentState = this.getNodeSelected(event.node.id);
        switch (event.eventName) {
            case "nodeActivate":
                if (currentState == undefined) {
                    currentState = true;
                }
                else {
                    currentState = false;
                }
                this.updateSingleNodeSelectedState(event.node, currentState);
                break;
            case "nodeDeactivate":
                this.updateSingleNodeSelectedState(event.node, false);
                break;
        }
    }
    updateSingleNodeSelectedState(node, state) {
        const nodeId = node.id;
        const curState = this.andsTree.treeModel.getState();
        this.setNodeSelected(curState, nodeId, state);
        this.andsTree.treeModel.setState(curState);
        this.andsTree.treeModel.update();
        this.field.setSelected(this.getValueFromChildData(node), state);
    }
    onNodeActivate(event) {
        this.nodeEventSubject.next(event);
    }
    onNodeDeactivate(event) {
        this.nodeEventSubject.next(event);
    }
    updateTreeView(that) {
        const state = that.andsTree.treeModel.getState();
        that.expandNodeIds = [];
        _.each(that.field.value, (val) => {
            this.setNodeSelected(state, val.notation, true);
            _.each(val.geneaology, (parentId) => {
                if (!_.includes(that.expandNodeIds, parentId)) {
                    that.expandNodeIds.push(parentId);
                }
            });
        });
        that.andsTree.treeModel.setState(state);
        that.andsTree.treeModel.update();
        that.expandNodeIds = _.sortBy(that.expandNodeIds, (o) => { return _.isString(o) ? o.length : 0; });
    }
    expandNodes() {
        if (!_.isEmpty(this.expandNodeIds)) {
            const parentId = this.expandNodeIds[0];
            const node = this.andsTree.treeModel.getNodeById(parentId);
            if (node) {
                node.expand();
                _.remove(this.expandNodeIds, (id) => { return id == parentId; });
            }
        }
    }
    collapseNodes() {
        this.andsTree.treeModel.collapseAll();
    }
    setNodeSelected(state, nodeId, flag) {
        if (flag) {
            state.selectedLeafNodeIds[nodeId] = flag;
        }
        else {
            _.unset(state.selectedLeafNodeIds, nodeId);
        }
    }
    getNodeSelected(nodeId) {
        return this.andsTree.treeModel.getState().selectedLeafNodeIds[nodeId];
    }
    clearSelectedNodes() {
        const state = this.andsTree.treeModel.getState();
        state.selectedLeafNodeIds = {};
        this.andsTree.treeModel.setState(state);
    }
    getChildren(node) {
        const that = this;
        const promise = new Promise((resolve, reject) => {
            jQuery(this.elementRef.nativeElement).on('narrow.vocab.ands', function (event, data) {
                return resolve(that.mapItemsToChildren(data.items));
            });
        });
        jQuery(this.elementRef.nativeElement)['vocab_widget']('narrow', { uri: node.data.about });
        return promise;
    }
    mapItemsToChildren(items) {
        return _.map(items, (item) => {
            return Object.assign({ id: item.notation, name: `${item.notation} - ${item.label}`, hasChildren: item.narrower && item.narrower.length > 0 }, item);
        });
    }
    getValueFromChildData(childNode) {
        const data = childNode.data;
        const val = { name: `${data.notation} - ${data.label}`, label: data.label, notation: data.notation };
        this.setParentTree(val, childNode);
        return val;
    }
    setParentTree(val, childNode) {
        const parentNotation = _.get(childNode, 'parent.data.notation');
        if (!_.isUndefined(parentNotation)) {
            if (_.isUndefined(val['geneaology'])) {
                val['geneaology'] = [];
            }
            val['geneaology'].push(parentNotation);
            if (childNode.parent.parent) {
                this.setParentTree(val, childNode.parent);
            }
        }
        else if (!_.isUndefined(val['geneaology'])) {
            val['geneaology'] = _.sortBy(val['geneaology']);
        }
    }
    reactEvent(eventName, eventData, origData, elem) {
        this.collapseNodes();
        this.clearSelectedNodes();
        this.loadState = this.STATUS_LOADED;
        this.startTreeInit();
    }
};
__decorate([
    core_1.ViewChild('andsTree'),
    __metadata("design:type", typeof (_a = typeof angular_tree_component_1.TreeComponent !== "undefined" && angular_tree_component_1.TreeComponent) === "function" ? _a : Object)
], ANDSVocabComponent.prototype, "andsTree", void 0);
ANDSVocabComponent = __decorate([
    core_1.Component({
        selector: 'ands-vocab-selector',
        templateUrl: './field-andsvocab.html',
        styles: ['span.node-name { font-size: 300%; }']
    }),
    __param(0, core_1.Inject(core_1.ElementRef)),
    __metadata("design:paramtypes", [typeof (_b = typeof core_1.ElementRef !== "undefined" && core_1.ElementRef) === "function" ? _b : Object])
], ANDSVocabComponent);
exports.ANDSVocabComponent = ANDSVocabComponent;
