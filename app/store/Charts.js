Ext.define('Radio.store.Charts',{
    extend: 'Ext.data.Store',
    
    config: {
        model: 'Radio.model.Chart',
        data: (function(){
            var top50 = 'http://api.jamendo.com/get2/id+name+stream+artist_name+album_image+duration/track/json/track_album+album_artist/?n=50&order=ratingday_desc';
            
            return [{
                text: 'Top 50',
                api: top50
            }, {
                api: top50 + '&tag_idstr=electronic',
                text: 'Electronic'
            }, {
                api: top50 + '&tag_idstr=rock',
                text: 'Rock'
            }, {
                api: top50 + '&tag_idstr=ambient',
                text: 'Ambient'
            }, {
                api: top50 + '&tag_idstr=experimental',
                text: 'Experimental'
            }, {
                api: top50 + '&tag_idstr=pop',
                text: 'Pop'
            }, {
                api: top50 + '&tag_idstr=techno',
                text: 'Techno'
            }, {
                api: top50 + '&tag_idstr=metal',
                text: 'Metal'
            }, {
                api: top50 + '&tag_idstr=dance',
                text: 'Dance'
            }, {
                api: top50 + '&tag_idstr=hiphop',
                text: 'Hip-Hop'
            }, {
                api: top50 + '&tag_idstr=trance',
                text: 'Trance'
            }, {
                api: top50 + '&tag_idstr=classical',
                text: 'Classical'
            }, {
                api: top50 + '&tag_idstr=indie',
                text: 'Indie'
            }, {
                api: top50 + '&tag_idstr=punk',
                text: 'Punk'
            }, {
                api: top50 + '&tag_idstr=jazz',
                text: 'Jazz'
            }, {
                api: top50 + '&tag_idstr=folk',
                text: 'Folk'
            }, {
                api: top50 + '&tag_idstr=industrial',
                text: 'Industrial'
            }, {
                api: top50 + '&tag_idstr=lounge',
                text: 'Lounge'
            }, {
                api: top50 + '&tag_idstr=funk',
                text: 'Funk'
            }, {
                api: top50 + '&tag_idstr=triphop',
                text: 'Triphop'
            }, {
                api: top50 + '&tag_idstr=blues',
                text: 'Blues'
            }, {
                api: top50 + '&tag_idstr=newage',
                text: 'Newage'
            }, {
                api: top50 + '&tag_idstr=world',
                text: 'World'
            }, {
                api: top50 + '&tag_idstr=reggae',
                text: 'Reggae'
            }, {
                api: top50 + '&tag_idstr=poprock',
                text: 'Poprock'
            }, {
                api: top50 + '&tag_idstr=easylistening',
                text: 'Easy Listening'
            }, {
                api: top50 + '&tag_idstr=ska',
                text: 'SKA'
            }, {
                api: top50 + '&tag_idstr=grunge',
                text: 'Grunge'
            }, {
                api: top50 + '&tag_idstr=disco',
                text: 'Disco'
            }, {
                api: top50 + '&tag_idstr=country',
                text: 'Country'
            }, {
                api: top50 + '&tag_idstr=rnb',
                text: 'R&B'
            }, {
                api: top50 + '&tag_idstr=latin',
                text: 'Latin'
            }, {
                api: top50 + '&tag_idstr=celtic',
                text: 'Celtic'
            }, {
                api: top50 + '&tag_idstr=african',
                text: 'African'
            }, {
                api: top50 + '&tag_idstr=island',
                text: 'Island'
            }, {
                api: top50 + '&tag_idstr=asian',
                text: 'Asian'
            }, {
                api: top50 + '&tag_idstr=middleeastern',
                text: 'Middle Eastern'
            }];
        }())
    }
});