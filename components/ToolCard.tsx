'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/Icons';

interface ToolCardProps {
  name: string;
  description: string;
  icon: keyof typeof Icons;
  href: string;
  category: string;
  supportedFormats?: string[];
  maxFileSize?: string;
}

export default function ToolCard({
  name,
  description,
  icon: iconName,
  href,
  category,
  supportedFormats,
  maxFileSize
}: ToolCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const fileData = files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
      }));
      sessionStorage.setItem('draggedFiles', JSON.stringify(fileData));
      sessionStorage.setItem('draggedFilesObjects', 'pending');
      router.push(href);
    }
  };

  return (
    <Link
      href={href}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group relative block p-6 sm:p-8 bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-soft-xl hover:-translate-y-1 ${isDragging
        ? 'border-brand-500 bg-brand-50 shadow-soft-xl scale-105'
        : 'border-slate-200 hover:border-brand-300'
        }`}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-brand-500/10 rounded-2xl flex items-center justify-center pointer-events-none z-10">
          <div className="text-center">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-brand-600 mx-auto mb-2 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-brand-700 font-semibold text-sm sm:text-base">Drop to convert</p>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 px-3 py-1 bg-brand-100 text-brand-700 text-xs font-semibold rounded-full">
        {category}
      </div>

      <div className="w-14 h-14 sm:w-16 sm:h-16 mb-4 sm:mb-6 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-soft group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
        {Icons[iconName] && React.createElement(Icons[iconName], { className: "w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" })}
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3 group-hover:text-brand-600 transition-colors">
        {name}
      </h3>
      <p className="text-sm sm:text-base text-slate-600 mb-4 leading-relaxed line-clamp-2">
        {description}
      </p>

      {(supportedFormats || maxFileSize) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {supportedFormats && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium">{supportedFormats.join(', ')}</span>
            </div>
          )}
          {maxFileSize && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              <span className="font-medium">Max {maxFileSize}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center text-brand-600 font-semibold text-sm group-hover:gap-2 transition-all">
        <span>Convert Now</span>
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
