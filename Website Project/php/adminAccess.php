<!doctype html>
<html>
    <head>
    </head>
    <body>
    <?php
          require 'functions.php';
          if (checkAdminLogin($_POST['username'],$_POST['pswd'])) {
            echo "Hello "; echo $_POST['username'];
          }
        ?>
    </body> 
</html>