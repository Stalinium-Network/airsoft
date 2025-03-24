# Fraction System Implementation

## Overview
The airsoft system has been enhanced with a new fraction management system. Players can now join specific fractions within a game, each with its own theme, description and capacity.

## API Changes

### Data Structure
Games now use fractions instead of generic capacity. Each game can have a main registration link and each fraction has its own game-specific data:

```json
{
  "_id": "gameId",
  "name": "Game Title",
  "location": "Location Name",
  "image": "game-image.jpg",
  "registrationLink": "https://example.com/register/game1",
  "fractions": [
    {
      "_id": "fraction1",
      "capacity": 20,
      "filled": 5,
      "registrationLink": null,
      "details": "For experienced snipers only"
    },
    {
      "_id": "fraction2",
      "capacity": 20,
      "filled": 10,
      "registrationLink": "https://example.com/register/game1/fraction2",
      "details": "Beginners welcome, assistance provided"
    }
  ],
  "price": 2000,
  "isPast": false,
  "description": "Short game description",
  "date": "2023-10-15T10:00:00.000Z",
  "duration": 6,
  "detailedDescription": "Full game description with rules"
}
```

### Fraction Templates
Fractions are defined as templates that can be reused across multiple games:

```json
{
  "_id": "fractionName",
  "image": "fraction-image.webp",
  "shortDescription": "Brief description of the fraction",
  "description": "Full markdown description of the fraction"
}
```

Game-specific fraction data (capacity, filled, registrationLink, details) is set when adding a fraction to a game.

### Endpoint Updates

#### Unchanged Endpoints
The following endpoints remain unchanged:
- `GET /api/fractions` - Get all fraction templates
- `GET /api/fractions/:id` - Get specific fraction template
- `GET /api/games` - List all games (categorized by past/upcoming)
- `GET /api/games/:id` - Get detailed game information

#### Updated Response Structure
When retrieving game details, each fraction now includes:
- Template data: `image`, `shortDescription`, `description` (from fraction template)
- Game-specific data: `capacity`, `filled`, `registrationLink` and new field `details`

#### Admin Endpoints for Creation/Update
When creating or updating games with `POST /api/admin/create-game` or `PUT /api/admin/update-game/:id`:
- Include `details` for each fraction in the `fractions` array
- If omitted, `details` defaults to "No details"

Example fraction data in request:
```json
{
  "_id": "fraction1", 
  "capacity": 20,
  "filled": 0,
  "registrationLink": "https://example.com/register/game1/fraction1",
  "details": "Special instructions for this fraction in this specific game"
}
```

## Frontend Implementation Notes

1. **Game Lists**: The UI should render multiple fractions per game with capacity bars for each fraction.

2. **Game Details**: When displaying detailed game info, show each fraction with:
   - Fraction image (from template)
   - Capacity/filled indicator (from game)
   - Description (from template)
   - Registration button that uses:
     - Fraction-specific registration link if available
     - Game-wide registration link as fallback
     - Internal registration workflow if no links are provided
   - Game-specific fraction data including the new `details` field
   - This `details` field can be used to display special instructions for players interested in a specific fraction

3. **Joining Games**: Users now join specific fractions rather than just the game:
   - Update registration forms to include fraction selection
   - Track user's fraction in registrations
   - Use the appropriate registration link based on the hierarchy described above

4. **Admin Panel**:
   - Manage fraction templates (image, descriptions, etc.)
   - When creating/editing games:
     - Set the main game registration link
     - Associate fraction templates with the game
     - Specify capacity for each fraction
     - Optionally override with fraction-specific registration links
     - Provide input fields for fraction-specific details
     - This allows setting specific instructions or requirements for each fraction in this particular game

5. **Image Paths**:
   - Fraction images are accessed at: `/api/fractions/image/{filename}`

## Migration Considerations
- Create fraction templates for all existing fractions
- Update games to include both game-wide registration links and specific fraction links
- Set appropriate defaults (null) for registration links
