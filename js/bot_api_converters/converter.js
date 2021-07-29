'use strict';

export class Converter {

    fromJava(text, drawable) {
    }

    toJava(drawable) {
        switch ($("#output-type").val()) {
            case "Array":
                return this.toJavaArray(drawable);
            case "List":
                return this.toJavaList(drawable);
            case "Arrays.asList":
                return this.toJavaArraysAsList(drawable);
            case "Raw":
                return this.toRaw(drawable);
        }
    }

    toRaw(drawable) {
    }

    toJavaSingle(drawable) {
    }

    toJavaArray(drawable) {
    }

    toJavaList(drawable) {
    }

    toJavaArraysAsList(drawable) {
    }

    toScript(drawable) {
        if (drawable.positions.length === 0) {
            return "";
        }
        let output = "";
        for (let i = drawable.positions.length - 1; i >= 0; i--) {
            if (i !== 0) {
                output += ", ";
            }
            const position = drawable.positions[i];
            output += `(${position.x}, ${position.y}, ${position.z})`;
        }
        return output;
    }
}