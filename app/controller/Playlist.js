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
        this.getApplication().setNavigationBarTitle('Select Playlist');
        list.getStore().load();
    },

    onItemTap: function(list, index, target, record) {
        list.deselect(list.getSelection());
        this.getApplication().fireEvent('playlistselected', record);
    }
});