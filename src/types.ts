import { parseISO } from "date-fns";
import { z } from "zod";

// Schema for an ISO8601 date string
export const ISO8601DateString = z.string().refine(
    (arg): boolean => {
        if (parseISO(arg).toString() === "Invalid Date") {
            console.error(`Parsing of '${arg}' as ISO8601 date failed`);
            return false;
        }

        return true;
    },
    { message: `Value is not a valid date` },
);

export type ISO8601DateString = z.TypeOf<typeof ISO8601DateString>;

// Schema for the Document.data object
export const DocumentDataAny = z.any();
export type DocumentDataAny = z.TypeOf<typeof DocumentDataAny>;

export const DocumentData = z.object({
    _id: z.union([z.string(), z.number()]),
    _created: ISO8601DateString,
    _updated: ISO8601DateString,
}).catchall(z.any());

export type DocumentData = z.TypeOf<typeof DocumentData>;

// Schema for the database JSON file
export const DBJson = z.array(
    z.object({
        name: z.string(),
        data: z.array(DocumentData),
    }),
);

export type DBJson = z.TypeOf<typeof DBJson>;

// Meta data
export interface DatabaseMeta {
    created: ISO8601DateString;
    updated: ISO8601DateString;
}

export interface CollectionMeta {
    name: string;
    created: string;
    updated: string;
    autoId: number;
}
