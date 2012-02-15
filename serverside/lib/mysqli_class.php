<?php
class Database {
    var $server   = ""; //database server
    var $user     = ""; //database login name
    var $pass     = ""; //database login password
    var $database = ""; //database name
    var $pre      = ""; //table prefix

    //internal info
    var $record = array();

    var $error = "";
    var $errno = 0;

    //number of rows affected by SQL query
    var $affected_rows = 0;

    var $mysqli = null;
    var $query_id = 0;

    // ------ Constructor
    function Database($server, $user, $pass, $database, $pre=''){
        $this->server = $server;
        $this->user = $user;
        $this->pass = $pass;
        $this->database = $database;
        $this->pre = $pre;
    }

    //------ connect and select database using vars above
    function connect() {
        // Piesledzamies
        $this->mysqli = mysqli_connect($this->server, $this->user, $this->pass, $this->database);
        // Parbaudam vai ir labs pieslegums
        if (!$this->mysqli) {
            die('Connect Error (' . mysqli_connect_errno() . ') '
                . mysqli_connect_error());
        }

        //ja viss labi uzliekam utf-8 charset, ar citu drazu nekramejamies!
        /* change character set to utf8 */
        if (!mysqli_set_charset($this->mysqli, "utf8")) {
             $this->oops("Error loading character set utf8: %s\n", mysqli_error($this->mysqli));
        }

        // unset the data so it can't be dumped
        $this->server='';
        $this->user='';
        $this->pass='';
        $this->database='';
    }

    //----  close the connection
    function close() {
       // if(@mysqli_close($this->mysqli)){
        //    $this->oops("Connection close failed.");
        //}
    }

    //-- Desc: escapes characters to be mysql ready
    # Param: string
    # returns: string
    function escape($string) {
        if(get_magic_quotes_gpc())
            $string = stripslashes($string);
        return mysqli_real_escape_string($this->mysqli, $string);
    }

    //--- executes SQL query to an open connection
    # Param: (MySQL query) to execute
    # returns: (query_id) for fetching results etc
    function query($sql) {
        // do query
        $this->query_id = @mysqli_query($this->mysqli, $sql);

        if ($this->query_id == FALSE) {
            $this->oops("<b>MySQL Query fail:</b> $sql");
        }

        $this->affected_rows = @mysqli_affected_rows($this->mysqli);

        return $this->query_id;
    }

    // --fetches and returns results one line at a time
    # param: query_id for mysql run. if none specified, last used
    # return: (array) fetched record(s)
    function fetch_array($query_id = FALSE) {
        if ($query_id == FALSE) {
            $this->oops("Invalid query resource. Records could not be fetched.");
        }else{
            $this->record = @mysqli_fetch_assoc($this->query_id);
        }

        // unescape records
        if($this->record){
            //$this->record=array_map("stripslashes", $this->record);
            //foreach($this->record as $key=>$val) {
            //    $this->record[$key]=stripslashes($val);
            //}
        }
        return $this->record;
    }

    //-- returns all the results (not one row)
    # param: (MySQL query) the query to run on server
    # returns: assoc array of ALL fetched results
    function fetch_all_array($sql) {
        $query_id = $this->query($sql);
        $out = array();

        while ($row = $this->fetch_array($query_id)){
            $out[] = $row;
        }

        $this->free_result($query_id);
        return $out;
    }

    //-- frees the resultset
    # param: Frees the memory associated with a result
    function free_result($query_id = FALSE) {
        @mysqli_free_result($this->query_id);
    }

    //--does a query, fetches the first row only, frees resultset
    # param: (MySQL query) the query to run on server
    # returns: array of fetched results
    function query_first($query_string) {
        $query_id = $this->query($query_string);
        $out = $this->fetch_array($query_id);
        $this->free_result($query_id);
        return $out;
    }

    //-- does an update query with an array
    # param: table (no prefix), assoc array with data (doesn't need escaped), where condition
    # returns: (query_id) for fetching results etc
    function query_update($table, $data, $where='1') {
        $q="UPDATE `".$this->pre.$table."` SET ";

        foreach($data as $key=>$val) {
            if(strtolower($val)=='null') $q.= "`$key` = NULL, ";
            elseif(strtolower($val)=='now()') $q.= "`$key` = NOW(), ";
            else $q.= "`$key`='".$this->escape($val)."', ";
        }

        $q = rtrim($q, ', ') . ' WHERE '.$where.';';

        return $this->query($q);
    }

    //-- does an insert query with an array
    # param: table (no prefix), assoc array with data
    # returns: id of inserted record, false if error
    function query_insert($table, $data) {
        $q="INSERT INTO `".$this->pre.$table."` ";
        $v=''; $n='';

        foreach($data as $key=>$val) {
            $n.="`$key`, ";
            if(strtolower($val)=='null') $v.="NULL, ";
            elseif(strtolower($val)=='now()') $v.="NOW(), ";
            else $v.= "'".$this->escape($val)."', ";
        }

        $q .= "(". rtrim($n, ', ') .") VALUES (". rtrim($v, ', ') .");";

        if($this->query($q)){
            //$this->free_result();
            return mysqli_insert_id ($this->mysqli);
        }
        else return false;
    }

    //--throw an error message
    # param: [optional] any custom error to display
    function oops($msg='') {
        if(ini_get('display_errors') == '0')
            return;
        $this->error = mysqli_error($this->mysqli);
        $this->errno = mysqli_errno($this->mysqli);

        ?>
    <table align="center" border="1" cellspacing="0" cellpadding="0" style="border-width: 1px;
	    border-spacing: 2px; border-style: solid; border-color: red; border-collapse: collapse; background-color: rgb(250, 240, 230);width:80%">
        <tr><th colspan=2>Database Error</th></tr>
        <tr><td align="right" valign="top">Message:</td><td><?php echo $msg; ?></td></tr>
        <?php if(strlen($this->error)>0) echo '<tr><td align="right" valign="top" nowrap>MySQL Error:</td><td>'.$this->error.'</td></tr>'; ?>
        <tr><td align="right">Date:</td><td><?php echo date("l, F j, Y \a\\t g:i:s A"); ?></td></tr>
        <tr><td align="right">Script:</td><td><a href="<?php echo @$_SERVER['REQUEST_URI']; ?>"><?php echo @$_SERVER['REQUEST_URI']; ?></a></td></tr>
        <?php if(strlen(@$_SERVER['HTTP_REFERER'])>0) echo '<tr><td align="right">Referer:</td><td><a href="'.@$_SERVER['HTTP_REFERER'].'">'.@$_SERVER['HTTP_REFERER'].'</a></td></tr>'; ?>
    </table><br>
    <?php
}
}