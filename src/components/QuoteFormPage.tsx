import React from 'react';
import QuoteForm from './QuoteForm';

interface QuoteFormPageProps {
  onQuoteAdded: () => void;
}

const QuoteFormPage: React.FC<QuoteFormPageProps> = ({ onQuoteAdded }) => {
  return (
    <div>
      <QuoteForm onQuoteAdded={onQuoteAdded} />
    </div>
  );
};

export default QuoteFormPage;