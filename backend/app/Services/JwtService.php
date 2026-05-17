<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use JsonException;
use RuntimeException;
use UnexpectedValueException;

class JwtService
{
    public function issue(User $user): string
    {
        $now = Carbon::now();
        $ttl = max(1, (int) Config::get('services.jwt.ttl', 1440));

        return $this->encode([
            'iss' => Config::get('app.url'),
            'sub' => $user->id,
            'role' => $user->role,
            'iat' => $now->timestamp,
            'exp' => $now->copy()->addMinutes($ttl)->timestamp,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function validate(string $token): array
    {
        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            throw new UnexpectedValueException('Malformed token.');
        }

        [$encodedHeader, $encodedPayload, $encodedSignature] = $parts;
        $expectedSignature = $this->base64UrlEncode(
            hash_hmac('sha256', "{$encodedHeader}.{$encodedPayload}", $this->secret(), true)
        );

        if (! hash_equals($expectedSignature, $encodedSignature)) {
            throw new UnexpectedValueException('Invalid token signature.');
        }

        try {
            $payload = json_decode($this->base64UrlDecode($encodedPayload), true, flags: JSON_THROW_ON_ERROR);
        } catch (JsonException $exception) {
            throw new UnexpectedValueException('Invalid token payload.', previous: $exception);
        }

        if (! is_array($payload) || empty($payload['sub'])) {
            throw new UnexpectedValueException('Token subject is missing.');
        }

        if (($payload['exp'] ?? 0) < Carbon::now()->timestamp) {
            throw new UnexpectedValueException('Token has expired.');
        }

        return $payload;
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function encode(array $payload): string
    {
        $encodedHeader = $this->base64UrlEncode(json_encode([
            'alg' => 'HS256',
            'typ' => 'JWT',
        ], JSON_THROW_ON_ERROR));

        $encodedPayload = $this->base64UrlEncode(json_encode($payload, JSON_THROW_ON_ERROR));
        $signature = $this->base64UrlEncode(
            hash_hmac('sha256', "{$encodedHeader}.{$encodedPayload}", $this->secret(), true)
        );

        return "{$encodedHeader}.{$encodedPayload}.{$signature}";
    }

    private function secret(): string
    {
        $secret = Config::get('services.jwt.secret') ?: Config::get('app.key');

        if (str_starts_with($secret, 'base64:')) {
            $decoded = base64_decode(substr($secret, 7), true);
            $secret = $decoded ?: $secret;
        }

        if (! $secret) {
            throw new RuntimeException('JWT secret is not configured.');
        }

        return $secret;
    }

    private function base64UrlEncode(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }

    private function base64UrlDecode(string $value): string
    {
        $remainder = strlen($value) % 4;

        if ($remainder) {
            $value .= str_repeat('=', 4 - $remainder);
        }

        return base64_decode(strtr($value, '-_', '+/'), true) ?: '';
    }
}
