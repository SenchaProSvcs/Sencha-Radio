Ext.define('Radio.controller.Main',{
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.util.DelayedTask'
    ],
    
    config: {
        refs: {
            audio: 'audio',
            chartList: 'chartlist',
            infoView: {
                selector: 'infoview',
                xtype: 'infoview',
                autoCreate: true
            },
            player: {
                selector: 'playerlist',
                xtype: 'playerlist',
                autoCreate: true
            },
            songProgressBar: 'playerlist #progress-bar'
        },
        control: {
            'chartlist #info-btn': {
                tap: 'onChartInfoBtnTap'
            },
            'chartlist': {
                itemtap: 'onChartItemTap'
            },
            
            'infoview #return-btn': {
                tap: 'onInfoReturnBtnTap'
            },
            
            'playerlist': {
                'select': 'onPlayerSongSelect'
            },
            'playerlist #play-btn': {
                tap: 'onPlayerPlayBtnTap'
            },
            'playerlist #pause-btn': {
                tap: 'onPlayerPauseBtnTap'
            },
            'playerlist #forward-btn': {
                tap: 'onPlayerForwardBtnTap'
            },
            'playerlist #rewind-btn': {
                tap: 'onPlayerRewindBtnTap'
            },
            'playerlist #back-btn': {
                tap: 'onPlayerBackBtnTap'
            }
        }
    },
    
    onChartInfoBtnTap: function() {
        var infoView = this.getInfoView(),
            viewport = Ext.Viewport;

        viewport.insert(0, infoView);
        viewport.getLayout().setAnimation('flip');
        viewport.setActiveItem(infoView);
    },
    
    onChartItemTap: function(chartList, index, t, chart) {
        var me = this,
            player = me.getPlayer();
        
        Ext.Viewport.getLayout().setAnimation('slide');
        Ext.Viewport.getLayout().getAnimation().setReverse(false);
        Ext.Viewport.setActiveItem(player);
        
        Ext.getStore('Playlist').loadByChart(chart, function(songs) {
            player.select(songs[0], false);
        });
    },
    
    onInfoReturnBtnTap: function() {
        Ext.Viewport.setActiveItem(this.getChartList());
    },
    
    onPlayerSongSelect: function(player, song) {
        var duration,
            me = this,
            audio = me.getAudio(),
            songProgressBar = me.getSongProgressBar();
          
        // save duration as string
        if (song) {
            duration = Ext.Date.clearTime(new Date());
            duration.setSeconds(song.get('duration'));
            song.set('duration_str', Ext.Date.format(duration, 'i:s'));
        }
        
        // pause current song
        if (me.currentSong) {
            clearInterval(me.taskTickSongProgress);
            delete me.taskTickSongProgress;
            
            if (audio) {
                audio.pause();
            }
        }
        
        // update attribute
        me.currentSong = song;
        
        // update UI
        player.down('#song-info-ct').setData(song ? song.getData() : null);
        songProgressBar.element.down('.bar').applyStyles('width:0;');
        songProgressBar.element.down('.timer').setHtml('00:00/00:00');
        
        if (song) {
            // load audio 
            if (!audio) {
                 audio = Ext.create('Ext.Audio',{
                    renderTo: Ext.getBody(),
                    listeners: {
                        scope: me,
                        pause: me.onAudioPause,
                        ended: me.onAudioEnded
                    }
                 });
             }
         
             audio.on('canplay', me.onPlayerPlayBtnTap, me, {single: true});
             audio.setUrl(song.get('audio'));
         }
    },
    
    onAudioPause: function() {
        clearInterval(this.taskTickSongProgress);
        delete this.taskTickSongProgress;
    },
    
    onAudioEnded: function() {
        this.onPlayerForwardBtnTap();
    },
    
    tickSongProgress: function() {
        var duration, elProgressBar, elTimer,
            me = this,
            song = me.currentSong,
            songProgressBar = me.getSongProgressBar();
            
        me.songProgress++;
        
        if (!song || !songProgressBar.element || me.songProgress > song.get('duration')) {
            clearInterval(me.taskTickSongProgress);
            delete this.taskTickSongProgress;
            return;
        }
        
        duration = Ext.Date.clearTime(new Date());
        duration.setSeconds(me.songProgress);
        
        elProgressBar = songProgressBar.element.down('.bar');
        elTimer = songProgressBar.element.down('.timer');
        
        elProgressBar.applyStyles('width:'+(me.songProgress * 100 / song.get('duration'))+'%;');
        elTimer.setHtml(Ext.Date.format(duration, 'i:s') + '/' + song.get('duration_str'));
    },
    
    onPlayerPlayBtnTap: function() {
        var me = this,
            player = me.getPlayer(),
            audio = me.getAudio();
        
        // update buttons
        player.down('#play-btn').hide();
        player.down('#pause-btn').show();
        
        // update progress
        me.songProgress = audio.getCurrentTime() - 1;

        me.tickSongProgress();
        me.taskTickSongProgress = setInterval(Ext.Function.bind(me.tickSongProgress, me), 1000);
        
        //play
        audio.play();
    },
    
    onPlayerPauseBtnTap: function() {
        var player = this.getPlayer();
        
        this.getAudio().pause();
        player.down('#play-btn').show();
        player.down('#pause-btn').hide();
    },
    
    onPlayerForwardBtnTap: function() {
        
        if (!this.currentSong) {
            return;
        }
        
        var player = this.getPlayer(),
            store = player.getStore(),
            newSong = store.getAt(store.indexOf(this.currentSong) + 1);
        
        if (!newSong) {
            player.deselectAll();
            this.onPlayerSongSelect(player, null);
        }
            
        player.select(newSong);
    },
    
    onPlayerRewindBtnTap: function() {
        
        if (!this.currentSong) {
            return;
        }
        
        var player = this.getPlayer(),
            store = player.getStore(),
            newSong = store.getAt(store.indexOf(this.currentSong) - 1);
         
        if (!newSong) {
            player.deselectAll();
            this.onPlayerSongSelect(player, null);
        }
            
        player.select(newSong);
    },
    
    onPlayerBackBtnTap: function() {
        this.onPlayerPauseBtnTap();
        this.getPlayer().deselectAll();
        this.onPlayerSongSelect(this.getPlayer(), null);
        
        Ext.Viewport.getLayout().getAnimation().setReverse(true);
        Ext.Viewport.setActiveItem(this.getChartList());
    }
});