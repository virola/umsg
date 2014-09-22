<?php

include '../common/db.php';

$page_size = 5;

$page = $_GET['page'];
if (!$page || $page <= 0) {
    $page = 1;
}

$limit_start = $page_size * ($page-1);

$msg_arr = array();

$user = $common['user'];
$targetid = $_GET['uid'];

$loadend = false;

if ($targetid) {
    $sqljoin = 'select * from message'
        .' where (message.toid='.$user['userid'].' and message.authorid='.$targetid.') '
        .'OR (message.toid='.$targetid.' and message.authorid='.$user['userid'].') '
        .'order by dateline desc limit '.$limit_start.','.$page_size.';';
    $result = mysql_query($sqljoin, $con);

    $tavator = getAvator();

    if ($result) {
        while($row = mysql_fetch_array($result)) {
            $issend = ($row['authorid'] == $targetid ? false : true);
            $msg_arr[] = array(
                'userid' => $row['authorid'],
                'username' => $row['username'],
                'content' => $row['content'],
                'dateline' => date('m-d H:i', $row['dateline']),
                'issend' => $issend,
                'avator' => ($issend ? $user['avator'] : $tavator),
            );
        }

        if (empty($msg_arr) || count($msg_arr) < $page_size) {
            $loadend = true;
        }
    }

}

$data = array(
    'status' => 0,
    'data' => array(
        'page' => $page,
        'list' => $msg_arr,
        'loadend' => $loadend,
    ),
);

echo json_encode($data);
