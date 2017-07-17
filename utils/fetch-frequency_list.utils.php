<?php
    header('Content-Type: application/json');
    require_once('../includes/db.inc.php');

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn -> connect_error) {
        die ("Connection error: " . $conn -> connect_error);
    }

    $sql = "SELECT * FROM frequency";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $result_array[$row['id']] = array(id => $row['id'], description => $row['description'], value_multiplied_by => $row['value_multiplied_by']);
        }
    }

    echo json_encode($result_array);
?>
