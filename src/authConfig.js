export const msalConfig = {
    auth: {
      clientId: '<YOUR_CLIENT_ID>',
      authority: 'https://login.microsoftonline.com/common',
      redirectUri: '<YOUR_REDIRECT_URI>',
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: true,
    },
  };
  
  export const loginRequest = {
    scopes: ['user.read'],
  };
  
  export const graphConfig = {
    graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me/photo/$value',
  };
  