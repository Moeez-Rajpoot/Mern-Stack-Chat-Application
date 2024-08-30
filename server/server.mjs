import express from 'express';
import dotenv from 'dotenv';
import { ConnectDb } from './config/dbconnection.mjs';
import cors from 'cors';
import bodyParser from 'body-parser';
import { app, server, io } from './sockets/sockets.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

ConnectDb();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use("/api/auth", (await import('./routes/authenticationRoutes.js')).default);
app.use("/api/message", (await import('./routes/messageRoutes.js')).default);

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});