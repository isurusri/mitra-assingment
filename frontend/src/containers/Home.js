import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../lib/contextLib";
import { onError } from "../lib/errorLib";
import "./Home.css";
import { API } from "aws-amplify";
import { BsPencilSquare } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";

export default function Home() {
    const [news, setNews] = useState([]);
    const { isAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function onLoad() {
            if (!isAuthenticated) {
                return;
            }

            try {
                const news = await loadNews();
                setNews(news);
            } catch (e) {
                onError(e);
            }

            setIsLoading(false);
        }

        onLoad();
    }, [isAuthenticated]);

    function loadNews() {
        return API.get("news", "/news");
    }

    function renderNewsList(news) {
        return (
            <>
                <LinkContainer to="/news/new">
                    <ListGroup.Item action className="py-3 text-nowrap text-truncate">
                        <BsPencilSquare size={17} />
                        <span className="ml-2 font-weight-bold">Create a new news</span>
                    </ListGroup.Item>
                </LinkContainer>
                {news.map(({ newsId, news, createdAt }) => (
                    <LinkContainer key={newsId} to={`/news/${newsId}`}>
                        <ListGroup.Item action>
                            <span className="font-weight-bold">
                                {news.trim().split("\n")[0]}
                            </span>
                            <br />
                            <span className="text-muted">
                                Created: {new Date(createdAt).toLocaleString()}
                            </span>
                        </ListGroup.Item>
                    </LinkContainer>
                ))}
            </>
        );
    }

    function renderLander() {
        return (
            <div className="lander">
                <h1>MeNews</h1>
                <p className="text-muted">Simple news app</p>
            </div>
        );
    }

    function renderNews() {
        return (
            <div className="news">
                <h2 className="pb-3 mt-4 mb-3 border-bottom">Your News</h2>
                <ListGroup>{!isLoading && renderNewsList(news)}</ListGroup>
            </div>
        );
    }

    return (
        <div className="Home">
            {isAuthenticated ? renderNews() : renderLander()}
        </div>
    );
}