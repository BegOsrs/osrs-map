'use strict';

export var TitleLabel = L.Control.extend({
    options: {
        position: 'topleft'
    },

    onAdd: function (map) {
        const container = L.DomUtil.create('div');
        container.id = 'titleLabel';
        container.href = 'https://community.tribot.org/profile/198168/Beg';
        container.innerHTML = "<span class='title'>Beg</span>'s Map";

        L.DomEvent.disableClickPropagation(container);
        return container;
    }
});