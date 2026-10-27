import { z } from "zod";

const prismaIntIdSchema = z
  .string({
    required_error: "ID do jogador é obrigatório",
    invalid_type_error: "ID do jogador deve ser um valor único"
  })
  .regex(/^[1-9]\d*$/, "ID do jogador deve ser um inteiro positivo")
  .transform(Number)
  .pipe(z.number().int().max(2_147_483_647, "ID do jogador excede o limite suportado"));

export const playerComparisonQuerySchema = z
  .object({
    playerAId: prismaIntIdSchema,
    playerBId: prismaIntIdSchema
  })
  .refine((value) => value.playerAId !== value.playerBId, {
    path: ["playerBId"],
    message: "playerAId e playerBId devem representar jogadores diferentes"
  });

export type PlayerComparisonQuery = z.infer<typeof playerComparisonQuerySchema>;
