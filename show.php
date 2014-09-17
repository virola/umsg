<?php include('./common/db.php') ?>
<?php include('./common/functions.php') ?>
<?php
$user = $common['user'];

$targetid = $_GET['userid'];
if (!$targetid) {
    http_redirect('index.php');
}

$sqltuser = 'select * from user where userid='.$targetid.';';
$result = mysql_query($sql, $con);
if (!$result) {
    http_redirect('index.php');
}

while($row = mysql_fetch_array($result)) {
    $tuser = array(
        'userid' => $row['userid'],
        'username' => $row['username'],
        'avator' => getAvator(),
    );
}

$sqljoin = 'select * from message'
    .' where (message.toid='.$user['userid'].' and message.authorid='.$targetid.') '
    .'OR (message.toid='.$targetid.' and message.authorid='.$user['userid'].') '
    .'orderby dateline desc limit 0,30;';
$result = mysql_query($sql, $con);
$msg_arr = array();

if ($result) {
    while($row = mysql_fetch_array($result)) {
        $msg_arr = array(
            'userid' => $row['authorid'],
            'username' => $row['username'],
            'content' => $row['content'],
            'dateline' => $row['dateline'],
        );
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <?php include('./common/meta.php') ?>
    <title>纸条</title>
</head>
<body>

<?php $mod = 'show' ?>
<?php include('./common/header.php') ?>


<ul class="msg-show">
    <?php foreach ($msg_arr as $msg) { ?>
    <li>
        <a href="list.php?uid=<?php echo $msg['userid'] ?>">
            <div class="user-avator fl">
                <img src="../">
            </div>
            <div class="fr">
                
            </div>
            <span class="dateline"><?php echo $msg['dateline']?></span>
        </a>
    </li>
    <?php } ?>
</ul>

<?php include('./common/footer.php') ?>