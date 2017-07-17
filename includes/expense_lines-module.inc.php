<?php

    if($isAllCategories) {
        $categoryID = $expenseCategory['id'];
        $categoryType = $expenseCategory['type'];
    } else {
        $categoryID = $category_id;
        $categoryType = $category_type;
    }

    if($isAllCategories) {
?>
<section class="col-12 budget-category" data-html-target="budget_category" data-category-id="<?php print $categoryID ?>" data-category-type="<?php print $categoryType ?>">
    <h1 class="budget-category-heading"><?php print $expenseCategory['category'] // declared in expenses.inc.php ?></h1>

    <div class="category-data" data-html-target="category_data">
<?php } ?>
        <table class="table">
            <thead>
                <tr>
                    <th>
                        Description
                    </th>
                    <th>
                        Amount
                    </th>
                    <th>
                        Frequency
                    </th>
                    <th>
                        Monthly Total
                    </th>
                    <th class="text-center">
                        <i class="fa fa-cogs"></i>
                    </th>
                </tr>
            </thead>
            <tbody>
                <?php
                if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                ?>
                <tr data-row-id="<?php print $row['id']?>" data-category-id="<?php print $categoryID; ?>">

                    <td>
                        <input type="text" data-event="input_focus" data-type="description_input" class="form-control form-control-sm" value="<?php print $row['description']?>">
                        <div class="form-control-feedback small hidden-xs-up" data-html-target="line-description-warning-msg">Numbers and letters only. Make it so.</div>
                    </td>
                    <td>
                        <div class="input-group input-group-sm">
                            <span class="input-group-addon">$</span>
                            <input type="number" data-event="input_focus" data-type="amount_input" class="form-control" value="<?php print $row['amount'] ?>">
                        </div>
                        <div class="form-control-feedback small hidden-xs-up" data-html-target="line-amount-warning-msg">Please enter a number.</div>

                    </td>
                    <td>
                        <div class="btn-group">
                            <a class="btn btn-outline-primary btn-sm dropdown-toggle" data-toggle="dropdown" data-event="frequency_dropdown" aria-expanded="false" href="javascript:;">
                                <span data-html-target="line-frequency" data-line-target="frequency" data-id="<?php print $row['frequency']; ?>" data-multiplied-by="<?php print $frequencyArray[$row['frequency']][2]; ?>"><?php print $frequencyArray[$row['frequency']][1]; ?></span><span class="caret"></span>
                            </a>
                            <div class="dropdown-menu frequency-menu" role="menu">

<?php
foreach ($frequencyArray as $key) {
?>
                                <a class="dropdown-item"  href="javascript:;" data-type="frequency" data-id="<?php print $key[0]; ?>" data-multiplied-by="<?php print $key[2]; ?>"><?php print $key[1]; ?></a>
<?php
}
?>
                            </div>
                        </div>
                    </td>
                    <td data-html-target="monthly_total">
                        $0
                    </td>
                    <td>
                        <div class="btn-toolbar">
                            <div class="btn-group mr-2">
                                <a class="btn btn-outline-success btn-sm disabled" data-event="save_line_changes" href="javascript:;"><i class="fa fa-save"></i></a>
                            </div>
                            <div class="btn-group">
                                <a class="btn btn-outline-danger btn-sm" data-event="delete_line" href="javascript:;"><i class="fa fa-remove"></i></a>
                            </div>
                        </div>
                    </td>

                </tr>

                    <?php }} else {
                        print "<tr><td colspan=5>\n
                            Nothing here Folks\n
                        </td></tr>\n";
                    } ?>
                <tr>
                    <td colspan="5" class="text-right">
                        <p class="lead">
                            Monthly <!--<?php print $expenseCategory['category']; ?>--> Total: $<span data-html-target="category_sum"></span>
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>

<?php if($isAllCategories) { ?>
    </div>
</section>

<?php } ?>
