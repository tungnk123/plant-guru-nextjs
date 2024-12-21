interface Window {
  paypal: {
    Buttons: (config: {
      createOrder: (data: any, actions: any) => Promise<any>;
      onApprove: (data: any, actions: any) => Promise<any>;
    }) => {
      render: (containerId: string) => void;
    };
  };
} 