<!DOCTYPE html>
<html>
    <head>
        <title>Sweet Escapes</title>
        <link rel="shortcut icon" href="images/Sweet Escapes Logo White.png">
        <link rel="stylesheet" href="styles.css">
        <!-- CSS only -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
        <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
        <script type="text/javascript" src="script.js"></script>

        <meta charset="UTF-8">
        <meta name="description" content="A Baking Website Project for Juniata College">
        <meta name="author" content="Jenna Waughen">
    </head>
    <body>
        <header>
            <div class="logo"></div>
        </header>
        <nav class="navbar navbar-expand-lg navbar-dark sticky-top" aria-label="Tenth navbar example">
            <div class="container-fluid">        
                <div class="collapse navbar-collapse justify-content-md-center">
                    <ul class="navbar-nav">
                        <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
                        <li class="nav-item"><a class="nav-link" href="shop.html">Shop</a></li>
                        <li class="nav-item"><a class="nav-link" href="blog.html">Blog</a></li>
                        <li class="nav-item"><a class="nav-link active" aria-current="page" href="news.html">News</a></li>
                        <li class="nav-item"><a class="nav-link" href="contact.html">Contact</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <div class="grid-container" id="login-grid">

            <form action="adminAccess.php" method="post">
                <div class="mb-3 mt-3">
                  <label for="username" class="form-label">Username:</label>
                  <input type="text" class="form-control" id="username" placeholder="Enter username" name="username" required>
                </div>
                <div class="mb-3">
                  <label for="pwd" class="form-label">Password:</label>
                  <input type="password" class="form-control" id="pwd" placeholder="Enter password" name="pswd" required>
                </div>
                <div class="form-check mb-3">
                  <label class="form-check-label">
                    <input class="form-check-input" type="checkbox" name="remember"> Remember me
                  </label>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
              </form>
        </div>

    </body>
    <footer></footer>
</html>