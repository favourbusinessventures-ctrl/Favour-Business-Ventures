import React from 'react';

interface EditorialStatementProps {
  headline?: string;
  paragraph?: string;
  tag?: string;
  theme?: 'ivory' | 'sand' | 'dark-green';
}

export const EditorialStatement: React.FC<EditorialStatementProps> = ({
  headline = "THE INGREDIENTS BEHIND THE MEALS THAT MATTER.",
  paragraph = "Good meals begin with ingredients you can trust. We focus exclusively on stockfish and sun-dried crayfish—cleanly handled, carefully prepared, and ready for the everyday recipes and celebration meals you have in mind.",
  tag = "Standard of Quality",
  theme = 'ivory'
}) => {
  const isDark = theme === 'dark-green';
  const bgClass = isDark ? 'bg-[#071F16] text-[#F5F0E6] border-[#16382A]' : 'bg-[#F5F0E6] text-[#071F16] border-[#E5DEC9]';

  return (
    <section className={`py-20 sm:py-28 lg:py-32 ${bgClass} border-b`}>
      <div className="max-w-4xl mx-auto px-6 sm:px-10 text-center space-y-6">
        
        {/* Muted Brass Accent */}
        <div className="inline-flex items-center justify-center gap-3">
          <span className="w-6 h-[1.5px] bg-[#B8954A]" />
          <span className="text-[10px] font-sans-clean font-semibold uppercase tracking-[0.35em] text-[#B8954A]">
            {tag}
          </span>
          <span className="w-6 h-[1.5px] bg-[#B8954A]" />
        </div>

        {/* Large Serif Headline */}
        <h2 className={`font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight uppercase ${
          isDark ? 'text-[#F5F0E6]' : 'text-[#071F16]'
        }`}>
          "{headline}"
        </h2>

        {/* Supporting Paragraph */}
        {paragraph && (
          <p className={`text-base sm:text-lg lg:text-xl font-sans-clean font-light leading-relaxed max-w-2xl mx-auto pt-2 ${
            isDark ? 'text-[#F5F0E6]/80' : 'text-[#6B7266]'
          }`}>
            {paragraph}
          </p>
        )}

      </div>
    </section>
  );
};
