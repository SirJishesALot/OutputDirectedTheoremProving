import { Theorem } from "../parser/parsedTypes";

export interface ProofGenerationContext {
    completionTarget: string;
    contextTheorems: Theorem[];
}
