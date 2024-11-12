import * as path from "path";
import * as fs from "fs";

const filePath = path.join(__dirname, "../public/oauth/client-metadata.json");

const url = process.env.NEXT_PUBLIC_URL || "https://localhost:3000";

const main = async () => {
  const data = {
    client_id: `${url}/client-metadata.json`,
    client_name: "XPost",
    client_uri: url,
    logo_uri: `${url}/logo.png`,
    tos_uri: `${url}/tos`,
    policy_uri: `${url}/policy`,
    redirect_uris: [`${url}/callback`],
    scope: "atproto",
    grant_types: ["authorization_code", "refresh_token"],
    response_types: ["code"],
    token_endpoint_auth_method: "none",
    application_type: "web",
    dpop_bound_access_tokens: true
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

main().then(() => console.log("Done."));