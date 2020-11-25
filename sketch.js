var query = '';
var search;
var resultObj = []
var searchResults = [];
var previous = '';
var searchList;

function setup() {
    createCanvas(0, 0);
    search = select('#search');
    searchList = select('#search-list');

}

function draw() {
    background("white");
    
    query = search.value();
    if(query != previous){
        previous = query;
        console.log(query);
        console.log(resultObj.length);
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
    fetch("https://wordsapiv1.p.rapidapi.com/words/?letterPattern=%5E"+query+".&limit=20&frequencymin=6.98", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "d3cb972d01msh9751e2ffd34399bp1d6162jsne3a1d8854f85",
		"x-rapidapi-host": "wordsapiv1.p.rapidapi.com"
	}
})
    
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



