<?php include('./common/db.php'); ?>
<?php
$user = $common['user'];
$sql = 'select toid, username, authorid, max(dateline) as timeline, count(*) as msgcount from message,user where delstatus=0 and message.toid=1 and message.authorid=user.userid group by authorid order by dateline desc  limit 0,10';
$sqljoin = 'select toid, authorid, content, max(dateline) as timeline, count(*) as msgcount, username from message,user where delstatus=0 and message.toid='.$user['userid'].' and authorid=userid group by authorid order by timeline desc;';
$result = mysql_query($sqljoin);
$msg_arr = array();

if ($result) {
    while($row = mysql_fetch_array($result)) {
        $msg_arr[] = array(
            'userid' => $row['authorid'],
            'username' => $row['username'],
            'content' => getLatestMsg($row['authorid'], $user['userid'], $con),
            'dateline' => timeFormat($row['timeline']),
            'realtime' => $row['timeline'],
            'avator' => getAvator(),
            'newcount' => mt_rand(0, 10),
        );
    }
}

$atmsg = mt_rand(0, 1);
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
<div class="page">
    <div class="feed-loading hide"><span>加载中…</span></div>
    <ul class="msg-list">
        <li class="msg-item-at">
            <a href="at.php">
                <div class="item-ico item-at"><i class="iconf iconf-at"></i></div>
                <div class="list-item">
                    <h3>提到我的</h3>
                </div>
                <div class="item-plus">
                    <?php if ($atmsg) {?>
                    <i class="bubble bubble-dot-red"><?php echo mt_rand(1, 16)?></i>
                    <?php } else {?>
                    <span class="item-plus"><i class="fa fa-angle-right"></i></span>
                    <?php }?>
                </div>
            </a>
        </li>
        <li class="msg-item-at">
            <a href="at.php">
                <div class="item-ico item-comment"><i class="iconf iconf-comment"></i></div>
                <div class="list-item">
                    <h3>话题回复</h3>
                </div>
                <div class="item-plus">
                    <?php if ($atmsg) {?>
                    <i class="bubble bubble-dot-red"><?php echo mt_rand(1, 16)?></i>
                    <?php } else {?>
                    <span class="item-plus"><i class="fa fa-angle-right"></i></span>
                    <?php }?>
                </div>
            </a>
        </li>
        <li>
            <a href="#" class="clear">
                <div class="user-avator fl">
                    <img class="avator-round" src="<?php echo $user['avator']?>">
                </div>
                <dl class="user-info">
                    <dt>admin, virola, 有节操</dt>
                    <dd>上次我们聊到哪儿了？</dd>
                </dl>
                <span class="plus">
                    <span class="dateline">9小时前</span>
                    <i class="bubble bubble-dot-red">1</i>
                </span>
                
            </a>
        </li>
        <?php foreach ($msg_arr as $msg) { ?>
        <li>
            <a href="show.php?uid=<?php echo $msg['userid'] ?>" class="clear">
                <div class="user-avator fl">
                    <img class="avator-round" src="<?php echo $msg['avator']?>">
                </div>
                <dl class="user-info">
                    <dt><?php echo $msg['username']?></dt>
                    <dd><?php echo $msg['content']?></dd>
                </dl>
                <span class="plus">
                    <span class="dateline"><?php echo $msg['dateline']?></span>
                    <?php if ($msg['newcount']) {?>
                    <i class="bubble bubble-dot-red"><?php echo $msg['newcount']?></i>
                    <?php }?>
                </span>
                
            </a>
        </li>
        <?php } ?>
    </ul>
</div>


<?php include('./common/footer.php') ?>