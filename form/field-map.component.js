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
const forms_1 = require("@angular/forms");
const _ = require("lodash");
class MapField extends field_base_1.FieldBase {
    constructor(options, injector) {
        super(options, injector);
        this.initialised = false;
        this.importDataString = "";
        this.layerGeoJSON = {};
        this.importFailed = false;
        this.layers = [];
        this.drawnItems = new L.FeatureGroup();
        this.googleMaps = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            detectRetina: true
        });
        this.googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            detectRetina: true
        });
        this.masterDrawOptions = {
            edit: {
                featureGroup: this.drawnItems
            },
        };
        this.defaultDrawOptions = {
            position: 'topright',
            edit: {
                featureGroup: this.drawnItems
            },
            draw: {
                marker: {
                    icon: L.icon({
                        iconSize: [25, 41],
                        iconAnchor: [13, 41],
                        iconUrl: 'http://localhost:1500/default/rdmp/images/leaflet/marker-icon.png',
                        shadowUrl: 'http://localhost:1500/default/rdmp/images/leaflet/marker-shadow.png'
                    })
                },
                circlemarker: false,
                circle: false
            }
        };
        this.drawOptions = this.defaultDrawOptions;
        this.masterLeafletOptions = {
            layers: [this.googleMaps, this.drawnItems],
        };
        this.defaultLeafletOptions = {
            zoom: 4,
            center: L.latLng([-24.673148, 134.074574])
        };
        this.leafletOptions = this.defaultLeafletOptions;
        this.layersControl = {
            baseLayers: {
                'Google Maps': this.googleMaps,
                'Google Hybrid': this.googleHybrid
            }
        };
        this.clName = 'MapField';
        this.leafletOptions = options['leafletOptions'] || this.defaultLeafletOptions;
        this.leafletOptions = _.merge(this.leafletOptions, this.masterLeafletOptions);
        this.drawOptions = options['drawOptions'] || this.drawOptions;
        this.drawOptions = _.merge(this.drawOptions, this.masterDrawOptions);
        this.tabId = options['tabId'] || null;
        this.layerGeoJSON = options.value;
        this.mainTabId = options['mainTabId'] || null;
    }
    onMapReady(map) {
        this.map = map;
        let that = this;
        this.registerMapEventHandlers(map);
        this.setValue(this.layerGeoJSON);
        if (this.tabId === null) {
            map.invalidateSize();
            map.fitBounds(this.drawnItems.getBounds());
        }
        else {
            if (this.editMode) {
                jQuery('a[data-toggle="tab"]').on('shown.bs.tab', (e) => {
                    const curTabId = e.target.href.split('#')[1];
                    if (curTabId == that.tabId) {
                        that.initMap(map, that);
                    }
                });
            }
            else {
                const field = this.fieldMap._rootComp.getFieldWithId(this.mainTabId, this.fieldMap._rootComp.fields);
                field.onAccordionCollapseExpand.subscribe((event) => {
                    if (event.shown == true && event.tabId == that.tabId && !that.initialised) {
                        that.initMap(map, that);
                        that.initialised = true;
                    }
                });
            }
        }
    }
    initMap(map, that) {
        map.invalidateSize();
        try {
            map.fitBounds(this.drawnItems.getBounds());
        }
        catch (e) {
        }
    }
    registerMapEventHandlers(map) {
        let that = this;
        map.on(L.Draw.Event.CREATED, function (e) {
            var type = e.layerType, layer = e.layer;
            that.layers.push(layer);
            that.layerGeoJSON = L.featureGroup(that.layers).toGeoJSON();
            that.setValue(that.layerGeoJSON);
            return false;
        });
        map.on('draw:edited', function (e) {
            let layers = e.layers;
            let that2 = that;
            layers.eachLayer(function (layer) {
                let layerIndex = _.findIndex(that2.layers, function (o) { return o._leaflet_id == layer._leaflet_id; });
                if (layerIndex == -1) {
                    that2.layers.push(layer);
                }
                else {
                    that2.layers[layerIndex] = layer;
                }
            });
        });
        map.on('draw:editstop', function (e) {
            that.layerGeoJSON = L.featureGroup(that.layers).toGeoJSON();
            that.setValue(that.layerGeoJSON);
        });
        map.on('draw:deletestop', function (e) {
            that.layerGeoJSON = L.featureGroup(that.layers).toGeoJSON();
            that.setValue(that.layerGeoJSON);
        });
        map.on('draw:deleted', function (e) {
            let layers = e.layers;
            let that2 = that;
            layers.eachLayer(function (layer) {
                _.remove(that2.layers, function (o) { return o._leaflet_id == layer._leaflet_id; });
            });
        });
    }
    drawLayers() {
        this.drawnItems.clearLayers();
        let geoJSONLayer = L.geoJSON(this.layerGeoJSON);
        this.layers = [];
        let that = this;
        geoJSONLayer.eachLayer(layer => {
            layer.addTo(that.drawnItems);
            that.layers.push(layer);
        });
    }
    postInit(value) {
        if (!_.isEmpty(value)) {
            this.layerGeoJSON = value;
            this.drawLayers();
        }
    }
    createFormModel(valueElem = undefined) {
        if (valueElem) {
            this.layerGeoJSON = valueElem;
        }
        this.formModel = new forms_1.FormControl(this.layerGeoJSON || {});
        return this.formModel;
    }
    setValue(value) {
        if (!_.isEmpty(value)) {
            this.layerGeoJSON = value;
            this.drawLayers();
            this.formModel.patchValue(this.layerGeoJSON, { emitEvent: false });
            this.formModel.markAsTouched();
        }
    }
    setEmptyValue() {
        this.layerGeoJSON = {};
        return this.layerGeoJSON;
    }
    importData() {
        if (this.importDataString.length > 0) {
            try {
                if (this.importDataString.indexOf("<") == 0) {
                    let parsedLayers = omnivore.kml.parse(this.importDataString);
                    if (parsedLayers.getLayers().length == 0) {
                        this.importFailed = true;
                        return false;
                    }
                    let that = this;
                    parsedLayers.eachLayer(layer => {
                        layer.addTo(that.drawnItems);
                        that.layers.push(layer);
                        that.layerGeoJSON = L.featureGroup(that.layers).toGeoJSON();
                        this.drawLayers();
                        that.map.fitBounds(that.drawnItems.getBounds());
                    });
                    this.importDataString = "";
                    this.importFailed = false;
                }
                else {
                    let parsedLayers = L.geoJSON(JSON.parse(this.importDataString));
                    let that = this;
                    parsedLayers.eachLayer(layer => {
                        layer.addTo(that.drawnItems);
                        that.layers.push(layer);
                        that.layerGeoJSON = L.featureGroup(that.layers).toGeoJSON();
                        this.drawLayers();
                        that.map.fitBounds(that.drawnItems.getBounds());
                    });
                    this.importDataString = "";
                    this.importFailed = false;
                }
                this.layerGeoJSON = L.featureGroup(this.layers).toGeoJSON();
                this.setValue(this.layerGeoJSON);
            }
            catch (e) {
                this.importFailed = true;
            }
        }
        return false;
    }
}
exports.MapField = MapField;
let rbMapDataTemplate = './field-map.html';
if (typeof aotMode == 'undefined') {
    rbMapDataTemplate = '../angular/shared/form/field-map.html';
}
let MapComponent = class MapComponent extends field_simple_component_1.SimpleComponent {
    ngAfterViewInit() {
        if (!this.field.editMode) {
            this.field.initMap(this.field.map, this.field);
        }
    }
};
MapComponent = __decorate([
    core_1.Component({
        selector: 'rb-mapdata',
        templateUrl: './field-map.html'
    })
], MapComponent);
exports.MapComponent = MapComponent;
