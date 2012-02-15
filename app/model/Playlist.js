Ext.define('SenchaRadio.model.Playlist',{
    extend: 'Ext.data.Model',
    config:{
        fields: ['name','id','tracks'],
        proxy: {
            type: 'ajax',
            url: 'http://' + DEPLOYMENT_SITE + '/serverside/get_playlist.php',
            extraParams: {
                sencha_radio : null
            }
        }
    }
});