# 📘 WizeExample API

[![status](https://img.shields.io/badge/status-active-brightgreen)](https://github.com/wizeworks/wize-__PROJECT_NAME__)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![build](https://img.shields.io/badge/build-passing-success)]()
[![graphql](https://img.shields.io/badge/graphql-supported-ff69b4.svg)]()
[![supabase](https://img.shields.io/badge/supabase-integrated-3ecf8e.svg)]()

__PROJECT_NAME__ is a lightweight, multi-tenant GraphQL API for managing __PROJECT_NAME__s, designed for integration into __PROJECT_NAME__ platforms. It supports structured __PROJECT_NAME__ threads with fine-grained access control via API key scopes.

---

## 🚀 Features
- Multi-tenant __PROJECT_NAME__ isolation via Postgres RLS
- API key authentication with scope validation (`examples:read`, `examples:write`, `examples:delete`)
- GraphQL endpoint for creating, retrieving, and deleting __PROJECT_NAME__s
- Supabase as a backend database
- Sentry for exception monitoring
- Context-aware GraphQL resolver injection

---

## 🛠 Setup

### 1. Environment Variables
Create a `.env` file in the root:
```env
SUPABASE_URL=https://<your-supabase-project>.supabase.co
SUPABASE_KEY=<your-service-role-key>
SENTRY_DSN=https://<your-sentry-dsn>
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the API Server
```bash
npm run dev
```

---

## 🔑 API Authentication
Requests must include a header:
```http
wize-api-key: <your-api-key>
```
This key must be stored in the `api.api_keys` table in Supabase with `isActive = true`.

---

## 📋 Example GraphQL Query
```graphql
query GetExamples($postId: String!) {
  __PROJECT_NAME__s(postId: $postId) {
    id
    __PROJECT_NAME__
    createdAt
    userId
  }
}
```

---

## ✏️ Example GraphQL Mutation
```graphql
mutation AddExample($postId: String!, $__PROJECT_NAME__: String!, $parentId: ID) {
  addExample(postId: $postId, __PROJECT_NAME__: $__PROJECT_NAME__, parentId: $parentId) {
    id
    __PROJECT_NAME__
    createdAt
  }
}
```

---

## 📤 Deployment
This app is meant to run as a backend microservice. You can deploy it to:
- Render / Railway / Fly.io
- Docker container
- Fastify server under reverse proxy

---

## 🧩 Notes
- Examples are soft-deleted using `is_deleted`
- All Supabase access uses `schema('api')` to respect schema restrictions
- `last_used_at` is updated on each valid API key use

---

## 📞 Contact
Built and maintained by the JobSight team.
