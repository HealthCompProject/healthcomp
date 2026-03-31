/**
 * JSON-LD structured data components for SEO.
 * Renders <script type="application/ld+json"> in the head.
 */

interface OrganizationJsonLdProps {
  url: string;
  name: string;
  description: string;
}

export function OrganizationJsonLd({ url, name, description }: OrganizationJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    description,
    logo: `${url}/icon.svg`,
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface DatasetJsonLdProps {
  name: string;
  description: string;
  url: string;
  license: string;
  creator: string;
  dateModified?: string;
}

export function DatasetJsonLd({
  name,
  description,
  url,
  license,
  creator,
  dateModified,
}: DatasetJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name,
    description,
    url,
    license,
    creator: {
      '@type': 'Organization',
      name: creator,
    },
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: `${url}/api/data/export?format=json`,
      },
      {
        '@type': 'DataDownload',
        encodingFormat: 'text/csv',
        contentUrl: `${url}/api/data/export?format=csv`,
      },
    ],
    ...(dateModified && { dateModified }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface WebSiteJsonLdProps {
  url: string;
  name: string;
  description: string;
}

export function WebSiteJsonLd({ url, name, description }: WebSiteJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
