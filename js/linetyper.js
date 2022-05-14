/*
Variation of my linetyper used at https://l-boe.de/
*/

var lines;
var lineIndex = 0;
var waitTickTimer = 0;
var currentLine = "";
var text = "";
var state;
const tickDuration = 20;

var isTyping = false;

const states = {
    ReduceToMin: 0,
    AddToMax: 1,
    Wait: 2
};

$(() => {
    state = states.Wait;
    Loop();
});

function Type(newText) {
    text = $("#line").text();
    state = states.ReduceToMin;
    currentLine = newText;
    isTyping = true;
}

function Loop() {
    Tick();
    setTimeout(() => {
        Loop();
    }, tickDuration);
}

function Tick() {

    switch (state) {
        case states.ReduceToMin:

            if (text.removeHTML() == currentLine.cleanSubstring(0, text.length)) {
                setState(states.AddToMax);
            } else {
                var len = text.length - 1;
                text = text.dirtySubstringFromCleanLength(0, len);
            }
            break;

        case states.AddToMax:
            var len = text.length + getZeroOrOne();
            text = currentLine.dirtySubstringFromCleanLength(0, len);

            if (len >= currentLine.length) {
                setState(states.WaitW);
            }
            break;

        case states.Wait:
            isTyping = false;
            break;

    }

    var barStr = "|";
    if (new Date().getTime() / 500 % 2 < 1) {
        barStr = "<i>|</i>";
    }

    $("#line").html(text + barStr);
}

function setState(newState) {

    if (newState == states.Wait) {
        waitTickTimer = 30;
    }

    state = newState;
}

function getZeroOrOne() {
    if (Math.random() > 0.5)
        return 1;

    return 0;
}

String.prototype.removeHTML = function() {
    return this.replace(/<[^>]+>/g, '');
}

String.prototype.cleanSubstring = function(start, length)
{
    return this.removeHTML().substring(start, length)
}

String.prototype.dirtySubstringFromCleanLength = function(start, length)
{
    var temp = this.substring(start, length);
    if(temp.lastIndexOf('<') > temp.lastIndexOf('>')) {
        temp = this.substring(start, 1 + this.indexOf('>', temp.lastIndexOf('<')));
    }
    return temp;
}
