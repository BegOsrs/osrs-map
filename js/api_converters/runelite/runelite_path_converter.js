'use strict';

import {OSBotPathConverter} from '../osbot/osbot_path_converter.js';

export class RunelitePathConverter extends OSBotPathConverter {

    constructor() {
        super();
        this.javaArea = "WorldArea";
        this.javaPosition = "WorldPoint";
    }
}