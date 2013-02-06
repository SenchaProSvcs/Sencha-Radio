Ext.define('Radio.store.Playlist',{
    extend: 'Ext.data.Store',
    requires: [
        'Ext.data.proxy.JsonP'
    ],
    
    config: {
        model: 'Radio.model.Song',
        proxy: {
            type: 'jsonp',
            callbackKey: 'jsoncallbackfunction'
        }
    },
    
    loadByChart: function(chart, options, scope) {
        var me = this;
        me.removeAll();
        me.getProxy().setUrl(chart.get('api'));
        return me.load(options, scope);
    }
});