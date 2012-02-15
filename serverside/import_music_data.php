<?php
ini_set('display_errors',1);
include('config.php');
include('lib/extra.php');
include('lib/mysqli_class.php');

$db = new Database(RADIO_DB_HOST, RADIO_DB_USER, RADIO_DB_PASSWORD, RADIO_DB);
$db->connect();

// Cache UK TOP 40

$top40data = json_decode(get_UK_TOP40());
//echo var_dump($top40data->items[0]);

//cleanup
$clean_sql = "delete from songs where playlist_id = 1";
$db->query($clean_sql);

$a=0;
foreach($top40data->items as $item){
    $a++;
    $artist = $item->artist;
    $title = $item->title;

    // lookup
    $song_data = json_decode(getiTunesSongData($artist, $title));
    //echo var_dump($song_data);

    if($song_data->resultCount > 0){ //only if we have data!
        echo $artist. '&nbsp;-&nbsp;'. $title;
        $artist_id = $song_data->results[0]->artistId;
        echo ', '.$artist_id;

        //get artist data
        $authorsBio = json_decode(getiTunesAuthorBio($artist_id));
        echo var_dump($authorsBio).'<br><br><br>';

        $song = $song_data->results[0];
        $arr = array(
            'playlist_id' => 1,
            'artist' => $artist,
            'song' => $title,
            'album' => $song->collectionName,
            'position' => $a,
            'bio' => $authorsBio->bio,
            'years_active' => $authorsBio->yearsActive,
            'birthday' => $authorsBio->born,
            'artworkUrl30' => $song->artworkUrl30,
            'artworkUrl60' => $song->artworkUrl60,
            'artworkUrl100' => $song->artworkUrl100,
            'previewUrl' => $song->previewUrl,
            'trackViewUrl' => $song->trackViewUrl,
            'trackId' => $song->trackId,
            'collectionId' => $song->collectionId,
            'artistId' => $artist_id,
            'primaryGenreName' => $song->primaryGenreName
        );
        //save playlist to db
        $db->query_insert('songs', $arr);
    }
}


// cache other Lists
