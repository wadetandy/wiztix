
var numGames = 5;
var selections = []

function LoadScripts() {

    $("#pkg-selection").buttonset()

    $("#pkg-selection input[type=radio]").on('change', function() {
        numGames = this.value
        selections = []
        $('#selections').children().remove()
        $('#totalvalue').text('$0.00')
        console.log("numGames is now " + numGames);
    console.log("gameData is" + gameData.games);
    })

    for (var i = 0; i < gameData.games.length; i++) {
        addToGameList(gameData.games[i])
    }
}

function addToGameList(gameInfo) {
    var element = $("<tr><td>" + gameInfo.opponent + "</td><td>" + gameInfo.date+"</td></tr>")
    element.data('gameInfo', gameInfo)
    console.log(element.data('gameInfo'))
    $("#gamelist").append(element)
    element.on("click", function() {
        if (selections.length < numGames) {
        displaySeating(this)
        }
        else {
            alert("You have already selected " + selections.length + " games with a " + numGames + " game package.")
        }
    })
}

function displaySeating(gameClicked) {
    var game = $(gameClicked)
    console.log("Clicked: "+ game+ " - Data: " + game.data("gameInfo"));
    var gameLevel = game.data("gameInfo").gameType

    var seatingList = $("<tr class='sectionList'><td><table><thead><th>Section</th><th>Price</th></thead><tbody></tbody></table></td></tr>")
    seatingList.find('td').attr('colspan', 4)
    var insertAt  = seatingList.find("tbody")

    for (key in  gameData.plans[numGames]) {
        console.log(insertAt)
        console.log(key)
        var sectionInfo = $("<tr><td>"+key+"</td><td>$" +gameData.plans[numGames][key][gameLevel] + "</td></tr>")

        console.log("selected:", game.data('gameInfo').selectedSeat )
        if (game.data('gameInfo').selectedSeat == key) {
            sectionInfo.append('<td>Selected</td>');
        }

        sectionInfo.data('gameInfo',game.data("gameInfo"))
        sectionInfo.data("price", gameData.plans[numGames][key][gameLevel] )
        insertAt.append(sectionInfo)
        var func = function() {
            var seatType = key.slice(0)
            addToCalculator(this)
            game.data('gameInfo').selectedSeat = seatType
            console.log(game.data('gameInfo'))
            // console.log('selection event:', seatType)
        }
        sectionInfo.on("click", func)
    }

    game.after(seatingList)
    // game.off('click')
}

function addToCalculator(section) {
  var sectionInfo = $(section)
  var data = sectionInfo.data('gameInfo')
  var price = sectionInfo.data('price')
  selections.push({data: data, price: price})

  var container = $("#selections")
  if (container.children().length === 0)  {
    container.append("<div class='selection'>" +
                     "<span class='date'>" + data.date + "</span>" +
                     "<span class='desc'>" + data.opponent + "</span>" +
                     "<span class='cost'>$" + price + "</span>" +
                     "</div>")
  }
  else {
    inserted = false
    container.each(function(index,elem) {
      if ($(elem).find("span.date").text() > data.date) {
        container.before("<div class='selection'>" +
                     "<span class='date'>" + data.date + "</span>" +
                     "<span class='desc'>" + data.opponent + "</span>" +
                     "<span class='cost'>$" + price+ "</span>" +
                     "</div>")
        inserted = true
        return false;
      }

    })
    if (!inserted) {
        container.append("<div class='selection'>" +
                     "<span class='date'>" + data.date + "</span>" +
                     "<span class='desc'>" + data.opponent + "</span>" +
                     "<span class='cost'>$" + price+ "</span>" +
                     "</div>")
    }

  }

  $("#totalvalue").text(function(index, text) {
    var newVal = 0.0
    for (var i = 0; i < selections.length; i++) {
        newVal += selections[i].price;
    }
    return "$" + newVal.toFixed(2)
  })

  sectionInfo.parents("tr.sectionList").remove()
}


$("#gamelist tr").on('click', function() {
  var date = $(this).find("td.date").text()
  var desc = $(this).find("td.game").text()
  var price= $(this).find("td.price").text()


})
