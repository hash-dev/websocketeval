<?php
 
$file = __DIR__ . "/example.xml";
$pattern = '/Random Data: \d+/i';
 
while(true) {
    $randomInt = rand(0, 10000);
    $replaceString = "Random Data: " . $randomInt;
 
    $fhandle = fopen($file, "r");
    $content = fread($fhandle, filesize($file));
    $content = preg_replace($pattern, $replaceString, $content);
 
    $fhandle = fopen($file, "w");
    fwrite($fhandle, $content);
    fclose($fhandle);
 
    sleep(1);
}
 
?>