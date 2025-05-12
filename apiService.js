export const getStory = async (storyTitle) => {
    const myHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer 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`,
    };
    const prompt =
        "write a 2 to 3 paragraphs of story each paragraph should not exceed 1500 characters to title :" +
        storyTitle;
    const body = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: prompt }],
    };

    try {
        const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(body),
            }
        );
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    }
};
export const getImage = async (paragraph) => {
    const myHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer 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`,
    };

    const body = {
        model: "dall-e-2",
        prompt:
            "generate image related to this information please give related image if it contains any content_policy_violation, information for image : " +
            paragraph,
        n: 1,
        size: "256x256",
    };

    try {
        const response = await fetch(
            "https://api.openai.com/v1/images/generations",
            {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(body),
            }
        );
        const result = await response.text();
        return result;
    } catch (error) {
        console.error(error);
    }
};

// ['256x256', '512x512', '1024x1024', '1024x1792', '1792x1024']