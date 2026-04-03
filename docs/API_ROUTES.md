# API Routes

Base URL: `/api`

## Auth

- `POST /auth/login`
- `GET /auth/me`

## Dashboard

- `GET /dashboard`

## Clients

- `GET /clients`
- `POST /clients`
- `PUT /clients/:clientId`
- `DELETE /clients/:clientId`

## Products

- `GET /products`
- `POST /products`
- `PUT /products/:productId`
- `DELETE /products/:productId`

## Invoices

- `GET /invoices`
- `GET /invoices/:invoiceId`
- `POST /invoices`
- `PUT /invoices/:invoiceId`
- `DELETE /invoices/:invoiceId`
- `POST /invoices/:invoiceId/send`
- `GET /invoices/:invoiceId/pdf`

## Estimates

- `GET /quotes`
- `GET /quotes/:quoteId`
- `POST /quotes`
- `PUT /quotes/:quoteId`
- `DELETE /quotes/:quoteId`
- `POST /quotes/:quoteId/convert`
- `GET /quotes/:quoteId/pdf`

## Payments

- `GET /payments`
- `POST /payments`
- `PUT /payments/:paymentId`
- `DELETE /payments/:paymentId`

## Recurring Templates

- `GET /recurring`
- `POST /recurring`
- `PUT /recurring/:profileId`
- `DELETE /recurring/:profileId`
- `POST /recurring/:profileId/generate`

## Settings

- `GET /settings`
- `PUT /settings`
