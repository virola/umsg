<div class="nav fixed">
    <div class="nav-inner">
        <a href="index.php" class="first">首页</a>
        <h2><?php if ($doc_title) {echo $doc_title;}else{echo '纸条';}?></h2>
        <?php if ($mod == 'new') {?>
        <a class="last btn btn-submit btn-form-send">发送</a>
        <?php } else { ?>
            <?php if ($mod != 'show') { ?>
            <a href="new.php" class="last">写消息</a>
            <?php } ?>
        <?php } ?>
    </div>
</div>