Для запуска сервера, запустите в репозитории команду `npm init`, чтобы установить все зависимости

ВНИМАНИЕ!!! Сервер запуститься на порте 4444. Убедитесь, что он не занят.

Командой `npm start` запустите сервер

## Documentation:

### `POST /auth/login`

Запрос на авторизацию пользователя

**Ожидает: login, password.**

### `POST /auth/register`

Запрос на регистрацию пользователя

**Ожидает: fullName, login, password.**

### `GET /auth/me`

Запрос на получение информации об авторизированном пользователе

**Нужна авторизация.**

### `GET /posts`

Запрос на получение всех постов

### `GET /posts/:id`

Запрос на получение одного поста по id

### `POST /posts`

Запрос на создание поста

**Ожидает: title, text, imageUrl?. Нужна авторизация.**

### `DELETE /posts/:id`

Запрос на удаление поста по id

**Нужна авторизация.**

### `PATCH /posts/:id`

Запрос на обновление поста по id

**Нужна авторизация.**


Существующий пользователь:
login: tiga
password: 12345
