

Ext.define('Radio.store.Charts',{
    extend: 'Ext.data.Store',
    
    config: {
        model: 'Radio.model.Chart',
        data: (function(){
            var top50 = 'http://api.jamendo.com/v3.0/tracks?client_id=0df0657f&format=json&order=popularity_week_desc&imagesize=60';
            
            return [{
                text: 'Top 50',
                api: top50
            }, {
                api: top50 + '&tags=electronic',
                text: 'Electronic'
            }, {
                api: top50 + '&tags=rock',
                text: 'Rock'
            }, {
                api: top50 + '&tags=ambient',
                text: 'Ambient'
            }, {
                api: top50 + '&tags=experimental',
                text: 'Experimental'
            }, {
                api: top50 + '&tags=pop',
                text: 'Pop'
            }, {
                api: top50 + '&tags=techno',
                text: 'Techno'
            }, {
                api: top50 + '&tags=metal',
                text: 'Metal'
            }, {
                api: top50 + '&tags=dance',
                text: 'Dance'
            }, {
                api: top50 + '&tags=hiphop',
                text: 'Hip-Hop'
            }, {
                api: top50 + '&tags=trance',
                text: 'Trance'
            }, {
                api: top50 + '&tags=classical',
                text: 'Classical'
            }, {
                api: top50 + '&tags=indie',
                text: 'Indie'
            }, {
                api: top50 + '&tags=punk',
                text: 'Punk'
            }, {
                api: top50 + '&tags=jazz',
                text: 'Jazz'
            }, {
                api: top50 + '&tags=folk',
                text: 'Folk'
            }, {
                api: top50 + '&tags=industrial',
                text: 'Industrial'
            }, {
                api: top50 + '&tags=lounge',
                text: 'Lounge'
            }, {
                api: top50 + '&tags=funk',
                text: 'Funk'
            }, {
                api: top50 + '&tags=triphop',
                text: 'Triphop'
            }, {
                api: top50 + '&tags=blues',
                text: 'Blues'
            }, {
                api: top50 + '&tags=newage',
                text: 'Newage'
            }, {
                api: top50 + '&tags=world',
                text: 'World'
            }, {
                api: top50 + '&tags=reggae',
                text: 'Reggae'
            }, {
                api: top50 + '&tags=poprock',
                text: 'Poprock'
            }, {
                api: top50 + '&tags=easylistening',
                text: 'Easy Listening'
            }, {
                api: top50 + '&tags=ska',
                text: 'SKA'
            }, {
                api: top50 + '&tags=grunge',
                text: 'Grunge'
            }, {
                api: top50 + '&tags=disco',
                text: 'Disco'
            }, {
                api: top50 + '&tags=country',
                text: 'Country'
            }, {
                api: top50 + '&tags=rnb',
                text: 'R&B'
            }, {
                api: top50 + '&tags=latin',
                text: 'Latin'
            }, {
                api: top50 + '&tags=celtic',
                text: 'Celtic'
            }, {
                api: top50 + '&tags=african',
                text: 'African'
            }, {
                api: top50 + '&tags=island',
                text: 'Island'
            }, {
                api: top50 + '&tags=asian',
                text: 'Asian'
            }, {
                api: top50 + '&tags=middleeastern',
                text: 'Middle Eastern'
            }];
        }())
    }
});