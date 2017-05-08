
$(document).ready(function () {
    $('.slider').jcarousel({
        initCallback: slider_initCallback,
        itemFirstInCallback: slider_firstInCallback,
        scroll: 1,
        auto: 5,
        wrap: 'both',
        // This tells jCarousel NOT to autobuild prev/next buttons
        buttonNextHTML: null,
        buttonPrevHTML: null
    });
});

function slider_initCallback(carousel) {

    $('.slider-nav a').bind('click', function () {
        carousel.scroll($.jcarousel.intval($(this).text()));
        return false;
    });
}

function slider_firstInCallback(carousel, item, idx, state) {
    $('.slider-nav a').removeClass('active');
    $('.slider-nav a').eq(idx - 1).addClass('active');
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


////////////////////////////////////////////////////////////////////////////////////////
myTroopList = {};
totalTroops = 0; //loaded as string from text file
totalTroopsCheck =0; //incremented for each troop created

function Troop(troop_id, line1, line2, line3, line4, line5, line6) {
    this.id = troop_id;
    [this.name_trp, this.name_sngl, this.name_plrl, this.zero1, this.hash1, this.zero2, this.zero3, this.dunno, this.upgrade1, this.upgrade2] = line1.split(" ");
    var tempItemsArray = line2.split(" 0 ");
    //alert("Orig:\n"+tempItemsArray.toString());
    this.itemsArray = [];
    for (var a in tempItemsArray) {
        if (!isNaN(parseInt(tempItemsArray[a], 10)) && parseInt(tempItemsArray[a], 10) > 0) {
            this.itemsArray.push(parseInt(tempItemsArray[a], 10)); // To change the strings into integers, need be.
        } 
    }
    //alert("Items:\n"+this.itemsArray.toString());
    this.stats = line3.split(" ");
    this.proficiencies = line4.split(" ");
    totalTroopsCheck += 1;
}
Troop.prototype.getName = function () {
    return this.id + " " + this.name_sngl;
};

Troop.prototype.getItems = function () {
    return this.itemsArray.toString();
};

Troop.prototype.getStats = function () {
    return "<table><tr><td>Str:</td><td>" + this.stats[2] + "</td></tr><tr><td>Agi:</td><td>" + this.stats[3] + "</td></tr><tr><td>Int:</td><td>" + this.stats[4] + "</td></tr><tr><td>Cha:</td><td>" + this.stats[5] + "</td></tr></table>";
    //return "stats";
};

Troop.prototype.getProficiencies = function () {
    return "<table><tr><td>One Handed:</td><td>" + this.proficiencies[1] + "</td></tr><tr><td>Two Handed:</td><td>" + this.proficiencies[2] + "</td></tr><tr><td>Polearms:</td><td>" + this.proficiencies[3] + "</td></tr><tr><td>Archery:</td><td>" + this.proficiencies[4] + "</td></tr><tr><td>Crossbows:</td><td>" + this.proficiencies[5] + "</td></tr><tr><td>Throwing:</td><td>" + this.proficiencies[6] + "</td></tr><tr><td>Firearms:</td><td>" + this.proficiencies[7] + "</td></tr></table>";
    //return "proficiencies";
};

Troop.prototype.toTable = function () {
    return "<table><tr><td>ID:</td><td>" + this.id + "</td></tr><tr><td>Name:</td><td>" + this.name_sngl + "</td></tr></table>";
};

Troop.prototype.toString = function troopToString() {
    var info = "ID:<t>" + this.id + " " + this.name_sngl;
    return info;
};

function LoadOriginalFile() {
    var oFrame = document.getElementById("frmFile");
    var strRawContents = oFrame.contentWindow.document.body.childNodes[0].innerHTML;
    while (strRawContents.indexOf("\r") >= 0)
        strRawContents = strRawContents.replace("\r", "");
    var arrLines = strRawContents.split("\n");
    this.textDocumentName = arrLines[0];
    this.numTroops = arrLines[1];
    totalTroops = arrLines[1];
    var curID = 1;
    var lineNumber = 1;
    for (var i = 2; i < arrLines.length; i++) {
        var line = arrLines[i];
        if (lineNumber == 1) {
            var line1 = line;
        } else if (lineNumber == 2) {
            var line2 = line;
        } else if (lineNumber == 3) {
            var line3 = line;
        } else if (lineNumber == 4) {
            var line4 = line;
        } else if (lineNumber == 5) {
            var line5 = line;
        } else if (lineNumber == 6) {
            var line6 = line;
        }
        lineNumber += 1;


        if (lineNumber == 7) {
            myTroopList[curID] = new Troop(curID, line1, line2, line3, line4, line5, line6);
            curID += 1;
            lineNumber = 0;
        }
    }
    loadTroopMenu();
}

//////////////////////////////////////////////////////////////////////////////////////
(function () {
    'use strict';

    document.getElementById("txt-input");

    document.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode == 13) {
            var input = document.getElementById('txt-input').value;
            displayTroop(getTroopKey(input));
        }
    });

    document.addEventListener('DOMContentLoaded', function () {
        var c = document.getElementById('clickCounter');
        var d = getCookie('numClicks');

        if (d === "") {
            c.innerText = parseInt(c.innerText, 10) + 1;
        } else {
            c.innerText = parseInt(d, 10) + 1;
        }

    });

    document.addEventListener('click', function () {
        var c = document.getElementById('clickCounter');

        c.innerText = parseInt(c.innerText, 10) + 1;
        var d = new Date();
        var x = new Date();
        d.setDate(d.getDate() + (x + (7 - d.getDay())) % 7);

        //setCookie('numClicks',c.innerText,d)
        setCookie('numClicks', c.innerText, 30)

        /*
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
     
        document.cookie = 'numClicks = ' + c.innerText + ';' + expires + ";path=/";  */
    });



})();

function readFile(file) {
    var reader = new FileReader();
    reader.onload = function (evt) {
        var textContents = evt.target.result;
        console.log(textContents);
    };
    reader.readAsText(file);
}
/*
var readFileBtn = document.getElementById('read-file');
readFileBtn.addEventListener('click', function () {
    var inputFile = document.getElementById('input-file');
    alert("here");
    readFile(inputFile.files[0]);
});

*/


//returns key if troop exists. -1 if invalid ID, -2 if invalid word.
function getTroopKey(input) {
    if (!isNaN(parseInt(input, 10))) {
        if (parseInt(input, 10) > 0 && parseInt(input, 10) <= totalTroops) {
            return (parseInt(input, 10));
        } else {
            return -1;
        }
    } else {
        // no way, it is not even a number
        for (var key in myTroopList) {
            var value1 = myTroopList[key].name_sngl;
            var value2 = myTroopList[key].name_plrl;
            var value3 = myTroopList[key].name_trp;

            if (value1.toLowerCase() == input.toLowerCase() || value2.toLowerCase() == input.toLowerCase() || value3.toLowerCase() == input.toLowerCase()) {
                return key;
            }
        }
    }
    return -2;
}
function displayFromDrop(string) {
    var [type, id] = string.split(",");
    if (type === 'unit') {
        displayTroop(id);
    } else if (type === 'item') {
        alert("item to be displayed")
    } else {
        alert("invalid item passed through.\nType: " + type + "\nID: " + id);
    }
}

function displayTroop(input) {
    var key = parseInt(input, 10)
    if (!isNaN(key)) {
        var resultsTitle = document.getElementById('results_title');
        var resultsLeft = document.getElementById('results_left');
        var resultsRight = document.getElementById('results_right');
        var resultsItems = document.getElementById('items_list');
        

        if (key < 0) {
            if (key === -1) {
                resultsTitle.innerHTML = 'ID outside range of {1 - ' + parseInt(totalTroops, 10) + '}'
            } else {
                resultsTitle.innerHTML = "Nothing found"
            }
            resultsLeft.innerHTML = "---"
            resultsRight.innerHTML = "---"
            resultsItems.innerHTML = "---"
        } else {
            resultsTitle.innerHTML = myTroopList[key].getName()
            resultsLeft.innerHTML = myTroopList[key].getStats()
            resultsRight.innerHTML = myTroopList[key].getProficiencies()
            resultsItems.innerText = myTroopList[key].getItems();
            loadTroopItems(key);
        }
        document.getElementById('txt-input').value = "";
    } else {
        alert("trying to displayTroop without ID number:\n" + key)
    }
}


function allowDrop(ev) {
    ev.preventDefault();
    ev.target.style.boxShadow = "10px 20px 30px blue";
}
function dragLeave(ev) {
    ev.target.style.boxShadow = "none";
}
function drag(ev) {
    //ev.dataTransfer.setData("text", ev.currentTarget.id); //ev.target.id works too. difference?
    ev.dataTransfer.setData("text", ev.currentTarget.typeAndId);
    //this.style.opacity = '0.4'; --doesn't work for this, seek similar
}
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    //ev.target.appendChild(document.getElementById(data));
    displayFromDrop(data);
    ev.target.style.boxShadow = "none";
}



function loadTroopMenu() { //http://stackoverflow.com/questions/18789354/how-do-i-make-dynamically-created-elements-draggable
    /*var menuTextArea = document.getElementById('unused_area');
    for (var key in myTroopList) {
        menuTextArea.innerHTML += "<a href=\"#\">" + myTroopList[key].getName() + "</a>";
    }*/
     document.getElementById('troop_menu_area').innerHTML = '';

    for (var key in myTroopList) {
        var div = document.createElement('div');
        //div.innerHTML = "<a draggable=\"true\" ondragstart=\"drag(event)\">" + myTroopList[key].getName() + "</a>";
        div.innerText = myTroopList[key].getName();
        // set style
        div.style.color = 'gray';
        // better to use CSS though - just set class
        //div.setAttribute('class', 'myclass'); // and make sure myclass has some styles in css
        //div.id = key; no need for a key 
        div.draggable = "true";
        div.typeAndId = ['unit', key]
        div.addEventListener('dragstart', function () { drag(event) }, false);
        //div.ondragstart = "drag(event)"; - does not work as dynamic element is not on DOM. thus require addEventListener.
        //div.ondrag = "drag(event)"; - only safari and internet explorer
        document.getElementById("troop_menu_area").appendChild(div);
    }
}

function loadTroopItems(id) { //need to somehow delete previous items on new load.
    $( ".item" ).remove();
    for (var i in myTroopList[id].itemsArray) {
        var div = document.createElement('div');
        div.style.color = 'gray';
        div.draggable = "true";
        div.className = "item";
        div.typeAndId = ['item', myTroopList[id].itemsArray[i]]; //not key, but item number
        div.innerText = myTroopList[id].itemsArray[i];
        div.addEventListener('dragstart', function () { drag(event) }, false);
        document.getElementById("items_array").appendChild(div);
    }
}

function testCall(x) {
    alert("Tested with: " + x);
}

function fileChange(fileName) {
    /* $.get("temp.txt", function (response) { //get is asynchronous, so can have seperate 'get' for items at same time. Make sure I don't try load item stats before troops are finished and vice-versa
         alert("results: " + response);
     });*/
    loadNewFile(fileName);
}

function loadNewFile(fileName) {

    myTroopList = []; //reset troop list
    totalTroops = 0;
    totalTroopsCheck = 0;
    $.get(fileName, function (strRawContents) {
        while (strRawContents.indexOf("\r") >= 0) {
            strRawContents = strRawContents.replace("\r", "");
        }
        var arrLines = strRawContents.split("\n");
        this.textDocumentName = arrLines[0];
        totalTroops = arrLines[1];
        var curID = 1;
        var lineNumber = 1;
        for (var i = 2; i < arrLines.length; i++) {
            var line = arrLines[i];
            if (lineNumber == 1) {
                var line1 = line;
            } else if (lineNumber == 2) {
                var line2 = line;
            } else if (lineNumber == 3) {
                var line3 = line;
            } else if (lineNumber == 4) {
                var line4 = line;
            } else if (lineNumber == 5) {
                var line5 = line;
            } else if (lineNumber == 6) {
                var line6 = line;
            }
            lineNumber += 1;


            if (lineNumber == 7) {
                myTroopList[curID] = new Troop(curID, line1, line2, line3, line4, line5, line6);
                curID += 1;
                lineNumber = 0;
            }
        }
        loadTroopMenu();
    });
}