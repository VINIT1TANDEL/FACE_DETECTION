import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import pg from 'pg';
import cors from "cors";
import { spawn } from 'child_process';


const app = express();
const port = 3001;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "world1",
    password: "vinit123@",
    port: 5432,
});

db.connect();

app.use(cors());
app.use(express.json()); // to handle JSON payloads correctly
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("Welcome to the Face Recognition App");
});
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await db.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
      if (user.rows.length > 0) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !name || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    try {
        const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        await db.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, password]);
        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});






app.post("/face-scan", async (req, res) => {
    let responseSent = false; // Flag to track if response has been sent

    try {
        const pythonProcess = spawn('python', ['./src/face_detect.py'], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        pythonProcess.stdout.on('data', (data) => {
            if (!responseSent) {
                const numFaces = parseInt(data.toString().trim());
                res.status(200).json({ numFaces });
                responseSent = true; // Set flag to true after sending response
                 // Kill the process after sending the response
            }
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error('Python script error:', data.toString());
            if (!responseSent) {
                res.status(500).json({ message: 'Internal server error' });
                responseSent = true; // Set flag to true after sending response
            }
        });

        // Handle case where Python script ends
        pythonProcess.on('exit', (code) => {
            if (!responseSent) {
                console.error('Python script exited with non-zero code:', code);
                res.status(500).json({ message: 'Internal server error' });
                responseSent = true; // Set flag to true after sending response
            }
        });

        // Send video frames from webcam to Python script's stdin
        const videoStream = req.pipe(pythonProcess.stdin);
        videoStream.on('error', (error) => {
            console.error('Error sending video frames to Python script:', error);
            if (!responseSent) {
                res.status(500).json({ message: 'Internal server error' });
                responseSent = true; // Set flag to true after sending response
            }
        });
    } catch (error) {
        console.error('Error running Python script:', error);
        if (!responseSent) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});