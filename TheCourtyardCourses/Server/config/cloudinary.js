import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import https from 'node:https';
import http from 'node:http';

// bun's node-compat HTTP keep-alive corrupts the 2nd multipart upload on a
// reused TLS socket, so cloudinary sees it as an unsigned upload. Open a fresh
// connection for every request instead.
https.globalAgent = new https.Agent({ keepAlive: false });
http.globalAgent = new http.Agent({ keepAlive: false });

dotenv.config();

const parseCloudinaryUrl = (raw) => {
  const match = (raw || '').match(/^cloudinary:\/\/([^:]+):([^@]+)@([^/?]+)/);
  if (!match) return {};
  return {
    cloud_name: match[3],
    api_key: match[1],
    api_secret: match[2],
  };
};

cloudinary.config({
  ...parseCloudinaryUrl(process.env.CLOUDINARY_URL),
  secure: true,
});

export default cloudinary;
