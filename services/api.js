import { createClient } from '@supabase/supabase-js';

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize Supabase client if not in demo mode
const supabase = (!isDemoMode && supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// In-memory state for Demo Mode
const mockShopSettings = {
  "mock_user_id_123": {
    user_id: "mock_user_id_123",
    shop_name: "ABC Printing Centre",
    bw_price: 0.10,
    color_price: 0.50,
    duplex_price: 0.08,
    qr_data: "http://localhost:3000/p/mock_user_id_123"
  }
};

const mockJobs = new Map();

// Helper delay for simulating network latency in Demo Mode
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function getShopDetails(shopId) {
  const match = typeof shopId === 'string' ? shopId.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/) : null;
  const cleanShopId = match ? match[0] : shopId;

  if (isDemoMode || !supabase) {
    await delay(600);
    const shop = mockShopSettings[cleanShopId];
    if (shop) return shop;
    
    // Default fallback shop for local testing
    return {
      user_id: cleanShopId,
      shop_name: "Demo Print Centre",
      bw_price: 0.10,
      color_price: 0.50,
      duplex_price: 0.08,
      qr_data: `http://localhost:3000/p/${cleanShopId}`
    };
  }

  try {
    const { data, error } = await supabase
      .from('shop_settings')
      .select('*')
      .eq('user_id', cleanShopId)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("api.js: getShopDetails failed", error);
    throw error;
  }
}

export async function uploadPrintFile(shopId, file, onProgress) {
  const jobId = "job_" + Math.random().toString(36).substr(2, 9);
  
  if (isDemoMode || !supabase) {
    // Simulate upload progress steps
    for (let p = 10; p <= 100; p += 30) {
      if (onProgress) onProgress(p > 100 ? 100 : p);
      await delay(300);
    }
    return {
      jobId,
      fileName: file.name,
      fileSize: file.size,
      fileUrl: `http://localhost:3000/api/print-jobs/${jobId}/file` // Mock local download endpoint
    };
  }

  try {
    const fileExt = file.name.split('.').pop() || 'pdf';
    const filePath = `${shopId}/${jobId}.${fileExt}`;

    // Upload file to bucket
    const { data, error } = await supabase.storage
      .from('print-files')
      .upload(filePath, file, {
        cacheControl: '3600',
        contentType: file.type || 'application/pdf',
        upsert: true
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw error;
    }

    // Generate direct public URL
    const { data: publicUrlData } = supabase.storage
      .from('print-files')
      .getPublicUrl(filePath);

    if (onProgress) onProgress(100);

    return {
      jobId,
      fileName: file.name,
      fileSize: file.size,
      fileUrl: publicUrlData.publicUrl
    };
  } catch (error) {
    console.error("api.js: uploadPrintFile failed", error);
    throw error;
  }
}

export async function createPrintJob(jobPayload) {
  // jobPayload: { id, user_id, file_name, file_url, copies, color, duplex, status }
  if (isDemoMode || !supabase) {
    await delay(800);
    const newJob = {
      ...jobPayload,
      status: 'pending',
      created_at: new Date().toISOString(),
      error_message: null
    };
    mockJobs.set(jobPayload.id, newJob);
    
    // Simulate printer status updates in demo mode
    simulateDemoPrinting(jobPayload.id);
    return newJob;
  }

  try {
    const { data, error } = await supabase
      .from('print_jobs')
      .insert([jobPayload])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("api.js: createPrintJob failed", error);
    throw error;
  }
}

export async function getJobStatus(jobId) {
  if (isDemoMode || !supabase) {
    return mockJobs.get(jobId) || null;
  }

  try {
    const { data, error } = await supabase
      .from('print_jobs')
      .select('*')
      .eq('id', jobId)
      .maybeSingle();

    if (error) throw error;
    if (data) return data;

    // Fallback: Check print_audits if job was deleted after 5-minute completion window
    const { data: auditData } = await supabase
      .from('print_audits')
      .select('*')
      .eq('id', jobId)
      .maybeSingle();

    if (auditData) {
      return {
        ...auditData,
        status: auditData.status || 'completed'
      };
    }

    return null;
  } catch (error) {
    console.error("api.js: getJobStatus failed", error);
    throw error;
  }
}

export function subscribeToJobStatus(jobId, onUpdate) {
  if (isDemoMode || !supabase) {
    // Poll the local Map in demo mode
    const interval = setInterval(() => {
      const job = mockJobs.get(jobId);
      if (job) {
        onUpdate(job);
        if (job.status === 'completed') {
          clearInterval(interval);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }

  // Use Realtime WebSockets in Supabase
  const channel = supabase
    .channel(`public:print_jobs:id=eq.${jobId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'print_jobs',
        filter: `id=eq.${jobId}`
      },
      (payload) => {
        onUpdate(payload.new);
      }
    )
    .subscribe();

  // Fallback Polling interval
  const pollInterval = setInterval(async () => {
    try {
      const job = await getJobStatus(jobId);
      if (job) {
        onUpdate(job);
        if (job.status === 'completed') {
          clearInterval(pollInterval);
        }
      }
    } catch (err) {
      console.warn("api.js: Status fallback poll failed", err);
    }
  }, 3000);

  return () => {
    supabase.removeChannel(channel);
    clearInterval(pollInterval);
  };
}

// Convert Word/PPTX/Text to PDF using Edge / Cloudflare Worker API
export async function convertOfficeDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/convert-document', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(errJson.error || 'Failed to convert document to PDF.');
  }

  const result = await response.json();
  if (!result.success || !result.pdfBase64) {
    throw new Error(result.error || 'Conversion failed to return PDF data.');
  }

  // Convert Base64 back to a standard File object
  const byteCharacters = atob(result.pdfBase64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
  const convertedPdfFile = new File([pdfBlob], result.fileName, { type: 'application/pdf' });

  return {
    convertedFile: convertedPdfFile,
    fileName: result.fileName,
    originalName: result.originalName,
    totalPages: result.totalPages,
    fileSize: result.fileSize,
  };
}
