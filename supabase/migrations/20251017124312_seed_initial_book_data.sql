/*
  # Seed Initial Book Data

  ## Overview
  Populates the database with sample books across different subjects
  and story pages for the story book.

  ## Initial Data

  ### Books
  Inserts 6 sample books covering different subjects:
  - Luna's Garden Adventure (STORY)
  - Numbers and Counting Fun (MATHS)
  - Amazing Animals (SCIENCE)
  - Sports Heroes (SPORTS)
  - World Explorers (GEOGRAPHY)
  - Creative Art Adventures (ART)

  ### Story Pages
  Inserts 8 pages for the Luna's Garden Adventure story book:
  - Each page includes title, text, image URLs, video URLs, and quiz data
  - Pages follow the story of Hoppy the rabbit helping Flutter the bird

  ## Notes
  - Uses ON CONFLICT to avoid duplicate entries
  - Links story pages to the correct book using book_id
*/

-- Insert sample books
INSERT INTO books (title, subject, author, publisher, description, thumbnail_url, cover_image_url, difficulty_level, target_age_min, target_age_max) VALUES
(
  'Luna''s Garden Adventure',
  'STORY',
  'Interactive Learning Team',
  'EduBooks Publishing',
  'Join Luna the rabbit on a magical journey through the garden, learning about friendship and helping others.',
  'https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
  'https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
  'beginner',
  3,
  8
),
(
  'Numbers and Counting Fun',
  'MATHS',
  'Dr. Sarah Mathematics',
  'MathKids Publishing',
  'Learn numbers, counting, and basic arithmetic through fun interactive exercises and colorful illustrations.',
  'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
  'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
  'beginner',
  4,
  7
),
(
  'Amazing Animals',
  'SCIENCE',
  'Prof. Nature Explorer',
  'Science Wonder Books',
  'Discover fascinating facts about animals, their habitats, and how they live in the wild.',
  'https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
  'https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
  'intermediate',
  5,
  10
),
(
  'Sports Heroes',
  'SPORTS',
  'Coach Champion',
  'Active Kids Media',
  'Meet amazing athletes and learn about different sports, teamwork, and staying healthy.',
  'https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
  'https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
  'beginner',
  4,
  9
),
(
  'World Explorers',
  'GEOGRAPHY',
  'Captain Discovery',
  'World Learning Press',
  'Travel around the world and learn about different countries, cultures, and amazing places.',
  'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
  'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
  'intermediate',
  6,
  12
),
(
  'Creative Art Adventures',
  'ART',
  'Artist Palette',
  'Creative Kids Studio',
  'Explore colors, shapes, and artistic techniques while creating your own masterpieces.',
  'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
  'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
  'beginner',
  3,
  10
)
ON CONFLICT DO NOTHING;

-- Insert story pages for the story book
DO $$
DECLARE
  story_book_id uuid;
BEGIN
  SELECT id INTO story_book_id FROM books WHERE title = 'Luna''s Garden Adventure' LIMIT 1;
  
  IF story_book_id IS NOT NULL THEN
    INSERT INTO story_pages (page_number, title, text, image_url, video_url, background_url, quiz_data, book_id) VALUES
    (0, 'Hoppy Meets the Forest', 'Once upon a time in the magical forest of Whisperwood, there lived a little rabbit named Hoppy. Hoppy loved to explore and make new friends.', 'https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'https://www.sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 'https://images.pexels.com/photos/1287075/pexels-photo-1287075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', '{"multipleChoice": {"question": "What is the name of the little rabbit?", "options": [{"text": "Hoppy", "isCorrect": true}, {"text": "Bunny", "isCorrect": false}, {"text": "Fluffy", "isCorrect": false}]}, "spelling": {"word": "rabbit", "hint": "This furry animal hops around"}}', story_book_id),

    (1, 'The Sunny Adventure', 'One sunny morning, Hoppy decided to venture deeper into the forest than ever before. The trees were taller here, and the flowers more colorful.', 'https://images.pexels.com/photos/4588055/pexels-photo-4588055.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4', 'https://images.pexels.com/photos/1287142/pexels-photo-1287142.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', '{"multipleChoice": {"question": "What kind of morning was it when Hoppy went exploring?", "options": [{"text": "Rainy", "isCorrect": false}, {"text": "Sunny", "isCorrect": true}, {"text": "Cloudy", "isCorrect": false}]}, "spelling": {"word": "forest", "hint": "A place with many trees"}}', story_book_id),

    (2, 'Meeting Flutter', 'Suddenly, Hoppy heard a soft sound. It was a little bird with a blue wing who couldn''t fly. ''Hello,'' said Hoppy. ''My name is Hoppy. What''s yours?''', 'https://images.pexels.com/photos/416179/pexels-photo-416179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4', 'https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', '{"multipleChoice": {"question": "What color was the bird''s wing?", "options": [{"text": "Red", "isCorrect": false}, {"text": "Blue", "isCorrect": true}, {"text": "Green", "isCorrect": false}]}, "spelling": {"word": "bird", "hint": "An animal that usually flies"}}', story_book_id),

    (3, 'Flutter''s Problem', '''I''m Flutter,'' said the bird. ''I hurt my wing and can''t get back to my nest.'' Hoppy thought for a moment, then had a brilliant idea!', 'https://images.pexels.com/photos/2662434/pexels-photo-2662434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'https://www.sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 'https://images.pexels.com/photos/145863/pexels-photo-145863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', '{"multipleChoice": {"question": "What was the bird''s name?", "options": [{"text": "Chirpy", "isCorrect": false}, {"text": "Flutter", "isCorrect": true}, {"text": "Tweety", "isCorrect": false}]}, "spelling": {"word": "wing", "hint": "Birds use these to fly"}}', story_book_id),

    (4, 'The Helpful Hop', '''Climb on my back,'' said Hoppy. ''I may not fly, but I can hop very high!'' And so, with Flutter on his back, Hoppy began to hop toward the tallest tree.', 'https://images.pexels.com/photos/325812/pexels-photo-325812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4', 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', '{"multipleChoice": {"question": "How did Hoppy help Flutter?", "options": [{"text": "By flying", "isCorrect": false}, {"text": "By hopping with Flutter on his back", "isCorrect": true}, {"text": "By calling for help", "isCorrect": false}]}, "spelling": {"word": "tree", "hint": "Tall plants that grow in forests"}}', story_book_id),

    (5, 'The Journey Together', 'Hop by hop, they made their way up the hill. It wasn''t easy, but Hoppy was determined to help his new friend. Flutter directed them through the forest.', 'https://images.pexels.com/photos/4588474/pexels-photo-4588474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'https://www.sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 'https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', '{"multipleChoice": {"question": "What did Flutter do to help during their journey?", "options": [{"text": "Sang songs", "isCorrect": false}, {"text": "Directed them through the forest", "isCorrect": true}, {"text": "Carried supplies", "isCorrect": false}]}, "spelling": {"word": "friend", "hint": "Someone you care about and help"}}', story_book_id),

    (6, 'Reaching Home', 'Finally, they reached Flutter''s nest high in the branches. Flutter''s family was overjoyed! They thanked Hoppy with songs and stories until the sun set.', 'https://images.pexels.com/photos/6577903/pexels-photo-6577903.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4', 'https://images.pexels.com/photos/531321/pexels-photo-531321.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', '{"multipleChoice": {"question": "How did Flutter''s family thank Hoppy?", "options": [{"text": "With food", "isCorrect": false}, {"text": "With songs and stories", "isCorrect": true}, {"text": "With gifts", "isCorrect": false}]}, "spelling": {"word": "family", "hint": "People or animals who live together and care for each other"}}', story_book_id),

    (7, 'The Greatest Adventure', 'From that day on, Hoppy and Flutter became the best of friends, showing everyone in Whisperwood Forest that helping others is the greatest adventure of all.', 'https://images.pexels.com/photos/1643457/pexels-photo-1643457.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'https://www.sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 'https://images.pexels.com/photos/707344/pexels-photo-707344.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', '{"multipleChoice": {"question": "What is the main lesson of this story?", "options": [{"text": "Always be careful in the forest", "isCorrect": false}, {"text": "Helping others is the greatest adventure", "isCorrect": true}, {"text": "Birds are better than rabbits", "isCorrect": false}]}, "spelling": {"word": "adventure", "hint": "An exciting journey or experience"}}', story_book_id)
    ON CONFLICT (page_number, book_id) DO NOTHING;
  END IF;
END $$;