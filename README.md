# Zmeika Igra

Браузерная игра «Змейка». Актуальная версия кода и документации хранится в этом GitHub-репозитории.

[Открыть в GitHub Codespaces](https://codespaces.new/deevalexandr10-prod/zmeika-igra)

## Быстрый старт в Codespaces

1. Нажмите ссылку выше или откройте **Code → Codespaces → Create codespace on main**.
2. Дождитесь завершения автоматической установки зависимостей.
3. В терминале выполните:

```bash
pnpm dev
```

4. Откройте предложенный браузерный preview для порта `3000`.

## Проверка проекта

```bash
pnpm lint
pnpm test
```

## Работа с любого компьютера

GitHub — единственный источник правды. Перед началом локальной работы получите последние изменения:

```powershell
git pull --ff-only
```

После работы сохраните результат в GitHub:

```powershell
git status
git add <нужные-файлы>
git commit -m "Краткое описание изменения"
git push
```

Если локальная настройка не нужна, используйте Codespaces: среда разработки открывается прямо в браузере, а изменения сохраняются в репозитории после commit и push.

## Локальный запуск в VS Code

Требуется Node.js версии `22.13.0` или новее и `pnpm`.

```powershell
git clone https://github.com/deevalexandr10-prod/zmeika-igra.git
Set-Location zmeika-igra
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

## Секреты

- Настоящий `.env` не коммитится.
- Безопасный список переменных хранится в `.env.example`.
- Для Codespaces секреты добавляются через GitHub Codespaces secrets.

Текущая точка продолжения работы: [PROJECT_STATUS.md](PROJECT_STATUS.md).

