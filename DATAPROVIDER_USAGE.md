# DataProvider Usage Guide

The DataProvider is a centralized state management solution for fetching and managing data across your entire application.

## Features

- **Centralized Data**: Single source of truth for clients and sites
- **Automatic Fetching**: Data is fetched automatically when user authenticates
- **Real-time Updates**: Local state updates immediately after CRUD operations
- **Loading States**: Built-in loading indicators
- **Error Handling**: Automatic error messages via toast notifications

## Setup

The DataProvider is already wrapped around your app in `layout.js`:

```jsx
<AuthProvider>
  <DataProvider>
    <UserProvider>
      <GlobalUIProvider>
        {children}
      </GlobalUIProvider>
    </UserProvider>
  </DataProvider>
</AuthProvider>
```

## Usage in Components

### Import the Hook

```javascript
import { useData } from '@/contexts/DataProvider';
```

### Available Data & Methods

```javascript
const {
  // Data
  clients,              // Array of all clients
  sites,                // Array of all sites

  // Loading States
  isLoadingClients,     // Boolean - clients loading state
  isLoadingSites,       // Boolean - sites loading state

  // Fetch Methods
  fetchClients,         // () => Promise - Refresh clients
  fetchSites,           // () => Promise - Refresh sites
  fetchSitesByClient,   // (clientId) => Promise - Get sites for specific client

  // Get Methods
  getClientById,        // (clientId) => Client object
  getSiteById,          // (siteId) => Site object

  // Client CRUD
  addClient,            // (clientData) => Promise<{success, data/error}>
  updateClient,         // (clientId, clientData) => Promise<{success, data/error}>
  deleteClient,         // (clientId) => Promise<{success, error?}>

  // Site CRUD
  addSite,              // (siteData) => Promise<{success, data/error}>
  updateSite,           // (siteId, siteData) => Promise<{success, data/error}>
  deleteSite,           // (siteId) => Promise<{success, error?}>

  // Utilities
  refreshAll,           // () => Promise - Refresh all data
} = useData();
```

## Examples

### Example 1: Display List of Sites

```javascript
'use client';
import { useData } from '@/contexts/DataProvider';

export default function SitesList() {
  const { sites, isLoadingSites } = useData();

  if (isLoadingSites) {
    return <div>Loading sites...</div>;
  }

  return (
    <div>
      {sites.map(site => (
        <div key={site.id}>
          <h3>{site.siteName}</h3>
          <p>{site.siteUrl}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Add a New Client

```javascript
'use client';
import { useState } from 'react';
import { useData } from '@/contexts/DataProvider';
import { showSuccess, showError } from '@/utils/toast';

export default function AddClientForm() {
  const { addClient } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await addClient(formData);

    if (result.success) {
      showSuccess('Client added successfully!');
      setFormData({ name: '', email: '', phone: '' });
    } else {
      showError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields here */}
    </form>
  );
}
```

### Example 3: Update a Site

```javascript
'use client';
import { useData } from '@/contexts/DataProvider';
import { showSuccess, showError } from '@/utils/toast';

export default function EditSiteButton({ siteId }) {
  const { updateSite } = useData();

  const handleUpdate = async () => {
    const updatedData = {
      status: 'inactive',
      notes: 'Site temporarily disabled'
    };

    const result = await updateSite(siteId, updatedData);

    if (result.success) {
      showSuccess('Site updated!');
    } else {
      showError(result.error);
    }
  };

  return (
    <button onClick={handleUpdate}>
      Disable Site
    </button>
  );
}
```

### Example 4: Get Sites for Specific Client

```javascript
'use client';
import { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataProvider';

export default function ClientSites({ clientId }) {
  const { fetchSitesByClient } = useData();
  const [clientSites, setClientSites] = useState([]);

  useEffect(() => {
    const loadSites = async () => {
      const sites = await fetchSitesByClient(clientId);
      setClientSites(sites);
    };

    loadSites();
  }, [clientId, fetchSitesByClient]);

  return (
    <div>
      <h3>Sites for this client:</h3>
      {clientSites.map(site => (
        <div key={site.id}>{site.siteName}</div>
      ))}
    </div>
  );
}
```

### Example 5: Delete a Site

```javascript
'use client';
import { useData } from '@/contexts/DataProvider';
import { showSuccess, showError } from '@/utils/toast';

export default function DeleteSiteButton({ siteId, siteName }) {
  const { deleteSite } = useData();

  const handleDelete = async () => {
    if (!confirm(\`Delete \${siteName}?\`)) return;

    const result = await deleteSite(siteId);

    if (result.success) {
      showSuccess('Site deleted successfully!');
    } else {
      showError(result.error);
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-500">
      Delete Site
    </button>
  );
}
```

### Example 6: Refresh Data Manually

```javascript
'use client';
import { useData } from '@/contexts/DataProvider';
import { FiRefreshCw } from 'react-icons/fi';

export default function RefreshButton() {
  const { refreshAll, isLoadingClients, isLoadingSites } = useData();

  const isRefreshing = isLoadingClients || isLoadingSites;

  return (
    <button
      onClick={refreshAll}
      disabled={isRefreshing}
      className="flex items-center gap-2"
    >
      <FiRefreshCw className={isRefreshing ? 'animate-spin' : ''} />
      Refresh Data
    </button>
  );
}
```

### Example 7: Get Client Details by ID

```javascript
'use client';
import { useData } from '@/contexts/DataProvider';

export default function ClientInfo({ clientId }) {
  const { getClientById } = useData();

  const client = getClientById(clientId);

  if (!client) {
    return <div>Client not found</div>;
  }

  return (
    <div>
      <h3>{client.name}</h3>
      <p>{client.email}</p>
      <p>{client.phone}</p>
    </div>
  );
}
```

## Backend Endpoint Requirements

Your backend should implement these endpoints:

### Clients
- `GET /api/clients/user/:userId` - Get all clients for user
- `POST /api/clients` - Create new client
- `PUT /api/clients/:clientId` - Update client
- `DELETE /api/clients/:clientId` - Delete client

### Sites
- `GET /api/sites/user/:userId` - Get all sites for user
- `GET /api/sites/client/:clientId` - Get sites for specific client
- `POST /api/sites` - Create new site
- `PUT /api/sites/:siteId` - Update site
- `DELETE /api/sites/:siteId` - Delete site

## Benefits

1. **No Duplicate API Calls**: Data is fetched once and shared across components
2. **Automatic Updates**: Local state updates immediately after mutations
3. **Consistent Error Handling**: All errors show toast notifications
4. **Loading States**: Built-in loading indicators
5. **Optimistic Updates**: UI updates before server confirms (can be reverted on error)
6. **Single Source of Truth**: All components use the same data

## Notes

- Data is automatically fetched when user logs in
- Data is cleared when user logs out
- All CRUD operations return `{success: boolean, data?: any, error?: string}`
- The provider depends on `AuthProvider` for user authentication
