import type { ArticleItemProps } from "./articleItem.type";


export interface DefaultMainPageProps {
    latestManagerForeword: string;
    mostViewsArticles: ArticleItemProps[];
    previousArticles: ArticleItemProps[];
    incomingArticles: ArticleItemProps[];
};