# Community Feature API Documentation

This document provides the API documentation for the Community feature, enabling frontend integration.

## Base URL
```
/api/community
```

All endpoints require authentication via `Authorization: Bearer {token}` header.

---

## Channels

### List Channels
```
GET /channels
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| search | string | Search by name or description |
| access_type | string | Filter by `general` or `restricted` |
| grade_range | string | Filter by `grade_1_3`, `grade_4_6`, `grade_7_9`, `grade_10_12`, `all` |
| per_page | integer | Items per page (default: 15) |

**Response:**
```json
{
  "success": true,
  "message": "Channels retrieved successfully",
  "data": {
    "data": [
      {
        "id": 1,
        "name": "Python Wizards",
        "description": "Master Python through fun challenges!",
        "owner": {
          "id": 1,
          "name": "Alex Thompson",
          "avatar": "https://..."
        },
        "admins": [...],
        "followers_count": 1240,
        "banner": "https://...",
        "thumbnail": "https://...",
        "is_following": true,
        "is_admin": false,
        "access_type": "general",
        "grade_range": "grade_4_6",
        "is_active": true,
        "created_at": "2026-02-04 12:00:00"
      }
    ],
    "meta": { "current_page": 1, "last_page": 5, "per_page": 15, "total": 75 }
  }
}
```

### Get My Followed Channels
```
GET /channels/my-channels
```

### Get Channel by ID
```
GET /channels/{id}
```

### Create Channel
```
POST /channels
```

**Request Body:**
```json
{
  "name": "Python Wizards",
  "description": "Master Python through fun challenges!",
  "banner": "https://...",
  "thumbnail": "https://...",
  "access_type": "general",
  "grade_range": "grade_4_6",
  "admin_ids": [2, 3]
}
```

### Update Channel
```
PATCH /channels/{id}
```

**Request Body:** Same as create (all fields optional)

### Delete Channel
```
DELETE /channels/{id}
```

### Follow Channel
```
POST /channels/{id}/follow
```

### Unfollow Channel
```
POST /channels/{id}/unfollow
```

### Add Admin to Channel
```
POST /channels/{id}/admins
```

**Request Body:**
```json
{
  "user_id": 5
}
```

### Remove Admin from Channel
```
DELETE /channels/{id}/admins
```

**Request Body:**
```json
{
  "user_id": 5
}
```

---

## Posts

### Get Feed
```
GET /posts
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| channel_id | integer | Filter by channel |
| author_id | integer | Filter by author |
| category | string | `general`, `project_help`, `homework`, `coding_tip`, `resource` |
| status | string | `open`, `solved`, `announcement` |
| search | string | Search in content |
| per_page | integer | Items per page (default: 15) |

**Response:**
```json
{
  "success": true,
  "message": "Posts retrieved successfully",
  "data": {
    "data": [
      {
        "id": 1,
        "author": {
          "id": 1,
          "name": "Student User",
          "avatar": "https://...",
          "role": "student"
        },
        "content": "Just finished my first React app!",
        "image": "https://...",
        "video": null,
        "gif": null,
        "likes": 45,
        "comments_count": 12,
        "is_saved": false,
        "is_liked": true,
        "is_pinned": false,
        "is_official": false,
        "created_at": "2026-02-04 12:00:00",
        "channel": {
          "id": 1,
          "name": "Python Wizards"
        },
        "audience": "public",
        "feeling": "excited",
        "tagged_users": [...],
        "poll": null,
        "report_count": 0,
        "category": "general",
        "status": "open"
      }
    ],
    "meta": { ... }
  }
}
```

### Get Saved Posts
```
GET /posts/saved
```

### Get My Posts
```
GET /posts/my-posts
```

### Get Post by ID
```
GET /posts/{id}
```

**Response includes comments:**
```json
{
  "data": {
    ...post_fields,
    "comments": [
      {
        "id": 1,
        "author": { "id": 1, "name": "User", "avatar": "...", "role": "student" },
        "content": "Great post!",
        "created_at": "2026-02-04 12:30:00",
        "likes": 5,
        "is_liked": false,
        "is_solution": false,
        "replies": [...]
      }
    ]
  }
}
```

### Create Post
```
POST /posts
```

**Request Body:**
```json
{
  "content": "Just finished my first React app! 🚀",
  "channel_id": 1,
  "image": "https://...",
  "video": "https://...",
  "gif": "https://...",
  "audience": "public",
  "category": "general",
  "status": "open",
  "feeling": "excited",
  "is_pinned": false,
  "is_official": false,
  "tagged_user_ids": [2, 3],
  "poll": {
    "question": "What's your favorite language?",
    "options": ["Python", "JavaScript", "Go", "Rust"]
  }
}
```

### Update Post
```
PATCH /posts/{id}
```

### Delete Post
```
DELETE /posts/{id}
```

### React to Post
```
POST /posts/{id}/react
```

**Request Body:**
```json
{
  "emoji": "👍"
}
```

**Response:**
```json
{
  "data": {
    "action": "added",
    "emoji": "👍"
  }
}
```
Actions: `added`, `removed`, `changed`

### Save Post
```
POST /posts/{id}/save
```

### Unsave Post
```
POST /posts/{id}/unsave
```

### Pin Post (Admin)
```
POST /posts/{id}/pin
```

### Unpin Post (Admin)
```
POST /posts/{id}/unpin
```

### Vote on Poll
```
POST /posts/{id}/vote
```

**Request Body:**
```json
{
  "option_id": 2
}
```

---

## Comments

### Get Post Comments
```
GET /posts/{postId}/comments
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "author": { "id": 1, "name": "User", "avatar": "...", "role": "student" },
      "content": "Great explanation!",
      "created_at": "2026-02-04 12:30:00",
      "likes": 15,
      "is_liked": false,
      "is_solution": true,
      "replies": [
        {
          "id": 2,
          "author": { ... },
          "content": "Thanks!",
          ...
        }
      ]
    }
  ]
}
```

### Create Comment
```
POST /posts/{postId}/comments
```

**Request Body:**
```json
{
  "content": "Great post!",
  "parent_id": null
}
```

For replies, set `parent_id` to the comment ID you're replying to.

### Update Comment
```
PATCH /comments/{id}
```

**Request Body:**
```json
{
  "content": "Updated comment text"
}
```

### Delete Comment
```
DELETE /comments/{id}
```

### React to Comment
```
POST /comments/{id}/react
```

**Request Body:**
```json
{
  "emoji": "❤️"
}
```

### Mark Comment as Solution
```
POST /comments/{id}/solution
```

Only the post author can mark a solution.

### Unmark Comment as Solution
```
DELETE /comments/{id}/solution
```

---

## Reports

### Report a Post
```
POST /posts/{postId}/report
```

**Request Body:**
```json
{
  "reason": "Inappropriate content",
  "description": "This post contains..."
}
```

### Get Post Reports (Admin)
```
GET /posts/{postId}/reports
```

### List All Reports (Admin)
```
GET /reports
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | `pending`, `reviewed`, `resolved`, `dismissed` |
| post_id | integer | Filter by post |
| per_page | integer | Items per page |

### Review Report (Admin)
```
PATCH /reports/{id}/review
```

**Request Body:**
```json
{
  "status": "resolved"
}
```

Status options: `reviewed`, `resolved`, `dismissed`

---

## Enums Reference

### Audience
- `public` - Visible to everyone
- `group` - Visible to group members only

### Post Category
- `general`
- `project_help`
- `homework`
- `coding_tip`
- `resource`

### Post Status
- `open`
- `solved`
- `announcement`

### Channel Access Type
- `general` - Open to all
- `restricted` - Limited access

### Channel Grade Range
- `grade_1_3`
- `grade_4_6`
- `grade_7_9`
- `grade_10_12`
- `all`

### Report Status
- `pending`
- `reviewed`
- `resolved`
- `dismissed`

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": { ... }
}
```

Common HTTP status codes:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

---

## Database Schema

### Tables
- `community_channels` - Channels/groups
- `community_channel_admins` - Channel admin assignments
- `community_channel_followers` - Channel followers
- `community_posts` - Posts/content
- `community_post_tags` - Tagged users in posts
- `community_comments` - Comments and replies
- `community_reactions` - Reactions (polymorphic for posts/comments)
- `community_polls` - Poll questions
- `community_poll_options` - Poll answer options
- `community_poll_votes` - User votes on polls
- `community_saved_posts` - Saved/bookmarked posts
- `community_post_reports` - Reported posts

---

## Frontend Integration Notes

1. **Authentication**: All endpoints require Bearer token authentication
2. **Pagination**: List endpoints return paginated data with `meta` object
3. **Real-time**: Consider WebSocket integration for live updates
4. **File Uploads**: Image/video URLs should be uploaded separately and URLs passed to post creation
5. **Reactions**: Toggle behavior - calling react twice with same emoji removes it
6. **Polls**: Users can only vote once per poll
7. **Solutions**: Only post author can mark comments as solutions
