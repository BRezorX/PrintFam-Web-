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
  if (isDemoMode || !supabase) {
    await delay(600);
    const shop = mockShopSettings[shopId];
    if (shop) return shop;
    
    // Default fallback shop for local testing
    return {
      user_id: shopId,
      shop_name: "Demo Print Centre",
      bw_price: 0.10,
      color_price: 0.50,
      duplex_price: 0.08,
      qr_data: `http://localhost:3000/p/${shopId}`
    };
  }

  try {
    const { data, error } = await supabase
      .from('shop_settings')
      .select('*')
      .eq('user_id', shopId)
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
    const fileExt = file.name.split('.').pop();
    const filePath = `${shopId}/${jobId}.${fileExt}`;

    // Upload file to private bucket
    const { data, error } = await supabase.storage
      .from('print-files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    // Generate short-lived signed URL (Rule 5: Keep documents private)
    const { data: signedData, error: signedError } = await supabase.storage
      .from('print-files')
      .createSignedUrl(filePath, 3600); // 1 hour validity

    if (signedError) throw signedError;

    if (onProgress) onProgress(100);

    return {
      jobId,
      fileName: file.name,
      fileSize: file.size,
      fileUrl: signedData.signedUrl
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
    return data;
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
        if (job.status === 'completed' || job.status === 'failed') {
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
        if (job.status === 'completed' || job.status === 'failed') {
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

// Background simulation helper for Demo Mode
async function simulateDemoPrinting(jobId) {
  await delay(5000); // 5s waiting in queue
  const job1 = mockJobs.get(jobId);
  if (job1 && job1.status === 'pending') {
    job1.status = 'printing';
    mockJobs.set(jobId, job1);
  }

  await delay(6000); // 6s printing
  const job2 = mockJobs.get(jobId);
  if (job2 && job2.status === 'printing') {
    job2.status = 'completed';
    mockJobs.set(jobId, job2);
  }
}
