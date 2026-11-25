export default function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  response.status(200).json({ ready: Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL) });
}
