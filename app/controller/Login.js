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

        Ext.Ajax.request({
            method: 'POST',
            url: 'http://' + DEPLOYMENT_SITE + '/serverside/login.php',
            params: {
                user : credentials.user,
                pass : credentials.pass
            },
            callback: function() {
                Ext.Viewport.unmask();
            },
            success: function(request) {
                request = Ext.decode(request.responseText);
                
                if (!request.done) {
                    Ext.Msg.alert('Error', request.msg, Ext.emptyFn);
                    return;
                }
                    
                //For production usage on your site store the serverside and client code at the same server!
                SESSION_COOKIE = request.sencha_radio; //we set session id in the variable and access it later.
                me.launchMainView();
            }
        });
    },

    launchMainView: function() {
        Ext.Viewport.removeAll(true,true);
        Ext.get("animation-wrapper").destroy();
        Ext.widget('mainview');
    }
});