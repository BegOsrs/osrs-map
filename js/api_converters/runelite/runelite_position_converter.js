'use strict';

import {OSBotPositionConverter} from "../osbot/osbot_position_converter.js";

export class RunelitePositionConverter extends OSBotPositionConverter {

    constructor() {
        super();
        this.javaPosition = "WorldPoint";
    }
}