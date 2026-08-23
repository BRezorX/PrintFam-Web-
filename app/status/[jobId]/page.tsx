import JobStatusClient from './JobStatusClient';

export async function generateStaticParams() {
  // Return default parameter for build-time static HTML generation
  return [{ jobId: 'default' }];
}

export default function Page({ params }: { params: { jobId: string } }) {
  return <JobStatusClient params={params} />;
}
