import { forbidNetworkTraffic } from 'testing';

// eslint-disable-next-line import/no-default-export
export default function (): void {
  forbidNetworkTraffic({ allowLocalhost: true });
}
