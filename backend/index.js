import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware to enable CORS
app.use(cors());


// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// return questions json
const getQuestions = (req, res) => {
    const user = req.query.id;
    const questionsFilePath = path.join(__dirname, 'questions.json');
    fs.readFile(questionsFilePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading questions file');
            return;
        }
        const questions = JSON.parse(data);
        const userInfo = { id: JSON.parse(user), name:'Acme Company, Inc', email: 'johndoe@acme.com', formData: questions };
        const response = { userInfo };
        res.json(response);
    });
}

const getQuestionsAsObject = () => {
    const questionsFilePath = path.join(__dirname, 'questions.json');
    const data = fs.readFileSync(questionsFilePath, 'utf8');
    return JSON.parse(data);
};

app.get('/user', (req, res) => {
    getQuestions(req, res);
})

// API endpoint to receive form data
app.post('/submit-form', async (req, res) => {
    try {
        const formData = req.body;
        console.log('Form Data Received:', formData);
        const questions = getQuestionsAsObject();
        const updatedQuestions = addValuesToFormStructure(questions, formData);
        res.json(updatedQuestions);
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send('Error processing form data');
        
    }
});

// this integrates the formData values into the form structure of questions.json
const addValuesToFormStructure = (structure, formData) => {
    structure.forEach(section => {
        if (section.sections) {
            addValuesToFormStructure(section.sections, formData);
        } else if (section.questions) {
            section.questions.forEach(question => {
                if (formData.hasOwnProperty(question.id)) {
                    question.value = formData[question.id];
                }
            });
        } else if (section.blocks) {
            section.blocks.forEach(block => {
                if (block.fields) {
                    block.fields.forEach(field => {
                        if (formData.hasOwnProperty(field.id)) {
                            field.value = formData[field.id];
                        }
                    });
                }
            });
        } else {
            if (formData.hasOwnProperty(section.id)) {
                section.value = formData[section.id];
            }
        }
    });
    return structure;
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});