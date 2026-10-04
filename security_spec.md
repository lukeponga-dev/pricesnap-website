# Security Specification for PriceSnap Website

## 1. Data Invariants
- Support requests are write-only by the public. Nobody can read them except through admin-level access (which is protected by auth + rule verification).
- Public snaps can be read by anyone, but can only be modified by authenticating admins.
- No user can overwrite or delete existing snaps or other users' support requests.

## 2. The "Dirty Dozen" Payloads (Denial Tests)
We must ensure the following 12 payloads are blocked:
1. **Unauthenticated Public Snaps Write**: Attempting to write a public snap without authentication.
2. **Support Request Reading**: Attempting to read `/supportRequests` collection.
3. **Ghost fields in Support Request**: Creating a support request with an extra `isVerified` field.
4. **Invalid Support Request email**: Support request with email length > 128 chars.
5. **Junk characters in supportRequest ID**: Creating a support request with ID `../../../etc/passwd`.
6. **Malicious massive payload**: Message length > 1024 characters.
7. **Modifying created date**: Trying to update `/supportRequests/{id}` which is immutable.
8. **Public Snaps modification by standard user**: A standard user attempting to update a public snap.
9. **Deletion of support request**: Attempting to delete `/supportRequests/{id}`.
10. **Spoofed creator email**: Creating a support request with fake/spoofed email.
11. **Type mismatches**: Sending estimatedMin as a boolean.
12. **Null/empty payload**: Creating empty request document.

## 3. Test Cases (Mental Check)
The security rules will enforce these cases statically using rigorous type checks, strict key count validations (`hasOnly()`), and specific action permissions.
