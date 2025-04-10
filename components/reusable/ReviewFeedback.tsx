import React from 'react';

interface ReviewFeedbackProps {
    title: string;
    content: string;
    dropdownItems?: string[];
}

const ReviewFeedback: React.FC<ReviewFeedbackProps> = ({ title, content }) => {

    return (
        <div className="flex items-center my-4">
            <div className="flex flex-col mr-4 flex-grow">
                <span className="text-sm font-medium">{title}</span>
                <span className="text-sm text-gray-500">{content}</span>
            </div>
        </div>
    );
};

export default ReviewFeedback;
