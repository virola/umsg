<div class="nav fixed">
    <div class="nav-inner">
        <a href="index.php" class="first back-btn"><i class="fa fa-angle-left"></i></a>
        <h2><?php if ($doc_title) {echo $doc_title;}else{echo '有味纸条';}?></h2>
        <?php if ($mod == 'new') {?>
        <a class="last btn-form-send"><i class="fa fa-send"></i></a>
        <?php } else { ?>
            <?php if ($mod != 'show') { ?>
            <a href="new.php" class="last"><i class="ico-msg fa fa-pencil-square-o"></i></a>
            <?php } else { ?>
            <a href="#" class="last show-menu" data-menu="#user-operate"><i class="fa fa-ellipsis-h"></i></a>
            <?php } ?>
        <?php } ?>
    </div>
</div>