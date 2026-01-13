require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5002;

// 미들웨어
app.use(cors());
app.use(express.json());

// MongoDB 연결
mongoose.connect(process.env.MONGOOSE_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('연결성공');
  })
  .catch((err) => {
    console.error('MongoDB 연결 에러:', err);
  });

// Todo 모델
const todoSchema = new mongoose.Schema({
  task: String,
  completed: { type: Boolean, default: false }
});

const Todo = mongoose.model('Todo', todoSchema);

// 루트 경로 (테스트용)
app.get('/', (req, res) => {
  res.json({ message: 'Todo API is running!' });
});

// GET - 모든 할 일 가져오기
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - 새 할 일 추가
app.post('/todos', async (req, res) => {
  const todo = new Todo({
    task: req.body.task
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT - 할 일 수정
app.put('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (req.body.task != null) {
      todo.task = req.body.task;
    }
    if (req.body.completed != null) {
      todo.completed = req.body.completed;
    }
    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE - 할 일 삭제
app.delete('/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: '삭제되었습니다' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다`);
});
