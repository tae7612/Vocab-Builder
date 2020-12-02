var user;


var query = '';
var search;
var resultObj = []
var searchResults = [];
var previous = '';
var searchList;

var play = false;
var quiz;
var q;
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

var accountPage;
var searchPage;
var quizPage;

var json



function preload(){
    q = loadJSON("assets/basic.json");
    console.log(q);
    
    
}
function setup() {
    createCanvas(0, 0);
    
    accountPage = select('#account-page');
    accountNav = select('#account-nav');
   
    searchPage = select('#search-page');
    searchNav = select('#search-nav');
    
    
    
    quizPage = select('#quiz-page');
    quizNav = select('#play-nav');
   
    
     accountNav.mousePressed(function(){
        searchPage.addClass("d-none");
        quizPage.addClass("d-none");
        accountPage.removeClass("d-none");
    });
    
    searchNav.mousePressed(function(){
         searchPage.removeClass("d-none");
        quizPage.addClass("d-none");
        accountPage.addClass("d-none");
    });
    
     quizNav.mousePressed(function(){
        searchPage.addClass("d-none");
        quizPage.removeClass("d-none");
        accountPage.addClass("d-none");
     });
    
    search = select('#search');
    searchList = select('#search-list');
    
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
            play = true;
        }else{
            smallText = select('#userPromptText');
            smallText.html("<u>Please enter a valid username</u>");
            smallText.removeClass('text-muted');
            smallText.addClass('text-wrong');
            smallText.addClass('text-uppercase');
            smallText.addClass('font-weight-bold');
        }
        
        
    });
    
    
    quiz = new Quiz(q.levels[0], q.category);
    
    
}


function draw() {
    background("white");
    
    if(play){
        createQuiz();
        createAccount();
        createSearchPage();
    }
    
    
           
    
}


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

function createQuiz(){
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
            console.log(user);
            quizBox.addClass("d-none");
            quizResults.removeClass("d-none");
            results = select('#quiz-score');
            results.html(" "+score+" / "+questions.length);
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
        
        
        
        setQuiz(questions[quizNum]);    
    }
    

    
    
}

function setQuiz(question){
    
    if(nextSet){
        answers = [];
        answers = quiz.getAnswers(question);
        nextSet = false;
        
        userReviews = user.getReviews();
        //If it has reviews had the word, it is not new
        newWord = !userReviews.has(question);
        console.log(newWord)
        console.log(user);
        if(newWord){
            user.addNewWord(question, quiz.getName());
            
        }
             
    }
//    console.log(quizNum);
//    console.log(question);
    
    
    reviewStatus = select('#quiz-title-status');
//    console.log(reviewStatus.html());
     if(newWord){
         reviewStatus.html("New Word!");
     }else{
         reviewStatus.html("Review!");
     }
        
    
//    
    
    
    
    nextBtn = select('#quiz-next');
    quizWord = select("#quiz-word");
    quizWord.html(question.charAt(0).toUpperCase() + question.slice(1));
    if(answered){
        nextQuestion = quizNum + 1;
        nextBtn.removeClass("d-none");
        nextBtn.mousePressed(function() {
            resetQuizElements();
            
            quizNum = nextQuestion;
            nextBtn.addClass("d-none");
            
        });
    }
    
    setQuizBtns(answers, quiz.getCorrect(question));
   
}

function resetQuizElements(){
    answered = false;
    nextSet = true;
    
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
    
     btns.forEach(function(btn, index, arr){
         btn.removeAttribute('disabled');
         btn.removeAttribute('checked', '');
         btn.checked = false;
         btn.removeAttribute('selected');
    });
    
    labels.forEach(function(label, index, arr){
        label.removeClass('text-wrong');
        label.removeClass('text-correct');
    });
    
    
    
}

function setQuizBtns(answers, correct){
     //A
    aBtn = select('#aBtn');
    aBtn.value(answers[0])
    aLabel = select('#aLabel');
    aLabel.html(answers[0]);
   
    
    
     //B
    bBtn = select('#bBtn');
    bBtn.value(answers[1])
    bLabel = select('#bLabel');
    bLabel.html(answers[1]);
   
    
     //C
    cBtn = select('#cBtn');
    cBtn.value(answers[2])
    cLabel = select('#cLabel');
    cLabel.html(answers[2]);
    
    
    
     //D
    dBtn = select('#dBtn');
    dBtn.value(answers[3])
    dLabel = select('#dLabel');
    dLabel.html(answers[3]);
   
    
    
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
    
    if(answer != correct){
        var ansIndex = answers.findIndex(function(element, index, array){
            return element == answer;
        },answer);
        ansLabel = labels[ansIndex];
        ansLabel.addClass('text-wrong');
    }else{
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





function createSearchPage(){
    query = search.value();
    if(query != previous){
        previous = query;
        console.log(query);
        if(query == ""){
            searchResults = [];
            resultObj = [];
            
        }else{
            getSearch();

            
        }
        
    }
    searchList.html("");
    if(resultObj.length > 0){
        for (results of resultObj){
            var word = results.word;
            
            if(word.length > 1){
                word = word.charAt(0).toUpperCase() + word.slice(1);
            }else{
                word = word.toUpperCase();
            }
            if(results.definitions.length > 0){
                 var def = results.definitions[0].definition;
                def = def.charAt(0).toUpperCase() + def.slice(1);
            }
            else{
                def = "No definition found";
            }
           
            searchList.html("<li class=\"list-group-item result-card px-5 mx-5\" \"><div class=\"card\"><div class=\"card-body\"><h5 class=\"card-title\">"+word+"</h5><h6 class=\"card-subtitle mb-2 text-muted\">Definition</h6><p class=\"card-text\">"+def+"</p></div></div></li> ",true)

        }
        
       
    }else{

        searchList.html("<li class=\"list-group-item px-5 mx-5\">No Results</li>");

    }
}


function getSearch()
{    
    fetch( "https://api.datamuse.com/words?sp="+query+"*&max=30")
        .then(response => response.json())
        .then(data => getData(data))
        .catch(err => {
	       console.error(err);
    });
    
}

function getData(results){
    searchResults = results;
    resultObj = [];
   
    for(var i=0; i < searchResults.length; i++){
        getDefinition(searchResults[i].word);
    }

}


function getDefinition(word){
    var defData;
    word = word.toLowerCase();
    fetch("https://wordsapiv1.p.rapidapi.com/words/"+word+"/definitions", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "d3cb972d01msh9751e2ffd34399bp1d6162jsne3a1d8854f85",
		"x-rapidapi-host": "wordsapiv1.p.rapidapi.com"
	}
})
.then(response => response.json())
.then(data => {
        getDefData(data);
    })
.catch(err => {
	console.error(err);
});
  
}


function getDefData(data){
    
    var keys= Object.keys(data);
    if(keys[0] == "word")
    {
       resultObj.push(data);
    }
}

function getQuiz(){
    
    console.log(json.category);
    return json;
}


class Quiz{
    constructor(data, category){
        this.quizName = category+" Level "+data.level;
        this.questions = [];
        this.correct = new Map();
        this.answerList = new Map();
        this.defintion = new Map();
        this.example = new Map();
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
    
    
    getReviews(){
        return this.review;
    }
    
    addNewWord(key, wordlist){
        
        this.review.set(key, wordlist);
        
    }
}



