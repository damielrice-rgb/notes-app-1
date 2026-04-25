import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/notes", (req, res) => {
  res.json([
    {id: 1, title: "Test Note 1", content: "From backend"},
    {id: 2, title: "Test Note 2", content: "Still working"}
]);
});

app.listen(5000, () => {
  console.log("server running on http://localhost:5000");
});