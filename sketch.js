var apiKey = 'g6g5n3nfyle6tgh49ivmbt8nxawvdfcog87czmengftng8mxg';


// User Info

var user;


//Page

var loaded = false;
var selectPage = "home";

//Category
var category = "basic";
var currentQuiz;



var searchLoaded;

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


var accountNav;
var searchNav;
var quizNav;
var homeNav;

var accountPage;
var searchPage;
var quizPage;
var homePage;
var categoryPage;

var favBtns;


var json
var basicCategory;





function preload(){
    basic = loadJSON("assets/basic.json");
    
    
    
}
function setup() {
    createCanvas(0, 0);
    
    homePage = select('#home-page');
    homeNav = select('#home-nav');
    
    accountPage = select('#account-page');
    accountNav = select('#account-nav');
   
    searchPage = select('#search-page');
    searchNav = select('#search-nav');
    
    
    
    quizPage = select('#quiz-page');
    quizNav = select('#play-nav');
    
    categoryPage = select('#category-page');
   
    
  
//    
//    searchNav.mousePressed(function(){
//         searchPage.removeClass("d-none");
//        quizPage.addClass("d-none");
//        accountPage.addClass("d-none");
//        homePage.addClass("d-none");
//    });
//    
//     quizNav.mousePressed(function(){
//        searchPage.addClass("d-none");
//        quizPage.addClass("d-none");
//        accountPage.addClass("d-none");
//        homePage.removeClass("d-none");
//     });
//    
    search = select('#search');
    searchList = select('#search-list');
    
    searchBtn = select('#search-btn');
    searchBtn.mousePressed(function(){
        createSearchResults();
    });
    
    
    user = new User("guest")
    
    userSubmit = select('#userNameSubmit');
    userSubmit.mousePressed(function(){
        userInput = select('#userNamePrompt');
        if(userInput.value().trim() != ""){
            
            modal = select('#userNameModal');
            form = select("#userNameForm");
            modal.addClass('d-none');
            form.addClass('d-none');
            
            user = new User(userInput.value().trim());
            loaded = true;
        }else{
            smallText = select('#userPromptText');
            smallText.html("<u>Please enter a valid username</u>");
            smallText.removeClass('text-muted');
            smallText.addClass('text-wrong');
            smallText.addClass('text-uppercase');
            smallText.addClass('font-weight-bold');
        }
        
        
    });
    
    basicCategory = new Category(basic);
    console.log(basicCategory);
//    quiz = new Quiz(basic.levels[0], basic.category);
//    console.log(basic);
    
    
}


function draw() {
    background("white");
    
    if(loaded){
        
            createHomePage();
            createAccount();
            
            
        if(play){
            createQuiz(currentQuiz);
        }
            
        
//        switch(selectPage){
//            case "home":
//                createHomePage();
//               
//                createAccount();
//                createSearchPage();
//                break;
//            case "category":
//                break;
//                
//            case "quiz":
//                 
//                break;
//            default:
//                createHomePage();
//                break;
//                
//        }
        
    }
    
    
           
    
}


function createHomePage(){
    
}


/* ACCOUNT  */

function createAccount(){
    userNameBox = select("#user-name");
    userReviewsList = select("#user-reviews");
    userReviewsList.html("");
    userNameBox.html(user.getName());
    reviews = user.getReviews().keys();
    for(word of reviews){
        userReviewsList.html("<li class=\"list-group-item\">"+word.charAt(0).toUpperCase() + word.slice(1)+"</li>", true);
    }
    

}


/* CATEGORY  */

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

function createCategoryPage(category){
    
    categoryName = select("#category-name");
    categoryLevels = select("#category-levels");
    
    categoryName.html(category.categoryName + " Words");
    categoryLevels.html("");
    
    var levels = category.levels;
    for(var i=0; i< levels.length; i++){
        categoryLevels.html("<div class=\"card\"><div class=\"card-body\"><h3 class=\"card-title font-weight-bolder\">Level 1</h3><h6 class=\"card-subtitle mb-2 font-weight-light text-muted \">"+levels[i].getMastered()+" of 10 words mastered</h6><div class=\"progress category-progress border border-dark\"><div class=\"progress-bar bg-correct\" role=\"progressbar\" style=\"width:"+ levels[i].getMasteredPer() +"%; \" aria-valuenow=\"25\" aria-valuemin=\"0\" aria-valuemax=\"100\"></div></div></div><div class=\"\"><button onclick=\"displayQuiz(\'"+category.categoryName+"\', \'"+i+"\')\" class=\"card-footer align-middle btn btn-blue w-100\"><span class=\"align-middle h5\">Play</span></button></div></div></div>",true)
    }
}

/* QUIZ  */

function createQuiz(quiz){
    quizBox = select("#quiz");
    quizResults = select("#quiz-results");
    
    quizHeader = select("#quiz-header");
    quizHeader.html("<p>"+ quiz.getName()+"</p>");
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

async function createSearchResults(){
    query = search.value();
    if(query != previous){
        previous = query;
        console.log(query);
        query.trim();
        
        
        if(query != ""){
           try{
               searchResults = await getSearch();
               words = searchResults.map(function(elem) {return elem.word});
               console.log(words);
               
               resultObj = await getDefinition(words);
               console.log(resultObj);
               
               exampleObj = await getExample(words);
               console.log(exampleObj);
               
               searchList.html("");
               
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
                       
                       searchList.html(' <div class="card mx-5 mb-3"><h5 class="card-header bg-purple">'+word+'</h5><div class="card-body"><div class="ml-3"><div class="row justify-content-between"><h5 class="ml-3 card-title text-muted">Definition</h5><div class="mr-3" ><button id="fav-'+word+'" value="'+word+'" class="btn favBtn text-right btn-blue align-self-end px-5"><span class="h5">Favorite</span></button></div></div><p class="card-text">'+def+'</p><h5 class="card-title text-muted">Example</h5><p class="card-text">'+example+'</p></div></div></div>',true);
                       
                       displaySearchResults(searchList);
                   
                   }
               
               }else{
                   
                   searchList.html("<li class=\"list-group-item px-5 mx-5\">No Results</li>");
               }
               
               
           }catch(err){
               console.error(err);
           }
            
//            words = searchResults.map(function(elem) {return elem.word});
            

            
        }
        
    }
    
    
    

    


}

async function getSearch(){ 
    
    try{
        let searchPromise = await fetch( "https://api.datamuse.com/words?sp="+query+"*&max=20");
        let results = await searchPromise.json();
        return await results;
//        getData(results);
        
    }catch(err){
        console.error(err);
    }
   
}

async function getDefinition(words){
    results = [];
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


async function getExample(words){
    
    results = new Map();
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


//function getDefinition(){
    
    
    
    
//    var defData;
//    word = word.toLowerCase();
//    fetch("https://wordsapiv1.p.rapidapi.com/words/"+word+"/definitions", {
//	"method": "GET",
//	"headers": {
//		"x-rapidapi-key": "d3cb972d01msh9751e2ffd34399bp1d6162jsne3a1d8854f85",
//		"x-rapidapi-host": "wordsapiv1.p.rapidapi.com"
//	}
//})
//.then(response => response.json())
//.then(data => {
//        getDefData(data);
//    })
//.catch(err => {
//	console.error(err);
//});
  
//}


//function getExample(word){
//    
//    var exampleData;
//    word = word.toLowerCase();
//    fetch("https://wordsapiv1.p.rapidapi.com/words/"+word+"/examples", {
//	"method": "GET",
//	"headers": {
//		"x-rapidapi-key": "d3cb972d01msh9751e2ffd34399bp1d6162jsne3a1d8854f85",
//		"x-rapidapi-host": "wordsapiv1.p.rapidapi.com"
//	}
//})
//.then(response => response.json())
//.then(data => {
//        getExampleData(data);
//    })
//.catch(err => {
//	console.error(err);
//});
//}


//function getDefinition(data){
//    var keys= Object.keys(data);
//    if(keys[0] == "word")
//    {
//       resultObj.push(data);
//    }
//}


//function getExample(data){
//    
//    console.log(data);
//    var keys= Object.keys(data);
//    if(keys[0] == "word")
//    {
//        
//        if(typeof data.examples[0] === 'undefined' ){
//            exampleObj.set(data.word, "No example avaliable" );
//        }else{
//            exampleObj.set(data.word, data.examples[0].charAt(0).toUpperCase() + data.examples[0].slice(1) );
//        }
//    }
//}


function favClick(btn){
    console.log(btn);
    console.log(value());
    console.log("I was clicked");
}

function getQuiz(){
    
    console.log(json.category);
    return json;
}



class Category{
    constructor(data){
        this.categoryName = data.category;
        this.levels = [];
        this.levelMastered = 0;
        this.complete = false;
        for(var i=0; i< data.levels.length;i++){
            this.levels.push(new Quiz(data.levels[i], data.category));
        
        }

    }
    
    
    getQuiz(index){
        return this.levels[index];
    }
}

class Quiz{
    constructor(data, category){
        this.quizName = category+" Level "+data.level;
        this.questions = [];
        this.correct = new Map();
        this.answerList = new Map();
        this.defintion = new Map();
        this.example = new Map();
        this.mastered = 0;
        this.complete = false;
        for(var item of data.questions){
            this.questions.push(item.word);
            this.correct.set(item.word, item.correct_answer);
            this.answerList.set(item.word, item.wrong_answers);
            this.defintion.set(item.word, item.definition);
            this.example.set(item.word, item.example);
        }
    }
    
    getName(){
        return this.quizName;
    }
    
    getName(){
        return this.quizName;
    }
    getCorrect(key){
        return this.correct.get(key);
    }
    
    getAnswers(key){
        var ans = [];
        ans.push(this.getCorrect(key));
        ans = ans.concat(this.answerList.get(key));
        shuffle(ans, true);
        return ans;
    }
    
    getQuestions(){
         return this.questions;
    }
    
    getDefinition(key){
        
    }
    
    getExample(key){
        
    }
    
    setMastered(score){
        this.mastered = score;
    }
    
    getMastered(){
        return this.mastered;
    }
    
    getMasteredPer(){
        return (this.mastered/this.questions.length)*100;
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


class User{
    constructor(name){
        this.name = name;
        this.review = new Map();
        this.fav = new Map();
    }
    
    
    getName(){
        return this.name;
    }
    
    checkFav(word){
        return this.fav.has(word);
    }
    
    addFav(word){
        this.fav.set(word,word);
    }
    
    
    
    getReviews(){
        return this.review;
    }
    
    addNewWord(key, wordlist){
        
        this.review.set(key, wordlist);
        
    }
}



