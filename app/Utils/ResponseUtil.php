<?php

namespace App\Utils;

class ResponseUtil
{
    public static function makeResponse($message, $data): array
    {
        return [
            'success' => true,
            'data' => $data,
            'message' => $message,
        ];
    }

    public static function makeError($message, $errorMessages = [])
{
    $response = [
        'success' => false,
        'message' => $message,
    ];

    if (!empty($errorMessages)) {
        $response['data'] = $errorMessages;
    }

    return $response;
}
    // public static function makeError($message, array $data = []): array
    // {
    //     $res = [
    //         'success' => false,
    //         'message' => $message,
    //     ];

    //     if (! empty($data)) {
    //         $res['data'] = $data;
    //     }

    //     return $res;
    // }
}
