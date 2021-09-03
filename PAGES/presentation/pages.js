var wrap = $('#wrap');
var SLIDES = {};
var choice = $('#SLIDECHOICE');

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
function setCHOICES() {
    for (let i in SLIDES) {
        var s = createSLIDECHOICE(i, SLIDES[i]["name"]);
        choice.append(s[0]);
        choice.append(s[1]);
    }

    choice.append(create('fill'));
}

function resetAll() {
    section.addClass('none');
    textarea.text('');
    shown.html('');
}
function COMPOSE() {
    resetAll();

    /*takes the template and fills shown with it*/
    shown.html(MAIN_TEMPLATE);

    /*takes selected slides and fills shown with it*/
    composeSlides(checkSelectedInputs());

    /*makes the toggle*/
    shown.find('.toggle_inside').each(function() {
        var ths = $(this);
        toggleSomething(ths);
    });

    section.removeClass('none');
}

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

function composeSlides(selected) {
    var selectedSlides = {};
    for (i of selected) {
        selectedSlides[i] = SLIDES[i];
    }

    console.log(selectedSlides);

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

function linel(name) {
    return create('linel')
        .append(
            createHTML('mg', name)
                .addClass('dotted crosshair')
        )
        .append(create('lgn').addClass('da1'));
}

function liner(name) {
    return create('liner')
        .append(
            createHTML('mg', name)
                .addClass('dotted crosshair')
        )
        .append(create('lgn').addClass('da1'));
}
