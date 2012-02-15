<?
function is_spam($text, $words= "fuck,shit,damn,ass,viagra,cialis,http,insurance"){
    $bad_words = explode (',',$words);

    $exten = array('','ed','ing','s');
    //replace symbols to space
    $mustchange = array(":", "/", ",", ".", "(", ")", "-", ";", '"', "=");
    $text= str_replace($mustchange, ' ', $text);
    // Create an array from input
    $string = explode(' ',strtolower($text));
    // Create a new array for all combinations of swear words
    $wordList = array();
    // Add all combinations to the new array
    foreach($bad_words as $word){
        foreach($exten as $ext){
            $wordList[] = trim($word).$ext; //trim whitespace
        }
    }
    // Loop through each input word, and check if it is a bad word or not
    // FALSE = Good Words
    // TRUE = Bad Words
    $badWord = FALSE;
    foreach($string as $s){
        if(in_array($s, $wordList)){
            $badWord = TRUE;
        }
    }
    // Do something if output is good or bad in this case display a message
    if($badWord)
        return true; // is spam
    else
        return false; //not spam
}

// Function to convert a signed integer to an unsigned integer:
function signed2unsigned($integer){
    return ($integer < 0) ? ($integer - $integer) - $integer : $integer;
}

function get_UK_TOP40($singles=true){
    if($singles){
        $data = file_get_contents('http://www.bbc.co.uk/radio1/chart/singles/print');
        $start_search = '<table border="1" cellpadding="3" cellspacing="0" width="100%" style="font-family: Arial; font-size: 70%;"><tr><th>Pos.</th><th>Status</th><th>Prev.</th><th>Wks</th><th>Artist</th><th>Title</th></tr>';
    }else{
        $data = file_get_contents('http://www.bbc.co.uk/radio1/chart/albums/print');
        $start_search = '<table border="1" cellpadding="3" cellspacing="0" width="100%" style="font-family: Arial; font-size: 70%;"><tr><th>Pos.</th><th>Status</th><th>Prev.</th><th>Wks</th><th>Artist</th><th>Title</th></tr>';
    }

    $newlines = array("\t", "\n", "\r", "\x20\x20", "\0", "\x0B");

    $data = str_replace($newlines, "", html_entity_decode($data));

    $scrape_start = strpos($data, $start_search);
    $scrape_end   = strpos($data, '</table>', $scrape_start);
    $the_table    = substr($data, $scrape_start, ($scrape_end - $scrape_start));
    $the_table    = str_replace(' style="font-family: Arial; font-size: 70%;"', '', $the_table);

    $heading_start = strpos($data, '<h2');
    $heading_end   = strpos($data, '</h2>', $heading_start);
    $the_heading   = strip_tags(substr($data, $heading_start, ($heading_end - $heading_start)));

    $date_parts    = explode('-', str_replace(' - ', '-', $the_heading));

    preg_match_all("|<tr(.*)</tr>|U", $the_table, $rows);

    $base_data = array(
        'chartDate' => date('m/d/Y',strtotime($date_parts[1])),
        'retrieved' => date('m/d/Y H:i',time()),
        'items' => array()
    );

    //$count = 0;
    foreach($rows[0] as $row)
    {
        // Check it's OK:
        if(!strpos($row, '<th'))
        {
            // Get the cells:
            preg_match_all("|<td(.*)</td>|U", $row, $cells);
            $cells = $cells[0];

            $position = strip_tags($cells[0]);
            $prev_pos = strip_tags($cells[2]);
            $weeks	  = strip_tags($cells[3]);
            $artist   = strip_tags($cells[4]);
            $title    = strip_tags($cells[5]);

            if($prev_pos == 'none'){
                $position_change = 0;
            }
            else{
                $position_change = $prev_pos - $position;
            }

            if($position_change < 0)
                $position_string = 'down';
            else if($position_change == 0)
                $position_string = 'none';
            else
                $position_string = 'up';

            $move_val = signed2unsigned($position_change);

            $arr = array(
                'position' => $position,
                'previousPosition' => $prev_pos,
                'numberOfWeeks' => $weeks,
                'artist' => htmlspecialchars($artist),
                'title' => htmlspecialchars($title),
                'change' => array(
                    'direction' => $position_string,
                    'amount' => $move_val,
                    'actual' => $position_change
                )
            );
            array_push($base_data['items'], $arr);
        }
    }
    return json_encode($base_data);
}

function getiTunesSongData($artistName, $songName){
    $itunesPath = 'http://ax.phobos.apple.com.edgesuite.net/WebObjects/MZStoreServices.woa/wa/wsSearch?term=';
    $searchParams = '&media=track&entity=song&limit=1';

    $url =$itunesPath .  urlencode($artistName. ' '. $songName).$searchParams;
    return file_get_contents($url);
}

function getiTunesAuthorBio($artistId){
    $itunesPath = 'http://itunes.apple.com/us/artist/id'.$artistId;

    //some cleanup
    $newlines = array("\t", "\n", "\r", "\x20\x20", "\0", "\x0B");

    $doc = new DOMDocument();
    @$doc->loadHTMLFile($itunesPath); // Using the @ operaor to hide parse errors
    if($doc->getElementById('biography')){
        $bio_data = $doc->getElementById('biography')->childNodes->item(4)->nodeValue;
        $bio = str_replace($newlines, "", html_entity_decode($bio_data));

        $other_nodes = $doc->getElementById('left-stack')->childNodes;
        $born = $other_nodes->item(0)->childNodes->item(1)->nodeValue;
        $genre = $other_nodes->item(0)->childNodes->item(3)->nodeValue;
        if($other_nodes->item(0)->childNodes->item(5))
            $years_active = $other_nodes->item(0)->childNodes->item(5)->nodeValue;
        else
            $years_active = '';

    }else{
        $bio = ''; $born = ''; $genre=''; $years_active = '';
    }

    $ret_data = array(
        'bio' => $bio,
        'born' => $born,
        'genre' => $genre,
        'yearsActive' => $years_active
    );

    return json_encode($ret_data);
}