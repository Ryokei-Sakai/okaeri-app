<?php

$json_string = file_get_contents('php://input');
$json_object = json_decode($json_string);

foreach ($json_object->events as $event) {
    if('message' == $event->type){
        api_post_request($event->replyToken, $event->message->text);
    }else if('beacon' == $event->type){
        api_post_request($event->replyToken, 'おかえり');
    }
}

function api_post_request($token, $message) {
    $url = 'https://api.line.me/v2/bot/message/reply';
    $channel_access_token = 'qJdBq6LTx7fZ2YjDWP0T9KYN7ak8+5ZPPZG41KphY52IFkYSB9PxNd+ra4WcgnaiBDWSQq7hY1RB1XhxUXvrYV8PUxGNKfvlnG4Y9Kz0UzJbtQnqU9w6idHudrFz3arUC5LBsX8s1YRKRoFpfHjM1AdB04t89/1O/w1cDnyilFU=';
    $headers = array(
        'Content-Type: application/json',
        "Authorization: Bearer {$channel_access_token}"
    );
    $post = array(
        'replyToken' => $token,
        'messages' => array(
            array(
                'type' => 'text',
                'text' => $message
            )
        )
    );

    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($post));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_exec($curl);
}
