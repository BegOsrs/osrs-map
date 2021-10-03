'use strict';

import {Position} from '../../model/Position.js';
import {OSBotConverter} from './osbot_converter.js';

export class OSBotPositionConverter extends OSBotConverter {

    /*
    API Doc:
        https://osbot.org/api/org/osbot/rs07/api/map/Position.html
        
        Position(int x, int y, int z)
    */
    fromJava(text, positions) {
        positions.removeAll();
        text = text.replace(/\s/g, '');
        const posPattern = `new${this.javaPosition}\\((\\d+,\\d+,\\d)\\)`;
        const re = new RegExp(posPattern, "mg");
        let match;
        while ((match = re.exec(text))) {
            let values = match[1].split(",");
            positions.add(new Position(values[0], values[1], values[2]));
        }
    }

    toRaw(positions) {
        let output = "";
        for (let i = 0; i < positions.positions.length; i++) {
            output += `${positions.positions[i].x},${positions.positions[i].y},${positions.positions[i].z}\n`;
        }
        return output;
    }

    toJavaSingle(position) {
        return `${this.javaPosition} position = new ${this.javaPosition}(${position.x}, ${position.y}, ${position.z});`;
    }

    toJavaArray(positions) {
        if (!positions.positions || !positions.positions.length) {
            return "";
        }
        if (positions.positions.length === 1) {
            return this.toJavaSingle(positions.positions[0]);
        }
        let output = `${this.javaPosition}[] positions = {\n`;
        for (let i = 0; i < positions.positions.length; i++) {
            output += `    new ${this.javaPosition}(${positions.positions[i].x}, ${positions.positions[i].y}, ${positions.positions[i].z})`;
            if (i !== positions.positions.length - 1) {
                output += ",";
            }
            output += "\n";
        }
        output += "};";
        return output;
    }

    toJavaList(positions) {
        if (!positions.positions || !positions.positions.length) {
            return "";
        }
        if (positions.positions.length === 1) {
            return this.toJavaSingle(positions.positions[0]);
        }
        let output = `List&lt;${this.javaPosition}&gt; positions = new ArrayList<>();\n`;
        for (let i = 0; i < positions.positions.length; i++) {
            output += `path.add(new ${this.javaPosition}(${positions.positions[i].x}, ${positions.positions[i].y}, ${positions.positions[i].z}));\n`;
        }
        return output;
    }

    toJavaArraysAsList(positions) {
        if (!positions.positions || !positions.positions.length) {
            return "";
        }
        if (positions.positions.length === 1) {
            return this.toJavaSingle(positions.positions[0]);
        }
        let output = `List&lt;${this.javaPosition}&gt; positions = Arrays.asList(\n    new ${this.javaPosition}[]{\n`;
        for (let i = 0; i < positions.positions.length; i++) {
            output += `        new ${this.javaPosition}(${positions.positions[i].x}, ${positions.positions[i].y}, ${positions.positions[i].z})`;
            if (i !== positions.positions.length - 1) {
                output += ",";
            }
            output += "\n";
        }
        output += "    }\n);";
        return output;
    }
}