Ext.define('Radio.view.Info',{
    extend: 'Ext.Container',
    xtype: 'infoview',
    requires: [
        'Ext.Button',
        'Ext.fx.animation.Cube',
        'Ext.fx.layout.card.Cube'
    ],
    
    config: {
        cls: 'info-view',
        scrollable: 'vertical',
        items: [{
            xtype: 'button',
            iconCls: 'right',
            text: 'Return',
            iconAlign: 'right',
            itemId: 'return-btn'
        }],
        html:   '<label class="highlight">by</label>'+
                '<p>Sencha Professional Services Team</p>'+
                '<label class="highlight">built with</label>'+
                '<p>Sencha Touch<br />Jamendo API<br />Subtle Patterns</p>'
    }
});