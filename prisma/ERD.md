```mermaid
erDiagram

  "accounts" {
    String id "🗝️"
    String user_id
    String type
    String provider
    String provider_account_id
    String refresh_token "❓"
    String access_token "❓"
    Int expires_at "❓"
    String token_type "❓"
    String scope "❓"
    String id_token "❓"
    String session_state "❓"
    DateTime created_at
    DateTime updated_at
    }


  "sessions" {
    String id "🗝️"
    String session_token
    String user_id
    DateTime expires
    DateTime created_at
    DateTime updated_at
    }


  "users" {
    String id "🗝️"
    String name "❓"
    String email "❓"
    DateTime email_verified "❓"
    String image "❓"
    String website "❓"
    DateTime created_at
    DateTime updated_at
    String role "❓"
    }


  "verificationtokens" {
    String identifier
    String token
    DateTime expires
    DateTime created_at
    DateTime updated_at
    }


  "items" {
    String id "🗝️"
    String content
    String user_id
    DateTime created_at
    DateTime updated_at
    }

    "accounts" o|--|| "users" : "user"
    "sessions" o|--|| "users" : "user"
    "users" o{--}o "accounts" : "accounts"
    "users" o{--}o "sessions" : "sessions"
    "users" o{--}o "items" : "items"
    "items" o|--|| "users" : "user"
```
