class User{
    constructor(name, map){
        this.name = name;
        this.review = new Map();
        this.favorite = new Set();
        this.categories = map;
    }
    
    
    getName(){
        return this.name;
    }
    
    checkFavorite(word){
        return this.favorite.has(word);
    }
    
    addFavorite(word){
        this.favorite.add(word);
    }
    
    removeFavorite(word){
        this.favorite.delete(word);
    }
    
    getFavorites(){
        return this.favorite;
    }

    getReviews(){
        return this.review;
    }
    
    addNewWord(key, wordlist){
        
        this.review.set(key, wordlist);
        
    }
    
    checkCategory(name){
        return this.categories.has(name);
    }
    
    addCategory(category){
        this.categories.set(category.getCategoryName().toLowerCase(), category);
    }
    
    getCategory(name){
        return this.categories.get(name);
    }
}
