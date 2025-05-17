const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Adicione esta linha
const authRoutes = require("./routes/authRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const empresaRoutes = require("./routes/empresaRoutes");

const app = express();

// Configuração do CORS (adicione esta parte)
app.use(cors({
  origin: 'http://localhost:3001', // URL do seu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(bodyParser.json());

// ... o restante do seu código permanece igual
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/alunos", alunoRoutes);
app.use("/api/empresas", empresaRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando online e roteando 😎`));