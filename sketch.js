var apiKey = 'g6g5n3nfyle6tgh49ivmbt8nxawvdfcog87czmengftng8mxg';


// User Info

var user;
var setCategories = new Map();

//Page

var loaded = false;
var selectPage = "home";

//Category
var category = "basic";
var currentQuiz;



var searchLoading = false;
var load = 4;

var query = '';
var search;
var resultObj = [];
var previous = '';
var searchList;
var searchBtn;

var play = false;
//var quiz;
var basic;
var answers = [];
var answered = false;
var cor = false;
var nextSet = true;
var newWord = true;
var quizNum = 0;
var score = 0;
var userSubmit;

var favBtns;


var json
var basicCategory;





function preload(){
    basic = loadJSON("assets/json/basic.json"); 
}
function setup() {
    createCanvas(0, 0);
    

    search = select('#search');
    searchList = select('#search-list');
    
    searchBtn = select('#search-btn');
    searchBtn.mousePressed(function(){
        createSearchResults();
    });
    
    basicCategory = new Category(basic);
    console.log(basicCategory);
    
    
    
    setCategories.set(basicCategory.getCategoryName().toLowerCase(), basicCategory);
    
/**
 * Intializes a User when they log in
*/
    
    user = new User("guest", map);
    
    userSubmit = select('#userNameSubmit');
    userSubmit.mousePressed(function(){
        userInput = select('#userNamePrompt');
        if(userInput.value().trim() != ""){
            
            modal = select('#userNameModal');
            form = select("#userNameForm");
            modal.addClass('d-none');
            form.addClass('d-none');
            
            user = new User(userInput.value().trim(), setCategories);
            loaded = true;
            
            var landingPage = select('#landing-page');
            landingPage.addClass('d-none');
            var mainPage = select('#main-page');
            var bodyTag = select('body');
            mainPage.removeClass('d-none');
            bodyTag.style('background-color', '#f2f2fc');

            
            createHomePage();
        }else{
            smallText = select('#userPromptText');
            smallText.html("<u>Please enter a valid username</u>");
            smallText.removeClass('text-muted');
            smallText.addClass('text-wrong');
            smallText.addClass('text-uppercase');
            smallText.addClass('font-weight-bold');
        }
        
        
    });
    
    
    
    
   

    
    
}


function draw() {
    background("white");
    
    if(loaded){
        
            

        
        if(listening){
            speakBtn = select('#speak-btn');
            speakBtn.attribute('disabled', '');
            
            speakIcon = select('#speak-icon');
            speakIcon.addClass('d-none');
            speakSpinner = select('#speak-spinner');
            speakSpinner.removeClass('d-none');
            speakSpinner.addClass('d-flex');
        }
            
        var clearBtn = select('#clear-btn');
        if(search.value() == ''){
            
            clearBtn.addClass('d-none');
        }else{
            clearBtn.removeClass('d-none');
        }
        
        if(searchLoading){
            
            text = "...";
            
            loadText = select('#load-text');
            
            if(frameCount % 15 == 0){
                if(load >= text.length ){
                    load = 0;
                    loadText.html("");
                }else{
                    loadText.html(text[load],true);
                    load++;
                }
            } 
            
        }
        
        if(play){
            createQuiz(currentQuiz);
        }  
    }
}

/**
 * Pushes user information into the home page
*/

function createHomePage(){
    
    basicLevels = select("#basic-levels");
    basicProgress = select("#basic-progress");
    
    basicCat = user.getCategory('basic');
    basicLevels.html(basicCat.getLevelMastered()+' of '+basicCat.getLevelsLength());
    
    basicProgress.style('width', basicCat.getMasteredPer()+'%');
}


/* ACCOUNT  */

/**
 * Pushes user information into the account page
*/
function createAccount(){
    userNameBox = select("#user-name");
    userReviewsList = select("#user-reviews");
    userReviewsList.html("");
    userNameBox.html(user.getName());
    reviews = user.getReviews().keys();
    if(user.getReviews().size == 0){
         
        userReviewsList.html('<p class="h4 text-muted ml-3">No Reviews </p>');
    
    }else{
        

        for(word of reviews){
    //        userReviewsList.html('<li class="list-group-item mx-3">'+word.charAt(0).toUpperCase() + word.slice(1)+'</li>', true);
            userReviewsList.html('<div  class="col mb-4"><div class="card text-center h6"><div class="card-body">'+word.charAt(0).toUpperCase() + word.slice(1)+'</div></div></div>', true);
        }
    
    }
    
    userFavList = select("#user-fav");
    userFavList.html("");
    favs = user.getFavorites().keys();
    
    if(user.getFavorites().size == 0){
         
        userFavList.html('<p class="h4 text-muted ml-3"> No Words Added </p>');
    
    }else{

        for(word of favs){
    //        userReviewsList.html('<li class="list-group-item mx-3">'+word.charAt(0).toUpperCase() + word.slice(1)+'</li>', true);
            userFavList.html('<div  class="col mb-4"><div class="card text-center h6"><div class="card-body">'+word.charAt(0).toUpperCase() + word.slice(1)+'</div></div></div>', true);
        }
        
    }
    

}


/* CATEGORY  */

/**
 * Returns the category object in correspondece to the user selection
*/

function selectCategory(itemName){
    switch(itemName.toLowerCase()){
        case "basic":
            return basicCategory;
            break;
        default:
            return basicCategory;
            break;
    }
}


/**
 * Pushes user information into the category page
*/
function createCategoryPage(category){
    
    categoryName = select("#category-name");
    categoryLevels = select("#category-levels");
    
    categoryName.html(category.categoryName + " Words");
    categoryLevels.html("");
    
    var levels = category.getLevels();
    for(var i=0; i< levels.length; i++){
        var levelNum = i+1;
        categoryLevels.html('<div class="card my-3"><div class="card-body"><h3 class="card-title font-weight-bolder">Level '+ levelNum +'</h3><h6 class="card-subtitle mb-2 font-weight-light text-muted">'+levels[i].getMastered()+' of '+levels[i].getQuestionLength()+' words mastered</h6><div class="progress category-progress border border-dark"><div class="progress-bar bg-correct" role="progressbar" style="width:'+ levels[i].getMasteredPer() +'%; " aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div></div></div><div class=""><button onclick="displayQuiz(\''+category.categoryName+'\', \''+i+'\')" class="card-footer align-middle btn btn-blue w-100"><span class="align-middle h5\">Play</span></button></div></div></div>',true);
    }
}

/* QUIZ  */

/**
 * Creates Quiz Header
*/
function setQuizHeader(quiz){
    quizHeader = select("#quiz-header");
    var currCat = quiz.getCategory().toLowerCase();
    quizHeader.html('<p><a class="back-btn" onclick="displayCategory(\''+currCat+'\')" id="quiz-back"><i class="fas fa-arrow-alt-circle-left"></i></a> '+ quiz.getName()+'</p>');
}

/**
 * Creates and manages quiz using the given quiz object
*/
function createQuiz(quiz){
    quizBox = select("#quiz");
    quizResults = select("#quiz-results");
    
   
    questions = quiz.getQuestions();
    
    if(nextSet && cor){
            score++;  
            cor = false;
    }
    
    if(quizNum >= questions.length){

        quizBox.addClass("d-none");
        quizResults.removeClass("d-none");
        results = select('#quiz-score');
        results.html(" "+score+" / "+questions.length);
        
        resultsMessage = select("#results-message");
        mastered = quiz.getMastered();
        
        
        if(score >= questions.length){
            resultsMessage.html("Amazing! One step closer to being a Vocabulary Master!");
        }else if(score >= mastered){
            resultsMessage.html("Great Job! You're slowly improving, keep practicing!");
        }else{
            resultsMessage.html("Uh-oh! It's time to do some reviews!");
        }
        
        quiz.setMastered(score);
        user.getCategory(quiz.getCategory().toLowerCase()).setLevelMastered();
        
        
        
        playAgainBtn = select("#quiz-play-again");
        playAgainBtn.mousePressed(function() {
            score = 0;
            quizNum = 0;
            answered = false;
            answers = [];
            nextSet = true;
            cor = false;
            quizResults.addClass("d-none");
            quizBox.removeClass("d-none");
        });
        
    }else{

        setQuiz(questions[quizNum], quiz);    
    }
    

    
    
}

/**
 * Resets Quiz Elements
*/
function resetQuizPage(){
    
    quizBox = select("#quiz");
    quizResults = select("#quiz-results");
    score = 0;
    quizNum = 0;
    answered = false;
    answers = [];
    nextSet = true;
    cor = false;
    quizResults.addClass("d-none");
    quizBox.removeClass("d-none");
    play = false;
}


/**
 * Set Quiz question and answers
*/
function setQuiz(question, quiz){
    
    if(nextSet){
        answers = [];
        answers = quiz.getAnswers(question);
        nextSet = false;
        
        userReviews = user.getReviews();
        //If it has reviews had the word, it is not new
        newWord = !userReviews.has(question);
        
        
        quizWord = select("#quiz-word");
        quizWord.html(question.charAt(0).toUpperCase() + question.slice(1));
        
        reviewContainer = select('#quiz-title-container');
        reviewContainer.addClass('bg-light');
        reviewContainer.removeClass('bg-wrong');
        reviewContainer.removeClass('bg-correct');
        
        
        reviewStatus = select('#quiz-title-status');
        reviewStatus.addClass('text-muted');
       
        
        
        if(newWord){
            reviewStatus.html("New Word!");
            user.addNewWord(question, quiz.getName());
            
        }else{
         reviewStatus.html("Review!");
        }
        
        
        quizRadio = select('#quiz-radio');
        quizRadio.html('<div id= "quiz-radio" class= "quiz-answers pl-3 h5 font-weight-lighter"><div  class="form-check mb-3"><input id= "aBtn" class="form-check-input" name="answers"  type="radio" value="'+answers[0]+'" ><label id= "aLabel" class="form-check-label" >'+answers[0]+'</label></div><div  class="form-check mb-3"><input id= "bBtn" class="form-check-input " name="answers"  type="radio" value="'+answers[1]+'" ><label id= "bLabel" class="form-check-label " for="bBtn">'+answers[1]+'</label></div><div  class="form-check mb-3"><input id= "cBtn" class="form-check-input" name="answers"   type="radio" value="'+answers[2]+'" ><label id= "cLabel" class="form-check-label" for="cBtn">'+answers[2]+'</label></div><div  class="form-check mb-3"><input id= "dBtn" class="form-check-input" name="answers"  type="radio" value="'+answers[3]+'" ><label id= "dLabel" class="form-check-label" for="dBtn">'+answers[3]+'</label></div></div>');
             
    }

    
    setQuizBtns(answers, quiz.getCorrect(question));
    
    nextBtn = select('#quiz-next');
    if(answered){
        nextQuestion = quizNum + 1;
        nextBtn.removeClass("d-none");
        nextBtn.mousePressed(function() {
            resetQuizElements();
            
            quizNum = nextQuestion;
            nextBtn.addClass("d-none");
            
        });
    }
   
}

/**
 * Reset Quiz Elements
*/
function resetQuizElements(){
    answered = false;
    nextSet = true;
    
//    aBtn = select('#aBtn');
//    bBtn = select('#bBtn');
//    cBtn = select('#cBtn');
//    dBtn = select('#dBtn');
//    
//    aLabel = select('#aLabel');
//    bLabel = select('#bLabel');
//    cLabel = select('#cLabel');
//    dLabel = select('#dLabel');
//    
//    btns = [aBtn,bBtn,cBtn,dBtn];
//    labels = [aLabel,bLabel,cLabel,dLabel];
//    
//     btns.forEach(function(btn, index, arr){
//         btn.removeAttribute('disabled');
//         btn.removeAttribute('checked', '');
//         btn.checked = false;
//         btn.removeAttribute('selected');
//    });
//    
//    labels.forEach(function(label, index, arr){
//        label.removeClass('text-wrong');
//        label.removeClass('text-correct');
//    });
//    
    
    
}

/**
 * Set Quiz buttons and answers
*/
function setQuizBtns(answers, correct){
     //A
    aBtn = select('#aBtn');
  
     //B
    bBtn = select('#bBtn');
   
     //C
    cBtn = select('#cBtn');
 
     //D
    dBtn = select('#dBtn');

    if(!answered){
        
         aBtn.mousePressed(function() {
//            console.log(aBtn.value());
            checkAnswer(aBtn.value(), correct);
         });
        
         bBtn.mousePressed(function() {
//            console.log(bBtn.value());
            checkAnswer(bBtn.value(), correct);
        
         });
    
        cBtn.mousePressed(function() {
//            console.log(cBtn.value());
            checkAnswer(cBtn.value(), correct);
        
        });
        
        dBtn.mousePressed(function() {
//            console.log(dBtn.value());
            checkAnswer(dBtn.value(), correct);
        
        });
    }
}

/**
 * Checks if user answer is correct
*/
function checkAnswer(answer, correct){
    
    
    if(answers.includes(correct)){
        
    
    answered = true;
    // Answer Buttons
    aBtn = select('#aBtn');
    bBtn = select('#bBtn');
    cBtn = select('#cBtn');
    dBtn = select('#dBtn');
    
    aLabel = select('#aLabel');
    bLabel = select('#bLabel');
    cLabel = select('#cLabel');
    dLabel = select('#dLabel');
    
    btns = [aBtn,bBtn,cBtn,dBtn];
    labels = [aLabel,bLabel,cLabel,dLabel];
    
   
    var correctIndex = answers.findIndex(function(element, index, array){
        return element == correct;
    },correct);
    
//    console.log(answers);
//    console.log(correct);
    
    // Correct Label
//    console.log(correctIndex);
//    console.log(labels[correctIndex]);
    correctLabel = labels[correctIndex];
    correctLabel.addClass('text-correct');
    // Correct Button
    correctBtn = btns[correctIndex];
    correctBtn.attribute('checked', '');
        
        
    reviewContainer = select('#quiz-title-container');
    reviewStatus = select('#quiz-title-status');
    
    if(answer != correct){
        var ansIndex = answers.findIndex(function(element, index, array){
            return element == answer;
        },answer);
        ansLabel = labels[ansIndex];
        ansLabel.addClass('text-wrong');
        
        reviewStatus.removeClass('text-muted');
        reviewStatus.html("Incorrect!");
        reviewContainer.removeClass('bg-light');
        reviewContainer.addClass('bg-wrong');
    }else{
        reviewStatus.removeClass('text-muted');
        reviewStatus.html("Correct!");
        reviewContainer.removeClass('bg-light');
        reviewContainer.addClass('bg-correct');
        cor = true;
    }
    
    for(var btn of btns){
        if((btn.value() != correct) && (btn.value() != answer))
            {
                btn.attribute('disabled', '');
            }
    }
        
    }
}


/* SEARCH  */

/**
 * Gets search results based on recognition query given
*/
function recognitionResults(){
    speakBtn = select('#speak-btn');
    speakBtn.removeAttribute('disabled');
            
    speakIcon = select('#speak-icon');
    speakIcon.removeClass('d-none');
    speakSpinner = select('#speak-spinner');
    speakSpinner.removeClass('d-flex');
    speakSpinner.addClass('d-none');
            
    
    createSearchResults();
}

/**
 * Reset Search Page Elemets
*/
function resetSearchPage(){
    
    search.html("");
    search.value("");
    searchList.html("");
    searchList.html("<li class=\"list-group-item px-5 mx-5 h4 text-muted text-center\">No Results</li>");
    previous = "";
}

/**
 * Uses given query to get search results and then displays them 
 * on the search page
*/
async function createSearchResults(){
    
    query = search.value();
    if(query != previous){
        previous = query;
        console.log(query);
        query.trim();
        
        
        if(query != ""){
           try{
               searchList.html("");
               searchSpinner = select('#search-spinner');
               searchLoading = true;
               searchSpinner.removeClass('d-none');
               
               searchResults = await getSearch();
               words = searchResults.map(function(elem) {return elem.word});
               
               resultObj = await getDefinition(words);
               
               exampleObj = await getExample(words);
               
               searchSpinner.addClass('d-none');
               searchLoading = false;
               
               
               if(resultObj.length > 0){
                   for (results of resultObj){
                       
                       var word = results.word;
                       var example = exampleObj.get(word.toLowerCase());
                       if(word.length > 1){
                           word = word.charAt(0).toUpperCase() + word.slice(1);
                       }else{
                           word = word.toUpperCase();
                       }
                       
                       if(results.definitions.length > 0){
                           
                           var def = results.definitions[0].definition;
                           def = def.charAt(0).toUpperCase() + def.slice(1);
                           
                       }else{
                           
                           def = "No definition found";
                       }
                       
                       if(user.checkFavorite(word.toLowerCase())){
                           
                            searchList.html(' <div class="card mx-5 mb-3"><h5 class="card-header bg-purple">'+word+'</h5><div class="card-body"><div class="ml-3"><div class="row justify-content-between"><h5 class="ml-3 card-title text-muted">Definition</h5><div class="mr-3" ><button id="fav-'+word.toLowerCase()+'"  onclick="removeFavorite(\'fav-'+word.toLowerCase()+'\',\''+word.toLowerCase()+'\')" class="btn text-right btn-fav align-self-end px-3"><span class="h3"><i class="far fa-heart"></i></span></button></div></div><p class="card-text">'+def+'</p><h5 class="card-title text-muted">Example</h5><p class="card-text">'+example+'</p></div></div></div>',true);
                           
                           
                       }else{
                           
                            searchList.html(' <div class="card mx-5 mb-3"><h5 class="card-header bg-purple">'+word+'</h5><div class="card-body"><div class="ml-3"><div class="row justify-content-between"><h5 class="ml-3 card-title text-muted">Definition</h5><div class="mr-3" ><button id="fav-'+word.toLowerCase()+'"  onclick="addFavorite(\'fav-'+word.toLowerCase()+'\',\''+word.toLowerCase()+'\')" class="btn text-right btn-blue align-self-end px-3"><span class="h3"><i class="far fa-heart"></i></span></button></div></div><p class="card-text">'+def+'</p><h5 class="card-title text-muted">Example</h5><p class="card-text">'+example+'</p></div></div></div>',true);
                       }
                       
                      
                       
                   }
               
               }else{
                   
                   searchList.html("<li class=\"list-group-item px-5 mx-5 h4 text-muted text-center\">No Results</li>");
               }
               
               
           }catch(err){
               console.error(err);
           }
            
            

            
        }else{
            searchList.html("");
            searchList.html("<li class=\"list-group-item px-5 mx-5 h4 text-muted text-center\">No Results</li>");
        }
        
    }
    
    
    

    


}

/**
 * Returns an array of word results with the given query
*/
async function getSearch(){ 
    
    try{
        let searchPromise = await fetch( "https://api.datamuse.com/words?sp="+query+"*&max=20");
        let results = await searchPromise.json();
        return await results;

    }catch(err){
        console.error(err);
    }
   
}

/**
 * Returns an array of definitions for the given word
 *
 * Because of the use of two differnt APIs, the search results shown to the user
 * are determined by the definition results since some word found in the Datamuse API
 * will not be found in the Words API
 *
 *
*/
async function getDefinition(words){
    var results = [];
    try{
        
        defRequests = words.map(word => fetch("https://wordsapiv1.p.rapidapi.com/words/"+word+"/definitions", {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "d3cb972d01msh9751e2ffd34399bp1d6162jsne3a1d8854f85",
                "x-rapidapi-host": "wordsapiv1.p.rapidapi.com"
            }
        })
                               );
        
        let defResponses = await Promise.all(defRequests);
        defResults = await Promise.all(defResponses.map(result => result.json()));
        defResults.forEach(function(data){
            
            var keys= Object.keys(data);
            if(keys[0] == "word")
            {
                results.push(data);
            }
            
        });
        
        return results;

    }catch(err){
        console.error(err);
    }
   
   

    

}

/**
 * Returns a map of examples based on the given words
*/
async function getExample(words){
    
    var results = new Map();
     try{
        
        examRequests = words.map(word => fetch("https://wordsapiv1.p.rapidapi.com/words/"+word+"/examples", {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "d3cb972d01msh9751e2ffd34399bp1d6162jsne3a1d8854f85",
                "x-rapidapi-host": "wordsapiv1.p.rapidapi.com"
            }
        })
                               );
        
        let examResponses = await Promise.all(examRequests);
        examResults = await Promise.all(examResponses.map(result => result.json()));
        examResults.forEach(function(data){
            var keys= Object.keys(data);
            if(keys[0] == "word")
            {
                if(typeof data.examples[0] === 'undefined' ){
                    results.set(data.word, "No example avaliable" );
                }else{
                    results.set(data.word, data.examples[0].charAt(0).toUpperCase() + data.examples[0].slice(1) );
                }
            }
            
        });
        
        return results;
        
    }catch(err){
        console.error(err);
    }
    
}

/**
 * Calls search results function when user enters a query and 
 * presses ENTER
*/

function keyPressed() {
  if (keyCode === ENTER) {
    if(search.value() != ''){
        createSearchResults();
    }
  }
}


class Word{
    constructor(data){
        this.word = "";
        this.definition = "";
        this.examples = [];
    }
    
    getWord(){
        
    }
    
    getDefinition(){
        
    }
    
    getExamples(){
        
    }
}





