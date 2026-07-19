import { z } from "zod";

const evidenceProfileSchema = z
  .object({
    label: z.string().trim().min(1).max(96),
    origin: z.enum(["manual", "predefined"]),
    predefinedProfileId: z
      .enum([
        "high-frequency-hearing-loss",
        "flat-hearing-loss",
        "asymmetric-hearing-loss",
      ])
      .nullable(),
  })
  .strict()
  .superRefine((profile, context) => {
    if (
      (profile.origin === "manual" && profile.predefinedProfileId !== null) ||
      (profile.origin === "predefined" &&
        profile.predefinedProfileId === null)
    ) {
      context.addIssue({
        code: "custom",
        message: "Evidence profile origin and identity do not match.",
      });
    }
  });

const evidenceExplanationSchema = z.discriminatedUnion("status", [
  z
    .object({
      status: z.literal("live"),
      model: z.literal("gpt-5.6-terra"),
    })
    .strict(),
  z
    .object({
      status: z.literal("degraded"),
      model: z.null(),
    })
    .strict(),
]);

const attributableEvidenceSchema = z
  .object({
    schemaVersion: z.literal("auralis-evidence-v1"),
    sourceIdentity: z.string().trim().min(1).max(2_048),
    resultIdentity: z
      .string()
      .regex(/^auralis-result-v1-[a-f0-9]{16}$/),
    profile: evidenceProfileSchema,
    supportMode: z.enum(["none", "left-one-sided", "bilateral"]),
    televisionState: z.enum(["tv-on", "tv-off"]),
    speakerPositionState: z.enum([
      "original-position",
      "closer-in-front",
    ]),
    completionStatus: z.enum(["complete-live", "complete-degraded"]),
    explanation: evidenceExplanationSchema,
    limitation: z.literal(
      "This experience is illustrative; it is not a diagnosis, prescription, hearing-aid fitting, or prediction of individual perception.",
    ),
    generatedAt: z.iso.datetime({ offset: true }),
  })
  .strict()
  .superRefine((evidence, context) => {
    const matchingOutcome =
      (evidence.completionStatus === "complete-live" &&
        evidence.explanation.status === "live") ||
      (evidence.completionStatus === "complete-degraded" &&
        evidence.explanation.status === "degraded");

    if (!matchingOutcome) {
      context.addIssue({
        code: "custom",
        message: "Evidence completion and explanation states do not match.",
      });
    }
  });

export function serializeAttributableEvidence(input: unknown): string {
  const evidence = attributableEvidenceSchema.parse(input);

  return `${JSON.stringify(evidence, null, 2)}\n`;
}

export function downloadAttributableEvidence(input: unknown): void {
  const evidence = attributableEvidenceSchema.parse(input);
  const serialized = serializeAttributableEvidence(evidence);
  const blob = new Blob([serialized], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const timestamp = evidence.generatedAt.replace(/[:.]/g, "-");

  link.href = url;
  link.download = `auralis-evidence-${timestamp}.json`;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  globalThis.setTimeout(() => URL.revokeObjectURL(url), 0);
}
