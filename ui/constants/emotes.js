// @flow

const buildCDNUrl = (path: string) => `https://static.odycdn.com/emoticons/${path}`;

const buildEmote = (name: string, path: string) => ({
  name: `:${name}:`,
  url: buildCDNUrl(path),
});

const getEmotes = (px: string, multiplier: string) => [
  buildEmote('alien', `${px}/Alien${multiplier}.png`),
  buildEmote('angry_1', `${px}/angry${multiplier}.png`),
  buildEmote('angry_2', `${px}/angry%202${multiplier}.png`),
  buildEmote('angry_3', `${px}/angry%203${multiplier}.png`),
  buildEmote('angry_4', `${px}/angry%204${multiplier}.png`),
  buildEmote('blind', `${px}/blind${multiplier}.png`),
  buildEmote('block', `${px}/block${multiplier}.png`),
  buildEmote('bomb', `${px}/bomb${multiplier}.png`),
  buildEmote('brain_chip', `${px}/Brain%20chip${multiplier}.png`),
  buildEmote('confirm', `${px}/CONFIRM${multiplier}.png`),
  buildEmote('confused_1', `${px}/confused${multiplier}-1.png`),
  buildEmote('confused_2', `${px}/confused${multiplier}.png`),
  buildEmote('cooking_something_nice', `${px}/cooking%20something%20nice${multiplier}.png`),
  buildEmote('cry_1', `${px}/cry${multiplier}.png`),
  buildEmote('cry_2', `${px}/cry%202${multiplier}.png`),
  buildEmote('cry_3', `${px}/cry%203${multiplier}.png`),
  buildEmote('cry_4', `${px}/cry%204${multiplier}.png`),
  buildEmote('cry_5', `${px}/cry%205${multiplier}.png`),
  buildEmote('donut', `${px}/donut${multiplier}.png`),
  buildEmote('eggplant_with_condom', `${px}/eggplant%20with%20condom${multiplier}.png`),
  buildEmote('eggplant', `${px}/eggplant${multiplier}.png`),
  buildEmote('fire_up', `${px}/fire%20up${multiplier}.png`),
  buildEmote('flat_earth', `${px}/Flat%20earth${multiplier}.png`),
  buildEmote('flying_saucer', `${px}/Flying%20saucer${multiplier}.png`),
  buildEmote('heart_chopper', `${px}/heart%20chopper${multiplier}.png`),
  buildEmote('hyper_troll', `${px}/HyperTroll${multiplier}.png`),
  buildEmote('ice_cream', `${px}/ice%20cream${multiplier}.png`),
  buildEmote('idk', `${px}/IDK${multiplier}.png`),
  buildEmote('illuminati_1', `${px}/Illuminati${multiplier}-1.png`),
  buildEmote('illuminati_2', `${px}/Illuminati${multiplier}.png`),
  buildEmote('kiss_1', `${px}/kiss${multiplier}.png`),
  buildEmote('kiss_2', `${px}/kiss%202${multiplier}.png`),
  buildEmote('laser_gun', `${px}/laser%20gun${multiplier}.png`),
  buildEmote('laughing_1', `${px}/Laughing${multiplier}.png`),
  buildEmote('laughing_2', `${px}/Laughing 2${multiplier}.png`),
  buildEmote('lollipop', `${px}/Lollipop${multiplier}.png`),
  buildEmote('love_1', `${px}/Love${multiplier}.png`),
  buildEmote('love_2', `${px}/Love%202${multiplier}.png`),
  buildEmote('monster', `${px}/Monster${multiplier}.png`),
  buildEmote('mushroom', `${px}/mushroom${multiplier}.png`),
  buildEmote('nail_it', `${px}/Nail%20It${multiplier}.png`),
  buildEmote('no', `${px}/NO${multiplier}.png`),
  buildEmote('ouch', `${px}/ouch${multiplier}.png`),
  buildEmote('peace', `${px}/peace${multiplier}.png`),
  buildEmote('pizza', `${px}/pizza${multiplier}.png`),
  buildEmote('rabbit_hole', `${px}/rabbit%20hole${multiplier}.png`),
  buildEmote('rainbow_puke_1', `${px}/rainbow%20puke${multiplier}-1.png`),
  buildEmote('rainbow_puke_2', `${px}/rainbow%20puke${multiplier}.png`),
  buildEmote('rock', `${px}/ROCK${multiplier}.png`),
  buildEmote('sad', `${px}/sad${multiplier}.png`),
  buildEmote('salty', `${px}/salty${multiplier}.png`),
  buildEmote('scary', `${px}/scary${multiplier}.png`),
  buildEmote('sleep', `${px}/Sleep${multiplier}.png`),
  buildEmote('slime_down', `${px}/slime%20down${multiplier}.png`),
  buildEmote('smelly_socks', `${px}/smelly%20socks${multiplier}.png`),
  buildEmote('smile_1', `${px}/smile${multiplier}.png`),
  buildEmote('smile_2', `${px}/smile%202${multiplier}.png`),
  buildEmote('space_chad', `${px}/space%20chad${multiplier}.png`),
  buildEmote('space_doge', `${px}/doge${multiplier}.png`),
  buildEmote('space_green_wojak', `${px}/space%20wojak${multiplier}-1.png`),
  buildEmote('space_julian', `${px}/Space%20Julian${multiplier}.png`),
  buildEmote('space_red_wojak', `${px}/space%20wojak${multiplier}.png`),
  buildEmote('space_resitas', `${px}/resitas${multiplier}.png`),
  buildEmote('space_tom', `${px}/space%20Tom${multiplier}.png`),
  buildEmote('spock', `${px}/SPOCK${multiplier}.png`),
  buildEmote('star', `${px}/Star${multiplier}.png`),
  buildEmote('sunny_day', `${px}/sunny%20day${multiplier}.png`),
  buildEmote('surprised', `${px}/surprised${multiplier}.png`),
  buildEmote('sweet', `${px}/sweet${multiplier}.png`),
  buildEmote('thinking_1', `${px}/thinking${multiplier}-1.png`),
  buildEmote('thinking_2', `${px}/thinking${multiplier}.png`),
  buildEmote('thumb_down', `${px}/thumb%20down${multiplier}.png`),
  buildEmote('thumb_up_1', `${px}/thumb%20up${multiplier}-1.png`),
  buildEmote('thumb_up_2', `${px}/thumb%20up${multiplier}.png`),
  buildEmote('tinfoil_hat', `${px}/tin%20hat${multiplier}.png`),
  buildEmote('troll_king', `${px}/Troll%20king${multiplier}.png`),
  buildEmote('ufo', `${px}/ufo${multiplier}.png`),
  buildEmote('waiting', `${px}/waiting${multiplier}.png`),
  buildEmote('what', `${px}/what_${multiplier}.png`),
  buildEmote('woodoo_doll', `${px}/woodo%20doll${multiplier}.png`),
];

export const EMOTES_24px = getEmotes('24%20px', '');
export const EMOTES_36px = getEmotes('36px', '%401.5x');
export const EMOTES_48px = getEmotes('48%20px', '%402x');
export const EMOTES_72px = getEmotes('72%20px', '%403x');
