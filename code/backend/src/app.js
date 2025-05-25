const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const empresaRoutes = require("./routes/empresaRoutes");
const vantagemRoutes = require("./routes/vantagemRoutes");

const app = express();

app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/alunos", alunoRoutes);
app.use("/api/empresas", empresaRoutes);
app.use("/api/vantagens", vantagemRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando online e roteando 😎`));