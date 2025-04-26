# WizeWorks GraphQL API 🚀

[![CI](https://img.shields.io/github/actions/workflow/status/wize-works/create-wize-api/publish.yml?label=CI&style=flat-square)](https://github.com/wize-works/create-wize-api/actions/workflows/publish.yml)
[![License](https://img.shields.io/github/license/wize-works/create-wize-api?style=flat-square)](LICENSE)
[![Issues](https://img.shields.io/github/issues/wize-works/create-wize-api?style=flat-square)](https://github.com/wize-works/create-wize-api/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/wize-works/create-wize-api/pulls)
[![GraphQL](https://img.shields.io/badge/graphql-powered-E10098.svg?style=flat-square&logo=graphql&logoColor=white)](https://graphql.org)
[![Sentry](https://img.shields.io/badge/logged%20with-sentry-orange?style=flat-square&logo=sentry)](https://sentry.io)
[![MongoDb](https://img.shields.io/badge/database-mongodb-4DB33D?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![npm](https://img.shields.io/npm/v/@wizeworks/create-wize-api?label=npm)](https://www.npmjs.com/package/@wizeworks/create-wize-api)

---

## ✨ Overview

The **WizeWorks GraphQL API** is a multi-tenant, MongoDB-backed API built with **Express**, **GraphQL Yoga**, and modern tooling for observability and traceability via **Sentry**.

> This API is designed to serve as a backend foundation for WizeWorks SaaS apps.

---

## 🔧 Tech Stack

| Tool                  | Purpose                                   |
|-----------------------|-------------------------------------------|
| **Express**           | Lightweight Node.js web framework        |
| **GraphQL Yoga**      | GraphQL server with subscriptions        |
| **MongoDB**           | NoSQL database for multi-tenant data     |
| **Sentry**            | Error monitoring + transaction tracing   |
| **GraphQL Scalars**   | Extended GraphQL support (DateTime, etc.)|
| **dotenv**            | Secure environment variable loading      |

---

## 🚀 Features

- ⚡ Fast and lightweight GraphQL API
- 🔐 Multi-tenant aware via dynamic `tenantId` injection
- 📦 MongoDB integration with dynamic schema support
- 🧠 Rich GraphQL subscriptions using PubSub
- 📊 Full observability with scoped Sentry logging
- 🛡️ Fine-grained auth using API keys and scopes
- 🧪 Easy local development with `.env` and mock data

---

## 🏁 Getting Started

### 1. Scaffold a New Project

```bash
npx @wizeworks/create-wize-api
```

This will prompt you for:
- Project name
- Display name
- And automatically install dependencies

---

### 2. Environment Setup

Create a `.env` file based on `.env.example`:

```env
MONGO_URI=mongodb://localhost:27017
SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
PORT=3000
```

### 3. Run the Dev Server

```bash
npm run dev
```

Access GraphQL Playground at:  
👉 `http://localhost:3000/graphql`

---

## 📡 Example GraphQL Query

```graphql
query {
  listExamples {
    id
    title
    createdAt
  }
}
```

---

## 🚀 Deployment

### 1. Local Development

Run Node:

```bash
npm run dev
```

---

### 2. Kubernetes Deployment

This repo includes production-ready Kubernetes manifests in the `deployment/` folder.

```bash
kubectl apply -f deployment/deployment.yaml
kubectl apply -f deployment/service.yaml
kubectl apply -f deployment/ingress.yaml
```

---

### 3. GitHub Actions (CI/CD)

GitHub Actions will auto-deploy on push to `main`.

You’ll need to configure the following secrets in your GitHub repository:

| Secret Name         | Description                                 |
|---------------------|---------------------------------------------|
| `AKS_CLUSTER`       | AKS Cluster Name                            |
| `ACR_NAME`          | Container registry URL                      |
| `IMAGE_NAME`        | Image name (`e.g., wize-example`)           |
| `MONGO_URI`         | MongoDB connection string                   |
| `SENTRY_DSN`        | Sentry DSN                                  |

You can customize these in `.github/workflows/deploy.yml`.

---

### 🔁 Commit Versioning Requirement

Semantic Release will automatically:
- Analyze commits
- Bump the version
- Publish to npm under the `@wizeworks` scope

---

## ✍️ License

MIT © [WizeWorks](https://github.com/wize-works)

---

## 💡 Future Plans

- ⚙️ CLI for creating tenants & migrations
- 📘 Swagger/OpenAPI generation for REST proxying
- 🧩 Federation-ready module splitting
- 🔁 Live MongoDB → PubSub bridge

---

## 🙏 Contributing

We welcome contributions! Check out [CONTRIBUTING.md](./CONTRIBUTING.md) to get started.

