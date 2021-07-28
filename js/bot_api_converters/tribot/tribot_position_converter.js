'use strict';

import {OSBotPositionConverter} from "../osbot/osbot_position_converter.js";

export class TRiBotPositionConverter extends OSBotPositionConverter {

    constructor() {
        super();
        this.javaPosition = "RSTile";
    }
}