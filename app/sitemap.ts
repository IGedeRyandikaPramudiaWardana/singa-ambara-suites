import { MetadataRoute } from 'next'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://singa-ambara-suites.web.id';

  // Ambil data kamar dari API agar masuk sitemap
  const response = await fetch('https://api.singa-ambara-suites.web.id/api/rooms');
  const rooms = await response.json();

  const roomUrls = rooms.map((room: any) => ({
    url: `${baseUrl}/kamar/${room.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/rooms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...roomUrls, // Masukkan semua link kamar
  ]
}