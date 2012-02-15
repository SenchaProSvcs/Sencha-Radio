/**
 * Button with inset effect on the outside
 * @author Bruno, Ryan
 */
Ext.define('Ext.ux.InsetButton', {
    extend: 'Ext.ux.BevelButton',
    xtype: 'insetbutton',
    config: {
        // @inherit
        baseCls: Ext.baseCSSPrefix + 'insetbutton',
        
        /**
         * @cfg {String} scale
         * Define sizing of the button, 'medium' for 5em and 'small' for 3.5em.
         * @accessor
         */
        scale: 'medium'
    },
    template: [
        {
            tag: 'div',
            className: Ext.baseCSSPrefix + 'button-wrapper',
            reference: 'wrapElement',
            children: [
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
                        }
                    ]
                }
            ]
        },
        {
            tag: 'span',
            reference: 'textElement',
            hidden: true
        }
    ],
    
    updateScale: function(scale, oldScale) {
        var element = this.element,
            prefix = Ext.baseCSSPrefix + 'button-';
        
        if (oldScale) {
            element.removeCls(prefix + oldScale);
        }
        element.addCls(prefix + scale);
    }
});