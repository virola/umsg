<?php include('./common/db.php') ?>
<?php include('./common/functions.php') ?>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <?php include('./common/meta.php') ?>
    <title>写纸条</title>
</head>
<body>
<?php 
$MSG_TEXT_LIST = array(
    '0' => '消息发送成功！',
    '1' => '消息内容不能为空!',
    '2' => '用户名输入错误!',
    '10' => '数据库连接错误！',
);
?>
<?php

$user = $common['user'];
if ($_POST) {

    $username = trim($_POST['username']);
    $content = trim($_POST['content']);

    $target = getUserByName($username, $con);

    $msg_code = -1;

    if ($content == '') {
        $msg_code = 1;
    }
    else {
        if ($target && $target['userid'] != $user['userid']) {
            $sql = "insert into message (toid, authorid, content, dateline) values(".$target['userid'].",".$user['userid'].", '".$content."',".time().");";

            $result = mysql_query($sql);
            if ($result) {
                $msg_code = 0;
            }
            else {
                $msg_code = 10;
            }
        }
        else {
            $msg_code = 2;
        }
    }

    if ($msg_code > -1) {
        $msg_text = $MSG_TEXT_LIST[$msg_code];
    }
}
?>

<?php $mod = 'new'; ?>
<?php include('./common/header.php') ?>
<div class="page">
<?php if ($_POST) {?>
<h4 class="show-msg box-<?php if ($msg_code==0) {echo 'success';}else{echo 'fail';}?>"><?php echo $msg_text ?></h4>
<?php } ?>

    <form class="msg-form" action="" method="post">
        <input type="hidden" name="authorid" value="<?php echo $user['userid']?>">
        <input type="hidden" name="toid" value="">
        
        <div class="form-line">
            <input type="text" name="username" class="msg-t" placeholder="输入对方昵称">
            <span class="ico ico-add">+</span>
        </div>
        <div class="form-content">
            <textarea name="content" class="msg-c" placeholder="输入纸条内容"></textarea>
        </div>

        <div class="form-btn">
            <input class="btn btn-submit" type="submit" value="发送">
            <a class="btn" href="index.php">取消</a>
        </div>

    </form>
</div>


<div class="page page-user" id="load-userlist">
    
</div>

<?php include('./common/footer.php') ?>