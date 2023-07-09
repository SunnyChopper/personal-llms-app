import { HumanChatMessage, SystemChatMessage, BaseChatMessage } from "langchain/schema";
import { ChatOpenAI } from "langchain/chat_models/openai";

// Interfaces
import LLMActionQuestion from "../interfaces/LLMActionQuestion";
import UserAnswer from "../interfaces/UserAnswer";
import LLMAction from "../interfaces/LLMAction";

// Constants
import { OPENAI_SECRET_KEY } from "../constants/LocalStorageKeys";

class LLMService {
    chat: ChatOpenAI;

    constructor() {
        this.chat = new ChatOpenAI({ temperature: 0.7, openAIApiKey: localStorage.getItem(OPENAI_SECRET_KEY) || '' });
    }

    async runAction(action: LLMAction, questions: LLMActionQuestion[], userAnswers: {[key: number]: UserAnswer}): Promise<string> {
        const messages: BaseChatMessage[] = [new SystemChatMessage(action.prompt)];

        // Loop through the user answers and create one big string with the corresponding question
        let humanUserAnswers: string = '';
        for (const question of questions) {
            const userAnswer: UserAnswer = userAnswers[question.id];
            if (userAnswer) {
                humanUserAnswers += `Q: ${question.question}\nA: ${userAnswer.answer}\n`;
            }
        }

        if (action.formatInstructions !== undefined) {
            messages.push(new SystemChatMessage(`Response format instructions: ${action.formatInstructions}`));
        }

        messages.push(new HumanChatMessage(humanUserAnswers));
        console.log("🚀 ~ file: LLMService.ts:36 ~ LLMService ~ runAction ~ messages:", messages);

        const response: BaseChatMessage = await this.chat.call(messages);
        console.log("🚀 ~ file: LLMService.ts:32 ~ LLMService ~ runAction ~ response:", response);
        return response.text;
    }
}

export default LLMService;