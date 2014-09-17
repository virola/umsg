<?php include('./common/db.php') ?>
<?php include('./common/functions.php') ?>
<?php
$user = $common['user'];
$sqljoin = 'select * from message,user where message.toid='.$user['userid'].' and message.authorid=user.userid order by dateline desc limit 0,10;';
$result = mysql_query($sqljoin);
$msg_arr = array();

if ($result) {
    while($row = mysql_fetch_array($result)) {
        $msg_arr[] = array(
            'userid' => $row['authorid'],
            'username' => $row['username'],
            'content' => $row['content'],
            'dateline' => $row['dateline']
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

<?php include('./common/header.php') ?>


<ul class="msg-list">
    <?php foreach ($msg_arr as $msg) { ?>
    <li>
        <a href="list.php?uid=<?php echo $msg['userid'] ?>">
            <div class="user-avator fl">
                <img src="../">
            </div>
            <dl class="fr">
                <dt><?php echo $msg['username']?></dt>
                <dd><?php echo $msg['content']?></dd>
            </dl>
            <span class="dateline"><?php echo $msg['dateline']?></span>
        </a>
    </li>
    <?php } ?>
</ul>

<?php include('./common/footer.php') ?>