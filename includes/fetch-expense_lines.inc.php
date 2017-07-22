<?php
    require_once('db.inc.php');
    //to do...

    //************************************************************************//
    // INPUT
    //************************************************************************//
    //expense-lines.inc.php?budget=id&cat=id
    if (isset($_REQUEST['budget'])) {
        $budget = htmlspecialchars($_REQUEST['budget']);
    }

    if (isset($_REQUEST['cat'])) {
        $cat = htmlspecialchars($_REQUEST['cat']);
    }

    //quick access boolean to see if we're searching for all categories, or only
    //a specific cateogry
    $isAllCategories = $cat === "0";

    //************************************************************************//
    // QUERIES
    //************************************************************************//
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn -> connect_error) {
        die ("Connection Error: " . $conn -> connect_error);
    }

    //BUDGET NAMES
    //*********************************//

    $nameStmt = $conn->prepare("SELECT * FROM budget_names WHERE id = ?");

    $nameStmt->bind_param(i, $budget);

    $nameResult = $nameStmt->execute();//$conn->query($nameSQL);

    // fetch the name of the budget from id
    if ($nameResult -> num_rows > 0) {
        while($nameRow = $nameResult ->fetch_assoc()) {
            $budget_name = $nameRow['name'];
        }
    }


    //CATEGORIES
    //*********************************//

    if ($isAllCategories) { // looking for all categories

        $catStmt = $conn->prepare("SELECT * FROM budget_category");

    } else { //assumed there is a specific ID we're looking for

        // fetch the name of the category from id
        $catStmt = $conn->prepare("SELECT * FROM budget_category WHERE id = $cat");

        $catStmt->bind_param(i, $cat);

    }

    $catResult = $catStmt->execute();

        if ($catResult -> num_rows > 0) {
            while ($catRow = $catResult -> fetch_assoc()) {

                // if we're outputting a summary of *all* categories, create an
                // array of all categories with values for use in queries
                if ($isAllCategories){

                    $category_array[] = array('id' => $catRow['id'], 'category' => $catRow['category'], 'type' => $catRow['type']);

                } else {
                    $category_name = $catRow['category'];
                    $category_id = $catRow['id'];
                    $category_type = $catRow['type'];
                }
            }
        }





    //FREQUENCY LIST
    //*********************************//
    $frequencySQL = "SELECT * FROM frequency";

    $frequencyResult = $conn -> query($frequencySQL);
    while ($frequencyList = $frequencyResult -> fetch_assoc()) {

        $frequencyArray[$frequencyList['id']] = array($frequencyList['id'], $frequencyList['description'], $frequencyList['value_multiplied_by']);
    }


    //************************************************************************//
    // HTML
    //************************************************************************//


    if ($isAllCategories) {

        foreach ($category_array as $expenseCategory) {

            $lineStmt = $conn->prepare("SELECT * FROM expense_lines WHERE budget_name='?' AND budget_category='$expenseCategory[id]'")

            $lineStmt->bind_param(s, $budget);

            $result = $lineStmt->execute();
?>

            <?php include('expense_lines-module.inc.php');?>
<?php
        }

    } else {

        $lineStmt = $conn->prepare("SELECT * FROM expense_lines WHERE budget_name='?' AND budget_category='?'");

        $lineStmt->bind_param(si, $budget, $cat);


        $result = $lineStmt->execute();
?>

        <?php include('expense_lines-module.inc.php');?>
<?php
    }

    $nameStmt -> close();
    $catStmt -> close();
    $lineStmt -> close();
    $conn -> close();

?>
