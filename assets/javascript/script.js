var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent


var recognition = new SpeechRecognition();
var listening = false;
var listenLoaded = false;
var cat ="";
document.getElementById("speak-btn").onclick = function() {
    recognition.start();
    listening = true;
    document.getElementById('speak-btn').disabled = listening;
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
    
    
    document.getElementById('speak-btn').disabled = listening;
    
    var word = event.results[0][0].transcript;
    document.getElementById("search").value = word;
    listening = false;
    listenLoaded = true;
    recognitionResults();
    
    

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
    checkQuiz();
    document.getElementById("home-page").classList.remove("d-none");
    
    createHomePage();
}



function displayCategory(itemName){
    hidePages();
    checkQuiz();
    document.getElementById("category-page").classList.remove("d-none");
    selectItem = user.getCategory(itemName);
    createCategoryPage(selectItem);

}



function displayQuiz(itemName, index){
    
    hidePages();
    document.getElementById("quiz-page").classList.remove("d-none");

    item = selectCategory(itemName);
    
    currentQuiz = item.levels[index];
    setQuizHeader(currentQuiz);
    play = true;
}


function checkQuiz(){
    if(play){
        resetQuizPage();
    }
}


function displayAccountPage(){
    hidePages();
    checkQuiz();
    document.getElementById("account-page").classList.remove("d-none");
    
    createAccount();
    
}


function displaySearchResults(item){
//    console.log(searchList);
}


function clearSearchPage(){
    resetSearchPage();
}

function displaySearchPage(){
    hidePages();
    checkQuiz();
    resetSearchPage();
    document.getElementById("search-page").classList.remove("d-none");
}


function addFavorite(id, word){
    
    user.addFavorite(word);
    var favBtn = document.getElementById(id);
    
    favBtn.innerHTML = '<span class="h3"><i class="fas fa-heart"></i></span>';
    favBtn.onclick = function(id,word){removeFavorite(id,word);};
    favBtn.classList.remove('btn-blue');
    favBtn.classList.add('btn-fav');
}


function removeFavorite(id, word){
    console.log("Remove!!");
    user.removeFavorite(word);
    var favBtn = document.getElementById(id);
    
    favBtn.innerHTML = '<span class="h3"><i class="far fa-heart"></i></span>';
    favBtn.onclick = function(id,word){addFavorite(id,word);};
    favBtn.classList.add('btn-blue');
    favBtn.classList.remove('btn-fav');
}
