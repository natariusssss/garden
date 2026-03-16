
Backend requires Python 3.11/3.12

Перейдите в папку backend:
```bash
cd backend
```
Создайте виртуальное окружение:
```bash
python -m venv venv
```
Активируйте его.

Windows
```bash
venv\Scripts\activate
```
Linux / Mac
```bash
source venv/bin/activate
```bash

Установите зависимости:
```bash
pip install -r requirements.txt
```
Запустите сервер:

```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8001
```

Backend будет доступен по адресу:

http://127.0.0.1:8001

Swagger документация:
http://127.0.0.1:8001/docs


Запуск Frontend

Перейдите в папку frontend:
```bash
cd frontend
```
Установите зависимости:
```bash
npm install
```
Запустите dev сервер:
```bash
npm run dev
```

Frontend будет доступен по адресу:
http://localhost:5173