# Employee-User Integration

This document explains the integration between User and Employee models in the Employee Management System.

## Overview

The system now maintains a proper relationship between User accounts (for authentication) and Employee records (for employee data). When an admin creates a new employee, the system automatically:

1. Creates an Employee record with the provided details
2. Creates a User account with a default password
3. Links both records together using references

## Model Changes

### User Model (`Server/Models/User.js`)
- Added `employeeRef` field to reference the Employee record
- Made email field unique
- Added proper schema formatting

### Employee Model (`Server/Models/employee.js`)
- Added `userRef` field to reference the User record
- Made email field unique
- Added proper schema formatting

## API Changes

### Create Employee (`POST /api/employee/create`)
- Now automatically creates a User account
- Returns the default password in the response
- Prevents duplicate email addresses
- Links User and Employee records

### Delete Employee (`DELETE /api/employee/delete/:id`)
- Now deletes both Employee and associated User records
- Ensures data consistency

### Update Employee (`PUT /api/employee/update/:id`)
- Updates both Employee and User records when name/email changes
- Maintains data consistency

### Employee Summary (`POST /api/employee/summary`)
- Now uses the proper User-Employee relationship
- Finds Employee record using User reference

## Migration

For existing employees without User accounts, run the migration script:

```bash
npm run migrate
```

This will:
- Find all employees without User accounts
- Create User accounts with default password "employee123"
- Link the records together
- Handle existing User accounts with the same email

## Default Password

The default password for new employee accounts is: `employee123`

**Important**: Employees should change their password after first login for security.

## Testing

Use the test script to verify the integration:

```bash
node test-employee-summary.js
```

This script will:
1. Login as admin
2. Create a new employee
3. Login as the new employee
4. Test the employee summary endpoint

## Benefits

1. **Proper Authentication**: Each employee has a dedicated User account
2. **Data Consistency**: User and Employee records stay synchronized
3. **Security**: Default passwords ensure employees can access the system
4. **Scalability**: Easy to extend with additional User features
5. **Maintainability**: Clear separation of concerns between auth and business logic

## Notes

- The system maintains backward compatibility
- Existing employees without User accounts will be handled by the migration
- Email addresses must be unique across both User and Employee collections
- The relationship is bidirectional for easy querying
