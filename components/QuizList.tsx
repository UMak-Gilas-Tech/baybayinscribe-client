import React, { useState, useEffect, useMemo, useRef } from 'react';
import QuizCard from './QuizCard';
import { Quiz } from '@/types/type.quiz';
import { Button } from "./ui/button";

type QuizListProps = {
	quizzes: Quiz[];
};

export default function QuizList({ quizzes }: QuizListProps) {
	const INITIAL_COUNT = 8;
	const INCREMENT = 4;
  
	const [searchQuery, setSearchQuery] = useState('');
	const [debouncedQuery, setDebouncedQuery] = useState('');
	const [displayCount, setDisplayCount] = useState(INITIAL_COUNT);
  
	// New state for difficulty filter and sort order
	const [difficultyFilter, setDifficultyFilter] = useState("All");
	const [sortOrder, setSortOrder] = useState("newest");
  
	// Debounce search query
	useEffect(() => {
		const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
		return () => clearTimeout(handler);
	}, [searchQuery]);
  
	// Reset lazy loading when search changes
	useEffect(() => {
		setDisplayCount(INITIAL_COUNT);
	}, [debouncedQuery, difficultyFilter, sortOrder]);
  
	// Filter and sort quizzes
	const filteredQuizzes = useMemo(() => {
		let result = quizzes.filter(q =>
			q.metadata.quiz_name.toLowerCase().includes(debouncedQuery.toLowerCase())
		);
    
		if (difficultyFilter !== "All") {
			result = result.filter(q => q.metadata.difficulty === difficultyFilter);
		}
    
		result = result.sort((a, b) => {
			const dateA = new Date(a.metadata.created_at).getTime();
			const dateB = new Date(b.metadata.created_at).getTime();
			return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
		});
    
		return result;
	}, [quizzes, debouncedQuery, difficultyFilter, sortOrder]);
  
	// Lazy load more items when sentinel is visible
	const sentinelRef = useRef<HTMLDivElement>(null);
  
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && displayCount < filteredQuizzes.length) {
					setDisplayCount((prev) => Math.min(prev + INCREMENT, filteredQuizzes.length));
				}
			},
			{
				rootMargin: '100px',
			}
		);
		const sentinel = sentinelRef.current;
		if (sentinel) {
			observer.observe(sentinel);
		}
		return () => {
			if (sentinel) observer.unobserve(sentinel);
		};
	}, [displayCount, filteredQuizzes]);
  
	return (
		<div className="p-4">
			{/* Search input field */}
			<input
				type="text"
				placeholder="Search quizzes..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className="mb-4 p-2 border rounded w-full"
			/>
      
			{/* New filter buttons */}
			<div className="flex justify-between mb-4">
				<div className="flex gap-2">
					<Button 
						onClick={() => setDifficultyFilter("All")} 
						className={`px-3 py-1 rounded ${difficultyFilter === "All" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}
					>
						All
					</Button>
					<Button 
						onClick={() => setDifficultyFilter("Easy")} 
						className={`px-3 py-1 rounded ${difficultyFilter === "Easy" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}
					>
						Easy
					</Button>
					<Button 
						onClick={() => setDifficultyFilter("Moderate")} 
						className={`px-3 py-1 rounded ${difficultyFilter === "Moderate" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}
					>
						Moderate
					</Button>
					<Button 
						onClick={() => setDifficultyFilter("Hard")} 
						className={`px-3 py-1 rounded ${difficultyFilter === "Hard" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}
					>
						Hard
					</Button>
				</div>
				<div>
					<Button 
						onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
						className="px-3 py-1 rounded bg-gray-300 text-black"
					>
						{sortOrder === 'newest' ? "Newest to Oldest" : "Oldest to Newest"}
					</Button>
				</div>
			</div>
      
			<div className="grid grid-cols-4 gap-4">
				{filteredQuizzes.slice(0, displayCount).map((quiz) => (
					<QuizCard key={quiz.metadata.quiz_id} quiz={quiz} />
				))}
			</div>
      
			{/* Sentinel for lazy loading */}
			<div ref={sentinelRef} className="h-1"></div>
		</div>
	);
}