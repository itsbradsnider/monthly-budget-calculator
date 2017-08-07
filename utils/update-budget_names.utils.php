<?php

    require_once("../includes/db.inc.php");

    // UPDATE $("GET", "../utils/update-categories.utils.php?do=update&id=1&prop="description="&value="newTest")
    // CREATE $("GET", "../utils/update-categories.utils.php?do=create&user=1&budget=1&category=2&description=Hello&frequency=4)
    // DELETE $("GET", "../utils/update-categories.utils.php?do=delete&id=1)

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn -> connect_error) {
        die ("Connection error: " . $conn -> connect_error);
    }

    $table = "budget_names";

    if ($_REQUEST['do'] === "update") {
        $id = htmlspecialchars($_REQUEST['id']);
        $prop = htmlspecialchars($_REQUEST['prop']);
        $value = htmlspecialchars($_REQUEST['value']);

        $stmt = $conn->prepare("UPDATE $table SET ? = ? WHERE $table.id = ?");

        $stmt->bind_param(sii, $prop, $value, $id);

        //$sql = "UPDATE $table SET $prop = $value WHERE $table.id = $id";
    }


    elseif ($_REQUEST['do'] === "create") {


        $name = htmlspecialchars($_REQUEST['name']);

        $stmt = $conn->prepare("INSERT INTO $table (name) VALUES ('?')");

        $stmt->bind_param(s, $name);

        //$sql = "INSERT INTO $table (name) VALUES ('$name')";

    }


    elseif ($_REQUEST['do'] === "delete") {


        $id = htmlspecialchars($_REQUEST['id']);

        $stmt = $conn->prepare("DELETE FROM $table WHERE id=?")

        //$sql = "DELETE FROM $table WHERE id=$id";


    }


    /*if($conn -> query($sql) === true) {
        $last_id = $conn -> insert_id;
        echo "updated Successfully. Affected ID is: " . $last_id;

    } else {
        echo "Error updating record" . mysqli_error($conn);
    }*/

    $stmt -> execute();

    $stmt -> close()
    $conn -> close();
?>
