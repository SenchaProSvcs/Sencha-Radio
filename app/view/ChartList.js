Ext.define('Radio.view.ChartList',{
    extend: 'Ext.List',
    xtype: 'chartlist',
    requires: [
        'Ext.Button',
        'Ext.Toolbar'
    ],
    
    config: {
        store: 'Charts',
        cls: 'chartlist-view',
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            items: [{
                iconCls: 'info',
                itemId: 'info-btn'
            },{
                xtype: 'title',
                title: 'Top Charts',
                centered: true
            }]
        }]
    }
});