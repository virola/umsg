<?php include('./common/db.php') ?>
<?php include('./common/functions.php') ?>

<?php

$sql = 'select * from user where userid!='.$common['user']['userid'].';';
$result = mysql_query($sqljoin, $con);

$data = array();

if ($result) {
    while($row = mysql_fetch_array($result)) {
        $data[] = array(
            'userid' => $row['authorid'],
            'username' => $row['username'],
            'avator' => getAvator();
        );
    }
}
?>
<ul class="user-list">
    <?php foreach ($data as $user) { ?>
    <li>
        <a href="#">
            <input type="checkbox" name="username" value="<?php echo $user['username'];?>">
            
            <dl>
                <dt class="fr"><?php echo $user['username'];?></dt>
                <dd class="fl">
                    <div class="user-avator">
                        <img src="./static/asset/img/<?php echo $user['avator']?>">
                    </div>
                </dd>
            </dl>
        </a>
        
    </li>
    <?php } ?>
</ul>