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

if(isset($_SESSION['userid'])){

    $data = array(
        array(
            'id' => 1,
            'name' => 'UK TOP 40'
        ),
        array(
            'id' => 2,
            'name' => 'US Chart TOP 10'
        )
    );
    echo json_encode($data);

}else{
    echo json_encode(
        array(
            'good' => false,
            'ss' =>session_id(),
            'msg' => 'Please log in!'
        )
    );
}