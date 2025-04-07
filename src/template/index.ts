export type AvailableTemplatesType = 'collab_lion_1';

export type Template = {
  id: AvailableTemplatesType; // Используется для сохранения в БД
  name: string; // Используется для отображения в интерфейсе админа
  help: string; // Используется для отображения в интерфейсе админа
} 

export const templates: Template[] = [
  {
    id: 'collab_lion_1',
    name: "Lion's Den - Chapter 01: The Morning Star",
    help: "Collaboration with Lion's Den. Used in `Chapter 01: The Morning Star`"
  }
] as const;