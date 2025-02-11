'use strict';

import {Position} from '../../model/Position.js';
import {OSBotPolyAreaConverter} from '../osbot/osbot_polyarea_converter.js';

export class RuneMatePolyAreaConverter extends OSBotPolyAreaConverter {

    constructor() {
        super();
        this.javaArea = "Area";
        this.javaPosition = "Coordinate";
    }

    fromJava(text, polyarea) {
        polyarea.removeAll();
        text = text.replace(/\s/g, '');

        var positionsPattern = `new${this.javaPosition}\\((\\d+,\\d+(?:,\\d)?)\\)`;
        var re = new RegExp(positionsPattern, "mg");
        var match;
        while ((match = re.exec(text))) {
            var values = match[1].split(",");

            var z = values.length == 2 ? 0 : values[2];

            polyarea.add(new Position(values[0], values[1], z));
        }
    }

    toJava(polyarea) {
        if (polyarea.positions.length == 0) {
            return "";
        }
        var output = `${this.javaArea} area = new ${this.javaArea}.Polygonal(`;
        for (var i = 0; i < polyarea.positions.length; i++) {
            var position = polyarea.positions[i];
            output += `\n    new ${this.javaPosition}(${position.x}, ${position.y}, ${position.z})`;
            if (i !== polyarea.positions.length - 1) {
                output += ",";
            }
        }
        output += "\n);";
        return output;
    }
}