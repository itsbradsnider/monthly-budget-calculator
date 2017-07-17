<?php

    require_once("../includes/db.inc.php");

    // UPDATE $("GET", "../utils/update-categories.utils.php?do=update&id=1&prop="description="&value="newTest")
    // CREATE $("GET", "../utils/update-categories.utils.php?do=create&user=1&budget=1&category=2&description=Hello&frequency=4)
    // DELETE $("GET", "../utils/update-categories.utils.php?do=delete&id=1)

    $table = "expense_lines";

    if ($_REQUEST['do'] === "update") {
        $expense_id = $_REQUEST['expense_id'];
        $description = $_REQUEST['description'];
        $amount = $_REQUEST['amount'];
        $frequency = $_REQUEST['frequency'];

        $sql = "UPDATE $table SET `description` = '$description', `amount` = '$amount', `frequency` = '$frequency' WHERE `$table`.`id` = $expense_id";
    }


    elseif ($_REQUEST['do'] === "create") {


        $user = $_REQUEST['user'];
        $budget = $_REQUEST['budget'];
        $category = $_REQUEST['category'];
        $description = $_REQUEST['description'];
        $amount = $_REQUEST['amount'];
        $frequency = $_REQUEST['frequency'];

        $sql = "INSERT INTO $table (user, budget_name, budget_category, description, amount, frequency) VALUES ($user, $budget, $category, '$description', $amount, $frequency)";

    }


    elseif ($_REQUEST['do'] === "delete") {


        $id = $_REQUEST['id'];
        $sql = "DELETE FROM $table WHERE $table . id='$id'";


    }

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn -> connect_error) {
        die ("Connection error: " . $conn -> connect_error);
    }

    if($conn -> query($sql) === true) {
        $last_id = $conn -> insert_id;
        echo "updated Successfully. Affected ID is: " . $last_id;

    } else {
        echo "Error updating record" . mysqli_error($conn);
    }

    $conn -> close();
?>
