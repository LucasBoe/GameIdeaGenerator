$(() => {

    var $bar = $(".component-bar");
    var $inactive = $(".inactive-component-list");

    var activeComponents = [];

    $.getJSON("data.json", (data) => {

        //create elements
        $.each(data, (key, val) => {

            var activeHideClass = "";
            var inactiveHideClass = "";

            if (!val["default"]) {
                activeHideClass = "hide"
            }
            else 
            {
                inactiveHideClass = "hide"
                activeComponents.push(key);
            }

            $inactive.prepend("<li class='bc_" + key + " " + inactiveHideClass + " _comp'>" + key + "</li>")
            $bar.append("<h2 class='c_" + key + " " + activeHideClass + "' comp='" + key + "'> #" + key + "<span class='remove-component'></span></h2>" );
        });

        //put add button back to end
        $("#add-new-component-button").appendTo($bar);

        //add click & open add list to add component button
        $("#add-new-component-button").click(() => {
            $(".inactive-component-overlay").css("visibility","inherit");
        })

        //add click & open close list to close component menu
        $("#close-inactive-component-overlay").click(() => {
            $(".inactive-component-overlay").css("visibility","hidden");
        })

        //add click action to remove buttons
        $(".remove-component").click((e) => {
            var comp = $(e.target).parent().attr("comp");
            activeComponents.remove(comp);
            updateComponents(activeComponents, $bar, $inactive);
        });

        //add click action to add buttons
        $(".inactive-component-list ._comp").click((e) => {
            var comp = $(e.target).text();
            activeComponents.push(comp);
            updateComponents(activeComponents, $bar, $inactive);
            $(".inactive-component-overlay").css("visibility","hidden");
        });

        //start idea generation at click on generate button
        $("#generate-button").click(() => generateIdea(data, activeComponents));
    });

});

function updateComponents(activeList, $bar, $inactive) {

    var allActive = true;

    //inactive
    $inactive.children().each(function () {
        var text = $(this).text();
        var needsClass = ($.inArray(text, activeList) != -1);
        var hasClass = $(this).hasClass("hide");
        if (needsClass != hasClass) {
        if (!needsClass)
            $(this).removeClass("hide");
        else
            $(this).addClass("hide");
        }
    });

    //active
    $bar.children().each(function () {
        var text = $(this).attr("comp");

        if (text != undefined)
        {        
            var needsClass = ($.inArray(text, activeList) == -1);
            var hasClass = $(this).hasClass("hide");

            if (needsClass)
                allActive = false;

            if (needsClass != hasClass) {
            if (!needsClass)
                $(this).removeClass("hide");
            else
                $(this).addClass("hide");
            }
        }
    });

    $("#add-new-component-button").setActive(!allActive);
}

function generateIdea(data, activeComponents) {
    var text = "A"

    if (isValid("theme", activeComponents, data)) {
        text += " <b class='c_theme'>"+ getRandomStringFromArray(data["theme"]["content"]) + "</b>";
    }

    if (isValid("genre", activeComponents, data)) {
        text += " <b class='c_genre'>"+ getRandomStringFromArray(data["genre"]["content"]) + "</b>";
    }
        text += " game"

    if (isValid("limitation", activeComponents, data)) {
        text +=  " <b class='c_limitation'>"+ getRandomStringFromArray(data["limitation"]["content"]) + "</b>";
    }
    
    if (isValid("mechanics", activeComponents, data)) {
        var r = getRandomStringFromArray(["using","involving", "based on"]);
        text += " " + r + " <b class='c_mechanics'>"+ getRandomStringFromArray(data["mechanics"]["content"]) + "</b>";
    }

    if (isValid("fantasy", activeComponents, data)) {
        text += " in which <b class='c_fantasy'>"+ getRandomStringFromArray(data["fantasy"]["content"]) + "</b>";
    }

    text += ". "

    Type(text);
}

//check if the component should be used
function isValid(toCheck, validList, dataToCheck) {

    if (dataToCheck[toCheck] == undefined)
        return false;

    if ($.inArray(toCheck, validList) == -1)
        return false;

    return true;
}

function getRandomStringFromArray(comp) {
    var rand = Math.floor(Math.random()*comp.length);
    return comp[rand];
}

//array remove function
Array.prototype.remove = function(v) { this.splice(this.indexOf(v) == -1 ? this.length : this.indexOf(v), 1); }

//show / hide function with bool input
jQuery.prototype.setActive = function(active) {
    if (active)
        $(this).show();
    else
        $(this).hide();
}
