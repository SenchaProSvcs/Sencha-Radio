Ext.define('SenchaRadio.controller.Player', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main: 'mainview',
            player: 'player',
            dataView: 'player dataview',
            audio: 'player audio',
            playButton: 'button[action=playme]',
            ratingCt: 'player #rating-ct'
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
            'button[action=back0]': {
                tap: 'onBtnBack0Tap' 
            },
            'button[action=back1]': {
                tap: 'onBtnBack1Tap' 
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
            'button[action=shareViaMail]': {
                tap: 'onShareViaMailButtonPress'
            },
            'button[action=shareOnTwitter]': {
                tap: 'onShareOnTwitterButtonPress'
            },
            'button[action=shareOnFacebook]': {
                tap: 'onShareOnFacebookButtonPress'
            },
            'player #rating-ct > button': {
                tap: 'onStarButtonPress'
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
    
    onLikeButtonPress: function() {
        this.getPlayer().slideToolbar(1, 'left');
    },
    
    onPlayButtonPress: function(button) {
        var audio = this.getAudio();
        
        audio.toggle();
        button.setIconCls(audio.isPlaying() ? 'pause' : 'play1');
    },

    onBtnBack0Tap: function() {
        this.getPlayer().slideToolbar(0, 'right');
    },
    
    onBtnBack1Tap: function() {
        this.getPlayer().slideToolbar(1, 'right');
    },

    onShareButtonPress: function() {
        
        //<debug>
        Ext.Logger.log('Share');
        //</debug>
        
        this.getPlayer().slideToolbar(2, 'left');
    },

    onFavoriteButtonPress: function() {
        
        //<debug>
        Ext.Logger.log('Favorite');
        //</debug>
        
        this.getPlayer().slideToolbar(3, 'left');
        this.setRating(5);
    },

    onBuyButtonPress: function() {
        var trackData = this.getCurrentTrack();
        
        this.getPlayer().slideToolbar(4, 'left');
        Ext.getCmp('buyPlaceholder').setHtml('Do You want "'+ trackData.get('title')+'" by ' + trackData.get('artist'));
    },

    onGoToStoreButtonPress: function() {
        Ext.Msg.alert("TODO: Go to Store");
    },
/*
    onShareOnGooglePlusButtonPress: function(button) {
        var track = this.getCurrentTrack(),
            text = Ext.String.format(
                "I'm listening to {0} - {1} via #SenchaRadio",
                track.get('artist'),
                track.get('title')
            );

        window.open("https://m.google.com/app/plus/x/?v=compose&content=" + encodeURIComponent(text));
    },
*/

    onShareViaMailButtonPress: function() {
        var track = this.getCurrentTrack(),
            subject = "Cool Sencha radio App", // please put some meaningful text for subject line
            body = Ext.String.format(
                "I'm listening to {0} - {1} via #SenchaRadio",
                track.get('artist'),
                track.get('title')
            );

        window.open("mailto:?subject=" + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body));
    },

    onShareOnTwitterButtonPress: function() {
        var track = this.getCurrentTrack(),
            text = Ext.String.format(
                "I'm listening to {0} - {1} via #SenchaRadio",
                track.get('artist'),
                track.get('title')
            );
        
        window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(text));
    },

    onShareOnFacebookButtonPress: function() {
        var track = this.getCurrentTrack(),
            text = Ext.String.format(
                "I'm listening to {0} - {1} via #SenchaRadio",
                track.get('artist'),
                track.get('title')
            );

        window.open('https://www.facebook.com/sharer.php?t=' + encodeURIComponent(text));
    },
    
    onStarButtonPress: function(btn) {
        this.setRating(btn.config.rating);
    },
    
    pausePlayer: function() {
        this.getAudio().pause();
    },
    
    setTrack: function(currentTrack, nextTrack) {
        var me = this,
            playButton = me.getPlayButton(),
            audio = me.getAudio(),
            data = [currentTrack];
        
        if (!currentTrack) {
           audio.stop(); 
           me.getDataView().getStore().setData([]);
           return;
        }
        
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
            if (playButton){
                me.getPlayButton().setIconCls('pause');
            }
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
    },

    setRating: function(rate) {
        var star, 
            ratingCt = this.getRatingCt(),
            stars = ratingCt.query('button'),
            i = 0,
            len = stars.length,
            rateTexts = [
                'ZZzzz...',
                'I\'ve heard beter...',
                'It\'s ok.',
                'I like it.',
                'Turn it up!'
            ];
            
        for (; i < len ; i++ ) {
            star = stars[i];
            star.setIconCls(star.config.rating <= rate ? 'star' : 'star-off');
        }
        
        ratingCt.child('#rating-text').setHtml(rateTexts[rate-1]);
    }
});