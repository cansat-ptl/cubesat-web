<?php
    class Controller
    {
        public function view($view, $data = [])
        {
            require_once "../app/views/" . $view . ".php";
        }
        public function request(){
            require_once "../app/core/Request.php";
            return new Request;
        }    
    }