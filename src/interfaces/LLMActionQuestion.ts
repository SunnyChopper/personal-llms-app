export default interface LLMActionQuestion { 
    id: number;
    llmActionId: number; // FK to LLMAction
    question: string;
    createdAt?: Date;
    updatedAt?: Date;
}