'use strict';

import {OSBotPositionConverter} from "../osbot/osbot_position_converter.js";

export class DreamBotPositionConverter extends OSBotPositionConverter {

    constructor() {
        super();
        this.javaPosition = "Tile";
    }
}