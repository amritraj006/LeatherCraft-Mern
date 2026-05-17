<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Services\JwtService;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class JwtAuthenticate
{
    public function __construct(private readonly JwtService $jwtService) {}

    public function handle(Request $request, Closure $next): Response|JsonResponse
    {
        $token = $request->bearerToken();

        if (! $token) {
            return response()->json(['message' => 'Authentication token is required.'], 401);
        }

        try {
            $payload = $this->jwtService->validate($token);
            $user = User::find($payload['sub']);
        } catch (Throwable) {
            return response()->json(['message' => 'Invalid or expired authentication token.'], 401);
        }

        if (! $user) {
            return response()->json(['message' => 'Authenticated user was not found.'], 401);
        }

        $request->setUserResolver(fn (): User => $user);

        return $next($request);
    }
}
