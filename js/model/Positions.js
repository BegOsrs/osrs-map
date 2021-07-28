'use strict';

export class Positions {

    constructor(map) {
        this.map = map;
        this.featureGroup = new L.FeatureGroup();
        this.positions = [];
        this.rectangles = [];
    }

    add(position) {
        this.positions.push(position);
        const rectangle = position.toLeaflet(this.map);
        this.featureGroup.addLayer(rectangle);
        this.rectangles.push(rectangle);
    }

    removeLast() {
        if (this.positions.length > 0) {
            this.featureGroup.removeLayer(this.positions.pop());
        }
        if (this.rectangles.length > 0) {
            this.featureGroup.removeLayer(this.rectangles.pop());
        }
    }

    removeAll() {
        while (this.positions.length > 0) {
            this.featureGroup.removeLayer(this.positions.pop());
        }
        while (this.rectangles.length > 0) {
            this.featureGroup.removeLayer(this.rectangles.pop());
        }
    }

    getName() {
        return "Positions";
    }
}