/**
 * @private
 */
Ext.define('Ext.scroll.indicator.Default', {
    extend: 'Ext.scroll.indicator.Abstract',

    config: {
        cls: 'default'
    },

    setOffset: function(offset) {
        var axis = this.getAxis(),
            element = this.element;

        if (axis === 'x') {
            element.translate(offset);
        }
        else {
            element.translate(0, offset);
        }
    },

    updateValue: function(value) {
        var barLength = this.barLength,
            gapLength = this.gapLength,
            length = this.getLength(),
            newLength, offset, extra;

        if (value <= 0) {
            offset = 0;
            this.updateLength(this.applyLength(length + value * barLength));
        }
        else if (value >= 1) {
            extra = Math.round((value - 1) * barLength);
            newLength = this.applyLength(length - extra);
            extra = length - newLength;
            this.updateLength(newLength);
            offset = gapLength + extra;
        }
        else {
            offset = gapLength * value;
        }

        this.setOffset(offset);
    }
});
