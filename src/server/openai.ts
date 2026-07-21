import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

import {
  MODEL_ID,
  providerExplanationSchema,
} from "../contracts/runtime";
import type {
  ExplanationProvider,
  ExplanationProviderInput,
  ExplanationProviderResult,
} from "./model";

const PROVIDER_TIMEOUT_MS = 15_000;
const MAX_OUTPUT_TOKENS = 1_200;

function containsRefusal(
  output: Awaited<ReturnType<OpenAI["responses"]["parse"]>>["output"],
): boolean {
  return output.some(
    (item) =>
      item.type === "message" &&
      item.content.some((content) => content.type === "refusal"),
  );
}

export class OpenAIExplanationProvider implements ExplanationProvider {
  async generate(
    input: ExplanationProviderInput,
  ): Promise<ExplanationProviderResult> {
    const apiKey = process.env.OPENAI_API_KEY?.trim();

    if (!apiKey) {
      return Object.freeze({
        status: "configuration-unavailable" as const,
        responseId: null,
      });
    }

    const client = new OpenAI({
      apiKey,
      maxRetries: 0,
      timeout: PROVIDER_TIMEOUT_MS,
    });

    try {
      const response = await client.responses.parse({
        model: MODEL_ID,
        reasoning: { effort: "low" },
        max_output_tokens: MAX_OUTPUT_TOKENS,
        instructions: input.instructions,
        input: input.input,
        text: {
          verbosity: "high",
          format: zodTextFormat(
            providerExplanationSchema,
            "auralis_explanation",
          ),
        },
        tools: [],
        tool_choice: "none",
        parallel_tool_calls: false,
        store: false,
      });

      if (containsRefusal(response.output)) {
        return Object.freeze({
          status: "refused" as const,
          responseId: response.id,
        });
      }

      if (response.status !== "completed" || !response.output_parsed) {
        return Object.freeze({
          status: "malformed-output" as const,
          responseId: response.id,
        });
      }

      return Object.freeze({
        status: "success" as const,
        model: response.model,
        responseId: response.id,
        output: response.output_parsed,
      });
    } catch (error) {
      if (error instanceof OpenAI.APIConnectionTimeoutError) {
        return Object.freeze({
          status: "timeout" as const,
          responseId: null,
        });
      }

      return Object.freeze({
        status: "provider-failure" as const,
        responseId: null,
      });
    }
  }
}
