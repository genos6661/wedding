<?php
/**
 * ucapan.php
 * ----------
 * GET    ucapan.php          → semua ucapan
 * POST   ucapan.php          → simpan ucapan baru
 * DELETE ucapan.php          → hapus ucapan milik sendiri
 *
 * DELETE body JSON:
 * {
 *   "id":          "msg_abc123",   // wajib — ID ucapan yang akan dihapus
 *   "player_name": "Nama Tamu"     // wajib — harus cocok dengan name di data
 * }
 */

// ---- konfigurasi ----
define('DATA_FILE', __DIR__ . '/ucapan.json');
define('MAX_ENTRIES', 500);
define('MAX_NAME_LEN', 80);
define('MAX_MSG_LEN', 500);

// ---- CORS & header ----
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ---- helper ----
function respond(int $code, array $payload): void {
    http_response_code($code);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function readData(): array {
    if (!file_exists(DATA_FILE)) return [];
    $raw = file_get_contents(DATA_FILE);
    if ($raw === false || trim($raw) === '') return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function writeData(array $data): bool {
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    $tmp  = DATA_FILE . '.tmp';
    if (file_put_contents($tmp, $json, LOCK_EX) === false) return false;
    return rename($tmp, DATA_FILE);
}

function sanitize(string $str, int $maxLen): string {
    $str = trim($str);
    $str = strip_tags($str);
    $str = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $str);
    return mb_substr($str, 0, $maxLen, 'UTF-8');
}

// ---- routing ----
$method = $_SERVER['REQUEST_METHOD'];

// ==========================================================
// GET — kembalikan semua ucapan (terbaru di atas)
// ==========================================================
if ($method === 'GET') {
    $data = readData();
    usort($data, fn($a, $b) => strcmp($b['created_at'], $a['created_at']));
    respond(200, [
        'status'  => 'ok',
        'total'   => count($data),
        'entries' => $data,
    ]);
}

// ==========================================================
// POST — simpan ucapan baru
// ==========================================================
if ($method === 'POST') {
    $raw  = file_get_contents('php://input');
    $body = json_decode($raw, true);

    if (!is_array($body)) {
        respond(400, ['status' => 'error', 'message' => 'Request body harus berupa JSON.']);
    }

    $name       = isset($body['name'])       ? sanitize((string)$body['name'], MAX_NAME_LEN)  : '';
    $attendance = isset($body['attendance']) ? sanitize((string)$body['attendance'], 10)       : '';
    $message    = isset($body['message'])    ? sanitize((string)$body['message'], MAX_MSG_LEN) : '';

    if ($name === '') {
        respond(400, ['status' => 'error', 'message' => 'Field "name" wajib diisi.']);
    }
    if (!in_array($attendance, ['hadir', 'tidak'], true)) {
        respond(400, ['status' => 'error', 'message' => 'Field "attendance" harus "hadir" atau "tidak".']);
    }

    $data = readData();
    if (count($data) >= MAX_ENTRIES) {
        respond(429, ['status' => 'error', 'message' => 'Kapasitas penyimpanan ucapan sudah penuh.']);
    }

    $entry = [
        'id'         => uniqid('msg_', true),
        'name'       => $name,
        'attendance' => $attendance,
        'message'    => $message,
        'created_at' => date('c'),
    ];

    $data[] = $entry;

    if (!writeData($data)) {
        respond(500, ['status' => 'error', 'message' => 'Gagal menyimpan data. Periksa permission file/folder.']);
    }

    respond(201, [
        'status'  => 'ok',
        'message' => 'Ucapan berhasil disimpan.',
        'entry'   => $entry,
    ]);
}

// ==========================================================
// DELETE — hapus ucapan milik sendiri
// Validasi: id harus ada, dan player_name harus cocok dengan
// field "name" pada entri yang akan dihapus (case-insensitive).
// ==========================================================
if ($method === 'DELETE') {
    $raw  = file_get_contents('php://input');
    $body = json_decode($raw, true);

    if (!is_array($body)) {
        respond(400, ['status' => 'error', 'message' => 'Request body harus berupa JSON.']);
    }

    $id          = isset($body['id'])          ? trim((string)$body['id'])          : '';
    $playerName  = isset($body['player_name']) ? sanitize((string)$body['player_name'], MAX_NAME_LEN) : '';

    if ($id === '') {
        respond(400, ['status' => 'error', 'message' => 'Field "id" wajib diisi.']);
    }
    if ($playerName === '') {
        respond(400, ['status' => 'error', 'message' => 'Field "player_name" wajib diisi.']);
    }

    $data  = readData();
    $index = null;

    foreach ($data as $i => $entry) {
        if ($entry['id'] === $id) {
            $index = $i;
            break;
        }
    }

    if ($index === null) {
        respond(404, ['status' => 'error', 'message' => 'Ucapan tidak ditemukan.']);
    }

    // verifikasi kepemilikan — nama harus cocok (case-insensitive)
    if (mb_strtolower($data[$index]['name'], 'UTF-8') !== mb_strtolower($playerName, 'UTF-8')) {
        respond(403, ['status' => 'error', 'message' => 'Kamu hanya bisa menghapus ucapanmu sendiri.']);
    }

    array_splice($data, $index, 1);

    if (!writeData($data)) {
        respond(500, ['status' => 'error', 'message' => 'Gagal menyimpan data.']);
    }

    respond(200, [
        'status'  => 'ok',
        'message' => 'Ucapan berhasil dihapus.',
    ]);
}

// method lain tidak didukung
respond(405, ['status' => 'error', 'message' => 'Method tidak didukung.']);