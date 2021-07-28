'use strict';

import {OSBotPathConverter} from '../osbot/osbot_path_converter.js';

export class TRiBotPathConverter extends OSBotPathConverter {

    constructor() {
        super();
        this.javaArea = "RSArea";
        this.javaPosition = "RSTile";
    }
}