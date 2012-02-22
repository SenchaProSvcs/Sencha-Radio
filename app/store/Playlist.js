Ext.define('SenchaRadio.store.Playlist',{
    extend: 'Ext.data.Store',
    config:{
        model: 'SenchaRadio.model.Playlist',
        data: [
            { id: 'popular', name: 'Yahoo! Top Songs' }
        ]
    }
});