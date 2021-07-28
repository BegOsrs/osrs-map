'use strict';

import {Position} from '../model/Position.js';
import {CanvasLayer} from '../external/L.CanvasLayer.js';
import {MAX_X, MAX_Y, MIN_X, MIN_Y, Region, REGION_HEIGHT, REGION_WIDTH} from '../model/Region.js';

const RegionLabelsCanvas = CanvasLayer.extend({
    setData: function (data) {
        this.needRedraw();
    },

    onDrawLayer: function (info) {
        const zoom = this._map.getZoom();

        const fontSize = 0.15 * Math.pow(2, zoom);

        const ctx = info.canvas.getContext('2d');
        ctx.clearRect(0, 0, info.canvas.width, info.canvas.height);

        ctx.font = fontSize + 'px Calibri';
        ctx.fillStyle = 'white';
        ctx.textAlign = "center";

        for (let x = MIN_X; x < MAX_X; x += REGION_WIDTH) {
            for (let y = MIN_Y; y < MAX_Y; y += REGION_HEIGHT) {
                const position = new Position(x + (REGION_WIDTH / 2), y + (REGION_HEIGHT / 2), 0);
                const latLng = position.toCentreLatLng(this._map);

                const region = Region.fromPosition(position);

                const canvasPoint = info.layer._map.latLngToContainerPoint(latLng);

                ctx.fillText(region.id.toString(), canvasPoint.x, canvasPoint.y);
            }
        }
    }
});

export var RegionLabelsControl = L.Control.extend({
    options: {
        position: 'topleft'
    },

    onAdd: function (map) {
        map.createPane('region-labels');

        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control noselect');
        container.style.background = 'none';
        container.style.width = '130px';
        container.style.height = 'auto';

        const labelsButton = L.DomUtil.create('a', 'leaflet-bar leaflet-control leaflet-control-custom', container);
        labelsButton.id = 'toggle-region-labels';
        labelsButton.innerHTML = 'Toggle Region Labels';

        const regionLabelsCanvas = new RegionLabelsCanvas({pane: "region-labels"});
        map.getPane("region-labels").style.display = "none";
        map.addLayer(regionLabelsCanvas);

        this.visible = false;

        L.DomEvent.on(labelsButton, 'click', () => {
            if (this.visible) {
                map.getPane("region-labels").style.display = "none";
            } else {
                map.getPane("region-labels").style.display = "";
            }
            this.visible = !this.visible;
        }, this);

        L.DomEvent.disableClickPropagation(container);
        return container;
    },

    _toggleRegionLabels: function () {

    }
});