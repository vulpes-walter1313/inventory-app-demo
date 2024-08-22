import { Client } from "pg";
import "dotenv/config";

const sql = `CREATE TABLE IF NOT EXISTS instruments (
  id INT GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(256) NOT NULL,
  description VARCHAR(2040),
  category_id INT NOT NULL,
  price DEC(10,2) NOT NULL,
  in_stock INT,
  slug VARCHAR(100) NOT NULL UNIQUE,
  PRIMARY KEY(id),
  CONSTRAINT fk_category
    FOREIGN KEY(category_id)
    REFERENCES categories(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories (
  id INT GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(20) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(256),
  PRIMARY KEY(id)
);

INSERT INTO categories(name, slug, description)
VALUES
('Guitars', 'guitars', 'The best 6 string instrument this side of the Rio Grande'),
('Keyboards', 'keyboards', 'So.... many.... keys!'),
('Basses', 'basses', 'The guitars best friend... and special friend too.');

INSERT INTO instruments(name, description, category_id, price, in_stock, slug)
VALUES
('guitar 1', 'a cool description for guitar 1', 1, 999.99, 12, 'cool-guitar-1'),
('guitar 2', 'a cool description for guitar 2', 1, 899.99, 10, 'cool-guitar-2'),
('guitar 3', 'a cool description for guitar 3', 1, 799.99, 8, 'cool-guitar-3'),
('keyboard 1', 'a cool description for keyboard 1', 2, 1999.99, 13, 'cool-keyboard-1'),
('keyboard 2', 'a cool description for keyboard 2', 2, 1899.99, 11, 'cool-keyboard-2'),
('keyboard 3', 'a cool description for keyboard 3', 2, 1799.99, 9, 'cool-keyboard-3'),
('bass 1', 'a cool description for bass 1', 3, 2999.99, 15, 'cool-bass-1'),
('bass 2', 'a cool description for bass 2', 3, 2899.99, 13, 'cool-bass-2'),
('bass 3', 'a cool description for bass 3', 3, 2799.99, 11, 'cool-bass-3');
`;

async function main() {
  const connectionString = process.argv[2];
  const client = new Client({ connectionString });

  try {
    console.log("connecting to db");
    await client.connect();
    console.log("conected to db");
    console.log("populating db...");
    await client.query(sql);
    console.log("Finished, exiting now");
    process.exit(0);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
    process.exit(1);
  }
}

main();
