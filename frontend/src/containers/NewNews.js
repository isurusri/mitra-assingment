import React, { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import { useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../lib/errorLib";
import config from "../config";
import "./NewNews.css";
import { API } from "aws-amplify";
import { s3Upload } from "../lib/awsLib";

export default function NewNews() {
    const file = useRef(null);
    const history = useHistory();
    const [news, setNews] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function validateForm() {
        return news.length > 0;
    }

    function handleFileChange(event) {
        file.current = event.target.files[0];
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
            alert(
                `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000
                } MB.`
            );
            return;
        }

        setIsLoading(true);

        try {
            const attachment = file.current ? await s3Upload(file.current) : null;

            await createNews({ news, attachment });
            history.push("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }


    function createNews(news) {
        return API.post("news", "/news", {
            body: news
        });
    }

    return (
        <div className="NewNews">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="news">
                    <Form.Control
                        value={news}
                        as="textarea"
                        onChange={(e) => setNews(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="file">
                    <Form.Label>Attachment</Form.Label>
                    <Form.Control onChange={handleFileChange} type="file" />
                </Form.Group>
                <LoaderButton
                    block
                    type="submit"
                    size="lg"
                    variant="primary"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                >
                    Create
                </LoaderButton>
            </Form>
        </div>
    );
}