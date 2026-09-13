/**
 * Simplified GeoJSON representation of India's national boundary and major agricultural regions.
 * Coordinates are formatted as [longitude, latitude] in WGS 84 (EPSG:4326).
 */
export const INDIA_BOUNDARY_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'India National Boundary',
        type: 'Country',
        description: 'Republic of India - National Water Information System',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [74.8, 37.0],
            [77.0, 35.5],
            [78.8, 35.8],
            [79.5, 34.5],
            [78.5, 32.5],
            [80.0, 31.0],
            [81.0, 30.2],
            [88.0, 27.8],
            [89.0, 27.2],
            [92.0, 27.8],
            [94.5, 28.5],
            [97.0, 28.2],
            [97.4, 27.5],
            [95.5, 26.0],
            [93.5, 24.5],
            [92.5, 22.0],
            [89.0, 21.6],
            [87.0, 21.5],
            [85.0, 19.5],
            [82.5, 17.0],
            [80.3, 13.5],
            [79.8, 10.5],
            [77.5, 8.1],
            [76.5, 9.5],
            [74.8, 12.8],
            [73.5, 15.5],
            [72.8, 19.0],
            [72.6, 21.0],
            [69.0, 22.5],
            [68.2, 23.8],
            [70.5, 24.5],
            [71.0, 27.0],
            [72.0, 28.5],
            [74.0, 31.5],
            [74.8, 34.5],
            [74.8, 37.0],
          ],
        ],
      },
    },
    // Major agricultural zones and state anchors for quick click / visualization
    {
      type: 'Feature',
      properties: { name: 'Punjab & Haryana (Indo-Gangetic Breadbasket)', zone: 'North' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [74.5, 30.0],
            [77.5, 30.5],
            [77.2, 28.5],
            [74.8, 28.8],
            [74.5, 30.0],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Maharashtra & Marathwada (Deccan Plateau)', zone: 'West' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [73.5, 20.5],
            [79.5, 21.0],
            [78.8, 17.5],
            [74.0, 17.0],
            [73.5, 20.5],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Rajasthan (Thar & Western Arid Zone)', zone: 'North-West' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [70.0, 27.5],
            [75.5, 28.0],
            [75.0, 24.5],
            [71.0, 24.5],
            [70.0, 27.5],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Madhya Pradesh (Central Black Soil Belt)', zone: 'Central' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [75.0, 25.0],
            [81.5, 25.0],
            [81.0, 21.8],
            [75.5, 21.8],
            [75.0, 25.0],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Karnataka & Telangana (Krishna-Godavari Basin)', zone: 'South' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [75.0, 17.5],
            [80.0, 18.0],
            [79.0, 13.5],
            [75.5, 13.5],
            [75.0, 17.5],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Tamil Nadu (Cauvery Delta & Southern Basin)', zone: 'South' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [77.0, 13.0],
            [80.0, 13.0],
            [79.5, 9.5],
            [77.5, 8.5],
            [77.0, 13.0],
          ],
        ],
      },
    },
  ],
};

// Popular agricultural centers in India for 1-click test and quick selection
export const POPULAR_LOCATIONS = [
  { name: 'Ludhiana, Punjab', lat: 30.901, lon: 75.8573, note: 'Wheat & Rice Belt (Semi-Critical Aquifer)', tag: '🌾 Wheat/Rice' },
  { name: 'Nagpur, Maharashtra', lat: 21.1458, lon: 79.0882, note: 'Cotton & Citrus (Black Soil Zone)', tag: '☁️ Cotton/Citrus' },
  { name: 'Jaipur, Rajasthan', lat: 26.9124, lon: 75.7873, note: 'Arid Zone (High Groundwater Stress)', tag: '☀️ Arid/Mustard' },
  { name: 'Anantapur, Andhra Pradesh', lat: 14.6819, lon: 77.6006, note: 'Rayalaseema Groundnut & Millet Belt', tag: '🥜 Groundnut' },
  { name: 'Varanasi, Uttar Pradesh', lat: 25.3176, lon: 82.9739, note: 'Ganga Basin Alluvial Soils (Safe Zone)', tag: '🌊 Ganga Basin' },
  { name: 'Indore, Madhya Pradesh', lat: 22.7196, lon: 75.8577, note: 'Malwa Soybean & Wheat Plateau', tag: '🌱 Soybean' },
  { name: 'Thanjavur, Tamil Nadu', lat: 10.787, lon: 79.1378, note: 'Cauvery Delta (Intensive Rice Area)', tag: '🌾 Delta Rice' },
  { name: 'Nashik, Maharashtra', lat: 19.9975, lon: 73.7898, note: 'Onion, Grapes & Vegetable Corridor', tag: '🍇 Horticulture' },
  { name: 'Karnal, Haryana', lat: 29.6857, lon: 76.9905, note: 'Basmati Rice & Wheat Granary', tag: '🌾 Basmati' },
  { name: 'Rajkot, Gujarat', lat: 22.3039, lon: 70.8022, note: 'Saurashtra Groundnut & Cotton Zone', tag: '🥜 Saurashtra' },
  { name: 'Burdwan, West Bengal', lat: 23.2324, lon: 87.8615, note: 'Rice Bowl of Bengal (Alluvial Loam)', tag: '🍚 Bengal Rice' },
  { name: 'Patna, Bihar', lat: 25.5941, lon: 85.1376, note: 'Middle Ganga Plains (Maize & Pulses)', tag: '🌽 Maize/Pulses' },
];

export interface DistrictPreset {
  district: string;
  state: string;
  lat: number;
  lon: number;
  primaryCrop: string;
  description: string;
}

export const INDIAN_DISTRICTS_PRESETS: DistrictPreset[] = [
  // Punjab
  { district: 'Ludhiana', state: 'Punjab', lat: 30.9010, lon: 75.8573, primaryCrop: 'Wheat & Rice', description: 'Intensive irrigation, tubewell dependent' },
  { district: 'Amritsar', state: 'Punjab', lat: 31.6340, lon: 74.8723, primaryCrop: 'Wheat & Rice', description: 'Major agricultural trade center' },
  { district: 'Bathinda', state: 'Punjab', lat: 30.2110, lon: 74.9455, primaryCrop: 'Cotton & Wheat', description: 'Southwest cotton belt, brackish groundwater' },
  { district: 'Sangrur', state: 'Punjab', lat: 30.2458, lon: 75.8421, primaryCrop: 'Wheat & Paddy', description: 'Deep water table depletion zone' },

  // Haryana
  { district: 'Karnal', state: 'Haryana', lat: 29.6857, lon: 76.9905, primaryCrop: 'Basmati Rice & Wheat', description: 'NDRI & ICAR agricultural research hub' },
  { district: 'Sirsa', state: 'Haryana', lat: 29.5349, lon: 75.0296, primaryCrop: 'Cotton & Mustard', description: 'Arid climate, canal & tubewell irrigated' },
  { district: 'Kurukshetra', state: 'Haryana', lat: 29.9695, lon: 76.8783, primaryCrop: 'Paddy & Sugarcane', description: 'High groundwater extraction rate' },

  // Maharashtra
  { district: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lon: 79.0882, primaryCrop: 'Cotton, Soybean & Oranges', description: 'Vidarbha region, deep black clay soil' },
  { district: 'Nashik', state: 'Maharashtra', lat: 19.9975, lon: 73.7898, primaryCrop: 'Onion, Grapes & Tomatoes', description: 'Top horticulture cluster of India' },
  { district: 'Pune', state: 'Maharashtra', lat: 18.5204, lon: 73.8567, primaryCrop: 'Sugarcane & Vegetables', description: 'Western Ghats rain-shadow transition' },
  { district: 'Solapur', state: 'Maharashtra', lat: 17.6599, lon: 75.9064, primaryCrop: 'Pomegranate & Jowar', description: 'Dry zone, micro-irrigation pioneer' },
  { district: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', lat: 19.8762, lon: 75.3433, primaryCrop: 'Cotton & Bajra', description: 'Marathwada drought-prone zone' },

  // Rajasthan
  { district: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lon: 75.7873, primaryCrop: 'Mustard & Pearl Millet', description: 'Semi-arid, over-exploited aquifer' },
  { district: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lon: 73.0243, primaryCrop: 'Bajra, Guar & Cumin', description: 'Thar desert border, very low rainfall' },
  { district: 'Kota', state: 'Rajasthan', lat: 25.2138, lon: 75.8648, primaryCrop: 'Soybean & Mustard', description: 'Chambal canal irrigation basin' },
  { district: 'Bikaner', state: 'Rajasthan', lat: 28.0229, lon: 73.3119, primaryCrop: 'Groundnut & Gram', description: 'Indira Gandhi Canal command area' },

  // Uttar Pradesh
  { district: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lon: 82.9739, primaryCrop: 'Paddy, Wheat & Pulses', description: 'Fertile Indo-Gangetic alluvial plains' },
  { district: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lon: 80.9462, primaryCrop: 'Mango, Wheat & Paddy', description: 'Central UP alluvial loam belt' },
  { district: 'Meerut', state: 'Uttar Pradesh', lat: 28.9845, lon: 77.7064, primaryCrop: 'Sugarcane & Wheat', description: 'Western UP high-yield sugarcane bowl' },
  { district: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.4358, lon: 81.8463, primaryCrop: 'Guava, Wheat & Mustard', description: 'Ganga-Yamuna confluence belt' },

  // Madhya Pradesh
  { district: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lon: 75.8577, primaryCrop: 'Soybean, Wheat & Potato', description: 'Malwa plateau rich black soil' },
  { district: 'Ujjain', state: 'Madhya Pradesh', lat: 23.1765, lon: 75.7885, primaryCrop: 'Soybean & Gram (Chana)', description: 'Rainfed soybean capital' },
  { district: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lon: 77.4126, primaryCrop: 'Wheat & Pulses', description: 'Central black soil watershed' },

  // Andhra Pradesh
  { district: 'Anantapur', state: 'Andhra Pradesh', lat: 14.6819, lon: 77.6006, primaryCrop: 'Groundnut & Red Gram', description: 'Rayalaseema rain-shadow, frequent dry spells' },
  { district: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lon: 80.4365, primaryCrop: 'Chilli, Cotton & Tobacco', description: 'Krishna delta agricultural corridor' },
  { district: 'Kurnool', state: 'Andhra Pradesh', lat: 15.8281, lon: 78.0373, primaryCrop: 'Cotton, Sunflower & Bengal Gram', description: 'Semi-arid red and black soil mix' },

  // Telangana
  { district: 'Warangal', state: 'Telangana', lat: 17.9689, lon: 79.5941, primaryCrop: 'Cotton, Chilli & Paddy', description: 'Red sandy loam & black soils' },
  { district: 'Karimnagar', state: 'Telangana', lat: 18.4386, lon: 79.1288, primaryCrop: 'Paddy & Maize', description: 'Godavari basin irrigation zone' },

  // Tamil Nadu
  { district: 'Thanjavur', state: 'Tamil Nadu', lat: 10.7870, lon: 79.1378, primaryCrop: 'Paddy & Coconut', description: 'Cauvery delta rice granary' },
  { district: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lon: 76.9558, primaryCrop: 'Cotton, Maize & Vegetables', description: 'Western Tamil Nadu agro-industrial hub' },
  { district: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lon: 78.1198, primaryCrop: 'Paddy, Pulses & Jasmine', description: 'Vaigai river basin' },

  // Karnataka
  { district: 'Hubli / Dharwad', state: 'Karnataka', lat: 15.3647, lon: 75.1240, primaryCrop: 'Cotton, Soybean & Chilli', description: 'North Karnataka black cotton tract' },
  { district: 'Belagavi', state: 'Karnataka', lat: 15.8497, lon: 74.4977, primaryCrop: 'Sugarcane & Vegetables', description: 'High rainfall transition zone' },
  { district: 'Mandya', state: 'Karnataka', lat: 12.5222, lon: 76.8974, primaryCrop: 'Sugarcane & Paddy', description: 'Cauvery command irrigation' },

  // Gujarat
  { district: 'Rajkot', state: 'Gujarat', lat: 22.3039, lon: 70.8022, primaryCrop: 'Groundnut & Cotton', description: 'Saurashtra semi-arid plateau' },
  { district: 'Anand', state: 'Gujarat', lat: 22.5645, lon: 72.9289, primaryCrop: 'Tobacco, Banana & Vegetables', description: 'Charotar fertile alluvial belt' },

  // Bihar
  { district: 'Patna', state: 'Bihar', lat: 25.5941, lon: 85.1376, primaryCrop: 'Wheat, Paddy & Pulses', description: 'Ganga river plain, shallow water table' },
  { district: 'Muzaffarpur', state: 'Bihar', lat: 26.1226, lon: 85.3906, primaryCrop: 'Shahi Litchi, Paddy & Maize', description: 'Burhi Gandak river belt' },

  // West Bengal
  { district: 'Burdwan', state: 'West Bengal', lat: 23.2324, lon: 87.8615, primaryCrop: 'Rice & Potato', description: 'Damodar river valley rice bowl' },
  { district: 'Nadia', state: 'West Bengal', lat: 23.4710, lon: 88.5565, primaryCrop: 'Jute, Paddy & Mustard', description: 'Bhagirathi river floodplain' },
];

