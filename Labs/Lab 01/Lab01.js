function arrayGenerator() {
    //variables
    var array = [];
    var sum = 0;
    var n = 5;

    //populating the array and calculating the sum of numbers
    for (var i=0; i<n; i++) {
        var num = Math.floor(100*(Math.random()));
        array.push(num);
        sum += num;
    }

    //calculating the mean of the generated array
    var mean = sum/array.length;

    //finding and creating an array for the numbers greater than the mean
    var greater = [];
    for (var i=0; i<n; i++) {
        if (array[i]>mean){
            greater.push(array[i]);
        }
    }

    //connecting back to HTML file
    document.querySelector("#arrayOut").innerHTML="array: "+array+ " mean: "+mean +  " greater: "+greater;
}