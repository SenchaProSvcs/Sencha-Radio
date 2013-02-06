Ext.define('Ext.viewport.WindowsPhone', {
    requires: [],

    alternateClassName: 'Ext.viewport.WP',

    extend: 'Ext.viewport.Default',

    // TODO hack for landscape mode - for some reason the first body child element is not stretched to full body width
    // so one pixel line is displayed on the right side of the screen. Setting width more than 100% fix the issue
    config: {
        width: '100.2%',
        height: '100.2%'
    },

    constructor: function () {
        this.callParent(arguments);
    },

    initialize: function () {

        // There is -ms-user-select CSS property for IE10, but it seems it works only in desktop browser. So we need to prevent selection event.
        var preventSelection = function (e) {
            var srcElement = e.srcElement.nodeName.toUpperCase();
            var selectableElements = ['INPUT', 'TEXTAREA'];
            if (selectableElements.indexOf(srcElement) == -1) {
                return false;
            }
        }
        document.body.attachEvent('onselectstart', preventSelection);

        this.callParent(arguments);
    }
});

/**
 * The utility class to disable input fields in WP7,8 because they stay still clickable even if they are under other elements.
 */
Ext.define('Ext.util.InputBlocker', {
    blockInputs: function () {
        if (Ext.browser.is.ie) {
            Ext.select('.x-field-text .x-field-input:not(.x-item-disabled) .x-input-el, .x-field-textarea .x-field-input:not(.x-item-disabled) .x-input-el').each(function (item) {
				if(item.dom.offsetWidth > 0){
                    item.dom.setAttribute('disabled', true);
                    item.dom.setAttribute('overlayfix', true);
                }
            });
        }
    },
    unblockInputs: function () {
        if (Ext.browser.is.ie) {
            Ext.select('[overlayfix]').each(function (item) {
                item.dom.removeAttribute('disabled');
                item.dom.removeAttribute('overlayfix');
            });
        }
    }
});
