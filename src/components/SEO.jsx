import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Khayre Ali';
const SITE_URL = 'https://khayreali.com';
const DEFAULT_DESCRIPTION = 'Hi, I\'m Khayre. MS Computer Science at Northeastern, founder of Keybridge Quant, and building things at the intersection of finance and technology.';
const DEFAULT_IMAGE = `${SITE_URL}/logo512.png`;

/**
 * SEO Component for managing meta tags and structured data
 *
 * @param {Object} props
 * @param {string} props.title - Page title (will be appended with " - Khayre Ali")
 * @param {string} props.description - Meta description
 * @param {string} props.image - Open Graph image URL
 * @param {string} props.url - Canonical URL path (e.g., "/blog/my-post")
 * @param {string} props.type - Open Graph type (website, article, profile)
 * @param {Object} props.article - Article metadata for blog posts
 * @param {Object} props.structuredData - JSON-LD structured data
 */
const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url = '',
  type = 'website',
  article = null,
  structuredData = null,
  noIndex = false
}) => {
  const fullTitle = title ? `${title} - ${SITE_NAME}` : SITE_NAME;
  const canonicalUrl = `${SITE_URL}/#${url}`;

  // Default structured data for the website
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    author: {
      '@type': 'Person',
      name: SITE_NAME
    }
  };

  const jsonLd = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Article specific meta tags */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          <meta property="article:author" content={SITE_NAME} />
          {article.tags?.map((tag, index) => (
            <meta property="article:tag" content={tag} key={index} />
          ))}
        </>
      )}

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
};

// Helper function to generate slug from title
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Helper function to get excerpt from HTML content
export const getExcerpt = (htmlContent, maxLength = 160) => {
  if (!htmlContent) return '';
  const text = htmlContent.replace(/<[^>]*>/g, '').trim();
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// Structured data generators
export const createBlogPostSchema = (post) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: getExcerpt(post.content),
  datePublished: post.date,
  dateModified: post.updatedAt || post.date,
  author: {
    '@type': 'Person',
    name: SITE_NAME,
    url: SITE_URL
  },
  publisher: {
    '@type': 'Person',
    name: SITE_NAME,
    url: SITE_URL
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${SITE_URL}/#/blog/${post.slug || post.id}`
  },
  keywords: post.tags?.map(t => t.name).join(', ') || ''
});

export const createProjectSchema = (project) => ({
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: project.title,
  description: project.description,
  author: {
    '@type': 'Person',
    name: SITE_NAME,
    url: SITE_URL
  },
  dateCreated: project.createdAt,
  ...(project.githubUrl && { codeRepository: project.githubUrl }),
  ...(project.liveUrl && { url: project.liveUrl }),
  keywords: project.technologies?.join(', ') || ''
});

export const createPersonSchema = (aboutData) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: aboutData?.name || SITE_NAME,
  url: SITE_URL,
  description: aboutData?.introduction || DEFAULT_DESCRIPTION,
  ...(aboutData?.imageUrl && { image: aboutData.imageUrl }),
  sameAs: [
    'https://github.com/khayreali',
    'https://linkedin.com/in/khayreali'
  ],
  jobTitle: 'Software Engineer',
  knowsAbout: aboutData?.skills?.split(',').map(s => s.trim()) || []
});

export const createWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  author: {
    '@type': 'Person',
    name: SITE_NAME,
    url: SITE_URL
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/#/blog?search={search_term_string}`,
    'query-input': 'required name=search_term_string'
  }
});

export default SEO;
