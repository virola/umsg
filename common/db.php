<?php
$con = mysql_connect("localhost","root","root");

if (!$con) {
    die('Could not connect: ' . mysql_error());
}

$dbname = "umsg";
mysql_select_db($dbname, $con);
session_start();

?>