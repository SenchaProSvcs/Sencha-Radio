Ext.define('SenchaRadio.controller.Player', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main: 'mainview',
            player: 'player',
            dataView: 'player dataview',
            audio: 'player audio',
            playButton: 'button[action=playme]'
        },
        control: {
            player: {
                hide: 'onPanelHide'
            },
            audio: {
                ended: 'onAudioEnded'
            },
            'button[action=dislike]': {
                tap: 'onDislikeButtonPress'
            },
            'button[action=like]': {
                tap: 'onLikeButtonPress'
            },
            playButton: {
                tap: 'onPlayButtonPress'
            },
            'button[action=back]': {
                tap: 'onBackButtonPress'
            },
            'button[action=share]': {
                tap: 'onShareButtonPress'
            },
            'button[action=favorite]': {
                tap: 'onFavoriteButtonPress'
            },
            'button[action=buy]': {
                tap: 'onBuyButtonPress'
            },
            'button[action=goToStore]': {
                tap: 'onGoToStoreButtonPress'
            },
            'button[action=shareOnGooglePlus]': {
                tap: 'onShareOnGooglePlusButtonPress'
            },
            'button[action=shareOnTwitter]': {
                tap: 'onShareOnTwitterButtonPress'
            },
            'button[action=shareOnFacebook]': {
                tap: 'onShareOnFacebookButtonPress'
            }
        }
    },
    
    init: function() {
        var me = this;

        me.getApplication().on({
            playlistselected: me.onPlaylistSelected,
            scope: me
        });
    },
    
    onPlaylistSelected: function(playlist) {
        var me = this,
            store = Ext.getStore('Player');
        
        //add player panel    
        me.getMain().push({
            xtype: 'player',
            title: playlist.get('name')
        });
        
        player = me.getDataView();
        
        //pause music
        me.currentTrack = 0;
        me.pausePlayer();

        //load tracks
        player.onBeforeLoad();
        
        store.getProxy().setQuery(playlist.getId());
        store.load({
            callback: function(tracks) {
                
                player.onLoad();
                
                //play only if there is data and we assume that more than 1 track present
                if (tracks.length > 1) {
                    
                    //starting from zero
                    me.setTrack(tracks[0], tracks[1]);
                }
            }
        });
    },
    
    onPanelHide: function() {
        this.pausePlayer();
    },

    onAudioEnded: function() {
        this.nextTrack();
    },
    
    onDislikeButtonPress: function() {
        this.nextTrack(true);
    },
    
    onLikeButtonPress: function(button) {
        this.getPlayer().slideToolbar(1, 'left');
    },
    
    onPlayButtonPress: function(button) {
        var audio = this.getAudio();
        
        audio.toggle();
        button.setIconCls(audio.isPlaying() ? 'pause' : 'play1');
    },

    onBackButtonPress: function(button) {
        this.getPlayer().slideToolbar(0, 'right');
    },

    onShareButtonPress: function(button) {
        
        //<debug>
        Ext.Logger.log('Share');
        //</debug>
        
        this.getPlayer().slideToolbar(2, 'left');
    },

    onFavoriteButtonPress: function(button) {
        
        //<debug>
        Ext.Logger.log('Favorite');
        //</debug>
        
        this.getPlayer().slideToolbar(3, 'left');
    },

    onBuyButtonPress: function(button) {
        var trackData = this.getCurrentTrack();
        
        this.getPlayer().slideToolbar(4, 'left');
        Ext.getCmp('buyPlaceholder').setHtml('Do You want "'+ trackData.get('title')+'" by ' + trackData.get('artist'));
    },

    onGoToStoreButtonPress: function(button) {
        Ext.Msg.alert("TODO: Go to Store");
    },

    onShareOnGooglePlusButtonPress: function(button) {
        Ext.Msg.alert("TODO: Share on Plus");
    },

    onShareOnTwitterButtonPress: function(button) {
        var track = this.getCurrentTrack(),
            text = Ext.String.format(
                "I'm listening to {0} - {1} via #SenchaRadio",
                track.get('artist'),
                track.get('title')
            );
        
        window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(text));
    },

    onShareOnFacebookButtonPress: function(button) {
        var track = this.getCurrentTrack(),
            text = Ext.String.format(
                "I'm listening to {0} - {1} via #SenchaRadio",
                track.get('artist'),
                track.get('title')
            );

        window.open('http://www.facebook.com/sharer/sharer.php?t=' + encodeURIComponent(text));
    },
    
    pausePlayer: function() {
        this.getAudio().pause();
    },
    
    setTrack: function(currentTrack, nextTrack) {
        var me = this,
            audio = me.getAudio(),
            data = [currentTrack];
        
        //load store    
        if (nextTrack) {
            data.unshift(nextTrack);
        }
        me.getDataView().getStore().setData(data);

        //play audio
        currentTrack.loadItunesInfo(function(data) {
            
            if (!data) {
                audio.stop();
                currentTrack.set('unavailable', true);
                return;
            }
            
            audio.setUrl(data.previewUrl);
            audio.play();
            
            //adjust UI
            me.getPlayButton().setIconCls('pause');
        });
    },
    
    nextTrack: function(dislike) {
        var me = this,
            store = Ext.getStore('Player');
            
        dislike = dislike||false;
        
        if (store.getCount() !== 0) {
            
            //<debug>
            Ext.Logger.log('Next track');
            //</debug>
            
            me.currentTrack++;
            me.setTrack(me.getCurrentTrack(), me.getNextTrack());
            
        } else {
            
            //<debug>
            Ext.Logger.log('No items left');
            //</debug>
            
            me.getAudio().pause();
        }
        
        //TODO: if dislike = true, mark the music as "not liked".
    },
    
    getCurrentTrack: function() {
        return Ext.getStore('Player').getAt(this.currentTrack);
    },
    
    getNextTrack: function() {
        return Ext.getStore('Player').getAt(this.currentTrack + 1);
    }
});