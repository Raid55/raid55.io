

//All vars
var ajbutton = document.getElementById('ajbtton');
var returnBox = document.getElementById("ajax_return");
var corsMe = "https://crossorigin.me/";
var buttoncounter = 0;

//All Functions
function factorFinder() {
    var inputNumber = document.getElementById('fac_box').value;
    var i = 2;
    var factors = new Array();
    while (i <= inputNumber) {
        if (inputNumber % i == 0) {
            inputNumber /= i;
            factors.push(i);
            i++;
        }else{
            i++;
        }
    }
    var outputMessage = "Factors are " + factors.toString() + "!";
    document.getElementById('fac_output').innerHTML = outputMessage;
}; /* don't forget to ask why you dont need a ; right here. WHEN DO YOU NEED A ; ??? 
the universe will probably never know */

function makeHTMLforMDNONLY(data) {
    var html = '';
    var dataDoc = data.documents;
    for(var i = 0; i<dataDoc.length;i++) {
        var objNum = i + 1;
            html+= "<p>The title for number " + objNum+" is: " +'<span class="outputTitle">'+dataDoc[i].title+"</span>"+"</p>";
    }
    returnBox.insertAdjacentHTML('beforeend',html);
};
//All the AJAJ
/*I don't like the sound of XML, it sounds complicated for no reason...
+ we are working with JSON so I say AJAJ. I know its stil AJAX but whatever... this is my
JS fill*/

ajbutton.addEventListener("click", function() {
    var xhr = new XMLHttpRequest();
    var searchBox = document.getElementById("ajax_input").value;
    xhr.open('GET',corsMe+'https://developer.mozilla.org/en-US/search.json?q='+searchBox,true);
    xhr.onload = function() {
        var parsedData = JSON.parse(xhr.responseText);
        makeHTMLforMDNONLY(parsedData);
        buttoncounter++;
        if(buttoncounter >= 2) {
            ajbutton.classList.add("hide-me");
        }
    };
    xhr.onerror = function() {
    console.log("Connection error");
  };
  xhr.send();
});