<?php

namespace App\Services;

use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class CloudinaryService
{
    /**
     * @return array{url: string, provider: string, public_id: string|null}
     */
    public function uploadUploadedFile(UploadedFile $file, string $folder): array
    {
        $extension = $file->getClientOriginalExtension()
            ?: $file->guessExtension()
            ?: 'jpg';

        return $this->uploadBinary(
            file_get_contents($file->getRealPath()) ?: '',
            $extension,
            $folder
        );
    }

    /**
     * @return array{url: string, provider: string, public_id: string|null}
     */
    public function uploadBinary(string $contents, string $extension, string $folder): array
    {
        if ($this->isConfigured()) {
            return $this->uploadToCloudinary($contents, $extension, $folder);
        }

        $path = trim($folder, '/').'/'.Str::uuid().'.'.ltrim($extension, '.');
        Storage::disk('public')->put($path, $contents);
        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk('public');
        $url = $disk->url($path);

        return [
            'url' => str_starts_with($url, 'http') ? $url : url($url),
            'provider' => 'local',
            'public_id' => $path,
        ];
    }

    private function isConfigured(): bool
    {
        $credentials = $this->credentials();

        return (bool) ($credentials['cloud_name'] && $credentials['api_key'] && $credentials['api_secret']);
    }

    /**
     * @return array{cloud_name: ?string, api_key: ?string, api_secret: ?string}
     */
    private function credentials(): array
    {
        $url = Config::get('services.cloudinary.url');
        $parts = $url ? parse_url($url) : false;
        $urlCloudName = is_array($parts) ? ($parts['host'] ?? null) : null;
        $urlApiKey = is_array($parts) ? ($parts['user'] ?? null) : null;
        $urlApiSecret = is_array($parts) ? ($parts['pass'] ?? null) : null;

        return [
            'cloud_name' => Config::get('services.cloudinary.cloud_name')
                ?: $urlCloudName,
            'api_key' => Config::get('services.cloudinary.api_key')
                ?: ($urlApiKey ? rawurldecode($urlApiKey) : null),
            'api_secret' => Config::get('services.cloudinary.api_secret')
                ?: ($urlApiSecret ? rawurldecode($urlApiSecret) : null),
        ];
    }

    /**
     * @return array{url: string, provider: string, public_id: string|null}
     */
    private function uploadToCloudinary(string $contents, string $extension, string $folder): array
    {
        $credentials = $this->credentials();
        $endpoint = sprintf('https://api.cloudinary.com/v1_1/%s/auto/upload', $credentials['cloud_name']);
        $filename = Str::uuid().'.'.ltrim($extension, '.');

        $response = Http::timeout(90)
            ->withBasicAuth($credentials['api_key'], $credentials['api_secret'])
            ->asMultipart()
            ->attach('file', $contents, $filename)
            ->post($endpoint, [
                'folder' => trim($folder, '/'),
            ]);

        if (! $response->successful()) {
            throw new RuntimeException('Cloudinary upload failed: '.$response->body());
        }

        $payload = $response->json();
        $url = $payload['secure_url'] ?? $payload['url'] ?? null;

        if (! $url) {
            throw new RuntimeException('Cloudinary upload did not return a URL.');
        }

        return [
            'url' => $url,
            'provider' => 'cloudinary',
            'public_id' => $payload['public_id'] ?? null,
        ];
    }
}
