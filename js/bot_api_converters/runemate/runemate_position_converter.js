'use strict';

import {OSBotPositionConverter} from "../osbot/osbot_position_converter.js";

export class RuneMatePositionConverter extends OSBotPositionConverter {

    constructor() {
        super();
        this.javaPosition = "Coordinate";
    }
}