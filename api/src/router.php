<?php
declare(strict_types=1);

final class Router {
    private array $routes = [];
    public function __construct(private string $prefix) {}

    private function add(string $method, string $path, array $handler, ?string $role): void {
        $this->routes[] = [$method, $path, $handler, $role];
    }
    public function get(string $p, array $h, ?string $r = null): void    { $this->add('GET', $p, $h, $r); }
    public function post(string $p, array $h, ?string $r = null): void   { $this->add('POST', $p, $h, $r); }
    public function patch(string $p, array $h, ?string $r = null): void  { $this->add('PATCH', $p, $h, $r); }
    public function delete(string $p, array $h, ?string $r = null): void { $this->add('DELETE', $p, $h, $r); }

    public function dispatch(): void {
        $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
        $uri = rtrim(substr($uri, strlen($this->prefix)) ?: '/', '/') ?: '/';
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

        foreach ($this->routes as [$m, $path, $handler, $role]) {
            if ($m !== $method) { continue; }
            $pattern = '#^' . preg_replace('#\{(\w+)\}#', '(?P<$1>[^/]+)', $path) . '$#';
            if (!preg_match($pattern, $uri, $matches)) { continue; }
            if ($role !== null) { guard($role); }
            $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
            [$class, $fn] = $handler;
            (new $class())->$fn($params);
            return;
        }
        respond(404, ['error' => 'not_found']);
    }
}
