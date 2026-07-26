# Backend API Endpoints

Base URL: http://localhost:5000/api

## Auth
- POST /auth/register
- POST /auth/login
- GET /auth/me
- POST /auth/forgot-password
- POST /auth/reset-password/:token

## Campaigns
- POST /campaigns/add
- GET /campaigns
- GET /campaigns/:id
- PUT /campaigns/:id
- DELETE /campaigns/:id

## Dashboard
- GET /dashboard/admin
- GET /dashboard/creator
- GET /dashboard/supporter

## Donations
- POST /donations/:campaignId

## Notifications
- GET /notifications
- GET /notifications/:id
- PATCH /notifications/:id/read
- PATCH /notifications/read-all
- DELETE /notifications/:id

## Payments
- POST /payments/create-order
- POST /payments/verify
- GET /payments/history
- GET /payments/:id
- GET /payments/campaign/:campaignId/donations
- POST /payments/failure
- POST /payments/webhook
