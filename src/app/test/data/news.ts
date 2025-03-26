export interface NewsItem {
  _id: number;       // Уникальный идентификатор новости
  title: string;    // Заголовок новости
  category: string; // Категория новости (события, обновления и т.д.)
  date: Date;     // Дата публикации в формате объекта Date
  image: string;    // Путь к изображению новости
  description: string;  // Краткое описание или анонс новости
  pinned: boolean; // Флаг, указывающий является ли новость главной/рекомендуемой
  content?: string; // Полное содержимое статьи в формате Markdown
}

export const NEWS_CATEGORIES = [
  { id: "all", name: "All News" },
  { id: "events", name: "Events" },
  { id: "updates", name: "Updates" },
  { id: "announcements", name: "Announcements" },
  { id: "community", name: "Community" },
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    _id: 1,
    title: "New Equipment Rules for Winter Season",
    category: "updates",
    date: new Date("2023-11-15"),
    image: "/placeholder.jpg",
    description: "Updated equipment guidelines for the upcoming winter season to ensure safety and fair play in cold conditions.",
    pinned: true,
    content: `# New Equipment Rules for Winter Season

We're excited to announce our updated equipment guidelines for the upcoming winter season. These changes are designed to ensure safety and fair play in cold conditions.

## Key Changes

- **Minimum FPS Requirements**: Adjusted for cold weather performance
- **Battery Regulations**: New guidelines for LiPo batteries in cold conditions
- **Visibility Requirements**: Additional high-visibility options for snow environments
- **Cold Weather Protection**: Recommended gear for player safety

All players must review these guidelines before participating in winter events. Equipment checks will be performed before each game.`
  },
  {
    _id: 2,
    title: "Annual Tournament Registration Now Open",
    category: "events",
    date: new Date("2023-11-10"),
    image: "/placeholder.jpg",
    description: "Register now for our annual championship tournament with exciting new maps and special game modes.",
    pinned: false,
    content: `# Annual Tournament Registration Now Open

The wait is over! Registration for this year's championship tournament is now officially open. 

## Tournament Details

- **Dates**: December 15-17, 2023
- **Location**: Tactical Training Grounds
- **Team Size**: 4-6 players
- **Entry Fee**: $120 per team

We've designed exciting new maps and special game modes exclusively for this tournament. Early registration discounts are available until November 25.`
  },
  {
    _id: 3,
    title: "Community Spotlight: Team Phantom",
    category: "community",
    date: new Date("2023-11-07"),
    image: "/placeholder.jpg",
    description: "Get to know Team Phantom, the winners of our last major tournament and their unique strategies.",
    pinned: false,
    content: `# Community Spotlight: Team Phantom

This month's community spotlight features Team Phantom, the champions of our last major tournament.

## Team Background

Formed just two years ago, Team Phantom has quickly risen through the ranks with their innovative tactics and exceptional teamwork. Led by Captain Mike Richards, the team brings together players with diverse military and tactical backgrounds.

Their winning strategy combines aggressive pushing with sophisticated flanking maneuvers, taking many veteran teams by surprise.

Read our exclusive interview with the team to learn more about their preparation routine and future plans.`
  },
  {
    _id: 4,
    title: "New Field Opening Next Month",
    category: "announcements",
    date: new Date("2023-11-05"),
    image: "/placeholder.jpg",
    description: "We're excited to announce the opening of our new urban combat field with multiple buildings and tactical positions.",
    pinned: true,
    content: `# New Urban Combat Field Opening Next Month

We're thrilled to announce the grand opening of our newest playing field: Urban Assault.

## Field Features

- **Multiple Buildings**: Two-story structures with interconnected rooms
- **Vehicle Props**: Including an abandoned bus and cargo trucks
- **Sniper Towers**: Strategic high ground positions
- **Underground Tunnel System**: For stealthy flanking operations

This state-of-the-art urban combat simulation area spans over 5 acres and is designed to test your CQB skills like never before.

The grand opening event will take place on December 5th, featuring a special scenario game with limited spots available.`
  },
  {
    _id: 5,
    title: "Airsoft Safety Workshop",
    category: "events",
    date: new Date("2023-10-30"),
    image: "/placeholder.jpg",
    description: "Join our safety workshop for new players to learn proper equipment usage and game etiquette.",
    pinned: false,
    content: `# Airsoft Safety Workshop

Our next safety workshop for new players is scheduled for November 20. If you're new to airsoft or want to refresh your knowledge, this event is perfect for you.

## Workshop Topics

- **Eye Protection Standards**: Understanding ANSI ratings
- **Safe Weapon Handling**: Proper carrying and firing techniques
- **Field Safety Rules**: Common regulations and why they matter
- **Game Etiquette**: Hit calling, overshooting, and sportsmanship

All participants will receive a safety certification valid at our fields and many partner locations.

Registration is free but required as spots are limited to ensure quality instruction.`
  },
  {
    _id: 6,
    title: "Rule Updates for CQB Engagements",
    category: "updates",
    date: new Date("2023-10-25"),
    image: "/placeholder.jpg",
    description: "Important updates to close-quarters battle rules that will be implemented in all upcoming games.",
    pinned: false,
    content: `# Rule Updates for CQB Engagements

We've revised our close-quarters battle (CQB) rules to enhance player safety and game experience.

## Key Rule Changes

- **Engagement Distance**: Minimum engagement distance reduced to 10 feet
- **Weapon Transition**: New guidelines for switching to sidearms in CQB
- **Bang-Bang Rule**: Updated to include a "surrender" option
- **Blind Fire Prevention**: Stricter penalties for blind firing around corners

These changes were developed based on player feedback and industry best practices. They'll go into effect for all games starting November 1st.

Please review the full rulebook on our website for complete details.`
  },
];
