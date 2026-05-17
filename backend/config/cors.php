<?php

$frontendOrigins = array_filter(array_map(
    'trim',
    explode(',', env('FRONTEND_URL', 'http://localhost:5173,http://127.0.0.1:5173'))
));

return [
    'paths' => ['api/*', 'storage/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => $frontendOrigins,
    'allowed_origins_patterns' => ['#^http://(localhost|127\.0\.0\.1):517[0-9]$#'],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
