import { SB_PUBLIC } from '../lib/supabase.js'

/**
 * Curated reel items — preserved verbatim from the Vite app. Used as the
 * bundled fallback when the Supabase `reel_items` table is empty / unreachable.
 * Also fuels the landing-page preview.
 */
export const VIDEO_ITEMS = [
  /* General Video */
  {
    id: 'v1', category: 'video', subcategory: 'General',
    title: 'Car Shoot', client: 'P2V Labs',
    description: 'A vertical automotive shoot — sharp angles, dramatic light, and motion that sells the machine before a word is spoken.',
    videoUrl:     SB_PUBLIC('reel/videos/car-shoot.mp4'),
    thumbnailUrl: SB_PUBLIC('reel/thumbnails/car-shoot.png'),
    orientation: 'portrait', duration: '', fileSize: '',
    tags: ['Automotive', 'Cinematic', 'Vertical'],
    date: '2025', featured: true,
  },
  /* Influencer Work */
  {
    id: 'v2', category: 'video', subcategory: 'Influencer Work',
    title: 'Udaipur Day One', client: 'Confidential',
    description: "Day one in the City of Lakes — a cinematic horizontal edit following a creator through Udaipur's iconic ghats and rooftop cafés.",
    videoUrl:     SB_PUBLIC('reel/videos/udaipur-day-one.mp4'),
    thumbnailUrl: SB_PUBLIC('reel/thumbnails/udaipur-day-one.png'),
    orientation: 'landscape', duration: '', fileSize: '',
    tags: ['Influencer', 'Udaipur'],
    date: '2025', featured: true,
  },
  {
    id: 'v3', category: 'video', subcategory: 'Influencer Work',
    title: 'Ambrai', client: 'Confidential',
    description: 'Shot at the iconic Ambrai Ghat — golden hour on the water, the Aravalli skyline, and a creator story that belongs on a big screen.',
    videoUrl:     SB_PUBLIC('reel/videos/ambrai.mp4'),
    thumbnailUrl: SB_PUBLIC('reel/thumbnails/ambrai.png'),
    orientation: 'landscape', duration: '', fileSize: '',
    tags: ['Influencer', 'Udaipur', 'Cinematic'],
    date: '2025', featured: false,
  },
  {
    id: 'v4', category: 'video', subcategory: 'Influencer Work',
    title: 'Udaipur', client: 'Confidential',
    description: 'A vertical portrait of Udaipur — narrow lanes, lake reflections, and a creator in their element.',
    videoUrl:     SB_PUBLIC('reel/videos/udaipur.mp4'),
    thumbnailUrl: SB_PUBLIC('reel/thumbnails/udaipur.png'),
    orientation: 'portrait', duration: '', fileSize: '',
    tags: ['Influencer', 'Udaipur', 'Vertical'],
    date: '2025', featured: false,
  },
  {
    id: 'v5', category: 'video', subcategory: 'Influencer Work',
    title: 'Payal', client: 'Confidential',
    description: 'A vertical creator film — intimate, editorial, built for Reels.',
    videoUrl:     SB_PUBLIC('reel/videos/payal.mp4'),
    thumbnailUrl: SB_PUBLIC('reel/thumbnails/payal.png'),
    orientation: 'portrait', duration: '', fileSize: '',
    tags: ['Influencer', 'Portrait', 'Vertical'],
    date: '2025', featured: false,
  },
  /* Travel */
  {
    id: 'v6', category: 'video', subcategory: 'Travel',
    title: 'Munroe Island', client: 'P2V Labs',
    description: "Backwater mornings and canoe trails through Munroe Island — a slow, cinematic drift through Kerala's quietest corner.",
    videoUrl:     SB_PUBLIC('reel/videos/munroe.mp4'),
    thumbnailUrl: SB_PUBLIC('reel/thumbnails/munroe.png'),
    orientation: 'landscape', duration: '', fileSize: '',
    tags: ['Travel', 'Kerala', 'Cinematic'],
    date: '2025', featured: true,
  },
  {
    id: 'v7', category: 'video', subcategory: 'Travel',
    title: 'Labour', client: 'P2V Labs',
    description: 'A raw, horizontal travel edit — unscripted moments, real light, real places.',
    videoUrl:     SB_PUBLIC('reel/videos/labour.mp4'),
    thumbnailUrl: SB_PUBLIC('reel/thumbnails/labour.png'),
    orientation: 'landscape', duration: '', fileSize: '',
    tags: ['Travel', 'Cinematic', 'Documentary'],
    date: '2025', featured: false,
  },
  {
    id: 'v8', category: 'video', subcategory: 'Travel',
    title: 'Ahmedabad', client: 'P2V Labs',
    description: 'A vertical portrait of Ahmedabad — the old city, the new energy, and everything in between.',
    videoUrl:     SB_PUBLIC('reel/videos/ahmedabad.mp4'),
    thumbnailUrl: SB_PUBLIC('reel/thumbnails/ahmedabad.png'),
    orientation: 'portrait', duration: '', fileSize: '',
    tags: ['Travel', 'Ahmedabad', 'Vertical'],
    date: '2025', featured: false,
  },
]

export const PHOTO_ITEMS = [
  /* Food & Restaurant */
  { id: 'p1', category: 'photo', subcategory: 'Food & Restaurant', title: 'Amber Sparkler', client: 'P2V Labs',
    description: 'Cranberry Red Bull over ice — the deep amber pour, the fizz, the bokeh of string lights at dusk. A drink that looks as good as it hits.',
    imageUrl: SB_PUBLIC('reel/photos/food/bombers.jpg'), aspectRatio: '3/2',
    tags: ['Food', 'Drinks', 'Night'], date: '2025', featured: true },
  { id: 'p2', category: 'photo', subcategory: 'Food & Restaurant', title: 'Cheesecake', client: 'P2V Labs',
    description: 'Clean, creamy, precise. A dessert shot that leads with texture and ends with craving.',
    imageUrl: SB_PUBLIC('reel/photos/food/cheesecake.jpg'), aspectRatio: '3/2',
    tags: ['Food', 'Dessert', 'Clean'], date: '2025', featured: false },
  { id: 'p3', category: 'photo', subcategory: 'Food & Restaurant', title: 'Honey Chilly Potato', client: 'P2V Labs',
    description: 'The contrast of sweet and heat — crisp edges, glistening glaze, warm tones.',
    imageUrl: SB_PUBLIC('reel/photos/food/honey-chilly-potato.jpg'), aspectRatio: '3/2',
    tags: ['Food', 'Street', 'Warm'], date: '2025', featured: false },
  { id: 'p4', category: 'photo', subcategory: 'Food & Restaurant', title: 'The Monster', client: 'P2V Labs',
    description: 'Size, colour, chaos — everything a food frame should own. Shot to make you hungry immediately.',
    imageUrl: SB_PUBLIC('reel/photos/food/monster.jpg'), aspectRatio: '3/2',
    tags: ['Food', 'Bold', 'Commercial'], date: '2025', featured: false },
  { id: 'p5', category: 'photo', subcategory: 'Food & Restaurant', title: 'Oreo Shake', client: 'P2V Labs',
    description: 'Monochrome layers, whipped cream, crushed cookies — a dessert drink done editorially.',
    imageUrl: SB_PUBLIC('reel/photos/food/oreo-shake.jpg'), aspectRatio: '1080/735',
    tags: ['Food', 'Drinks', 'Editorial'], date: '2025', featured: false },
  { id: 'p6', category: 'photo', subcategory: 'Food & Restaurant', title: 'Pizza', client: 'P2V Labs',
    description: 'A classic done right — cheese pull, perfect crust, natural light. Shot for appetite.',
    imageUrl: SB_PUBLIC('reel/photos/food/pizza.jpg'), aspectRatio: '1080/722',
    tags: ['Food', 'Classic', 'Natural Light'], date: '2025', featured: false },
  /* Photography */
  { id: 'p7', category: 'photo', subcategory: 'Photography', title: 'Ants', client: 'P2V Labs',
    description: 'Macro photography revealing the hidden architecture of the natural world — patience, precision, perspective.',
    imageUrl: SB_PUBLIC('reel/photos/ants.jpg'), aspectRatio: '1440/1180',
    tags: ['Macro', 'Nature', 'Detail'], date: '2025', featured: false },
  { id: 'p8', category: 'photo', subcategory: 'Photography', title: 'Golden Hour Couple', client: 'P2V Labs',
    description: 'Soft light, warm tones, two people — a portrait session that captures feeling over pose.',
    imageUrl: SB_PUBLIC('reel/photos/golden-hour-couple.jpg'), aspectRatio: '4/5',
    tags: ['Portrait', 'Golden Hour', 'Couple'], date: '2025', featured: true },
  { id: 'p9', category: 'photo', subcategory: 'Photography', title: 'Honey Bee', client: 'P2V Labs',
    description: 'Macro in motion — a single frame capturing the precision and purpose of a honey bee mid-flight.',
    imageUrl: SB_PUBLIC('reel/photos/honey-bee.jpg'), aspectRatio: '1080/812',
    tags: ['Macro', 'Nature', 'Wildlife'], date: '2025', featured: false },
  { id: 'p10', category: 'photo', subcategory: 'Photography', title: 'Man with Fire', client: 'P2V Labs',
    description: 'Drama, contrast, intention — a portrait that uses fire to say everything light cannot.',
    imageUrl: SB_PUBLIC('reel/photos/man-with-fire.jpg'), aspectRatio: '4/5',
    tags: ['Portrait', 'Dramatic', 'Fire'], date: '2025', featured: false },
]

export const REEL_ITEMS = [...VIDEO_ITEMS, ...PHOTO_ITEMS]

export const categoryBg = {
  'video':             '#E0DCDA',
  'photo':             '#DCE8E2',
  'Food & Restaurant': '#EDE4D8',
  'Photography':       '#DCE8E2',
  'Brand Reel':        '#E0DCDA',
  'Product':           '#E4E0DC',
  'Social Media':      '#E4DDD9',
  'Portrait':          '#E8E4E0',
  'Influencer Work':   '#E4DDE4',
}
