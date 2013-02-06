Ext.define('Radio.model.Song',{
    extend: 'Ext.data.Model',
    requires: [
    ],
    
    config: {
        fields: [{
            name:'id',
            type: 'int'
        },{
            name:'name',
            type: 'string'
        },{
            name:'stream',
            type: 'string'
        },{
            name:'artist_name',
            type: 'string'
        },{
            name:'album_image',
            type: 'string'
        },{
            name:'duration',
            type: 'int'
        }]
    }
});