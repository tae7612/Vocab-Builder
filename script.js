var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent


var recognition = new SpeechRecognition();


document.getElementById("speak").onclick = function() {
  recognition.start();
  console.log('Ready to receive word.');
}


recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The first [0] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The second [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object
    var word = event.results[0][0].transcript;
    console.log('Result received: ' +word);
   document.getElementById("search").value = word;

  console.log('Confidence: ' + event.results[0][0].confidence);
}


recognition.onspeechend = function() {
  recognition.stop();
}


function hidePages(){
    var pages = document.getElementsByClassName("page");
    Array.from(pages).forEach(element => element.classList.add("d-none"));
}

function displayHomePage(){
    hidePages();
    document.getElementById("home-page").classList.remove("d-none");
}



function displayCategory(itemName){
    hidePages();
    document.getElementById("category-page").classList.remove("d-none");
    
    item = selectCategory(itemName);
  
    createCategoryPage(item);
         

    
    
}


function displayQuiz(itemName, index){
    
    hidePages();
    document.getElementById("quiz-page").classList.remove("d-none");

    item = selectCategory(itemName);
    
    currentQuiz = item.levels[index];
    play = true;
}





function displaySearchResults(item){
    console.log(searchList);
}


function displaySearchPage(){
    hidePages();
    document.getElementById("search-page").classList.remove("d-none");
}

