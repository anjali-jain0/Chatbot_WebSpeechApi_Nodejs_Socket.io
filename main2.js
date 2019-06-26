var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition ;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList ;
var synth = window.speechSynthesis ; 

var output = document.querySelector('.output');
var hints = document.querySelector('.hints');
var bg = document.querySelector('html');
var inputform = document.querySelector('form');
var voiceOptions = document.querySelector('select');
var inputTxt = document.querySelector('.txt');
var rate = document.querySelector('#rate');
var pitch = document.querySelector('#pitch');

const colors = [ 'blue' , 'red' , 'purple', 'green', 'black', 'blue', 'brown', 'orange'] ;
const grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
var voices = [];

const recognition = new SpeechRecognition();
const grammarList = new SpeechGrammarList();

grammarList.addFromString(grammar , 1);

recognition.grammars = grammarList;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

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
	inputTxt.value = color;
	bg.style.backgroundColor = color;
}

recognition.onspeechend = () => {
	recognition.stop();
}

recognition.onnomatch = (e) => {
	output.innerHTML = 'Color not recognised';
	inputTxt.value = 'Wrong';
}

recognition.onerror = (e) => {
	output.innerHTML = 'Error in recognition ' + e.error;
	inputTxt.value = 'Error';
}


function selectOptions() {
	voices = synth.getVoices();

	for(let i = 0 ; i < voices.length ; i++){
		var option = document.createElement('option');
		option.textContent = voices[i].name +  voices[i].lang;
  
		if(voices[i].default){
			option.textContent += ' -- DEFAULT';
		}

		option.setAttribute('data-lang' , voices[i].lang);
		option.setAttribute('data-name' , voices[i].name);
		voiceOptions.appendChild(option);
	}
}

if(speechSynthesis.onvoiceschanged !== undefined){
	speechSynthesis.onvoiceschanged = selectOptions;
}

inputform.onsubmit = (e) => {
	e.preventDefault();
	var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
	var selectedOption = voiceOptions.selectedOptions[0].getAttribute('data-name');
	for(let i =0 ; i < voices.length ; i++){
		if(voices[i].name === selectedOption){
			utterThis.voice = voices[i];
		}
	}

	utterThis.pitch = pitch.value;
	utterThis.rate = rate.value;
	synth.speak(utterThis);

}