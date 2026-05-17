<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Admins fetch global admin notifications (user_id is null)
        if ($user->role === 'admin') {
            $notifications = Notification::whereNull('user_id')
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            // Shoppers and Sellers fetch their owned notifications
            $notifications = Notification::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return response()->json([
            'success' => true,
            'notifications' => $notifications,
        ]);
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            Notification::whereNull('user_id')
                ->where('is_read', false)
                ->update(['is_read' => true]);
        } else {
            Notification::where('user_id', $user->id)
                ->where('is_read', false)
                ->update(['is_read' => true]);
        }

        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read.',
        ]);
    }

    public function markAsRead(Request $request, Notification $notification): JsonResponse
    {
        $user = $request->user();

        // Security check
        if ($user->role !== 'admin' && $notification->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized action.',
            ], 403);
        }

        $notification->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'notification' => $notification,
        ]);
    }
}
