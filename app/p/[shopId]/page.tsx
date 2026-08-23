import ShopPrintPortalClient from './ShopPrintPortalClient';

export async function generateStaticParams() {
  // Return default parameter for build-time static HTML generation
  return [{ shopId: 'default' }];
}

export default function Page({ params }: { params: { shopId: string } }) {
  return <ShopPrintPortalClient params={params} />;
}
