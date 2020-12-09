var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent


var recognition = new SpeechRecognition();

// Use to determine when speechrecognition is listening for a word
var listening = false;
var listenLoaded = false;
var cat ="";

// Button for Seach bar speech-to-text button
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

/**
 * Sets the display of all the elements with the page class to none
 */
function hidePages(){
    var pages = document.getElementsByClassName("page");
    Array.from(pages).forEach(element => element.classList.add("d-none"));
}


/**
 * Displays the home-page block
 */
function displayHomePage(){
    hidePages();
    checkQuiz();
    document.getElementById("home-page").classList.remove("d-none");
    
    createHomePage();
}


/**
 * Displays the category-page block
 */
function displayCategory(itemName){
    
    hidePages();
    checkQuiz();
    document.getElementById("category-page").classList.remove("d-none");
    selectItem = user.getCategory(itemName);
    createCategoryPage(selectItem);

}


/**
 * Displays the home-page block
 */
function displayQuiz(itemName, index){
    
    hidePages();
    document.getElementById("quiz-page").classList.remove("d-none");

    item = selectCategory(itemName);
    
    currentQuiz = item.levels[index];
    setQuizHeader(currentQuiz);
    play = true;
}

/**
 * Check to see if there is a quiz in progress
 */
function checkQuiz(){
    if(play){
        resetQuizPage();
    }
}

/**
 * Displays account-page block
 */
function displayAccountPage(){
    hidePages();
    checkQuiz();
    document.getElementById("account-page").classList.remove("d-none");
    
    createAccount();
    
}


function displaySearchResults(item){
//    console.log(searchList);
}

/**
 * Clears the search page of previous results
 */
function clearSearchPage(){
    resetSearchPage();
}

/**
 * Displays the search-page block
 */

function displaySearchPage(){
    hidePages();
    checkQuiz();
    resetSearchPage();
    document.getElementById("search-page").classList.remove("d-none");
}

/**
 * Add the word favorite to the users collection
 * Changes the button CSS and onclick function 
 */
function addFavorite(id, word){
    
    user.addFavorite(word);
    var favBtn = document.getElementById(id);
    
    favBtn.innerHTML = '<span class="h3"><i class="fas fa-heart"></i></span>';
    favBtn.onclick = function(){removeFavorite(id,word);};
    favBtn.classList.remove('btn-blue');
    favBtn.classList.add('btn-fav');
}



/**
 * Remove the word favorite to the users collection
 * Changes the button CSS and onclick function 
 */
function removeFavorite(id, word){
    console.log("Remove!!");
    user.removeFavorite(word);
    
    var favBtn = document.getElementById(id);
    console.log(id);
    favBtn.innerHTML = '<span class="h3"><i class="far fa-heart"></i></span>';
    favBtn.onclick = function(){addFavorite(id,word);};
    favBtn.classList.add('btn-blue');
    favBtn.classList.remove('btn-fav');
}
