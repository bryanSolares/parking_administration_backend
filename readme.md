# Parking system (backend)

## Run with docker compose for test endpoints (🧪)

```bash
docker compose up -d
```

## Run app in development mode

### Pre-requisites (🧑‍💻)

- node >= 18
- yarn >= 1.22
- Docker
- Docker compose

```bash
docker compose up database -d
```

### Copy .env.example to .env

(update the values in .env)

```bash
cp .env.example .env
```

### Install dependencies

```bash
yarn install
```

### Run the server in development mode

```bash
yarn dev
```

## Run test (in progress 🔃)

```bash
yarn build
yarn start
```

### Run the tests

```bash
yarn test
yarn test:integration
```
