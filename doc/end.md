# Game Management API Endpoints

This document describes the API endpoints used for creating and editing games in the Airsoft Backend system.

## Authentication

All admin endpoints require authentication with a valid JWT token.

```
Authorization: Bearer <your_jwt_token>
```

## Game Management Endpoints

### Get All Games (Admin View)

```
GET /admin/game-list
```

Returns all games divided into "past" and "upcoming" categories, with complete details.

**Response Example:**
```json
{
  "past": [
    {
      "_id": "64f3654c0e7100223c7545d0",
      "name": "Operation Blackout",
      "preview": "bd4abb01-b428-4f0f-a866-33460d5b0c1a.webp",
      "location": "Forest Base",
      "price": 1500,
      "isPast": true,
      "factions": [...],
      "cards": {...},
      "regInfo": {...},
      "description": "Past game description",
      "detailedDescription": "Detailed past game description",
      "date": "2023-08-20T10:00:00.000Z",
      "duration": 12
    }
  ],
  "upcoming": [...]
}
```

### Create Game

```
POST /admin/create-game
Content-Type: multipart/form-data
```

Creates a new game with the provided data.

**Form Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Game title |
| `location` | string | Yes | Location ID |
| `file` | file | No* | Image file for game preview (*Optional if YouTube link provided) |
| `preview` | string | No* | YouTube URL for game preview (*Optional if file uploaded) |
| `description` | string | Yes | Short game description |
| `detailedDescription` | string | Yes | Full game description with markdown support |
| `date` | string | Yes | Game date in ISO format (YYYY-MM-DDThh:mm) |
| `duration` | number | Yes | Game duration in hours |
| `price` | number | Yes | Game price |
| `isPast` | boolean | No | Whether this is a past game (default: false) |
| `factions` | string | Yes | JSON string of factions array |
| `cardsJson` | string | No | JSON string of cards object |
| `regInfoJson` | string | Yes | JSON string of registration info |

**Example Request:**

```javascript
const formData = new FormData();
formData.append('name', 'Operation Blackout');
formData.append('location', 'Forest Base');
formData.append('file', imageFile); // Or skip this if using YouTube
formData.append('preview', 'https://youtu.be/dQw4w9WgXcQ'); // Optional YouTube link
formData.append('description', 'Short game description');
formData.append('detailedDescription', 'Full **markdown** description');
formData.append('date', '2023-10-15T09:00:00');
formData.append('duration', '8');
formData.append('price', '1500');
formData.append('isPast', 'false');

// Factions array as JSON string
formData.append('factions', JSON.stringify([
  {
    "_id": "UNSC",
    "capacity": 30,
    "filled": 0,
    "details": "Modern military faction"
  },
  {
    "_id": "Covenant",
    "capacity": 30,
    "filled": 0,
    "details": "Alien coalition faction"
  }
]));

// Cards as JSON string
formData.append('cardsJson', JSON.stringify({
  "timeline": {
    "title": "Timeline",
    "svgContent": "<svg>...</svg>",
    "content": "## Timeline\n\n- 9:00 Registration\n- 10:00 Game start"
  },
  "starter-pack": {
    "title": "Starter Pack",
    "svgContent": "<svg>...</svg>",
    "content": "## Required items\n\n- Protection gear\n- Water"
  }
}));

// Registration info as JSON string
formData.append('regInfoJson', JSON.stringify({
  "link": "https://example.com/register",
  "opens": "2023-09-01T10:00:00.000Z",
  "closes": "2023-10-14T22:00:00.000Z",
  "details": "Registration details with **markdown** support"
}));
```

**Response:** The created game object

### Update Game

```
PUT /admin/update-game/:id
Content-Type: multipart/form-data
```

Updates an existing game with the provided data.

**URL Parameters:**
- `id`: Game ID to update

**Form Fields:**
Same as for the create endpoint, but all fields are optional. Only include fields you want to update.

**Example Request:**

```javascript
const formData = new FormData();
formData.append('name', 'Updated Game Name');
formData.append('price', '2000');

// Only if you want to update factions
formData.append('factions', JSON.stringify([...]));

// Only if you want to update the preview image
formData.append('file', newImageFile);
// OR if switching to YouTube video
formData.append('preview', 'https://youtu.be/newVideoId');

// Only if you want to update cards
formData.append('cardsJson', JSON.stringify({...}));

// Only if you want to update registration info
formData.append('regInfoJson', JSON.stringify({...}));
```

**Response:** The updated game object

### Delete Game

```
DELETE /admin/delete-game/:id
```

Deletes a game and its associated resources.

**URL Parameters:**
- `id`: Game ID to delete

**Response:**
```json
{
  "success": true,
  "message": "Game deleted successfully"
}
```

## Card Types

### Get Available Card Types

```
GET /admin/card-types
```

Retrieves the list of available card types that can be used in games.

**Response:**
```json
{
  "types": ["timeline", "starter_pack", "collab_lion"]
}
```

## Implementation Notes

1. **Preview Field**: 
   - Can contain either an uploaded image filename or a YouTube URL
   - If providing a YouTube URL, send it in the `preview` field
   - If uploading an image, use the `file` field

2. **Cards Structure**:
   - Each card type has `title`, `svgContent`, and `content` fields
   - The `content` field supports markdown formatting
   - Use the `GET /admin/card-types` endpoint to get the list of available card types

3. **Registration Info**:
   - Always required when creating a game
   - The `opens` and `closes` dates can be null
   - The `details` field supports markdown formatting