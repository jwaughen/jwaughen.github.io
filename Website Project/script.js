$(function() {
    //Adding logo to all HTML pages
    $('.logo').html("<a href=\"index.html\"><img src=\"images/Sweet Escapes Logo.png\"></a>");

    //Adding footer to all HTML pages
    $('footer').html("<p>In Progress</p></br>");

});

document.getElementById("contact-submit").onclick = function() {
  var toastElList = [].slice.call(document.querySelectorAll('.toast'));
  var toastList = toastElList.map(function(toastEl) {
    return new bootstrap.Toast(toastEl);
  });
  toastList.forEach(toast => toast.show());
}



