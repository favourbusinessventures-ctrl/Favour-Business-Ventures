# Security Specification: Customer Reviews & Ratings System (Phase 1)
**Project:** Favour Business Ventures  
**Target Collection:** `/reviews/{reviewId}`  
**Author:** Application Security Architect  
**Architecture Standard:** Zero-Trust Attribute-Based Access Control (ABAC) & The Eight Pillars of Hardened Rules

---

## 1. Data Invariants

1. **Public Creation Invariant (Untrusted Client Isolation):**
   - Any public or unauthenticated user can submit a review to the `/reviews` collection.
   - The document ID `{reviewId}` must conform to standard alphanumeric slug format (`^[a-zA-Z0-9_\-]+$`) with a maximum length of 128 characters.
   - The write MUST enforce `incoming().status == 'pending'`. A public user can NEVER create a review with `status == 'approved'` or `status == 'rejected'`.
   - The rating value MUST be an integer between 1 and 5 (`incoming().rating >= 1 && incoming().rating <= 5`).
   - The reviewer name (`customerName`) must be a non-empty string between 2 and 100 characters.
   - The review title (`reviewTitle`) must be a string up to 150 characters.
   - The review comment (`comment`) must be a string up to 1500 characters.
   - The product ID (`productId`) must be a valid ID string up to 128 characters.
   - The product name (`productName`) must be a string up to 150 characters.
   - The creation timestamp (`createdAt`) MUST strictly equal the server timestamp `request.time`.
   - Shadow/extraneous fields are strictly prohibited on creation (must contain only the exact defined key set).

2. **Public Storefront Read Invariant (Approved Only):**
   - The public storefront can ONLY read (`get` and `list`) reviews that have been verified and approved by an administrator (`resource.data.status == 'approved'`).
   - Pending reviews and rejected reviews are strictly invisible to the public storefront.

3. **Administrator Privilege Invariant (Role-Based Moderation):**
   - Only verified administrators (authenticated users with `role == 'admin'` in the `/users/{userId}` collection) can access the full review list (`allow list`), inspect pending/rejected reviews (`allow get`), update review moderation statuses (`allow update`), or delete reviews (`allow delete`).
   - Public users have NO update or delete permissions on any review document.

4. **Temporal & Immortality Invariants:**
   - Once created, `createdAt` and `productId` are immutable and cannot be altered during updates.
   - Updates performed by administrators must update `updatedAt == request.time`.

---

## 2. The "Dirty Dozen" Penetration Payloads

The following 12 adversarial JSON payloads are designed to test and break every pillar of security, integrity, and authorization:

```json
[
  {
    "id": "PAYLOAD_01_AUTO_APPROVE_EXPLOIT",
    "description": "Attacker attempts to create a review pre-marked as 'approved' to bypass moderation.",
    "operation": "CREATE",
    "auth": null,
    "payload": {
      "customerName": "Malicious User",
      "rating": 5,
      "reviewTitle": "Spam Review",
      "comment": "Self-approved spam message",
      "productId": "norwegian-stockfish",
      "productName": "Norwegian Stockfish",
      "status": "approved",
      "createdAt": "SERVER_TIMESTAMP"
    },
    "expectedResult": "PERMISSION_DENIED"
  },
  {
    "id": "PAYLOAD_02_OUT_OF_BOUNDS_RATING_HIGH",
    "description": "Attacker submits a 10-star rating to skew the store's average rating calculation.",
    "operation": "CREATE",
    "auth": null,
    "payload": {
      "customerName": "John Doe",
      "rating": 10,
      "reviewTitle": "Too good",
      "comment": "Rating is out of bounds",
      "productId": "norwegian-stockfish",
      "productName": "Norwegian Stockfish",
      "status": "pending",
      "createdAt": "SERVER_TIMESTAMP"
    },
    "expectedResult": "PERMISSION_DENIED"
  },
  {
    "id": "PAYLOAD_03_OUT_OF_BOUNDS_RATING_ZERO",
    "description": "Attacker submits a 0 or negative star rating.",
    "operation": "CREATE",
    "auth": null,
    "payload": {
      "customerName": "Jane Doe",
      "rating": 0,
      "reviewTitle": "Zero stars",
      "comment": "Rating is below minimum",
      "productId": "oron-crayfish",
      "productName": "Oron Crayfish",
      "status": "pending",
      "createdAt": "SERVER_TIMESTAMP"
    },
    "expectedResult": "PERMISSION_DENIED"
  },
  {
    "id": "PAYLOAD_04_CLIENT_TIMESTAMP_SPOOF",
    "description": "Attacker injects an arbitrary past or future client timestamp instead of request.time.",
    "operation": "CREATE",
    "auth": null,
    "payload": {
      "customerName": "Time Traveler",
      "rating": 5,
      "reviewTitle": "Back to the Future",
      "comment": "Spoofed timestamp payload",
      "productId": "norwegian-stockfish",
      "productName": "Norwegian Stockfish",
      "status": "pending",
      "createdAt": "1999-01-01T00:00:00.000Z"
    },
    "expectedResult": "PERMISSION_DENIED"
  },
  {
    "id": "PAYLOAD_05_SHADOW_FIELD_INJECTION",
    "description": "Attacker injects ghost fields (isAdmin: true, verifiedBuyer: true) into public review payload.",
    "operation": "CREATE",
    "auth": null,
    "payload": {
      "customerName": "Infiltrator",
      "rating": 5,
      "reviewTitle": "Ghost Field Attack",
      "comment": "Injecting unverified flags",
      "productId": "norwegian-stockfish",
      "productName": "Norwegian Stockfish",
      "status": "pending",
      "createdAt": "SERVER_TIMESTAMP",
      "isAdmin": true,
      "verifiedBuyer": true
    },
    "expectedResult": "PERMISSION_DENIED"
  },
  {
    "id": "PAYLOAD_06_OVERSIZED_COMMENT_DOS",
    "description": "Attacker sends a 50KB string in the comment field to cause denial of wallet resource exhaustion.",
    "operation": "CREATE",
    "auth": null,
    "payload": {
      "customerName": "Resource Hog",
      "rating": 4,
      "reviewTitle": "Huge text payload",
      "comment": "A".repeat(50000),
      "productId": "norwegian-stockfish",
      "productName": "Norwegian Stockfish",
      "status": "pending",
      "createdAt": "SERVER_TIMESTAMP"
    },
    "expectedResult": "PERMISSION_DENIED"
  },
  {
    "id": "PAYLOAD_07_PUBLIC_UPDATE_TAMPERING",
    "description": "Unauthenticated or regular user tries to update an existing review to mark it 'approved'.",
    "operation": "UPDATE",
    "auth": null,
    "payload": {
      "status": "approved"
    },
    "expectedResult": "PERMISSION_DENIED"
  },
  {
    "id": "PAYLOAD_08_PUBLIC_DELETE_ATTACK",
    "description": "Unauthenticated user tries to delete a customer review document.",
    "operation": "DELETE",
    "auth": null,
    "expectedResult": "PERMISSION_DENIED"
  },
  {
    "id": "PAYLOAD_09_PUBLIC_LIST_PENDING_REVIEWS",
    "description": "Public storefront queries pending or unmoderated reviews.",
    "operation": "LIST",
    "auth": null,
    "query": "where('status', '==', 'pending')",
    "expectedResult": "PERMISSION_DENIED"
  },
  {
    "id": "PAYLOAD_10_PUBLIC_GET_REJECTED_REVIEW",
    "description": "Public user attempts direct document 'get' on a rejected review document.",
    "operation": "GET",
    "auth": null,
    "targetDocStatus": "rejected",
    "expectedResult": "PERMISSION_DENIED"
  },
  {
    "id": "PAYLOAD_11_INVALID_ID_POISONING",
    "description": "Attacker targets a path with malicious characters or oversized document ID.",
    "operation": "CREATE",
    "auth": null,
    "docId": "../../passwords/or_oversized_junk_characters_!@#$%^&*()",
    "expectedResult": "PERMISSION_DENIED"
  },
  {
    "id": "PAYLOAD_12_NON_ADMIN_MODERATION",
    "description": "Authenticated user without 'admin' role in /users/{userId} attempts to approve a review.",
    "operation": "UPDATE",
    "auth": { "uid": "standard-user-123" },
    "payload": {
      "status": "approved"
    },
    "expectedResult": "PERMISSION_DENIED"
  }
]
```

---

## 3. Test Runner Specification (`firestore.rules.test.ts`)

The test suite validates that:
1. Public submissions with valid fields and `status: 'pending'` succeed.
2. Public submissions with invalid rating, timestamps, ghost fields, or `status: 'approved'` are rejected.
3. Public queries can only fetch documents where `status == 'approved'`.
4. Only verified administrators can approve, reject, modify, or delete review documents.
