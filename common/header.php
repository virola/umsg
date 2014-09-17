
<div class="nav fixed" style="display:none">
    <div class="nav-inner">
        <a href="#" class="first">首页</a>
        <h2>纸条</h2>
        <?php if ($mod == 'new') {?>
        <a class="last btn-form-send">发送</a>
        <?php } else { ?>
        <a href="#" class="last-2">刷新</a>
            <?php if ($mod != 'show') { ?>
            <a href="new.php" class="last">写消息</a>
            <?php } ?>
        <?php } ?>
        
    </div>
</div>
<div class="nav-placeholder"></div>