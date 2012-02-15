Ext.define('SenchaRadio.view.LoginPanel',{
    extend: 'Ext.form.Panel',
    xtype: 'loginpanel',
    config: {
        cls: 'sr-loginpanel',
        items: [
            {
                xtype: 'toolbar',
                docked: 'bottom',
                cls: 'hidden-toolbar',
                items: [
                    {
                        xtype: 'container',
                        flex: 1,
                        defaults: {
                            height: 40
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                placeHolder: 'Username',
                                name:'user'
                            },
                            {
                                xtype: 'passwordfield',
                                placeHolder: 'Password',
                                name:'pass'
                            }
                        ]
                    },
                    {
                        xtype: 'bevelbutton',
                        action: 'login',
                        iconCls: 'cloud_black_upload2',
                        text: 'Login',
                        iconMask: true
                    }
                ]
            }
        ]
    }
});