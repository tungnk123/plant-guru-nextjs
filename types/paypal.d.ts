interface Window {
  paypal: {
    Buttons: (config: {
      createOrder: (data: any, actions: any) => Promise<any>;
      onApprove: (data: any, actions: any) => Promise<any>;
      onError?: (err: any) => void;
      style?: {
        layout?: 'vertical' | 'horizontal';
        color?: 'gold' | 'blue' | 'silver' | 'white' | 'black';
        shape?: 'rect' | 'pill';
        label?: 'paypal' | 'checkout' | 'buynow' | 'pay';
        height?: number;
      };
    }) => {
      render: (containerId: string) => void;
    };
  };
} 