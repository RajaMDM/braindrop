export const AI_PROVIDERS = {
  claude:   { name:'Claude',   color:'#b44aff', model:'claude-haiku-4-5-20251001', keyField:'ckI', stateKey:'ck' },
  gemini:   { name:'Gemini',   color:'#00f5d4', model:'gemini-2.5-flash',          keyField:'gkI', stateKey:'gk' },
  openai:   { name:'GPT',      color:'#10a37f', model:'gpt-4o-mini',               keyField:'okI', stateKey:'ok' },
  groq:     { name:'Groq',     color:'#ff6d00', model:'llama-3.3-70b-versatile',   keyField:'qkI', stateKey:'qk' },
  deepseek: { name:'DeepSeek', color:'#4cc9f0', model:'deepseek-chat',             keyField:'dkI', stateKey:'dk' },
  mistral:  { name:'Mistral',  color:'#ff1744', model:'mistral-small-latest',      keyField:'mkI', stateKey:'mk' },
  nvidia:   { name:'NVIDIA',   color:'#76b900', model:'meta/llama-3.3-70b-instruct', keyField:'nvI', stateKey:'nv' },
  ollama:   { name:'Ollama',   color:'#8b5cf6', model:'llama3.2',                  keyField:'olURL', stateKey:'ol' }
};

export const PROVIDER_ORDER = ['nvidia','groq','gemini','openai','deepseek','mistral','claude','ollama'];
