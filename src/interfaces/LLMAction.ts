export default interface LLMAction {
    id: number;
    title: string;
    prompt: string;
    description?: string;
    formatInstructions?: string;
    createdAt?: Date;
    updatedAt?: Date;
}