<?php

$isDevelopment = $_SERVER['HTTP_HOST'] === 'localhost' || $_SERVER['HTTP_HOST'] === '127.0.0.1';

if ($isDevelopment) {
	 header( 'Location: ./index-app.html');
}
else {
	header( 'Location: ./build/Radio/production/index-app.html');
}
?>