import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleLayout } from "@/components/guides/ArticleLayout";
import { GuideSection } from "@/components/guides/GuideParts";
import { JsonLd } from "@/components/seo/JsonLd";
import { articles, getArticle } from "@/data/articles";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/schema";

/**
 * GUIDE ARTICLE -> /guides/<slug>
 *
 * One template for every guide in data/articles. Only the slugs listed there
 * exist; anything else is a 404 (the two older guides keep their own pages).
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return buildPageMetadata({
    title: article.metaTitle,
    description: article.metaDescription,
    path: routes.guide(article.slug),
    type: "article",
    defaultImage: false,
  });
}

export default async function GuideArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const path = routes.guide(article.slug);

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          headline: article.title,
          description: article.metaDescription,
          path,
          datePublished: article.published,
          dateModified: article.updated,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: routes.home() },
          { name: "Guides", path: routes.guides() },
          { name: article.title, path },
        ])}
      />

      <ArticleLayout
        title={article.title}
        intro={article.intro}
        category={article.category}
        readingMinutes={article.readingMinutes}
        updated={article.updated}
        cover={article.cover}
        breadcrumbs={[
          { label: "Home", href: routes.home() },
          { label: "Guides", href: routes.guides() },
          { label: article.title, href: path },
        ]}
        keyPoints={article.keyPoints}
        toc={article.sections.map((s) => ({ id: s.id, label: s.title }))}
        faq={article.faq}
        related={article.related}
      >
        {article.sections.map((section) => (
          <GuideSection key={section.id} id={section.id} title={section.title}>
            {section.body}
          </GuideSection>
        ))}
      </ArticleLayout>
    </>
  );
}
