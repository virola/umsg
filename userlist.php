<?php include('./common/db.php') ?>

<?php

$sql = 'select * from user where userid!='.$common['user']['userid'].';';
$result = mysql_query($sql, $con);

$data = array();

if ($result) {
    while($row = mysql_fetch_array($result)) {
        $data[] = array(
            'userid' => $row['authorid'],
            'username' => $row['username'],
            'avator' => getAvator(),
        );
    }
}
?>
<ul class="user-list">
    <?php foreach ($data as $user) { ?>
    <li>
        <a class="list-item clear" href="javascript:;">
            <dl>
                <dd class="box fl"><img class="avator-round" src="<?php echo $user['avator']?>"></dd>
                <dt class="box fl"><?php echo $user['username'];?></dt>
            </dl>
        </a>
    </li>
    <?php } ?>
</ul>