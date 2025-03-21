# Fraction System Implementation

## Overview
The airsoft system has been enhanced with a new fraction management system. Players can now join specific fractions within a game, each with its own theme, description and capacity.

## API Changes

### Data Structure
Games now use fractions instead of generic capacity:

```json
{
  "_id": "gameId",
  "name": "Game Title",
  "location": "Location Name",
  "image": "game-image.jpg",
  "fractions": [
    {
      "_id": "fraction1",
      "capacity": 20,
      "filled": 5,
      "link": "/join/game/fraction1" 
    },
    {
      "_id": "fraction2",
      "capacity": 20,
      "filled": 10,
      "link": "/join/game/fraction2"
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

### New Endpoints

#### Public Endpoints

- `GET /api/fractions` - Get list of all fractions
- `GET /api/fractions/:id` - Get fraction details by ID
- `GET /api/fractions/image/:filename` - Serve fraction images (static)

#### Admin Endpoints

- `POST /api/admin/create-fraction` - Create new fraction (multipart/form-data)
- `PUT /api/admin/update-fraction/:id` - Update fraction (multipart/form-data)
- `DELETE /api/admin/delete-fraction/:id` - Delete fraction

### Enhanced Game Details
When requesting a specific game (`GET /api/games/:id`), fraction data now includes:
- `image` - Fraction's image
- `shortDescription` - Brief description of the fraction
- `description` - Full markdown description

## Frontend Implementation Notes

1. **Game Lists**: The UI should render multiple fractions per game with capacity bars for each fraction.

2. **Game Details**: When displaying detailed game info, show each fraction with:
   - Fraction image
   - Capacity/filled indicator
   - Description (potentially in tabs or accordions)
   - Join button specific to each fraction

3. **Joining Games**: Users now join specific fractions rather than just the game:
   - Update registration forms to include fraction selection
   - Track user's fraction in registrations
   - Display appropriate fraction imagery on confirmation

4. **Admin Panel**:
   - Create new section for fraction management
   - Allow image upload for fractions
   - Support markdown in fraction descriptions
   - Show fraction usage across different games

5. **Image Paths**:
   - Fraction images are accessed at: `/api/fractions/image/{filename}`

## Migration Considerations
- Update existing games to use the fraction model
- Create default fractions for all scenarios
- Ensure registration logic handles fraction-specific capacities
