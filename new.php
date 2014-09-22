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
$MSG_TEXT_LIST = array(
    '0' => '消息发送成功！',
    '1' => '消息内容不能为空!',
    '2' => '用户名输入错误!',
    '3' => '用户名不能为空',
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

    if ($username == '') {
        $msg_code = 3;
    }
    else if ($content == '') {
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
<form class="msg-form" action="" method="post">
    <input type="hidden" name="authorid" value="<?php echo $user['userid']?>">
    <input type="hidden" name="toid" value="">
    
    <div class="form-line add-user">
        <input type="text" name="username" id="msg-username" class="msg-t" placeholder="输入对方昵称">
        <span id="open-user-list" class="ico ico-add">+</span>
    </div>
    <div class="form-content">
        <textarea name="content" class="msg-c" placeholder="输入纸条内容"></textarea>
    </div>

    <div class="form-btn">
        <a class="btn btn-submit btn-form-send" href="javascript:;">发送</a>
        <a class="btn" href="index.php">取消</a>
    </div>

</form>
<?php if ($_POST) {?>
<h4 class="show-msg box-<?php if ($msg_code==0) {echo 'success';}else{echo 'fail';}?>"><?php echo $msg_text ?></h4>
<?php } ?>
</div>


<div class="wrap-popup hide" id="pop-userlist">
    <div class="wrap-popup-c">
        <header class="sub-header">
            <h3>请选择联系人</h3>
            <a class="popup-close header-btn fr" href="javascript:;">关闭</a>
        </header>

        <nav class="tab-menu tab-line">
            <a href="#tab-c-0" class="tab-item tab-line-item current" data-url="userlist.php?me=<?php echo $common['user']['userid']?>">最近联系</a>
            <a href="#tab-c-1" class="tab-item tab-line-item select" data-url="userlist.php?me=<?php echo $common['user']['userid']?>&amp;rand=1">
                <select class="select-list">
                    <option value="-1">全部好友</option>
                    <option value="0">其他</option>
                    <option value="1">通过本站认识</option>
                    <option value="2">通过活动认识</option>
                    <option value="3">通过朋友认识</option>
                    <option value="4">亲人</option>
                    <option value="5">同事</option>
                    <option value="6">同学</option>
                    <option value="7">不认识</option>
                </select>
                <span class="select-selected">好友分组</span>
            </a>
        </nav>
        <div class="tab-content user-wrap">
            <div class="c-item" id="tab-c-0">

            </div>
            <div class="c-item hide" id="tab-c-1"></div>
        </div>
    </div>
</div>

<?php include('./common/footer.php') ?>