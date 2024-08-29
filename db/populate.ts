import { Client } from "pg";
import "dotenv/config";

const sql = `CREATE TABLE IF NOT EXISTS categories (
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
('Epiphone Hummingbird Studio Acoustic-Electric Guitar Ebony', 'The Epiphone Hummingbird Studio acoustic-electric guitar fuses iconic vintage design with enhanced contemporary features. Derived from the legendary Gibson Hummingbird, the Epiphone Hummingbird Studio is made from a solid spruce top with mahogany back and sides. These woods deliver a rich, balanced tone, while the fishman Sonitone preamp and Sonicore pickup provide natural amplification suited for any stage.', 1, 449.99, 11, 'epiphone-hummingbird-studio-acoustic-electric-guitar-ebony'),
('Martin Special D Classic Dreadnought Acoustic Guitar Natural', 'The Martin Special D Classic Dreadnought acoustic guitar is crafted with a solid Sitka spruce top and solid sapele back and sides. Like many of Martins famous dreadnought guitars, the Special D Classic dreadnought has all the punch and volume that players have come to expect from the world-famous Martin Guitar Co. The combination of spruce and sapele generates a tone with expressive highs and mid-range frequencies—plus a loud, punchy bottom end. Along with a great tone, this guitar has amazing sustain and dynamic response.', 1, 1049.99, 11, 'martin-special-d-classic-dreadnought-acoustic-guitar-natural'),
('Yamaha F335 Acoustic Guitar Black', 'The F335 acoustic guitar from Yamaha is a stellar blend of quality, playability and affordability that offers an appealing option for both beginners and seasoned musicians alike. Its dreadnought body features a laminated spruce top complemented by meranti back and sides, delivering a warm, full-bodied tone with excellent projection. The guitars comfortable rosewood fingerboard and nato neck enhance playability, while the durable finish and attractive soundhole rosette add visual appeal.', 1, 189.99, 11, 'yamaha-f335-acoustic-guitar-black'),
('Martin SC-10E Road Series Acoustic-Electric Guitar Natural', 'The Martin SC-10E is an accessible acoustic-electric guitar with a look and feel unlike any other model in the companys history. One peek down the soundhole confirms it, where a large X-brace marks the spot of departure. Of course, Martin invented X-bracing in 1843, but never before have they put such a brace on the backof the guitar.', 1, 1299.99, 11, 'martin-sc-10e-road-series-acoustic-electric-guitar-natural'),
('Mitchell T333E-BST Mahogany Auditorium Acoustic-Electric Guitar Edge Burst', 'To succeed in music, you need to start off with the right instrument. With that in mind, Mitchell created the Terra Series acoustic and acoustic-electric guitars, which includes this T333E-BST Auditorium acoustic-electric guitar. The Terra Series offers guitarists budget-friendly options with great looks and tone to inspire and keep players engaged on their musical journey.', 1, 319.99, 11, 'mitchell-t333e-bst-mahogany-auditorium-acoustic-electric-guitar-edge-burst'),
('Fender FA-135CE Concert Acoustic-Electric Guitar Sunburst', 'The Fender FA-135CE acoustic-electric guitar provides an affordable option for guitarists looking to expand their sound. With a laminated spruce top and basswood back and sides, this guitar produces a rich, full tone suitable for any genre. The built-in Fishman Ion-T preamp allows you to amplify your sound when needed for live performances or recording, while the guitars C-shaped neck and rosewood fingerboard ensure a comfortable playing experience during long practice sessions or shows.', 1, 199.99, 11, 'fender-fa-135ce-concert-acoustic-electric-guitar-sunburst'),
('Martin Special Dreadnought X1AE Style Acoustic-Electric Guitar Natural', 'The Martin Special Dreadnought X1AE Style acoustic-electric guitar combines over 180 years of craftsmanship with modern technology for a performance-ready instrument with iconic sound. This balanced dreadnought features a solid Sitka spruce top with a customized rosette and durable rosewood-pattern back and sides. Its birch laminate neck and Richlite fingerboard deliver fast and even playability across the fretboard. Equipped with reliable Fishman MX electronics, the Special Dreadnought X1AE Style is ready to plug in and elevate your sound.', 1, 649.99, 11, 'martin-special-dreadnought-x1ae-style-acoustic-electric-guitar-natural'),
('Martin D-28 Standard Dreadnought Acoustic Guitar Natural', 'For slightly more than 90 years, the Martin D-28 dreadnought has been the go-to acoustic guitar for celebrated artists, such as Hank Williams, Johnny Cash, Bob Dylan, Eric Clapton, John Lennon and Paul McCartney, Nancy Wilson, Neil Young, Brad Paisley and scores of other legends. It has also enriched the careers of hit-making songwriters, working professionals and aspiring players looking to make their mark. In its quest to help musicians find their perfect sound, Guitar Center carries the eminent Martin D-28 Standard to inspire discerning creators.', 1, 3199.99, 11, 'martin-d-28-standard-dreadnought-acoustic-guitar-natural'),
('Taylor 414ce V-Class Special-Edition Grand Auditorium Acoustic-Electric Guitar Shaded Edge Burst', 'The 414ce V-Class Special-Edition Grand Auditorium acoustic-electric guitar from Taylor offers musicians an ideal blend of powerful tone and accessible playing comfort. Built with a timeless combination of tonewoods—including a Sitka spruce top, and Indian rosewood back and sides—the 414ce produces iconic acoustic timbre that is powerful, articulate and harmonically complex. Innovative V-Class bracing further optimizes the guitars unforgettable sound, which also amplifies naturally using custom Expression System 2 electronics. The Taylor 414ce is a responsive acoustic-electric that feels, sounds and looks fantastic.', 1, 2999.99, 11, 'taylor-414ce-v-class-special-edition-grand-auditorium'),
('M-Audio Oxygen 49 (MKV) USB MIDI Controller (Demo/Open Box)', 'Welcome to the Oxygen Series from M-Audio, the Oxygen Series (MKV). In todays world of music production, controlling your digital music environment is important. It is not only how the pros improve their workflow, but also how they create unique cutting-edge signature sounds. M-Audio has updated the most iconic series of MIDI keyboard controllers on the market for software-based music production and performance. The new Oxygen Series (MKV) keyboard controllers offer innovative advancements in hardware control enabling you to create modern cutting-edge music on stage or in the studio', 2, 149.77, 13, 'm-audio-oxygen-49-mkv-usb-midi-keyboard'),
('Korg Pa5X 88-Key Professional Arranger Keyboard', 'The Korg Pa5X Professional Arranger Keyboard is a powerhouse instrument designed for professional musicians. With its comprehensive features and unparalleled versatility, it is the ultimate tool for live performance and studio production alike. Featuring an 88-key Hammer action keyboard with Aftertouch, an upgradable operating system, and the EDS-XP Sound Generator, it offers a vast array of sounds and effects to suit any musical genre. The inclusion of Mic Processor Technology by Shift Audio and a Guitar Processor further enhances its sonic capabilities, making it a must-have for serious performers and producers.', 2, 5299.99, 11, 'korg-pa5x88-kpa5x88xx'),
('Akai MPK Mini MK3 25-Key Keyboard Controller (Red)', 'Everything the modern producer demands is here: Universal compatibility for instant integration with your favorite host music production application. It is compact size makes it an ideal travel companion. Its arsenal of pads and assignable controls let you take complete command of every aspect of your production. The Gen 2 enhanced dynamic keybed guarantees your performance is captured with every subtle inflection of your delivery.', 2, 99.99, 9, 'akai-mpk-mini-mk3-25-key-keyboard-controller-ampkmin3x-p'),
('Yamaha P-125ABLB Digital Piano With Wooden Stand and Bench', 'The P-125ABLB digital piano is a sleek yet powerful digital piano combines Yamahas acclaimed Pure CF Sound Engine and 88-key graded hammer standard keyboard to deliver the rich, nuanced tones of a concert grand piano. Designed for home use, the P-125ABLB includes a furniture-style wooden stand and bench, allowing musicians of all levels to enjoy an authentic acoustic piano experience in an affordable, space-saving package.', 2, 749.99, 9, 'yamaha-p-125ablb-digital-piano-with-wooden-stand-and-bench'),
('Suzuki MDG-300 Black Micro Grand Digital Piano', 'The Suzuki MDG-300 Micro grand digital piano is an innovative instrument designed for pianists seeking an authentic playing experience with modern connectivity. Boasting 128-note polyphony, it produces a rich, realistic piano sound without dropped notes for complex pieces. Its powerful six-speaker sound system fills your space with dynamic, powerful audio. With Bluetooth and USB connectivity, you can stream music, record your performance and connect to devices.', 2, 1699.99, 9, 'suzuki-mdg-300-black-micro-grand-digital-piano'),
('Casio GP-510BP Celviano Grand Hybrid Black', 'The Celviano Grand Hybrid GP-510 from Casio is the perfect combination of innovation and tradition. From the moment your hands touch the keys, the GP-510 Grand Hybrid delivers the authenticity your performance demands.', 2, 5999.99, 9, 'casio-gp-510bp-celviano-grand-hybrid-black'),
('Yamaha P-225 88-Key Digital Piano White', 'The simplicity of the Yamaha P-225 88-key digital piano is an approachable and user-friendly digital piano for everyone. Beginner and intermediate players will find the touch and tone perfect for their repertoire, and the portability of the P-225 means you can take it to those coffee house gigs, or bring it to the to family gatherings with ease.', 2, 649.99, 9, 'yamaha-p-225-88-key-digital-piano-white'),
('Roland FP-30X 88-Key Digital Piano White', 'The Roland FP-30X is the latest generation of Rolands award-winning FP series digital pianos. Powered by Rolands SuperNATURAL Piano sound engine and 256-voice polyphony, the FP-30X provides an refined acoustic grand piano playing experience whether at home, onstage or in the studio. Your fingers will appreciate the sumptuous touch of Rolands PHA-4 Standard keyboard with Progressive Hammer Action and Ivory Feel keys. The FP-30Xs onboard speaker system fills the room with a rich, powerful sound ideal for home playing and intimate live performances.', 2, 699.99, 9, 'roland-fp-30x-88-key-digital-piano-white'),
('Casio Privia PX-S7000 88-Key Digital Piano White', 'Put simply, the Casio Privia PX-S7000 is the best-sounding, best-feeling, best-looking Privia ever made. With brilliant style to match its breathtaking sound and touch, the Privia PX-S7000 is a stunning musical centerpiece for your home. It brings harmony to your life in more ways than one, with a striking modern design in your choice of finishes.', 2, 2499.99, 9, 'casio-privia-px-s7000-88-key-digital-piano-white'),
('Roland LX708 Premium Digital Upright Piano With Bench Polished White', 'As the flagship of Rolands LX700 series, the LX708 recreates all the pleasures of playing a traditional grand piano in a great live venue. Standing out among the LX range with its tall, commanding cabinet and a lid that opens for optimum sound projection, this luxurious instrument makes a bold statement in your home. And with its powerful eight-speaker system ready to fill your home with music, the LX708 is the ultimate choice for discerning players. This kit also includes a bench, for convenient, comfortable practicing and performing.', 2, 7399.99, 9, 'roland-lx708-premium-digital-upright-piano-with-bench-polished-white'),
('Yamaha P-143 88-Key Digital Piano Black', 'Yamaha has always been synonymous with quality instruments that are easy and enjoyable to play, and the P-143 digital piano is no exception. You will find the layout and Premium Grand Piano Voice familiar and inviting, while its improved feature set is sure to wow and impress even the most discerning musicians. With everything you need to get playing, the P-143 is an obvious choice for beginners, students and performers of all skill levels that want a portable digital piano that will grow with them and their continuously evolving love for music.', 2, 499.99, 9, 'yamaha-p-143-88-key-digital-piano-black'),
('Williams Allegro IV 88-Key Digital Piano With Bluetooth and Sustain Pedal Black', 'The Williams Allegro IV includes a truly magnificent concert grand piano designed to amaze and inspire classical and jazz pianists, as well as demanding rock, blues, country and pop players. However, the Allegro IV speaks with much more than one voice. There are 11 more sounds to explore, including two vintage electric pianos, two organs, strings, acoustic and electric bass, vibraphone and choir. The Allegro IV has an 88-key, hammer-weighted keyboard that provides the authentic feel of an actual acoustic grand, making it easy for players to transition from home practice and songwriting sessions to performing live and in the studio on a real piano.', 2, 429.99, 9, 'williams-allegro-iv-88-key-digital-piano'),
('Michael Kelly Element 4 Vintage Bass Guitar', 'If your taste in instruments is from past eras, the Element 4 Vintage bass from Michael Kelly was designed for you. The Element 4 Vintage takes visual cues from classic instruments and combines them with modern day comfort for the optimal mix of past and present. Excellent wood choices combined with specially designed Rockfield pickups make for a great sounding bass. Past and present generations will appreciate what the Element 4 Vintage brings to the table.', 3, 599.99, 15, 'michael-kelly-element-4-vintage-bass-guitar'),
('Epiphone Newport Bass (Pacific Blue)', 'The Epiphone Newport Bass is a tribute to the rare vintage model introduced in 1961. This modern iteration blends the allure of the original with contemporary enhancements tailored to meet the demands of todays bass players. With a comfortable 30.5in scale length and a Medium C profile neck, it accommodates a wide range of hand sizes, ensuring comfortable playability. The symmetrical double-cutaway body design allows effortless access to every fret on the fingerboard.', 3, 449.99, 13, 'epiphone-newport-bass-pacific-blue-enb4panh1'),
('Hofner Ignition Pro Club 4 String Electric Bass Guitar Transparent Black', 'The Ignition (HI) series offers you the chance to own a piece of history even on a tight budget. This model has a fully hollow body combined with Hofner 70s style (staple) pick-ups to give it the authentic Hofner sound. It is of course fitted with the famous Hofner control panel which includes an on/off for each pick-up, solo/rhythm switch, and individual volume controls.', 3, 499.99, 11, 'hofner-ignition-pro-club-4-string-electric-bass-guitar'),
('Epiphone Thunderbird 64 Bass Silver Mist', 'The Epiphone Thunderbird 64 bass brings back the iconic look and sound of the classic Thunderbird bass. With its distinctive shape created by legendary car designer Ray Dietrich and its sustain-enhancing neck-through-body construction, the Thunderbird 64 retains all the vintage vibe of the original Thunderbirds. This iconic bass has the distinctive and eye-catching Thunderbird body shape that vintage bassists know and love. Its sustain-enhancing neck-through-body construction provides excellent resonance for a full-bodied tone.', 3, 849.99, 11, 'epiphone-thunderbird-64-bass-silver-mist'),
('Ernie Ball Music Man StingRay Special H Electric Bass Guitar Brulee', 'The Ernie Ball Music Man StingRay Special H electric bass gets a sonic overhaul with a redesigned neodymium pickup and an upgraded 18V preamp, while also receiving a facelift in sculpture and construction for greater comfort. Originally debuting in 1976, the legendary bass is one of Leo Fenders own designs, and it still sports the iconic 3+1 tuning machine layout and signature oval pickguard.', 3, 2599.99, 11, 'ernie-ball-music-man-stingray-special-h-electric-bass-guitar-brulee'),
('Ernie Ball Music Man StingRay Special HH Electric Bass Guitar Grape Crush', 'At the intersection of craftsmanship and innovation, the Ernie Ball Music Man StingRay bass stands as one of the most iconic bass guitars in the history of modern music. The first production four-string bass to feature onboard active equalization, this instrument is a testament to the amount of progressive technology you can fit into a timeless package—and the StingRay Special HH is no exception. Heard on countless records throughout history, you can find a StingRay in studios and on stages around the world.', 3, 2699.99, 11, 'ernie-ball-music-man-stingray-special-hh-electric-bass-guitar-grape-crush'),
('Fender American Performer Precision Bass Maple Fingerboard Satin Lake Placid Blue', 'Born in Corona, California, the American Performer Precision Bass with maple fingerboard delivers the exceptional tone and feel you expect from an authentic Fender—along with new, player-oriented features that make it even more exciting to play.', 3, 1349.99, 11, 'fender-american-performer-precision-bass-maple-fingerboard'),
('Fender American Ultra Jazz Bass Maple Fingerboard Cobra Blue', 'The Fender American Ultra Jazz Bass raises the bar for sonic superiority and playing comfort. The American Ultra series is Fenders most advanced line, catering to discerning musicians who require the utmost in precision, tone and feel from their instruments. The American Ultra Jazz Bass unique (Modern D) shaped neck has rolled edges for endless hours of comfortable playability, while its compound 10in-14in radius fingerboard with 21 medium jumbo frets allows for effortless soloing across the neck.', 3, 1859.99, 11, 'fender-american-ultra-jazz-bass-maple-fingerboard-cobra-blue'),
('Gibson Rex Brown Thunderbird Electric Bass Guitar Ebony', 'Gibson is thrilled to introduce the Rex Brown Thunderbird Electric Bass. The signature instrument of Panteras legendary bassist, Rex Brown, is a thunderous bass built for dishing out the hardest-hitting low end. Its mahogany body and neck provide a muscular tone that cuts through the mix, while a pair of Rexbucker T-Bird pickups deliver bone-rattling output. Active electronics give you complete control over your sound with the twist of a knob.', 3, 2799.99, 11, 'gibson-rex-brown-thunderbird-electric-bass-guitar-ebony'),
('Spector Euro 4 Ian Hill Judas Priest 50th Anniversary Signature Electric Bass Black', 'Ian Hill has been holding down the low-end for the legendary Judas Priest for 50 years. To celebrate 50 years of uncompromising metal anthems, Ians signature bass now features updated specifications. His name is synonymous with classic heavy metal and his signature Spector is carefully crafted to provide his legendary tone to all bassists. The Euro4 Ian Hill is reminiscent of an 80s era Spector with solid Maple body wings, a 3-piece maple neck, Rosewood fingerboard with a custom Judas Priest 50th anniversary inlay, premium electronics and gold hardware.', 3, 2999.99, 11, 'spector-euro-4-ian-hill-judas-priest-50th-anniversary'),
('Fender Aerodyne Special Precision Bass With Rosewood Fingerboard Bright White', 'The Aerodyne Special Precision Bass from Fender features a sleek look with an elegantly bound basswood body and matching headcap. A modern C-shaped satin-finished neck with 12in radius fingerboard ensures effortless playability, while vintage-voiced Precision Bass pickups and a Babicz Z-Series FCH-4 bridge deliver a perfect balance of high performance and classic Fender tone.', 3, 999.99, 11, 'fender-aerodyne-special-precision-bass-with-rosewood-fingerboard'),
('Ernie Ball Music Man StingRay Special H Electric Bass Guitar Ivory White', 'First introduced in 1976, Ernie Ball Music Mans StingRay bass from has been revered as one of the most iconic models in history as it was the first mass produced four-string bass to feature onboard active equalization. The flagship of the Music Man line, todays StingRay Special H electric bass retains the same signature features that it had some 40 years ago, including a solid roadworthy construction, iconic oval pickguard, 3+1 tuning key configuration and the ever-popular Music Man humbucker—all of which combine to produce a look, feel and sound that is remarkably unmistakable.', 3, 2799.99, 11, 'ernie-ball-music-man-stingray-special-h-electric-bass-guitar-ivory-white');
`;

async function main() {
  const connectionString = process.argv[2];
  const client = new Client({ connectionString });

  try {
    console.log("connecting to db");
    await client.connect();
    console.log("connected to db");
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
