<?
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');

//important
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Allow-Headers: x-requested-with");

include('config.php'); //configure session and access
//include('lib/extra.php'); //some extra useful functions
include('lib/mysqli_class.php'); // Mysqli lib functions

unset($_SESSION['userid']);

/* For test only, remove later */

session_name(SENCHA_CLI_SESSION);
session_start();

$_SESSION['userid'] = 1;
echo json_encode(
    array(
        'done' => true,
        'sencha_radio' => session_id()
    )
);
exit();

/* end of remove */

if(isset($_POST['user']) && isset($_POST['pass']) && $_POST['user']!='' && $_POST['pass']!='' ){

    $ret_error = array(
        'done' => false,
        'msg'=>'Wrong username or password provided'
    );

    $ret_error_credentials = array(
        'done' => false,
        'msg'=>'Incorrect credentials! Please provide Your username and password.'
    );
    /*
        $wrong_username = array(
            'done' => false,
            'msg'=>'wrong username'
        );
    */
    $ret_good = array(
        'done' => true
    );

    // connecting to db
    $db = new Database(SENCHA_DB_HOST, SENCHA_DB_USER, SENCHA_DB_PASSWORD, SENCHA_DB);
    $db->connect();

    //selecting data
    $user_array = $db->query_first('SELECT userid, email, username, password, salt FROM user WHERE username = "'.$_POST['user'].'"');

    if($db->affected_rows>0){
        $current_pass =  md5 (md5( $_POST['pass']) . $user_array['salt'] ) ;

        if(strcmp($current_pass, $user_array['password']) == 0){
            //good one - logging in
            session_name(SENCHA_CLI_SESSION);
            session_start();
            $_SESSION['userid'] = $user_array['userid'];

            echo json_encode($ret_good);
        }else{
            //wrong password, but we wont tell that only pass is wrong to prevent finding user-names
            echo json_encode($ret_error_credentials);
        }
    }else{
        echo json_encode($ret_error_credentials);
    }

}else{
    $ret_missing_credentials = array(
        'done' => false,
        'msg'=>'Please provide username and password'
    );
    echo json_encode($ret_missing_credentials);
}