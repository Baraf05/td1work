<?php
session_start();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>À propos - LocalHebsss</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
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
            margin-bottom: 15px;
        }
        .nav-links {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 30px;
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
        <h1>À propos</h1>
        <p><strong>LocalHeb</strong> est une application web moderne développée avec PHP et Docker.</p>
        <p>Cette application démontre l'utilisation de :</p>
        <ul style="text-align: left; display: inline-block; margin: 20px 0;">
            <li>PHP 8.2 avec Apache</li>
            <li>MySQL pour la base de données</li>
            <li>Docker pour la containerisation</li>
            <li>phpMyAdmin pour la gestion des données</li>
        </ul>
        <p>Développé par <strong>Baran</strong> - 2026</p>
        <div class="nav-links">
            <a href="index.php">Accueil</a>
            <a href="about.php">À propos</a>
        </div>
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #999;">
            <?php echo "Généré le : " . date('d/m/Y à H:i:s'); ?>
        </p>
    </div>
</body>
</html>
