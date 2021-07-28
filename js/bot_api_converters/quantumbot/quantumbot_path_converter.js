'use strict';

import {OSBotPathConverter} from '../osbot/osbot_path_converter.js';

export class QuantumBotPathConverter extends OSBotPathConverter {

    constructor() {
        super();
        this.javaArea = "Area";
        this.javaPosition = "Tile";
    }
}