declare module '@paypal/payouts-sdk' {
  namespace core {
    class PayPalHttpClient {
      constructor(environment: SandboxEnvironment);
      execute(request: any): Promise<any>;
    }
    class SandboxEnvironment {
      constructor(clientId: string, clientSecret: string);
    }
  }
  namespace payouts {
    class PayoutsPostRequest {
      requestBody(body: any): void;
    }
  }
}

export = paypal; 