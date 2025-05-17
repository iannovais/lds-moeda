const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const empresaRoutes = require("./routes/empresaRoutes");

const app = express();
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/alunos", alunoRoutes);
app.use("/api/empresas", empresaRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando online e roteando 😎`));