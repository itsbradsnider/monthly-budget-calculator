<?php
    require_once('../includes/db.inc.php');

    $table = "users";

    if ($_REQUEST['do'] === 'create') {

        $name = $_REQUEST['name'];

        $sql = "INSERT INTO $table (name) VALUES ('$name')";
    }

    elseif ($_REQUEST['do'] === 'update') {
        $id = $_REQUEST['id'];
        $name = $_REQUEST['name'];

        $sql = "UPDATE $table SET name = '$name' WHERE $table.id = '$id'";
    }

    elseif ($_REQUEST['do'] === 'fetch') {

        $id = $_REQUEST['id'];

        $sql = "SELECT * FROM $table WHERE `id` = $id";
    }


    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn -> connect_error) {
        die ("Connection Error: " . $conn -> connect_error);
    }

    if($conn -> query($sql) === true) {
        $last_id = $conn -> insert_id;
        echo "updated Successfully. Affected ID is: " . $last_id;

    } else {
        echo "Error updating record: " . mysqli_error($conn);
    }

    $conn -> close();


?>
