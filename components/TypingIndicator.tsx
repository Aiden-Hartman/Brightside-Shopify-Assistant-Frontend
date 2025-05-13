interface TypingIndicatorProps {
  isLoading: boolean;
}

export const TypingIndicator = ({ isLoading }: TypingIndicatorProps) => {
  if (!isLoading) return null;
  
  return (
    <div className="flex items-center space-x-2 p-4">
      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
        <span className="text-white text-sm">AI</span>
      </div>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-sm text-gray-500">Assistant is typing...</span>
    </div>
  );
}; 