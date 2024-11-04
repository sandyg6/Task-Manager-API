const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
const connectDB = require('./db');

const app = express();

// Connect to MongoDB
connectDB();

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true  // Enables GraphiQL for query testing
}));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/graphql`);
});
