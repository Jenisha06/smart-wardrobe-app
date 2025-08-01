import React, { useState } from 'react';
import { Upload, Shirt, Zap, Eye, TrendingUp, Brain, Plus, Calendar, Cloud } from 'lucide-react';

const SmartWardrobeApp = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [clothes, setClothes] = useState([
    { id: 1, name: 'Blue Denim Jacket', category: 'Top', color: 'Blue', season: 'Fall', occasion: 'Casual', timesWorn: 5, image: '👕' },
    { id: 2, name: 'Black Jeans', category: 'Bottom', color: 'Black', season: 'All', occasion: 'Casual', timesWorn: 12, image: '👖' },
    { id: 3, name: 'White Sneakers', category: 'Shoes', color: 'White', season: 'All', occasion: 'Casual', timesWorn: 8, image: '👟' }
  ]);
  const [selectedOutfit, setSelectedOutfit] = useState({ top: null, bottom: null, shoes: null, accessory: null });
  const [uploadingImages, setUploadingImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const categories = ['Top', 'Bottom', 'Shoes', 'Accessory'];

  // Handle file uploads
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => processImage(file));
  };

  // Process image with background removal simulation
  const processImage = async (file) => {
    setIsProcessing(true);
    const imageUrl = URL.createObjectURL(file);
    
    // Add to uploading queue
    const uploadItem = {
      id: Date.now(),
      name: file.name,
      originalImage: imageUrl,
      status: 'processing'
    };
    
    setUploadingImages(prev => [...prev, uploadItem]);

    // Simulate background removal processing
    setTimeout(() => {
      // Simulate successful processing
      const processedItem = {
        id: clothes.length + uploadingImages.length + 1,
        name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        category: detectCategory(file.name),
        color: detectColor(file.name),
        season: 'All',
        occasion: 'Casual',
        timesWorn: 0,
        image: imageUrl, // In real app, this would be the processed image
        processedImage: imageUrl + '?processed=true' // Simulate processed version
      };

      // Add to wardrobe
      setClothes(prev => [...prev, processedItem]);
      
      // Remove from uploading queue
      setUploadingImages(prev => prev.filter(item => item.id !== uploadItem.id));
      setIsProcessing(false);
    }, 2000); // 2 second simulation
  };

  // Smart category detection
  const detectCategory = (filename) => {
    const lower = filename.toLowerCase();
    if (lower.includes('shirt') || lower.includes('top') || lower.includes('jacket') || lower.includes('hoodie')) return 'Top';
    if (lower.includes('jean') || lower.includes('pant') || lower.includes('trouser') || lower.includes('short')) return 'Bottom';
    if (lower.includes('shoe') || lower.includes('sneaker') || lower.includes('boot') || lower.includes('sandal')) return 'Shoes';
    if (lower.includes('hat') || lower.includes('bag') || lower.includes('watch') || lower.includes('accessory')) return 'Accessory';
    return 'Top'; // Default
  };

  // Smart color detection
  const detectColor = (filename) => {
    const lower = filename.toLowerCase();
    if (lower.includes('black')) return 'Black';
    if (lower.includes('white')) return 'White';
    if (lower.includes('blue')) return 'Blue';
    if (lower.includes('red')) return 'Red';
    if (lower.includes('green')) return 'Green';
    if (lower.includes('gray') || lower.includes('grey')) return 'Gray';
    if (lower.includes('brown')) return 'Brown';
    return 'Blue'; // Default
  };

  const addClothingItem = () => {
    const newItem = {
      id: clothes.length + 1,
      name: `New Item ${clothes.length + 1}`,
      category: 'Top',
      color: 'Blue',
      season: 'All',
      occasion: 'Casual',
      timesWorn: 0,
      image: '👔'
    };
    setClothes([...clothes, newItem]);
  };

  const selectForOutfit = (item) => {
    const category = item.category.toLowerCase();
    setSelectedOutfit(prev => ({
      ...prev,
      [category]: item
    }));
  };

  const generateAIRecommendation = () => {
    // Simple AI logic - pick least worn items that match
    const availableTops = clothes.filter(c => c.category === 'Top');
    const availableBottoms = clothes.filter(c => c.category === 'Bottom');
    const availableShoes = clothes.filter(c => c.category === 'Shoes');
    
    const recommendedTop = availableTops.sort((a, b) => a.timesWorn - b.timesWorn)[0];
    const recommendedBottom = availableBottoms.sort((a, b) => a.timesWorn - b.timesWorn)[0];
    const recommendedShoes = availableShoes.sort((a, b) => a.timesWorn - b.timesWorn)[0];
    
    setSelectedOutfit({
      top: recommendedTop,
      bottom: recommendedBottom,
      shoes: recommendedShoes,
      accessory: null
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">✨ Smart Wardrobe Assistant</h1>
          <p className="text-gray-600">AI-powered outfit recommendations for your perfect look</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-8 bg-white rounded-lg p-2 shadow-md">
          {[
            { id: 'upload', icon: Upload, label: 'Add Clothes' },
            { id: 'wardrobe', icon: Shirt, label: 'My Wardrobe' },
            { id: 'outfit', icon: Eye, label: 'Create Outfit' },
            { id: 'ai', icon: Brain, label: 'AI Suggestions' },
            { id: 'stats', icon: TrendingUp, label: 'Usage Stats' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 m-1 rounded-lg transition-all ${
                activeTab === tab.id 
                  ? 'bg-purple-500 text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon size={18} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-lg p-6 min-h-96">
          
          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="text-center">
              <div className="border-2 border-dashed border-purple-300 rounded-lg p-12 mb-6 relative">
                <Upload size={48} className="mx-auto text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Upload Your Clothes</h3>
                <p className="text-gray-600 mb-4">Drop images here or click to browse</p>
                
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <button className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors pointer-events-none">
                  Choose Files
                </button>
              </div>

              {/* Processing Queue */}
              {uploadingImages.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold mb-3">🔄 Processing Images...</h4>
                  {uploadingImages.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded mb-2">
                      <div className="flex items-center">
                        <img src={item.originalImage} alt="Uploading" className="w-12 h-12 object-cover rounded mr-3" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500 mr-2"></div>
                        <span className="text-sm text-gray-600">Removing background...</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-sm text-gray-500">
                ✨ Background removal with remove.bg API<br/>
                🏷️ Auto-categorization and tagging<br/>
                📱 Support for PNG, JPG, WEBP<br/>
                🧠 Smart color and category detection
              </div>
              
              {/* Quick Add Demo */}
              <div className="mt-6 pt-6 border-t">
                <button 
                  onClick={addClothingItem}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors mr-4"
                >
                  <Plus size={16} className="inline mr-2" />
                  Quick Add Demo Item
                </button>
                
                <label className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer inline-block">
                  <Upload size={16} className="inline mr-2" />
                  Upload Real Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Wardrobe Tab */}
          {activeTab === 'wardrobe' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">My Wardrobe ({clothes.length} items)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clothes.map(item => (
                  <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="mb-3 text-center">
                      {item.image.startsWith('blob:') ? (
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded mx-auto" />
                      ) : (
                        <div className="text-4xl">{item.image}</div>
                      )}
                    </div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{item.category}</span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{item.color}</span>
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">{item.occasion}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-2">Worn {item.timesWorn} times</div>
                    <button 
                      onClick={() => selectForOutfit(item)}
                      className="w-full mt-3 bg-purple-500 text-white py-1 rounded hover:bg-purple-600 transition-colors"
                    >
                      Add to Outfit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Outfit Creation Tab */}
          {activeTab === 'outfit' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Create Your Outfit</h3>
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Outfit Preview */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold mb-4 text-center">Outfit Preview</h4>
                  <div className="text-center space-y-4">
                    <div className="text-6xl">{selectedOutfit.top?.image || '👔'}</div>
                    <div className="text-6xl">{selectedOutfit.bottom?.image || '👖'}</div>
                    <div className="text-6xl">{selectedOutfit.shoes?.image || '👟'}</div>
                    {selectedOutfit.accessory && (
                      <div className="text-4xl">{selectedOutfit.accessory.image}</div>
                    )}
                  </div>
                  <div className="mt-6 text-center">
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                      Save Outfit
                    </button>
                  </div>
                </div>

                {/* Selected Items */}
                <div>
                  <h4 className="font-semibold mb-4">Selected Items</h4>
                  {categories.map(category => (
                    <div key={category} className="mb-4 p-3 border rounded-lg">
                      <div className="font-medium text-sm text-gray-600 mb-2">{category}</div>
                      {selectedOutfit[category.toLowerCase()] ? (
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{selectedOutfit[category.toLowerCase()].image}</span>
                          <span className="font-medium">{selectedOutfit[category.toLowerCase()].name}</span>
                        </div>
                      ) : (
                        <div className="text-gray-400 italic">No {category.toLowerCase()} selected</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI Suggestions Tab */}
          {activeTab === 'ai' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">🧠 AI Outfit Recommendations</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Cloud size={20} className="text-blue-500 mr-2" />
                    <span className="font-semibold">Today's Weather</span>
                  </div>
                  <p>Sunny, 72°F - Perfect for light layers!</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Calendar size={20} className="text-purple-500 mr-2" />
                    <span className="font-semibold">Occasion</span>
                  </div>
                  <p>Casual Day Out</p>
                </div>
              </div>

              <div className="text-center mb-6">
                <button 
                  onClick={generateAIRecommendation}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
                >
                  <Zap size={20} className="inline mr-2" />
                  Generate AI Recommendation
                </button>
              </div>

              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg">
                <h4 className="font-semibold mb-4">💡 Smart Suggestions</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Rotating underused items to maximize your wardrobe</li>
                  <li>• Weather-appropriate fabric and layering suggestions</li>
                  <li>• Color coordination based on your preferences</li>
                  <li>• Occasion-appropriate styling recommendations</li>
                </ul>
              </div>
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">📊 Wardrobe Analytics</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Most Worn Items</h4>
                  {clothes.sort((a, b) => b.timesWorn - a.timesWorn).slice(0, 3).map(item => (
                    <div key={item.id} className="flex items-center justify-between mb-2">
                      <span className="flex items-center">
                        <span className="text-lg mr-2">{item.image}</span>
                        {item.name}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                        {item.timesWorn}x
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Underused Items</h4>
                  {clothes.sort((a, b) => a.timesWorn - b.timesWorn).slice(0, 3).map(item => (
                    <div key={item.id} className="flex items-center justify-between mb-2">
                      <span className="flex items-center">
                        <span className="text-lg mr-2">{item.image}</span>
                        {item.name}
                      </span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                        {item.timesWorn}x
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">💡 Wardrobe Insights</h4>
                <p className="text-sm text-gray-600">
                  You have a balanced wardrobe with {clothes.filter(c => c.category === 'Top').length} tops, 
                  {clothes.filter(c => c.category === 'Bottom').length} bottoms, and 
                  {clothes.filter(c => c.category === 'Shoes').length} pairs of shoes. 
                  Consider adding more accessories to diversify your looks!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
