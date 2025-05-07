import React from "react";

function Articles({ title, description, link, Image }) {
  return (
    <div className="bg-gray-100 overflow-hidden rounded-lg shadow-xl flex flex-col md:flex-row max-w-3xl">
      {/* Image Section - Left on desktop, top on mobile */}
      <div className="w-full md:w-2/5 bg-indigo-100 relative">
        <img 
          src={Image} 
          alt={title}
          className="object-cover w-full h-48 md:h-full"
        />
        <div className="absolute top-0 left-0 bg-indigo-600 text-white px-3 py-1 text-sm font-medium">
          Featured
        </div>
      </div>
      
      {/* Content Section - Right on desktop, bottom on mobile */}
      <div className="w-full md:w-3/5 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">{title}</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
        </div>
        
        <div className="mt-4">
          <a 
            href={link} 
            target="_blank" 
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-full transition-colors duration-300"
          >
            Read Article
          </a>
        </div>
      </div>
    </div>
  );
}

export default Articles;