Ext.define('SenchaRadio.model.Track',{
    extend: 'Ext.data.Model',
    config:{
        fields: [
            'id', 
            'playlist_id', 
            'artist', 
            'song', 
            'album', 
            'position', 
            'bio', 
            'years_active', 
            'birthday', 
            'artworkUrl30',
            'artworkUrl60', 
            'artworkUrl100', 
            'previewUrl', 
            'trackViewUrl', 
            'trackId', 
            'collectionId', 
            'artistId', 
            'primaryGenreName'
        ],
        proxy: {
            type: 'ajax',
            url: 'http://' + DEPLOYMENT_SITE + '/serverside/get_details.php',
            extraParams: {
                sencha_radio : null
            }
        }
    }
});