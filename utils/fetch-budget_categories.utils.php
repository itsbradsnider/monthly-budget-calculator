<?php
    header('Content-Type: application/json');
    require_once('../includes/db.inc.php');

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn -> connect_error) {
        die ("Connection failed: " . $conn -> connect_error);
    }

    $sql = "SELECT * FROM budget_category";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $result_array[$row['id']] = array(id => $row['id'], category => $row['category'], type => $row['type'], recommended_percentage => $row['recommended_percentage']);
        }
    }

    echo json_encode($result_array);
?>
