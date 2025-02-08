/*
UPDATE options
SET description = CASE
  WHEN id = 10 THEN 'A popular pizza chain known for its stuffed crust'
  WHEN id = 11 THEN 'A Canadian pizza chain offering a variety of toppings'
  WHEN id = 12 THEN 'A well-known pizza delivery chain'
  WHEN id = 13 THEN 'A popular truck brand known for its durability'
  WHEN id = 14 THEN 'A truck brand with a rich history'
  WHEN id = 15 THEN 'A leading truck manufacturer in the US'
  WHEN id = 16 THEN 'The iconic Pokémon mascot'
  WHEN id = 17 THEN 'A fire-breathing dragon Pokémon'
  WHEN id = 18 THEN 'A water-type turtle Pokémon'
  WHEN id = 19 THEN 'An NHL team based in Vancouver'
  WHEN id = 20 THEN 'An NHL team based in Edmonton'
  WHEN id = 21 THEN 'An NHL team based in Calgary'
  WHEN id = 22 THEN 'A luxury car brand known for its elegance'
  WHEN id = 23 THEN 'A luxury car brand synonymous with opulence'
  WHEN id = 24 THEN 'A British luxury car brand'
  ELSE description
END
WHERE id BETWEEN 10 AND 24;
*/
