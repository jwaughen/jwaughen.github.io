$(function() {
    //Adding logo to all HTML pages
    $('.logo').html("<a href=\"index.html\"><img src=\"images/Sweet Escapes Logo.png\"></a>");

    //Adding footer to all HTML pages
    $('footer').html("<p>Admin <a href=\"login.php\">Log In</a></p></br>");

});

//shopping page
var total = 0;
function shoppingCart(item,cost) {
    $('.modal-body').append("<p>"+item+" $"+cost+"</p>");
    total += cost;
}

function totalCost() {
    $('.modal-footer').prepend("<p>Total: $"+total+"</p>");
}

function updateCost() {
    $('.modal-footer>p').remove();
}

function checkout() {
    $('.toast').addClass('show');
    $('.modal-body').empty();
    $('.modal-footer>p').remove();
    total = 0;
}

//blog page





