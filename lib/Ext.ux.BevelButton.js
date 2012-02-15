/**
 * Button with bevel effect on the outside
 * @author Bruno, Ryan
 */
Ext.define('Ext.ux.BevelButton', {
    extend: 'Ext.Button',
    xtype: 'bevelbutton',
    config: {
        // @inherit
        iconAlign: 'top',
        
        // @inherit
        baseCls: Ext.baseCSSPrefix + 'bevelbutton'
    },
    template: [
        {
            tag: 'div',
            className: Ext.baseCSSPrefix + 'button-inner',
            reference: 'innerElement',
            children: [
                {
                    tag : 'span',
                    reference: 'badgeElement'
                },
                {
                    tag: 'span',
                    className: Ext.baseCSSPrefix + 'button-icon',
                    reference: 'iconElement',
                    hidden: true
                },
                {
                    tag: 'span',
                    reference: 'textElement',
                    hidden: true
                }
            ]
        }
    ],
    
    /**
     * @private
     */
    updateIconAlign: function(alignment, oldAlignment) {
        var element = this.innerElement,
            outerElement = this.element,
            baseCls = Ext.baseCSSPrefix + 'iconalign-';

        if (!this.getText()) {
            alignment = "center";
        }

        element.removeCls(baseCls + "center");
        element.removeCls(baseCls + oldAlignment);
        outerElement.removeCls(baseCls + 'center-outer');
        outerElement.removeCls(baseCls + oldAlignment + '-outer');
        
        if (this.getIcon() || this.getIconCls()) {
            element.addCls(baseCls + alignment);
            outerElement.addCls(baseCls + alignment + '-outer');
        }
    },
    
    /**
     * @private
     */
    updatePressedCls: function(pressedCls, oldPressedCls) {
        var element = this.innerElement,
            outerElement = this.element;

        if (element.hasCls(oldPressedCls)) {
            element.replaceCls(oldPressedCls, pressedCls);
        }
        
        if (outerElement.hasCls(oldPressedCls + '-outer')) {
            outerElement.replaceCls(oldPressedCls + '-outer', pressedCls + '-outer');
        }
    },
    
    // @private
    onPress: function() {
        var element = this.innerElement,
            outerElement = this.element,
            pressedDelay = this.getPressedDelay(),
            pressedCls = this.getPressedCls();

        if (!this.getDisabled()) {
            this.isPressed = true;

            if (this.hasOwnProperty('releasedTimeout')) {
                clearTimeout(this.releasedTimeout);
                delete this.releasedTimeout;
            }

            if (pressedDelay > 0) {
                this.pressedTimeout = setTimeout(function() {
                    if (element) {
                        element.addCls(pressedCls);
                        outerElement.addCls(pressedCls + '-outer');
                    }
                }, pressedDelay);
            }
            else {
                element.addCls(pressedCls);
                outerElement.addCls(pressedCls + '-outer');
            }
        }
    },
    
    // @private
    doRelease: function(me, e) {
        if (!me.isPressed) {
            return;
        }

        me.isPressed = true;

        if (me.hasOwnProperty('pressedTimeout')) {
            clearTimeout(me.pressedTimeout);
            delete me.pressedTimeout;
        }

        me.releasedTimeout = setTimeout(function() {
            if (me && me.element) {
                me.innerElement.removeCls(me.getPressedCls());
                me.element.removeCls(me.getPressedCls() + '-outer');
            }
        }, 10);
    }
});