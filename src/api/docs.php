<?php
    header('Content-type: application/json');
    require_once __DIR__."/vendor/autoload.php";
    use Yosymfony\Toml\Toml;
    
    $root = __DIR__.'/../website-docs/';
    $categories = Toml::ParseFile($root.'categories.toml');

    $result = [];

    foreach ($categories as $category => $title) {
        $result[$category] = [
            "title" => $title,
            "items" => []
        ]; 
        $path = $root."$category/";
        $docs = array_diff(scandir($path), ['..', '.']);
        foreach ($docs as $doc) {
            $path = $root."$category/$doc/";
            
            $files = scandir($path);
            // Exclude toml file, dots and as the second argument - .tex files
            $files = array_diff($files, array_merge(
                ['index.toml', '..', '.'], 
                preg_grep("/^.*\.(tex|aux|fd|bst|bbl|blg|brf|cls|dtx)$/i", $files)
            ));
            $document = Toml::ParseFile("$path/index.toml");
            if (in_array("album", $files))
                $document['album'] = array_values(array_diff(scandir("$path/album"), ['..', '.'])); 
            $document['path'] = str_replace("/var/www/html/api/..","https://yktsat.sjsa.ru",$path);
            $document['items'] = array_values(array_diff($files, ['album']));
            array_push($result[$category]['items'], $document);
        }
    }
    
    echo json_encode($result);