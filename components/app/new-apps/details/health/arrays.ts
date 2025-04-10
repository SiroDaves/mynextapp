import { calculateBMI } from "@/lib/formating";
import { z } from "zod";

export const schemaHealth = z.object({
  bmiData: z.string().optional(),
  requiresMedicalUnderwriting: z.string().optional(),
  requiresMedicalQuestionnaire: z.string().optional(),
  istheManualFormDCA: z.string().optional(),
  isTheManualFormDeclarationOkaycis: z.string().optional(),
  requiresMedicalQuestionnaireDetails: z.string().optional(),
});

export const fieldsHealth = {
  bmiData: "No",
  requiresMedicalUnderwriting: "No",
  requiresMedicalQuestionnaire: "No",
  istheManualFormDCA: "No",
  isTheManualFormDeclarationOkay: "No",
  requiresMedicalQuestionnaireDetails: "No",
};

export const labelsHealth = {
  bmiData: {
    name: "bmiData",
    label: "Requires FA clarification?",
    type: "Relisted Reason",
    options: [
      "Confirm the client’s correct height and weight",
      "Capture height and weight on the application form",
    ],
  },
  requiresMedicalUnderwriting: {
    name: "requiresMedicalUnderwriting",
    label: "Requires medical underwriting?",
    type: "Comment",
    options: [],
  },
  istheManualFormDCA: {
    name: "istheManualFormDCA",
    label: "Is the manual form DCA and health questions okay?",
    type: "Relisted Reason",
    options: [
      "Answer all questions on application form",
      "Tick data protection act question on the application form",
    ],
  },
  isTheManualFormDeclarationOkay: {
    name: "isTheManualFormDeclarationOkay",
    label: "Is the manual form declaration, okay?",
    type: "Relisted Reason",
    options: [
      "Have the client/witness sign/date the application form",
      "Application form post dated",
      "Stale application form",
      "Have a different person witness the application form",
      "Have the alteration on the whiteout countersigned",
    ],
  },
  requiresMedicalQuestionnaire: {
    name: "requiresMedicalQuestionnaire",
    label: "Requires medical questionnaire?",
    type: "Relisted Reason",
    options: [
      "Incorrect medical questionnaire",
      "Missing medical questionnaire",
      "Unclear medical questionnaire",
    ],
  },
};

export function descriptionHealth(field: string, personalDetail?: any): string {
  switch (field) {
    case "bmiData":
      return (
        calculateBMI(
          personalDetail?.healthQuestions?.height || 0,
          personalDetail?.healthQuestions?.userWeight || 0
        ) +
        " for " +
        (personalDetail?.healthQuestions?.height || 0) +
        "cm" +
        " and " +
        (personalDetail?.healthQuestions?.userWeight || 0) +
        "kg"
      );
    default:
      return "-";
  }
}
