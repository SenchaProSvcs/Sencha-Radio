//deployment site, change to site , where Your serverside code will reside
DEPLOYMENT_SITE ='radio.stju.info';
SESSION_COOKIE = null;

Ext.Loader.setConfig({ 
    enabled: true,
    paths: {
        'Ext.ux.BevelButton': 'lib/Ext.ux.BevelButton.js',
        'Ext.ux.InsetButton': 'lib/Ext.ux.InsetButton.js'
    }
});

Ext.require([
    'Ext.Anim',
    'Ext.Audio',
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
        var onAnimationEnd, btnSkip,
            me = this;
        
        //adjust viewport
        Ext.Viewport.setLayout({
            type: 'fit'
        });
        
        //init animation
        onAnimationEnd = function() {
            btnSkip.destroy();
            me.fireEvent('animationend');
        };
        
        AN.Controller.setConfig({
            parentId: 'AN-sObj-parentOl',
            ormma: false,
            scenes: [{id: 0, animationCount: 134, duration: 10, dimensions: {height: 480, width: 320, expanded: true, fit: true},
                endAction: onAnimationEnd
            }],
            events: []
        });
        
        //create skip animation button for Desktop
        btnSkip = Ext.widget('button', {
            cls: 'btn-skip-animation',
            text: 'Skip Animation >>>',
            ui: 'plain',
            hidden: !Ext.os.is.Desktop,
            renderTo: Ext.getBody(),
            handler: onAnimationEnd
        });
    }
});