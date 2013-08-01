var numGames = 5;
var selections = [];

function LoadScripts() {

    $("#pkg-selection").buttonset();

    $("#pkg-selection input[type=radio]").on('change', function() {
        numGames = this.value;
        selections = [];
        $('#selections').children().remove();
        $('#totalvalue').text('$0.00');
        $('.gameInfo').each(function(i,elem) {
          $(elem).css('background-color',"")
          $(elem).data('gameInfo').selectedSeat = null
        })
    });

    for (var i = 0; i < gameData.games.length; i++) {
        addToGameList(gameData.games[i]);
    }
}

function addToGameList(gameInfo) {
    var element = $("<tr class='gameInfo'><td>" + gameInfo.opponent + "</td><td>" + gameInfo.date+"</td></tr>")
    var gameId = "" + gameInfo.opponent + "_" + gameInfo.date.replace(/\//g,'')
    element.attr('id',gameId)
    element.data('gameInfo', gameInfo)
    element.data('gameInfo').gameId = gameId
    console.log(element.data('gameInfo'))
    $("#gamelist").append(element)
    element.on("click", displaySeating) 
}

function displaySeating() {
    if (selections.length >= numGames) {
        alert("You have already selected " + selections.length + " games with a " + numGames + " game package.")
        return
    }
    gameClicked = this
    var game = $(gameClicked)
    console.log("Clicked: "+ game+ " - Data: " + game.data("gameInfo"));
    var gameLevel = game.data("gameInfo").gameType

    var seatingList = $("<tr class='sectionList'><td><table><thead><th>Section</th><th>Price</th></thead><tbody></tbody></table></td></tr>")
    seatingList.find('td').attr('colspan', 4)
    var insertAt  = seatingList.find("tbody")

    var mkAddToCalcCB = function(key, price) {
      return function() {
        var selectionData = {}
        selectionData.game = game.data('gameInfo')
        selectionData.gameElement = gameClicked
        selectionData.price = price
        selectionData.sectionsList = seatingList

        if (selectionData.game.selectedSeat) {
          for (var i = 0; i < selections.length; i++ ) {
            if (selectionData.game == selections[i].data) {
              selections.splice(i,1)
            }
          }
        } 

        selectionData.game.selectedSeat = key.slice(0)
        addToCalculator(selectionData)
      }
    }
    
   

    for (var key in gameData.plans[numGames]) {
        var sectionInfo = $("<tr class='sectionInfo'><td>"+key+"</td><td>$" +gameData.plans[numGames][key][gameLevel] + "</td></tr>")

        console.log("selected:", game.data('gameInfo').selectedSeat )
        if (game.data('gameInfo').selectedSeat == key) {
            sectionInfo.append('<td>Selected</td>');
        }

        sectionInfo.data('gameInfo',game.data("gameInfo"))
        sectionInfo.data("price", gameData.plans[numGames][key][gameLevel] )
        if (gameData.sections[key]) {
          sectionInfo.css('background-color', gameData.sections[key].color)
        }
        insertAt.append(sectionInfo)
        sectionInfo.on("click", mkAddToCalcCB(key,sectionInfo.data('price')))
    }

    game.after(seatingList)
    game.off('click')
    game.on('click', function() {
      seatingList.remove()
      game.on('click', displaySeating)
    })
}

function rebuildCalculator() {

  selections.sort(function(a,b) {
    return a.data.date < b.data.date
  })

  var container = $("#selections")
  container.fadeOut(100, function() {
    container.children().remove()

    for (var i = 0; i < selections.length; i++) {
      var selection = selections[i]
      var entry = $("<li class='selection'>" + 
                       "<span class='date'>" + selection.data.date + "</span>" +
                       "<span class='desc'>" + selection.data.opponent + "</span>" +
                       "<span class='seat'>" + selection.data.selectedSeat+ "</span>" +
                       "<span class='cost'>$" + selection.price + "</span>" +
                       "</li>")

      var mkRemoveFunction = function(sdata) {
        var selectionData = sdata
        return function() {
          for (var i = 0; i < selections.length; i++ ) {
            if (selectionData == selections[i].data) {
                selections.splice(i,1)
            }
          }
        rebuildCalculator()
            $("#" + selectionData.gameId).css('background-color',"")
            selectionData.selectedSeat=null

        }
      }

      entry.on('click', mkRemoveFunction(selection.data)



        )



      container.append(entry)
    }
    container.fadeIn(100)
  })

  $("#totalvalue").text(function(index, text) {
    var newVal = 0.0
    for (var i = 0; i < selections.length; i++) {
        newVal += selections[i].price;
    }
    return "$" + newVal.toFixed(2)
  })

}

function addToCalculator(selection) {
  var data = selection.game
  var price = selection.price

  $("#" + selection.game.gameId).css('background-color', 'red')
  selections.push({data: selection.game, price: selection.price})
  console.log("Adding to calc: ", selections)

  rebuildCalculator()

  selection.sectionsList.remove()

  $(selection.gameElement).on("click", displaySeating)
}


