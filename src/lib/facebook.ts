const FACEBOOK_SDK_URL = "https://connect.facebook.net/en_US/sdk.js";

interface FacebookInitOptions {
  appId: string;
  cookie?: boolean;
  xfbml?: boolean;
  version: string;
}

interface FacebookAuthResponse {
  accessToken: string;
  userID: string;
  expiresIn: number;
  signedRequest: string;
  graphDomain?: string;
  data_access_expiration_time?: number;
}

interface FacebookLoginResponse {
  status: "connected" | "not_authorized" | "unknown";
  authResponse?: FacebookAuthResponse;
}

interface FacebookLoginOptions {
  scope?: string;
  return_scopes?: boolean;
}

interface FacebookSDK {
  init(options: FacebookInitOptions): void;
  login(callback: (response: FacebookLoginResponse) => void, options?: FacebookLoginOptions): void;
}

declare global {
  interface Window {
    FB?: FacebookSDK;
    fbAsyncInit?: () => void;
  }
}

let sdkPromise: Promise<FacebookSDK> | null = null;

function resetSdkPromise() {
  sdkPromise = null;
}

export async function ensureFacebookSdk(appId: string): Promise<FacebookSDK> {
  if (!appId || appId.trim().length === 0) {
    throw new Error("Facebook App ID is not configured.");
  }

  if (window.FB) {
    window.FB.init({ appId, cookie: true, xfbml: false, version: "v18.0" });
    return window.FB;
  }

  if (!sdkPromise) {
    sdkPromise = new Promise<FacebookSDK>((resolve, reject) => {
      window.fbAsyncInit = () => {
        if (!window.FB) {
          resetSdkPromise();
          reject(new Error("Facebook SDK did not initialise correctly."));
          return;
        }

        window.FB.init({ appId, cookie: true, xfbml: false, version: "v18.0" });
        resolve(window.FB);
      };

      const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${FACEBOOK_SDK_URL}"]`);
      if (existingScript) {
        return;
      }

      const script = document.createElement("script");
      script.src = FACEBOOK_SDK_URL;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        resetSdkPromise();
        reject(new Error("Failed to load the Facebook SDK."));
      };
      document.body.appendChild(script);
    });
  }

  return sdkPromise;
}

export async function requestFacebookAccessToken(appId: string): Promise<FacebookAuthResponse> {
  const fb = await ensureFacebookSdk(appId);

  return new Promise<FacebookAuthResponse>((resolve, reject) => {
    fb.login(
      (response) => {
        if (response.status === "connected" && response.authResponse) {
          resolve(response.authResponse);
          return;
        }

        reject(new Error("Facebook sign-in was cancelled or denied."));
      },
      {
        scope: "email",
        return_scopes: true,
      },
    );
  });
}
