'use strict';

import {Position} from '../model/Position.js';
import {Area} from '../model/Area.js';
import {Path} from '../model/Path.js';
import {Areas} from '../model/Areas.js';
import {PolyArea} from '../model/PolyArea.js';
import {Positions} from "../model/Positions.js";

// Import converters
import {OSBotAreasConverter} from '../api_converters/osbot/osbot_areas_converter.js';
import {OSBotPathConverter} from '../api_converters/osbot/osbot_path_converter.js';
import {OSBotPolyAreaConverter} from '../api_converters/osbot/osbot_polyarea_converter.js';
import {OSBotPositionConverter} from "../api_converters/osbot/osbot_position_converter.js";

import {TRiBotAreasConverter} from '../api_converters/tribot/tribot_areas_converter.js';
import {TRiBotPathConverter} from '../api_converters/tribot/tribot_path_converter.js';
import {TRiBotPolyAreaConverter} from '../api_converters/tribot/tribot_polyarea_converter.js';
import {TRiBotPositionConverter} from "../api_converters/tribot/tribot_position_converter.js";

import {DreamBotAreasConverter} from '../api_converters/dreambot/dreambot_areas_converter.js';
import {DreamBotPathConverter} from '../api_converters/dreambot/dreambot_path_converter.js';
import {DreamBotPolyAreaConverter} from '../api_converters/dreambot/dreambot_polyarea_converter.js';
import {DreamBotPositionConverter} from "../api_converters/dreambot/dreambot_position_converter.js";

import {RSPeerAreasConverter} from '../api_converters/rspeer/rspeer_areas_converter.js';
import {RSPeerPathConverter} from '../api_converters/rspeer/rspeer_path_converter.js';
import {RSPeerPolyAreaConverter} from '../api_converters/rspeer/rspeer_polyarea_converter.js';
import {RSPeerPositionConverter} from "../api_converters/rspeer/rspeer_position_converter.js";

import {QuantumBotAreasConverter} from '../api_converters/quantumbot/quantumbot_areas_converter.js';
import {QuantumBotPathConverter} from '../api_converters/quantumbot/quantumbot_path_converter.js';
import {QuantumBotPolyAreaConverter} from '../api_converters/quantumbot/quantumbot_polyarea_converter.js';
import {QuantumBotPositionConverter} from "../api_converters/quantumbot/quantumbot_position_converter.js";

import {RuneMateAreasConverter} from '../api_converters/runemate/runemate_areas_converter.js';
import {RuneMatePathConverter} from '../api_converters/runemate/runemate_path_converter.js';
import {RuneMatePolyAreaConverter} from '../api_converters/runemate/runemate_polyarea_converter.js';
import {RuneMatePositionConverter} from "../api_converters/runemate/runemate_position_converter.js";

import {RuneliteAreasConverter} from "../api_converters/runelite/runelite_areas_converter";
import {RunelitePathConverter} from "../api_converters/runelite/runelite_path_converter";
import {RunelitePolyAreaConverter} from "../api_converters/runelite/runelite_polyarea_converter";
import {RunelitePositionConverter} from "../api_converters/runelite/runelite_position_converter";

const converters = {
    "RuneLite": {
        "areas_converter": new RuneliteAreasConverter(),
        "path_converter": new RunelitePathConverter(),
        "polyarea_converter": new RunelitePolyAreaConverter(),
        "position_converter": new RunelitePositionConverter()
    },
    "OSBot": {
        "areas_converter": new OSBotAreasConverter(),
        "path_converter": new OSBotPathConverter(),
        "polyarea_converter": new OSBotPolyAreaConverter(),
        "position_converter": new OSBotPositionConverter()
    },
    "TRiBot": {
        "areas_converter": new TRiBotAreasConverter(),
        "path_converter": new TRiBotPathConverter(),
        "polyarea_converter": new TRiBotPolyAreaConverter(),
        "position_converter": new TRiBotPositionConverter()
    },
    "DreamBot": {
        "areas_converter": new DreamBotAreasConverter(),
        "path_converter": new DreamBotPathConverter(),
        "polyarea_converter": new DreamBotPolyAreaConverter(),
        "position_converter": new DreamBotPositionConverter()
    },
    "RSPeer": {
        "areas_converter": new RSPeerAreasConverter(),
        "path_converter": new RSPeerPathConverter(),
        "polyarea_converter": new RSPeerPolyAreaConverter(),
        "position_converter": new RSPeerPositionConverter()
    },
    "QuantumBot": {
        "areas_converter": new QuantumBotAreasConverter(),
        "path_converter": new QuantumBotPathConverter(),
        "polyarea_converter": new QuantumBotPolyAreaConverter(),
        "position_converter": new QuantumBotPositionConverter()
    },
    "RuneMate": {
        "areas_converter": new RuneMateAreasConverter(),
        "path_converter": new RuneMatePathConverter(),
        "polyarea_converter": new RuneMatePolyAreaConverter(),
        "position_converter": new RuneMatePositionConverter()
    }
};

export var CollectionControl = L.Control.extend({
    options: {
        position: 'topleft'
    },

    onAdd: function (map) {
        this._positions = new Positions(this._map);
        this._path = new Path(this._map);
        this._areas = new Areas(this._map);
        this._polyArea = new PolyArea(this._map);

        this._currentDrawable = undefined;
        this._currentConverter = undefined;

        this._prevMouseRect = undefined;
        this._prevMousePos = undefined;

        this._firstSelectedAreaPosition = undefined;
        this._drawnMouseArea = undefined;
        this._editing = false;

        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control noselect');

        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');
        const script = urlParams.get('script');
        const option = urlParams.get('option');

        container.style.background = 'none';
        container.style.width = '70px';
        container.style.height = 'auto';
        if ((script || mode === '1') && !option) {
            container.style.display = 'none';
        }

        if (!script) {
            // Copy to clipboard control
            this._createControl('clipboard-copy-control', '<i class="fa fa-copy"></i>', container, function (e) {
                this._copyCodeToClipboard();
            }, mode === '1');
        }

        if (!script) {
            // Settings control
            this._createControl('settings-control', '<i class="fa fa-cog"></i>', container, function (e) {
                const settingsPanel = $("#settings-panel");
                if (settingsPanel.is(":visible")) {
                    settingsPanel.hide("slide", {direction: "right"}, 300);
                } else {
                    if (this._currentDrawable !== undefined) {
                        this._toggleCollectionMode();
                    }
                    settingsPanel
                        .css('display', 'flex')
                        .hide()
                        .show("slide", {direction: "right"}, 300);
                }
            }, mode === '1');
        }

        const hidden = script || mode;

        // Area control
        this._createControl('area-control', '<img src="https://raw.githubusercontent.com/begosrs/osrs-map/master/css/images/area-icon.png" alt="Area" title="Area" height="30" width="30">', container, function (e) {
            this._toggleCollectionMode(this._areas, "areas_converter", e.target, hidden);
        }, hidden);

        // Poly Area control
        this._createControl('polyarea-control', '<img src="https://raw.githubusercontent.com/begosrs/osrs-map/master/css/images/polyarea-icon.png" alt="Poly Area" title="Poly Area" height="30" width="30">', container, function (e) {
            this._toggleCollectionMode(this._polyArea, "polyarea_converter", e.target, hidden);
        }, hidden);

        // Path control
        this._createControl('path-control', '<img src="https://raw.githubusercontent.com/begosrs/osrs-map/master/css/images/path-icon.png" alt="Path" title="Path" height="30" width="30">', container, function (e) {
            this._toggleCollectionMode(this._path, "path_converter", e.target, hidden);
        }, hidden);

        // Positions control
        this._createControl('position-control', '<img src="https://raw.githubusercontent.com/begosrs/osrs-map/master/css/images/positions-icon.png" alt="Positions" title="Positions" height="30" width="30">', container, function (e) {
            this._toggleCollectionMode(this._positions, "position_converter", e.target, hidden);
        }, hidden);

        // Undo control
        this._createControl('undo-control', '<i class="fa fa-undo" aria-hidden="true"></i>', container, function (e) {
            if (this._currentDrawable !== undefined) {
                this._currentDrawable.removeLast();
                this._outputCode();
            }
        }, mode === '1' && !option);

        // Clear control
        this._createControl('clear-control', '<i class="fa fa-trash" aria-hidden="true"></i>', container, function (e) {
            if (this._currentDrawable !== undefined) {
                this._currentDrawable.removeAll();
                this._outputCode();
            }
        }, mode === '1' && !option);

        if (script) {
            $('.slide-panel').css('height', '182').css('max-height', '182');
            $('#code-output-pre').css('height', '180').css('max-height', '180');
        }

        if (option) {
            switch (option) {
                case 'area':
                    this._toggleCollectionMode(this._areas, "position_converter", undefined, hidden);
                    break;
                case 'polyarea':
                    this._toggleCollectionMode(this._polyArea, "polyarea_converter", undefined, hidden);
                    break;
                case 'path':
                    this._toggleCollectionMode(this._path, "path_converter", undefined, hidden);
                    break;
                case 'position':
                    this._toggleCollectionMode(this._positions, "position_converter", undefined, hidden);
                    break;
            }
        }

        L.DomEvent.disableClickPropagation(container);

        L.DomEvent.on(this._map, 'click', this._addPosition, this);

        L.DomEvent.on(this._map, 'mousemove', this._drawMouseArea, this);

        const context = this;
        $("#output-type").on('change', () => context._outputCode());
        $("#code-output").on('input propertychange paste', () => context._loadFromText());
        $("#bot-api").on('change', () => context._outputCode());

        return container;
    },

    _createControl: function (id, html, container, onClick, hidden) {
        const control = L.DomUtil.create('a', `leaflet-bar leaflet-control leaflet-control-custom`, container);
        control.id = id;
        control.innerHTML = html;
        if (hidden) {
            control.style.display = 'none'
        }
        L.DomEvent.on(control, 'click', onClick, this);
    },

    _addPosition: function (e) {
        if (!this._editing) {
            return;
        }

        const position = Position.fromLatLng(this._map, e.latlng, this._map.plane);

        if (this._currentDrawable instanceof Areas) {
            if (this._firstSelectedAreaPosition === undefined) {
                this._firstSelectedAreaPosition = position;
            } else {
                this._map.removeLayer(this._drawnMouseArea);
                this._areas.add(new Area(this._firstSelectedAreaPosition, position));
                this._firstSelectedAreaPosition = undefined;
                this._outputCode();
            }
        } else {
            this._currentDrawable.add(position);
            this._outputCode();
        }
    },

    _drawMouseArea: function (e) {
        if (!this._editing) {
            return;
        }

        const mousePos = Position.fromLatLng(this._map, e.latlng, this._map.plane);

        if (this._currentDrawable instanceof Areas) {
            if (this._firstSelectedAreaPosition !== undefined) {

                if (this._drawnMouseArea !== undefined) {
                    this._map.removeLayer(this._drawnMouseArea);
                }

                this._drawnMouseArea = new Area(this._firstSelectedAreaPosition, mousePos).toLeaflet(this._map);
                this._drawnMouseArea.addTo(this._map, true);
            }
        } else if (this._currentDrawable instanceof PolyArea) {
            if (this._drawnMouseArea !== undefined) {
                this._map.removeLayer(this._drawnMouseArea);
            }

            this._drawnMouseArea = new PolyArea(this._map);
            this._drawnMouseArea.addAll(this._currentDrawable.positions);
            this._drawnMouseArea.add(mousePos);
            this._drawnMouseArea = this._drawnMouseArea.toLeaflet(this._map);
            this._drawnMouseArea.addTo(this._map, true);
        }
    },

    _toggleCollectionMode: function (drawable, converter, element, hidden) {
        $("a.leaflet-control-custom.active").removeClass("active");

        if (this._currentDrawable === drawable || drawable === undefined) {
            this._editing = false;

            if (!hidden) {
                $("#code-output-panel").hide("slide", {direction: "right"}, 300);
            }

            this._firstSelectedAreaPosition = undefined;
            this._map.removeLayer(this._currentDrawable.featureGroup);

            if (this._drawnMouseArea !== undefined) {
                this._map.removeLayer(this._drawnMouseArea);
            }

            this._currentDrawable = undefined;
            this._currentConverter = undefined;

            this._outputCode();
            return;
        }

        if ($("#settings-panel").is(":visible")) {
            $("#settings-panel").hide("slide", {direction: "right"}, 300);
        }

        this._editing = true;

        if (element) {
            $(element).closest("a.leaflet-control-custom").addClass("active");
        }

        this._currentConverter = converter;

        if (!hidden) {
            $("#code-output-panel").show("slide", {direction: "right"}, 300);
        }

        if (this._currentDrawable !== undefined) {
            this._map.removeLayer(this._currentDrawable.featureGroup);
        }

        this._firstSelectedAreaPosition = undefined;

        if (this._drawnMouseArea !== undefined) {
            this._map.removeLayer(this._drawnMouseArea);
        }

        this._currentDrawable = drawable;

        if (this._currentDrawable !== undefined) {
            this._map.addLayer(this._currentDrawable.featureGroup);
        }

        this._outputCode();
    },

    _outputCode: function () {
        let output = "";

        if (this._currentDrawable !== undefined) {
            const urlParams = new URLSearchParams(window.location.search);
            const script = urlParams.get('script');
            const botAPI = $("#bot-api option:selected").text();
            if (script) {
                output = converters[botAPI][this._currentConverter].toScript(this._currentDrawable);
            } else {
                output = converters[botAPI][this._currentConverter].toJava(this._currentDrawable);
            }
        }

        $("#code-output").html(output);
    },

    _loadFromText: function () {
        if (this._currentDrawable !== undefined) {
            const botAPI = $("#bot-api option:selected").text();
            converters[botAPI][this._currentConverter].fromJava($("#code-output").text(), this._currentDrawable);
        }
    },

    _copyCodeToClipboard: function () {
        const $temp = $("<textarea>");
        $("body").append($temp);
        $temp.val($("#code-output").text()).select();
        document.execCommand("copy");
        $temp.remove();

        Swal({
            position: 'top',
            type: 'success',
            title: `Copied to clipboard`,
            showConfirmButton: false,
            timer: 6000,
            toast: true,
        });
    }
});