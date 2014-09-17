<?php include('./common/db.php') ?>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <?php include('./common/meta.php') ?>
    <title>写纸条</title>
</head>
<body>

<?php

if ($_POST) {
    
}
$sql = 'select * from message limit 0,30 orderby dateline desc;';
$result = mysql_query($sqljoin);
$msg_arr = mysql_fetch_array($result);

if (!empty($msg_arr)) {

}
?>
<ul class="msg-list">
    <?php foreach ($msg_arr as $msg) { ?>
    <li>
        <a href="">
            <div class="user-avator fl">
                <img src="../">
            </div>
            <dl class="fr">
                <dt><?php echo $msg['username'];?></dt>
            </dl>
            <span class="dateline"><?php echo $msg['dateline'];?></span>
        </a>
        
    </li>
    <?php } ?>
</ul>
</body>
</html>