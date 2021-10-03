'use strict';

import {DreamBotPathConverter} from '../dreambot/dreambot_path_converter.js';

export class RuneMatePathConverter extends DreamBotPathConverter {

    constructor() {
        super();
        this.javaArea = "Area.Rectangular";
        this.javaPosition = "Coordinate";
    }
}