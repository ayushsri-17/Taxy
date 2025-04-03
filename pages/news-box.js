import { useEffect, useState } from "react";
import styles from "../styles/component-holder.module.css";

export default function NewsBox() {
    const [news, setNews] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchNews() {
            try {
                const response = await fetch(
                    "https://newsdata.io/api/1/news?apikey=pub_739054eb1883fd573b9cd30c111bcec46bb9a&q=finance&country=in"
                );
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch news");
                }

                if (data.results && data.results.length > 0) {
                    setNews(data.results.slice(0, 10)); // Limit to 10 news items
                } else {
                    setNews([]); // No news found
                }
            } catch (error) {
                console.error("Error fetching news:", error);
                setError(error.message || "Failed to load news. Please try again later.");
                setNews([]);
            }
        }

        fetchNews();
    }, []);

    return (
        <>
        <h2 className={styles.componentTitle}>Fin-News Box (India)</h2>
        <div className={styles.newsContainer}>
            
            <div className={styles.newsBox}>
                {error ? (
                    <p className={styles.error}>{error}</p>
                ) : news === null ? (
                    <p className={styles.loading}>Loading news...</p>
                ) : news.length === 0 ? (
                    <p>No news available at the moment.</p>
                ) : (
                    <ol className={styles.newsList}>
                        {news.map((article, index) => (
                            <li key={index} className={styles.newsItem}>
                                <h3>{article.title}</h3>
                                {article.description && (
                                    <p className={styles.newsDescription}>{article.description}</p>
                                )}
                                {article.publishedAt && (
                                    <small className={styles.newsDate}>
                                        {new Date(article.publishedAt).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </small>
                                )}
                                {article.link && (
                                    <a
                                        href={article.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.readMore}
                                    >
                                        Read more →
                                    </a>
                                )}
                            </li>
                        ))}
                    </ol>
                )}
            </div>
        </div>
        </>
    );
}