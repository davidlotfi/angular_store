import {Injectable, computed, signal} from '@angular/core';

export type ProductCategory = 'Lighting' | 'Acoustics' | 'Desk Hardware' | 'Vessels';
export type PurchaseCadence = 'one-time' | 'subscription' | 'b2b-pack';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  subtitle: string;
  description: string;
  retailPrice: number;
  tradePrice: number;
  subscriptionDiscountPct: number;
  stockCount: number;
  leadTime: string;
  dimensions: string;
  weight: string;
  materials: string;
  origin: string;
  finishes: string[];
  featuredTag: string;
  imageUrl: string;
}

export interface CartItem {
  id: string;
  product: Product;
  finish: string;
  cadence: PurchaseCadence;
  quantity: number;
  unitPrice: number;
}

export type OrderStatus = 'Processing' | 'Fulfilled' | 'Net-30 Pending';

export interface Order {
  id: string;
  customerName: string;
  organization: string;
  email: string;
  channel: 'D2C Storefront' | 'B2B Trade Portal' | 'Recurring Subscription';
  paymentMethod: 'Corporate Net-30' | 'Card Ending 4819' | 'Cash on Delivery';
  createdAt: string;
  itemsCount: number;
  totalAmount: number;
  status: OrderStatus;
  shippingCity: string;
  lineSummary: string;
}

export interface SaasTier {
  id: string;
  name: string;
  audience: string;
  monthlyPrice: number;
  annualPricePerMonth: number;
  platformFeePct: string;
  skuLimit: string;
  b2bPortalIncluded: string;
  subscriptionEngine: string;
  warehouseNodes: string;
  slaGuarantee: string;
  recommended?: boolean;
}

function createStudioSvgDataUri(svgContent: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
}

const HERO_LIGHTING_SVG = createStudioSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <defs>
    <linearGradient id="wall" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#EDE8DF"/>
      <stop offset="55%" stop-color="#DFD7CA"/>
      <stop offset="100%" stop-color="#C8BDSL"/>
    </linearGradient>
    <radialGradient id="warmGlow" cx="52%" cy="38%" r="46%">
      <stop offset="0%" stop-color="#FFF7E8" stop-opacity="0.95"/>
      <stop offset="40%" stop-color="#F6D59E" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#DFD7CA" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="brassStem" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#8A6B3E"/>
      <stop offset="35%" stop-color="#D4B475"/>
      <stop offset="65%" stop-color="#F1DCAC"/>
      <stop offset="100%" stop-color="#6F532B"/>
    </linearGradient>
    <linearGradient id="alabasterDome" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFDF9"/>
      <stop offset="65%" stop-color="#F3E6CE"/>
      <stop offset="100%" stop-color="#D9C3A0"/>
    </linearGradient>
    <linearGradient id="travertine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#D6CEC2"/>
      <stop offset="50%" stop-color="#E7E0D6"/>
      <stop offset="100%" stop-color="#BFB5A6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="#E5DEC9"/>
  <polygon points="0,0 1200,0 1200,510 0,510" fill="#EAE3D7"/>
  <polygon points="0,510 1200,510 1200,675 0,675" fill="#D5CCB9"/>
  <polygon points="730,0 1200,0 1200,510 520,510" fill="#DFD6C7" opacity="0.65"/>
  <circle cx="620" cy="260" r="320" fill="url(#warmGlow)"/>
  <!-- Travertine architectural plinth -->
  <rect x="390" y="455" width="460" height="110" rx="4" fill="url(#travertine)" stroke="#B7AA98" stroke-width="1.5"/>
  <line x1="415" y1="485" x2="540" y2="485" stroke="#B7AA98" stroke-width="1.5" opacity="0.6"/>
  <line x1="640" y1="520" x2="810" y2="520" stroke="#B7AA98" stroke-width="1.5" opacity="0.5"/>
  <!-- Shadow under lamp base -->
  <ellipse cx="620" cy="455" rx="115" ry="14" fill="#7D7263" opacity="0.35"/>
  <!-- Lamp heavy monolithic base -->
  <rect x="562" y="310" width="116" height="145" rx="8" fill="url(#brassStem)"/>
  <!-- Brass collar -->
  <rect x="596" y="250" width="48" height="65" fill="url(#brassStem)"/>
  <!-- Sculptural Alabaster Shade -->
  <path d="M430,265 C430,135 810,135 810,265 Z" fill="url(#alabasterDome)" stroke="#DFC9A6" stroke-width="1.5"/>
  <ellipse cx="620" cy="265" rx="190" ry="22" fill="#E6CFA8"/>
  <!-- Top brass finial -->
  <circle cx="620" cy="158" r="12" fill="url(#brassStem)"/>
</svg>
`);

const PRODUCT_LAMP_SVG = createStudioSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <radialGradient id="glow1" cx="50%" cy="40%" r="45%">
      <stop offset="0%" stop-color="#FFF5E0" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#EFECE6" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bronze" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#3E3227"/>
      <stop offset="45%" stop-color="#75604B"/>
      <stop offset="75%" stop-color="#584736"/>
      <stop offset="100%" stop-color="#2B221A"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="#F2EFE9"/>
  <rect y="440" width="800" height="160" fill="#E4DECFE"/>
  <line x1="0" y1="440" x2="800" y2="440" stroke="#D4CCC0" stroke-width="1.5"/>
  <circle cx="400" cy="240" r="220" fill="url(#glow1)"/>
  <ellipse cx="400" cy="465" rx="95" ry="14" fill="#ABA193" opacity="0.45"/>
  <rect x="352" y="260" width="96" height="205" rx="6" fill="url(#bronze)"/>
  <rect x="260" y="165" width="280" height="68" rx="34" fill="url(#bronze)"/>
  <rect x="275" y="226" width="250" height="10" rx="5" fill="#FFF7E4"/>
</svg>
`);

const PRODUCT_SPEAKER_SVG = createStudioSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="alu" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E2E0DC"/>
      <stop offset="50%" stop-color="#C8C4BC"/>
      <stop offset="100%" stop-color="#9E9990"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="#F0EDE6"/>
  <rect y="450" width="800" height="150" fill="#E2DDD2"/>
  <ellipse cx="400" cy="472" rx="130" ry="15" fill="#9E9689" opacity="0.4"/>
  <!-- Milled Aluminum Enclosure -->
  <rect x="270" y="120" width="260" height="348" rx="18" fill="url(#alu)" stroke="#B5B0A6" stroke-width="2"/>
  <rect x="288" y="138" width="224" height="312" rx="12" fill="#2A2826"/>
  <!-- Precision Acoustic Waveguide & Woofer -->
  <circle cx="400" cy="215" r="46" fill="#1C1A18" stroke="#8C734B" stroke-width="2.5"/>
  <circle cx="400" cy="215" r="16" fill="#C5A368"/>
  <circle cx="400" cy="355" r="74" fill="#181615" stroke="#47433E" stroke-width="3"/>
  <circle cx="400" cy="355" r="32" fill="#292623"/>
</svg>
`);

const PRODUCT_VESSEL_SVG = createStudioSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="stoneware" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#2D2B29"/>
      <stop offset="40%" stop-color="#474440"/>
      <stop offset="100%" stop-color="#1A1918"/>
    </linearGradient>
    <linearGradient id="walnut" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#5B3E29"/>
      <stop offset="50%" stop-color="#7B563B"/>
      <stop offset="100%" stop-color="#422C1C"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="#F4F1EA"/>
  <rect y="445" width="800" height="155" fill="#E6E0D4"/>
  <!-- Walnut Architect Tray -->
  <rect x="210" y="432" width="380" height="28" rx="6" fill="url(#walnut)"/>
  <!-- Architectural Carafe -->
  <path d="M330,190 L450,190 L475,432 L305,432 Z" fill="url(#stoneware)"/>
  <!-- Pouring Collar in Brushed Brass -->
  <rect x="336" y="155" width="108" height="36" rx="4" fill="#C6A66B"/>
  <!-- Geometric Handle -->
  <path d="M450,225 L505,225 L505,365 L465,365" fill="none" stroke="#2D2B29" stroke-width="18" stroke-linecap="square"/>
</svg>
`);

const PRODUCT_KEYPAD_SVG = createStudioSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="chassis" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#33312E"/>
      <stop offset="100%" stop-color="#191816"/>
    </linearGradient>
    <linearGradient id="dialBrass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E6C98F"/>
      <stop offset="50%" stop-color="#B89352"/>
      <stop offset="100%" stop-color="#7D602B"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="#F1EEE7"/>
  <rect y="450" width="800" height="150" fill="#E3DDD1"/>
  <ellipse cx="400" cy="462" rx="170" ry="18" fill="#9E9587" opacity="0.38"/>
  <!-- CNC Machined Chassis -->
  <rect x="220" y="175" width="360" height="270" rx="16" fill="url(#chassis)" stroke="#57534E" stroke-width="2"/>
  <!-- Solid Brass Rotary Encoder Dial -->
  <circle cx="310" cy="255" r="46" fill="url(#dialBrass)"/>
  <circle cx="310" cy="255" r="36" fill="#C9A86A" stroke="#F4E0B5" stroke-width="1.5"/>
  <line x1="310" y1="222" x2="310" y2="238" stroke="#2A2419" stroke-width="3"/>
  <!-- Tactile Key Matrix -->
  <rect x="385" y="212" width="52" height="52" rx="6" fill="#292724" stroke="#44403C" stroke-width="1.5"/>
  <rect x="448" y="212" width="52" height="52" rx="6" fill="#292724" stroke="#44403C" stroke-width="1.5"/>
  <rect x="511" y="212" width="52" height="52" rx="6" fill="#B89352"/>
  <rect x="385" y="276" width="52" height="52" rx="6" fill="#292724" stroke="#44403C" stroke-width="1.5"/>
  <rect x="448" y="276" width="52" height="52" rx="6" fill="#292724" stroke="#44403C" stroke-width="1.5"/>
  <rect x="511" y="276" width="52" height="52" rx="6" fill="#292724" stroke="#44403C" stroke-width="1.5"/>
  <rect x="255" y="345" width="182" height="54" rx="6" fill="#292724" stroke="#44403C" stroke-width="1.5"/>
  <rect x="448" y="345" width="115" height="54" rx="6" fill="#3F3B36" stroke="#57534E" stroke-width="1.5"/>
</svg>
`);

const PRODUCT_PENDANT_SVG = createStudioSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="800" height="600" fill="#F3F0E8"/>
  <rect y="455" width="800" height="145" fill="#E5DFD3"/>
  <!-- Suspension cords -->
  <line x1="270" y1="0" x2="270" y2="270" stroke="#44403C" stroke-width="2.5"/>
  <line x1="530" y1="0" x2="530" y2="270" stroke="#44403C" stroke-width="2.5"/>
  <!-- Warm diffused glow -->
  <ellipse cx="400" cy="305" rx="230" ry="70" fill="#FDE6B8" opacity="0.65"/>
  <!-- Linear Architectural Brass Beam -->
  <rect x="170" y="265" width="460" height="28" rx="6" fill="#9E7E46"/>
  <rect x="185" y="291" width="430" height="8" rx="4" fill="#FFFDF7"/>
</svg>
`);

const PRODUCT_VALET_SVG = createStudioSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="800" height="600" fill="#F2EFE8"/>
  <rect y="435" width="800" height="165" fill="#E3DDD0"/>
  <!-- Travertine Desk Organizer Slab -->
  <rect x="190" y="275" width="420" height="145" rx="10" fill="#D8D0C3" stroke="#BDB2A2" stroke-width="2"/>
  <rect x="220" y="298" width="210" height="98" rx="8" fill="#C4B9A9"/>
  <circle cx="515" cy="347" r="48" fill="#B89352"/>
  <circle cx="515" cy="347" r="38" fill="#9B7A3E"/>
</svg>
`);

@Injectable({
  providedIn: 'root',
})
export class CommerceStore {
  readonly heroImageUrl = HERO_LIGHTING_SVG;

  readonly products = signal<Product[]>([
    {
      id: 'prod-01',
      sku: 'VL-101-BR',
      name: 'Atelier Alabaster Table Lamp',
      category: 'Lighting',
      subtitle: 'Hand-turned Spanish alabaster diffuser on solid milled brass column',
      description:
        'Engineered for warm 2700K architectural luminance with stepless rotary dimming. Each alabaster dome is carved from a single quarry block in Aragon, paired with an unlacquered solid brass base that develops a rich studio patina.',
      retailPrice: 680,
      tradePrice: 544,
      subscriptionDiscountPct: 15,
      stockCount: 18,
      leadTime: 'Ships within 24h',
      dimensions: '320mm Ø × 410mm H',
      weight: '6.4 kg',
      materials: 'Spanish Alabaster, C36000 Solid Brass',
      origin: 'Munich & Valencia',
      finishes: ['Brushed Brass', 'Anodized Bronze', 'Raw Nickel'],
      featuredTag: 'Signature Series',
      imageUrl: PRODUCT_LAMP_SVG,
    },
    {
      id: 'prod-02',
      sku: 'VL-204-AL',
      name: 'Monolith Nearfield Studio Monitor',
      category: 'Acoustics',
      subtitle: 'CNC-milled recycled aluminum enclosure with custom beryllium tweeter',
      description:
        'Precision acoustic reference monitor designed for architectural workspaces and mastering rooms. Features a rigid zero-resonance billet aluminum shell and integrated Class-D room-calibrated DSP amplification.',
      retailPrice: 1240,
      tradePrice: 992,
      subscriptionDiscountPct: 12,
      stockCount: 9,
      leadTime: 'Ships within 48h',
      dimensions: '190mm W × 285mm H × 220mm D',
      weight: '8.9 kg',
      materials: '6061-T6 Billet Aluminum, Merino Acoustic Felt',
      origin: 'Munich Facility',
      finishes: ['Raw Bead-Blasted Aluminum', 'Obsidian Anodized', 'Warm Titanium'],
      featuredTag: 'Limited Run',
      imageUrl: PRODUCT_SPEAKER_SVG,
    },
    {
      id: 'prod-03',
      sku: 'VL-309-KY',
      name: 'Tactile Rotary Studio Console',
      category: 'Desk Hardware',
      subtitle: 'Weighted brass magnetic encoder dial and hot-swappable mechanical matrix',
      description:
        'Programmable hardware controller for CAD, color grading, and financial modeling workflows. Features a dual-bearing hall-effect rotary dial and gasket-mounted silent tactile switches in a solid dark bronze chassis.',
      retailPrice: 390,
      tradePrice: 312,
      subscriptionDiscountPct: 15,
      stockCount: 34,
      leadTime: 'Ships within 24h',
      dimensions: '165mm W × 135mm D × 34mm H',
      weight: '1.35 kg',
      materials: 'CNC Dark Bronze, Solid Brass Encoder',
      origin: 'Zurich & Munich',
      finishes: ['Obsidian & Brass', 'Stone Gray & Steel', 'Anodized Bronze'],
      featuredTag: 'In Stock',
      imageUrl: PRODUCT_KEYPAD_SVG,
    },
    {
      id: 'prod-04',
      sku: 'VL-412-ST',
      name: 'Basalt Pour-Over Vessel & Tray',
      category: 'Vessels',
      subtitle: 'High-fired matte black stoneware carafe with American black walnut plinth',
      description:
        'Thermal-retentive architectural vessel crafted for studio hospitality and executive boardrooms. Includes a removable laser-etched brass drip collar and oil-finished solid walnut serving base.',
      retailPrice: 240,
      tradePrice: 192,
      subscriptionDiscountPct: 18,
      stockCount: 42,
      leadTime: 'Ships within 24h',
      dimensions: '260mm W × 195mm H × 140mm D',
      weight: '1.8 kg',
      materials: 'Vitrified Basalt Stoneware, Black Walnut, Brass',
      origin: 'Kyoto & Munich',
      finishes: ['Matte Basalt & Walnut', 'Raw Clay & Oak'],
      featuredTag: 'Replenishable',
      imageUrl: PRODUCT_VESSEL_SVG,
    },
    {
      id: 'prod-05',
      sku: 'VL-118-LN',
      name: 'Cantilever Linear Suspension Bar',
      category: 'Lighting',
      subtitle: '1400mm extruded architectural brass pendant with uplight/downlight optics',
      description:
        'Designed for studio tables and architectural islands. Delivers CRI 97+ glare-free task illumination downward paired with an ambient ceiling wash controlled via gesture sensor or Matter smart-building bridge.',
      retailPrice: 890,
      tradePrice: 712,
      subscriptionDiscountPct: 15,
      stockCount: 7,
      leadTime: 'Built to order (3 days)',
      dimensions: '1400mm L × 42mm W × 55mm H',
      weight: '4.1 kg',
      materials: 'Extruded Architectural Brass, Optical Polycarbonate',
      origin: 'Munich Facility',
      finishes: ['Aged Brass', 'Anodized Bronze', 'Matte Graphite'],
      featuredTag: 'B2B Favorite',
      imageUrl: PRODUCT_PENDANT_SVG,
    },
    {
      id: 'prod-06',
      sku: 'VL-315-TV',
      name: 'Travertine & Brass Desk Valet',
      category: 'Desk Hardware',
      subtitle: 'Honed Roman travertine block with integrated Qi2 magnetic charging dish',
      description:
        'Carved from natural open-pore Roman travertine and fitted with a flush-mounted solid brass inductive charging puck. Organizes studio instruments, fountain pens, and mobile hardware without cable clutter.',
      retailPrice: 310,
      tradePrice: 248,
      subscriptionDiscountPct: 15,
      stockCount: 26,
      leadTime: 'Ships within 24h',
      dimensions: '280mm W × 160mm D × 28mm H',
      weight: '2.7 kg',
      materials: 'Honed Roman Travertine, Solid Brass',
      origin: 'Tivoli & Munich',
      finishes: ['Warm Travertine & Brass', 'Silver Travertine & Steel'],
      featuredTag: 'In Stock',
      imageUrl: PRODUCT_VALET_SVG,
    },
  ]);

  readonly cart = signal<CartItem[]>([
    {
      id: 'prod-01__Brushed Brass__one-time',
      product: {
        id: 'prod-01',
        sku: 'VL-101-BR',
        name: 'Atelier Alabaster Table Lamp',
        category: 'Lighting',
        subtitle: 'Hand-turned Spanish alabaster diffuser on solid milled brass column',
        description:
          'Engineered for warm 2700K architectural luminance with stepless rotary dimming.',
        retailPrice: 680,
        tradePrice: 544,
        subscriptionDiscountPct: 15,
        stockCount: 18,
        leadTime: 'Ships within 24h',
        dimensions: '320mm Ø × 410mm H',
        weight: '6.4 kg',
        materials: 'Spanish Alabaster, C36000 Solid Brass',
        origin: 'Munich & Valencia',
        finishes: ['Brushed Brass', 'Anodized Bronze', 'Raw Nickel'],
        featuredTag: 'Signature Series',
        imageUrl: PRODUCT_LAMP_SVG,
      },
      finish: 'Brushed Brass',
      cadence: 'one-time',
      quantity: 1,
      unitPrice: 680,
    },
  ]);

  readonly orders = signal<Order[]>([
    {
      id: 'VL-1048',
      customerName: 'Clara Lindqvist',
      organization: 'Nordic Spatial Architecture AB',
      email: 'c.lindqvist@nordicspatial.se',
      channel: 'B2B Trade Portal',
      paymentMethod: 'Corporate Net-30',
      createdAt: '2026-10-25 08:42',
      itemsCount: 6,
      totalAmount: 3840,
      status: 'Processing',
      shippingCity: 'Stockholm, SE',
      lineSummary: '4× Atelier Alabaster Lamp, 2× Cantilever Linear Bar',
    },
    {
      id: 'VL-1047',
      customerName: 'Marcus Vance',
      organization: 'Vance Mastering Studio',
      email: 'marcus@vancemastering.co.uk',
      channel: 'D2C Storefront',
      paymentMethod: 'Card Ending 4819',
      createdAt: '2026-10-25 06:15',
      itemsCount: 2,
      totalAmount: 1630,
      status: 'Fulfilled',
      shippingCity: 'London, UK',
      lineSummary: '1× Monolith Nearfield Monitor, 1× Tactile Rotary Console',
    },
    {
      id: 'VL-1046',
      customerName: 'Elena Rostova',
      organization: 'Studio Kengo Hospitality',
      email: 'procurement@studiokengo.ch',
      channel: 'Recurring Subscription',
      paymentMethod: 'Corporate Net-30',
      createdAt: '2026-10-24 17:30',
      itemsCount: 8,
      totalAmount: 1536,
      status: 'Net-30 Pending',
      shippingCity: 'Zurich, CH',
      lineSummary: '8× Basalt Pour-Over Vessel & Tray (Quarterly Care Plan)',
    },
    {
      id: 'VL-1045',
      customerName: 'Jonas Richter',
      organization: 'Richter Industrial Design',
      email: 'jonas@richter-id.de',
      channel: 'D2C Storefront',
      paymentMethod: 'Cash on Delivery',
      createdAt: '2026-10-24 14:12',
      itemsCount: 1,
      totalAmount: 390,
      status: 'Fulfilled',
      shippingCity: 'Munich, DE',
      lineSummary: '1× Tactile Rotary Studio Console',
    },
    {
      id: 'VL-1044',
      customerName: 'Sora Takahashi',
      organization: 'Aoyama Concept Gallery',
      email: 'takahashi@aoyamagallery.jp',
      channel: 'B2B Trade Portal',
      paymentMethod: 'Corporate Net-30',
      createdAt: '2026-10-23 22:05',
      itemsCount: 5,
      totalAmount: 2720,
      status: 'Fulfilled',
      shippingCity: 'Tokyo, JP',
      lineSummary: '5× Atelier Alabaster Table Lamp (Trade Pack)',
    },
  ]);

  readonly saasTiers: SaasTier[] = [
    {
      id: 'tier-studio',
      name: 'Studio Plan',
      audience: 'For early-stage teams & independent ateliers',
      monthlyPrice: 79,
      annualPricePerMonth: 64,
      platformFeePct: '1.2% + 20¢',
      skuLimit: 'Up to 250 active SKUs',
      b2bPortalIncluded: 'Standard Trade Discount Codes',
      subscriptionEngine: 'Automated Recurring Replenishment',
      warehouseNodes: '2 Global Fulfillment Nodes',
      slaGuarantee: '99.90% Uptime SLA',
    },
    {
      id: 'tier-atelier',
      name: 'Atelier Operations',
      audience: 'For scaling operations & hybrid D2C + B2B brands',
      monthlyPrice: 249,
      annualPricePerMonth: 199,
      platformFeePct: '0.5% + 10¢',
      skuLimit: 'Up to 5,000 active SKUs',
      b2bPortalIncluded: 'Net-30 Invoicing & Tiered Case Pricing',
      subscriptionEngine: 'Smart Churn Recovery & Swap Portal',
      warehouseNodes: '12 Multi-Region Warehouses',
      slaGuarantee: '99.98% Uptime SLA',
      recommended: true,
    },
    {
      id: 'tier-enterprise',
      name: 'Enterprise Commerce OS',
      audience: 'For multi-region architectural & retail groups',
      monthlyPrice: 690,
      annualPricePerMonth: 550,
      platformFeePct: '0.15% + 0¢',
      skuLimit: 'Unlimited SKUs & Custom Bundles',
      b2bPortalIncluded: 'ERP Sync, Custom Credit Limits & EDI',
      subscriptionEngine: 'Multi-Currency Usage & Contract Billing',
      warehouseNodes: 'Unlimited Custom 3PL & ERP Nodes',
      slaGuarantee: '99.995% Dedicated SLA',
    },
  ];

  readonly appliedPromo = signal<string>('');
  readonly promoDiscountPct = computed(() => {
    const code = this.appliedPromo().trim().toUpperCase();
    if (code === 'VELLUM15') return 15;
    if (code === 'TRADE20') return 20;
    return 0;
  });

  readonly cartCount = computed(() =>
    this.cart().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly cartSubtotal = computed(() =>
    this.cart().reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  );

  readonly discountAmount = computed(() =>
    Math.round((this.cartSubtotal() * this.promoDiscountPct()) / 100)
  );

  readonly freeShippingThreshold = 450;

  readonly shippingCost = computed(() => {
    const net = this.cartSubtotal() - this.discountAmount();
    if (net <= 0) return 0;
    return net >= this.freeShippingThreshold ? 0 : 28;
  });

  readonly cartTotal = computed(() => {
    const net = this.cartSubtotal() - this.discountAmount();
    return Math.max(0, net + this.shippingCost());
  });

  readonly totalGmv = computed(() =>
    this.orders().reduce((sum, o) => sum + o.totalAmount, 0) + 142800
  );

  readonly activeMrr = computed(() => {
    const subOrders = this.orders()
      .filter((o) => o.channel === 'Recurring Subscription')
      .reduce((sum, o) => sum + o.totalAmount, 0);
    return 38400 + subOrders;
  });

  readonly lowStockCount = computed(
    () => this.products().filter((p) => p.stockCount <= 10).length
  );

  calculateUnitPrice(product: Product, cadence: PurchaseCadence, b2bMode: boolean): number {
    if (cadence === 'b2b-pack' || b2bMode) {
      return product.tradePrice;
    }
    if (cadence === 'subscription') {
      return Math.round(product.retailPrice * (1 - product.subscriptionDiscountPct / 100));
    }
    return product.retailPrice;
  }

  addToCart(
    product: Product,
    finish: string,
    cadence: PurchaseCadence,
    quantity: number,
    b2bMode: boolean
  ): void {
    const unitPrice = this.calculateUnitPrice(product, cadence, b2bMode);
    const itemId = `${product.id}__${finish}__${cadence}`;

    this.cart.update((items) => {
      const existingIndex = items.findIndex((i) => i.id === itemId);
      if (existingIndex > -1) {
        return items.map((item, idx) =>
          idx === existingIndex
            ? {...item, quantity: item.quantity + quantity, unitPrice}
            : item
        );
      }
      return [
        ...items,
        {
          id: itemId,
          product,
          finish,
          cadence,
          quantity,
          unitPrice,
        },
      ];
    });
  }

  updateCartQuantity(itemId: string, delta: number): void {
    this.cart.update((items) =>
      items
        .map((item) =>
          item.id === itemId ? {...item, quantity: item.quantity + delta} : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  removeCartItem(itemId: string): void {
    this.cart.update((items) => items.filter((item) => item.id !== itemId));
  }

  applyPromoCode(code: string): boolean {
    const clean = code.trim().toUpperCase();
    if (clean === 'VELLUM15' || clean === 'TRADE20') {
      this.appliedPromo.set(clean);
      return true;
    }
    return false;
  }

  clearPromoCode(): void {
    this.appliedPromo.set('');
  }

  submitOrder(payload: {
    customerName: string;
    organization: string;
    email: string;
    shippingCity: string;
    paymentMethod: 'Corporate Net-30' | 'Card Ending 4819' | 'Cash on Delivery';
    b2bMode: boolean;
  }): Order {
    const currentItems = this.cart();
    const total = this.cartTotal();
    const count = this.cartCount();
    const hasSub = currentItems.some((i) => i.cadence === 'subscription');
    const nextNum = 1049 + this.orders().length - 5;
    const orderId = `VL-${nextNum}`;

    const lineSummary = currentItems
      .map((i) => `${i.quantity}× ${i.product.name} (${i.finish})`)
      .join(', ');

    const newOrder: Order = {
      id: orderId,
      customerName: payload.customerName,
      organization: payload.organization || 'Private Studio Client',
      email: payload.email,
      channel: hasSub
        ? 'Recurring Subscription'
        : payload.b2bMode
          ? 'B2B Trade Portal'
          : 'D2C Storefront',
      paymentMethod: payload.paymentMethod,
      createdAt: '2026-10-25 09:30',
      itemsCount: count,
      totalAmount: total,
      status:
        payload.paymentMethod === 'Corporate Net-30' ? 'Net-30 Pending' : 'Processing',
      shippingCity: payload.shippingCity,
      lineSummary,
    };

    // Decrement stock for ordered items
    this.products.update((prods) =>
      prods.map((p) => {
        const orderedQty = currentItems
          .filter((i) => i.product.id === p.id)
          .reduce((s, i) => s + i.quantity, 0);
        if (orderedQty > 0) {
          return {...p, stockCount: Math.max(0, p.stockCount - orderedQty)};
        }
        return p;
      })
    );

    this.orders.update((existing) => [newOrder, ...existing]);
    this.cart.set([]);
    this.appliedPromo.set('');
    return newOrder;
  }

  advanceOrderStatus(orderId: string): void {
    this.orders.update((list) =>
      list.map((order) => {
        if (order.id !== orderId) return order;
        const nextStatus: OrderStatus =
          order.status === 'Net-30 Pending'
            ? 'Processing'
            : order.status === 'Processing'
              ? 'Fulfilled'
              : 'Fulfilled';
        return {...order, status: nextStatus};
      })
    );
  }

  adjustProductStock(productId: string, delta: number): void {
    this.products.update((list) =>
      list.map((p) =>
        p.id === productId ? {...p, stockCount: Math.max(0, p.stockCount + delta)} : p
      )
    );
  }

  createNewProduct(newProd: {
    name: string;
    sku: string;
    category: ProductCategory;
    subtitle: string;
    retailPrice: number;
    stockCount: number;
    materials: string;
  }): Product {
    const tradePrice = Math.round(newProd.retailPrice * 0.8);
    const created: Product = {
      id: `prod-0${this.products().length + 1}`,
      sku: newProd.sku.toUpperCase(),
      name: newProd.name,
      category: newProd.category,
      subtitle: newProd.subtitle,
      description: `${newProd.subtitle}. Crafted from ${newProd.materials} for architectural workspaces and direct-to-consumer or B2B trade fulfillment.`,
      retailPrice: newProd.retailPrice,
      tradePrice,
      subscriptionDiscountPct: 15,
      stockCount: newProd.stockCount,
      leadTime: 'Ships within 24h',
      dimensions: '240mm W × 180mm D × 120mm H',
      weight: '3.2 kg',
      materials: newProd.materials,
      origin: 'Munich Facility',
      finishes: ['Brushed Brass', 'Anodized Bronze', 'Matte Graphite'],
      featuredTag: 'New Release',
      imageUrl: PRODUCT_VALET_SVG,
    };
    this.products.update((list) => [created, ...list]);
    return created;
  }
}
