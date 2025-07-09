import { Book } from '../types/Book';

export const sampleBooks: Book[] = [
  {
    id: 'magical-forest',
    title: 'The Magical Forest Adventure',
    description: 'Join Luna on her journey through an enchanted forest filled with talking animals and magical creatures!',
    coverImageUrl: '/api/placeholder/300/400',
    author: 'Kids Interactive',
    ageRange: '4-8 years',
    theme: 'forest',
    pages: [
      {
        id: 1,
        title: 'Luna Discovers the Forest',
        content: 'Once upon a time, there was a curious little girl named Luna. She loved exploring and discovering new things. One sunny morning, Luna found a mysterious path behind her house that led to a magical forest.',
        quiz: {
          multipleChoice: {
            question: 'What is the name of the little girl in our story?',
            options: ['Lily', 'Luna', 'Lucy', 'Lara'],
            correctAnswer: 1
          },
          spelling: {
            word: 'curious',
            hint: 'Someone who wants to learn and explore new things'
          }
        }
      },
      {
        id: 2,
        title: 'Meeting the Wise Owl',
        content: 'As Luna walked deeper into the forest, she heard a gentle "Hoo-hoo" from above. Looking up, she saw a magnificent owl perched on a branch. "Welcome to the Magical Forest, Luna," said the owl. "I am Oliver, the forest guardian."',
        quiz: {
          multipleChoice: {
            question: 'What is the name of the wise owl?',
            options: ['Oscar', 'Otto', 'Oliver', 'Owen'],
            correctAnswer: 2
          },
          spelling: {
            word: 'magnificent',
            hint: 'Something that is very beautiful and impressive'
          }
        }
      },
      {
        id: 3,
        title: 'The Dancing Butterflies',
        content: 'Oliver led Luna to a beautiful clearing where hundreds of colorful butterflies danced in the air. "These are the Rainbow Butterflies," explained Oliver. "They bring color and joy to our forest. Would you like to dance with them?"',
        quiz: {
          multipleChoice: {
            question: 'What do the Rainbow Butterflies bring to the forest?',
            options: ['Food and water', 'Color and joy', 'Wind and rain', 'Night and day'],
            correctAnswer: 1
          },
          spelling: {
            word: 'butterflies',
            hint: 'Beautiful insects with colorful wings that flutter'
          }
        }
      },
      {
        id: 4,
        title: 'The Magic Flower',
        content: 'In the center of the clearing grew a special flower that glowed with a soft, golden light. "This is the Friendship Flower," said Oliver. "It blooms only when someone shows true kindness. Luna, your kind heart has made it shine brighter than ever!"',
        quiz: {
          multipleChoice: {
            question: 'What makes the Friendship Flower bloom?',
            options: ['Sunshine', 'True kindness', 'Water', 'Magic words'],
            correctAnswer: 1
          },
          spelling: {
            word: 'friendship',
            hint: 'The special bond between people who care about each other'
          }
        }
      },
      {
        id: 5,
        title: 'Luna\'s Promise',
        content: 'As the sun began to set, Oliver walked Luna back to the forest entrance. "Remember, Luna," he said, "the magic of this forest lives in your heart. Be kind, be curious, and the magic will always be with you." Luna promised to return and share the forest\'s magic with others.',
        quiz: {
          multipleChoice: {
            question: 'Where does the forest magic live according to Oliver?',
            options: ['In the trees', 'In Luna\'s heart', 'In the flowers', 'In the sky'],
            correctAnswer: 1
          },
          spelling: {
            word: 'promise',
            hint: 'When you give your word that you will do something'
          }
        }
      }
    ]
  },
  {
    id: 'ocean-adventure',
    title: 'Finn\'s Ocean Discovery',
    description: 'Dive deep with Finn the dolphin as he explores the wonders of the ocean and makes new friends!',
    coverImageUrl: '/api/placeholder/300/400',
    author: 'Kids Interactive',
    ageRange: '5-9 years',
    theme: 'ocean',
    pages: [
      {
        id: 1,
        title: 'Finn the Playful Dolphin',
        content: 'Deep in the crystal-clear ocean lived a young dolphin named Finn. He was known throughout the reef for his playful spirit and love of adventure. Every morning, Finn would swim to the surface to greet the sunrise.',
        quiz: {
          multipleChoice: {
            question: 'What was Finn known for throughout the reef?',
            options: ['Being fast', 'His playful spirit', 'Being big', 'Singing songs'],
            correctAnswer: 1
          },
          spelling: {
            word: 'dolphin',
            hint: 'A smart ocean animal that can jump and play'
          }
        }
      },
      {
        id: 2,
        title: 'The Colorful Coral City',
        content: 'One day, Finn discovered a magnificent coral reef that looked like a rainbow city underwater. Fish of every color swam between the coral towers. "Welcome to Rainbow Reef!" called out Bella, a bright yellow fish. "Would you like a tour of our beautiful home?"',
        quiz: {
          multipleChoice: {
            question: 'What color is Bella the fish?',
            options: ['Blue', 'Red', 'Yellow', 'Green'],
            correctAnswer: 2
          },
          spelling: {
            word: 'rainbow',
            hint: 'All the colors that appear in the sky after rain'
          }
        }
      },
      {
        id: 3,
        title: 'The Gentle Giant',
        content: 'As they swam through the reef, they met Walter, a gentle whale who was much older and wiser than the other sea creatures. "The ocean teaches us that we are all connected," Walter said in his deep, kind voice. "Every creature, big or small, has an important role in our underwater world."',
        quiz: {
          multipleChoice: {
            question: 'What does the ocean teach us according to Walter?',
            options: ['To swim fast', 'That we are all connected', 'To find food', 'To hide from danger'],
            correctAnswer: 1
          },
          spelling: {
            word: 'connected',
            hint: 'When things are linked or joined together'
          }
        }
      },
      {
        id: 4,
        title: 'The Treasure of Friendship',
        content: 'Walter led them to a hidden cave filled with the most beautiful pearls Finn had ever seen. "These pearls represent all the friendships in our ocean," Walter explained. "Each one is formed through care, time, and understanding. The greatest treasure is not what we find, but the friends we make along the way."',
        quiz: {
          multipleChoice: {
            question: 'What do the pearls represent according to Walter?',
            options: ['Money', 'Food', 'Friendships', 'Games'],
            correctAnswer: 2
          },
          spelling: {
            word: 'treasure',
            hint: 'Something very valuable and precious'
          }
        }
      },
      {
        id: 5,
        title: 'Finn\'s New Family',
        content: 'From that day on, Finn visited Rainbow Reef every day. He had found not just new friends, but a whole new family in the ocean. Together with Bella and Walter, he learned that the greatest adventures come from sharing joy and kindness with others.',
        quiz: {
          multipleChoice: {
            question: 'What did Finn learn about the greatest adventures?',
            options: ['They are dangerous', 'They come from sharing joy and kindness', 'They are scary', 'They happen alone'],
            correctAnswer: 1
          },
          spelling: {
            word: 'adventure',
            hint: 'An exciting journey or experience'
          }
        }
      }
    ]
  }
];