Ext.define('SenchaRadio.view.Player', {
    extend: 'Ext.Container',
    xtype: 'player',
    config: {
        cls: 'sr-player',
        layout: 'fit',
        items: [{
            xtype: 'dataview',
            emptyText: 'No Tracks',
            loadingText: 'Loading songs...',
            itemTpl: Ext.create('Ext.XTemplate',
                '<tpl if="this.isPlaying(values)">',
                    '<div class="now-playing">Now Playing <tpl if="unavailable">(unavailable)</tpl>...</div>',
                '<tpl else>',
                    '<div class="coming-up"> Coming up next ...</div>',
                '</tpl>',
                '<div class="track-row">',
                    '<img src="{artworkUrl65}" />',
                    '<div class="player-info">',
                        '<h1>{artist}</h1>',
                        '<h2>Song: {title}</h2>',
                        '<h3>Album: {album}</h3>',
                    '</div>',
                '</div>',
                {
                    isPlaying: function(values) {
                        var store = Ext.ComponentQuery.query('player')[0].child('dataview').getStore();
                        return store.getCount() === 1 || store.indexOf(store.getById(values.id)) === 1;
                    }
                }
            )
        },{
            xtype: 'container',
            docked: 'bottom',
            itemId: 'ct-toolbar',
            layout: 'card',
            height: 120,
            defaultType: 'toolbar'
        },{
            xtype: 'audio',
            enableControls: false,
            hidden: true
        }]
    },
    
    initialize: function() {
        var me = this;
        
        //set new instance of Player store
        me.child('dataview').setStore(Ext.create('SenchaRadio.store.Player'));
        
        me.toolbars = [
            {
                cls: 'player-toolbar',
                layout: {
                    type: 'hbox',
                    pack: 'center'
                },
                items: [
                    {
                        xtype: 'insetbutton',
                        scale: 'small',
                        action: 'dislike',
                        iconCls: 'dislike',
                        iconMask: true
                    },
                    {
                        xtype: 'insetbutton',
                        action: 'playme',
                        iconCls: 'pause',
                        iconMask: true
                    },
                    {
                        xtype: 'insetbutton',
                        scale: 'small',
                        action: 'like',
                        iconCls: 'like',
                        iconMask: true
                    }
                ]
            }, 
            {
                xtype: 'toolbar',
                cls: 'player-toolbar',
                layout: {
                    type: 'hbox',
                    pack: 'right'
                },
                items: [
                    {
                        xtype: 'bevelbutton',
                        action: 'back0',
                        iconCls: 'left2',
                        text: 'Back',
                        iconMask: true
                    },
                    {
                        xtype: 'spacer'
                    },
                    {
                        xtype: 'insetbutton',
                        scale: 'small',
                        action: 'share',
                        iconCls: 'chat',
                        text:'Share',
                        iconMask: true
                    },
                    {
                        xtype: 'insetbutton',
                        scale: 'small',
                        action: 'favorite',
                        iconCls: 'heart',
                        text: 'Rate',
                        iconMask: true
                    },
                    {
                        xtype: 'insetbutton',
                        scale: 'small',
                        action: 'buy',
                        iconCls: 'music1',
                        text: 'Buy',
                        iconMask: true
                    },
                    {
                        xtype: 'spacer'
                    }
                ]
            },
            {
                xtype: 'toolbar',
                cls: 'player-toolbar',
                layout: {
                    type: 'hbox',
                    pack: 'center'
                },
                items: [
                    {
                        xtype: 'bevelbutton',
                        action: 'back1',
                        iconCls: 'left2',
                        text: 'Back',
                        iconMask: true
                    },
                    {
                        xtype: 'spacer'
                    },
                    {
                        xtype: 'insetbutton',
                        scale: 'small',
                        action: 'shareViaMail',
                        iconCls: 'social_google',
                        text: 'Mail to'
                    },
                    {
                        xtype: 'insetbutton',
                        scale: 'small',
                        action: 'shareOnTwitter',
                        iconCls: 'social_twitter',
                        text: 'Twitter'
                    },
                    {
                        xtype: 'insetbutton',
                        scale: 'small',
                        action: 'shareOnFacebook',
                        iconCls: 'social_facebook',
                        text: 'Facebook'
                    },
                    {
                        xtype: 'spacer'
                    }
                ]
            }, 
            {
                xtype: 'toolbar',
                cls: 'player-toolbar',
                layout: {
                    type: 'hbox',
                    pack: 'center'
                },
                items: [
                    {
                        xtype: 'bevelbutton',
                        action: 'back1',
                        iconCls: 'left2',
                        text: 'Back',
                        iconMask: true
                    },
                    {
                        xtype: 'spacer'
                    },
					{
                        xtype: 'container',
                        layout: 'hbox',
                        itemId: 'rating-ct',
                        cls: 'rating-ct',
                        defaults: {
                            xtype: 'button',
                            iconCls: 'star-off',
                            ui: 'plain',
                            iconMask: true
                        },
                        items:[
                            {
                                rating: 1
                            },
                            {
                                rating: 2
                            },
                            {
                                rating: 3
                            },
                            {
                                rating: 4
                            },
                            {
                                rating: 5
                            },
    						{
    							xtype: 'container',
    							cls: 'rating-text',
    							itemId: 'rating-text',
    							hidden: Ext.os.is('Phone')
    						}
						]
					},
					{
                        xtype: 'spacer'
                    }
                ]
            }, 
            {
                xtype: 'toolbar',
                cls: 'player-toolbar',
                layout: {
                    type: 'hbox',
                    pack: 'center'
                },
                items: [
                    {
                        xtype: 'bevelbutton',
                        action: 'back1',
                        iconCls: 'left2',
                        text: 'Back',
                        iconMask: true
                    },
                    {
                        xtype: 'spacer'
                    },
                    {
                        xtype:'container',
                        layout:{
                            type:'vbox',
                            pack: 'center'
                        },
                        items:[
                            {
                                xtype:'container',
        						cls: 'purchase-ct',
                                id:'buyPlaceholder',
                                html: 'woo',
                                items:[
                                    {
                                        xtype: 'container',
                                        cls: 'btn-bevel-buy',
                                        items:[
                                            {
                                                xtype: 'button',
                                                ui: 'buy',
                                                action: 'goToStore',
                                                text:'Purchase for $1.99',
                                                iconMask: true
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype: 'spacer'
                    }
                ]
            }
        ];
        
        me.callParent(arguments);
        me.child('#ct-toolbar').add(me.toolbars[0]);
    },
    
    slideToolbar: function(index, direction) {
        var newToolbar,
            toolbars = this.toolbars,
            toolbarCt = this.child('#ct-toolbar'),
            oldToolbar = toolbarCt.getActiveItem();
        
        //add toolbar
        newToolbar = toolbarCt.add(toolbars[index]);
        
        //show listener to destroy previous toolbar
        oldToolbar.on('hide', oldToolbar.destroy, oldToolbar, {single: true});
        
        //slide
        toolbarCt.getLayout().setAnimation({type:'slide', direction: direction});
        toolbarCt.setActiveItem(newToolbar);
    }
});