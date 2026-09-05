export interface PrintJob {
  id: string;
  customerName: string;
  customerPhone?: string;
  fileName: string;
  fileSize: string;
  pageCount: number;
  copies: number;
  colorMode: 'B&W' | 'Color';
  paperSize: 'A4' | 'A3' | 'Letter';
  duplex: boolean;
  totalPrice: number;
  status: 'pending' | 'approved' | 'printing' | 'completed' | 'rejected';
  submittedAt: string;
}

export interface BenefitItem {
  id: string;
  title: string;
  description: string;
  badge?: string;
  accentColor: string;
}

export interface StepItem {
  number: number;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
}

export interface ShopTypeItem {
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  iconType: 'photocopy' | 'digital' | 'college' | 'commercial';
  popularFor: string;
}
