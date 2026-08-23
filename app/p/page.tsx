'use strict';

import React, { Suspense } from 'react';
import ShopPrintPortalContent from './ShopPrintPortalContent';

export default function ShopPrintPortal() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="text-sm font-semibold text-gray-500">Loading print kiosk...</span>
      </div>
    }>
      <ShopPrintPortalContent />
    </Suspense>
  );
}
