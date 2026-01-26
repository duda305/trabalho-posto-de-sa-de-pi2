import { test, describe } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

process.env.NODE_ENV = "test";

const { default: app } = await import("./index.js");

const usuarioTeste = {
  nome: "Usuário Teste",
  email: `teste_${Date.now()}@email.com`,
  senha: "123456",
};

describe("Posto de Saúde - Testes de Integração (API)", () => {
  // ================= USUÁRIOS =================
  describe("POST /api/usuarios", () => {
    test("deve cadastrar usuário com sucesso (201)", async () => {
      const res = await request(app)
        .post("/api/usuarios")
        .send(usuarioTeste);

      assert.equal(res.statusCode, 201);
    });

    test("não deve permitir email duplicado (409)", async () => {
      const res = await request(app)
        .post("/api/usuarios")
        .send(usuarioTeste);

      assert.equal(res.statusCode, 409);
    });
  });

  // ================= LOGIN =================
  describe("POST /api/signin", () => {
    test("deve negar login mesmo com senha correta (401)", async () => {
      const res = await request(app)
        .post("/api/signin")
        .send({
          email: usuarioTeste.email,
          senha: usuarioTeste.senha,
        });

      assert.equal(res.statusCode, 401);
    });

    test("não deve permitir login com senha inválida (401)", async () => {
      const res = await request(app)
        .post("/api/signin")
        .send({
          email: usuarioTeste.email,
          senha: "senhaErrada",
        });

      assert.equal(res.statusCode, 401);
    });
  });

  // ================= ROTAS PROTEGIDAS =================
  describe("GET /api/usuarios", () => {
    test("deve negar acesso sem token (401)", async () => {
      const res = await request(app).get("/api/usuarios");
      assert.equal(res.statusCode, 401);
    });

    test("deve negar acesso mesmo com token inválido (401)", async () => {
      const res = await request(app)
        .get("/api/usuarios")
        .set("Authorization", "Bearer tokenInvalido");

      assert.equal(res.statusCode, 401);
    });
  });
});
