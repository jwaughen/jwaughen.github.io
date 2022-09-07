function getInfo() {
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]; //array of months
    //obtaining date items
    var date = new Date;
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDay();
    var hour = date.getHours();
    var minute = date.getMinutes();

    month = months[month]; //changing numerical month to equivalent month name

    if (minute<10) { //adding a 0 in minutes when mintues is a single digit
        minute = "0" + minute;
    }

    //changing the hour based on what is selected on website
    hours12 = ( document.getElementById("hours").selectedIndex==0 ? true : false );
    hour = (hours12 ? hour%12 : hour);

    return [year,month,day,hour,minute]; //returns array of date items after updates
}

function dateAlert() { //function that sends an alert
    var dayValues = getInfo();
    alert("The date is "+ dayValues[1] + " " + dayValues[2] +", " + dayValues[0] + ". The time is " + dayValues[3] +":"+dayValues[4]+".");
}

function datePopUp() { //function that sends HTML back to div tag
    var dayValues = getInfo();
    document.querySelector("#onPage").innerHTML="The date is " + dayValues[1] + " " + dayValues[2] +", " + dayValues[0] + ".<br> The time is " + dayValues[3] +":"+dayValues[4]+".";
}