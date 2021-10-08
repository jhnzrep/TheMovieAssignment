const API_KEY = "b979bc0a8d45349598de78a6a3db3de6";
const IMG_URL = 'https://image.tmdb.org/t/p/w500/';

$(document).ready(() =>{
    $('#searchbtn').click(() =>{
        switch ($('input[name=selectpersonmovie]:checked', '#radio').val()) {
            case 'Person':
                searchByPerson();
                break;
            default:
                if($('#yearbox').is(':checked')){
                    searchByMovieYear();
                    break;
                }
                searchByMovie();
                break;
        };
    });
});
/*----------------Click events----------------*/
$(document).on('click', '.movie', event => {
    let id = event.currentTarget.id;
    console.log('clicking'); 
    console.log(id);
    getmoviedetails(id);
});

$(document).on('click', '.person', event =>{
    let id = event.currentTarget.id;
    console.log('clicking'); 
    console.log(id);
    getpersondetails(id);
});


$(document).on('click', '#closebtn', (() =>{
    $('#moviemodal').css('display', 'none')
}));

/*----------------Get detail functions----------------*/
getmoviedetails = id =>{
    var url = 'https://api.themoviedb.org/3/movie/' + id + '?api_key=' + API_KEY;

    $.get(url, (movie) =>{
        var genres = '', producers = '';
        movie.genres.forEach(genre => {
            genres += genre.name + ' '
        });
        movie.production_companies.forEach(producer => {
            producers += '<p>' + producer.name + '</p>'
        });
        let htmltext = '<span class="close" id="closebtn">&times;</span><p><b>Title:</b> ' + movie.title + '</p><p><b>Released:</b> ' + movie.release_date + '</p><p><b>Language:</b> ' + movie.original_language + '</p><p><b>Runtime:</b> ' + movie.runtime+ ' minutes</p><p><b>Movie homepage:</b> ' + movie.homepage + '</p><p><b>Genres:</b> ' + genres + '</p><p><b>Production companies:</b> ' + producers + '</p>';
        $('.modal-content').empty().append(htmltext);
    });

    url = 'https://api.themoviedb.org/3/movie/' + id + '/credits?api_key=' + API_KEY;
    $.get(url, (movie) =>{
        var actors = '<p><b>Actors:</b></p>', exectuive = '<p><b>Exectutive producers:</b></p>' , directors = '<p><b>Directors:</b></p>', producers = '<p><b>Producers:</b></p>', composers = '<p><b>Musical composers:</b></p>', scriptwriters = '<p><b>Script writers:</b></p>';
        movie.cast.forEach(actor =>{
            actors += '<p>Name: '+ actor.name + ' || Character: ' + actor.character + '</p>'
        })
        movie.crew.forEach(member =>{
            switch (member.department) {
                case 'Production':
                    if(member.job == 'Executive Producer') {exectuive += '<p>Name: '+ member.name + ' || Job: ' + member.job + '</p>'}
                    else{producers += '<p>Name: '+ member.name + ' || Job: ' + member.job + '</p>'}
                    break;
                case 'Directing':
                    directors += '<p>Name: '+ member.name + ' || Job: ' + member.job + '</p>'
                    break;
                
                case 'Sound':
                    if(member.job != 'Original Music Composer') break;
                    composers += '<p>Name: '+ member.name + ' || Job: ' + member.job + '</p>'
                    break;
                case 'Writing':
                    scriptwriters += '<p>Writers: '+ member.name + ' || Job: ' + member.job + '</p>'
                break;

                default:
                    break;
            }
        });
        var htmltext = actors + directors + scriptwriters + exectuive + producers + composers ;
        $('.modal-content').append(htmltext);
        $('#moviemodal').css("display", 'block');
    });
};

getpersondetails = id =>{
    var url = 'https://api.themoviedb.org/3/person/' + id + '?api_key=' + API_KEY;
    $.get(url, (person) =>{
        let htmltext;
        if(person.deathday == null){
            htmltext = '<span class="close" id="closebtn">&times;</span><p><b>Name:</b> ' + person.name + ' </p><p><b>Main activity:</b> ' + person.known_for_department + '</p><p><b>Birthday:</b> ' + person.birthday + '</p></p><p><b>Birth place:</b> ' + person.place_of_birth + '</p></p><p><b>Biography:</b> ' + person.biography + '</p></p><p><b>Personal website:</b> ' + person.homepage + ' </p>'
        }
        else{
            htmltext = '<span class="close" id="closebtn">&times;</span><p><b>Name:</b> ' + person.name + ' </p><p><b>Main activity:</b> ' + person.known_for_department + '</p><p><b>Birthday:</b> ' + person.birthday + '</p><p><b>Died:</b> ' + person.deathday + '</p></p><p><b>Birth place:</b> ' + person.place_of_birth + '</p></p><p><b>Biography:</b> ' + person.biography + '</p></p><p><b>Personal website:</b> ' + person.homepage + ' </p>'
        }
        $('.modal-content').empty().append(htmltext);
    });
    url = 'https://api.themoviedb.org/3/person/' + id + '/movie_credits?api_key=' + API_KEY;
    $.get(url, credits => {
        let htmltext;
        if(credits.cast != null){
            htmltext = '<p><b>Played in:</b></p>'
            credits.cast.forEach(credit =>{
                htmltext += '<p> '+ credit.title + ' | ' + credit.release_date + ' | Actor</p>'
            });
        }
        $('.modal-content').append(htmltext);
        
        if(credits.crew != null){
            htmltext = '<p><b>Crew in:</b></p>'
            credits.crew.forEach(credit =>{
                htmltext += '<p> '+ credit.title + ' | ' + credit.release_date + ' | ' + credit.job + '</p>';
           });
        }
        $('.modal-content').append(htmltext);
        $('#moviemodal').css("display", 'block');
    });
}

/*----------------API Search functions----------------*/
searchByMovie = () =>{
    $('#results').empty();
    var textvalue = $('#searchbar').val()
    //isLettersNumbers(textvalue);
    textvalue = textvalue.replace(/ /g, '+');
    var url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${textvalue}`;

    $.get(url, (data) =>{

        data.results.forEach(movie => {
            let imgurl = IMG_URL+movie.poster_path;
            let htmltext = '<div class="movie" id="'+ movie.id +'"><img class="imgs" alt="" src="' + imgurl + '"/><p><b>' + movie.title + '</b></p><p>Released: ' + movie.release_date + '</p><p>Language: ' + movie.original_language + '</p></div>'
            $('#results').append(htmltext)
        });
    });
};

searchByMovieYear = () =>{
    $('#results').empty();
    var textvalue = $('#searchbar').val()
    var yearvalue = $('#yearinput').val();
    //isLettersNumbers(textvalue);
    textvalue = textvalue.replace(/ /g, '+');
    var url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${textvalue}&year=${yearvalue}`;
    $.get(url, (data) =>{
        data.results.forEach(movie => {
            let imgurl = IMG_URL+movie.poster_path;
            let htmltext = '<div class="movie" id="'+ movie.id +'"><img class="imgs" alt="" src="' + imgurl + '"/><p><b>' + movie.title + '</b></p><p>Released: ' + movie.release_date + '</p><p>Language: ' + movie.original_language + '</p></div>'
            $('#results').append(htmltext)
        });
    });
};

searchByPerson = () =>{
    $('#results').empty();
    var textvalue = $('#searchbar').val();
    //isLettersNumbers(textvalue);
    textvalue = textvalue.replace(/ /g, '+');
    var url = `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${textvalue}`;

    $.get(url, (data) =>{
        data.results.forEach(person => {
            let imgurl = IMG_URL+person.profile_path;
            let htmltext = '<div class="person" id="'+ person.id +'"><img class="imgs" alt="" src="' + imgurl + '"/><p><b>' + person.name + '</b></p><p>Main activity: ' + person.known_for_department + '</p></div>'
            $('#results').append(htmltext)
        });

    });
};

/*----------------Validation----------------*/
/*isLettersNumbers = txt => {
    
    var letterNumber = /^[\w\d\s]+$/;

    if(letterNumber.test(txt)){
        return true;
    }
    else{
        return false;
    }
};*/