import { MetadataRoute } from "next";
import { Languages } from "next/dist/lib/metadata/types/alternative-urls-types";
import { Videos } from "next/dist/lib/metadata/types/metadata-types";

const baseDomain = 'https://browsenchat.com'

type PageType = {
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" | undefined;
  priority?: number | undefined;
  alternates?: {
    languages?: Languages<string> | undefined;
  } | undefined;
  images?: string[] | undefined;
  videos?: Videos[] | undefined;
}

type PagesType = { [key: string]: PageType }

const pagesObj: PagesType = {
  '/': {
    priority: 1,
    changeFrequency: 'daily',
  },
  '/rules': {
    priority: 0.8,
    changeFrequency: 'weekly',
  },
  '/waiver': {
    priority: 0.8,
    changeFrequency: 'weekly',
  },
  '/about': {
    priority: 0.9,
    changeFrequency: 'weekly',
  },
  '/gallery': {
    priority: 0.9,
    changeFrequency: 'weekly',
  },
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = Object.keys(pagesObj).map((url) => {
    const page = pagesObj[url];
    return {
      url: `${baseDomain}${url}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: page.alternates,
      images: page.images,
      videos: page.videos,
    }
  })

  return pages;
}
