CREATE TABLE IF NOT EXISTS categories (
  id INT GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(40) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  description VARCHAR(256),
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS instruments (
  id INT GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(256) NOT NULL,
  description VARCHAR(2040),
  category_id INT NOT NULL,
  price DEC(10,2) NOT NULL,
  in_stock INT,
  slug VARCHAR(200) NOT NULL UNIQUE,
  PRIMARY KEY(id),
  CONSTRAINT fk_category
    FOREIGN KEY(category_id)
    REFERENCES categories(id)
    ON DELETE CASCADE
);

INSERT INTO categories(name, slug, description)
VALUES
('Guitars', 'guitars', '6, 7, and even 8 string guitars for all types of playing. Find Acoustic and Electric guitars.'),
('Keyboards', 'keyboards', 'Everything from pianos, electric pianos, to Keytars.'),
('Basses', 'basses', '4, 5, and even 6 string basses to play those funky tunes.');

INSERT INTO instruments(name, description, category_id, price, in_stock, slug)
VALUES
('PRS S2 CUSTOM 24 ELECTRIC GUITAR in Gloss Black #24S2073401', 'The PRS S2 Custom 24 electric guitar is PRS more streamlined counterpart to their Core Custom 24 model, but with the same top of the line quality and appointments that PRS is known for. The S2 Custom 24 features a pair of super versatile 85/15 S pickups, complete with a push/pull coil split control to cover any genre. The eye-catching maple top compliments the mahogany body in such a way that is as tonally rich as it is strikingly beautiful.', 1, 1999.00, 12, 'prs-s2-custom-24'),
('Epiphone dave mustaine flying V custom electric guitar black metallic #22091524072', 'Dave Mustaine is the legendary guitarist, vocalist, songwriter, and founder of the multi-platinum selling and Grammy Award-winning band, MEGADETH. With that legacy in mind, its n osurprise that he demands excellence from any instrument that bears his name. The new Epiphone Dave Mustaine Flying V Custom is no exception, delivering powerful, heavy sound and exceptional playing performance with every note.', 1, 1399.99, 10, 'epiphone-dave-mustaine-flying-v'),
('PRS 10TH ANNIVERSARY S2 CUSTOM 24 LIMITED EDITION ELECTRIC GUITAR Black Amber #S2071129', 'The PRS S2 Custom 24 electric guitar is PRS more streamlined counterpart to their Core Custom 24 model, but with the same top of the line quality and appointments that PRS is known for. The S2 Custom 24 features a pair of super versatile 85/15 (S) pickups, complete with a push/pull coil split control to cover any genre. The eye-catching maple top compliments the mahogany body in such a way that is as tonally rich as it is strikingly beautiful. ', 1, 2299.99, 8, 'prs-10th-anniversary-s2-custom-24'),
('M-Audio Oxygen 49 (MKV) USB MIDI Controller (Demo/Open Box)', 'Welcome to the Oxygen Series from M-Audio, the Oxygen Series (MKV). In todays world of music production, controlling your digital music environment is important. It is not only how the pros improve their workflow, but also how they create unique cutting-edge signature sounds. M-Audio has updated the most iconic series of MIDI keyboard controllers on the market for software-based music production and performance. The new Oxygen Series (MKV) keyboard controllers offer innovative advancements in hardware control enabling you to create modern cutting-edge music on stage or in the studio', 2, 149.77, 13, 'm-audio-oxygen-49-mkv-usb-midi-keyboard'),
('Korg Pa5X 88-Key Professional Arranger Keyboard', 'The Korg Pa5X Professional Arranger Keyboard is a powerhouse instrument designed for professional musicians. With its comprehensive features and unparalleled versatility, it is the ultimate tool for live performance and studio production alike. Featuring an 88-key Hammer action keyboard with Aftertouch, an upgradable operating system, and the EDS-XP Sound Generator, it offers a vast array of sounds and effects to suit any musical genre. The inclusion of Mic Processor Technology by Shift Audio and a Guitar Processor further enhances its sonic capabilities, making it a must-have for serious performers and producers.', 2, 5299.99, 11, 'korg-pa5x88-kpa5x88xx'),
('Akai MPK Mini MK3 25-Key Keyboard Controller (Red)', 'Everything the modern producer demands is here: Universal compatibility for instant integration with your favorite host music production application. It is compact size makes it an ideal travel companion. Its arsenal of pads and assignable controls let you take complete command of every aspect of your production. The Gen 2 enhanced dynamic keybed guarantees your performance is captured with every subtle inflection of your delivery.', 2, 99.99, 9, 'akai-mpk-mini-mk3-25-key-keyboard-controller-ampkmin3x-p'),
('Michael Kelly Element 4 Vintage Bass Guitar', 'If your taste in instruments is from past eras, the Element 4 Vintage bass from Michael Kelly was designed for you. The Element 4 Vintage takes visual cues from classic instruments and combines them with modern day comfort for the optimal mix of past and present. Excellent wood choices combined with specially designed Rockfield pickups make for a great sounding bass. Past and present generations will appreciate what the Element 4 Vintage brings to the table.', 3, 599.99, 15, 'michael-kelly-element-4-vintage-bass-guitar'),
('Epiphone Newport Bass (Pacific Blue)', 'The Epiphone Newport Bass is a tribute to the rare vintage model introduced in 1961. This modern iteration blends the allure of the original with contemporary enhancements tailored to meet the demands of todays bass players. With a comfortable 30.5in scale length and a Medium C profile neck, it accommodates a wide range of hand sizes, ensuring comfortable playability. The symmetrical double-cutaway body design allows effortless access to every fret on the fingerboard.', 3, 449.99, 13, 'epiphone-newport-bass-pacific-blue-enb4panh1'),
('Hofner Ignition Pro Club 4 String Electric Bass Guitar Transparent Black', 'The Ignition (HI) series offers you the chance to own a piece of history even on a tight budget. This model has a fully hollow body combined with Hofner 70s style (staple) pick-ups to give it the authentic Hofner sound. It is of course fitted with the famous Hofner control panel which includes an on/off for each pick-up, solo/rhythm switch, and individual volume controls.', 3, 499.99, 11, 'hofner-ignition-pro-club-4-string-electric-bass-guitar');