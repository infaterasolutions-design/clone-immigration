export async function generateMetadata({ params }) {
  return {
    alternates: {
      canonical: `https://www.unitedstatesimmigrationnews.com/live-updates/${params.id}`,
      languages: {
        'en-US': `https://www.unitedstatesimmigrationnews.com/live-updates/${params.id}`,
        'x-default': `https://www.unitedstatesimmigrationnews.com/live-updates/${params.id}`,
      },
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  }
}

export default function Layout({ children }) {
  return children;
}
