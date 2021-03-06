$(document).on('ready',function() {



  //GLOBAL VARIABLES
  var currentRound;

  var rounds = {

    round1: {
      number:1, 
      target: 5,
      bugsGreen: 1,
      bugsBlue: 15,
      bugsEatenTotal: 0,
      bugsEatenGreen: 0,
      bugsEatenBlue: 0,
      displayTargetOnIntro: function() {
        $('.bugIconStart').before('<p>Eat '+this.target+' or more bugs to survive the winter.')
      },
      successMessage:"<p>You got through your first year but you were attacked by a hawk. Your injuries mean you won't be able to breed.</p><p>You'll need to eat more this year so that you can recover.</p>"
    },

    round2: {
      number:2,
      target: 6,
      bugsGreen:0,
      bugsBlue:0,
      bugsEatenTotal: 0,
      bugsEatenGreen: 0,
      bugsEatenBlue: 0,
      successMessage: "<p>You survived another winter but now you've caught a disease so you don't have enough energy to breed.</p><p>You have to eat more in order to get your strength back. Have you spotted the green bugs?</p>"
    },

    round3: {
      number:3,
      target:6,
      bugsGreen:0,
      bugsBlue:0,
      bugsEatenTotal: 0,
      bugsEatenGreen: 0,
      bugsEatenBlue: 0,
      successMessage:"<p>This year you found a mate and bred. Your hatchlings are growing quickly and should be out of the nest soon.</p><p>You've done well so far but with all these extra beaks to feed you'll have to catch more bugs than ever.</p>"

    },

    round4: {
      number: 4,
      target: 7,
      bugsGreen:0,
      bugsBlue:0,
      bugsEatenTotal: 0,
      bugsEatenGreen: 0,
      bugsEatenBlue: 0,
      successMessage: "<p>Well done! You've made it through your fourth year and your offspring have flown the nest.</p><p>Did you find it hard to spot the green bugs? If so the proportion of green bugs probably increased throughout the game.</p><p>This is a simplified example of how changes can happen as a result of natural selection.</p><p><a href='http://evolution.berkeley.edu/evolibrary/article/0_0_0/evo_25'>Find out more about evolution</a></p>"
    }
  }

  //FUNCTIONS

  //generate random absolute position based on width and height of bug-field
  function randomHeight() {
    var fieldHeight = $('.field').height();
    var randomHeight =Math.round(Math.random()*(fieldHeight-80));
    return (randomHeight+'px');
    };

  function randomWidth() {
    var fieldWidth = $('.field').width();
    var randomWidth = Math.round(Math.random()*(fieldWidth-80));
    return (randomWidth+'px');
  }

//make bug elements
  function makeBug(n,colour) {
    var bug = $('<div id="bug'+n+'">');
    bug.addClass('bug');
    bug.addClass(colour+'Bug');
    var imageChoice = Math.ceil(Math.random()*4);
    bug.html('<img src="../images/'+colour+'-bug'+imageChoice+'.png">')
    bug.css('top',randomHeight())
    bug.css('left',randomWidth())
    $('.field').append(bug);
  };

//create 10 bugs with random positions with '.field'
  function populateField() {
    for (i=0;i<currentRound.bugsBlue;i++) {
      makeBug(i,'blue')
    }
    console.log('Blue bugs in this round: '+currentRound.bugsBlue)
    for (i=0;i<currentRound.bugsGreen;i++) {
      makeBug(i,'green')
    };
    console.log('Green bugs in this round: '+currentRound.bugsGreen)
    addClickEventBugs();
  }


  function clearBugs() {
    $('.bug').remove();
    console.log('bugs cleared');
  }

  //put click event on all bugs so that they dissapear when clicked and increase the Score by one
  function addClickEventBugs() {
    $('.bug').on('click', function(){
      eatBug(this);
      addScore();
    });
  }

  function eatBug(x){
    var bug = $(x)
    bug.addClass('eatenBug');
    if (bug.hasClass('greenBug')) {
      console.log('ate green bug');
      currentRound.bugsEatenGreen++;
      console.log('Green bugs eaten:'+currentRound.bugsEatenGreen)
    }
    else if (bug.hasClass('blueBug')) {
      console.log('ate blue bug');
      currentRound.bugsEatenBlue++;
      console.log('Blue bugs eaten: '+currentRound.bugsEatenBlue);
    }
    $('.tallyChart').append('<img src="./images/bug-icon.svg">');
  }

  //SCORING
  function addScore(){
    currentRound.bugsEatenTotal++;
    updateScoreDisplay();
  }

  function resetScore() {
    currentRound.bugsEatenTotal=0;
    updateScoreDisplay();
  }


  function updateScoreDisplay(){
    $('.bugCount').html('Bugs eaten: '+currentRound.bugsEatenTotal)
  }

//Functions to add as event listeners. These could be refactored as they overlap

  function startGame() {
    $('.introBox').hide();
    currentRound = rounds.round1;
    populateField();
    $('.gameScreen').show();
    $('.infoBox').show();
    updateInfoBox();
    populateGraph();
    startTimer();
  }

  function restartRound() {
    $('.results').hide();
    $('.gameScreen').show();
    resetScore();
    clearBugs();
    clearTally();
    populateField();
    startTimer();
  }

  function restartGame() {
    $('.results').hide();
    resetScore();
    clearBugs();
    clearTally();
    startGame();
  }

  function startNextRound() {
    calculateGreenBlueRatio();
    $('.results').hide();
    $('.gameScreen').show();
    currentRound=rounds['round'+(currentRound.number+1)];
    updateInfoBox();
    $('.graph').css('visibility','visible');
    populateGraph();
    clearBugs();
    clearTally();
    populateField();
    startTimer();
  }

  function calculateGreenBlueRatio() {
    nextRound=rounds['round'+(currentRound.number+1)]
    nextRound.bugsGreen = 1 + Math.round((currentRound.bugsGreen - currentRound.bugsEatenGreen)*1.9);
    nextRound.bugsBlue = 16 - nextRound.bugsGreen
  }

  function updateInfoBox() {
    //put information (round name, target, bugs eaten so far) in info box
  var stats = $('.stats');
  stats.html('<h2>Year '+currentRound.number+'</h2>');
  stats.append('<p>Target: '+currentRound.target+'</p>');
  stats.append('<p class="bugCount">Bugs eaten: '+currentRound.bugsEatenTotal+'</p>');
  }

  //NB:at present the two functions startNextRound() and restartRound() are the same

  function startTimer(){
    // var id=window.setInterval(callback, delay);
    var percentage=100;
    count=0;
    var timer = setInterval(function() {
      var bar = $('.timerBar');
      percentage-=0.2;
      bar.width(percentage+'%');
      if(count > 500) {
        clearInterval(timer);
        displayResults();
      }
      count++;
    }, 10);
  }

  function populateGraph() {
    var greenBugs = currentRound.bugsGreen;
    var roundNumber = currentRound.number;
    var perCentGreenBugs = (greenBugs/15)*100

    $('#pop'+roundNumber).css('height',perCentGreenBugs);
  }

  function displayResults() {
    $('.gameScreen').hide();

    var results = $('<div class="results"></div>');
    results.insertBefore('.infoBox');

    var nextRound = rounds['round'+(currentRound.number+1)];
    
    if (currentRound.bugsEatenTotal>=currentRound.target) {
      if (currentRound.number===4) {
         results.prepend(currentRound.successMessage);
         var startAgain = $('<input type="submit" value="Play again">');
         results.append(startAgain);
         startAgain.on('click', restartGame);
         results.css('padding-top','44px').css('height','398px');
        } else {
        var nextRoundButton = $('<button class="nextYear">Next year</button>');
        results.prepend(nextRoundButton);
        nextRoundButton.on('click',startNextRound);

        results.prepend('<p>Eat '+nextRound.target+' or more bugs to survive.</p>') 

        results.prepend(currentRound.successMessage);
          
        }
    } else if (currentRound.bugsEatenTotal<currentRound.target) {
      var tryAgainButton = $('<button class="tryAgain">Try Again</button>');
      results.append(tryAgainButton);
      tryAgainButton.on('click',restartRound);

      var bugsEaten = currentRound.bugsEatenTotal === 1 ?  '1 bug' : currentRound.bugsEatenTotal+' bugs';
      results.prepend('<p>You ate '+bugsEaten+'.</p><p>This was not enough to survive and you have died.</p>');
    }
    // results.prepend('<p>You ate '+  currentRound.bugsEatenTotal+' bugs</p>');

  }

  function clearTally(){
    $('.tallyChart').html('')
  }

  rounds.round1.displayTargetOnIntro();
  //add event listener to start button
  $('#start').on('click',startGame);

});

