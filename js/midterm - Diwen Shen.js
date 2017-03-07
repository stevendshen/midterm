/* =====================
  Set up initial map
===================== */

var map = L.map('map', {
  center: [39.952380, -75.163635],
  zoom: 12
});

var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);



/* =====================
  State of the Application - Page numbers and buttons
===================== */

var state = {
  "slideNumber": 1, // slideNumber keeps track of what slide you are on. It should increase when you
                    // click the next button and decrease when you click the previous button. It
                    // should never get so large that it is bigger than the dataset. It should never
                    // get so small that it is smaller than 0.
  "slideData": [
    {
      "name": "Leaflet",
      "language": "Javascript",
      "namespace": "L"
    },
    {
      "name": "Underscore",
      "language": "Javascript",
      "namespace": "_"
    },
    {
      "name": "jQuery",
      "language": "Javascript",
      "namespace": "$"
    }
  ]
};

var clickNextButton = function() {
  if (state.slideNumber<5){
    state.slideNumber += 1;
    console.log("Current Page: " + state.slideNumber);
  } else {
    console.log("You have reached the last page.");
  }
};

var clickPreviousButton = function() {
  if (state.slideNumber>1){
    state.slideNumber -= 1;
    console.log("Current Page: " + state.slideNumber);
  } else {
    console.log("You have reached the first page.");
  }
};

var saySlideName = function(slide) {
  // saySlideName uses console.log to "say" the name of the slide it is given. It should run when
  // someone clicks on one of the buttons.
  console.log("Current Page: " + state.slideData);
};


// Control button display
var show_both_buttons = function(){
    $('button').show();
};
var show_previous_button = function(){
  $('#button-previous').show();
  $('#button-next').hide();
};
var show_next_button = function(){
    $('#button-previous').hide();
    $('#button-next').show();
};
show_next_button(); // Initialize on first page



/* =====================
  Import Datasets & Initialize Map
===================== */

// Data Link

var route_data_link = "https://raw.githubusercontent.com/stevendshen/Datasets---Diwen-Shen/master/SEPTARoutesSpring2016.geojson";
//var stop_data_link = "https://raw.githubusercontent.com/stevendshen/Datasets---Diwen-Shen/master/SEPTAStopsByLineSpring2016.geojson";


// Global Variables

var parsedData;
var featureGroup_1;
var featureGroup_2;
var featureGroup_3;
var featureGroup_4;
var featureGroup_5;


// Read data into parsedData, load initial map

$(document).ready(function() {
  $.ajax(route_data_link).done(function(data) {
    parsedData = JSON.parse(data); // Cleaned Data Saved Here

    featureGroup_1 = L.geoJson(parsedData, {
      style: style_default,
      filter: myFilter
    }).addTo(map).eachLayer(popup_line_info_when_clicked).eachLayer(highlight_when_mouseover).eachLayer(highlight_when_mouseout_default);

  });
});


// Attributes
// {"LINENAME": "Parx Casino to 54th-City",
// "tpField071": "Southbound",
// "tpField070": "Northbound",
// "LINEABBR": "1",
// "REVENUENO": "City",
// "tpField01": "COM",
// "tpField00": 1,
// "DIRNUM0": 0,
// "DIRNUM1": 1,
// "tpField05": "Parx Casino",
// "tpField06": "54th-City",
// "tpField02": "FRA",
// "Shape_Leng": 242031.474133}


// Filter data to keep the file size down
var myFilter = function(feature) {
  if (feature.properties.LINEABBR === "21" | feature.properties.LINEABBR === "30" |
  feature.properties.LINEABBR === "40" | feature.properties.LINEABBR === "LUCYGR" |
  feature.properties.LINEABBR === "42" | feature.properties.LINEABBR === "LUCYGO" |
  feature.properties.LINEABBR === "34" | feature.properties.LINEABBR === "36" |
  feature.properties.LINEABBR === "13" | feature.properties.LINEABBR === "10" |
  feature.properties.LINEABBR === "11" | feature.properties.LINEABBR === "31" |
  feature.properties.LINEABBR === "64" | feature.properties.LINEABBR === "38" |
  feature.properties.LINEABBR === "43" | feature.properties.LINEABBR === "52" |
  feature.properties.LINEABBR === "9" | feature.properties.LINEABBR === "12" |
  feature.properties.LINEABBR === "44"){
    return true;
  } else {return false;}
};

/* =====================
  Functions
===================== */


// When clicking a line, display line number
var popup_line_info_when_clicked = function(layer) {
  layer.on('click', function (event) {
    layer.bindPopup("Line: "+layer.feature.properties.LINEABBR); // pop-up
    console.log("Click Successfully Registered");
  });
};


// Set styles: Default
var style_default = function(feature) {
  return {color: 'green', opacity: 1.0, weight: 3};
};

// Set styles: Color by Mode (using case function)
var style_by_mode = function(feature) {
  //console.log("Line: " + feature.properties.LINEABBR + mode_data[feature.properties.LINEABBR]);
  switch(mode_data[feature.properties.LINEABBR]){
    case "Bus": return {color: 'blue', opacity: 1.0, weight: 3};
    case "Trolley": return {color: 'green', opacity: 1.0, weight: 5};
  }
};

// Set styles: Color by Frequency (using case function)
var style_by_frequency = function(feature) {
  //console.log("Line: " + feature.properties.LINEABBR);
  if(frequency_data[feature.properties.LINEABBR] > 30){
    return {color: 'green', opacity: 1.0, weight: 3};
  } else if(frequency_data[feature.properties.LINEABBR] > 15){
    return {color: 'blue', opacity: 1.0, weight: 3};
  } else if(frequency_data[feature.properties.LINEABBR] <= 15){
    return {color: 'red', opacity: 1.0, weight: 5};
  }
};


// Set Mouseover Effect
var highlight_when_mouseover = function(layer) {
  layer.on('mouseover', function (event) {
    //console.log("Mouseover Registered - Mouseover");
    layer.setStyle({
        weight: 5
    });
    // layer.bindPopup("Line: "+layer.feature.properties.LINEABBR); // pop-up, somehow this is not working
  });
};

// Set Mouseout Effect to default
var highlight_when_mouseout_default = function(layer) {
  layer.on('mouseout', function (event) {
    //console.log("Mouseout Registered - Default");
    layer.setStyle(style_default);
  });
};

// Set Mouseout Effect to by mode
var highlight_when_mouseout_by_mode = function(layer) {
  layer.on('mouseout', function (event) {
    //console.log("Mouseout Registered - by Mode");
    layer.setStyle(style_by_mode);
  });
};

// Set Mouseout Effect to by frequency
var highlight_when_mouseout_by_frequency = function(layer) {
  layer.on('mouseout', function (event) {
    //console.log("Mouseout Registered - by Frequency");
    layer.setStyle(style_by_frequency);
  });
};

// Map Zoom Levels:
// Whole City
var map_zoom_whole_city = function() {
  map.setView([39.952380, -75.163635], 12);
};
// University City
var map_zoom_UC = function() {
  map.setView([39.953411, -75.194447], 14);
};



// Create an array to store (mid-day around 12pm) frequency information, to be called
var frequency_data = {"21": 10, "30": 45, "40": 16, "42": 10, "LUCYGR": 30, "LUCYGO": 30, "34": 10,
  "36": 10, "13": 10, "10": 10, "11": 10, "31": 25, "64": 20, "38": 20, "43": 20, "52": 8, "9": 18, "44": 20, "12": 20};

var mode_data = {"21": "Bus", "30": "Bus", "40": "Bus", "42": "Bus", "LUCYGR": "Bus", "LUCYGO": "Bus", "34": "Trolley",
  "36": "Trolley", "13": "Trolley", "10": "Trolley", "11": "Trolley", "31": "Bus", "64": "Bus", "38": "Bus", "43": "Bus",
  "52": "Bus", "9": "Bus", "44": "Bus", "12": "Bus"};

// Run Function Only When Data Fully Loaded: $(document).ready(functionToCallWhenReady)

$(document).ready(function() {

  // Text Labels
  $("#main-heading").text("Exploring the Usefulness of SEPTA Bus Lines in University City");

  // Checkbox Labels
  $("#checkbox-label1").text("First Class");
  $("#checkbox-label2").text("Transfer");

  // Button Labels
  $("#button-next").text("Next Page");
  $("#button-previous").text("Previous Page");

  $("#cbox-input1").prop("checked",true);
  $("#cbox-input2").prop("checked",true);

  // Get Input Values

  var selectors = ["#cbox-input1", "#cbox-input2"];
  var labels = ["#checkbox-label1", "#checkbox-label2"];
  var input_values = _.map(selectors, function(some_array){return $(some_array).val();});
  console.log(input_values);

  var selectors_and_input_values = {}; // Create Dictionary to Store Selector with Input Values
  for(i=0; i<selectors.length; i++){
    selectors_and_input_values[$(labels[i]).text()]=input_values[i];
  }
  console.log(selectors_and_input_values);

  // Disable All Checkboxes as default
  _.each(selectors, function(some_array){$(some_array).prop('disabled', true);});

  // Make "Next Button" Trigger: Change State of the Application
  $('body > div.sidebar > button#button-next').click(function(){
    clickNextButton();
    console.log("Button triggered.");
    update_page_content();
  });

  // Make "Previous Button" Trigger: Change State of the Application
  $('body > div.sidebar > button#button-previous').click(function(){
    clickPreviousButton();
    console.log("Button triggered.");
    update_page_content();
  });

}); // end of huge ready function, don't delete


/* =====================
  MASTER FUNCTION:
  Update Content of Each Page Based on Page Number
===================== */

// When page change is triggered, update the content of the page
var update_page_content = function(){

  // Page 1:
  if (state.slideNumber==1){
    map_zoom_whole_city(); // set zoom
    show_next_button(); // set buttons
    if(featureGroup_2 !== undefined){featureGroup_2.clearLayers();} // clear unwanted layers, only if they are defined

    featureGroup_1 = L.geoJson(parsedData, { // load featureGroup_1
      style: style_default,
      filter: myFilter
    }).addTo(map).eachLayer(popup_line_info_when_clicked).eachLayer(highlight_when_mouseover).eachLayer(highlight_when_mouseout_default);
  }

  // Page 2:
  else if (state.slideNumber==2){
    map_zoom_UC();
    if(featureGroup_1 !== undefined){featureGroup_1.clearLayers();}
    if(featureGroup_3 !== undefined){featureGroup_3.clearLayers();}

    featureGroup_2 = L.geoJson(parsedData, {
      style: style_by_mode,
      filter: myFilter
    }).addTo(map).eachLayer(popup_line_info_when_clicked).eachLayer(highlight_when_mouseover).eachLayer(highlight_when_mouseout_by_mode);

    show_both_buttons();
  }

  // Page 3:
  else if (state.slideNumber==3){
    map_zoom_UC();
    show_both_buttons();
    if(featureGroup_2 !== undefined){featureGroup_2.clearLayers();}
    if(featureGroup_4 !== undefined){featureGroup_4.clearLayers();}

    featureGroup_3 = L.geoJson(parsedData, {
      style: style_by_frequency,
      filter: myFilter
    }).addTo(map).eachLayer(popup_line_info_when_clicked).eachLayer(highlight_when_mouseover).eachLayer(highlight_when_mouseout_by_frequency);

  }

  // Page 4:
  else if (state.slideNumber==4){
    map_zoom_UC();
    show_both_buttons();
    if(featureGroup_3 !== undefined){featureGroup_3.clearLayers();}
    if(featureGroup_5 !== undefined){featureGroup_5.clearLayers();}

    featureGroup_4 = L.geoJson(parsedData, {
      style: style_by_frequency,
      filter: myFilter
    }).addTo(map).eachLayer(popup_line_info_when_clicked).eachLayer(highlight_when_mouseover).eachLayer(highlight_when_mouseout_by_frequency);

  }

  // Page 5:
  else if (state.slideNumber==5){
    map_zoom_UC();
    show_previous_button();
    if(featureGroup_4 !== undefined){featureGroup_4.clearLayers();}

    featureGroup_5 = L.geoJson(parsedData, {
      style: style_by_frequency,
      filter: myFilter
    }).addTo(map).eachLayer(popup_line_info_when_clicked).eachLayer(highlight_when_mouseover);

    featureGroup_5.eachLayer(highlight_when_mouseout_by_frequency);

  }
};



/* =====================
  Archived Code
===================== */

// Get coordinates of click event
//map.on('click', function(event) {
    // alert("Lat, Lon : " + event.latlng.lat + ", " + event.latlng.lng);
    //L.circleMarker(event.latlng).addTo(map).bindPopup("some text").openPopup();
//});


// Set styles of lines (without using switch function)
//var myStyle = function(feature) {
//  console.log(feature);
//  if(feature.properties.LINEABBR === "21"){return {color: 'red', opacity: 1.0};
//} else if(feature.properties.LINEABBR === "LUCYGR"){return {color: 'blue', opacity: 1.0};
//  } else {return {color: 'green'};
//  }
//};
