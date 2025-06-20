import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Ship, Navigation, Clock, MapPin, Activity, Anchor } from 'lucide-react';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom ship icon
const shipIcon = new L.DivIcon({
  html: `<div style="background: #3B82F6; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
    <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
      <path d="M3 17h18l-2-6H5l-2 6zm9-8V7h6l-2-2h-4V3h-2v2H6L4 7h6v2h2z"/>
    </svg>
  </div>`,
  className: 'custom-ship-marker',
  iconSize: [26, 26],
  iconAnchor: [13, 13]
});

const VesselTrackingPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTab, setSelectedTab] = useState('overview');
  const mapRef = useRef();
  
  // Enhanced vessel data with more realistic information
  const vesselData = {
    name: "MSC AURORA",
    imo: "9876543210",
    mmsi: "636019825",
    type: "Container Ship",
    flag: "🇵🇦 Panama",
    length: "366m",
    width: "51m",
    draft: "14.2m",
    grossTonnage: "180,000 GT",
    status: "Under Way Using Engine",
    speed: "18.4 knots",
    maxSpeed: "22.5 knots",
    course: "285°",
    heading: "287°",
    destination: "Rotterdam, Netherlands",
    eta: "2025-06-02 14:30",
    lastUpdate: "2025-05-30 16:45 UTC",
    owner: "Mediterranean Shipping Company",
    built: "2019",
    homePort: "Panama City"
  };

// Enhanced vessel positions following actual maritime routes
const vesselPositions = [
    { pos: [35.6762, 139.6503], port: "Tokyo, Japan", timestamp: "2025-05-20" },
    { pos: [35.0000, 140.0000], port: "Departing Tokyo Bay", timestamp: "2025-05-20" },
    { pos: [32.0000, 135.0000], port: "Philippine Sea", timestamp: "2025-05-21" },
    { pos: [25.0000, 125.0000], port: "East China Sea", timestamp: "2025-05-22" },
    // { pos: [31.2304, 121.4737], port: "Shanghai, China", timestamp: "2025-05-23" },
    // { pos: [30.0000, 120.0000], port: "Departing Shanghai", timestamp: "2025-05-23" },
    { pos: [21.5000, 121.0000], port: "South China Sea", timestamp: "2025-05-24" },
    { pos: [22.3193, 114.1694], port: "Hong Kong", timestamp: "2025-05-25" },
    { pos: [18.0000, 110.0000], port: "South China Sea Route", timestamp: "2025-05-25" },
    { pos: [11.0000, 109.4000], port: "South China Sea", timestamp: "2025-05-26" },
    { pos: [6.0000, 103.0000], port: "Approaching Singapore", timestamp: "2025-05-26" },
    { pos: [0.6966, 104.9568], port: "Singapore", timestamp: "2025-05-27" },
    { pos: [0.6966, 103.8568], port: "Singapore", timestamp: "2025-05-27" },
    { pos: [5.5000, 98.0000], port: "Malacca Strait", timestamp: "2025-05-27" },
    { pos: [8.0000, 92.0000], port: "Andaman Sea", timestamp: "2025-05-28" },
    { pos: [3.0000, 70.0000], port: "Arabian Sea", timestamp: "2025-05-28" },
    { pos: [20.0000, 62.0000], port: "Arabian Sea Route", timestamp: "2025-05-29" },
    // { pos: [25.2048, 55.2708], port: "Dubai, UAE", timestamp: "2025-05-29" },
    // { pos: [25.0000, 56.0000], port: "Persian Gulf", timestamp: "2025-05-29" },
    { pos: [22.0000, 60.0000], port: "Gulf of Oman", timestamp: "2025-05-30" },
    { pos: [18.0000, 58.0000], port: "Arabian Sea", timestamp: "2025-05-30" },
    { pos: [12.0000, 44.0000], port: "Red Sea Entrance", timestamp: "2025-05-30" },
    { pos: [20.0000, 40.0000], port: "Red Sea", timestamp: "2025-05-30" },
    { pos: [27.0000, 34.0000], port: "Red Sea North", timestamp: "2025-05-30" },
    { pos: [29.9167, 32.5500], port: "Suez Canal", timestamp: "2025-05-30" },
    { pos: [31.5000, 30.0000], port: "Mediterranean Entry", timestamp: "2025-05-30" },
    { pos: [34.0000, 25.0000], port: "Eastern Mediterranean", timestamp: "2025-05-31" },
    { pos: [37.0000, 15.0000], port: "Central Mediterranean", timestamp: "2025-05-31" },
    { pos: [40.0000, 8.0000], port: "Western Mediterranean", timestamp: "2025-06-01" },
    { pos: [43.0000, 5.0000], port: "Gulf of Lion", timestamp: "2025-06-01" },
    { pos: [49.0000, 3.0000], port: "English Channel", timestamp: "2025-06-01" },
    { pos: [52.0705, 4.3007], port: "Approaching Rotterdam", timestamp: "2025-06-01" }
  ];
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status) => {
    if (status.includes('Under Way')) return 'text-green-600 bg-green-50';
    if (status.includes('At Anchor')) return 'text-yellow-600 bg-yellow-50';
    if (status.includes('Moored')) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Ship },
    { id: 'navigation', label: 'Navigation', icon: Navigation },
    { id: 'positions', label: 'Track History', icon: MapPin }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Ship className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{vesselData.name}</h1>
                <p className="text-sm text-gray-500">IMO: {vesselData.imo} • MMSI: {vesselData.mmsi}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vesselData.status)}`}>
                <Activity className="inline h-4 w-4 mr-1" />
                {vesselData.status}
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{currentTime.toLocaleTimeString()}</div>
                <div className="text-xs text-gray-500">Live Tracking</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* Map Section */}
        <div className="w-full lg:w-2/3 h-1/2 lg:h-full bg-white shadow-lg">
          <MapContainer 
            ref={mapRef}
            center={[35, 100]} 
            zoom={4} 
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              subdomains="abcd"
              maxZoom={20}
            />
            
            {/* Vessel route */}
            <Polyline 
              positions={vesselPositions.map(p => p.pos)} 
              color="#3B82F6" 
              weight={4}
              opacity={0.8}
              dashArray="10, 5"
            />
            
            {/* Port markers */}
            {vesselPositions.slice(0, -1).map((position, index) => (
              <Marker key={index} position={position.pos}>
                <Popup>
                  <div className="text-center">
                    <div className="font-semibold text-gray-800">{position.port}</div>
                    <div className="text-sm text-gray-600">{position.timestamp}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {/* Current vessel position */}
            <Marker 
              position={vesselPositions[vesselPositions.length - 1].pos} 
              icon={shipIcon}
            >
              <Popup>
                <div className="font-bold text-blue-600 mb-2">{vesselData.name}</div>
                <div className="space-y-1 text-sm">
                  <div><span className="font-medium">Status:</span> {vesselData.status}</div>
                  <div><span className="font-medium">Speed:</span> {vesselData.speed}</div>
                  <div><span className="font-medium">Course:</span> {vesselData.course}</div>
                  <div><span className="font-medium">Destination:</span> {vesselData.destination}</div>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
        
        {/* Details Section */}
        <div className="w-full lg:w-1/3 h-1/2 lg:h-full bg-white shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      selectedTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6 overflow-y-auto h-full">
            {selectedTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">{vesselData.speed}</div>
                    <div className="text-sm text-blue-800">Current Speed</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                    <div className="text-2xl font-bold text-green-600">{vesselData.course}</div>
                    <div className="text-sm text-green-800">Course</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Ship className="h-5 w-5 mr-2 text-blue-600" />
                    Vessel Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div><span className="font-medium text-gray-600">Type:</span> <span className="text-gray-800">{vesselData.type}</span></div>
                    <div><span className="font-medium text-gray-600">Flag:</span> <span className="text-gray-800">{vesselData.flag}</span></div>
                    <div><span className="font-medium text-gray-600">Length:</span> <span className="text-gray-800">{vesselData.length}</span></div>
                    <div><span className="font-medium text-gray-600">Beam:</span> <span className="text-gray-800">{vesselData.width}</span></div>
                    <div><span className="font-medium text-gray-600">Draft:</span> <span className="text-gray-800">{vesselData.draft}</span></div>
                    <div><span className="font-medium text-gray-600">GT:</span> <span className="text-gray-800">{vesselData.grossTonnage}</span></div>
                    <div><span className="font-medium text-gray-600">Built:</span> <span className="text-gray-800">{vesselData.built}</span></div>
                    <div><span className="font-medium text-gray-600">Owner:</span> <span className="text-gray-800">{vesselData.owner}</span></div>
                  </div>
                </div>

                <div className="bg-amber-50 p-5 rounded-xl border border-amber-200">
                  <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center">
                    <Anchor className="h-5 w-5 mr-2" />
                    Voyage Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div><span className="font-medium text-amber-700">Destination:</span> <span className="text-amber-900">{vesselData.destination}</span></div>
                    <div><span className="font-medium text-amber-700">ETA:</span> <span className="text-amber-900">{vesselData.eta}</span></div>
                    <div><span className="font-medium text-amber-700">Last Update:</span> <span className="text-amber-900">{vesselData.lastUpdate}</span></div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'navigation' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">{vesselData.heading}</div>
                    <div className="text-sm text-purple-800">True Heading</div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
                    <div className="text-2xl font-bold text-indigo-600">{vesselData.maxSpeed}</div>
                    <div className="text-sm text-indigo-800">Max Speed</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Navigation className="h-5 w-5 mr-2 text-blue-600" />
                    Navigation Data
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Current Speed:</span>
                      <span className="text-gray-800 font-mono">{vesselData.speed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Course Over Ground:</span>
                      <span className="text-gray-800 font-mono">{vesselData.course}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">True Heading:</span>
                      <span className="text-gray-800 font-mono">{vesselData.heading}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Navigation Status:</span>
                      <span className="text-green-600 font-medium">{vesselData.status}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Position Report
                  </h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div>Latest position received {vesselData.lastUpdate}</div>
                    <div>Next update expected in ~5 minutes</div>
                    <div className="text-xs text-blue-600 mt-3">
                      Position accuracy: ±10 meters (GPS)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'positions' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  Recent Track History
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {vesselPositions.slice().reverse().map((position, index) => (
                    <div key={index} className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                      index === 0 
                        ? 'bg-blue-50 border-blue-200 shadow-sm' 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className={`font-medium ${index === 0 ? 'text-blue-800' : 'text-gray-800'}`}>
                            {position.port}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {position.pos[0].toFixed(4)}°N, {position.pos[1].toFixed(4)}°E
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${index === 0 ? 'text-blue-600' : 'text-gray-600'}`}>
                            {position.timestamp}
                          </div>
                          {index === 0 && (
                            <div className="text-xs text-blue-500 mt-1">Current</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VesselTrackingPage;