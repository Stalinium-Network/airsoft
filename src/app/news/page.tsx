import React, { Suspense } from "react";
import { Metadata } from "next";
import { publicApi } from "@/utils/api";
import { mapNewsData } from "@/services/newsService";
import NewsHeroClient from "./components/NewsHeroClient";
import NewsFiltersClient from "./components/NewsFiltersClient";
import NewsGridClient from "./components/NewsGridClient";
import LoadingSpinner from "@/components/LoadingSpinner";

export const metadata: Metadata = {
  title: "News & Updates | Airsoft Events",
  description: "Latest news, events, and updates from the airsoft community.",
};

export const revalidate = 3600;

export default async function NewsPage() {
  const allNewsResponse = await publicApi.getNews(undefined, {revalidate: 3600}).catch((error) => {
    console.error("Error fetching news:", error);
    return [];
  });

  const pinnedNewsResponse = await publicApi.getPinnedNews({revalidate: 3600}).catch((error) => {
    console.error("Error fetching pinned news:", error);
    return [];
  });

  const categoriesResponse = await publicApi
    .getNewsCategories({revalidate: 3600})
    .catch((error) => {
      console.error("Error fetching news categories:", error);
      return [];
    });

  const allNews = allNewsResponse.map(mapNewsData) ?? [];
  const pinnedNews = pinnedNewsResponse.map(mapNewsData) ?? [];
  const categories = categoriesResponse ?? [];

  return (
    <div className="min-h-screen bg-zone-dark text-white pb-12">
      <section className="relative bg-gradient-to-b from-zone-dark via-zone-dark-brown/30 to-zone-dark py-16">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-4">
            LATEST <span className="text-zone-gold">NEWS</span>
          </h1>
          <p className="text-xl text-gray-300 text-center max-w-2xl mx-auto">
            Stay updated with the latest events, community happenings, and
            announcements in the airsoft world.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        {/* Wrap NewsFiltersClient in Suspense */}
        <Suspense
          fallback={
            <div className="w-full flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          }
        >
          <NewsFiltersClient initialCategories={categories} />
        </Suspense>

        {/* Wrap NewsHeroClient in Suspense */}
        <Suspense
          fallback={
            <div className="w-full flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          }
        >
          <NewsHeroClient pinnedNews={pinnedNews} categories={categories} />
        </Suspense>

        {/* Wrap NewsGridClient in Suspense */}
        <Suspense
          fallback={
            <div className="w-full flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          }
        >
          <NewsGridClient initialNews={allNews} categories={categories} />
        </Suspense>
      </section>
    </div>
  );
}
