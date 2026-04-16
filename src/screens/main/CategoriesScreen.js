import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';

const { width } = Dimensions.get('window');
const H_PAD = Spacing.screenPaddingHorizontal;
const GAP = 10;
const THIRD_W = (width - H_PAD * 2 - GAP * 2) / 3;
const CARD_H = 130; // uniform height for every tile

// ─── Image pool ───────────────────────────────────────────────────────────────
// Curated Unsplash fashion/beauty photos shared across categories
const I = {
  // Clothing — tops
  tops:        'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=400&q=75',
  tshirt:      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=75',
  tank:        'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=400&q=75',
  blouse:      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&q=75',
  bodysuit:    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=75',
  knitwear:    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=75',
  hoodie:      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=75',
  // Clothing — bottoms
  jeans:       'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=75',
  trousers:    'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=400&q=75',
  leggings:    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=75',
  skirt:       'https://images.unsplash.com/photo-1583496661160-fb5974ca8bdb?w=400&q=75',
  shorts:      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=75',
  // Clothing — dresses
  dressGeneral:'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&q=75',
  dressMini:   'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=75',
  dressMidi:   'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400&q=75',
  dressMaxi:   'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=75',
  dressFormal: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=75',
  dressParty:  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=75',
  dressCasual: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&q=75',
  // Clothing — outerwear
  jacket:      'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=400&q=75',
  coat:        'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=400&q=75',
  blazer:      'https://images.unsplash.com/photo-1594938298603-c8148c4b4bfe?w=400&q=75',
  trench:      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=75',
  puffer:      'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=400&q=75',
  coords:      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=75',
  denim:       'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=400&q=75',
  // Shoes
  heels:       'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=75',
  flats:       'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&q=75',
  sneakers:    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=75',
  boots:       'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&q=75',
  sandals:     'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&q=75',
  loafers:     'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&q=75',
  sportShoes:  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=75',
  // Beauty
  makeupAll:   'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=75',
  foundation:  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=75',
  lipstick:    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=75',
  eyeshadow:   'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=75',
  blush:       'https://images.unsplash.com/photo-1598452963314-b09f397a5c48?w=400&q=75',
  skincare:    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=75',
  serum:       'https://images.unsplash.com/photo-1617897903246-719242758050?w=400&q=75',
  sunscreen:   'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=75',
  facemask:    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=75',
  haircare:    'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&q=75',
  perfume:     'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=75',
  beautyTools: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&q=75',
  hairTools:   'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=75',
  // Bags
  handbag:     'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=75',
  tote:        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=75',
  crossbody:   'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&q=75',
  clutch:      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&q=75',
  backpack:    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=75',
  sunglasses:  'https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&q=75',
  belt:        'https://images.unsplash.com/photo-1624222247344-550fb2645519?w=400&q=75',
  hat:         'https://images.unsplash.com/photo-1533055640609-24b498dfd74c?w=400&q=75',
  scarf:       'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&q=75',
  hairAcc:     'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&q=75',
  phoneCase:   'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=75',
  // Jewellery
  necklace:    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=75',
  earrings:    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=75',
  ring:        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=75',
  bracelet:    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=75',
  luxJewel:    'https://images.unsplash.com/photo-1573408301185-9519f94815b1?w=400&q=75',
  // Activewear
  sportsBra:   'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=75',
  gymTop:      'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400&q=75',
  activeLegs:  'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=75',
  tracksuit:   'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=75',
  yoga:        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=75',
  runShoes:    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=75',
  // Lingerie / Swimwear / Lifestyle
  lingerie:    'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=400&q=75',
  swimwear:    'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=400&q=75',
  bikini:      'https://images.unsplash.com/photo-1570976447640-ac859083963f?w=400&q=75',
  coverup:     'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=75',
  modest:      'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=400&q=75',
  maternity:   'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=75',
  plusSize:    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=75',
  petite:      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=75',
  tall:        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=75',
  designer:    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=75',
  wellness:    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=75',
  candles:     'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=400&q=75',
  luggage:     'https://images.unsplash.com/photo-1553073520-80b5ad5ec870?w=400&q=75',
  yoga2:       'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=75',
  sale:        'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=75',
  newIn:       'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=75',
};

// ─── Tab strip ────────────────────────────────────────────────────────────────
const TOP_TABS = [
  { key: 'browse',    label: 'Browse' },
  { key: 'clothing',  label: 'Clothing' },
  { key: 'shoes',     label: 'Shoes' },
  { key: 'beauty',    label: 'Beauty' },
  { key: 'bags',      label: 'Bags' },
  { key: 'jewellery', label: 'Jewellery' },
  { key: 'active',    label: 'Active' },
  { key: 'more',      label: 'More' },
  { key: 'sale',      label: 'Sale' },
];

// ─── Browse — hero editorial pair ─────────────────────────────────────────────
const HERO_PAIR = [
  { id: 'new',  label: 'New In', eyebrow: 'JUST LANDED',   image: I.newIn },
  { id: 'sale', label: 'Sale',   eyebrow: 'UP TO 50% OFF', image: I.sale  },
];

// ─── Browse — main categories (6 tiles, 3-col) ────────────────────────────────
const MAIN_CATS = [
  { id: 'clothing',  name: 'Clothing',  image: I.dressCasual },
  { id: 'shoes',     name: 'Shoes',     image: I.heels       },
  { id: 'beauty',    name: 'Beauty',    image: I.makeupAll   },
  { id: 'bags',      name: 'Bags',      image: I.handbag     },
  { id: 'jewellery', name: 'Jewellery', image: I.bracelet    },
  { id: 'active',    name: 'Active',    image: I.yoga        },
];

// ─── Subcategory data per tab ─────────────────────────────────────────────────
const CATEGORY_DATA = {

  clothing: [
    {
      title: 'TOPS',
      items: [
        { id: 'tops',     name: 'All Tops',              image: I.tops      },
        { id: 'tshirts',  name: 'T-Shirts',              image: I.tshirt    },
        { id: 'tanks',    name: 'Tank Tops',             image: I.tank      },
        { id: 'blouses',  name: 'Blouses',               image: I.blouse    },
        { id: 'shirts',   name: 'Shirts',                image: I.tops      },
        { id: 'bodysuits',name: 'Bodysuits',             image: I.bodysuit  },
        { id: 'knitwear', name: 'Knitwear',              image: I.knitwear  },
        { id: 'hoodies',  name: 'Hoodies & Sweatshirts', image: I.hoodie    },
      ],
    },
    {
      title: 'BOTTOMS',
      items: [
        { id: 'jeans',    name: 'Jeans',                 image: I.jeans     },
        { id: 'trousers', name: 'Pants & Trousers',      image: I.trousers  },
        { id: 'leggings', name: 'Leggings',              image: I.leggings  },
        { id: 'skirts',   name: 'Skirts',                image: I.skirt     },
        { id: 'shorts',   name: 'Shorts',                image: I.shorts    },
      ],
    },
    {
      title: 'DRESSES',
      items: [
        { id: 'dresses',        name: 'All Dresses',    image: I.dressGeneral },
        { id: 'mini-dresses',   name: 'Mini Dresses',   image: I.dressMini    },
        { id: 'midi-dresses',   name: 'Midi Dresses',   image: I.dressMidi    },
        { id: 'maxi-dresses',   name: 'Maxi Dresses',   image: I.dressMaxi    },
        { id: 'formal-dresses', name: 'Formal Dresses', image: I.dressFormal  },
        { id: 'party-dresses',  name: 'Party Dresses',  image: I.dressParty   },
        { id: 'casual-dresses', name: 'Casual Dresses', image: I.dressCasual  },
      ],
    },
    {
      title: 'OUTERWEAR',
      items: [
        { id: 'jackets',        name: 'Jackets',        image: I.jacket  },
        { id: 'coats',          name: 'Coats',          image: I.coat    },
        { id: 'blazers',        name: 'Blazers',        image: I.blazer  },
        { id: 'trench-coats',   name: 'Trench Coats',   image: I.trench  },
        { id: 'puffer-jackets', name: 'Puffer Jackets', image: I.puffer  },
      ],
    },
    {
      title: 'SETS & DENIM',
      items: [
        { id: 'co-ords',       name: 'Co-ords & Sets',  image: I.coords },
        { id: 'denim-all',     name: 'All Denim',       image: I.denim  },
        { id: 'denim-jackets', name: 'Denim Jackets',   image: I.jacket },
        { id: 'denim-jeans',   name: 'Denim Jeans',     image: I.jeans  },
        { id: 'denim-skirts',  name: 'Denim Skirts',    image: I.skirt  },
      ],
    },
  ],

  shoes: [
    {
      title: 'HEELS & FLATS',
      items: [
        { id: 'heels',   name: 'Heels',   image: I.heels   },
        { id: 'flats',   name: 'Flats',   image: I.flats   },
        { id: 'sandals', name: 'Sandals', image: I.sandals },
        { id: 'slides',  name: 'Slides',  image: I.sandals },
        { id: 'loafers', name: 'Loafers', image: I.loafers },
        { id: 'slippers',name: 'Slippers',image: I.flats   },
      ],
    },
    {
      title: 'BOOTS',
      items: [
        { id: 'boots',      name: 'All Boots',        image: I.boots   },
        { id: 'ankle-boots',name: 'Ankle Boots',      image: I.boots   },
        { id: 'knee-boots', name: 'Knee-High Boots',  image: I.boots   },
        { id: 'otk-boots',  name: 'Over-the-Knee',    image: I.boots   },
      ],
    },
    {
      title: 'CASUAL & SPORT',
      items: [
        { id: 'sneakers',      name: 'Sneakers',       image: I.sneakers   },
        { id: 'sports-shoes',  name: 'Sports Shoes',   image: I.sportShoes },
        { id: 'designer-shoes',name: 'Designer Shoes', image: I.heels      },
      ],
    },
  ],

  beauty: [
    {
      title: 'MAKEUP',
      items: [
        { id: 'makeup',      name: 'All Makeup',   image: I.makeupAll  },
        { id: 'foundation',  name: 'Foundation',   image: I.foundation },
        { id: 'concealer',   name: 'Concealer',    image: I.foundation },
        { id: 'powder',      name: 'Powder',       image: I.blush      },
        { id: 'blush',       name: 'Blush',        image: I.blush      },
        { id: 'bronzer',     name: 'Bronzer',      image: I.blush      },
        { id: 'highlighter', name: 'Highlighter',  image: I.blush      },
        { id: 'eyeshadow',   name: 'Eyeshadow',    image: I.eyeshadow  },
        { id: 'eyeliner',    name: 'Eyeliner',     image: I.eyeshadow  },
        { id: 'mascara',     name: 'Mascara',      image: I.eyeshadow  },
        { id: 'lipstick',    name: 'Lipstick',     image: I.lipstick   },
        { id: 'lip-gloss',   name: 'Lip Gloss',    image: I.lipstick   },
      ],
    },
    {
      title: 'SKINCARE',
      items: [
        { id: 'skincare',     name: 'All Skincare',  image: I.skincare  },
        { id: 'cleansers',    name: 'Cleansers',     image: I.skincare  },
        { id: 'moisturizers', name: 'Moisturizers',  image: I.skincare  },
        { id: 'serums',       name: 'Serums',        image: I.serum     },
        { id: 'sunscreen',    name: 'Sunscreen',     image: I.sunscreen },
        { id: 'face-masks',   name: 'Face Masks',    image: I.facemask  },
        { id: 'toners',       name: 'Toners',        image: I.skincare  },
      ],
    },
    {
      title: 'HAIRCARE',
      items: [
        { id: 'haircare',       name: 'All Haircare',      image: I.haircare  },
        { id: 'shampoo',        name: 'Shampoo',           image: I.haircare  },
        { id: 'conditioner',    name: 'Conditioner',       image: I.haircare  },
        { id: 'hair-treatments',name: 'Hair Treatments',   image: I.haircare  },
        { id: 'styling',        name: 'Styling Products',  image: I.hairTools },
      ],
    },
    {
      title: 'FRAGRANCE & TOOLS',
      items: [
        { id: 'perfume',      name: 'Perfume',      image: I.perfume     },
        { id: 'body-mist',    name: 'Body Mist',    image: I.perfume     },
        { id: 'brushes',      name: 'Brushes',      image: I.beautyTools },
        { id: 'sponges',      name: 'Sponges',      image: I.beautyTools },
        { id: 'hair-tools',   name: 'Hair Tools',   image: I.hairTools   },
      ],
    },
  ],

  bags: [
    {
      title: 'BAGS',
      items: [
        { id: 'bags',        name: 'All Bags',       image: I.handbag  },
        { id: 'handbags',    name: 'Handbags',       image: I.handbag  },
        { id: 'tote-bags',   name: 'Tote Bags',      image: I.tote     },
        { id: 'crossbody',   name: 'Crossbody Bags', image: I.crossbody},
        { id: 'clutches',    name: 'Clutches',       image: I.clutch   },
        { id: 'backpacks',   name: 'Backpacks',      image: I.backpack },
      ],
    },
    {
      title: 'ACCESSORIES',
      items: [
        { id: 'sunglasses',      name: 'Sunglasses',      image: I.sunglasses },
        { id: 'belts',           name: 'Belts',           image: I.belt       },
        { id: 'hats',            name: 'Hats & Caps',     image: I.hat        },
        { id: 'scarves',         name: 'Scarves',         image: I.scarf      },
        { id: 'hair-accessories',name: 'Hair Accessories',image: I.hairAcc    },
        { id: 'phone-cases',     name: 'Phone Cases',     image: I.phoneCase  },
        { id: 'airpods-cases',   name: 'AirPods Cases',   image: I.phoneCase  },
      ],
    },
  ],

  jewellery: [
    {
      title: 'JEWELLERY',
      items: [
        { id: 'jewellery',       name: 'All Jewellery',  image: I.bracelet  },
        { id: 'necklaces',       name: 'Necklaces',      image: I.necklace  },
        { id: 'earrings',        name: 'Earrings',       image: I.earrings  },
        { id: 'rings',           name: 'Rings',          image: I.ring      },
        { id: 'bracelets',       name: 'Bracelets',      image: I.bracelet  },
        { id: 'anklets',         name: 'Anklets',        image: I.bracelet  },
        { id: 'luxury-jewellery',name: 'Luxury Jewellery',image: I.luxJewel },
        { id: 'fine-jewellery',  name: 'Fine Jewellery', image: I.luxJewel  },
      ],
    },
  ],

  active: [
    {
      title: 'ACTIVEWEAR',
      items: [
        { id: 'activewear',    name: 'All Activewear',   image: I.yoga       },
        { id: 'sports-bras',   name: 'Sports Bras',      image: I.sportsBra  },
        { id: 'gym-tops',      name: 'Gym Tops',         image: I.gymTop     },
        { id: 'active-leggings',name:'Leggings',         image: I.activeLegs },
        { id: 'active-shorts', name: 'Shorts',           image: I.shorts     },
        { id: 'tracksuits',    name: 'Tracksuits',       image: I.tracksuit  },
        { id: 'running-shoes', name: 'Running Shoes',    image: I.runShoes   },
        { id: 'yoga-wear',     name: 'Yoga Wear',        image: I.yoga       },
      ],
    },
  ],

  more: [
    {
      title: 'LINGERIE & SLEEPWEAR',
      items: [
        { id: 'lingerie',      name: 'All Lingerie',    image: I.lingerie },
        { id: 'bras',          name: 'Bras',            image: I.lingerie },
        { id: 'panties',       name: 'Panties',         image: I.lingerie },
        { id: 'lingerie-sets', name: 'Lingerie Sets',   image: I.lingerie },
        { id: 'shapewear',     name: 'Shapewear',       image: I.bodysuit },
        { id: 'sleepwear',     name: 'Sleepwear',       image: I.lingerie },
        { id: 'robes',         name: 'Robes',           image: I.lingerie },
      ],
    },
    {
      title: 'SWIMWEAR',
      items: [
        { id: 'swimwear',      name: 'All Swimwear',    image: I.swimwear },
        { id: 'bikinis',       name: 'Bikinis',         image: I.bikini   },
        { id: 'one-piece',     name: 'One-Piece Suits', image: I.swimwear },
        { id: 'cover-ups',     name: 'Cover-Ups',       image: I.coverup  },
        { id: 'beachwear',     name: 'Beachwear',       image: I.coverup  },
      ],
    },
    {
      title: 'MODEST WEAR',
      items: [
        { id: 'modest',         name: 'All Modest Wear',  image: I.modest       },
        { id: 'abayas',         name: 'Abayas',           image: I.modest       },
        { id: 'hijabs',         name: 'Hijabs',           image: I.modest       },
        { id: 'modest-dresses', name: 'Modest Dresses',   image: I.dressMaxi    },
        { id: 'long-skirts',    name: 'Long Skirts',      image: I.skirt        },
      ],
    },
    {
      title: 'MATERNITY',
      items: [
        { id: 'maternity',            name: 'All Maternity',       image: I.maternity },
        { id: 'maternity-dresses',    name: 'Maternity Dresses',   image: I.maternity },
        { id: 'maternity-tops',       name: 'Maternity Tops',      image: I.maternity },
        { id: 'maternity-activewear', name: 'Maternity Activewear',image: I.maternity },
      ],
    },
    {
      title: 'SIZE & FIT',
      items: [
        { id: 'plus-size', name: 'Plus Size', image: I.plusSize },
        { id: 'petite',    name: 'Petite',    image: I.petite   },
        { id: 'tall',      name: 'Tall',      image: I.tall     },
      ],
    },
    {
      title: 'DESIGNER & LUXURY',
      items: [
        { id: 'designers',         name: 'All Luxury',         image: I.designer   },
        { id: 'designer-clothing', name: 'Designer Clothing',  image: I.dressFormal},
        { id: 'designer-bags',     name: 'Designer Bags',      image: I.handbag    },
        { id: 'luxury-shoes',      name: 'Luxury Shoes',       image: I.heels      },
        { id: 'high-end-jewellery',name: 'High-End Jewellery', image: I.luxJewel   },
        { id: 'limited-editions',  name: 'Limited Editions',   image: I.designer   },
      ],
    },
    {
      title: 'LIFESTYLE & WELLNESS',
      items: [
        { id: 'wellness',      name: 'Wellness',       image: I.wellness },
        { id: 'vitamins',      name: 'Vitamins',       image: I.wellness },
        { id: 'supplements',   name: 'Supplements',    image: I.wellness },
        { id: 'self-care',     name: 'Self-Care',      image: I.facemask },
        { id: 'decor',         name: 'Decor',          image: I.candles  },
        { id: 'bedding',       name: 'Bedding',        image: I.candles  },
        { id: 'candles',       name: 'Candles',        image: I.candles  },
        { id: 'yoga-mats',     name: 'Yoga Mats',      image: I.yoga2    },
        { id: 'dumbbells',     name: 'Dumbbells',      image: I.yoga2    },
        { id: 'equipment',     name: 'Equipment',      image: I.yoga2    },
        { id: 'luggage',       name: 'Luggage',        image: I.luggage  },
        { id: 'travel-bags',   name: 'Travel Bags',    image: I.luggage  },
        { id: 'feminine-care', name: 'Feminine Care',  image: I.skincare },
        { id: 'hygiene',       name: 'Hygiene',        image: I.skincare },
      ],
    },
  ],

  sale: [
    {
      title: 'SALE',
      items: [
        { id: 'sale',             name: 'All Sale',         image: I.sale        },
        { id: 'sale-clothing',    name: 'Sale Clothing',    image: I.dressCasual },
        { id: 'sale-shoes',       name: 'Sale Shoes',       image: I.heels       },
        { id: 'sale-beauty',      name: 'Sale Beauty',      image: I.makeupAll   },
        { id: 'sale-bags',        name: 'Sale Bags',        image: I.handbag     },
        { id: 'sale-accessories', name: 'Sale Accessories', image: I.sunglasses  },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SHARED CARD COMPONENT
// One style. Used for every tile on every tab.
// ─────────────────────────────────────────────────────────────────────────────
const CategoryTile = ({ item, width: tileW, onPress }) => (
  <TouchableOpacity
    style={[S.tile, { width: tileW }]}
    onPress={() => onPress(item.id, item.name || item.label)}
    activeOpacity={0.87}
  >
    <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} resizeMode="cover" />
    {/* Dark overlay — identical across all tiles */}
    <View style={S.tileOverlay} />
    {/* Text label */}
    <View style={S.tileLabel}>
      {(item.eyebrow) && <Text style={S.tileEyebrow}>{item.eyebrow}</Text>}
      <Text style={S.tileName} numberOfLines={2}>{item.name || item.label}</Text>
    </View>
  </TouchableOpacity>
);

// ─── 3-column grid — wraps CategoryTile in rows of 3 ─────────────────────────
const TileGrid = ({ items, onPress, columns = 3 }) => {
  const gap = GAP;
  const tileW = columns === 3 ? THIRD_W : (width - H_PAD * 2 - gap) / 2;
  const rows = [];
  for (let i = 0; i < items.length; i += columns) {
    rows.push(items.slice(i, i + columns));
  }
  return (
    <View style={[S.tileGridWrap, { gap }]}>
      {rows.map((row, ri) => (
        <View key={ri} style={[S.tileGridRow, { gap }]}>
          {row.map(item => (
            <CategoryTile key={item.id} item={item} width={tileW} onPress={onPress} />
          ))}
          {/* fill empty cells in last row */}
          {row.length < columns &&
            Array(columns - row.length).fill(0).map((_, k) => (
              <View key={`fill-${k}`} style={{ width: tileW }} />
            ))}
        </View>
      ))}
    </View>
  );
};

// ─── Section label ────────────────────────────────────────────────────────────
const SectionLabel = ({ text }) => (
  <View style={S.sectionLabelRow}>
    <Text style={S.sectionLabelText}>{text}</Text>
    <View style={S.sectionLabelLine} />
  </View>
);

// ─────────────────────────────────────────────────────────────────────────────
// BROWSE VIEW
// ─────────────────────────────────────────────────────────────────────────────
const BrowseView = ({ onPress }) => (
  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

    {/* Editorial hero pair */}
    <View style={S.heroPairRow}>
      {HERO_PAIR.map(item => (
        <TouchableOpacity
          key={item.id}
          style={S.heroPairCard}
          onPress={() => onPress(item.id, item.label)}
          activeOpacity={0.9}
        >
          <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <View style={S.heroOverlay} />
          <View style={S.heroLabel}>
            <Text style={S.heroEyebrow}>{item.eyebrow}</Text>
            <Text style={S.heroName}>{item.label}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>

    {/* Main categories */}
    <SectionLabel text="SHOP BY CATEGORY" />
    <TileGrid items={MAIN_CATS} onPress={onPress} columns={3} />

    {/* Explore More — same tile grid, same style */}
    <SectionLabel text="EXPLORE MORE" />
    <TileGrid
      items={[
        { id: 'lingerie',  name: 'Lingerie & Sleepwear', image: I.lingerie  },
        { id: 'swimwear',  name: 'Swimwear',             image: I.swimwear  },
        { id: 'modest',    name: 'Modest Wear',          image: I.modest    },
        { id: 'maternity', name: 'Maternity',            image: I.maternity },
        { id: 'plus-size', name: 'Plus Size',            image: I.plusSize  },
        { id: 'petite',    name: 'Petite',               image: I.petite    },
        { id: 'tall',      name: 'Tall',                 image: I.tall      },
        { id: 'designers', name: 'Designer & Luxury',    image: I.designer  },
        { id: 'lifestyle', name: 'Lifestyle & Wellness', image: I.wellness  },
      ]}
      onPress={onPress}
      columns={3}
    />

  </ScrollView>
);

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY DETAIL VIEW
// Each tab other than Browse renders a hero + grouped tile grids
// ─────────────────────────────────────────────────────────────────────────────
const CategoryDetail = ({ tabKey, onPress }) => {
  const groups = CATEGORY_DATA[tabKey];
  if (!groups) return null;

  // Hero image = first item of first group
  const heroImage = groups[0]?.items[0]?.image || I.dressCasual;
  const heroLabel = TOP_TABS.find(t => t.key === tabKey)?.label || '';

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

      {/* Category hero banner */}
      <TouchableOpacity
        style={S.detailHero}
        onPress={() => onPress(tabKey, heroLabel)}
        activeOpacity={0.9}
      >
        <Image source={{ uri: heroImage }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        <View style={S.heroOverlay} />
        <View style={S.heroLabel}>
          <Text style={S.heroEyebrow}>BROWSE ALL</Text>
          <Text style={S.heroName}>{heroLabel}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 }}>
            <Text style={{ color: Colors.white, fontSize: 10, letterSpacing: 1.5 }}>Shop Now</Text>
            <Feather name="arrow-right" size={11} color={Colors.white} />
          </View>
        </View>
      </TouchableOpacity>

      {/* Subcategory tile groups — same card style as Browse */}
      {groups.map((group, gi) => (
        <View key={gi}>
          <SectionLabel text={group.title} />
          <TileGrid items={group.items} onPress={onPress} columns={3} />
        </View>
      ))}

    </ScrollView>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
const CategoriesScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('browse');
  const tabScrollRef = useRef(null);

  const nav = (id, name) =>
    navigation.navigate('CategoryLanding', { categoryId: id, categoryName: name });

  return (
    <View style={S.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* ── Sticky header + tab strip ── */}
      <View style={[S.header, { paddingTop: insets.top }]}>
        <View style={S.headerInner}>
          <Text style={S.headerTitle}>Shop</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Search')}
            style={S.searchBtn}
            activeOpacity={0.7}
          >
            <Feather name="search" size={19} color={Colors.black} />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={tabScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={S.tabStrip}
          bounces={false}
        >
          {TOP_TABS.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={S.tabItem}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[S.tabLabel, activeTab === tab.key && S.tabLabelActive]}>
                {tab.label}
              </Text>
              {activeTab === tab.key && <View style={S.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Content ── */}
      {activeTab === 'browse'
        ? <BrowseView onPress={nav} />
        : <CategoryDetail tabKey={activeTab} onPress={nav} />
      }
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  // ── Header
  header: {
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  headerInner: {
    height: 52,
    paddingHorizontal: H_PAD,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: '400',
    color: Colors.black,
    letterSpacing: 0.3,
  },
  searchBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Tab strip
  tabStrip: {
    paddingHorizontal: H_PAD,
    gap: 26,
    paddingBottom: 0,
  },
  tabItem: {
    paddingBottom: 11,
    position: 'relative',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12.5,
    fontWeight: '400',
    color: Colors.grey400,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: Colors.black,
    fontWeight: '600',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: -2,
    right: -2,
    height: 2,
    backgroundColor: Colors.black,
    borderRadius: 1,
  },

  // ── Section label
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: H_PAD,
    marginTop: 22,
    marginBottom: 12,
    gap: 12,
  },
  sectionLabelText: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.grey400,
    letterSpacing: 2.5,
  },
  sectionLabelLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: Colors.grey200,
  },

  // ──────────────────────────────────────────────────
  // UNIVERSAL TILE — the one card style used everywhere
  // ──────────────────────────────────────────────────
  tile: {
    height: CARD_H,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors.grey200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 5,
    elevation: 2,
  },
  tileOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.34)',
  },
  tileLabel: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 8,
  },
  tileEyebrow: {
    color: Colors.gold,
    fontSize: 7,
    letterSpacing: 2,
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  tileName: {
    color: Colors.white,
    fontFamily: 'Georgia',
    fontSize: 11.5,
    fontWeight: '400',
    lineHeight: 15,
    letterSpacing: 0.1,
  },

  // ── Tile grid layout
  tileGridWrap: {
    paddingHorizontal: H_PAD,
  },
  tileGridRow: {
    flexDirection: 'row',
  },

  // ── Hero editorial pair (Browse top)
  heroPairRow: {
    flexDirection: 'row',
    paddingHorizontal: H_PAD,
    paddingTop: 14,
    gap: GAP,
  },
  heroPairCard: {
    flex: 1,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.30)',
  },
  heroLabel: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  heroEyebrow: {
    color: Colors.gold,
    fontSize: 7,
    letterSpacing: 2.2,
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  heroName: {
    color: Colors.white,
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: '400',
    letterSpacing: 0.3,
  },

  // ── Category detail hero
  detailHero: {
    height: 200,
    marginHorizontal: H_PAD,
    marginTop: 14,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default CategoriesScreen;
