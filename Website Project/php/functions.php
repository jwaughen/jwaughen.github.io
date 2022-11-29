<?php
function checkAdminLogin($username,$password) {
    define("SERVER","localhost");
    define("USER","root");
    define("DBPW","root");
    define("DBNAME","websitedb");

    $username = 'admin';
    $password = 'admin1';
    echo $username .' '. $password;
    //Create connection to database
    try {
        $db = new mysqli(SERVER,USER,DBPW,DBNAME);
        echo "<p>Successful Database Connection</p>";
    } catch (Exception $e) {
        die("Connetion failed: " .$db->connect_error);
    }
    //creating query to see if login is in database
    $sql = "SELECT COUNT(id) FROM adminlogin WHERE username='admin' AND pswd='admin';";
    try {
        $result=$db->query($sql);
        //$stmt = $db->prepare($sql);
        //$stmt->bind_param("ss",$username, $password);
        //$result = $stmt->execute();
        echo "<p>Successfully queried table</p>";
        echo $result->fetch();
        //$stmt->close();
    } catch (Exception $e) {
        echo "<p>Error executing query </p>";
    }

}
?>