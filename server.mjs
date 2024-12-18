import mongoose from 'mongoose';
import app from './index.mjs';

mongoose
  .connect(process.env.DB_URI, {
    serverSelectionTimeoutMS: 60000,
  })
  .then(() => {
    console.log('DB connection successful 🤝');
  })
  .catch((err) => {
    console.log('Error connecting to DB:', err);
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}....`);
});

// export mongoose to be used in other files
export { mongoose };
export default app;
