# Team System API Documentation

## Overview
API endpoints for retrieving and managing the airsoft team members.

## Data Structure

Each team member has the following structure:

```json
{
  "_id": "Name",
  "name": "Player Nickname",
  "image": "member-image.webp",
  "description": "Description of the team member"
}
```

## API Endpoints

### Public Endpoints

#### Get All Team Members
- **GET** `/api/team`
- **Returns**: `TeamMember[]`
- Returns all team members

#### Get Team Member
- **GET** `/api/team/{id}`
- **Parameters**:
  - `id`: string (member identifier)
- **Returns**: `TeamMember`
- Returns a specific team member details

#### Get Team Member Image
- **GET** `/api/team/image/{filename}`
- **Parameters**:
  - `filename`: string
- **Returns**: Image file
- Static route to serve team member images

### Admin Endpoints

#### Get Team Members (Admin)
- **GET** `/api/admin/team`
- **Returns**: `TeamMember[]`
- Authentication required: Admin token

#### Get Team Member (Admin)
- **GET** `/api/admin/team/{id}`
- **Parameters**:
  - `id`: string (member identifier)
- **Returns**: `TeamMember`
- Authentication required: Admin token

#### Create Team Member
- **POST** `/api/admin/create-team-member`
- **Body**: `multipart/form-data`
  - `_id`: string (optional, defaults to name if not provided)
  - `name`: string (required)
  - `description`: string (required)
  - `file`: Image file (required)
- **Returns**: Created `TeamMember` object
- Authentication required: Admin token

#### Update Team Member
- **PUT** `/api/admin/update-team-member/{id}`
- **Parameters**:
  - `id`: string (member identifier)
- **Body**: `multipart/form-data` (all fields optional)
  - `name`: string
  - `description`: string
  - `file`: Image file
- **Returns**: Updated `TeamMember` object
- Authentication required: Admin token

#### Delete Team Member
- **DELETE** `/api/admin/delete-team-member/{id}`
- **Parameters**:
  - `id`: string (member identifier)
- **Returns**: `{ success: boolean, message: string }`
- Authentication required: Admin token
- Also deletes associated image file
