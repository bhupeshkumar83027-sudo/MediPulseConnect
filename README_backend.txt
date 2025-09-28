Smart Healthcare - Backend files added
Files added in php/:
- db.php                -> PDO connection (update credentials)
- signup_patient.php    -> Server-side signup for patients
- login_patient.php     -> Server-side login for patients
- signup_doctor.php, signup_admin.php
- login_doctor.php, login_admin.php

Database:
- schema.sql            -> SQL dump to create database + tables

How to use:
1. Place php/ files on your PHP-enabled server (e.g., Apache with PHP 7.4+).
2. Import schema.sql into MySQL (via phpMyAdmin or mysql CLI).
3. Edit php/db.php and set DB_HOST, DB_NAME, DB_USER, DB_PASS.
4. Update your front-end forms (signup_patient.html/login_patient.html) to POST to:
   - php/signup_patient.php
   - php/login_patient.php
   For doctors/admins, POST to their respective endpoints.
5. The PHP scripts return JSON. For simple usage, form submission can be done via fetch/AJAX or regular POST and handle redirect.

Security notes:
- Passwords are hashed with password_hash().
- Prepared statements (PDO) are used to prevent SQL injection.
- Session is started on login; protect pages by checking $_SESSION['user_id'] and role.
