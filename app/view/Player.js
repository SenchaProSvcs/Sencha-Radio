Ext.define('Radio.view.Player',{
    extend: 'Ext.List',
    xtype: 'playerlist',
    requires: [
        'Ext.Audio',
        'Ext.Button',
        'Ext.Spacer',
        'Ext.Toolbar'
    ],
    
    config: {
        store: 'Playlist',
        cls: 'player-view',
        itemTpl: '<h1>{name}</h1></h2>{artist_name}</h2>',
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            cls: 'info-tb',
            items: [{
                iconCls: 'left',
                itemId: 'back-btn'
            },{
                xtype: 'component',
                itemId: 'song-info-ct',
                cls: 'song-info',
                tpl:    '<div class="song" style="background-image:url({album_image});">' +
                        '<h1>{name}</h1>' +
                        '<h2>{artist_name}</h2>'
            },{
                xtype: 'spacer'
            },{
                iconCls: 'action',
                itemId: 'action-btn'
            }]
        },{
            xtype: 'toolbar',
            docked: 'top',
            cls: 'controls-tb',
            items: [{
                iconCls: 'rewind',
                itemId: 'rewind-btn'
            },{
                iconCls: 'play',
                itemId: 'play-btn'
            },{
                iconCls: 'pause',
                itemId: 'pause-btn',
                hidden: true
            },{
                iconCls: 'forward',
                itemId: 'forward-btn'
            },{
                xtype: 'component',
                itemId: 'progress-bar',
                flex: 1,
                html:   '<div class="bar-bg"><div class="bar" style="width:0%;"></div></div>'+
                        '<p class="timer">00:00/00:00</p>'
            }]
        }]
    }
});