# sportprog

Разворачивание:
1) Выкачать репозиторий.
2) Установить node.js (здесь версия 14.15.5)
3) Установить зависимости (прописаны в package.json) следующей командой: `npm install` (в терминале, в корне проекта)
4) Настроить базу (конфигурация находится в config.js и knex.js). Для PostgreSQL:
    1) Установить PostgresSQL или pgAdmin4 (графический интерфейс)
    2) Создать пользователя и базу (данные в конфиге).
    3) Восстановить базу из dump.sql
6) Запустить локальный сервер: `npm start`
7) Чтобы попасть в админку переходим в /users. Данные, если востанавливали дамп:
    * Логин: admin
    * Пароль: root
