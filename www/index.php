<?php
session_start();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accueil - LocalHeb </title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            text-align: center;
            max-width: 600px;
        }
        h1 {
            color: #667eea;
            margin-bottom: 20px;
        }
        p {
            color: #555;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .nav-links {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        }
        a {
            display: inline-block;
            padding: 10px 20px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            transition: background 0.3s;
        }
        a:hover {
            background: #764ba2;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Bienvenue sur LocalHeb kaka a jours444🚀</h1>
        <p>Ceci est la page d'accueil de votre application web locale hébergée avec Docker et synchronisée avec GitHub & Alwaysdata.</p>
        <p>Version mise à jour le <?php echo date('d/m/Y'); ?></p>
        <p>Explorez les pages disponibles :</p>
        <div class="nav-links">
            <a href="index.php">Accueil</a>
            <a href="about.php">À propos</a>
        </div>
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #999;">
            <?php echo "Date : " . date('d/m/Y H:i:s'); ?>
        </p>
    </div>
</body>
</html>
