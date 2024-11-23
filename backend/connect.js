const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config({ path: "./config.env" });

const client = new MongoClient(process.env.ATLAS_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

let db;

module.exports = {
    connectToServer: async () => {
        try {
            await client.connect();
            db = client.db("UserInfo");
            console.log("Successfully connected to MongoDB");
        } catch (error) {
            console.error("Error connecting to MongoDB:", error);
            throw error; // Ensures that the error propagates if the connection fails
        }
    },
    getDb: () => {
        if (!db) {
            throw new Error("Database not initialized. Call connectToServer first.");
        }
        return db;
    },
};


/*async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);*/
