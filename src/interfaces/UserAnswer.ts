export default interface UserAnswer { 
    id?: number | string;
    questionId: number; // FK to LLMActionQuestion
    answer: string;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}