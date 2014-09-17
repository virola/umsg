<?php include('./common/db.php') ?>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <?php include('./common/meta.php') ?>
    <title>纸条</title>
</head>
<body>

<?php
$sqljoin = 'select * from message inner join user on message.authorid=user.userid groupby message.authorid orderby dateline desc limit 0,30';
$result = mysql_query($sql);
$msg_arr = mysql_fetch_array($result);
?>
<ul class="msg-list">
    <?php foreach ($msg_arr as $msg) { ?>
    <li>
        <a href="">
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
</body>
</html>