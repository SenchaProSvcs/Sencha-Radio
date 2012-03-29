Ext.define('SenchaRadio.view.Main', {
    extend: 'Ext.navigation.View',
    xtype: 'mainview',
    config: {
        fullscreen: true,
        navigationBar: {
            items:[
                {
                    text   : 'Credits',
                    action : 'displayCreditsTap',
                    align  : 'right'
                }
            ]
        },
        items: [
            {
                xtype: 'playlist'
            }
        ],
        control: {
            'button[action=displayCreditsTap]': {
                tap: 'displayCredits'
            }
        }
    },
    initialize:function(){
        var me = this;
        var isPhone = Ext.os.deviceType == 'Phone';

        me.overlay = Ext.Viewport.add({
            xtype: 'panel',

            // We give it a left and top property to make it floating by default
            left: 0,
            top: 0,

            // Make it modal so you can click the mask to hide the overlay
            modal: true,
            hideOnMaskTap: true,

            // Make it hidden by default
            hidden: true,

            // Set the width and height of the panel
            width: isPhone ? 260 : 400,
            height: isPhone ? '70%' : 400,

            // Here we specify the #id of the element we created in `index.html`
            contentEl: 'credits',

            // Style the content and make it scrollable
            styleHtmlContent: true,
            scrollable: true,

            // Insert a title docked at the top with a title
            items: [
                {
                    docked: 'top',
                    xtype: 'toolbar',
                    title: 'Credits'
                }
            ]
        });

        me.callParent(arguments);
    },

    displayCredits:function(button){
        this.overlay.showBy(button);
    }
});