import { describe, it, before } from "node:test";
import assert from "node:assert";
import request from "supertest";
import crypto from "crypto";

import app from "./index.js";

// ===============================
// Helpers
// ===============================
function createValidUser() {
  const hash = crypto.randomBytes(10).toString("hex");

  return {
    nome: `User ${hash}`,
    email: `user-${hash}@email.com`,
    senha: "123456",
  };
}

async function createUser(user) {
  return await request(app).post("/api/usuarios").send(user);
}

async function loginUser(user) {
  return await request(app).post("/api/signin").send({
    email: user.email,
    senha: user.senha,
  });
}

async function loadToken(user) {
  const response = await loginUser(user);
  return response.body.token;
}

// ===============================
// Testes
// ===============================
describe("Posto de Saúde - Teste de Rotas/Integração (Supertest)", () => {
  let validUser;

  before(async () => {
    validUser = createValidUser();

    // ✅ garante que o usuário existe no banco ANTES dos testes de login
    await createUser(validUser);
  });

  // =========================================================
  // 1) POST /api/usuarios (cadastro)
  // =========================================================
  describe("POST /api/usuarios", () => {
    it("deve cadastrar usuário (sucesso)", async () => {
      const user = createValidUser();
      const response = await createUser(user);

      assert.strictEqual(response.statusCode, 201);
      assert.strictEqual(response.body.status, 201);
      assert.ok(response.body.usuario);
      assert.strictEqual(response.body.usuario.email, user.email);
    });

    it("não deve cadastrar usuário com email repetido (erro)", async () => {
      // tenta cadastrar o mesmo usuário de novo (já foi criado no before)
      const response = await createUser(validUser);

      assert.strictEqual(response.statusCode, 409);
      assert.strictEqual(response.body.status, 409);
    });
  });

  // =========================================================
  // 2) POST /api/signin (login)
  // =========================================================
  describe("POST /api/signin", () => {
  it("deve fazer login (sucesso)", async () => {
    const response = await request(app).post("/api/signin").send({
      email: validUser.email,
      senha: validUser.senha,
    });

    console.log("LOGIN RESPONSE:", response.statusCode, response.body);

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.body.status, 200);
    assert.ok(response.body.token);
  });
});

  // =========================================================
  // 3) GET /api/usuarios (protegida)
  // =========================================================
  describe("GET /api/usuarios", () => {
    it("não deve listar usuários sem token (erro)", async () => {
      const response = await request(app).get("/api/usuarios");
      assert.strictEqual(response.statusCode, 401);
    });

    it("deve listar usuários com token (sucesso)", async () => {
      const token = await loadToken(validUser);

      const response = await request(app)
        .get("/api/usuarios")
        .set("Authorization", "bearer " + token);

      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(response.body.status, 200);
      assert.ok(Array.isArray(response.body.usuarios));
    });
  });
});
