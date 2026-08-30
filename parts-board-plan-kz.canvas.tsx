import {
  BarChart,
  Callout,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Pill,
  Row,
  Spacer,
  Stack,
  Stat,
  Table,
  Text,
  useHostTheme,
} from "cursor/canvas";

const RATE_MID = 12_000; // KZT/час, middle fullstack KZ
const RATE_SENIOR = 18_000;
const RATE_DESIGN = 10_000;
const RATE_PM = 9_000;

type Line = {
  stage: string;
  who: string;
  hours: number;
  rate: number;
  note: string;
};

const DEV_LINES: Line[] = [
  {
    stage: "1. Продукт и прототип",
    who: "PM + дизайн",
    hours: 40,
    rate: RATE_PM,
    note: "Сценарии, wireframes, тексты, структура блоков",
  },
  {
    stage: "2. Дизайн UI",
    who: "Дизайнер",
    hours: 48,
    rate: RATE_DESIGN,
    note: "Мобильный + десктоп, кабинет клиента и поставщика",
  },
  {
    stage: "3. Ядро платформы",
    who: "Middle fullstack",
    hours: 120,
    rate: RATE_MID,
    note: "Регистрация, роли, объявления, поиск, админка",
  },
  {
    stage: "4. Автозапчасти MVP",
    who: "Middle fullstack",
    hours: 80,
    rate: RATE_MID,
    note: "VIN / артикул / штрихкод, подсказки «укажите больше данных»",
  },
  {
    stage: "5. Категоризация по тексту",
    who: "Middle + senior",
    hours: 56,
    rate: RATE_SENIOR,
    note: "Правила + ИИ-подсказка категории по описанию",
  },
  {
    stage: "6. Кабинет поставщика",
    who: "Middle fullstack",
    hours: 72,
    rate: RATE_MID,
    note: "Лента заявок, отклики, чат/переписка, статусы",
  },
  {
    stage: "7. Сделки, рейтинг, отзывы",
    who: "Middle fullstack",
    hours: 64,
    rate: RATE_MID,
    note: "Успешная сделка, оценка, комментарий, модерация",
  },
  {
    stage: "8. Фото и хранилище",
    who: "Middle fullstack",
    hours: 32,
    rate: RATE_MID,
    note: "Загрузка, сжатие, лимиты, CDN/S3-совместимое хранилище",
  },
  {
    stage: "9. Уведомления",
    who: "Middle fullstack",
    hours: 40,
    rate: RATE_MID,
    note: "Email + Telegram/WhatsApp (опционально на старте)",
  },
  {
    stage: "10. Тесты, деплой, запуск KZ",
    who: "Middle + PM",
    hours: 48,
    rate: RATE_MID,
    note: "Хостинг, домен .kz, SSL, бэкапы, чек-лист запуска",
  },
];

function money(n: number): string {
  return new Intl.NumberFormat("ru-KZ").format(Math.round(n)) + " ₸";
}

function lineCost(l: Line): number {
  return l.hours * l.rate;
}

const totalHours = DEV_LINES.reduce((s, l) => s + l.hours, 0);
const totalDev = DEV_LINES.reduce((s, l) => s + lineCost(l), 0);
const contingency = Math.round(totalDev * 0.15);
const infraYear = 600_000; // домен, VPS, хранилище, SMS/почта — грубо на год
const grand = totalDev + contingency + infraYear;

const chartData = DEV_LINES.map((l) => ({
  label: l.stage.replace(/^\d+\.\s*/, "").slice(0, 22),
  value: Math.round(lineCost(l) / 1000),
}));

export default function PartsBoardPlanKz() {
  const theme = useHostTheme();

  return (
    <Stack gap={24}>
      <Stack gap={8}>
        <H1>Доска объявлений: автозапчасти (KZ)</H1>
        <Text tone="secondary">
          Понимание задачи · сценарий «как на видео» · план разработки с
          трудозатратами в тенге
        </Text>
        <Row gap={8} wrap>
          <Pill tone="info">MVP: автозапчасти</Pill>
          <Pill>Потом: другие блоки</Pill>
          <Pill tone="success">Казахстан</Pill>
        </Row>
      </Stack>

      <Grid columns={4} gap={12}>
        <Stat value={money(totalDev)} label="Разработка (оценка)" />
        <Stat value={`${totalHours} ч`} label="Трудозатраты" />
        <Stat value={money(contingency)} label="Запас 15%" tone="warning" />
        <Stat value={money(grand)} label="Итого с инфрой/год" tone="success" />
      </Grid>

      <Callout tone="info" title="Ставка для расчёта">
        Middle fullstack ≈ {money(RATE_MID)}/час · senior ≈ {money(RATE_SENIOR)}
        /час · дизайн ≈ {money(RATE_DESIGN)}/час. Это ориентир по рынку
        Казахстана для небольшой команды / подрядчика, не жёсткий прайс.
      </Callout>

      <Divider />

      <H2>1. Что понял</H2>
      <Text>
        Вы с братом Серёгой и его другом Мансуром хотите сделать портал вроде
        доски объявлений, но не «просто куплю/продам», а{" "}
        <Text weight="semibold">заявка клиента → отработка поставщиками</Text>.
        Сейчас фокус —{" "}
        <Text weight="semibold">автозапчасти</Text>. Позже те же механики
        можно открыть для других блоков (например, комплектующие ПК).
      </Text>

      <Grid columns={2} gap={16}>
        <Card>
          <CardHeader>Клиент</CardHeader>
          <CardBody>
            <Stack gap={8}>
              <Text>
                Заходит, описывает нужную запчасть своими словами. Может
                добавить VIN, артикул, штрихкод и фото.
              </Text>
              <Text>
                Сайт по описанию{" "}
                <Text weight="semibold">предлагает категорию</Text> (не
                заставляет угадывать справочник).
              </Text>
              <Text>
                Если данных мало — мягко подсказывает: «с VIN / артикулом
                поставщики ответят точнее и быстрее».
              </Text>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Поставщик</CardHeader>
          <CardBody>
            <Stack gap={8}>
              <Text>
                Заходит в кабинет, видит подходящие заявки, откликается,
                ведёт переписку / сделку.
              </Text>
              <Text>
                После успешной сделки —{" "}
                <Text weight="semibold">рейтинг и комментарий</Text> о
                поставщике.
              </Text>
              <Text>
                Может прикладывать фото к предложениям / товарам.
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      <Callout tone="neutral" title="Что пока не заложено в MVP (осознанно)">
        Полноценный маркетплейс с оплатой на сайте, доставка, складской учёт
        1С, мобильное приложение. Это можно добавить после того, как пойдёт
        поток заявок и откликов.
      </Callout>

      <Divider />

      <H2>2. План «человеческим языком» (как сценарий ролика)</H2>
      <Text tone="secondary">
        Можно читать вслух Серёге и Мансуру за 3–4 минуты.
      </Text>

      <Stack gap={12}>
        <Card variant="borderless">
          <CardHeader trailing={<Pill size="sm">0:00</Pill>}>
            Зачем мы это делаем
          </CardHeader>
          <CardBody>
            <Text>
              В Казахстане человек часто знает, что «нужна деталь на машину»,
              но не знает точный артикул. Поставщики есть, но искать по чатам
              долго. Мы делаем место, где клиент пишет запрос один раз, а
              поставщики сами приходят с ответом.
            </Text>
          </CardBody>
        </Card>

        <Card variant="borderless">
          <CardHeader trailing={<Pill size="sm">0:40</Pill>}>
            Первый экран — автозапчасти
          </CardHeader>
          <CardBody>
            <Text>
              Клиент открывает сайт и сразу попадает в блок «Автозапчасти».
              Большая форма: «Что нужно?» — свободный текст. Рядом поля VIN,
              артикул, штрихкод — необязательные, но помечены как «лучше
              указать». Пока пишет — сайт предлагает категорию: тормозные
              колодки, фильтры, подвеска и т.д. Можно поправить вручную.
            </Text>
          </CardBody>
        </Card>

        <Card variant="borderless">
          <CardHeader trailing={<Pill size="sm">1:20</Pill>}>
            Фото и заявка ушла
          </CardHeader>
          <CardBody>
            <Text>
              Клиент загружает фото сломанной детали или скрин из другой
              программы, оставляет телефон / Telegram, нажимает «Разместить».
              Заявка появляется в ленте поставщиков. Клиент видит статус:
              «ожидает откликов», «есть предложения», «сделка закрыта».
            </Text>
          </CardBody>
        </Card>

        <Card variant="borderless">
          <CardHeader trailing={<Pill size="sm">2:00</Pill>}>
            Работа поставщика
          </CardHeader>
          <CardBody>
            <Text>
              Поставщик регистрируется, подтверждает профиль. В кабинете —
              фильтр по категориям и региону. На заявку отвечает ценой,
              сроком и фото товара. Клиент выбирает, с кем идёт дальше.
              Когда оба подтверждают успех — сделка засчитывается.
            </Text>
          </CardBody>
        </Card>

        <Card variant="borderless">
          <CardHeader trailing={<Pill size="sm">2:40</Pill>}>
            Рейтинг и доверие
          </CardHeader>
          <CardBody>
            <Text>
              После сделки клиент ставит оценку и пишет короткий комментарий.
              У поставщика растёт рейтинг и число успешных сделок. Новым
              людям проще выбрать, с кем работать. Плохие отзывы
              модерируются, чтобы не было накруток и оскорблений.
            </Text>
          </CardBody>
        </Card>

        <Card variant="borderless">
          <CardHeader trailing={<Pill size="sm">3:10</Pill>}>
            Что дальше
          </CardHeader>
          <CardBody>
            <Text>
              Когда автозапчасти заработают, тем же каркасом открываем второй
              блок — например «Комплектующие для ПК»: тот же принцип «описал
              → категория → отклики → рейтинг». Не новый сайт, а новые
              разделы на одной платформе.
            </Text>
          </CardBody>
        </Card>
      </Stack>

      <Divider />

      <H2>3. Роли и экраны MVP</H2>
      <Table
        headers={["Роль", "Что умеет на старте"]}
        rows={[
          [
            "Гость / клиент",
            "Создать заявку, фото, VIN/артикул, видеть отклики, закрыть сделку, оставить отзыв",
          ],
          [
            "Поставщик",
            "Профиль, лента заявок, отклик с ценой и фото, переписка, история сделок, рейтинг",
          ],
          [
            "Админ",
            "Категории, модерация объявлений и отзывов, блокировка, базовая статистика",
          ],
        ]}
        columnAlign={["left", "left"]}
      />

      <Spacer height={8} />
      <H3>Подсказка «укажите больше данных»</H3>
      <Text>
        На форме заявки — прогресс полноты: текст → +фото → +VIN → +артикул.
        Чем полнее, тем выше шанс быстрого точного ответа. Без жёсткой
        блокировки: можно отправить и с одним описанием.
      </Text>

      <Divider />

      <H2>4. План разработки и деньги</H2>
      <Text tone="secondary">
        Срок ориентировочно 2,5–3,5 месяца при 1 middle fullstack + дизайн
        part-time. Суммы — оценка подрядной разработки, без вашей
        собственной «бесплатной» работы.
      </Text>

      <BarChart
        categories={chartData.map((d) => d.label)}
        series={[{ name: "Стоимость этапа, тыс. ₸", data: chartData.map((d) => d.value) }]}
        height={260}
      />
      <Text tone="secondary" style={{ fontSize: 12 }}>
        Source: внутренняя оценка · ставка middle/senior KZ · тыс. тенге за этап
      </Text>

      <Spacer height={12} />

      <Table
        headers={["Этап", "Кто", "Часы", "Ставка", "Сумма", "Содержание"]}
        rows={DEV_LINES.map((l) => [
          l.stage,
          l.who,
          String(l.hours),
          money(l.rate),
          money(lineCost(l)),
          l.note,
        ])}
        rowTone={DEV_LINES.map(() => "neutral" as const)}
      />

      <Grid columns={3} gap={12}>
        <Card>
          <CardHeader>Чистая разработка</CardHeader>
          <CardBody>
            <Stack gap={4}>
              <Text weight="semibold" style={{ fontSize: 20 }}>
                {money(totalDev)}
              </Text>
              <Text tone="secondary">{totalHours} часов по этапам выше</Text>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Запас на риски 15%</CardHeader>
          <CardBody>
            <Stack gap={4}>
              <Text weight="semibold" style={{ fontSize: 20 }}>
                {money(contingency)}
              </Text>
              <Text tone="secondary">
                Правки ТЗ, интеграции, сюрпризы VIN/ИИ
              </Text>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Инфра на 1 год</CardHeader>
          <CardBody>
            <Stack gap={4}>
              <Text weight="semibold" style={{ fontSize: 20 }}>
                {money(infraYear)}
              </Text>
              <Text tone="secondary">
                VPS, домен .kz, SSL, бэкапы, почта, хранилище фото
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      <Card variant="borderless">
        <CardHeader>Итого к запуску MVP (ориентир)</CardHeader>
        <CardBody>
          <Stack gap={8}>
            <Text weight="semibold" style={{ fontSize: 22, color: theme.accent }}>
              {money(grand)}
            </Text>
            <Text>
              Диапазон «в жизнь»: примерно{" "}
              <Text weight="semibold">
                {money(grand * 0.85)} – {money(grand * 1.25)}
              </Text>
              , если меняется объём чата, ИИ или уведомлений.
            </Text>
          </Stack>
        </CardBody>
      </Card>

      <Divider />

      <H2>5. Этапы по времени</H2>
      <Table
        headers={["Недели", "Результат, который можно показать"]}
        rows={[
          ["1–2", "Прототип и дизайн ключевых экранов"],
          ["3–6", "Работает публикация заявок + кабинеты + фото"],
          ["7–9", "Отклики, сделки, рейтинг, подсказки полноты данных"],
          ["10–11", "Категоризация по описанию, полировка, тест с реальными поставщиками"],
          ["12", "Запуск на домене, обучение Серёги/Мансура, поддержка старта"],
        ]}
      />

      <Divider />

      <H2>6. Что решить до старта работ</H2>
      <Table
        headers={["Вопрос", "Зачем"]}
        rows={[
          [
            "Кто владелец продукта и домена?",
            "Юрлицо / ИП, договор, доступ к хостингу",
          ],
          [
            "Монетизация с дня 1 или позже?",
            "Бесплатный запуск vs платные отклики / подписка поставщика",
          ],
          [
            "Только KZ или сразу СНГ?",
            "Язык (RU/KK), валюта, регионы доставки",
          ],
          [
            "Чат внутри сайта или увод в WhatsApp/Telegram?",
            "Сильно влияет на сроки и удержание на платформе",
          ],
          [
            "Нужна ли проверка поставщиков (ИИН/БИН)?",
            "Доверие vs скорость набора базы",
          ],
        ]}
      />

      <Callout tone="success" title="Следующий шаг">
        Если план ок — следующим сообщением можно зафиксировать короткое ТЗ
        MVP (1–2 страницы) и выбрать стек под ваш хостинг. Разработку лучше
        начинать с прототипа формы заявки и кабинета поставщика — это ядро
        продукта.
      </Callout>
    </Stack>
  );
}
