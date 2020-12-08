class Quiz{
    constructor(data, category){
        this.quizName = category+" Level "+data.level;
        this.category = category;
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
    
    getCategory(){
        return this.category;
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
    
    getQuestionLength(){
        return this.questions.length;
    }
    
    getDefinition(key){
        
    }
    
    getExample(key){
        
    }
    
    setMastered(score){
        this.mastered = score;
        this.setComplete();
    }
    
    getMastered(){
        return this.mastered;
    }
    
    getMasteredPer(){
        return (this.mastered/this.questions.length)*100;
    }
    
    getComplete(){
        return this.complete;
    }
    
    setComplete(){
        if(this.mastered >= this.questions.length){
            this.complete = true;
        }
    }
     
}