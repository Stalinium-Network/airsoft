# API Changes: Dynamic Pricing Model and Templates

This document describes changes to the game schema and related API endpoints to support a dynamic pricing model with time-based price tiers and template references.

## Schema Changes

### 1. Removed Fields
- **`price`**: Single price field has been removed
- **`regInfo.opens`**: Registration opening date has been removed
- **`regInfo.closes`**: Registration closing date has been removed

### 2. New Fields
- **`prices`**: Array of price periods, each with:
  - `starts`: Date when this price tier begins
  - `ends`: Date when this price tier ends (optional for the last tier)
  - `price`: Numeric price value for this tier

- **`templates`**: Array of template IDs that the game uses
  - This allows associating games with specific templates for content generation

## API Endpoint Changes

### GET /games

**Response Change**: Each game object now includes:
- `prices` array instead of a single `price` field
- `currentPrice` field added with the currently applicable price
- `regInfo` no longer contains `opens` and `closes` properties
- `templates` array for linking games to predefined templates
- Registration status is now calculated using the first price period's `starts` date and last period's `ends` date

**Example Response:**
```json
{
  "past": [
    {
      "name": "Operation Desert Storm",
      "preview": "bd4abb01-b428-4f0f-a866-33460d5b0c1a.webp",
      "prices": [
        {
          "starts": "2023-05-01T00:00:00.000Z",
          "ends": "2023-05-15T00:00:00.000Z",
          "price": 1500
        },
        {
          "starts": "2023-05-15T00:00:00.000Z", 
          "ends": "2023-05-31T00:00:00.000Z",
          "price": 1800
        },
        {
          "starts": "2023-05-31T00:00:00.000Z",
          "ends": "2023-06-15T00:00:00.000Z",
          "price": 2000
        }
      ],
      "currentPrice": null, // Past game, no current price
      "regInfo": {
        "link": "https://example.com/register",
        "details": "Registration details...",
        "status": "closed" // Calculated status
      },
      "templates": ["basic-zone", "medical"], // Template IDs
      // ...other game fields
    }
  ],
  "upcoming": [
    // ...similarly structured game objects with activePrice calculated
  ]
}
```

### GET /games/:id

**Response Change**: Same changes as the `/games` endpoint for a single game object.

### GET /games/location/:locationId

**Response Change**: Same changes as the `/games` endpoint for the returned array of games.

## Admin Endpoints

### POST /admin/create-game

**Body Changes**:
- `price` field is replaced with `pricesJson`, containing a JSON string array of price periods
- `regInfo` no longer accepts or needs `opens` and `closes` properties
- Added support for `templatesJson` to set game templates

**Example Request:**
```javascript
const formData = new FormData();

// Add other game fields...

// Now add prices as a JSON string array
formData.append('pricesJson', JSON.stringify([
  {
    "starts": "2023-11-01T00:00:00.000Z",
    "ends": "2023-11-15T00:00:00.000Z", 
    "price": 1500
  },
  {
    "starts": "2023-11-15T00:00:00.000Z",
    "ends": "2023-11-30T00:00:00.000Z",
    "price": 1800 
  },
  {
    "starts": "2023-11-30T00:00:00.000Z",
    // No 'ends' for the last period if it ends on game day
    "price": 2000
  }
]));

// Add templates as a JSON string array
formData.append('templatesJson', JSON.stringify(["basic-zone", "medical"]));

// Registration info no longer includes opens/closes
formData.append('regInfoJson', JSON.stringify({
  "link": "https://example.com/register",
  "details": "Registration details with **markdown** support"
}));
```

### PUT /admin/update-game/:id

**Body Changes**: Same changes as for the create-game endpoint.

## Client-Side Implementation Notes

1. **Registration Status Calculation**:
   - Registration is "not-open" before first price period starts
   - Registration is "open" between first period start and last period end
   - Registration is "closed" after last period end date

2. **Current Price Display**:
   - Use the returned `currentPrice` field to display the active price to users
   - For past games, `currentPrice` may be null

3. **Admin Forms**:
   - Update forms to support multiple price tiers with start and end dates
   - Registration opening is now controlled by the start date of the first price tier
   - Registration closing is now controlled by the end date of the last price tier
   - Add support for selecting multiple templates from a list of available templates

4. **Templates**:
   - Templates are used to associate games with specific content generation templates
   - The client should fetch the available templates and allow selection through a multi-select control