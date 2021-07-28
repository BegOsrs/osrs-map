'use strict';

import {OSBotPositionConverter} from "../osbot/osbot_position_converter.js";

export class RSPeerPositionConverter extends OSBotPositionConverter {

    constructor() {
        super();
        this.javaPosition = "Position";
    }
}