'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Wiki, fetchWikiById } from '@/app/api/wikiService';
import { createQuiz, QuizQuestion } from '@/app/api/quizzService';
import { submitContribution } from '@/app/api/contributionService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ThumbsUp, Users, Calendar, Puzzle, CheckCircle, Send, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Navbar from '@/app/components/navbar/Navbar';
import { Textarea } from '@/components/ui/textarea';

export default function WikiDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [wiki, setWiki] = useState<Wiki | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
  const [score, setScore] = useState<number | null>(null);
  const [contribution, setContribution] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  useEffect(() => {
    const loadWiki = async () => {
      try {
        const wikiData = await fetchWikiById(params.wikiId as string);
        setWiki(wikiData);
        setContribution(wikiData.content || '');
      } catch (error) {
        console.error('Error fetching wiki:', error);
        toast.error('Failed to load wiki article');
      } finally {
        setLoading(false);
      }
    };

    loadWiki();
  }, [params.wikiId]);

  const handleGenerateQuiz = async () => {
    if (!wiki?.title) {
      toast.error('Failed to generate quiz. Missing topic.');
      return;
    }

    setIsLoadingQuiz(true);
    setScore(null); // Reset score if user regenerates quiz
    try {
      const quizData = await createQuiz({ topic: wiki.title, numberOfQuestions: 3 });
      setQuizQuestions(quizData.quiz.questions);
      setSelectedAnswers({});
      toast.success('Quiz generated successfully!');
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error('Failed to generate quiz.');
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    if (!quizQuestions) return;

    let correctCount = 0;

    quizQuestions.forEach((question) => {
      if (selectedAnswers[question.questionId] === question.correctOptionIndex) {
        correctCount++;
      }
    });

    setScore(correctCount);
    toast.success(`You scored ${correctCount}/${quizQuestions.length}`);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setScore(null);
  };

  const handleContribute = async () => {
    if (!contribution.trim()) {
      toast.error('Please enter your contribution');
      return;
    }

    setIsSubmitting(true);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('Please login to contribute');
        return;
      }

      const result = await submitContribution(params.wikiId as string, contribution);
      setSubmittedId(result.id);
      toast.success('Contribution submitted successfully');
    } catch (error) {
      console.error('Error submitting contribution:', error);
      toast.error('Failed to submit contribution');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
      </div>
    );
  }

  if (!wiki) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar toggle={() => {}} />
      
      <div className="container mx-auto py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Wiki
          </Button>

          {/* Wiki Content */}
          <Card className="overflow-hidden border border-gray-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {wiki.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {wiki.upvotes} upvotes
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {wiki.contributorIds.length} contributors
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date().toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="mt-4">
              {wiki.thumbnailImageUrl && (
                <div className="mb-6">
                  <img
                    src={wiki.thumbnailImageUrl}
                    alt={wiki.title}
                    className="w-full h-64 object-cover rounded-lg shadow"
                  />
                </div>
              )}
              <div className="prose max-w-none">
                <p className="text-gray-600 whitespace-pre-line">{wiki.content}</p>
              </div>
            </CardContent>
          </Card>

          {/* Contribute Section */}
          <Card className="mt-8 border border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle>Contribute to this Wiki</CardTitle>
              <p className="text-sm text-gray-500">Edit the content below to submit your contribution</p>
              {submittedId && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-700">
                    Contribution submitted successfully!
                  </p>
                  <p className="text-xs text-green-600 font-mono mt-1">
                    Contribution ID: {submittedId}
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Share your knowledge..."
                  value={contribution}
                  onChange={(e) => setContribution(e.target.value)}
                  className="min-h-[150px]"
                />
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg"
                  onClick={handleContribute}
                  disabled={isSubmitting || !contribution.trim() || contribution === wiki?.content}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Submit Contribution
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Centered Generate Quiz Button */}
          <div className="flex justify-center my-8">
            <Button
              variant="default"
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow-lg"
              onClick={handleGenerateQuiz}
              disabled={isLoadingQuiz}
            >
              {isLoadingQuiz ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Puzzle className="h-4 w-4 mr-2" />
              )}
              Generate Quiz
            </Button>
          </div>

          {/* Quiz Questions */}
          {quizQuestions && (
            <Card className="mt-8 border border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                <CardTitle>Generated Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {quizQuestions.map((question, index) => (
                    <div key={question.questionId} className="space-y-2">
                      <p className="font-semibold text-gray-900">
                        {index + 1}. {question.content}
                      </p>
                      <ul className="space-y-2">
                        {question.options.map((option, optionIndex) => {
                          const isSelected = selectedAnswers[question.questionId] === optionIndex;
                          const isCorrect =
                            score !== null &&
                            question.correctOptionIndex === optionIndex;
                          const isIncorrect =
                            score !== null &&
                            isSelected &&
                            question.correctOptionIndex !== optionIndex;

                          return (
                            <li
                              key={optionIndex}
                              onClick={() => handleAnswerSelect(question.questionId, optionIndex)}
                              className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
                                isCorrect
                                  ? "bg-green-100 border-green-300 text-green-800"
                                  : isIncorrect
                                  ? "bg-red-100 border-red-300 text-red-800"
                                  : isSelected
                                  ? "bg-blue-100 border-blue-300 text-blue-800"
                                  : "bg-gray-100 hover:bg-gray-200"
                              }`}
                            >
                              {option}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
                {score === null ? (
                  <Button
                    className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg"
                    onClick={handleSubmitQuiz}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Quiz
                  </Button>
                ) : (
                  <div className="mt-6 space-y-4">
                    <p className="text-center text-xl font-semibold text-gray-900">
                      You scored: {score}/{quizQuestions.length}
                    </p>
                    <Button
                      className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 shadow-lg"
                      onClick={handleResetQuiz}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset Quiz
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
