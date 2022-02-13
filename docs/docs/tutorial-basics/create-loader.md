---
sidebar_position: 2
---

# Create Loader

Create a new resource route that imports the `imageLoader` function and exports a function called `loader`.
To do this, create a new file in `app/routes` such as `app/routes/api/image.js`.
By default, the image component uses the route `"/api/image"`, but any route can be used.
```typescript jsx
import type { LoaderFunction } from "remix";
import { imageLoader, DiskCache } from "remix-image/server";

const config = {
  selfUrl: "http://localhost:3000",
  cache: new DiskCache(),
};

export const loader: LoaderFunction = ({ request }) => {
  return imageLoader(config, request);
};
```

## Cloudflare / Platforms Without File-System Access
Some platforms like Cloudflare Workers do not support file-systems and Node packages.
In this case, several options need to be provided to the loader config, so take a look at **[these docs](../tutorial-extras/cloudflare.md)**.