<?php
    use \RedBeanPHP\R as R;
    R::setup('mysql:host=127.0.0.1;dbname=mvc', 'root', '');
    R::freeze(true);
    if(!R::testConnection()){
        exit("Нет подключения к бд");
    }