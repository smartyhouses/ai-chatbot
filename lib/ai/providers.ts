import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { xai } from '@ai-sdk/xai';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

import {createOpenAI} from '@ai-sdk/openai';

const openai = createOpenAI({
  // custom settings, e.g.
  baseURL="https://agnts.portalos.ru/v1",
  compatibility: 'strict', // strict mode, enable when using the OpenAI API
});

const model = openai.chat('gpt-3.5-turbo', {
  logitBias: {
    // optional likelihood for specific tokens
    '50256': -100,
  },
  user: 'test-user', // optional unique user identifier
});


export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': xai('grok-2-vision-1212'),
        'chat-model-reasoning': wrapLanguageModel({
          model: xai('grok-3-mini-beta'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': xai('grok-2-1212'),
        'artifact-model': xai('grok-2-1212'),
      },
      imageModels: {
        'small-model': xai.image('grok-2-image'),
      },
    });
