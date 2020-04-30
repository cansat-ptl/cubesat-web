<?php
    class Home extends Controller 
    {
        public function index()
        {
            
        }
        public function name($name = '')
        {
            return $this->request()->all();
        }
    }