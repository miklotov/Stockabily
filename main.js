
//VWWIWESKA8BRE45M
//https://www.alphavantage.co/documentation/



//cc491c72759e4d54a13d6375ad7ed4b8
//https://iextrading.com/developer/docs
// end point https://api.iextrading.com/1.0  /stock/aapl/chart

var price;
var company;
var tickers_already_used = [];
var rotate_price_api = 0;
var rotate_name_api = 0;

var html_col_values = {
  column_symbol: $("<th>"),
  column_company: $("<th>"),
  column_price: $("<th>"),
  column_market: $("<th>")

}


var table_values = {
  symbol: "",
  price: "",
  company: "",
  market: "",
}

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAFZgK8A95KSJ8pOt_okm75Ro40WlgqW1w",
  authDomain: "stockabily.firebaseapp.com",
  databaseURL: "https://stockabily.firebaseio.com",
  projectId: "stockabily",
  storageBucket: "stockabily.appspot.com",
  messagingSenderId: "713440785870"
};
firebase.initializeApp(config);
var database = firebase.database();
var pricedb = firebase.database().ref("stock");


function get_index(ticker) {

  var index = "";
  for (i = 0; i < NASDAQ_tickers.length; i++) {

    if (i === ticker.toUpperCase()) {
      index = "NASDAQ";
    }

  }

  for (i = 0; i < NYSE_tickers.length; i++) {

    if (i === ticker.toUpperCase()) {
      index = "NYSE";
    }

  }

  for (i = 0; i < AMEX_tickers.length; i++) {

    if (i === ticker.toUpperCase()) {
      index = "AMEX";
    }

  }
  // console.log("index: ",index)
  return index

}


function update_chart(ticker) {

  //"https://www.tradingview.com/symbols/NYSE-MMM/"
  // $("#web_chart").attr("href","https://www.tradingview.com/symbols/NYSE-MMM/")
  // TradingView.widget["symbol"] = "NYSE:​MMM"
  new TradingView.widget(

    {
      "width": 880,
      "height": 510,
      "symbol": get_index(ticker) + ":" + ticker,
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "Light",
      "style": "1",
      "locale": "en",
      "toolbar_bg": "#f1f3f6",
      "enable_publishing": false,
      "allow_symbol_change": true,
      "container_id": "tradingview_72e3c"
      // "container_id": "tradingview_845d6"
    }

  );

}


function table(ticker) {

  var symbol_table = $("<tr  class='hover1'>")

  symbol_table.append(`<th id="${ticker}_symbol" class= "symbol" scope="col"></th>`)
  symbol_table.append(`<th id="${ticker}_company" class= "company" scope="col"></th>`)
  symbol_table.append(`<th id="${ticker}_price" class= "price" scope="col"></th>`)
  symbol_table.append(`<th id="${ticker}_market" class= "market" scope="col"></th>`)
  symbol_table.append(`<button ticker="${ticker}" class="buttons" id="${ticker}_deletebtn">delete</button>`)



  $("#table_content").append(symbol_table)
}


function set_symbol(x) {
  $("#" + x + "_symbol").text(x)
}


function get_market_cap(ticker) {
  $.ajax({
    ///stock/aapl/batch?types=quote,news,chart&range=1m&last=1
    url: "https://api.iextrading.com/1.0/stock/" + ticker + "/batch?types=quote,news,chart&range=1m&last=1",
    method: "GET"
  }).then(function (response) {
    // console.log(response)
    // set_market(response.quote.marketCap)
    $("#" + ticker + "_market").text(response.quote.marketCap)
  });
}




function get_fb_price(ticker) {

  database.ref(ticker).on('value', function (childSnapshot) {
    childSnapshot.forEach(function (childSnapshot2) {
      // console.log(ticker+" childSnapshot2 ", childSnapshot2.val())
      return childSnapshot2.val()
    });

  });

}




function get_ticker_company(ticker) {

  $.ajax({
    url: "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" + ticker + "&apikey=VWWIWESKA8BRE45M",
    method: "GET"
  }).then(function (response2) {
    // console.log("response2: ",response2.bestMatches[0]["2. name"])
    company = response2.bestMatches[0]["2. name"]
    // set_company(company)
    $("#" + ticker + "_company").text(response2.bestMatches[0]["2. name"])
  });//.then

}

function worldtradingdata_ticker_company(ticker) {

  $.ajax({
    url: "https://www.worldtradingdata.com/api/v1/stock?symbol=" + ticker + "&api_token=NwKKaeNpI8lA9hVpjtqqdvqYWWqHf7EMegaRidS6DdgdwVja8b67OyCdH9n7",
    method: "GET"
  }).then(function (response) {
    var worldtradingdata_name = response.data[0].name
    console.log("worldtradingdata_name: ", response.data[0].name)
    $("#" + ticker + "_company").text(worldtradingdata_name)



  });
};

function iex_company(symbol) {

  $.ajax({
    url: "https://api.iextrading.com/1.0/stock/" + symbol + "/batch?types=quote",
    method: "GET"
  }).then(function (response) {
    var iex_p_name = response.quote.companyName
    console.log("iex_name: ", response.quote.companyName)
    $("#" + symbol + "_company").text(iex_p_name)

  });
};


// error link image "https://media.tenor.com/images/b24bfe9402330f5b14ef7dfdd65c6b7a/tenor.gif"
$(document).ready(function () {

});

$(document).on("click", ".button", function (e) {
  event.preventDefault();
  var get_input = $(".input").val().toUpperCase()
  get_input_ticker = get_input.split(" ",1) 
  console.log("get_input_ticker: ",get_input_ticker)
  console.log("get_input_ticker.join(): ",get_input_ticker.join())
  var ticker = get_input_ticker.join()
  

  // console.log("ticker: ",ticker)
  // console.log("tickers_already_used: ", tickers_already_used.indexOf(ticker))


  var is_real_ticker = false

console.log("AMEX_tickers: ", AMEX_tickers.indexOf(ticker))
  if (AMEX_tickers.indexOf(ticker) > -1) {
    is_real_ticker = true;
  }
  console.log("NASDAQ_tickers: ", NASDAQ_tickers.indexOf(ticker))
  if (NASDAQ_tickers.indexOf(ticker) > -1) {
    is_real_ticker = true;
  }
  console.log("NYSE_tickers: ", NYSE_tickers.indexOf(ticker))
  if (NYSE_tickers.indexOf(ticker) > -1) {
    is_real_ticker = true;
  }
  console.log("is_real_ticker: ",is_real_ticker)
  if (is_real_ticker) {

    if (tickers_already_used.indexOf(ticker) <= -1) {
      tickers_already_used.push(ticker);
      table(ticker)
    }
  
    async function getStockData(ticker) {
      await set_symbol(ticker)
      await get_market_cap(ticker)
      // await get_ticker_info(ticker)
      await choose_price_api(ticker)
      // await get_ticker_company(ticker)
      await choose_name_api(ticker)
    }

    getStockData(ticker)

    newsfeed(ticker)
    stockinfo(ticker)
    // console.log("table_values: ", table_values)

    $(".input").val("")
    update_chart(ticker)
    $(".tradingview-widget-container").show()

    hide_news()

    // iex_price(ticker)
    $('.symbol').removeAttr('style'); // removes the backgound for the selected ticker that was darkened 
  }//end is_real_ticker if()
});

//free APIs limit the number of api calls you can do so I am rotating through a few differnet ones

function choose_name_api(ticker) {


  if (rotate_name_api === 0) {
    rotate_name_api = 1;
    console.log("Using worldtradingdata name")
    worldtradingdata_ticker_company(ticker)
  } else if (rotate_name_api === 1) {
    rotate_name_api = 2;
    console.log("Using iex name")
    iex_company(ticker)
  } else if (rotate_name_api === 2) {
    rotate_name_api = 0;
    console.log("Using alpha name")
    get_ticker_company(ticker)
  }

}

function choose_price_api(ticker) {


  if (rotate_price_api === 0) {
    rotate_price_api = 1;
    console.log("Using alpha price")
    get_ticker_info(ticker)
  } else if (rotate_price_api === 1) {
    rotate_price_api = 2;
    console.log("Using iex price")
    iex_price(ticker)
  } else if (rotate_price_api === 2) {
    rotate_price_api = 3;
    console.log("Using unibit_price price")
    unibit_price(ticker)
  } else if (rotate_price_api === 3) {
    rotate_price_api = 0;
    console.log("Using worldtradingdata price")
    worldtradingdata_price(ticker)
  }

}

function get_ticker_info(ticker) {

  var time_series = [];

  $.ajax({

    // url: "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + ticker + "&apikey=VWWIWESKA8BRE45M",
    //https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MSFT&apikey=demo
    url: "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + ticker + "&apikey=VWWIWESKA8BRE45M",

    method: "GET"
  }).then(function (response) {
    // console.log("response: ",response)

    price = response["Global Quote"]["05. price"]

    $("#" + ticker + "_price").text(price)

    var pricedb1 = firebase.database().ref(ticker);
    pricedb1.update({
      pricedb: price

    });
    // console.log("fb_price "+ticker +": "+get_fb_price(ticker) )
    $("#" + ticker + "_price").text(get_fb_price(ticker))


  });//.then    

}



//news 
//https://api.iextrading.com/1.0/stock/aapl/batch?types=quote,news,chart&range=1m&last=10
//documentation
//https://iextrading.com/developer/docs/#getting-started

function iex_price(ticker) {

  $.ajax({
    url: "https://api.iextrading.com/1.0/stock/" + ticker + "/batch?types=quote",
    method: "GET"
  }).then(function (response) {
    var iex_p = response.quote.latestPrice
    // console.log("iex: ",response.quote.latestPrice)
    $("#" + ticker + "_price").text(iex_p)
    var pricedb1 = firebase.database().ref(ticker);
    pricedb1.update({
      pricedb: iex_p

    });
    $("#" + ticker + "_price").text(get_fb_price(ticker))
  });
};

//https://www.worldtradingdata.com/home
//NwKKaeNpI8lA9hVpjtqqdvqYWWqHf7EMegaRidS6DdgdwVja8b67OyCdH9n7
//https://www.worldtradingdata.com/api/v1/stock?symbol=AAPL&api_token=NwKKaeNpI8lA9hVpjtqqdvqYWWqHf7EMegaRidS6DdgdwVja8b67OyCdH9n7
function worldtradingdata_price(ticker) {

  $.ajax({
    url: "https://www.worldtradingdata.com/api/v1/stock?symbol=" + ticker + "&api_token=NwKKaeNpI8lA9hVpjtqqdvqYWWqHf7EMegaRidS6DdgdwVja8b67OyCdH9n7",
    method: "GET"
  }).then(function (response) {
    var worldtradingdata = response.data[0].price
    console.log("intrinio: ", response.data[0].price)
    $("#" + ticker + "_price").text(worldtradingdata)
    var pricedb1 = firebase.database().ref(ticker);
    pricedb1.update({
      pricedb: worldtradingdata

    });
    $("#" + ticker + "_price").text(get_fb_price(ticker))
  });
};

//https://unibit.ai/docs
//uL7aYHqtSvJIxAXo9XfS4-_0cNDx5faU
//https://api.unibit.ai/realtimestock/AAPL?AccessKey=demo
//https://api.unibit.ai/realtimestock/ticker?size=a positive number&datatype=json&AccessKey=your access key


function unibit_price(ticker) {

  $.ajax({
    url: "https://api.unibit.ai/realtimestock/" + ticker + "?size=1&datatype=json&AccessKey=uL7aYHqtSvJIxAXo9XfS4-_0cNDx5faU",
    method: "GET"
  }).then(function (response) {
    var unibit_price = response[0].price
    console.log("unibit_price: ", response[0].price)
    $("#" + ticker + "_price").text(response[0].price)
    var pricedb1 = firebase.database().ref(ticker);
    pricedb1.update({
      pricedb: unibit_price

    });
    $("#" + ticker + "_price").text(get_fb_price(ticker))
  });
};


function stockinfo(symbol) {

  $.ajax({
    url: "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + symbol + "&apikey=MVG2GAAJUF1WORNH",
    method: "GET"
  }).then(function (response) {
    // console.log(response)

    var time_series = [];
    for (i in response["Time Series (Daily)"]) {
      time_series.push(i)
    }
    a = time_series[0].replace(/^\s+/, "")
    var openPrice = response["Time Series (Daily)"][a]["1. open"]
    // console.log(price);

    b = time_series[1].replace(/^\s+/, "")
    var highPrice = response["Time Series (Daily)"][b]["2. high"]

    c = time_series[2].replace(/^\s+/, "")
    var lowPrice = response["Time Series (Daily)"][c]["3. low"]

    d = time_series[3].replace(/^\s+/, "")
    var closePrice = response["Time Series (Daily)"][d]["4. close"]

    e = time_series[4].replace(/^\s+/, "")
    var volumePrice = response["Time Series (Daily)"][d]["5. volume"]


    // var symbol = $(".input").val();
    var symbolName = $("<div>");
    var p1 = $("<p>");
    p1.text("Symbol:  " + symbol);
    p1.addClass("para")

    var open = $("<div>");
    var p2 = $("<p>");
    p2.text("price: " + openPrice)
    p2.addClass("para")

    var high = $("<div>")
    var p3 = $("<p>");
    p3.text("High Price   " + highPrice);
    p3.addClass("para")

    var low = $("<div>");
    var p4 = $("<p>");
    p4.text("low price " + lowPrice);
    p4.addClass("para")

    var close = $("<div>");
    var p5 = $("<p>");
    p5.text("close price " + closePrice)
    p5.addClass("para")

    var volume = $("<div>");
    var p6 = $("<p>")
    p6.text("Volume " + volumePrice)
    p6.addClass("para")


    symbolName.append(p1)
    open.append(p2)
    high.append(p3)
    low.append(p4)
    close.append(p5)
    volume.append(p6)


    $("#stockinfo_id").empty();
    $("#stockinfo_id").append(symbolName)
    $("#stockinfo_id").append(open)
    $("#stockinfo_id").append(high)
    $("#stockinfo_id").append(low)
    $("#stockinfo_id").append(close)
    $("#stockinfo_id").append(volume)
  });
};







//CNBC API KEY --9291a57d20894f6483ea6ff42184f84f
function newsfeed(symbol) {

  $.ajax({
    ///stock/aapl/batch?types=quote,news,chart&range=1m&last=1
    url: "https://api.iextrading.com/1.0/stock/" + symbol + "/batch?types=quote,news,chart&range=1m&last=10",

    method: "GET"
  }).then(function (response) {

    var stocknews = response.news
    // console.log(stocknews);
    $("#stocknews_id").empty()
    for (var i = 0; i < stocknews.length; i++) {

      var stockheadline = stocknews.headline
      var newsDiv = $("<div>")

      var link = $("<a>")
      var newsSource = $("<p>").text("Source: " + stocknews[i].source)
      var newsdateline = $("<p>").text("DateTime: " + stocknews[i].datetime)
      var newsPara = $("<p>").text("News: " + stocknews[i].headline)
      var newsURL = $("<p>").text("URL:" + stocknews[i].url)
      link.attr("href", stocknews[i].url)
      link.attr("target","_blank")
      // newsURL.append(link);

      // newsURL.addClass("urlclass")
      link.append(newsURL)
      link.addClass("urlclass")

      newsDiv.append(newsdateline)

      newsDiv.append(newsSource)
      newsDiv.append(newsPara)
      // newsDiv.append(newsURL)
      newsDiv.append(link)

      // $("#stockcontent").append(newsDiv);
      $("#stocknews_id").append(newsDiv);
      $("#stocknews_id").append("</br>");

    }
  });
}

function hide_news() {
  $("#stocknews_id").hide()
}
function show_news() {
  $("#stocknews_id").show()
}

function hide_stockinfo() {
  $("#stockinfo_id").hide()
}

function show_stockinfo() {
  $("#stockinfo_id").show()
}

$(document).on("click", "#news_tab", function (e) {
  $("#info_tab").removeClass()
  $("#news_tab").addClass("is-active")
  show_news()
  hide_stockinfo()
});

$(document).on("click", "#info_tab", function (e) {
  $("#info_tab").addClass("is-active")
  $("#news_tab").removeClass()
  hide_news()
  show_stockinfo()
});


$(document).on("click", ".symbol", function (e) {
  var x = $(this)["0"];
  var y = $(this)["0"];
  console.log("y: ", y)

  var ticker_of_row = x.textContent;

  $(this).css('background-color', 'grey');
  update_chart(ticker_of_row)
  newsfeed(ticker_of_row)
  stockinfo(ticker_of_row)


});



$(document).on("click", ".buttons", function (e) {
// console.log("e",e.originalEvent.path)
console.log("e",e)
console.log("e",e.target.outerHTML)
var x = e.target.outerHTML

console.log("e",e.target.id)



$(this).closest('tr').remove()
tickers_already_used = []
// for( var i = 0; i < tickers_already_used.length; i++){ 
//   if ( tickers_already_used[i] === 5) {
//     tickers_already_used.splice(i, 1); 
//   }
// }
});


// });
//https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_autocomplete
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}




var tickers11 = [];
var names = [];
var tickers_names = [];


tickers11 = tickers11.concat(AMEX_tickers);
tickers11 = tickers11.concat(NASDAQ_tickers);
tickers11 = tickers11.concat(NYSE_tickers);

names = names.concat(AMEX_names);
names = names.concat(NASDAQ_names);
names = names.concat(NYSE_names);


for(j=0;j<tickers11.length;j++){
  tickers_names[j] = tickers11[j] +" " +names[j];
}



/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("myInput"), tickers_names);