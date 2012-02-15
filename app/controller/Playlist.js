Ext.define('SenchaRadio.controller.Playlist', {
    extend: 'Ext.app.Controller',
    config:{
        refs: {
            main: 'mainview'
        },
        control:{
            'playlist': {
                show: 'onPanelShow',
                itemtap: 'onItemTap'
            }
        }
    },
    
    onPanelShow: function(list) {
        var store = list.getStore();
        
        this.getApplication().setNavigationBarTitle('Select Playlist');
        store.getProxy().setExtraParam('sencha_radio', SESSION_COOKIE);
        list.getStore().load();
    },

    onItemTap: function(list, index, target, record) {
        list.deselect(list.getSelection());
        this.getApplication().fireEvent('playlistselected', record);
    }
});