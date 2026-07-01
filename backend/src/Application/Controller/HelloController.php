<?php

declare(strict_types=1);

namespace App\Application\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class HelloController
{
    #[Route('/api/hello', name: 'app_hello', methods: ['GET'])]
    public function __invoke(): JsonResponse
    {
        return new JsonResponse(['message' => 'Hello from Symfony 👋']);
    }
}
