# API Schema Change Documentation - Game Preview

This document describes recent changes to the API related to the game schema. The `image` field has been replaced with `preview`, which can contain either a filename of a saved image/video or a YouTube video link.

## Affected Endpoints

### DONE
**GET /games**
- **Response Change**: The `image` field in game objects has been replaced with `preview`
- **Example Response**:
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
      "preview": "bd4abb01-b428-4f0f-a866-33460d5b0c1a.webp", // Previously was "image"
      "price": 1500,
      "isPast": true,
      // Other game fields remain the same
    }
  ],
  "upcoming": [
    // Similar changes in upcoming games
  ]
}
```

### DONE
**GET /games/:id**
- **Response Change**: The `image` field is replaced with `preview`
- **Example Response**:
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
  "preview": "bd4abb01-b428-4f0f-a866-33460d5b0c1a.webp", // Previously was "image"
  "factions": [
    // Factions remain the same
  ],
  // Other game fields remain the same
}
```

### DONE
**GET /games/location/:locationId**
- **Response Change**: The `image` field is replaced with `preview` in all returned game objects
- Similar structure to the `/games` endpoint response

### DONE
**GET /gallery/:imageId**
- **Response Change**: When a gallery image has a game reference, the game object now contains `preview` instead of `image`
- This affects the populated game data in gallery image details

## Client-Side Implementation Notes

1. **Image/Video Display**:
   - The `preview` field can now contain either:
     - A filename for image (e.g., "bd4abb01-b428-4f0f-a866-33460d5b0c1a.webp")
     - A YouTube video link (e.g., "https://www.youtube.com/watch?v=dQw4w9WgXcQ")
   - Client applications should check if the preview value is a URL:
     ```javascript
     function isUrl(str) {
       try {
         new URL(str);
         return true;
       } catch {
         return false;
       }
     }
     
     // Usage:
     if (isUrl(game.preview)) {
       // Render as YouTube embed or video player
     } else {
       // Render as image with path: `/api/games/image/${game.preview}`
     }
     ```

2. **Admin Forms**:
   - Forms that previously uploaded to the `image` field should now upload to `preview`
   - Consider adding an option to input a YouTube URL instead of uploading a file