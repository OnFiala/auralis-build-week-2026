import {
  MAX_MODEL_REQUEST_BYTES,
  ModelRequestValidationError,
  parseModelExplanationRequestText,
} from "../../../contracts/runtime";
import { explainCurrentExperience } from "../../../server/model";
import { OpenAIExplanationProvider } from "../../../server/openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const responseHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
} as const;

function invalidRequestResponse(): Response {
  return Response.json(
    { error: "invalid-request" },
    { status: 400, headers: responseHeaders },
  );
}

export async function POST(request: Request): Promise<Response> {
  const contentLength = request.headers.get("content-length");

  if (
    contentLength !== null &&
    Number.isFinite(Number(contentLength)) &&
    Number(contentLength) > MAX_MODEL_REQUEST_BYTES
  ) {
    return invalidRequestResponse();
  }

  try {
    const body = await request.text();
    const modelRequest = parseModelExplanationRequestText(body);
    const result = await explainCurrentExperience(
      modelRequest,
      new OpenAIExplanationProvider(),
    );

    return Response.json(result, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    if (error instanceof ModelRequestValidationError) {
      return invalidRequestResponse();
    }

    return Response.json(
      { error: "model-boundary-failure" },
      { status: 500, headers: responseHeaders },
    );
  }
}
