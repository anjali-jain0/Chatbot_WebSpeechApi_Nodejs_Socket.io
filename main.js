var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition ;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList ;

const colors = [ 'blue' , 'red' , 'purple', 'green', 'black', 'blue', 'brown', 'orange'] ;
const grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'

const recognition = new SpeechRecognition();
const grammarList = new SpeechGrammarList();

grammarList.addFromString(grammar , 1);

recognition.grammars = grammarList;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var output = document.querySelector('.output');
var hints = document.querySelector('.hints');
var bg = document.querySelector('html');

var colorHTML = '';

colors.forEach(function(color){
	colorHTML += '<span style="background-color:' + color + ';">' + color + '</span>';
});

hints.innerHTML = 'Tap/Click on screen then say a color to change the background color . Try ' + colorHTML ;

document.body.onclick = () => {
	recognition.start();
}


recognition.onresult = (e) => {
	var last = e.results.length - 1;
	var color = e.results[last][0].transcript;
	output.innerHTML = 'Result received : ' + color;
	bg.style.backgroundColor = color;
}

recognition.onspeechend = () => {
	recognition.stop();
}

recognition.onnomatch = (e) => {
	output.innerHTML = 'Color not recognised';;
}

recognition.onerror = (e) => {
	output.innerHTML = 'Error in recognition ' + e.error;
}