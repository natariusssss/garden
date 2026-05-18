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
            result = await self._call_ollama(prompt)
            xp = result.get("xp", 10)
            return min(max(xp, 0), 50)
        except Exception as e:
            print(f"LLM error: {e}")
            return self._fallback_xp(action_description)

    def _create_prompt(self, action: str, context: Dict) -> str:
        return f"""
Оцени действие пользователя и напиши ТОЛЬКО ЧИСЛО XP от 0 до 50.

Контекст: тема "{context.get('topic', 'обучение')}", уровень {context.get('level', 1)}/10

Действие: "{action}"

Правила:
- 0-10: плохо
- 11-20: нормально
- 21-30: хорошо
- 31-40: отлично
- 41-50: превосходно

Ответь ТОЛЬКО ЧИСЛОМ. Например: 25
"""

    async def _call_ollama(self, prompt: str) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.ollama_url,
                json={
                    "model": self.ollama_model,
                    "prompt": prompt,
                    "stream": False,
                },
                timeout=30.0,
            )

            if response.status_code == 200:
                result = response.json()
                response_text = result.get("response", "10")
                numbers = re.findall(r"\d+", response_text)

                if numbers:
                    return {"xp": int(numbers[0])}

        return {"xp": 10}

    def _fallback_xp(self, action: str) -> int:
        if len(action) < 20:
            return 5
        elif len(action) < 100:
            return 15
        else:
            return 25


llm_service = LLMService()