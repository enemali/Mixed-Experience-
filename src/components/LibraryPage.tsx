import React from 'react';
import { Book, Heart, Star, User } from 'lucide-react';
import { Button } from './ui/button';
import { Book as BookType } from '../types/Book';
import { sampleBooks } from '../data/sampleBooks';

interface LibraryPageProps {
  onSelectBook: (book: BookType) => void;
  onBack: () => void;
}

const LibraryPage: React.FC<LibraryPageProps> = ({ onSelectBook }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/10 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-magic shadow-magic">
              <Book className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-magic bg-clip-text text-transparent">
              Story Library
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your magical adventure! Each story comes with interactive reading, 
            fun quizzes, and an AI friend to help you learn.
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleBooks.map((book) => (
            <BookCard 
              key={book.id} 
              book={book} 
              onSelect={() => onSelectBook(book)} 
            />
          ))}
        </div>

        {/* Fun Stats */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
            <div className="inline-flex p-3 rounded-xl bg-gradient-sunset mb-3">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-xl mb-2">Interactive Stories</h3>
            <p className="text-muted-foreground">
              Click, listen, and interact with every page
            </p>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
            <div className="inline-flex p-3 rounded-xl bg-gradient-ocean mb-3">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-xl mb-2">AI Reading Buddy</h3>
            <p className="text-muted-foreground">
              Get help and encouragement from your AI friend
            </p>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
            <div className="inline-flex p-3 rounded-xl bg-gradient-forest mb-3">
              <User className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-xl mb-2">Learn & Grow</h3>
            <p className="text-muted-foreground">
              Fun quizzes and activities after each story
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface BookCardProps {
  book: BookType;
  onSelect: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onSelect }) => {
  const gradientMap = {
    magic: 'bg-gradient-magic',
    ocean: 'bg-gradient-ocean',
    forest: 'bg-gradient-forest',
    sunset: 'bg-gradient-sunset',
  };

  return (
    <div className="group cursor-pointer" onClick={onSelect}>
      <div className="relative overflow-hidden rounded-2xl bg-card book-shadow hover:shadow-magic transition-all duration-300 hover:scale-105">
        {/* Cover Image */}
        <div className={`aspect-[3/4] ${gradientMap[book.theme]} p-8 flex items-center justify-center relative`}>
          <div className="text-center text-white">
            <Book className="w-16 h-16 mx-auto mb-4 opacity-80" />
            <h3 className="text-xl font-bold mb-2">{book.title}</h3>
            <p className="text-sm opacity-90">by {book.author}</p>
          </div>
          
          {/* Age Badge */}
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-sm font-medium text-white">{book.ageRange}</span>
          </div>
        </div>

        {/* Book Info */}
        <div className="p-6">
          <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {book.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Book className="w-4 h-4" />
              <span>{book.pages.length} pages</span>
            </div>
            
            <Button size="sm" className="btn-magic text-white border-0">
              Read Story
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;