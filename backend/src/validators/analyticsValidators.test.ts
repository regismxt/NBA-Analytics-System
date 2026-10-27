import assert from "node:assert/strict";
import test from "node:test";
import { playerComparisonQuerySchema } from "./analyticsValidators";

test("aceita dois IDs inteiros positivos diferentes", () => {
  assert.deepEqual(playerComparisonQuerySchema.parse({ playerAId: "1", playerBId: "2" }), {
    playerAId: 1,
    playerBId: 2
  });
});

test("rejeita IDs ausentes, inválidos, fora da faixa ou não escalares", () => {
  for (const query of [
    {},
    { playerAId: "abc", playerBId: "2" },
    { playerAId: "", playerBId: "2" },
    { playerAId: "0", playerBId: "2" },
    { playerAId: "-1", playerBId: "2" },
    { playerAId: "1.5", playerBId: "2" },
    { playerAId: "1e2", playerBId: "2" },
    { playerAId: "2147483648", playerBId: "2" },
    { playerAId: ["1"], playerBId: "2" }
  ]) {
    assert.equal(playerComparisonQuerySchema.safeParse(query).success, false);
  }
});

test("rejeita comparação do jogador consigo mesmo", () => {
  assert.equal(playerComparisonQuerySchema.safeParse({ playerAId: "7", playerBId: "7" }).success, false);
});
