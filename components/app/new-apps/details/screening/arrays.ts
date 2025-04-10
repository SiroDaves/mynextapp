import { z } from "zod";

export const schemaScreening = z.object({
    mentionedInBridger: z.string().optional(),
    isMentionAdverse: z.string().optional(),
    quizComplete: z.string().optional(),
    sanctioned: z.string().optional(),
});

export const fieldsScreening = {
    mentionedInBridger: "No",
    isMentionAdverse: "No",
    quizComplete: "No",
    sanctioned: "No",
};

export const labelsScreening = {
    mentionedInBridger: {
        name: "mentionedInBridger",
        label: "Is the mention on bridger report positive?",
        type: "Aml",
        options: [],
    },
    isMentionAdverse: {
        name: "isMentionAdverse",
        label: "If yes, is the mention adverse?",
        type: "Aml",
        options: [],
    },
    sanctioned: {
        name: "sanctioned",
        label: "Sanctioned?",
        type: "Aml",
        options: [],
    },
    quizComplete: {
        name: "quizComplete",
        label: "Is the financial questionnaire/source of funds incomplete?",
        type: "Relisted Reason",
        options: [
            "Unclear financial questionnaire/source of funds form",
            "Incomplete financial questionnaire /source of funds form",
            "Missing proof of source of funds form",
            "Missing financial questionnaire",
            "Wrong financial questionnaire/source of funds form",
            "Incorrect computation of the financial questionnaire",
        ],
    },
};
