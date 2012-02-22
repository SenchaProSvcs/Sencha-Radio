Ext.define('SenchaRadio.model.Track',{
    extend: 'Ext.data.Model',
    config:{
        fields: [
            { name: 'id' },
            { name: 'artist',   mapping: 'Artist.name' },
            { name: 'title' },
            { name: 'album', mapping: 'Album.Release.title' },
            { name: 'artworkUrl65', convert: function(v, r) {
                return r.raw.Album.Release.Image[1].url;
            }}
        ]
    },
    
    loadItunesInfo: function(success, failure, callback) {
        var me = this,
            title = me.get('title');
        
        if (me.itunesInfo) {
            success(me.itunesInfo);
            return;
        }
        
        //normalize title for itunes
        title = title.replace('(Album Version (Explicit))', '');
        
        Ext.data.JsonP.request({
            url: 'http://ax.phobos.apple.com.edgesuite.net/WebObjects/MZStoreServices.woa/wa/wsSearch',
            callbackKey: 'callback',
            params: {
                term: me.get('artist') + ' ' +  title,
                media: 'track',
                entity: 'song',
                limit: 1
            },
            callback: callback,
            failure: failure,
            success: function(data) {
                success(me.itunesInfo = data.results[0]);
            }
        }); 
    }
});