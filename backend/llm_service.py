import re
from typing import Dict, Any
import httpx


class LLMService:
    def __init__(self):
        self.ollama_url = "http://localhost:11434/api/generate"
        self.ollama_model = "llama3.2"

    async def get_xp_amount(self, action_description: str, context: Dict) -> int:
        prompt = self._create_prompt(action_description, context)

        try:
            xp = await self._call_ollama(prompt)
            return min(max(xp, 0), 50)
        except Exception as e:
            print(f"LLM error: {e}")
            return self._fallback_xp(action_description)

    def _create_prompt(self, action: str, context: Dict) -> str:
        topic = context.get('topic', 'обучение')
        level = context.get('level', 1)

        return f"""Ты строгий экзаменатор. Твоя задача оценить действие по теме.

ТЕМА: "{topic}"
УРОВЕНЬ: {level}/10
ДЕЙСТВИЕ: "{action}"

ПРАВИЛА:
1. Если действие НЕ связано с темой "{topic}" → ответ 0
2. Если действие связано с темой → оцени от 0 до 50:
   - 0: ничего не сделано
   - 10-20: базовое действие
   - 21-35: хорошее действие
   - 36-50: отличное действие

ПРИМЕРЫ ДЛЯ ТЕМЫ "Английский язык":
- "решил задачу по математике" → 0
- "ничего не делал" → 0
- "выучил 10 слов" → 25
- "прочитал текст на английском" → 30

Ответь ТОЛЬКО ЧИСЛОМ. Например: 25"""

    async def _call_ollama(self, prompt: str) -> int:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.ollama_url,
                json={"model": self.ollama_model, "prompt": prompt, "stream": False},
                timeout=60.0
            )

            if response.status_code == 200:
                result = response.json()
                response_text = result.get("response", "")
                print(f"DEBUG: Ollama response: {response_text[:200]}")  # для отладки

                numbers = re.findall(r'\d+', response_text)
                if numbers:
                    return int(numbers[0])

            print(f"WARNING: No number found, status={response.status_code}")
            return 10

    def _fallback_xp(self, action: str) -> int:
        if len(action) < 20:
            return 5
        elif len(action) < 100:
            return 15
        else:
            return 25


llm_service = LLMService()
