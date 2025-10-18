import React, { useState, useMemo, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react'; 
import { X, Book, Download, Upload, Search, FileText, Trash2, CheckCircle, AlertTriangle, BookOpen } from 'lucide-react';

// --- Type Definitions ---

interface Material {
  id: number;
  title: string;
  subject: string;
  author: string;
  downloads: number;
  type: string;
}

interface MaterialsPanelProps {
  onClose: () => void;
}

// Define available categories
const CATEGORIES = ['All', 'Computer Science', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Chemistry', 'Maths', 'Physics'];

// Initial set of mock materials (added a few for demonstration)
const initialMaterials: Material[] = [
    {
        id: 101,
        title: 'Thermodynamics Quick Guide',
        subject: 'Mechanical Engineering',
        author: 'Prof. Miller',
        downloads: 45,
        type: 'PDF'
    },
    {
        id: 102,
        title: 'React Hooks Cheatsheet',
        subject: 'Computer Science',
        author: 'Jane Doe',
        downloads: 120,
        type: 'DOCX'
    },
    {
        id: 103,
        title: 'Maxwell\'s Equations Summary',
        subject: 'Physics',
        author: 'Dr. Kim',
        downloads: 88,
        type: 'TXT'
    }
];


// --- Confirmation Modal Component ---
interface ConfirmationModalProps {
    material: Material;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ material, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 font-['Inter']">
        <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full border-t-4 border-red-500">
            <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center space-x-2">
                <AlertTriangle className="text-red-500" size={24} />
                <span>Confirm Deletion</span>
            </h4>
            <p className="text-gray-600 mb-6">
                Are you sure you want to **permanently delete** the material: <span className="font-semibold">"{material.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
                <button 
                    onClick={onCancel} 
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={onConfirm} 
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    Delete Permanently
                </button>
            </div>
        </div>
    </div>
);

// --- Main Panel Component ---

const MaterialsPanel: React.FC<MaterialsPanelProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All'); 
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [isUploading, setIsUploading] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null); // For deletion confirmation
  const [statusMessage, setStatusMessage] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });

  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    subject: '',
    author: 'You', 
    file: null as File | null,
  });

  // Auto-clear status message after 4 seconds
  useEffect(() => {
    if (statusMessage.type) {
        const timer = setTimeout(() => {
            setStatusMessage({ message: '', type: null });
        }, 4000);
        return () => clearTimeout(timer);
    }
  }, [statusMessage]);


  // --- Filtering Logic ---
  const filteredMaterials = useMemo(() => {
    return materials.filter(material => {
      const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            material.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || material.subject === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [materials, searchTerm, activeCategory]);
  
  
  // --- Deletion Handlers (Replacing window.confirm) ---
  const handleDelete = (material: Material) => {
      setMaterialToDelete(material); // Set material to open the confirmation modal
  };

  const confirmDelete = () => {
    if (materialToDelete) {
        setMaterials(prevMaterials => 
            prevMaterials.filter(m => m.id !== materialToDelete.id)
        );
        setStatusMessage({ message: `Material "${materialToDelete.title}" has been deleted.`, type: 'success' });
    }
    setMaterialToDelete(null);
  };


  // --- Download Simulation (Original Content Focused) ---
  const handleDownload = (material: Material) => {
    // 1. Update download count
    setMaterials(prevMaterials =>
      prevMaterials.map(m =>
        m.id === material.id ? { ...m, downloads: m.downloads + 1 } : m
      )
    );
    setStatusMessage({ message: `Downloading: ${material.title} (${material.type}). Download count updated!`, type: 'success' });
    
    // 2. Generating content that simulates original study material (no metadata or summary)
    const mockFileContent = 
`Subject: ${material.subject}
Title: ${material.title}
Author: ${material.author}
Last Modified: ${new Date().toLocaleDateString()}
-----------------------------------------------------

### Chapter 3: Core Principles of ${material.subject}

1. **Introduction to the Fundamental Law:**
Every physical or computational system operates under a principle of equilibrium. For example, in ${material.subject}, the stability of a structure (Civil Engineering) or the efficiency of an algorithm (Computer Science) is always trending toward the lowest energy/complexity state.

2. **Derivation and Application of Core Formula:**
The central formula governing this topic is often expressed as $T = \sqrt{(L_x^2 + L_y^2 + L_z^2)} \cdot C$.
Where T represents the total tension/force/time, L is the load/length component in a dimension, and C is a fixed constraint constant. This derivation is essential for understanding advanced topics and practical simulation results.

3. **Key Takeaway for Exam Preparation:**
Focus on the practical applications in the case studies (e.g., the difference between static and dynamic load analysis or synchronous vs. asynchronous data flow). Memorize the variable definitions for the three primary equations.

4. **Review Questions:**
   - Define the critical state of equilibrium in ${material.subject}.
   - How does Author's Law impact the formula for T?
   - Provide three real-world examples of this principle in action.

-----------------------------------------------------
*This is a simulated download of your study material. For security and environment constraints, real file content (PDF/DOCX) is not served.*
`;
    
    const mockFile = new Blob([mockFileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(mockFile);
    const a = document.createElement('a');
    a.href = url;
    
    // 3. Force the download file extension to .txt with SIMULATED suffix
    a.download = `${material.title}-SIMULATED.txt`; 
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  // --- Upload Handlers (Replacing alert()) ---

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setUploadFormData(prev => ({
        ...prev,
        file: file,
        // Auto-fill title if empty
        title: prev.title || (file ? file.name.replace(/\.(pdf|doc|txt|docx)$/i, '') : ''), 
    }));
  };

  const handleUploadSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!uploadFormData.title.trim() || !uploadFormData.subject || !uploadFormData.file) {
      setStatusMessage({ message: "Please fill out the title, select a subject, and choose a file.", type: 'error' });
      return;
    }

    const newMaterial: Material = {
      id: Date.now(), 
      title: uploadFormData.title.trim(),
      subject: uploadFormData.subject,
      author: uploadFormData.author,
      downloads: 0,
      type: uploadFormData.file.name.split('.').pop()?.toUpperCase() || 'FILE',
    };

    // Add new material to the top of the list
    setMaterials(prev => [newMaterial, ...prev]); 

    setUploadFormData({ title: '', subject: '', author: 'You', file: null });
    setIsUploading(false);
    
    setStatusMessage({ message: `Success! "${newMaterial.title}" has been published and is now available.`, type: 'success' });
    setActiveCategory(newMaterial.subject); // Switch to the new material's category
  };


  // --- JSX Rendering ---

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40 p-4 font-['Inter'] backdrop-blur-sm">
        
        {/* Deletion Confirmation Modal */}
        {materialToDelete && (
            <ConfirmationModal 
                material={materialToDelete} 
                onConfirm={confirmDelete} 
                onCancel={() => setMaterialToDelete(null)} 
            />
        )}
        
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-all duration-300">
        <div className="p-6 flex-shrink-0">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-extrabold text-gray-900 flex items-center space-x-2">
                <BookOpen size={28} className="text-blue-600"/>
                <span>Study Materials Library</span>
            </h3>
            <button 
                onClick={onClose} 
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Status Message Display */}
          {statusMessage.type && (
                <div className={`p-3 text-sm font-medium rounded-lg mb-4 ${statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} flex items-center space-x-2 transition-all duration-300`}>
                    {statusMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                    <span>{statusMessage.message}</span>
                </div>
            )}


          {/* Search and Upload Button */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search materials by title or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
            <button 
                onClick={() => setIsUploading(prev => !prev)}
                className={`bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 flex items-center space-x-2 rounded-xl font-semibold shadow-md transition-colors ${isUploading ? 'bg-red-500 hover:bg-red-600' : ''}`}
            >
              <Upload size={20} />
              <span>{isUploading ? 'Cancel Upload' : 'Upload Material'}</span>
            </button>
          </div>

          
          {/* Categories (Filtering) */}
          {!isUploading && (
            <div className="flex flex-wrap gap-2 mb-6">
                <span className='text-sm font-bold text-gray-700 py-1.5'>Filter:</span>
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                    activeCategory === category
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-300/50'
                      : 'bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

        </div>
        
        {/* Content Area (Scrollable) */}
        <div className="px-6 pb-6 overflow-y-auto flex-1 custom-scrollbar">

          {/* Upload Form Modal (Conditional Rendering) */}
          {isUploading ? (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-6 border border-green-200 shadow-lg">
                <form onSubmit={handleUploadSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={uploadFormData.title}
                            onChange={(e) => setUploadFormData({...uploadFormData, title: e.target.value})}
                            placeholder="e.g., Quantum Physics Cheat Sheet"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Subject/Category</label>
                        <select
                            value={uploadFormData.subject}
                            onChange={(e) => setUploadFormData({...uploadFormData, subject: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                        >
                            <option value="">-- Select a Subject --</option>
                            {CATEGORIES.slice(1).map(cat => ( // Exclude 'All'
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* File Drop/Selection Area */}
                    <div className="border-2 border-dashed border-green-400 bg-white rounded-xl p-6 text-center hover:bg-green-50 transition-colors">
                        <input
                            type="file"
                            id="file-upload"
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".pdf,.doc,.docx,.txt"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer block">
                            <Upload className="mx-auto text-green-500 mb-2" size={32} />
                            {uploadFormData.file ? (
                                <p className="text-sm text-green-700 font-bold">{uploadFormData.file.name}</p>
                            ) : (
                                <>
                                    <p className="text-sm text-gray-600 mb-2">Drag and drop file here or</p>
                                    <span className="inline-flex bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md">
                                        Browse Files
                                    </span>
                                </>
                            )}
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={!uploadFormData.title.trim() || !uploadFormData.subject || !uploadFormData.file}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 font-semibold rounded-xl mt-4 transition-colors disabled:opacity-50"
                    >
                        Publish Material
                    </button>
                </form>
            </div>
          ) : (
            
            /* Materials Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMaterials.length > 0 ? (
                filteredMaterials.map((material) => (
                  <div key={material.id} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 shadow-md hover:shadow-lg transition-all border border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0 pr-3">
                        <h4 className="font-bold text-gray-800 mb-1 text-lg truncate">{material.title}</h4>
                        <p className="text-sm text-gray-600 font-medium">{material.subject}</p>
                      </div>
                      <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold flex-shrink-0">
                        {material.type}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-end justify-between pt-2 border-t border-gray-200">
                      <div className="text-sm text-gray-500 mb-3 sm:mb-0">
                        <p>By <span className='font-medium'>{material.author}</span></p>
                        <p className='flex items-center space-x-1'>
                            <Download size={14} className='text-green-500' />
                            <span>{material.downloads} downloads</span>
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                          {/* DELETE BUTTON */}
                          <button 
                              onClick={() => handleDelete(material)}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                              title="Delete this material"
                          >
                              <Trash2 size={16} />
                          </button>
                          
                          {/* Download Button */}
                          <button 
                            onClick={() => handleDownload(material)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 flex items-center space-x-1 rounded-xl font-semibold shadow-lg transition-colors"
                          >
                            <Download size={16} />
                            <span>Download</span>
                          </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="md:col-span-2 text-center p-12 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                  <Book size={48} className='text-gray-400 mx-auto mb-4'/>
                  <p className="text-gray-600 font-medium">No materials found for "{searchTerm}" in the selected category. Try a different filter or upload a file to get started!</p>
                </div>
              )}
            </div>
          )}
          
        </div>

      </div>
    </div>
  );
};


// --- App Component for Demo ---

const App: React.FC = () => {
    const [isPanelOpen, setIsPanelOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-['Inter']">
            <style>{`
                /* Custom scrollbar for webkit browsers */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #94a3b8; /* slate-400 */
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f5f9; /* slate-100 */
                }
            `}</style>
            <h1 className="text-4xl font-black text-gray-800 mb-6">Study Materials Application Demo</h1>

            <button
                onClick={() => setIsPanelOpen(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105"
            >
                <BookOpen size={20} />
                <span>Open Materials Panel</span>
            </button>
            <p className="mt-4 text-gray-600">Click the button above to manage materials.</p>

            {isPanelOpen && (
                <MaterialsPanel
                    onClose={() => setIsPanelOpen(false)}
                />
            )}
        </div>
    );
};

export default App;
