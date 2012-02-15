Ext.define('SenchaRadio.view.Main', {
    extend: 'Ext.navigation.View',
    xtype: 'mainview',
    config: {
        fullscreen: true,
        items: [
            {
                xtype: 'playlist'
            }
        ]
    }
});