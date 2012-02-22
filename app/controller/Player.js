Ext.define('SenchaRadio.controller.Player', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main: 'mainview',
            player: 'player',
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
        var store,
            me = this;
        
        //add player panel    
        player = me.getMain().push({
            xtype: 'player',
            playlist: playlist
        });
        
        store = player.getStore();
    
        //pause music
        me.pausePlayer();
        
        //reset the player
        store.removeAll();
        player.setHtml('');
        
        //load tracks
        store.getProxy().setQuery(playlist.getId());
        store.load({
            callback: function(details) {
                debugger;
                //play only if there is data and we assume that more than 1 track present
                if (details.length > 1) {
                    player.setHtml('<div class="coming-up"> Coming up next ...</div>');
                    me.radioData = details.raw.tracks;
                    me.getApplication().setNavigationBarTitle(playlist.get('name'));
                    
                    //starting from zero
                    me.currentTrack = 0;
                    me.setTrack(me.radioData[0], me.radioData[1]);
                    
                } else {
                    player.setHtml('');
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
        this.slideToolbar(1, 'left');
    },
    
    onPlayButtonPress: function(button) {
        var audio = this.getAudio();
        
        audio.toggle();
        button.setIconCls(audio.isPlaying() ? 'pause' : 'play1');
    },

    onBackButtonPress: function(button) {
        this.slideToolbar(0, 'right');
    },

    onShareButtonPress: function(button) {
        console.log('share');
        this.slideToolbar(2, 'left');
    },

    onFavoriteButtonPress: function(button) {
        console.log('favorite');
        this.slideToolbar(3, 'left');
    },

    onBuyButtonPress: function(button) {
        console.log('buy');
        var placeholder = Ext.getCmp('buyPlaceholder');
        var trackData = this.radioData[this.currentTrack];
        placeholder.setHtml('Do You want "'+ trackData.song+'" by ' + trackData.artist);
        this.slideToolbar(4, 'left');
    },

    onGoToStoreButtonPress: function(button) {
        console.log('go to store');
        //implement logic here
    },

    onShareOnGooglePlusButtonPress: function(button) {
        console.log('onShareOnGooglePlusButtonPress');
        //implement logic here
    },

    onShareOnTwitterButtonPress: function(button) {
        console.log('onShareOnTwitterButtonPress');
        //implement logic here
    },

    onShareOnFacebookButtonPress: function(button) {
        console.log('onShareOnFacebookButtonPress');
        //implement logic here
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
        me.getPlayer().getStore().setData(data);

        //play audio
        audio.setUrl(currentTrack.previewUrl);
        audio.play();
        
        //adjust UI
        me.getPlayButton().setIconCls('pause');
    },
    
    nextTrack: function(dislike) {
        var me = this,
            data = me.radioData;
            
        dislike = dislike||false;
        
        if (data.length > (me.currentTrack + 2)) {
            
            //<debug>
            Ext.Logger.log('Next track');
            //</debug>
            
            me.currentTrack++;
            me.setTrack(data[me.currentTrack], data[me.currentTrack+1]);
            
        } else if (data.length == (me.currentTrack + 2)) {
            
            //<debug>
            Ext.Logger.log('Last track');
            //</debug>
            
            me.currentTrack++;
            me.setTrack(data[me.currentTrack]);
            
        } else {
            
            //<debug>
            Ext.Logger.log('No items left');
            //</debug>
            
            me.getAudio().pause();
        }
        
        //TODO: if dislike = true, mark the music as "not liked".
    },
    
    slideToolbar: function(cardId, direction) {
        var toolbarCt = this.getPlayer().child('#ct-toolbar');
        toolbarCt.getLayout().setAnimation({type:'slide', direction:direction});
        toolbarCt.setActiveItem(cardId);
    }
});