Ext.define('SenchaRadio.view.Playlist', {
    extend: 'Ext.List',
    xtype: 'playlist',
    config: {
        xtype: 'list',
        title: 'Select Playlist',
        cls: 'sr-playlist',
        store: 'Playlist',
        itemTpl: "<img src='touch/resources/themes/images/default/pictos/broadcast.png' />{name}",
        allowDeselect: true
    }
});