'use strict';

export var PlaneControl = L.Control.extend({
    options: {
        position: 'topleft'
    },

    onAdd: function (map) {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control noselect');
        container.style.background = 'none';
        container.style.width = '32px';
        container.style.height = 'auto';
        container.style.fontWeight = 'bold';
        /*container.style.display = 'inline-block';
        container.style.float = 'none';*/

        const incrementPlaneButton = L.DomUtil.create('a', 'leaflet-bar leaflet-control leaflet-control-custom', container);
        incrementPlaneButton.id = 'increase-level';
        incrementPlaneButton.innerHTML = 'Z +';

        L.DomEvent.on(incrementPlaneButton, 'click', this._increasePlane, this);

        const decrementPlaneButton = L.DomUtil.create('a', 'leaflet-bar leaflet-control leaflet-control-custom', container);
        decrementPlaneButton.id = 'decrease-level';
        decrementPlaneButton.innerHTML = 'Z -';

        L.DomEvent.on(decrementPlaneButton, 'click', this._decreasePlane, this);

        L.DomEvent.disableClickPropagation(container);
        return container;
    },

    _increasePlane: function () {
        if (this._map.plane === 3) {
            return;
        }
        this._map.plane++;
        this._map.updateMapPath();
        this._dispatchPlaneChangedEvent();
    },

    _decreasePlane: function () {
        if (this._map.plane === 0) {
            return;
        }
        this._map.plane--;
        this._map.updateMapPath();
        this._dispatchPlaneChangedEvent();
    },

    _dispatchPlaneChangedEvent: function () {
        this._map.fire('planeChanged', {
            plane: this._map.plane
        });
    }
});