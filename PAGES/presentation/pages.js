var wrap = $('#wrap');
var SLIDES = {};
var choice = $('#SLIDECHOICE');

const setMin = 3;
const setMax = 6;

var section = $('#bp_result');
var conclusion = $('#p_result');
var textarea = $('#textarea_result');
var shown = $('#shown_result');
var warning = $('#warning');

$(function() {
    updateSLIDES();
    setCHOICES();

    $('#uncheck_all').click(function() {
        choice.find('input').prop('checked', false);
    });
    $('#check_all').click(function() {
        choice.find('input').prop('checked', true);
    });

    textarea.text('bouhh');

    $('#COMPOSE').click(function() {
        COMPOSE();
    });
});

// update var SLIDES with all JSON files
function updateSLIDES() {
    var jsonFiles = [
        SLIDE1,
        SLIDE2,
        SLIDE3,
        SLIDE4,
        SLIDE5,
        SLIDE6,
        SLIDE7,
        SLIDE8,
        SLIDE9,
        SLIDE10,
        SLIDE11
    ]


    for (file of jsonFiles) {
        SLIDES[file["index"]] =
            {"name" : file["name"],
             "text" : file["text"]}
    }
}

// create a single choice of slide (not added to anything yet)
function createSLIDECHOICE(i, name) {

    var input = create('input')
        .attr('type', 'checkbox')
        .attr('name', 'SLIDE')
        .attr('id', 'slide' + i)
        .addClass('none input_filec slide_filec');

    var label = createHTML(
            'label',
            'ONGLET ' + i + ' :: ' + name
        )
        .attr('for', 'slide' + i)
        .addClass('simple hi1 background crosshair');

    return [input, label];
}

// creates all slides and place them in the right field based on var SLIDES
function setCHOICES() {
    for (let i in SLIDES) {
        var s = createSLIDECHOICE(i, SLIDES[i]["name"]);
        choice.append(s[0]);
        choice.append(s[1]);
    }

    choice.append(create('fill'));
}


// reset hidden fields
function resetAll() {
    section.addClass('none');
    textarea.text('');
    shown.html('');
    warning.addClass('none');
}

// compose the file : resets, compose the code and place it in textarea
function COMPOSE() {
    resetAll();

    /*takes the template and fills shown with it*/
    shown.html(MAIN_TEMPLATE);

    /*verify if enough inputs are selected*/
    var array = checkSelectedInputs();
    if (setMin <= array.length && array.length <= setMax) {
        // ENOUGH INPUTS SELECTED

        // verifies adds normal or ephemere irl part
        var normal = $('#type1').prop('checked');
        if (normal)
            $('.INTRODUCTION_pres').append(normal_TEMPLATE);
        else
            $('.INTRODUCTION_pres').append(ephemere_TEMPLATE);

        /*takes selected slides and fills shown with it*/
        composeSlides(array);

        // approve
        finalApprove();


    } else {
        // NOT ENOUGH INPUTS SELECTED -> puts warning
        if (array.length == 0)
            warning.html(
                `Attention ! Vous n'avez pas sélectionné d'onglet, merci d'en choisir au moins <vh>3</vh>.`)

        else if (array.length < setMin)
            warning.html(
                `Attention ! Vous n'avez sélectionné que <vh>` + array.length + `</vh> onglets. `
                + `Merci d'en choisir au moins <vh>` + (setMin - array.length) + `</vh> en plus.`)
        else
            warning.html(
                `Attention ! Vous avez sélectionné <vh>` + array.length + `</vh> onglets. `
                + `Merci d'en retirer au moins <vh>` + (array.length - setMax) + `</vh>.`
            )
        warning.removeClass('none');

        return false;
    }

}

// check the index of the selected inputs
function checkSelectedInputs() {
    var checked = [];
    var regex = /\d+/g;
    choice.find('input:checked').each(function() {
        var ths = $(this);
        var matched = ths.attr('id').match(regex)[0];
        checked.push(parseInt(matched));
    });
    return checked;
}

// based on the inputs index, compose the slides and their title; put them in the file
function composeSlides(selected) {
    var selectedSlides = {};
    for (i of selected) {
        selectedSlides[i] = SLIDES[i];
    }

    var c = 0;
    var alterne = 3;

    for (let slide in selectedSlides) {
        var nb = (c % (alterne * 2));
        // append the title, left or right
        if (nb < alterne)
            $('.SQUAREGRID_pres scroll').append(liner(selectedSlides[slide]["name"]));
        else
            $('.SQUAREGRID_pres scroll').append(linel(selectedSlides[slide]["name"]));

        // append the text, which is found in JSON files
        $('.main_pres').append(selectedSlides[slide]["text"]);

        c++;
    }
}

// creates a linel element
function linel(name) {
    return create('linel')
        .append(
            createHTML('mg', name)
                .addClass('dotted crosshair')
        )
        .append(create('lgn').addClass('da1'));
}


// creates a liner element
function liner(name) {
    return create('liner')
        .append(
            createHTML('mg', name)
                .addClass('dotted crosshair')
        )
        .append(create('lgn').addClass('da1'));
}



// final approval
function finalApprove() {
    // make conclusion sentence.
    var t = $('#type1').prop('checked');
    if (t == true) t = 'normal';
    else t = 'éphémère';
    conclusion.html(`Et voilà ! Votre fiche comporte <vh>` + choice.find('input:checked').length
                    + ` onglets</vh> et vous avez choisi un <vh>personnage ` + t + `</vh>.<br>`
                    + ` Vous n'avez plus qu'à copier/coller le code sur le forum.`);

    // fills textarea with it
    textarea.text(shown.html());

    /*makes the toggle*/
    shown.find('.toggle_inside').each(function() {
        var ths = $(this);
        toggleSomething(ths);
    });
    section.removeClass('none');
}
