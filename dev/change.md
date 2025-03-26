# News System API Documentation

## Overview
The news system allows publishing and accessing news articles in the airsoft platform. News articles are categorized and can be pinned for emphasis.

## Data Structure

News articles have the following structure:

```json
{
  "_id": "newsId",
  "title": "News Title",
  "category": "events",
  "date": "2024-04-15T10:00:00.000Z",
  "image": "news-image.webp",
  "description": "Short news summary",
  "content": "Full markdown content of the news",
  "pinned": false
}
```

## Categories
Available news categories:
- `events` - Game events and tournaments
- `updates` - Platform and policy updates
- `announcements` - Important announcements
- `community` - Community-related news

## API Endpoints

### Public Endpoints

#### Get News Categories
- **GET** `/api/news/categories`
- **Returns**: `{ id: string, name: string }[]`
- List of available news categories

#### Get News List
- **GET** `/api/news?category={categoryId}`
- **Parameters**: 
  - `category` (optional): <категория>
- **Returns**: `News[]`
- Filter by category or get all news

#### Get Pinned News
- **GET** `/api/news/pinned`
- **Returns**: `News[]`
- Only news marked as pinned

#### Get Recent News
- **GET** `/api/news/recent?limit={number}`
- **Parameters**:
  - `limit` (optional): `number` (default: 5, max: 20)
- **Returns**: `News[]`
- Limited number of most recent news

#### Get News Details
- **GET** `/api/news/{id}`
- **Parameters**:
  - `id`: MongoDB ObjectId
- **Returns**: `News` (including full content)
- Complete details for a specific news article

#### Get News Image
- **GET** `/api/news/image/{filename}`
- **Parameters**:
  - `filename`: string
- **Returns**: Image file
- Static route to serve news images

### Admin Endpoints

#### Get All News (Admin)
- **GET** `/api/admin/news`
- **Returns**: `News[]`
- Authentication required: Admin token

#### Get News Details (Admin)
- **GET** `/api/admin/news/{id}`
- **Parameters**:
  - `id`: MongoDB ObjectId
- **Returns**: `News`
- Authentication required: Admin token

#### Create News
- **POST** `/api/admin/create-news`
- **Body**: `multipart/form-data`
  - `title`: string (required)
  - `category`: <категория> (required)
  - `description`: string (required)
  - `content`: string (required, markdown)
  - `pinned`: boolean
  - `file`: Image file (required)
- **Returns**: Created `News` object
- Authentication required: Admin token

#### Update News
- **PUT** `/api/admin/update-news/{id}`
- **Parameters**:
  - `id`: MongoDB ObjectId
- **Body**: `multipart/form-data` (all fields optional)
  - `title`: string
  - `category`: <категория>
  - `description`: string
  - `content`: string (markdown)
  - `pinned`: boolean
  - `date`: Date
  - `file`: Image file
- **Returns**: Updated `News` object
- Authentication required: Admin token

#### Delete News
- **DELETE** `/api/admin/delete-news/{id}`
- **Parameters**:
  - `id`: MongoDB ObjectId
- **Returns**: `{ success: boolean, message: string }`
- Authentication required: Admin token
- Also deletes associated image file
