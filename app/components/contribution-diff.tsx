import { DiffLine } from "@/app/api/contributionService";

interface ContributionDiffProps {
  diffLines: DiffLine[];
}

export default function ContributionDiff({ diffLines }: ContributionDiffProps) {
  const getLineStyle = (type: number) => {
    switch (type) {
      case 0: // unchanged
        return "text-gray-700 bg-white";
      case 1: // added
        return "text-green-700 bg-green-50 border-l-4 border-green-500";
      case 2: // removed
        return "text-red-700 bg-red-50 border-l-4 border-red-500 line-through";
      default:
        return "";
    }
  };

  return (
    <div className="font-mono text-sm">
      {diffLines.map((line, index) => (
        <div
          key={index}
          className={`p-1 ${getLineStyle(line.type)}`}
        >
          {line.type === 1 && <span className="text-green-500 mr-2">+</span>}
          {line.type === 2 && <span className="text-red-500 mr-2">-</span>}
          {line.content || '\u00A0'} {/* Use non-breaking space for empty lines */}
        </div>
      ))}
    </div>
  );
} 