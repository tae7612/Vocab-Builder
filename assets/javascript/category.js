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
    
    getLevels(){
        return this.levels;
    }
    
    getLevelsLength(){
        return this.levels.length;
    }
    
    getLevelMastered(){
        return this.levelMastered;
    }
    
    setLevelMastered(){
        var master = this.levels.filter(item => item.getComplete());
        this.levelMastered = master.length;
    }
    
    getMasteredPer(){
        return (this.levelMastered/this.levels.length)*100;
    }
    
    getCategoryName(){
        return this.categoryName;
    }
    
    
    
}