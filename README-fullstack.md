# LeatherCraft Seller AI Design App

Full-stack seller panel for uploading leather product images, generating AI design concepts, saving designs, viewing a gallery, deleting designs, and downloading generated images.

## Structure

```text
seller/   React + Vite + Tailwind
backend/  Laravel API
```

## Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
php artisan serve --host=127.0.0.1 --port=8000
```

Set MySQL and services in `.env`:

```env
DB_CONNECTION=mysql
DB_DATABASE=leathercraft_seller
DB_USERNAME=root
DB_PASSWORD=
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
AI_API_KEY=
```

For phpMyAdmin, start MySQL, open phpMyAdmin, go to the SQL tab, and import or paste:

```text
backend/database/mysql_schema.sql
```

If `CLOUDINARY_URL` is empty, images are stored on Laravel's public disk for local development. If `AI_API_KEY` is empty or HuggingFace inference fails, the API returns a generated mock preview image.

## Frontend

```bash
cd seller
npm install
cp .env.example .env
npm run dev -- --host 127.0.0.1 --port 5173
```

`VITE_API_BASE_URL` should point to the Laravel API, usually:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## API

- `POST /api/register`
- `POST /api/login`
- `GET /api/user`
- `POST /api/product/upload`
- `GET /api/products`
- `POST /api/ai/generate`
- `POST /api/design/save`
- `GET /api/designs`
- `DELETE /api/design/{id}`

## Checks

```bash
cd backend && php artisan test && ./vendor/bin/pint --test
cd seller && npm run lint && npm run build
```
