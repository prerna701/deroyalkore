# Express + TypeScript Boilerplate

A small, easy-to-read, production-ready starting point for building REST APIs.
Layered architecture, uniform API responses, centralized error handling,
and schema-based validation — with one fully working example module (`users`)
you can copy for every new feature.

## Stack

- Express 4 + TypeScript
- Zod (validation)
- Winston + Morgan (logging)
- Helmet, CORS, compression, rate limiting

## Quick start

```bash
npm install
cp .env.example .env
npm run dev        # http://localhost:7000/api/v1/health
```

Build & run for production:

```bash
npm run build
npm start
```

## Folder structure

```
src/
  config/         # env loading + validation (single source of truth for config)
  controllers/     # HTTP layer only - read req, call a service, send a response
  services/        # business logic - validation rules, orchestration
  repositories/     # data access - the ONLY place that talks to a database
  routes/          # wires: path + method -> validate() -> controller
  middlewares/     # validate, errorHandler, notFound, rateLimiter
  validations/     # one Zod schema per route/action
  utils/           # ApiResponse, ApiError, asyncHandler, logger
  types/           # shared TypeScript types
  app.ts           # express app + middleware pipeline (no listen())
  server.ts        # starts the HTTP server, graceful shutdown
```

**Request flow:** `route -> validate middleware -> controller -> service -> repository`
Data flows back up the same chain, and the controller hands the final
result to `ApiResponse` to send it.

## Every response looks the same

Success:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users fetched successfully",
  "data": [ ... ],
  "meta": { "page": 1, "limit": 10, "total": 42 }
}
```

Error:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "details": [
    { "field": "body.email", "message": "Must be a valid email address" }
  ]
}
```

You never build this JSON by hand:
- Success → `ApiResponse.ok(res, data, message, meta)` / `.created(...)` / `.noContent(...)`
- Error → `throw new ApiError(...)` (or `ApiError.notFound()`, `.badRequest()`, `.conflict()`, etc.)
  from **anywhere** — controller, service, or repository. It's caught automatically and
  formatted by the global error handler in `src/middlewares/errorHandler.ts`.

## Adding a new module (e.g. "product")

Copy the `user` module pattern, file for file:

1. `src/types/product.types.ts` — interfaces for the entity + create/update inputs
2. `src/repositories/product.repository.ts` — data access (swap the in-memory array for your DB)
3. `src/services/product.service.ts` — business rules, calls the repository
4. `src/validations/product.validation.ts` — Zod schemas for each action
5. `src/controllers/product.controller.ts` — thin handlers wrapped in `asyncHandler`
6. `src/routes/product.routes.ts` — wire method + path + validate + controller
7. Mount it in `src/routes/index.ts`: `router.use('/products', productRoutes)`

Nothing else needs to change. Controllers never import repositories directly,
and services never import Express types — that separation is what keeps each
layer independently testable and swappable (e.g. plug in Prisma or Mongoose
in the repository layer only).

## Validation

Every route that needs input validation uses the `validate()` middleware with
a Zod schema shaped like `{ body, params, query }` (include only the keys you need):

```ts
router.post('/', validate(createUserSchema), userController.createUser);
```

On success, `req.body/params/query` are replaced with the parsed, type-coerced
values. On failure, a `400` is thrown automatically with a `details` array of
`{ field, message }` — the controller never has to check anything itself.

## Error handling

Throw `ApiError` (or one of its static helpers) anywhere and it's handled centrally:

```ts
if (!user) throw ApiError.notFound(`User with id '${id}' not found`);
```

Anything that ISN'T an `ApiError` (a genuine bug) is logged with full detail
and returns a generic `500` in production, or the real message + stack trace
in development.

## Swapping in a real database

The `repositories/` layer is the only place using an in-memory array. Replace
the method bodies in `user.repository.ts` with your ORM/driver of choice
(Prisma, Mongoose, Knex, raw SQL, etc). The method signatures (`findAll`,
`findById`, `create`, `update`, `delete`) are what the service layer depends on —
keep those the same and everything above it keeps working unchanged.

## Environment variables

See `.env.example`. All variables are validated at startup via Zod in
`src/config/env.ts` — if something required is missing or malformed, the app
fails immediately with a clear error instead of misbehaving later.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Run with ts-node + nodemon (auto-restart on change) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled JS (production) |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run format` | Prettier |
