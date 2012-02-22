Ext.define('SenchaRadio.store.Player',{
    extend: 'Ext.data.Store',
    config:{
        model: 'SenchaRadio.model.Track',
        proxy: {
            type: 'ymusic',
            reader: {
                type: 'json',
                rootProperty: 'query.results.Track'
            }
        }
    }
});