'use strict';

import {CanvasLayer} from '../external/L.CanvasLayer.js';
import Locations from "../model/Locations.js";

const MapLabelsCanvas = CanvasLayer.extend({
    setData: function (data) {
        this.needRedraw();
    },

    onDrawLayer: function (info) {
        const zoom = this._map.getZoom();

        const ctx = info.canvas.getContext('2d');
        ctx.clearRect(0, 0, info.canvas.width, info.canvas.height);

        ctx.textAlign = "center";
        const self = this;
        Locations.getLocations(function (locations) {
            for (const i in locations) {
                if (locations[i].position.z !== info.layer._map.plane) {
                    continue;
                }

                let fontSize;
                let fontColour;

                // Scale the font, and change colour based on location size
                switch (locations[i].size) {
                    case 'default':
                        fontSize = 0.08
                        fontColour = 'white';
                        break;
                    case 'medium':
                        fontSize = 0.10
                        fontColour = 'white';
                        break;
                    case 'large':
                        fontSize = 0.18
                        fontColour = '#ffaa00';
                }

                // Scale font size to match zoom
                const fontSizeScaled = fontSize * Math.pow(2, zoom);

                ctx.font = `bold ${fontSizeScaled}px Verdana`
                ctx.fillStyle = fontColour

                const position = locations[i].position;
                const latLng = position.toCentreLatLng(self._map);
                const canvasPoint = info.layer._map.latLngToContainerPoint(latLng);

                const name = locations[i].name

                const words = name.split(' ')

                const lines = []

                let line = "";
                words.forEach(word => {
                    if ((line + word).length < 10) {
                        if (line !== "") {
                            line += " "
                        }
                        line += word
                    } else {
                        lines.push(line);
                        line = word;
                    }
                })
                if (line !== "") {
                    lines.push(line);
                }

                let y = canvasPoint.y;
                lines.forEach(line => {
                    ctx.strokeText(line, canvasPoint.x, y);
                    ctx.fillText(line, canvasPoint.x, y);
                    y += (fontSize + 0.02) * Math.pow(2, zoom);
                })
            }
        });
    }
});


export var MapLabelControl = L.Control.extend({
    options: {
        position: 'topleft'
    },

    onAdd: function (map) {
        const isScript = new URLSearchParams(window.location.search).get('script');

        if (!isScript) {
            map.createPane("map-labels");
        }

        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control noselect');
        container.style.background = 'none';
        container.style.width = '130px';
        container.style.height = 'auto';
        if (isScript) {
            container.style.display = 'none';
        }

        const labelsButton = L.DomUtil.create('a', 'leaflet-bar leaflet-control leaflet-control-custom', container);
        labelsButton.id = 'toggle-map-labels';
        labelsButton.innerHTML = 'Toggle Labels';

        L.DomEvent.on(labelsButton, 'click', this._toggleMapLabels, this);

        this._enabled = true;

        L.DomEvent.disableClickPropagation(container);

        this._mapLabelsCanvas = new MapLabelsCanvas({pane: "map-labels"});
        this._map.addLayer(this._mapLabelsCanvas);

        map.on('planeChanged', function () {
            this._mapLabelsCanvas.drawLayer();
        }, this);

        return container;
    },

    _toggleMapLabels: function () {
        if (this._enabled) {
            this._map.getPane("map-labels").style.display = "none";
            this._enabled = false;
        } else {
            this._map.getPane("map-labels").style.display = "";
            this._enabled = true;
        }
    }
});