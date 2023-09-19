# Diablo Trading Backend (sanctuaryteam/diablotrading-be)

diablo4.trading backend application

## Set Up .env
Docker will user this file for project specific environment variables
- Create a [new GitHub personal access token](https://github.com/settings/tokens/new) with the following scopes: `read:packages`

- Update .env File:  run `cp .env.example .env` to create a new .env file. Update the new .env file with SANCTUARYTEAM_AUTH_TOKEN=YOUR_NEW_TOKEN

## Docker
Install the project dependencies and start up:

To get your application up and running:
- Ensure you have both Docker and Docker Compose installed.
- Navigate to `~/sanctuaryteam/diablo4trading-be` containing your docker-compose.yml file.
```bash
    cd ~/sanctuaryteam/diablo4trading-be
```
-  Run the following command: 
```bash
   docker compose up
```
- packages will be installed and application will start
- Access the Application: Once the containers are up and running, you can access the application in your browser using the URL: http://localhost:3000.

### Running Commands Inside the Container

**docker compose run**: to run commands inside of the container.
```bash
docker compose run backend-api <command>
```

## SQLite Build and Run Migrations:
For development, the application uses SQLite as the database.

**migrate** - Perform migrations on SQLite
```bash
 yarn migrate
```

#### Run Migrations:
**migrate:run** - Run migrations using TypeORM
```bash
 yarn migrate:run
```

## Generate JWT Token

**generate-jwt-token** - Generate a new JWT secret token for your application:
```bash
 yarn generate-jwt-token
```

## Script Usage
To run the application, you can use the following scripts:

#### Development Mode:
**start:dev** - Runs the backend application in development mode with automatic restarts when changes are detected.
```bash
 yarn start:dev
```

#### Debug Mode:
**start:debug** - Runs the application in debug mode, enabling debugging and code inspection.
```bash
 yarn start:debug
```

#### Production Mode:
**start:prod** - Starts the application in production mode for deployment.
```bash
 yarn start:prod
```

## Testing
For testing, we have the following scripts:

#### Run All Tests:
**yarn test** - Runs all test suites using the Jest testing framework.
```bash
 yarn test
```

#### Run Tests with Watch Mode:
**test:watch** - Runs tests in watch mode for continuous testing during development.
```bash
 yarn test:watch
```

#### Generate Test Coverage Reports:
**test:cov** - Generates test coverage reports using Jest.
```bash
 yarn test:cov
```

#### Run End-to-End Tests:
**test:e2e** - Runs end-to-end (E2E) tests to ensure different parts of your application work together as expected.
```bash
 yarn test:e2e
```

# License
Nest is [MIT licensed](LICENSE).
