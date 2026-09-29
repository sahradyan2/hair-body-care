<?php
// Вимикаємо вивід помилок у відповідь (щоб не псувати JSON)
error_reporting(0);

// --- НАЛАШТУВАННЯ TELEGRAM ---
$token = "8531871142:AAH_1lW5eBLhXuthEWyHlGPppM8sW92Jsm4";
$chat_id = "-1003857231203";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $product = strip_tags($_POST['product']);
    $name = strip_tags($_POST['name']);
    $phone = strip_tags($_POST['phone']);
    $promo = strip_tags($_POST['promo']); // Принимаем промокод
    $message_text = strip_tags($_POST['message']);

    if (!empty($promo)) {
        $message .= "<b>🎁 Промокод:</b> " . $promo . "\n";
    }

    if (!empty($message_text)) {
        $message .= "<b>💬 Коментар:</b> " . $message_text . "\n";
    }

    // Формуємо текст повідомлення
    $message = "<b>🚀 Нове замовлення!</b>\n\n";
    $message .= "<b>📦 Товар:</b> " . $product . "\n";
    $message .= "<b>👤 Ім'я:</b> " . $name . "\n";
    $message .= "<b>📞 Телефон:</b> " . $phone;
    if (!empty($promo)) {
        $message .= "<b>🎁 Промокод:</b> " . $promo . "\n";
    }
    if (!empty($message_text)) {
        $message .= "<b>💬 Коментар:</b> " . $message_text;
    }


    // Відправка через cURL
    $url = "https://api.telegram.org/bot{$token}/sendMessage";
    $data = [
        'chat_id' => $chat_id,
        'text' => $message,
        'parse_mode' => 'html'
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, false);
    $res = curl_exec($ch);
    curl_close($ch);

    $res_json = json_decode($res, true);

    if ($res_json['ok']) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Telegram API error"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
}
?>