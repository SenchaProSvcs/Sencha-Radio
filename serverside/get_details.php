<?
include('config.php');
session_name(SENCHA_CLI_SESSION);
session_id($_REQUEST['sencha_radio']);
session_start();

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');

//important
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Allow-Headers: x-requested-with");

include('config.php');
include('lib/mysqli_class.php');

$db = new Database(RADIO_DB_HOST, RADIO_DB_USER, RADIO_DB_PASSWORD, RADIO_DB);
$db->connect();

if(isset($_SESSION['userid']) && $_REQUEST['id']){

    if(is_numeric($_REQUEST['id'])){

        $qwe = "select * from songs where position <7  and playlist_id = ". $_REQUEST['id']. " order by position desc"; //Top 5 songs
        //$qwe = "select * from songs where playlist_id = ". $_REQUEST['id']. " order by position desc";
        $all_rows = $db->fetch_all_array($qwe);

        $data =  array(
            'success'=>true,
            'id' =>$_REQUEST['id'],
            'total'=>$db->affected_rows,
            'tracks'=>$all_rows
        );

        echo json_encode($data);
    }
}else{
    echo json_encode(
        array(
            'good' => false,
            'msg' => 'Please log in!'
        )
    );
}