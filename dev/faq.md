# FAQ System API Documentation

## Overview
API endpoints for retrieving Frequently Asked Questions (FAQs) about airsoft games and equipment.

## Data Structure

Each FAQ has the following structure:

```json
{
  "question": "What is airsoft?",
  "answer": "Airsoft is a competitive team shooting sport where participants shoot opponents with spherical plastic projectiles..."
}
```

## API Endpoints

### Public Endpoints

#### Get All FAQs

#### Get FAQ by ID
- **Endpoint**: `/faqs/{id}`
- **Method**: `GET`
- **Description**: Retrieve a specific FAQ by its ID.
- **Response**:
```json
{
  "question": "What is airsoft?",
  "answer": "Airsoft is a competitive team shooting sport where participants shoot opponents with spherical plastic projectiles..."
}
```

### Admin Endpoints

#### Create FAQ
- **Endpoint**: `/admin/admin/faqs`
- **Method**: `POST`
- **Description**: Create a new FAQ.
- **Request Body**:
```json
{
  "question": "What is airsoft?",
  "answer": "Airsoft is a competitive team shooting sport where participants shoot opponents with spherical plastic projectiles..."
}
```

#### Update FAQ
- **Endpoint**: `/admin/faqs/{id}`
- **Method**: `PUT`
- **Description**: Update an existing FAQ.
- **Request Body**:
```json
{
  "question": "What is airsoft?",
  "answer": "Airsoft is a competitive team shooting sport where participants shoot opponents with spherical plastic projectiles..."
}
```

#### Delete FAQ
- **Endpoint**: `/admin/faqs/{id}`
- **Method**: `DELETE`
- **Description**: Delete an FAQ by its ID.





NOTE: Все эти эндпоинты на серввере, все запросы делать с припиской в начале `process.env.NEXT_PUBLIC_API_URL`