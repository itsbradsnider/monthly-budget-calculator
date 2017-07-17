<?php
    require_once('db.inc.php');
    //to do...

    //************************************************************************//
    // INPUT
    //************************************************************************//
    //expense-lines.inc.php?budget=id&cat=id
    if (isset($_REQUEST['budget'])) {
        $budget = $_REQUEST['budget'];
    }

    if (isset($_REQUEST['cat'])) {
        $cat = $_REQUEST['cat'];
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

    $nameSQL = "SELECT * FROM budget_names WHERE id = $budget";

    $nameResult = $conn->query($nameSQL);

    // fetch the name of the budget from id
    if ($nameResult -> num_rows > 0) {
        while($nameRow = $nameResult ->fetch_assoc()) {
            $budget_name = $nameRow['name'];
        }
    }


    //CATEGORIES
    //*********************************//

    if ($isAllCategories) { // looking for all categories

        $catSQL = "SELECT * FROM budget_category";

    } else { //assumed there is a specific ID we're looking for

        // fetch the name of the category from id
        $catSQL = "SELECT * FROM budget_category WHERE id = $cat";

    }

    $catResult = $conn -> query($catSQL);

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
            $sql = "SELECT * FROM expense_lines WHERE budget_name='$budget' AND budget_category='$expenseCategory[id]'";
            $result = $conn->query($sql);
?>

            <?php include('expense_lines-module.inc.php');?>
<?php
        }

    } else {

        $sql = "SELECT * FROM expense_lines WHERE budget_name='$budget' AND budget_category='$cat'";
        $result = $conn->query($sql);
?>

        <?php include('expense_lines-module.inc.php');?>
<?php
    }

    $conn -> close();

?>
