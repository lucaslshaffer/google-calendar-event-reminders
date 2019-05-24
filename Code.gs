/**
 * Lists 10 upcoming events in the user's calendar.
 */
function listUpcomingEvents() {
  var emailHTML = "";
  var calendarId = 'primary';
  
  var now = new Date().toISOString()
  var dayone = new Date();
  dayone.setDate(dayone.getDate()+1);
  
  var optionalArgs = {
    timeMin: (new Date()).toISOString(),
    showDeleted: false,
    singleEvents: true,
    maxResults: 200,
    orderBy: 'startTime'
  };
  
  var response = Calendar.Events.list(calendarId, optionalArgs);
  var events = response.items;
  
  if (events.length > 0) {
    for (i = 0; i < events.length; i++) {
      var event = events[i];
      var when = event.start.dateTime;
      var what = event.description;
      var whom = event.attendees;
      var emailList = "";
      if (!when) {
        when = event.start.date;
      }
      //Logger.log('%s (%s)', event.summary, when);
      
      for(var d=0; whom!=null && d<whom.length; d++)
      {
        emailList = emailList + "," + whom[d].email;
        
      }
      emailList = emailList.substr(1);
      
      var locationView = "";
      var dateView = new Date(events[i].start.dateTime);
      if (events[i].location){
        locationView = "<br><br>Please confirm we are meeting at " + events[i].location + " at " + parseISOString(events[i].start.dateTime);
      } else {
        locationView = "<br><br>Please confirm we are meeting at " + parseISOString(events[i].start.dateTime);
      }
      
      if (what)
      {
        
      } else {
        what = "";
      }
      
      
      if (events[i].start.dateTime > now && events[i].start.dateTime < dayone.toISOString())
        {
          //Logger.log("PASS" + events[i].displayName + " - " + events[i].email);
          
             MailApp.sendEmail({
                to: emailList,
                //to: "lucas@standandstretch.com",
                subject: "[Reminder] " + event.summary,
                htmlBody: "This is just a friendly reminder." + locationView + "<br><br>" + what
            });
        } else {
          //Logger.log("FAIL" + events[i].displayName + " - " + events[i].email);
        }
      
      //Logger.log(template.evaluate().getContent());
         
    }
  } else {
    Logger.log('No upcoming events found.');
  }
}

function parseISOString(x) {
  if (x) {
    MM = {Jan:"January", Feb:"February", Mar:"March", Apr:"April", May:"May", Jun:"June", Jul:"July", Aug:"August", Sep:"September", Oct:"October", Nov:"November", Dec:"December"}
    
    xx = String(new Date(x)).replace(/\w{3} (\w{3}) (\d{2}) (\d{4}) (\d{2}):(\d{2}):[^(]+\(([A-Z]{3})\)/,
      function($0,$1,$2,$3,$4,$5,$6){
        return MM[$1]+" "+$2+", "+$3+" - "+$4%12+":"+$5+(+$4>11?"PM":"AM")+" "+$6 
      }
    )
  
  return xx;}
}
