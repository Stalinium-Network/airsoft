# Game Cards Feature Documentation

This document describes the implementation of the new `cards` feature in the game schema and the related API endpoints.

## Schema Changes

The game schema has been updated to include a `cards` property, which is a map (dictionary) where:
- Keys are card types from the predefined list: 'timeline', 'starter-pack'
- Values are Card objects with the following structure:
  ```typescript
  {
    title: string;      // Card title
    svgContent: string; // SVG content for the card graphic
    content: string;    // Text content of the card
  }
  ```

## API Endpoints

### Public Endpoints

#### GET /games
- **Changes:** Game objects now include the `cards` property
- **Response Example:**
```json
{
  "past": [
    {
      "_id": "64f3654c0e7100223c7545d0",
      "name": "Operation Recon",
      "preview": "bd4abb01-b428-4f0f-a866-33460d5b0c1a.webp",
      "cards": {
        "timeline": {
          "title": "Timeline",
          "svgContent": "<svg>...</svg>",
          "content": "Game timeline markdown content"
        },
        "starter-pack": {
          "title": "Starter Pack",
          "svgContent": "<svg>...</svg>",
          "content": "Items to bring markdown content"
        }
      },
      // ...other game fields
    }
  ],
  "upcoming": [
    // ...similarly structured game objects
  ]
}
```

#### GET /games/:id
- **Changes:** Game detail object now includes the `cards` property
- **Response Example:** Same card structure as above within a single game object

#### GET /games/location/:locationId
- **Changes:** Game objects now include the `cards` property
- **Response Example:** Similar to /games endpoint

### Admin Endpoints

#### GET /admin/card-types
- **New Endpoint:** Returns the available card types
- **Response Example:**
```json
{
  "types": ["timeline", "starter-pack"]
}
```

#### POST /admin/create-game
- **Request Change:** Accepts a new `cardsJson` field with stringified JSON
- **Example cardsJson value:**
```json
{
  "timeline": {
    "title": "Game Timeline",
    "svgContent": "<svg>...</svg>",
    "content": "## Timeline\n\n- 9:00 AM: Registration\n- 10:00 AM: Game start"
  },
  "starter-pack": {
    "title": "What to Bring",
    "svgContent": "<svg>...</svg>",
    "content": "## Required Items\n\n- Airsoft gun\n- Protection gear\n- Water"
  }
}
```

#### PUT /admin/update-game/:id
- **Request Change:** Accepts a new `cardsJson` field with stringified JSON
- **Example:** Same as for create-game endpoint

## Client-Side Implementation Notes

1. **Displaying Cards:**
   - Each card type represents a different section of information about the game
   - The `svgContent` can be rendered directly in the UI
   - The `content` field contains markdown text that should be rendered appropriately

2. **Admin Form Implementation:**
   - Add UI for creating/updating cards for each available card type
   - Ensure the form sends the stringified card data in the `cardsJson` field
   - Fetch available card types from the `/admin/card-types` endpoint

3. **Card Type Meaning:**
   - `timeline`: Information about the game schedule and timeline
   - `starter-pack`: Information about required equipment or preparations for players