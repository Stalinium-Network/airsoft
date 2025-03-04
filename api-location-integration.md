# API Documentation: Location Integration

## Overview

This document describes the changes to the API after integrating the locations feature. Games now have references to locations stored in a separate collection.

## Key Changes

- New Location schema with dedicated endpoints
- Games now reference locations by name (location ID)
- Game responses include location data automatically
- Separate image handling for locations
- Game coordinates are now sourced from Location objects

## Location Schema

```typescript
{
  _id: string,       // The location name (acts as ID)
  coordinates: string,
  image: string,     // Filename of the saved image
  description: string
}
```

## New Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/locations` | Get all locations |
| GET | `/api/locations/:id` | Get location by ID (name) |
| GET | `/api/locations/image/:filename` | Get location image |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/locations` | Get all locations |
| GET | `/api/admin/location/:id` | Get location by ID |
| POST | `/api/admin/create-location` | Create new location |
| DELETE | `/api/admin/delete-location/:id` | Delete location |

## Changes to Game Responses

Games now include location data directly in the location field:

```json
{
  "_id": "123",
  "name": "Game Name",
  "date": "2023-11-20",
  "location": {                        // Contains location object
    "_id": "Airsoft Stalker Field 228", 
    "coordinates": "50.0051,36.2310"
  },
  // ...other game fields
}
```

The `location` field contains basic location information (without image and description).

## Working with Locations

### Creating a Location

```
POST /api/admin/create-location
```

Request (multipart/form-data):
- `name`: Location name (will be used as ID)
- `coordinates`: Location coordinates
- `description`: Location description
- `file`: Image file (WebP format recommended)

Example:
```javascript
const formData = new FormData();
formData.append('name', 'Airsoft Stalker Field 228');
formData.append('coordinates', '50.0051,36.2310');
formData.append('description', 'Large field with diverse terrain');
formData.append('file', imageFile);

axios.post('/api/admin/create-location', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${token}`
  }
});
```

### Creating/Updating a Game with Location Reference

When creating or updating a game, simply include the location name as the `location` field:

```javascript
const formData = new FormData();
formData.append('name', 'Game Name');
formData.append('date', '2023-12-15');
formData.append('location', 'Airsoft Stalker Field 228'); // Reference to location
formData.append('coordinates', '50.1234,30.5678'); // FIX: Мы только что отказались от использования координат в игре, данные о координатах мы получаем из Location
// ...other fields
```

### Getting Images

- Game images: `/api/games/image/filename.webp`
- Location images: `/api/locations/image/filename.webp`

## Important Notes

1. **Location Deletion Safety**: Locations cannot be deleted if they are referenced by any games
2. **Location Names as IDs**: Location names serve as unique identifiers, so choose unique names
3. **Automatic Location Linking**: The API automatically links games to locations based on the name reference

## File Storage

- Game images are stored in `/files/airsoft/games/`
- Location images are stored in `/files/airsoft/locations/`
