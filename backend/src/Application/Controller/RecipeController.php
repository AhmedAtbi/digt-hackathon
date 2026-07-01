<?php

declare(strict_types=1);

namespace App\Application\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class RecipeController
{
    private const RECIPES = [
        ['id' => 1, 'name' => 'Avocado Toast', 'emoji' => '🥑', 'cookingTime' => 5, 'difficulty' => 'Easy', 'description' => 'Crushed avocado on sourdough with chilli flakes and lime.'],
        ['id' => 2, 'name' => 'Margherita Pizza', 'emoji' => '🍕', 'cookingTime' => 25, 'difficulty' => 'Medium', 'description' => 'Blistered dough, San Marzano tomatoes, fresh mozzarella and basil.'],
        ['id' => 3, 'name' => 'Miso Ramen', 'emoji' => '🍜', 'cookingTime' => 40, 'difficulty' => 'Hard', 'description' => 'Rich miso broth, springy noodles, soft egg and spring onion.'],
        ['id' => 4, 'name' => 'Greek Salad', 'emoji' => '🥗', 'cookingTime' => 10, 'difficulty' => 'Easy', 'description' => 'Tomato, cucumber, red onion, olives and a slab of feta.'],
        ['id' => 5, 'name' => 'Beef Tacos', 'emoji' => '🌮', 'cookingTime' => 20, 'difficulty' => 'Medium', 'description' => 'Spiced beef, warm tortillas, salsa, lime and coriander.'],
        ['id' => 6, 'name' => 'Chocolate Mousse', 'emoji' => '🍫', 'cookingTime' => 15, 'difficulty' => 'Medium', 'description' => 'Airy dark-chocolate mousse finished with sea salt.'],
    ];

    #[Route('/api/recipes', name: 'app_recipes', methods: ['GET'])]
    public function __invoke(Request $request): JsonResponse
    {
        $recipes = self::RECIPES;

        $maxTime = $request->query->getInt('maxTime', 0);
        if ($maxTime > 0) {
            $recipes = array_values(array_filter(
                $recipes,
                static fn (array $recipe): bool => $recipe['cookingTime'] <= $maxTime,
            ));
        }

        if ('desc' === $request->query->get('sort')) {
            usort($recipes, static fn (array $a, array $b): int => $b['cookingTime'] <=> $a['cookingTime']);
        } elseif ('asc' === $request->query->get('sort')) {
            usort($recipes, static fn (array $a, array $b): int => $a['cookingTime'] <=> $b['cookingTime']);
        }

        return new JsonResponse(['recipes' => $recipes]);
    }
}
