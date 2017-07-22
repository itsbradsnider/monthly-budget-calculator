(function ($) {
    //test1

    //************************************************************************//
    // CONSTANTS
    //************************************************************************//

    //GENERAL
    //*********************************//
    const   VERSION = "1.0",
            console = window.console;


    //USER
    //*********************************//
    const   USER_ID = 1; // for now.



    //************************************************************************//
    // STATE
    //************************************************************************//

    let     BUDGETS = [],
            ZERO_DATA_STATE = false,
            ACTIVE_BUDGET = "", // for now
            CATEGORIES = [],
            DEBUG = false,
            ACTIVE_LINE = {

                'id'            : "",
                'description'   : "",
                'amount'        : "",
                'frequencyID'     : ""
            }
            INCOME = 0,
            EXPENSES = 0,
            SAVINGS = 0;


    //HTML TARGETS
    //*********************************//

    const   HTML_EXPENSE_TABLE      = "#expense-table",
            UTILITY_BAR             = ".utility-bar",
            DEFAULT_UTILITY_VIEW    = "utility-options";




    //************************************************************************//
    // DATABASE QUERIES
    //************************************************************************//


    //PHP REFERENCES
    //*********************************//

            //users
    const   PHP_USERS = "utils/users.utils.php",

            //budget names
            PHP_FETCH_BUDGET_NAMES = "utils/fetch-budget_names.utils.php",
            PHP_UPDATE_BUDGET_NAMES = "utils/update-budget_names.utils.php",

            //budget categories ie Living Expenses, Transportation etc
            PHP_FETCH_BUDGET_CATEGORIES = "utils/fetch-budget_categories.utils.php",
            PHP_UPDATE_BUDGET_CATEGORIES = "utils/update-budget_categories.utils.php",

            // frequency list: ie Monthly, every two weeks
            PHP_FREQUENCY_LIST = "utils/fetch-frequency_list.utils.php",

            // output expense lines by group to HTML
            PHP_EXPENSE_LINES_BY_CATEGORY = "includes/fetch-expense_lines.inc.php",

            // update expense lines
            PHP_UPDATE_EXPENSE_LINES = "utils/update-expense_lines.utils.php";



    //PROMISES, PROMISES
    //*********************************//

    // we use a Promise to encapsulate our GET/POST requests. All the following
    // database requests use the Promise returned in this function

    // Credit to Google Developer Tools for this:
    //https://developers.google.com/web/fundamentals/getting-started/primers/promises

    function ajx(method, url) {

        return new Promise (function (resolve, reject) {

            let request = new XMLHttpRequest();

            request.open(method, url);

            request.onload = function () {

                if (request.status == 200) {

                    resolve(request.responseText);

                } else {

                    reject(Error("no workie"));

                }

            }

            request.send();

        });
    }


    //USERS
    //*********************************//

    let _users = {

        'create' : function (name) {

            let data = "?do=create&name=" + name,
                url = PHP_USERS + data,
                method = "POST";
            /*$.post(url, data, function (response) {
                console.log(response);
            });*/

            ajx(method, url).then(function(response) {
                console.log(response);
            });
        },

        'fetch' : function (id) {

            let     method = "GET",
                    data = "?do=fetch"
                            + "&id=" + id,
                    url = PHP_USERS + data
                    ;

            ajx(method, url).then(function(response){
                console.log(response);
            })



        },

        'update' : function (id, name) {

            let     method = "POST",
                    data = "?do=update"
                            + "&id=" + id
                            + "&name=" + name,
                    url =   PHP_USERS + data
                    ;


            ajx(method, url)
                .then(function (response){
                    console.log(response);
                });

        }

    }



    //BUDGET NAMES
    //*********************************//

    let _budget_names = {

        'list' : {},

        'create' : function (name) {

            let method = "POST",
                data = "?do=create&name=" + name,
                url = PHP_UPDATE_BUDGET_NAMES + data;

            // $.post(url, data, function () {
            //     console.log(response);
            // })

            return ajx(method, url)
                    .then(function (response) {
                        DEBUG && console.log(response);
                        return response;
                    });
        },

        'fetch' : function () {

            let     method = "GET",
                    url =   PHP_FETCH_BUDGET_NAMES;

                // returns as JSON
            return ajx(method, url)
                    .then(function (response) {

                        if (response == "0") {
                            return "0";
                        } else {
                            _budget_names.list = JSON.parse(response);
                            return _budget_names.list;
                        }

                    });

        },

        'update' : function(id, name) {

            let     method = "POST",
                    data = "?do=update"
                            + "&id=" + id
                            + "&name=" + name,
                    url = PHP_UPDATE_BUDGET_NAMES + data
                    ;

            ajx(method, url)
                .then(function(response){
                    console.log(response);
                });
        }
    };



    //BUDGET CATEGORIES
    //*********************************//

    let _budget_categories = {

        'list' : {},

        'create' : function (name) {

                let     method = "POST",
                        data = "?do=create"
                                + "&name=" + name,
                        url =   PHP_UPDATE_BUDGET_CATEGORIES + data
                        ;

                ajx(method, url)
                    .then(function(response){
                        DEBUG && console.log(response)
                    });
        },

        'fetch' : function () {

            // fetch budget category list with associate info
            let     method = "GET",
                    url =   PHP_FETCH_BUDGET_CATEGORIES;

            return ajx(method, url)
                .then(function(response){

                    return response;

                });
        }
    };



    //FREQUENCY
    //*********************************//

    // because frequency is tied so closely to the utility panel, the frequency methods and properties are included
    // in the utility panel function section.

    //EXPENSE LINES
    //*********************************//
    let _expense_lines = {

        'fetch_by_category' : function (budget_id, budget_category){

            let     method = "GET",
                    data = "?budget=" + budget_id
                            + "&cat=" + budget_category,
                    url =   PHP_EXPENSE_LINES_BY_CATEGORY + data
                    ;

            return ajx(method, url)
                .then(function (response){
                    return response;
                });

                //$(HTML_EXPENSE_TABLE).html(html);

        },

        'delete' : function (expense_id) {

            let     method = "GET",
                    data = "?do=delete"
                            + "&id=" + expense_id,
                    url =   PHP_UPDATE_EXPENSE_LINES + data
                    ;

            return ajx(method, url)
                .then(function(response){
                    return console.log(response);
                });
        },

        'create' : function (user_id, budget_id, category_id, description, amount, frequency) {

            //xhr.open("POST", 'utils/update-categories.utils.php?do=create&user=1&budget=1&category=3&description="Test"&amount=750&frequency=3'); //sample

            let method =    "POST",
                data =      "?do=create"
                            + "&user=" + user_id
                            + "&budget=" + budget_id
                            + "&category=" + category_id
                            + "&description=" + description
                            + "&amount=" + amount
                            + "&frequency=" + frequency,
                url =       PHP_UPDATE_EXPENSE_LINES + data
                            ;

                return ajx(method, url)
                    .then(function (response) {
                        _clearBudgetLineInputs();
                    });
        },

        'update' : function (expense_id, description, amount, frequency) {

            //xhr.open("POST", "utils/update-categories.utils.php?do=update&id=7&prop=amount&value=133");

            let method =    "POST",
                data =      "?do=update"
                            + "&expense_id=" + expense_id
                            + "&description=" + description
                            + "&amount=" + amount
                            + "&frequency=" + frequency,
                url =       PHP_UPDATE_EXPENSE_LINES + data
                            ;

                return ajx(method, url)
                    .then(function (response){
                        return console.log(response);
                    });
        }
    };


    //************************************************************************//
    // UTILITY PANEL
    //************************************************************************//

    //BUDGET LINES
    //*********************************//

    function _addNewBudgetLine () {

        let     $description    = $('#line-description').val(),
                $line_amount    = $('#line-amount').val(),
                $frequency      = $('[data-new-line-target=frequency]').attr('data-id'),
                $category_id    = $('[data-new-line-target=category]').attr('data-id'),
                validated       = true;

        // validate inputs, yo.
        if (_validateNumberInput($line_amount)) {
            $line_amount = (parseFloat($line_amount)).toFixed(2);

            DEBUG && console.log('amount validated');

        } else {

            // add danger class and show message
            let $el = $('[data-html-target=line-amount-warning-msg]');

                _showInputWarning($el);

                let countdown = _count(2, _hideInputWarning, $el);

                countdown();

            // set validated to false
            validated = false;
        }

        if (!_validateTextInput($description)) {

            // add danger class and show message
            let $el = $('[data-html-target=line-description-warning-msg]');

                _showInputWarning($el);

                let countdown = _count(2, _hideInputWarning, $el);

                countdown();

            validated = false;

        }

        if (!validated) return;

        user_id = USER_ID,
        budget_id = ACTIVE_BUDGET;

        let create_line = _expense_lines.create(user_id, budget_id, $category_id, removeWhitespace($description), $line_amount, $frequency);

        create_line.then(function (response) {

            let scrollToSection = scrollTo('section[data-category-id=' + $category_id + ']');

            scrollToSection.then(function(response) {
                _refreshCategory($category_id);
            });

        })
    };


    // Clear add new line inputs
    function _clearBudgetLineInputs () {
        $("#line-description, #line-amount").val("");
    };

    //BUDGETS
    //*********************************//

    function _populateBudgetList () {

        return new Promise (function (resolve){

            var html = "";

            let list = _budget_names.fetch();

            list.then(function (response) {

                if (response == "0") {

                    resolve("0");
                    return;

                }

                for (var budget in response) {

                    html += "<tr data-budget-id='" + response[budget].id + "'>";
                    html += "<td><a href='javascript:;' data-event='switch_active_budget' data-budget-id='"+ response[budget].id + "'>" + response[budget].name + "</a></td>";
                    html += "<td>" + response[budget].created + "</td>";
                    html += "</tr>";
                };

                DEBUG && console.log(html);

                resolve(html);

                //$("[data-html-target=budget-list]").html(html);

            });
            /*.then(function () {
                $("[data-event=switch_active_budget]").click(function () {
                    _switchActiveBudget(this);
                });
            });*/

        });
    };

    function _switchActiveBudget (el) {

        // gather the id of budget we're selecting
        let newID = $(el).attr('data-budget-id');

        // assign as active budget variable
        ACTIVE_BUDGET = newID;

        DEBUG && console.log("switching to budget: " + ACTIVE_BUDGET);

        window.localStorage.last_seen_budget = ACTIVE_BUDGET;

        // reload content of new id
        _populateInitialView();

        // set the title for the budget
        $('[data-html-target=active-budget-name]').html($(el).html());

    };

    function _addNewBudget (el) {

        let $name =         $(el)
                            .prev('.form-group')
                            .find('input[data-html-target=budget_description]')
                            .val(),
            validated =     true;


        if (!_validateTextInput($name)) {

            // add danger class and show message

            let $el = $('[data-html-target=budget-name-warning-msg]');

                _showInputWarning($el);

                let countdown = _count(2, _hideInputWarning, $el);

                countdown();

            validated = false;

            _clearBudgetNameInput();

        }

        if (!validated) return;

        //else we're good...
        let addBudget = _budget_names.create(removeWhitespace($name));

        addBudget.then(function (){
            _refreshBudgetList();
            _clearBudgetNameInput();
        })
        .then(function () {
            // if we were here, we're not anymore...
            ZERO_DATA_STATE = false;

            // and start over...
            _init();
        });

    };

    function _clearBudgetNameInput () {

        $('#budget-description').val("");

    }

    function _refreshBudgetList () {

        let updatedBudgetList = _populateBudgetList();

        updatedBudgetList.then(function (response) {
            $('[data-html-target=budget-list]').html(response);
        })
        .then(function () {

            $("[data-event=switch_active_budget]")
                .off()
                .click(function () {
                _switchActiveBudget(this);
            });
        });

    }


    //CATEGORIES
    //*********************************//

    function _setBudgetCategories () {

        return new Promise (function (resolve) {

            let getCategories = _budget_categories.fetch();

            getCategories.then(function (response) {

                _budget_categories.list = JSON.parse(response);

                resolve(JSON.parse(response));
            });


        });

    };

    function _populateRecBudgetBreakdown (budgetCats) {
        // populate the Recommended budget breakdown progress bar
        // assumes budgetCats = _budget_categories.list, so assumes that it
        // has been populated onload already.

        var html = "<div class=\"col-12\" data-html-target=\"recommended_breakdown_summary\">";

        for (cat in budgetCats) {

            if (budgetCats[cat].type === "income") {continue};

            html += "<div style=\"margin-bottom: 15px;\">\n";
            html += "<strong>" + budgetCats[cat].category + ":</strong>\n";
            html += "<div class=\"progress\">\n";
            html += "<div class=\"progress-bar\" style=\"width: " + budgetCats[cat].recommended_percentage + "%\" role=\"progressbar\" aria-valuenow=\"" + budgetCats[cat].recommended_percentage + "\" aria-valuemin=\"20\" aria-valuemax=\"100\">" + budgetCats[cat].recommended_percentage + "%</div>\n";
            html += "</div>\n";
            html += "</div>\n";
        }

        html += "</div>";

        return html;

    };

    function _populateActualBudgetBreakdown (budgetCats) {
        // populate the actual budget breakdown progress bar
        // assumes budgetCats = _budget_categories.list, so assumes that it
        // has been populated onload already.

        // monthly income for reference
        var monthlyIncome = parseFloat($('[data-html-target=monthly_income_sum]').html());

        var html = "<div class=\"col-12\" data-html-target=\"actual_breakdown_summary\">";

        for (cat in budgetCats) {

            var currentCatTotal = "";

            if (budgetCats[cat].type === "income") {continue};

            currentCatTotal = parseFloat($(HTML_EXPENSE_TABLE)
                                .find('section[data-category-id=' + budgetCats[cat]["id"] + ']') // current category
                                .find('[data-html-target=category_sum]')
                                .html()); //

            console.log(monthlyIncome);
            let currentPercentage = ((currentCatTotal / monthlyIncome)*100).toFixed(2);

            html += "<div style=\"margin-bottom: 15px;\">\n";
            html += "<strong>" + budgetCats[cat].category + ":</strong>\n";
            html += "<div class=\"progress\">\n";
            html += "<div class=\"progress-bar\" style=\"width: " + currentPercentage + "%\" role=\"progressbar\" aria-valuenow=\"" + currentPercentage + "\" aria-valuemin=\"20\" aria-valuemax=\"100\">" + currentPercentage + "%</div>\n";
            html += "</div>\n";
            html += "</div>\n";
        }

        html += "</div>";

        return html;

    }

    function _populateHTMLCategoryList (obj) {
        // obj should be a reference to _budget_categories.list

        // assumes an existing HTML <div class="form-group"> shell with a data-html-target="budget_category_list" attribute
        let html = "<span style\"margin-right: 15px;\">Category:</span>\n";
            html += "<div class=\"btn-group\">\n";
              html += "<a class=\"btn btn-outline-primary btn-sm dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\" href=\"javascript:;\">\n";
                html += "<span class=\"curr-category\" data-html-target=\"new-line-category\" data-new-line-target=\"category\" data-id=\"1\">Income</span> <span class=\"caret\"></span>\n";
              html += "</a>\n";
              html += "<div class=\"dropdown-menu category-menu\" role=\"menu\">\n";

        for (var id in obj) {

                html += "<a class=\"dropdown-item\" href=\"javascript:;\" data-type=\"category\" data-id=\"" + obj[id]["id"] + "\">" + obj[id]["category"] + "</a>\n";

        };
              html += "</div>";
            html += "</div>";

            return html;

    };

    function _addNewCategory () {

    };

    function _selectCategory (el) {

        // gather the data on the clicked element
        let $id = $(el).attr('data-id'),
            $html = $(el).html(),
            $target = $(el)
                        .closest('.btn-group')
                        .find('[data-html-target=new-line-category]');

            DEBUG && console.log($target);

            // update the current category
            $target
                .html($html)
                .attr('data-id', $id);


    };


    //FREQUENCY
    //*********************************//

    let _frequency = {

        'list' : {},

        'getFrequencyList' : function () {

            let     method = "GET",
                    url =   PHP_FREQUENCY_LIST
                    ;

            return ajx(method, url)
                .then(function(response){
                    _frequency.list = JSON.parse(response);

                    return JSON.parse(response);
                });
        },

        select_active : function (el) {

            // gather the data on the clicked element
            let $id             = $(el).attr('data-id'),
                $multiplied_by  = $(el).attr('data-multiplied-by'),
                $html           = $(el).html(),
                $target         = $(el)
                                    .closest('.btn-group')
                                    .find('[data-html-target=line-frequency]');

                DEBUG && console.log($target);

            // update the current frequency
            $target
                .html($html)
                .attr({
                    'data-id' : $id,
                    'data-multiplied-by' : $multiplied_by
                });

            // testing to see if this is in a expense line, or in the utility bar
            // if it's part of an expense line, we need to test for line changes

            var $row = $target.closest('tr[data-row-id]');
            //found a tr as a descendant
            let isExpenseLine = $row.length > 0;


            if (isExpenseLine) {

                DEBUG && console.log("Checking for edits on: ");
                DEBUG && console.log($row);

                if (_lineHasEdits($row)) {
                    _toggleLineEditedState($row, false);
                } else {
                    _toggleLineEditedState($row, true);
                }
            }
        },

        html_list : function (obj) {

            // assumes an existing HTML <div class="form-group"> shell with a data-html-target="frequency_list" attribute
            let html = "<span style\"margin-right: 15px;\">Frequency:</span>\n";
                html += "<div class=\"btn-group\">\n";
                  html += "<a class=\"btn btn-outline-primary btn-sm dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\" href=\"javascript:;\">\n";
                    html += "<span data-html-target=\"line-frequency\" data-new-line-target=\"frequency\" data-id=\"1\">Weekly</span> <span class=\"caret\"></span>\n";
                  html += "</a>\n";
                  html += "<div class=\"dropdown-menu category-menu\" role=\"menu\">\n";

            for (var id in obj) {

                    html += "<a class=\"dropdown-item\" href=\"javascript:;\" data-type=\"frequency\" data-id=\"" + obj[id]["id"] + "\">" + obj[id]["description"] + "</a>\n";

            };
                  html += "</div>";
                html += "</div>";

                return html;
        }

    };


        function _setFrequencyList () {

            //populate local copy of frequency list
            let freqList = _frequency.getFrequencyList();

            freqList.then(function (response) {

                _setFrequencyHTMLList();

            });
        };

        function _setFrequencyHTMLList () {

            // set the html for the frequency list. Assumed it is a dropdown menu

            $('[data-html-target=frequency_list]').html(_frequency.html_list(_frequency.list));

        }




    //************************************************************************//
    // CONTENT ACTIONS
    //************************************************************************//

    function _deleteExpenseLine (el) {

        let     $id = $(el).data('row-id'),
                $catId = $(el).data('category-id')
                ;

        DEBUG && console.log(el);

        let deleteLine = _expense_lines.delete($id);

        deleteLine.then(function () {
            _refreshCategory($catId);
        });

    };

    function _saveLineChanges ($row) {

        DEBUG && console.log($row);

        let     $expense_id     = $($row).attr('data-row-id'),
                $description    = $($row).find("[data-type=description_input]").val(),
                $line_amount    = $($row).find("[data-type=amount_input]").val(),
                $frequencyID    = $($row).find("[data-line-target=frequency]").attr('data-id'),
                validated       = true;


        // validate inputs, yo.
        if (_validateNumberInput($line_amount)) {
            $line_amount = (parseFloat($line_amount)).toFixed(2);

            DEBUG && console.log('amount validated');

        } else {

            // add danger class and show message
            let $el = $($row).find('[data-html-target=line-amount-warning-msg]');

                _showInputWarning($el);

                let countdown = _count(2, _hideInputWarning, $el);

                countdown();

            // set validated to false
            validated = false;
        }

        if (!_validateTextInput($description)) {

            // add danger class and show message
            let $el = $($row).find('[data-html-target=line-description-warning-msg]');

                _showInputWarning($el);

                let countdown = _count(2, _hideInputWarning, $el);

                countdown();

            validated = false;

        }

        if (!validated) return;

        let update_expense = _expense_lines.update($expense_id, $description, $line_amount, $frequencyID);

        update_expense.then(function () {
            _toggleLineEditedState($row, false);
        });


    }

    function _refreshCategory (cat) {
        // cat is the category id. 1 or 2 etc...
        let BUDGET_ID = ACTIVE_BUDGET,
        $catTarget = $('section[data-category-id=' + cat + ']')
        ;

        let refresh = _expense_lines.fetch_by_category(BUDGET_ID, cat);

        refresh.then(function (response) {

            $catTarget
                .find('[data-html-target=category_data]')
                .off()
                .html(response);

        }).then(function () {
            // re-attach event handlers to new content
            _attachLineHandlers($catTarget);
        })
        .then(function () {
            _categoryTotal($catTarget);
        });

    }

    function _setActiveRow ($row) {

        let     $id             = $($row).attr('data-row-id'),
                $description    = $($row).find("[data-type=description_input]").val(),
                $amount         = $($row).find("[data-type=amount_input]").val(),
                $frequencyID    = $($row).find("[data-line-target=frequency]").attr('data-id');

        ACTIVE_LINE.id          = $id,
        ACTIVE_LINE.description = $description,
        ACTIVE_LINE.amount      = $amount,
        ACTIVE_LINE.frequencyID = $frequencyID;

        DEBUG && console.log("active row info set to: " + $id + "/" + $description + "/" + $amount + "/" + $frequencyID );

    }

    function _lineHasEdits ($line) {
        // the argument passed in is expected to be a jQuery object of a table
        // row. This is evaluated and compared to the ACTIVE_LINE state object
        // which is expected to be the last saved state of the same row.
        let     $description    = $($line).find("[data-type=description_input]").val(),
                $amount         = $($line).find("[data-type=amount_input]").val(),
                $frequencyID    = $($line).find("[data-line-target=frequency]").attr('data-id');

        DEBUG && console.log($description == ACTIVE_LINE.description && $amount == ACTIVE_LINE.amount && $frequencyID == ACTIVE_LINE.frequencyID);
        return ($description == ACTIVE_LINE.description && $amount == ACTIVE_LINE.amount && $frequencyID == ACTIVE_LINE.frequencyID);

    }

    function _toggleLineEditedState ($row, isEdited) {

        if (isEdited) {

            $($row)
            .addClass('table-warning')
            .find("[data-event=save_line_changes]")
            .removeClass('disabled')
            .click(function () {
                _saveLineChanges($row);
            });

        } else {
            $($row)
            .removeClass('table-warning')
            .find("[data-event=save_line_changes]")
            .addClass('disabled')
            .off();

            //_removeSaveHandler($row);
        }
    }


    //************************************************************************//
    // CALCULATIONS
    //************************************************************************//

        function _frequencyCalculation (freqList) {

            return function (amount, id) {

                let val_multiplied_by = parseInt(freqList[id]['value_multiplied_by']);

                return ((amount * val_multiplied_by) / 12).toFixed(2); // returns the monthly value

            };

        };

        function _categoryTotal ($cat) {

            let freqList = _frequency.getFrequencyList();

            freqList.then(function (response){
                calcAmount = _frequencyCalculation(response);

                $($cat).each(function () {

                    let $rows = $(this).find('tr[data-row-id]'),
                        catSum = 0;

                    $($rows).each(function () {

                        let sum = 0;

                        id = $(this)
                                .find('[data-html-target=line-frequency]')
                                .attr('data-id');

                        amount = parseFloat($(this).find('[data-type=amount_input]').val());

                        // use frequencyCalculation above...

                        sum = (parseFloat(calcAmount(amount, id))).toFixed(2);

                        catSum += parseFloat(sum);


                        //add html sum for each category
                        $(this)
                            .find('[data-html-target=monthly_total]')
                            .html('$' + sum);

                    });

                    $(this)
                        .find('[data-html-target=category_sum]')
                        .html(catSum.toFixed(2));

                });
            })
            .then(function () {

                _setSummaryAmounts();

            });


        };

        const _calculateAnnual = {

            'income' : function () {

                let $el = $("[data-category-type=income]");

                var total = 0;

                $($el).each(function (){

                    total += (parseFloat(
                        $(this)
                            .find('[data-html-target=category_sum]')
                            .html()
                    ) * 12);
                });

                $('[data-html-target=annual_income_sum]').html(total.toFixed(2));

            },

            'expenses' : function () {

                let $el = $("[data-category-type=expense]");

                var total = 0;

                $($el).each(function (){

                    total += (parseFloat(
                        $(this)
                            .find('[data-html-target=category_sum]')
                            .html()
                    ) * 12);
                });

                $('[data-html-target=annual_expense_sum]').html(total.toFixed(2));
            },

            'savings' : function () {

                let $el = $("[data-category-type=savings]");

                var total = 0;

                $($el).each(function (){

                    total += (parseFloat(
                        $(this)
                            .find('[data-html-target=category_sum]')
                            .html()
                    ) * 12);
                });

                $('[data-html-target=annual_savings_sum]').html(total.toFixed(2));

            },

            'totals' : function () {

                this.income();
                this.expenses();
                this.savings();
            }

        };


        const _summarizeMonthly = {

            'income_percentage' : function () {

                let percentage = 0,
                    $income = parseFloat($('[data-html-target=monthly_income_sum]').html()),
                    $allocated = parseFloat($('[data-html-target=monthly_allocated]').html());

                    percentage = (parseFloat($allocated / $income) * 100).toFixed(2);

                    if (percentage === 'NaN') {
                        percentage = 0;
                    }

                $('[data-html-target="income_spent_progress"]')
                    .css('width', percentage + '%')
                    .attr('aria-valuenow', percentage)
                    .html(percentage + '%');

            },

            'income' : function () {

                let $el = $("[data-category-type=income]");

                var total = 0;

                $($el).each(function (){

                    total += parseFloat(
                        $(this)
                            .find('[data-html-target=category_sum]')
                            .html()
                    );
                });

                $('[data-html-target=monthly_income_sum]').html(total.toFixed(2));


            },

            'allocated' : function () {

                let     $savings = $("[data-category-type=savings]"),
                        $expenses = $("[data-category-type=expense]")
                        total =     0;



                $($savings).each(function(){
                    total += parseFloat(
                        $(this)
                            .find('[data-html-target=category_sum]')
                            .html()
                    );
                });

                $($expenses).each(function(){
                    total += parseFloat(
                        $(this)
                            .find('[data-html-target=category_sum]')
                            .html()
                    );
                });


                $('[data-html-target=monthly_allocated]').html(total.toFixed(2));

            },

            'surplus_shortfall' : function () {

                let diff = parseFloat($('[data-html-target=monthly_income_sum]').html()) - parseFloat($('[data-html-target=monthly_allocated]').html());

                $('[data-html-target=monthly_income_surplus_shortfall]').html(diff.toFixed(2));
            },

            'totals' : function () {

                this.income();
                this.allocated();
                this.surplus_shortfall();
                this.income_percentage();
                $("[data-html-target=actual_breakdown_summary]").html(_populateActualBudgetBreakdown(_budget_categories.list));

            }

        };




    //************************************************************************//
    // EVENTS
    //************************************************************************//


    //CLICK HANDLERS
    //*********************************//


    // Utility bar

    function _showUtilityBar () {

        // if no data, don't want to show the utility bar until we've generated
        // a budget
        if (ZERO_DATA_STATE) {return;}

        $(UTILITY_BAR).addClass('is-visible');
    }

    function _switchUtilityView (id) {

        DEBUG && console.log('argument for switch utility view is:' + id);

        if (arguments.length === 0) {
            id = window.localStorage.lastUtilityView || DEFAULT_UTILITY_VIEW;

            //$('[data-html-target=utility_section]').hide();

            $('[data-id-target=' + id + ']')
                .addClass('active');

                $('#' + id)
                    .show();

        } else {
            $('[data-id-target=' + id + ']')
                .toggleClass('active');

            $('#' + id)
                .toggle();
        }


        // save last view in local storage
        window.localStorage.lastUtilityView = id;

        DEBUG && console.log(id);
    }

    function _setSummaryAmounts() {

        _calculateAnnual.totals();
        _summarizeMonthly.totals();

    }

    function _addBudgetHandlers () {
        $("[data-event=add_new_budget]")
            .off()
            .click(function () {
                _addNewBudget(this);
        });

        $("[data-event=add_budget_line]")
            .off()
            .click(function () {
                _addNewBudgetLine();
            });

        // utility view toggle
        $("[data-event=switch_utility_view]")
            .off()
            .click(function () {
                let id = $(this).attr('data-id-target');
                _switchUtilityView(id);
            });
    }

    /* included in the _switchActiveBudget function once HTML is generated
    $("[data-event=switch_active_budget]").click(function () {
        _switchActiveBudget(this);
    });

    */


function addNewBudgetHandlers () {

    $("[data-event=add_category]")
        .off()
        .click(_addNewCategory);

    $("[data-type=frequency]")
        .off()
        .click(function () {
        _frequency.select_active(this);
    });

    $("[data-type=category]")
        .off()
        .click(function () {
        _selectCategory(this);
    });
}





    // Budget tables





    // expense lines

    function _attachLineHandlers ($cat) {
        // target only a specific category. Expected that it is loaded via AJAX
        $($cat)
            .find('a[data-event=delete_line]')
            .off() // in case...
            .click(function (){
                let $tr = $(this).closest("tr[data-row-id]");
                _deleteExpenseLine($tr);
            });

        $($cat)
            .find('a[data-type=frequency]')
            .off()
            .click(function () {
                _frequency.select_active(this);

                let $cat = $(this).closest('[data-html-target=budget_category]');

                _categoryTotal($cat);
            });

        $($cat)
            .find('a[data-event=frequency_dropdown]')
            .click(function () {

                let $activeRow      = $(this).closest('tr[data-row-id]'),
                    isAlreadyActive = ($($activeRow).attr('data-row-id') === ACTIVE_LINE.id);


                if (isAlreadyActive) {
                    return;
                }

                _setActiveRow($activeRow);

            });

        $($cat)
            .find('[data-event=input_focus]')
            .off()
            .focus(function () {


                let $activeRow      = $(this).closest('tr[data-row-id]'),
                    isAlreadyActive = ($($activeRow).attr('data-row-id') === ACTIVE_LINE.id);


                if (isAlreadyActive) {
                    return;
                }

                _setActiveRow($activeRow);

            })
            .change(function () {

                let $activeRow = $(this).closest('tr[data-row-id]');

                if (_lineHasEdits($activeRow)) {
                    _toggleLineEditedState($activeRow, false);

                } else {
                    _toggleLineEditedState($activeRow, true);
                }

            })
            .change(function () {

                let $cat = $(this).closest('[data-html-target=budget_category]');

                _categoryTotal($cat);

                // to do: recalculate totals etc
            });


    }

    //FORM EVENTS
    //*********************************//



    //************************************************************************//
    // UTILITY FUNCTIONS
    //************************************************************************//

    //INPUT VALIDATION
    //*********************************//
    function _validateTextInput (input) {

        // remove whitespace, if any

        let success = true,
            Input = input.replace(/\s/g, "" ),

            //only contains letters and numbers
            pattern = /\W/g;

        if (Input === "" || Input === 'undefined' || pattern.test(Input)) {
            success = false;
        }

        return success;
    };

    function _validateNumberInput (input) {

        let success = true,
            pattern = /\D/g,
            // we can expect that the number will be a float value (and as such
            //doesn't pass the given pattern test below), but for the moment
            // we are only concerned with whether it is a number at all, so parseInt
            // will work fine to test validity.
            isNotNumber = pattern.test(parseInt(input));

            if (input === "" || input === 'undefined' || isNotNumber) {
                success = false;
            } else if (!isNotNumber && parseFloat(input) <= 0) {
                success = false;
            }

        return success;
    };

    function removeWhitespace (str) {

        return str.replace(/\s/g, "+");

    }

    function _showInputWarning(el) {

        // add danger class and show message
        $(el)
            .toggleClass('hidden-xs-up')
            .closest('.form-group')
            .addClass('has-danger');

    }

    function _hideInputWarning(el) {

        $(el)
            .toggleClass('hidden-xs-up')
            .closest('.form-group')
            .removeClass('has-danger');
    }


    //DEBUG
    //*********************************//

    function _debug () {

        DEBUG = true;

        console.log("Debug mode is turned on. Mostly this means more debugging statements will be outputted by the console. Enjoy the noise.")

    }


    //COUNTER
    //*********************************//

    function _count (x, func, param) {

        return function () {
            var timer = setTimeout(func, (x * 1000), param);
        }
    }


    //SCROLL
    //*********************************//

    function scrollTo(el) {


        return Promise.resolve($('html, body').animate({
                scrollTop : $(el).offset().top
            }, 500).promise().done()
        );
    }


    //************************************************************************//
    // INITIAL LOAD
    //************************************************************************//

    function _setInitialBudget () {

        if (ZERO_DATA_STATE) {return;}

        let     default_budget      = $('tr[data-budget-id]').eq(0).attr('data-budget-id');




        // set state
        ACTIVE_BUDGET = window.localStorage.last_seen_budget || default_budget;

        // active budget name
        initial_budget_name = $('tr[data-budget-id=' + ACTIVE_BUDGET + ']')
                                .find('a')
                                .html();

        //set HTML
        $('[data-html-target=active-budget-name]').html(initial_budget_name);

    };

    function _zeroDataState () {

        ZERO_DATA_STATE = true;

        let zds = ajx("GET", "includes/zero-data-state.php");

        zds.then(function (response) {

            $(HTML_EXPENSE_TABLE).html(response);

        })
        .then(function () {
            _attachViewHandlers();
        });

    };

    function _populateInitialView() {

        if (ZERO_DATA_STATE) {return;}

        let     BUDGET_ID = ACTIVE_BUDGET; //for now...

        let resp = _expense_lines.fetch_by_category(BUDGET_ID, "0");

        resp.then(function (response){

            $(HTML_EXPENSE_TABLE)
            .hide()
            .html(response)
            .fadeIn(200);

        })
        .then(function () {

            _attachViewHandlers();

        })
        .then(function () {

            let $cats = $('[data-html-target=budget_category]');
            _categoryTotal($cats);
        });
    };

    function _attachViewHandlers () {
        if (ZERO_DATA_STATE) {

            _addBudgetHandlers();
            return;
        }

        let TARGET = "[data-html-target=budget_category]";

        _attachLineHandlers(TARGET);
    };





    //************************************************************************//
    // API (mmmm, appies...)
    //************************************************************************//

    const API = {
        'frequency'         :   _frequency,
        'user'              :   _users,
        'expense_lines'     :   _expense_lines,
        'budget_names'      :   _budget_names,
        'budget_categories' :   _budget_categories,
        'expense_lines'     :   _expense_lines,
        'pop_budget_list'   :   _populateBudgetList,
        'add_budget'        :   _addNewBudget
    }

    const _init = function () {
        // populate HTML table for initial budget list. HTML shell in utility-bar.php
        let budgetList = _populateBudgetList();

        budgetList.then(function (response){

            // if no budgets saved. show the zero data state ui
            if (response == "0") {
                _zeroDataState();
            } else {

                //populate the html budget list in the utility bar
                $("[data-html-target=budget-list]").html(response);

                //activate the buttons
                $("[data-event=switch_active_budget]").click(function () {
                    _switchActiveBudget(this);
                });

            }
        })
        .then(function (){
            //set the active budget state
            _setInitialBudget();
        })
        .then(function () {
            _populateInitialView();
        })
        .then(function () {
            _attachViewHandlers();
        })
        .then(function () {
            // event handlers for the utility bar and zero state ui if present
            _addBudgetHandlers();
        })
        .then(function () {
            // set reference object for budget categories
            let budget_cats = _setBudgetCategories();

            budget_cats
                .then(function (response) {
                    $('[data-html-target=budget_category_list]').html(_populateHTMLCategoryList(response));
                })
                .then(function () {
                    addNewBudgetHandlers();
                })
                .then(function () {

                    // populate HTML for budget breakdown
                    $("[data-html-target=recommended_breakdown_summary]").html(_populateRecBudgetBreakdown(_budget_categories.list));

                });
        })
        .then(function () {
            // create reference object for frequency list options
            let freqList = _setFrequencyList();

        })
        .then(function () {
            _switchUtilityView();
        })
        .then(function () {
            _setSummaryAmounts();

        })
        .then(function () {

        })
        .then(function () {
            _showUtilityBar();

        });
    }

    function Calculator () {

        this.version = VERSION;
        this.init = _init;
        this.debug = _debug;
    };

    Calculator.prototype = API;


    //************************************************************************//
    // LAAAAUUUUNNNNCH
    //************************************************************************//

    return window.Calculator = new Calculator();

})(jQuery);
