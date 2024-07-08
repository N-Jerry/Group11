beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/mydatabase', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to MongoDB database at ${mongoose.connection.host}:${mongoose.connection.port}`);
  });