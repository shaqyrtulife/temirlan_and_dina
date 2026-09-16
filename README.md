# Той — онлайн приглашение (Абзал & Мерей)

Одностраничный сайт-приглашение на свадьбу: HTML + CSS + JS в одном файле `index.html`.

## Как изменить данные

Все настройки находятся в начале JS-блока в `index.html`, секция `CONFIG`:

- `groom`, `bride` — имена
- `eventDate` — дата (год, месяц, день), к ней привязаны календарь и таймер
- `eventTime` — время начала
- `program` — расписание
- `venueName`, `venueAddr`, `mapUrl` — место и ссылка на 2GIS
- `scriptUrl` — URL вашего Google Apps Script (см. ниже)
- `hosts` — «Той иелері»
- `assets` — пути к фото и музыке

## Медиа-файлы

Положите свои файлы в папку `assets/` (перезапишут SVG-заглушки):

- `hero.webp` — главное фото пары (обмен кольцами). Для оптимизации можно добавить уменьшенные версии `hero-480.webp` (480px) и `hero-960.webp` (960px).
- `bride.webp` — фото невесты (круглое, в тексте приглашения)
- `venue.webp` — фото ресторана/зала
- `closing.webp` — финальное фото (фон для таймера)
- `algyt-a-kjlek.mp3` — фоновая музыка (autoplay может блокироваться браузером; играет после первого касания)

Если `.webp` файла нет, автоматически показывается SVG-заглушка из `assets/`.

## Отправка ответов гостей в Google Таблицы (RSVP)

Форма «Сауалнама» отправляет ответы методом POST на Google Apps Script.

### Настройка

1. Создайте Google-таблицу (sheets.new).
2. Откройте **Расширения → Apps Script**.
3. Вставьте код ниже и сохраните.

Код добавляет заголовки автоматически, пишет в **первый лист** книги и возвращает ошибку, если что-то пошло не так (вместо всегда «успешно»). Для быстрой проверки добавлен и `doGet` — открыв URL развёртывания в браузере, вы увидите `{ ok: true }` или текст ошибки.

```javascript
function doPost(e) {
  return handle(e.parameter);
}

function doGet() {
  return handle({});
}

function handle(p) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var headers = ['Күні/уақыты', 'Аты-жөні', 'Қатысуы', 'Адам саны'];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    }
    if (p.name) {
      sheet.appendRow([new Date(), p.name || '', p.attend || '', p.guests || '']);
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. **Развернуть → Новое развертывание → Веб-приложение**:
   - Execute as (Выполнять от имени): **Я**
   - Access (Кто имеет доступ): **Любой**
5. Нажмите «Развернуть» и скопируйте URL вида `https://script.google.com/macros/s/XXX/exec`.
6. Вставьте его в `CONFIG.scriptUrl` в `script.js`.

## Локальный запуск

Просто откройте `index.html` в браузере. Для истории подключения можно использовать любой статик-сервер:

```
npx serve .
```