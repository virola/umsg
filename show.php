<?php include('./common/db.php') ?>
<?php
$user = $common['user'];

$targetid = $_GET['uid'];
if (!$targetid) {
    url('index.php');
}

$sqltuser = 'select * from user where userid='.$targetid.';';
$result = mysql_query($sqltuser, $con);
if (!$result) {
    url('index.php');
}

while($row = mysql_fetch_array($result)) {
    $tuser = array(
        'userid' => $row['userid'],
        'username' => $row['username'],
        'avator' => getAvator(),
    );
}

$doc_title = $tuser['username'];

$sqljoin = 'select * from message'
    .' where (message.toid='.$user['userid'].' and message.authorid='.$targetid.') '
    .'OR (message.toid='.$targetid.' and message.authorid='.$user['userid'].') '
    .'order by dateline desc limit 0,5;';
$result = mysql_query($sqljoin, $con);
$msg_arr = array();

if ($result) {
    while($row = mysql_fetch_array($result)) {
        $issend = ($row['authorid'] == $targetid ? false : true);
        $msg_arr[] = array(
            'userid' => $row['authorid'],
            'username' => $row['username'],
            'content' => $row['content'],
            'dateline' => date('m-d H:i', $row['dateline']),
            'issend' => $issend,
            'avator' => ($issend ? $user['avator'] : $tuser['avator']),
        );
    }

    $msg_arr = array_reverse($msg_arr);
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

<div id="page-chat" class="page page-chat">
    <div class="scroll">
        <div class="loading" style="display:none">下拉加载历史消息</div>
        <ul id="talk-msg-list" class="talk-msg" data-url="ajax/msglist.php?uid=<?php echo $targetid?>">
            <?php foreach ($msg_arr as $msg) { ?>
            <li class="clear">
                <time class="date-talk"><?php echo $msg['dateline']?></time>
                <section class="<?php if ($msg['issend']){echo 'me-talk';} else {echo 'guest-talk';} ?>">
                    <a class="avatar-talk" href="#" title="">
                        <img class="avator-round" src="<?php echo $msg['avator']?>">
                    </a>
                    <div class="content-talk">
                        <p><?php echo $msg['content']?></p>
                    </div>
                </section>
            </li>
            <?php } ?>
        </ul>
    </div>
</div>

<footer class="footer-chat">
    <form id="chat-sendmsg-form" action="ajax/newmessage.php?toid=<?php echo $targetid?>" method="post" onsubmit="return false;">
        <div id="chat-sendmsg-box" class="">
            <input placeholder="输入消息内容" class="txt"></input>
            <div class="form-btn">
                <input type="submit" class="sendmsg-go btn btn-submit hide" value="发送">
            </div>
        </div>
    </form>
</footer>
<script src="./static/dep/iscroll/build/iscroll-probe.js"></script>
<?php include('./common/footer.php') ?>