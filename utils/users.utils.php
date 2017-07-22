<?php
    require_once('../includes/db.inc.php');


    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn -> connect_error) {
        die ("Connection Error: " . $conn -> connect_error);
    }

    $table = "users";

    if ($_REQUEST['do'] === 'create') {
        
        $name = htmlspecialchars($_REQUEST['name']);

        $stmt = $conn->prepare("INSERT INTO $table (name) VALUES ('?')");

        $stmt->bind_param(s, $name);

        //$sql = "INSERT INTO $table (name) VALUES ('$name')";
    }

    elseif ($_REQUEST['do'] === 'update') {
        $id = htmlspecialchars($_REQUEST['id']);
        $name = htmlspecialchars($_REQUEST['name']);

        $stmt = $conn->prepare("UPDATE $table SET name = '?' WHERE $table.id = '?'");

        $stmt->bind_param(si, $name, $id);

        //$sql = "UPDATE $table SET name = '$name' WHERE $table.id = '$id'";
    }

    elseif ($_REQUEST['do'] === 'fetch') {

        $id = htmlspecialchars($_REQUEST['id']);

        $stmt = $conn-prepare("SELECT * FROM $table WHERE `id` = ?");

        $stmt->bind_param(i, $id);

        //$sql = "SELECT * FROM $table WHERE `id` = $id";
    }


    /*if($conn -> query($sql) === true) {
        $last_id = $conn -> insert_id;
        echo "updated Successfully. Affected ID is: " . $last_id;

    } else {
        echo "Error updating record: " . mysqli_error($conn);
    }*/

    $stmt -> execute();

    $stmt -> close()
    $conn -> close();


?>
