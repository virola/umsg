<?php
$con = mysql_connect("localhost","root","root");

if (!$con) {
    die('Could not connect: ' . mysql_error());
}

$dbname = "umsg";
mysql_select_db($dbname, $con);
session_start();

$user_avator_arr = ['temp/user_1.jpg', 'temp/user_2.gif', 'temp/user_3.gif', 'temp/user_4.gif'];

$username = 'virola';

$userid = 0;
if ($_GET['me']) {
    $userid = $_GET['me'];
}

$usersql = 'select * from user where username="virola";';
if ($userid) {
    $usersql = 'select * from user where userid='.$userid;
}

$res = mysql_query($usersql, $con);
$data = mysql_fetch_array($res);
$user = array(
    'username' => $data['username'], 
    'userid' => $data['userid'],
);

$common = array('user' => $user);
