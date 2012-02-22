Ext.define('SenchaRadio.controller.Login', {
    extend: 'Ext.app.Controller',
    config:{
        refs: {
            loginPanel: 'loginpanel'
        },
        control:{
            'button[action=login]': {
                tap: 'onLoginTap'
            }
        }
    },
    
    init: function() {
        var me = this;

        me.getApplication().on({
            animationend: me.onAnimationEnd,
            scope: me,
            single: true
        });
    },
    
    launch: function() {
        Ext.Viewport.add({
            xtype: 'loginpanel'
        });
    },
    
    onAnimationEnd: function() {
        this.getLoginPanel().child('toolbar').removeCls('hidden-toolbar');
    },
    
    onLoginTap: function() {
        var me = this;
            credentials = me.getLoginPanel().getValues();

        Ext.Viewport.setMasked({ 
            xtype: 'loadmask',
            message: 'Loading...'
        });
        
        //Fake login request delay
        Ext.defer(function(){
            Ext.Viewport.unmask();
            me.launchMainView();
        }, 500);
    },

    launchMainView: function() {
        Ext.Viewport.removeAll(true,true);
        Ext.get("animation-wrapper").destroy();
        Ext.widget('mainview');
    }
});