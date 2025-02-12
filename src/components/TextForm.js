import { useState } from "react";
import React from 'react';
import axios from 'axios';

export default function TextForm(props) {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);  // To track if plagiarism check is in progress
    const [plagiarismResult, setPlagiarismResult] = useState(null);  // To store the plagiarism result

    const handleUpClick = () => {
        let newText = text.toUpperCase();
        setText(newText);
        props.showAlert("Converted to uppercase!!", "success");
    };

    const handleLoClick = () => {
        let newText = text.toLowerCase();
        setText(newText);
        props.showAlert("Converted to lowercase!!", "success");
    };

    const handleOnChange = (event) => {
        setText(event.target.value);
    };

    const handleClearClick = () => {
        let newText = '';
        setText(newText);
    };

    const handlePlgClick = async () => {
        if (text.trim() === '') {
            props.showAlert("Please enter some text to check plagiarism.", "warning");
            return;
        }

        setIsLoading(true); // Start loading when checking plagiarism
        try {
            // Replace with the actual plagiarism check API endpoint and API key
            const response = await axios.post('https://plagiarismcheck.org/api/v1/check', {
                text: text
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer G9aNkYMvTMmvys_1Cuf9UhAZ8fNfiPmY`  // API token for authorization
                }
            });

            setIsLoading(false); // Stop loading when the request finishes

            if (response.status === 200) {
                // Assuming the API returns a field `plagiarismPercentage`
                const plagiarismPercentage = response.data.plagiarismPercentage;
                setPlagiarismResult(`Plagiarism detected: ${plagiarismPercentage}%`);
                props.showAlert("Plagiarism check completed!", "success");
            } else {
                setPlagiarismResult("Error: Unable to check plagiarism.");
                props.showAlert("Plagiarism check failed.", "danger");
            }
        } catch (error) {
            setIsLoading(false); // Stop loading in case of error
            setPlagiarismResult("Error: Unable to check plagiarism.");
            props.showAlert("Plagiarism check failed.", "danger");
        }
    };

    const handleCopy = () => {
        var textArea = document.getElementById("exampleFormControlTextarea1");
        textArea.select();
        navigator.clipboard.writeText(textArea.value);
        props.showAlert("Copied to clipboard!!", "success");
    };

    return (
        <>
            <div className="Container" style={{ color: props.mode === 'dark' ? 'white' : 'black' }}>
                <h1>{props.heading}</h1>
                <div className="mb-3">
                    <textarea
                        className="form-control"
                        value={text}
                        style={{
                            backgroundColor: props.mode === 'light' ? 'white' : '#202122',
                            color: props.mode === 'dark' ? 'white' : 'black'
                        }}
                        onChange={handleOnChange}
                        id="exampleFormControlTextarea1"
                        rows="8"
                    ></textarea>
                </div>
                <button disabled={text.length === 0} className="btn btn-primary mx-1 my-1" onClick={handleUpClick}>
                    Convert to Uppercase
                </button>
                <button disabled={text.length === 0} className="btn btn-primary mx-1 my-1" onClick={handleLoClick}>
                    Convert to Lowercase
                </button>
                <button disabled={text.length === 0} className="btn btn-primary mx-1 my-1" onClick={handleClearClick}>
                    Clear Text
                </button>
                <button disabled={text.length === 0} className="btn btn-primary mx-1 my-1" onClick={handleCopy}>
                    <i className="fa-solid fa-copy"></i>
                </button>
                <button disabled={text.length === 0} className="btn btn-primary mx-1 my-1" onClick={handlePlgClick}>
                    {isLoading ? "Checking..." : "Plagiarism Checker"}
                </button>
            </div>

            <div className="Container my-3" style={{ color: props.mode === 'dark' ? 'white' : '#202122' }}>
                <h1>Text Summary</h1>
                <p>
                    {text.split(/\s+/).filter((element) => { return element.length !== 0 }).length} Words and {text.length} Characters
                </p>
                <p>{0.008 * text.split(" ").length} Minutes to Read</p>
                <h2>Preview</h2>
                <p>{text.length > 0 ? text : "Enter something in the textbox to preview it."}</p>

                {/* Display the plagiarism result */}
                {plagiarismResult && (
                    <div className="alert alert-info mt-3">
                        <strong>Plagiarism Result:</strong> {plagiarismResult}
                    </div>
                )}
            </div>
        </>
    );
}
