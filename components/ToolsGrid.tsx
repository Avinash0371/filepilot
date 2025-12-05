'use client';

import { useState, useMemo } from 'react';
import ToolCard from './ToolCard';
import { Icons, categoryIconMap } from './Icons';
import { tools, categories, Tool } from '@/lib/tools';

export default function ToolsGrid() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !selectedCategory || tool.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const groupedTools = useMemo(() => {
    const groups: Record<string, Tool[]> = {};

    for (const tool of filteredTools) {
      if (!groups[tool.category]) {
        groups[tool.category] = [];
      }
      groups[tool.category].push(tool);
    }

    return groups;
  }, [filteredTools]);

  // Helper function to get category icon
  const getCategoryIcon = (categoryId: string) => {
    const iconKey = categoryIconMap[categoryId];
    if (iconKey && Icons[iconKey]) {
      const IconComponent = Icons[iconKey];
      return <IconComponent className="w-4 h-4" />;
    }
    return null;
  };

  return (
    <div className="space-y-10">
      {/* Search and Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col gap-6">
          {/* Search Bar - Enhanced Visibility */}
          <div className="relative max-w-2xl mx-auto w-full">
            <Icons.Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" />
            <input
              type="text"
              placeholder="Search for tools (e.g., PDF to Word, Image Compressor)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-4 py-4 text-lg bg-slate-50 border-2 border-slate-300 rounded-2xl shadow-lg focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-200 focus:shadow-glow focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Category Filter - Horizontal Scroll on Mobile */}
          <div className="relative -mx-6 px-6 sm:mx-0 sm:px-0">
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all snap-start ${!selectedCategory
                  ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-200'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-brand-300 hover:bg-slate-50'
                  }`}
              >
                All Tools
              </button>
              {categories.map((category) => {
                const IconComponent = categoryIconMap[category.id] ? Icons[categoryIconMap[category.id]] : Icons.File;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 snap-start ${selectedCategory === category.id
                      ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-200'
                      : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-brand-300 hover:bg-slate-50'
                      }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      {Object.keys(groupedTools).length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <Icons.Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No tools found</h3>
          <p className="text-slate-500 text-sm mb-4">Try adjusting your search</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {categories.map((category) => {
            const categoryTools = groupedTools[category.id];
            if (!categoryTools || categoryTools.length === 0) return null;

            const IconComponent = categoryIconMap[category.id] ? Icons[categoryIconMap[category.id]] : Icons.File;

            return (
              <div key={category.id} className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-soft-md border border-slate-100 p-6 sm:p-8">
                {/* Category Header with Color-Coded Badge */}
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    {/* Color-Coded Icon Badge */}
                    <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${category.id === 'pdf' ? 'from-red-500 to-red-600' :
                        category.id === 'image' ? 'from-blue-500 to-blue-600' :
                          category.id === 'video' ? 'from-purple-500 to-purple-600' :
                            category.id === 'audio' ? 'from-pink-500 to-pink-600' :
                              category.id === 'archive' ? 'from-orange-500 to-orange-600' :
                                category.id === 'text' ? 'from-emerald-500 to-emerald-600' :
                                  'from-brand-500 to-brand-600'
                      } flex items-center justify-center shadow-md`}>
                      <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>

                    {/* Category Name & Count */}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 truncate">
                        {category.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        {categoryTools.length} {categoryTools.length === 1 ? 'tool' : 'tools'}
                      </p>
                    </div>
                  </div>

                  {/* Decorative Gradient Line */}
                  <div className={`h-1 rounded-full bg-gradient-to-r ${category.id === 'pdf' ? 'from-red-400 via-red-300 to-transparent' :
                      category.id === 'image' ? 'from-blue-400 via-blue-300 to-transparent' :
                        category.id === 'video' ? 'from-purple-400 via-purple-300 to-transparent' :
                          category.id === 'audio' ? 'from-pink-400 via-pink-300 to-transparent' :
                            category.id === 'archive' ? 'from-orange-400 via-orange-300 to-transparent' :
                              category.id === 'text' ? 'from-emerald-400 via-emerald-300 to-transparent' :
                                'from-brand-400 via-brand-300 to-transparent'
                    }`}></div>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryTools.map((tool, index) => (
                    <div key={tool.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                      <ToolCard name={tool.title} description={tool.description} icon={tool.icon} href={tool.href} category={tool.category} supportedFormats={tool.supportedFormats} maxFileSize={tool.maxFileSize} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
