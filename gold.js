var Client = require('node-rest-client').Client;

var client = new Client();
var bid = 20300;

var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert("goldapplication-29bfa-firebase-adminsdk-oe3gv-f169ee8519.json"),
  databaseURL: "https://goldapplication-29bfa.firebaseio.com/"
});

var request = require('request');

var db = admin.database();

var minutes = 10, the_interval = minutes * 60 * 1000;
setInterval(function() {
  console.log("I am doing my 1 minutes check");

  if (getTime() >= 9 && getTime() <= 18){
    console.log("time");
    client.get("http://www.thaigold.info/RealTimeDataV2/gtdata_.txt", function (data, response) {
      // parsed response body as js object
     var textValue = data.toString('utf8');
     var value = JSON.parse(textValue);


     if (value[4].bid !== bid){
       var ref_datesub = db.ref("project/");
      console.log(value[4].bid );
      var pricesRef = ref_datesub.child("price");

      pricesRef.push({
        time: getDateTime(),
        priceBid: value[4].bid,
        diff : value[4].bid - bid
     });

     var diffs = value[4].bid - bid;


    request({
    url: 'https://fcm.googleapis.com/fcm/send',
    method: 'POST',
    headers: {
      'Content-Type' :' application/json',
      'Authorization': 'key='+'AAAA_QV0_cs:APA91bHZTcAJPmoG5eJTGBPFrVn46CgW8_mZOqfPDBW3zCuKMPHF1S9pAqcWGn8DKshDM4do2nlRpT78ct5Vd2zcAg8T5wH76CJG4ZKvyJOI04g7-8qcKkBb9uF8fHvToCarI2wzgglI'
    },
    body: JSON.stringify({
      notification: {
        title: 'ราคาทองคำมีการเปลี่ยนแปลง',
        body: diffs + " บาท"
      },
      to : '/topics/gold'
    })
  }, function(error, response, body) {
    if (error) { console.error(error); }
    else if (response.statusCode >= 400) {
      console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage);
    }
    else {
      console.log("success");
    }
  });

      bid = value[4].bid;
     }

  });
}
}, the_interval);



function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return day+month+year+hour+min;

}

function getTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    return hour;

}
