<?php
    header('Content-Type: application/json');
    require_once('../includes/db.inc.php');

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn -> connect_error) {
        die ("Connection Failed: " . $conn -> connect_error);
    }

    $sql = "SELECT * FROM budget_names";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            $result_array[$row['id']] = array(id => $row['id'], name => $row['name'], created => $row['created']);
        }

        echo json_encode($result_array);
    } else {
        echo "0";
    }



    $conn-> close();
?>
