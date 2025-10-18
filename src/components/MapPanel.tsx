import React, { useState, useMemo } from 'react';
import { X, MapPin, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Compass } from 'lucide-react';

// --- Helper Functions ---

// Converts a hex integer (e.g., 0x4caf50) to a CSS hex string (e.g., '#4caf50')
const hexToCss = (hex: number): string => {
    return '#' + hex.toString(16).padStart(6, '0');
};

// --- Map Panel Component ---

interface MapPanelProps {
  onClose: () => void;
  userX: number;
  userY: number;
  // Changed moveUser signature to also accept absolute coordinates for teleport
  moveUser: (x: number, y: number, isAbsolute: boolean) => void; 
  campusBuildings: Building[];
  LEGEND_MAP: Record<string, { label: string; hex: string; legendBg: string }>;
}

// Define the building type for clarity
interface Building {
    name: string;
    x: number;
    y: number;
    type: string;
    color: string;
}


const MapPanel: React.FC<MapPanelProps> = ({ onClose, userX, userY, moveUser, campusBuildings, LEGEND_MAP }) => {
  
  const MOVE_DELTA = 3; // Percentage change per click for arrow controls

  // Helper function for quick movement (relative change)
  const handleRelativeMove = (dx: number, dy: number) => {
      moveUser(dx, dy, false);
  };

  // Helper function for teleport (absolute change)
  const handleTeleport = (x: number, y: number) => {
      moveUser(x, y, true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40 p-4 font-['Inter'] backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-all duration-300">
        
        {/* Header */}
        <div className="p-6 flex-shrink-0 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-3xl font-extrabold text-gray-900 flex items-center space-x-2">
                <Compass size={28} className="text-blue-600"/>
                <span>Campus Building Locator</span>
            </h3>
            <button 
                onClick={onClose} 
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className='p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto flex-1'>
            
            {/* Map Container (Main Content) */}
            <div className="lg:col-span-2 flex flex-col">
                <h4 className="text-xl font-bold text-gray-800 mb-3">Campus Overview (Normalized Grid)</h4>
                <div className="relative bg-gradient-to-br from-green-50 via-green-100 to-green-200 rounded-xl shadow-lg flex-1 min-h-[400px] overflow-hidden">
                    
                    {/* Grid Pattern */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `
                          linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '20px 20px'
                      }}
                    />

                    {/* Campus Buildings (Pins with Tooltips/Names) */}
                    {campusBuildings.map((building, index) => (
                      <div
                        key={index}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                        style={{ left: `${building.x}%`, top: `${building.y}%` }}
                      >
                        <div 
                            className={`w-8 h-8 rounded-lg shadow-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer`}
                            style={{ backgroundColor: building.color }}
                        >
                          <MapPin className="text-white" size={16} />
                        </div>
                        {/* Tooltip for Building Name (Always visible on hover) */}
                        <div className="absolute top-[-35px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg pointer-events-none">
                          {building.name}
                        </div>
                      </div>
                    ))}

                    {/* Player Position (Dynamic) - The 'You are here' marker */}
                    <div
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out z-10"
                      style={{ left: `${userX}%`, top: `${userY}%` }}
                    >
                      <div className="w-8 h-8 bg-red-500 rounded-full border-4 border-white animate-pulse shadow-xl flex items-center justify-center">
                        <MapPin className='text-white' size={16} />
                      </div>
                      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap shadow-md">
                        You are here ({userX.toFixed(0)}, {userY.toFixed(0)})
                      </div>
                    </div>
                </div>
            </div>

            {/* Controls and Legend (Sidebar) */}
            <div className='lg:col-span-1 space-y-6'>
                
                {/* Movement Controls (Replaces "Simulated Navigation") */}
                <div className="p-4 bg-gray-50 rounded-xl shadow-inner border border-gray-200">
                    <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center space-x-2">
                        <Compass size={20} className='text-blue-600'/>
                        <span>Movement Controls</span>
                    </h4>
                    <div className="flex flex-col items-center space-y-2">
                        
                        {/* UP Button (Move North) */}
                        <button 
                            onClick={() => handleRelativeMove(0, -MOVE_DELTA)} 
                            className="w-16 h-10 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-lg transition-colors shadow-md"
                            aria-label="Move Up"
                        >
                            <ArrowUp size={24} className='mx-auto'/>
                        </button>
                        
                        <div className="flex space-x-2">
                            {/* LEFT Button (Move West) */}
                            <button 
                                onClick={() => handleRelativeMove(-MOVE_DELTA, 0)} 
                                className="w-16 h-10 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-lg transition-colors shadow-md"
                                aria-label="Move Left"
                            >
                                <ArrowLeft size={24} className='mx-auto'/>
                            </button>
                            
                            {/* Current Coordinates Display */}
                            <div className="w-24 h-10 bg-white border border-gray-300 rounded-lg flex flex-col items-center justify-center text-xs font-bold text-gray-700 shadow-inner">
                                <span className='text-xs text-gray-500'>Coords:</span>
                                <span>({userX.toFixed(0)}, {userY.toFixed(0)})</span>
                            </div>
                            
                            {/* RIGHT Button (Move East) */}
                            <button 
                                onClick={() => handleRelativeMove(MOVE_DELTA, 0)} 
                                className="w-16 h-10 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-lg transition-colors shadow-md"
                                aria-label="Move Right"
                            >
                                <ArrowRight size={24} className='mx-auto'/>
                            </button>
                        </div>
                        
                        {/* DOWN Button (Move South) */}
                        <button 
                            onClick={() => handleRelativeMove(0, MOVE_DELTA)} 
                            className="w-16 h-10 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-lg transition-colors shadow-md"
                            aria-label="Move Down"
                        >
                            <ArrowDown size={24} className='mx-auto'/>
                        </button>
                    </div>
                </div>

                {/* Legend */}
                <div className="p-4 bg-white rounded-xl shadow border border-gray-200">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">Map Legend</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.values(LEGEND_MAP).map((item) => (
                            <div key={item.label} className={`flex items-center space-x-2 p-2 rounded-lg ${item.legendBg} shadow-sm`}>
                                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.hex }}></div>
                                <span className="text-sm font-medium">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Navigation / Teleport */}
                <div className="p-4 bg-white rounded-xl shadow border border-gray-200">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">Quick Teleport (Jump to Location)</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {campusBuildings.slice(0, 6).map((building) => (
                            <button
                                key={building.name}
                                // ACTION: Now calls handleTeleport to set the user's location absolutely
                                onClick={() => handleTeleport(building.x, building.y)} 
                                className="bg-gray-100 hover:bg-blue-100 text-gray-700 p-3 rounded-lg text-left shadow-sm transition-colors border border-gray-200"
                            >
                                <div className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded`} style={{ backgroundColor: building.color }}></div>
                                    <span className="text-sm font-medium">{building.name}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
};


// --- App Component for Demo (Contains State Logic) ---

const App: React.FC = () => {
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    // User position state (using percentage coordinates 0-100)
    // Initialize starting position near KC Canteen (x=75%, y=50/600 * 100 = ~8%)
    const [userPosition, setUserPosition] = useState({ x: 75, y: 8 });

    const campusBuildings = useMemo(() => {
        // Define the max boundary used for normalization (based on original data)
        const MAX_X = 800;
        const MAX_Y = 600;
  
        const rawBuildings = [
            { name: "SPS Hostel", x: 100, y: 100, type: 'hostel', color: 0x4caf50 },
            { name: "Kamadhenu Hostel", x: 250, y: 300, type: 'hostel', color: 0x81c784 },
            { name: "Vashishta Hostel", x: 100, y: 300, type: 'hostel', color: 0xa5d6a7 },
            { name: "PV Hostel", x: 250, y: 450, type: 'hostel', color: 0x66bb6a },
            
            { name: "VKJ", x: 500, y: 50, type: 'amenity', color: 0xffb74d },
            { name: "KC Canteen", x: 750, y: 50, type: 'amenity', color: 0xffb74d },
            { name: "Southern Canopy", x: 800, y: 600, type: 'amenity', color: 0xffcc80 },
  
            { name: "TDC (Teaching)", x: 450, y: 350, type: 'academic', color: 0x90caf9 },
            { name: "Library(KRC)", x: 600, y: 350, type: 'academic', color: 0x42a5f5 },
            { name: "SOC (Academic)", x: 600, y: 200, type: 'academic', color: 0x64b5f6 },
            { name: "LTC (Lecture)", x: 600, y: 500, type: 'academic', color: 0x64b5f6 },
            
            { name: "SASHE (Research)", x: 450, y: 200, type: 'research', color: 0xba68c8 },
        ];
  
        return rawBuildings.map(b => ({
            ...b,
            // Normalize absolute pixel coordinates (x, y) to percentage values (0-100)
            x: (b.x / MAX_X) * 100,
            y: (b.y / MAX_Y) * 100,
            // Convert hex integer to CSS string
            color: hexToCss(b.color),
        }));
    }, []);
    
    const LEGEND_MAP = useMemo(() => ({
        hostel: { label: 'Hostels', hex: hexToCss(0x66bb6a), legendBg: 'bg-green-100 text-green-800' },
        amenity: { label: 'Canteens/Amenities', hex: hexToCss(0xffb74d), legendBg: 'bg-orange-100 text-orange-800' },
        academic: { label: 'Academic Blocks', hex: hexToCss(0x64b5f6), legendBg: 'bg-blue-100 text-blue-800' },
        research: { label: 'Research/Specific', hex: hexToCss(0xba68c8), legendBg: 'bg-purple-100 text-purple-800' },
    }), []);


    /**
     * Updates the user's position either relatively (by delta) or absolutely (teleport).
     * Clamps the values between 0 and 100 to keep the user inside the map boundaries.
     */
    const moveUser = (valX: number, valY: number, isAbsolute: boolean) => {
        setUserPosition(prev => {
            let newX, newY;

            if (isAbsolute) {
                // Absolute move (Teleport)
                newX = valX;
                newY = valY;
            } else {
                // Relative move (Arrows)
                newX = prev.x + valX;
                newY = prev.y + valY;
            }

            // Clamp values between 0 and 100
            newX = Math.max(0, Math.min(100, newX));
            newY = Math.max(0, Math.min(100, newY));

            return { x: newX, y: newY };
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-['Inter']">
            <h1 className="text-4xl font-black text-gray-800 mb-6">Dynamic Campus Map Interface</h1>
            <p className="mb-4 text-gray-600 font-semibold text-center">Initial position is set near KC Canteen. Use **Quick Teleport** to jump instantly to LTC!</p>
            
            <button
                onClick={() => setIsPanelOpen(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105"
            >
                <Compass size={20} />
                <span>Open Campus Map</span>
            </button>
            <p className="mt-4 text-gray-600">Use the arrows or Quick Teleport inside the map panel to change your location.</p>

            {isPanelOpen && (
                <MapPanel
                    onClose={() => setIsPanelOpen(false)}
                    userX={userPosition.x}
                    userY={userPosition.y}
                    moveUser={moveUser}
                    campusBuildings={campusBuildings}
                    LEGEND_MAP={LEGEND_MAP}
                />
            )}
        </div>
    );
};

export default App;
