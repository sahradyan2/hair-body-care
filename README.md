# Hair & Body Care

Сайт каталога косметики и продуктов по уходу за волосами.

## Ветки

- `main` — основная ветка с рабочим состоянием
- `develop` — ветка для разработки
- `prod` — продакшен/релизная ветка для деплоя

## Развертывание

Чтобы автоматически деплоить в продакшен, нужно:

1. Подключить удалённый Git репозиторий (GitHub/GitLab/Bitbucket)
2. Добавить SSH ключ в хостинг и секреты в CI
3. Скопировать публичный ключ:

   ```bash
   cat ~/.ssh/hairbodycare_prod_ed25519.pub
   ```

4. Настроить следующие секреты в CI:
   - `PROD_SSH_KEY`
   - `REMOTE_USER`
   - `REMOTE_HOST`
   - `REMOTE_PATH`

5. После пуша в ветку `prod` будет запускаться деплой.

## Локальный деплой

```bash
REMOTE_USER=deploy REMOTE_HOST=example.com REMOTE_PATH=/var/www/site/public_html ./scripts/deploy-prod.sh
```

## Git flow

```bash
git checkout develop
git pull origin develop
git checkout -b feature/my-fix
git push origin feature/my-fix
git checkout develop
git merge feature/my-fix
git push origin develop
git checkout prod
git merge develop
git push origin prod
```

## Примечание

Сценарий без тестов и без лишних сложностей: только релизная ветка и деплой на продакшен.
