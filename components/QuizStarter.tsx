import React, { useState } from 'react';
import { useAssistantFlow } from '../hooks/useAssistantFlow';
import type { QuizQuestion, ChatMessage } from '../types/assistant';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'goal',
    question: 'What are you shopping for today?',
    options: [
      { id: 'skincare', label: 'Skincare Products', value: 'skincare' },
      { id: 'supplements', label: 'Health Supplements', value: 'supplements' },
      { id: 'fitness', label: 'Fitness Equipment', value: 'fitness' },
      { id: 'wellness', label: 'General Wellness', value: 'wellness' },
    ],
  },
  {
    id: 'budget',
    question: 'What\'s your budget range?',
    options: [
      { id: 'under_50', label: 'Under $50', value: 'under_50' },
      { id: '50_100', label: '$50 - $100', value: '50_100' },
      { id: '100_200', label: '$100 - $200', value: '100_200' },
      { id: 'over_200', label: 'Over $200', value: 'over_200' },
    ],
  },
];

export const QuizStarter: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { updateQuizAnswers, quizAnswers, setPhase, setLoading, addMessage, sendMessage } = useAssistantFlow();

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];

  const handleOptionSelect = async (e: React.MouseEvent, value: string) => {
    e.preventDefault(); // Prevent any default browser behavior
    
    console.log('[QuizStarter] Button clicked:', {
      questionIndex: currentQuestionIndex,
      value,
      currentQuestion: currentQuestion.id
    });

    // Update answers first
    await updateQuizAnswers({ [currentQuestion.id]: value });
    console.log('[QuizStarter] Answers updated:', quizAnswers);
    
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      console.log('[QuizStarter] Moving to next question');
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz completed, transition to chat
      console.log('[QuizStarter] Quiz completed, preparing to transition to chat');
      setLoading(true);
      try {
        // For the final question (budget), we already have the budget option
        const budgetOption = currentQuestion.options.find(opt => opt.value === value);
        console.log('[QuizStarter] Found budget option:', budgetOption);

        // For the goal, we need to look at the first question's options
        const goalOption = QUIZ_QUESTIONS[0].options.find(opt => opt.value === quizAnswers.goal);
        console.log('[QuizStarter] Found goal option:', goalOption);

        // Add initial message summarizing both goal and budget
        const messageContent = `I'm looking for ${goalOption?.label.toLowerCase()} with a budget of ${budgetOption?.label}.`;
        console.log('[QuizStarter] Sending quiz summary message to assistant:', messageContent);

        // Immediately transition to chat phase
        console.log('[QuizStarter] Transitioning to chat phase...');
        setPhase('chat');

        // Only call sendMessage (which will add the message and get assistant response)
        console.log('[QuizStarter] Triggering assistant response to initial message...');
        await sendMessage(messageContent);
        console.log('[QuizStarter] Assistant response triggered.');
      } catch (error) {
        console.error('[QuizStarter] Error during transition:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">
        {currentQuestion.question}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        {currentQuestion.options.map((option) => (
          <button
            key={option.id}
            onClick={(e) => handleOptionSelect(e, option.value)}
            type="button" // Explicitly set button type to prevent form submission
            className="p-4 text-left border rounded-lg hover:border-primary hover:bg-blue-50 transition-colors"
          >
            <span className="font-medium text-gray-800">{option.label}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <span className="w-2 h-2 rounded-full bg-primary"></span>
        <span>{`Question ${currentQuestionIndex + 1} of ${QUIZ_QUESTIONS.length}`}</span>
      </div>
    </div>
  );
}; 