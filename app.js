Ext.Loader.setConfig({ 
    enabled: true,
    paths: {
        'Ext.ux.BevelButton': 'lib/Ext.ux.BevelButton.js',
        'Ext.ux.InsetButton': 'lib/Ext.ux.InsetButton.js',
        'Ext.data.proxy.YMusic': 'lib/YMusicProxy.js'
    }
});

Ext.require([
    'Ext.Anim',
    'Ext.Audio',
    'Ext.data.proxy.YMusic',
    'Ext.field.Password',
    'Ext.MessageBox',
    'Ext.ux.BevelButton',
    'Ext.ux.InsetButton'
]);

Ext.application({
    name: 'SenchaRadio',
    phoneIcon: 'resources/img/touch-icon-iphone.png',
    glossOnIcon: false,
    models: [
        'Playlist', 
        'Track'
    ],
    stores: [
        'Playlist', 
        'Player'
    ],
    controllers: [
        'Login', 
        'Player',
        'Playlist'
    ],
    views:[
        'LoginPanel', 
        'Main', 
        'Player',
        'Playlist'
    ],
    setNavigationBarTitle:function(title){
        Ext.ComponentQuery.query('mainview')[0].getNavigationBar().titleComponent.setTitle(title);
    },
    launch: function() {
        var onAnimationEnd, audio,
            me = this;
        
        //adjust viewport
        Ext.Viewport.setLayout({
            type: 'fit'
        });
        
        //init animation
        onAnimationEnd = function() {
            
            if (!audio) {
                return;
            }
            
            Ext.getBody().un('tap', onAnimationEnd);
            audio.pause();
            audio = null;
            
            me.fireEvent('animationend');
        };

        audio = Ext.getDom('startup-audio');
        audio.play();
        
        AN.Controller.setConfig({
            parentId: 'AN-sObj-parentOl',
            ormma: false,
            scenes: [{
                id: 0, 
                animationCount: 134, 
                duration: 10, 
                dimensions: {
                    height: 480, 
                    width: 320, 
                    expanded: true, 
                    fit: true
                },
                endAction: onAnimationEnd
            }],
            events: []
        });
        
        //tap event to stop
        Ext.getBody().on('tap', onAnimationEnd);
    }
});