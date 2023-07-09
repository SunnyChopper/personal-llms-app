import { clear, get, set, keys } from "idb-keyval";
import { v4 as uuidv4 } from "uuid";

// Interfaces
import LLMActionQuestion from "../interfaces/LLMActionQuestion";
import UserAnswer from "../interfaces/UserAnswer";
import LLMAction from "../interfaces/LLMAction";

// Dummy data
const llmActions: LLMAction[] = [{
        id: 1,
        title: 'BrainstormGPT',
        description: 'Helps you brainstorm ideas for a given topic.',
        prompt: '',
        formatInstructions: ''
    },
    {
        id: 2,
        title: 'Decompose a Problem',
        description: 'Helps you decompose a problem into smaller sub-problems.',
        prompt: '',
        formatInstructions: ''
    },
    {
        id: 3,
        title: 'Tweet Topics Gen',
        description: 'Generate a list of topics to tweet about for a profile.',
        prompt: '',
        formatInstructions: ''
    },
    {
        id: 4,
        title: 'Mental Model Creator',
        description: 'Create a mental model for a given topic or problem.',
        prompt: '',
        formatInstructions: ''
    }
];

const llmActionQuestions: LLMActionQuestion[] = [
    {
        id: 1,
        llmActionId: 1,
        question: 'What do you want to brainstorm more ideas about?'
    }, {
        id: 2,
        llmActionId: 2,
        question: 'What problem would you like to decompose?'
    }, {
        id: 3,
        llmActionId: 3,
        question: 'What is the Twitter account about?'
    }, {
        id: 4,
        llmActionId: 3,
        question: 'What are you hoping to achieve with the topics generated?'
    }, {
        id: 5,
        llmActionId: 4,
        question: 'What is the topic or problem you want to create a mental model for?'
    }];

class DataService {
    /* IndexedDB Functions */
    static async clearData() { await clear(); }

    static async clearResponses(actionId: number) {
        await set(`action-${actionId.toString()}`, []);
    }

    static async getAnswer(questionId: number): Promise<string | undefined> {
        return await get(questionId);
    }

    static async getAnswers(): Promise<UserAnswer[]> {
        const answers: UserAnswer[] = [];
        const keysArray = await keys();
        for (const key of keysArray) {
            const answer = await get(key);
            answers.push({
                id: uuidv4(),
                questionId: parseInt(key.toString()),
                answer: answer,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        return answers;
    }
    
    static async getResponses(actionId: number): Promise<string[]> { 
        return await get(`action-${actionId.toString()}`) || [];
    }

    static async saveAnswer(questionId: number, answer: string): Promise<UserAnswer> {
        await set(questionId, answer);
        return {
            id: uuidv4(),
            questionId: questionId,
            answer: answer,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    }

    static async saveLLMResponse(actionId: number, response: string) {
        const existingResponses: string[] = await get(`action-${actionId.toString()}`) || [];
        existingResponses.push(response);
        await set(`action-${actionId.toString()}`, existingResponses);
    }

    static async printAllData() {
        const keysArray = await keys();
        for (const key of keysArray) {
            const answer = await get(key);
            
            if (typeof answer === 'object') {
                console.log(`Key: ${key}, Value: ${JSON.stringify(answer)}`);
                continue;
            }

            console.log(`Key: ${key}, Value: ${answer}`);
        }
    }

    /* Firebase Functions */
    static async getLLMActions(): Promise<LLMAction[]> {
        // TODO: Update the logic to fetch data from Firebase instead of returning dummy data
        for (let action of llmActions) {
            try {
                const promptResponse = await fetch(`/actions/prompts/${action.id}.md`);
                action.prompt = await promptResponse.text();
                const instructionsResponse = await fetch(`/actions/formatInstructions/${action.id}.md`);
                action.formatInstructions = await instructionsResponse.text();
            } catch (err) {
                console.error(`Error reading file from disk: ${err}`);
            }
        }

        return llmActions;
    }

    static async getLLMActionQuestions(llmActionId: number): Promise<LLMActionQuestion[]> {
        // TODO: Update the logic to fetch data from Firebase instead of returning dummy data
        return llmActionQuestions.filter(x => x.llmActionId === llmActionId);
    }
}

export default DataService;