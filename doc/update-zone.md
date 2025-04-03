# Schema and API Changes Documentation

This document outlines recent changes to the database schemas and explains how these changes affect the API endpoints.

## Schema Changes

### 1. Faction Schema
- **Added**: `camoSample` field (string)
  - Represents the filename of the camo sample image
  - Example: `"86cdfd2a-a44f-4a6e-a8aa-6574918a3817.webp"`
  - Access camo sample images via `/api/factions/camo-image/{filename}`

### 2. Location Schema
- **Replaced**: `image` field (string) with `images` field (string[])
  - Now supports multiple images per location
  - Each array item is a filename of a saved image
  - Example: `["00693719-93b5-44e2-81a5-d5ed444662ea.webp", "another-image.webp"]`
  - Access location images via `/api/locations/image/{filename}`

### 3. Game Schema
- **Removed**: `registrationLink` field (string) from both Game and Game.Faction
- **Added**: `regInfo` object with the following properties:
  - `link`: string | null - Registration link (replaces the old registrationLink field)
  - `opens`: Date | null - When registration opens
  - `closes`: Date | null - When registration closes
  - `details`: string - Additional details about registration (with Markdown support)

## API Endpoint Changes

### GET /games
- **Response change**: Location data now includes an `images` array instead of a single `image` field
- **Response change**: Games no longer have a `registrationLink` at the root level, but instead include a `regInfo` object
```json
{
  "past": [
    {
      "_id": "64f3654c0e7100223c7545d0",
      "name": "Operation Recon",
      "location": {
        "_id": "Forest Base",
        "coordinates": "50.123,30.456"
      },
      "image": "bd4abb01-b428-4f0f-a866-33460d5b0c1a.webp",
      "price": 1500,
      "isPast": true,
      "description": "Past game description",
      "date": "2023-08-20T10:00:00.000Z",
      "duration": 12,
      "detailedDescription": "Detailed past game description",
      "regInfo": {
        "link": "https://example.com/register",
        "opens": "2023-07-15T10:00:00.000Z",
        "closes": "2023-08-19T22:00:00.000Z",
        "details": "Registration closes 12 hours before the event."
      },
      "factions": [...]
    }
  ],
  "upcoming": [...]
}
```

### GET /games/:id
- **Response change**: In addition to the changes above
- **Response change**: Faction data now includes a `camoSample` field with the filename of the camo sample image
```json
{
  "_id": "64f3654c0e7100223c7545d0",
  "name": "Operation Blackout",
  "location": {
    "_id": "Forest Base",
    "coordinates": "50.123,30.456",
    "images": [
      "575f9e3e-38e1-40c9-a9b9-f766cadb1543.webp",
      "985b70ea-9415-4111-95c1-7e06ec374d54.webp"
    ],
    "description": "Deep forest terrain with multiple tactical zones"
  },
  "factions": [
    {
      "_id": "UNSC",
      "capacity": 50,
      "filled": 34,
      "details": "Modern military faction",
      "image": "6438eb7c-0bdc-49af-a6ab-8743b96cd449.webp",
      "shortDescription": "Advanced military force",
      "description": "Full faction description with markdown formatting",
      "camoSample": "86cdfd2a-a44f-4a6e-a8aa-6574918a3817.webp"
    },
    {
      // ...other factions
    }
  ],
  "regInfo": {
    "link": "https://example.com/register",
    "opens": "2023-09-01T10:00:00.000Z",
    "closes": "2023-09-30T22:00:00.000Z",
    "details": "Registration details with **markdown** support"
  },
  // ...other game fields
}
```

### POST /games (Admin)
- **Request change**: Must provide a `regInfo` object instead of `registrationLink`
  ```json
  {
    "name": "Game name",
    // ...other fields
    "regInfo": {
      "link": "https://example.com/registration",
      "opens": "2023-06-01T10:00:00Z", 
      "closes": "2023-06-15T10:00:00Z",
      "details": "Registration details with **markdown** support"
    }
  }
  ```
- **Form data change**: When submitting via form data, use `regInfoJson` field with stringified JSON

### PUT /games/:id (Admin)
- Same changes as POST /games

### GET /locations
- **Response change**: Each location now has an `images` array instead of a single `image` field
```json
[
  {
    "_id": "Forest Base",
    "coordinates": "50.123,30.456",
    "images": [
      "575f9e3e-38e1-40c9-a9b9-f766cadb1543.webp",
      "985b70ea-9415-4111-95c1-7e06ec374d54.webp"
    ],
    "description": "Deep forest terrain with multiple tactical zones"
  }
]
```

### POST /locations (Admin)
- **Request change**: Must provide uploads using the field name `files[]` for multiple images
- **Request change**: API expects form-data with files in the `files` field array

### PUT /locations/:id (Admin)
- Same changes as POST /locations

### GET /factions and GET /factions/:id
- **Response change**: Faction data now includes a `camoSample` field
```json
{
  "_id": "UNSC",
  "image": "6438eb7c-0bdc-49af-a6ab-8743b96cd449.webp",
  "shortDescription": "Advanced military force",
  "description": "Full faction description with markdown formatting",
  "camoSample": "86cdfd2a-a44f-4a6e-a8aa-6574918a3817.webp"
}
```

### POST /factions and PUT /factions/:id (Admin)
- **Request change**: Must upload both main image and camo sample using the field name `files[]`
- **Request change**: First file is treated as the main image, second file as the camoSample

## File Access URLs

- **Faction images**: `/api/factions/image/{filename}`
- **Faction camo samples**: `/api/factions/camo-image/{filename}`
- **Location images**: `/api/locations/image/{filename}`
- **Game images**: `/api/games/image/{filename}`

## Admin Panel Updates Required

1. **Location management**:
   - Update forms to allow uploading and managing multiple images for locations
   - Display multiple images in location details and edit views
   - Use `files[]` field for multiple file uploads

2. **Game management**:
   - Update forms to use the new `regInfo` object structure with opens/closes dates
   - Add support for Markdown in registration details
   - Use `regInfoJson` field for submitting structured data

3. **Faction management**:
   - Add support for uploading and displaying camo sample images
   - Update file upload field to support multiple files (main image and camo sample)

## Client-side Updates Required

1. **Game details page**:
   - Update to display registration information from the `regInfo` object
   - Show registration open/close dates and formatted Markdown details
   - Use `/api/factions/camo-image/{filename}` to display faction camo samples

2. **Location pages**:
   - Update gallery components to handle multiple images
   - Implement carousel or grid view for location images
   - Reference images using `/api/locations/image/{filename}` for each image in the array

3. **Faction details**:
   - Add display for camo sample images
   - Reference camo samples using `/api/factions/camo-image/{filename}`