<!doctype html>
<html>
<head>
    <title>Monthly Budget Calculator</title>
    <link type="text/css" rel="stylesheet" href="../css/dist/main.css" />
    <link type="text/css" rel="stylesheet" href="../css/dist/font-awesome.min.css" />
    <style type="text/css">
        .budget-category {
            margin-bottom: 60px;
        }


    </style>


</head>
<body>
    <!-- Global header yeaahhh-->
    <?php include('../includes/global-header.inc.php'); ?>

    <!-- Budget Calculator body-->
    <?php include('includes/budget-calculator.inc.php'); ?>
    <script src="../js/dist/jquery-3.1.1.min.js"></script>
    <script src="js/src/budgetCalculator.js"></script>
    <script src="../js/dist/bootstrap.min.js"></script>


    <script>

    $('.nav-btn').click(function () {
        $('.main-nav').toggleClass('main-nav--open');
    });

    Calculator.init();


    </script>
</body>
</html>
