# Git Branches

The principal branches are:

- master
  - Final product.
  - Do not merge from anything other than release and hotfix branches.
- develop
  - Used for main line of work.
  - Created from master

The secondary branches are:

- feature
  - Feature to add or expand.
  - Created from develop.
- release
  - Hold candidates for new releases.
  - Only for bug fixing.
  - Created from develop.
- hotfix
  - Solve bugs in main branch.
  - Created from master.
  - Once finished merge to master and develop.
- junk
  - Functionality that is not going to be integrated.

## Naming conventions

1. Use group tokens

```
group1/foo
group1/fuu
group2/foo
groupn/fnn
```

2. Use short lead tokens

```
feat - Feature
junk - Throwaway branch
rel - Release
fix - Hotfix
```

3. Use slashes to separate parts

4. Do not use numbers

5. Avoid long names

Some examples:

```
feat/foo
feat/faa
rel/foo
fix/foo
junk/poc
```

![Branching Structure](https://i.stack.imgur.com/tjJCt.png)

## Roadmap

### Starting up

- [x] Create Github Repo
- [x] Implement babel
- [x] Create Project Structure
- [x] Research Project Architecture
- [x] Research TDD
- [x] Implement tests with jest
- [x] Implement TypesScript
- [x] Implement .env config parser
- [x] Create npm scripts
- [x] Run tests successfully with new structure

### Database

- [x] Create test database schema
- [x] User Schema
  - [x] Create User Interface
  - [x] Create User Document
  - [x] Create User Model
  - [x] Create Schema
  - [x] Hash passwords with bcryptjs before saving users
  - [x] Create Tests
- [x] Post Schema
  - [x] Create Post Interface
  - [x] Create Post Document
  - [x] Create Post Model
  - [x] Create Schema
  - [x] Create Tests
- [x] PostComment
  - [x] Create PostComment Interface
  - [x] Create PostComment Document
  - [x] Create PostComment Model
  - [x] Create Schema
  - [x] Create Tests
- [x] Create Mock Data Creators for Tests
  - [x] User Mock
  - [x] Post Mock
  - [x] PostComment Mock
- [x] Create helpers to create entries in mongoose using mock data

### Branching

- [x] Create branching structure and naming conventions

### Loaders

- [x] Create Loaders
  - [x] Express Loader
  - [x] Mongoose Loader
  - [x] Test Loaders
  - [x] Refactor mongoose loader for better testing. (Add functionality to close connections)

### Logger

- [x] Add Logs for errors
  - [x] Investigate how to log, types, when, why....
  - [x] Implement Winston Logger as a utility
  - [x] Change all logs with Winston logger
  - [x] Listen to uncaught exceptions and promises

### Authentication

- [x] Implement Dependency Inversion typedi
- [ ] Authentication Service
  - [x] Create signup functionality
  - [x] Create sign-in/login functionality
- [ ] API Route and Controller
  - [ ] Create signup
  - [ ] Create sign-in/login
- [x] Implement JWT user authentication
  - [ ] Implement cookie-parser npm package

### Performance

- [ ] Save in a logger all requests with ping, time (ms)...

### App Logic

#### Users

- [ ] Create CRUD Operations
- [ ] Whenever a new user is created, send a verification email
  - [ ] Search for nodemailer@npm

#### Posts

#### Error Handling

- [x] Research Error Handling
- [x] Create CatchAsync Wrapper
- [x] Create Custom Error
- [x] Create Global Error Handler
- [x] Include Global Error Handler in Loaders
- [ ] Implement npm@morgan
- [x] Upgrade Winston to give more insight into errors

### NPM packages

- [ ] cors
- [ ] Sanitization
  - [ ] express-mongo-sanitize
  - [ ] xss-clean
- [ ] Performance
  - [ ] compression
  - [ ] express-rate-limit
- [ ] Security
  - [ ] helmet
  - [ ] hpp
  - [x] jsonwebtoken
- [ ] Dev
  - [ ] morgan // HTTP Request Logger
- [ ] Requests
  - [ ] multer // Handle multipart/form-data, primarily used for uploading files.
  - [ ] sharp // Process images
