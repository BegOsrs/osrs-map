'use strict';

import {OSBotPositionConverter} from "../osbot/osbot_position_converter.js";

export class QuantumBotPositionConverter extends OSBotPositionConverter {

    constructor() {
        super();
        this.javaPosition = "Tile";
    }
}