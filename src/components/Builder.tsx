import { useState } from 'react';

// Types
interface ClubHead {
  id: string;
  brand_id: string;
  model: string;
  year: number;
  loft_options: string[];
  full_name: string;
  description: string;
}

interface Shaft {
  id: string;
  brand: string;
  model: string;
  flex_options: string[];
  weight_options: string[];
  full_name: string;
  launch: string;
  spin: string;
}

interface Grip {
  id: string;
  brand: string;
  model: string;
  size_options: string[];
  full_name: string;
}

interface BuildState {
  head: ClubHead | null;
  headLoft: string | null;
  shaft: Shaft | null;
  shaftSpec: string | null; // e.g., "6S"
  grip: Grip | null;
  gripSize: string | null;
}

// Mock data - will be loaded from API later
const HEADS: ClubHead[] = [
  {
    id: 'titleist-tsr3-driver',
    brand_id: 'titleist',
    model: 'TSR3',
    year: 2023,
    loft_options: ['8.0', '9.0', '10.0'],
    full_name: 'Titleist TSR3 Driver',
    description: "Player's driver with adjustable CG"
  },
  {
    id: 'titleist-tsr2-driver',
    brand_id: 'titleist',
    model: 'TSR2',
    year: 2023,
    loft_options: ['9.0', '10.0', '11.0'],
    full_name: 'Titleist TSR2 Driver',
    description: 'High MOI for maximum forgiveness'
  },
  {
    id: 'taylormade-qi10-driver',
    brand_id: 'taylormade',
    model: 'Qi10',
    year: 2024,
    loft_options: ['9.0', '10.5', '12.0'],
    full_name: 'TaylorMade Qi10 Driver',
    description: 'Carbon face technology'
  },
  {
    id: 'callaway-paradym-driver',
    brand_id: 'callaway',
    model: 'Paradym',
    year: 2023,
    loft_options: ['9.0', '10.5', '12.0'],
    full_name: 'Callaway Paradym Driver',
    description: '360 Carbon Chassis'
  },
  {
    id: 'ping-g430-max-10k-driver',
    brand_id: 'ping',
    model: 'G430 Max 10K',
    year: 2024,
    loft_options: ['9.0', '10.5', '12.0'],
    full_name: 'PING G430 Max 10K Driver',
    description: '10,000+ MOI for extreme forgiveness'
  }
];

const SHAFTS: Shaft[] = [
  {
    id: 'fujikura-ventus-blue',
    brand: 'Fujikura',
    model: 'Ventus Blue',
    flex_options: ['R', 'S', 'X'],
    weight_options: ['5', '6', '7'],
    full_name: 'Fujikura Ventus Blue',
    launch: 'mid',
    spin: 'mid'
  },
  {
    id: 'fujikura-ventus-black',
    brand: 'Fujikura',
    model: 'Ventus Black',
    flex_options: ['S', 'X', 'TX'],
    weight_options: ['6', '7', '8'],
    full_name: 'Fujikura Ventus Black',
    launch: 'low',
    spin: 'low'
  },
  {
    id: 'mitsubishi-tensei-pro-white',
    brand: 'Mitsubishi',
    model: 'Tensei AV Raw White',
    flex_options: ['R', 'S', 'X', 'TX'],
    weight_options: ['55', '65', '75'],
    full_name: 'Mitsubishi Tensei AV Raw White',
    launch: 'mid',
    spin: 'low'
  },
  {
    id: 'project-x-hzrdus-smoke-black',
    brand: 'Project X',
    model: 'HZRDUS Smoke Black',
    flex_options: ['S', 'X', 'TX'],
    weight_options: ['60', '70', '80'],
    full_name: 'Project X HZRDUS Smoke Black',
    launch: 'low',
    spin: 'low'
  },
  {
    id: 'graphite-design-tour-ad-di',
    brand: 'Graphite Design',
    model: 'Tour AD DI',
    flex_options: ['R', 'S', 'X'],
    weight_options: ['5', '6', '7', '8'],
    full_name: 'Graphite Design Tour AD DI',
    launch: 'mid',
    spin: 'mid'
  }
];

const GRIPS: Grip[] = [
  {
    id: 'golf-pride-tour-velvet',
    brand: 'Golf Pride',
    model: 'Tour Velvet',
    size_options: ['undersize', 'standard', 'midsize', 'jumbo'],
    full_name: 'Golf Pride Tour Velvet'
  },
  {
    id: 'golf-pride-mcc',
    brand: 'Golf Pride',
    model: 'MCC',
    size_options: ['standard', 'midsize'],
    full_name: 'Golf Pride MCC'
  },
  {
    id: 'superstroke-s-tech',
    brand: 'SuperStroke',
    model: 'S-Tech',
    size_options: ['standard', 'midsize', 'oversize'],
    full_name: 'SuperStroke S-Tech'
  }
];

// Mock prices - will come from API
const MOCK_PRICES: Record<string, { retailer: string; price: number; url: string }[]> = {
  'titleist-tsr3-driver': [
    { retailer: '2ndSwing', price: 449, url: '#' },
    { retailer: 'GlobalGolf', price: 469, url: '#' },
  ],
  'fujikura-ventus-blue': [
    { retailer: 'GolfWorks', price: 299, url: '#' },
    { retailer: '2ndSwing', price: 279, url: '#' },
  ],
  'golf-pride-tour-velvet': [
    { retailer: 'GolfWorks', price: 6, url: '#' },
    { retailer: 'Rock Bottom', price: 5, url: '#' },
  ],
};

export default function Builder() {
  const [build, setBuild] = useState<BuildState>({
    head: null,
    headLoft: null,
    shaft: null,
    shaftSpec: null,
    grip: null,
    gripSize: null,
  });

  const [step, setStep] = useState(1);

  const selectHead = (head: ClubHead) => {
    setBuild({ ...build, head, headLoft: null });
  };

  const selectLoft = (loft: string) => {
    setBuild({ ...build, headLoft: loft });
    setStep(2);
  };

  const selectShaft = (shaft: Shaft) => {
    setBuild({ ...build, shaft, shaftSpec: null });
  };

  const selectShaftSpec = (spec: string) => {
    setBuild({ ...build, shaftSpec: spec });
    setStep(3);
  };

  const selectGrip = (grip: Grip) => {
    setBuild({ ...build, grip, gripSize: null });
  };

  const selectGripSize = (size: string) => {
    setBuild({ ...build, gripSize: size });
    setStep(4);
  };

  const calculateTotal = () => {
    let total = 0;
    // Use lowest price for each component
    if (build.head) {
      const prices = MOCK_PRICES[build.head.id] || [];
      if (prices.length) total += Math.min(...prices.map(p => p.price));
    }
    if (build.shaft) {
      const prices = MOCK_PRICES[build.shaft.id] || [];
      if (prices.length) total += Math.min(...prices.map(p => p.price));
    }
    if (build.grip) {
      const prices = MOCK_PRICES[build.grip.id] || [];
      if (prices.length) total += Math.min(...prices.map(p => p.price));
    }
    return total;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Build Summary Sidebar */}
      <div className="lg:col-span-1 order-2 lg:order-1">
        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
          <h2 className="font-bold text-lg mb-4">Your Build</h2>
          
          <div className="space-y-4">
            <div className={`p-3 rounded-lg ${build.head ? 'bg-green-50 border border-green-200' : 'bg-gray-100'}`}>
              <p className="text-xs text-gray-500 uppercase">Head</p>
              <p className="font-medium">{build.head ? `${build.head.full_name} ${build.headLoft || ''}°` : 'Not selected'}</p>
            </div>
            
            <div className={`p-3 rounded-lg ${build.shaft ? 'bg-green-50 border border-green-200' : 'bg-gray-100'}`}>
              <p className="text-xs text-gray-500 uppercase">Shaft</p>
              <p className="font-medium">{build.shaft ? `${build.shaft.full_name} ${build.shaftSpec || ''}` : 'Not selected'}</p>
            </div>
            
            <div className={`p-3 rounded-lg ${build.grip ? 'bg-green-50 border border-green-200' : 'bg-gray-100'}`}>
              <p className="text-xs text-gray-500 uppercase">Grip</p>
              <p className="font-medium">{build.grip ? `${build.grip.full_name} (${build.gripSize || ''})` : 'Not selected'}</p>
            </div>
          </div>

          <div className="border-t mt-6 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Estimated Total</span>
              <span className="text-2xl font-bold text-green-700">${calculateTotal()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Lowest prices across retailers</p>
          </div>

          {step === 4 && (
            <button className="w-full mt-6 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors">
              Share This Build
            </button>
          )}
        </div>
      </div>

      {/* Main Selection Area */}
      <div className="lg:col-span-2 order-1 lg:order-2">
        {/* Step 1: Head Selection */}
        <div className={`mb-8 ${step !== 1 && 'opacity-60'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">1. Select Club Head</h2>
            {step > 1 && (
              <button onClick={() => setStep(1)} className="text-green-600 text-sm hover:underline">
                Change
              </button>
            )}
          </div>
          
          {step === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {HEADS.map(head => (
                  <button
                    key={head.id}
                    onClick={() => selectHead(head)}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      build.head?.id === head.id 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-semibold">{head.full_name}</h3>
                    <p className="text-sm text-gray-500">{head.description}</p>
                  </button>
                ))}
              </div>

              {build.head && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium mb-2">Select Loft</p>
                  <div className="flex gap-2">
                    {build.head.loft_options.map(loft => (
                      <button
                        key={loft}
                        onClick={() => selectLoft(loft)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          build.headLoft === loft
                            ? 'bg-green-600 text-white'
                            : 'bg-white border border-gray-200 hover:border-green-500'
                        }`}
                      >
                        {loft}°
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Step 2: Shaft Selection */}
        <div className={`mb-8 ${step < 2 ? 'opacity-40 pointer-events-none' : step !== 2 && 'opacity-60'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">2. Select Shaft</h2>
            {step > 2 && (
              <button onClick={() => setStep(2)} className="text-green-600 text-sm hover:underline">
                Change
              </button>
            )}
          </div>

          {step === 2 && (
            <>
              <div className="grid grid-cols-1 gap-4 mb-4">
                {SHAFTS.map(shaft => (
                  <button
                    key={shaft.id}
                    onClick={() => selectShaft(shaft)}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      build.shaft?.id === shaft.id 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">{shaft.full_name}</h3>
                        <p className="text-sm text-gray-500">{shaft.brand}</p>
                      </div>
                      <div className="text-right text-sm">
                        <span className={`px-2 py-1 rounded ${
                          shaft.launch === 'low' ? 'bg-blue-100 text-blue-700' :
                          shaft.launch === 'mid' ? 'bg-green-100 text-green-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {shaft.launch} launch
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {build.shaft && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium mb-2">Select Weight & Flex</p>
                  <div className="flex flex-wrap gap-2">
                    {build.shaft.weight_options.flatMap(weight =>
                      build.shaft!.flex_options.map(flex => (
                        <button
                          key={`${weight}${flex}`}
                          onClick={() => selectShaftSpec(`${weight}${flex}`)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            build.shaftSpec === `${weight}${flex}`
                              ? 'bg-green-600 text-white'
                              : 'bg-white border border-gray-200 hover:border-green-500'
                          }`}
                        >
                          {weight}{flex}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Step 3: Grip Selection */}
        <div className={`mb-8 ${step < 3 ? 'opacity-40 pointer-events-none' : step !== 3 && 'opacity-60'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">3. Select Grip</h2>
            {step > 3 && (
              <button onClick={() => setStep(3)} className="text-green-600 text-sm hover:underline">
                Change
              </button>
            )}
          </div>

          {step === 3 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {GRIPS.map(grip => (
                  <button
                    key={grip.id}
                    onClick={() => selectGrip(grip)}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      build.grip?.id === grip.id 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-semibold">{grip.full_name}</h3>
                    <p className="text-sm text-gray-500">{grip.brand}</p>
                  </button>
                ))}
              </div>

              {build.grip && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium mb-2">Select Size</p>
                  <div className="flex gap-2">
                    {build.grip.size_options.map(size => (
                      <button
                        key={size}
                        onClick={() => selectGripSize(size)}
                        className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                          build.gripSize === size
                            ? 'bg-green-600 text-white'
                            : 'bg-white border border-gray-200 hover:border-green-500'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Step 4: Price Comparison */}
        {step === 4 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Price Comparison</h2>
            <p className="text-gray-600 mb-4">Best prices for your build across retailers</p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-gray-600">Price comparison coming soon!</p>
              <p className="text-sm text-gray-500 mt-1">We're adding retailer integrations</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
