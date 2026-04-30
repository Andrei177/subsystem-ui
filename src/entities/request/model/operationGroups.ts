export const OPERATION_GROUPS = [
  {
    value: "READ_FILES_INFO",
    label: "Чтение информации о файлах",
  },
  {
    value: "DOWNLOAD_FILES",
    label: "Скачивание и просмотр информации файлов",
  },
  {
    value: "CREATE_FILES",
    label: "Создание файлов",
  },
  {
    value: "DELETE_FILES",
    label: "Удаление файлов",
  },
  {
    value: "UPDATE_FILES_INFO",
    label: "Обновление информации о файлах",
  },
  {
    value: "SEARCH_FILES",
    label: "Поиск файлов",
  },
  {
    value: "READ_USER_INFO",
    label: "Чтение информации о пользователе",
  },
  {
    value: "UPDATE_USER_INFO",
    label: "Обновление информации о пользователе",
  },
  {
    value: "OAUTH",
    label: "OAuth аутентификация",
  },
] as const;

export type OperationGroup = (typeof OPERATION_GROUPS)[number]["value"];
