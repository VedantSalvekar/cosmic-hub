import React from 'react';

const Footer = () => {
  return (
    <footer className="text-center text-white/60 text-sm py-4 backdrop-blur-lg bg-black/40 relative z-20">
      <p>
        Built with curiosity and caffeine — powered by <span className="text-purple-300 font-semibold">NASA APIs</span> 
      </p>
      <p className="mt-1 text-xs text-white/40">
        &copy; {new Date().getFullYear()} Cosmic Hub. All planets aligned.
      </p>
    </footer>
  );
};

export default Footer; 