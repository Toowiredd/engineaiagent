# AI Agent Project

This project consists of a backend API server and a frontend React application.

## Project Structure

```
project/
├── ai_agent_backend/
│   ├── src/
│   │   └── server.js
│   ├── config/
│   ├── tests/
│   └── package.json
├── ai_agent_frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
└── README.md
```

## Setup Instructions

### Backend

1. Navigate to the `ai_agent_backend` directory.
2. Run `npm install` to install dependencies.
3. Create a `.env` file with the following content:
   ```
   XATA_API_KEY=your_xata_api_key
   DATABASE_URL=your_database_url
   ```
4. Run `npm start` to start the server.

### Frontend

1. Navigate to the `ai_agent_frontend` directory.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the development server.

## Available Scripts

### Backend

- `npm start`: Starts the server
- `npm test`: Runs the test suite

### Frontend

- `npm run dev`: Starts the development server
- `npm run build`: Builds the app for production
- `npm run serve`: Serves the production build locally

## Environment Variables

Make sure to set the following environment variables:

- `XATA_API_KEY`: Your Xata API key
- `DATABASE_URL`: Your Xata database URL

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.